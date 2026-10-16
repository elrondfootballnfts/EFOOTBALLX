# EFOO Stadium Vault & P2P Marketplace Smart Contract (MultiversX)

Comprehensive, secure on-chain Smart Contract for **$EFOO Token Burning**, **Sunday League Weekend Vault Jackpot**, and **P2P NFT Marketplace Escrow**.

---

## 🛡 Security Architecture & Features

1. **Verifiable Supply Burn (`esdt_local_burn`)**:
   - Executes native MultiversX protocol-level burn using `self.send().esdt_local_burn(&token_id, 0, amount)`.
   - Permanently decreases circulating and total supply on MultiversX Explorer and DEX trackers.
   - Requires `ESDTRoleLocalBurn` assigned to the Smart Contract by the token manager wallet (`efoorewards.elrond`).

2. **Game Fee Splits (50% Burn / 50% Vault Pot)**:
   - **Revive Streak & Advance**: 50,000 $EFOO $\rightarrow$ 25,000 $EFOO burned, 25,000 $EFOO to Vault Pot.
   - **Retry Current Round**: 25,000 $EFOO $\rightarrow$ 12,500 $EFOO burned, 12,500 $EFOO to Vault Pot.

3. **Weekend Vault Jackpot Distribution (`distributeWeekendVault`)**:
   - `#[only_owner]` access restriction (callable only by `efoorewards.elrond`).
   - Leaderboard payout shares:
     - 🥇 **1st Place**: 65% of Vault Pot
     - 🥈 **2nd Place**: 25% of Vault Pot
     - 🥉 **3rd Place**: 10% of Vault Pot
   - Any unallocated portion automatically rolls over to the next week's prize pool.

4. **P2P NFT Escrow & Marketplace (`listNft`, `buyNft`, `delistNft`, `updateListingPrice`)**:
   - Sellers escrow their Striker or Goalkeeper NFTs on-chain with custom price in $EFOO.
   - Buyers purchase directly; 99% sent to seller, 0.5% burned forever, 0.5% sent to Vault Pot.
   - Checks-Effects-Interactions (CEI) architecture guarantees complete protection against reentrancy.

5. **Emergency Circuit Breaker (`pauseContract` / `unpauseContract`)**:
   - Instant emergency freeze for security maintenance, callable only by the contract owner.

---

## 🚀 Step-by-Step Deployment & Role Assignment

### Step 1: Deploy from `efoorewards.elrond`
The Smart Contract **must** be deployed using the manager wallet (`efoorewards` - `erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my`) so that this wallet becomes the permanent owner.

#### Using `mxpy`:
```bash
mxpy contract deploy \
  --bytecode=output/efoo-stadium-vault.wasm \
  --pem=efoorewards.pem \
  --proxy=https://gateway.multiversx.com \
  --chain=1 \
  --gas-limit=60000000 \
  --arguments str:EFOO-8fe2d4 erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4hu \
  --send
```

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

#### Using `mxpy`:
```bash
mxpy tx new \
  --receiver=erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u \
  --pem=efoorewards.pem \
  --proxy=https://gateway.multiversx.com \
  --chain=1 \
  --gas-limit=60000000 \
  --data="setSpecialRole@45464f4f2d386665326434@<SC_HEX_ADDRESS>@45534454526f6c654c6f63616c4275726e" \
  --send
```
