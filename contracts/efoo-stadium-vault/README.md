# EFOO Stadium Vault Smart Contract (MultiversX)

Smart Contract handling the **EFOO Stadium Reserve Vault**, **Player Balance Escrow**, **First-Time Welcome Bonus (+50%)**, **10-Second VAR Revive Burns**, and **Weekly Ultras Derby Jackpot distributions**.

---

## 🏗 Architecture & Features

1. **Reserve Treasury Vault (`fundReserveVault`)**:
   - The owner/treasury funds the reserve vault (`reservePoolBalance`) with $EFOO tokens.
   - Used to supply the **+500,000 $EFOO Welcome Bonus** to new players who buy/deposit $\ge$ 1,000,000 $EFOO.

2. **First-Purchase Starter Bonus (`depositPlayerBalance`)**:
   - Threshold: **1,000,000 $EFOO** (0.035 EGLD starter micro-pack).
   - If player hasn't claimed yet, they receive **1,500,000 $EFOO** credited directly to their in-game balance (+50% bonus).
   - Player can withdraw or use balance in matches.

3. **10-Second VAR Revive / Extra Time Second Chance (`reviveMatch`)**:
   - Players can revive upon hitting crossbar or keeper save for **25,000 $EFOO**.
   - **50% burned** on-chain immediately (sent to burn dead address).
   - **50% deposited** directly into the `weeklyJackpotPool`.

4. **Player Withdrawal (`withdraw`)**:
   - Players retain full custody of their deposited & bonus balances and can withdraw back to their MultiversX wallet anytime.

5. **Weekly Derby Jackpot Distribution (`distributeWeeklyDerby`)**:
   - 50% paid to the weekly MVP/Derby winner.
   - 20% burned on-chain.
   - 30% rolls over to the next week's grand prize pot.

---

## 🚀 Build & Deployment with `mxpy`

### 1. Build WASM
```bash
cd contracts/efoo-stadium-vault/meta
cargo run build
```

### 2. Deploy to MultiversX Mainnet / Devnet
```bash
mxpy contract deploy \
  --bytecode=output/efoo-stadium-vault.wasm \
  --pem=wallet-owner.pem \
  --proxy=https://gateway.multiversx.com \
  --chain=1 \
  --gas-limit=60000000 \
  --arguments str:EFOO-8fe2d4 erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4hu \
  --send
```

### Parameters for `init`:
- `efoo_token_id`: `EFOO-8fe2d4`
- `burn_address`: `erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4hu` (or system dead address)

---

## 🛡 Reserve Vault Address
- **Reserve Treasury Wallet**: `erd1lqh33j0geuxxa8wyj95wk8cy8yqf7gltn73mmdmtucvn332txarqzcdpzp`
- Metadata: `vault/reserve-vault.json`
