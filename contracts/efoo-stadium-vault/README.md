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

4. **Multi-Currency P2P NFT Marketplace Escrow (`listNft`, `buyNft`, `delistNft`, `updateListingPrice`)**:
   - Sellers can choose to list in either **$EFOO** or native **EGLD**.
   - **When sold in $EFOO**:
     - 95% sent directly to seller.
     - 5% platform fee:
       - 2.5% burned permanently on-chain 🔥
       - 2.5% sent to Weekend Vault Jackpot Pot 🏆
   - **When sold in EGLD**:
     - 97.5% sent directly to seller.
     - 2.5% platform fee sent directly to `efoorewards.elrond` wallet 💎
   - Checks-Effects-Interactions (CEI) architecture guarantees complete protection against reentrancy.

5. **Sponsor Injections & Milestone Burns**:
   - **`depositToVaultPot`**: Allows anyone (team, sponsor) to add extra $EFOO to the weekend jackpot.
   - **`burnTokens`**: Allows direct milestone/marketing supply burns that count towards global telemetry.

6. **Web3 Security Shield & Emergency Circuit Breakers**:
   - **`pauseContract` / `unpauseContract`**: Instant emergency freeze callable only by owner.
   - **`emergencyWithdrawToken`**: Rescue accidental tokens sent to the contract address.

---

## 🚀 Step-by-Step Deployment & Role Assignment

### Step 1: Deploy from `efoorewards.elrond`
The Smart Contract **must** be deployed using the manager wallet (`efoorewards` - `erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my`) so that this wallet becomes the permanent owner.

### Step 2: Grant `ESDTRoleLocalBurn` to Contract Address
Once deployed, take the newly created Smart Contract address (`erd1qqqqqqqqqqqqqpgq...`) and execute the role assignment transaction directly from `efoorewards`:

- **Receiver**: `erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u` (ESDT System Contract)
- **Value**: `0 EGLD`
- **Gas Limit**: `60000000`
- **Function**: `setSpecialRole`
- **Arguments**:
  - `str:EFOO-8fe2d4`
  - `<SC_BECH32_ADDRESS>`
  - `str:ESDTRoleLocalBurn`

#### Raw Transaction Data payload:
```
setSpecialRole@45464f4f2d386665326434@<SC_HEX_ADDRESS>@45534454526f6c654c6f63616c4275726e
```
