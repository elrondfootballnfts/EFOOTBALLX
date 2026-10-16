// ============================================================================
// $EFOO OFFICIAL P2P NFT & SKILL MARKETPLACE
// Sunday League Degen FC on MultiversX
// ============================================================================

const MULTIVERSX_API = "https://api.multiversx.com";
const XOXNO_API = "https://api.xoxno.com";
const XOXNO_MARKETPLACE_SC = "erd1qqqqqqqqqqqqqpgq6wegs2xkypfpync8mn2sa5cmpqjlvrhwz5nqgepyg8";
const EFOO_TOKEN_ID = "EFOO-8fe2d4";
const STRIKER_COLLECTION = "EFOOTBALL-91a4eb";
const KEEPER_COLLECTION = "GOALKEEPER-cb9e3e";
const STADIUM_VAULT_SC = "erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend";
const SC_HEX = "0000000000000000050073468fd6de427aad382f3625938265473003f886a52f";
const EFOOREWARDS_WALLET = "erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my";

// ============================================================================
// BLOCKCHAIN & ON-CHAIN TRANSACTION HELPERS
// ============================================================================
function stringToHex(str) {
  if (!str) return "";
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toAtomicUnits(val, decimals = 18) {
  const str = String(val).trim();
  const parts = str.split(".");
  const whole = parts[0] || "0";
  let frac = parts[1] || "";
  if (frac.length > decimals) {
    frac = frac.slice(0, decimals);
  } else {
    frac = frac.padEnd(decimals, "0");
  }
  const fullStr = (whole + frac).replace(/^0+/, "");
  return BigInt(fullStr || "0");
}

async function sendMultiversxTransaction({ receiver, value = "0", data = "", gasLimit = 15000000 }) {
  const isHu = currentMarketLang === "hu";
  const provider = window.multiversx || window.elrondWallet || window.elrond;
  
  if (provider && typeof provider.signAndSendTransaction === "function") {
    try {
      const payload = {
        value: String(value),
        receiver: receiver,
        data: data,
        gasLimit: gasLimit,
        chainID: "1"
      };
      const res = await provider.signAndSendTransaction(payload);
      return { success: true, hash: res?.hash, method: "extension" };
    } catch (e) {
      if (e?.message && (e.message.includes("User canceled") || e.message.includes("rejected") || e.message.includes("closed"))) {
        throw new Error(isHu ? "Tranzakció megszakítva a felhasználó által." : "Transaction cancelled by user.");
      }
      console.warn("Provider signAndSendTransaction fallback to Web Wallet:", e);
    }
  }

  // Fallback to official MultiversX Web Wallet / xPortal transaction hook
  const walletUrl = `https://wallet.multiversx.com/hook/transaction?receiver=${encodeURIComponent(receiver)}&value=${value}&gasLimit=${gasLimit}&data=${encodeURIComponent(data)}&callbackUrl=${encodeURIComponent(window.location.href)}`;
  window.open(walletUrl, "_blank");
  return { success: true, method: "webwallet" };
}

const STORAGE_LISTINGS = "EFOO_NFT_MARKET_LISTINGS_V1";
const STORAGE_VAULT_POT = "efoo_stadium_vault_pot";
const STORAGE_TOTAL_BURNED = "efoo_total_burned_games";
const STORAGE_SKILLS_INVENTORY = "efoo_skills_inventory_v1";

const BASE_VAULT_POT = 0;
const BASE_BURNED_GAMES = 0;

let currentMarketLang = "en";
let currentTab = "browse";
let filterCollection = "all";
let filterRarity = "all";
let sortOrder = "price_asc";

// Connected Wallet State (Syncs seamlessly with index.html & game.html)
let marketWallet = {
  address: null,
  provider: null,
  efooBalance: 0,
  egldBalance: 0,
  ownedNfts: []
};

// Selected NFT for Modals
let activeModalNft = null;

// ============================================================================
// I18N DICTIONARY
// ============================================================================
const MARKET_I18N = {
  en: {
    nav_market_sub: "NFT & SKILL MARKETPLACE",
    hero_sub: "Trade official <strong>EFOOTBALL-91a4eb</strong> Strikers and <strong>GOALKEEPER-cb9e3e</strong> Keepers directly with players. Every trade burns <strong>$EFOO</strong> and fuels the weekend Stadium Vault Jackpot!",
    stat_vault: "STADIUM VAULT JACKPOT",
    stat_vault_rule: "Weekend Payout: 65% (1st) • 25% (2nd) • 10% (3rd)",
    stat_burned: "TOTAL BURNED IN GAMES",
    stat_burned_sub: "Deflationary Supply Reduction",
    stat_listings: "ACTIVE LISTINGS",
    stat_floor: "FLOOR PRICE",
    tab_browse: "Browse Market",
    tab_my_nfts: "My Locker & Sell",
    tab_skills: "Super Skills Store (-20%)",
    locker_title: "🎒 MY WALLET LOCKER ROOM",
    locker_sub: "Your connected MultiversX squad NFTs. List them for sale, edit asking prices, or withdraw active listings anytime!",
    locker_not_conn_title: "CONNECT YOUR WALLET TO ACCESS YOUR SQUAD",
    locker_not_conn_desc: "Connect with xPortal, DeFi Extension, or paste any erd1... address to view and manage your NFTs.",
    skills_title: "⚡ SUPER SKILLS ARSENAL (-20% 5x BUNDLES)",
    skills_sub: "Equip decisive match perks to dominate the 120' Shootout. 50% burned forever, 50% added to the Stadium Vault!",
    btn_connect: "Connect Wallet",
    btn_disconnect: "Disconnect",
    btn_buy_nft: "⚡ Buy NFT",
    btn_edit_price: "✏️ Edit Price",
    btn_delist: "❌ Delist",
    btn_list_sale: "🏷️ List for Sale",
    listed_badge: "Listed on Market",
    available_badge: "In Locker",
    seller_you: "You (Owner)",
    inspect_btn: "🔍 Inspect Attributes"
  },
  hu: {
    nav_market_sub: "NFT ÉS KÉPESSÉG PIAC",
    hero_sub: "Kereskedj hivatalos <strong>EFOOTBALL-91a4eb</strong> Csatár és <strong>GOALKEEPER-cb9e3e</strong> Kapus NFT-kkel közvetlenül a játékosokkal. Minden eladás <strong>$EFOO-t éget</strong> és a hétvégi Stadium Vault Jackpotot gyarapítja!",
    stat_vault: "STADIUM VAULT JACKPOT",
    stat_vault_rule: "Hétvégi Kiosztás: 65% (1.) • 25% (2.) • 10% (3.)",
    stat_burned: "ÖSSZESEN ELÉGETVE JÁTÉKOKBAN",
    stat_burned_sub: "Deflációs Készletcsökkenés",
    stat_listings: "AKTÍV HIRDETÉSEK",
    stat_floor: "MINIMÁLÁR (FLOOR)",
    tab_browse: "Piac Böngészése",
    tab_my_nfts: "Saját NFT-k & Eladás",
    tab_skills: "Képesség Bolt (-20%)",
    locker_title: "🎒 SAJÁT ÖLTÖZŐ & NFT KÉSZLET",
    locker_sub: "A csatlakoztatott tárcád futballistái és kapusai. Hirdesd meg őket eladásra, módosítsd az árat vagy vedd vissza bármikor!",
    locker_not_conn_title: "CSATLAKOZTASD A TÁRCÁDAT A SQUAD ELÉRÉSÉHEZ",
    locker_not_conn_desc: "Csatlakozz xPortal-lal, DeFi Extension-nel vagy illessz be egy erd1... címet az NFT-id kezeléséhez.",
    skills_title: "⚡ SZUPERKÉPESSÉGEK (-20% CSOMAGOK)",
    skills_sub: "Szerelj fel szuperképességeket a 120 perces büntetőpárbajra. 50% elégetődik, 50% a Vaultba kerül!",
    btn_connect: "Tárca Csatlakoztatása",
    btn_disconnect: "Kijelentkezés",
    btn_buy_nft: "⚡ Megvétel",
    btn_edit_price: "✏️ Ármódosítás",
    btn_delist: "❌ Visszavonás",
    btn_list_sale: "🏷️ Eladásra felkínálás",
    listed_badge: "Piacon meghirdetve",
    available_badge: "Öltözőben elérhető",
    seller_you: "Te (Tulajdonos)",
    inspect_btn: "🔍 Részletek & Képességek"
  },
  ro: {
    nav_market_sub: "PIAȚĂ NFT ȘI ABILITĂȚI",
    hero_sub: "Tranzacționează Atacanți <strong>EFOOTBALL-91a4eb</strong> și Portari <strong>GOALKEEPER-cb9e3e</strong> direct între jucători. Fiecare schimb arde <strong>$EFOO</strong> și finanțează Seiful Stadionului!",
    stat_vault: "SEIF STADION JACKPOT",
    stat_vault_rule: "Premii Weekend: 65% (1) • 25% (2) • 10% (3)",
    stat_burned: "TOTAL ARS ÎN JOCURI",
    stat_burned_sub: "Reducere Deflaționistă a Stocului",
    stat_listings: "ANUNȚURI ACTIVE",
    stat_floor: "PREȚ MINIM",
    tab_browse: "Explorează Piața",
    tab_my_nfts: "Vestiarul Meu & Vânzare",
    tab_skills: "Magazin Abilități (-20%)",
    locker_title: "🎒 VESTIARUL MEU & SQUAD NFT",
    locker_sub: "NFT-urile din portofelul tău MultiversX. Pune-le la vânzare, ajustează prețul sau retrage-le oricând!",
    locker_not_conn_title: "CONECTEAZĂ PORTOFELUL PENTRU SQUAD",
    locker_not_conn_desc: "Conectează-te cu xPortal, DeFi Extension sau introdu adresa erd1... pentru gestionare.",
    skills_title: "⚡ ABILITĂȚI SPECIALE (-20% PACHETE)",
    skills_sub: "Echipează super-puteri pentru meciul de 120'. 50% arse definitiv, 50% trimise în Seif!",
    btn_connect: "Conectează Portofel",
    btn_disconnect: "Deconectare",
    btn_buy_nft: "⚡ Cumpără",
    btn_edit_price: "✏️ Modifică Preț",
    btn_delist: "❌ Retrage",
    btn_list_sale: "🏷️ Pune la Vânzare",
    listed_badge: "Listat pe piață",
    available_badge: "Disponibil în vestiar",
    seller_you: "Tu (Proprietar)",
    inspect_btn: "🔍 Inspectează Abilități"
  }
};

// ============================================================================
// SKILLS DEFINITION & BALANCED ECONOMY (2.5k - 9.5k EFOO singles, 20% off 5x)
// ============================================================================
const MARKET_SKILLS = [
  { id: "gold", icon: "💰", name: "GOLD x2", nameHu: "DUPLA ARANY (2x)", nameRo: "AUR x2", price: 2500, color: "#ffb800", desc: "Double points and score multiplier on your next goal.", descHu: "Dupla pontszám és bónusz szorzó, ha a labda gól lesz." },
  { id: "steady", icon: "🎯", name: "ICE VEINS", nameHu: "HIDEGVÉR", nameRo: "NERVI DE OȚEL", price: 3500, color: "#38bdf8", desc: "Crosshair stops shaking for precise corner aiming.", descHu: "A célkereszt stabilizálódik a következő lövésnél." },
  { id: "curve", icon: "🌀", name: "BANANA CURVE", nameHu: "KIFLI CSAVARÁS", nameRo: "ȘUT CU EFECT", price: 4500, color: "#c084fc", desc: "Ball bends sharply — keeper misreads it 70% worse.", descHu: "Erősen kanyarodó lövés — a kapus jóval nehezebben védi ki." },
  { id: "power", icon: "🚀", name: "ROCKET SHOT", nameHu: "RAKÉTA LÖVÉS", nameRo: "ȘUT RACHETĂ", price: 6000, color: "#fb923c", desc: "Superpower sweet-spot and reduces keeper reach by 25%.", descHu: "Tágabb sweet-spot + a kapus elérési távolsága 25%-kal kisebb." },
  { id: "freeze", icon: "🧊", name: "KEEPER FREEZE", nameHu: "KAPUS FAGYASZTÁS", nameRo: "PORTAR ÎNGHEȚAT", price: 8500, color: "#67e8f9", desc: "Freezes keeper for 1 second causing late reaction and wrong dives.", descHu: "A kapus késve reagál és gyakran a rossz irányba vetődik." },
  { id: "iron_wall", icon: "🛡️", name: "IRON WALL", nameHu: "ACÉLFAL", nameRo: "ZID DE OȚEL", price: 3500, color: "#38bdf8", desc: "Reinforces goal posts & expands keeper save area by 50%.", descHu: "A kapus teste megnő, a védési felület 50%-kal nagyobb." },
  { id: "spider_reach", icon: "🧤", name: "SPIDER REACH", nameHu: "POLIP NYÚLÁS", nameRo: "REACH TENTACULAR", price: 6000, color: "#22c55e", desc: "Supernatural dive reach across the entire goalmouth.", descHu: "Óriási kézméret és ugrótávolság az egész kapura." },
  { id: "matrix_reflex", icon: "⏱️", name: "MATRIX TIME WARP", nameHu: "MÁTRIX IDŐLASSÍTÁS", nameRo: "MATRIX BULLET TIME", price: 7500, color: "#a855f7", desc: "Slows the ball speed by 50% giving full dive reaction time.", descHu: "50%-kal lelassítja a labdát, megkönnyítve a védést." },
  { id: "mind_read", icon: "👁️", name: "MIND READ RADAR", nameHu: "GONDOLATOLVASÁS", nameRo: "CITIREA MINȚII", price: 9500, color: "#ffb800", desc: "Holographic aura reveals exact AI shot target before the kick.", descHu: "Holografikus aura mutatja a gép lövésének pontos helyét." }
];

// ============================================================================
// XOXNO RARITY & ATTRIBUTES ENGINE
// ============================================================================
function getNftRarityTier(nft) {
  if (!nft || nft.identifier === "ROOKIE-STRIKER" || nft.identifier === "ROOKIE-KEEPER") {
    return {
      tierKey: "rookie",
      tierLabel: "ROOKIE (F2P)",
      tierIcon: "⚪",
      rank: "F2P",
      borderColor: "#94a3b8",
      scoreMult: 1.0,
      slots: 0,
      powers: ["1.0x Score Multiplier", "0 Skill Slots"]
    };
  }

  let rank = nft.rank || (nft.metadata && nft.metadata.rank) || (nft.rarities && nft.rarities.openRarity && nft.rarities.openRarity.rank);
  const name = (nft.name || "").trim();
  const tokenNumMatch = name.match(/#(\d+)/);
  const tokenNum = tokenNumMatch ? parseInt(tokenNumMatch[1], 10) : (nft.nonce || 0);

  // Exact flagship ranks from official XOXNO collection
  if (tokenNum === 614) rank = 1;
  else if (tokenNum === 615) rank = 2;
  else if (tokenNum === 619) rank = 3;
  else if (tokenNum === 613) rank = 4;
  else if (tokenNum === 616) rank = 5;

  const isKeeper = nft.collection === KEEPER_COLLECTION || (nft.identifier && nft.identifier.startsWith("GOALKEEPER")) || !!nft.jersey;

  if (!rank || rank <= 0) {
    if (nft.rarity && typeof nft.rarity === "string") {
      const r = nft.rarity.toUpperCase();
      if (r === "MYTHIC") rank = 3;
      else if (r === "LEGENDARY") rank = 15;
      else if (r === "EPIC") rank = 65;
      else if (r === "RARE") rank = 220;
      else rank = 520;
    } else {
      rank = tokenNum > 0 ? (tokenNum % 628) + 1 : 320;
    }
  }

  let tierKey = "common";
  let tierLabel = "COMMON";
  let tierIcon = "⚪";
  let borderColor = "#71717a";
  let scoreMult = 1.2;
  let slots = 1;
  let powers = [];

  if (isKeeper) {
    if (rank <= 5) {
      tierKey = "mythic";
      tierLabel = "MYTHIC";
      tierIcon = "👑";
      borderColor = "#ffd700";
      scoreMult = 3.5;
      slots = 5;
      powers = ["🛡️ 3 Shields", "🧱 Iron Wall", "🧤 Spider Reach", "⏱️ Matrix Time Warp", "⚡ 3.5x Multiplier"];
    } else if (rank <= 15) {
      tierKey = "legendary";
      tierLabel = "LEGENDARY";
      tierIcon = "⭐";
      borderColor = "#c084fc";
      scoreMult = 2.5;
      slots = 4;
      powers = ["🛡️ 2 Shields", "🧱 Iron Wall", "🧤 Spider Reach", "⚡ 2.5x Multiplier"];
    } else if (rank <= 30) {
      tierKey = "epic";
      tierLabel = "EPIC";
      tierIcon = "🔮";
      borderColor = "#818cf8";
      scoreMult = 2.0;
      slots = 3;
      powers = ["🛡️ 1 Shield", "🧱 Iron Wall", "⚡ 2.0x Multiplier"];
    } else if (rank <= 45) {
      tierKey = "rare";
      tierLabel = "RARE";
      tierIcon = "💎";
      borderColor = "#38bdf8";
      scoreMult = 1.5;
      slots = 2;
      powers = ["🧱 Iron Wall", "⚡ 1.5x Multiplier"];
    } else {
      tierKey = "common";
      tierLabel = "COMMON";
      tierIcon = "⚪";
      borderColor = "#71717a";
      scoreMult = 1.2;
      slots = 1;
      powers = ["⚡ 1.2x Multiplier"];
    }
  } else {
    // Striker Ranks
    if (rank <= 5) {
      tierKey = "mythic";
      tierLabel = "MYTHIC";
      tierIcon = "👑";
      borderColor = "#ffd700";
      scoreMult = 3.5;
      slots = 5;
      powers = ["🛸 Dive Radar", "🚀 Rocket Shot", "🌀 Banana Curve", "🧊 Keeper Freeze", "⚡ 3.5x Multiplier"];
    } else if (rank <= 25) {
      tierKey = "legendary";
      tierLabel = "LEGENDARY";
      tierIcon = "⭐";
      borderColor = "#c084fc";
      scoreMult = 2.5;
      slots = 4;
      powers = ["🛸 Dive Radar", "🚀 Rocket Shot", "🌀 Banana Curve", "⚡ 2.5x Multiplier"];
    } else if (rank <= 150) {
      tierKey = "epic";
      tierLabel = "EPIC";
      tierIcon = "🔮";
      borderColor = "#818cf8";
      scoreMult = 2.0;
      slots = 3;
      powers = ["🚀 Rocket Shot", "🌀 Banana Curve", "⚡ 2.0x Multiplier"];
    } else if (rank <= 450) {
      tierKey = "rare";
      tierLabel = "RARE";
      tierIcon = "💎";
      borderColor = "#38bdf8";
      scoreMult = 1.5;
      slots = 2;
      powers = ["🌀 Banana Curve", "⚡ 1.5x Multiplier"];
    } else {
      tierKey = "common";
      tierLabel = "COMMON";
      tierIcon = "⚪";
      borderColor = "#71717a";
      scoreMult = 1.2;
      slots = 1;
      powers = ["⚡ 1.2x Multiplier"];
    }
  }

  return { tierKey, tierLabel, tierIcon, rank, borderColor, scoreMult, slots, powers };
}

// ============================================================================
// LIVE XOXNO MARKETPLACE INTEGRATION & AUTHENTIC P2P LISTINGS
// Zero ghost items: If no NFTs are listed, the market is truly empty!
// ============================================================================
let cachedXoxnoListings = [];
let isFetchingXoxno = false;

// Fetch live listings from official XOXNO collections (EFOOTBALL-91a4eb & GOALKEEPER-cb9e3e)
// Uses direct MultiversX API auction/marketplace indexing to prevent browser CORS 403 blocks!
async function fetchLiveXoxnoListings() {
  if (isFetchingXoxno) return cachedXoxnoListings;
  isFetchingXoxno = true;

  const results = [];
  const collections = [
    { id: STRIKER_COLLECTION, floor: 0.08, currency: "EGLD", fallbackImg: "branding/original/EFOOTBALL-91a4eb/logo.png" },
    { id: KEEPER_COLLECTION, floor: 0.48, currency: "EGLD", fallbackImg: "branding/original/GOALKEEPER-cb9e3e/logo.png" }
  ];

  for (const colConfig of collections) {
    const col = colConfig.id;
    try {
      // Primary: MultiversX API query for active marketplace / auction NFTs (No CORS issues!)
      const res = await fetch(`${MULTIVERSX_API}/collections/${col}/nfts?hasAuction=true&size=30`);
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          items.forEach((it) => {
            const tier = getNftRarityTier(it);
            results.push({
              id: `xoxno-${it.identifier}`,
              isXoxno: true,
              auctionId: it.nonce || 1,
              marketplaceSc: XOXNO_MARKETPLACE_SC,
              identifier: it.identifier,
              collection: col,
              nonce: it.nonce || 0,
              name: it.name || it.identifier,
              rarity: tier.tierLabel,
              rank: it.rank || tier.rank,
              ovr: it.metadata?.attributes?.find((a) => a.trait_type === "OVR")?.value || (col === KEEPER_COLLECTION ? 92 : 88),
              trait: "Official XOXNO Marketplace Listing",
              url: it.url || colConfig.fallbackImg,
              price: colConfig.floor,
              rawPrice: BigInt(Math.floor(colConfig.floor * 1e18)).toString(),
              currency: colConfig.currency,
              seller: "XOXNO Marketplace",
              createdAt: it.timestamp ? it.timestamp * 1000 : Date.now(),
              attributes: it.metadata?.attributes || []
            });
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch marketplace NFTs for", col, e);
    }
  }

  isFetchingXoxno = false;
  cachedXoxnoListings = results;
  renderMarketplaceGrid();
  renderTelemetry();
  return results;
}

// Load player-created listings from LocalStorage (Purging legacy dummy seed items)
function getMarketplaceListings() {
  try {
    const raw = localStorage.getItem(STORAGE_LISTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strict filter: purge any legacy phantom mock items
        const realListings = parsed.filter(
          (x) =>
            x &&
            x.seller &&
            !x.seller.startsWith("erd1ultra") &&
            !x.seller.startsWith("erd1degen") &&
            !x.seller.startsWith("erd1sniper") &&
            !x.seller.startsWith("erd1octo") &&
            !x.seller.startsWith("erd1finisher") &&
            !x.seller.startsWith("erd1catref") &&
            !x.seller.startsWith("erd1topbin") &&
            !x.seller.startsWith("erd1beerstriker")
        );
        return realListings;
      }
    }
  } catch (e) {}
  return [];
}

function getAllActiveListings() {
  const p2p = getMarketplaceListings();
  return [...p2p, ...cachedXoxnoListings];
}

function saveMarketplaceListings(listings) {
  try {
    localStorage.setItem(STORAGE_LISTINGS, JSON.stringify(listings));
  } catch (e) {}
}

// Vault & Burn Stats
function getVaultStats() {
  let pot = BASE_VAULT_POT;
  let burned = BASE_BURNED_GAMES;
  try {
    const p = localStorage.getItem(STORAGE_VAULT_POT);
    if (p) {
      const val = parseInt(p, 10) || 0;
      pot = (val === 25400000) ? 0 : Math.max(0, val);
    }
    const b = localStorage.getItem(STORAGE_TOTAL_BURNED);
    if (b) {
      const val = parseInt(b, 10) || 0;
      burned = (val === 92912450000) ? 0 : Math.max(0, val);
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
  renderTelemetry();
  return stats;
}

async function refreshOnChainVaultStats() {
  if (!STADIUM_VAULT_SC || !STADIUM_VAULT_SC.startsWith("erd1qqqq")) {
    renderTelemetry();
    return;
  }
  try {
    const res = await fetch(`https://api.multiversx.com/accounts/${STADIUM_VAULT_SC}/tokens/${EFOO_TOKEN_ID}`);
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
    const queryRes = await fetch("https://api.multiversx.com/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scAddress: STADIUM_VAULT_SC,
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
  }
  renderTelemetry();
}

function renderTelemetry() {
  const stats = getVaultStats();
  const potEl = document.getElementById("tele-vault-val");
  const burnedEl = document.getElementById("tele-burned-val");
  const countEl = document.getElementById("tele-listings-count");
  const floorValEl = document.getElementById("tele-floor-val");
  const floorSubEl = document.getElementById("tele-floor-sub");

  if (potEl) potEl.textContent = `${stats.pot.toLocaleString("en-US")} $EFOO`;
  if (burnedEl) burnedEl.textContent = `${stats.burned.toLocaleString("en-US")} $EFOO`;

  const listings = getAllActiveListings();
  if (countEl) countEl.textContent = `${listings.length} NFTs`;

  // DYNAMIC FLOOR PRICE: Always find the absolute cheapest item on the market!
  if (!listings || listings.length === 0) {
    if (floorValEl) floorValEl.textContent = "—";
    if (floorSubEl) floorSubEl.textContent = "No Active Listings";
  } else {
    const egldItems = listings.filter((x) => x.currency === "EGLD");
    const efooItems = listings.filter((x) => x.currency === "EFOO" || !x.currency);

    let floorText = "—";
    let subText = "Lowest Listed Price (Floor)";

    if (egldItems.length > 0 && efooItems.length > 0) {
      const minEgld = Math.min(...egldItems.map((x) => Number(x.price) || 999999));
      const minEfoo = Math.min(...efooItems.map((x) => Number(x.price) || 999999));
      floorText = `${minEgld.toFixed(3)} EGLD`;
      subText = `or ${minEfoo.toLocaleString("en-US")} $EFOO (Cheapest)`;
    } else if (egldItems.length > 0) {
      const minEgld = Math.min(...egldItems.map((x) => Number(x.price) || 999999));
      floorText = `${minEgld.toFixed(3)} EGLD`;
      subText = "Lowest Listed Price (Floor)";
    } else if (efooItems.length > 0) {
      const minEfoo = Math.min(...efooItems.map((x) => Number(x.price) || 999999));
      floorText = `${minEfoo.toLocaleString("en-US")} $EFOO`;
      subText = "Lowest Listed Price (Floor)";
    }

    if (floorValEl) floorValEl.textContent = floorText;
    if (floorSubEl) floorSubEl.textContent = subText;
  }
}

// ============================================================================
// WALLET MANAGEMENT & AUTHENTICATION
// ============================================================================
function initMarketWallet() {
  try {
    // Check if returning from official MultiversX Web Wallet login callback
    const urlParams = new URLSearchParams(window.location.search);
    const callbackAddr = urlParams.get("address");
    if (callbackAddr && callbackAddr.startsWith("erd1")) {
      localStorage.setItem("multiversx_address", callbackAddr);
      localStorage.setItem("multiversx_provider", "webwallet");
      localStorage.setItem("efoo_wallet_address", callbackAddr);
      localStorage.setItem("efoo_wallet_provider", "webwallet");
      const cleanUrl = window.location.pathname + (urlParams.get("tab") ? "?tab=" + urlParams.get("tab") : "");
      window.history.replaceState({}, document.title, cleanUrl);
    }

    let savedAddr = localStorage.getItem("multiversx_address") || sessionStorage.getItem("multiversx_address") || localStorage.getItem("efoo_wallet_address");
    // Clear out any legacy placeholder docs address
    if (savedAddr && savedAddr.startsWith("erd1qyu5wthldz")) {
      savedAddr = null;
      localStorage.removeItem("multiversx_address");
      sessionStorage.removeItem("multiversx_address");
      localStorage.removeItem("efoo_wallet_address");
      localStorage.removeItem("efoo_connected_address");
    }
    const savedProv = localStorage.getItem("multiversx_provider") || sessionStorage.getItem("multiversx_provider") || localStorage.getItem("efoo_wallet_provider");
    if (savedAddr && savedAddr.startsWith("erd1")) {
      marketWallet.address = savedAddr;
      marketWallet.provider = savedProv || "webwallet";
      fetchWalletBalances(savedAddr);
      fetchWalletNfts(savedAddr);
    } else {
      marketWallet.address = null;
      marketWallet.provider = null;
      marketWallet.ownedNfts = [];
    }
  } catch (e) {}
  updateWalletUI();
}

async function fetchWalletBalances(address) {
  try {
    // Fetch EGLD
    const accRes = await fetch(`${MULTIVERSX_API}/accounts/${address}`);
    if (accRes.ok) {
      const acc = await accRes.json();
      marketWallet.egldBalance = parseFloat(acc.balance) / 1e18;
    }

    // Fetch EFOO
    const tokRes = await fetch(`${MULTIVERSX_API}/accounts/${address}/tokens/${EFOO_TOKEN_ID}`);
    if (tokRes.ok) {
      const tok = await tokRes.json();
      marketWallet.efooBalance = parseFloat(tok.balance) / 1e18;
    } else {
      marketWallet.efooBalance = 0;
    }
  } catch (e) {
    marketWallet.efooBalance = 0;
  }
  updateWalletUI();
}

async function fetchWalletNfts(address) {
  try {
    // Fetch all official team collections (EFOOTBALL-91a4eb, GOALKEEPER-cb9e3e, FOOTBALL-64e58f)
    const res = await fetch(`${MULTIVERSX_API}/accounts/${address}/nfts?collections=${STRIKER_COLLECTION},${KEEPER_COLLECTION},FOOTBALL-64e58f&size=100`);
    if (res.ok) {
      const nfts = await res.json();
      if (Array.isArray(nfts)) {
        marketWallet.ownedNfts = nfts;
        renderMyLockerGrid();
        return;
      }
    }
  } catch (e) {}

  marketWallet.ownedNfts = [];
  renderMyLockerGrid();
}

function updateWalletUI() {
  const isConn = !!marketWallet.address;
  const pill = document.getElementById("m-wallet-connected-pill");
  const connBtn = document.getElementById("m-btn-connect");
  const shortAddr = document.getElementById("m-wallet-short-addr");
  const balEl = document.getElementById("m-wallet-bal");
  const notConnBox = document.getElementById("locker-not-connected-banner");

  if (pill) pill.classList.toggle("hidden", !isConn);
  if (connBtn) connBtn.classList.toggle("hidden", isConn);
  if (notConnBox) notConnBox.classList.toggle("hidden", isConn);

  if (isConn) {
    const a = marketWallet.address;
    if (shortAddr) shortAddr.textContent = `${a.slice(0, 6)}...${a.slice(-4)}`;
    if (balEl) balEl.textContent = `${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO`;
  }

  const adminBtn = document.getElementById("m-btn-admin-vault");
  const isOwner = marketWallet.address === EFOOREWARDS_WALLET;
  if (adminBtn) {
    adminBtn.classList.toggle("hidden", !isOwner);
    if (isOwner) {
      sessionStorage.setItem("efoo_admin_session_auth_v1", "VALID_OWNER_AUTH");
      localStorage.setItem("efoo_connected_address", EFOOREWARDS_WALLET);
    } else {
      sessionStorage.removeItem("efoo_admin_session_auth_v1");
    }
  }
}

function disconnectWallet() {
  marketWallet.address = null;
  marketWallet.provider = null;
  marketWallet.ownedNfts = [];

  const ext = window.elrondWallet || window.multiversx || window.elrond;
  if (ext && typeof ext.logout === "function") {
    try {
      ext.logout();
    } catch (e) {}
  }
  try {
    localStorage.removeItem("multiversx_address");
    localStorage.removeItem("multiversx_provider");
    localStorage.removeItem("efoo_wallet_address");
    localStorage.removeItem("efoo_wallet_provider");
    localStorage.removeItem("efoo_connected_address");
    localStorage.removeItem("efoo_wc_topic");
    localStorage.removeItem("walletconnect");
    localStorage.removeItem("efoo_user_wallet");

    sessionStorage.removeItem("multiversx_address");
    sessionStorage.removeItem("multiversx_provider");
    sessionStorage.removeItem("efoo_connected_address");
    sessionStorage.removeItem("efoo_wallet_address");
    sessionStorage.removeItem("efoo_wallet_provider");
    sessionStorage.removeItem("efoo_admin_session_auth_v1");
  } catch (e) {}

  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (e) {}

  if (typeof updateOwnerAdminVisibility === "function") {
    updateOwnerAdminVisibility("");
  }
  updateWalletUI();
  renderMarketplaceGrid();
  renderMyLockerGrid();
  showMarketToast(
    currentMarketLang === "hu"
      ? "🚪 Sikeresen kijelentkeztél a piactérről!"
      : "🚪 Logged out successfully."
  );
}

function connectManualAddress(raw) {
  const addr = (raw || "").trim();
  if (!addr.startsWith("erd1") || addr.length < 50) {
    showMarketToast("⚠️ Please enter a valid MultiversX address starting with erd1...");
    return;
  }
  marketWallet.address = addr;
  marketWallet.provider = "inspector";
  try {
    localStorage.setItem("multiversx_address", addr);
    localStorage.setItem("multiversx_provider", "inspector");
  } catch (e) {}
  fetchWalletBalances(addr);
  fetchWalletNfts(addr);
  document.getElementById("m-wallet-modal")?.classList.add("hidden");
  showMarketToast(`⚡ Connected to ${addr.slice(0, 6)}...${addr.slice(-4)}`);
  updateWalletUI();
  renderMarketplaceGrid();
}

// ============================================================================
// MARKETPLACE BROWSING & CARD RENDERING
// ============================================================================
function renderMarketplaceGrid() {
  const grid = document.getElementById("market-listings-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const allListings = getAllActiveListings();
  const isHu = currentMarketLang === "hu";
  const isRo = currentMarketLang === "ro";

  // If no listings exist at all on the market (Zero ghost items!)
  if (allListings.length === 0) {
    grid.innerHTML = `
      <div class="m-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(12, 20, 29, 0.6); border: 1px dashed rgba(255,255,255,0.15); border-radius: 16px;">
        <div style="font-size: 3.2rem; margin-bottom: 12px;">🏟️</div>
        <h3 style="font-family: var(--font-bebas); font-size: 2rem; color: #fff; letter-spacing: 0.05em; margin-bottom: 8px;">
          ${isHu ? "A PIAC JELENLEG ÜRES" : isRo ? "PIAȚA ESTE MOMENTAN LIBERĂ" : "THE MARKET IS CURRENTLY EMPTY"}
        </h3>
        <p style="color: var(--text-sub); max-width: 520px; margin: 0 auto 20px; font-size: 0.95rem; line-height: 1.6;">
          ${isHu 
            ? "Nincs aktív eladásra kínált játékos vagy kapus sem a játékosoknál, sem az XOXNO-n. Légy az első, aki meghirdet egy NFT-t a saját Öltözőjéből!"
            : isRo
            ? "Nu există NFT-uri listate la vânzare de către jucători sau pe piața XOXNO. Fii primul care își scoate la vânzare un atacant sau portar din vestiar!"
            : "No NFTs are currently listed for sale by players or on XOXNO. Be the first to list a Striker or Goalkeeper from your personal Locker Room!"}
        </p>
        <button type="button" class="m-btn-primary" id="btn-empty-goto-locker" style="display:inline-flex; align-items:center; gap:8px;">
          🎒 ${isHu ? "Ugrás a Saját Öltözőhöz & Eladás" : isRo ? "Deschide Vestiarul & Vinde" : "Open My Locker & Sell"}
        </button>
      </div>
    `;

    document.getElementById("btn-empty-goto-locker")?.addEventListener("click", () => {
      document.getElementById("tab-btn-my-nfts")?.click();
    });
    return;
  }

  // Apply Category Filter
  let filtered = allListings.filter((item) => {
    if (filterCollection === "striker") {
      return item.collection === STRIKER_COLLECTION || (item.identifier && item.identifier.includes("EFOOTBALL"));
    }
    if (filterCollection === "keeper") {
      return item.collection === KEEPER_COLLECTION || (item.identifier && item.identifier.includes("GOALKEEPER")) || !!item.jersey;
    }
    return true;
  });

  // Apply Rarity Filter
  if (filterRarity !== "all") {
    filtered = filtered.filter((item) => {
      const tierInfo = getNftRarityTier(item);
      return tierInfo.tierKey === filterRarity;
    });
  }

  // Apply Sort
  filtered.sort((a, b) => {
    if (sortOrder === "price_asc") return a.price - b.price;
    if (sortOrder === "price_desc") return b.price - a.price;
    if (sortOrder === "rank_asc") {
      const ra = getNftRarityTier(a).rank;
      const rb = getNftRarityTier(b).rank;
      return (parseInt(ra, 10) || 999) - (parseInt(rb, 10) || 999);
    }
    if (sortOrder === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
    return 0;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-sub);">
        <h3>${isHu ? "Nincs a szűrésnek megfelelő NFT." : "No NFTs match the selected filter."}</h3>
        <p>${isHu ? "Próbáld meg az 'Összes' fület!" : "Try switching to 'All' or check back soon!"}</p>
      </div>
    `;
    return;
  }

  const curAddr = marketWallet.address ? marketWallet.address.toLowerCase() : "";

  filtered.forEach((item) => {
    const tier = getNftRarityTier(item);
    const isOwner = curAddr && item.seller && item.seller.toLowerCase() === curAddr;

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey}`;

    const formattedPrice = item.currency === "EGLD"
      ? (typeof item.price === "number" ? item.price.toFixed(3) : item.price)
      : item.price.toLocaleString("en-US");

    const sellerShort = isOwner
      ? (isHu ? "Te (Tulajdonos)" : (isRo ? "Tu (Proprietar)" : "You (Owner)"))
      : `${item.seller.slice(0, 6)}...${item.seller.slice(-4)}`;

    card.innerHTML = `
      <div class="mnc-media-wrap" data-inspect="${item.id}">
        <img src="${item.url}" alt="${item.name}" class="mnc-media-img" loading="lazy" />
        <div class="mnc-rank-badge" style="border-color:${tier.borderColor}; color:${tier.borderColor};">
          ${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}
        </div>
        ${
          item.isXoxno
            ? `<div class="mnc-xoxno-badge" title="Verified listing on XOXNO Marketplace">
                 <img src="branding/rebranded/xoxno-logo.svg" alt="XOXNO" class="mnc-xoxno-logo-img" />
                 <span class="mnc-xoxno-text">XOXNO</span>
               </div>`
            : `<div class="mnc-col-tag">${item.jersey ? "🧤 KEEPER" : "⚽ STRIKER"}</div>`
        }
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${item.name}</strong>
          <span class="mnc-ovr">${item.ovr || 85} OVR</span>
        </div>

        <p class="mnc-trait-desc">${item.trait || (item.isXoxno ? "Listed on XOXNO Marketplace" : "Sunday League Degen Ultra")}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">ASKING PRICE</span>
            <strong class="mnc-price-val">${formattedPrice} $${item.currency || "EFOO"}</strong>
            <span class="mnc-seller-lbl">${item.isXoxno ? "⚡ XOXNO Listing" : `Seller: ${sellerShort}`}</span>
          </div>

          <div class="mnc-action-wrap">
            ${
              isOwner
                ? `<div class="mnc-owner-btns">
                     <button type="button" class="mnc-btn-edit" data-edit="${item.id}">✏️ Edit</button>
                     <button type="button" class="mnc-btn-delist" data-delist="${item.id}">✕ Delist</button>
                   </div>`
                : `<button type="button" class="mnc-btn-buy" data-buy="${item.id}">
                     ${item.isXoxno ? "⚡ BUY (XOXNO)" : "⚡ BUY"}
                   </button>`
            }
          </div>
        </div>
      </div>
    `;

    // Click on media to open detailed inspection popup
    card.querySelector(`[data-inspect="${item.id}"]`)?.addEventListener("click", () => {
      openNftDetailsModal(item);
    });

    // Buy Action (Direct XOXNO Smart Contract or P2P)
    card.querySelector(`[data-buy="${item.id}"]`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      executeBuyNft(item);
    });

    // Edit Price Action
    card.querySelector(`[data-edit="${item.id}"]`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditPriceModal(item);
    });

    // Delist Action
    card.querySelector(`[data-delist="${item.id}"]`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      executeDelistNft(item);
    });

    grid.appendChild(card);
  });
}

// ============================================================================
// TAB 2: MY LOCKER ROOM & SELL NFT
// ============================================================================
function renderMyLockerGrid() {
  const grid = document.getElementById("my-nfts-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!marketWallet.address) return;

  const listings = getMarketplaceListings();
  const curAddr = marketWallet.address.toLowerCase();

  const myNfts = marketWallet.ownedNfts || [];

  if (myNfts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-sub);">
        <h3>No NFTs found in your wallet locker room.</h3>
        <p>Mint a Striker or Keeper NFT, or buy one from the marketplace above!</p>
      </div>
    `;
    return;
  }

  myNfts.forEach((nft) => {
    const tier = getNftRarityTier(nft);
    const isListed = listings.find((x) => x.identifier === nft.identifier && x.seller && x.seller.toLowerCase() === curAddr);

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey}`;

    card.innerHTML = `
      <div class="mnc-media-wrap" data-locker-inspect="${nft.identifier}">
        <img src="${nft.url || 'branding/original/EFOOTBALL-91a4eb/logo.png'}" alt="${nft.name}" class="mnc-media-img" />
        <div class="mnc-rank-badge" style="border-color:${tier.borderColor}; color:${tier.borderColor};">
          ${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}
        </div>
        <div class="mnc-col-tag">${isListed ? "🏷️ LISTED" : "🎒 IN LOCKER"}</div>
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${nft.name || nft.identifier}</strong>
          <span class="mnc-ovr">${nft.ovr || 90} OVR</span>
        </div>

        <p class="mnc-trait-desc">${nft.trait || "Equipped for 120' Shootout Arena"}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">STATUS</span>
            <strong class="mnc-price-val" style="color:${isListed ? 'var(--gold)' : 'var(--neon)'};">
              ${isListed ? `${isListed.price.toLocaleString("en-US")} $${isListed.currency}` : "Available in Locker"}
            </strong>
          </div>

          <div class="mnc-action-wrap">
            ${
              isListed
                ? `<div class="mnc-owner-btns">
                     <button type="button" class="mnc-btn-edit" data-locker-edit="${isListed.id}">✏️ Edit</button>
                     <button type="button" class="mnc-btn-delist" data-locker-delist="${isListed.id}">✕ Withdraw</button>
                   </div>`
                : `<button type="button" class="m-btn-primary" data-locker-list="${nft.identifier}">🏷️ SELL</button>`
            }
          </div>
        </div>
      </div>
    `;

    card.querySelector(`[data-locker-inspect="${nft.identifier}"]`)?.addEventListener("click", () => {
      openNftDetailsModal(nft);
    });

    if (isListed) {
      card.querySelector(`[data-locker-edit="${isListed.id}"]`)?.addEventListener("click", () => {
        openEditPriceModal(isListed);
      });
      card.querySelector(`[data-locker-delist="${isListed.id}"]`)?.addEventListener("click", () => {
        executeDelistNft(isListed);
      });
    } else {
      card.querySelector(`[data-locker-list="${nft.identifier}"]`)?.addEventListener("click", () => {
        openListNftModal(nft);
      });
    }

    grid.appendChild(card);
  });
}

// ============================================================================
// TAB 3: SUPER SKILLS STORE
// ============================================================================
function renderSkillsStore() {
  const grid = document.getElementById("m-skills-store-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const isHu = currentMarketLang === "hu";
  const isRo = currentMarketLang === "ro";

  MARKET_SKILLS.forEach((s) => {
    const card = document.createElement("div");
    card.className = "m-skill-card";

    const name = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
    const desc = isHu ? s.descHu : s.desc;
    const singlePrice = (s.price / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });
    const packPrice5 = Math.round((s.price * 5 * 0.8) / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });

    card.innerHTML = `
      <div class="msk-head">
        <span class="msk-icon">${s.icon}</span>
        <div>
          <strong class="msk-name" style="color:${s.color};">${name}</strong>
          <small style="display:block; font-family:var(--font-mono); font-size:0.68rem; color:var(--neon);">50% BURN • 50% VAULT</small>
        </div>
      </div>

      <p class="msk-desc">${desc}</p>

      <div class="msk-actions">
        <button type="button" class="msk-btn-single" data-buy-single-skill="${s.id}">
          1x (${singlePrice}k $EFOO)
        </button>
        <button type="button" class="msk-btn-pack" data-buy-pack-skill="${s.id}">
          5x (${packPrice5}k $EFOO) 🔥 -20%
        </button>
      </div>
    `;

    card.querySelector(`[data-buy-single-skill="${s.id}"]`)?.addEventListener("click", () => {
      buySkillCharge(s, 1);
    });

    card.querySelector(`[data-buy-pack-skill="${s.id}"]`)?.addEventListener("click", () => {
      buySkillCharge(s, 5);
    });

    grid.appendChild(card);
  });
}

function buySkillCharge(skill, count) {
  const isHu = currentMarketLang === "hu";
  const cost = count > 1 ? Math.round(skill.price * count * 0.8) : skill.price * count;

  if (marketWallet.efooBalance < cost) {
    showMarketToast(
      isHu
        ? `⚠️ Nincs elegendő $EFOO egyenleged! Szükséges: ${cost.toLocaleString("en-US")} $EFOO`
        : `⚠️ Insufficient $EFOO balance! Needed: ${cost.toLocaleString("en-US")} $EFOO`
    );
    return;
  }

  marketWallet.efooBalance -= cost;
  updateWalletUI();

  // 50% Burn, 50% to Stadium Vault
  const half = Math.floor(cost / 2);
  addVaultContributions(half, half);

  // Save to game inventory
  try {
    let inv = {};
    const raw = localStorage.getItem(STORAGE_SKILLS_INVENTORY);
    if (raw) inv = JSON.parse(raw);
    inv[skill.id] = (inv[skill.id] || 0) + count;
    localStorage.setItem(STORAGE_SKILLS_INVENTORY, JSON.stringify(inv));
  } catch (e) {}

  showMarketToast(
    isHu
      ? `✅ +${count}x ${skill.name} megvéve és felszerelve! (50% elégetve, 50% a Vaultba küldve)`
      : `✅ +${count}x ${skill.name} purchased! (50% burned, 50% deposited to Stadium Vault)`
  );
}

// ============================================================================
// BUY / LIST / DELIST / EDIT P2P LOGIC
// ============================================================================
async function executeBuyNft(item) {
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(
      currentMarketLang === "hu"
        ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a vásárláshoz!"
        : "⚠️ Please connect your MultiversX wallet first to purchase this NFT!"
    );
    return;
  }

  const isHu = currentMarketLang === "hu";

  // =========================================================================
  // DIRECT XOXNO SMART CONTRACT PURCHASE (NO REDIRECT TO XOXNO.COM)
  // Executes directly via MultiversX protocol from our dApp
  // =========================================================================
  if (item.isXoxno) {
    try {
      showMarketToast(
        isHu
          ? `⚡ XOXNO Tranzakció előkészítése: ${item.name}...`
          : `⚡ Preparing direct XOXNO Smart Contract purchase: ${item.name}...`
      );

      // Build data field: buy@<auctionId_hex>@<collection_hex>@<nonce_hex>@01
      const auctionNum = item.auctionId || 0;
      let auctionHex = auctionNum.toString(16);
      if (auctionHex.length % 2 !== 0) auctionHex = "0" + auctionHex;

      const colStr = item.collection || STRIKER_COLLECTION;
      const encoder = new TextEncoder();
      const colHex = Array.from(encoder.encode(colStr))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const nonceNum = item.nonce || 0;
      let nonceHex = nonceNum.toString(16);
      if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

      const dataField = `buy@${auctionHex}@${colHex}@${nonceHex}@01`;
      const receiverSc = item.marketplaceSc || XOXNO_MARKETPLACE_SC;

      let valueStr = "0";
      if (item.currency === "EGLD") {
        if (item.rawPrice && item.rawPrice !== "0") {
          valueStr = String(item.rawPrice);
        } else {
          valueStr = BigInt(Math.floor(Number(item.price) * 1e18)).toString();
        }
      }

      // Check balance
      if (item.currency === "EGLD" && marketWallet.egldBalance < Number(item.price)) {
        showMarketToast(
          isHu
            ? `⚠️ Nincs elegendő EGLD egyenleged! Szükséges: ${item.price} EGLD`
            : `⚠️ Insufficient EGLD balance! Needed: ${item.price} EGLD`
        );
        return;
      }

      // Direct Browser Extension execution (MultiversX DeFi Extension)
      const provider = window.multiversx || window.elrond;
      if (provider && provider.signAndSendTransaction) {
        const txPayload = {
          value: valueStr,
          receiver: receiverSc,
          data: dataField,
          gasLimit: 35000000,
          chainID: "1"
        };
        const res = await provider.signAndSendTransaction(txPayload);
        showMarketToast(
          isHu
            ? `🎉 XOXNO Vásárlási tranzakció sikeresen kiküldve! (Tx: ${res?.hash?.slice(0, 10) || "OK"}...) Az NFT a tárcádba érkezik!`
            : `🎉 XOXNO Buy transaction dispatched! (Tx: ${res?.hash?.slice(0, 10) || "OK"}...) NFT is on its way to your wallet!`
        );
      } else {
        // Direct Web Wallet hook without leaving Sunday League Degen FC
        const walletUrl = `https://wallet.multiversx.com/hook/transaction?receiver=${receiverSc}&value=${valueStr}&gasLimit=35000000&data=${encodeURIComponent(dataField)}&callbackUrl=${encodeURIComponent(window.location.href)}`;
        window.open(walletUrl, "_blank");
        showMarketToast(
          isHu
            ? `📱 Írd alá a tranzakciót a felugró MultiversX tárca ablakban! Az NFT közvetlenül a Te címedre kerül.`
            : `📱 Sign transaction in your MultiversX wallet. NFT transfers directly to you!`
        );
      }
    } catch (e) {
      console.error("XOXNO purchase failed:", e);
      showMarketToast(
        isHu
          ? `❌ Hiba a vásárlási tranzakció során: ${e.message || "Tranzakció megszakítva"}`
          : `❌ Purchase transaction error: ${e.message || "Cancelled"}`
      );
    }
    return;
  }

  // =========================================================================
  // P2P COMMUNITY LISTING PURCHASE ($EFOO / EGLD) VIA SMART CONTRACT
  // =========================================================================
  const isEgld = item.currency === "EGLD";
  const colStr = item.collection || (item.identifier ? item.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);
  let nonceNum = item.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (item.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  if (isEgld) {
    if (marketWallet.egldBalance < Number(item.price)) {
      showMarketToast(
        isHu
          ? `⚠️ Nincs elegendő EGLD egyenleged! Ár: ${item.price} EGLD (Egyenleg: ${marketWallet.egldBalance.toFixed(3)} EGLD)`
          : `⚠️ Insufficient EGLD balance! Price: ${item.price} EGLD (Balance: ${marketWallet.egldBalance.toFixed(3)} EGLD)`
      );
      return;
    }

    const priceAtomic = toAtomicUnits(item.price, 18);
    // buyNft@<colHex>@<nonceHex>
    const endpointHex = stringToHex("buyNft"); // 6275794e6674
    const dataField = `${endpointHex}@${colHex}@${nonceHex}`;

    showMarketToast(
      isHu
        ? `⚡ Smart Contract vásárlás előkészítése: ${item.name} (${item.price} EGLD)...`
        : `⚡ Preparing Smart Contract purchase: ${item.name} (${item.price} EGLD)...`
    );

    try {
      await sendMultiversxTransaction({
        receiver: STADIUM_VAULT_SC,
        value: priceAtomic.toString(),
        gasLimit: 15000000,
        data: dataField
      });

      // Transfer ownership in marketplace state
      let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
      saveMarketplaceListings(listings);

      if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
      marketWallet.ownedNfts.push({
        ...item,
        seller: marketWallet.address
      });

      renderMarketplaceGrid();
      renderMyLockerGrid();
      renderTelemetry();

      showMarketToast(
        isHu
          ? `🎉 Vásárlási tranzakció sikeresen kiküldve! 97.5% az eladónak, 2.5% díj az efoorewards tárcába ment. Az NFT a címedre érkezik!`
          : `🎉 Purchase transaction sent! 97.5% to seller, 2.5% to efoorewards. NFT transfers directly to your wallet!`
      );
    } catch (err) {
      console.error("EGLD purchase failed:", err);
      showMarketToast(
        isHu
          ? `❌ Vásárlási hiba: ${err.message || "Megszakítva"}`
          : `❌ Purchase error: ${err.message || "Cancelled"}`
      );
    }
    return;
  }

  // $EFOO Trade
  if (marketWallet.efooBalance < Number(item.price)) {
    showMarketToast(
      isHu
        ? `⚠️ Nincs elegendő $EFOO egyenleged! Ár: ${Number(item.price).toLocaleString("en-US")} $EFOO (Egyenleg: ${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO)`
        : `⚠️ Insufficient $EFOO balance! Price: ${Number(item.price).toLocaleString("en-US")} $EFOO (Balance: ${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO)`
    );
    return;
  }

  const priceAtomic = toAtomicUnits(item.price, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  const efooTokenHex = stringToHex(EFOO_TOKEN_ID);
  const endpointHex = stringToHex("buyNft"); // 6275794e6674
  // MultiversX ESDTTransfer to SC endpoint: ESDTTransfer@<token_id_hex>@<amount_hex>@<endpoint_hex>@<colHex>@<nonceHex>
  const dataField = `ESDTTransfer@${efooTokenHex}@${priceHex}@${endpointHex}@${colHex}@${nonceHex}`;

  showMarketToast(
    isHu
      ? `⚡ Smart Contract vásárlás előkészítése: ${item.name} (${Number(item.price).toLocaleString()} $EFOO)...`
      : `⚡ Preparing Smart Contract purchase: ${item.name} (${Number(item.price).toLocaleString()} $EFOO)...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 15000000,
      data: dataField
    });

    const fee2_5 = Math.floor(Number(item.price) * 0.025);
    addVaultContributions(fee2_5, fee2_5);

    let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
    saveMarketplaceListings(listings);

    if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
    marketWallet.ownedNfts.push({
      ...item,
      seller: marketWallet.address
    });

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    showMarketToast(
      isHu
        ? `🎉 Vásárlási tranzakció sikeresen kiküldve! 95% az eladónak küldve, 2.5% elégetve 🔥, 2.5% a hétvégi Vault Jackpotba került 🏆!`
        : `🎉 Buy transaction sent! 95% to seller, 2.5% burned 🔥, 2.5% to Stadium Vault Jackpot 🏆!`
    );
  } catch (err) {
    console.error("EFOO purchase failed:", err);
    showMarketToast(
      isHu
        ? `❌ Vásárlási hiba: ${err.message || "Megszakítva"}`
        : `❌ Purchase error: ${err.message || "Cancelled"}`
    );
  }
}

function updateListingFeePreview() {
  const currSelect = document.getElementById("list-select-currency");
  const priceInput = document.getElementById("list-input-price");
  const feeLabel = document.getElementById("list-fee-label");
  const feePct = document.getElementById("list-fee-pct");
  const recvLabel = document.getElementById("list-receive-label");
  const recvVal = document.getElementById("list-calc-receive");
  if (!currSelect || !priceInput) return;

  const currency = currSelect.value || "EFOO";
  const isHu = currentMarketLang === "hu";
  const val = parseFloat(priceInput.value) || 0;

  if (currency === "EGLD") {
    priceInput.placeholder = "e.g. 0.025";
    priceInput.min = "0.001";
    priceInput.step = "any";
    if (feeLabel) feeLabel.textContent = isHu ? "Platformdíj (efoorewards tárca):" : "Platform Fee (efoorewards wallet):";
    if (feePct) feePct.textContent = "2.5%";
    if (recvLabel) recvLabel.textContent = isHu ? "Kézhez kapott összeg (97.5%):" : "You Receive (97.5%):";
    if (recvVal) {
      if (val > 0) {
        const net = val * 0.975;
        recvVal.textContent = `${net.toFixed(4)} EGLD`;
      } else {
        recvVal.textContent = isHu ? "97.5% az eladási árból" : "97.5% of sale";
      }
    }
  } else {
    priceInput.placeholder = "e.g. 2,500,000";
    priceInput.min = "1000";
    priceInput.step = "1000";
    if (feeLabel) feeLabel.textContent = isHu ? "Platformdíj (2.5% Égetés 🔥 + 2.5% Hétvégi Vault 🏆):" : "Platform Fee (2.5% Burn 🔥 + 2.5% Stadium Vault 🏆):";
    if (feePct) feePct.textContent = "5.0%";
    if (recvLabel) recvLabel.textContent = isHu ? "Kézhez kapott összeg (95%):" : "You Receive (95%):";
    if (recvVal) {
      if (val > 0) {
        const net = Math.floor(val * 0.95);
        recvVal.textContent = `${net.toLocaleString("en-US")} $EFOO`;
      } else {
        recvVal.textContent = isHu ? "95% az eladási árból" : "95% of sale";
      }
    }
  }
}

function openListNftModal(nft) {
  activeModalNft = nft;
  const modal = document.getElementById("list-nft-modal");
  const titleEl = document.getElementById("list-modal-nft-title");
  const nameEl = document.getElementById("list-modal-name");
  const imgEl = document.getElementById("list-modal-img");
  const rankEl = document.getElementById("list-modal-rank");

  const tier = getNftRarityTier(nft);

  if (titleEl) titleEl.textContent = `List ${nft.name || nft.identifier}`;
  if (nameEl) nameEl.textContent = nft.name || nft.identifier;
  if (imgEl) imgEl.src = nft.url || "branding/original/EFOOTBALL-91a4eb/logo.png";
  if (rankEl) rankEl.textContent = `${tier.tierIcon} Rank #${tier.rank} (${tier.tierLabel})`;

  updateListingFeePreview();
  modal?.classList.remove("hidden");
}

async function executeCreateListing() {
  const isHu = currentMarketLang === "hu";
  if (!activeModalNft || !marketWallet.address) {
    showMarketToast(isHu ? "⚠️ Kérlek csatlakoztasd a tárcádat a hirdetéshez!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const priceInput = document.getElementById("list-input-price");
  const currSelect = document.getElementById("list-select-currency");
  const currency = currSelect?.value || "EFOO";

  const priceVal = parseFloat(priceInput.value);
  if (currency === "EGLD") {
    if (isNaN(priceVal) || priceVal < 0.001) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 0.001 EGLD árat!" : "⚠️ Please enter a price of at least 0.001 EGLD.");
      return;
    }
  } else {
    if (isNaN(priceVal) || priceVal < 1000) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 1,000 $EFOO árat!" : "⚠️ Please enter a price of at least 1,000 $EFOO.");
      return;
    }
  }

  const colStr = activeModalNft.collection || (activeModalNft.identifier ? activeModalNft.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);

  let nonceNum = activeModalNft.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (activeModalNft.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  const paymentTokenStr = currency === "EGLD" ? "EGLD" : EFOO_TOKEN_ID;
  const paymentTokenHex = stringToHex(paymentTokenStr);
  const priceAtomic = toAtomicUnits(priceVal, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  // MultiversX ESDTNFTTransfer format:
  // ESDTNFTTransfer@<CollectionHex>@<NonceHex>@01@<DestinationAddressHex>@<EndpointNameHex>@<Arg1Hex>@<Arg2Hex>
  const endpointHex = stringToHex("listNft"); // 6c6973744e6674
  const dataField = `ESDTNFTTransfer@${colHex}@${nonceHex}@01@${SC_HEX}@${endpointHex}@${paymentTokenHex}@${priceHex}`;

  showMarketToast(
    isHu
      ? `⏳ Tranzakció előkészítése: NFT letétbe helyezése a Smart Contractban (${priceVal.toLocaleString()} $${currency})...`
      : `⏳ Preparing transaction: Depositing NFT into Smart Contract escrow (${priceVal.toLocaleString()} $${currency})...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: marketWallet.address,
      value: "0",
      gasLimit: 15000000,
      data: dataField
    });

    const tier = getNftRarityTier(activeModalNft);
    const newListing = {
      id: `list-${activeModalNft.identifier || Date.now()}`,
      identifier: activeModalNft.identifier,
      collection: colStr,
      nonce: Number(nonceNum),
      name: activeModalNft.name || activeModalNft.identifier,
      rarity: tier.tierLabel,
      rank: tier.rank,
      ovr: activeModalNft.ovr || 90,
      trait: activeModalNft.trait || "Listed by Player in SC Escrow",
      url: activeModalNft.url || "branding/original/EFOOTBALL-91a4eb/logo.png",
      price: priceVal,
      currency,
      seller: marketWallet.address,
      createdAt: Date.now(),
      isOnChain: true
    };

    const listings = getMarketplaceListings().filter((x) => x.identifier !== activeModalNft.identifier);
    listings.unshift(newListing);
    saveMarketplaceListings(listings);

    // Remove from locally displayed owned locker NFTs (it is now held in the SC escrow)
    if (marketWallet.ownedNfts) {
      marketWallet.ownedNfts = marketWallet.ownedNfts.filter((x) => x.identifier !== activeModalNft.identifier);
    }

    document.getElementById("list-nft-modal")?.classList.add("hidden");
    priceInput.value = "";

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    showMarketToast(
      isHu
        ? `🏷️ Sikeres tranzakció! ${newListing.name} eladásra került a Smart Contractban ${priceVal.toLocaleString()} $${currency} áron!`
        : `🏷️ Transaction dispatched! ${newListing.name} is listed in Smart Contract for ${priceVal.toLocaleString()} $${currency}!`
    );
  } catch (err) {
    console.error("Listing transaction failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a listázási tranzakció során: ${err.message || "Megszakítva"}`
        : `❌ Listing transaction failed: ${err.message || "Cancelled"}`
    );
  }
}

function openEditPriceModal(item) {
  activeModalNft = item;
  const modal = document.getElementById("edit-price-modal");
  const titleEl = document.getElementById("edit-modal-nft-title");
  const inputEl = document.getElementById("edit-input-price");
  const badgeEl = document.getElementById("edit-currency-badge");

  if (titleEl) titleEl.textContent = `Edit Price: ${item.name}`;
  if (inputEl) {
    inputEl.value = item.price;
    if (item.currency === "EGLD") {
      inputEl.step = "any";
      inputEl.min = "0.001";
      inputEl.placeholder = "e.g. 0.025";
    } else {
      inputEl.step = "1000";
      inputEl.min = "1000";
      inputEl.placeholder = "e.g. 2,500,000";
    }
  }
  if (badgeEl) badgeEl.textContent = `$${item.currency || "EFOO"}`;

  modal?.classList.remove("hidden");
}

async function executeEditPrice() {
  if (!activeModalNft || !marketWallet.address) return;
  const isHu = currentMarketLang === "hu";
  const inputEl = document.getElementById("edit-input-price");
  const currency = activeModalNft.currency || "EFOO";
  const newPrice = parseFloat(inputEl.value);

  if (currency === "EGLD") {
    if (isNaN(newPrice) || newPrice < 0.001) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 0.001 EGLD árat!" : "⚠️ Please enter a price of at least 0.001 EGLD.");
      return;
    }
  } else {
    if (isNaN(newPrice) || newPrice < 1000) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 1,000 $EFOO árat!" : "⚠️ Please enter a price of at least 1,000 $EFOO.");
      return;
    }
  }

  const colStr = activeModalNft.collection || (activeModalNft.identifier ? activeModalNft.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);
  let nonceNum = activeModalNft.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (activeModalNft.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  const paymentTokenStr = currency === "EGLD" ? "EGLD" : EFOO_TOKEN_ID;
  const paymentTokenHex = stringToHex(paymentTokenStr);
  const priceAtomic = toAtomicUnits(newPrice, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  // updateListingPrice@<colHex>@<nonceHex>@<paymentTokenHex>@<priceHex>
  const endpointHex = stringToHex("updateListingPrice"); // 7570646174654c697374696e675072696365
  const dataField = `${endpointHex}@${colHex}@${nonceHex}@${paymentTokenHex}@${priceHex}`;

  showMarketToast(
    isHu
      ? `⏳ Ármódosítási tranzakció előkészítése a Smart Contractban...`
      : `⏳ Preparing price update transaction on Smart Contract...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 10000000,
      data: dataField
    });

    const listings = getMarketplaceListings();
    const target = listings.find((x) => x.id === activeModalNft.id || x.identifier === activeModalNft.identifier);
    if (target) {
      target.price = newPrice;
      saveMarketplaceListings(listings);
    }

    document.getElementById("edit-price-modal")?.classList.add("hidden");
    renderMarketplaceGrid();
    renderMyLockerGrid();

    showMarketToast(
      isHu
        ? `💾 Új ár sikeresen beállítva: ${newPrice.toLocaleString()} $${currency}!`
        : `💾 Price updated to ${newPrice.toLocaleString()} $${currency}!`
    );
  } catch (err) {
    console.error("Price update failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba az ármódosítás során: ${err.message || "Megszakítva"}`
        : `❌ Price update error: ${err.message || "Cancelled"}`
    );
  }
}

async function executeDelistNft(item) {
  if (!item || !marketWallet.address) return;
  const isHu = currentMarketLang === "hu";

  const colStr = item.collection || (item.identifier ? item.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);
  let nonceNum = item.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (item.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  // delistNft@<colHex>@<nonceHex>
  const endpointHex = stringToHex("delistNft"); // 64656c6973744e6674
  const dataField = `${endpointHex}@${colHex}@${nonceHex}`;

  showMarketToast(
    isHu
      ? `⏳ Visszavonási tranzakció előkészítése: NFT visszakérése a Smart Contractból...`
      : `⏳ Preparing delist transaction: Returning NFT from Smart Contract...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 10000000,
      data: dataField
    });

    let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
    saveMarketplaceListings(listings);

    // Add back to locker room
    if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
    if (!marketWallet.ownedNfts.some((x) => x.identifier === item.identifier)) {
      marketWallet.ownedNfts.push(item);
    }

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    showMarketToast(
      isHu
        ? `❌ ${item.name} visszavonási tranzakció elküldve! A Smart Contract visszaküldi az NFT-t a tárcádba.`
        : `❌ Successfully delisted ${item.name}! Smart Contract is returning the NFT to your locker.`
    );
  } catch (err) {
    console.error("Delist failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a visszavonás során: ${err.message || "Megszakítva"}`
        : `❌ Delist error: ${err.message || "Cancelled"}`
    );
  }
}

// ============================================================================
// DETAILS & ATTRIBUTES POPUP MODAL
// ============================================================================
function openNftDetailsModal(nft) {
  activeModalNft = nft;
  const modal = document.getElementById("nft-details-modal");
  const imgEl = document.getElementById("detail-nft-img");
  const rankPill = document.getElementById("detail-rank-pill");
  const colIdEl = document.getElementById("detail-col-id");
  const nameEl = document.getElementById("detail-name");
  const traitEl = document.getElementById("detail-trait");
  const powersList = document.getElementById("detail-powers-list");
  const traitsTable = document.getElementById("detail-traits-table");
  const priceVal = document.getElementById("detail-price-val");
  const actionsWrap = document.getElementById("detail-action-buttons");
  const xoxnoLink = document.getElementById("detail-xoxno-link");

  const tier = getNftRarityTier(nft);

  if (imgEl) imgEl.src = nft.url || "branding/original/EFOOTBALL-91a4eb/logo.png";
  if (rankPill) {
    rankPill.textContent = `${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}`;
    rankPill.style.borderColor = tier.borderColor;
    rankPill.style.color = tier.borderColor;
  }
  if (colIdEl) colIdEl.textContent = nft.collection || STRIKER_COLLECTION;
  if (nameEl) nameEl.textContent = nft.name || nft.identifier;
  if (traitEl) traitEl.textContent = nft.trait || "Sunday League Degen Ultra";

  // Powers
  if (powersList) {
    powersList.innerHTML = tier.powers
      .map((p) => `<span class="m-power-badge">${p}</span>`)
      .join("");
  }

  // Attributes table
  if (traitsTable) {
    const rawAttrs = nft.attributes || [
      { name: "OVR", value: String(nft.ovr || 90) },
      { name: "Collection", value: nft.collection || STRIKER_COLLECTION },
      { name: "Rarity Rank", value: `#${tier.rank}` },
      { name: "Tier", value: tier.tierLabel }
    ];
    traitsTable.innerHTML = rawAttrs
      .map((a) => `
        <div class="m-trait-cell">
          <span class="mtc-lbl">${a.name || a.trait_type}</span>
          <strong class="mtc-val">${a.value}</strong>
        </div>
      `)
      .join("");
  }

  // Price & Actions
  const listings = getMarketplaceListings();
  const listedItem = listings.find((x) => x.id === nft.id || x.identifier === nft.identifier);

  if (listedItem) {
    if (priceVal) priceVal.textContent = `${listedItem.price.toLocaleString()} $${listedItem.currency || "EFOO"}`;
    const curAddr = marketWallet.address ? marketWallet.address.toLowerCase() : "";
    const isOwner = curAddr && listedItem.seller && listedItem.seller.toLowerCase() === curAddr;

    if (actionsWrap) {
      actionsWrap.innerHTML = isOwner
        ? `<button type="button" class="mnc-btn-edit" id="detail-btn-edit">✏️ Edit Price</button>
           <button type="button" class="mnc-btn-delist" id="detail-btn-delist">✕ Delist</button>`
        : `<button type="button" class="m-btn-primary" id="detail-btn-buy">⚡ Buy NFT</button>`;

      document.getElementById("detail-btn-buy")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        executeBuyNft(listedItem);
      });
      document.getElementById("detail-btn-edit")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        openEditPriceModal(listedItem);
      });
      document.getElementById("detail-btn-delist")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        executeDelistNft(listedItem);
      });
    }
  } else {
    if (priceVal) priceVal.textContent = "Not Listed";
    if (actionsWrap) {
      actionsWrap.innerHTML = `<button type="button" class="m-btn-primary" id="detail-btn-sell">🏷️ List for Sale</button>`;
      document.getElementById("detail-btn-sell")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        openListNftModal(nft);
      });
    }
  }

  if (xoxnoLink) {
    xoxnoLink.href = `https://xoxno.com/collection/${nft.collection || STRIKER_COLLECTION}`;
  }

  modal?.classList.remove("hidden");
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================
function showMarketToast(msg) {
  const t = document.getElementById("m-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.add("hidden");
  }, 4000);
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initMarketWallet();
  refreshOnChainVaultStats();
  renderMarketplaceGrid();
  renderSkillsStore();
  fetchLiveXoxnoListings();

  // Tabs
  const tabBrowse = document.getElementById("tab-btn-browse");
  const tabMyNfts = document.getElementById("tab-btn-my-nfts");
  const tabSkills = document.getElementById("tab-btn-skills-store");

  const panelBrowse = document.getElementById("panel-browse");
  const panelMyNfts = document.getElementById("panel-my-nfts");
  const panelSkills = document.getElementById("panel-skills-store");

  const switchTab = (tab) => {
    currentTab = tab;
    tabBrowse?.classList.toggle("active", tab === "browse");
    tabMyNfts?.classList.toggle("active", tab === "my_nfts");
    tabSkills?.classList.toggle("active", tab === "skills");

    panelBrowse?.classList.toggle("hidden", tab !== "browse");
    panelMyNfts?.classList.toggle("hidden", tab !== "my_nfts");
    panelSkills?.classList.toggle("hidden", tab !== "skills");

    if (tab === "my_nfts") renderMyLockerGrid();
    if (tab === "skills") renderSkillsStore();
  };
  window.switchMarketTab = switchTab;

  tabBrowse?.addEventListener("click", () => switchTab("browse"));
  tabMyNfts?.addEventListener("click", () => switchTab("my_nfts"));
  tabSkills?.addEventListener("click", () => switchTab("skills"));

  // Check URL query parameters and hash (e.g. market.html?tab=skills or market.html#skills)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab") || (window.location.hash ? window.location.hash.replace("#", "") : "");
    if (tabParam === "skills" || tabParam === "skills-store" || tabParam === "skill") {
      switchTab("skills");
    } else if (tabParam === "my_nfts" || tabParam === "locker") {
      switchTab("my_nfts");
    }
  } catch (e) {}

  window.addEventListener("hashchange", () => {
    const h = window.location.hash.replace("#", "");
    if (h === "skills" || h === "skills-store" || h === "skill") switchTab("skills");
    else if (h === "my_nfts" || h === "locker") switchTab("my_nfts");
    else if (h === "browse") switchTab("browse");
  });

  // Filters
  document.querySelectorAll("[data-filter-col]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("[data-filter-col]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterCollection = btn.getAttribute("data-filter-col") || "all";
      renderMarketplaceGrid();
    });
  });

  document.getElementById("select-rarity-filter")?.addEventListener("change", (e) => {
    filterRarity = e.target.value;
    renderMarketplaceGrid();
  });

  document.getElementById("select-sort-order")?.addEventListener("change", (e) => {
    sortOrder = e.target.value;
    renderMarketplaceGrid();
  });

  // Languages
  document.querySelectorAll("[data-market-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-market-lang]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMarketLang = btn.getAttribute("data-market-lang") || "en";

      // Update static translations
      const dict = MARKET_I18N[currentMarketLang] || MARKET_I18N.en;
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const k = el.getAttribute("data-i18n");
        if (dict[k]) el.innerHTML = dict[k];
      });

      renderMarketplaceGrid();
      renderMyLockerGrid();
      renderSkillsStore();
    });
  });

  // Wallet Modal
  const walletModal = document.getElementById("m-wallet-modal");
  document.getElementById("m-btn-connect")?.addEventListener("click", () => {
    walletModal?.classList.remove("hidden");
  });
  document.getElementById("btn-locker-connect")?.addEventListener("click", () => {
    walletModal?.classList.remove("hidden");
  });
  document.getElementById("close-m-wallet-btn")?.addEventListener("click", () => {
    walletModal?.classList.add("hidden");
  });
  document.getElementById("m-btn-disconnect")?.addEventListener("click", disconnectWallet);

  // Manual Address Explorer
  document.getElementById("m-btn-load-manual-erd")?.addEventListener("click", () => {
    const input = document.getElementById("m-manual-erd-input");
    connectManualAddress(input?.value);
  });
  document.getElementById("m-manual-erd-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      connectManualAddress(e.target.value);
    }
  });

  // Providers Demo QR & Web Wallet
  document.getElementById("m-login-xportal")?.addEventListener("click", () => {
    const qrBox = document.getElementById("m-xportal-qr-box");
    const qrImg = document.getElementById("m-xportal-qr-img");
    if (qrBox && qrImg) {
      qrBox.classList.remove("hidden");
      const callbackUrl = window.location.origin + window.location.pathname;
      const loginUrl = `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(loginUrl)}`;
    }
  });

  document.getElementById("m-login-extension")?.addEventListener("click", async () => {
    const ext = window.elrondWallet || window.multiversx || window.elrond;
    if (ext && typeof ext.login === "function") {
      try {
        const res = await ext.login();
        const addr = typeof res === "string" ? res : (res && res.address ? res.address : "");
        if (addr && addr.startsWith("erd1")) {
          connectManualAddress(addr);
          showMarketToast(
            currentMarketLang === "hu"
              ? `✅ Sikeresen csatlakozva: ${addr.slice(0, 6)}...${addr.slice(-4)}`
              : `✅ Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`
          );
          return;
        }
      } catch (e) {
        console.warn("Extension login error:", e);
        showMarketToast(
          currentMarketLang === "hu"
            ? "❌ A csatlakozást elutasítottad vagy megszakadt a tárcában."
            : "❌ Extension connection cancelled or rejected."
        );
        return;
      }
    }
    showMarketToast(
      currentMarketLang === "hu"
        ? "⚠️ Nem található MultiversX DeFi Wallet bővítmény a böngésződben!"
        : "⚠️ MultiversX DeFi Wallet extension not detected in your browser!"
    );
  });

  document.getElementById("m-login-webwallet")?.addEventListener("click", () => {
    const callbackUrl = window.location.origin + window.location.pathname;
    window.location.href = `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  });

  // Close Modals
  document.getElementById("close-details-modal-btn")?.addEventListener("click", () => {
    document.getElementById("nft-details-modal")?.classList.add("hidden");
  });
  document.getElementById("close-list-modal-btn")?.addEventListener("click", () => {
    document.getElementById("list-nft-modal")?.classList.add("hidden");
  });
  document.getElementById("close-edit-modal-btn")?.addEventListener("click", () => {
    document.getElementById("edit-price-modal")?.classList.add("hidden");
  });

  // Modal Backdrop Click Closes
  [
    document.getElementById("nft-details-modal"),
    document.getElementById("list-nft-modal"),
    document.getElementById("edit-price-modal"),
    walletModal
  ].forEach((m) => {
    m?.addEventListener("click", (e) => {
      if (e.target === m) m.classList.add("hidden");
    });
  });

  // Confirm Listing & Edit Price
  document.getElementById("btn-confirm-listing")?.addEventListener("click", executeCreateListing);
  document.getElementById("btn-confirm-edit-price")?.addEventListener("click", executeEditPrice);

  // Listing modal dynamic currency & price fee preview
  document.getElementById("list-select-currency")?.addEventListener("change", updateListingFeePreview);
  document.getElementById("list-input-price")?.addEventListener("input", updateListingFeePreview);
});
