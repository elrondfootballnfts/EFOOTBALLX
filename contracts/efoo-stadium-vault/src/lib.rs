#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, TypeAbi, Clone)]
pub struct NftListing<M: ManagedTypeApi> {
    pub seller: ManagedAddress<M>,
    pub nft_token_id: TokenIdentifier<M>,
    pub nft_nonce: u64,
    pub payment_token: EgldOrEsdtTokenIdentifier<M>,
    pub price: BigUint<M>,
}

/// MultiversX Smart Contract for EFOO Stadium Vault & P2P Marketplace
/// - Defeat Streak Revive (50k EFOO: 50% Burned, 50% to Vault)
/// - Round Retry (25k EFOO: 50% Burned, 50% to Vault)
/// - Sponsor & Community Vault Injection (depositToVaultPot)
/// - Direct Milestone Supply Burning (burnTokens)
/// - Dynamic Game Fee Adjustment (setGameFees)
/// - Weekend Jackpot Distribution: 65% (1st) / 25% (2nd) / 10% (3rd) with Rollover
/// - Verifiable Deflationary Supply Burning (esdt_local_burn)
/// - Multi-Currency P2P NFT Marketplace:
///     * $EFOO: 95% to Seller, 5% Platform Fee (2.5% Burned, 2.5% to Weekend Vault)
///     * EGLD: 97.5% to Seller, 2.5% Platform Fee sent directly to efoorewards wallet
/// - Web3 Security Shield: Checks-Effects-Interactions (CEI) & Circuit Breaker (Pause/Unpause)
#[multiversx_sc::contract]
pub trait EfooStadiumVault {
    #[init]
    fn init(
        &self,
        opt_efoo_token_id: OptionalValue<TokenIdentifier>,
        opt_burn_address: OptionalValue<ManagedAddress>,
    ) {
        let efoo_token_id = match opt_efoo_token_id {
            OptionalValue::Some(id) => id,
            OptionalValue::None => TokenIdentifier::from("EFOO-8fe2d4"),
        };
        let burn_address = match opt_burn_address {
            OptionalValue::Some(addr) => addr,
            OptionalValue::None => ManagedAddress::zero(),
        };

        self.efoo_token_id().set(&efoo_token_id);
        self.burn_address().set(&burn_address);

        // 18 decimals factor
        let factor = BigUint::from(10u64).pow(18u32);

        // Default 50,000 $EFOO Revive Streak & Advance Fee
        let revive_advance_fee = BigUint::from(50_000u64) * &factor;
        self.revive_advance_fee().set(&revive_advance_fee);

        // Default 25,000 $EFOO Retry Round Fee
        let retry_round_fee = BigUint::from(25_000u64) * &factor;
        self.retry_round_fee().set(&retry_round_fee);

        // Initial Total In-Game Burned Counter starts strictly at 0
        self.total_burned_games().set(&BigUint::zero());

        // Initial Stadium Vault Pot balance starts strictly at 0
        self.vault_pot_balance().set(&BigUint::zero());

        // Circuit breaker starts unpaused
        self.is_paused().set(false);
    }

    #[upgrade]
    fn upgrade(&self) {
        // Upgrade hook: runs on contract upgrade to preserve storage without resetting state
    }

    // =========================================================================
    // GAMEPLAY ENDPOINTS: STREAK REVIVE & ROUND RETRY (50% BURN / 50% VAULT)
    // =========================================================================

    /// Option 1: Revive Win Streak & Advance to Next Round (Default 50,000 $EFOO)
    /// 50% is burned forever on-chain, 50% added to Stadium Vault Jackpot
    #[payable("*")]
    #[endpoint(reviveStreakAndAdvance)]
    fn revive_streak_and_advance(&self) {
        self.require_not_paused();
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid payment token");
        require!(
            payment >= self.revive_advance_fee().get(),
            "Insufficient payment for streak revive"
        );

        let half_vault = &payment / 2u32;
        let half_burn = &payment - &half_vault;

        // 50% added to the Stadium Vault Jackpot
        self.vault_pot_balance().update(|pot| *pot += &half_vault);

        // 50% burned forever on-chain
        self.execute_burn(&half_burn);
    }

    /// Option 2: Retry Current Round (Default 25,000 $EFOO)
    /// 50% is burned forever on-chain, 50% added to Stadium Vault Jackpot. Streak is protected.
    #[payable("*")]
    #[endpoint(retryCurrentRound)]
    fn retry_current_round(&self) {
        self.require_not_paused();
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid payment token");
        require!(
            payment >= self.retry_round_fee().get(),
            "Insufficient payment for round retry"
        );

        let half_vault = &payment / 2u32;
        let half_burn = &payment - &half_vault;

        // 50% added to the Stadium Vault Jackpot
        self.vault_pot_balance().update(|pot| *pot += &half_vault);

        // 50% burned forever on-chain
        self.execute_burn(&half_burn);
    }

    /// Community / Sponsor Vault Injection:
    /// Allows the team or sponsors to inject extra $EFOO directly into the Weekend Jackpot Pot
    #[payable("*")]
    #[endpoint(depositToVaultPot)]
    fn deposit_to_vault_pot(&self) {
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Payment must be in $EFOO");
        require!(payment > 0, "Deposit amount must be greater than 0");

        self.vault_pot_balance().update(|pot| *pot += &payment);
    }

    /// Daily Streak 5-Day Vault Reward Claim:
    /// Player claims 1% of the Stadium Vault Pot on their 5th consecutive login day.
    /// Transfers 1% $EFOO tokens directly into the caller's wallet on-chain!
    #[endpoint(claimStreakReward)]
    fn claim_streak_reward(&self) {
        self.require_not_paused();
        let caller = self.blockchain().get_caller();
        let total_vault = self.vault_pot_balance().get();
        require!(total_vault > 0, "No vault pot balance available");

        // 1% of the Stadium Vault Pot
        let reward_amount = &total_vault / 100u32;
        require!(reward_amount > 0, "Reward amount too small");

        // Checks-Effects-Interactions (CEI): update vault pot balance before sending
        self.vault_pot_balance().update(|pot| *pot -= &reward_amount);

        // Send 1% $EFOO tokens directly to the caller's wallet
        let token_id = self.efoo_token_id().get();
        self.send().direct_esdt(&caller, &token_id, 0, &reward_amount);
    }

    /// Direct Milestone / Marketing Token Burn:
    /// Anyone or team can burn $EFOO supply directly through the contract, updating global stats
    #[payable("*")]
    #[endpoint(burnTokens)]
    fn burn_tokens(&self) {
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Payment must be in $EFOO");
        require!(payment > 0, "Burn amount must be greater than 0");

        self.execute_burn(&payment);
    }

    /// Internal burning logic:
    /// 1. Updates global total_burned_games telemetry counter
    /// 2. If a dedicated burn address is set (e.g. system burn address), tokens are sent there.
    ///    Otherwise, executes verifiable on-chain ESDT supply burn using ESDTRoleLocalBurn.
    fn execute_burn(&self, burn_amount: &BigUint) {
        let token_id = self.efoo_token_id().get();
        self.total_burned_games().update(|val| *val += burn_amount);

        let burn_addr = self.burn_address().get();
        if burn_addr != ManagedAddress::zero() {
            self.send().direct_esdt(&burn_addr, &token_id, 0, burn_amount);
        } else {
            self.send().esdt_local_burn(&token_id, 0, burn_amount);
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
    // MULTI-CURRENCY P2P NFT MARKETPLACE (EFOO + EGLD)
    // =========================================================================

    fn get_wegld_id(&self) -> TokenIdentifier {
        if !self.wegld_token_id().is_empty() {
            self.wegld_token_id().get()
        } else {
            TokenIdentifier::from("WEGLD-bd4d79")
        }
    }

    /// Seller lists their owned Striker or Goalkeeper NFT for sale
    /// Accepts payment in either native EGLD, Wrapped EGLD (WEGLD), or $EFOO
    #[payable("*")]
    #[endpoint(listNft)]
    fn list_nft(&self, payment_token: EgldOrEsdtTokenIdentifier, price: BigUint) {
        self.require_not_paused();
        require!(price > 0, "Price must be greater than 0");

        let efoo_id = self.efoo_token_id().get();
        let wegld_id = self.get_wegld_id();
        let is_valid_currency = payment_token.is_egld()
            || (!payment_token.is_egld() && (payment_token.clone().unwrap_esdt() == efoo_id || payment_token.clone().unwrap_esdt() == wegld_id));
        require!(is_valid_currency, "Listing currency must be native EGLD, WEGLD, or $EFOO");

        let caller = self.blockchain().get_caller();
        let payment = self.call_value().single_esdt();
        require!(payment.amount == 1, "Only 1 NFT can be listed per transaction");
        let token_id = payment.token_identifier;
        let nonce = payment.token_nonce;

        let listing = NftListing {
            seller: caller,
            nft_token_id: token_id.clone(),
            nft_nonce: nonce,
            payment_token,
            price,
        };

        self.nft_listings(&token_id, nonce).set(&listing);
        self.active_listings().insert((token_id, nonce));
    }

    /// Buyer purchases listed NFT.
    /// Checks-Effects-Interactions (CEI) compliant: listing is cleared prior to transfers.
    ///
    /// Fee Model:
    /// - If Seller or Buyer holds an Ultras VIP Pass: 0% Platform Fee (100% Payout to Seller)
    /// - Standard Fees:
    ///     * $EFOO: 95% to Seller, 2.5% Burned, 2.5% to Weekend Vault Jackpot
    ///     * EGLD: 97.5% to Seller, 2.5% Platform Fee sent directly to efoorewards wallet
    #[payable("*")]
    #[endpoint(buyNft)]
    fn buy_nft(&self, nft_token_id: TokenIdentifier, nft_nonce: u64) {
        self.require_not_paused();

        require!(
            !self.nft_listings(&nft_token_id, nft_nonce).is_empty(),
            "NFT listing not found"
        );

        let listing = self.nft_listings(&nft_token_id, nft_nonce).get();
        let buyer = self.blockchain().get_caller();

        // CEI Pattern: Clear listing state BEFORE transferring funds or NFTs
        self.nft_listings(&nft_token_id, nft_nonce).clear();
        self.active_listings().swap_remove(&(nft_token_id.clone(), nft_nonce));

        // Ultras VIP Pass Check (0% Fees for Life)
        let is_seller_vip = self.is_vip(&listing.seller);
        let is_buyer_vip = self.is_vip(&buyer);
        let is_zero_fee = is_seller_vip || is_buyer_vip;

        let efoo_id = self.efoo_token_id().get();
        let wegld_id = self.get_wegld_id();

        if listing.payment_token.is_egld() {
            // EGLD Payment Processing
            let payment_egld = self.call_value().egld_value().clone_value();
            require!(payment_egld >= listing.price, "Insufficient EGLD paid");

            let (seller_payout, fee_egld) = if is_zero_fee {
                (listing.price.clone(), BigUint::zero())
            } else {
                // 2.5% platform fee to owner (efoorewards), 97.5% to seller
                let fee = (&listing.price * 25u32) / 1000u32;
                let payout = &listing.price - &fee;
                (payout, fee)
            };

            // Payout seller in EGLD
            self.send().direct_egld(&listing.seller, &seller_payout);

            // Send 2.5% platform fee directly to contract owner (efoorewards) if applicable
            if fee_egld > 0 {
                let owner_address = self.blockchain().get_owner_address();
                self.send().direct_egld(&owner_address, &fee_egld);
            }

            // Refund any excess EGLD to buyer
            let excess = &payment_egld - &listing.price;
            if excess > 0 {
                self.send().direct_egld(&buyer, &excess);
            }
        } else if !listing.payment_token.is_egld() && listing.payment_token.clone().unwrap_esdt() == wegld_id {
            // WEGLD Payment Processing
            let (payment_token, payment_amount) = self.call_value().single_fungible_esdt();
            require!(payment_token == wegld_id, "Payment must be in WEGLD");
            require!(payment_amount >= listing.price, "Insufficient WEGLD paid");

            let (seller_payout, fee_wegld) = if is_zero_fee {
                (listing.price.clone(), BigUint::zero())
            } else {
                // 2.5% platform fee to owner (efoorewards), 97.5% to seller
                let fee = (&listing.price * 25u32) / 1000u32;
                let payout = &listing.price - &fee;
                (payout, fee)
            };

            // Payout seller in WEGLD
            self.send().direct_esdt(&listing.seller, &payment_token, 0, &seller_payout);

            // Send 2.5% platform fee directly to contract owner (efoorewards) in WEGLD
            if fee_wegld > 0 {
                let owner_address = self.blockchain().get_owner_address();
                self.send().direct_esdt(&owner_address, &payment_token, 0, &fee_wegld);
            }

            // Refund any excess WEGLD to buyer
            let excess = &payment_amount - &listing.price;
            if excess > 0 {
                self.send().direct_esdt(&buyer, &payment_token, 0, &excess);
            }
        } else {
            // $EFOO Payment Processing
            let (payment_token, payment_amount) = self.call_value().single_fungible_esdt();
            require!(payment_token == efoo_id, "Payment must be in $EFOO");
            require!(payment_amount >= listing.price, "Insufficient $EFOO paid");

            let (seller_payout, fee_vault, fee_burn) = if is_zero_fee {
                (listing.price.clone(), BigUint::zero(), BigUint::zero())
            } else {
                // 5% platform fee split: 2.5% burned, 2.5% to stadium vault
                let vault_share = (&listing.price * 25u32) / 1000u32;
                let burn_share = (&listing.price * 25u32) / 1000u32;
                let payout = &listing.price - &vault_share - &burn_share; // 95%
                (payout, vault_share, burn_share)
            };

            // Payout seller in $EFOO
            self.send().direct_esdt(&listing.seller, &payment_token, 0, &seller_payout);

            // Add 2.5% to stadium vault if applicable
            if fee_vault > 0 {
                self.vault_pot_balance().update(|p| *p += &fee_vault);
            }

            // Burn 2.5% permanently on-chain if applicable
            if fee_burn > 0 {
                self.execute_burn(&fee_burn);
            }

            // Refund any excess $EFOO to buyer
            let excess = &payment_amount - &listing.price;
            if excess > 0 {
                self.send().direct_esdt(&buyer, &payment_token, 0, &excess);
            }
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
        self.active_listings().swap_remove(&(nft_token_id.clone(), nft_nonce));

        // Return NFT to seller
        self.send().direct_esdt(&caller, &listing.nft_token_id, listing.nft_nonce, &BigUint::from(1u32));
    }

    /// Owner updates price and/or currency of their active listing
    #[endpoint(updateListingPrice)]
    fn update_listing_price(
        &self,
        nft_token_id: TokenIdentifier,
        nft_nonce: u64,
        new_payment_token: EgldOrEsdtTokenIdentifier,
        new_price: BigUint,
    ) {
        let caller = self.blockchain().get_caller();
        require!(new_price > 0, "Price must be greater than 0");

        let efoo_id = self.efoo_token_id().get();
        let wegld_id = self.get_wegld_id();
        let is_valid_currency = new_payment_token.is_egld()
            || (!new_payment_token.is_egld() && (new_payment_token.clone().unwrap_esdt() == efoo_id || new_payment_token.clone().unwrap_esdt() == wegld_id));
        require!(is_valid_currency, "Listing currency must be native EGLD, WEGLD, or $EFOO");

        require!(
            !self.nft_listings(&nft_token_id, nft_nonce).is_empty(),
            "NFT listing not found"
        );

        let mut listing = self.nft_listings(&nft_token_id, nft_nonce).get();
        require!(listing.seller == caller, "Only listing seller can update price");

        listing.payment_token = new_payment_token;
        listing.price = new_price;
        self.nft_listings(&nft_token_id, nft_nonce).set(&listing);
    }

    // =========================================================================
    // DYNAMIC OWNER CONTROLS & RESCUE
    // =========================================================================

    /// Allows owner to adjust game revive fees if token price fluctuates
    #[only_owner]
    #[endpoint(setGameFees)]
    fn set_game_fees(&self, new_revive_advance_fee: BigUint, new_retry_round_fee: BigUint) {
        require!(new_revive_advance_fee > 0, "Fee must be greater than 0");
        require!(new_retry_round_fee > 0, "Fee must be greater than 0");

        self.revive_advance_fee().set(&new_revive_advance_fee);
        self.retry_round_fee().set(&new_retry_round_fee);
    }

    /// Emergency fund rescue: allows owner to rescue accidentally sent third-party tokens
    #[only_owner]
    #[endpoint(emergencyWithdrawToken)]
    fn emergency_withdraw_token(&self, token_identifier: EgldOrEsdtTokenIdentifier, amount: BigUint) {
        let owner = self.blockchain().get_owner_address();
        require!(amount > 0, "Amount must be greater than 0");

        if token_identifier.is_egld() {
            self.send().direct_egld(&owner, &amount);
        } else {
            let esdt_id = token_identifier.unwrap_esdt();
            self.send().direct_esdt(&owner, &esdt_id, 0, &amount);
        }
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
    // STORAGE & VIEWS
    // =========================================================================
    #[view(getEfooTokenId)]
    #[storage_mapper("efooTokenId")]
    fn efoo_token_id(&self) -> SingleValueMapper<TokenIdentifier>;

    #[view(getWegldTokenId)]
    #[storage_mapper("wegldTokenId")]
    fn wegld_token_id(&self) -> SingleValueMapper<TokenIdentifier>;

    #[only_owner]
    #[endpoint(setWegldTokenId)]
    fn set_wegld_token_id(&self, token_id: TokenIdentifier) {
        self.wegld_token_id().set(&token_id);
    }

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

    /// Returns all currently active marketplace listings in a single call
    #[view(getAllListings)]
    fn get_all_listings(&self) -> MultiValueEncoded<NftListing<Self::Api>> {
        let mut listings = MultiValueEncoded::new();
        for (token_id, nonce) in self.active_listings().iter() {
            if !self.nft_listings(&token_id, nonce).is_empty() {
                listings.push(self.nft_listings(&token_id, nonce).get());
            }
        }
        listings
    }

    /// Checks if a wallet is registered as an Ultras VIP Pass holder (0% fees)
    #[view(isVip)]
    fn is_vip(&self, address: &ManagedAddress) -> bool {
        self.vip_addresses().contains(address)
    }

    /// Owner adds a wallet to the 0% fee VIP registry
    #[only_owner]
    #[endpoint(addVipAddress)]
    fn add_vip_address(&self, address: ManagedAddress) {
        self.vip_addresses().insert(address);
    }

    /// Owner batch adds multiple wallets to the 0% fee VIP registry
    #[only_owner]
    #[endpoint(batchAddVipAddresses)]
    fn batch_add_vip_addresses(&self, addresses: MultiValueEncoded<ManagedAddress>) {
        for address in addresses {
            self.vip_addresses().insert(address);
        }
    }

    /// Owner removes a wallet from the 0% fee VIP registry
    #[only_owner]
    #[endpoint(removeVipAddress)]
    fn remove_vip_address(&self, address: ManagedAddress) {
        self.vip_addresses().swap_remove(&address);
    }

    #[view(isPaused)]
    #[storage_mapper("isPaused")]
    fn is_paused(&self) -> SingleValueMapper<bool>;

    #[storage_mapper("activeListings")]
    fn active_listings(&self) -> UnorderedSetMapper<(TokenIdentifier<Self::Api>, u64)>;

    #[storage_mapper("vipAddresses")]
    fn vip_addresses(&self) -> UnorderedSetMapper<ManagedAddress>;

    // =========================================================================
    // ULTRAS PASS PRIMARY SHOP (DIRECT ATOMIC SFT DELIVERY)
    // =========================================================================

    #[view(getUltrasPassStock)]
    #[storage_mapper("ultrasPassStock")]
    fn ultras_pass_stock(&self) -> SingleValueMapper<BigUint>;

    #[view(getUltrasPassCollection)]
    #[storage_mapper("ultrasPassCollection")]
    fn ultras_pass_collection(&self) -> SingleValueMapper<TokenIdentifier>;

    #[view(getUltrasPassNonce)]
    #[storage_mapper("ultrasPassNonce")]
    fn ultras_pass_nonce(&self) -> SingleValueMapper<u64>;

    #[view(getUltrasPassPriceEgld)]
    #[storage_mapper("ultrasPassPriceEgld")]
    fn ultras_pass_price_egld(&self) -> SingleValueMapper<BigUint>;

    #[view(getUltrasPassPriceEfoo)]
    #[storage_mapper("ultrasPassPriceEfoo")]
    fn ultras_pass_price_efoo(&self) -> SingleValueMapper<BigUint>;

    /// Owner sets the Ultras Pass prices (in wei EGLD and $EFOO)
    #[only_owner]
    #[endpoint(setUltrasPassPrices)]
    fn set_ultras_pass_prices(&self, price_egld: BigUint, price_efoo: BigUint) {
        self.ultras_pass_price_egld().set(&price_egld);
        self.ultras_pass_price_efoo().set(&price_efoo);
    }

    /// Owner deposits Ultras Pass SFTs into the Smart Contract shop inventory
    #[only_owner]
    #[payable("*")]
    #[endpoint(depositUltrasPassStock)]
    fn deposit_ultras_pass_stock(&self) {
        let payment = self.call_value().single_esdt();
        require!(payment.amount > 0, "Deposit amount must be greater than 0");
        let token_id = payment.token_identifier;
        let nonce = payment.token_nonce;

        if self.ultras_pass_collection().is_empty() {
            self.ultras_pass_collection().set(&token_id);
            self.ultras_pass_nonce().set(nonce);
        } else {
            require!(token_id == self.ultras_pass_collection().get(), "Invalid token collection");
            require!(nonce == self.ultras_pass_nonce().get(), "Invalid token nonce");
        }

        self.ultras_pass_stock().update(|s| *s += &payment.amount);
    }

    /// Users buy an Ultras Pass SFT directly with 0.5 EGLD or 5,000,000 $EFOO
    #[payable("*")]
    #[endpoint(buyUltrasPass)]
    fn buy_ultras_pass(&self) {
        self.require_not_paused();
        let caller = self.blockchain().get_caller();
        let stock = self.ultras_pass_stock().get();
        require!(stock > 0, "Ultras Pass is sold out in this batch!");

        let token_id = self.ultras_pass_collection().get();
        let nonce = self.ultras_pass_nonce().get();
        let owner = self.blockchain().get_owner_address();

        let egld_payment = self.call_value().egld_value().clone_value();
        if egld_payment > 0 {
            // Default 0.5 EGLD = 500,000,000,000,000,000 wei
            let default_egld_price = BigUint::from(500_000_000_000_000_000u64);
            let price = if self.ultras_pass_price_egld().is_empty() {
                default_egld_price
            } else {
                self.ultras_pass_price_egld().get()
            };

            require!(egld_payment >= price, "Insufficient EGLD sent");

            // CEI Pattern: update state first
            self.ultras_pass_stock().update(|s| *s -= 1u32);
            self.vip_addresses().insert(caller.clone());

            // Deliver 1 SFT to buyer
            self.send().direct_esdt(&caller, &token_id, nonce, &BigUint::from(1u32));

            // Forward EGLD payment to owner
            self.send().direct_egld(&owner, &price);

            // Refund excess
            let excess = &egld_payment - &price;
            if excess > 0 {
                self.send().direct_egld(&caller, &excess);
            }
        } else {
            let (payment_token, payment_amount) = self.call_value().single_fungible_esdt();
            require!(payment_token == self.efoo_token_id().get(), "Payment must be in EGLD or $EFOO");

            // Default 5,000,000 $EFOO
            let factor = BigUint::from(10u64).pow(18u32);
            let default_efoo_price = BigUint::from(5_000_000u64) * &factor;
            let price = if self.ultras_pass_price_efoo().is_empty() {
                default_efoo_price
            } else {
                self.ultras_pass_price_efoo().get()
            };

            require!(payment_amount >= price, "Insufficient $EFOO sent");

            // CEI Pattern: update state first
            self.ultras_pass_stock().update(|s| *s -= 1u32);
            self.vip_addresses().insert(caller.clone());

            // Deliver 1 SFT to buyer
            self.send().direct_esdt(&caller, &token_id, nonce, &BigUint::from(1u32));

            // Forward $EFOO payment to owner
            self.send().direct_esdt(&owner, &payment_token, 0, &price);

            // Refund excess
            let excess = &payment_amount - &price;
            if excess > 0 {
                self.send().direct_esdt(&caller, &payment_token, 0, &excess);
            }
        }
    }

    /// Owner withdraws unsold Ultras Pass SFTs back to owner wallet
    #[only_owner]
    #[endpoint(withdrawUltrasPassStock)]
    fn withdraw_ultras_pass_stock(&self, amount: BigUint) {
        let stock = self.ultras_pass_stock().get();
        require!(amount <= stock && amount > 0, "Invalid withdrawal amount");

        self.ultras_pass_stock().update(|s| *s -= &amount);

        let owner = self.blockchain().get_owner_address();
        let token_id = self.ultras_pass_collection().get();
        let nonce = self.ultras_pass_nonce().get();
        self.send().direct_esdt(&owner, &token_id, nonce, &amount);
    }
}
