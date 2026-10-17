# MultiversX Accounts Branding — EFootball-X Stadium Vault

Ez a mappa tartalmazza a hivatalos MultiversX `mx-assets` repository szerinti fiók / okosszerződés branding fájlokat az **EFootball-X Stadium Vault** (`erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend`) szerződéshez.

---

## 📁 Fájlstruktúra a MultiversX `mx-assets` repóban:

```
mx-assets/
├── accounts/
│   ├── erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend.json
│   └── icons/
│       ├── efoo-stadium-vault.png   (200x200 px, <100KB)
│       └── efoo-stadium-vault.svg   (vektoros logo)
```

---

## 🚀 Lépésről-lépésre PR beküldési útmutató:

### 1. Lépés: Másold a fájlokat a forkolt `mx-assets` repódba:
Forkod címe: `https://github.com/elrondfootballnfts/mx-assets`
- Helyezd el a `erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend.json` fájlt a repó gyökerében lévő `accounts/` mappába.
- Helyezd el az `efoo-stadium-vault.png` és `efoo-stadium-vault.svg` fájlokat az `accounts/icons/` mappába.

### 2. Lépés: Commit & Push a forkolt repódban:
```bash
git add accounts/erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend.json
git add accounts/icons/efoo-stadium-vault.png accounts/icons/efoo-stadium-vault.svg
git commit -m "Brand Smart Contract erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend"
git push origin master
```

### 3. Lépés: Nyiss egy Pull Request-et a `multiversx/mx-assets` felé:
- **PR Cím**: `Brand EFootball-X Stadium Vault Smart Contract`
- **Leírás**: 
  ```markdown
  Branding for official EFootball-X Stadium Vault & NFooT Marketplace Smart Contract on MultiversX Mainnet.
  Contract Address: erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend
  Manager Wallet: erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my (efoorewards.elrond)
  ```

### 4. Lépés: Tulajdonosi aláírás (Ownership Check):
A MultiversX automatikus botja egy commit hash aláírást kér:
1. Menj a PR oldalán a **Commits** fülre, és másold ki a legutolsó commit sha hash-ét (pl. `9c6164f1b1...`).
2. Nyisd meg a [MultiversX Utils Dapp](https://utils.multiversx.com) oldalt.
3. Csatlakozz az **`efoorewards`** tárcával (`erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my`).
4. Menj a **Sign Message** fülre, illeszd be a commit hash-t, és kattints a **Sign** gombra.
5. A kapott aláírást (hex string) küldd be kommentként a Pull Request alá!
6. A MultiversX GitHub Bot másodpercek alatt ellenőrzi, és zöldre állítja a PR-t!
