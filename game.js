// ============================================================================
// EFOO FOMO — FULLSCREEN 60FPS 3D-PERSPECTIVE ARCADE ENGINE (game.js)
// ============================================================================

const MIN_EFOO_REQUIRED = 1000000; // Minimum 1,000,000 $EFOO required to play
const VALID_WALLET_PROVIDERS = ["xportal", "extension", "webwallet"];

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
    gate_buy_sub: "Pay 0.035 EGLD (~$0.12) for 1,000,000 $EFOO ➔ RECEIVE 1,500,000 $EFOO! (+500k from Stadium Vault)",
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
    gate_buy_sub: "Fizess 0.035 EGLD-t (~$0.12) 1 000 000 $EFOO-ért ➔ KAPSZ 1 500 000 $EFOO-t! (+500k a Stadium Vaultból)",
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
    gate_buy_sub: "Plătește 0.035 EGLD (~$0.12) pt. 1.000.000 $EFOO ➔ PRIMEȘTI 1.500.000 $EFOO! (+500k din Seif)",
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
  WC_PROJECT_ID: "9b1a9564f91cb659ffe21b73d5c4e2d8"
};

const STRIKER_ROSTER = [
  {
    identifier: "EFOOTBALL-91a4eb-026b",
    name: "ELRONDFOOTBALL #619",
    ovr: 99,
    trait: "👽 ALIEN STRIKER • CURVE+",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/9734.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0261",
    name: "ELRONDFOOTBALL #609",
    ovr: 94,
    trait: "⚡ LIGA 1 SNIPER",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1477.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0262",
    name: "ELRONDFOOTBALL #610",
    ovr: 92,
    trait: "🔥 ROCKET FINISHER",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/2805.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0264",
    name: "ELRONDFOOTBALL #612",
    ovr: 95,
    trait: "🎯 VINCLU SPECIALIST",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/6632.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0273",
    name: "ELRONDFOOTBALL #627",
    ovr: 93,
    trait: "🍺 PANENKA KING",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1688.png"
  }
];

const KEEPER_ROSTER = [
  {
    identifier: "GOALKEEPER-cb9e3e-02",
    name: "GOALKEEPER #2",
    jersey: "02",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/230.png"
  },
  {
    identifier: "GOALKEEPER-cb9e3e-07",
    name: "GOALKEEPER #7",
    jersey: "07",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/440.png"
  },
  {
    identifier: "GOALKEEPER-cb9e3e-33",
    name: "GOALKEEPER #51",
    jersey: "51",
    url: "branding/original/GOALKEEPER-cb9e3e/logo.png"
  }
];

// ============================================================================
// SYNTHESIZED WEB AUDIO STADIUM SFX ENGINE
// ============================================================================
class ArcadeAudio {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  playIntroImpact() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [220, 277.18, 329.63, 440].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f, now + i * 0.12);
      g.gain.setValueAtTime(0.001, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.1, now + i * 0.12 + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.75);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now + i * 0.12);
      o.stop(now + i * 0.12 + 0.8);
    });
  }

  playWhistle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lg = this.ctx.createGain();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(2880, now);
    lfo.frequency.setValueAtTime(42, now);
    lg.gain.setValueAtTime(135, now);
    lfo.connect(lg);
    lg.connect(o.frequency);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.13, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    lfo.start(now);
    o.stop(now + 0.45);
    lfo.stop(now + 0.45);
  }

  playKick(isPerfect) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = isPerfect ? "triangle" : "sine";
    o.frequency.setValueAtTime(isPerfect ? 185 : 135, now);
    o.frequency.exponentialRampToValueAtTime(34, now + 0.22);
    g.gain.setValueAtTime(0.32, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.25);
  }

  playGoalCheer() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [261.63, 329.63, 392, 523.25].forEach((f) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.11, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.95);
    });
  }

  playPostClang() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [860, 1310].forEach((f) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.45);
    });
  }

  playSaveBlock() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(105, now);
    o.frequency.linearRampToValueAtTime(48, now + 0.25);
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.3);
  }

  playVarSiren() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(440, now);
    o.frequency.linearRampToValueAtTime(880, now + 0.15);
    o.frequency.linearRampToValueAtTime(440, now + 0.3);
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.36);
  }

  playHeartbeat() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(68, now);
    o.frequency.exponentialRampToValueAtTime(32, now + 0.12);
    g.gain.setValueAtTime(0.32, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(now);
    o.stop(now + 0.15);
  }
}

const audio = new ArcadeAudio();

// ============================================================================
// STATE & IMAGE ASSETS
// ============================================================================
let currentLang = localStorage.getItem("efoo_lang") || "en";
let connectedAddress = localStorage.getItem("efoo_wallet_address") || "";
let connectedProvider = localStorage.getItem("efoo_wallet_provider") || "";
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
if (connectedAddress && typeof window !== "undefined" && window.elrondWallet && connectedProvider !== "xportal") {
  connectedProvider = "extension";
  localStorage.setItem("efoo_wallet_provider", "extension");
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
  return Boolean(
    connectedAddress &&
      VALID_WALLET_PROVIDERS.includes(connectedProvider) &&
      walletState.verified &&
      !walletState.loading &&
      walletState.efooBalance >= MIN_EFOO_REQUIRED
  );
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
    name: "ICE VEINS",
    nameHu: "HIDEGVÉR",
    nameRo: "NERVI DE OȚEL",
    desc: "Crosshair stops shaking for your next shot.",
    descHu: "A célkereszt stabilizálódik a következő lövésnél.",
    descRo: "Cursorul nu mai tremură la următorul șut.",
    price: 50000,
    color: "#38bdf8"
  },
  {
    id: "power",
    icon: "🚀",
    name: "ROCKET SHOT",
    nameHu: "RAKÉTA LÖVÉS",
    nameRo: "ȘUT RACHETĂ",
    desc: "Much wider power sweet-spot + keeper reach -25%.",
    descHu: "Tágabb sweet-spot + a kapus elérési távolsága 25%-kal kisebb.",
    descRo: "Zonă de putere mult mai largă + portarul ajunge cu 25% mai puțin.",
    price: 75000,
    color: "#fb923c"
  },
  {
    id: "freeze",
    icon: "🧊",
    name: "KEEPER FREEZE",
    nameHu: "KAPUS FAGYASZTÁS",
    nameRo: "PORTAR ÎNGHEȚAT",
    desc: "Keeper reacts late: reach −45% and dives wrong way.",
    descHu: "A kapus késve reagál: −45% elérés és elugrik a rossz irányba.",
    descRo: "Portarul reacționează târziu: rază −45% și ghicește des greșit.",
    price: 100000,
    color: "#67e8f9"
  },
  {
    id: "curve",
    icon: "🌀",
    name: "BANANA CURVE",
    nameHu: "KIFLI CSAVARÁS",
    nameRo: "ȘUT CU EFECT",
    desc: "Ball bends hard — keeper misreads it 70% worse.",
    descHu: "Erősen kanyarodó labda — a kapus jóval nehezebben védi ki.",
    descRo: "Mingea face efect puternic — portarul o citește cu 70% mai prost.",
    price: 60000,
    color: "#c084fc"
  },
  {
    id: "gold",
    icon: "💰",
    name: "GOLD x2",
    nameHu: "DUPLA ARANY (2x)",
    nameRo: "AUR x2",
    desc: "Double points and score if this shot scores.",
    descHu: "Dupla pontszám és bónusz, ha a labda gól lesz.",
    descRo: "Puncte duble dacă șutul înscrie.",
    price: 40000,
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
// NFT QUANTITY & TOKEN PERKS (SKILL-BASED: STEADIER AIM, WIDER SWEET-SPOT)
// ============================================================================
function getPowers() {
  const pCount = walletState.playersCount;
  const kCount = walletState.keepersCount;
  const efoo = walletState.efooBalance;

  let mult = 1.0;
  let swayMul = 1;
  let sweetBonus = 0;
  let hasCurve = false;
  let hasRadar = false;
  let hasTwinBall = false;

  if (pCount >= 6) {
    mult = 10.0;
    swayMul = 0.55;
    sweetBonus = 0.06;
    hasCurve = true;
    hasRadar = true;
    hasTwinBall = true;
  } else if (pCount >= 3) {
    mult = 5.0;
    swayMul = 0.7;
    sweetBonus = 0.04;
    hasCurve = true;
    hasRadar = true;
  } else if (pCount >= 1) {
    mult = 2.5;
    swayMul = 0.85;
    sweetBonus = 0.02;
    hasCurve = true;
  }

  // 1 clutch save shield max (rebound only, never saves repeated corner camping)
  const maxShields = kCount >= 1 ? 1 : 0;
  const keeperMult = kCount >= 2 ? 5.0 : kCount >= 1 ? 2.5 : 0;
  const hasRocket = efoo >= MIN_EFOO_REQUIRED;
  const rocketPts = efoo >= 10000000 ? 3000 : hasRocket ? 1000 : 0;

  return {
    pCount,
    kCount,
    efoo,
    aimBonusPct: Math.round((1 - swayMul) * 100),
    swayMul,
    sweetBonus,
    keeperSigmaMul: hasCurve ? 1.15 : 1,
    totalMult: mult + keeperMult,
    maxShields,
    hasCurve,
    hasRadar,
    hasTwinBall,
    hasRocket,
    rocketPts,
    isPro: pCount >= 1 || kCount >= 1 || hasRocket
  };
}

// ============================================================================
// GAMEPLAY & 3D CANVAS GEOMETRY STATE
// ============================================================================
const game = {
  phase: "start", // "start" | "intro" | "aim" | "charging" | "flight" | "celebrate" | "var_review" | "summary"
  round: 1,
  maxRounds: SHOTS_PER_MATCH,
  level: 1,
  levelCleared: false,
  shotHistory: [], // ["goal", "miss", ...]
  goals: 0,
  streak: 0,
  score: 0,
  rawBaseScore: 0,
  shieldsLeft: 0,
  fomoSeconds: 282,
  fomoPot: 25400000,
  revivedThisMatch: false,
  varCountdown: 10,
  varTimerInterval: null,

  // Super skills: armed = chosen for the NEXT kick, activeFx = what the current shot is using
  armed: {},
  activeFx: {},
  skillFlash: null, // { text, color, life }

  // Aim coordinates relative to the goal: nx in [-1, 1] = post to post, ny in [0, 1] = grass to crossbar.
  // The player may aim OUTSIDE the frame (nx up to ±1.55, ny up to 1.55) — wide / over the bar are possible!
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
    leanShown: 1, // what the 3+ NFT radar claims (truthful only ~70% of the time)
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
  crowdLights: []
};

function updateStrikerCardAssets(idx) {
  const walletStrikers = (walletState.ownedNfts || [])
    .filter((n) => n.collection === "EFOOTBALL-91a4eb")
    .map((n) => ({
      identifier: n.identifier,
      name: (n.name || n.identifier).toUpperCase(),
      ovr: 99,
      trait: "✅ YOUR WALLET NFT",
      url: (n.media && n.media[0] && (n.media[0].url || n.media[0].thumbnailUrl)) || n.url
    }));

  const pool = walletStrikers.length > 0 ? [...walletStrikers, ...STRIKER_ROSTER] : STRIKER_ROSTER;
  strikerIdx = idx % pool.length;
  activeStriker = pool[strikerIdx];

  const cors = toCorsUrl(activeStriker.url, 300);
  imgs.striker.crossOrigin = "anonymous";
  imgs.striker.src = cors;

  const p = getPowers();
  document.getElementById("hud-striker-img").src = cors;
  document.getElementById("hud-striker-ovr").textContent = String(activeStriker.ovr || 99);
  document.getElementById("hud-striker-name").textContent = activeStriker.name;
  document.getElementById("hud-striker-trait").textContent = p.aimBonusPct > 0 ? `${activeStriker.trait} • AIM +${p.aimBonusPct}%` : `${activeStriker.trait} • LVL ${game.level}`;

  const startImg = document.getElementById("start-striker-img");
  const introImg = document.getElementById("intro-striker-img");
  const introName = document.getElementById("intro-striker-name");
  if (startImg) startImg.src = cors;
  if (introImg) introImg.src = cors;
  if (introName) introName.textContent = activeStriker.name;
}

function updateKeeperAssets(idx) {
  keeperIdx = idx % KEEPER_ROSTER.length;
  activeKeeper = KEEPER_ROSTER[keeperIdx];
  const cors = toCorsUrl(activeKeeper.url, 300);
  imgs.keeper.crossOrigin = "anonymous";
  imgs.keeper.src = cors;

  const startK = document.getElementById("start-keeper-img");
  const introK = document.getElementById("intro-keeper-img");
  const introKName = document.getElementById("intro-keeper-name");
  if (startK) startK.src = cors;
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
  if (connectedAddress && VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    document.getElementById("nav-wallet-label").textContent = shortErd(connectedAddress);
    disconnectBtn?.classList.remove("hidden");
    if (hudEfooLbl) {
      hudEfooLbl.textContent = walletState.loading
        ? "..."
        : `${formatCompactEfoo(walletState.efooBalance)} $EFOO`;
    }
    hudEfooBadge?.classList.toggle("active", walletState.efooBalance >= MIN_EFOO_REQUIRED);
  } else {
    document.getElementById("nav-wallet-label").textContent = I18N_GAME[currentLang].btn_connect;
    disconnectBtn?.classList.add("hidden");
    if (hudEfooLbl) hudEfooLbl.textContent = I18N_GAME[currentLang].hud_no_wallet;
    hudEfooBadge?.classList.remove("active");
  }

  if (!card || !badge || !walletLine || !startBtn) return;

  // STATE 1: Not logged in
  if (!connectedAddress || !VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    card.classList.remove("unlocked", "insufficient");
    refreshBtn?.classList.add("hidden");
    badge.textContent = isRo
      ? "🔒 CONDIȚIE JOC: AUTENTIFICARE PORTOFEL + MIN. 1.000.000 $EFOO"
      : "🔒 ENTRY REQUIREMENT: WALLET LOGIN + MIN. 1,000,000 $EFOO";
    walletLine.innerHTML = isRo
      ? "Conectează portofelul MultiversX pentru verificarea soldului <strong>$EFOO</strong> și a NFT-urilor."
      : "Connect your MultiversX wallet to verify your <strong>$EFOO</strong> balance &amp; Club NFTs.";
    startBtn.classList.remove("locked");
    startBtn.innerHTML = `⚡ <span>${isRo ? "CONECTEAZĂ PORTOFELUL PENTRU JOC" : "CONNECT WALLET TO PLAY"}</span>`;
    return;
  }

  // STATE 2: Logged in, verifying on-chain balance
  if (walletState.loading || !walletState.verified) {
    card.classList.remove("unlocked", "insufficient");
    refreshBtn?.classList.add("hidden");
    badge.textContent = isRo
      ? "⏳ SE VERIFICĂ PORTOFELUL PE BLOCKCHAIN..."
      : "⏳ VERIFYING WALLET ON MULTIVERSX...";
    walletLine.innerHTML = isRo
      ? `Portofel: <strong>${shortErd(connectedAddress)}</strong> • Se verifică soldul $EFOO și NFT-urile...`
      : `Wallet: <strong>${shortErd(connectedAddress)}</strong> • Checking $EFOO balance &amp; NFTs...`;
    startBtn.classList.add("locked");
    startBtn.innerHTML = `⏳ <span>${isRo ? "SE VERIFICĂ PORTOFELUL..." : "CHECKING WALLET..."}</span>`;
    return;
  }

  refreshBtn?.classList.remove("hidden");

  // STATE 3: Logged in, but balance < 1,000,000 $EFOO
  if (walletState.efooBalance < MIN_EFOO_REQUIRED) {
    card.classList.remove("unlocked");
    card.classList.add("insufficient");
    const currentFormatted = Math.floor(walletState.efooBalance).toLocaleString("en-US");
    const missingFormatted = Math.max(1, Math.ceil(MIN_EFOO_REQUIRED - walletState.efooBalance)).toLocaleString("en-US");

    badge.textContent = isRo
      ? "🔒 ACCES BLOCAT — MINIM 1.000.000 $EFOO NECESAR ÎN PORTOFEL"
      : "🔒 ENTRY LOCKED — MINIMUM 1,000,000 $EFOO REQUIRED IN WALLET";
    walletLine.innerHTML = isRo
      ? `Portofel: <strong>${shortErd(connectedAddress)}</strong> • Sold: <strong style="color:#ef4444;">${currentFormatted} $EFOO</strong> • Lipsesc: <strong style="color:#ffb800;">${missingFormatted} $EFOO</strong>`
      : `Wallet: <strong>${shortErd(connectedAddress)}</strong> • Balance: <strong style="color:#ef4444;">${currentFormatted} $EFOO</strong> • Needed: <strong style="color:#ffb800;">+${missingFormatted} $EFOO</strong>`;

    startBtn.classList.add("locked");
    startBtn.innerHTML = `🔒 <span>${isRo ? "BLOCAT — CUMPĂRĂ MIN. 1M $EFOO" : "LOCKED — BUY 1,000,000+ $EFOO TO PLAY"}</span>`;
    return;
  }

  // STATE 4: Logged in AND meets >= 1,000,000 $EFOO requirement!
  card.classList.remove("insufficient");
  card.classList.add("unlocked");
  const balFormatted = Math.floor(walletState.efooBalance).toLocaleString("en-US");

  badge.textContent = isRo
    ? "✅ PORTOFEL VERIFICAT — ACCES DEBLOCAT ÎN ARENĂ!"
    : "✅ WALLET VERIFIED — STADIUM ACCESS UNLOCKED!";
  walletLine.innerHTML = isRo
    ? `Portofel: <strong>${shortErd(connectedAddress)}</strong> • Sold: <strong>${balFormatted} $EFOO</strong> • NFT: <strong>${walletState.playersCount}⚽ ${walletState.keepersCount}🧤 (${p.totalMult.toFixed(1)}x Boost)</strong>`
    : `Wallet: <strong>${shortErd(connectedAddress)}</strong> • Balance: <strong>${balFormatted} $EFOO</strong> • Squad: <strong>${walletState.playersCount}⚽ ${walletState.keepersCount}🧤 (${p.totalMult.toFixed(1)}x Boost)</strong>`;

  startBtn.classList.remove("locked");
  startBtn.innerHTML = `⚽ <span>${I18N_GAME[currentLang].btn_play_now}</span>`;
}

function refreshHudUI() {
  const p = getPowers();
  const lv = getLevelParams(game.level);

  document.getElementById("hud-mult-val").textContent = `${p.totalMult.toFixed(1)}x`;
  document.getElementById("hud-score-val").textContent = game.score.toLocaleString("en-US");
  document.getElementById("hud-striker-trait").textContent = p.aimBonusPct > 0 ? `${activeStriker.trait} • AIM +${p.aimBonusPct}%` : `${activeStriker.trait} • LVL ${game.level}`;

  const lvlEl = document.getElementById("hud-level-val");
  if (lvlEl) {
    lvlEl.textContent = String(game.level);
    lvlEl.style.color = getLevelTier(game.level).color;
  }
  const goalsEl = document.getElementById("hud-goals-val");
  if (goalsEl) {
    goalsEl.textContent = `${game.goals}/${lv.goalsNeeded}`;
    goalsEl.classList.toggle("done", game.goals >= lv.goalsNeeded);
  }

  // Shot dots (one per round of the match)
  const dotsWrap = document.getElementById("sb-shots-dots");
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    const totalDots = Math.max(game.maxRounds, game.round);
    for (let i = 0; i < totalDots; i++) {
      const span = document.createElement("span");
      span.className = "shot-dot";
      if (i < game.shotHistory.length) {
        span.classList.add(game.shotHistory[i]);
      } else if (i === game.shotHistory.length && game.phase !== "summary") {
        span.classList.add("current");
      }
      dotsWrap.appendChild(span);
    }
  }

  // Update Bottom-Right Visual Icon Slots
  document.getElementById("vp-slot-1")?.classList.toggle("unlocked", p.pCount >= 1);
  document.getElementById("vp-slot-2")?.classList.toggle("unlocked", p.pCount >= 3);
  document.getElementById("vp-slot-3")?.classList.toggle("unlocked", p.pCount >= 6);
  document.getElementById("vp-slot-keeper")?.classList.toggle("unlocked", p.kCount >= 1);
  document.getElementById("vp-slot-efoo")?.classList.toggle("unlocked", p.hasRocket);

  const shieldTag = document.getElementById("vp-shield-count");
  if (shieldTag) {
    shieldTag.textContent = game.shieldsLeft > 0 ? `${game.shieldsLeft}x SHIELD` : "SHIELD";
  }

  // Boost Modal Mini Cards
  document.getElementById("bt-card-1")?.classList.toggle("active", p.pCount >= 1 && p.pCount <= 2);
  document.getElementById("bt-card-2")?.classList.toggle("active", p.pCount >= 3 && p.pCount <= 5);
  document.getElementById("bt-card-3")?.classList.toggle("active", p.pCount >= 6);
  document.getElementById("bt-card-4")?.classList.toggle("active", p.kCount >= 1);

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
  } else {
    overlay?.classList.add("hidden");
    document.body.classList.remove("start-screen-active");
    hud?.classList.remove("start-hidden");
  }
}

// ============================================================================
// CINEMATIC INTRO & ROUND FLOW (STRICTLY GATED BY WALLET + 1,000,000 $EFOO)
// ============================================================================
function launchMatchWithIntro() {
  const isRo = currentLang === "ro";

  // 1. Must be logged in with a real MultiversX wallet
  if (!connectedAddress || !VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    setStartScreenState(true);
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    triggerGateShake();
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
    showToast(
      isRo
        ? "🔒 Conectează-ți portofelul MultiversX (minim 1.000.000 $EFOO necesar) pentru a porni jocul!"
        : "🔒 Please connect your MultiversX wallet (minimum 1,000,000 $EFOO required) to launch the game!"
    );
    return;
  }

  // 2. Wait if wallet balance is still being fetched from blockchain
  if (walletState.loading || !walletState.verified) {
    showToast(
      isRo
        ? "⏳ Se verifică soldul portofelului pe MultiversX..."
        : "⏳ Verifying your wallet balance on MultiversX..."
    );
    return;
  }

  // 3. Must hold at least 1,000,000 $EFOO in wallet
  if (!canPlayMatch()) {
    setStartScreenState(true);
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    updateEntryGateUI();
    triggerGateShake();
    showToast(
      isRo
        ? "🔒 Minim 1.000.000 $EFOO necesar în portofel! Apasă pe 'STARTER (0.035 EGLD ➔ 1.5M)' pentru deblocare instantă!"
        : "🔒 Minimum 1,000,000 $EFOO required in your wallet! Click 'STARTER (0.035 EGLD ➔ 1.5M)' to unlock immediately!"
    );
    return;
  }

  setStartScreenState(false);
  document.getElementById("summary-screen-overlay")?.classList.add("hidden");
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
  updateKeeperAssets(game.level - 1);

  game.phase = "intro";
  game.round = 1;
  game.maxRounds = SHOTS_PER_MATCH;
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
  game.shieldsLeft = p.maxShields;
  refreshHudUI();

  if (kickerEl) {
    kickerEl.textContent = `🔥 LEVEL ${game.level} • ${isRo ? tier.nameRo : tier.name} • ${isRo ? "ÎNSCRIE" : "SCORE"} ${lv.goalsNeeded}/${SHOTS_PER_MATCH}`;
    kickerEl.style.color = tier.color;
  }
  if (titleEl) titleEl.textContent = `LEVEL ${game.level} — ${isRo ? "ȘUTURI DE PEDEAPSĂ" : "PENALTY SHOOTOUT"}`;
  if (perkEl) perkEl.textContent = `⚡ ${p.totalMult.toFixed(1)}x BOOST • AIM +${p.aimBonusPct}%`;
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
      audio.playWhistle();
      startNextShotRound();
    }
  }, 85);
}

function startNextShotRound() {
  if (!canPlayMatch()) {
    setStartScreenState(true);
    updateEntryGateUI();
    return;
  }

  game.phase = "aim";
  game.isCharging = false;
  game.chargePower = 0;
  game.armed = {};
  game.activeFx = {};
  game.swipe = { active: false, pointerId: null, points: [], startTime: 0 };

  const lv = getLevelParams(game.level);
  updateKeeperAssets(game.level - 1);

  // The keeper's secret gut-feeling side for THIS shot. The 3+ NFT radar only hints at it (and bluffs ~30%).
  game.keeper.lean = Math.random() < 0.5 ? -1 : 1;
  game.keeper.leanShown = Math.random() < 0.7 ? game.keeper.lean : -game.keeper.lean;
  game.keeper.targetNx = 0;
  game.keeper.targetNy = 0;
  game.keeper.targetAngle = 0;
  game.keeper.armReach = 0;

  // Wind (from level 6) pushes the ball sideways
  game.wind = lv.windMax > 0 ? (Math.random() * 2 - 1) * lv.windMax : 0;

  refreshHudUI();
}

function consumeArmedSkills() {
  const fx = {};
  SKILLS.forEach((s) => {
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
    speed: isWeak ? 0.8 : isSweet ? 1.05 : 1.15,
    fx
  };
}

function onBallReachGoal(endScreenX, endScreenY) {
  const p = getPowers();
  const lv = getLevelParams(game.level);
  const b = game.ball;
  const fx = b.fx || {};
  const isRo = currentLang === "ro";
  const isHu = currentLang === "hu";
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
    game.streak += 1;
    game.shotHistory.push("goal");

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
      ? (isHu ? `⚡ ÁTJÁRTAD A KAPUS ESZÉT! +${pts}` : isRo ? `⚡ PĂCĂLIT! PE PICIOARE GREȘITE! +${pts}` : `⚡ WRONG-FOOTED THE KEEPER! +${pts}`)
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
      : `⚽ GOOOOL! +${pts}`;
    game.bigBannerColor = fx.power || p.hasRocket ? "#ff3b00" : (shieldTriggered || b.hitBullseye || fx.gold || b.keeperWrongFooted ? "#ffb800" : "#a8ff00");

    audio.playGoalCheer();
    spawnSparks(endScreenX, endScreenY, "#a8ff00", 55);
  } else {
    game.streak = 0;
    game.shotHistory.push("miss");
    game.shake = 6;
    const missText = {
      wide: isHu ? "↗ MELLÉ!" : (isRo ? "↗ PE LÂNGĂ POARTĂ!" : "↗ WIDE!"),
      over: isHu ? "☁️ FÖLÉ!" : (isRo ? "☁️ PESTE BARĂ!" : "☁️ OVER THE BAR!"),
      post: isHu ? "💥 KAPUFA!" : (isRo ? "💥 ÎN BARĂ!" : "💥 OFF THE POST!"),
      bar: isHu ? "💥 FELSŐLÉC!" : (isRo ? "💥 ÎN TRAVERSĂ!" : "💥 CROSSBAR!"),
      save: b.keeperAnticipated
        ? (isHu ? "🧤 A KAPUS KISZÁMÍTOTTA A SARKOT!" : isRo ? "🧤 A GHICIT COLȚUL!" : "🧤 KEEPER ANTICIPATED YOUR CORNER!")
        : b.isWeak
        ? (isHu ? "🐢 TÚL GYENGE LÖVÉS - KÖNNYŰ VÉDÉS!" : isRo ? "🐢 ȘUT PREA SLAB - PRINSĂ UȘOR!" : "🐢 TOO WEAK - EASY CATCH!")
        : (isHu ? `🧤 ${activeKeeper.name} VÉDETT!` : isRo ? `🧤 APĂRAT DE ${activeKeeper.name}!` : `🧤 SAVED BY ${activeKeeper.name}!`)
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
    if (game.round >= game.maxRounds) {
      finishMatch();
    } else {
      game.round += 1;
      startNextShotRound();
    }
  }, 1250);
}

// End of the shoot-out: VAR is ONLY offered after a failed level that ended on a miss.
// A winning finish (level cleared, or the last shot was a goal) goes straight to the summary.
function finishMatch() {
  const lv = getLevelParams(game.level);
  const cleared = game.goals >= lv.goalsNeeded;
  const endedOnWinningStreak = game.streak > 0;
  if (!cleared && !endedOnWinningStreak && !game.revivedThisMatch) {
    openVarReviveOverlay();
    return;
  }
  openSummaryModal();
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
    openSummaryModal();
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
      openSummaryModal();
    }
  }, 1000);
}

function closeVarReviveAndFinish() {
  if (game.varTimerInterval) {
    clearInterval(game.varTimerInterval);
    game.varTimerInterval = null;
  }
  document.getElementById("var-revive-overlay")?.classList.add("hidden");
  openSummaryModal();
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
  const unlocked = typeof metaUnlockedLevel === "function" ? metaUnlockedLevel() : game.level + 1;
  game.level = Math.min(MAX_LEVEL, Math.min(unlocked, game.level + 1));
  launchMatchWithIntro();
}

function openSummaryModal() {
  game.phase = "summary";
  audio.playWhistle();

  const p = getPowers();
  const lv = getLevelParams(game.level);
  const isRo = currentLang === "ro";
  const isHu = currentLang === "hu";

  const cleared = game.goals >= lv.goalsNeeded;
  game.levelCleared = cleared;
  const perfect = cleared && game.shotHistory.length > 0 && game.shotHistory.every((s) => s === "goal");

  // Level bonuses
  let bonus = 0;
  if (cleared) bonus += 2500 * game.level;
  if (perfect) bonus += 5000 * game.level;
  game.score += bonus;
  refreshHudUI();

  const whalePotential = Math.max(
    game.score,
    Math.round(game.rawBaseScore * 7.0 + Math.max(3, game.goals) * 2500)
  );

  document.getElementById("sum-score-actual").textContent = game.score.toLocaleString("en-US");
  document.getElementById("sum-score-whale").textContent = `${whalePotential.toLocaleString("en-US")} 🏆`;

  // Headline
  const titleEl = document.getElementById("sum-title");
  const kickerEl = document.getElementById("sum-kicker");
  if (titleEl) {
    titleEl.textContent = cleared
      ? (isHu
        ? `🏆 ${game.level}. SZINT TELJESÍTVE!`
        : (isRo
          ? `🏆 LEVEL ${game.level} ÎNVINS!`
          : `🏆 LEVEL ${game.level} CLEARED!`))
      : (isHu
        ? `${game.level}. SZINT SIKERTELEN`
        : (isRo
          ? `LEVEL ${game.level} ESUAT`
          : `LEVEL ${game.level} FAILED`));
    titleEl.style.color = cleared ? "#a8ff00" : "#fca5a5";
  }
  if (kickerEl) {
    const tier = getLevelTier(game.level);
    kickerEl.textContent = `🏁 ${isRo ? tier.nameRo : tier.name} • ${activeKeeper.name}`;
  }

  const lvlLine = document.getElementById("sum-level-line");
  if (lvlLine) {
    const bonusTxt = bonus > 0 ? ` • ${isHu ? "Bónusz" : (isRo ? "Bonus" : "Bonus")} <strong>+${bonus.toLocaleString("en-US")}</strong>${perfect ? " ⭐ PERFECT" : ""}` : "";
    lvlLine.innerHTML = isHu
      ? `Gólok: <strong>${game.goals}/${lv.goalsNeeded}</strong> szükséges${bonusTxt}`
      : (isRo
        ? `Goluri <strong>${game.goals}/${lv.goalsNeeded}</strong> necesare${bonusTxt}`
        : `Goals <strong>${game.goals}</strong> • needed <strong>${lv.goalsNeeded}</strong> of ${SHOTS_PER_MATCH}${bonusTxt}`);
  }

  // Marketplace callout in summary
  const sumMarketTitle = document.getElementById("sum-market-title");
  const sumMarketDesc = document.getElementById("sum-market-desc");
  if (sumMarketTitle) {
    sumMarketTitle.textContent = isHu
      ? "KÉPESSÉGEK ÚJRATÖLTÉSE (-10% CSOMAGOK)"
      : (isRo ? "REÎNCARCĂ SUPER PUTERILE (-10% PACHETE)" : "RESTOCK SUPER SKILLS (-10% PACKS)");
  }
  if (sumMarketDesc) {
    sumMarketDesc.textContent = isHu
      ? "Fogyóban a készleted? Vegyél 5x csomagot 10% kedvezménnyel a következő szinthez!"
      : (isRo ? "Reîncarcă pachete 5x cu 10% reducere pentru a bate portarul boss!" : "Refill 5x packs with 10% discount to beat the next boss keeper!");
  }

  // Buttons: next level only when cleared; otherwise retry
  const nextBtn = document.getElementById("btn-sum-next");
  const replayLbl = document.querySelector("#btn-sum-replay span");
  if (nextBtn) {
    const show = cleared && game.level < MAX_LEVEL;
    nextBtn.classList.toggle("hidden", !show);
    const nl = nextBtn.querySelector("span");
    if (nl) nl.textContent = isHu ? `KÖVETKEZŐ: ${game.level + 1}. SZINT` : (isRo ? `NIVELUL ${game.level + 1}` : `NEXT: LEVEL ${game.level + 1}`);
  }
  if (replayLbl) {
    replayLbl.textContent = cleared
      ? (isHu ? "SZINT ÚJRAJÁTSZÁSA" : (isRo ? "REJOACĂ NIVELUL" : "REPLAY LEVEL"))
      : (isHu ? "ÚJRA PRÓBÁLOM" : (isRo ? "ÎNCEARCĂ DIN NOU" : "RETRY LEVEL"));
  }

  // Progress, leaderboard, daily streak
  const info =
    typeof metaOnMatchEnd === "function"
      ? metaOnMatchEnd({ level: game.level, score: game.score, goals: game.goals, cleared, perfect })
      : null;
  const rankLine = document.getElementById("sum-rank-line");
  if (rankLine) {
    rankLine.textContent = "";
    if (info && info.rankPromise) {
      info.rankPromise.then((txt) => {
        if (txt && game.phase === "summary") rankLine.textContent = txt;
      });
    }
    if (info && info.unlockedNow) {
      rankLine.textContent = isHu
        ? `🔓 ${info.newLevel}. SZINT FELOLDVA!`
        : (isRo ? `🔓 LEVEL ${info.newLevel} DEBLOCAT!` : `🔓 LEVEL ${info.newLevel} UNLOCKED!`);
    }
  }

  const fomoLine = document.getElementById("sum-fomo-line");
  if (fomoLine) {
    if (walletState.efooBalance < 5000000) {
      const tier2Score = Math.round(game.score * 2.5);
      fomoLine.innerHTML = isHu
        ? `⚡ <strong>TIER BÓNUSZ HIÁNY:</strong> <strong>5M $EFOO-val (Rocket Striker)</strong> ez a menet <strong>${tier2Score.toLocaleString("hu-HU")} pont (+2.5x)</strong> lett volna!<br />🎁 <em>Első vásárlás? Válaszd a 0.035 EGLD Starter Csomagot és kapsz 1 500 000 $EFOO-t (+50% Bónusz a Széfből)!</em>`
        : (isRo
          ? `⚡ <strong>REGRET DE TIER:</strong> Cu <strong>5M $EFOO (Rocket Striker)</strong>, acest meci ar fi avut <strong>${tier2Score.toLocaleString("en-US")} puncte (+2.5x)</strong>!<br />🎁 <em>Primă achiziție? Ia Starter Pack de 0.035 EGLD și primești 1.500.000 $EFOO (+50% Bonus din Seif)!</em>`
          : `⚡ <strong>TIER REGRET:</strong> With <strong>5M $EFOO (Rocket Striker)</strong>, this run would score <strong>${tier2Score.toLocaleString("en-US")} pts (+2.5x)</strong>!<br />🎁 <em>First time? Buy the 0.035 EGLD Starter Pack to get 1,500,000 $EFOO (+50% Bonus from Stadium Vault)!</em>`);
    } else {
      fomoLine.innerHTML = isHu
        ? `🏆 <strong>PRO CSAPAT KVALIFIKÁLVA!</strong> <strong>${game.goals} gólt</strong> lőttél <strong>${p.totalMult.toFixed(1)}x</strong> bónusszal! Vásárolj szuperképességeket a Boltban, vagy szerezz több NFT-t a <strong>15.0x</strong> szorzóért!`
        : (isRo
          ? `🏆 <strong>ECHIPĂ PRO CALIFICATĂ!</strong> Ai marcat <strong>${game.goals} goluri</strong> cu <strong>${p.totalMult.toFixed(1)}x</strong> boost! Cumpără skill-uri cu $EFOO sau mintează mai mulți jucători pt. <strong>11.0x</strong>!`
          : `🏆 <strong>PRO SQUAD QUALIFIED!</strong> You scored <strong>${game.goals} goals</strong> at <strong>${p.totalMult.toFixed(1)}x</strong> boost! Buy super skills with $EFOO or mint more NFTs to reach <strong>11.0x</strong>!`);
    }
  }

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

  function onPointerDown(e) {
    if (!canPlayMatch()) return;
    if (game.phase !== "aim") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

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

    if (!game.swipe || !game.swipe.active || game.swipe.pointerId !== e.pointerId) {
      if (game.phase === "aim" && e.pointerType === "mouse") {
        updateAimFromPointer(pos.x, pos.y);
      }
      return;
    }

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
    const isKeeperFrozen = !!(fx.freeze || game.armed.freeze);
    const keeperSpeedMul = isKeeperFrozen ? 0.25 : 1.0;
    if (game.phase === "aim" || game.phase === "charging") {
      game.keeper.nx = Math.sin(Date.now() * 0.0045 * keeperSpeedMul) * (0.18 * (isKeeperFrozen ? 0.35 : 1.0));
      game.keeper.ny = Math.abs(Math.cos(Date.now() * 0.009 * keeperSpeedMul)) * (0.05 * (isKeeperFrozen ? 0.35 : 1.0));
      game.keeper.bodyAngle = Math.sin(Date.now() * 0.0045 * keeperSpeedMul) * (0.08 * (isKeeperFrozen ? 0.3 : 1.0));
      game.keeper.armReach = (0.25 + Math.sin(Date.now() * 0.008 * keeperSpeedMul) * 0.1) * (isKeeperFrozen ? 0.35 : 1.0);
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
    ctx.save();
    ctx.translate(bx, by);
    ctx.strokeStyle = "#ffb800";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ffb800";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 184, 0, 0.22)";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffb800";
    ctx.font = "800 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("⭐ 2x", 0, 4);
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

    // 7. LIVE 3D CURVED LASER TRAJECTORY & CROSSHAIR (When Aiming or Charging)
    const curAimNx = game.aimNx + game.swayX;
    const curAimNy = game.aimNy + game.swayY;
    const aimScreenX = g.cx + curAimNx * (g.goalW * 0.5);
    const aimScreenY = g.goalBottom - curAimNy * g.goalH;

    if (game.phase === "aim" || game.phase === "charging") {
      const curveMul = fx.curve ? 1.6 : 1.0;
      const curveBend = (p.hasCurve ? 110 : 45) * curveMul * (curAimNx >= 0 ? -1 : 1);
      const ctrlX = (g.spotX + aimScreenX) * 0.5 + curveBend;
      const ctrlY = (g.spotY + aimScreenY) * 0.5 - 65;

      // Draw glowing trajectory arc dots
      for (let i = 1; i <= 14; i++) {
        const u = i / 15;
        const iu = 1 - u;
        const tx = iu * iu * g.spotX + 2 * iu * u * ctrlX + u * u * aimScreenX;
        const ty = iu * iu * g.spotY + 2 * iu * u * ctrlY + u * u * aimScreenY;
        let arcColor = "#a8ff00";
        if (fx.power || p.hasRocket) arcColor = "#ff5500";
        else if (fx.curve) arcColor = "#c084fc";
        else if (fx.freeze) arcColor = "#67e8f9";
        else if (fx.gold) arcColor = "#ffb800";
        ctx.fillStyle = arcColor;
        ctx.globalAlpha = 0.25 + u * 0.65;
        ctx.beginPath();
        ctx.arc(tx, ty, (1 - u * 0.5) * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw Crosshair Reticle at Aim Point with Out-of-bounds Detection
      ctx.save();
      ctx.translate(aimScreenX, aimScreenY);
      const isOutOfBounds = Math.abs(curAimNx) > 1.0 || curAimNy > 1.0 || curAimNy < 0;
      ctx.strokeStyle = isOutOfBounds ? "#ef4444" : (fx.steady ? "#38bdf8" : "#a8ff00");
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.moveTo(-24, 0);
      ctx.lineTo(-10, 0);
      ctx.moveTo(10, 0);
      ctx.lineTo(24, 0);
      ctx.moveTo(0, -24);
      ctx.lineTo(0, -10);
      ctx.moveTo(0, 10);
      ctx.lineTo(0, 24);
      ctx.stroke();

      if (isOutOfBounds) {
        ctx.fillStyle = "#ef4444";
        ctx.font = "800 10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(curAimNy > 1.0 ? "OVER BAR!" : "WIDE!", 0, -28);
      } else if (fx.steady) {
        ctx.fillStyle = "#38bdf8";
        ctx.font = "800 10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("🎯 STEADY", 0, -28);
      }
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
    } else if (game.phase === "aim" && (!game.swipe || !game.swipe.active)) {
      // 7C. PULSING SWIPE TUTORIAL GUIDE ARROW & INSTRUCTION PILL
      const isRo = currentLang === "ro";
      const isHu = currentLang === "hu";
      const guideTxt = isHu
        ? "👆 LENDÍTSD MEG A LABDÁT A KAPU FELÉ!"
        : (isRo ? "👆 TRAGE SPRE POARTĂ PENTRU ȘUT!" : "👆 SWIPE FROM BALL TO GOAL TO SHOOT!");

      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.0055);
      const arrowTopY = g.spotY - 72 - pulse * 28;

      ctx.save();
      // Dashed guide beam
      ctx.strokeStyle = `rgba(168, 255, 0, ${0.35 + pulse * 0.45})`;
      ctx.lineWidth = 2.8;
      ctx.setLineDash([7, 6]);
      ctx.lineDashOffset = -Date.now() * 0.025;
      ctx.beginPath();
      ctx.moveTo(g.spotX, g.spotY - 22);
      ctx.lineTo(g.spotX, arrowTopY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      ctx.fillStyle = `rgba(168, 255, 0, ${0.65 + pulse * 0.35})`;
      ctx.shadowColor = "#a8ff00";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(g.spotX, arrowTopY - 10);
      ctx.lineTo(g.spotX - 8, arrowTopY + 3);
      ctx.lineTo(g.spotX + 8, arrowTopY + 3);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Instruction pill under the ball
      ctx.font = "800 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      const pillW = ctx.measureText(guideTxt).width + 30;
      const pillY = Math.min(H - 42, g.spotY + 32);

      ctx.fillStyle = "rgba(4, 12, 7, 0.88)";
      ctx.strokeStyle = `rgba(168, 255, 0, ${0.45 + pulse * 0.5})`;
      ctx.lineWidth = 1.3;
      ctx.shadowColor = "rgba(168, 255, 0, 0.3)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(g.spotX - pillW / 2, pillY, pillW, 26, 13);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#a8ff00";
      ctx.fillText(guideTxt, g.spotX, pillY + 17);
      ctx.restore();
    }

    // 8. FOREGROUND 3D STRIKER NFT HOLOGRAM ON PITCH (Never overlaps ball or skills dock)
    const strikerOffsetX = (H > W) ? Math.min(130, W * 0.30) : 135;
    drawPitchStrikerHologram(ctx, g.spotX - strikerOffsetX + game.strikerLunge, g.spotY - 28 - game.strikerLunge * 0.4);

    // 9. RADIAL POWER CHARGE RING, & FLYING ROCKET BALL
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
      b.t += 0.044;
      const u = Math.min(1, b.t);
      const iu = 1 - u;

      const endX = g.cx + b.aimNx * (g.goalW * 0.5);
      const endY = g.goalBottom - b.aimNy * g.goalH;
      const ctrlX = (g.spotX + endX) * 0.5 + b.curveIntensity * 95;
      const ctrlY = (g.spotY + endY) * 0.5 - 75;

      const bx = iu * iu * g.spotX + 2 * iu * u * ctrlX + u * u * endX;
      const by = iu * iu * g.spotY + 2 * iu * u * ctrlY + u * u * endY;
      const rad = 30 * (1 - u * 0.48);

      // Rocket Fireball Flames & Sparks
      if (b.isSweet || p.hasRocket || fx.power) {
        for (let k = 0; k < 3; k++) {
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

      drawBallSprite(ctx, bx, by, rad, u * 18);
      if (b.isTwin) {
        drawBallSprite(ctx, bx + Math.sin(u * 9) * 36, by - 14, rad * 0.9, -u * 18);
      }

      if (b.t >= 1) {
        b.active = false;
        onBallReachGoal(endX, endY);
      }
    } else if (game.phase === "aim" || game.phase === "charging") {
      const pulse = 30 + Math.sin(Date.now() * 0.008) * 1.8;
      drawBallSprite(ctx, g.spotX, g.spotY, pulse, Date.now() * 0.002);
    }

    // 10. RENDER PARTICLES
    for (let i = game.particles.length - 1; i >= 0; i--) {
      const pt = game.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.03;
      if (pt.alpha <= 0) {
        game.particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

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

  // Keeper Torso / Holographic GOALKEEPER-cb9e3e NFT Frame
  ctx.fillStyle = "#091910";
  ctx.strokeStyle = "#ffb800";
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

  // Keeper Jersey Number Tag
  ctx.fillStyle = "#ffb800";
  ctx.font = "800 9px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(`#${activeKeeper.jersey || "51"}`, 0, -40);

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

// Foreground 3D Striker NFT Hologram next to Penalty Spot
function drawPitchStrikerHologram(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Turf Neon Ring beneath Striker
  ctx.strokeStyle = "rgba(168, 255, 0, 0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 52, 46, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Holographic FUT Card Frame
  ctx.shadowColor = "rgba(168, 255, 0, 0.5)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#07150d";
  ctx.strokeStyle = "#a8ff00";
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

  ctx.fillStyle = "#a8ff00";
  ctx.font = "800 9px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(activeStriker.name.slice(-4), 0, 38);

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
  return window.location.origin + window.location.pathname;
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

function sendExtensionMessage(type, data = "") {
  return new Promise((resolve, reject) => {
    const responseTypeMap = {
      connect: ["connectResponse", "loginResponse"],
      signTransactions: ["signTransactionsResponse", "signTransactionResponse"],
      logout: ["logoutResponse"]
    };
    const expectedTypes = responseTypeMap[type] || [type + "Response"];

    const timer = setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      reject(new Error("Extension response timed out"));
    }, 60000);

    function handleMessage(event) {
      if (event.source !== window || !event.data) return;
      const msg = event.data;
      if (!msg || msg.target !== "erdw-contentScript") return;
      if (expectedTypes.includes(msg.type)) {
        clearTimeout(timer);
        window.removeEventListener("message", handleMessage);
        if (msg.error || (msg.data && msg.data.error)) {
          reject(new Error(msg.error || msg.data.error));
        } else {
          resolve(msg.data);
        }
      } else if (msg.type === "cancelResponse" || msg.type === "errorResponse") {
        clearTimeout(timer);
        window.removeEventListener("message", handleMessage);
        reject(new Error(msg.error || "User cancelled"));
      }
    }

    window.addEventListener("message", handleMessage);
    window.postMessage({ target: "erdw-inpage", type, data }, "*");
  });
}

async function signWithExtension(preparedTxs) {
  const extInputTxs = preparedTxs.map((t) => ({
    ...t,
    data: toBase64Data(t.data)
  }));

  // Method 1: direct method if exposed by modern extension provider
  if (window.elrondWallet && typeof window.elrondWallet.signTransactions === "function") {
    try {
      const res = await window.elrondWallet.signTransactions(extInputTxs);
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied")) {
        throw e;
      }
      console.warn("Direct window.elrondWallet.signTransactions failed, trying postMessage bridge:", e);
    }
  }

  // Method 2: standard inpage postMessage bridge
  const signedRes = await sendExtensionMessage("signTransactions", {
    from: connectedAddress,
    transactions: extInputTxs
  });

  return signedRes;
}

async function connectDefiExtension() {
  if (!window.elrondWallet) {
    window.open(
      "https://chromewebstore.google.com/detail/multiversx-defi-wallet/dngmlblcodfobpdpecaadgfbcggfjfnm",
      "_blank"
    );
    return;
  }
  try {
    const res = await sendExtensionMessage("connect", {});
    const addr = typeof res === "string" ? res : res && res.address ? res.address : "";
    if (addr && addr.startsWith("erd1")) {
      connectWithAddress(addr, "extension");
      showToast(
        currentLang === "ro"
          ? `✅ Conectat prin MultiversX DeFi Extension (${shortErd(addr)})!`
          : `✅ Connected via MultiversX DeFi Extension (${shortErd(addr)})!`
      );
    }
  } catch (err) {
    console.warn("Extension connect cancelled or failed:", err);
  }
}

function connectWithAddress(address, provider = "webwallet") {
  const clean = (address || "").trim();
  if (!clean.startsWith("erd1") || clean.length < 40) return;
  if (!VALID_WALLET_PROVIDERS.includes(provider)) return;

  if (provider === "webwallet" && typeof window !== "undefined" && window.elrondWallet) {
    provider = "extension";
  }

  connectedAddress = clean;
  connectedProvider = provider;
  localStorage.setItem("efoo_wallet_address", clean);
  localStorage.setItem("efoo_wallet_provider", provider);
  document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
  document.getElementById("nav-wallet-label").textContent = shortErd(clean);
  fetchWalletNftsAndBalance(clean);
}

function disconnectWallet() {
  connectedAddress = "";
  connectedProvider = "";
  wcSessionTopic = "";
  pendingGateAction = null;
  localStorage.removeItem("efoo_wallet_address");
  localStorage.removeItem("efoo_wallet_provider");
  localStorage.removeItem("efoo_wc_topic");

  walletState = {
    loading: false,
    verified: false,
    shard: 0,
    nonce: 0,
    efooBalance: 0,
    playersCount: 0,
    keepersCount: 0,
    ownedNfts: []
  };

  setStartScreenState(true);
  document.getElementById("intro-cinematic-overlay")?.classList.add("hidden");
  document.getElementById("summary-screen-overlay")?.classList.add("hidden");
  updateStrikerCardAssets(0);
  refreshHudUI();
}

async function fetchWalletNftsAndBalance(address) {
  if (!address) return;
  walletState.loading = true;
  updateEntryGateUI();

  try {
    const [accRes, tokRes, pRes, kRes, nftsRes] = await Promise.all([
      fetch(`https://api.multiversx.com/accounts/${address}`),
      fetch(`https://api.multiversx.com/accounts/${address}/tokens?identifiers=EFOO-8fe2d4`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=EFOOTBALL-91a4eb`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=GOALKEEPER-cb9e3e`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts?collections=EFOOTBALL-91a4eb,GOALKEEPER-cb9e3e&size=20`)
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
    walletState.ownedNfts = nftsRes.ok ? await nftsRes.json() : [];
    walletState.verified = true;
    walletState.loading = false;

    const p = getPowers();
    game.shieldsLeft = p.maxShields;
    updateStrikerCardAssets(0);
    refreshHudUI();

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
  for (const tx of signedTxs) {
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
      signature: String(tx.signature)
    };
    if (tx.options !== undefined && tx.options !== null && Number(tx.options) !== 0) {
      payload.options = Number(tx.options);
    }
    if (tx.guardian) payload.guardian = tx.guardian;
    if (tx.guardianSignature) payload.guardianSignature = tx.guardianSignature;

    const res = await fetch("https://api.multiversx.com/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`MultiversX broadcast error: ${errBody}`);
    }
    const resData = await res.json();
    if (resData.txHash) hashes.push(resData.txHash);
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
  try {
    const accRes = await fetch(`https://api.multiversx.com/accounts/${connectedAddress}`);
    if (accRes.ok) {
      const a = await accRes.json();
      walletState.nonce = Number(a.nonce || 0);
      walletState.shard = Number(a.shard || 0);
    }
  } catch (e) {
    console.warn("Using cached nonce:", e);
  }

  const preparedTxs = txList.map((tx, idx) => ({
    nonce: walletState.nonce + idx,
    value: String(tx.value || "0"),
    receiver: tx.receiver,
    sender: connectedAddress,
    gasPrice: 1000000000,
    gasLimit: Number(tx.gasLimit || 50000000),
    data: tx.data || "",
    chainID: "1",
    version: 1
  }));

  // PATH A: MultiversX DeFi Wallet Extension (In-browser popup, ZERO redirects!)
  if (connectedProvider === "extension" || (window.elrondWallet && connectedProvider !== "xportal")) {
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
          data: preparedTxs[idx].data,
          dataIsBase64: false
        }));

        const hashes = await broadcastSignedTransactions(formattedSigned);
        if (hashes.length > 0) {
          showToast(
            isRo
              ? `✅ Tranzacție trimisă! (${hashes[0].slice(0, 10)}...) Se actualizează jocul...`
              : `✅ Transaction broadcasted! (${hashes[0].slice(0, 10)}...) Updating game...`,
            `https://explorer.multiversx.com/transactions/${hashes[0]}`
          );
          setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 3500);
          setTimeout(() => fetchWalletNftsAndBalance(connectedAddress), 8000);
        }
      }
      return;
    } catch (err) {
      console.warn("Extension sign notice:", err);
      showToast(
        isRo
          ? "⚠️ Semnarea tranzacției în extensie a fost anulată."
          : "⚠️ Extension transaction signing was cancelled."
      );
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

function buyStarterPackOnChain() {
  const amt = 0.035;
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
      receiver: CONTRACTS.RESERVE_VAULT,
      value: "0",
      gasLimit: 6000000,
      data: `ESDTTransfer@${tHex}@${aHex}@${strToHex("reviveMatch")}`
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

function applyLang(lang) {
  currentLang = (lang === "hu" || lang === "ro") ? lang : "en";
  localStorage.setItem("efoo_lang", currentLang);
  const langLabel = document.getElementById("lang-label");
  if (langLabel) langLabel.textContent = currentLang.toUpperCase();
  const dict = I18N_GAME[currentLang] || I18N_GAME.en;
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
    // 10% discount on multi-item packs! (e.g. 5x)
    return Math.round(baseCost * 0.90);
  }
  return baseCost;
}

function buySkillWithEfoo(skillId, count = 1) {
  const s = SKILLS.find((x) => x.id === skillId);
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

  const inv = getSkillsInventory();
  inv[skillId] = (inv[skillId] || 0) + count;
  saveSkillsInventory(inv);

  audio.playWhistle();

  const skillName = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
  const discountNote = count > 1 ? (isHu ? " (🔥 10% KEDVEZMÉNNYEL!)" : (isRo ? " (🔥 -10% REDUCERE!)" : " (🔥 10% OFF!)")) : "";
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
  if (game.phase !== "aim" && game.phase !== "charging") return;
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
  const inv = getSkillsInventory();
  row.innerHTML = "";
  const isHu = currentLang === "hu";
  const isRo = currentLang === "ro";

  SKILLS.forEach((s) => {
    const count = inv[s.id] || 0;
    const isArmed = !!game.armed[s.id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `skill-slot-btn ${isArmed ? "armed" : ""} ${count <= 0 ? "empty" : ""}`;
    const sName = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
    const sDesc = isHu ? s.descHu : (isRo ? s.descRo : s.desc);
    btn.title = `${sName}: ${sDesc} (${count} owned)`;
    btn.innerHTML = `
      <span class="skill-slot-icon">${s.icon}</span>
      <span class="skill-slot-name">${isArmed ? (isHu ? "AKTÍV!" : "ARMED!") : sName.split(" ")[0]}</span>
      <span class="skill-slot-count">${count}</span>
    `;
    btn.addEventListener("click", () => armSkill(s.id));
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
  SKILLS.forEach((s) => {
    const count = inv[s.id] || 0;
    const card = document.createElement("div");
    card.className = `skill-shop-card ${highlightSkillId === s.id ? "just-bought" : ""}`;
    const name = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
    const desc = isHu ? s.descHu : (isRo ? s.descRo : s.desc);
    const singlePrice = (s.price / 1000).toFixed(0);
    const packPrice5 = (getSkillPackPrice(s, 5) / 1000).toFixed(0);
    const ownedText = isHu ? "Birtokolt" : (isRo ? "Deținute" : "Owned");
    const discountLabel = isHu ? "-10% KEDVEZMÉNY" : (isRo ? "-10% REDUCERE" : "10% OFF");
    const boughtFlash = isHu ? `✅ +${highlightCount}x SIKERES VÉTEL!` : (isRo ? `✅ +${highlightCount}x CUMPĂRAT!` : `✅ +${highlightCount}x PURCHASED!`);

    card.innerHTML = `
      <div class="ssc-info">
        <div class="ssc-title" style="color:${s.color};">
          <span>${s.icon}</span>
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

const DEFAULT_LEADERBOARD = [
  { rank: 1, address: "erd1gyw9wtsjcg62mdrkxym3l4t3qelf83mq85whefp979h7pzmjm0zq96j8gq", herotag: "@hlnagy", level: 20, goals: 5, score: 74200, date: "Today" },
  { rank: 2, address: "erd1k8w7y5ftg2uax8v8ng8p5azjw96zzfgky9v3fydtpe2xwdz0007q3hl9z8", herotag: "", level: 19, goals: 5, score: 68500, date: "Today" },
  { rank: 3, address: "erd1zs55shr6trx5em9t60pnzwjdaak8atk0dpxzkuq7n4h4r4ejmthqjp6g44", herotag: "", level: 18, goals: 4, score: 59300, date: "Today" },
  { rank: 4, address: "erd1uaw4x3kretddfqx79qvvta9l29sdq7ad6lygavgynlq5mc52w0hqfzczm7", herotag: "@augustintr", level: 16, goals: 4, score: 51200, date: "Yesterday" },
  { rank: 5, address: "erd1qzm0h502r4x9uslqhfdjxrkmrwtq5qtle57queakzz6majydu3nswj6shc", herotag: "@digitalmoney", level: 15, goals: 4, score: 46800, date: "Yesterday" },
  { rank: 6, address: "erd1q4rrqj2fragmkz7x2jgpqy7svsunwd33hkl69v7h62nlwum9qunq3pllj3", herotag: "@janhunedoara", level: 14, goals: 3, score: 41000, date: "2 days ago" },
  { rank: 7, address: "erd1370z0cuvpn6826ffqg86n438a29r54f8m6940a4g322u7eeyzru87vkj", herotag: "", level: 13, goals: 3, score: 38200, date: "2 days ago" },
  { rank: 8, address: "erd14zpeqacvvt8mlyrqudcv0c9r9d28s7q4350h7602xwt8r3j3wzjlx6pj", herotag: "@chuckszilard", level: 12, goals: 3, score: 35400, date: "2 days ago" },
  { rank: 9, address: "erd136yy3cseqx6e0m8n8a54n8a385f096l863r3t700k7t9y3q36mtrv8", herotag: "@souleymaz", level: 11, goals: 3, score: 32600, date: "3 days ago" },
  { rank: 10, address: "erd14a9dmrpqf2x33x5k68p6z3x7v0w987y6q5r423a2b1c0d9e8788zrk", herotag: "@quantumarun", level: 10, goals: 3, score: 29800, date: "3 days ago" }
];

function getLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_LEADERBOARD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].address && !parsed[0].name?.includes("Pelé") && !parsed[0].name?.includes("DegenStriker")) {
        return parsed;
      }
    }
  } catch (e) {}
  try {
    localStorage.setItem(STORAGE_LEADERBOARD, JSON.stringify(DEFAULT_LEADERBOARD));
  } catch (e) {}
  return [...DEFAULT_LEADERBOARD];
}

function recordMatchToLeaderboard(score, goals, level) {
  if (score <= 0) return null;
  const list = getLeaderboard();
  const playerAddr = connectedAddress || "erd1gyw9wtsjcg62mdrkxym3l4t3qelf83mq85whefp979h7pzmjm0zq96j8gq";

  let herotag = "";
  const rawTag = walletState.herotag || walletState.username || "";
  if (rawTag) {
    const clean = rawTag.replace(/\.elrond$/, "");
    herotag = clean.startsWith("@") ? clean : `@${clean}`;
  }

  const entry = {
    rank: 0,
    address: playerAddr,
    herotag: herotag,
    nickname: herotag ? "" : getDeterministicFootballNickname(playerAddr),
    level,
    goals,
    score,
    date: "Just now"
  };

  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });
  const top10 = list.slice(0, 10);
  try {
    localStorage.setItem(STORAGE_LEADERBOARD, JSON.stringify(top10));
  } catch (e) {}
  const found = top10.find((x) => x === entry);
  return found ? found.rank : null;
}

function renderLeaderboardModal() {
  const tbody = document.getElementById("lb-table-body");
  if (!tbody) return;
  const list = getLeaderboard();
  tbody.innerHTML = "";

  list.forEach((row) => {
    const tr = document.createElement("tr");
    const isHero = !!(row.herotag && row.herotag.trim().length > 0);
    const shortAddr = shortErd(row.address);
    const displayName = isHero
      ? `<strong class="herotag-name" style="color:#a8ff00; text-shadow:0 0 10px rgba(168,255,0,0.5);">${escapeHtml(row.herotag)}</strong>`
      : `<span class="generated-nickname" style="color:#94a3b8; font-style:italic;">${escapeHtml(row.nickname || row.name || getDeterministicFootballNickname(row.address))}</span>`;

    tr.innerHTML = `
      <td><strong>${row.rank === 1 ? "🥇 1" : row.rank === 2 ? "🥈 2" : row.rank === 3 ? "🥉 3" : `#${row.rank}`}</strong></td>
      <td>
        ${displayName}
        <small style="color:#64748b; font-size:0.68rem; margin-left:6px;">(${shortAddr})</small>
      </td>
      <td><span style="color:#38bdf8; font-weight:800;">LVL ${row.level}</span></td>
      <td>⚽ ${row.goals}/5</td>
      <td><strong style="color:#a8ff00;">${row.score.toLocaleString("en-US")}</strong></td>
      <td style="color:#94a3b8; font-size:0.7rem;">${row.date}</td>
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

  if (cleared && level >= curUnlocked && curUnlocked < MAX_LEVEL) {
    newLevel = curUnlocked + 1;
    unlockedNow = true;
    try {
      localStorage.setItem(STORAGE_UNLOCKED_LEVEL, String(newLevel));
    } catch (e) {}
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
  if (connectedAddress && typeof window !== "undefined" && window.elrondWallet && connectedProvider !== "xportal") {
    connectedProvider = "extension";
    localStorage.setItem("efoo_wallet_provider", "extension");
  }
  checkUrlWalletCallbacks().then((handledLogin) => {
    if (!handledLogin && connectedAddress && VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
      document.getElementById("nav-wallet-label").textContent = shortErd(connectedAddress);
      fetchWalletNftsAndBalance(connectedAddress);
    }
  });

  updateStrikerCardAssets(0);
  updateKeeperAssets(0);
  applyLang(currentLang);
  refreshHudUI();
  setStartScreenState(true);
  initFullscreenStadiumCanvas();

  // Start, Replay & Close Summary buttons
  const closeSummaryModal = () => {
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    if (!canPlayMatch()) {
      setStartScreenState(true);
      updateEntryGateUI();
      return;
    }
    const p = getPowers();
    game.round = 1;
    game.shotHistory = [];
    game.goals = 0;
    game.streak = 0;
    game.score = 0;
    game.rawBaseScore = 0;
    game.shieldsLeft = p.maxShields;
    startNextShotRound();
  };

  document.getElementById("btn-start-match")?.addEventListener("click", launchMatchWithIntro);
  document.getElementById("btn-sum-replay")?.addEventListener("click", launchMatchWithIntro);
  document.getElementById("close-summary-modal-btn")?.addEventListener("click", closeSummaryModal);
  document.getElementById("summary-screen-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "summary-screen-overlay") {
      closeSummaryModal();
    }
  });

  // Click FUT Striker Card to cycle active NFT
  document.getElementById("fut-striker-dock")?.addEventListener("click", () => {
    updateStrikerCardAssets(strikerIdx + 1);
  });

  // Top bar $EFOO balance pill opens Boost/Buy modal or triggers buy
  document.getElementById("hud-efoo-badge")?.addEventListener("click", () => {
    document.getElementById("boost-modal-overlay")?.classList.remove("hidden");
  });

  // Disconnect Wallet button
  document.getElementById("disconnect-wallet-btn")?.addEventListener("click", disconnectWallet);

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
      if (!document.getElementById("summary-screen-overlay")?.classList.contains("hidden")) {
        closeSummaryModal();
      }
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
    const txt = `⚽ Scored ${game.goals} goals & ${game.score.toLocaleString()} pts (${p.totalMult.toFixed(1)}x NFT Boost) in #EFOO FOMO Arena on #MultiversX! 🔥\n\nPlay now: https://efoo.optibase.ro/game.html\n@EFootball_X`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(txt)}`, "_blank");
  });

  // Wallet Modal
  document.getElementById("open-wallet-modal-btn")?.addEventListener("click", () => {
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
  });
  document.getElementById("close-wallet-modal-btn")?.addEventListener("click", () => {
    document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
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
    renderLeaderboardModal();
    document.getElementById("leaderboard-modal-overlay")?.classList.remove("hidden");
  };
  const closeLeaderboard = () => document.getElementById("leaderboard-modal-overlay")?.classList.add("hidden");
  document.getElementById("open-ranks-btn")?.addEventListener("click", openLeaderboard);
  document.getElementById("close-ranks-modal-btn")?.addEventListener("click", closeLeaderboard);
  document.getElementById("lb-play-btn")?.addEventListener("click", () => {
    closeLeaderboard();
    launchMatchWithIntro();
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

  // Super Skills Shop & Marketplace Modal
  document.getElementById("open-skills-shop-btn")?.addEventListener("click", () => openSkillsShopModal("skills"));
  document.getElementById("close-skills-shop-btn")?.addEventListener("click", closeSkillsShopModal);
  document.getElementById("skills-shop-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "skills-shop-modal-overlay") closeSkillsShopModal();
  });

  // Start Screen & Summary Screen Marketplace Triggers (INDÍTÁS ELŐTT & JÁTÉK VÉGZETE UTÁN)
  document.getElementById("start-open-store-btn")?.addEventListener("click", () => openSkillsShopModal("skills"));
  document.getElementById("btn-sum-open-store")?.addEventListener("click", () => openSkillsShopModal("skills"));
  document.getElementById("btn-sum-skills-shop")?.addEventListener("click", () => openSkillsShopModal("skills"));

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
      if (!document.getElementById("summary-screen-overlay")?.classList.contains("hidden")) {
        closeSummaryModal();
      }
      closeBoost();
      closeLeaderboard();
      closeStreak();
      closeSkillsShopModal();
      closeLevels();
      document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
    }
  });

  // 90+5' Timer
  setInterval(() => {
    game.fomoSeconds = game.fomoSeconds > 0 ? game.fomoSeconds - 1 : 300;
    const m = String(Math.floor(game.fomoSeconds / 60)).padStart(2, "0");
    const s = String(game.fomoSeconds % 60).padStart(2, "0");
    const el = document.getElementById("fomo-countdown");
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
});
