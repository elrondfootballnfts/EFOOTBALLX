# EFOO Stadium Vault & P2P Marketplace Smart Contract (MultiversX)

Comprehensive, secure on-chain Smart Contract for **$EFOO Token Burning**, **Sunday League Weekend Vault Jackpot**, and **Multi-Currency P2P NFT Marketplace Escrow**.

---

## 🛡 Security Architecture & Features

1. **Verifiable Supply Burn (`esdt_local_burn`)**:
   - Executes native MultiversX protocol-level burn using `self.send().esdt_local_burn(&token_id, 0, amount)`.
   - Permanently decreases circulating and total supply on MultiversX Explorer and DEX trackers.
   - Requires `ESDTRoleLocalBurn` assigned to the Smart Contract by the token manager wallet (`efoorewards.elrond`).

2. **Game Fee Splits (50% Burn / 50% Vault Pot)**:
   - **Revive Streak & Advance**: Default 50,000 $EFOO $\rightarrow$ 25,000 $EFOO burned, 25,000 $EFOO to Vault Pot.
   - **Retry Current Round**: Default 25,000 $EFOO $\rightarrow$ 12,500 $EFOO burned, 12,500 $EFOO to Vault Pot.
   - **Configurable Game Fees (`setGameFees`)**: Owner can dynamically adjust fees if token price fluctuates.

3. **Weekend Vault Jackpot Distribution (`distributeWeekendVault`)**:
   - `#[only_owner]` access restriction (callable only by `efoorewards.elrond`).
   - Leaderboard payout shares:
     - 🥇 **1st Place**: 65% of Vault Pot
     - 🥈 **2nd Place**: 25% of Vault Pot
     - 🥉 **3rd Place**: 10% of Vault Pot
   - Any unallocated portion automatically rolls over to the next week's prize pool.

4. **Multi-Currency P2P NFT Marketplace Escrow (`listNft`, `buyNft`, `delistNft`, `updateListingPrice`, `getAllListings`)**:
   - Sellers can choose to list in either **$EFOO** or native **EGLD**.
   - **Ultras VIP Pass 0% Fee Privilege**:
     - Holders of the `EFOO ULTRAS PASS` (`EFOOPASS-5223a8`) enjoy **0% platform fees for life** on all marketplace trades!
     - 100% of the sale price goes directly to the seller.
   - **Standard Platform Fees (Non-VIP)**:
     - **When sold in $EFOO**:
       - 95% sent directly to seller.
       - 5% platform fee split:
         - 2.5% burned permanently on-chain 🔥
         - 2.5% sent to Weekend Vault Jackpot Pot 🏆
     - **When sold in EGLD**:
       - 97.5% sent directly to seller.
       - 2.5% platform fee sent directly to `efoorewards.elrond` wallet 💎
   - `getAllListings`: Returns all currently active marketplace listings on-chain in real time.
   - Checks-Effects-Interactions (CEI) architecture guarantees complete protection against reentrancy.

5. **Sponsor Injections & Milestone Burns**:
   - **`depositToVaultPot`**: Allows anyone (team, sponsor) to add extra $EFOO to the weekend jackpot.
   - **`burnTokens`**: Allows direct milestone/marketing supply burns that count towards global telemetry.

6. **Web3 Security Shield & Emergency Circuit Breakers**:
   - **`pauseContract` / `unpauseContract`**: Instant emergency freeze callable only by owner.
   - **`emergencyWithdrawToken`**: Rescue accidental tokens sent to the contract address.
   - **`addVipAddress` / `batchAddVipAddresses` / `removeVipAddress`**: Manage 0% fee VIP whitelist.

---

## 🚀 Step-by-Step Mainnet Upgrade / Deployment

Mainnet Smart Contract Address:
`erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend`

### Upgrade Command (from `efoorewards` wallet):
To upgrade the contract on MultiversX mainnet with the new marketplace, burn fallback, and VIP features:

```bash
mxpy contract upgrade erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend \
  --bytecode=output/efoo-stadium-vault.wasm \
  --pem=wallet-owner.pem \
  --gas-limit=100000000 \
  --proxy=https://gateway.multiversx.com \
  --chain=1 \
  --payable \
  --send
```
*(Note: `--payable` is required so the contract can receive native EGLD for NFT marketplace purchases)*

### Grant `ESDTRoleLocalBurn` to Contract Address (Optional, if burn address not used):
- **Receiver**: `erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u` (ESDT System Contract)
- **Value**: `0 EGLD`
- **Gas Limit**: `60000000`
- **Function**: `setSpecialRole`
- **Arguments**:
  - `str:EFOO-8fe2d4`
  - `erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend`
  - `str:ESDTRoleLocalBurn`

