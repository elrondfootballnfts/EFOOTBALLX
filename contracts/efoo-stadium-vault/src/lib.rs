#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

/// MultiversX Smart Contract for EFOO Stadium Reserve Vault,
/// Player Balance Escrow, First-Time Welcome Bonus (+50%), and Matchday Burns.
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
        
        // 1,000,000 $EFOO (18 decimals: 1,000,000 * 10^18)
        let starter_threshold = BigUint::from(1_000_000u64) * BigUint::from(10u64).pow(18);
        self.starter_bonus_threshold().set(&starter_threshold);

        // 500,000 $EFOO bonus (+50% bonus match)
        let starter_bonus = BigUint::from(500_000u64) * BigUint::from(10u64).pow(18);
        self.starter_bonus_amount().set(&starter_bonus);

        // 25,000 $EFOO revive fee
        let revive_fee = BigUint::from(25_000u64) * BigUint::from(10u64).pow(18);
        self.revive_fee_amount().set(&revive_fee);
    }

    /// Club Treasury funds the Reserve Vault to supply player bonuses & weekly cups
    #[payable("*")]
    #[endpoint(fundReserveVault)]
    fn fund_reserve_vault(&self) {
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid token deposited");
        require!(payment > 0, "Payment must be greater than 0");

        self.reserve_pool_balance().update(|val| *val += payment);
    }

    /// Player deposits $EFOO to unlock Arena and receive +50% First Purchase Starter Bonus
    #[payable("*")]
    #[endpoint(depositPlayerBalance)]
    fn deposit_player_balance(&self) {
        let caller = self.blockchain().get_caller();
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid token deposited");
        require!(payment > 0, "Payment must be greater than 0");

        let mut credited_amount = payment.clone();

        // Check if player qualifies for +50% Starter Pack Bonus
        let threshold = self.starter_bonus_threshold().get();
        let bonus_amount = self.starter_bonus_amount().get();

        if !self.has_received_starter_bonus(&caller).get() && payment >= threshold {
            let reserve_bal = self.reserve_pool_balance().get();
            if reserve_bal >= bonus_amount {
                // Deduct bonus from reserve and grant to player
                self.reserve_pool_balance().update(|r| *r -= &bonus_amount);
                credited_amount += &bonus_amount;
                self.has_received_starter_bonus(&caller).set(true);
            }
        }

        self.player_balances(&caller).update(|bal| *bal += credited_amount);
    }

    /// 10-Second VAR Revive / Extra Time Second Chance
    /// 50% sent to the Burn dead address, 50% added to the Weekly Derby Jackpot Pool
    #[payable("*")]
    #[endpoint(reviveMatch)]
    fn revive_match(&self) {
        let (token, payment) = self.call_value().single_fungible_esdt();
        require!(token == self.efoo_token_id().get(), "Invalid token");
        require!(payment >= self.revive_fee_amount().get(), "Insufficient revive fee");

        let half = &payment / 2u32;
        let burn_share = &payment - &half;

        // Add 50% to weekly jackpot pool
        self.weekly_jackpot_pool().update(|p| *p += half);

        // Send 50% to burn address immediately
        let token_id = self.efoo_token_id().get();
        let burn_addr = self.burn_address().get();
        self.send().direct_esdt(&burn_addr, &token_id, 0, &burn_share);
    }

    /// Players can withdraw their available in-game balance anytime back to their wallet
    #[endpoint(withdraw)]
    fn withdraw(&self, opt_amount: OptionalValue<BigUint>) {
        let caller = self.blockchain().get_caller();
        let current_bal = self.player_balances(&caller).get();
        require!(current_bal > 0, "No balance to withdraw");

        let amount_to_withdraw = match opt_amount {
            OptionalValue::Some(amt) => {
                require!(amt <= current_bal, "Withdrawal amount exceeds balance");
                amt
            },
            OptionalValue::None => current_bal.clone(),
        };

        self.player_balances(&caller).update(|bal| *bal -= &amount_to_withdraw);
        let token_id = self.efoo_token_id().get();
        self.send().direct_esdt(&caller, &token_id, 0, &amount_to_withdraw);
    }

    /// Admin / Automated Derby Keeper awards Weekly Ultras Cup
    /// 50% to winner, 20% burned on-chain, 30% rolls over
    #[only_owner]
    #[endpoint(distributeWeeklyDerby)]
    fn distribute_weekly_derby(&self, winner: ManagedAddress) {
        let total_pool = self.weekly_jackpot_pool().get();
        require!(total_pool > 0, "No jackpot pool to distribute");

        let winner_share = (&total_pool * 50u32) / 100u32;
        let burn_share = (&total_pool * 20u32) / 100u32;
        let rollover = &total_pool - &winner_share - &burn_share;

        self.weekly_jackpot_pool().set(&rollover);

        let token_id = self.efoo_token_id().get();
        let burn_addr = self.burn_address().get();

        // Payout winner
        self.send().direct_esdt(&winner, &token_id, 0, &winner_share);

        // Burn 20% on-chain
        self.send().direct_esdt(&burn_addr, &token_id, 0, &burn_share);
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

    #[view(getReservePoolBalance)]
    #[storage_mapper("reservePoolBalance")]
    fn reserve_pool_balance(&self) -> SingleValueMapper<BigUint>;

    #[view(getWeeklyJackpotPool)]
    #[storage_mapper("weeklyJackpotPool")]
    fn weekly_jackpot_pool(&self) -> SingleValueMapper<BigUint>;

    #[view(getPlayerBalance)]
    #[storage_mapper("playerBalances")]
    fn player_balances(&self, address: &ManagedAddress) -> SingleValueMapper<BigUint>;

    #[view(hasReceivedStarterBonus)]
    #[storage_mapper("hasReceivedStarterBonus")]
    fn has_received_starter_bonus(&self, address: &ManagedAddress) -> SingleValueMapper<bool>;

    #[view(getStarterBonusThreshold)]
    #[storage_mapper("starterBonusThreshold")]
    fn starter_bonus_threshold(&self) -> SingleValueMapper<BigUint>;

    #[view(getStarterBonusAmount)]
    #[storage_mapper("starterBonusAmount")]
    fn starter_bonus_amount(&self) -> SingleValueMapper<BigUint>;

    #[view(getReviveFeeAmount)]
    #[storage_mapper("reviveFeeAmount")]
    fn revive_fee_amount(&self) -> SingleValueMapper<BigUint>;
}
