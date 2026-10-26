// ============================================================================
// EFOO FOMO — FULLSCREEN 60FPS 3D-PERSPECTIVE ARCADE ENGINE (game.js)
// ============================================================================

const MIN_EFOO_REQUIRED = 1000000; // Minimum 1,000,000 $EFOO required to play
const VALID_WALLET_PROVIDERS = ["xportal", "extension", "webwallet", "inspector", "phantom", "solana"];

const I18N_GAME = {
  en: {
    btn_exit: "EXIT TO HOME",
    hud_mult: "BOOST",
    hud_score: "SCORE",
    hud_no_wallet: "MIN 1M $EFOO",
    btn_connect: "CONNECT",
    hint_switch_nft: "🔄 Click to switch NFT",
    aim_prompt: "👆 SWIPE FROM BALL TO GOAL TO SHOOT & CURVE!",
    btn_boost: "BOOST",
    step_1: "Swipe from Ball to Curve",
    step_2: "More NFTs = <strong>Up to 15x & Radar</strong>",
    step_3: "Pot: <strong>25,400,000 $EFOO</strong>",
    gate_connect_desc: "Connect your MultiversX wallet to verify your $EFOO balance & Club NFTs.",
    gate_buy_sub: "Pay 0.035 EGLD (~$0.12) for 1,000,000 $EFOO ➔ RECEIVE 1,500,000 $EFOO! (+500k One-Time Bonus from Stadium Vault)",
    btn_buy_starter: "STARTER (0.035 EGLD ➔ 1.5M)",
    btn_buy_gate: "PRO PACK (0.1 EGLD ➔ ~3M)",
    btn_connect_to_play: "CONNECT WALLET TO PLAY",
    btn_play_now: "START MATCH",
    sum_your_score: "YOUR SCORE",
    sum_with_nfts: "WITH 3+ NFTs & 1M $EFOO",
    btn_play_again: "PLAY AGAIN",
    btn_starter_bonus: "STARTER: 1.5M $EFOO (0.035 EGLD)",
    btn_share_x: "SHARE ON X",
    btn_buy_3m: "BUY 3M $EFOO (0.1 EGLD)",
    btn_mint_nft: "MINT NFT (0.08 EGLD)",
    start_market_title: "SUPER SKILLS & MARKETPLACE",
    start_market_sub: "Equip tactical power-ups (-10% on 5x packs) & scout NFTs!",
    btn_open_market: "🛒 OPEN STORE (-10%)",
    sum_market_title: "RESTOCK SUPER SKILLS (-10% PACKS)",
    sum_market_sub: "Refill 5x packs with 10% discount to beat the next boss keeper!",
    btn_skills_market: "STORE (-10%)",
    tab_skills: "⚡ SUPER SKILLS (-10%)",
    tab_nfts: "🃏 NFT MARKETPLACE",
    tab_tokens: "💰 BUY $EFOO",
    owned_label: "Owned",
    discount_tag: "-10% OFF"
  },
  hu: {
    btn_exit: "VISSZA A FŐOLDALRA",
    hud_mult: "BÓNUSZ",
    hud_score: "PONTSZÁM",
    hud_no_wallet: "MIN. 1M $EFOO",
    btn_connect: "CSATLAKOZÁS",
    hint_switch_nft: "🔄 Kattints az NFT váltásához",
    aim_prompt: "👆 LENDÍTSD MEG A LABDÁT A KAPU FELÉ A LÖVÉSHEZ ÉS CSAVARÁSHOZ!",
    btn_boost: "BÓNUSZ",
    step_1: "Lendítsd meg a labdát a csavaráshoz",
    step_2: "Több NFT = <strong>Akár 15x & Radar</strong>",
    step_3: "Nyereményalap: <strong>25 400 000 $EFOO</strong>",
    gate_connect_desc: "Csatlakoztasd a MultiversX tárcád a $EFOO egyenleg és Club NFT-k ellenőrzéséhez.",
    gate_buy_sub: "Fizess 0.035 EGLD-t (~$0.12) 1 000 000 $EFOO-ért ➔ KAPSZ 1 500 000 $EFOO-t! (+500k Egyszeri Bónusz a Stadium Vaultból)",
    btn_buy_starter: "STARTER CSOMAG (0.035 EGLD ➔ 1.5M)",
    btn_buy_gate: "PRO CSOMAG (0.1 EGLD ➔ ~3M)",
    btn_connect_to_play: "TÁRCA CSATLAKOZTATÁSA A JÁTÉKHOZ",
    btn_play_now: "MÉRKŐZÉS INDÍTÁSA",
    sum_your_score: "A TE PONTSZÁMOD",
    sum_with_nfts: "3+ NFT-VEL ÉS 1M $EFOO-VAL",
    btn_play_again: "ÚJRA JÁTSZOM",
    btn_starter_bonus: "STARTER: 1.5M $EFOO (0.035 EGLD)",
    btn_share_x: "MEGOSZTÁS X-EN",
    btn_buy_3m: "3M $EFOO VÉTEL (0.1 EGLD)",
    btn_mint_nft: "NFT VERÉS (0.08 EGLD)",
    start_market_title: "SZUPERKÉPESSÉGEK & MARKETPLACE",
    start_market_sub: "Szereld fel a csapatod (-10% az 5x csomagokra) & NFT piac!",
    btn_open_market: "🛒 BOLT MEGNYITÁSA (-10%)",
    sum_market_title: "KÉPESSÉGEK ÚJRATÖLTÉSE (-10% CSOMAGOK)",
    sum_market_sub: "Töltsd újra a készleted 10% kedvezménnyel a következő szint legyőzéséhez!",
    btn_skills_market: "BOLT (-10%)",
    tab_skills: "⚡ SZUPERKÉPESSÉGEK (-10%)",
    tab_nfts: "🃏 NFT PIAC (XOXNO / FRAMEIT)",
    tab_tokens: "💰 $EFOO VÁSÁRLÁS",
    owned_label: "Birtokolt",
    discount_tag: "-10% KEDVEZMÉNY"
  },
  ro: {
    btn_exit: "IEȘIRE",
    hud_mult: "BOOST",
    hud_score: "SCOR",
    hud_no_wallet: "MIN 1M $EFOO",
    btn_connect: "PORTOFEL",
    hint_switch_nft: "🔄 Click pt. alt NFT",
    aim_prompt: "👆 TRAGE DE LA MINGE SPRE POARTĂ PENTRU ȘUT ȘI EFECT!",
    btn_boost: "BOOST",
    step_1: "Trage spre poartă pentru efect",
    step_2: "Mai multe NFT = <strong>11x & Radar</strong>",
    step_3: "Pot: <strong>25,400,000 $EFOO</strong>",
    gate_connect_desc: "Conectează portofelul MultiversX pentru a verifica soldul $EFOO & NFT-urile.",
    gate_buy_sub: "Plătește 0.035 EGLD (~$0.12) pt. 1.000.000 $EFOO ➔ PRIMEȘTI 1.500.000 $EFOO! (+500k Bonus Unic din Seif)",
    btn_buy_starter: "STARTER (0.035 EGLD ➔ 1.5M)",
    btn_buy_gate: "PRO PACK (0.1 EGLD ➔ ~3M)",
    btn_connect_to_play: "CONECTEAZĂ PORTOFELUL",
    btn_play_now: "START MECI",
    sum_your_score: "SCORUL TĂU",
    sum_with_nfts: "CU 3+ NFT & 1M $EFOO",
    btn_play_again: "JOACĂ DIN NOU",
    btn_starter_bonus: "STARTER: 1.5M $EFOO (0.035 EGLD)",
    btn_share_x: "DISTRIBUIE PE X",
    btn_buy_3m: "CUMPĂRĂ ~2.84M $EFOO (0.1 EGLD)",
    btn_mint_nft: "MINTEAZĂ NFT (0.08 EGLD)",
    start_market_title: "SUPER SKILLS & MARKETPLACE",
    start_market_sub: "Echipează super-puteri (-10% la pachetele 5x) & piața NFT!",
    btn_open_market: "🛒 DESCHIDE MAGAZINUL (-10%)",
    sum_market_title: "REÎNCARCĂ SUPER PUTERILE (-10% PACHETE)",
    sum_market_sub: "Reîncarcă pachete 5x cu 10% reducere pentru a bate portarul boss!",
    btn_skills_market: "MAGAZIN (-10%)",
    tab_skills: "⚡ SUPER PUTERI (-10%)",
    tab_nfts: "🃏 PIAȚĂ NFT (XOXNO)",
    tab_tokens: "💰 CUMPĂRĂ $EFOO",
    owned_label: "Deținute",
    discount_tag: "-10% REDUCERE"
  }
};

const CONTRACTS = {
  ONEDEX_PAIR: "erd1qqqqqqqqqqqqqpgqqz6vp9y50ep867vnr296mqf3dduh6guvmvlsu3sujc",
  WEGLD_WRAPPERS: {
    0: "erd1qqqqqqqqqqqqqpgqvc7gdl0p4s97guh498wgz75k8sav6sjfjlwqh679jy",
    1: "erd1qqqqqqqqqqqqqpgqhe8t5jewej70zupmh44jurgn29psua5l2jps3ntjj3",
    2: "erd1qqqqqqqqqqqqqpgqmuk0q2saj0mgutxm4teywre6dl8wqf58xamqdrukln"
  },
  NFT_MINTER: "erd1qqqqqqqqqqqqqpgq78frnmw5sep0q4r2qd96y3d6f6p7ujwcys5s9evzym",
  FOMO_RESERVE: "erd1k8w7y5ftg2uax8v8ng8p5azjw96zzfgky9v3fydtpe2xwdz0007q3hl9z8",
  RESERVE_VAULT: "erd1lqh33j0geuxxa8wyj95wk8cy8yqf7gltn73mmdmtucvn332txarqzcdpzp",
  STADIUM_VAULT_SC: "erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend",
  WC_PROJECT_ID: "9b1a9564f91cb659ffe21b73d5c4e2d8"
};

const ULTRAS_PASS_IDENTIFIER = "EFOOPASS-5223a8-01";
const ULTRAS_PASS_COLLECTION = "EFOOPASS-5223a8";
const STORAGE_ULTRAS_PASS_PREFIX = "efoo_ultras_pass_";

// Verified on-chain holders of EFOOPASS-5223a8-01 (Pre-seeded with live MultiversX blockchain state)
const onchainUltrasHolders = new Set([
  "erd14zpeqacvvtctcyl5djvk3wml048d5gfescdaw0ufwnmnt6jwg0vqjlx6pj",
  "erd1mpg8tw0y8jx2eh5ek7qs48y7xp4skkp6z2xee2aej52uacz2uues6zf0d8"
]);
let isFetchingUltrasHolders = false;

async function syncOnchainUltrasHolders() {
  if (isFetchingUltrasHolders) return onchainUltrasHolders;
  isFetchingUltrasHolders = true;
  try {
    const res = await fetch(`https://api.multiversx.com/nfts/${ULTRAS_PASS_IDENTIFIER}/accounts?size=100`);
    if (res.ok) {
      const accounts = await res.json();
      if (Array.isArray(accounts)) {
        onchainUltrasHolders.clear();
        accounts.forEach((acc) => {
          if (acc && acc.address && Number(acc.balance) > 0) {
            const a = String(acc.address).trim().toLowerCase();
            // Exclude smart contracts (e.g. sale/vault SC)
            if (!a.startsWith("erd1qqqqqqqqqqqqqpgq")) {
              onchainUltrasHolders.add(a);
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn("[syncOnchainUltrasHolders] Error fetching on-chain pass holders:", err);
  } finally {
    isFetchingUltrasHolders = false;
  }
  return onchainUltrasHolders;
}

function hasUltrasPass(address) {
  if (!address || typeof address !== "string") return false;
  const cleanAddr = address.trim().toLowerCase();
  if (typeof SolanaAdapter !== "undefined" && SolanaAdapter.isSolanaAddress(cleanAddr)) {
    if (onchainUltrasHolders.has(cleanAddr)) return true;
    if (connectedAddress && cleanAddr === connectedAddress.toLowerCase() && walletState && walletState.hasUltrasPass) return true;
  }
  if (!cleanAddr.startsWith("erd1") || cleanAddr.length !== 62) return false;

  // 1. Strictly verified on-chain SFT holders from MultiversX blockchain
  if (onchainUltrasHolders.has(cleanAddr)) return true;

  // 2. Active connected wallet verification (only if checking the currently connected wallet)
  if (connectedAddress && cleanAddr === connectedAddress.toLowerCase()) {
    if (walletState && typeof walletState.ultrasCount === "number" && walletState.ultrasCount > 0) {
      return true;
    }
    if (walletState && Array.isArray(walletState.ownedNfts)) {
      const owns = walletState.ownedNfts.some(x => {
        const id = ((x.identifier || "") + " " + (x.name || "") + " " + (x.collection || "")).toLowerCase();
        return id.includes("efoopass-5223a8") || (x.collection && x.collection.toLowerCase() === ULTRAS_PASS_COLLECTION.toLowerCase());
      });
      if (owns) return true;
    }
  }

  return false;
}

const EFOO_CONFIG = {
  TOKEN_ID: "EFOO-8fe2d4",
  STADIUM_VAULT_SC: "erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend",
  BURN_ADDRESS: "erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4hu",
  REVIVE_ADVANCE_FEE: 50000,
  RETRY_ROUND_FEE: 25000
};

const STORAGE_VAULT_POT = "efoo_stadium_vault_pot";
const STORAGE_TOTAL_BURNED = "efoo_total_burned_games";
const BASE_VAULT_POT = 25400000;
const BASE_BURNED_GAMES = 92915321677;

function getVaultStats() {
  let pot = BASE_VAULT_POT;
  let burned = BASE_BURNED_GAMES;
  try {
    const p = localStorage.getItem(STORAGE_VAULT_POT);
    if (p) {
      const val = parseInt(p, 10) || 0;
      pot = Math.max(BASE_VAULT_POT, val);
    }
    const b = localStorage.getItem(STORAGE_TOTAL_BURNED);
    if (b) {
      const val = parseInt(b, 10) || 0;
      burned = Math.max(BASE_BURNED_GAMES, val);
    }
  } catch (e) {}
  return { pot, burned };
}

function addVaultContributions(vaultAdd, burnAdd) {
  const stats = getVaultStats();
  stats.pot += (vaultAdd || 0);
  stats.burned += (burnAdd || 0);
  try {
    localStorage.setItem(STORAGE_VAULT_POT, String(stats.pot));
    localStorage.setItem(STORAGE_TOTAL_BURNED, String(stats.burned));
  } catch (e) {}
  updateVaultUI();
  return stats;
}

async function refreshOnChainVaultStats() {
  const scAddress = EFOO_CONFIG.STADIUM_VAULT_SC;
  if (!scAddress || scAddress.includes("REPLACE") || !scAddress.startsWith("erd1qqqq")) {
    updateVaultUI();
    return;
  }
  try {
    // 1. Fetch on-chain EFOO token balance of the Stadium Vault SC
    const res = await fetch(`https://api.multiversx.com/accounts/${scAddress}/tokens/EFOO-8fe2d4`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.balance) {
        const balanceBig = BigInt(data.balance);
        const potTokens = Number(balanceBig / 1000000000000000000n);
        localStorage.setItem(STORAGE_VAULT_POT, String(potTokens));
      }
    } else {
      localStorage.setItem(STORAGE_VAULT_POT, "0");
    }

    // 2. Query totalBurnedGames view endpoint from SC
    const queryRes = await fetch("https://api.multiversx.com/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scAddress: scAddress,
        funcName: "getTotalBurnedGames",
        args: []
      })
    });
    if (queryRes.ok) {
      const qData = await queryRes.json();
      if (qData && qData.data && qData.data.returnData && qData.data.returnData[0]) {
        const hex = atob(qData.data.returnData[0]).split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        const burnedBig = BigInt('0x' + (hex || '0'));
        const burnedTokens = Number(burnedBig / 1000000000000000000n);
        localStorage.setItem(STORAGE_TOTAL_BURNED, String(burnedTokens));
      }
    }
  } catch (e) {
    console.warn("Could not refresh on-chain vault stats:", e);
  } finally {
    updateVaultUI();
  }
}

function updateVaultUI() {
  const stats = getVaultStats();
  const potFormatted = stats.pot.toLocaleString("en-US");
  const burnedFormatted = stats.burned.toLocaleString("en-US");

  const hudPotEl = document.getElementById("fomo-pot-amount");
  if (hudPotEl) hudPotEl.textContent = `🏆 ${potFormatted} $EFOO`;

  const modalPotEl = document.getElementById("modal-vault-pot");
  if (modalPotEl) modalPotEl.textContent = `${potFormatted} $EFOO`;

  const sumVaultEl = document.getElementById("sum-vault-val");
  if (sumVaultEl) sumVaultEl.textContent = `${potFormatted} $EFOO`;

  const sumBurnedEl = document.getElementById("sum-burned-val");
  if (sumBurnedEl) sumBurnedEl.textContent = `${burnedFormatted} $EFOO`;

  const startPotEl = document.getElementById("start-vault-pot-val");
  if (startPotEl) startPotEl.textContent = `${potFormatted} $EFOO`;

  const startBurnedEl = document.getElementById("start-burned-val");
  if (startBurnedEl) startBurnedEl.textContent = `${burnedFormatted} $EFOO`;

  const lbPotEl = document.getElementById("lb-pot-amount");
  if (lbPotEl) lbPotEl.textContent = `${potFormatted} $EFOO`;

  const lbShare1st = document.getElementById("lb-share-1st");
  if (lbShare1st) {
    const share1 = Math.floor(stats.pot * 0.65);
    lbShare1st.textContent = `${share1.toLocaleString("en-US")} $EFOO`;
  }
}

const RARITY_TIERS = {
  ROOKIE: { id: "rookie", name: "ROOKIE (F2P)", nameHu: "SZABADÚSZÓ", color: "#94a3b8", slots: 0, mult: 1.0 },
  COMMON: { id: "common", name: "COMMON", nameHu: "COMMON", color: "#22c55e", slots: 1, mult: 2.0 },
  RARE: { id: "rare", name: "RARE", nameHu: "RARE", color: "#38bdf8", slots: 2, mult: 3.5 },
  EPIC: { id: "epic", name: "EPIC", nameHu: "EPIC", color: "#a855f7", slots: 3, mult: 6.0 },
  LEGENDARY: { id: "legendary", name: "LEGENDARY", nameHu: "LEGENDÁS", color: "#ffb800", slots: 4, mult: 10.0 }
};

const ROOKIE_STRIKER = {
  identifier: "ROOKIE-STRIKER",
  name: "SUNDAY ROOKIE #10",
  rarity: "ROOKIE",
  ovr: 65,
  trait: "⚡ FREE-TO-PLAY (No Super Skills)",
  traitHu: "⚡ FREE-TO-PLAY (Nincs szuperképesség)",
  traitRo: "⚡ FREE-TO-PLAY (Fără super-puteri)",
  url: "branding/original/EFOOTBALL-91a4eb/logo.png"
};

const ROOKIE_KEEPER = {
  identifier: "ROOKIE-KEEPER",
  name: "SUNDAY ROOKIE GK #1",
  rarity: "ROOKIE",
  jersey: "01",
  ovr: 65,
  trait: "🧤 FREE-TO-PLAY (No Super Skills)",
  traitHu: "🧤 FREE-TO-PLAY (Nincs szuperképesség)",
  traitRo: "🧤 FREE-TO-PLAY (Fără super-puteri)",
  url: "branding/original/GOALKEEPER-cb9e3e/logo.png"
};

const STRIKER_ROSTER = [
  {
    identifier: "EFOOTBALL-91a4eb-0164",
    name: "ELRONDFOOTBALL #356",
    rarity: "MYTHIC",
    ovr: 99,
    trait: "👑 RANK #1 MYTHIC • 4 SKILLS + RADAR",
    traitHu: "👑 #1 RANGÚ MITIKUS • 4 KÉPESSÉG + RADAR",
    traitRo: "👑 RANG #1 MITIC • 4 ABILITĂȚI + RADAR",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1772.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0261",
    name: "ELRONDFOOTBALL #609",
    rarity: "EPIC",
    ovr: 95,
    trait: "⚡ LIGA 1 SNIPER • 3 SKILLS",
    traitHu: "⚡ LIGA 1 SNIPER • 3 KÉPESSÉG",
    traitRo: "⚡ LIGA 1 SNIPER • 3 ABILITĂȚI",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1477.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0262",
    name: "ELRONDFOOTBALL #610",
    rarity: "RARE",
    ovr: 90,
    trait: "🔥 ROCKET FINISHER • 2 SKILLS",
    traitHu: "🔥 ROCKET FINISHER • 2 KÉPESSÉG",
    traitRo: "🔥 ROCKET FINISHER • 2 ABILITĂȚI",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/2805.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0264",
    name: "ELRONDFOOTBALL #612",
    rarity: "RARE",
    ovr: 88,
    trait: "🎯 TOP BINS SPECIALIST • 2 SKILLS",
    traitHu: "🎯 VINCLU SPECIALIST • 2 KÉPESSÉG",
    traitRo: "🎯 VINCLU SPECIALIST • 2 ABILITĂȚI",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/6632.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0273",
    name: "ELRONDFOOTBALL #627",
    rarity: "COMMON",
    ovr: 78,
    trait: "🍺 PANENKA KING • 1 SKILL",
    traitHu: "🍺 PANENKA KING • 1 KÉPESSÉG",
    traitRo: "🍺 PANENKA KING • 1 ABILITATE",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1688.png"
  }
];

const KEEPER_ROSTER = [
  {
    identifier: "GOALKEEPER-cb9e3e-02",
    name: "GOALKEEPER #2",
    jersey: "02",
    rarity: "LEGENDARY",
    ovr: 99,
    trait: "🧱 WALL OF DEGENS • TELEPATHY + 4 SKILLS",
    traitHu: "🧱 WALL OF DEGENS • TELEPÁTIA + 4 KÉPESSÉG",
    traitRo: "🧱 WALL OF DEGENS • TELEPATIE + 4 ABILITĂȚI",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/230.png"
  },
  {
    identifier: "GOALKEEPER-cb9e3e-07",
    name: "GOALKEEPER #7",
    jersey: "07",
    rarity: "EPIC",
    ovr: 94,
    trait: "🧤 OCTOPUS REACH • SPIDER ARMS + 3 SKILLS",
    traitHu: "🧤 OCTOPUS REACH • ÓRIÁSKÉZ + 3 KÉPESSÉG",
    traitRo: "🧤 OCTOPUS REACH • SPIDER REACH + 3 ABILITĂȚI",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/440.png"
  },
  {
    identifier: "GOALKEEPER-cb9e3e-33",
    name: "GOALKEEPER #51",
    jersey: "51",
    rarity: "RARE",
    ovr: 86,
    trait: "⚡ CAT REFLEX • IRON WALL + 2 SKILLS",
    traitHu: "⚡ CAT REFLEX • ACÉLFAL + 2 KÉPESSÉG",
    traitRo: "⚡ CAT REFLEX • IRON WALL + 2 ABILITĂȚI",
    url: "branding/original/GOALKEEPER-cb9e3e/logo.png"
  }
];

// --- NFT RARITY TIERS & ATTRIBUTES SYSTEM (XOXNO LOGIC) ---
function getNftRarityTier(nft) {
  if (!nft || nft.identifier === "ROOKIE-STRIKER" || nft.identifier === "ROOKIE-KEEPER" || nft.rarity === "ROOKIE") {
    return {
      tierKey: "rookie",
      tierLabel: "ROOKIE (F2P)",
      tierIcon: "⚪",
      rank: "F2P",
      borderColor: "#94a3b8",
      scoreMult: 1.0,
      slots: 0,
      powers: [{ icon: "⚡", name: "1.0x MULT" }]
    };
  }

  let rank = nft.rank || (nft.metadata && nft.metadata.rank) || (nft.rarities && nft.rarities.openRarity && nft.rarities.openRarity.rank) || (nft.rarities && nft.rarities.statistical && nft.rarities.statistical.rank);
  const name = (nft.name || "").trim();
  const tokenNumMatch = name.match(/#(\d+)/);
  const tokenNum = tokenNumMatch ? parseInt(tokenNumMatch[1], 10) : (nft.nonce || 0);

  // Specific top ranks from official XOXNO collection
  if (tokenNum === 356) rank = 1;
  else if (tokenNum === 614) rank = 1;
  else if (tokenNum === 615) rank = 2;
  else if (tokenNum === 619) rank = 3;
  else if (tokenNum === 613) rank = 4;
  else if (tokenNum === 616) rank = 5;

  const isKeeper = nft.collection === "GOALKEEPER-cb9e3e" || (nft.identifier && nft.identifier.startsWith("GOALKEEPER")) || !!nft.jersey;
  if (!rank || rank <= 0) {
    if (nft.rarity && typeof nft.rarity === "string") {
      const rUpper = nft.rarity.toUpperCase();
      if (rUpper === "MYTHIC") rank = 5;
      else if (rUpper === "LEGENDARY") rank = 50;
      else if (rUpper === "EPIC") rank = 150;
      else if (rUpper === "RARE") rank = 350;
      else rank = 550;
    } else if (nft.metadata && nft.metadata.rarity && nft.metadata.rarity.rarityScore) {
      rank = Math.max(1, Math.min(628, Math.round(700 - nft.metadata.rarity.rarityScore)));
    } else {
      rank = tokenNum > 0 ? (tokenNum % 628) + 1 : 320;
    }
  }

  let tierKey = "common";
  let tierLabel = "COMMON";
  let tierIcon = "⚪";
  let borderColor = "#71717a";
  let powers = [];
  let scoreMult = 1.2;
  let slots = 1;

  if (isKeeper) {
    if (rank <= 5) {
      tierKey = "mythic";
      tierLabel = "MYTHIC";
      tierIcon = "👑";
      borderColor = "#ffd700";
      scoreMult = 3.5;
      slots = 5;
      powers = [
        { icon: "🧱", name: "IRON WALL" },
        { icon: "🧤", name: "SPIDER REACH" },
        { icon: "⏱️", name: "MATRIX SLOW" },
        { icon: "👁️", name: "MIND READ" },
        { icon: "🛡️", name: "3 SHIELDS" }
      ];
    } else if (rank <= 15) {
      tierKey = "legendary";
      tierLabel = "LEGENDARY";
      tierIcon = "⭐";
      borderColor = "#c084fc";
      scoreMult = 2.5;
      slots = 4;
      powers = [
        { icon: "🧱", name: "IRON WALL" },
        { icon: "🧤", name: "SPIDER REACH" },
        { icon: "⏱️", name: "MATRIX SLOW" },
        { icon: "🛡️", name: "2 SHIELDS" }
      ];
    } else if (rank <= 30) {
      tierKey = "epic";
      tierLabel = "EPIC";
      tierIcon = "🔷";
      borderColor = "#38bdf8";
      scoreMult = 2.0;
      slots = 3;
      powers = [
        { icon: "🧱", name: "IRON WALL" },
        { icon: "🧤", name: "SPIDER REACH" },
        { icon: "🛡️", name: "2 SHIELDS" }
      ];
    } else if (rank <= 45) {
      tierKey = "rare";
      tierLabel = "RARE";
      tierIcon = "🟢";
      borderColor = "#22c55e";
      scoreMult = 1.5;
      slots = 2;
      powers = [
        { icon: "🧤", name: "SPIDER REACH" },
        { icon: "🛡️", name: "1 SHIELD" }
      ];
    } else {
      tierKey = "common";
      tierLabel = "COMMON";
      tierIcon = "⚪";
      borderColor = "#71717a";
      scoreMult = 1.2;
      slots = 1;
      powers = [
        { icon: "🛡️", name: "1 SHIELD" }
      ];
    }
  } else {
    // Striker Outfield Players
    if (rank <= 20) {
      tierKey = "mythic";
      tierLabel = "MYTHIC";
      tierIcon = "👑";
      borderColor = "#ffd700";
      scoreMult = 3.5;
      slots = 5;
      powers = [
        { icon: "🔥", name: "ROCKET" },
        { icon: "🌪️", name: "VORTEX" },
        { icon: "🧊", name: "FREEZE" },
        { icon: "💰", name: "GOLD x2" },
        { icon: "⚡", name: "3.5x MULT" }
      ];
    } else if (rank <= 100) {
      tierKey = "legendary";
      tierLabel = "LEGENDARY";
      tierIcon = "⭐";
      borderColor = "#c084fc";
      scoreMult = 2.5;
      slots = 4;
      powers = [
        { icon: "🔥", name: "ROCKET" },
        { icon: "🌪️", name: "VORTEX" },
        { icon: "🧊", name: "FREEZE" },
        { icon: "⚡", name: "2.5x MULT" }
      ];
    } else if (rank <= 250) {
      tierKey = "epic";
      tierLabel = "EPIC";
      tierIcon = "🔷";
      borderColor = "#38bdf8";
      scoreMult = 2.0;
      slots = 3;
      powers = [
        { icon: "🔥", name: "ROCKET" },
        { icon: "🌪️", name: "VORTEX" },
        { icon: "⚡", name: "2.0x MULT" }
      ];
    } else if (rank <= 450) {
      tierKey = "rare";
      tierLabel = "RARE";
      tierIcon = "🟢";
      borderColor = "#22c55e";
      scoreMult = 1.5;
      slots = 2;
      powers = [
        { icon: "🌪️", name: "VORTEX" },
        { icon: "⚡", name: "1.5x MULT" }
      ];
    } else {
      tierKey = "common";
      tierLabel = "COMMON";
      tierIcon = "⚪";
      borderColor = "#71717a";
      scoreMult = 1.2;
      slots = 1;
      powers = [
        { icon: "⚡", name: "1.2x MULT" }
      ];
    }
  }

  return { tierKey, tierLabel, tierIcon, rank, borderColor, scoreMult, slots, powers };
}

function getNftRarityInfo(card) {
  const t = getNftRarityTier(card);
  return {
    id: t.tierKey,
    name: t.tierLabel,
    icon: t.tierIcon,
    rank: t.rank,
    color: t.borderColor,
    slots: t.slots,
    mult: t.scoreMult
  };
}

// ============================================================================
// MODERN SYNTHESIZED WEB AUDIO STADIUM SFX ENGINE (NO 90S CHIPTUNES)
// ============================================================================
class ModernStadiumAudio {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.noiseBuffer = null;
    this.bgmEnabled = localStorage.getItem("efoo_bgm_enabled") !== "false";
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.bgmStep = 0;
    this.bgmGain = null;
  }

  // =========================================================================
  // PLEASANT FOOTBALL SOUNDTRACK (BGM) SYNTHESIZER
  // 118 BPM FIFA / EA SPORTS FC MENU GROOVE
  // =========================================================================
  startBgm() {
    if (!this.bgmEnabled || this.bgmPlaying) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    this.bgmPlaying = true;
    this.bgmStep = 0;

    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);
    }

    const stepDurationMs = (60 / 118 / 4) * 1000;
    this.bgmInterval = setInterval(() => {
      this.playBgmStep();
    }, stepDurationMs);
    this.updateBgmUI();
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.updateBgmUI();
  }

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    localStorage.setItem("efoo_bgm_enabled", String(this.bgmEnabled));
    if (this.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    this.updateBgmUI();
    return this.bgmEnabled;
  }

  updateBgmUI() {
    const lbl = document.getElementById("bgm-status-lbl");
    const btn = document.getElementById("btn-toggle-bgm");
    const on = this.bgmEnabled && this.bgmPlaying;
    if (lbl) lbl.textContent = on ? "MUSIC ON" : "MUSIC OFF";
    if (btn) btn.classList.toggle("active", on);
  }

  playBgmStep() {
    if (!this.ctx || !this.bgmPlaying || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const step = this.bgmStep % 32;
    this.bgmStep++;

    // 1. Kick Drum (Quarter notes: 0, 4, 8, 12, 16, 20, 24, 28)
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.08);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(now);
      osc.stop(now + 0.13);
    }

    // 2. Snare / Rim Clap (Offbeats: 4, 12, 20, 28)
    if (step === 4 || step === 12 || step === 20 || step === 28) {
      if (this.noiseBuffer) {
        const nSrc = this.ctx.createBufferSource();
        nSrc.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1600, now);
        filter.Q.setValueAtTime(1.8, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        nSrc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);
        nSrc.start(now);
        nSrc.stop(now + 0.1);
      }
    }

    // 3. Hi-Hat Shaker (Steps 2, 6, 10, 14, 18, 22, 26, 30)
    if (step % 2 === 0) {
      if (this.noiseBuffer) {
        const nSrc = this.ctx.createBufferSource();
        nSrc.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(7500, now);
        const gain = this.ctx.createGain();
        const vol = (step % 4 === 2) ? 0.08 : 0.04;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        nSrc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);
        nSrc.start(now);
        nSrc.stop(now + 0.035);
      }
    }

    // 4. Funky Synth Bassline (Em / G pentatonic groove)
    const bassMap = {
      0: 82.41,
      3: 82.41,
      6: 98.00,
      8: 110.00,
      11: 123.47,
      14: 146.83,
      16: 82.41,
      19: 98.00,
      22: 110.00,
      26: 146.83,
      28: 123.47,
      30: 98.00
    };

    if (bassMap[step]) {
      const bOsc = this.ctx.createOscillator();
      const bFilter = this.ctx.createBiquadFilter();
      const bGain = this.ctx.createGain();
      bOsc.type = "sawtooth";
      bOsc.frequency.setValueAtTime(bassMap[step], now);
      bFilter.type = "lowpass";
      bFilter.frequency.setValueAtTime(450, now);
      bFilter.Q.setValueAtTime(3.5, now);
      bFilter.frequency.exponentialRampToValueAtTime(140, now + 0.16);
      bGain.gain.setValueAtTime(0.19, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      bOsc.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(this.bgmGain);
      bOsc.start(now);
      bOsc.stop(now + 0.18);
    }

    // 5. Warm Chilled Neo-Soul Chords (Steps 0, 16)
    if (step === 0 || step === 16) {
      const chordFreqs = step === 0 ? [164.81, 196.00, 246.94, 293.66] : [130.81, 164.81, 196.00, 246.94];
      chordFreqs.forEach((freq) => {
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = "triangle";
        cOsc.frequency.setValueAtTime(freq, now);
        cGain.gain.setValueAtTime(0.025, now);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        cOsc.connect(cGain);
        cGain.connect(this.bgmGain);
        cOsc.start(now);
        cOsc.stop(now + 0.65);
      });
    }
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
        this.buildNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  buildNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
    }
    this.noiseBuffer = buffer;
  }

  // Modern acoustic football strike: transient leather snap + resonant sub-bass thump
  playKick(isSweet, isRocket) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Transient Leather Pop (short high-frequency click)
    if (this.noiseBuffer) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = "bandpass";
      nFilter.frequency.setValueAtTime(isRocket ? 1800 : 1200, now);
      nFilter.Q.setValueAtTime(2.5, now);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.35, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      nSrc.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.ctx.destination);
      nSrc.start(now);
      nSrc.stop(now + 0.03);
    }

    // 2. Sub-bass Football Body Thud (125Hz ramping down into 38Hz sub-bass)
    const oSub = this.ctx.createOscillator();
    const gSub = this.ctx.createGain();
    oSub.type = "sine";
    oSub.frequency.setValueAtTime(isSweet ? 145 : 120, now);
    oSub.frequency.exponentialRampToValueAtTime(36, now + 0.18);
    gSub.gain.setValueAtTime(isRocket ? 0.65 : 0.48, now);
    gSub.gain.exponentialRampToValueAtTime(0.001, now + (isRocket ? 0.32 : 0.22));
    oSub.connect(gSub);
    gSub.connect(this.ctx.destination);
    oSub.start(now);
    oSub.stop(now + 0.35);

    // 3. Midrange boot contact punch
    const oMid = this.ctx.createOscillator();
    const gMid = this.ctx.createGain();
    oMid.type = "triangle";
    oMid.frequency.setValueAtTime(isSweet ? 95 : 75, now);
    oMid.frequency.linearRampToValueAtTime(45, now + 0.08);
    gMid.gain.setValueAtTime(0.25, now);
    gMid.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    oMid.connect(gMid);
    gMid.connect(this.ctx.destination);
    oMid.start(now);
    oMid.stop(now + 0.1);
  }

  // Realistic nylon goal net snap & swoosh
  playNetSwish() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.28);
    filter.Q.setValueAtTime(1.8, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(now);
    src.stop(now + 0.38);
  }

  // Authentic stadium crowd roar with bandpass noise crescendo and arena sub rumble
  playGoalCheer() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNetSwish();

    // 1. Stadium crowd roar using filtered noise
    if (this.noiseBuffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.setValueAtTime(750, now);
      bpf.frequency.linearRampToValueAtTime(1450, now + 0.45);
      bpf.frequency.linearRampToValueAtTime(900, now + 1.8);
      bpf.Q.setValueAtTime(1.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      src.connect(bpf);
      bpf.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);
      src.stop(now + 2.1);
    }

    // 2. Stadium sub-bass rumble
    const sub = this.ctx.createOscillator();
    const subG = this.ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(58, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + 0.65);
    subG.gain.setValueAtTime(0.001, now);
    subG.gain.linearRampToValueAtTime(0.35, now + 0.08);
    subG.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    sub.connect(subG);
    subG.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 0.75);
  }

  // Sad descending "wah-wah" brass sting plus disappointed crowd groan (match lost)
  playDefeat() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [392, 370, 349, 262];
    notes.forEach((f, i) => {
      const t = now + i * 0.42;
      const dur = i === notes.length - 1 ? 1.1 : 0.4;
      const osc = this.ctx.createOscillator();
      const lp = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, t);
      if (i === notes.length - 1) osc.frequency.exponentialRampToValueAtTime(f * 0.82, t + dur);
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(900, t);
      lp.frequency.linearRampToValueAtTime(380, t + dur);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(lp);
      lp.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
    if (this.noiseBuffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.setValueAtTime(700, now);
      bpf.frequency.linearRampToValueAtTime(320, now + 1.6);
      bpf.Q.setValueAtTime(0.9, now);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.16, now + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      src.connect(bpf);
      bpf.connect(g);
      g.connect(this.ctx.destination);
      src.start(now);
      src.stop(now + 1.9);
    }
  }

  // Authentic crowd applause & clapping (for heroic goalkeeper saves & goals)
  playApplause() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;

    // 1. Warm crowd cheering undertone
    const bg = this.ctx.createBufferSource();
    bg.buffer = this.noiseBuffer;
    const bgFilter = this.ctx.createBiquadFilter();
    bgFilter.type = "bandpass";
    bgFilter.frequency.setValueAtTime(850, now);
    bgFilter.frequency.linearRampToValueAtTime(1250, now + 0.35);
    bgFilter.frequency.linearRampToValueAtTime(750, now + 1.8);
    bgFilter.Q.setValueAtTime(1.5, now);
    const bgGain = this.ctx.createGain();
    bgGain.gain.setValueAtTime(0.001, now);
    bgGain.gain.linearRampToValueAtTime(0.24, now + 0.12);
    bgGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);
    bg.connect(bgFilter);
    bgFilter.connect(bgGain);
    bgGain.connect(this.ctx.destination);
    bg.start(now);
    bg.stop(now + 2.2);

    // 2. Dense acoustic handclap impulses spread across the stadium
    const claps = 30;
    for (let i = 0; i < claps; i++) {
      const clapTime = now + 0.04 + (i / claps) * 1.5 + (Math.random() - 0.5) * 0.08;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.setValueAtTime(1050 + Math.random() * 550, clapTime);
      bpf.Q.setValueAtTime(3.4, clapTime);
      const g = this.ctx.createGain();
      const vol = 0.10 + Math.random() * 0.18;
      g.gain.setValueAtTime(0.001, clapTime);
      g.gain.linearRampToValueAtTime(vol, clapTime + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.038);
      src.connect(bpf);
      bpf.connect(g);
      g.connect(this.ctx.destination);
      src.start(clapTime);
      src.stop(clapTime + 0.045);
    }
  }

  // Hollow aluminum goalpost clang with authentic inharmonic overtones
  playPostClang() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const partials = [
      { f: 835, g: 0.28, d: 0.8 },
      { f: 1670, g: 0.16, d: 0.55 },
      { f: 2420, g: 0.12, d: 0.4 },
      { f: 3340, g: 0.08, d: 0.25 }
    ];
    partials.forEach((p) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(p.f, now);
      g.gain.setValueAtTime(p.g, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + p.d);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + p.d + 0.02);
    });
  }

  // Padded leather glove punch / heroic save deflection
  playSaveBlock() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Leather friction / glove impact snap
    if (this.noiseBuffer) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const nF = this.ctx.createBiquadFilter();
      nF.type = "bandpass";
      nF.frequency.setValueAtTime(850, now);
      nF.Q.setValueAtTime(3.0, now);
      const nG = this.ctx.createGain();
      nG.gain.setValueAtTime(0.28, now);
      nG.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      nSrc.connect(nF);
      nF.connect(nG);
      nG.connect(this.ctx.destination);
      nSrc.start(now);
      nSrc.stop(now + 0.07);
    }

    // Heavy padded thump (145Hz down to 48Hz)
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(145, now);
    o.frequency.exponentialRampToValueAtTime(48, now + 0.15);
    g.gain.setValueAtTime(0.42, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.2);
  }

  // Professional Fox 40 referee whistle blast (dual acoustic frequencies 2840Hz & 3110Hz + breath air)
  playSingleWhistleBlast(startTime, duration = 0.38, gainMultiplier = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = startTime !== null && startTime !== undefined ? startTime : this.ctx.currentTime;
    [2840, 3110].forEach((freq) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.13 * gainMultiplier, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + duration + 0.02);
    });

    if (this.noiseBuffer) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const nF = this.ctx.createBiquadFilter();
      nF.type = "bandpass";
      nF.frequency.setValueAtTime(3000, now);
      nF.Q.setValueAtTime(4.0, now);
      const nG = this.ctx.createGain();
      nG.gain.setValueAtTime(0.001, now);
      nG.gain.linearRampToValueAtTime(0.06 * gainMultiplier, now + 0.015);
      nG.gain.exponentialRampToValueAtTime(0.001, now + duration);
      nSrc.connect(nF);
      nF.connect(nG);
      nG.connect(this.ctx.destination);
      nSrc.start(now);
      nSrc.stop(now + duration + 0.02);
    }
  }

  playWhistle() {
    this.playSingleWhistleBlast(this.ctx?.currentTime, 0.42, 1.0);
  }

  // Classic football referee full-time triple whistle (pip, pip, piiiiiiiiiiiip!)
  playMatchEndWhistle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // 1st blast: short (0.18s)
    this.playSingleWhistleBlast(now, 0.18, 1.0);
    // 2nd blast: short (0.18s) after 0.26s
    this.playSingleWhistleBlast(now + 0.26, 0.18, 1.05);
    // 3rd blast: long decisive full-time blast (0.72s) after 0.54s
    this.playSingleWhistleBlast(now + 0.54, 0.72, 1.25);
  }

  // Futuristic skill activation surge
  playSkillFire() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(65, now);
    o.frequency.exponentialRampToValueAtTime(420, now + 0.22);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.25, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.38);
  }

  // Matrix Time Warp slow-down sound
  playMatrixSlow() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(220, now);
    o.frequency.exponentialRampToValueAtTime(48, now + 0.45);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(180, now + 0.45);
    g.gain.setValueAtTime(0.22, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    o.connect(filter);
    filter.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.52);
  }

  playIntroImpact() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [130.81, 164.81, 196.0, 261.63].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, now + i * 0.08);
      g.gain.setValueAtTime(0.001, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.65);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.7);
    });
  }

  playVarSiren() {
    this.playWhistle();
  }

  playHeartbeat() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(52, now);
    o.frequency.exponentialRampToValueAtTime(30, now + 0.12);
    g.gain.setValueAtTime(0.35, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.15);
  }

  // Euphoric Golden 2X Multiplier Target Impact Chime & Rising Fanfare Arpeggio
  playMultiplier2xHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Heavy visceral sub-bass punch impact
    const punch = this.ctx.createOscillator();
    const punchG = this.ctx.createGain();
    punch.type = "sine";
    punch.frequency.setValueAtTime(175, now);
    punch.frequency.exponentialRampToValueAtTime(40, now + 0.19);
    punchG.gain.setValueAtTime(0.48, now);
    punchG.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    punch.connect(punchG);
    punchG.connect(this.ctx.destination);
    punch.start(now);
    punch.stop(now + 0.24);

    // 2. Ascending 6-note crystal gold arpeggio with shimmer bell harmonics
    const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98, 1760.0]; // D-maj crystal arpeggio
    notes.forEach((freq, i) => {
      const t = now + i * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);

      // Bell sparkle harmonics
      const shimmer = this.ctx.createOscillator();
      const shimmerG = this.ctx.createGain();
      shimmer.type = "sine";
      shimmer.frequency.setValueAtTime(freq * 2, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.26, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.46);

      shimmerG.gain.setValueAtTime(0.001, t);
      shimmerG.gain.linearRampToValueAtTime(0.14, t + 0.01);
      shimmerG.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      shimmer.connect(shimmerG);
      shimmerG.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.48);
      shimmer.start(t);
      shimmer.stop(t + 0.35);
    });

    // 3. Sci-fi multiplier energy shimmer bandpass sweep
    const sweep = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const sweepG = this.ctx.createGain();
    sweep.type = "sawtooth";
    sweep.frequency.setValueAtTime(420, now);
    sweep.frequency.exponentialRampToValueAtTime(1860, now + 0.4);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(750, now);
    filter.frequency.linearRampToValueAtTime(2450, now + 0.4);
    filter.Q.setValueAtTime(3.8, now);

    sweepG.gain.setValueAtTime(0.001, now);
    sweepG.gain.linearRampToValueAtTime(0.2, now + 0.06);
    sweepG.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

    sweep.connect(filter);
    filter.connect(sweepG);
    sweepG.connect(this.ctx.destination);
    sweep.start(now);
    sweep.stop(now + 0.46);
  }
}

const audio = new ModernStadiumAudio();

// ============================================================================
// STATE & IMAGE ASSETS
// ============================================================================
let currentLang = "en";
localStorage.setItem("efoo_game_lang", "en");
let connectedAddress = localStorage.getItem("efoo_wallet_address") || localStorage.getItem("multiversx_address") || "";
let connectedProvider = localStorage.getItem("efoo_wallet_provider") || localStorage.getItem("multiversx_provider") || "webwallet";
if (connectedAddress && connectedAddress.startsWith("erd1qyu5wthldz")) {
  connectedAddress = "";
  connectedProvider = "";
  localStorage.removeItem("efoo_wallet_address");
  localStorage.removeItem("multiversx_address");
}
if (connectedAddress && connectedAddress.startsWith("erd1")) {
  try {
    localStorage.setItem("efoo_wallet_address", connectedAddress);
    localStorage.setItem("efoo_wallet_provider", connectedProvider);
    localStorage.setItem("multiversx_address", connectedAddress);
    localStorage.setItem("multiversx_provider", connectedProvider);
  } catch (e) {}
}
let wcSignClient = null;
let wcSessionTopic = localStorage.getItem("efoo_wc_topic") || "";
let pendingGateAction = null; // "buy_efoo" | "mint_nft" | null

function isInsideXPortal() {
  if (typeof window === "undefined") return false;
  const ua = (navigator.userAgent || "").toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("xportal") ||
    params.get("ref") === "xportal" ||
    ua.includes("xportal") ||
    ua.includes("maiar") ||
    typeof window.ReactNativeWebView !== "undefined" ||
    (typeof window.webkit !== "undefined" && typeof window.webkit.messageHandlers !== "undefined")
  );
}

function isMobileScreen() {
  return typeof window !== "undefined" && (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || ""));
}

// If wallet address is present and DeFi extension is available, prefer extension to avoid webwallet redirects
if (connectedAddress && typeof window !== "undefined" && (window.multiversxWallet || window.elrondWallet || window.multiversx || window.elrond) && connectedProvider !== "xportal" && connectedProvider !== "inspector" && connectedProvider !== "phantom") {
  connectedProvider = "extension";
  localStorage.setItem("efoo_wallet_provider", "extension");
  localStorage.setItem("multiversx_provider", "extension");
}

// Sanitize any legacy demo/inspector session so only real authenticated wallets work
if (connectedProvider && !VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
  connectedAddress = "";
  connectedProvider = "";
  localStorage.removeItem("efoo_wallet_address");
  localStorage.removeItem("efoo_wallet_provider");
}

let walletState = {
  loading: false,
  verified: false,
  shard: 0,
  nonce: 0,
  efooBalance: 0,
  playersCount: 0,
  keepersCount: 0,
  ownedNfts: []
};

let strikerIdx = 0;
let keeperIdx = 0;
let activeStriker = STRIKER_ROSTER[0];
let activeKeeper = KEEPER_ROSTER[0];

const imgs = {
  ball: new Image(),
  striker: new Image(),
  keeper: new Image(),
  crest: new Image()
};
imgs.ball.src = "branding/original/assests-2022/logo.png";
imgs.crest.src = "branding/rebranded/efoo-degen-crest-200x200.png";

function toCorsUrl(rawUrl, size = 300) {
  if (!rawUrl) return "branding/original/EFOOTBALL-91a4eb/logo.png";
  if (rawUrl.startsWith("branding/") || rawUrl.startsWith("data:")) return rawUrl;
  return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=${size}&h=${size}&fit=cover&output=png`;
}

function canPlayMatch() {
  return true; // Free-to-Play accessible to everyone: Rookie F2P with 0 base skills, or Web3 with unlocked NFT slots!
}

// ============================================================================
// LEVELS (1–20): EVERY LEVEL IS A BOSS KEEPER — THE KEEPER READS YOU BETTER,
// THE AIM SHAKES MORE, THE SWEET SPOT SHRINKS AND WIND PICKS UP
// ============================================================================
const MAX_LEVEL = 20;
const SHOTS_PER_MATCH = 5;

const LEVEL_TIERS = [
  { from: 1, name: "SUNDAY LEAGUE", nameRo: "LIGA DE DUMINICĂ", color: "#a8ff00" },
  { from: 5, name: "AMATEUR CUP", nameRo: "CUPA AMATORILOR", color: "#38bdf8" },
  { from: 9, name: "PRO LEAGUE", nameRo: "LIGA PRO", color: "#ffb800" },
  { from: 13, name: "CHAMPIONS", nameRo: "CAMPIONII", color: "#fb923c" },
  { from: 17, name: "WORLD CLASS", nameRo: "CLASA MONDIALĂ", color: "#ef4444" },
  { from: 20, name: "LEGEND BOSS", nameRo: "BOSS LEGENDĂ", color: "#e879f9" }
];

function getLevelTier(level) {
  let tier = LEVEL_TIERS[0];
  LEVEL_TIERS.forEach((t) => {
    if (level >= t.from) tier = t;
  });
  return tier;
}

function getLevelParams(level) {
  const L = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level) || 1));
  const t = (L - 1) / (MAX_LEVEL - 1); // 0 → 1
  return {
    level: L,
    t,
    goalsNeeded: 2 + Math.floor((L - 1) / 7), // L1-7: 2/5 • L8-14: 3/5 • L15-20: 4/5
    keeperSigma: 0.5 - 0.3 * t, // how badly the keeper misreads the shot (lower = reads better)
    keeperReach: 0.34 + 0.16 * t, // how far he can stretch
    commitLean: 0.55 - 0.3 * t, // chance he ignores the ball and dives to his gut-feeling side
    sway: 0.025 + 0.14 * t, // crosshair shake amplitude
    swaySpeed: 1 + 1.2 * t,
    chargeSpeed: 0.024 + 0.02 * t, // power bar speed
    sweetMin: 0.4 + 0.12 * t, // power sweet-spot window shrinks with level
    sweetMax: 0.9 - 0.12 * t,
    windMax: L < 6 ? 0 : 0.05 + 0.17 * ((L - 6) / (MAX_LEVEL - 6)),
    scoreMul: 1 + (L - 1) * 0.12
  };
}

// ============================================================================
// SUPER SKILLS — BOUGHT WITH $EFOO, ARMED BEFORE THE KICK, ONE CHARGE PER SHOT
// ============================================================================
const SKILLS = [
  {
    id: "steady",
    icon: "🎯",
    img: "branding/rebranded/skill-laser-aim-badge.png",
    name: "ICE VEINS",
    nameHu: "HIDEGVÉR",
    nameRo: "NERVI DE OȚEL",
    desc: "Crosshair stops shaking for your next shot.",
    descHu: "A célkereszt stabilizálódik a következő lövésnél.",
    descRo: "Cursorul nu mai tremură la următorul șut.",
    price: 3500,
    color: "#38bdf8"
  },
  {
    id: "power",
    icon: "🚀",
    img: "branding/rebranded/skill-rocket-ball-badge.png",
    name: "ROCKET SHOT",
    nameHu: "RAKÉTA LÖVÉS",
    nameRo: "ȘUT RACHETĂ",
    desc: "Much wider power sweet-spot + keeper reach -25%.",
    descHu: "Tágabb sweet-spot + a kapus elérési távolsága 25%-kal kisebb.",
    descRo: "Zonă de putere mult mai largă + portarul ajunge cu 25% mai puțin.",
    price: 6000,
    color: "#fb923c"
  },
  {
    id: "freeze",
    icon: "🧊",
    img: "branding/rebranded/skill-freeze-keeper-badge.png",
    name: "KEEPER FREEZE",
    nameHu: "KAPUS FAGYASZTÁS",
    nameRo: "PORTAR ÎNGHEȚAT",
    desc: "Keeper reacts late: reach −45% and dives wrong way.",
    descHu: "A kapus késve reagál: −45% elérés és elugrik a rossz irányba.",
    descRo: "Portarul reacționează târziu: rază −45% și ghicește des greșit.",
    price: 8500,
    color: "#67e8f9"
  },
  {
    id: "curve",
    icon: "🌀",
    img: "branding/rebranded/skill-banana-curve-badge.png",
    name: "BANANA CURVE",
    nameHu: "KIFLI CSAVARÁS",
    nameRo: "ȘUT CU EFECT",
    desc: "Ball bends hard — keeper misreads it 70% worse.",
    descHu: "Erősen kanyarodó labda — a kapus jóval nehezebben védi ki.",
    descRo: "Mingea face efect puternic — portarul o citește cu 70% mai prost.",
    price: 4500,
    color: "#c084fc"
  },
  {
    id: "gold",
    icon: "💰",
    img: "branding/rebranded/skill-gold-multiplier-badge.png",
    name: "GOLD x2",
    nameHu: "DUPLA ARANY (2x)",
    nameRo: "AUR x2",
    desc: "Double points and score if this shot scores.",
    descHu: "Dupla pontszám és bónusz, ha a labda gól lesz.",
    descRo: "Puncte duble dacă șutul înscrie.",
    price: 2500,
    color: "#ffb800"
  }
];

// ============================================================================
// GOALKEEPER SUPER SKILLS (USED DURING DEFENSE TURNS)
// ============================================================================
const KEEPER_SKILLS = [
  {
    id: "iron_wall",
    icon: "🛡️",
    img: "branding/rebranded/skill-iron-wall-badge.png",
    name: "IRON WALL",
    nameHu: "ACÉLFAL",
    nameRo: "ZID DE OȚEL",
    desc: "Reinforces goal posts & expands keeper save area by 50%.",
    descHu: "A kapus teste megnő, a védési felület 50%-kal nagyobb.",
    descRo: "Aria de intervenție a portarului crește cu 50%.",
    price: 3500,
    color: "#38bdf8"
  },
  {
    id: "spider_reach",
    icon: "🧤",
    img: "branding/rebranded/skill-giant-gloves-badge.png",
    name: "SPIDER REACH",
    nameHu: "POLIP NYÚLÁS",
    nameRo: "REACH TENTACULAR",
    desc: "Supernatural dive reach across the entire goalmouth.",
    descHu: "Óriási kézméret és ugrótávolság az egész kapura.",
    descRo: "Săritură extinsă și mănuși uriașe pe toată poarta.",
    price: 6000,
    color: "#22c55e"
  },
  {
    id: "matrix_reflex",
    icon: "⏱️",
    img: "branding/rebranded/skill-matrix-warp-badge.png",
    name: "MATRIX TIME WARP",
    nameHu: "MÁTRIX IDŐLASSÍTÁS",
    nameRo: "MATRIX BULLET TIME",
    desc: "Slows the ball speed by 50% giving full dive reaction time.",
    descHu: "50%-kal lelassítja a labdát, megkönnyítve a védést.",
    descRo: "Încetinește mingea cu 50% pentru reacție maximă.",
    price: 7500,
    color: "#a855f7"
  },
  {
    id: "mind_read",
    icon: "👁️",
    img: "branding/rebranded/skill-mind-radar-badge.png",
    name: "MIND READ RADAR",
    nameHu: "GONDOLATOLVASÁS",
    nameRo: "CITIREA MINȚII",
    desc: "Holographic aura reveals exact AI shot target before the kick.",
    descHu: "Holografikus aura mutatja a gép lövésének pontos helyét.",
    descRo: "Aura holografică dezvăluie ținta exactă a șutului AI.",
    price: 9500,
    color: "#ffb800"
  }
];

function randGauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(-2.2, Math.min(2.2, z));
}

function clampNum(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ============================================================================
// NFT RARITY & SKILLS SCALING (ROOKIE F2P, COMMON, RARE, EPIC, LEGENDARY)
// ============================================================================
function getPowers() {
  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));
  if (!isConnected) {
    return {
      pCount: 0,
      kCount: 0,
      efoo: 0,
      strikerRarity: { id: "rookie", name: "Rookie", mult: 1.0, slots: 0 },
      keeperRarity: { id: "rookie", name: "Rookie", mult: 1.0, slots: 0 },
      strikerSlots: 0,
      keeperSlots: 0,
      aimBonusPct: 0,
      swayMul: 1.0,
      sweetBonus: 0,
      keeperSigmaMul: 1.15,
      totalMult: 1.0,
      maxShields: 0,
      hasCurve: false,
      hasRadar: false,
      hasTwinBall: false,
      hasRocket: false,
      rocketPts: 0,
      isPro: false
    };
  }

  const strikerRarity = getNftRarityInfo(activeStriker);
  const keeperRarity = getNftRarityInfo(activeKeeper);
  const pCount = walletState.playersCount;
  const kCount = walletState.keepersCount;
  const efoo = walletState.efooBalance;

  // Unlocked skill slots determined by the active player / keeper rarity:
  // ROOKIE: 0 slots (F2P) • COMMON: 1 slot • RARE: 2 slots • EPIC: 3 slots • LEGENDARY: 4 slots
  const strikerSlots = strikerRarity.slots;
  const keeperSlots = keeperRarity.slots;

  let mult = strikerRarity.mult;
  let keeperMult = keeperRarity.mult;

  // Synergies if user holds multiple NFTs
  if (pCount >= 6) mult += 2.0;
  else if (pCount >= 3) mult += 1.0;

  let swayMul = 1.0;
  if (strikerRarity.id === "mythic") swayMul = 0.40;
  else if (strikerRarity.id === "legendary") swayMul = 0.55;
  else if (strikerRarity.id === "epic") swayMul = 0.70;
  else if (strikerRarity.id === "rare") swayMul = 0.85;
  else if (strikerRarity.id === "common") swayMul = 0.95;

  const hasRocket = efoo >= MIN_EFOO_REQUIRED;
  const rocketPts = efoo >= 10000000 ? 3000 : hasRocket ? 1000 : 0;
  const isUltras = hasUltrasPass(connectedAddress);
  if (isUltras) mult += 0.25;

  const baseShields = keeperRarity.slots >= 5 ? 3 : (keeperRarity.slots >= 3 ? 2 : (keeperRarity.slots >= 1 ? 1 : 0));
  const maxShields = isUltras ? Math.max(1, baseShields + 1) : baseShields;

  return {
    pCount,
    kCount,
    efoo,
    strikerRarity,
    keeperRarity,
    strikerSlots,
    keeperSlots,
    aimBonusPct: Math.round((1 - swayMul) * 100),
    swayMul,
    sweetBonus: strikerRarity.id === "mythic" ? 0.12 : (strikerRarity.id === "legendary" ? 0.08 : (strikerRarity.id === "epic" ? 0.05 : 0.02)),
    keeperSigmaMul: 1.15,
    totalMult: Number((mult + (keeperMult - 1.0)).toFixed(2)),
    maxShields,
    hasCurve: strikerSlots >= 1,
    hasRadar: strikerSlots >= 3 || keeperSlots >= 3,
    hasTwinBall: strikerSlots >= 4,
    hasRocket,
    rocketPts,
    isUltrasPass: isUltras,
    isPro: pCount >= 1 || kCount >= 1 || hasRocket || isUltras || strikerRarity.id !== "rookie"
  };
}

// ============================================================================
// GAMEPLAY & 3D CANVAS GEOMETRY STATE
// ============================================================================
const game = {
  phase: "start", // "start" | "intro" | "aim" | "charging" | "flight" | "defend_aim" | "defend_flight" | "celebrate" | "var_review" | "summary"
  round: 1,
  maxRounds: SHOTS_PER_MATCH,
  shootoutTurn: "shoot", // "shoot" (user kicks) | "defend" (AI kicks, user dives)
  userGoals: 0,
  aiGoals: 0,
  userShotHistory: [],
  aiShotHistory: [],
  aiTargetNx: 0,
  aiTargetNy: 0,
  level: 1,
  levelCleared: false,
  shotHistory: [], // legacy alias
  goals: 0,
  streak: 0,
  score: 0,
  rawBaseScore: 0,
  shieldsLeft: 0,
  fomoPot: 25400000,
  revivedThisMatch: false,
  varCountdown: 10,
  varTimerInterval: null,

  // Super skills: armed = chosen for NEXT kick/defense, activeFx = what current shot is using
  armed: {},
  activeFx: {},
  skillFlash: null, // { text, color, life }

  // Aim coordinates relative to the goal: nx in [-1, 1] = post to post, ny in [0, 1] = grass to crossbar.
  aimNx: -0.65,
  aimNy: 0.72,
  swayX: 0, // live crosshair shake (grows with level)
  swayY: 0,
  wind: 0, // sideways drift applied to the ball (from level 6)
  _lastT: 0,

  // Swipe-to-shoot mechanic (Soccer Strike / Score! Hero style)
  swipe: {
    active: false,
    pointerId: null,
    points: [], // [{ x, y, t }]
    startTime: 0
  },
  shotHistoryZones: [], // Adaptive AI pattern memory: ['top_left', 'bottom_right', ...]

  // Hold-to-charge state (0.0 -> 1.0)
  isCharging: false,
  chargePower: 0,
  chargeDir: 1,

  // Moving 2x Golden Bullseye in normalized goal coords
  bullseyeNx: 0.68,
  bullseyeNy: 0.76,
  bullseyePhase: 0,

  // Keeper AI & Articulated Dive Physics
  keeper: {
    nx: 0, // -1 (left post) to +1 (right post)
    ny: 0, // 0 (ground) to 1 (crossbar)
    targetNx: 0,
    targetNy: 0,
    lean: 1, // the side he secretly favours this shot (-1 / +1)
    leanShown: 1, // what radar claims
    bodyAngle: 0,
    targetAngle: 0,
    armReach: 0
  },

  // 3D Ball Flight State
  ball: {
    active: false,
    t: 0, // 0.0 -> 1.0
    startX: 0,
    startY: 0,
    ctrlX: 0,
    ctrlY: 0,
    endX: 0,
    endY: 0,
    spin: 0,
    isSweet: false,
    isTwin: false,
    result: "goal", // "goal" | "save" | "wide" | "over" | "post" | "bar"
    ricochetMode: false
  },

  strikerLunge: 0,
  netImpactX: 0,
  netImpactY: 0,
  netRipple: 0,
  shake: 0,
  bigBanner: "",
  bigBannerColor: "#a8ff00",
  particles: [],
  crowdLights: [],
  // 2x Multiplier Golden FX State
  goldFlash: 0,
  bullseyeHitAnim: 0,
  multiplierShockwaves: [],
  goldFloatingBanner: null
};

function getAvailableStrikers() {
  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));
  if (!isConnected) {
    return [ROOKIE_STRIKER];
  }

  const walletStrikers = (walletState.ownedNfts || [])
    .filter((n) => n.collection === "EFOOTBALL-91a4eb")
    .map((n) => {
      const t = getNftRarityTier(n);
      return {
        identifier: n.identifier,
        name: (n.name || n.identifier).toUpperCase(),
        rarity: t.tierLabel,
        tier: t,
        ovr: 80 + t.slots * 4,
        trait: `⭐ ${t.tierLabel} #${t.rank} • ${t.slots} SKILL SLOTS`,
        traitHu: `⭐ ${t.tierLabel} #${t.rank} • ${t.slots} KÉPESSÉG HELY`,
        traitRo: `⭐ ${t.tierLabel} #${t.rank} • ${t.slots} SLOT-URI`,
        url: (n.media && n.media[0] && (n.media[0].url || n.media[0].thumbnailUrl)) || n.url
      };
    });

  if (walletStrikers.length > 0) {
    return [...walletStrikers, ...STRIKER_ROSTER];
  }
  return [ROOKIE_STRIKER, ...STRIKER_ROSTER];
}

function getAvailableKeepers() {
  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));
  if (!isConnected) {
    return [ROOKIE_KEEPER];
  }

  const walletKeepers = (walletState.ownedNfts || [])
    .filter((n) => n.collection === "GOALKEEPER-cb9e3e")
    .map((n) => {
      const t = getNftRarityTier(n);
      return {
        identifier: n.identifier,
        name: (n.name || n.identifier).toUpperCase(),
        jersey: String(n.nonce || "01").padStart(2, "0"),
        rarity: t.tierLabel,
        tier: t,
        ovr: 80 + t.slots * 4,
        trait: `🧤 ${t.tierLabel} #${t.rank} • ${t.slots} SKILL SLOTS`,
        traitHu: `🧤 ${t.tierLabel} #${t.rank} • ${t.slots} KÉPESSÉG HELY`,
        traitRo: `🧤 ${t.tierLabel} #${t.rank} • ${t.slots} SLOT-URI`,
        url: (n.media && n.media[0] && (n.media[0].url || n.media[0].thumbnailUrl)) || n.url
      };
    });

  if (walletKeepers.length > 0) {
    return [...walletKeepers, ...KEEPER_ROSTER];
  }
  return [ROOKIE_KEEPER, ...KEEPER_ROSTER];
}

function updateStrikerCardAssets(idx) {
  const pool = getAvailableStrikers();
  if (!pool || pool.length === 0) return;
  strikerIdx = (idx % pool.length + pool.length) % pool.length;
  activeStriker = pool[strikerIdx];

  const cors = toCorsUrl(activeStriker.url, 400);
  imgs.striker.crossOrigin = "anonymous";
  imgs.striker.src = cors;

  const tInfo = getNftRarityTier(activeStriker);
  const p = getPowers();

  // 1. Counter in header: ⚽ STRIKER (1/6)
  const titleEl = document.querySelector("#select-striker-card .smc-slot-title");
  if (titleEl) {
    titleEl.innerHTML = `⚽ STRIKER <span style="opacity:0.65; font-size:0.7rem; font-weight:700;">(${strikerIdx + 1}/${pool.length})</span>`;
  }

  // 2. Card outline & glow matching tier color
  const cardEl = document.getElementById("select-striker-card");
  if (cardEl) {
    cardEl.style.borderColor = tInfo.borderColor;
    cardEl.style.boxShadow = tInfo.tierKey !== "common" && tInfo.tierKey !== "rookie"
      ? `0 0 18px ${tInfo.borderColor}44`
      : "none";
  }

  // 3. Squad Selection Modal elements
  const startImg = document.getElementById("start-striker-img");
  const startName = document.getElementById("start-striker-name");
  const startRarity = document.getElementById("start-striker-rarity");
  const startMedia = document.getElementById("striker-slot-media");
  const startPowers = document.getElementById("start-striker-powers");

  if (startImg) startImg.src = cors;
  if (startName) startName.textContent = activeStriker.name;
  if (startRarity) {
    const rankLabel = tInfo.rank === "F2P" ? "F2P" : `#${tInfo.rank}`;
    startRarity.textContent = `${tInfo.tierIcon} ${tInfo.tierLabel} ${rankLabel}`;
    startRarity.style.borderColor = tInfo.borderColor;
    startRarity.style.color = tInfo.borderColor;
    startRarity.style.background = "rgba(0, 0, 0, 0.82)";
  }
  if (startMedia) {
    startMedia.style.borderColor = tInfo.borderColor;
    startMedia.style.boxShadow = tInfo.tierKey !== "common" && tInfo.tierKey !== "rookie"
      ? `0 0 20px ${tInfo.borderColor}66`
      : "none";
  }
  if (startPowers) {
    const pills = (tInfo.powers && tInfo.powers.length > 0)
      ? tInfo.powers.map(pw => `<span class="smc-power-pill" style="border-color:${tInfo.borderColor}77; color:${tInfo.borderColor}; background:${tInfo.borderColor}14;">${pw.icon} ${pw.name}</span>`)
      : [`<span class="smc-power-pill">⚡ 1.0x MULT</span>`];
    startPowers.innerHTML = pills.join("");
  }

  // 3b. Hub Start Screen Striker Card
  const hubStrikerImg = document.getElementById("hub-striker-img");
  const hubStrikerName = document.getElementById("hub-striker-name");
  const hubStrikerRarity = document.getElementById("hub-striker-rarity");
  const hubStrikerTrait = document.getElementById("hub-striker-trait");
  const hubStrikerCard = document.getElementById("hub-striker-card");

  if (hubStrikerImg) hubStrikerImg.src = cors;
  if (hubStrikerName) hubStrikerName.textContent = activeStriker.name;
  if (hubStrikerRarity) {
    const rankLabel = tInfo.rank === "F2P" ? "F2P" : `#${tInfo.rank}`;
    hubStrikerRarity.textContent = `${tInfo.tierIcon} ${tInfo.tierLabel} ${rankLabel}`;
    hubStrikerRarity.style.borderColor = tInfo.borderColor;
    hubStrikerRarity.style.color = tInfo.borderColor;
  }
  if (hubStrikerTrait) {
    hubStrikerTrait.textContent = activeStriker.trait || "FLAMING ROCKET BALL";
  }
  if (hubStrikerCard) {
    hubStrikerCard.style.borderColor = tInfo.borderColor;
    hubStrikerCard.style.boxShadow = (tInfo.tierKey !== "common" && tInfo.tierKey !== "rookie")
      ? `0 0 24px ${tInfo.borderColor}44`
      : "none";
  }

  // 4. Update start screen badge
  const cscSquad = document.getElementById("csc-squad-status");
  if (cscSquad) {
    const rankLbl = tInfo.rank === "F2P" ? "" : ` #${tInfo.rank}`;
    cscSquad.innerHTML = `⚽ <span>${activeStriker.name} (${tInfo.tierLabel}${rankLbl})</span>`;
    cscSquad.style.borderColor = tInfo.borderColor;
    cscSquad.style.color = tInfo.borderColor;
  }

  // 5. HUD elements
  const hudImg = document.getElementById("hud-striker-img");
  const hudOvr = document.getElementById("hud-striker-ovr");
  const hudName = document.getElementById("hud-striker-name");
  const hudTrait = document.getElementById("hud-striker-trait");
  if (hudImg) hudImg.src = cors;
  if (hudOvr) hudOvr.textContent = String(activeStriker.ovr || 85);
  if (hudName) hudName.textContent = activeStriker.name;
  if (hudTrait) hudTrait.textContent = p.aimBonusPct > 0 ? `${activeStriker.trait} • AIM +${p.aimBonusPct}%` : `${activeStriker.trait} • LVL ${game.level}`;

  const introImg = document.getElementById("intro-striker-img");
  const introName = document.getElementById("intro-striker-name");
  if (introImg) introImg.src = cors;
  if (introName) introName.textContent = activeStriker.name;
}

function updateKeeperAssets(idx) {
  const pool = getAvailableKeepers();
  if (!pool || pool.length === 0) return;
  keeperIdx = (idx % pool.length + pool.length) % pool.length;
  activeKeeper = pool[keeperIdx];

  const cors = toCorsUrl(activeKeeper.url, 400);
  imgs.keeper.crossOrigin = "anonymous";
  imgs.keeper.src = cors;

  const tInfo = getNftRarityTier(activeKeeper);

  // 1. Counter in header: 🧤 GOALKEEPER (1/4)
  const titleEl = document.querySelector("#select-keeper-card .smc-slot-title");
  if (titleEl) {
    titleEl.innerHTML = `🧤 GOALKEEPER <span style="opacity:0.65; font-size:0.7rem; font-weight:700;">(${keeperIdx + 1}/${pool.length})</span>`;
  }

  // 2. Card outline & glow matching tier color
  const cardEl = document.getElementById("select-keeper-card");
  if (cardEl) {
    cardEl.style.borderColor = tInfo.borderColor;
    cardEl.style.boxShadow = tInfo.tierKey !== "common" && tInfo.tierKey !== "rookie"
      ? `0 0 18px ${tInfo.borderColor}44`
      : "none";
  }

  // 3. Squad Selection Modal elements
  const startK = document.getElementById("start-keeper-img");
  const startKName = document.getElementById("start-keeper-name");
  const startKRarity = document.getElementById("start-keeper-rarity");
  const startKMedia = document.getElementById("keeper-slot-media");
  const startKPowers = document.getElementById("start-keeper-powers");

  if (startK) startK.src = cors;
  if (startKName) startKName.textContent = activeKeeper.name;
  if (startKRarity) {
    const rankLabel = tInfo.rank === "F2P" ? "F2P" : `#${tInfo.rank}`;
    startKRarity.textContent = `${tInfo.tierIcon} ${tInfo.tierLabel} ${rankLabel}`;
    startKRarity.style.borderColor = tInfo.borderColor;
    startKRarity.style.color = tInfo.borderColor;
    startKRarity.style.background = "rgba(0, 0, 0, 0.82)";
  }
  if (startKMedia) {
    startKMedia.style.borderColor = tInfo.borderColor;
    startKMedia.style.boxShadow = tInfo.tierKey !== "common" && tInfo.tierKey !== "rookie"
      ? `0 0 20px ${tInfo.borderColor}66`
      : "none";
  }
  if (startKPowers) {
    const pills = (tInfo.powers && tInfo.powers.length > 0)
      ? tInfo.powers.map(pw => `<span class="smc-power-pill" style="border-color:${tInfo.borderColor}77; color:${tInfo.borderColor}; background:${tInfo.borderColor}14;">${pw.icon} ${pw.name}</span>`)
      : [`<span class="smc-power-pill" style="border-color:#38bdf8; color:#38bdf8; background:rgba(56,189,248,0.12);">🛡️ 1 SHIELD</span>`];
    startKPowers.innerHTML = pills.join("");
  }

  // 3b. Hub Start Screen Keeper Card
  const hubKeeperImg = document.getElementById("hub-keeper-img");
  const hubKeeperName = document.getElementById("hub-keeper-name");
  const hubKeeperRarity = document.getElementById("hub-keeper-rarity");
  const hubKeeperTrait = document.getElementById("hub-keeper-trait");
  const hubKeeperCard = document.getElementById("hub-keeper-card");

  if (hubKeeperImg) hubKeeperImg.src = cors;
  if (hubKeeperName) hubKeeperName.textContent = activeKeeper.name;
  if (hubKeeperRarity) {
    const rankLabel = tInfo.rank === "F2P" ? "F2P" : `#${tInfo.rank}`;
    hubKeeperRarity.textContent = `${tInfo.tierIcon} ${tInfo.tierLabel} ${rankLabel}`;
    hubKeeperRarity.style.borderColor = tInfo.borderColor;
    hubKeeperRarity.style.color = tInfo.borderColor;
  }
  if (hubKeeperTrait) {
    hubKeeperTrait.textContent = activeKeeper.trait || "SAVE SHIELD ACTIVE";
  }
  if (hubKeeperCard) {
    hubKeeperCard.style.borderColor = tInfo.borderColor;
    hubKeeperCard.style.boxShadow = (tInfo.tierKey !== "common" && tInfo.tierKey !== "rookie")
      ? `0 0 24px ${tInfo.borderColor}44`
      : "none";
  }

  const introK = document.getElementById("intro-keeper-img");
  const introKName = document.getElementById("intro-keeper-name");
  if (introK) introK.src = cors;
  if (introKName) introKName.textContent = activeKeeper.name;
}

function formatCompactEfoo(val) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return Math.floor(val).toLocaleString("en-US");
}

function updateHudEfooBadge() {
  const hudEfooLbl = document.getElementById("hud-efoo-balance-label");
  const hudEfooBadge = document.getElementById("hud-efoo-badge");
  const shopBal = document.getElementById("shop-efoo-balance");
  if (hudEfooLbl) {
    hudEfooLbl.textContent = `${formatCompactEfoo(walletState.efooBalance)} $EFOO`;
  }
  if (hudEfooBadge) {
    hudEfooBadge.classList.toggle("active", walletState.efooBalance >= MIN_EFOO_REQUIRED);
  }
  if (shopBal) {
    shopBal.textContent = `${Math.floor(walletState.efooBalance).toLocaleString(currentLang === "hu" ? "hu-HU" : "en-US")} $EFOO`;
  }
}

function updateStartSkillsChips() {
  const container = document.getElementById("start-skills-chips");
  if (!container) return;
  const inv = getSkillsInventory();
  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";

  container.innerHTML = "";
  SKILLS.forEach((s) => {
    const count = inv[s.id] || 0;
    const chip = document.createElement("div");
    chip.className = `skill-chip ${count <= 0 ? "empty" : ""}`;
    const name = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
    chip.innerHTML = `
      <span>${s.icon}</span>
      <span>${name.split(" ")[0]}</span>
      <strong style="color:${count > 0 ? s.color : "#64748b"};">(${count})</strong>
    `;
    chip.title = `${name}: ${count} ${isHu ? "db a készletedben" : "in your match locker"}`;
    container.appendChild(chip);
  });
}

function updateEntryGateUI() {
  const card = document.getElementById("entry-gate-card");
  const badge = document.getElementById("eg-lock-badge");
  const walletLine = document.getElementById("eg-wallet-line");
  const refreshBtn = document.getElementById("gate-refresh-btn");
  const startBtn = document.getElementById("btn-start-match");
  const disconnectBtn = document.getElementById("disconnect-wallet-btn");
  const hudEfooBadge = document.getElementById("hud-efoo-badge");
  const hudEfooLbl = document.getElementById("hud-efoo-balance-label");

  const isRo = currentLang === "ro";
  const p = getPowers();

  // Top bar wallet & disconnect buttons
  const hubWalletLbl = document.getElementById("hub-wallet-label");
  const hubDisconnectBtn = document.getElementById("hub-disconnect-wallet-btn");
  const modalActiveCard = document.getElementById("wallet-modal-active-card");
  const modalActiveErd = document.getElementById("modal-active-erd");

  const navVipBadge = document.getElementById("nav-ultras-vip-badge");
  const isUltras = hasUltrasPass(connectedAddress);
  if (navVipBadge) {
    navVipBadge.classList.toggle("hidden", !isUltras);
  }

  if (connectedAddress && VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    const isSol = typeof SolanaAdapter !== "undefined" && SolanaAdapter.isSolanaAddress(connectedAddress);
    document.getElementById("nav-wallet-label").textContent = shortErd(connectedAddress);
    const navIconGm = document.getElementById("nav-wallet-icon-gm");
    const hubIconGm = document.getElementById("hub-wallet-icon-gm");
    const navBtnGm = document.getElementById("open-wallet-modal-btn");
    const modalActiveChainLabel = document.getElementById("modal-active-chain-label");
    if (navIconGm && typeof SolanaAdapter !== "undefined") {
      navIconGm.innerHTML = isSol ? SolanaAdapter.PHANTOM_ICON_SVG : SolanaAdapter.MULTIVERSX_ICON_SVG;
    }
    if (hubIconGm && typeof SolanaAdapter !== "undefined") {
      hubIconGm.innerHTML = isSol ? SolanaAdapter.PHANTOM_ICON_SVG : "⚡";
    }
    if (navBtnGm) {
      if (isSol) {
        navBtnGm.style.borderColor = "#ab9ff2";
        navBtnGm.style.boxShadow = "0 0 14px rgba(171,159,242,0.45)";
      } else {
        navBtnGm.style.borderColor = "";
        navBtnGm.style.boxShadow = "";
      }
    }
    if (modalActiveChainLabel) {
      modalActiveChainLabel.textContent = isSol ? "🟣 CONNECTED SOLANA WALLET (DEVNET):" : "🟢 CONNECTED MULTIVERSX WALLET:";
      modalActiveChainLabel.style.color = isSol ? "#ab9ff2" : "#a8ff00";
    }
    disconnectBtn?.classList.remove("hidden");
    if (hubWalletLbl) hubWalletLbl.textContent = shortErd(connectedAddress);
    if (hubDisconnectBtn) hubDisconnectBtn.classList.remove("hidden");
    if (modalActiveCard) modalActiveCard.classList.remove("hidden");
    if (modalActiveErd) modalActiveErd.textContent = connectedAddress;
    if (hudEfooLbl) {
      hudEfooLbl.textContent = walletState.loading
        ? "..."
        : `${formatCompactEfoo(walletState.efooBalance)} $EFOO`;
    }
    hudEfooBadge?.classList.toggle("active", walletState.efooBalance >= MIN_EFOO_REQUIRED);
  } else {
    document.getElementById("nav-wallet-label").textContent = I18N_GAME[currentLang].btn_connect;
    const navIconGm = document.getElementById("nav-wallet-icon-gm");
    const hubIconGm = document.getElementById("hub-wallet-icon-gm");
    const navBtnGm = document.getElementById("open-wallet-modal-btn");
    const modalActiveChainLabel = document.getElementById("modal-active-chain-label");
    if (navIconGm) navIconGm.textContent = "⚡";
    if (hubIconGm) hubIconGm.textContent = "⚡";
    if (navBtnGm) {
      navBtnGm.style.borderColor = "";
      navBtnGm.style.boxShadow = "";
    }
    if (modalActiveChainLabel) {
      modalActiveChainLabel.textContent = "🟢 CONNECTED WALLET:";
      modalActiveChainLabel.style.color = "#a8ff00";
    }
    disconnectBtn?.classList.add("hidden");
    if (hubWalletLbl) hubWalletLbl.textContent = currentLang === "hu" ? "CSATLAKOZÁS" : "CONNECT";
    if (hubDisconnectBtn) hubDisconnectBtn.classList.add("hidden");
    if (modalActiveCard) modalActiveCard.classList.add("hidden");
    if (modalActiveErd) modalActiveErd.textContent = "";
    if (hudEfooLbl) hudEfooLbl.textContent = I18N_GAME[currentLang].hud_no_wallet;
    hudEfooBadge?.classList.remove("active");
  }

  if (!card || !badge || !walletLine || !startBtn) return;

  // STATE 1: Not logged in (Free-to-Play Rookie mode)
  if (!connectedAddress || !VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    card.classList.remove("insufficient");
    card.classList.add("unlocked");
    refreshBtn?.classList.add("hidden");
    badge.textContent = isRo
      ? "⚽ MOD ROOKIE F2P ACTIV — CONECTEAZĂ PORTOFEL PENTRU BOOST NFT"
      : (currentLang === "hu"
        ? "⚽ ROOKIE F2P MÓD AKTÍV — CSATLAKOZTASS TÁRCÁT AZ NFT BÓNUSZOKHOZ"
        : "⚽ ROOKIE F2P MODE ACTIVE — CONNECT WALLET FOR NFT BOOSTS");
    walletLine.innerHTML = isRo
      ? "Joci gratuit cu jucători Rookie. Conectează portofelul MultiversX pentru super-puteri și multiplicator NFT!"
      : (currentLang === "hu"
        ? "Ingyenesen játszol Rookie játékosokkal. Csatlakoztass tárcát az NFT képességek és szorzók aktiválásához!"
        : "Play free with your Rookie squad! Connect your MultiversX wallet to unlock Club NFTs, super skills & score multipliers.");
    startBtn.classList.remove("locked");
    startBtn.innerHTML = `⚽ <span>START 120' PENALTY SHOOTOUT</span>`;
    return;
  }

  // STATE 2: Logged in, verifying on-chain balance
  if (walletState.loading || !walletState.verified) {
    card.classList.remove("insufficient");
    refreshBtn?.classList.add("hidden");
    badge.textContent = isRo
      ? "⏳ SE VERIFICĂ PORTOFELUL PE BLOCKCHAIN..."
      : "⏳ VERIFYING WALLET ON MULTIVERSX...";
    walletLine.innerHTML = isRo
      ? `Portofel: <strong>${shortErd(connectedAddress)}</strong> • Se verifică soldul $EFOO și NFT-urile...`
      : `Wallet: <strong>${shortErd(connectedAddress)}</strong> • Checking $EFOO balance &amp; NFTs...`;
    startBtn.classList.remove("locked");
    startBtn.innerHTML = `⚽ <span>START 120' PENALTY SHOOTOUT</span>`;
    return;
  }

  refreshBtn?.classList.remove("hidden");

  // STATE 3: Logged in, verified wallet
  card.classList.remove("insufficient");
  card.classList.add("unlocked");
  const balFormatted = Math.floor(walletState.efooBalance).toLocaleString("en-US");

  if (isUltras) {
    badge.textContent = currentLang === "hu" ? "👑 EFOO ULTRAS PASS AKTÍV — 0% DÍJAK & 2X VAULT ESÉLY!" : "👑 EFOO ULTRAS PASS ACTIVE — 0% FEES & 2X VAULT ODDS!";
    badge.style.color = "#ffb800";
  } else {
    badge.textContent = isRo
      ? "✅ PORTOFEL CONECTAT — ECHIPĂ ACTIVĂ!"
      : (currentLang === "hu" ? "✅ TÁRCA CSATLAKOZTATVA — CSAPAT KÉSZEN ÁLL!" : "✅ WALLET CONNECTED — SQUAD READY!");
  }

  const ultrasBadgeText = isUltras ? " • 👑 <strong>ULTRAS VIP (0% Fees + 25% Score Boost)</strong>" : "";
  walletLine.innerHTML = isRo
    ? `Portofel: <strong>${shortErd(connectedAddress)}</strong> • Sold: <strong>${balFormatted} $EFOO</strong> • NFT: <strong>${walletState.playersCount}⚽ ${walletState.keepersCount}🧤 (${Number(p.totalMult.toFixed(2))}x Boost)</strong>${ultrasBadgeText}`
    : `Wallet: <strong>${shortErd(connectedAddress)}</strong> • Balance: <strong>${balFormatted} $EFOO</strong> • Squad: <strong>${walletState.playersCount}⚽ ${walletState.keepersCount}🧤 (${Number(p.totalMult.toFixed(2))}x Boost)</strong>${ultrasBadgeText}`;

  startBtn.classList.remove("locked");
  startBtn.innerHTML = `⚽ <span>START 120' PENALTY SHOOTOUT</span>`;
}

function refreshHudUI() {
  const p = getPowers();
  const lv = getLevelParams(game.level);
  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";

  document.getElementById("hud-mult-val").textContent = `${Number(p.totalMult.toFixed(2))}x`;
  document.getElementById("hud-score-val").textContent = game.score.toLocaleString("en-US");

  const isShootingTurn = game.shootoutTurn === "shoot";
  const hudImg = document.getElementById("hud-striker-img");
  const hudOvr = document.getElementById("hud-striker-ovr");
  const hudName = document.getElementById("hud-striker-name");
  const hudTrait = document.getElementById("hud-striker-trait");
  const hudDock = document.getElementById("fut-striker-dock");

  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));
  if (hudDock) {
    if (!isConnected) {
      hudDock.style.display = "none";
    } else {
      hudDock.style.display = "flex";
    }
  }

  if (isShootingTurn) {
    const sTier = getNftRarityTier(activeStriker);
    if (hudImg) hudImg.src = toCorsUrl(activeStriker.url, 240);
    if (hudOvr) hudOvr.textContent = String(activeStriker.ovr || 85);
    if (hudName) hudName.textContent = activeStriker.name;
    if (hudTrait) hudTrait.textContent = p.aimBonusPct > 0 ? `${activeStriker.trait} • AIM +${p.aimBonusPct}%` : `${activeStriker.trait} • LVL ${game.level}`;
    if (hudDock) {
      hudDock.style.borderColor = sTier.borderColor || "#a8ff00";
      hudDock.title = `Your Striker: ${activeStriker.name} (Click to switch)`;
    }
  } else {
    const kTier = getNftRarityTier(activeKeeper);
    if (hudImg) hudImg.src = toCorsUrl(activeKeeper.url, 240);
    if (hudOvr) hudOvr.textContent = String(activeKeeper.ovr || 85);
    if (hudName) hudName.textContent = `🧤 ${activeKeeper.name}`;
    if (hudTrait) hudTrait.textContent = `🧤 ${kTier.tierLabel} #${kTier.rank} • ${game.shieldsLeft} SHIELDS LEFT`;
    if (hudDock) {
      hudDock.style.borderColor = kTier.borderColor || "#38bdf8";
      hudDock.title = `Your Goalkeeper: ${activeKeeper.name} (Click to switch)`;
    }
  }

  const lvlEl = document.getElementById("hud-level-val");
  if (lvlEl) {
    lvlEl.textContent = String(game.level);
    lvlEl.style.color = getLevelTier(game.level).color;
  }

  // 120' Turn-based Shootout Scoreboard (TE vs GÉP)
  const userGoalsEl = document.getElementById("hud-user-goals");
  if (userGoalsEl) userGoalsEl.textContent = String(game.userGoals);
  const aiGoalsEl = document.getElementById("hud-ai-goals");
  if (aiGoalsEl) aiGoalsEl.textContent = String(game.aiGoals);

  // Turn badge (TE LŐSZ vs TE VÉDESZ)
  const turnBadge = document.getElementById("sb-turn-badge");
  if (turnBadge) {
    const isUserShoot = game.shootoutTurn === "shoot";
    const turnText = isUserShoot
      ? (isHu ? "TE LŐSZ" : isRo ? "ȘUTUL TĂU" : "YOU SHOOT")
      : (isHu ? "TE VÉDESZ" : isRo ? "APĂRĂ" : "YOU DEFEND");
    const turnIcon = isUserShoot ? "⚽" : "🧤";
    turnBadge.innerHTML = `<span class="turn-icon">${turnIcon}</span> <strong>${turnText}</strong> <small>#${game.round}/${game.maxRounds}</small>`;
    turnBadge.className = `sb-turn-badge ${isUserShoot ? "turn-shoot" : "turn-defend"}`;
  }

  // User 5-dot track
  const userDotsWrap = document.getElementById("sb-user-dots");
  if (userDotsWrap) {
    userDotsWrap.innerHTML = "";
    for (let i = 0; i < game.maxRounds; i++) {
      const span = document.createElement("span");
      span.className = "shot-dot";
      if (i < game.userShotHistory.length) {
        span.classList.add(game.userShotHistory[i]);
        if (i === game.userShotHistory.length - 1 && game.phase === "celebrate" && game.shootoutTurn === "shoot") {
          span.classList.add("just-scored");
        }
      } else if (i === game.userShotHistory.length && game.shootoutTurn === "shoot" && game.phase !== "summary" && game.phase !== "match_result") {
        span.classList.add("current");
      }
      userDotsWrap.appendChild(span);
    }
  }

  // AI 5-dot track
  const aiDotsWrap = document.getElementById("sb-ai-dots");
  if (aiDotsWrap) {
    aiDotsWrap.innerHTML = "";
    for (let i = 0; i < game.maxRounds; i++) {
      const span = document.createElement("span");
      span.className = "shot-dot";
      if (i < game.aiShotHistory.length) {
        span.classList.add(game.aiShotHistory[i]);
        if (i === game.aiShotHistory.length - 1 && game.phase === "celebrate" && game.shootoutTurn === "defend") {
          span.classList.add("just-scored");
        }
      } else if (i === game.aiShotHistory.length && game.shootoutTurn === "defend" && game.phase !== "summary" && game.phase !== "match_result") {
        span.classList.add("current");
      }
      aiDotsWrap.appendChild(span);
    }
  }

  // Update Bottom-Right Visual Icon Slots
  document.getElementById("vp-slot-1")?.classList.toggle("unlocked", p.pCount >= 1 || p.strikerSlots >= 1);
  document.getElementById("vp-slot-2")?.classList.toggle("unlocked", p.pCount >= 3 || p.strikerSlots >= 2);
  document.getElementById("vp-slot-3")?.classList.toggle("unlocked", p.pCount >= 6 || p.strikerSlots >= 3);
  document.getElementById("vp-slot-keeper")?.classList.toggle("unlocked", p.kCount >= 1 || p.keeperSlots >= 1);
  document.getElementById("vp-slot-efoo")?.classList.toggle("unlocked", p.hasRocket);

  const shieldTag = document.getElementById("vp-shield-count");
  if (shieldTag) {
    shieldTag.textContent = game.shieldsLeft > 0 ? `${game.shieldsLeft}x SHIELD` : "SHIELD";
  }

  updateEntryGateUI();
  if (typeof metaRefreshUI === "function") metaRefreshUI();
}

function triggerGateShake() {
  const card = document.getElementById("entry-gate-card");
  if (!card) return;
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

function setStartScreenState(isActive) {
  const overlay = document.getElementById("start-screen-overlay");
  const hud = document.querySelector(".hud-top-bar");
  if (isActive) {
    game.phase = "start";
    overlay?.classList.remove("hidden");
    document.body.classList.add("start-screen-active");
    hud?.classList.add("start-hidden");
    updateStartSkillsChips();
    if (typeof renderStartScreenLeaderboard === "function") renderStartScreenLeaderboard();
    if (typeof updateVaultUI === "function") updateVaultUI();
    const hubWalletLbl = document.getElementById("hub-wallet-label");
    const hubDisconnectBtn = document.getElementById("hub-disconnect-wallet-btn");
    if (connectedAddress && VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
      if (hubWalletLbl) hubWalletLbl.textContent = shortErd(connectedAddress);
      if (hubDisconnectBtn) hubDisconnectBtn.classList.remove("hidden");
    } else {
      if (hubWalletLbl) hubWalletLbl.textContent = currentLang === "hu" ? "CSATLAKOZÁS" : "CONNECT";
      if (hubDisconnectBtn) hubDisconnectBtn.classList.add("hidden");
    }
    if (audio && audio.bgmEnabled && !audio.bgmPlaying) {
      audio.startBgm();
    }
  } else {
    overlay?.classList.add("hidden");
    document.body.classList.remove("start-screen-active");
    hud?.classList.remove("start-hidden");
    if (audio && audio.bgmEnabled && !audio.bgmPlaying) {
      audio.startBgm();
    }
  }
}

// ============================================================================
// CINEMATIC INTRO & 120' SHOOTOUT MATCH LAUNCH
// ============================================================================
function launchMatchWithIntro() {
  game.matchEndWhistlePlayed = false;
  game.postMatchBonusAdded = false;
  isPostMatchLeaderboardActive = false;
  if (audio && audio.bgmEnabled && !audio.bgmPlaying) {
    audio.startBgm();
  }
  setStartScreenState(false);
  document.getElementById("summary-screen-overlay")?.classList.add("hidden");
  document.getElementById("leaderboard-modal-overlay")?.classList.add("hidden");
  document.getElementById("var-revive-overlay")?.classList.add("hidden");
  if (game.varTimerInterval) {
    clearInterval(game.varTimerInterval);
    game.varTimerInterval = null;
  }

  const introEl = document.getElementById("intro-cinematic-overlay");
  const fillEl = document.getElementById("intro-bar-fill");
  const perkEl = document.getElementById("intro-striker-perk");
  const titleEl = document.getElementById("intro-main-title");
  const kickerEl = document.getElementById("intro-sub-kicker");

  if (introEl) introEl.classList.remove("hidden");

  const p = getPowers();
  const lv = getLevelParams(game.level);
  const tier = getLevelTier(game.level);

  game.phase = "intro";
  game.round = 1;
  game.maxRounds = SHOTS_PER_MATCH;
  game.shootoutTurn = "shoot";
  game.userGoals = 0;
  game.aiGoals = 0;
  game.userShotHistory = [];
  game.aiShotHistory = [];
  game.revivedThisMatch = false;
  game.levelCleared = false;
  game.shotHistory = [];
  game.shotHistoryZones = [];
  game.swipe = { active: false, pointerId: null, points: [], startTime: 0 };
  game.goals = 0;
  game.streak = 0;
  game.score = 0;
  game.rawBaseScore = 0;
  game.armed = {};
  game.activeFx = {};
  game.settledBall = null;
  game.shieldsLeft = p.maxShields;
  refreshHudUI();
  renderSkillsDeckUI();

  if (kickerEl) {
    kickerEl.textContent = `🔥 120' AET • ${tier.name} • 5 PENALTY ROUNDS`;
    kickerEl.style.color = tier.color;
  }
  if (titleEl) titleEl.textContent = "120' DRAW — PENALTY SHOOTOUT";
  if (perkEl) {
    if (!connectedAddress || !connectedAddress.startsWith("erd1")) {
      perkEl.textContent = currentLang === "hu" ? "🔒 VENDÉG MÓD • ALAP FELSZERELÉS (0 KÉPESSÉG)" : "🔒 GUEST MODE • BASE KIT (0 SKILLS)";
      perkEl.style.color = "#94a3b8";
    } else if (p.isUltrasPass) {
      perkEl.textContent = `👑 ${Number(p.totalMult.toFixed(2))}x BOOST • ULTRAS VIP (+25% SCORE & VIP SHIELD)`;
      perkEl.style.color = "#ffb800";
    } else {
      perkEl.textContent = `⚡ ${Number(p.totalMult.toFixed(2))}x BOOST • ${p.strikerRarity.name} STRIKER & ${p.keeperRarity.name} GK`;
      perkEl.style.color = "#a8ff00";
    }
  }
  audio.playIntroImpact();

  let prog = 0;
  const timer = setInterval(() => {
    prog += 0.035;
    if (fillEl) fillEl.style.width = `${Math.min(100, prog * 100).toFixed(0)}%`;
    if (prog > 0.5 && titleEl) {
      titleEl.textContent = `${activeStriker.name} ⚡ VS ⚡ ${activeKeeper.name}`;
    }
    if (prog >= 1) {
      clearInterval(timer);
      if (introEl) introEl.classList.add("hidden");
      startNextShotRound();
    }
  }, 85);
}

function startNextShotRound() {
  game.shootoutTurn = "shoot";
  game.phase = "shoot_ready";
  game.isCharging = false;
  game.chargePower = 0;
  game.armed = {};
  game.activeFx = {};
  game.ball = { active: false, t: 0 };
  game.settledBall = null;
  game.swipe = { active: false, pointerId: null, points: [], startTime: 0 };

  const lv = getLevelParams(game.level);

  // The keeper's secret gut-feeling side for THIS shot
  game.keeper.lean = Math.random() < 0.5 ? -1 : 1;
  game.keeper.leanShown = Math.random() < 0.7 ? game.keeper.lean : -game.keeper.lean;
  game.keeper.targetNx = 0;
  game.keeper.targetNy = 0;
  game.keeper.targetAngle = 0;
  game.keeper.armReach = 0;

  // Wind (from level 6) pushes the ball sideways
  game.wind = lv.windMax > 0 ? (Math.random() * 2 - 1) * lv.windMax : 0;

  game.bigBanner = `⚽ ROUND ${game.round} • GET READY!`;
  game.bigBannerColor = "#a8ff00";

  refreshHudUI();
  renderSkillsDeckUI();

  // ~1s initial pause, then referee whistles, then ~0.95s dramatic pause before aim phase begins
  setTimeout(() => {
    if (game.phase !== "shoot_ready") return;
    audio.playWhistle();
    game.bigBanner = "🎺 REFEREE WHISTLES! READY TO SHOOT!";
    game.bigBannerColor = "#ffffff";

    setTimeout(() => {
      if (game.phase !== "shoot_ready") return;
      game.phase = "aim";
      game.bigBanner = "";
      game.lastInteractionTime = Date.now();
      refreshHudUI();
    }, 950);
  }, 1000);
}

function consumeArmedSkills() {
  const fx = {};
  const allSkills = [...SKILLS, ...KEEPER_SKILLS];
  allSkills.forEach((s) => {
    if (!game.armed[s.id]) return;
    const ok = typeof metaConsumeSkill === "function" ? metaConsumeSkill(s.id) : false;
    if (ok) fx[s.id] = true;
  });
  game.armed = {};
  return fx;
}

function getShotZone(nx, ny) {
  if (ny > 0.55) {
    if (nx < -0.22) return "top_left";
    if (nx > 0.22) return "top_right";
    return "top_center";
  } else {
    if (nx < -0.22) return "bottom_left";
    if (nx > 0.22) return "bottom_right";
    return "bottom_center";
  }
}

// Decides what the shot does: Adaptive Goalkeeper AI learns player patterns (anti-corner-camping)
function evaluateShot(nx, ny, power, isSweet, isWeak, lv, p, fx, swipeCurve = 0) {
  const POST = 0.06;
  const keeper = game.keeper;
  if (!game.shotHistoryZones) game.shotHistoryZones = [];

  const ex = clampNum(nx, -1, 1);
  const ey = clampNum(ny, 0.05, 1);

  const zone = getShotZone(nx, ny);
  const lastZone = game.shotHistoryZones[game.shotHistoryZones.length - 1];
  const isRepeatZone = lastZone === zone;
  const repeatCount = game.shotHistoryZones.filter((z) => z === zone).length;
  game.shotHistoryZones.push(zone);

  let keeperAnticipated = false;
  let keeperWrongFooted = false;

  let commit = clampNum(lv.commitLean + (fx.freeze ? 0.25 : 0), 0, 0.95);
  let sigma = lv.keeperSigma * p.keeperSigmaMul * (fx.curve || Math.abs(swipeCurve) > 0.45 ? 1.55 : 1) * (fx.freeze ? 1.4 : 1);
  let reach = lv.keeperReach;

  let tx = 0;
  let ty = 0.2;

  // Anti-Camping: If player repeatedly shoots to the exact same zone:
  if (isRepeatZone) {
    keeperAnticipated = true;
    const targetSide = zone.includes("left") ? -1 : (zone.includes("right") ? 1 : 0);
    const targetHeight = zone.includes("top") ? 0.82 : 0.22;

    if (repeatCount >= 2) {
      // 3rd time in the same corner: keeper completely anticipates and shuts down the corner!
      tx = targetSide * 0.92;
      ty = targetHeight;
      reach *= 1.7;
      sigma *= 0.2;
    } else {
      // 2nd time in the same corner: keeper dives early with boost
      tx = targetSide * 0.78;
      ty = targetHeight;
      reach *= 1.38;
      sigma *= 0.45;
    }
  } else if (lastZone && ((lastZone.includes("left") && zone.includes("right")) || (lastZone.includes("right") && zone.includes("left")))) {
    // WRONG-FOOTED! Player switched to the opposite side!
    keeperWrongFooted = true;
    const oldSide = lastZone.includes("left") ? -1 : 1;
    tx = oldSide * (0.35 + Math.random() * 0.45);
    ty = 0.15 + Math.random() * 0.45;
    reach *= 0.58; // Caught diving the wrong way!
  } else {
    // Standard reading
    if (Math.random() < commit) {
      tx = keeper.lean * (0.3 + Math.random() * 0.55);
      ty = 0.12 + Math.random() * 0.65;
    } else {
      tx = ex + randGauss() * sigma;
      ty = ey + randGauss() * sigma * 0.8;
    }
  }

  tx = clampNum(tx, -0.92, 0.92);
  ty = clampNum(ty, 0.06, 0.9);

  const outX = Math.abs(nx) > 1 + POST;
  const outY = ny > 1 + POST;

  let result;
  let postIn = false;
  if (outX) {
    result = "wide";
  } else if (outY) {
    result = "over";
  } else if (Math.abs(Math.abs(nx) - 1) <= POST && ny <= 1) {
    result = "post";
  } else if (Math.abs(ny - 1) <= POST && Math.abs(nx) <= 1) {
    result = "bar";
  } else {
    // In the frame: can the keeper get a glove on it?
    if (!keeperAnticipated) {
      reach *= 1 - 0.25 * Math.abs(ex) - 0.18 * ey; // corners are harder to reach UNLESS keeper anticipated
    }
    if (isWeak) reach *= 1.6; // A lame weak swipe is an easy catch
    else if (isSweet && power > 0.72) reach *= 0.82; // Hammered sweet flick beats keeper

    if (fx.power) reach *= 0.72;
    if (fx.freeze) reach *= 0.45;

    const d = Math.hypot(ex - tx, (ey - ty) * 1.35);
    result = d < reach ? "save" : "goal";
  }

  // Woodwork: the ball can bounce in
  if ((result === "post" || result === "bar") && Math.random() < 0.45) {
    result = "goal";
    postIn = true;
  }

  return { result, postIn, tx, ty, ex, ey, keeperAnticipated, keeperWrongFooted };
}

function releaseAndFireShot(finalPower, swipeCurve = 0, customTarget = null) {
  if (!canPlayMatch()) return;
  if (game.phase !== "aim" && game.phase !== "charging") return;
  game.phase = "flight";
  game.isCharging = false;

  const p = getPowers();
  const lv = getLevelParams(game.level);
  const fx = consumeArmedSkills();
  game.activeFx = fx;

  if (customTarget) {
    game.aimNx = clampNum(customTarget.nx, -1.6, 1.6);
    game.aimNy = clampNum(customTarget.ny, 0, 1.6);
  }

  const power = clampNum(finalPower, 0.15, 1);
  const sweetMin = lv.sweetMin - (p.hasRocket ? 0.03 : 0);
  const sweetMax = lv.sweetMax + p.sweetBonus + (fx.power ? 0.1 : 0);
  const isSweet = power >= sweetMin && power <= sweetMax;
  const isWeak = power < sweetMin;
  const isOver = power > sweetMax;

  audio.playKick(isSweet);
  game.strikerLunge = 26;

  // Real ball flight physics
  let nx = game.aimNx;
  let ny = game.aimNy;
  const errAmp = (0.01 + 0.025 * lv.t) * (isSweet ? 0.45 : 1.25);
  nx += randGauss() * errAmp;
  ny += randGauss() * errAmp;
  if (isWeak) ny -= (sweetMin - power) * 0.45;
  if (isOver) {
    ny += (power - sweetMax) * 2.5;
    nx += (Math.random() - 0.5) * (power - sweetMax) * 1.4;
  }
  nx += game.wind;
  ny = Math.max(0, ny);

  const hitBullseye = Math.hypot(nx - game.bullseyeNx, ny - game.bullseyeNy) < 0.26;
  const outcome = evaluateShot(nx, ny, power, isSweet, isWeak, lv, p, fx, swipeCurve);

  // Keeper's physical dive
  const k = game.keeper;
  if (outcome.result === "save") {
    k.targetNx = outcome.tx + (outcome.ex - outcome.tx) * 0.85;
    k.targetNy = outcome.ty + (outcome.ey - outcome.ty) * 0.85;
  } else if (outcome.result === "wide" || outcome.result === "over") {
    k.targetNx = outcome.tx * 0.45;
    k.targetNy = outcome.ty * 0.5;
  } else {
    k.targetNx = outcome.tx;
    k.targetNy = outcome.ty;
  }
  k.targetAngle = k.targetNx < -0.15 ? -0.95 : k.targetNx > 0.15 ? 0.95 : 0;
  k.armReach = 1.0;

  // Skill activation flash
  const used = SKILLS.filter((s) => fx[s.id]);
  if (used.length > 0) {
    game.skillFlash = {
      text: used.map((s) => `${s.icon} ${currentLang === "ro" ? s.nameRo : s.name}`).join("  +  "),
      color: used[0].color,
      life: 1,
      fresh: true
    };
    if (typeof audio.playSkillFire === "function") audio.playSkillFire();
  }

  // Curve calculation
  let curveIntensity = swipeCurve;
  if (Math.abs(curveIntensity) < 0.1) {
    const bendSign = nx >= 0 ? -1 : 1;
    curveIntensity = (fx.curve ? 2.1 : p.hasCurve ? 1.35 : 0.4) * bendSign;
  } else {
    curveIntensity *= (fx.curve ? 2.0 : p.hasCurve ? 1.4 : 1.0);
  }

  game.ball = {
    active: true,
    t: 0,
    aimNx: nx,
    aimNy: ny,
    curveIntensity,
    isSweet,
    isWeak,
    isTwin: isSweet && p.hasTwinBall,
    hitBullseye,
    result: outcome.result,
    postIn: outcome.postIn,
    keeperAnticipated: outcome.keeperAnticipated,
    keeperWrongFooted: outcome.keeperWrongFooted,
    speed: isWeak ? 0.022 : isSweet ? 0.030 : 0.034,
    duration: isWeak ? 0.85 : isSweet ? 0.65 : 0.62,
    trail: [],
    fx
  };
}

function onBallReachGoal(endScreenX, endScreenY) {
  const p = getPowers();
  const lv = getLevelParams(game.level);
  const b = game.ball;
  const fx = b.fx || {};
  let scored = b.result === "goal";
  let shieldTriggered = false;

  // Goalkeeper NFT Save Shield: Only saves close deflections on active shots, NOT on weak shots or repeated corner camping!
  if (b.result === "save" && game.shieldsLeft > 0 && !b.keeperAnticipated && !b.isWeak && Math.random() < 0.65) {
    game.shieldsLeft -= 1;
    scored = true;
    shieldTriggered = true;
    audio.playPostClang();
    spawnSparks(endScreenX, endScreenY, "#ffb800", 45);
  }

  if (scored) {
    const goalsAdded = b.isTwin ? 2 : 1;
    game.goals += goalsAdded;
    game.userGoals += goalsAdded;
    game.streak += 1;
    game.userShotHistory.push("goal");
    game.shotHistory.push("goal");

    try {
      if (typeof recordGoalsForBonus === "function") {
        recordGoalsForBonus(goalsAdded);
      }
    } catch (e) {}

    const rawPts = Math.round(
      (1000 + game.streak * 350) * (b.hitBullseye ? 2 : 1) * (b.isSweet ? 1.5 : 1) * lv.scoreMul
    );
    let totalPts = Math.round(rawPts * p.totalMult + p.rocketPts) * goalsAdded;
    if (fx.gold) totalPts *= 2;

    game.rawBaseScore += rawPts;
    game.score += totalPts;

    game.netImpactX = endScreenX;
    game.netImpactY = endScreenY;
    game.netRipple = 1.0;

    const isFireRocketGoal = fx.power || p.hasRocket || b.isSweet;
    if (isFireRocketGoal) {
      game.netFire = 1.0;
      game.shake = b.isSweet ? 26 : 18;
      for (let i = 0; i < 48; i++) {
        game.particles.push({
          x: endScreenX + (Math.random() - 0.5) * 36,
          y: endScreenY + (Math.random() - 0.5) * 36,
          vx: (Math.random() - 0.5) * 5.5,
          vy: -1.5 - Math.random() * 4.5,
          r: 3 + Math.random() * 4.5,
          color: Math.random() < 0.35 ? "#ff3b00" : (Math.random() < 0.7 ? "#ffb800" : "#ffffff"),
          alpha: 1.0
        });
      }
    } else {
      game.shake = 8;
    }

    const pts = totalPts.toLocaleString();
    game.bigBanner = shieldTriggered
      ? `🧤 SHIELD RICOCHET GOAL! +${pts}`
      : b.keeperWrongFooted
      ? `⚡ WRONG-FOOTED THE KEEPER! +${pts}`
      : fx.power || p.hasRocket
      ? `🔥 ROCKET FIREBALL BURNS NET! +${pts}`
      : b.postIn
      ? `💥 OFF THE POST AND IN! +${pts}`
      : fx.gold
      ? `💰 GOLD x2 GOAL! +${pts}`
      : b.isTwin
      ? `⚡ 2x TWIN ROCKET GOAL! +${pts}`
      : b.hitBullseye
      ? `⭐ 2x BULLSEYE TOP BINS! +${pts}`
      : `⚽ GOAL! +${pts}`;
    game.bigBannerColor = fx.power || p.hasRocket ? "#ff3b00" : (shieldTriggered || b.hitBullseye || fx.gold || b.keeperWrongFooted ? "#ffb800" : "#a8ff00");

    if (b.hitBullseye) {
      triggerBullseye2xImpact(endScreenX, endScreenY);
      if (typeof audio.playMultiplier2xHit === "function") {
        audio.playMultiplier2xHit();
      }
      audio.playGoalCheer();
      audio.playApplause();
    } else {
      audio.playGoalCheer();
      audio.playApplause();
      spawnSparks(endScreenX, endScreenY, "#a8ff00", 55);
    }
  } else {
    game.streak = 0;
    game.userShotHistory.push("miss");
    game.shotHistory.push("miss");
    game.shake = 6;
    const missText = {
      wide: "↗ WIDE OF THE POST!",
      over: "☁️ OVER THE CROSSBAR!",
      post: "💥 OFF THE POST!",
      bar: "💥 OFF THE CROSSBAR!",
      save: b.keeperAnticipated
        ? "🧤 KEEPER ANTICIPATED YOUR CORNER!"
        : b.isWeak
        ? "🐢 TOO WEAK - EASY CATCH!"
        : `🧤 SAVED BY ${activeKeeper.name}!`
    };
    game.bigBanner = missText[b.result] || "❌ MISS!";
    game.bigBannerColor = "#ef4444";

    if (b.result === "post" || b.result === "bar") audio.playPostClang();
    else if (b.result === "save") audio.playSaveBlock();
  }

  game.phase = "celebrate";
  refreshHudUI();

  setTimeout(() => {
    game.bigBanner = "";
    // After user's kick, transition to defense turn!
    startDefenseTurn();
  }, 1600);
}

function startDefenseTurn() {
  game.shootoutTurn = "defend";
  game.phase = "defend_ready";
  game.isCharging = false;
  game.chargePower = 0;
  game.armed = {};
  game.activeFx = {};
  game.ball = { active: false, t: 0 };
  game.settledBall = null;

  // AI chooses a target across the goal corners/sides
  const corners = [
    { nx: -0.76, ny: 0.82 },
    { nx: 0.76, ny: 0.82 },
    { nx: -0.72, ny: 0.22 },
    { nx: 0.72, ny: 0.22 },
    { nx: 0.0, ny: 0.65 }
  ];
  const chosen = corners[Math.floor(Math.random() * corners.length)];
  game.aiTargetNx = clampNum(chosen.nx + (Math.random() - 0.5) * 0.15, -0.92, 0.92);
  game.aiTargetNy = clampNum(chosen.ny + (Math.random() - 0.5) * 0.15, 0.15, 0.95);

  // Position keeper in center
  game.keeper.nx = 0;
  game.keeper.ny = 0.15;
  game.keeper.targetNx = 0;
  game.keeper.targetNy = 0.15;
  game.keeper.bodyAngle = 0;
  game.keeper.targetAngle = 0;
  game.keeper.armReach = 0.35;

  game.bigBanner = `🧤 ROUND ${game.round} • YOU DEFEND!`;
  game.bigBannerColor = "#38bdf8";

  refreshHudUI();
  renderSkillsDeckUI();

  // ~1s initial pause, then referee whistles, then ~0.95s dramatic pause before AI shoots
  setTimeout(() => {
    if (game.phase !== "defend_ready") return;
    audio.playWhistle();
    game.phase = "defend_aim";
    game.lastInteractionTime = Date.now();
    game.bigBanner = "🎺 REFEREE WHISTLES! DIVE NOW!";
    game.bigBannerColor = "#ffffff";

    setTimeout(() => {
      if (game.phase !== "defend_aim" && game.phase !== "defend_ready") return;
      game.bigBanner = "";
      executeAiShot();
    }, 950);
  }, 1000);
}

function executeAiShot() {
  const fx = consumeArmedSkills();
  game.activeFx = fx;
  game.phase = "defend_flight";

  if (fx.matrix_reflex) {
    audio.playMatrixSlow();
  } else if (fx.iron_wall || fx.spider_reach || fx.mind_read) {
    audio.playSkillFire();
  }
  audio.playKick(true, false);

  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";

  const used = KEEPER_SKILLS.filter((s) => fx[s.id]);
  if (used.length > 0) {
    game.skillFlash = {
      text: used.map((s) => `${s.icon} ${isHu ? s.nameHu : (isRo ? s.nameRo : s.name)}`).join(" + "),
      color: used[0].color,
      life: 1,
      fresh: true
    };
  }

  game.ball = {
    active: true,
    t: 0,
    aimNx: game.aiTargetNx,
    aimNy: game.aiTargetNy,
    curveIntensity: (Math.random() - 0.5) * 0.45,
    isSweet: Math.random() < 0.5,
    isTwin: false,
    speed: fx.matrix_reflex ? 0.014 : 0.026,
    duration: fx.matrix_reflex ? 1.15 : 0.72,
    trail: [],
    fx
  };
}

function onAiBallReachGoal(endScreenX, endScreenY) {
  const fx = game.activeFx || {};

  const ballNx = game.ball.aimNx;
  const ballNy = game.ball.aimNy;
  const dist = Math.hypot(ballNx - game.keeper.nx, ballNy - game.keeper.ny);

  // Save reach calculation
  let reach = 0.38;
  if (fx.iron_wall) reach += 0.22;
  if (fx.spider_reach) reach += 0.32;

  const isSaved = dist <= reach;

  if (isSaved) {
    game.aiShotHistory.push("miss");
    audio.playSaveBlock();
    audio.playApplause();
    spawnSparks(endScreenX, endScreenY, "#38bdf8", 50);
    game.shake = 12;
    game.bigBanner = "🧤 MONSTER SAVE! PENALTY SAVED!";
    game.bigBannerColor = "#38bdf8";
  } else {
    game.aiGoals += 1;
    game.aiShotHistory.push("goal");
    audio.playNetSwish();
    game.netImpactX = endScreenX;
    game.netImpactY = endScreenY;
    game.netRipple = 0.9;
    game.shake = 8;
    game.bigBanner = "⚽ CPU SCORED!";
    game.bigBannerColor = "#ef4444";
  }

  game.phase = "celebrate";
  refreshHudUI();

  setTimeout(() => {
    game.bigBanner = "";
    if (game.round >= game.maxRounds) {
      finishMatch();
    } else {
      game.round += 1;
      startNextShotRound();
    }
  }, 1350);
}

// End of the shoot-out: show a WIN / LOSS / DRAW notification, then open the summary window
function finishMatch() {
  if (game.phase === "match_result" || game.phase === "summary") return;
  game.phase = "match_result";
  game.isCharging = false;
  game.bigBanner = "";

  const userWon = game.userGoals > game.aiGoals;
  const isTie = game.userGoals === game.aiGoals;
  game.matchResult = {
    kind: userWon ? "win" : isTie ? "draw" : "loss",
    title: userWon ? "VICTORY!" : isTie ? "DRAW!" : "DEFEAT!",
    sub: userWon
      ? "YOU WON THE SHOOTOUT"
      : isTie
      ? "THE SHOOTOUT ENDS LEVEL"
      : "THE CPU WON THE SHOOTOUT",
    score: `${game.userGoals} - ${game.aiGoals}`,
    color: userWon ? "#a8ff00" : isTie ? "#ffb800" : "#ef4444",
    startedAt: performance.now(),
  };

  try {
    const sw = window.innerWidth || 800;
    const sh = window.innerHeight || 600;
    game.matchEndWhistlePlayed = true;
    audio.playMatchEndWhistle();
    if (userWon) {
      audio.playGoalCheer();
      audio.playApplause();
      spawnSparks(sw * 0.5, sh * 0.4, "#a8ff00", 70);
      spawnSparks(sw * 0.5 - 120, sh * 0.45, "#ffb800", 40);
      spawnSparks(sw * 0.5 + 120, sh * 0.45, "#ffb800", 40);
    } else if (isTie) {
      audio.playApplause();
    } else {
      audio.playDefeat();
    }
  } catch (e) {
    console.error("Result sound error:", e);
  }
  refreshHudUI();

  setTimeout(() => {
    if (game.phase !== "match_result") return;
    game.matchResult = null;
    try {
      showPostMatchLeaderboard();
    } catch (err) {
      console.error("Error in showPostMatchLeaderboard:", err);
      openSummaryModal();
    }
  }, 2600);
}

let isPostMatchLeaderboardActive = false;

function showPostMatchLeaderboard() {
  isPostMatchLeaderboardActive = true;
  game.phase = "leaderboard_postmatch";

  // Calculate win bonuses so score displayed on leaderboard includes match bonus!
  const userWon = game.userGoals > game.aiGoals;
  const perfect = userWon && game.userGoals === game.maxRounds && game.aiGoals === 0;
  let bonus = 0;
  if (userWon) bonus += 2500 * game.level;
  if (perfect) bonus += 5000 * game.level;
  if (bonus > 0 && !game.postMatchBonusAdded) {
    game.score += bonus;
    game.postMatchBonusAdded = true;
    refreshHudUI();
  }

  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));
  if (isConnected) {
    recordMatchToLeaderboard(game.score, game.userGoals, game.level);
  }

  renderLeaderboardModal({
    isPostMatch: true,
    score: game.score,
    goals: game.userGoals,
    level: game.level
  });

  document.getElementById("leaderboard-modal-overlay")?.classList.remove("hidden");
}

function openVarReviveOverlay() {
  game.phase = "var_review";
  audio.playVarSiren();

  const varOverlay = document.getElementById("var-revive-overlay");
  const countNum = document.getElementById("var-countdown-num");
  const fill = document.getElementById("var-progress-fill");
  const titleEl = document.getElementById("var-title");
  const descEl = document.getElementById("var-desc-text");
  const isRo = currentLang === "ro";
  const lv = getLevelParams(game.level);
  const needMore = Math.max(1, lv.goalsNeeded - game.goals);

  if (!varOverlay) {
    showPostMatchLeaderboard();
    return;
  }

  if (titleEl) {
    titleEl.textContent = isRo ? "🚨 PARADĂ / SFÂRȘIT DE MECI!" : "🚨 SHOT SAVED / FULL TIME!";
  }
  if (descEl) {
    descEl.textContent = isRo
      ? `Arbitrul verifică VAR! Ți-au mai lipsit ${needMore} gol${needMore > 1 ? "uri" : ""} pentru LEVEL ${game.level}. Cere 1 șut extra în 10 secunde!`
      : `Referee signals VAR review! You are ${needMore} goal${needMore > 1 ? "s" : ""} short of clearing LEVEL ${game.level}. Call 1 extra shot within 10 seconds!`;
  }

  varOverlay.classList.remove("hidden");
  game.varCountdown = 10;
  if (countNum) countNum.textContent = "10s";
  if (fill) fill.style.width = "100%";

  if (game.varTimerInterval) clearInterval(game.varTimerInterval);

  game.varTimerInterval = setInterval(() => {
    game.varCountdown -= 1;
    audio.playHeartbeat();

    if (countNum) countNum.textContent = `${game.varCountdown}s`;
    if (fill) fill.style.width = `${(game.varCountdown / 10) * 100}%`;

    if (game.varCountdown <= 0) {
      clearInterval(game.varTimerInterval);
      game.varTimerInterval = null;
      varOverlay.classList.add("hidden");
      showPostMatchLeaderboard();
    }
  }, 1000);
}

function closeVarReviveAndFinish() {
  if (game.varTimerInterval) {
    clearInterval(game.varTimerInterval);
    game.varTimerInterval = null;
  }
  document.getElementById("var-revive-overlay")?.classList.add("hidden");
  showPostMatchLeaderboard();
}

function executeReviveBonusShot() {
  if (game.varTimerInterval) {
    clearInterval(game.varTimerInterval);
    game.varTimerInterval = null;
  }
  document.getElementById("var-revive-overlay")?.classList.add("hidden");
  game.revivedThisMatch = true;
  game.maxRounds += 1;
  game.round += 1;
  game.bigBanner = currentLang === "ro" ? "⚡ PRELUNGIRI ACORDATE! +1 ȘUT EXTRA!" : "⚡ VAR INJURY TIME GRANTED! +1 EXTRA SHOT!";
  game.bigBannerColor = "#a8ff00";
  audio.playGoalCheer();
  startNextShotRound();
}

function goNextLevel() {
  const nextLvl = Math.min(MAX_LEVEL, game.level + 1);
  game.level = nextLvl;
  try {
    const cur = typeof metaUnlockedLevel === "function" ? metaUnlockedLevel() : 1;
    if (nextLvl > cur) {
      localStorage.setItem(STORAGE_UNLOCKED_LEVEL, String(nextLvl));
    }
  } catch (e) {}
  launchMatchWithIntro();
}

function openSummaryModal() {
  game.phase = "summary";
  if (!game.matchEndWhistlePlayed) {
    audio.playMatchEndWhistle();
  }
  game.matchEndWhistlePlayed = false;

  // Cancel any pending VAR timer and ensure VAR overlay is closed
  if (game.varTimerInterval) {
    clearInterval(game.varTimerInterval);
    game.varTimerInterval = null;
  }
  document.getElementById("var-revive-overlay")?.classList.add("hidden");

  // Reset skills, visual FX, ball, and keeper state so keeper is upright and not stuck in ice or dive
  game.armed = {};
  game.activeFx = {};
  game.ball = { active: false, t: 0 };
  game.keeper.targetNx = 0;
  game.keeper.targetNy = 0;
  game.keeper.targetAngle = 0;
  game.keeper.bodyAngle = 0;
  game.keeper.armReach = 0.22;
  game.strikerLunge = 0;

  const p = getPowers();
  const lv = getLevelParams(game.level);
  const isRo = currentLang === "ro";
  const isHu = currentLang === "hu";

  const userWon = game.userGoals > game.aiGoals;
  const isTie = game.userGoals === game.aiGoals;
  const cleared = userWon;
  game.levelCleared = cleared;
  const perfect = userWon && game.userGoals === game.maxRounds && game.aiGoals === 0;

  // Level bonuses
  let bonus = 0;
  if (cleared) bonus += 2500 * game.level;
  if (perfect) bonus += 5000 * game.level;
  if (!game.postMatchBonusAdded) {
    game.score += bonus;
    game.postMatchBonusAdded = true;
  }
  refreshHudUI();

  // Core Scorecard
  const actualScoreEl = document.getElementById("sum-score-actual");
  if (actualScoreEl) actualScoreEl.textContent = `${game.score.toLocaleString("en-US")} PTS`;

  const matchStatsEl = document.getElementById("sum-match-stats");
  if (matchStatsEl) {
    const savesCount = Math.max(0, 5 - game.aiGoals);
    matchStatsEl.textContent = `⚽ ${game.userGoals} Goals • 🧤 ${savesCount} Saves`;
  }

  // Headline & Trophy
  const titleEl = document.getElementById("sum-title");
  const subEl = document.getElementById("sum-clean-sub");
  const trophyEl = document.getElementById("sum-clean-trophy");

  if (trophyEl) {
    trophyEl.textContent = userWon ? "🏆" : isTie ? "🤝" : "💔";
  }

  if (titleEl) {
    titleEl.textContent = userWon
      ? `SHOOTOUT VICTORY! (${game.userGoals} - ${game.aiGoals})`
      : isTie
      ? `SHOOTOUT DRAW (${game.userGoals} - ${game.aiGoals})`
      : `SHOOTOUT DEFEAT (${game.userGoals} - ${game.aiGoals})`;
    titleEl.style.color = userWon ? "#a8ff00" : isTie ? "#ffb800" : "#fca5a5";
  }

  if (subEl) {
    subEl.textContent = userWon
      ? (perfect ? "🌟 PERFECT 5-ROUND CLEAN SHEET!" : "5 Rounds Completed • Shootout Won")
      : isTie
      ? "Shootout Finished Level • Decided on Penalties"
      : "Opponent Scored Decisive Penalty • Try Again!";
  }

  const lvlLine = document.getElementById("sum-level-line");
  if (lvlLine) {
    if (userWon) {
      lvlLine.textContent = `⭐ Round Completed • Ready for Next Challenge (+${bonus.toLocaleString("en-US")} Bonus)`;
      lvlLine.style.color = "#a8ff00";
    } else {
      lvlLine.textContent = `⚡ Need more power? Equip rarer NFTs or restock Skills in the Store!`;
      lvlLine.style.color = "#ffb800";
    }
  }

    // Primary Buttons & Defeat Rescue UI
    updateVaultUI();

    const victoryActions = document.getElementById("sum-victory-actions");
    const defeatActions = document.getElementById("sum-defeat-actions");
    const streakRiskCount = document.getElementById("sum-streak-risk-count");

    if (userWon) {
      if (victoryActions) victoryActions.classList.remove("hidden");
      if (defeatActions) defeatActions.classList.add("hidden");
      game.streak = (game.streak || 0) + 1;
    } else {
      if (victoryActions) victoryActions.classList.add("hidden");
      if (defeatActions) defeatActions.classList.remove("hidden");
      if (streakRiskCount) {
        const curStreak = game.streak || 0;
        streakRiskCount.textContent = curStreak === 1 ? "1 WIN" : `${curStreak} WINS`;
      }
    }

    const hudStreak = document.getElementById("hud-streak-val");
    if (hudStreak) hudStreak.textContent = `${game.streak || 0} W`;

    const nextBtn = document.getElementById("btn-sum-next");
    const replayBtn = document.getElementById("btn-sum-replay");
    if (nextBtn) {
      const showNext = userWon && game.level < MAX_LEVEL;
      nextBtn.classList.toggle("hidden", !showNext);
      nextBtn.textContent = `🚀 NEXT LEVEL (ROUND ${game.level + 1})`;
    }
    if (replayBtn) {
      replayBtn.textContent = userWon ? "🔄 PLAY AGAIN" : "🔄 RETRY MATCH";
    }

  // Secondary Tools
  document.getElementById("btn-sum-skills-shop")?.addEventListener("click", () => {
    openSkillsShopModal();
  });
  document.getElementById("btn-sum-perks")?.addEventListener("click", () => {
    document.getElementById("boost-modal-overlay")?.classList.remove("hidden");
  });
  document.getElementById("btn-sum-share")?.addEventListener("click", () => {
    const tweet = `I just scored ${game.score.toLocaleString()} PTS in the $EFOO 120' Penalty Shootout on MultiversX! ⚽🔥 Can you beat my streak? @ElrondFootball`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
  });

  document.getElementById("summary-screen-overlay")?.classList.remove("hidden");
}

// ============================================================================
// FULLSCREEN 60FPS 3D STADIUM RENDERER & ARTICULATED GOALKEEPER
// ============================================================================
function spawnSparks(x, y, color, count = 35) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 2 + Math.random() * 8.5;
    game.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 2,
      r: 2.5 + Math.random() * 4.5,
      color,
      alpha: 1
    });
  }
}

function spawnGoldMultiplierBurst(x, y) {
  // 1. High-velocity radiant golden sparks & stardust
  const goldColors = ["#ffffff", "#fff59d", "#ffd700", "#ffb800", "#ff9100"];
  for (let i = 0; i < 55; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = 3.5 + Math.random() * 11.0;
    game.particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 2.8,
      r: 3 + Math.random() * 5.5,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      alpha: 1.0,
      decay: 0.016 + Math.random() * 0.016
    });
  }

  // 2. Flying celebration glyphs (stars, 2X, sparkles, coins, trophy)
  const glyphs = ["⭐", "2X", "✨", "💰", "⭐", "2X", "⚡", "🌟"];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const speed = 2.8 + Math.random() * 6.5;
    game.particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 3.2,
      glyph: glyphs[i % glyphs.length],
      size: 16 + Math.floor(Math.random() * 12),
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.15,
      alpha: 1.0,
      decay: 0.013 + Math.random() * 0.012
    });
  }
}

function triggerBullseye2xImpact(x, y) {
  game.bullseyeHitAnim = 1.0;
  game.goldFlash = 1.0;
  game.shake = Math.max(game.shake, 28);

  if (!game.multiplierShockwaves) game.multiplierShockwaves = [];
  game.multiplierShockwaves.push(
    { x, y, r: 12, maxR: 130, speed: 7.2, alpha: 1.0, color: "#fff59d", width: 6 },
    { x, y, r: 6, maxR: 200, speed: 9.8, alpha: 0.92, color: "#ffb800", width: 4.5 },
    { x, y, r: 2, maxR: 270, speed: 12.5, alpha: 0.8, color: "#ff9100", width: 3 }
  );

  game.goldFloatingBanner = {
    x,
    y: Math.max(80, y - 35),
    text: "⭐ 2X MULTIPLIER! ⭐",
    subtext: "+100% SCORE BONUS",
    alpha: 1.0,
    scale: 0.35
  };

  spawnGoldMultiplierBurst(x, y);
}

if (typeof window !== "undefined") {
  window.triggerBullseye2xImpact = triggerBullseye2xImpact;
  window.playMultiplier2xHit = () => audio.playMultiplier2xHit();
}

function initFullscreenStadiumCanvas() {
  const canvas = document.getElementById("stadium-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W = window.innerWidth;
  let H = window.innerHeight;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
  }
  window.addEventListener("orientationchange", () => setTimeout(resize, 120));

  for (let i = 0; i < 65; i++) {
    game.crowdLights.push({
      rx: Math.random(),
      ry: 0.08 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.04
    });
  }

  // Helper to compute 3D Goal & Pitch screen coordinates dynamically for any screen size
  function getStageGeom() {
    const cx = W * 0.5;
    const isPortrait = H > W;

    // Minimum top clearance so the crossbar (goalTop) is NEVER covered by the HUD menu buttons/scorebug
    // The top HUD occupies top 10px..68px.
    // By keeping goalTop comfortably below (min 100px - 140px), the crossbar and net are 100% visible with open clearance.
    const minTopClearance = isPortrait
      ? Math.max(105, Math.min(145, H * 0.16))
      : Math.max(85, Math.min(130, H * 0.13));

    const goalW = isPortrait ? Math.min(W * 0.82, 440) : Math.min(W * 0.54, 600);
    const goalH = isPortrait ? Math.min(goalW * 0.44, H * 0.22) : Math.min(H * 0.27, 220);

    const goalTop = minTopClearance + 16;
    const goalBottom = goalTop + goalH;
    const horizonY = goalBottom - 16;

    const goalLeft = cx - goalW / 2;
    const goalRight = cx + goalW / 2;
    const spotX = cx;
    const spotY = isPortrait ? Math.min(H * 0.73, H - 148) : Math.min(H * 0.74, H - 128);

    return { cx, horizonY, goalW, goalH, goalLeft, goalRight, goalTop, goalBottom, spotX, spotY };
  }

  // ============================================================================
  // SWIPE-TO-SHOOT ENGINE (Miniclip Soccer Strike / Score! Hero style)
  // Replaces static click camping with physical swipe speed, direction & curve!
  // ============================================================================
  function updateAimFromPointer(clientX, clientY) {
    const g = getStageGeom();
    const nx = (clientX - g.cx) / (g.goalW * 0.5);
    const ny = (g.goalBottom - clientY) / g.goalH;
    game.aimNx = Math.max(-1.55, Math.min(1.55, nx));
    game.aimNy = Math.max(0.0, Math.min(1.55, ny));
  }

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function mapPointerToGoalkeeperTarget(pos, g, pointerType) {
    // Horizontal mapping:
    // With (g.goalW * 0.55), moving thumb sideways comfortably reaches the goal posts
    const tapNx = clampNum((pos.x - g.cx) / (g.goalW * 0.55), -1.15, 1.15);

    let tapNy = 0;
    // Lower touch zone extends from just below the goal line to near the bottom of screen
    const lowerZoneTop = g.goalBottom + 10;
    const lowerZoneBottom = H - 35;

    if (pos.y >= lowerZoneTop) {
      // Touch/drag is in the lower half of the screen:
      // Player's hand/thumb never covers the goal mouth, keeper, or incoming ball trajectory!
      const span = Math.max(100, lowerZoneBottom - lowerZoneTop);
      const norm = (lowerZoneBottom - pos.y) / (span * 0.85);
      tapNy = clampNum(norm, 0.0, 1.15);
    } else {
      // Touch is directly on/near the goal mouth: apply a touch lift offset so the glove stays visible above finger
      const touchLift = (pointerType === "touch" || !pointerType) ? 45 : 0;
      tapNy = clampNum((g.goalBottom - (pos.y - touchLift)) / g.goalH, 0.0, 1.15);
    }

    const targetAngle = (tapNx > 0.12 ? 0.42 : (tapNx < -0.12 ? -0.42 : 0));
    return { tapNx, tapNy, targetAngle };
  }

  function onPointerDown(e) {
    if (!canPlayMatch()) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    game.lastInteractionTime = Date.now();

    if (game.shootoutTurn === "defend") {
      const pos = getCanvasPos(e);
      const g = getStageGeom();
      const mapped = mapPointerToGoalkeeperTarget(pos, g, e.pointerType);
      game.keeper.targetNx = mapped.tapNx;
      game.keeper.targetNy = mapped.tapNy;
      game.keeper.targetAngle = mapped.targetAngle;
      game.keeper.armReach = 0.85;
      game.defendTouch = { active: true, x: pos.x, y: pos.y, pointerId: e.pointerId };
      spawnSparks(pos.x, pos.y, "#38bdf8", 16);
      return;
    }

    if (game.phase !== "aim") return;

    const pos = getCanvasPos(e);
    game.swipe = {
      active: true,
      pointerId: e.pointerId,
      points: [{ x: pos.x, y: pos.y, t: performance.now() }],
      startTime: performance.now()
    };

    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }

    updateAimFromPointer(pos.x, pos.y);
  }

  function onPointerMove(e) {
    if (!canPlayMatch()) return;
    const pos = getCanvasPos(e);

    if (game.shootoutTurn === "defend" && (game.phase === "defend_ready" || game.phase === "defend_aim" || game.phase === "defend_flight")) {
      const g = getStageGeom();
      const mapped = mapPointerToGoalkeeperTarget(pos, g, e.pointerType);
      game.keeper.targetNx = mapped.tapNx;
      game.keeper.targetNy = mapped.tapNy;
      game.keeper.targetAngle = mapped.targetAngle;
      if (game.defendTouch && game.defendTouch.pointerId === e.pointerId) {
        game.defendTouch.x = pos.x;
        game.defendTouch.y = pos.y;
      }
      return;
    }

    if (!game.swipe || !game.swipe.active || game.swipe.pointerId !== e.pointerId) {
      if (game.phase === "aim" && e.pointerType === "mouse") {
        updateAimFromPointer(pos.x, pos.y);
      }
      return;
    }

    game.lastInteractionTime = Date.now();
    const pts = game.swipe.points;
    const last = pts[pts.length - 1];
    const dist = Math.hypot(pos.x - last.x, pos.y - last.y);
    if (dist >= 3) {
      pts.push({ x: pos.x, y: pos.y, t: performance.now() });

      // Visual spark trail while swiping
      if (Math.random() < 0.45) {
        const fx = game.activeFx || {};
        const p = getPowers();
        const col = fx.power || p.hasRocket ? "#ff3b00" : (fx.curve ? "#c084fc" : (fx.freeze ? "#67e8f9" : "#a8ff00"));
        game.particles.push({
          x: pos.x + (Math.random() - 0.5) * 6,
          y: pos.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          r: 2 + Math.random() * 3,
          color: col,
          alpha: 0.95
        });
      }

      updateAimFromPointer(pos.x, pos.y);
    }
  }

  function onPointerUp(e) {
    if (!canPlayMatch()) return;
    if (game.shootoutTurn === "defend") {
      if (game.defendTouch && game.defendTouch.pointerId === e.pointerId) {
        game.defendTouch.active = false;
      }
    }
    if (!game.swipe || !game.swipe.active || game.swipe.pointerId !== e.pointerId) return;

    if (canvas.releasePointerCapture) {
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    game.swipe.active = false;
    const pos = getCanvasPos(e);
    const pts = game.swipe.points;
    pts.push({ x: pos.x, y: pos.y, t: performance.now() });

    const p0 = pts[0];
    const pEnd = pts[pts.length - 1];
    const totalDist = Math.hypot(pEnd.x - p0.x, pEnd.y - p0.y);
    const dy = pEnd.y - p0.y; // negative is upwards toward goal

    // Anti-camping / Anti-misclick guard:
    // If the player just clicked without a real forward swipe (dist < 35px, or dragged downwards dy > 25px),
    // do NOT fire! This completely stops the top-left corner spamming exploit!
    if (totalDist < 35 || dy > 25) {
      pts.length = 0;
      return;
    }

    // 1. Calculate swipe velocity -> Shot Power (Speed & Intensity)
    const dt = Math.max(35, pEnd.t - p0.t) / 1000;
    const speed = totalDist / dt; // pixels per second
    let shotPower = clampNum((speed - 160) / 1350, 0.20, 1.0);

    // 2. Goal Aim Coordinates (aimNx, aimNy)
    const g = getStageGeom();
    let aimNx = 0;
    let aimNy = 0.5;

    if (pEnd.y <= g.goalBottom) {
      aimNx = (pEnd.x - g.cx) / (g.goalW * 0.5);
      aimNy = (g.goalBottom - pEnd.y) / g.goalH;
    } else {
      const strokeDy = pEnd.y - p0.y;
      const strokeDx = pEnd.x - p0.x;
      const distToGoalY = g.goalBottom - p0.y;
      const rayScale = Math.min(3.2, distToGoalY / (strokeDy || -1));
      const projX = p0.x + strokeDx * rayScale;
      const strokeUpRatio = Math.min(1.4, Math.abs(strokeDy) / (g.spotY - g.goalBottom));
      const projY = g.goalBottom - strokeUpRatio * g.goalH;
      aimNx = (projX - g.cx) / (g.goalW * 0.5);
      aimNy = (g.goalBottom - projY) / g.goalH;
    }

    aimNx = clampNum(aimNx, -1.55, 1.55);
    aimNy = clampNum(aimNy, 0.0, 1.55);

    // 3. Curve / Arc Spin (Calculated from stroke curvature / chord deviation)
    let swipeCurve = 0;
    const chordVx = pEnd.x - p0.x;
    const chordVy = pEnd.y - p0.y;
    const chordLen = Math.hypot(chordVx, chordVy);
    if (chordLen > 30) {
      const nx = -chordVy / chordLen;
      const ny = chordVx / chordLen;
      let maxDev = 0;
      for (let i = 1; i < pts.length - 1; i++) {
        const dev = (pts[i].x - p0.x) * nx + (pts[i].y - p0.y) * ny;
        if (Math.abs(dev) > Math.abs(maxDev)) {
          maxDev = dev;
        }
      }
      swipeCurve = clampNum(maxDev / 42, -2.0, 2.0);
    }

    releaseAndFireShot(shotPower, swipeCurve, { nx: aimNx, ny: aimNy });
    pts.length = 0;
  }

  function onPointerCancel(e) {
    if (game.swipe && game.swipe.pointerId === e.pointerId) {
      game.swipe.active = false;
      game.swipe.points = [];
    }
    if (game.defendTouch && game.defendTouch.pointerId === e.pointerId) {
      game.defendTouch.active = false;
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);

  // Spacebar support for keyboard accessibility
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && game.phase === "aim" && canPlayMatch()) {
      e.preventDefault();
      game.phase = "charging";
      game.isCharging = true;
      game.chargePower = 0.2;
      game.chargeDir = 1;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space" && game.phase === "charging" && game.isCharging && canPlayMatch()) {
      e.preventDefault();
      releaseAndFireShot(game.chargePower, 0);
    }
  });

  function renderFrame() {
    const g = getStageGeom();
    const p = getPowers();
    const lv = getLevelParams(game.level);
    const fx = game.activeFx || {};

    // Update Moving 2x Bullseye Target
    game.bullseyePhase += 0.022;
    game.bullseyeNx = Math.sin(game.bullseyePhase) * 0.74;
    game.bullseyeNy = 0.62 + Math.cos(game.bullseyePhase * 1.7) * 0.22;

    // Update Hold-to-Charge Ring (scales with level difficulty and skills)
    if (game.phase === "charging" && game.isCharging) {
      const chargeStep = (lv.chargeSpeed || 0.026) * (fx.power ? 0.78 : 1.0);
      game.chargePower += chargeStep * game.chargeDir;
      if (game.chargePower >= 1.0) {
        game.chargePower = 1.0;
        game.chargeDir = -1;
      } else if (game.chargePower <= 0.05) {
        game.chargePower = 0.05;
        game.chargeDir = 1;
      }
    }

    // Dynamic Crosshair Sway (Higher levels sway faster & wider; Ice Veins dampens it)
    if (game.phase === "aim" || game.phase === "charging") {
      const swayDamp = fx.steady ? 0.12 : (p.swayMul || 1);
      const t = Date.now() * 0.001 * (lv.swaySpeed || 1);
      game.swayX = Math.sin(t * 2.1) * (lv.sway || 0.03) * swayDamp;
      game.swayY = Math.cos(t * 2.7) * ((lv.sway || 0.03) * 0.7) * swayDamp;
    } else {
      game.swayX = 0;
      game.swayY = 0;
    }

    // Update Articulated Goalkeeper Position (Slows down to 25% when Frozen)
    const isKeeperFrozen = (game.phase === "aim" || game.phase === "charging" || game.phase === "flight") && !!(fx.freeze || game.armed.freeze);
    const keeperSpeedMul = isKeeperFrozen ? 0.25 : 1.0;
    if (game.phase === "aim" || game.phase === "charging") {
      game.keeper.nx = Math.sin(Date.now() * 0.0045 * keeperSpeedMul) * (0.18 * (isKeeperFrozen ? 0.35 : 1.0));
      game.keeper.ny = Math.abs(Math.cos(Date.now() * 0.009 * keeperSpeedMul)) * (0.05 * (isKeeperFrozen ? 0.35 : 1.0));
      game.keeper.bodyAngle = Math.sin(Date.now() * 0.0045 * keeperSpeedMul) * (0.08 * (isKeeperFrozen ? 0.3 : 1.0));
      game.keeper.armReach = (0.25 + Math.sin(Date.now() * 0.008 * keeperSpeedMul) * 0.1) * (isKeeperFrozen ? 0.35 : 1.0);
    } else if (game.phase === "summary" || game.phase === "start") {
      game.keeper.nx += (0 - game.keeper.nx) * 0.12;
      game.keeper.ny += (0 - game.keeper.ny) * 0.12;
      game.keeper.bodyAngle += (0 - game.keeper.bodyAngle) * 0.12;
      game.keeper.armReach = 0.22 + Math.sin(Date.now() * 0.0035) * 0.08;
    } else {
      game.keeper.nx += (game.keeper.targetNx - game.keeper.nx) * (0.22 * keeperSpeedMul);
      game.keeper.ny += (game.keeper.targetNy - game.keeper.ny) * (0.22 * keeperSpeedMul);
      game.keeper.bodyAngle += (game.keeper.targetAngle - game.keeper.bodyAngle) * (0.22 * keeperSpeedMul);
    }

    if (game.strikerLunge > 0.1) game.strikerLunge *= 0.85;
    if (game.netRipple > 0.01) game.netRipple *= 0.91;
    if (game.netFire > 0.01) game.netFire *= 0.955;

    ctx.save();
    if (game.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
      game.shake *= 0.85;
    }

    // 1. STADIUM NIGHT SKY & VOLUMETRIC FLOODLIGHTS
    const skyGrad = ctx.createLinearGradient(0, 0, 0, g.horizonY + 20);
    skyGrad.addColorStop(0, "#020604");
    skyGrad.addColorStop(0.6, "#07170f");
    skyGrad.addColorStop(1, "#0d291a");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, g.horizonY + 20);

    // Floodlight Cones
    const coneL = ctx.createLinearGradient(W * 0.15, 0, g.cx, g.horizonY);
    coneL.addColorStop(0, "rgba(168, 255, 0, 0.14)");
    coneL.addColorStop(1, "rgba(168, 255, 0, 0)");
    ctx.fillStyle = coneL;
    ctx.beginPath();
    ctx.moveTo(W * 0.1, 0);
    ctx.lineTo(W * 0.22, 0);
    ctx.lineTo(g.cx + 220, g.horizonY);
    ctx.lineTo(g.cx - 320, g.horizonY);
    ctx.closePath();
    ctx.fill();

    const coneR = ctx.createLinearGradient(W * 0.85, 0, g.cx, g.horizonY);
    coneR.addColorStop(0, "rgba(255, 184, 0, 0.12)");
    coneR.addColorStop(1, "rgba(255, 184, 0, 0)");
    ctx.fillStyle = coneR;
    ctx.beginPath();
    ctx.moveTo(W * 0.78, 0);
    ctx.lineTo(W * 0.9, 0);
    ctx.lineTo(g.cx + 320, g.horizonY);
    ctx.lineTo(g.cx - 220, g.horizonY);
    ctx.closePath();
    ctx.fill();

    // Stadium Stands & Camera Flashbulbs
    ctx.fillStyle = "#040d08";
    ctx.fillRect(0, H * 0.08, W, g.horizonY - H * 0.08);
    game.crowdLights.forEach((c) => {
      c.phase += c.speed;
      const a = Math.abs(Math.sin(c.phase));
      ctx.fillStyle = a > 0.94 ? "#ffffff" : `rgba(168, 255, 0, ${a * 0.3})`;
      ctx.beginPath();
      ctx.arc(c.rx * W, c.ry * H, a > 0.94 ? 2.8 : 1.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Animated LED Stadium Ribbon Board
    ctx.fillStyle = "#06140c";
    ctx.fillRect(0, g.horizonY - 12, W, 28);
    ctx.strokeStyle = "rgba(168, 255, 0, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, g.horizonY - 12, W, 28);
    ctx.fillStyle = "#a8ff00";
    ctx.font = "700 12px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      "⚡ $EFOO-8fe2d4 • 92.91% BURNED • EFOOTBALL-91a4eb & GOALKEEPER-cb9e3e ARENA ⚡",
      g.cx,
      g.horizonY + 6
    );

    // 2. 3D PERSPECTIVE TURF PITCH & AUTHENTIC FOOTBALL FIELD MARKINGS
    const turfGrad = ctx.createLinearGradient(0, g.horizonY + 16, 0, H);
    turfGrad.addColorStop(0, "#0c2e19");
    turfGrad.addColorStop(0.45, "#113d22");
    turfGrad.addColorStop(1, "#061a0e");
    ctx.fillStyle = turfGrad;
    ctx.fillRect(0, g.horizonY + 16, W, H - g.horizonY);

    // Dynamic 3D perspective projection for football pitch:
    // xM: meters from pitch center (-3.66m = left post, +3.66m = right post)
    // zM: meters from goal line (0 = goal line, 5.5 = 6-yd box, 11 = penalty spot, 16.5 = 18-yd box)
    function pitchProj(xM, zM) {
      const zNorm = Math.max(0, zM / 11.0);
      const y = g.goalBottom + (g.spotY - g.goalBottom) * Math.pow(zNorm, 0.92);
      const scale = 1.0 + zNorm * 0.72;
      const meterPx = (g.goalW / 7.32) * scale;
      const x = g.cx + xM * meterPx;
      return { x, y, scale };
    }

    // Perspective Mowed Alternating Turf Stripes
    for (let i = -7; i <= 7; i++) {
      if (i % 2 === 0) continue;
      const pTL = pitchProj(i * 3.66, 0);
      const pTR = pitchProj((i + 1) * 3.66, 0);
      const pBR = pitchProj((i + 1) * 3.66, 22);
      const pBL = pitchProj(i * 3.66, 22);

      ctx.fillStyle = "rgba(168, 255, 0, 0.028)";
      ctx.beginPath();
      ctx.moveTo(pTL.x, pTL.y);
      ctx.lineTo(pTR.x, pTR.y);
      ctx.lineTo(pBR.x, pBR.y);
      ctx.lineTo(pBL.x, pBL.y);
      ctx.closePath();
      ctx.fill();
    }

    // AUTHENTIC FOOTBALL PITCH CHALK MARKINGS
    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    ctx.lineWidth = 2.5;

    // A. Goal Line (Gólvonal - across pitch)
    const glL = pitchProj(-28, 0);
    const glR = pitchProj(28, 0);
    ctx.beginPath();
    ctx.moveTo(glL.x, glL.y);
    ctx.lineTo(glR.x, glR.y);
    ctx.stroke();

    // B. 6-Yard Box / Goal Area (Ötös: 5.5m deep, 18.32m wide = ±9.16m)
    const b6TL = pitchProj(-9.16, 0);
    const b6TR = pitchProj(9.16, 0);
    const b6BL = pitchProj(-9.16, 5.5);
    const b6BR = pitchProj(9.16, 5.5);

    ctx.beginPath();
    ctx.moveTo(b6TL.x, b6TL.y);
    ctx.lineTo(b6BL.x, b6BL.y);
    ctx.lineTo(b6BR.x, b6BR.y);
    ctx.lineTo(b6TR.x, b6TR.y);
    ctx.stroke();

    // C. 18-Yard Box / Penalty Area (Tizenhatos: 16.5m deep, 40.32m wide = ±20.16m)
    const b18TL = pitchProj(-20.16, 0);
    const b18TR = pitchProj(20.16, 0);
    const b18BL = pitchProj(-20.16, 16.5);
    const b18BR = pitchProj(20.16, 16.5);

    ctx.beginPath();
    ctx.moveTo(b18TL.x, b18TL.y);
    ctx.lineTo(b18BL.x, b18BL.y);
    ctx.lineTo(b18BR.x, b18BR.y);
    ctx.lineTo(b18TR.x, b18TR.y);
    ctx.stroke();

    // D. Penalty Arc (Körív / D-arc: 9.15m circle centered at penalty spot (0, 11.0m))
    // Standard rule: arc exists strictly outside the 18-yard box (z >= 16.5m)
    const arcRadius = 9.15;
    const maxTheta = Math.acos(5.5 / arcRadius); // ~0.925 radians (53 deg)
    ctx.beginPath();
    for (let th = -maxTheta; th <= maxTheta + 0.01; th += 0.05) {
      const xm = arcRadius * Math.sin(th);
      const zm = 11.0 + arcRadius * Math.cos(th);
      const pt = pitchProj(xm, zm);
      if (th === -maxTheta) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // E. Penalty Spot Dot (11-es pont: 11.0m from goal line, center of pitch)
    const spotPt = pitchProj(0, 11.0);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(spotPt.x, spotPt.y + 2, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(spotPt.x, spotPt.y, 6.5, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. 3D GOAL WITH DEPTH STANCHIONS & REACTIVE SPRING NET
    const depthIn = 34;
    const backLeft = g.goalLeft + depthIn;
    const backRight = g.goalRight - depthIn;
    const backTop = g.goalTop + 20;
    const backBottom = g.goalBottom - 10;

    // Back Stanchions
    ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(g.goalLeft, g.goalTop);
    ctx.lineTo(backLeft, backTop);
    ctx.lineTo(backLeft, backBottom);
    ctx.lineTo(g.goalLeft, g.goalBottom);
    ctx.moveTo(g.goalRight, g.goalTop);
    ctx.lineTo(backRight, backTop);
    ctx.lineTo(backRight, backBottom);
    ctx.lineTo(g.goalRight, g.goalBottom);
    ctx.moveTo(backLeft, backTop);
    ctx.lineTo(backRight, backTop);
    ctx.moveTo(backLeft, backBottom);
    ctx.lineTo(backRight, backBottom);
    ctx.stroke();

    // 3D Netting Mesh with Localized Impact Bulge
    ctx.strokeStyle =
      game.netRipple > 0.08
        ? `rgba(168, 255, 0, ${0.24 + game.netRipple * 0.5})`
        : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.1;

    const cols = 22;
    const rows = 10;
    for (let c = 1; c < cols; c++) {
      const u = c / cols;
      const xTop = g.goalLeft + u * g.goalW;
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const v = r / rows;
        let px = xTop;
        let py = g.goalTop + v * g.goalH;
        if (game.netRipple > 0.01) {
          const d = Math.hypot(px - game.netImpactX, py - game.netImpactY);
          const pull = Math.max(0, 1 - d / 140) * game.netRipple * 26;
          px += ((game.netImpactX - px) * pull) / 60;
          py -= pull * 0.65;
        }
        if (r === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    for (let r = 1; r < rows; r++) {
      const v = r / rows;
      const yRow = g.goalTop + v * g.goalH;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        let px = g.goalLeft + u * g.goalW;
        let py = yRow;
        if (game.netRipple > 0.01) {
          const d = Math.hypot(px - game.netImpactX, py - game.netImpactY);
          const pull = Math.max(0, 1 - d / 140) * game.netRipple * 26;
          py -= pull * 0.75;
        }
        if (c === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Render Charred Burning Net Hole from Rocket Fireball ("tüzes labda égesse ki a hálót")
    if (game.netFire > 0.01) {
      const nf = game.netFire;
      const nfx = game.netImpactX || g.cx;
      const nfy = game.netImpactY || (g.goalTop + g.goalH * 0.4);

      ctx.save();
      // 1. Scorch Burn Hole
      const burnGrad = ctx.createRadialGradient(nfx, nfy, 4, nfx, nfy, 65);
      burnGrad.addColorStop(0, `rgba(10, 4, 2, ${nf * 0.95})`);
      burnGrad.addColorStop(0.4, `rgba(45, 12, 3, ${nf * 0.8})`);
      burnGrad.addColorStop(0.7, `rgba(255, 60, 0, ${nf * 0.6})`);
      burnGrad.addColorStop(1, "rgba(255, 180, 0, 0)");
      ctx.fillStyle = burnGrad;
      ctx.beginPath();
      ctx.ellipse(nfx, nfy, 58, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Burning Net Ropes & Embers
      ctx.strokeStyle = `rgba(255, 120, 0, ${nf})`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#ff3b00";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const rx = Math.cos(a) * (34 + Math.sin(Date.now() * 0.02 + a) * 8);
        const ry = Math.sin(a) * (22 + Math.cos(Date.now() * 0.02 + a) * 6);
        ctx.moveTo(nfx, nfy);
        ctx.lineTo(nfx + rx, nfy + ry);
      }
      ctx.stroke();

      // 3. Flame Tongues Licking Upwards
      for (let f = 0; f < 5; f++) {
        const fxOff = (f - 2) * 15;
        const fHeight = (26 + Math.sin(Date.now() * 0.03 + f) * 12) * nf;
        const fGrad = ctx.createLinearGradient(nfx + fxOff, nfy, nfx + fxOff, nfy - fHeight);
        fGrad.addColorStop(0, `rgba(255, 255, 255, ${nf * 0.9})`);
        fGrad.addColorStop(0.3, `rgba(255, 184, 0, ${nf * 0.85})`);
        fGrad.addColorStop(0.8, `rgba(255, 59, 0, ${nf * 0.7})`);
        fGrad.addColorStop(1, "rgba(255, 0, 0, 0)");
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.moveTo(nfx + fxOff - 8, nfy);
        ctx.quadraticCurveTo(nfx + fxOff, nfy - fHeight * 0.6, nfx + fxOff, nfy - fHeight);
        ctx.quadraticCurveTo(nfx + fxOff, nfy - fHeight * 0.6, nfx + fxOff + 8, nfy);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // Front Goalposts & Crossbar
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(168, 255, 0, 0.5)";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(g.goalLeft, g.goalBottom);
    ctx.lineTo(g.goalLeft, g.goalTop);
    ctx.lineTo(g.goalRight, g.goalTop);
    ctx.lineTo(g.goalRight, g.goalBottom);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. MOVING 2x GOLDEN BULLSEYE TARGET RING IN GOAL
    const bx = g.cx + game.bullseyeNx * (g.goalW * 0.5);
    const by = g.goalBottom - game.bullseyeNy * g.goalH;
    const isBullseyeHit = (game.bullseyeHitAnim || 0) > 0.02;
    if (game.bullseyeHitAnim > 0) game.bullseyeHitAnim = Math.max(0, game.bullseyeHitAnim - 0.022);

    ctx.save();
    ctx.translate(bx, by);

    const hitScale = isBullseyeHit ? 1 + game.bullseyeHitAnim * 0.65 : 1 + Math.sin(Date.now() * 0.007) * 0.06;
    ctx.scale(hitScale, hitScale);

    // If hit, draw rotating sunburst rays behind
    if (isBullseyeHit) {
      ctx.save();
      ctx.rotate(Date.now() * 0.012);
      ctx.strokeStyle = `rgba(255, 215, 0, ${game.bullseyeHitAnim * 0.7})`;
      ctx.lineWidth = 2.5;
      for (let r = 0; r < 8; r++) {
        const rayA = (r / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rayA) * 32, Math.sin(rayA) * 32);
        ctx.lineTo(Math.cos(rayA) * (48 + game.bullseyeHitAnim * 28), Math.sin(rayA) * (48 + game.bullseyeHitAnim * 28));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Outer orbiting targeting reticle dashes
    ctx.save();
    ctx.rotate(-Date.now() * 0.003);
    ctx.strokeStyle = isBullseyeHit ? "#ffffff" : "rgba(255, 184, 0, 0.45)";
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Main Golden Bullseye Ring
    ctx.strokeStyle = isBullseyeHit ? "#ffffff" : "#ffb800";
    ctx.lineWidth = isBullseyeHit ? 4.5 : 3;
    ctx.shadowColor = isBullseyeHit ? "#ffffff" : "#ffb800";
    ctx.shadowBlur = isBullseyeHit ? 28 : 16;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isBullseyeHit ? `rgba(255, 235, 59, ${0.4 + game.bullseyeHitAnim * 0.4})` : "rgba(255, 184, 0, 0.22)";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Crosshairs
    ctx.strokeStyle = isBullseyeHit ? "rgba(255,255,255,0.75)" : "rgba(255, 184, 0, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, 0); ctx.lineTo(-6, 0);
    ctx.moveTo(6, 0); ctx.lineTo(16, 0);
    ctx.moveTo(0, -16); ctx.lineTo(0, -6);
    ctx.moveTo(0, 6); ctx.lineTo(0, 16);
    ctx.stroke();

    // Label
    ctx.fillStyle = isBullseyeHit ? "#ffffff" : "#ffb800";
    ctx.font = isBullseyeHit ? "900 12px 'JetBrains Mono', monospace" : "800 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#ffb800";
    ctx.shadowBlur = isBullseyeHit ? 14 : 0;
    ctx.fillText(isBullseyeHit ? "💥 2x" : "⭐ 2x", 0, 1);
    ctx.restore();

    // 5. SUBTLE INTUITION READ & ACTIVE EFFECT AURAS (No cheat target circles!)
    if ((game.phase === "aim" || game.phase === "charging") && p.hasRadar) {
      ctx.save();
      const leanSide = game.keeper.leanShown || (game.keeper.intendedDiveSide >= 0 ? 1 : -1);
      const leanText = leanSide > 0 ? "LEANING RIGHT ➔" : "⬅ LEANING LEFT";
      ctx.fillStyle = "rgba(168, 255, 0, 0.85)";
      ctx.strokeStyle = "rgba(168, 255, 0, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(g.cx - 105, g.goalTop - 26, 210, 22, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#040a06";
      ctx.font = "800 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`🧠 READ: ${leanText}`, g.cx, g.goalTop - 11);
      ctx.restore();
    }

    // 6. ARTICULATED GOALKEEPER ATHLETE + REAL GOALKEEPER-cb9e3e NFT HOLOGRAM
    const kx = g.cx + game.keeper.nx * (g.goalW * 0.44);
    const ky = g.goalBottom - 44 - game.keeper.ny * (g.goalH * 0.62);
    drawArticulatedGoalkeeper(ctx, kx, ky, game.keeper.bodyAngle, game.keeper.armReach, isKeeperFrozen);

    // 6B. GOALKEEPER DEFEND TOUCH ZONE RETICLE (WHEN TOUCHING BELOW GOAL ON MOBILE / PC)
    if (game.shootoutTurn === "defend" && game.defendTouch && game.defendTouch.active) {
      ctx.save();
      const tx = game.defendTouch.x;
      const ty = game.defendTouch.y;

      // Connecting energy beam between finger touch pad and goalkeeper in goal
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(kx, ky);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glowing cyber reticle under finger
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(tx, ty, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(56, 189, 248, 0.22)";
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("🧤", tx, ty + 3.5);
      ctx.restore();
    }

    // 7B. LIVE SWIPE-TO-SHOOT TRAIL RIBBON (Drawn by player's finger or mouse)
    if (game.phase === "aim" && game.swipe && game.swipe.active && game.swipe.points && game.swipe.points.length >= 2) {
      const pts = game.swipe.points;
      const p0 = pts[0];
      const pEnd = pts[pts.length - 1];
      const trailColor = fx.power || p.hasRocket ? "#ff3b00" : (fx.curve ? "#c084fc" : (fx.freeze ? "#67e8f9" : "#a8ff00"));

      ctx.save();
      // Outer neon aura
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = trailColor;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();

      // Bright inner core
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();

      // Glowing tip at current touch/cursor
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = trailColor;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(pEnd.x, pEnd.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring at tip
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(pEnd.x, pEnd.y, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if ((game.phase === "aim" || game.phase === "defend_aim") && (!game.swipe || !game.swipe.active)) {
      // 7C. IDLE TUTORIAL GESTURE (Finger on Phone vs Mouse on PC after 1.6s inactivity)
      const now = Date.now();
      const idleTime = now - (game.lastInteractionTime || 0);

      if (idleTime > 1600) {
        const isTouch = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || (window.innerWidth <= 820);
        const cycle = ((idleTime - 1600) % 2100) / 2100; // 2.1s repeat loop

        ctx.save();

        if (game.shootoutTurn === "shoot" && game.phase === "aim") {
          const startX = g.spotX;
          const startY = g.spotY;
          const targetX = g.cx + g.goalW * 0.35;
          const targetY = g.goalTop + g.goalH * 0.28;
          const ctrlX = (startX + targetX) * 0.5 + 40;
          const ctrlY = (startY + targetY) * 0.5 - 35;

          let prog = 0;
          let alpha = 1;
          let isPressed = false;

          if (cycle < 0.18) {
            prog = 0;
            alpha = cycle / 0.18;
            isPressed = cycle > 0.08;
          } else if (cycle < 0.78) {
            const u = (cycle - 0.18) / 0.60;
            prog = 1 - Math.pow(1 - u, 2.5);
            alpha = 1;
            isPressed = true;
          } else if (cycle < 0.92) {
            prog = 1;
            alpha = 1 - (cycle - 0.78) / 0.14;
            isPressed = false;
          } else {
            alpha = 0;
          }

          if (alpha > 0.02) {
            ctx.globalAlpha = alpha;

            // Draw faint glowing path of the demonstration swipe
            if (prog > 0.02) {
              ctx.strokeStyle = "rgba(168, 255, 0, 0.45)";
              ctx.lineWidth = 4;
              ctx.lineCap = "round";
              ctx.shadowColor = "#a8ff00";
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              const steps = Math.floor(prog * 18);
              for (let s = 1; s <= steps; s++) {
                const su = s / 18;
                const isu = 1 - su;
                const px = isu * isu * startX + 2 * isu * su * ctrlX + su * su * targetX;
                const py = isu * isu * startY + 2 * isu * su * ctrlY + su * su * targetY;
                ctx.lineTo(px, py);
              }
              ctx.stroke();
              ctx.shadowBlur = 0;
            }

            // Current gesture tip position
            const iu = 1 - prog;
            const curX = iu * iu * startX + 2 * iu * prog * ctrlX + prog * prog * targetX;
            const curY = iu * iu * startY + 2 * iu * prog * ctrlY + prog * prog * targetY;

            // Ripple pulse at start when pressing down
            if (prog < 0.25) {
              const ripR = 10 + prog * 48;
              ctx.strokeStyle = `rgba(168, 255, 0, ${0.75 - prog * 2.6})`;
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.arc(startX, startY, ripR, 0, Math.PI * 2);
              ctx.stroke();
            }

            if (isTouch) {
              drawTutorialFinger(ctx, curX, curY, isPressed);
            } else {
              drawTutorialMouse(ctx, curX, curY, isPressed);
            }

            // High-visibility instruction pill
            const hintTxt = isTouch
              ? "👆 SWIPE BALL TO GOAL (DIRECTION & SPEED)"
              : "🖱️ HOLD LEFT-CLICK & DRAG (DIRECTION & SPEED)";
            ctx.font = "800 12px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            const pillW = ctx.measureText(hintTxt).width + 36;
            const pillY = Math.min(H - 45, g.spotY + 36);

            ctx.fillStyle = "rgba(4, 12, 7, 0.92)";
            ctx.strokeStyle = "rgba(168, 255, 0, 0.75)";
            ctx.lineWidth = 1.5;
            ctx.shadowColor = "rgba(168, 255, 0, 0.45)";
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.roundRect(g.spotX - pillW / 2, pillY, pillW, 28, 14);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#a8ff00";
            ctx.fillText(hintTxt, g.spotX, pillY + 18);
          }
        } else if (game.shootoutTurn === "defend" && game.phase === "defend_aim") {
          const lowerZoneY = Math.min(H - 70, g.spotY + 20);
          const diveDemoX = g.cx + (Math.sin(now * 0.004) > 0 ? 1 : -1) * (g.goalW * 0.35);
          const pulse = 0.5 + 0.5 * Math.sin(now * 0.008);

          ctx.globalAlpha = 0.92;
          if (isTouch) {
            drawTutorialFinger(ctx, diveDemoX, lowerZoneY, pulse > 0.5);
          } else {
            drawTutorialMouse(ctx, diveDemoX, lowerZoneY, pulse > 0.5);
          }

          const isHu = currentLang === "hu";
          const isRo = currentLang === "ro";
          const defTxt = isHu
            ? (isTouch ? "🧤 HÚZD AZ UJJAD LENT A VÉDÉSHEZ!" : "🖱️ MOZGASD A KAPUST LENTRŐL IS A VÉDÉSHEZ!")
            : isRo
            ? (isTouch ? "🧤 TRAGE JOS PENTRU A APĂRA!" : "🖱️ MIȘCĂ PORTARUL DE JOS PENTRU A APĂRA!")
            : (isTouch ? "🧤 DRAG BELOW TO DIVE & SAVE!" : "🖱️ MOVE OR CLICK BELOW TO DEFEND!");

          ctx.font = "800 12px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          const pillW = ctx.measureText(defTxt).width + 36;
          const pillY = Math.min(H - 45, g.spotY + 36);

          ctx.fillStyle = "rgba(4, 12, 7, 0.92)";
          ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(g.spotX - pillW / 2, pillY, pillW, 28, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#38bdf8";
          ctx.fillText(defTxt, g.spotX, pillY + 18);
        }

        ctx.restore();
      }
    }

    // 7D. MIND READ HOLOGRAPHIC TARGET RADAR (DURING DEFENSE TURN)
    if (game.shootoutTurn === "defend" && (fx.mind_read || game.armed.mind_read || p.hasRadar)) {
      const radarX = g.cx + game.aiTargetNx * (g.goalW * 0.5);
      const radarY = g.goalBottom - game.aiTargetNy * g.goalH;
      const pulseR = 26 + Math.sin(Date.now() * 0.012) * 6;
      ctx.save();
      ctx.strokeStyle = "#ffb800";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#ffb800";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(radarX, radarY, pulseR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 184, 0, 0.22)";
      ctx.fill();
      ctx.fillStyle = "#ffb800";
      ctx.font = "800 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("👁️ MIND READ TARGET", radarX, radarY - pulseR - 8);
      ctx.restore();
    }

    // 8. FOREGROUND 3D STRIKER NFT HOLOGRAM ON PITCH (Never overlaps ball or skills dock)
    const strikerOffsetX = (H > W) ? Math.min(130, W * 0.30) : 135;
    drawPitchStrikerHologram(ctx, g.spotX - strikerOffsetX + game.strikerLunge, g.spotY - 28 - game.strikerLunge * 0.4);

    // 9. RADIAL POWER CHARGE RING, & FLYING ROCKET BALL (11 METERS PERSPECTIVE FLIGHT)
    const nowFrame = performance.now();
    const rawDt = game.lastFrameTime ? (nowFrame - game.lastFrameTime) / 1000 : 0.016;
    game.lastFrameTime = nowFrame;
    const dt = Math.min(0.05, Math.max(0.004, rawDt));

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(g.spotX, g.spotY + 10, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (game.phase === "charging" && game.isCharging) {
      // Draw 360° Radial Power Meter around the Ball!
      const rRing = 44;
      ctx.save();
      ctx.translate(g.spotX, g.spotY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, rRing, 0, Math.PI * 2);
      ctx.stroke();

      const sweetMin = lv.sweetMin || 0.42;
      const sweetMax = fx.power ? Math.min(0.96, (lv.sweetMax || 0.88) + 0.18) : (lv.sweetMax || 0.88);
      const isSweet = game.chargePower >= sweetMin && game.chargePower <= sweetMax;
      ctx.strokeStyle = game.chargePower > 0.95 ? "#ef4444" : isSweet ? "#a8ff00" : "#ffb800";
      ctx.lineWidth = 8;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, rRing, -Math.PI / 2, -Math.PI / 2 + game.chargePower * Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = "800 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(isSweet ? "🔥 SWEET SPOT!" : (game.chargePower > 0.95 ? "⚠️ TOO HARD" : "⚡ POWER"), 0, rRing + 22);
      ctx.restore();
    }

    if (game.ball.active) {
      const b = game.ball;
      // Time-based 11m flight (0.62s - 0.85s) so it is clearly visible across 60Hz, 120Hz, and 144Hz screens!
      const flightDuration = b.duration || 0.72;
      b.t += dt / flightDuration;
      const u = Math.min(1, b.t);
      const iu = 1 - u;

      const endX = g.cx + b.aimNx * (g.goalW * 0.5);
      const endY = g.goalBottom - b.aimNy * g.goalH;

      // 3D arc & curve over the 11-meter distance from penalty spot to goal net
      const arcLift = 68 + Math.abs(b.aimNy) * 32;
      const ctrlX = (g.spotX + endX) * 0.5 + b.curveIntensity * 115;
      const ctrlY = (g.spotY + endY) * 0.5 - arcLift;

      const bx = iu * iu * g.spotX + 2 * iu * u * ctrlX + u * u * endX;
      const by = iu * iu * g.spotY + 2 * iu * u * ctrlY + u * u * endY;

      // Perspective depth scaling across 11 meters (32px at spot -> 14.5px inside goal net)
      const rad = 32 * (1 - u * 0.54);

      // 11m Ground Shadow traveling on the turf beneath the flying ball
      const groundX = g.spotX + (endX - g.spotX) * u + b.curveIntensity * 35 * (2 * iu * u);
      const groundY = g.spotY + (g.goalBottom - g.spotY) * u;
      const shadowScale = 1 - u * 0.55;
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${0.42 * (1 - u * 0.35)})`;
      ctx.beginPath();
      ctx.ellipse(groundX, groundY + 6, Math.max(4, 18 * shadowScale), Math.max(2, 5.5 * shadowScale), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Record & render 3D curved flight trail wake so the 11m trajectory into the net is unmistakable
      if (!b.trail) b.trail = [];
      b.trail.push({ x: bx, y: by, r: rad, u });
      if (b.trail.length > 18) b.trail.shift();

      if (b.trail.length > 1) {
        ctx.save();
        const wakeColor = (b.isSweet || p.hasRocket || fx.power)
          ? "rgba(255, 136, 0, 0.45)"
          : fx.curve
          ? "rgba(192, 132, 252, 0.45)"
          : "rgba(168, 255, 0, 0.38)";
        for (let ti = 1; ti < b.trail.length; ti++) {
          const p0 = b.trail[ti - 1];
          const p1 = b.trail[ti];
          const frac = ti / b.trail.length;
          ctx.strokeStyle = wakeColor;
          ctx.globalAlpha = frac * 0.75;
          ctx.lineWidth = Math.max(2, p1.r * 0.85 * frac);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Rocket Fireball Flames & Sparks
      if (b.isSweet || p.hasRocket || fx.power) {
        for (let k = 0; k < 2; k++) {
          game.particles.push({
            x: bx + (Math.random() - 0.5) * 12,
            y: by + (Math.random() - 0.5) * 12 + 6,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 2 + Math.random() * 4,
            r: 4 + Math.random() * 6,
            color: Math.random() < 0.4 ? "#ffffff" : (Math.random() < 0.7 ? "#ffb800" : "#ff3b00"),
            alpha: 1.0
          });
        }
      } else {
        game.particles.push({
          x: bx + (Math.random() - 0.5) * 8,
          y: by + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 1 + Math.random() * 2,
          r: 3 + Math.random() * 4.5,
          color: fx.curve ? "#c084fc" : (fx.gold ? "#ffb800" : "#a8ff00"),
          alpha: 0.9
        });
      }

      drawBallSprite(ctx, bx, by, rad, u * 22);
      if (b.isTwin) {
        drawBallSprite(ctx, bx + Math.sin(u * 9) * 36, by - 14, rad * 0.9, -u * 22);
      }

      if (b.t >= 1) {
        b.active = false;
        game.settledBall = {
          x: endX,
          y: Math.min(g.goalBottom - 6, endY + 10),
          r: rad * 0.92,
          until: Date.now() + 900
        };
        if (game.shootoutTurn === "defend") {
          onAiBallReachGoal(endX, endY);
        } else {
          onBallReachGoal(endX, endY);
        }
      }
    } else if (
      game.phase === "shoot_ready" ||
      game.phase === "aim" ||
      game.phase === "charging" ||
      game.phase === "defend_ready" ||
      game.phase === "defend_aim"
    ) {
      const pulse = 30 + Math.sin(Date.now() * 0.008) * 1.8;
      drawBallSprite(ctx, g.spotX, g.spotY, pulse, Date.now() * 0.002);
    } else if (game.phase === "celebrate" && game.settledBall && Date.now() < game.settledBall.until) {
      // Show ball resting in the back of the net after flying 11m
      drawBallSprite(ctx, game.settledBall.x, game.settledBall.y, game.settledBall.r, 0.4);
    }

    // 10. RENDER PARTICLES
    for (let i = game.particles.length - 1; i >= 0; i--) {
      const pt = game.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.glyph) {
        pt.vy += 0.08;
        pt.rot = (pt.rot || 0) + (pt.vRot || 0.05);
      } else {
        pt.vy += 0.14; // soft stadium gravity
        pt.vx *= 0.98; // soft air drag
      }
      pt.alpha -= pt.decay || 0.026;
      if (pt.alpha <= 0) {
        game.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.alpha);
      if (pt.glyph) {
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot || 0);
        ctx.font = `bold ${pt.size || 18}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#ffb800";
        ctx.shadowBlur = 12;
        ctx.fillText(pt.glyph, 0, 0);
      } else {
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.5, pt.r), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // 10b. RENDER MULTIPLIER 2X SHOCKWAVES
    if (game.multiplierShockwaves && game.multiplierShockwaves.length > 0) {
      for (let i = game.multiplierShockwaves.length - 1; i >= 0; i--) {
        const sw = game.multiplierShockwaves[i];
        sw.r += sw.speed;
        sw.alpha -= 0.026;
        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
          game.multiplierShockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.width * (sw.r / sw.maxR * 0.5 + 0.5);
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 10c. FULLSCREEN GOLD MULTIPLIER FLASH VIGNETTE
    if (game.goldFlash > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, game.goldFlash);
      const flashGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.9);
      flashGrad.addColorStop(0, "rgba(255, 235, 59, 0)");
      flashGrad.addColorStop(0.65, "rgba(255, 184, 0, 0.26)");
      flashGrad.addColorStop(1, "rgba(255, 140, 0, 0.52)");
      ctx.fillStyle = flashGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      game.goldFlash = Math.max(0, game.goldFlash - 0.024);
    }

    // 10d. FLOATING 2X MULTIPLIER HIT BADGE
    if (game.goldFloatingBanner && game.goldFloatingBanner.alpha > 0.01) {
      const fb = game.goldFloatingBanner;
      fb.y -= 1.1;
      fb.scale = Math.min(1.0, fb.scale + 0.08);
      fb.alpha -= 0.016;

      ctx.save();
      ctx.globalAlpha = Math.max(0, fb.alpha);
      ctx.translate(fb.x, fb.y);
      ctx.scale(fb.scale, fb.scale);

      const bW = 210;
      const bH = 50;
      const bGrad = ctx.createLinearGradient(-bW / 2, -bH / 2, bW / 2, bH / 2);
      bGrad.addColorStop(0, "rgba(25, 20, 5, 0.94)");
      bGrad.addColorStop(0.5, "rgba(50, 40, 8, 0.96)");
      bGrad.addColorStop(1, "rgba(25, 20, 5, 0.94)");

      ctx.fillStyle = bGrad;
      ctx.strokeStyle = "#ffb800";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#ffb800";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.roundRect(-bW / 2, -bH / 2, bW, bH, 25);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ffe066";
      ctx.font = "900 15px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fb.text, 0, -8);

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffb800";
      ctx.font = "800 10px 'JetBrains Mono', monospace";
      ctx.fillText(fb.subtext, 0, 12);

      ctx.restore();

      if (fb.alpha <= 0.01) game.goldFloatingBanner = null;
    }

    // 11. DRAW SUPER SKILL ACTIVATION FLASH
    if (game.skillFlash && game.skillFlash.alpha > 0.05) {
      const sf = game.skillFlash;
      sf.alpha -= 0.022;
      ctx.save();
      ctx.globalAlpha = sf.alpha;
      ctx.fillStyle = "rgba(4, 12, 8, 0.94)";
      ctx.strokeStyle = sf.color || "#a8ff00";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(g.cx - 240, H * 0.38, 480, 52, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = sf.color || "#a8ff00";
      ctx.font = "800 18px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = sf.color;
      ctx.shadowBlur = 14;
      ctx.fillText(sf.text, g.cx, H * 0.38 + 26);
      ctx.restore();
    }

    // 12. DRAW BIG GOAL / SAVE / MISS FLASH BANNER
    if (game.bigBanner) {
      ctx.save();
      ctx.fillStyle = "rgba(4, 10, 7, 0.88)";
      ctx.strokeStyle = game.bigBannerColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(g.cx - 260, H * 0.46, 520, 62, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = game.bigBannerColor;
      ctx.font = "700 32px 'Bebas Neue', Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(game.bigBanner, g.cx, H * 0.46 + 33);
      ctx.restore();
    }

    // 12b. FULL-SCREEN MATCH RESULT NOTIFICATION (VICTORY / DEFEAT / DRAW)
    if (game.matchResult) {
      const mr = game.matchResult;
      const el = Math.min(1, (performance.now() - mr.startedAt) / 450);
      const ease = 1 - Math.pow(1 - el, 3);
      const pop = mr.kind === "loss" ? 1 : 1 + Math.sin(el * Math.PI) * 0.12;
      const fadeOut = Math.max(0, Math.min(1, (2600 - (performance.now() - mr.startedAt)) / 350));
      const cy = H * 0.44;
      const boxW = Math.min(W - 24, 560);
      const boxH = 190;
      ctx.save();
      ctx.globalAlpha = fadeOut;
      ctx.fillStyle = `rgba(0, 0, 0, ${0.62 * ease})`;
      ctx.fillRect(0, 0, W, H);
      if (mr.kind === "loss") {
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.8);
        vg.addColorStop(0, "rgba(120,0,0,0)");
        vg.addColorStop(1, `rgba(160,0,0,${0.45 * ease})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.translate(g.cx, cy);
      ctx.scale(ease * pop, ease * pop);
      ctx.fillStyle = "rgba(4, 10, 7, 0.94)";
      ctx.strokeStyle = mr.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = mr.color;
      ctx.shadowBlur = 36;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 24);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 18;
      ctx.fillStyle = mr.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const icon = mr.kind === "win" ? "🏆" : mr.kind === "draw" ? "⚖️" : "💔";
      ctx.font = "46px sans-serif";
      ctx.fillText(icon, 0, -boxH / 2 + 34);
      ctx.font = `800 ${Math.min(76, boxW / 6.4)}px 'Bebas Neue', Impact, sans-serif`;
      ctx.fillText(mr.title, 0, -8);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 24px 'Bebas Neue', Impact, sans-serif";
      ctx.fillText(`${mr.sub}  •  ${mr.score}`, 0, 42);
      ctx.restore();
    }

    // 13. ENHANCED ATMOSPHERE SCREEN EDGE AURA FOR ACTIVE / ARMED SUPER SKILLS
    const activeSkillType = fx.power || game.armed.power ? "power"
      : fx.freeze || game.armed.freeze ? "freeze"
      : fx.gold || game.armed.gold ? "gold"
      : fx.curve || game.armed.curve ? "curve"
      : fx.steady || game.armed.steady ? "steady"
      : null;

    if (activeSkillType) {
      ctx.save();
      const auraColor = activeSkillType === "power" ? "rgba(255, 60, 0, 0.22)"
        : activeSkillType === "freeze" ? "rgba(56, 189, 248, 0.24)"
        : activeSkillType === "gold" ? "rgba(255, 184, 0, 0.22)"
        : activeSkillType === "curve" ? "rgba(192, 132, 252, 0.22)"
        : "rgba(168, 255, 0, 0.20)";

      const pulseAura = 0.72 + Math.sin(Date.now() * 0.007) * 0.28;
      const edgeVignette = ctx.createRadialGradient(
        W * 0.5, H * 0.5, Math.min(W, H) * 0.35,
        W * 0.5, H * 0.5, Math.max(W, H) * 0.75
      );
      edgeVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      edgeVignette.addColorStop(1, auraColor.replace(/[\d\.]+\)$/, `${0.32 * pulseAura})`));
      ctx.fillStyle = edgeVignette;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = activeSkillType === "power" ? "#ff5500"
        : activeSkillType === "freeze" ? "#38bdf8"
        : activeSkillType === "gold" ? "#ffb800"
        : activeSkillType === "curve" ? "#c084fc"
        : "#a8ff00";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(3, 3, W - 6, H - 6);
      ctx.restore();
    }

    ctx.restore();
    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
}

// Pro Articulated Vector Goalkeeper + Real GOALKEEPER-cb9e3e NFT Crest
function drawArticulatedGoalkeeper(ctx, x, y, angle, armReach, isFrozen = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Ground shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 42, 34, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs & Boots
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-10, 14);
  ctx.lineTo(-18, 38);
  ctx.moveTo(10, 14);
  ctx.lineTo(18, 38);
  ctx.stroke();

  // Neon Boots
  ctx.fillStyle = "#a8ff00";
  ctx.beginPath();
  ctx.arc(-19, 39, 5, 0, Math.PI * 2);
  ctx.arc(19, 39, 5, 0, Math.PI * 2);
  ctx.fill();

  // Outstretched Articulated Arms & Pro Keeper Gloves
  const armSpreadX = 38 + armReach * 18;
  const armLiftY = -8 - armReach * 24;
  ctx.strokeStyle = "#ffb800";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-16, -12);
  ctx.lineTo(-armSpreadX, armLiftY);
  ctx.moveTo(16, -12);
  ctx.lineTo(armSpreadX, armLiftY);
  ctx.stroke();

  // Pro Padded Keeper Gloves (Vector Polygon + Glow)
  [-1, 1].forEach((dir) => {
    const gx = dir * armSpreadX;
    const gy = armLiftY;
    ctx.fillStyle = "#a8ff00";
    ctx.strokeStyle = "#040906";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gx, gy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Keeper Torso:
  // When user shoots (game.shootoutTurn === "shoot") ➔ Keeper is CPU / BOT (NO NFT).
  // When bot shoots (game.shootoutTurn === "defend") ➔ Keeper is USER'S OWN NFT GOALKEEPER!
  const isUserDefending = game.shootoutTurn === "defend";
  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));

  if (isUserDefending && isConnected) {
    // 1. User's Own NFT Goalkeeper
    const kTier = getNftRarityTier(activeKeeper);
    ctx.fillStyle = "#091910";
    ctx.strokeStyle = kTier.borderColor || "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-26, -34, 52, 54, 12);
    ctx.fill();
    ctx.stroke();

    if (imgs.keeper.complete && imgs.keeper.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-23, -31, 46, 48, 9);
      ctx.clip();
      ctx.drawImage(imgs.keeper, -23, -31, 46, 48);
      ctx.restore();
    }

    // Keeper Jersey Number & Tier Tag
    ctx.fillStyle = kTier.borderColor || "#38bdf8";
    ctx.font = "800 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${kTier.tierIcon} #${activeKeeper.jersey || "01"}`, 0, -40);
  } else {
    // 2. CPU / Bot Goalkeeper (NO NFT, Clean Bot Kit)
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-26, -34, 52, 54, 12);
    ctx.fill();
    ctx.stroke();

    // Standard AI / Bot Goalkeeper Jersey Graphic
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(-22, -30, 44, 46, 8);
    ctx.fill();

    // Sleek AI Bot Crest / Number
    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("🤖 CPU", 0, -10);
    ctx.fillStyle = "#64748b";
    ctx.font = "700 8px 'JetBrains Mono', monospace";
    ctx.fillText(`LVL ${game.level}`, 0, 4);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "800 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("BOT GK", 0, -40);
  }

  // 3D TRANSLUCENT ICE CUBE ENCLOSING KEEPER ("jégkocka fagyassza le a kapust s lassan mozogjon")
  if (isFrozen) {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);

    const bw = 96;
    const bh = 114;
    const bTop = -68;
    const bLeft = -bw / 2;

    // Glowing ice cube
    ctx.shadowColor = "rgba(56, 189, 248, 0.9)";
    ctx.shadowBlur = 24;
    const iceGrad = ctx.createLinearGradient(bLeft, bTop, bLeft + bw, bTop + bh);
    iceGrad.addColorStop(0, "rgba(224, 250, 255, 0.70)");
    iceGrad.addColorStop(0.35, "rgba(125, 230, 250, 0.50)");
    iceGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.42)");
    iceGrad.addColorStop(1, "rgba(14, 116, 144, 0.60)");
    ctx.fillStyle = iceGrad;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(bLeft, bTop, bw, bh, 10);
    ctx.fill();
    ctx.stroke();

    // 3D top bevel
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.beginPath();
    ctx.moveTo(bLeft, bTop);
    ctx.lineTo(bLeft + 14, bTop - 12);
    ctx.lineTo(bLeft + bw + 14, bTop - 12);
    ctx.lineTo(bLeft + bw, bTop);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.stroke();

    // 3D right bevel
    ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
    ctx.beginPath();
    ctx.moveTo(bLeft + bw, bTop);
    ctx.lineTo(bLeft + bw + 14, bTop - 12);
    ctx.lineTo(bLeft + bw + 14, bTop + bh - 12);
    ctx.lineTo(bLeft + bw, bTop + bh);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ice crystal cracks & facets
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(bLeft + 16, bTop + 24);
    ctx.lineTo(bLeft + 38, bTop + 50);
    ctx.lineTo(bLeft + 28, bTop + 80);
    ctx.moveTo(bLeft + 38, bTop + 50);
    ctx.lineTo(bLeft + 68, bTop + 56);
    ctx.lineTo(bLeft + 78, bTop + 92);
    ctx.stroke();

    // Icicles dripping from bottom of ice cube
    ctx.fillStyle = "rgba(224, 250, 255, 0.85)";
    [-32, -14, 6, 24].forEach((ix, i) => {
      const iLen = 12 + (i % 3) * 6;
      ctx.beginPath();
      ctx.moveTo(ix - 5, bTop + bh);
      ctx.lineTo(ix + 5, bTop + bh);
      ctx.lineTo(ix, bTop + bh + iLen);
      ctx.closePath();
      ctx.fill();
    });

    // Frozen status badge
    ctx.fillStyle = "rgba(4, 20, 28, 0.9)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-65, bTop - 36, 130, 20, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#38bdf8";
    ctx.font = "800 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("🧊 FROZEN (25% SPEED)", 0, bTop - 22);

    ctx.restore();
  }

  ctx.restore();
}

// Foreground 3D Striker next to Penalty Spot
function drawPitchStrikerHologram(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  const isUserShooting = game.shootoutTurn === "shoot";
  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));

  if (isUserShooting && isConnected) {
    // 1. User's Own NFT Striker
    const sTier = getNftRarityTier(activeStriker);

    // Turf Neon Ring beneath Striker
    ctx.strokeStyle = `${sTier.borderColor || "#a8ff00"}88`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 52, 46, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Holographic FUT Card Frame with Tier Border
    ctx.shadowColor = sTier.borderColor !== "#71717a" ? sTier.borderColor : "rgba(168, 255, 0, 0.5)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#07150d";
    ctx.strokeStyle = sTier.borderColor || "#a8ff00";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-42, -52, 84, 98, 12);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (imgs.striker.complete && imgs.striker.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-38, -48, 76, 74, 9);
      ctx.clip();
      ctx.drawImage(imgs.striker, -38, -48, 76, 74);
      ctx.restore();
    }

    ctx.fillStyle = sTier.borderColor || "#a8ff00";
    ctx.font = "800 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    const nameStr = activeStriker.name.length > 14 ? activeStriker.name.slice(-6) : activeStriker.name;
    ctx.fillText(`${sTier.tierIcon} ${nameStr}`, 0, 38);
  } else {
    // 2. CPU / Bot Striker (NO NFT, Standard AI Bot Striker)
    ctx.strokeStyle = "rgba(239, 68, 68, 0.55)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 52, 46, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#1e1b4b";
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-42, -52, 84, 98, 12);
    ctx.fill();
    ctx.stroke();

    // AI Bot Avatar
    ctx.fillStyle = "#312e81";
    ctx.beginPath();
    ctx.roundRect(-38, -48, 76, 74, 8);
    ctx.fill();

    ctx.fillStyle = "#c7d2fe";
    ctx.font = "800 16px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("🤖", 0, -18);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 10px 'JetBrains Mono', monospace";
    ctx.fillText("CPU BOT", 0, 2);
    ctx.fillStyle = "#818cf8";
    ctx.font = "700 8px 'JetBrains Mono', monospace";
    ctx.fillText(`LVL ${game.level} AI`, 0, 16);

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "800 9px 'JetBrains Mono', monospace";
    ctx.fillText("CPU STRIKER", 0, 38);
  }

  ctx.restore();
}

// Idle Demonstration Gestures: Animated Hand/Finger for Mobile Touch, Computer Mouse for Desktop PC
function drawTutorialFinger(ctx, x, y, isPressed) {
  ctx.save();
  ctx.translate(x, y);
  if (isPressed) ctx.scale(0.92, 0.92);

  ctx.shadowColor = "#a8ff00";
  ctx.shadowBlur = 16;

  // Touch hand/finger silhouette
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a8ff00";
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  // Pointing index finger tip
  ctx.arc(0, -20, 9, Math.PI, 0, false);
  ctx.lineTo(9, 4);
  // Knuckles and hand palm
  ctx.arc(15, 14, 8, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(-8, 22);
  ctx.arc(-14, 14, 8, Math.PI / 2, -Math.PI / 2, false);
  ctx.lineTo(-9, -20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Finger detail
  ctx.fillStyle = "rgba(168, 255, 0, 0.4)";
  ctx.beginPath();
  ctx.ellipse(0, -20, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (isPressed) {
    ctx.strokeStyle = "#a8ff00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -20, 16, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTutorialMouse(ctx, x, y, isPressed) {
  ctx.save();
  ctx.translate(x, y);
  if (isPressed) ctx.scale(0.94, 0.94);

  ctx.shadowColor = "#a8ff00";
  ctx.shadowBlur = 16;

  // Mouse body (rounded rectangle)
  ctx.fillStyle = "rgba(8, 24, 15, 0.96)";
  ctx.strokeStyle = isPressed ? "#a8ff00" : "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(-14, -22, 28, 44, 14);
  ctx.fill();
  ctx.stroke();

  // Divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(0, -4);
  ctx.moveTo(-14, -4);
  ctx.lineTo(14, -4);
  ctx.stroke();

  // Left click button (pressed / active)
  if (isPressed) {
    ctx.fillStyle = "#a8ff00";
    ctx.beginPath();
    ctx.roundRect(-13, -21, 12, 16, [12, 0, 0, 0]);
    ctx.fill();

    // Click pulse ring
    ctx.strokeStyle = "#a8ff00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-7, -13, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Scroll wheel
  ctx.fillStyle = isPressed ? "#ffffff" : "#ffb800";
  ctx.beginPath();
  ctx.roundRect(-2.5, -14, 5, 10, 2.5);
  ctx.fill();

  ctx.restore();
}

function drawBallSprite(ctx, x, y, r, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.shadowColor = "rgba(255, 85, 0, 0.85)";
  ctx.shadowBlur = 18;
  if (imgs.ball.complete && imgs.ball.naturalWidth > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgs.ball, -r, -r, r * 2, r * 2);
  } else {
    ctx.fillStyle = "#ff5500";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// MULTIVERSX WALLET & ON-CHAIN TRANSACTIONS
// ============================================================================
function shortErd(addr) {
  if (!addr || addr.length < 16) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function strToHex(str) {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function toBase64Data(str) {
  if (!str) return "";
  try {
    return btoa(str);
  } catch (e) {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function amountToHex(amountFloat, decimals = 18) {
  const factor = Math.pow(10, Math.min(decimals, 9));
  const scaled = BigInt(Math.round(amountFloat * factor)) * BigInt(Math.pow(10, Math.max(0, decimals - 9)));
  let hex = scaled.toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex;
  return hex;
}

let toastTimeoutId = null;

function showToast(html, url = "", duration = 4000) {
  const t = document.getElementById("tx-toast");
  const txt = document.getElementById("tx-toast-text");
  const lnk = document.getElementById("tx-toast-link");
  if (!t || !txt) return;
  txt.innerHTML = html;
  if (lnk) {
    if (url) {
      lnk.href = url;
      lnk.classList.remove("hidden");
    } else {
      lnk.classList.add("hidden");
    }
  }
  t.classList.remove("hidden");

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }
  if (duration > 0) {
    toastTimeoutId = setTimeout(() => {
      t.classList.add("hidden");
      toastTimeoutId = null;
    }, duration);
  }
}

function getCallbackUrl() {
  return window.location.origin + window.location.pathname.replace(/\.html$/, "");
}

function getMultiversXLoginHookUrl() {
  return `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(getCallbackUrl())}`;
}

async function initXPortalWalletConnect() {
  const qrBox = document.getElementById("xportal-qr-box");
  const qrImg = document.getElementById("xportal-qr-img");
  const bridge = document.getElementById("xportal-bridge-link");
  if (qrBox) qrBox.classList.remove("hidden");

  try {
    if (!wcSignClient) {
      let Mod;
      try {
        Mod = await import("https://esm.sh/@walletconnect/sign-client@2.11.0?bundle");
      } catch (e) {
        Mod = await import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client@2.11.0/+esm");
      }
      const SC = Mod.SignClient || Mod.default;
      wcSignClient = await SC.init({
        projectId: CONTRACTS.WC_PROJECT_ID,
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "EFOO FOMO Arena",
          description: "90+5' Fullscreen NFT Penalty Shootout",
          url: window.location.origin,
          icons: ["https://efoo.optibase.ro/branding/original/assests-2022/logo.png"]
        }
      });
    }
    const { uri, approval } = await wcSignClient.connect({
      requiredNamespaces: {
        mvx: {
          chains: ["mvx:1"],
          methods: ["mvx_signTransaction", "mvx_signTransactions", "mvx_signMessage"],
          events: []
        }
      }
    });
    if (uri) {
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=10&color=050a07&bgcolor=a8ff00&data=${encodeURIComponent(uri)}`;
      }
      const deepLinkUrl = `https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://xportal.com/?wallet-connect=${encodeURIComponent(uri)}`;
      if (bridge) {
        bridge.href = deepLinkUrl;
        bridge.removeAttribute("target");
        bridge.innerHTML = `📱 ${currentLang === "ro" ? "Apasă pentru Conectare în xPortal" : "Tap to Open & Connect in xPortal"} ↗`;
        bridge.style.display = "inline-flex";
      }
      if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "")) {
        window.location.href = deepLinkUrl;
      }
    }
    const session = await approval();
    wcSessionTopic = session.topic;
    localStorage.setItem("efoo_wc_topic", wcSessionTopic);
    const accs = session?.namespaces?.mvx?.accounts || [];
    if (accs.length > 0) connectWithAddress(accs[0].split(":").pop(), "xportal");
  } catch (err) {
    const loginUrl = getMultiversXLoginHookUrl();
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=10&color=050a07&bgcolor=a8ff00&data=${encodeURIComponent(loginUrl)}`;
    }
  }
}

function getDefiExtension() {
  if (typeof window === "undefined") return null;
  return window.multiversxWallet || window.elrondWallet || window.multiversx || window.elrond || null;
}

function extractAddressFromExtensionResponse(res) {
  if (!res) return "";
  if (typeof res === "string" && res.startsWith("erd1")) return res;
  if (res.address && typeof res.address === "string" && res.address.startsWith("erd1")) return res.address;
  if (res.account?.address && typeof res.account.address === "string" && res.account.address.startsWith("erd1")) return res.account.address;
  if (res.data) {
    if (typeof res.data === "string" && res.data.startsWith("erd1")) return res.data;
    if (res.data.address && typeof res.data.address === "string" && res.data.address.startsWith("erd1")) return res.data.address;
    if (res.data.account?.address && typeof res.data.account.address === "string" && res.data.account.address.startsWith("erd1")) return res.data.account.address;
  }
  return "";
}

function sendExtensionMessage(type, data = "") {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", handleMessage);
      reject(new Error("Extension response timed out"));
    }, 60000);

    function handleMessage(event) {
      if (settled) return;
      if (!event.data || event.data.target !== "erdw-contentScript") return;
      const msg = event.data;

      // Handle user cancellation / error across ALL operations (connect, signTransactions, etc.)
      if (
        msg.type === "cancelResponse" ||
        msg.type === "cancelActionResponse" ||
        msg.type === "errorResponse" ||
        msg.error ||
        (msg.data && msg.data.error)
      ) {
        settled = true;
        clearTimeout(timer);
        window.removeEventListener("message", handleMessage);
        const err = msg.error || (msg.data && msg.data.error) || "User cancelled";
        const errMsg = typeof err === "string" ? err : (err.message || JSON.stringify(err));
        reject(new Error(errMsg));
        return;
      }

      // If we are waiting for connect/login:
      if (type === "connect" || type === "login") {
        settled = true;
        clearTimeout(timer);
        window.removeEventListener("message", handleMessage);
        resolve(msg.data !== undefined ? msg.data : msg);
        return;
      }

      // Non-connect operations (signTransactions, signMessage, etc.):
      // Ignore stale connect responses
      if (msg.type === "connectResponse" || msg.type === "loginResponse") return;

      // ANY other message targeting erdw-contentScript resolves the pending action!
      settled = true;
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
      resolve(msg.data !== undefined ? msg.data : msg);
    }

    window.addEventListener("message", handleMessage, false);
    window.postMessage({ target: "erdw-inpage", type, data }, window.origin || "*");
  });
}

function normalizeSignedResult(res) {
  if (!res) return null;
  if (Array.isArray(res) && res.length > 0) return res;
  if (res.transactions && Array.isArray(res.transactions) && res.transactions.length > 0) return res.transactions;
  if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
  if (res.data && res.data.transactions && Array.isArray(res.data.transactions)) return res.data.transactions;
  if (typeof res === "object" && (res.signature || (res.signatures && res.signatures.length > 0) || res.txHash || res.hash)) return [res];
  return null;
}

function extractSignatureHex(sig) {
  if (!sig) return "";
  if (typeof sig === "string") return sig;
  if (typeof sig.hex === "function") return sig.hex();
  if (typeof sig.hex === "string") return sig.hex;
  if (sig instanceof Uint8Array || (Array.isArray(sig) && typeof sig[0] === "number")) {
    return Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  if (typeof sig === "object") {
    if (sig.data && (Array.isArray(sig.data) || sig.data instanceof Uint8Array)) {
      return Array.from(sig.data).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    if (typeof sig.toString === "function") {
      const s = sig.toString("hex");
      if (s && s !== "[object Object]") return s;
    }
  }
  return String(sig);
}

async function signWithExtension(preparedTxs) {
  const extInputTxs = preparedTxs.map((t) => ({
    ...t,
    data: toBase64Data(t.data)
  }));

  const ext = getDefiExtension();
  if (ext && typeof ext.signTransactions === "function") {
    try {
      const raw = await ext.signTransactions(extInputTxs);
      const normalized = normalizeSignedResult(raw);
      if (normalized) return normalized;
    } catch (e) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied") || msg.includes("user cancel")) {
        throw e;
      }
      console.warn("Direct ext.signTransactions failed, trying postMessage bridge:", e);
    }
  }

  const signedRes = await sendExtensionMessage("signTransactions", {
    from: connectedAddress,
    transactions: extInputTxs
  });

  return normalizeSignedResult(signedRes);
}

async function connectDefiExtension() {
  const isHu = currentLang === "hu";
  let ext = getDefiExtension();
  if (!ext) {
    await new Promise((r) => setTimeout(r, 200));
    ext = getDefiExtension();
  }

  if (!ext) {
    const confirmInstall = confirm(
      isHu
        ? "A MultiversX DeFi Wallet bővítmény nem található ebben a böngészőben.\n\nKattints az OK gombra a Web Wallet megnyitásához, vagy telepítsd a bővítményt a Chrome Áruházból!"
        : "MultiversX DeFi Wallet Extension was not detected in this browser.\n\nPress OK to sign in via MultiversX Web Wallet instead (or install the extension from Chrome Web Store)."
    );
    if (confirmInstall) {
      window.location.href = getMultiversXLoginHookUrl();
    }
    return;
  }

  try {
    let addr = extractAddressFromExtensionResponse(ext);
    if (!addr && typeof ext.login === "function") {
      try {
        const res = await ext.login();
        addr = extractAddressFromExtensionResponse(res);
      } catch (e) {
        console.warn("Direct ext.login failed, trying postMessage bridge:", e);
      }
    }
    if (!addr) {
      const res = await sendExtensionMessage("connect", "");
      addr = extractAddressFromExtensionResponse(res);
    }

    if (addr && addr.startsWith("erd1")) {
      connectWithAddress(addr, "extension");
      showToast(
        isHu
          ? `✅ Sikeresen csatlakozva: ${shortErd(addr)}!`
          : `✅ Connected via MultiversX DeFi Extension (${shortErd(addr)})!`
      );
      return;
    }
  } catch (err) {
    console.warn("Extension connect cancelled or failed:", err);
    const msg = (err?.message || "").toLowerCase();
    if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied")) {
      showToast(
        isHu
          ? "❌ A tárca csatlakozást elutasítottad a bővítményben."
          : "❌ Connection rejected in wallet extension."
      );
      return;
    }
    showToast(
      isHu
        ? "⚠️ Nem sikerült a csatlakozás a bővítményhez."
        : "⚠️ Could not connect to extension."
    );
  }
}

function syncPendingGuestScoreOnConnect() {
  try {
    let score = 0;
    let goals = 0;
    let level = 1;
    let hasPending = false;

    const raw = sessionStorage.getItem("efoo_pending_guest_score");
    if (raw) {
      sessionStorage.removeItem("efoo_pending_guest_score");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.score > 0 && Date.now() - (parsed.ts || 0) < 15 * 60 * 1000) {
        score = parsed.score;
        goals = parsed.goals || 0;
        level = parsed.level || 1;
        hasPending = true;
      }
    } else if (isPostMatchLeaderboardActive && game && game.score > 0) {
      score = game.score;
      goals = game.userGoals || 0;
      level = game.level || 1;
      hasPending = true;
    }

    if (hasPending && connectedAddress && connectedAddress.startsWith("erd1")) {
      recordMatchToLeaderboard(score, goals, level);
      isPostMatchLeaderboardActive = true;
      renderLeaderboardModal({ isPostMatch: true, score, goals, level });
      document.getElementById("leaderboard-modal-overlay")?.classList.remove("hidden");
    }
  } catch (e) {}
}

function connectWithAddress(address, provider = "webwallet") {
  const clean = (address || "").trim();
  const isSol = typeof SolanaAdapter !== "undefined" && SolanaAdapter.isSolanaAddress(clean);
  if (!isSol && (!clean.startsWith("erd1") || clean.length < 40)) return;
  if (!VALID_WALLET_PROVIDERS.includes(provider)) return;

  if (provider === "webwallet" && typeof window !== "undefined" && getDefiExtension()) {
    provider = "extension";
  }

  connectedAddress = clean;
  connectedProvider = provider;
  try {
    localStorage.setItem("efoo_wallet_address", clean);
    localStorage.setItem("efoo_wallet_provider", provider);
    localStorage.setItem("multiversx_address", clean);
    localStorage.setItem("multiversx_provider", provider);
    localStorage.setItem("efoo_connected_address", clean);
  } catch (e) {}
  document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
  document.getElementById("nav-wallet-label").textContent = shortErd(clean);
  updateOwnerAdminVisibility(clean);
  fetchWalletNftsAndBalance(clean);
  syncPendingGuestScoreOnConnect();
}

function updateOwnerAdminVisibility(addr) {
  const adminBtn = document.getElementById("hud-owner-admin-btn");
  if (!adminBtn) return;
  const OWNER_ADDR = "erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my";
  if (addr === OWNER_ADDR) {
    adminBtn.classList.remove("hidden");
    sessionStorage.setItem("efoo_admin_session_auth_v1", "VALID_OWNER_AUTH");
    localStorage.setItem("efoo_connected_address", OWNER_ADDR);
  } else {
    adminBtn.classList.add("hidden");
    sessionStorage.removeItem("efoo_admin_session_auth_v1");
  }
}

async function terminateWalletConnectSessions(client, topic) {
  if (!client) return;
  try {
    if (topic) {
      await client.disconnect({
        topic: topic,
        reason: { code: 6000, message: "User disconnected" }
      });
    }
  } catch (e) {
    console.warn("WalletConnect disconnect topic notice:", e);
  }
  try {
    const sessions = client.session?.getAll?.() || [];
    for (const sess of sessions) {
      try {
        await client.disconnect({
          topic: sess.topic,
          reason: { code: 6000, message: "User disconnected" }
        });
      } catch (err) {}
    }
  } catch (e) {
    console.warn("WalletConnect disconnect all sessions notice:", e);
  }
}

async function disconnectWallet() {
  if (typeof SolanaAdapter !== "undefined") SolanaAdapter.disconnectPhantom();
  const topicToDisconnect = wcSessionTopic || localStorage.getItem("efoo_wc_topic") || "";

  connectedAddress = "";
  connectedProvider = "";
  wcSessionTopic = "";
  pendingGateAction = null;

  // 1. Actively terminate xPortal WalletConnect session so xPortal app closes session immediately
  if (wcSignClient) {
    terminateWalletConnectSessions(wcSignClient, topicToDisconnect);
  } else if (topicToDisconnect) {
    (async () => {
      try {
        let Mod = await import("https://esm.sh/@walletconnect/sign-client@2.11.0?bundle").catch(() => import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client@2.11.0/+esm"));
        const SC = Mod.SignClient || Mod.default;
        const tempClient = await SC.init({
          projectId: "9b1a9564f91cb659ffe21b73d5c4e2d8",
          relayUrl: "wss://relay.walletconnect.com"
        });
        await terminateWalletConnectSessions(tempClient, topicToDisconnect);
      } catch (e) {}
    })();
  }

  // 2. Revoke authorization from browser extension so it prompts next time
  const ext = getDefiExtension();
  if (ext && typeof ext.logout === "function") {
    try {
      ext.logout();
    } catch (e) {}
  }
  try {
    sendExtensionMessage("logout", "");
  } catch (e) {}

  // Clear all wallet keys from localStorage
  try {
    localStorage.removeItem("efoo_wallet_address");
    localStorage.removeItem("efoo_wallet_provider");
    localStorage.removeItem("efoo_connected_address");
    localStorage.removeItem("efoo_wc_topic");
    localStorage.removeItem("walletconnect");
    localStorage.removeItem("multiversx_address");
    localStorage.removeItem("multiversx_provider");
    localStorage.removeItem("efoo_user_wallet");

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("wc@2:") || k.startsWith("walletconnect"))) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) {}

  // Clear all session storage keys
  try {
    sessionStorage.removeItem("efoo_connected_address");
    sessionStorage.removeItem("efoo_wallet_address");
    sessionStorage.removeItem("efoo_wallet_provider");
    sessionStorage.removeItem("efoo_admin_session_auth_v1");
    sessionStorage.removeItem("multiversx_address");
    sessionStorage.removeItem("multiversx_provider");
  } catch (e) {}

  // Strip query parameters from URL (?address=erd1...) so reloads do not auto-reconnect
  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (e) {}

  updateOwnerAdminVisibility("");

  walletState = {
    loading: false,
    verified: false,
    shard: 0,
    nonce: 0,
    efooBalance: 0,
    playersCount: 0,
    keepersCount: 0,
    ownedNfts: [],
    username: "",
    herotag: ""
  };

  // Reset active squad cards to Rookie defaults
  strikerIdx = 0;
  keeperIdx = 0;
  activeStriker = ROOKIE_STRIKER;
  activeKeeper = ROOKIE_KEEPER;
  updateStrikerCardAssets(0);
  updateKeeperAssets(0);

  // Close modals
  document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
  document.getElementById("intro-cinematic-overlay")?.classList.add("hidden");
  document.getElementById("summary-screen-overlay")?.classList.add("hidden");

  // Refresh all UI elements
  updateEntryGateUI();
  refreshHudUI();
  setStartScreenState(true);

  showToast(
    currentLang === "hu"
      ? "🚪 Sikeresen kijelentkeztél a tárcádból!"
      : (currentLang === "ro"
        ? "🚪 Deconectat cu succes din portofel!"
        : "🚪 Wallet disconnected successfully!")
  );
}

// Cross-tab & Multi-page Synchronous Wallet State Listener
window.addEventListener("storage", (e) => {
  if (e.key === "efoo_wallet_address" || e.key === "multiversx_address" || e.key === null) {
    const newAddr = localStorage.getItem("efoo_wallet_address") || localStorage.getItem("multiversx_address") || "";
    const newProv = localStorage.getItem("efoo_wallet_provider") || localStorage.getItem("multiversx_provider") || "webwallet";
    if (newAddr && newAddr.startsWith("erd1") && newAddr !== connectedAddress) {
      connectedAddress = newAddr;
      connectedProvider = newProv;
      const lbl = document.getElementById("nav-wallet-label");
      if (lbl) lbl.textContent = shortErd(connectedAddress);
      updateOwnerAdminVisibility(connectedAddress);
      updateEntryGateUI();
      fetchWalletNftsAndBalance(connectedAddress);
    } else if (!newAddr && connectedAddress) {
      connectedAddress = "";
      connectedProvider = "";
      walletState.efooBalance = 0;
      walletState.playersCount = 0;
      walletState.keepersCount = 0;
      walletState.ownedNfts = [];
      updateOwnerAdminVisibility("");
      const lbl = document.getElementById("nav-wallet-label");
      if (lbl) lbl.textContent = typeof I18N_GAME !== "undefined" && I18N_GAME[currentLang] ? I18N_GAME[currentLang].btn_connect : "Connect";
      updateEntryGateUI();
      refreshHudUI();
    }
  }
});

async function fetchWalletNftsAndBalance(address) {
  if (!address) return;
  walletState.loading = true;
  updateEntryGateUI();

  try {
    const [accRes, tokRes, pRes, kRes, ultrasRes, nftsRes] = await Promise.all([
      fetch(`https://api.multiversx.com/accounts/${address}`),
      fetch(`https://api.multiversx.com/accounts/${address}/tokens?identifiers=EFOO-8fe2d4`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=EFOOTBALL-91a4eb`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=GOALKEEPER-cb9e3e`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=${ULTRAS_PASS_COLLECTION}`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts?collections=EFOOTBALL-91a4eb,GOALKEEPER-cb9e3e,${ULTRAS_PASS_COLLECTION}&size=100`)
    ]);
    if (accRes.ok) {
      const a = await accRes.json();
      walletState.nonce = Number(a.nonce || 0);
      walletState.shard = Number(a.shard || 0);
      walletState.username = a.username || "";
      walletState.herotag = a.herotag || a.username || "";
    }
    walletState.efooBalance = 0;
    if (tokRes.ok) {
      const t = await tokRes.json();
      if (t.length > 0) walletState.efooBalance = Number(t[0].balance || 0) / 1e18;
    }
    walletState.playersCount = pRes.ok ? Number(await pRes.text()) || 0 : 0;
    walletState.keepersCount = kRes.ok ? Number(await kRes.text()) || 0 : 0;
    walletState.ultrasCount = ultrasRes.ok ? Number(await ultrasRes.text()) || 0 : 0;
    walletState.ownedNfts = nftsRes.ok ? await nftsRes.json() : [];

    const isConnectedUltras = walletState.ultrasCount > 0 || (walletState.ownedNfts && walletState.ownedNfts.some(x => {
      const id = ((x.identifier || "") + " " + (x.name || "") + " " + (x.collection || "")).toLowerCase();
      return id.includes("efoopass-5223a8") || (x.collection && x.collection.toLowerCase() === ULTRAS_PASS_COLLECTION.toLowerCase());
    }));

    if (isConnectedUltras) {
      onchainUltrasHolders.add(address.toLowerCase());
      try {
        localStorage.setItem(STORAGE_ULTRAS_PASS_PREFIX + address.toLowerCase(), "true");
      } catch (e) {}
    } else {
      onchainUltrasHolders.delete(address.toLowerCase());
      try {
        localStorage.removeItem(STORAGE_ULTRAS_PASS_PREFIX + address.toLowerCase());
        localStorage.removeItem("efoo_has_ultras_pass");
      } catch (e) {}
    }

    walletState.verified = true;
    walletState.loading = false;

    // Check if ?nft= parameter is in URL to preselect
    const urlParams = new URLSearchParams(window.location.search);
    const preselectNft = urlParams.get("nft");
    if (preselectNft) {
      const sPool = getAvailableStrikers();
      const sIdx = sPool.findIndex((s) => s.identifier === preselectNft);
      if (sIdx !== -1) strikerIdx = sIdx;

      const kPool = getAvailableKeepers();
      const kIdx = kPool.findIndex((k) => k.identifier === preselectNft);
      if (kIdx !== -1) keeperIdx = kIdx;
    } else {
      strikerIdx = 0;
      keeperIdx = 0;
    }

    const p = getPowers();
    game.shieldsLeft = p.maxShields;
    updateStrikerCardAssets(strikerIdx);
    updateKeeperAssets(keeperIdx);
    refreshHudUI();
    renderSkillsDeckUI();

    const isRo = currentLang === "ro";
    if (walletState.efooBalance < MIN_EFOO_REQUIRED) {
      showToast(
        isRo
          ? `🔒 Portofel conectat (${shortErd(address)}), dar ai ${Math.floor(walletState.efooBalance).toLocaleString("en-US")} $EFOO. Minim 1.000.000 $EFOO necesar! Cumpără acum cu 1 click (0.1 EGLD).`
          : `🔒 Wallet connected (${shortErd(address)}), balance: ${Math.floor(walletState.efooBalance).toLocaleString("en-US")} $EFOO. Minimum 1,000,000 $EFOO required! Click BUY ~2.84M $EFOO (0.1 EGLD) to unlock.`
      );
    } else {
      showToast(
        isRo
          ? `✅ Portofel verificat (${Math.floor(walletState.efooBalance).toLocaleString("en-US")} $EFOO)! Jocul este deblocat — apasă START MECI!`
          : `✅ Wallet verified (${Math.floor(walletState.efooBalance).toLocaleString("en-US")} $EFOO)! Stadium unlocked — click START MATCH!`
      );
    }

    if (pendingGateAction === "buy_starter") {
      pendingGateAction = null;
      buyStarterPackOnChain();
    } else if (pendingGateAction === "buy_efoo") {
      pendingGateAction = null;
      buy3MEfooOnChain();
    } else if (pendingGateAction === "mint_nft") {
      pendingGateAction = null;
      mintStrikerOnChain();
    }
  } catch (e) {
    console.warn("Wallet load notice:", e);
    walletState.loading = false;
    walletState.verified = true;
    refreshHudUI();
  }
}

async function broadcastSignedTransactions(signedTxs) {
  const hashes = [];
  for (const rawTx of signedTxs) {
    let tx = rawTx;
    if (tx && typeof tx.toPlainObject === "function") {
      try { tx = { ...tx.toPlainObject(), ...tx }; } catch (e) {}
    }

    // 1. If extension auto-broadcasted ("Sign & Submit") and already returned txHash / hash
    const existingHash = tx.txHash || tx.hash || (typeof tx.getHash === "function" ? tx.getHash().hex() : null);
    if (existingHash) {
      hashes.push(existingHash);
      continue;
    }

    const rawSig = tx.signature || (tx.signatures && tx.signatures[0]) || (typeof tx.getSignature === "function" ? tx.getSignature() : null);
    const sigHex = extractSignatureHex(rawSig);

    const payload = {
      nonce: Number(tx.nonce),
      value: String(tx.value || "0"),
      receiver: String(tx.receiver),
      sender: String(tx.sender),
      gasPrice: Number(tx.gasPrice || 1000000000),
      gasLimit: Number(tx.gasLimit),
      data: tx.dataIsBase64 ? tx.data : toBase64Data(tx.data || ""),
      chainID: String(tx.chainID || "1"),
      version: Number(tx.version || 1),
      signature: sigHex
    };
    if (tx.options !== undefined && tx.options !== null && Number(tx.options) !== 0) {
      payload.options = Number(tx.options);
    }
    if (tx.guardian) payload.guardian = tx.guardian;
    if (tx.guardianSignature) payload.guardianSignature = tx.guardianSignature;

    let txSent = false;
    // Primary: API endpoint
    try {
      const res = await fetch("https://api.multiversx.com/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.txHash) {
          hashes.push(resData.txHash);
          txSent = true;
        }
      } else {
        const errText = await res.text();
        if (errText.includes("already exists") || errText.includes("lowerNonceInTx")) {
          console.log("Transaction already submitted/in pool:", errText);
          txSent = true;
        }
      }
    } catch (e) {
      console.warn("API broadcast failed, trying gateway fallback:", e);
    }

    // Fallback: Gateway endpoint
    if (!txSent) {
      const gRes = await fetch("https://gateway.multiversx.com/transaction/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        const h = gData?.data?.txHash || gData?.txHash;
        if (h) {
          hashes.push(h);
          txSent = true;
        }
      } else {
        const gErr = await gRes.text();
        if (gErr.includes("already exists") || gErr.includes("lowerNonceInTx")) {
          console.log("Transaction already in pool on gateway:", gErr);
          txSent = true;
        } else {
          throw new Error(`MultiversX Hálózati Hiba: ${gErr}`);
        }
      }
    }
  }
  return hashes;
}

async function signAndSendTxs(txList, actionKey = null) {
  const isRo = currentLang === "ro";
  if (!connectedAddress || !VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    if (actionKey) pendingGateAction = actionKey;
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
    showToast(
      isRo
        ? "⚡ Conectează-ți portofelul (xPortal, Extensie sau Web Wallet) pentru a cumpăra instant!"
        : "⚡ Connect your wallet (xPortal, Extension, or Web Wallet) to complete your instant purchase!"
    );
    return;
  }

  // Refresh latest nonce & shard before signing
  // Fetch latest account nonce & guardian status from MultiversX API
  let isGuarded = false;
  let guardianAddress = "";
  try {
    const accRes = await fetch(`https://api.multiversx.com/accounts/${connectedAddress}`);
    if (accRes.ok) {
      const a = await accRes.json();
      walletState.nonce = Number(a.nonce || 0);
      walletState.shard = Number(a.shard || 0);
      isGuarded = !!a.isGuarded;
    }
  } catch (e) {
    console.warn("Using cached nonce:", e);
  }

  if (isGuarded) {
    try {
      const gRes = await fetch(`https://gateway.multiversx.com/address/${connectedAddress}/guardian-data`);
      if (gRes.ok) {
        const gData = await gRes.json();
        guardianAddress = gData?.data?.guardianData?.activeGuardian?.address || "";
      }
    } catch (e) {
      console.warn("Could not fetch guardian data:", e);
    }
  }

  const preparedTxs = txList.map((tx, idx) => {
    const txObj = {
      nonce: walletState.nonce + idx,
      value: String(tx.value || "0"),
      receiver: tx.receiver,
      sender: connectedAddress,
      gasPrice: 1000000000,
      gasLimit: Number(tx.gasLimit || 50000000) + (isGuarded ? 50000 : 0),
      data: tx.data || "",
      chainID: "1",
      version: isGuarded ? 2 : 1
    };
    if (isGuarded && guardianAddress) {
      txObj.options = 2;
      txObj.guardian = guardianAddress;
    }
    return txObj;
  });

  // PATH A: MultiversX DeFi Wallet Extension (In-browser popup, ZERO redirects!)
  const ext = getDefiExtension();
  if (connectedProvider === "extension" || (ext && connectedProvider !== "xportal" && connectedProvider !== "webwallet")) {
    try {
      showToast(
        isRo
          ? "🧩 Confirmă tranzacția în extensia MultiversX DeFi Wallet..."
          : "🧩 Please confirm the transaction in your MultiversX DeFi Wallet Extension popup..."
      );

      const signedRes = await signWithExtension(preparedTxs);
      if (signedRes) {
        const signedList = Array.isArray(signedRes) ? signedRes : [signedRes];
        const formattedSigned = signedList.map((st, idx) => ({
          ...preparedTxs[idx],
          ...st,
          data: preparedTxs[idx]?.data || st.data,
          dataIsBase64: false
        }));

        const hashes = await broadcastSignedTransactions(formattedSigned);
        if (hashes.length > 0 || signedList.length > 0) {
          const txHash = hashes[0] || (signedList[0]?.txHash || signedList[0]?.hash) || "broadcasted";
          showToast(
            isRo
              ? `✅ Tranzacție trimisă! (${txHash.slice(0, 10)}...) Se actualizează jocul...`
              : `✅ Transaction broadcasted! (${txHash.slice(0, 10)}...) Updating game...`,
            `https://explorer.multiversx.com/transactions/${txHash}`
          );
          setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 3500);
          setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 8000);
        }
      }
      return;
    } catch (err) {
      console.warn("Extension sign error:", err);
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied") || msg.includes("user cancel")) {
        showToast(
          isRo
            ? "⚠️ Semnarea tranzacției în extensie a fost anulată."
            : "⚠️ Extension transaction signing was cancelled."
        );
      } else {
        showToast(`❌ Eroare tranzacție: ${err.message || "Eroare rețea"}`);
      }
      return;
    }
  }

  // PATH B: xPortal via WalletConnect v2
  if (connectedProvider === "xportal" && wcSignClient && wcSessionTopic) {
    try {
      showToast(
        isRo
          ? "📱 Deschide aplicația xPortal pentru a aproba tranzacția..."
          : "📱 Please check your xPortal Mobile App to approve the transaction..."
      );
      if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "")) {
        setTimeout(() => {
          window.location.href = "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://xportal.com";
        }, 250);
      }

      const wcTxs = preparedTxs.map((t) => ({
        ...t,
        data: toBase64Data(t.data)
      }));

      let signedTxs = [];
      if (wcTxs.length === 1) {
        const res = await wcSignClient.request({
          topic: wcSessionTopic,
          chainId: "mvx:1",
          request: {
            method: "mvx_signTransaction",
            params: { transaction: wcTxs[0] }
          }
        });
        signedTxs = [{ ...wcTxs[0], ...res, data: wcTxs[0].data, dataIsBase64: true }];
      } else {
        const res = await wcSignClient.request({
          topic: wcSessionTopic,
          chainId: "mvx:1",
          request: {
            method: "mvx_signTransactions",
            params: { transactions: wcTxs }
          }
        });
        const sigArray = res.signatures || res;
        signedTxs = wcTxs.map((t, i) => ({
          ...t,
          ...(sigArray[i] || {}),
          data: t.data,
          dataIsBase64: true
        }));
      }

      const hashes = await broadcastSignedTransactions(signedTxs);
      if (hashes.length > 0) {
        showToast(
          isRo
            ? `✅ Tranzacție trimisă! Se actualizează soldul $EFOO...`
            : `✅ Transaction broadcasted! Refreshing your $EFOO balance...`,
          `https://explorer.multiversx.com/transactions/${hashes[0]}`
        );
        setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 4000);
        setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 9000);
      }
      return;
    } catch (err) {
      console.warn("xPortal sign notice:", err);
      showToast(
        isRo
          ? "⚠️ Semnarea în xPortal a fost anulată sau sesiunea a expirat."
          : "⚠️ xPortal signing cancelled or session expired."
      );
      return;
    }
  }

  // PATH B: MultiversX Web Wallet Hook
  const params = new URLSearchParams();
  preparedTxs.forEach((tx, idx) => {
    params.set(`nonce[${idx}]`, String(tx.nonce));
    params.set(`value[${idx}]`, String(tx.value));
    params.set(`receiver[${idx}]`, tx.receiver);
    params.set(`sender[${idx}]`, tx.sender);
    params.set(`gasPrice[${idx}]`, String(tx.gasPrice));
    params.set(`gasLimit[${idx}]`, String(tx.gasLimit));
    params.set(`data[${idx}]`, tx.data);
    params.set(`chainID[${idx}]`, tx.chainID);
    params.set(`version[${idx}]`, String(tx.version));
  });
  params.set("callbackUrl", getCallbackUrl());
  window.location.href = `https://wallet.multiversx.com/hook/sign?${params.toString()}`;
}

function recordGoalsForBonus(goalsAdded) {
  if (!goalsAdded || goalsAdded <= 0) return;
  try {
    const total = (parseInt(localStorage.getItem("efoo_total_goals_scored"), 10) || 0) + goalsAdded;
    localStorage.setItem("efoo_total_goals_scored", String(total));
    if (connectedAddress) {
      const addrKey = "efoo_player_goals_" + connectedAddress.toLowerCase();
      const addrTotal = (parseInt(localStorage.getItem(addrKey), 10) || 0) + goalsAdded;
      localStorage.setItem(addrKey, String(addrTotal));
    }
  } catch (e) {}
}

function getPlayerGoalsCount(addr) {
  try {
    if (addr) {
      const addrKey = "efoo_player_goals_" + addr.toLowerCase();
      const addrGoals = parseInt(localStorage.getItem(addrKey), 10);
      if (!isNaN(addrGoals) && addrGoals >= 0) return addrGoals;
    }
    const globalGoals = parseInt(localStorage.getItem("efoo_total_goals_scored"), 10);
    return !isNaN(globalGoals) ? globalGoals : 0;
  } catch (e) {
    return 0;
  }
}

function getClaimedBonusAddresses() {
  try {
    const raw = localStorage.getItem("efoo_claimed_bonus_addresses");
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function hasAddressClaimedBonus(addr) {
  if (!addr) return false;
  const list = getClaimedBonusAddresses();
  return list.includes(addr.toLowerCase().trim());
}

function markAddressClaimedBonus(addr) {
  if (!addr) return;
  const clean = addr.toLowerCase().trim();
  const list = getClaimedBonusAddresses();
  if (!list.includes(clean)) {
    list.push(clean);
    localStorage.setItem("efoo_claimed_bonus_addresses", JSON.stringify(list));
  }
}

function buyStarterPackOnChain() {
  const isRo = currentLang === "ro";
  const isHu = currentLang === "hu";

  if (!connectedAddress) {
    pendingGateAction = "buy_starter";
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
    showToast(isHu ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a vásárláshoz!" : "⚠️ Please connect your wallet first!");
    return;
  }

  // Anti-Bot Gate Check:
  // Requirement: Wallet owns at least 1 EFOOTBALL or GOALKEEPER NFT, OR has scored at least 5 goals!
  const nfts = walletState.ownedNfts || [];
  const hasNft = (walletState.playersCount > 0 || walletState.keepersCount > 0 || nfts.some(n => {
    const col = (n.collection || n.identifier || "").toUpperCase();
    return col.startsWith("EFOOTBALL-") || col.startsWith("GOALKEEPER-") || col.startsWith("FOOTBALL-");
  }));
  const goalsScored = getPlayerGoalsCount(connectedAddress);
  const hasFiveGoals = goalsScored >= 5;

  if (!hasNft && !hasFiveGoals) {
    showToast(
      isHu
        ? `🛡️ Anti-Bot Védelem: A +500.000 $EFOO bónusz aktiválásához rendelkezned kell legalább 1 db NFT-vel, vagy legalább 5 gólt kell lőnöd a büntetőpárbajban! (Jelenleg: ${goalsScored}/5 gól)`
        : `🛡️ Anti-Bot Protection: Starter Bonus requires at least 1 NFT or 5 scored goals in-game! (Current: ${goalsScored}/5 goals)`
    );
    return;
  }

  const amt = 0.035;
  if (connectedAddress && !hasAddressClaimedBonus(connectedAddress)) {
    markAddressClaimedBonus(connectedAddress);
  }
  const weiStr = (BigInt(Math.round(amt * 1e9)) * BigInt(1e9)).toString();
  const wrapper = CONTRACTS.WEGLD_WRAPPERS[walletState.shard] || CONTRACTS.WEGLD_WRAPPERS[0];
  const tokenHex = strToHex("WEGLD-bd4d79");
  const amtHex = amountToHex(amt, 18);
  const funcHex = strToHex("swapMultiTokensFixedInput");
  const efooHex = strToHex("EFOO-8fe2d4");
  signAndSendTxs(
    [
      { receiver: wrapper, value: weiStr, gasLimit: 8000000, data: "wrapEgld" },
      {
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data: `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`
      }
    ],
    "buy_starter"
  );
}

function buyMicroReviveOnChain() {
  const amt = 0.01;
  const weiStr = (BigInt(Math.round(amt * 1e9)) * BigInt(1e9)).toString();
  const wrapper = CONTRACTS.WEGLD_WRAPPERS[walletState.shard] || CONTRACTS.WEGLD_WRAPPERS[0];
  const tokenHex = strToHex("WEGLD-bd4d79");
  const amtHex = amountToHex(amt, 18);
  const funcHex = strToHex("swapMultiTokensFixedInput");
  const efooHex = strToHex("EFOO-8fe2d4");
  executeReviveBonusShot();
  signAndSendTxs(
    [
      { receiver: wrapper, value: weiStr, gasLimit: 8000000, data: "wrapEgld" },
      {
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data: `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`
      }
    ],
    "buy_revive"
  );
}

function burnReviveOnChain() {
  const amt = 25000;
  if (walletState.efooBalance < amt) {
    showToast(
      currentLang === "ro"
        ? "⚠️ Sold insuficient de $EFOO! Folosește opțiunea Micro-Revive (0.01 EGLD)!"
        : "⚠️ Insufficient $EFOO! Use Micro-Revive (0.01 EGLD) to continue!"
    );
    return;
  }
  executeReviveBonusShot();
  const tHex = strToHex("EFOO-8fe2d4");
  const aHex = amountToHex(amt, 18);
  signAndSendTxs([
    {
      receiver: CONTRACTS.STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 12000000,
      data: `ESDTTransfer@${tHex}@${aHex}@${strToHex("retryCurrentRound")}`
    }
  ]);
}

function buy3MEfooOnChain() {
  const amt = 0.1;
  const weiStr = (BigInt(Math.round(amt * 1e9)) * BigInt(1e9)).toString();
  const wrapper = CONTRACTS.WEGLD_WRAPPERS[walletState.shard] || CONTRACTS.WEGLD_WRAPPERS[0];
  const tokenHex = strToHex("WEGLD-bd4d79");
  const amtHex = amountToHex(amt, 18);
  const funcHex = strToHex("swapMultiTokensFixedInput");
  const efooHex = strToHex("EFOO-8fe2d4");
  signAndSendTxs(
    [
      { receiver: wrapper, value: weiStr, gasLimit: 8000000, data: "wrapEgld" },
      {
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data: `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`
      }
    ],
    "buy_efoo"
  );
}

function mintStrikerOnChain() {
  const b = strToHex("1stGenPlayers");
  signAndSendTxs(
    [{ receiver: CONTRACTS.NFT_MINTER, value: "80000000000000000", gasLimit: 42000000, data: `buy@${b}@${b}@01` }],
    "mint_nft"
  );
}

function mintKeeperOnChain() {
  const b = strToHex("GoalKeepers");
  signAndSendTxs([{ receiver: CONTRACTS.NFT_MINTER, value: "350000000000000000", gasLimit: 42000000, data: `buy@${b}@${b}@01` }]);
}

function kick100kPotOnChain() {
  game.fomoSeconds = 300;
  game.fomoPot += 100000;
  document.getElementById("fomo-pot-amount").textContent = `🏆 ${game.fomoPot.toLocaleString("en-US")} $EFOO`;
  const tHex = strToHex("EFOO-8fe2d4");
  const aHex = amountToHex(100000, 18);
  signAndSendTxs([{ receiver: CONTRACTS.FOMO_RESERVE, value: "0", gasLimit: 1500000, data: `ESDTTransfer@${tHex}@${aHex}` }]);
}

async function checkUrlWalletCallbacks() {
  const params = new URLSearchParams(window.location.search);
  const urlAddr = params.get("address");
  const status = params.get("walletProviderStatus");

  if (isInsideXPortal()) {
    document.getElementById("hud-exit-btn")?.classList.add("hidden");
  }

  if (urlAddr && urlAddr.startsWith("erd1")) {
    const prov = params.get("provider") || (isInsideXPortal() ? "xportal" : "webwallet");
    connectWithAddress(urlAddr, prov);
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }

  if (status === "transactionsSigned") {
    const signedList = [];
    let idx = 0;
    while (params.has(`nonce[${idx}]`) && params.has(`signature[${idx}]`)) {
      signedList.push({
        nonce: Number(params.get(`nonce[${idx}]`)),
        value: params.get(`value[${idx}]`) || "0",
        receiver: params.get(`receiver[${idx}]`) || "",
        sender: params.get(`sender[${idx}]`) || connectedAddress,
        gasPrice: Number(params.get(`gasPrice[${idx}]`) || 1000000000),
        gasLimit: Number(params.get(`gasLimit[${idx}]`) || 50000000),
        data: params.get(`data[${idx}]`) || "",
        chainID: params.get(`chainID[${idx}]`) || "1",
        version: Number(params.get(`version[${idx}]`) || 1),
        signature: params.get(`signature[${idx}]`) || ""
      });
      idx++;
    }
    window.history.replaceState({}, document.title, window.location.pathname);

    if (signedList.length > 0) {
      try {
        const hashes = await broadcastSignedTransactions(signedList);
        if (hashes.length > 0) {
          showToast(
            currentLang === "ro"
              ? `✅ Cumpărare trimisă pe blockchain! Se actualizează soldul $EFOO...`
              : `✅ Purchase broadcasted on-chain! Updating your $EFOO balance...`,
            `https://explorer.multiversx.com/transactions/${hashes[0]}`
          );
          setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 4000);
          setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 9000);
        }
      } catch (err) {
        console.warn("Web wallet broadcast error:", err);
      }
    }
  }
  return false;
}

function applyLang(_lang) {
  currentLang = "en";
  localStorage.setItem("efoo_game_lang", "en");
  const langLabel = document.getElementById("lang-label");
  if (langLabel) langLabel.textContent = "EN";
  const dict = I18N_GAME.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (dict[k]) el.innerHTML = dict[k];
  });
  updateEntryGateUI();
  updateStartSkillsChips();
  renderSkillsDeckUI();
  renderSkillsShopModal();
}

// ============================================================================
// META SYSTEM: DAILY STREAK, LEVEL PROGRESSION, SKILLS SHOP & LEADERBOARD
// ============================================================================
const STORAGE_DAILY_KEY = "efoo_daily_streak_v2";
const STORAGE_LAST_LOGIN_KEY = "efoo_last_login_date_v2";
const STORAGE_UNLOCKED_LEVEL = "efoo_unlocked_level_v2";
const STORAGE_SKILLS_INVENTORY = "efoo_skills_inventory_v2";
const STORAGE_LEADERBOARD = "efoo_leaderboard_v2";

function metaUnlockedLevel() {
  try {
    const val = parseInt(localStorage.getItem(STORAGE_UNLOCKED_LEVEL) || "1", 10);
    return Math.max(1, Math.min(MAX_LEVEL, isNaN(val) ? 1 : val));
  } catch (e) {
    return 1;
  }
}

function selectLevel(lvl) {
  const max = metaUnlockedLevel();
  const target = Math.max(1, Math.min(max, Math.min(MAX_LEVEL, lvl)));
  game.level = target;
  refreshHudUI();
  renderSkillsDeckUI();
}

function getDailyStreakData() {
  const today = new Date().toISOString().slice(0, 10);
  let streak = 1;
  let lastDate = "";
  try {
    streak = parseInt(localStorage.getItem(STORAGE_DAILY_KEY) || "1", 10);
    lastDate = localStorage.getItem(STORAGE_LAST_LOGIN_KEY) || "";
  } catch (e) {}

  if (!lastDate) {
    streak = 1;
    try {
      localStorage.setItem(STORAGE_DAILY_KEY, "1");
      localStorage.setItem(STORAGE_LAST_LOGIN_KEY, today);
    } catch (e) {}
  } else if (lastDate !== today) {
    const last = new Date(lastDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
    try {
      localStorage.setItem(STORAGE_DAILY_KEY, String(streak));
      localStorage.setItem(STORAGE_LAST_LOGIN_KEY, today);
    } catch (e) {}
  }

  const isFifthDay = streak > 0 && streak % 5 === 0;
  const claimedKey = `efoo_claimed_streak_${streak}`;
  let claimed = false;
  try {
    claimed = localStorage.getItem(claimedKey) === "true";
  } catch (e) {}

  return { streak, today, isFifthDay, claimed, claimedKey };
}

function claimDailyStreakReward() {
  const d = getDailyStreakData();
  if (d.isFifthDay && !d.claimed) {
    try {
      localStorage.setItem(d.claimedKey, "true");
    } catch (e) {}
    walletState.efooBalance += 100000;
    updateHudEfooBadge();
    audio.playGoalCheer();
    showToast("🎉 5-DAY STREAK CLAIMED! 100,000 $EFOO credited!");
    renderDailyStreakModal();
    refreshHudUI();
  }
}

function renderDailyStreakModal() {
  const d = getDailyStreakData();
  const row = document.getElementById("streak-days-row");
  const bonusCard = document.getElementById("streak-bonus-card");
  const isRo = currentLang === "ro";

  if (row) {
    row.innerHTML = "";
    const currentCycleDay = ((d.streak - 1) % 5) + 1;
    for (let day = 1; day <= 5; day++) {
      const isDone = day < currentCycleDay || (d.isFifthDay && d.claimed);
      const isToday = day === currentCycleDay && !d.claimed;
      const isGift = day === 5;
      const div = document.createElement("div");
      div.className = `streak-day-bubble ${isDone ? "done" : ""} ${isToday ? "today" : ""} ${isGift ? "gift" : ""}`;
      div.innerHTML = `
        <span class="sdb-icon">${isGift ? "🎁" : isDone ? "✅" : isToday ? "🔥" : "⚽"}</span>
        <span class="sdb-label">${isRo ? `Ziua ${day}` : `Day ${day}`}</span>
        <small style="font-size:0.58rem; color:#94a3b8;">${isGift ? "+100k" : "Streak"}</small>
      `;
      row.appendChild(div);
    }
  }

  if (bonusCard) {
    if (d.isFifthDay && !d.claimed) {
      bonusCard.innerHTML = `
        <strong style="color:#ffb800; font-size:1.1rem;">🎉 ${isRo ? "ZIUA 5 ATINSĂ! PREMIU SPECIAL!" : "DAY 5 REACHED! SPECIAL REWARD!"}</strong>
        <p style="font-size:0.8rem; color:#e2e8f0; margin:0;">${isRo ? "Ai fost activ 5 zile la rând! Colectează 100.000 $EFOO!" : "You played 5 days in a row! Claim your 100,000 $EFOO bonus!"}</p>
        <button type="button" class="arcade-btn gold" id="btn-claim-streak-reward">
          🎁 ${isRo ? "REVENDICĂ 100.000 $EFOO" : "CLAIM 100,000 $EFOO"}
        </button>
      `;
      document.getElementById("btn-claim-streak-reward")?.addEventListener("click", claimDailyStreakReward);
    } else {
      const remaining = 5 - (((d.streak - 1) % 5) + 1);
      bonusCard.innerHTML = `
        <strong style="color:#a8ff00;">🔥 ${isRo ? `Serie activă: ${d.streak} zile` : `Active Streak: ${d.streak} days`}</strong>
        <p style="font-size:0.78rem; color:#94a3b8; margin:0;">${isRo ? `Mai ai ${remaining} zile până la următorul cadou de 100.000 $EFOO!` : `${remaining} day(s) until your next 100,000 $EFOO gift!`}</p>
      `;
    }
  }
}

const DEFAULT_SKILLS_INVENTORY = { steady: 2, power: 2, freeze: 1, curve: 2, gold: 2 };

function getSkillsInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_SKILLS_INVENTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveSkillsInventory(DEFAULT_SKILLS_INVENTORY);
  return { ...DEFAULT_SKILLS_INVENTORY };
}

function saveSkillsInventory(inv) {
  try {
    localStorage.setItem(STORAGE_SKILLS_INVENTORY, JSON.stringify(inv));
  } catch (e) {}
}

function metaConsumeSkill(skillId) {
  const inv = getSkillsInventory();
  if (inv[skillId] && inv[skillId] > 0) {
    inv[skillId] -= 1;
    saveSkillsInventory(inv);
    renderSkillsDeckUI();
    const s = SKILLS.find((x) => x.id === skillId);
    if (s) {
      const name = currentLang === "ro" ? s.nameRo : s.name;
      game.skillFlash = {
        text: `⚡ ${name} ARMED & ACTIVE!`,
        color: s.color,
        alpha: 1.0
      };
    }
    return true;
  }
  return false;
}

function getSkillPackPrice(s, count) {
  const baseCost = s.price * count;
  if (count > 1) {
    // 20% discount on multi-item packs! (e.g. 5x)
    return Math.round(baseCost * 0.80);
  }
  return baseCost;
}

function buySkillWithEfoo(skillId, count = 1) {
  const allSkills = [...SKILLS, ...KEEPER_SKILLS];
  const s = allSkills.find((x) => x.id === skillId);
  if (!s) return;
  const cost = getSkillPackPrice(s, count);
  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";

  // Balance check
  if (walletState.efooBalance < cost) {
    if (typeof audio.playPostClang === "function") audio.playPostClang();
    const neededStr = cost.toLocaleString("en-US");
    const balStr = Math.floor(walletState.efooBalance).toLocaleString("en-US");
    showToast(
      isHu
        ? `⚠️ Nincs elegendő $EFOO egyenleged (${balStr} $EFOO). Szükséges: ${neededStr} $EFOO! Csatlakoztasd a tárcádat vagy vegyél $EFOO-t!`
        : (isRo
          ? `⚠️ Sold insuficient de $EFOO (${balStr} $EFOO). Necesar: ${neededStr} $EFOO!`
          : `⚠️ Insufficient $EFOO balance (${balStr} $EFOO). Needed: ${neededStr} $EFOO!`)
    );
    return;
  }

  // Deduct cost and update
  walletState.efooBalance -= cost;
  updateHudEfooBadge();
  const half = Math.floor(cost / 2);
  addVaultContributions(half, half); // 50% to Stadium Vault, 50% burned forever!

  const inv = getSkillsInventory();
  inv[skillId] = (inv[skillId] || 0) + count;
  saveSkillsInventory(inv);

  audio.playWhistle();

  const skillName = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
  const discountNote = count > 1 ? (isHu ? " (🔥 20% KEDVEZMÉNNYEL!)" : (isRo ? " (🔥 -20% REDUCERE!)" : " (🔥 20% OFF!)")) : "";
  showToast(
    isHu
      ? `✅ +${count}x ${skillName} sikeresen felszerelve a meccskészletbe!${discountNote}`
      : (isRo
        ? `✅ +${count}x ${skillName} achiziționat și echipat!${discountNote}`
        : `✅ +${count}x ${skillName} equipped in your match locker!${discountNote}`)
  );

  renderSkillsDeckUI();
  renderSkillsShopModal(skillId, count);
  updateStartSkillsChips();
}

function armSkill(skillId) {
  if (!connectedAddress || !connectedAddress.startsWith("erd1")) {
    showToast(currentLang === "hu" ? "🔒 A szuperképességek használatához jelentkezz be tárcáddal!" : "🔒 Connect your wallet with an NFT to use skills!");
    return;
  }
  if (game.phase !== "aim" && game.phase !== "charging" && game.phase !== "defend_aim") return;
  const inv = getSkillsInventory();
  const currentCount = inv[skillId] || 0;
  if (currentCount <= 0 && !game.armed[skillId]) {
    openSkillsShopModal();
    return;
  }
  game.armed[skillId] = !game.armed[skillId];
  if (game.armed[skillId]) {
    audio.playWhistle();
  }
  renderSkillsDeckUI();
}

function renderSkillsDeckUI() {
  const row = document.getElementById("skills-slots-row");
  if (!row) return;
  const isConnected = !!(connectedAddress && connectedAddress.startsWith("erd1"));
  if (!isConnected) {
    row.innerHTML = `
      <div style="color:#94a3b8; font-size:0.72rem; font-family:'JetBrains Mono',monospace; padding:6px 14px; background:rgba(255,255,255,0.03); border:1px dashed rgba(255,255,255,0.12); border-radius:8px; display:flex; align-items:center; gap:6px;">
        🔒 <span>${currentLang === "hu" ? "Vendég mód: Képességek zárolva (Jelentkezz be tárcával!)" : "Guest Mode: Skills locked (Connect wallet to unlock!)"}</span>
      </div>
    `;
    return;
  }
  const inv = getSkillsInventory();
  row.innerHTML = "";
  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";
  const p = getPowers();

  const isDefending = game.shootoutTurn === "defend";
  const currentDeck = isDefending ? KEEPER_SKILLS : SKILLS;
  const maxSlots = isDefending ? p.keeperSlots : p.strikerSlots;

  currentDeck.forEach((s, idx) => {
    const isLockedByRarity = idx >= maxSlots;
    const count = inv[s.id] || 0;
    const isArmed = !isLockedByRarity && !!game.armed[s.id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `skill-slot-btn ${isArmed ? "armed" : ""} ${count <= 0 ? "empty" : ""} ${isLockedByRarity ? "rarity-locked" : ""}`;
    const sName = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
    const sDesc = isHu ? s.descHu : (isRo ? s.descRo : s.desc);

    if (isLockedByRarity) {
      const requiredRarity = idx === 0 ? "COMMON" : idx === 1 ? "RARE" : idx === 2 ? "EPIC" : "LEGENDARY";
      btn.title = isHu
        ? `🔒 Zárolva! ${requiredRarity}+ NFT szükséges ehhez a képességhelyhez!`
        : `🔒 Locked! ${requiredRarity}+ NFT required for this skill slot!`;
      btn.innerHTML = `
        <span class="skill-slot-icon">🔒</span>
        <span class="skill-slot-name">${requiredRarity}</span>
        <span class="skill-lock-badge">${requiredRarity[0]}</span>
      `;
      btn.addEventListener("click", () => {
        showToast(isHu
          ? `🔒 Ez a képességhely zárolva van! Válassz ${requiredRarity}+ NFT-t!`
          : `🔒 This slot is locked! Select a ${requiredRarity}+ NFT!`);
      });
    } else {
      btn.title = `${sName}: ${sDesc} (${count} owned)`;
      btn.innerHTML = `
        ${s.img ? `<img src="${s.img}" class="skill-slot-badge-img" alt="${sName}" onerror="this.style.display='none'" />` : `<span class="skill-slot-icon">${s.icon}</span>`}
        <span class="skill-slot-name">${isArmed ? (isHu ? "AKTÍV!" : "ARMED!") : sName.split(" ")[0]}</span>
        <span class="skill-slot-count">${count}</span>
      `;
      btn.addEventListener("click", () => armSkill(s.id));
    }
    row.appendChild(btn);
  });
}

function renderSkillsShopModal(highlightSkillId = null, highlightCount = 0) {
  const grid = document.getElementById("skills-shop-grid");
  const balEl = document.getElementById("shop-efoo-balance");
  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";

  if (balEl) {
    balEl.textContent = `${Math.floor(walletState.efooBalance).toLocaleString(isHu ? "hu-HU" : "en-US")} $EFOO`;
  }
  if (!grid) return;
  const inv = getSkillsInventory();

  grid.innerHTML = "";

  const renderSection = (title, items) => {
    const secHeader = document.createElement("div");
    secHeader.style.cssText = "grid-column: 1 / -1; margin: 8px 0 4px; font-family: 'Bebas Neue', sans-serif; font-size: 1.25rem; letter-spacing: 0.05em; color: #a8ff00; border-bottom: 1px solid rgba(168,255,0,0.25); padding-bottom: 4px;";
    secHeader.textContent = title;
    grid.appendChild(secHeader);

    items.forEach((s) => {
      const count = inv[s.id] || 0;
      const card = document.createElement("div");
      card.className = `skill-shop-card ${highlightSkillId === s.id ? "just-bought" : ""}`;
      const name = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
      const desc = isHu ? s.descHu : (isRo ? s.descRo : s.desc);
      const singlePrice = (s.price >= 1000)
        ? (s.price / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })
        : s.price;
      const packPriceVal = getSkillPackPrice(s, 5);
      const packPrice5 = (packPriceVal >= 1000)
        ? (packPriceVal / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })
        : packPriceVal;
      const ownedText = isHu ? "Birtokolt" : (isRo ? "Deținute" : "Owned");
      const discountLabel = isHu ? "-20% KEDVEZMÉNY" : (isRo ? "-20% REDUCERE" : "20% OFF");
      const boughtFlash = isHu ? `✅ +${highlightCount}x SIKERES VÉTEL!` : (isRo ? `✅ +${highlightCount}x CUMPĂRAT!` : `✅ +${highlightCount}x PURCHASED!`);

      card.innerHTML = `
        <div class="ssc-info">
          <div class="ssc-title" style="color:${s.color};">
            ${s.img ? `<img src="${s.img}" class="ssc-badge-thumb" alt="${name}" onerror="this.style.display='none'" />` : `<span>${s.icon}</span>`}
            <strong>${name}</strong>
            <span style="font-size:0.75rem; color:#a8ff00; background:rgba(168,255,0,0.12); padding:2px 8px; border-radius:6px; border:1px solid rgba(168,255,0,0.3);">(${ownedText}: ${count})</span>
            ${highlightSkillId === s.id ? `<span style="font-size:0.75rem; color:#a8ff00; font-weight:800;">${boughtFlash}</span>` : ""}
          </div>
          <small class="ssc-desc">${desc}</small>
        </div>
        <div class="ssc-actions">
          <button type="button" class="arcade-btn neon" data-buy-single="${s.id}" title="${isHu ? '1 darab vásárlása' : 'Buy 1 item'}">
            1x (${singlePrice}k $EFOO)
          </button>
          <button type="button" class="arcade-btn gold" data-buy-pack="${s.id}" title="${isHu ? '5 darabos csomag 10% kedvezménnyel!' : '5x Pack with 10% discount!'}">
            5x (${packPrice5}k $EFOO) <span class="pack-discount-tag">🔥 ${discountLabel}</span>
          </button>
        </div>
      `;

      card.querySelector(`[data-buy-single="${s.id}"]`)?.addEventListener("click", (e) => {
        e.stopPropagation();
        buySkillWithEfoo(s.id, 1);
      });
      card.querySelector(`[data-buy-pack="${s.id}"]`)?.addEventListener("click", (e) => {
        e.stopPropagation();
        buySkillWithEfoo(s.id, 5);
      });

      grid.appendChild(card);
    });
  };

  renderSection(isHu ? "⚡ CSATÁR KÉPESSÉGEK (-10% CSOMAGOK)" : (isRo ? "⚡ ABILITĂȚI ATACATOR (-10% PACHETE)" : "⚡ STRIKER SUPER SKILLS (-10% PACKS)"), SKILLS);
  renderSection(isHu ? "🧤 KAPUS KÉPESSÉGEK (-10% CSOMAGOK)" : (isRo ? "🧤 ABILITĂȚI PORTAR (-10% PACHETE)" : "🧤 GOALKEEPER SUPER SKILLS (-10% PACKS)"), KEEPER_SKILLS);
}

function setMarketplaceTab(tab) {
  const tabSkills = document.getElementById("tab-btn-skills");
  const tabNfts = document.getElementById("tab-btn-nfts");
  const tabTokens = document.getElementById("tab-btn-tokens");

  const panelSkills = document.getElementById("skills-shop-grid");
  const panelNfts = document.getElementById("market-nft-panel");
  const panelTokens = document.getElementById("market-tokens-panel");

  tabSkills?.classList.toggle("active", tab === "skills");
  tabNfts?.classList.toggle("active", tab === "nfts");
  tabTokens?.classList.toggle("active", tab === "tokens");

  panelSkills?.classList.toggle("hidden", tab !== "skills");
  panelNfts?.classList.toggle("hidden", tab !== "nfts");
  panelTokens?.classList.toggle("hidden", tab !== "tokens");
}

function openSkillsShopModal(defaultTab = "skills") {
  renderSkillsShopModal();
  setMarketplaceTab(defaultTab);
  document.getElementById("skills-shop-modal-overlay")?.classList.remove("hidden");
}

function closeSkillsShopModal() {
  document.getElementById("skills-shop-modal-overlay")?.classList.add("hidden");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const FUNNY_FOOTBALL_NICKNAMES = [
  "Sunday Beer-Belly Striker",
  "Shin-Pad Slasher",
  "Benchwarmer Pro",
  "Panenka Misser",
  "Crossbar Magnet",
  "Turf Diver #9",
  "Corner Flag Hugger",
  "Halfway Line Cannon",
  "Golden Mud Cleat",
  "Offside King",
  "Waterboy Legend",
  "Sunday League Maestro"
];

function getDeterministicFootballNickname(address) {
  if (!address) return "Sunday League Striker";
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) >>> 0;
  }
  return FUNNY_FOOTBALL_NICKNAMES[hash % FUNNY_FOOTBALL_NICKNAMES.length];
}

// Herotag Registry & Resolver (Recognizes @hlnagy and resolves MultiversX Herotags)
const KNOWN_HEROTAGS = {
  "erd1gyw9wtsjcg62mdrkxym3l4t3qelf83mq85whefp979h7pzmjm0zq96j8gq": "hlnagy",
  "erd1uaw4x3kretddfqx79qvvta9l29sdq7ad6lygavgynlq5mc52w0hqfzczm7": "augustintr",
  "erd1qzm0h502r4x9uslqhfdjxrkmrwtq5qtle57queakzz6majydu3nswj6shc": "digitalmoney",
  "erd1q4rrqj2fragmkz7x2jgpqy7svsunwd33hkl69v7h62nlwum9qunq3pllj3": "janhunedoara",
  "erd14zpeqacvvt8mlyrqudcv0c9r9d28s7q4350h7602xwt8r3j3wzjlx6pj": "chuckszilard",
  "erd136yy3cseqx6e0m8n8a54n8a385f096l863r3t700k7t9y3q36mtrv8": "souleymaz",
  "erd14a9dmrpqf2x33x5k68p6z3x7v0w987y6q5r423a2b1c0d9e8788zrk": "quantumarun"
};

function getHerotagForAddress(address) {
  if (!address) return "";
  const lower = address.toLowerCase();
  if (KNOWN_HEROTAGS[lower]) return KNOWN_HEROTAGS[lower];
  if (connectedAddress && connectedAddress.toLowerCase() === lower) {
    if (walletState.herotag) return walletState.herotag.replace(/\.elrond$/, "").replace(/^@/, "");
    if (walletState.username) return walletState.username.replace(/\.elrond$/, "").replace(/^@/, "");
  }
  return "";
}

async function resolveHerotagAsync(address) {
  if (!address) return;
  const lower = address.toLowerCase();
  if (KNOWN_HEROTAGS[lower]) return;
  try {
    const res = await fetch(`https://api.multiversx.com/accounts/${address}?fields=username`);
    if (res.ok) {
      const d = await res.json();
      if (d && d.username) {
        KNOWN_HEROTAGS[lower] = d.username.replace(/\.elrond$/, "").replace(/^@/, "");
        renderLeaderboardModal();
      }
    }
  } catch (e) {}
}

// Filter set for non-player contracts (reserve / system SCs)
const KNOWN_MOCK_ADDRESSES = new Set([
  "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u", // SYSTEM_SC
  "erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend"  // STADIUM_VAULT_SC
]);

const MOCK_HEROTAGS_TO_PURGE = new Set([]);

const STORAGE_ALLTIME_LEADERBOARD = "efoo_leaderboard_alltime_v1";
let currentHubLeaderboardTab = "weekly";
let currentModalLeaderboardTab = "weekly";

function getLeaderboard(type = "weekly") {
  if (typeof window !== "undefined" && window.EfooLeaderboard) {
    const remoteList = window.EfooLeaderboard.getLeaderboardSync(type);
    if (Array.isArray(remoteList) && remoteList.length > 0) {
      return remoteList;
    }
  }

  let list = [];
  const storageKey = type === "alltime" ? STORAGE_ALLTIME_LEADERBOARD : STORAGE_LEADERBOARD;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {}

  // Filter out any mock dummy entries & invalid/truncated addresses, while preserving real wallets and active guest player
  const localGuestId = (typeof localStorage !== "undefined" && localStorage.getItem("efoo_local_guest_id")) || "guest_player";
  list = list.filter((row) => {
    if (!row || !row.address) return false;
    if (row.isSimulated) return false;
    const addr = row.address.trim().toLowerCase();
    if (addr.includes("...")) return false; // Purge old truncated entries
    if (addr === localGuestId.toLowerCase() || addr === "guest_player") return true;
    if (!addr.startsWith("erd1") && addr.length < 32) return false;
    if (KNOWN_MOCK_ADDRESSES.has(addr)) return false;
    if (row.herotag && MOCK_HEROTAGS_TO_PURGE.has(row.herotag.toLowerCase())) return false;
    return true;
  });

  // STRICT UNIQUE PLAYER DEDUPLICATION: keep strictly each player's highest score!
  const bestByAddress = new Map();
  list.forEach((row) => {
    if (!row || !row.address) return;
    const key = row.address.toLowerCase();

    // Auto-resolve herotag
    let hero = row.herotag;
    const known = getHerotagForAddress(row.address);
    if (known) hero = `@${known}`;

    const scoreNum = Number(row.score) || 0;
    const candidate = {
      ...row,
      herotag: hero || "",
      score: scoreNum
    };

    const existing = bestByAddress.get(key);
    if (!existing || scoreNum > existing.score) {
      bestByAddress.set(key, candidate);
    }
  });

  // Convert map to array, sort descending by score, assign clean ranks
  const sorted = Array.from(bestByAddress.values());
  sorted.sort((a, b) => b.score - a.score);
  sorted.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const maxItems = type === "alltime" ? 50 : 20;
  const finalTop = sorted.slice(0, maxItems);
  try {
    localStorage.setItem(storageKey, JSON.stringify(finalTop));
  } catch (e) {}
  return finalTop;
}

function recordMatchToLeaderboard(score, goals, level) {
  if (score <= 0) return null;

  let playerAddr = connectedAddress;
  let isGuest = false;
  if (!playerAddr || !playerAddr.startsWith("erd1") || playerAddr.length !== 62) {
    let guestId = localStorage.getItem("efoo_local_guest_id");
    if (!guestId) {
      guestId = "guest_player";
      localStorage.setItem("efoo_local_guest_id", guestId);
    }
    playerAddr = guestId;
    isGuest = true;
  }

  let hero = "";
  if (!isGuest) {
    hero = walletState.herotag || walletState.username || getHerotagForAddress(playerAddr);
    if (hero) {
      hero = hero.replace(/\.elrond$/, "").replace(/^@/, "");
      hero = `@${hero}`;
    }
  } else {
    hero = currentLang === "hu" ? "🎮 Vendég Játékos" : (currentLang === "ro" ? "🎮 Jucător Oaspete" : "🎮 Guest (You)");
  }

  const isUltras = !isGuest && hasUltrasPass(playerAddr);
  const nickname = isGuest ? "Guest Striker" : (hero ? "" : getDeterministicFootballNickname(playerAddr));

  // Forward to Global Firebase Realtime Leaderboard service
  if (typeof window !== "undefined" && window.EfooLeaderboard) {
    window.EfooLeaderboard.recordScore({
      address: playerAddr,
      score: score,
      goals: goals,
      level: level,
      herotag: hero,
      nickname: nickname,
      isUltras: isUltras,
      isGuest: isGuest
    }).catch(err => console.warn("[recordMatchToLeaderboard] async sync warning:", err));
  }

  const list = getLeaderboard();

  // Check if playerAddr already exists in the leaderboard
  const existingIdx = list.findIndex(
    (x) => x.address && x.address.toLowerCase() === playerAddr.toLowerCase()
  );

  if (existingIdx !== -1) {
    // Only update if new score is higher than their previous personal best!
    if (score > list[existingIdx].score) {
      list[existingIdx].score = score;
      list[existingIdx].goals = goals;
      list[existingIdx].level = level;
      list[existingIdx].date = "Just now";
      list[existingIdx].isUltras = isUltras;
      if (hero) list[existingIdx].herotag = hero;
    } else {
      if (isUltras) list[existingIdx].isUltras = true;
      if (hero && !list[existingIdx].herotag) {
        list[existingIdx].herotag = hero;
      }
    }
  } else {
    // New player entry
    list.push({
      rank: 0,
      address: playerAddr,
      herotag: hero || "",
      nickname: nickname,
      isGuest,
      isUltras,
      level,
      goals,
      score,
      date: "Just now"
    });
  }

  // Deduplication by address
  const bestByAddress = new Map();
  list.forEach((row) => {
    if (!row || !row.address) return;
    const key = row.address.toLowerCase();
    const existing = bestByAddress.get(key);
    if (!existing || row.score > existing.score) {
      bestByAddress.set(key, row);
    }
  });

  const sorted = Array.from(bestByAddress.values());
  sorted.sort((a, b) => b.score - a.score);
  sorted.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const top10 = sorted.slice(0, 10);
  try {
    localStorage.setItem(STORAGE_LEADERBOARD, JSON.stringify(top10));
  } catch (e) {}

  if (typeof renderStartScreenLeaderboard === "function") renderStartScreenLeaderboard();

  const myEntry = top10.find((x) => x.address.toLowerCase() === playerAddr.toLowerCase());
  return myEntry ? myEntry.rank : null;
}

function renderLeaderboardModal(options = {}) {
  const isPostMatch = !!options.isPostMatch;
  const isConnected = !!(connectedAddress && (connectedAddress.startsWith("erd1") || connectedAddress.length >= 32));
  const isGuest = !isConnected;
  const currentScore = typeof options.score === "number" ? options.score : (game.score || 0);
  const currentGoals = typeof options.goals === "number" ? options.goals : (game.userGoals || 0);
  const currentLevel = options.level || game.level || 1;

  if (options.tab) {
    currentModalLeaderboardTab = options.tab;
  }
  const isAllTime = currentModalLeaderboardTab === "alltime";

  const tbody = document.getElementById("lb-table-body");
  const postMatchBanner = document.getElementById("lb-postmatch-banner");
  const playBtn = document.getElementById("lb-play-btn");
  const nextBtn = document.getElementById("lb-next-summary-btn");

  if (playBtn && nextBtn) {
    if (isPostMatch) {
      playBtn.classList.add("hidden");
      nextBtn.classList.remove("hidden");
      nextBtn.textContent = currentLang === "hu" ? "🚀 KÖVETKEZŐ: MECCS ÖSSZEFOGLALÓ ➔" : "🚀 NEXT: MATCH SUMMARY ➔";
    } else {
      playBtn.classList.remove("hidden");
      nextBtn.classList.add("hidden");
    }
  }

  // Update Modal Main Title and Subtitle
  const mainTitleEl = document.getElementById("lb-modal-main-title");
  const mainSublineEl = document.getElementById("lb-modal-main-subline");
  if (mainTitleEl) {
    mainTitleEl.innerHTML = isAllTime ? "👑 ALL-TIME HALL OF FAME" : "🏆 LEADERBOARD &amp; WEEKLY JACKPOT";
    mainTitleEl.style.color = isAllTime ? "#ffb800" : "#a8ff00";
  }
  if (mainSublineEl) {
    mainSublineEl.textContent = isAllTime
      ? "Sunday League Degen FC • Highest Career Scores"
      : "Sunday League Degen FC • Top Strikers Share the 90+5' Pool";
  }

  // Update Modal Tab Active States
  const tabW = document.getElementById("tab-modal-weekly");
  const tabA = document.getElementById("tab-modal-alltime");
  if (tabW) {
    tabW.classList.toggle("active", !isAllTime);
    tabW.classList.remove("alltime");
  }
  if (tabA) {
    tabA.classList.toggle("active", isAllTime);
    tabA.classList.toggle("alltime", isAllTime);
  }

  // Toggle Weekly Banner vs All-Time Banner
  const weeklyBanner = document.getElementById("lb-modal-weekly-banner");
  const allTimeBanner = document.getElementById("lb-modal-alltime-banner");
  if (weeklyBanner) weeklyBanner.classList.toggle("hidden", isAllTime);
  if (allTimeBanner) allTimeBanner.classList.toggle("hidden", !isAllTime);

  // Dynamic calculation for weekly pot (65% / 25% / 10%)
  const stats = getVaultStats();
  const potVal = stats.pot;
  const potAmountEl = document.getElementById("lb-pot-amount");
  const share1st = document.getElementById("lb-share-1st");
  const share2nd = document.getElementById("lb-share-2nd");
  const share3rd = document.getElementById("lb-share-3rd");

  if (potAmountEl) potAmountEl.textContent = `${potVal.toLocaleString("en-US")} $EFOO`;
  if (share1st) share1st.textContent = `${Math.round(potVal * 0.65).toLocaleString("en-US")} $EFOO`;
  if (share2nd) share2nd.textContent = `${Math.round(potVal * 0.25).toLocaleString("en-US")} $EFOO`;
  if (share3rd) share3rd.textContent = `${Math.round(potVal * 0.10).toLocaleString("en-US")} $EFOO`;

  let list = getLeaderboard(currentModalLeaderboardTab);
  if (tbody) tbody.innerHTML = "";

  // Update All-Time banner stats
  if (isAllTime && allTimeBanner) {
    const allTime1st = document.getElementById("lb-alltime-1st-score");
    const allTimeTotal = document.getElementById("lb-alltime-total-players");
    if (allTime1st) {
      allTime1st.textContent = list.length > 0 ? `${list[0].score.toLocaleString("en-US")} PTS` : "0 PTS";
    }
    if (allTimeTotal) {
      allTimeTotal.textContent = String(list.length);
    }
  }

  // Render Post-Match Banner & Simulated Rows
  if (isPostMatch && postMatchBanner) {
    postMatchBanner.classList.remove("hidden");
    if (!isGuest) {
      // Verified connected player
      const userRank = list.findIndex(x => x.address && x.address.toLowerCase() === connectedAddress.toLowerCase()) + 1;
      const rankPill = userRank === 1 ? "🥇 1ST PLACE (65% JACKPOT)" : userRank === 2 ? "🥈 2ND PLACE (25% JACKPOT)" : userRank === 3 ? "🥉 3RD PLACE (10% JACKPOT)" : `#${userRank} RANK`;
      postMatchBanner.innerHTML = `
        <div class="verified-winner-banner">
          <div class="gjs-head">
            <span class="gjs-badge" style="background:rgba(168,255,0,0.2); border-color:#a8ff00; color:#a8ff00;">✅ OFFICIAL LEADERBOARD VERIFIED</span>
            <span class="gjs-jackpot-share">${rankPill}</span>
          </div>
          <p class="gjs-desc" style="margin:0;">
            Congratulations! Your score of <strong>${currentScore.toLocaleString("en-US")} PTS</strong> is verified on the weekly Stadium Vault Leaderboard at <strong>#${userRank || 1}</strong>!
          </p>
        </div>
      `;
    } else {
      // Guest player simulation: compute what rank currentScore would achieve!
      const higherCount = list.filter(x => x.score > currentScore).length;
      const simulatedRank = higherCount + 1;

      let headline = "";
      let desc = "";

      if (simulatedRank === 1) {
        const shareEst = Math.round(potVal * 0.65);
        headline = `🥇 65% JACKPOT ODDS (~${shareEst.toLocaleString("en-US")} $EFOO)`;
        desc = `If you were connected with an NFT, you would be <strong>#1 RANKED</strong> with <strong>65% chance to win the weekly Jackpot</strong>! As a guest, this score is simulated and not saved to the official leaderboard.`;
      } else if (simulatedRank === 2) {
        const shareEst = Math.round(potVal * 0.25);
        headline = `🥈 25% JACKPOT ODDS (~${shareEst.toLocaleString("en-US")} $EFOO)`;
        desc = `If you were connected with an NFT, you would hold <strong>2ND PLACE</strong> with <strong>25% Jackpot odds</strong>! As a guest, your score is simulated.`;
      } else if (simulatedRank === 3) {
        const shareEst = Math.round(potVal * 0.10);
        headline = `🥉 10% JACKPOT ODDS (~${shareEst.toLocaleString("en-US")} $EFOO)`;
        desc = `If you were connected with an NFT, you would hold <strong>3RD PLACE</strong> with <strong>10% Jackpot odds</strong>! As a guest, your score is simulated.`;
      } else {
        const top3Score = list.length >= 3 ? list[2].score : (list.length > 0 ? list[list.length - 1].score : 10000);
        const ptsNeeded = Math.max(0, top3Score - currentScore);
        const pctOfTop3 = Math.min(99, Math.round((currentScore / top3Score) * 100));
        headline = `⚡ #${simulatedRank} RANK (NEAR TOP 3: ${pctOfTop3}%)`;
        desc = `With this score you would rank <strong>#${simulatedRank}</strong>! Only <strong>${ptsNeeded.toLocaleString("en-US")} PTS</strong> away from the 10% Jackpot prize tier (~${Math.round(potVal * 0.10).toLocaleString("en-US")} $EFOO).`;
      }

      postMatchBanner.innerHTML = `
        <div class="guest-jackpot-simulation-banner">
          <div class="gjs-head">
            <span class="gjs-badge">⚠️ GUEST SIMULATION • #${simulatedRank} RANK</span>
            <span class="gjs-jackpot-share">${headline}</span>
          </div>
          <p class="gjs-desc">${desc}</p>
          <div class="gjs-cta-row">
            <button type="button" class="gjs-connect-btn" id="btn-gjs-connect-wallet">
              ⚡ CONNECT WALLET (TO SAVE & WIN JACKPOT)
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-gjs-connect-wallet")?.addEventListener("click", () => {
        try {
          sessionStorage.setItem("efoo_pending_guest_score", JSON.stringify({
            score: currentScore,
            goals: currentGoals,
            level: currentLevel,
            ts: Date.now()
          }));
        } catch (e) {}
        document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
      });
    }
  } else if (postMatchBanner) {
    postMatchBanner.classList.add("hidden");
    postMatchBanner.innerHTML = "";
  }

  // Construct table rows: if guest postmatch, insert guest simulated row
  let displayRows = list.map(item => ({ ...item, isSimulated: false }));
  if (isPostMatch && isGuest) {
    const higherCount = list.filter(x => x.score > currentScore).length;
    const simulatedRank = higherCount + 1;
    const simEntry = {
      rank: simulatedRank,
      address: "Guest",
      herotag: "",
      nickname: "YOU (Guest Striker)",
      level: currentLevel,
      goals: currentGoals,
      score: currentScore,
      date: "Just now (Simulated)",
      isGuest: true,
      isSimulated: true
    };
    displayRows.splice(simulatedRank - 1, 0, simEntry);
    displayRows.forEach((r, idx) => {
      r.displayRank = idx + 1;
    });
  } else {
    displayRows.forEach((r, idx) => {
      r.displayRank = r.rank || (idx + 1);
    });
  }

  if (displayRows.length === 0) {
    const emptyTr = document.createElement("tr");
    emptyTr.innerHTML = `
      <td colspan="5" style="text-align:center; padding:38px 16px; color:#94a3b8;">
        <div style="font-size:2.2rem; margin-bottom:8px;">🏟️ ⚽</div>
        <strong style="color:#fff; font-size:1.05rem; letter-spacing:0.04em;">NO RECORDED SCORES THIS WEEK YET</strong><br>
        <span style="font-size:0.82rem; color:#64748b; margin-top:4px; display:inline-block;">Play a match, score goals, and claim the #1 spot for the Sunday Jackpot!</span>
      </td>
    `;
    tbody.appendChild(emptyTr);
    return;
  }

  displayRows.forEach((row) => {
    const tr = document.createElement("tr");
    if (row.isSimulated) {
      tr.className = "simulated-guest-row";
    } else if (isConnected && row.address && row.address.toLowerCase() === connectedAddress.toLowerCase()) {
      tr.className = "user-highlight-row";
    }

    let herotag = row.herotag;
    if (!herotag || herotag.trim().length === 0) {
      if (!row.isGuest && row.address && row.address.startsWith("erd1")) {
        const known = getHerotagForAddress(row.address);
        if (known) {
          herotag = `@${known}`;
          row.herotag = herotag;
        } else {
          resolveHerotagAsync(row.address);
        }
      }
    }

    const isHero = !!(herotag && herotag.trim().length > 0);
    const shortAddr = row.isGuest ? (row.isSimulated ? "Unsaved" : "Guest") : shortErd(row.address);
    const isRowUltras = !row.isGuest && hasUltrasPass(row.address);
    const vipCrown = isRowUltras ? `<span class="ultras-vip-crown" title="👑 EFOO Ultras VIP Pass Active (0% Fees & +25% Score Boost)">👑 VIP</span> ` : "";
    const displayName = row.isSimulated
      ? `<strong style="color:#ffffff; font-size:0.92rem;">👤 ${escapeHtml(row.nickname)}</strong>`
      : isHero
      ? `<strong class="herotag-name" style="color:#a8ff00; font-weight:800; font-size:0.95rem; text-shadow:0 0 10px rgba(168,255,0,0.5);">${vipCrown}⚡ ${escapeHtml(herotag)}</strong>`
      : `<span class="generated-nickname" style="color:#94a3b8; font-style:italic;">${vipCrown}${escapeHtml(row.nickname || row.name || getDeterministicFootballNickname(row.address))}</span>`;

    const rankPill = row.displayRank === 1
      ? "🥇 1"
      : row.displayRank === 2
      ? "🥈 2"
      : row.displayRank === 3
      ? "🥉 3"
      : `#${row.displayRank}`;

    tr.innerHTML = `
      <td><strong>${row.isSimulated ? `<span style="color:#ffb800;">⚡ ${rankPill}</span>` : rankPill}</strong></td>
      <td>
        ${displayName}
        <small style="color:${row.isSimulated ? '#fef08a' : '#64748b'}; font-size:0.68rem; margin-left:6px; font-family:'JetBrains Mono',monospace;">(${shortAddr})</small>
      </td>
      <td><span style="color:#38bdf8; font-weight:800; white-space:nowrap;">LVL ${row.level || 1}</span></td>
      <td><strong style="color:#a8ff00; font-family:'JetBrains Mono',monospace;">${row.score.toLocaleString("en-US")}</strong></td>
      <td style="color:${row.isSimulated ? '#fef08a' : '#94a3b8'}; font-size:0.7rem; font-weight:${row.isSimulated ? '800' : '400'};">${row.date || "Just now"}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStartScreenLeaderboard() {
  const tbody = document.getElementById("hub-lb-tbody");
  const countEl = document.getElementById("hub-lb-players-count");
  if (!tbody) return;

  const isAllTime = currentHubLeaderboardTab === "alltime";
  const list = getLeaderboard(currentHubLeaderboardTab);
  tbody.innerHTML = "";

  // Update Tab active states
  const tabW = document.getElementById("tab-hub-weekly");
  const tabA = document.getElementById("tab-hub-alltime");
  if (tabW) {
    tabW.classList.toggle("active", !isAllTime);
    tabW.classList.remove("alltime");
  }
  if (tabA) {
    tabA.classList.toggle("active", isAllTime);
    tabA.classList.toggle("alltime", isAllTime);
  }

  // Toggle Payout Strip vs All-Time Hall of Fame Banner
  const weeklyStrip = document.getElementById("hlb-weekly-payout-strip");
  const allTimeStrip = document.getElementById("hlb-alltime-strip");
  if (weeklyStrip) weeklyStrip.classList.toggle("hidden", isAllTime);
  if (allTimeStrip) allTimeStrip.classList.toggle("hidden", !isAllTime);

  // Update Header titles
  const titleEl = document.getElementById("hlb-header-title");
  const subEl = document.getElementById("hlb-header-subtitle");
  if (titleEl) {
    titleEl.textContent = isAllTime ? "👑 ALL-TIME HALL OF FAME" : "🏆 STADIUM LEADERBOARD";
  }
  if (subEl) {
    subEl.textContent = isAllTime 
      ? "All-Time Legends • Career High Scores"
      : "Top Scorers of the Week • Live Verification";
  }

  if (countEl) {
    const label = isAllTime ? "All-Time Legends" : "Weekly Scorers";
    countEl.textContent = list.length === 0
      ? `0 ${label}`
      : `${list.length} ${label}`;
  }

  if (list.length === 0) {
    const emptyTr = document.createElement("tr");
    emptyTr.innerHTML = `
      <td colspan="4" style="text-align:center; padding:28px 12px; color:#94a3b8;">
        <div style="font-size:1.8rem; margin-bottom:6px;">🏟️ ⚽</div>
        <strong style="color:#fff; font-size:0.92rem; letter-spacing:0.04em;">${isAllTime ? "NO ALL-TIME LEGENDS YET" : "NO WEEKLY SCORERS YET"}</strong><br>
        <span style="font-size:0.75rem; color:#64748b; margin-top:3px; display:inline-block;">Play a match, score goals, and etch your name into the ${isAllTime ? "Hall of Fame" : "Weekly Board"}!</span>
      </td>
    `;
    tbody.appendChild(emptyTr);
    return;
  }

  // Display top 8 on the start screen hub
  const topList = list.slice(0, 8);
  topList.forEach((row) => {
    const tr = document.createElement("tr");

    let herotag = row.herotag;
    if (!herotag || herotag.trim().length === 0) {
      if (!row.isGuest && row.address && row.address.startsWith("erd1")) {
        const known = getHerotagForAddress(row.address);
        if (known) {
          herotag = `@${known}`;
          row.herotag = herotag;
        } else {
          resolveHerotagAsync(row.address);
        }
      }
    }

    const isConnected = !!(connectedAddress && (connectedAddress.startsWith("erd1") || connectedAddress.length >= 32));
    if (isConnected && row.address && row.address.toLowerCase() === connectedAddress.toLowerCase()) {
      tr.className = "user-highlight-row";
    }

    const isHero = !!(herotag && herotag.trim().length > 0);
    const isRowUltras = !row.isGuest && hasUltrasPass(row.address);
    const vipCrown = isRowUltras ? `<span class="ultras-vip-crown" title="👑 EFOO Ultras VIP Pass Active">👑</span> ` : "";

    const displayName = isHero
      ? `<strong class="herotag-name" style="color:#a8ff00; font-weight:800; font-size:0.86rem;">${vipCrown}⚡ ${escapeHtml(herotag)}</strong>`
      : `<span class="generated-nickname" style="color:#cbd5e1; font-size:0.84rem;">${vipCrown}${escapeHtml(row.nickname || row.name || getDeterministicFootballNickname(row.address))}</span>`;

    const rankPill = row.rank === 1
      ? "🥇 1"
      : row.rank === 2
      ? "🥈 2"
      : row.rank === 3
      ? "🥉 3"
      : `#${row.rank}`;

    tr.innerHTML = `
      <td><strong style="color:${row.rank <= 3 ? '#ffb800' : '#94a3b8'};">${rankPill}</strong></td>
      <td>
        <div style="display:flex; flex-direction:column; line-height:1.2;">
          ${displayName}
          <small style="color:#64748b; font-size:0.65rem; font-family:'JetBrains Mono',monospace;">${row.isGuest ? 'Guest' : shortErd(row.address)}</small>
        </div>
      </td>
      <td style="text-align: center;"><span style="color:#38bdf8; font-weight:800; font-size:0.75rem;">L${row.level || 1}</span></td>
      <td style="text-align: right;"><strong style="color:#a8ff00; font-family:'JetBrains Mono',monospace; font-size:0.84rem;">${row.score.toLocaleString("en-US")}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderLevelSelectModal() {
  const grid = document.getElementById("levels-map-grid");
  if (!grid) return;
  const unlocked = metaUnlockedLevel();
  grid.innerHTML = "";

  for (let l = 1; l <= MAX_LEVEL; l++) {
    const isUnlocked = l <= unlocked;
    const isCurrent = l === game.level;
    const params = getLevelParams(l);
    const tier = getLevelTier(l);
    const node = document.createElement("div");
    node.className = `level-node ${isUnlocked ? "unlocked" : "locked"} ${isCurrent ? "current" : ""}`;
    node.innerHTML = `
      <span class="level-node-num" style="color:${isCurrent ? "#a8ff00" : tier.color};">${l}</span>
      <span class="level-node-req">${isUnlocked ? `⚽ ${params.goalsNeeded}/5` : "🔒"}</span>
    `;
    if (isUnlocked) {
      node.addEventListener("click", () => {
        selectLevel(l);
        document.getElementById("level-select-modal-overlay")?.classList.add("hidden");
        const msg = currentLang === "ro"
          ? `⚡ Nivel selectat: LEVEL ${l} (${tier.name})`
          : (currentLang === "hu"
              ? `⚡ Szint kiválasztva: LEVEL ${l} (${tier.name})`
              : `⚡ Level selected: LEVEL ${l} (${tier.name})`);
        showToast(msg);
      });
    }
    grid.appendChild(node);
  }
}

function metaRefreshUI() {
  const streakData = getDailyStreakData();
  const streakPill = document.getElementById("streak-pill-label");
  if (streakPill) {
    streakPill.textContent = `${streakData.streak}d`;
    if (streakData.isFifthDay && !streakData.claimed) {
      streakPill.textContent = "🎁 GIFT!";
      streakPill.parentElement?.classList.add("pulse");
    }
  }

  const lvlVal = document.getElementById("hud-level-val");
  if (lvlVal) {
    lvlVal.textContent = String(game.level);
    lvlVal.style.color = getLevelTier(game.level).color;
  }
  const goalsVal = document.getElementById("hud-goals-val");
  const lv = getLevelParams(game.level);
  if (goalsVal) {
    goalsVal.textContent = `${game.goals}/${lv.goalsNeeded}`;
    goalsVal.classList.toggle("done", game.goals >= lv.goalsNeeded);
  }

  renderSkillsDeckUI();
}

function metaOnMatchEnd({ level, score, goals, cleared, perfect }) {
  const curUnlocked = metaUnlockedLevel();
  let unlockedNow = false;
  let newLevel = curUnlocked;

  if (cleared) {
    const targetUnlocked = Math.min(MAX_LEVEL, Math.max(curUnlocked, level + 1));
    if (targetUnlocked > curUnlocked) {
      newLevel = targetUnlocked;
      unlockedNow = true;
      try {
        localStorage.setItem(STORAGE_UNLOCKED_LEVEL, String(newLevel));
      } catch (e) {}
    }
  }

  const rank = recordMatchToLeaderboard(score, goals, level);
  metaRefreshUI();

  return {
    unlockedNow,
    newLevel,
    rankPromise: Promise.resolve(rank ? `🏆 Leaderboard: Rank #${rank}!` : "")
  };
}

// ============================================================================
// INIT & BINDINGS
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  if (connectedAddress && typeof window !== "undefined" && getDefiExtension() && connectedProvider !== "xportal" && connectedProvider !== "inspector" && connectedProvider !== "phantom") {
    connectedProvider = "extension";
    localStorage.setItem("efoo_wallet_provider", "extension");
    localStorage.setItem("multiversx_provider", "extension");
  }
  checkUrlWalletCallbacks().then((handledLogin) => {
    if (!handledLogin && connectedAddress && VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
      document.getElementById("nav-wallet-label").textContent = shortErd(connectedAddress);
      updateEntryGateUI();
      fetchWalletNftsAndBalance(connectedAddress);
    }
  });

  updateStrikerCardAssets(0);
  updateKeeperAssets(0);
  applyLang(currentLang);
  refreshHudUI();
  refreshOnChainVaultStats();
  updateOwnerAdminVisibility(connectedAddress);
  setStartScreenState(true);
  initFullscreenStadiumCanvas();

  // Safe summary exit helper (returns cleanly to hub)
  const closeSummaryModal = () => {
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    setStartScreenState(true);
  };

  // Squad Selection Modal (Choose player & goalkeeper after start or via button)
  const openSquadSelect = () => {
    document.getElementById("squad-select-modal")?.classList.remove("hidden");
    updateStrikerCardAssets(strikerIdx);
    updateKeeperAssets(keeperIdx);
  };
  const closeSquadSelect = () => {
    document.getElementById("squad-select-modal")?.classList.add("hidden");
  };

  document.getElementById("btn-open-squad-select")?.addEventListener("click", openSquadSelect);
  document.getElementById("close-squad-select-btn")?.addEventListener("click", closeSquadSelect);
  document.getElementById("squad-select-modal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "squad-select-modal") closeSquadSelect();
  });

  document.getElementById("btn-confirm-squad")?.addEventListener("click", () => {
    closeSquadSelect();
    launchMatchWithIntro();
  });

  document.getElementById("btn-quick-rookie")?.addEventListener("click", () => {
    updateStrikerCardAssets(0);
    updateKeeperAssets(0);
    closeSquadSelect();
    launchMatchWithIntro();
  });

  document.getElementById("btn-start-match")?.addEventListener("click", () => {
    // If player has connected NFTs in wallet, let them choose their squad after clicking Start!
    if (walletState.ownedNfts && walletState.ownedNfts.length > 0) {
      openSquadSelect();
    } else {
      launchMatchWithIntro();
    }
  });

  document.getElementById("btn-clean-sound-toggle")?.addEventListener("click", () => {
    audio.enabled = !audio.enabled;
    const sfxHubLbl = document.getElementById("sfx-status-lbl");
    if (sfxHubLbl) sfxHubLbl.textContent = audio.enabled ? "SFX ON" : "SFX OFF";
    const sfxBtn = document.getElementById("btn-clean-sound-toggle");
    if (sfxBtn) sfxBtn.classList.toggle("active", audio.enabled);
    const sfxLbl = document.getElementById("sfx-label");
    if (sfxLbl) sfxLbl.textContent = audio.enabled ? "ON" : "OFF";
  });

  document.getElementById("btn-sum-replay")?.addEventListener("click", () => {
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    launchMatchWithIntro();
  });
  document.getElementById("btn-sum-next")?.addEventListener("click", () => {
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    if (game.level < MAX_LEVEL) game.level += 1;
    launchMatchWithIntro();
  });

  // Match summary MAIN MENU button: Saves match score to leaderboard, then redirects cleanly to /game
  document.getElementById("btn-sum-exit")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (game.score > 0) {
      recordMatchToLeaderboard(game.score, game.userGoals, game.level);
    }
    window.location.href = "game";
  });

  // In-game HUD EXIT button: Prompts confirmation that score will NOT be saved, then redirects to /game
  document.getElementById("hud-exit-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    const isHu = currentLang === "hu";
    const isRo = currentLang === "ro";
    const msg = isHu
      ? "Biztosan ki akarsz lépni? A mérkőzés megszakításával a megszerzett pontjaid nem kerülnek mentésre!"
      : isRo
      ? "Sigur vrei să ieși? Punctele acumulate în meci nu vor fi salvate!"
      : "Are you sure you want to exit? Your current match points will not be saved!";
    if (window.confirm(msg)) {
      window.location.href = "game";
    }
  });

  // Defeat Streak Rescue Handlers (50k Revive & Advance / 25k Retry Round / Free Restart)
  document.getElementById("btn-defeat-revive-next")?.addEventListener("click", () => {
    const cost = 50000;
    const isHu = currentLang === "hu";
    const isRo = currentLang === "ro";
    if (walletState.efooBalance < cost) {
      if (typeof audio.playPostClang === "function") audio.playPostClang();
      const balStr = Math.floor(walletState.efooBalance).toLocaleString("en-US");
      showToast(
        isHu
          ? `⚠️ Nincs elegendő $EFOO egyenleged (${balStr} $EFOO). Szükséges: 50,000 $EFOO a széria megmentéséhez!`
          : (isRo
            ? `⚠️ Sold insuficient (${balStr} $EFOO). Necesar: 50,000 $EFOO pentru a salva seria!`
            : `⚠️ Insufficient $EFOO balance (${balStr}). Needed: 50,000 $EFOO to revive streak!`)
      );
      return;
    }
    walletState.efooBalance -= cost;
    updateHudEfooBadge();
    addVaultContributions(25000, 25000); // 50% to vault (25k), 50% burned (25k)!
    game.streak = (game.streak || 0) + 1;
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    if (typeof audio.playGoalCheer === "function") audio.playGoalCheer();

    // Broadcast on-chain transaction to Stadium Vault SC if wallet is connected
    if (walletState.address && typeof signAndSendTxs === "function") {
      const tHex = strToHex("EFOO-8fe2d4");
      const aHex = amountToHex(cost, 18);
      const endpointHex = strToHex("reviveStreakAndAdvance");
      signAndSendTxs([
        {
          receiver: CONTRACTS.STADIUM_VAULT_SC,
          value: "0",
          gasLimit: 12000000,
          data: `ESDTTransfer@${tHex}@${aHex}@${endpointHex}`
        }
      ], "revive_streak");
    }

    showToast(
      isHu
        ? `🔥 Széria megmentve! 25,000 $EFOO elégetve, 25,000 $EFOO a Stadium Vaultba küldve! Ugrás a ${Math.min(MAX_LEVEL, game.level + 1)}. szintre!`
        : (isRo
          ? `🔥 Serie salvată! 25.000 $EFOO arse, 25.000 trimise în Seif! Treci la nivelul următor!`
          : `🔥 Streak Revived & Advanced! 25,000 $EFOO burned, 25,000 deposited to Stadium Vault!`)
    );
    goNextLevel();
  });

  document.getElementById("btn-defeat-retry-round")?.addEventListener("click", () => {
    const cost = 25000;
    const isHu = currentLang === "hu";
    const isRo = currentLang === "ro";
    if (walletState.efooBalance < cost) {
      if (typeof audio.playPostClang === "function") audio.playPostClang();
      const balStr = Math.floor(walletState.efooBalance).toLocaleString("en-US");
      showToast(
        isHu
          ? `⚠️ Nincs elegendő $EFOO egyenleged (${balStr} $EFOO). Szükséges: 25,000 $EFOO a kör újrázásához!`
          : (isRo
            ? `⚠️ Sold insuficient (${balStr} $EFOO). Necesar: 25,000 $EFOO pentru a reîncerca runda!`
            : `⚠️ Insufficient $EFOO balance (${balStr}). Needed: 25,000 $EFOO to retry round!`)
      );
      return;
    }
    walletState.efooBalance -= cost;
    updateHudEfooBadge();
    addVaultContributions(12500, 12500); // 50% to vault (12.5k), 50% burned (12.5k)!

    // Broadcast on-chain transaction to Stadium Vault SC if wallet is connected
    if (walletState.address && typeof signAndSendTxs === "function") {
      const tHex = strToHex("EFOO-8fe2d4");
      const aHex = amountToHex(cost, 18);
      const endpointHex = strToHex("retryCurrentRound");
      signAndSendTxs([
        {
          receiver: CONTRACTS.STADIUM_VAULT_SC,
          value: "0",
          gasLimit: 12000000,
          data: `ESDTTransfer@${tHex}@${aHex}@${endpointHex}`
        }
      ], "retry_round");
    }

    // Streak preserved!
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    if (typeof audio.playWhistle === "function") audio.playWhistle();
    showToast(
      isHu
        ? `🔄 Kör újrakezdve! 12,500 $EFOO elégetve, 12,500 $EFOO a Vaultba! Széria megvédve.`
        : (isRo
          ? `🔄 Rundă reluată! 12.500 $EFOO arse, 12.500 în Seif! Serie protejată.`
          : `🔄 Round Replayed! 12,500 $EFOO burned, 12,500 deposited to Vault! Streak protected.`)
    );
    launchMatchWithIntro();
  });

  document.getElementById("btn-defeat-restart-free")?.addEventListener("click", () => {
    game.streak = 0;
    game.level = 1;
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    const isHu = currentLang === "hu";
    const isRo = currentLang === "ro";
    showToast(
      isHu
        ? `🏠 Ingyenes újraindítás az 1. szintről. A széria nullázva.`
        : (isRo
          ? `🏠 Reîncepere gratuită de la Nivelul 1. Serie resetată.`
          : `🏠 Free restart from Level 1. Streak reset to 0.`)
    );
    launchMatchWithIntro();
  });


  // Click FUT Card Dock to cycle active Striker or Goalkeeper depending on turn
  document.getElementById("fut-striker-dock")?.addEventListener("click", () => {
    if (game.shootoutTurn === "defend") {
      updateKeeperAssets(keeperIdx + 1);
    } else {
      updateStrikerCardAssets(strikerIdx + 1);
    }
    refreshHudUI();
    renderSkillsDeckUI();
  });

  // Top bar $EFOO balance pill opens Boost/Buy modal or triggers buy
  document.getElementById("hud-efoo-badge")?.addEventListener("click", () => {
    document.getElementById("boost-modal-overlay")?.classList.remove("hidden");
  });

  // Disconnect Wallet buttons (HUD, Hub & Wallet Modal)
  document.getElementById("disconnect-wallet-btn")?.addEventListener("click", disconnectWallet);
  document.getElementById("hub-disconnect-wallet-btn")?.addEventListener("click", disconnectWallet);
  document.getElementById("modal-disconnect-wallet-btn")?.addEventListener("click", disconnectWallet);

  // Sound & Language Toggles
  document.getElementById("sfx-toggle-btn")?.addEventListener("click", () => {
    audio.enabled = !audio.enabled;
    document.getElementById("sfx-label").textContent = audio.enabled ? "ON" : "OFF";
  });
  document.getElementById("lang-toggle-btn")?.addEventListener("click", () => {
    const nextLang = currentLang === "en" ? "hu" : currentLang === "hu" ? "ro" : "en";
    applyLang(nextLang);
  });

  // Boost / Pot Drawer Modal
  const openBoost = () => document.getElementById("boost-modal-overlay")?.classList.remove("hidden");
  const closeBoost = () => document.getElementById("boost-modal-overlay")?.classList.add("hidden");
  document.getElementById("open-boost-btn")?.addEventListener("click", openBoost);
  document.getElementById("open-pot-pill")?.addEventListener("click", openBoost);
  document.querySelectorAll(".vp-icon-slot").forEach((el) => el.addEventListener("click", openBoost));
  document.getElementById("close-boost-modal-btn")?.addEventListener("click", closeBoost);
  document.getElementById("boost-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "boost-modal-overlay") closeBoost();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeBoost();
      document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
    }
  });

  // Start Screen Entry Gate Instant Purchase & Refresh Buttons
  document.getElementById("gate-buy-starter-btn")?.addEventListener("click", buyStarterPackOnChain);
  document.getElementById("gate-buy-efoo-btn")?.addEventListener("click", buy3MEfooOnChain);
  document.getElementById("gate-mint-nft-btn")?.addEventListener("click", mintStrikerOnChain);
  document.getElementById("gate-refresh-btn")?.addEventListener("click", () => {
    if (connectedAddress) fetchWalletNftsAndBalance(connectedAddress);
  });

  // VAR Revive Actions
  document.getElementById("var-burn-revive-btn")?.addEventListener("click", burnReviveOnChain);
  document.getElementById("var-micro-revive-btn")?.addEventListener("click", buyMicroReviveOnChain);
  document.getElementById("var-skip-btn")?.addEventListener("click", closeVarReviveAndFinish);

  // Store & Summary Actions
  document.getElementById("modal-buy-starter-btn")?.addEventListener("click", buyStarterPackOnChain);
  document.getElementById("btn-sum-starter")?.addEventListener("click", buyStarterPackOnChain);
  document.getElementById("modal-buy-efoo-btn")?.addEventListener("click", buy3MEfooOnChain);
  document.getElementById("btn-sum-buy")?.addEventListener("click", buy3MEfooOnChain);
  document.getElementById("modal-mint-player-btn")?.addEventListener("click", mintStrikerOnChain);
  document.getElementById("btn-sum-mint")?.addEventListener("click", mintStrikerOnChain);
  document.getElementById("modal-mint-keeper-btn")?.addEventListener("click", mintKeeperOnChain);
  document.getElementById("modal-kick-pot-btn")?.addEventListener("click", kick100kPotOnChain);

  // Share on X
  document.getElementById("btn-sum-share")?.addEventListener("click", () => {
    const p = getPowers();
    const txt = `⚽ Scored ${game.goals} goals & ${game.score.toLocaleString()} pts (${p.totalMult.toFixed(1)}x NFT Boost) in #EFOO FOMO Arena on #MultiversX! 🔥\n\nPlay now: https://efoo.optibase.ro/game\n@EFootball_X`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(txt)}`, "_blank");
  });

  // Wallet Modal
  document.getElementById("open-wallet-modal-btn")?.addEventListener("click", () => {
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
  });
  document.getElementById("close-wallet-modal-btn")?.addEventListener("click", () => {
    document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
  });
  
  // Solana Devnet Phantom Login in Game
  document.getElementById("login-phantom-btn")?.addEventListener("click", async () => {
    try {
      if (typeof SolanaAdapter === "undefined") {
        alert("Solana Adapter loading...");
        return;
      }
      const pubkey = await SolanaAdapter.connectPhantom();
      connectWithAddress(pubkey, "phantom");
      document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
      showToast(currentLang === "hu" ? "✅ Phantom tárca csatlakoztatva (Solana Devnet)!" : "✅ Phantom wallet connected on Solana Devnet!");
    } catch (err) {
      if (err && err.message !== "PHANTOM_NOT_INSTALLED") {
        console.warn("Phantom game connect notice:", err);
      }
    }
  });

  document.getElementById("login-xportal-btn")?.addEventListener("click", initXPortalWalletConnect);
  document.getElementById("login-extension-btn")?.addEventListener("click", connectDefiExtension);
  document.getElementById("login-webwallet-btn")?.addEventListener("click", () => {
    window.location.href = getMultiversXLoginHookUrl();
  });
  document.getElementById("tx-toast-close")?.addEventListener("click", () => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
      toastTimeoutId = null;
    }
    document.getElementById("tx-toast")?.classList.add("hidden");
  });

  // Next Level in Summary
  document.getElementById("btn-sum-next")?.addEventListener("click", goNextLevel);

  // Leaderboard Modal
  const openLeaderboard = () => {
    isPostMatchLeaderboardActive = false;
    renderLeaderboardModal({ isPostMatch: false });
    document.getElementById("leaderboard-modal-overlay")?.classList.remove("hidden");
  };
  const closeLeaderboard = () => {
    document.getElementById("leaderboard-modal-overlay")?.classList.add("hidden");
    if (isPostMatchLeaderboardActive) {
      isPostMatchLeaderboardActive = false;
      openSummaryModal();
    }
  };
  document.getElementById("open-ranks-btn")?.addEventListener("click", openLeaderboard);
  document.getElementById("close-ranks-modal-btn")?.addEventListener("click", closeLeaderboard);
  document.getElementById("lb-play-btn")?.addEventListener("click", () => {
    closeLeaderboard();
    launchMatchWithIntro();
  });
  document.getElementById("lb-next-summary-btn")?.addEventListener("click", () => {
    isPostMatchLeaderboardActive = false;
    document.getElementById("leaderboard-modal-overlay")?.classList.add("hidden");
    openSummaryModal();
  });
  document.getElementById("leaderboard-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "leaderboard-modal-overlay") closeLeaderboard();
  });

  // Daily Streak Modal
  const openStreak = () => {
    renderDailyStreakModal();
    document.getElementById("daily-streak-modal-overlay")?.classList.remove("hidden");
  };
  const closeStreak = () => document.getElementById("daily-streak-modal-overlay")?.classList.add("hidden");
  document.getElementById("open-streak-btn")?.addEventListener("click", openStreak);
  document.getElementById("close-streak-modal-btn")?.addEventListener("click", closeStreak);
  document.getElementById("daily-streak-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "daily-streak-modal-overlay") closeStreak();
  });

  // Super Skills Shop & Marketplace Direct Navigation
  document.getElementById("open-skills-shop-btn")?.addEventListener("click", () => {
    window.location.href = "market?tab=skills";
  });
  document.getElementById("close-skills-shop-btn")?.addEventListener("click", closeSkillsShopModal);
  document.getElementById("skills-shop-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "skills-shop-modal-overlay") closeSkillsShopModal();
  });

  // Start Screen & Summary Screen Marketplace Triggers (Közvetlen navigáció a Piactér Skills fülére)
  document.getElementById("start-open-store-btn")?.addEventListener("click", () => {
    window.location.href = "market?tab=skills";
  });
  document.getElementById("btn-sum-open-store")?.addEventListener("click", () => {
    window.location.href = "market?tab=skills";
  });
  document.getElementById("btn-sum-skills-shop")?.addEventListener("click", () => {
    window.location.href = "market?tab=skills";
  });

  // Marketplace Modal Tabs
  document.getElementById("tab-btn-skills")?.addEventListener("click", () => setMarketplaceTab("skills"));
  document.getElementById("tab-btn-nfts")?.addEventListener("click", () => setMarketplaceTab("nfts"));
  document.getElementById("tab-btn-tokens")?.addEventListener("click", () => setMarketplaceTab("tokens"));

  // Marketplace Modal On-Chain Actions
  document.getElementById("market-mint-striker-btn")?.addEventListener("click", mintStrikerOnChain);
  document.getElementById("market-mint-keeper-btn")?.addEventListener("click", mintKeeperOnChain);
  document.getElementById("market-buy-starter-btn")?.addEventListener("click", buyStarterPackOnChain);
  document.getElementById("market-buy-efoo-btn")?.addEventListener("click", buy3MEfooOnChain);

  // Level Select Modal
  const openLevels = () => {
    renderLevelSelectModal();
    document.getElementById("level-select-modal-overlay")?.classList.remove("hidden");
  };
  const closeLevels = () => document.getElementById("level-select-modal-overlay")?.classList.add("hidden");
  document.getElementById("hud-level-pill")?.addEventListener("click", openLevels);
  document.getElementById("close-levels-modal-btn")?.addEventListener("click", closeLevels);
  document.getElementById("level-select-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "level-select-modal-overlay") closeLevels();
  });

  // ESC key closes all active modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeBoost();
      closeLeaderboard();
      closeStreak();
      closeSkillsShopModal();
      closeLevels();
      document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
    }
  });

  // Squad Selection Card Cycling (Buttons and Clickable Media Cards)
  document.getElementById("prev-striker-btn")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx - 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("next-striker-btn")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("striker-slot-media")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });

  document.getElementById("prev-keeper-btn")?.addEventListener("click", () => {
    updateKeeperAssets(keeperIdx - 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("next-keeper-btn")?.addEventListener("click", () => {
    updateKeeperAssets(keeperIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("keeper-slot-media")?.addEventListener("click", () => {
    updateKeeperAssets(keeperIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });


  // =========================================================================
  // EA SPORTS HUB / START SCREEN MAIN MENU EVENT LISTENERS
  // =========================================================================
  // Background Music Toggle
  document.getElementById("btn-toggle-bgm")?.addEventListener("click", () => {
    audio.toggleBgm();
  });

  // Hub Wallet Connect button
  document.getElementById("open-wallet-modal-btn-hub")?.addEventListener("click", () => {
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
  });

  // Hub Striker cycling and switcher
  document.getElementById("prev-striker-btn-hub")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx - 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("next-striker-btn-hub")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("hub-striker-media")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("btn-switch-striker")?.addEventListener("click", openSquadSelect);

  // Hub Keeper cycling and switcher
  document.getElementById("prev-keeper-btn-hub")?.addEventListener("click", () => {
    updateKeeperAssets(keeperIdx - 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("next-keeper-btn-hub")?.addEventListener("click", () => {
    updateKeeperAssets(keeperIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("hub-keeper-media")?.addEventListener("click", () => {
    updateKeeperAssets(keeperIdx + 1);
    refreshHudUI();
    renderSkillsDeckUI();
  });
  document.getElementById("btn-switch-keeper")?.addEventListener("click", openSquadSelect);

  // Hub Leaderboard refresh & details
  document.getElementById("btn-refresh-hub-lb")?.addEventListener("click", () => {
    syncOnchainUltrasHolders().then(() => {
      if (typeof window !== "undefined" && window.EfooLeaderboard) {
        window.EfooLeaderboard.fetchLeaderboard().then(() => {
          renderStartScreenLeaderboard();
          showToast(currentLang === "hu" ? "🔄 Élő ranglista frissítve a felhőből!" : "🔄 Live leaderboard updated from cloud!");
        });
      } else {
        renderStartScreenLeaderboard();
        showToast(currentLang === "hu" ? "🔄 Ranglista frissítve!" : "🔄 Leaderboard refreshed!");
      }
    });
  });
  // Dual Leaderboard Tab Switchers
  document.getElementById("tab-hub-weekly")?.addEventListener("click", () => {
    currentHubLeaderboardTab = "weekly";
    renderStartScreenLeaderboard();
  });
  document.getElementById("tab-hub-alltime")?.addEventListener("click", () => {
    currentHubLeaderboardTab = "alltime";
    renderStartScreenLeaderboard();
  });

  document.getElementById("tab-modal-weekly")?.addEventListener("click", () => {
    currentModalLeaderboardTab = "weekly";
    renderLeaderboardModal({ isPostMatch: isPostMatchLeaderboardActive });
  });
  document.getElementById("tab-modal-alltime")?.addEventListener("click", () => {
    currentModalLeaderboardTab = "alltime";
    renderLeaderboardModal({ isPostMatch: isPostMatchLeaderboardActive });
  });

  document.getElementById("open-full-ranks-modal")?.addEventListener("click", openLeaderboard);
  document.querySelector(".hub-pot-badge")?.addEventListener("click", openLeaderboard);

  // Sync verified on-chain Ultras Pass holders & Global Leaderboard at startup
  syncOnchainUltrasHolders().then(() => {
    renderStartScreenLeaderboard();
  });

  // Real-time Global Leaderboard Live Listener (Firebase)
  if (typeof window !== "undefined" && window.EfooLeaderboard) {
    window.EfooLeaderboard.onUpdate(() => {
      renderStartScreenLeaderboard();
      const modal = document.getElementById("leaderboard-modal-overlay");
      if (modal && !modal.classList.contains("hidden")) {
        renderLeaderboardModal({ isPostMatch: isPostMatchLeaderboardActive });
      }
    });
    window.EfooLeaderboard.fetchLeaderboard().then(() => {
      renderStartScreenLeaderboard();
    }).catch(() => {});
  }

  // First user interaction gesture to unlock Web Audio API background music
  const unlockBgmGesture = () => {
    if (audio && audio.bgmEnabled && !audio.bgmPlaying) {
      audio.startBgm();
    }
  };
  window.addEventListener("pointerdown", unlockBgmGesture, { once: true });
  window.addEventListener("keydown", unlockBgmGesture, { once: true });
});
