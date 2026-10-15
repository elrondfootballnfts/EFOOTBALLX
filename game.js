// ============================================================================
// EFOO FOMO — FULLSCREEN 60FPS 3D-PERSPECTIVE ARCADE ENGINE (game.js)
// ============================================================================

const MIN_EFOO_REQUIRED = 1000000; // Minimum 1,000,000 $EFOO required to play
const VALID_WALLET_PROVIDERS = ["xportal", "extension", "webwallet"];

const I18N_GAME = {
  en: {
    btn_exit: "EXIT",
    hud_mult: "BOOST",
    hud_score: "SCORE",
    hud_no_wallet: "MIN 1M $EFOO",
    btn_connect: "CONNECT",
    hint_switch_nft: "🔄 Click to switch NFT",
    aim_prompt: "🎯 POINT IN GOAL • HOLD & RELEASE CLICK (OR SPACE) TO CURVE & SHOOT!",
    btn_boost: "BOOST",
    step_1: "Aim & Hold to Curve",
    step_2: "More NFTs = <strong>Up to 11x & Radar</strong>",
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
    btn_mint_nft: "MINT NFT (0.08 EGLD)"
  },
  ro: {
    btn_exit: "IEȘIRE",
    hud_mult: "BOOST",
    hud_score: "SCOR",
    hud_no_wallet: "MIN 1M $EFOO",
    btn_connect: "PORTOFEL",
    hint_switch_nft: "🔄 Click pt. alt NFT",
    aim_prompt: "🎯 ȚINTEȘTE ÎN POARTĂ • ȚINE APĂSAT & ELIBEREAZĂ (CLICK / SPACE) PENTRU ȘUT!",
    btn_boost: "BOOST",
    step_1: "Țintește & Ține Apăsat",
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
    btn_mint_nft: "MINTEAZĂ NFT (0.08 EGLD)"
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
// NFT QUANTITY & TOKEN POWER-UP CALCULATOR
// ============================================================================
function getPowers() {
  const pCount = walletState.playersCount;
  const kCount = walletState.keepersCount;
  const efoo = walletState.efooBalance;

  let winPct = 58;
  let mult = 1.0;
  let hasCurve = false;
  let hasRadar = false;
  let hasTwinBall = false;

  if (pCount >= 6) {
    winPct = 92;
    mult = 7.0;
    hasCurve = true;
    hasRadar = true;
    hasTwinBall = true;
  } else if (pCount >= 3) {
    winPct = 82;
    mult = 4.0;
    hasCurve = true;
    hasRadar = true;
  } else if (pCount >= 1) {
    winPct = 72;
    mult = 2.0;
    hasCurve = true;
  }

  const maxShields = kCount >= 2 ? 2 : kCount >= 1 ? 1 : 0;
  const keeperMult = kCount >= 2 ? 4.0 : kCount >= 1 ? 2.0 : 0;
  const hasRocket = efoo >= MIN_EFOO_REQUIRED;
  const rocketPts = efoo >= 10000000 ? 3000 : hasRocket ? 1000 : 0;

  return {
    pCount,
    kCount,
    efoo,
    winPct,
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
  phase: "start", // "start" | "intro" | "aim" | "charging" | "flight" | "celebrate" | "summary"
  round: 1,
  maxRounds: 5,
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

  // Normalized Aim coordinates inside Goal: nx in [-1.1, 1.1], ny in [0.0, 1.05] (0=bottom, 1=top)
  aimNx: -0.65,
  aimNy: 0.72,

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
    intendedDiveSide: -0.75, // Pre-decided for 3+ NFT Alien Radar!
    intendedDiveHeight: 0.7,
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
    willScore: true,
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
  document.getElementById("hud-striker-trait").textContent = `${activeStriker.trait} • ${p.winPct}% WIN`;

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

  document.getElementById("hud-mult-val").textContent = `${p.totalMult.toFixed(1)}x`;
  document.getElementById("hud-score-val").textContent = game.score.toLocaleString("en-US");
  document.getElementById("hud-striker-trait").textContent = `${activeStriker.trait} • ${p.winPct}% WIN`;

  // Update 5 Shot Dots in Broadcast Scorebug
  const dotsWrap = document.getElementById("sb-shots-dots");
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    const totalDots = Math.max(5, game.round);
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
}

function triggerGateShake() {
  const card = document.getElementById("entry-gate-card");
  if (!card) return;
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

// ============================================================================
// CINEMATIC INTRO & ROUND FLOW (STRICTLY GATED BY WALLET + 1,000,000 $EFOO)
// ============================================================================
function launchMatchWithIntro() {
  const isRo = currentLang === "ro";

  // 1. Must be logged in with a real MultiversX wallet
  if (!connectedAddress || !VALID_WALLET_PROVIDERS.includes(connectedProvider)) {
    game.phase = "start";
    document.getElementById("start-screen-overlay")?.classList.remove("hidden");
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
    game.phase = "start";
    document.getElementById("start-screen-overlay")?.classList.remove("hidden");
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

  document.getElementById("start-screen-overlay")?.classList.add("hidden");
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

  if (introEl) introEl.classList.remove("hidden");

  const p = getPowers();
  game.phase = "intro";
  game.round = 1;
  game.maxRounds = 5;
  game.revivedThisMatch = false;
  game.shotHistory = [];
  game.goals = 0;
  game.streak = 0;
  game.score = 0;
  game.rawBaseScore = 0;
  game.shieldsLeft = p.maxShields;
  refreshHudUI();

  if (perkEl) perkEl.textContent = `⚡ ${p.totalMult.toFixed(1)}x BOOST • ${p.winPct}% WIN`;
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
    game.phase = "start";
    document.getElementById("start-screen-overlay")?.classList.remove("hidden");
    updateEntryGateUI();
    return;
  }

  game.phase = "aim";
  game.isCharging = false;
  game.chargePower = 0;

  updateKeeperAssets(game.round - 1);

  // Pre-decide Keeper dive direction so 3+ NFT Alien Radar can show it!
  const diveChoices = [-0.78, -0.45, 0, 0.45, 0.78];
  game.keeper.intendedDiveSide = diveChoices[Math.floor(Math.random() * diveChoices.length)];
  game.keeper.intendedDiveHeight = 0.25 + Math.random() * 0.65;
  game.keeper.targetNx = 0;
  game.keeper.targetNy = 0;
  game.keeper.targetAngle = 0;
  game.keeper.armReach = 0;

  refreshHudUI();
}

function releaseAndFireShot(finalPower) {
  if (!canPlayMatch()) return;
  if (game.phase !== "aim" && game.phase !== "charging") return;
  game.phase = "flight";
  game.isCharging = false;

  const p = getPowers();
  // Sweet spot is between 0.45 and 0.88 (wider if player holds NFTs or 1M+ $EFOO!)
  const sweetMin = p.hasRocket ? 0.32 : 0.42;
  const sweetMax = p.hasCurve ? 0.94 : 0.86;
  const isSweet = finalPower >= sweetMin && finalPower <= sweetMax;
  const isSkyball = finalPower > 0.96 && !p.hasCurve;

  audio.playKick(isSweet);
  game.strikerLunge = 26;

  // Determine whether this shot beats the goalkeeper
  const distToBullseye = Math.hypot(game.aimNx - game.bullseyeNx, game.aimNy - game.bullseyeNy);
  const hitBullseye = distToBullseye < 0.28;

  const winChance = Math.min(0.96, p.winPct / 100 + (isSweet ? 0.16 : 0));
  const willScore = !isSkyball && Math.random() < winChance;

  // Set Keeper's physical dive target
  if (willScore) {
    // Keeper either dives to his pre-decided radar side (if far from aim) or dives slightly late/under the ball
    let diveNx = game.keeper.intendedDiveSide;
    if (Math.abs(diveNx - game.aimNx) < 0.35) {
      diveNx = game.aimNx > 0 ? -0.72 : 0.72;
    }
    game.keeper.targetNx = diveNx;
    game.keeper.targetNy = game.keeper.intendedDiveHeight * 0.7;
    game.keeper.targetAngle = diveNx < -0.15 ? -0.95 : diveNx > 0.15 ? 0.95 : 0;
  } else {
    // Keeper guesses exact corner!
    game.keeper.targetNx = Math.max(-0.9, Math.min(0.9, game.aimNx));
    game.keeper.targetNy = Math.max(0.1, Math.min(0.9, game.aimNy));
    game.keeper.targetAngle = game.aimNx < -0.15 ? -0.95 : game.aimNx > 0.15 ? 0.95 : 0;
  }
  game.keeper.armReach = 1.0;

  // Launch 3D Ball Flight
  game.ball = {
    active: true,
    t: 0,
    aimNx: game.aimNx,
    aimNy: isSkyball ? 1.32 : game.aimNy,
    curveIntensity: (p.hasCurve ? 1.35 : 0.55) * (game.aimNx >= 0 ? -1 : 1),
    isSweet,
    isTwin: isSweet && p.hasTwinBall,
    hitBullseye,
    willScore,
    isSkyball
  };
}

function onBallReachGoal(endScreenX, endScreenY) {
  const p = getPowers();
  const b = game.ball;
  let scored = b.willScore;
  let shieldTriggered = false;

  // Goalkeeper NFT Save Shield: if blocked, deflects off post and goes IN!
  if (!scored && game.shieldsLeft > 0) {
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
      (1000 + game.streak * 350) * (b.hitBullseye ? 2 : 1) * (b.isSweet ? 1.5 : 1)
    );
    const totalPts = Math.round(rawPts * p.totalMult + p.rocketPts) * goalsAdded;

    game.rawBaseScore += rawPts;
    game.score += totalPts;

    game.netImpactX = endScreenX;
    game.netImpactY = endScreenY;
    game.netRipple = 1.0;
    game.shake = b.isSweet ? 15 : 8;

    game.bigBanner = shieldTriggered
      ? `🧤 SHIELD RICOCHET GOAL! +${totalPts.toLocaleString()}`
      : b.isTwin
      ? `⚡ 2x TWIN ROCKET GOAL! +${totalPts.toLocaleString()}`
      : b.hitBullseye
      ? `⭐ 2x BULLSEYE TOP BINS! +${totalPts.toLocaleString()}`
      : `⚽ GOOOOL! +${totalPts.toLocaleString()}`;
    game.bigBannerColor = shieldTriggered || b.hitBullseye ? "#ffb800" : "#a8ff00";

    audio.playGoalCheer();
    spawnSparks(endScreenX, endScreenY, "#a8ff00", 55);
  } else {
    game.streak = 0;
    game.shotHistory.push("miss");
    game.shake = 6;
    game.bigBanner = b.isSkyball ? "❌ OVERHIT!" : `🧤 SAVED BY ${activeKeeper.name}!`;
    game.bigBannerColor = "#ef4444";

    audio.playSaveBlock();
    spawnSparks(endScreenX, endScreenY, "#ef4444", 28);
  }

  game.phase = "celebrate";
  refreshHudUI();

  setTimeout(() => {
    game.bigBanner = "";
    if (game.round >= game.maxRounds) {
      // Unlock Sudden Death Overdrive if player holds NFTs/$EFOO and scored!
      if (p.isPro && scored && game.round < 10) {
        game.round += 1;
        startNextShotRound();
        return;
      }
      // Trigger 10-Second VAR Review Revive Second Chance (once per match)
      if (!game.revivedThisMatch) {
        openVarReviveOverlay();
        return;
      }
      openSummaryModal();
    } else {
      game.round += 1;
      startNextShotRound();
    }
  }, 1250);
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

  if (!varOverlay) {
    openSummaryModal();
    return;
  }

  if (titleEl) {
    titleEl.textContent = isRo ? "🚨 PARADĂ / SFÂRȘIT DE MECI!" : "🚨 SHOT SAVED / FULL TIME!";
  }
  if (descEl) {
    descEl.textContent = isRo
      ? "Arbitrul verifică VAR! Activează Prelungirile în 10 secunde pentru a-ți salva seria de victorii!"
      : "Referee signals VAR review! Call an Injury Time Revive in 10 seconds to keep your streak alive!";
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

function openSummaryModal() {
  game.phase = "summary";
  audio.playWhistle();

  const p = getPowers();
  const whalePotential = Math.max(
    game.score,
    Math.round(game.rawBaseScore * 7.0 + Math.max(3, game.goals) * 2500)
  );

  document.getElementById("sum-score-actual").textContent = game.score.toLocaleString("en-US");
  document.getElementById("sum-score-whale").textContent = `${whalePotential.toLocaleString("en-US")} 🏆`;

  const isRo = currentLang === "ro";
  const fomoLine = document.getElementById("sum-fomo-line");
  if (fomoLine) {
    if (walletState.efooBalance < 5000000) {
      const tier2Score = Math.round(game.score * 2.5);
      fomoLine.innerHTML = isRo
        ? `⚡ <strong>REGRET DE TIER:</strong> Cu <strong>5M $EFOO (Rocket Striker)</strong>, acest meci ar fi avut <strong>${tier2Score.toLocaleString("en-US")} puncte (+2.5x)</strong>!<br />🎁 <em>Primă achiziție? Ia Starter Pack de 0.035 EGLD și primești 1.500.000 $EFOO (+50% Bonus din Seif)!</em>`
        : `⚡ <strong>TIER REGRET:</strong> With <strong>5M $EFOO (Rocket Striker)</strong>, this run would score <strong>${tier2Score.toLocaleString("en-US")} pts (+2.5x)</strong>!<br />🎁 <em>First time? Buy the 0.035 EGLD Starter Pack to get 1,500,000 $EFOO (+50% Bonus from Stadium Vault)!</em>`;
    } else {
      fomoLine.innerHTML = isRo
        ? `🏆 <strong>ECHIPĂ PRO CALIFICATĂ!</strong> Ai marcat <strong>${game.goals} goluri</strong> cu <strong>${p.totalMult.toFixed(1)}x</strong> boost! Șutează 100k $EFOO în pot sau mintează mai mulți jucători pt. <strong>11.0x</strong>!`
        : `🏆 <strong>PRO SQUAD QUALIFIED!</strong> You scored <strong>${game.goals} goals</strong> at <strong>${p.totalMult.toFixed(1)}x</strong> boost! Kick 100k $EFOO into the Pot or mint more NFTs to reach <strong>11.0x</strong>!`;
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
    const horizonY = H * 0.34;
    const goalW = Math.min(W * 0.56, 640);
    const goalH = Math.min(H * 0.31, 245);
    const goalLeft = cx - goalW / 2;
    const goalRight = cx + goalW / 2;
    const goalBottom = horizonY + 18;
    const goalTop = goalBottom - goalH;
    const spotX = cx;
    const spotY = H * 0.83;

    return { cx, horizonY, goalW, goalH, goalLeft, goalRight, goalTop, goalBottom, spotX, spotY };
  }

  // Mouse / Touch Aim & Hold-to-Shoot Handlers directly on the Canvas!
  function updateAimFromPointer(clientX, clientY) {
    const g = getStageGeom();
    const nx = ((clientX - g.cx) / (g.goalW * 0.5));
    const ny = ((g.goalBottom - clientY) / g.goalH);
    game.aimNx = Math.max(-1.08, Math.min(1.08, nx));
    game.aimNy = Math.max(0.05, Math.min(1.08, ny));
  }

  canvas.addEventListener("mousemove", (e) => {
    if (!canPlayMatch()) return;
    if (game.phase === "aim" || game.phase === "charging") {
      updateAimFromPointer(e.clientX, e.clientY);
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    if (e.button !== 0 || !canPlayMatch()) return;
    if (game.phase === "aim") {
      updateAimFromPointer(e.clientX, e.clientY);
      game.phase = "charging";
      game.isCharging = true;
      game.chargePower = 0.18;
      game.chargeDir = 1;
    }
  });

  window.addEventListener("mouseup", () => {
    if (!canPlayMatch()) return;
    if (game.phase === "charging" && game.isCharging) {
      releaseAndFireShot(Math.max(0.55, game.chargePower));
    }
  });

  // Touch support for Mobile
  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (!canPlayMatch()) return;
      if (game.phase === "aim" && e.touches[0]) {
        updateAimFromPointer(e.touches[0].clientX, e.touches[0].clientY);
        game.phase = "charging";
        game.isCharging = true;
        game.chargePower = 0.22;
        game.chargeDir = 1;
      }
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (!canPlayMatch()) return;
      if ((game.phase === "aim" || game.phase === "charging") && e.touches[0]) {
        updateAimFromPointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );

  window.addEventListener("touchend", () => {
    if (!canPlayMatch()) return;
    if (game.phase === "charging" && game.isCharging) {
      releaseAndFireShot(Math.max(0.58, game.chargePower));
    }
  });

  // Spacebar support
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
      releaseAndFireShot(Math.max(0.58, game.chargePower));
    }
  });

  function renderFrame() {
    const g = getStageGeom();
    const p = getPowers();

    // Update Moving 2x Bullseye Target
    game.bullseyePhase += 0.022;
    game.bullseyeNx = Math.sin(game.bullseyePhase) * 0.74;
    game.bullseyeNy = 0.62 + Math.cos(game.bullseyePhase * 1.7) * 0.22;

    // Update Hold-to-Charge Ring
    if (game.phase === "charging" && game.isCharging) {
      game.chargePower += 0.026 * game.chargeDir;
      if (game.chargePower >= 1.0) {
        game.chargePower = 1.0;
        game.chargeDir = -1;
      } else if (game.chargePower <= 0.1) {
        game.chargePower = 0.1;
        game.chargeDir = 1;
      }
    }

    // Update Articulated Goalkeeper Position
    if (game.phase === "aim" || game.phase === "charging") {
      game.keeper.nx = Math.sin(Date.now() * 0.0045) * 0.18;
      game.keeper.ny = Math.abs(Math.cos(Date.now() * 0.009)) * 0.05;
      game.keeper.bodyAngle = Math.sin(Date.now() * 0.0045) * 0.08;
      game.keeper.armReach = 0.25 + Math.sin(Date.now() * 0.008) * 0.1;
    } else {
      game.keeper.nx += (game.keeper.targetNx - game.keeper.nx) * 0.22;
      game.keeper.ny += (game.keeper.targetNy - game.keeper.ny) * 0.22;
      game.keeper.bodyAngle += (game.keeper.targetAngle - game.keeper.bodyAngle) * 0.22;
    }

    if (game.strikerLunge > 0.1) game.strikerLunge *= 0.85;
    if (game.netRipple > 0.01) game.netRipple *= 0.91;

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

    // 2. 3D PERSPECTIVE TURF PITCH
    const turfGrad = ctx.createLinearGradient(0, g.horizonY + 16, 0, H);
    turfGrad.addColorStop(0, "#0c2e19");
    turfGrad.addColorStop(0.45, "#113d22");
    turfGrad.addColorStop(1, "#061a0e");
    ctx.fillStyle = turfGrad;
    ctx.fillRect(0, g.horizonY + 16, W, H - g.horizonY);

    // Perspective Mowed Stripes
    for (let i = -5; i <= 5; i++) {
      if (i % 2 === 0) continue;
      ctx.fillStyle = "rgba(168, 255, 0, 0.032)";
      ctx.beginPath();
      ctx.moveTo(g.cx + i * (g.goalW * 0.14), g.horizonY + 16);
      ctx.lineTo(g.cx + (i + 1) * (g.goalW * 0.14), g.horizonY + 16);
      ctx.lineTo(g.cx + (i + 1) * (g.goalW * 0.38), H);
      ctx.lineTo(g.cx + i * (g.goalW * 0.38), H);
      ctx.closePath();
      ctx.fill();
    }

    // Perspective Penalty Box Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(g.goalLeft - 110, g.goalBottom);
    ctx.lineTo(g.goalLeft - 340, H);
    ctx.moveTo(g.goalRight + 110, g.goalBottom);
    ctx.lineTo(g.goalRight + 340, H);
    ctx.moveTo(0, g.goalBottom);
    ctx.lineTo(W, g.goalBottom);
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

    // 5. ALIEN TELEPATHY RADAR (Visible when holding 3+ Player NFTs!)
    if ((game.phase === "aim" || game.phase === "charging") && p.hasRadar) {
      const rx = g.cx + game.keeper.intendedDiveSide * (g.goalW * 0.45);
      const ry = g.goalBottom - game.keeper.intendedDiveHeight * (g.goalH * 0.7);
      ctx.save();
      ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(rx, ry, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.font = "800 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("🛸 KEEPER DIVE", rx, ry - 40);
      ctx.restore();
    }

    // 6. ARTICULATED GOALKEEPER ATHLETE + REAL GOALKEEPER-cb9e3e NFT HOLOGRAM
    const kx = g.cx + game.keeper.nx * (g.goalW * 0.44);
    const ky = g.goalBottom - 44 - game.keeper.ny * (g.goalH * 0.62);
    drawArticulatedGoalkeeper(ctx, kx, ky, game.keeper.bodyAngle, game.keeper.armReach);

    // 7. LIVE 3D CURVED LASER TRAJECTORY & CROSSHAIR (When Aiming or Charging)
    const aimScreenX = g.cx + game.aimNx * (g.goalW * 0.5);
    const aimScreenY = g.goalBottom - game.aimNy * g.goalH;

    if (game.phase === "aim" || game.phase === "charging") {
      const curveBend = (p.hasCurve ? 110 : 40) * (game.aimNx >= 0 ? -1 : 1);
      const ctrlX = (g.spotX + aimScreenX) * 0.5 + curveBend;
      const ctrlY = (g.spotY + aimScreenY) * 0.5 - 65;

      // Draw glowing trajectory arc dots
      for (let i = 1; i <= 14; i++) {
        const u = i / 15;
        const iu = 1 - u;
        const tx = iu * iu * g.spotX + 2 * iu * u * ctrlX + u * u * aimScreenX;
        const ty = iu * iu * g.spotY + 2 * iu * u * ctrlY + u * u * aimScreenY;
        ctx.fillStyle = p.hasRocket ? "#ff5500" : "#a8ff00";
        ctx.globalAlpha = 0.25 + u * 0.65;
        ctx.beginPath();
        ctx.arc(tx, ty, (1 - u * 0.5) * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw Crosshair Reticle at Aim Point
      ctx.save();
      ctx.translate(aimScreenX, aimScreenY);
      ctx.strokeStyle = "#a8ff00";
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
      ctx.restore();
    }

    // 8. FOREGROUND 3D STRIKER NFT HOLOGRAM ON PITCH
    drawPitchStrikerHologram(ctx, g.spotX - 135 + game.strikerLunge, g.spotY - 28 - game.strikerLunge * 0.4);

    // 9. PENALTY SPOT, RADIAL POWER CHARGE RING, & FLYING ROCKET BALL
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.ellipse(g.spotX, g.spotY + 12, 18, 6, 0, 0, Math.PI * 2);
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

      const isSweet = game.chargePower >= 0.42 && game.chargePower <= 0.9;
      ctx.strokeStyle = game.chargePower > 0.94 ? "#ef4444" : isSweet ? "#a8ff00" : "#ffb800";
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
      ctx.fillText(isSweet ? "🔥 SWEET SPOT!" : "⚡ POWER", 0, rRing + 22);
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

      // Trail Sparks
      game.particles.push({
        x: bx + (Math.random() - 0.5) * 8,
        y: by + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1 + Math.random() * 2,
        r: 3 + Math.random() * 4.5,
        color: b.isSweet || p.hasRocket ? "#ff5500" : "#a8ff00",
        alpha: 0.9
      });

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

    // 11. DRAW BIG GOAL / SAVE FLASH BANNER
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

    ctx.restore();
    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
}

// Pro Articulated Vector Goalkeeper + Real GOALKEEPER-cb9e3e NFT Crest
function drawArticulatedGoalkeeper(ctx, x, y, angle, armReach) {
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

function showToast(html, url = "") {
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

  game.phase = "start";
  document.getElementById("intro-cinematic-overlay")?.classList.add("hidden");
  document.getElementById("summary-screen-overlay")?.classList.add("hidden");
  document.getElementById("start-screen-overlay")?.classList.remove("hidden");
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

  if (urlAddr && urlAddr.startsWith("erd1")) {
    connectWithAddress(urlAddr, "webwallet");
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
  currentLang = lang === "ro" ? "ro" : "en";
  localStorage.setItem("efoo_lang", currentLang);
  document.getElementById("lang-label").textContent = currentLang.toUpperCase();
  const dict = I18N_GAME[currentLang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (dict[k]) el.innerHTML = dict[k];
  });
  updateEntryGateUI();
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
  initFullscreenStadiumCanvas();

  // Start, Replay & Close Summary buttons
  const closeSummaryModal = () => {
    document.getElementById("summary-screen-overlay")?.classList.add("hidden");
    if (!canPlayMatch()) {
      game.phase = "start";
      document.getElementById("start-screen-overlay")?.classList.remove("hidden");
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
    applyLang(currentLang === "en" ? "ro" : "en");
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
    document.getElementById("tx-toast")?.classList.add("hidden");
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
