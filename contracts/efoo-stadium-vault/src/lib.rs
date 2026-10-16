#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, Clone)]
pub struct NftListing<M: ManagedTypeApi> {
    pub seller: ManagedAddress<M>,
    pub nft_token_id: TokenIdentifier<M>,
    pub nft_nonce: u64,
    pub price_efoo: BigUint<M>,
}

/// MultiversX Smart Contract for EFOO Stadium Vault & P2P Marketplace
/// - Defeat Streak Revive (50k EFOO: 50% Burned, 50% to Vault)
/// - Round Retry (25k EFOO: 50% Burned, 50% to Vault)
/// - Weekend Jackpot Distribution: 65% (1st) / 25% (2nd) / 10% (3rd) with Rollover
/// - Verifiable Deflationary Supply Burning (ESDTLocalBurn or unspendable dead address)
/// - On-chain P2P NFT Escrow & Marketplace
#[multiversx_sc::contract]
pub trait EfooStadiumVault {
    #[init]
    fn init(
        &self,
        efoo_token_id: TokenIdentifier,
        burn_address: ManagedAddress,
    ) {
        self.efoo_token_id().set(&efoo_token_id);
        self.burn_address().set(&burn_address);

        // 18 decimals factor
        let factor = BigUint::from(10u64).pow(18);

        // 50,000 $EFOO Revive Streak & Advance Fee
        let revive_advance_fee = BigUint::from(50_000u64) * &factor;
        self.revive_advance_fee().set(&revive_advance_fee);

        // 25,000 $EFOO Retry Round Fee
        let retry_round_fee = BigUint::from(25_000u64) * &factor;
        self.retry_round_fee().set(&retry_round_fee);

        // Initial Total Burned Counter
        let initial_burned = BigUint::from(92_912_450_000u64) * &factor;
        self.total_burned_games().set(&initial_burned);

        // Circuit breaker starts unpaused
        self.is_paused().set(false);
    }

    // =========================================================================
    // GAMEPLAY ENDPOINTS: STREAK REVIVE & ROUND RETRY (50% BURN / 50% VAULT)
    // =========================================================================

    /// Option 1: Revive Win Streak & Advance to Next Round (50,000 $EFOO)
    /// 50% is burned forever, 50% added to Stadium Vault Jackpot
    #[payable("*")]
    #[endpoint(reviveStreakAndAdvance)]
    fn revive_streak_and_advance(&self) {
        self.require_not_paused();
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid payment token");
        require!(
            payment >= self.revive_advance_fee().get(),
            "Insufficient payment: 50,000 $EFOO required"
        );

        let half_vault = &payment / 2u32;
        let half_burn = &payment - &half_vault;

        // 50% added to the Stadium Vault Jackpot
        self.vault_pot_balance().update(|pot| *pot += &half_vault);

        // 50% burned forever
        self.execute_burn(&half_burn);
    }

    /// Option 2: Retry Current Round (25,000 $EFOO)
    /// 50% is burned forever, 50% added to Stadium Vault Jackpot. Streak is protected.
    #[payable("*")]
    #[endpoint(retryCurrentRound)]
    fn retry_current_round(&self) {
        self.require_not_paused();
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid payment token");
        require!(
            payment >= self.retry_round_fee().get(),
            "Insufficient payment: 25,000 $EFOO required"
        );

        let half_vault = &payment / 2u32;
        let half_burn = &payment - &half_vault;

        // 50% added to the Stadium Vault Jackpot
        self.vault_pot_balance().update(|pot| *pot += &half_vault);

        // 50% burned forever
        self.execute_burn(&half_burn);
    }

    /// Internal burning logic:
    /// 1. Updates global total_burned_games telemetry counter
    /// 2. Executes verifiable on-chain ESDT supply burn using ESDTRoleLocalBurn
    fn execute_burn(&self, burn_amount: &BigUint) {
        let token_id = self.efoo_token_id().get();
        self.total_burned_games().update(|val| *val += burn_amount);

        // Physically burns the $EFOO supply on MultiversX ledger
        // Requires ESDTRoleLocalBurn granted to this Smart Contract address
        self.send().esdt_local_burn(&token_id, 0, burn_amount);
    }

    // =========================================================================
    // EMERGENCY CIRCUIT BREAKER (PAUSE / UNPAUSE)
    // =========================================================================

    #[only_owner]
    #[endpoint(pauseContract)]
    fn pause_contract(&self) {
        self.is_paused().set(true);
    }

    #[only_owner]
    #[endpoint(unpauseContract)]
    fn unpause_contract(&self) {
        self.is_paused().set(false);
    }

    fn require_not_paused(&self) {
        if !self.is_paused().is_empty() {
            require!(!self.is_paused().get(), "Smart contract is currently paused");
        }
    }

    // =========================================================================
    // WEEKEND VAULT JACKPOT DISTRIBUTION: 65% (1st) / 25% (2nd) / 10% (3rd)
    // =========================================================================

    /// Called every weekend to payout top leaderboard players:
    /// - 1 player: receives 65%, 35% rolls over in the vault.
    /// - 2 players: 1st receives 65%, 2nd receives 25%, 10% rolls over.
    /// - 3 players: 1st receives 65%, 2nd receives 25%, 3rd receives 10%.
    #[only_owner]
    #[endpoint(distributeWeekendVault)]
    fn distribute_weekend_vault(
        &self,
        first_place: ManagedAddress,
        opt_second_place: OptionalValue<ManagedAddress>,
        opt_third_place: OptionalValue<ManagedAddress>,
    ) {
        let total_pool = self.vault_pot_balance().get();
        require!(total_pool > 0, "No vault pot balance to distribute");

        let token_id = self.efoo_token_id().get();

        // 65% for 1st Place
        let share_first = (&total_pool * 65u32) / 100u32;
        let mut total_distributed = share_first.clone();

        self.send().direct_esdt(&first_place, &token_id, 0, &share_first);

        // 25% for 2nd Place (if present)
        if let OptionalValue::Some(second_place) = opt_second_place {
            let share_second = (&total_pool * 25u32) / 100u32;
            total_distributed += &share_second;
            self.send().direct_esdt(&second_place, &token_id, 0, &share_second);
        }

        // 10% for 3rd Place (if present)
        if let OptionalValue::Some(third_place) = opt_third_place {
            let share_third = (&total_pool * 10u32) / 100u32;
            total_distributed += &share_third;
            self.send().direct_esdt(&third_place, &token_id, 0, &share_third);
        }

        // Remainder stays in the vault as rollover
        let rollover = &total_pool - &total_distributed;
        self.vault_pot_balance().set(&rollover);
    }

    // =========================================================================
    // P2P NFT MARKETPLACE (LIST, BUY, DELIST, EDIT PRICE)
    // =========================================================================

    /// Seller lists their owned Striker or Goalkeeper NFT for sale in $EFOO
    #[payable("*")]
    #[endpoint(listNft)]
    fn list_nft(&self, price_efoo: BigUint) {
        self.require_not_paused();
        require!(price_efoo > 0, "Price must be greater than 0");
        let caller = self.blockchain().get_caller();
        let (token_id, nonce, amount) = self.call_value().single_esdt();
        require!(amount == 1, "Only 1 NFT can be listed per call");

        let listing = NftListing {
            seller: caller,
            nft_token_id: token_id.clone(),
            nft_nonce: nonce,
            price_efoo,
        };

        self.nft_listings(&token_id, nonce).set(&listing);
    }

    /// Buyer purchases listed NFT using $EFOO.
    /// Checks-Effects-Interactions (CEI) compliant: state is cleared prior to transfers.
    /// 99% sent to seller, 0.5% burned forever, 0.5% sent to Stadium Vault.
    #[payable("*")]
    #[endpoint(buyNft)]
    fn buy_nft(&self, nft_token_id: TokenIdentifier, nft_nonce: u64) {
        self.require_not_paused();
        let (payment_token, payment_amount) = self.call_value().single_fungible_esdt();
        require!(payment_token == self.efoo_token_id().get(), "Payment must be in $EFOO");

        require!(
            !self.nft_listings(&nft_token_id, nft_nonce).is_empty(),
            "NFT listing not found"
        );

        let listing = self.nft_listings(&nft_token_id, nft_nonce).get();
        require!(payment_amount >= listing.price_efoo, "Insufficient $EFOO paid");

        let buyer = self.blockchain().get_caller();

        // 1% platform fee (0.5% burned, 0.5% to stadium vault)
        let fee_vault = (&listing.price_efoo * 5u32) / 1000u32;
        let fee_burn = (&listing.price_efoo * 5u32) / 1000u32;
        let seller_payout = &listing.price_efoo - &fee_vault - &fee_burn;

        // CEI Pattern: Clear listing state BEFORE transferring funds or NFTs
        self.nft_listings(&nft_token_id, nft_nonce).clear();

        // Payout seller
        self.send().direct_esdt(&listing.seller, &payment_token, 0, &seller_payout);

        // Add 0.5% to stadium vault
        self.vault_pot_balance().update(|p| *p += &fee_vault);

        // Burn 0.5%
        self.execute_burn(&fee_burn);

        // Refund any excess payment to buyer
        let excess = &payment_amount - &listing.price_efoo;
        if excess > 0 {
            self.send().direct_esdt(&buyer, &payment_token, 0, &excess);
        }

        // Transfer NFT to buyer
        self.send().direct_esdt(&buyer, &listing.nft_token_id, listing.nft_nonce, &BigUint::from(1u32));
    }

    /// Owner delists/withdraws their listed NFT back to their wallet
    #[endpoint(delistNft)]
    fn delist_nft(&self, nft_token_id: TokenIdentifier, nft_nonce: u64) {
        let caller = self.blockchain().get_caller();
        require!(
            !self.nft_listings(&nft_token_id, nft_nonce).is_empty(),
            "NFT listing not found"
        );

        let listing = self.nft_listings(&nft_token_id, nft_nonce).get();
        require!(listing.seller == caller, "Only listing seller can delist");

        // CEI Pattern: Clear state before transfer
        self.nft_listings(&nft_token_id, nft_nonce).clear();

        // Return NFT to seller
        self.send().direct_esdt(&caller, &listing.nft_token_id, listing.nft_nonce, &BigUint::from(1u32));
    }

    /// Owner updates price of their active listing
    #[endpoint(updateListingPrice)]
    fn update_listing_price(&self, nft_token_id: TokenIdentifier, nft_nonce: u64, new_price: BigUint) {
        let caller = self.blockchain().get_caller();
        require!(new_price > 0, "Price must be greater than 0");
        require!(
            !self.nft_listings(&nft_token_id, nft_nonce).is_empty(),
            "NFT listing not found"
        );

        let mut listing = self.nft_listings(&nft_token_id, nft_nonce).get();
        require!(listing.seller == caller, "Only listing seller can update price");

        listing.price_efoo = new_price;
        self.nft_listings(&nft_token_id, nft_nonce).set(&listing);
    }

    // =========================================================================
    // STORAGE & VIEWS
    // =========================================================================
    #[view(getEfooTokenId)]
    #[storage_mapper("efooTokenId")]
    fn efoo_token_id(&self) -> SingleValueMapper<TokenIdentifier>;

    #[view(getBurnAddress)]
    #[storage_mapper("burnAddress")]
    fn burn_address(&self) -> SingleValueMapper<ManagedAddress>;

    #[view(getVaultPotBalance)]
    #[storage_mapper("vaultPotBalance")]
    fn vault_pot_balance(&self) -> SingleValueMapper<BigUint>;

    #[view(getTotalBurnedGames)]
    #[storage_mapper("totalBurnedGames")]
    fn total_burned_games(&self) -> SingleValueMapper<BigUint>;

    #[view(getReviveAdvanceFee)]
    #[storage_mapper("reviveAdvanceFee")]
    fn revive_advance_fee(&self) -> SingleValueMapper<BigUint>;

    #[view(getRetryRoundFee)]
    #[storage_mapper("retryRoundFee")]
    fn retry_round_fee(&self) -> SingleValueMapper<BigUint>;

    #[view(getNftListing)]
    #[storage_mapper("nftListings")]
    fn nft_listings(&self, token_id: &TokenIdentifier, nonce: u64) -> SingleValueMapper<NftListing<Self::Api>>;

    #[view(isPaused)]
    #[storage_mapper("isPaused")]
    fn is_paused(&self) -> SingleValueMapper<bool>;
}
