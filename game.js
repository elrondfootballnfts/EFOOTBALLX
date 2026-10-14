// ============================================================================
// EFOO FOMO ARENA — STANDALONE 60FPS NFT PENALTY & JACKPOT ENGINE (game.js)
// ============================================================================

const GAME_I18N = {
  en: {
    nav_back_home: "Back to Main Stadium",
    nav_connect: "Connect Wallet",
    rule1_title: "1. PICK A CORNER (6 ZONES)",
    rule1_desc: "Click any of the 6 goal zones. Hit the moving <strong>⭐ 2x Golden Bullseye</strong> for double points!",
    rule2_title: "2. LOCK THE GREEN SWEET-SPOT",
    rule2_desc: "Click <strong>SHOOT (or Space)</strong> in the green bar to fire an unstoppable <strong>Flaming Rocket Curve Shot</strong>!",
    rule3_title: "3. NFTs = GOD POWERS & JACKPOT",
    rule3_desc: "More <strong>NFTs & $EFOO</strong> = up to <strong>90% Goal Chance, 11x Score, Free Saves</strong> & <strong>25.4M $EFOO Pot</strong> entry!",
    hud_shot: "⚽ ROUND / SHOT",
    hud_goals: "🥅 GOALS & STREAK",
    hud_mult: "⚡ NFT MULTIPLIER",
    hud_shields: "🛡️ KEEPER SHIELDS",
    hud_score: "🏆 MATCH SCORE",
    btn_try_whale: "Test Whale Squad (11 NFTs + 2 Keepers)",
    btn_exit_whale: "Exit Whale Preview",
    btn_lock_kick: "KICK ROCKET SHOT NOW! (CLICK OR SPACE)",
    lobby_kicker: "🏟️ MULTIVERSX ON-CHAIN PENALTY ARENA",
    lobby_title: "EFOO FOMO: 90+5' SHOOTOUT",
    lobby_sub: "Step up to the penalty spot with real <strong>EFOOTBALL-91a4eb</strong> & <strong>GOALKEEPER-cb9e3e</strong> NFTs! Score 5 penalties to enter Sudden Death Overdrive and claim your share of the <strong>25,400,000 $EFOO Pot</strong>!",
    btn_start_match: "START MATCH (LAUNCH INTRO)",
    ms_your_score: "YOUR FINAL SCORE",
    ms_whale_score: "WITH 3+ NFTs & 1M $EFOO",
    btn_play_again: "Play Again",
    btn_share_x: "Share Score on X",
    btn_quick_buy_efoo: "Buy 3M $EFOO (~0.1 EGLD)",
    btn_quick_mint_nft: "Mint Striker NFT (0.08 EGLD)",
    btn_restart: "Restart",
    select_striker_label: "👕 SELECT ACTIVE STRIKER NFT ON PITCH (REAL MULTIVERSX NFT GRAPHICS):",
    pot_card_title: "LAST STRIKER TAKES THE POT!",
    pot_card_desc: "Every <strong>100,000 $EFOO</strong> kicked into the pot resets the clock to <code>05:00</code>. When it hits <code>00:00</code>, the <strong>Last Striker wins 50%</strong> and <strong>50% is burned forever</strong>!",
    btn_kick_100k: "Kick 100,000 $EFOO Into Pot (Reset 05:00)",
    store_title: "BOOST YOUR WIN % & MULTIPLIER NOW",
    store_desc: "Sign a 1-click MultiversX transaction right here to unlock permanent superpowers in every match:",
    matrix_kicker: "🃏 ON-CHAIN UTILITY & QUANTITY SCALING",
    matrix_title: "MORE NFTs IN YOUR WALLET = HIGHER GOAL % & BIGGER SUPERPOWERS",
    matrix_desc: "The game engine scans your connected MultiversX wallet in real time. Both the <strong>type of NFT (EFOOTBALL vs GOALKEEPER)</strong> and the <strong>exact number of NFTs you hold</strong> stack together to multiply your score and unlock unfair stadium advantages:",
    t1_title: "LIGA 1 STARTER",
    t2_title: "ULTRAS CAPTAIN",
    t3_title: "DEGEN CLUB LEGEND",
    t4_title: "GOLDEN GLOVE TITAN",
    modal_title: "CONNECT YOUR MULTIVERSX WALLET",
    modal_desc: "Connect your wallet to load your live <strong>$EFOO balance</strong>, <strong>EFOOTBALL</strong> & <strong>GOALKEEPER NFTs</strong> into the stadium and sign instant swaps/mints!"
  },
  ro: {
    nav_back_home: "Înapoi la Stadionul Principal",
    nav_connect: "Conectează Portofel",
    rule1_title: "1. ALEGE COLȚUL PORȚII (6 ZONE)",
    rule1_desc: "Apasă pe oricare din cele 6 ținte. Nimește ținta mobilă <strong>⭐ 2x Golden Bullseye</strong> pentru puncte duble!",
    rule2_title: "2. OPREȘTE BARA ÎN ZONA VERDE",
    rule2_desc: "Apasă <strong>ȘUTEAZĂ (sau Space)</strong> pe zona verde pentru o <strong>Minge-Rachetă cu Efect Imparabil</strong>!",
    rule3_title: "3. MAI MULTE NFT-URI = SUPER-PUTERI",
    rule3_desc: "Mai multe <strong>NFT-uri & $EFOO</strong> = până la <strong>90% Șansă de Gol, Scor 11x, Scuturi</strong> & acces la <strong>Potul de 25.4M $EFOO</strong>!",
    hud_shot: "⚽ SERIA / ȘUTUL",
    hud_goals: "🥅 GOLURI & SERIE",
    hud_mult: "⚡ MULTIPLICATOR NFT",
    hud_shields: "🛡️ SCUTURI PORTAR",
    hud_score: "🏆 SCORUL MECIULUI",
    btn_try_whale: "Testează Lotul Whale (11 NFT + 2 Portari)",
    btn_exit_whale: "Ieși din Modul Demo Whale",
    btn_lock_kick: "ȘUTEAZĂ MINGEA-RACHETĂ ACUM! (CLICK SAU SPACE)",
    lobby_kicker: "🏟️ ARENA DE PENALTY ON-CHAIN MULTIVERSX",
    lobby_title: "EFOO FOMO: PENALTY MINUTUL 90+5'",
    lobby_sub: "Intră la punctul cu var cu NFT-urile reale <strong>EFOOTBALL-91a4eb</strong> și <strong>GOALKEEPER-cb9e3e</strong>! Înscrie 5 penalty-uri pentru a intra în Prelungiri Sudden Death și califică-te pentru <strong>Potul de 25,400,000 $EFOO</strong>!",
    btn_start_match: "START MECI (PORNEȘTE INTRO-UL)",
    ms_your_score: "SCORUL TĂU FINAL",
    ms_whale_score: "CU 3+ NFT-URI & 1M $EFOO",
    btn_play_again: "Joacă Din Nou",
    btn_share_x: "Distribuie pe X",
    btn_quick_buy_efoo: "Cumpără 3M $EFOO (~0.1 EGLD)",
    btn_quick_mint_nft: "Mintează Atacant NFT (0.08 EGLD)",
    btn_restart: "Reia Meciul",
    select_striker_label: "👕 ALEGE ATACANTUL NFT ACTIV PE TEREN (GRAFICĂ NFT REALĂ MULTIVERSX):",
    pot_card_title: "ULTIMUL MARCATOR IA TOT POTUL!",
    pot_card_desc: "Fiecare <strong>100,000 $EFOO</strong> șutați în pot resetează ceasul la <code>05:00</code>. La <code>00:00</code>, <strong>Ultimul Marcator câștigă 50%</strong> iar <strong>50% sunt arși definitiv</strong>!",
    btn_kick_100k: "Șutează 100,000 $EFOO în Pot (Reset 05:00)",
    store_title: "CREȘTE-ȚI ȘANSA DE GOL & MULTIPLICATORUL",
    store_desc: "Semnează o tranzacție rapidă MultiversX chiar aici pentru a debloca super-puteri permanente:",
    matrix_kicker: "🃏 UTILITATE ON-CHAIN & SCALARE DUPĂ NUMĂRUL DE NFT-URI",
    matrix_title: "MAI MULTE NFT-URI ÎN PORTOFEL = ȘANSĂ MAI MARE DE GOL & SUPER-PUTERI",
    matrix_desc: "Jocul îți scanează portofelul MultiversX în timp real. Atât <strong>tipul NFT-ului (EFOOTBALL vs GOALKEEPER)</strong> cât și <strong>numărul total de NFT-uri deținute</strong> se adună pentru a-ți multiplica scorul:",
    t1_title: "TITULAR LIGA 1",
    t2_title: "CĂPITANUL ULTRAȘILOR",
    t3_title: "LEGENDĂ DEGEN FC",
    t4_title: "TITANUL MĂNUȘILOR DE AUR",
    modal_title: "CONECTEAZĂ PORTOFELUL MULTIVERSX",
    modal_desc: "Conectează portofelul pentru a încărca soldul <strong>$EFOO</strong> și NFT-urile <strong>EFOOTBALL</strong> & <strong>GOALKEEPER</strong> direct pe teren!"
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
  CLUB_OWNER_DEMO: "erd1gyw9wtsjcg62mdrkxym3l4t3qelf83mq85whefp979h7pzmjm0zq96j8gq",
  WC_PROJECT_ID: "9b1a9564f91cb659ffe21b73d5c4e2d8"
};

// Curated Real MultiversX Club NFTs (Used in Squad Selector & Boss Keepers)
const DEFAULT_STRIKERS = [
  {
    identifier: "EFOOTBALL-91a4eb-026b",
    name: "ElrondFootball #619 (Alien)",
    trait: "👽 Alien Skin • Chindia Kit",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/9734.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0261",
    name: "ElrondFootball #609",
    trait: "⚡ Liga 1 Curve Specialist",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1477.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0262",
    name: "ElrondFootball #610",
    trait: "🔥 Sunday League Finisher",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/2805.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0264",
    name: "ElrondFootball #612",
    trait: "🎯 Top-Bins Sniper",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/6632.png"
  },
  {
    identifier: "EFOOTBALL-91a4eb-0273",
    name: "ElrondFootball #627",
    trait: "🍺 Panenka Master",
    url: "https://media.multiversx.com/nfts/asset/QmVFcs7LL7BASXocWdiU6dTw5FrLNhYupwZR5yyU8e1Bmb/1688.png"
  }
];

const BOSS_KEEPERS = [
  {
    identifier: "GOALKEEPER-cb9e3e-02",
    name: "GoalKeeper #2",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/230.png"
  },
  {
    identifier: "GOALKEEPER-cb9e3e-07",
    name: "GoalKeeper #7",
    url: "https://media.multiversx.com/nfts/asset/bafybeicbszzifxxcpnq3zrndfdtf45wouhyjbklwk4ffio365icb2ylgg4/440.png"
  },
  {
    identifier: "GOALKEEPER-cb9e3e-33",
    name: "GoalKeeper #51 (Boss)",
    url: "branding/original/GOALKEEPER-cb9e3e/logo.png"
  }
];

// ============================================================================
// WEB AUDIO SYNTHESIZED STADIUM SOUND FX ENGINE (Zero external MP3 needed)
// ============================================================================
class StadiumSoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playIntroFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [220, 277.18, 329.63, 440];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.001, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.11, now + idx * 0.14 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.95);
    });
  }

  playWhistle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2850, now);
    lfo.frequency.setValueAtTime(38, now);
    lfoGain.gain.setValueAtTime(140, now);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
    gain.gain.setValueAtTime(0.14, now + 0.32);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.5);
    lfo.stop(now + 0.5);
  }

  playKick(isSweetSpot = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isSweetSpot ? "triangle" : "sine";
    osc.frequency.setValueAtTime(isSweetSpot ? 175 : 130, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.19);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  playGoalRoar() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [261.63, 329.63, 392.0, 523.25].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    });
  }

  playCrossbarClang() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [820, 1240].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.48);
    });
  }

  playSaveThud() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(55, now + 0.25);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

const sfx = new StadiumSoundEngine();

// ============================================================================
// GLOBAL STATE (WALLET, NFT TIERS, & 60FPS ARENA STATE)
// ============================================================================
let currentLang = localStorage.getItem("efoo_lang") || "en";
let connectedAddress = localStorage.getItem("efoo_wallet_address") || "";
let connectedProvider = localStorage.getItem("efoo_wallet_provider") || "";
let wcSignClient = null;
let wcSessionTopic = localStorage.getItem("efoo_wc_topic") || "";
let currentWcUri = "";

let walletState = {
  shard: 0,
  nonce: 0,
  efooBalance: 0,
  egldBalance: 0,
  playersCount: 0,
  keepersCount: 0,
  ownedNfts: [],
  whalePreviewActive: false
};

// Loaded Image Objects for 60FPS Canvas Rendering
const loadedImages = {
  rocketBall: new Image(),
  strikerCard: new Image(),
  keeperCard: new Image()
};
loadedImages.rocketBall.src = "branding/original/assests-2022/logo.png";

let activeStriker = DEFAULT_STRIKERS[0];
let activeKeeper = BOSS_KEEPERS[0];

// 6 Goal Zone Coordinates in Canvas Space (900x520)
const GOAL_ZONES = {
  tl: { x: 265, y: 120, label: "TOP LEFT VINCLU" },
  tc: { x: 450, y: 112, label: "UPPER ROOF" },
  tr: { x: 635, y: 120, label: "TOP RIGHT VINCLU" },
  bl: { x: 265, y: 225, label: "BOTTOM LEFT" },
  bc: { x: 450, y: 215, label: "CENTER PANENKA" },
  br: { x: 635, y: 225, label: "BOTTOM RIGHT" }
};

let matchState = {
  phase: "lobby", // "lobby" | "intro" | "aiming" | "timing" | "flying" | "result" | "summary"
  round: 1,
  maxRegRounds: 5,
  goals: 0,
  streak: 0,
  score: 0,
  unboostedScore: 0,
  bestScore: Number(localStorage.getItem("efoo_fomo_best") || 0),
  shieldsLeft: 0,
  selectedZone: "tl",
  goldenZone: "tr",
  predecidedKeeperZone: "bl",
  meterPos: 0.1, // 0.0 -> 1.0
  meterDir: 1,
  sweetSpotStart: 0.48,
  sweetSpotWidth: 0.20,
  fomoSeconds: 282,
  fomoPot: 25400000,
  // Canvas animation physics
  ballAnim: {
    active: false,
    progress: 0,
    startX: 450,
    startY: 455,
    ctrlX: 450,
    ctrlY: 260,
    endX: 450,
    endY: 150,
    isSweetSpot: false,
    isMultiBall: false,
    ricochetPhase: false
  },
  keeperAnim: {
    x: 450,
    y: 185,
    targetX: 450,
    targetY: 185,
    diveAngle: 0
  },
  strikerKickOffset: 0,
  netRipple: 0,
  screenShake: 0,
  bannerFlash: "",
  bannerColor: "#a8ff00",
  particles: [],
  crowdBulbs: []
};

function toCorsImageUrl(rawUrl, size = 300) {
  if (!rawUrl) return "branding/original/EFOOTBALL-91a4eb/logo.png";
  if (rawUrl.startsWith("branding/") || rawUrl.startsWith("data:")) return rawUrl;
  return `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&w=${size}&h=${size}&fit=cover&output=png`;
}

function shortErd(addr) {
  if (!addr || addr.length < 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
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

function showToast(messageHtml, explorerUrl = "") {
  const toast = document.getElementById("tx-toast");
  const toastLink = document.getElementById("tx-toast-link");
  const toastText = document.getElementById("tx-toast-text");
  if (!toast || !toastText) return;

  toastText.innerHTML = messageHtml;
  if (toastLink) {
    if (explorerUrl) {
      toastLink.href = explorerUrl;
      toastLink.classList.remove("hidden");
    } else {
      toastLink.classList.add("hidden");
    }
  }
  toast.classList.remove("hidden");
}

// ============================================================================
// EFFECTIVE NFT & TOKEN SUPERPOWER CALCULATOR (QUANTITY-BASED SCALING)
// ============================================================================
function getEffectivePowerStats() {
  const pCount = walletState.whalePreviewActive ? 11 : walletState.playersCount;
  const kCount = walletState.whalePreviewActive ? 2 : walletState.keepersCount;
  const efooBal = walletState.whalePreviewActive ? 1910000000 : walletState.efooBalance;

  // Player NFT Quantity Tiers:
  // 0 NFTs: 55% win chance, 1.0x mult
  // 1-2 NFTs: 70% win chance, 2.0x mult, Banana Curve
  // 3-5 NFTs: 80% win chance, 4.0x mult, Alien Radar
  // 6+ NFTs: 90% win chance, 7.0x mult, Multi-Ball Overdrive
  let winChance = 55;
  let playerMult = 1.0;
  let hasCurve = false;
  let hasRadar = false;
  let hasMultiBall = false;

  if (pCount >= 6) {
    winChance = 90;
    playerMult = 7.0;
    hasCurve = true;
    hasRadar = true;
    hasMultiBall = true;
  } else if (pCount >= 3) {
    winChance = 80;
    playerMult = 4.0;
    hasCurve = true;
    hasRadar = true;
  } else if (pCount >= 1) {
    winChance = 70;
    playerMult = 2.0;
    hasCurve = true;
  }

  // Goalkeeper NFT Quantity Tiers:
  // 1 Keeper: 1 Save Shield + 2.0x extra mult
  // 2+ Keepers: 2 Save Shields + Slow-Mo Timing Bar + 4.0x extra mult
  let maxShields = 0;
  let keeperMultBonus = 0;
  let slowMoBar = false;

  if (kCount >= 2) {
    maxShields = 2;
    keeperMultBonus = 4.0;
    slowMoBar = true;
  } else if (kCount >= 1) {
    maxShields = 1;
    keeperMultBonus = 2.0;
  }

  // $EFOO Balance Tiers:
  // 1M+ $EFOO: Flaming Rocket Ball (+1,000 pts/goal + wider sweet spot)
  const hasRocketBall = efooBal >= 1000000;
  const rocketFlatBonus = efooBal >= 10000000 ? 3000 : hasRocketBall ? 1000 : 0;

  const totalMult = playerMult + keeperMultBonus;
  const isProEligible = pCount >= 1 || kCount >= 1 || efooBal >= 1000000;

  return {
    pCount,
    kCount,
    efooBal,
    winChance,
    totalMult,
    maxShields,
    hasCurve,
    hasRadar,
    hasMultiBall,
    slowMoBar,
    hasRocketBall,
    rocketFlatBonus,
    isProEligible
  };
}

function updateSuperpowersUI() {
  const stats = getEffectivePowerStats();

  // Top HUD & Lobby chips
  const multEl = document.getElementById("hud-multiplier");
  const shieldsEl = document.getElementById("hud-shields");
  const lobbyChance = document.getElementById("lobby-win-chance");
  const lobbyMult = document.getElementById("lobby-mult-val");
  const lobbyShields = document.getElementById("lobby-shields-val");

  if (multEl) multEl.textContent = `${stats.totalMult.toFixed(1)}x`;
  if (shieldsEl) shieldsEl.textContent = `${matchState.shieldsLeft} Left`;
  if (lobbyChance) lobbyChance.textContent = `${stats.winChance}%`;
  if (lobbyMult) lobbyMult.textContent = `${stats.totalMult.toFixed(1)}x`;
  if (lobbyShields) lobbyShields.textContent = `${stats.maxShields}x 🛡️`;

  // Superpower Ribbon Pills
  document.getElementById("sp-curve")?.classList.toggle("active", stats.hasCurve);
  document.getElementById("sp-radar")?.classList.toggle("active", stats.hasRadar);
  document.getElementById("sp-multiball")?.classList.toggle("active", stats.hasMultiBall);
  document.getElementById("sp-shield")?.classList.toggle("active", stats.maxShields > 0);
  document.getElementById("sp-rocket")?.classList.toggle("active", stats.hasRocketBall);

  // Highlight active tier card in the Matrix below
  document.getElementById("tier-card-1")?.classList.toggle("current-tier", stats.pCount >= 1 && stats.pCount <= 2);
  document.getElementById("tier-card-2")?.classList.toggle("current-tier", stats.pCount >= 3 && stats.pCount <= 5);
  document.getElementById("tier-card-3")?.classList.toggle("current-tier", stats.pCount >= 6);
  document.getElementById("tier-card-4")?.classList.toggle("current-tier", stats.kCount >= 1 || stats.hasRocketBall);

  // Update Eligibility Gate in Right Sidebar
  const gateBox = document.getElementById("eligibility-gate-box");
  const gateTitle = document.getElementById("elig-status-title");
  const gateDesc = document.getElementById("elig-status-desc");

  if (gateBox && gateTitle && gateDesc) {
    if (stats.isProEligible) {
      gateBox.classList.add("unlocked");
      gateTitle.style.color = "#a8ff00";
      gateTitle.innerHTML =
        currentLang === "ro"
          ? `✅ STATUT PRO & JACKPOT: DEBLOCAT (${stats.totalMult.toFixed(1)}x)`
          : `✅ PRO JACKPOT & SUDDEN DEATH: UNLOCKED (${stats.totalMult.toFixed(1)}x)`;
      gateDesc.innerHTML =
        currentLang === "ro"
          ? `Echipa ta (${stats.pCount} Jucători NFT, ${stats.kCount} Portari NFT) are acces la <strong>Prelungiri Nelimitate Sudden Death</strong> și la <strong>Potul de 25.4M $EFOO</strong>!`
          : `Your squad (${stats.pCount} Player NFTs, ${stats.kCount} Keeper NFTs) has unlocked <strong>Unlimited Sudden Death Rounds</strong> & <strong>25.4M $EFOO Pot Eligibility</strong>!`;
    } else {
      gateBox.classList.remove("unlocked");
      gateTitle.style.color = "#ffb800";
      gateTitle.innerHTML =
        currentLang === "ro"
          ? "🔒 STATUT PRO & SUDDEN DEATH: BLOCAT (MOD GUEST)"
          : "🔒 PRO JACKPOT & SUDDEN DEATH STATUS: LOCKED";
      gateDesc.innerHTML =
        currentLang === "ro"
          ? "Deține <strong>1+ NFT</strong> SAU <strong>1,000,000+ $EFOO</strong> (sau apasă <em>Testează Lotul Whale</em> sus!) pentru a debloca <strong>Sudden Death</strong> și <strong>Premiile $EFOO</strong>!"
          : "Hold <strong>1+ Squad NFT</strong> OR <strong>1,000,000+ $EFOO</strong> (or click <em>Test Whale Squad</em> above!) to unlock <strong>Sudden Death Overdrive</strong> & <strong>$EFOO Jackpot Rewards</strong>!";
    }
  }

  // Update Owned NFT counter label
  const counterEl = document.getElementById("owned-nft-counter");
  if (counterEl) {
    counterEl.textContent = walletState.whalePreviewActive
      ? "👑 WHALE PREVIEW: 11 Players • 2 Keepers • 1.91B $EFOO"
      : `Wallet Squad: ${walletState.playersCount} Players • ${walletState.keepersCount} Keepers`;
  }
}

// ============================================================================
// REAL NFT SQUAD SELECTOR & IMAGE LOADER
// ============================================================================
function setActiveStrikerNft(nftItem) {
  activeStriker = nftItem;
  const corsUrl = toCorsImageUrl(nftItem.url, 320);
  loadedImages.strikerCard.crossOrigin = "anonymous";
  loadedImages.strikerCard.src = corsUrl;

  const lobbyImg = document.getElementById("lobby-striker-img");
  const introImg = document.getElementById("intro-striker-img");
  const introName = document.getElementById("intro-striker-name");
  if (lobbyImg) lobbyImg.src = corsUrl;
  if (introImg) introImg.src = corsUrl;
  if (introName) introName.textContent = nftItem.name;

  document.querySelectorAll(".striker-pick-card").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-id") === nftItem.identifier);
  });
}

function setActiveKeeperNft(keeperItem) {
  activeKeeper = keeperItem;
  const corsUrl = toCorsImageUrl(keeperItem.url, 320);
  loadedImages.keeperCard.crossOrigin = "anonymous";
  loadedImages.keeperCard.src = corsUrl;

  const lobbyImg = document.getElementById("lobby-keeper-img");
  const introImg = document.getElementById("intro-keeper-img");
  const introName = document.getElementById("intro-keeper-name");
  if (lobbyImg) lobbyImg.src = corsUrl;
  if (introImg) introImg.src = corsUrl;
  if (introName) introName.textContent = keeperItem.name;
}

function renderSquadPickerStrip() {
  const row = document.getElementById("squad-cards-row");
  if (!row) return;
  row.innerHTML = "";

  // Combine user's real owned NFTs (if any) with the 5 iconic club strikers
  const walletStrikers = (walletState.ownedNfts || [])
    .filter((n) => n.collection === "EFOOTBALL-91a4eb")
    .map((n) => ({
      identifier: n.identifier,
      name: n.name || n.identifier,
      trait: "✅ Owned in Your Wallet",
      url: (n.media && n.media[0] && (n.media[0].url || n.media[0].thumbnailUrl)) || n.url
    }));

  const list = walletStrikers.length > 0 ? [...walletStrikers, ...DEFAULT_STRIKERS] : DEFAULT_STRIKERS;

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = `striker-pick-card ${item.identifier === activeStriker.identifier ? "active" : ""}`;
    card.setAttribute("data-id", item.identifier);
    const thumb = toCorsImageUrl(item.url, 120);
    card.innerHTML = `
      <img src="${thumb}" alt="${item.name}" loading="lazy" />
      <div>
        <strong>${item.name}</strong>
        <small>${item.trait}</small>
      </div>
    `;
    card.addEventListener("click", () => setActiveStrikerNft(item));
    row.appendChild(card);
  });
}

// ============================================================================
// CINEMATIC 3.8-SECOND INTRO & MATCH FLOW
// ("Legyen játék indítás gomb, ne egyből induljon" + "pár másodperces intro")
// ============================================================================
function startMatchWithIntro() {
  const startOverlay = document.getElementById("game-start-overlay");
  const introOverlay = document.getElementById("game-cinematic-intro");
  const summaryOverlay = document.getElementById("match-summary-overlay");
  const introFill = document.getElementById("intro-progress-fill");
  const introKicker = document.getElementById("intro-phase-kicker");
  const introHeadline = document.getElementById("intro-phase-headline");
  const introBoost = document.getElementById("intro-striker-boost");

  if (startOverlay) startOverlay.classList.add("hidden");
  if (summaryOverlay) summaryOverlay.classList.add("hidden");
  if (introOverlay) introOverlay.classList.remove("hidden");

  const stats = getEffectivePowerStats();
  matchState.phase = "intro";
  matchState.round = 1;
  matchState.goals = 0;
  matchState.streak = 0;
  matchState.score = 0;
  matchState.unboostedScore = 0;
  matchState.shieldsLeft = stats.maxShields;
  updateHudNumbers();
  updateSuperpowersUI();

  if (introBoost) {
    introBoost.textContent = `⚡ ${stats.totalMult.toFixed(1)}x BOOST • ${stats.winChance}% GOAL`;
  }

  sfx.playIntroFanfare();

  let progress = 0;
  const stepMs = 45;
  const totalMs = 3400;

  if (introKicker) introKicker.textContent = "🔥 $EFOO-8fe2d4 • 92.91% SUPPLY BURNED";
  if (introHeadline) {
    introHeadline.textContent =
      currentLang === "ro" ? "STADIONUL MULTIVERSX PREZINTĂ" : "MULTIVERSX STADIUM PRESENTS";
  }

  const timer = setInterval(() => {
    progress += stepMs / totalMs;
    if (introFill) introFill.style.width = `${Math.min(100, progress * 100).toFixed(0)}%`;

    if (progress >= 0.42 && progress < 0.78) {
      if (introKicker) introKicker.textContent = "🃏 ON-CHAIN NFT CLASH • EFOOTBALL VS GOALKEEPER";
      if (introHeadline) {
        introHeadline.textContent = `${activeStriker.name.toUpperCase()} ⚡ VS ⚡ ${activeKeeper.name.toUpperCase()}`;
      }
    } else if (progress >= 0.78) {
      if (introKicker) introKicker.textContent = "⏱️ 90+5' INJURY TIME • 25,400,000 $EFOO POT";
      if (introHeadline) {
        introHeadline.textContent =
          currentLang === "ro" ? "⚽ FLUIERUL DE START — ȘUTEAZĂ!" : "⚽ KICK OFF — PICK YOUR CORNER!";
      }
    }

    if (progress >= 1) {
      clearInterval(timer);
      if (introOverlay) introOverlay.classList.add("hidden");
      sfx.playWhistle();
      beginPenaltyRound();
    }
  }, stepMs);
}

function beginPenaltyRound() {
  matchState.phase = "aiming";
  const stats = getEffectivePowerStats();

  // Rotate Boss Keeper NFT every round so all Goalkeeper NFTs appear in action
  const keeperIdx = (matchState.round - 1) % BOSS_KEEPERS.length;
  setActiveKeeperNft(BOSS_KEEPERS[keeperIdx]);

  // Pick a random Golden 2x Bullseye zone
  const zoneKeys = Object.keys(GOAL_ZONES);
  matchState.goldenZone = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];

  // Pre-decide which direction the keeper is leaning so 3+ NFT Alien Radar can reveal it!
  matchState.predecidedKeeperZone = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];

  // Render Golden Bullseye badge on the 6 zone buttons
  document.querySelectorAll(".goal-zone-btn").forEach((btn) => {
    const z = btn.getAttribute("data-zone");
    btn.classList.remove("selected", "golden-bullseye");
    const oldTag = btn.querySelector(".gz-bonus-tag");
    if (oldTag) oldTag.remove();

    if (z === matchState.goldenZone) {
      btn.classList.add("golden-bullseye");
      const badge = document.createElement("span");
      badge.className = "gz-bonus-tag";
      badge.textContent = "⭐ 2x PTS";
      btn.appendChild(badge);
    }
  });

  // Show 6 Target Zones, hide Timing Bar
  document.getElementById("goal-targets-layer")?.classList.remove("hidden");
  document.getElementById("timing-meter-hud")?.classList.add("hidden");

  // Show Alien Telepathy Radar if player holds 3+ Player NFTs
  const radarEl = document.getElementById("telepathy-radar-alert");
  const radarHint = document.getElementById("radar-dive-hint");
  if (radarEl && radarHint) {
    if (stats.hasRadar) {
      const diveSide =
        matchState.predecidedKeeperZone.endsWith("l")
          ? "LEFT ⬅️"
          : matchState.predecidedKeeperZone.endsWith("r")
          ? "RIGHT ➡️"
          : "CENTER ⬆️";
      radarHint.textContent = diveSide;
      radarEl.classList.remove("hidden");
    } else {
      radarEl.classList.add("hidden");
    }
  }

  setCommentary(
    currentLang === "ro"
      ? `⚽ <strong>Seria ${matchState.round}:</strong> Alege unul din cele 6 colțuri ale porții! (⭐ <strong>${GOAL_ZONES[matchState.goldenZone].label}</strong> oferă <strong>2x Puncte</strong>!)`
      : `⚽ <strong>Shot ${matchState.round}:</strong> Click any of the 6 target zones in the goal! (⭐ <strong>${GOAL_ZONES[matchState.goldenZone].label}</strong> gives <strong>2x Points</strong>!)`
  );
}

function selectTargetZoneAndStartMeter(zoneKey) {
  if (matchState.phase !== "aiming") return;
  matchState.selectedZone = zoneKey;
  matchState.phase = "timing";

  const stats = getEffectivePowerStats();

  // Sweet Spot Width scales with NFTs & 1M+ $EFOO!
  // Base width: 18%, with NFTs/EFOO: up to 34%!
  const width = 0.18 + (stats.hasCurve ? 0.06 : 0) + (stats.hasRocketBall ? 0.08 : 0);
  const start = 0.50 - width / 2;
  matchState.sweetSpotStart = start;
  matchState.sweetSpotWidth = width;
  matchState.meterPos = 0.08;
  matchState.meterDir = 1;

  const sweetZoneEl = document.getElementById("tm-sweet-zone");
  if (sweetZoneEl) {
    sweetZoneEl.style.left = `${(start * 100).toFixed(1)}%`;
    sweetZoneEl.style.width = `${(width * 100).toFixed(1)}%`;
  }

  const labelEl = document.getElementById("tm-zone-label");
  if (labelEl) {
    labelEl.textContent = `🎯 TARGET: ${GOAL_ZONES[zoneKey]?.label || zoneKey.toUpperCase()}`;
  }

  document.getElementById("goal-targets-layer")?.classList.add("hidden");
  document.getElementById("timing-meter-hud")?.classList.remove("hidden");
}

function lockPowerAndFireShot() {
  if (matchState.phase !== "timing") return;
  matchState.phase = "flying";

  document.getElementById("timing-meter-hud")?.classList.add("hidden");
  document.getElementById("telepathy-radar-alert")?.classList.add("hidden");

  const stats = getEffectivePowerStats();
  const pos = matchState.meterPos;
  const isSweetSpot =
    pos >= matchState.sweetSpotStart && pos <= matchState.sweetSpotStart + matchState.sweetSpotWidth;
  const isOverhit = pos > 0.93 && !stats.hasCurve; // Striker NFT prevents skyballs!

  sfx.playKick(isSweetSpot);

  const zKey = matchState.selectedZone;
  const targetCoord = GOAL_ZONES[zKey] || GOAL_ZONES.tl;

  // Decide Keeper Dive based on Player's NFT Win Chance + Sweet Spot
  let keeperZone = matchState.predecidedKeeperZone;
  const effectiveWinProb = Math.min(0.96, stats.winChance / 100 + (isSweetSpot ? 0.18 : 0));

  const willScoreRaw = !isOverhit && Math.random() < effectiveWinProb;
  if (willScoreRaw && keeperZone === zKey) {
    // Fake out keeper so he dives to a different corner
    const otherZones = Object.keys(GOAL_ZONES).filter((k) => k !== zKey);
    keeperZone = otherZones[Math.floor(Math.random() * otherZones.length)];
  } else if (!willScoreRaw && !isOverhit) {
    keeperZone = zKey;
  }

  const keeperTarget = GOAL_ZONES[keeperZone] || GOAL_ZONES.bc;
  matchState.keeperAnim.targetX = keeperTarget.x;
  matchState.keeperAnim.targetY = keeperTarget.y + 18;
  matchState.keeperAnim.diveAngle =
    keeperTarget.x < 400 ? -0.42 : keeperTarget.x > 500 ? 0.42 : 0;

  // Setup 3D Bezier Curve for the Ball
  const curveOffset = stats.hasCurve ? (targetCoord.x < 450 ? -95 : targetCoord.x > 450 ? 95 : -55) : 0;
  matchState.ballAnim = {
    active: true,
    progress: 0,
    startX: 450,
    startY: 458,
    ctrlX: (450 + targetCoord.x) / 2 + curveOffset,
    ctrlY: 245,
    endX: targetCoord.x,
    endY: isOverhit ? 42 : targetCoord.y,
    isSweetSpot,
    isMultiBall: isSweetSpot && stats.hasMultiBall,
    willScoreRaw,
    isOverhit,
    ricochetTriggered: false
  };

  matchState.strikerKickOffset = 18;
}

function resolveShotOutcome() {
  const stats = getEffectivePowerStats();
  const ba = matchState.ballAnim;
  const isBullseye = matchState.selectedZone === matchState.goldenZone;

  let isGoal = ba.willScoreRaw;
  let usedShield = false;

  // Check Goalkeeper NFT Save Shield if shot was blocked!
  if (!isGoal && matchState.shieldsLeft > 0) {
    matchState.shieldsLeft -= 1;
    isGoal = true;
    usedShield = true;
    sfx.playCrossbarClang();
    spawnBurstParticles(ba.endX, ba.endY, "#ffb800", 36);
  }

  if (isGoal) {
    const goalsAdded = ba.isMultiBall ? 2 : 1;
    matchState.goals += goalsAdded;
    matchState.streak += 1;

    const baseShotPts = (1000 + matchState.streak * 300) * (isBullseye ? 2 : 1) * (ba.isSweetSpot ? 1.5 : 1);
    const totalShotPts = Math.round(baseShotPts * stats.totalMult + stats.rocketFlatBonus) * goalsAdded;

    matchState.unboostedScore += Math.round(baseShotPts);
    matchState.score += totalShotPts;

    if (matchState.score > matchState.bestScore) {
      matchState.bestScore = matchState.score;
      localStorage.setItem("efoo_fomo_best", String(matchState.bestScore));
    }

    matchState.netRipple = 1.0;
    matchState.screenShake = ba.isSweetSpot ? 12 : 6;
    matchState.bannerFlash = usedShield
      ? "🧤 KEEPER NFT SHIELD RICOCHET GOAL!"
      : ba.isMultiBall
      ? `⚡ DOUBLE-BALL OVERDRIVE! +${totalShotPts.toLocaleString()}`
      : ba.isSweetSpot
      ? `🔥 PERFECT ROCKET GOOOOL! +${totalShotPts.toLocaleString()}`
      : `⚽ GOOOOL! +${totalShotPts.toLocaleString()}`;
    matchState.bannerColor = usedShield ? "#ffb800" : "#a8ff00";

    sfx.playGoalRoar();
    spawnBurstParticles(ba.endX, ba.endY, "#a8ff00", 45);

    setCommentary(
      usedShield
        ? `🧤🛡️ <strong>GOALKEEPER NFT SHIELD SAVED YOUR STREAK!</strong> Ball ricocheted off the post and went IN (+${totalShotPts.toLocaleString()} pts)!`
        : `⚽🔥 <strong>TOP BINS GOOOOL!</strong> Scored with <strong>${activeStriker.name}</strong> (+${totalShotPts.toLocaleString()} pts • ${stats.totalMult.toFixed(1)}x Multiplier)!`
    );
  } else {
    matchState.streak = 0;
    matchState.screenShake = 5;
    matchState.bannerFlash = ba.isOverhit ? "❌ OVERHIT SKYBALL!" : `🧤 SAVED BY ${activeKeeper.name.toUpperCase()}!`;
    matchState.bannerColor = "#ef4444";

    sfx.playSaveThud();
    spawnBurstParticles(ba.endX, ba.endY, "#ef4444", 24);

    setCommentary(
      currentLang === "ro"
        ? `🧤❌ <strong>APĂRAT DE ${activeKeeper.name}!</strong> Cu mai multe NFT-uri EFOOTBALL sau un Portar NFT ai fi avut Scut de Ricoseu și +35% Precizie!`
        : `🧤❌ <strong>SAVED BY ${activeKeeper.name}!</strong> Holding a Goalkeeper NFT or more Striker NFTs gives you a Free Post-Ricochet Shield & up to 90% Goal Chance!`
    );
  }

  updateHudNumbers();
  updateSuperpowersUI();

  // Advance to next round or Match Summary after 1.35s
  setTimeout(() => {
    matchState.bannerFlash = "";
    matchState.keeperAnim.targetX = 450;
    matchState.keeperAnim.targetY = 185;
    matchState.keeperAnim.diveAngle = 0;

    // Check if regulation 5 shots completed
    if (matchState.round >= matchState.maxRegRounds) {
      // If Pro Eligible (holds NFT or 1M+ $EFOO) AND scored on this shot, unlock Sudden Death Overdrive!
      if (stats.isProEligible && isGoal && matchState.round < 10) {
        matchState.round += 1;
        setCommentary(
          `🔥⚡ <strong>SUDDEN DEATH OVERDRIVE (ROUND ${matchState.round})!</strong> Unlocked by your NFT / $EFOO Club Pass!`
        );
        beginPenaltyRound();
        return;
      }
      showMatchSummaryModal();
    } else {
      matchState.round += 1;
      beginPenaltyRound();
    }
  }, 1350);
}

function showMatchSummaryModal() {
  matchState.phase = "summary";
  sfx.playWhistle();

  const overlay = document.getElementById("match-summary-overlay");
  const finalScoreEl = document.getElementById("ms-final-score");
  const potentialEl = document.getElementById("ms-potential-score");
  const hookEl = document.getElementById("ms-fomo-hook");

  const stats = getEffectivePowerStats();
  // Calculate what this exact run would have scored with 3+ NFTs + 1 Keeper + 1M $EFOO (7.0x + 1,000/goal)
  const whalePotential = Math.max(
    matchState.score,
    Math.round(matchState.unboostedScore * 7.0 + Math.max(3, matchState.goals) * 2500)
  );

  if (finalScoreEl) finalScoreEl.textContent = `${matchState.score.toLocaleString("en-US")} pts`;
  if (potentialEl) potentialEl.textContent = `${whalePotential.toLocaleString("en-US")} pts 🏆`;

  if (hookEl) {
    if (stats.isProEligible) {
      hookEl.innerHTML =
        currentLang === "ro"
          ? `🏆 <strong>CALIFICAT PENTRU POTUL DE 25.4M $EFOO!</strong> Ai marcat <strong>${matchState.goals} goluri</strong> cu multiplicatorul <strong>${stats.totalMult.toFixed(1)}x</strong>! Mintează încă un NFT sau șutează 100k $EFOO în Pot pentru a deveni Ultimul Marcator!`
          : `🏆 <strong>QUALIFIED FOR THE 25.4M $EFOO STADIUM POT!</strong> You scored <strong>${matchState.goals} goals</strong> with a <strong>${stats.totalMult.toFixed(1)}x</strong> multiplier! Kick 100k $EFOO into the Pot or mint more NFTs to climb higher!`;
    } else {
      hookEl.innerHTML =
        currentLang === "ro"
          ? `😱 <strong>AI PIERDUT ${(whalePotential - matchState.score).toLocaleString("en-US")} PUNCTE BONUS!</strong> Cu <strong>3x NFT-uri Atacant + 1M $EFOO</strong>, acest meci ți-ar fi adus <strong>${whalePotential.toLocaleString("en-US")} puncte</strong> și te-ar fi calificat pentru <strong>Potul de 25,400,000 $EFOO</strong>!`
          : `😱 <strong>YOU MISSED ${(whalePotential - matchState.score).toLocaleString("en-US")} BONUS POINTS!</strong> With <strong>3x Striker NFTs + 1M $EFOO</strong>, this exact match would score <strong>${whalePotential.toLocaleString("en-US")} pts</strong> and unlock <strong>Sudden Death + 25.4M $EFOO Jackpot Eligibility</strong>!`;
    }
  }

  if (overlay) overlay.classList.remove("hidden");
}

function updateHudNumbers() {
  const rEl = document.getElementById("hud-round");
  const gEl = document.getElementById("hud-goals");
  const sEl = document.getElementById("hud-score");

  if (rEl) {
    rEl.textContent =
      matchState.round > matchState.maxRegRounds
        ? `⚡ SD #${matchState.round}`
        : `${matchState.round} / ${matchState.maxRegRounds}`;
  }
  if (gEl) gEl.textContent = `${matchState.goals} (${matchState.streak}x 🔥)`;
  if (sEl) sEl.textContent = matchState.score.toLocaleString("en-US");
}

function setCommentary(html) {
  const el = document.getElementById("arena-commentary-text");
  if (el) el.innerHTML = html;
}

// ============================================================================
// 60FPS HTML5 STADIUM CANVAS RENDERER (REAL NFT GRAPHICS + PHYSICS)
// ============================================================================
function spawnBurstParticles(x, y, color, count = 30) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 7;
    matchState.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      r: 2.5 + Math.random() * 4.5,
      color,
      alpha: 1.0
    });
  }
}

function initStadiumCanvasLoop() {
  const canvas = document.getElementById("stadium-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Initialize crowd flashbulbs in upper stands
  for (let i = 0; i < 48; i++) {
    matchState.crowdBulbs.push({
      x: 40 + Math.random() * 820,
      y: 12 + Math.random() * 58,
      alpha: Math.random(),
      speed: 0.015 + Math.random() * 0.03
    });
  }

  function render() {
    const W = canvas.width;
    const H = canvas.height;

    // 1. Update Timing Bar Pendulum if in "timing" phase
    if (matchState.phase === "timing") {
      const stats = getEffectivePowerStats();
      const speed = stats.slowMoBar ? 0.013 : 0.020;
      matchState.meterPos += speed * matchState.meterDir;
      if (matchState.meterPos >= 0.98) {
        matchState.meterPos = 0.98;
        matchState.meterDir = -1;
      } else if (matchState.meterPos <= 0.02) {
        matchState.meterPos = 0.02;
        matchState.meterDir = 1;
      }
      const cursorEl = document.getElementById("tm-cursor");
      if (cursorEl) {
        cursorEl.style.left = `${(matchState.meterPos * 100).toFixed(1)}%`;
      }
    }

    // 2. Update Keeper Sway & Dive Animation
    if (matchState.phase === "aiming" || matchState.phase === "timing") {
      matchState.keeperAnim.x = 450 + Math.sin(Date.now() * 0.004) * 38;
      matchState.keeperAnim.y = 185 + Math.abs(Math.cos(Date.now() * 0.008)) * 6;
      matchState.keeperAnim.diveAngle = Math.sin(Date.now() * 0.004) * 0.06;
    } else {
      matchState.keeperAnim.x += (matchState.keeperAnim.targetX - matchState.keeperAnim.x) * 0.22;
      matchState.keeperAnim.y += (matchState.keeperAnim.targetY - matchState.keeperAnim.y) * 0.22;
    }

    if (matchState.strikerKickOffset > 0) {
      matchState.strikerKickOffset *= 0.86;
    }
    if (matchState.netRipple > 0.01) {
      matchState.netRipple *= 0.92;
    }

    ctx.save();
    if (matchState.screenShake > 0.2) {
      const dx = (Math.random() - 0.5) * matchState.screenShake;
      const dy = (Math.random() - 0.5) * matchState.screenShake;
      ctx.translate(dx, dy);
      matchState.screenShake *= 0.85;
    }

    // 3. Draw Night Stadium Sky & Floodlights
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 265);
    skyGrad.addColorStop(0, "#030806");
    skyGrad.addColorStop(1, "#0d2618");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, 265);

    // Floodlight volumetric cones
    ctx.fillStyle = "rgba(168, 255, 0, 0.055)";
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(260, 265);
    ctx.lineTo(520, 265);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 184, 0, 0.05)";
    ctx.beginPath();
    ctx.moveTo(820, 0);
    ctx.lineTo(380, 265);
    ctx.lineTo(640, 265);
    ctx.closePath();
    ctx.fill();

    // Stadium Crowd Silhouettes & Camera Flashbulbs
    ctx.fillStyle = "#06110b";
    ctx.fillRect(0, 18, W, 62);
    matchState.crowdBulbs.forEach((b) => {
      b.alpha += b.speed;
      const a = Math.abs(Math.sin(b.alpha));
      ctx.fillStyle = a > 0.92 ? "#ffffff" : `rgba(168, 255, 0, ${a * 0.35})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, a > 0.92 ? 2.6 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // LED Stadium Advertising Hoarding
    ctx.fillStyle = "#07140d";
    ctx.fillRect(0, 246, W, 24);
    ctx.strokeStyle = "#a8ff00";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 246, W, 24);
    ctx.fillStyle = "#a8ff00";
    ctx.font = "700 12px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      "🔥 SUNDAY LEAGUE DEGEN FC ($EFOO) • 92.91% BURNED • EFOOTBALL-91a4eb & GOALKEEPER-cb9e3e NFT ARENA 🔥",
      W / 2,
      262
    );

    // 4. Draw 3D Perspective Turf Pitch
    const turfGrad = ctx.createLinearGradient(0, 270, 0, H);
    turfGrad.addColorStop(0, "#0b2917");
    turfGrad.addColorStop(0.5, "#0f381f");
    turfGrad.addColorStop(1, "#071c10");
    ctx.fillStyle = turfGrad;
    ctx.fillRect(0, 270, W, H - 270);

    // Mowed Perspective Grass Stripes
    for (let i = -4; i <= 4; i++) {
      if (i % 2 === 0) continue;
      ctx.fillStyle = "rgba(168, 255, 0, 0.032)";
      ctx.beginPath();
      ctx.moveTo(450 + i * 55, 270);
      ctx.lineTo(450 + (i + 1) * 55, 270);
      ctx.lineTo(450 + (i + 1) * 135, H);
      ctx.lineTo(450 + i * 135, H);
      ctx.closePath();
      ctx.fill();
    }

    // Penalty Box Perspective White Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(140, 270);
    ctx.lineTo(40, H);
    ctx.moveTo(760, 270);
    ctx.lineTo(860, H);
    ctx.stroke();

    // 5. Draw 3D Goal Frame & Reactive Net Mesh
    const gx = 205;
    const gy = 72;
    const gw = 490;
    const gh = 182;

    // Goal Net Vertical & Horizontal Mesh with Ripple Deformation
    ctx.strokeStyle =
      matchState.netRipple > 0.1
        ? `rgba(168, 255, 0, ${0.28 + matchState.netRipple * 0.45})`
        : "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    const rippleAmp = matchState.netRipple * 14;

    for (let x = gx + 18; x < gx + gw; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      const midX = x + Math.sin((x + Date.now() * 0.02) * 0.05) * rippleAmp;
      ctx.quadraticCurveTo(midX, gy + gh / 2, x, gy + gh);
      ctx.stroke();
    }
    for (let y = gy + 16; y < gy + gh; y += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, y);
      const midY = y - Math.cos((y + Date.now() * 0.02) * 0.05) * rippleAmp;
      ctx.quadraticCurveTo(450, midY, gx + gw, y);
      ctx.stroke();
    }

    // Glowing White/Neon Goalposts & Crossbar
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 7;
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(168, 255, 0, 0.55)";
    ctx.shadowBlur = 14;
    ctx.strokeRect(gx, gy, gw, gh);
    ctx.shadowBlur = 0;

    // 6. Draw Real GOALKEEPER-cb9e3e NFT Boss Character in Goal
    ctx.save();
    ctx.translate(matchState.keeperAnim.x, matchState.keeperAnim.y);
    ctx.rotate(matchState.keeperAnim.diveAngle);

    // Outer Golden Keeper Aura
    ctx.fillStyle = "rgba(255, 184, 0, 0.18)";
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();

    // Animated Keeper Gloves on Left & Right of the NFT Card
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🧤", -58, -6);
    ctx.fillText("🧤", 58, -6);

    // Draw Real Goalkeeper NFT Card Image
    const kw = 82;
    const kh = 92;
    ctx.fillStyle = "#08140d";
    ctx.strokeStyle = "#ffb800";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-kw / 2, -kh / 2, kw, kh, 12);
    ctx.fill();
    ctx.stroke();

    if (loadedImages.keeperCard.complete && loadedImages.keeperCard.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-kw / 2 + 2, -kh / 2 + 2, kw - 4, kh - 22, 10);
      ctx.clip();
      ctx.drawImage(loadedImages.keeperCard, -kw / 2 + 2, -kh / 2 + 2, kw - 4, kh - 22);
      ctx.restore();
    }

    ctx.fillStyle = "#ffb800";
    ctx.font = "700 10px 'JetBrains Mono', monospace";
    ctx.fillText(activeKeeper.name.toUpperCase(), 0, kh / 2 - 7);
    ctx.restore();

    // 7. Draw Real EFOOTBALL-91a4eb Striker NFT Card in Foreground (Left of Penalty Spot)
    ctx.save();
    const sx = 128 + matchState.strikerKickOffset;
    const sy = 415 - matchState.strikerKickOffset * 0.5;
    ctx.translate(sx, sy);
    ctx.rotate(matchState.strikerKickOffset * 0.012);

    // Neon Striker Aura
    ctx.shadowColor = "rgba(168, 255, 0, 0.65)";
    ctx.shadowBlur = 22;
    ctx.fillStyle = "#07150e";
    ctx.strokeStyle = "#a8ff00";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-58, -74, 116, 142, 14);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (loadedImages.strikerCard.complete && loadedImages.strikerCard.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-54, -70, 108, 106, 10);
      ctx.clip();
      ctx.drawImage(loadedImages.strikerCard, -54, -70, 108, 106);
      ctx.restore();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(activeStriker.name.slice(0, 18), 0, 50);
    ctx.fillStyle = "#a8ff00";
    ctx.font = "700 9px 'JetBrains Mono', monospace";
    ctx.fillText("⚽ ACTIVE STRIKER NFT", 0, 62);
    ctx.restore();

    // 8. Draw Penalty Spot & Ball (Either waiting on spot or flying along 3D Bezier curve)
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.ellipse(450, 468, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (matchState.ballAnim.active) {
      const ba = matchState.ballAnim;
      ba.progress += 0.042;
      const t = Math.min(1, ba.progress);

      // Quadratic Bezier Interpolation
      const invT = 1 - t;
      const bx = invT * invT * ba.startX + 2 * invT * t * ba.ctrlX + t * t * ba.endX;
      const by = invT * invT * ba.startY + 2 * invT * t * ba.ctrlY + t * t * ba.endY;
      const radius = 30 * (1 - t * 0.42);

      // Spawn Fire/Neon Trail Particles
      const stats = getEffectivePowerStats();
      const trailColor =
        ba.isSweetSpot || stats.hasRocketBall ? "#ff5500" : stats.hasCurve ? "#a8ff00" : "#ffffff";
      matchState.particles.push({
        x: bx + (Math.random() - 0.5) * 10,
        y: by + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.8,
        vy: 1.2 + Math.random() * 2,
        r: 3 + Math.random() * 5,
        color: trailColor,
        alpha: 0.9
      });

      // Draw Main Rocket Football
      drawSpinningRocketBall(ctx, bx, by, radius, t * 16);

      // If 6+ NFTs Multi-Ball Overdrive is active, draw the 2nd twin Rocket Ball!
      if (ba.isMultiBall) {
        drawSpinningRocketBall(ctx, bx + Math.sin(t * 8) * 34, by - 14, radius * 0.9, -t * 16);
      }

      if (ba.progress >= 1) {
        ba.active = false;
        resolveShotOutcome();
      }
    } else if (matchState.phase === "aiming" || matchState.phase === "timing") {
      // Draw stationary Rocket Ball on the penalty spot pulsing with energy
      const pulseR = 29 + Math.sin(Date.now() * 0.008) * 2;
      drawSpinningRocketBall(ctx, 450, 455, pulseR, Date.now() * 0.002);
    }

    // 9. Update & Render Particles
    for (let i = matchState.particles.length - 1; i >= 0; i--) {
      const p = matchState.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.028;
      if (p.alpha <= 0) {
        matchState.particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 10. Draw Big Result Banner Flash (GOOOOL / SAVED / RICOCHET)
    if (matchState.bannerFlash) {
      ctx.save();
      ctx.fillStyle = "rgba(4, 10, 7, 0.85)";
      ctx.strokeStyle = matchState.bannerColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(170, 295, 560, 64, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = matchState.bannerColor;
      ctx.font = "700 32px 'Bebas Neue', Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(matchState.bannerFlash, 450, 329);
      ctx.restore();
    }

    ctx.restore();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function drawSpinningRocketBall(ctx, x, y, radius, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.shadowColor = "rgba(255, 85, 0, 0.8)";
  ctx.shadowBlur = 18;

  if (loadedImages.rocketBall.complete && loadedImages.rocketBall.naturalWidth > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(loadedImages.rocketBall, -radius, -radius, radius * 2, radius * 2);
  } else {
    ctx.fillStyle = "#ff5500";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// MULTIVERSX WALLET LOGIN & ON-CHAIN TRANSACTIONS (BUY $EFOO / MINT NFT / POT)
// ============================================================================
function getCallbackUrl() {
  return window.location.origin + window.location.pathname;
}

function getMultiversXLoginHookUrl() {
  return `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(getCallbackUrl())}`;
}

async function initXPortalWalletConnect() {
  const qrBox = document.getElementById("xportal-qr-box");
  const statusPill = document.getElementById("wc-status-pill");
  const qrImg = document.getElementById("xportal-qr-img");
  const bridgeLink = document.getElementById("xportal-bridge-link");

  if (qrBox) qrBox.classList.remove("hidden");
  if (statusPill) statusPill.textContent = "⏳ Generating official WalletConnect v2 QR...";

  try {
    if (!wcSignClient) {
      let SignClientMod;
      try {
        SignClientMod = await import("https://esm.sh/@walletconnect/sign-client@2.11.0?bundle");
      } catch (e1) {
        SignClientMod = await import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client@2.11.0/+esm");
      }
      const SignClient = SignClientMod.SignClient || SignClientMod.default;
      wcSignClient = await SignClient.init({
        projectId: CONTRACTS.WC_PROJECT_ID,
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "EFOO FOMO Arena ($EFOO)",
          description: "90+5' NFT Penalty Shootout & Stadium Pot on MultiversX",
          url: window.location.origin,
          icons: ["https://elrondfootballnfts.github.io/EFOOTBALLX/branding/original/assests-2022/logo.png"]
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
      currentWcUri = uri;
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=050a07&bgcolor=a8ff00&data=${encodeURIComponent(uri)}`;
      }
      if (bridgeLink) {
        bridgeLink.href = `https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=${encodeURIComponent("https://maiar.com/?wallet-connect=" + encodeURIComponent(uri))}`;
      }
      if (statusPill) statusPill.textContent = "📲 Scan QR with xPortal App or tap Open in xPortal";
    }

    const session = await approval();
    wcSessionTopic = session.topic;
    localStorage.setItem("efoo_wc_topic", wcSessionTopic);

    const accounts = session?.namespaces?.mvx?.accounts || [];
    if (accounts.length > 0) {
      const erdAddr = accounts[0].split(":").pop();
      connectWithWalletAddress(erdAddr, "xportal");
    }
  } catch (err) {
    console.warn("WC init fallback:", err);
    const loginUrl = getMultiversXLoginHookUrl();
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=050a07&bgcolor=a8ff00&data=${encodeURIComponent(loginUrl)}`;
    }
  }
}

async function connectDefiExtension() {
  if (!window.elrondWallet) {
    window.open(
      "https://chromewebstore.google.com/detail/multiversx-defi-wallet/dngmlblcodfobpdpecaadgfbcggfjfnm",
      "_blank"
    );
    return;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 12000);
    function onMsg(event) {
      if (event.source !== window || !event.data) return;
      const msg = event.data;
      if (msg.target === "erdw-contentScript" && (msg.type === "connectResponse" || msg.type === "loginResponse")) {
        window.removeEventListener("message", onMsg);
        clearTimeout(timeout);
        const addr = msg.data?.address || (typeof msg.data === "string" ? msg.data : "");
        if (addr && addr.startsWith("erd1")) {
          connectWithWalletAddress(addr, "extension");
          resolve(true);
        }
      }
    }
    window.addEventListener("message", onMsg);
    window.postMessage({ target: "erdw-inpage", type: "connect", data: {} }, "*");
  });
}

function connectWithWalletAddress(address, providerType = "webwallet") {
  const clean = (address || "").trim();
  if (!clean.startsWith("erd1") || clean.length < 40) {
    showToast("⚠️ Please enter a valid MultiversX address starting with <code>erd1...</code>");
    return;
  }

  connectedAddress = clean;
  connectedProvider = providerType;
  localStorage.setItem("efoo_wallet_address", clean);
  localStorage.setItem("efoo_wallet_provider", providerType);

  document.getElementById("wallet-modal-backdrop")?.classList.add("hidden");
  updateNavWalletButton();
  fetchConnectedWalletData(clean);
}

function updateNavWalletButton() {
  const dot = document.getElementById("nav-wallet-dot");
  const label = document.getElementById("nav-wallet-label");
  if (connectedAddress) {
    dot?.classList.add("connected");
    if (label) label.textContent = shortErd(connectedAddress);
  } else {
    dot?.classList.remove("connected");
    if (label) label.textContent = GAME_I18N[currentLang].nav_connect;
  }
}

async function fetchConnectedWalletData(address) {
  try {
    const [accRes, tokRes, pCountRes, kCountRes, nftsRes] = await Promise.all([
      fetch(`https://api.multiversx.com/accounts/${address}`),
      fetch(`https://api.multiversx.com/accounts/${address}/tokens?identifiers=EFOO-8fe2d4`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=EFOOTBALL-91a4eb`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts/count?collections=GOALKEEPER-cb9e3e`),
      fetch(`https://api.multiversx.com/accounts/${address}/nfts?collections=EFOOTBALL-91a4eb,GOALKEEPER-cb9e3e&size=20`)
    ]);

    if (accRes.ok) {
      const acc = await accRes.json();
      walletState.egldBalance = Number(acc.balance || 0) / 1e18;
      walletState.nonce = Number(acc.nonce || 0);
      walletState.shard = Number(acc.shard || 0);
    }

    walletState.efooBalance = 0;
    if (tokRes.ok) {
      const toks = await tokRes.json();
      if (toks.length > 0) {
        walletState.efooBalance = Number(toks[0].balance || 0) / 1e18;
      }
    }

    walletState.playersCount = pCountRes.ok ? Number(await pCountRes.text()) || 0 : 0;
    walletState.keepersCount = kCountRes.ok ? Number(await kCountRes.text()) || 0 : 0;
    walletState.ownedNfts = nftsRes.ok ? await nftsRes.json() : [];

    const stats = getEffectivePowerStats();
    matchState.shieldsLeft = stats.maxShields;

    renderSquadPickerStrip();
    if (walletState.ownedNfts.length > 0) {
      const firstPlayer = walletState.ownedNfts.find((n) => n.collection === "EFOOTBALL-91a4eb");
      if (firstPlayer) {
        setActiveStrikerNft({
          identifier: firstPlayer.identifier,
          name: firstPlayer.name || firstPlayer.identifier,
          trait: "✅ Owned in Your Wallet",
          url:
            (firstPlayer.media &&
              firstPlayer.media[0] &&
              (firstPlayer.media[0].url || firstPlayer.media[0].thumbnailUrl)) ||
            firstPlayer.url
        });
      }
    }

    updateSuperpowersUI();
    updateHudNumbers();
  } catch (err) {
    console.warn("Error fetching wallet data on game page:", err);
  }
}

async function signAndBroadcastTransactions(rawTxList) {
  if (!connectedAddress || connectedProvider === "demo" || connectedProvider === "inspector") {
    document.getElementById("wallet-modal-backdrop")?.classList.remove("hidden");
    showToast("⚡ Connect your wallet (xPortal, DeFi Extension, or Web Wallet) to sign this transaction!");
    return;
  }

  try {
    const accRes = await fetch(`https://api.multiversx.com/accounts/${connectedAddress}`);
    if (accRes.ok) {
      const acc = await accRes.json();
      walletState.nonce = Number(acc.nonce || 0);
      walletState.shard = Number(acc.shard || 0);
    }
  } catch (e) {
    console.warn("Using cached nonce:", e);
  }

  const preparedTxs = rawTxList.map((tx, idx) => ({
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

  showToast("🚀 Redirecting to MultiversX Wallet to sign your transaction...");
  setTimeout(() => {
    window.location.href = `https://wallet.multiversx.com/hook/sign?${params.toString()}`;
  }, 500);
}

function quickBuy3MEfoo() {
  const amt = 0.1;
  const weiStr = (BigInt(Math.round(amt * 1e9)) * BigInt(1e9)).toString();
  const shardWrapper = CONTRACTS.WEGLD_WRAPPERS[walletState.shard] || CONTRACTS.WEGLD_WRAPPERS[0];
  const tokenHex = strToHex("WEGLD-bd4d79");
  const amtHex = amountToHex(amt, 18);
  const funcHex = strToHex("swapMultiTokensFixedInput");
  const efooHex = strToHex("EFOO-8fe2d4");
  const swapData = `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`;

  signAndBroadcastTransactions([
    {
      receiver: shardWrapper,
      value: weiStr,
      gasLimit: 8000000,
      data: "wrapEgld"
    },
    {
      receiver: CONTRACTS.ONEDEX_PAIR,
      value: "0",
      gasLimit: 85000000,
      data: swapData
    }
  ]);
}

function quickMintStrikerNft() {
  const brandHex = strToHex("1stGenPlayers");
  signAndBroadcastTransactions([
    {
      receiver: CONTRACTS.NFT_MINTER,
      value: "80000000000000000", // 0.08 EGLD
      gasLimit: 42000000,
      data: `buy@${brandHex}@${brandHex}@01`
    }
  ]);
}

function quickMintKeeperNft() {
  const brandHex = strToHex("GoalKeepers");
  signAndBroadcastTransactions([
    {
      receiver: CONTRACTS.NFT_MINTER,
      value: "350000000000000000", // 0.35 EGLD
      gasLimit: 42000000,
      data: `buy@${brandHex}@${brandHex}@01`
    }
  ]);
}

function kick100kIntoFomoPot() {
  matchState.fomoSeconds = 300;
  matchState.fomoPot += 100000;
  const potEl = document.getElementById("fomo-pot-amount");
  if (potEl) potEl.textContent = `${matchState.fomoPot.toLocaleString("en-US")} $EFOO`;

  const tokenHex = strToHex("EFOO-8fe2d4");
  const amtHex = amountToHex(100000, 18);
  signAndBroadcastTransactions([
    {
      receiver: CONTRACTS.FOMO_RESERVE,
      value: "0",
      gasLimit: 1500000,
      data: `ESDTTransfer@${tokenHex}@${amtHex}`
    }
  ]);
}

// ============================================================================
// LANGUAGE SWITCHER & INITIALIZATION
// ============================================================================
function setGameLanguage(lang) {
  currentLang = lang === "ro" ? "ro" : "en";
  localStorage.setItem("efoo_lang", currentLang);
  document.documentElement.lang = currentLang;

  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-set-lang") === currentLang);
  });

  const dict = GAME_I18N[currentLang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });

  updateNavWalletButton();
  updateSuperpowersUI();
}

document.addEventListener("DOMContentLoaded", () => {
  // Check URL for Web Wallet callback address
  const urlParams = new URLSearchParams(window.location.search);
  const urlAddr = urlParams.get("address");
  if (urlAddr && urlAddr.startsWith("erd1")) {
    connectWithWalletAddress(urlAddr, "webwallet");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Initialize default Striker & Keeper NFT artwork
  setActiveStrikerNft(DEFAULT_STRIKERS[0]);
  setActiveKeeperNft(BOSS_KEEPERS[0]);
  renderSquadPickerStrip();
  initStadiumCanvasLoop();
  setGameLanguage(currentLang);

  if (connectedAddress) {
    fetchConnectedWalletData(connectedAddress);
  }

  // Language buttons
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setGameLanguage(btn.getAttribute("data-set-lang")));
  });

  // Sound FX Toggle
  document.getElementById("sound-toggle-btn")?.addEventListener("click", () => {
    sfx.enabled = !sfx.enabled;
    const lbl = document.getElementById("sound-toggle-label");
    if (lbl) lbl.textContent = sfx.enabled ? "SFX: ON" : "SFX: OFF";
  });

  // Whale Squad God-Mode Preview Toggle
  document.getElementById("demo-whale-btn")?.addEventListener("click", () => {
    walletState.whalePreviewActive = !walletState.whalePreviewActive;
    const stats = getEffectivePowerStats();
    matchState.shieldsLeft = stats.maxShields;
    const lbl = document.getElementById("demo-whale-label");
    if (lbl) {
      lbl.textContent = walletState.whalePreviewActive
        ? GAME_I18N[currentLang].btn_exit_whale
        : GAME_I18N[currentLang].btn_try_whale;
    }
    updateSuperpowersUI();
    updateHudNumbers();
    showToast(
      walletState.whalePreviewActive
        ? "👑 <strong>WHALE GOD-MODE ACTIVATED:</strong> Simulating 11 Striker NFTs + 2 Goalkeeper NFTs + 1.91B $EFOO (<strong>11.0x Score, 90% Win Chance, Alien Radar, Double-Ball & 2x Shields</strong>)!"
        : "⚽ Switched back to your personal wallet stats."
    );
  });

  // START MATCH BUTTON -> Launches 3.8s Cinematic Intro
  document.getElementById("start-match-btn")?.addEventListener("click", startMatchWithIntro);
  document.getElementById("ms-play-again-btn")?.addEventListener("click", startMatchWithIntro);
  document.getElementById("restart-match-btn")?.addEventListener("click", startMatchWithIntro);

  // 6 Goal Zone Buttons (Phase 1 -> Phase 2)
  document.querySelectorAll(".goal-zone-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const z = btn.getAttribute("data-zone") || "tl";
      selectTargetZoneAndStartMeter(z);
    });
  });

  // Phase 2 Timing Meter Lock (Click or Spacebar)
  document.getElementById("tm-shoot-btn")?.addEventListener("click", lockPowerAndFireShot);
  document.getElementById("tm-track")?.addEventListener("click", lockPowerAndFireShot);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && matchState.phase === "timing") {
      e.preventDefault();
      lockPowerAndFireShot();
    }
  });

  // Quick In-Game Store & FOMO Pot Actions
  document.getElementById("quick-buy-efoo-btn")?.addEventListener("click", quickBuy3MEfoo);
  document.getElementById("ms-buy-efoo-btn")?.addEventListener("click", quickBuy3MEfoo);
  document.getElementById("quick-mint-player-btn")?.addEventListener("click", quickMintStrikerNft);
  document.getElementById("ms-mint-nft-btn")?.addEventListener("click", quickMintStrikerNft);
  document.getElementById("quick-mint-keeper-btn")?.addEventListener("click", quickMintKeeperNft);
  document.getElementById("kick-fomo-pot-btn")?.addEventListener("click", kick100kIntoFomoPot);

  // Share Score on X
  document.getElementById("ms-share-x-btn")?.addEventListener("click", () => {
    const stats = getEffectivePowerStats();
    const txt =
      currentLang === "ro"
        ? `⚽ Am marcat ${matchState.goals} goluri și ${matchState.score.toLocaleString()} puncte (${stats.totalMult.toFixed(1)}x NFT Boost) în #EFOO FOMO Arena pe #MultiversX! 🔥\n\nJoacă acum: https://elrondfootballnfts.github.io/EFOOTBALLX/game.html\n@EFootball_X`
        : `⚽ I just scored ${matchState.goals} goals & ${matchState.score.toLocaleString()} pts (${stats.totalMult.toFixed(1)}x NFT Boost) in the #EFOO FOMO Arena on #MultiversX! 🔥\n\nPlay now: https://elrondfootballnfts.github.io/EFOOTBALLX/game.html\n@EFootball_X`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(txt)}`, "_blank");
  });

  // Wallet Modal Open/Close & Providers
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
  document.getElementById("login-manual-btn")?.addEventListener("click", () => {
    const val = document.getElementById("manual-erd-input")?.value || "";
    connectWithWalletAddress(val, "inspector");
  });
  document.getElementById("modal-demo-owner-btn")?.addEventListener("click", () => {
    connectWithWalletAddress(CONTRACTS.CLUB_OWNER_DEMO, "demo");
  });
  document.getElementById("tx-toast-close")?.addEventListener("click", () => {
    document.getElementById("tx-toast")?.classList.add("hidden");
  });

  // 90+5' Countdown Timer
  setInterval(() => {
    matchState.fomoSeconds = matchState.fomoSeconds > 0 ? matchState.fomoSeconds - 1 : 300;
    const mins = String(Math.floor(matchState.fomoSeconds / 60)).padStart(2, "0");
    const secs = String(matchState.fomoSeconds % 60).padStart(2, "0");
    const el = document.getElementById("fomo-countdown");
    if (el) el.textContent = `${mins}:${secs}`;
  }, 1000);
});
