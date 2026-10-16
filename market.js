// ============================================================================
// $EFOO OFFICIAL P2P NFT & SKILL MARKETPLACE
// Sunday League Degen FC on MultiversX
// ============================================================================

const MULTIVERSX_API = "https://api.multiversx.com";
const EFOO_TOKEN_ID = "EFOO-8fe2d4";
const STRIKER_COLLECTION = "EFOOTBALL-91a4eb";
const KEEPER_COLLECTION = "GOALKEEPER-cb9e3e";

const STORAGE_LISTINGS = "EFOO_NFT_MARKET_LISTINGS_V1";
const STORAGE_VAULT_POT = "efoo_stadium_vault_pot";
const STORAGE_TOTAL_BURNED = "efoo_total_burned_games";
const STORAGE_SKILLS_INVENTORY = "efoo_skills_inventory_v1";

const BASE_VAULT_POT = 25400000;
const BASE_BURNED_GAMES = 92912450000;

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
// INITIAL SEED LISTINGS (ACTIVE P2P COMMUNITY TRADES)
// ============================================================================
const DEFAULT_SEED_LISTINGS = [
  {
    id: "list-1",
    identifier: "EFOOTBALL-91a4eb-026b",
    collection: STRIKER_COLLECTION,
    nonce: 619,
    name: "ELRONDFOOTBALL #619",
    rarity: "MYTHIC",
    rank: 3,
    ovr: 99,
    trait: "👽 ALIEN STRIKER • 4 SKILLS + RADAR",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/9734.png",
    price: 5000000,
    currency: "EFOO",
    seller: "erd1ultra93k2vlw849h7z8p49x2qms8237vdg84091vcs",
    createdAt: Date.now() - 3600000 * 4,
    attributes: [
      { name: "OVR", value: "99" },
      { name: "Skin", value: "Alien Green" },
      { name: "Jersey", value: "Liga 1 Gold #10" },
      { name: "Boots", value: "Supersonic Rocket" }
    ]
  },
  {
    id: "list-2",
    identifier: "GOALKEEPER-cb9e3e-02",
    collection: KEEPER_COLLECTION,
    nonce: 2,
    name: "GOALKEEPER #2",
    jersey: "02",
    rarity: "MYTHIC",
    rank: 2,
    ovr: 99,
    trait: "🧱 WALL OF DEGENS • TELEPATHY + 4 SKILLS",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/230.png",
    price: 8500000,
    currency: "EFOO",
    seller: "erd1degen098vkl287y4hgt289xnc823901hfg82394723",
    createdAt: Date.now() - 3600000 * 8,
    attributes: [
      { name: "OVR", value: "99" },
      { name: "Gloves", value: "Titanium Spider" },
      { name: "Kit", value: "Black Panther GK" }
    ]
  },
  {
    id: "list-3",
    identifier: "EFOOTBALL-91a4eb-0261",
    collection: STRIKER_COLLECTION,
    nonce: 609,
    name: "ELRONDFOOTBALL #609",
    rarity: "LEGENDARY",
    rank: 12,
    ovr: 95,
    trait: "⚡ LIGA 1 SNIPER • 3 SKILLS",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1477.png",
    price: 2800000,
    currency: "EFOO",
    seller: "erd1sniper823749812yhg83921kldhsa89213794h23",
    createdAt: Date.now() - 3600000 * 12,
    attributes: [
      { name: "OVR", value: "95" },
      { name: "Head", value: "Ultra Headband" },
      { name: "Jersey", value: "Red Degen Stripes" }
    ]
  },
  {
    id: "list-4",
    identifier: "GOALKEEPER-cb9e3e-07",
    collection: KEEPER_COLLECTION,
    nonce: 7,
    name: "GOALKEEPER #7",
    jersey: "07",
    rarity: "LEGENDARY",
    rank: 7,
    ovr: 94,
    trait: "🧤 OCTOPUS REACH • SPIDER ARMS + 3 SKILLS",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/440.png",
    price: 3500000,
    currency: "EFOO",
    seller: "erd1octo9923847h192837dhsa7283491hd892348h",
    createdAt: Date.now() - 3600000 * 2,
    attributes: [
      { name: "OVR", value: "94" },
      { name: "Reach", value: "Spider Tentacles" },
      { name: "Kit", value: "Neon Green Keeper" }
    ]
  },
  {
    id: "list-5",
    identifier: "EFOOTBALL-91a4eb-0262",
    collection: STRIKER_COLLECTION,
    nonce: 610,
    name: "ELRONDFOOTBALL #610",
    rarity: "EPIC",
    rank: 65,
    ovr: 90,
    trait: "🔥 ROCKET FINISHER • 2 SKILLS",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/2805.png",
    price: 1600000,
    currency: "EFOO",
    seller: "erd1finisher982374h1298hsa8723491h89234h8",
    createdAt: Date.now() - 3600000 * 18,
    attributes: [
      { name: "OVR", value: "90" },
      { name: "Hair", value: "Golden Mohawk" }
    ]
  },
  {
    id: "list-6",
    identifier: "GOALKEEPER-cb9e3e-33",
    collection: KEEPER_COLLECTION,
    nonce: 51,
    name: "GOALKEEPER #51",
    jersey: "51",
    rarity: "RARE",
    rank: 210,
    ovr: 86,
    trait: "⚡ CAT REFLEX • IRON WALL + 2 SKILLS",
    url: "branding/original/GOALKEEPER-cb9e3e/logo.png",
    price: 1200000,
    currency: "EFOO",
    seller: "erd1catref892374h198273hsa872349817h2348",
    createdAt: Date.now() - 3600000 * 24,
    attributes: [
      { name: "OVR", value: "86" },
      { name: "Reflex", value: "Cat Lightning" }
    ]
  },
  {
    id: "list-7",
    identifier: "EFOOTBALL-91a4eb-0264",
    collection: STRIKER_COLLECTION,
    nonce: 612,
    name: "ELRONDFOOTBALL #612",
    rarity: "RARE",
    rank: 320,
    ovr: 88,
    trait: "🎯 TOP BINS SPECIALIST • 2 SKILLS",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/6632.png",
    price: 1100000,
    currency: "EFOO",
    seller: "erd1topbin892347h192837hsa728349817h234",
    createdAt: Date.now() - 3600000 * 30,
    attributes: [
      { name: "OVR", value: "88" },
      { name: "Eyes", value: "Laser Focus" }
    ]
  },
  {
    id: "list-8",
    identifier: "EFOOTBALL-91a4eb-0273",
    collection: STRIKER_COLLECTION,
    nonce: 627,
    name: "ELRONDFOOTBALL #627",
    rarity: "COMMON",
    rank: 510,
    ovr: 78,
    trait: "🍺 PANENKA KING • 1 SKILL",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1688.png",
    price: 800000,
    currency: "EFOO",
    seller: "erd1beerstriker823749812yhg83921kldhsa892",
    createdAt: Date.now() - 3600000 * 40,
    attributes: [
      { name: "OVR", value: "78" },
      { name: "Meme", value: "Sunday Beer Cleats" }
    ]
  }
];

// Load listings from LocalStorage or seed defaults
function getMarketplaceListings() {
  try {
    const raw = localStorage.getItem(STORAGE_LISTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  saveMarketplaceListings(DEFAULT_SEED_LISTINGS);
  return DEFAULT_SEED_LISTINGS;
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
    if (p) pot = Math.max(BASE_VAULT_POT, parseInt(p, 10) || BASE_VAULT_POT);
    const b = localStorage.getItem(STORAGE_TOTAL_BURNED);
    if (b) burned = Math.max(BASE_BURNED_GAMES, parseInt(b, 10) || BASE_BURNED_GAMES);
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

function renderTelemetry() {
  const stats = getVaultStats();
  const potEl = document.getElementById("tele-vault-val");
  const burnedEl = document.getElementById("tele-burned-val");
  const countEl = document.getElementById("tele-listings-count");

  if (potEl) potEl.textContent = `${stats.pot.toLocaleString("en-US")} $EFOO`;
  if (burnedEl) burnedEl.textContent = `${stats.burned.toLocaleString("en-US")} $EFOO`;

  const listings = getMarketplaceListings();
  if (countEl) countEl.textContent = `${listings.length} NFTs`;
}

// ============================================================================
// WALLET MANAGEMENT & AUTHENTICATION
// ============================================================================
function initMarketWallet() {
  try {
    const savedAddr = localStorage.getItem("multiversx_address") || sessionStorage.getItem("multiversx_address");
    const savedProv = localStorage.getItem("multiversx_provider") || sessionStorage.getItem("multiversx_provider");
    if (savedAddr && savedAddr.startsWith("erd1")) {
      marketWallet.address = savedAddr;
      marketWallet.provider = savedProv || "webwallet";
      fetchWalletBalances(savedAddr);
      fetchWalletNfts(savedAddr);
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
      marketWallet.efooBalance = 1500000; // Demo starter credit for testing
    }
  } catch (e) {
    marketWallet.efooBalance = 1500000;
  }
  updateWalletUI();
}

async function fetchWalletNfts(address) {
  try {
    const res = await fetch(`${MULTIVERSX_API}/accounts/${address}/nfts?collections=${STRIKER_COLLECTION},${KEEPER_COLLECTION}&size=100`);
    if (res.ok) {
      const nfts = await res.json();
      if (Array.isArray(nfts) && nfts.length > 0) {
        marketWallet.ownedNfts = nfts;
        renderMyLockerGrid();
        return;
      }
    }
  } catch (e) {}

  // Fallback demo squad if fresh address has no on-chain NFTs yet
  marketWallet.ownedNfts = [
    {
      identifier: "EFOOTBALL-91a4eb-026b",
      collection: STRIKER_COLLECTION,
      nonce: 619,
      name: "ELRONDFOOTBALL #619",
      rarity: "MYTHIC",
      rank: 3,
      url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/9734.png"
    },
    {
      identifier: "GOALKEEPER-cb9e3e-07",
      collection: KEEPER_COLLECTION,
      nonce: 7,
      name: "GOALKEEPER #7",
      jersey: "07",
      rarity: "LEGENDARY",
      rank: 7,
      url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/440.png"
    }
  ];
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
}

function disconnectWallet() {
  marketWallet.address = null;
  marketWallet.provider = null;
  marketWallet.ownedNfts = [];
  try {
    localStorage.removeItem("multiversx_address");
    localStorage.removeItem("multiversx_provider");
    sessionStorage.removeItem("multiversx_address");
    sessionStorage.removeItem("multiversx_provider");
  } catch (e) {}
  updateWalletUI();
  renderMarketplaceGrid();
  renderMyLockerGrid();
  showMarketToast("Logged out successfully.");
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

  const allListings = getMarketplaceListings();

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
        <h3>No NFTs match the selected filter.</h3>
        <p>Try switching to 'All' or check back soon!</p>
      </div>
    `;
    return;
  }

  const isHu = currentMarketLang === "hu";
  const isRo = currentMarketLang === "ro";
  const curAddr = marketWallet.address ? marketWallet.address.toLowerCase() : "";

  filtered.forEach((item) => {
    const tier = getNftRarityTier(item);
    const isOwner = curAddr && item.seller && item.seller.toLowerCase() === curAddr;

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey}`;

    const formattedPrice = item.price.toLocaleString("en-US");
    const sellerShort = isOwner
      ? (isHu ? "Te (Tulajdonos)" : (isRo ? "Tu (Proprietar)" : "You (Owner)"))
      : `${item.seller.slice(0, 6)}...${item.seller.slice(-4)}`;

    card.innerHTML = `
      <div class="mnc-media-wrap" data-inspect="${item.id}">
        <img src="${item.url}" alt="${item.name}" class="mnc-media-img" loading="lazy" />
        <div class="mnc-rank-badge" style="border-color:${tier.borderColor}; color:${tier.borderColor};">
          ${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}
        </div>
        <div class="mnc-col-tag">${item.jersey ? "🧤 KEEPER" : "⚽ STRIKER"}</div>
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${item.name}</strong>
          <span class="mnc-ovr">${item.ovr || 85} OVR</span>
        </div>

        <p class="mnc-trait-desc">${item.trait || "Sunday League Degen Ultra"}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">ASKING PRICE</span>
            <strong class="mnc-price-val">${formattedPrice} $${item.currency || "EFOO"}</strong>
            <span class="mnc-seller-lbl">Seller: ${sellerShort}</span>
          </div>

          <div class="mnc-action-wrap">
            ${
              isOwner
                ? `<div class="mnc-owner-btns">
                     <button type="button" class="mnc-btn-edit" data-edit="${item.id}">✏️ Edit</button>
                     <button type="button" class="mnc-btn-delist" data-delist="${item.id}">✕ Delist</button>
                   </div>`
                : `<button type="button" class="mnc-btn-buy" data-buy="${item.id}">⚡ BUY</button>`
            }
          </div>
        </div>
      </div>
    `;

    // Click on media to open detailed inspection popup
    card.querySelector(`[data-inspect="${item.id}"]`)?.addEventListener("click", () => {
      openNftDetailsModal(item);
    });

    // Buy Action
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
function executeBuyNft(item) {
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast("⚠️ Please connect your wallet first to purchase this NFT!");
    return;
  }

  const isHu = currentMarketLang === "hu";

  if (marketWallet.efooBalance < item.price) {
    showMarketToast(
      isHu
        ? `⚠️ Nincs elegendő $EFOO egyenleged! Ár: ${item.price.toLocaleString("en-US")} $EFOO`
        : `⚠️ Insufficient $EFOO balance! Price: ${item.price.toLocaleString("en-US")} $EFOO`
    );
    return;
  }

  // Deduct price from buyer
  marketWallet.efooBalance -= item.price;
  updateWalletUI();

  // 1% platform fee (0.5% burned, 0.5% to stadium vault)
  const feeHalf = Math.floor(item.price * 0.005);
  addVaultContributions(feeHalf, feeHalf);

  // Transfer ownership in marketplace
  let listings = getMarketplaceListings();
  listings = listings.filter((x) => x.id !== item.id);
  saveMarketplaceListings(listings);

  // Add to buyer's locker
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
      ? `🎉 Sikeres vásárlás! ${item.name} bekerült a saját öltöződbe! 1% díj elégetve & a Vaultba helyezve.`
      : `🎉 Congratulations! ${item.name} is now in your Locker Room!`
  );
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

  modal?.classList.remove("hidden");
}

function executeCreateListing() {
  if (!activeModalNft || !marketWallet.address) return;

  const priceInput = document.getElementById("list-input-price");
  const currSelect = document.getElementById("list-select-currency");

  const priceVal = parseInt(priceInput.value, 10);
  if (!priceVal || priceVal < 1000) {
    showMarketToast("⚠️ Please enter a valid price of at least 1,000 $EFOO.");
    return;
  }

  const currency = currSelect.value || "EFOO";
  const tier = getNftRarityTier(activeModalNft);

  const newListing = {
    id: `list-${Date.now()}`,
    identifier: activeModalNft.identifier,
    collection: activeModalNft.collection || STRIKER_COLLECTION,
    nonce: activeModalNft.nonce || 0,
    name: activeModalNft.name || activeModalNft.identifier,
    rarity: tier.tierLabel,
    rank: tier.rank,
    ovr: activeModalNft.ovr || 90,
    trait: activeModalNft.trait || "Listed by Player",
    url: activeModalNft.url || "branding/original/EFOOTBALL-91a4eb/logo.png",
    price: priceVal,
    currency,
    seller: marketWallet.address,
    createdAt: Date.now()
  };

  const listings = getMarketplaceListings();
  listings.unshift(newListing);
  saveMarketplaceListings(listings);

  document.getElementById("list-nft-modal")?.classList.add("hidden");
  priceInput.value = "";

  renderMarketplaceGrid();
  renderMyLockerGrid();
  renderTelemetry();

  showMarketToast(`🏷️ Successfully listed ${newListing.name} for ${priceVal.toLocaleString()} $${currency}!`);
}

function openEditPriceModal(item) {
  activeModalNft = item;
  const modal = document.getElementById("edit-price-modal");
  const titleEl = document.getElementById("edit-modal-nft-title");
  const inputEl = document.getElementById("edit-input-price");
  const badgeEl = document.getElementById("edit-currency-badge");

  if (titleEl) titleEl.textContent = `Edit Price: ${item.name}`;
  if (inputEl) inputEl.value = item.price;
  if (badgeEl) badgeEl.textContent = `$${item.currency || "EFOO"}`;

  modal?.classList.remove("hidden");
}

function executeEditPrice() {
  if (!activeModalNft) return;
  const inputEl = document.getElementById("edit-input-price");
  const newPrice = parseInt(inputEl.value, 10);

  if (!newPrice || newPrice < 1000) {
    showMarketToast("⚠️ Please enter a valid price.");
    return;
  }

  const listings = getMarketplaceListings();
  const target = listings.find((x) => x.id === activeModalNft.id);
  if (target) {
    target.price = newPrice;
    saveMarketplaceListings(listings);
  }

  document.getElementById("edit-price-modal")?.classList.add("hidden");
  renderMarketplaceGrid();
  renderMyLockerGrid();

  showMarketToast(`💾 Price updated to ${newPrice.toLocaleString()} $${activeModalNft.currency || "EFOO"}`);
}

function executeDelistNft(item) {
  let listings = getMarketplaceListings();
  listings = listings.filter((x) => x.id !== item.id);
  saveMarketplaceListings(listings);

  renderMarketplaceGrid();
  renderMyLockerGrid();
  renderTelemetry();

  showMarketToast(`❌ Delisted ${item.name} and returned to your locker room.`);
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
  renderTelemetry();
  renderMarketplaceGrid();
  renderSkillsStore();

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
  };

  tabBrowse?.addEventListener("click", () => switchTab("browse"));
  tabMyNfts?.addEventListener("click", () => switchTab("my_nfts"));
  tabSkills?.addEventListener("click", () => switchTab("skills"));

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
      qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fmaiar.page.link%2Fconnect";
    }
  });

  document.getElementById("m-login-extension")?.addEventListener("click", () => {
    connectManualAddress("erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th");
  });

  document.getElementById("m-login-webwallet")?.addEventListener("click", () => {
    connectManualAddress("erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th");
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
});
