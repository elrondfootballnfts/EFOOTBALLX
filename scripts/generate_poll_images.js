const fs = require("fs");
const path = require("path");
const sharp = require("../NFT KREATOR/node_modules/sharp");

const outDir = path.join(__dirname, "../branding/poll");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// ----------------------------------------------------
// Choice 1: Migrate to Solana 🟣
// ----------------------------------------------------
const svgSolana = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="solBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0314"/>
      <stop offset="50%" stop-color="#140626"/>
      <stop offset="100%" stop-color="#051419"/>
    </linearGradient>
    <linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FFA3"/>
      <stop offset="50%" stop-color="#7B2CBF"/>
      <stop offset="100%" stop-color="#DC1FFF"/>
    </linearGradient>
    <radialGradient id="purpleGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#9945FF" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#14F195" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" rx="36" fill="url(#solBg)"/>
  <rect width="800" height="800" rx="36" fill="url(#purpleGlow)"/>

  <!-- Stadium pitch perspective lines -->
  <path d="M0,640 L800,640 M100,800 L320,640 M700,800 L480,640" stroke="#9945FF" stroke-opacity="0.25" stroke-width="3"/>
  <circle cx="400" cy="720" r="140" stroke="#00FFA3" stroke-opacity="0.2" stroke-width="2" fill="none"/>

  <!-- Card Border -->
  <rect x="16" y="16" width="768" height="768" rx="30" fill="none" stroke="url(#solGrad)" stroke-width="4" stroke-opacity="0.85"/>

  <!-- Top Badge: Choice 1 -->
  <rect x="44" y="44" width="160" height="42" rx="21" fill="#1e0b38" stroke="#9945FF" stroke-width="2"/>
  <text x="124" y="71" font-family="'Impact', 'Arial Black', sans-serif" font-size="18" fill="#e9d5ff" text-anchor="middle" letter-spacing="2">CHOICE 1</text>

  <!-- Phantom Badge Top Right -->
  <rect x="576" y="44" width="180" height="42" rx="21" fill="#1b1536" stroke="#AB9FF2" stroke-width="2"/>
  <!-- Phantom Ghost Icon -->
  <g transform="translate(590, 52) scale(0.026)">
    <path d="M5.7655 15.797C5.7655 17.222 6.49879 17.55 7.26141 17.55C8.87463 17.55 10.087 16.0841 10.8105 14.9256C10.7225 15.1819 10.6736 15.4382 10.6736 15.6842C10.6736 16.3609 11.0452 16.8427 11.7785 16.8427C12.7855 16.8427 13.861 15.92 14.4183 14.9256C14.3792 15.0692 14.3596 15.2024 14.3596 15.3254C14.3596 15.797 14.6138 16.0943 15.132 16.0943C16.7648 16.0943 18.4074 13.0701 18.4074 10.4252C18.4074 8.36459 17.4101 6.55005 14.9071 6.55005C10.5074 6.55005 5.7655 12.1679 5.7655 15.797ZM13.3917 10.1996C13.3917 9.68705 13.6654 9.32825 14.0663 9.32825C14.4574 9.32825 14.7312 9.68705 14.7312 10.1996C14.7312 10.7122 14.4574 11.0813 14.0663 11.0813C13.6654 11.0813 13.3917 10.7122 13.3917 10.1996ZM15.484 10.1996C15.484 9.68705 15.7578 9.32825 16.1586 9.32825C16.5497 9.32825 16.8235 9.68705 16.8235 10.1996C16.8235 10.7122 16.5497 11.0813 16.1586 11.0813C15.7578 11.0813 15.484 10.7122 15.484 10.1996Z" fill="#AB9FF2" transform="scale(30) translate(-3,-2)"/>
  </g>
  <text x="680" y="71" font-family="'Arial', sans-serif" font-weight="bold" font-size="15" fill="#AB9FF2">PHANTOM</text>

  <!-- Big Glowing Solana Logo Centerpiece -->
  <g transform="translate(180, 160) scale(1.1)" filter="url(#neonGlow)">
    <!-- Top Bar -->
    <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solGrad)"/>
    <!-- Middle Bar -->
    <path d="M332.4 118.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solGrad)"/>
    <!-- Bottom Bar -->
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#solGrad)"/>
  </g>

  <!-- Neon Glowing Football under Solana -->
  <g transform="translate(400, 520)">
    <circle cx="0" cy="0" r="48" fill="#111827" stroke="#00FFA3" stroke-width="4"/>
    <!-- Pentagons -->
    <polygon points="0,-16 15,-5 9,14 -9,14 -15,-5" fill="#00FFA3"/>
    <circle cx="0" cy="0" r="56" fill="none" stroke="#DC1FFF" stroke-width="2" stroke-dasharray="8,6" opacity="0.8"/>
  </g>

  <!-- Bottom Typography Banner -->
  <text x="400" y="630" font-family="'Impact', 'Arial Black', sans-serif" font-size="46" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
    MIGRATE TO SOLANA
  </text>
  <text x="400" y="670" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" fill="#00FFA3" text-anchor="middle" letter-spacing="4">
    🟣 $EFOO SPL • DEGEN LIQUIDITY 🟣
  </text>
  <text x="400" y="715" font-family="'Arial', sans-serif" font-weight="700" font-size="18" fill="#AB9FF2" text-anchor="middle" letter-spacing="1">
    ULTRA-FAST SPEED • 1-CLICK PHANTOM GAMING
  </text>
</svg>
`;

// ----------------------------------------------------
// Choice 2: Stay on MultiversX ⚡
// ----------------------------------------------------
const svgMultiversX = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mvxBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020d1a"/>
      <stop offset="50%" stop-color="#041a33"/>
      <stop offset="100%" stop-color="#01070e"/>
    </linearGradient>
    <linearGradient id="mvxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#23F7DD"/>
      <stop offset="50%" stop-color="#00D2FF"/>
      <stop offset="100%" stop-color="#0066FF"/>
    </linearGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#23F7DD" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#0066FF" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="cyanNeon" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" rx="36" fill="url(#mvxBg)"/>
  <rect width="800" height="800" rx="36" fill="url(#cyanGlow)"/>

  <!-- Pitch Lines -->
  <path d="M0,640 L800,640 M100,800 L320,640 M700,800 L480,640" stroke="#23F7DD" stroke-opacity="0.25" stroke-width="3"/>
  <circle cx="400" cy="720" r="140" stroke="#00D2FF" stroke-opacity="0.2" stroke-width="2" fill="none"/>

  <!-- Card Border -->
  <rect x="16" y="16" width="768" height="768" rx="30" fill="none" stroke="url(#mvxGrad)" stroke-width="4" stroke-opacity="0.85"/>

  <!-- Top Badge: Choice 2 -->
  <rect x="44" y="44" width="160" height="42" rx="21" fill="#08233d" stroke="#23F7DD" stroke-width="2"/>
  <text x="124" y="71" font-family="'Impact', 'Arial Black', sans-serif" font-size="18" fill="#a5f3fc" text-anchor="middle" letter-spacing="2">CHOICE 2</text>

  <!-- EGLD Badge Top Right -->
  <rect x="586" y="44" width="170" height="42" rx="21" fill="#08233d" stroke="#23F7DD" stroke-width="2"/>
  <circle cx="612" cy="65" r="12" fill="#23F7DD"/>
  <text x="612" y="70" font-family="'Impact', sans-serif" font-size="15" fill="#000" text-anchor="middle">⚡</text>
  <text x="682" y="71" font-family="'Arial', sans-serif" font-weight="bold" font-size="15" fill="#23F7DD">EGLD ECO</text>

  <!-- Big Glowing MultiversX Logo Centerpiece -->
  <g transform="translate(400, 320) scale(1.6)" filter="url(#cyanNeon)">
    <!-- MultiversX X Shape -->
    <path fill="url(#mvxGrad)" d="M 8.5 0 L 78.7 -37.4 L 66.9 -60 L 2.6 -34.1 C 0.9 -33.5 -0.9 -33.5 -2.6 -34.1 L -66.9 -60 L -78.7 -37.4 L -8.5 0 L -78.7 37.4 L -66.9 60 L -2.6 34.1 C -0.9 33.5 0.9 33.5 2.6 34.1 L 66.9 60 L 78.7 37.4 Z"/>
    <circle cx="0" cy="0" r="14" fill="#FFFFFF"/>
  </g>

  <!-- Classic Degen FC Ball with Lightning -->
  <g transform="translate(400, 520)">
    <circle cx="0" cy="0" r="48" fill="#091829" stroke="#23F7DD" stroke-width="4"/>
    <polygon points="0,-16 15,-5 9,14 -9,14 -15,-5" fill="#23F7DD"/>
    <path d="M-22,-30 L0,-60 L5,-35 L30,-35 L0,20" stroke="#fef08a" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Bottom Typography Banner -->
  <text x="400" y="630" font-family="'Impact', 'Arial Black', sans-serif" font-size="46" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
    STAY ON MULTIVERSX
  </text>
  <text x="400" y="670" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" fill="#23F7DD" text-anchor="middle" letter-spacing="4">
    ⚡ HOME PITCH • COMMUNITY ROOTS ⚡
  </text>
  <text x="400" y="715" font-family="'Arial', sans-serif" font-weight="700" font-size="18" fill="#93c5fd" text-anchor="middle" letter-spacing="1">
    628+ VERIFIED NFTS • DEGEN STADIUM VAULT
  </text>
</svg>
`;

// ----------------------------------------------------
// Choice 3: Dual-Chain Project 🌉
// ----------------------------------------------------
const svgDualChain = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splitBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020e1a"/>
      <stop offset="45%" stop-color="#0a1930"/>
      <stop offset="55%" stop-color="#1f0933"/>
      <stop offset="100%" stop-color="#0c0217"/>
    </linearGradient>
    <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#23F7DD"/>
      <stop offset="35%" stop-color="#38bdf8"/>
      <stop offset="65%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#DC1FFF"/>
    </linearGradient>
    <radialGradient id="centerBurst" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
      <stop offset="40%" stop-color="#a855f7" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="bridgeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" rx="36" fill="url(#splitBg)"/>
  <rect width="800" height="800" rx="36" fill="url(#centerBurst)"/>

  <!-- Card Border -->
  <rect x="16" y="16" width="768" height="768" rx="30" fill="none" stroke="url(#bridgeGrad)" stroke-width="4" stroke-opacity="0.9"/>

  <!-- Top Badge: Choice 3 -->
  <rect x="44" y="44" width="160" height="42" rx="21" fill="#18112e" stroke="url(#bridgeGrad)" stroke-width="2"/>
  <text x="124" y="71" font-family="'Impact', 'Arial Black', sans-serif" font-size="18" fill="#f5d0fe" text-anchor="middle" letter-spacing="2">CHOICE 3</text>

  <!-- Dual Chain Badge Top Right -->
  <rect x="546" y="44" width="210" height="42" rx="21" fill="#18112e" stroke="url(#bridgeGrad)" stroke-width="2"/>
  <text x="651" y="71" font-family="'Arial', sans-serif" font-weight="bold" font-size="15" fill="#fdf4ff">MULTIVERSX ✕ SOLANA</text>

  <!-- Left: MultiversX Logo -->
  <g transform="translate(200, 290) scale(1.05)" filter="url(#bridgeGlow)">
    <circle cx="0" cy="0" r="75" fill="#04182b" stroke="#23F7DD" stroke-width="3"/>
    <path fill="#23F7DD" d="M 5 0 L 46 -24.6 L 38 -39.4 L 1.7 -22.4 C 0.6 -22 -0.6 -22 -1.7 -22.4 L -38 -39.4 L -46 -24.6 L -5 0 L -46 24.6 L -38 39.4 L -1.7 22.4 C -0.6 22 0.6 22 1.7 22.4 L 38 39.4 L 46 24.6 Z"/>
    <text x="0" y="110" font-family="'Impact', sans-serif" font-size="22" fill="#23F7DD" text-anchor="middle">MULTIVERSX</text>
  </g>

  <!-- Glowing Hyperlane Bridge Beam in Center -->
  <g filter="url(#bridgeGlow)">
    <!-- Energy Bridge Arch -->
    <path d="M280,290 Q400,200 520,290" fill="none" stroke="url(#bridgeGrad)" stroke-width="8"/>
    <path d="M280,290 Q400,200 520,290" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="12,8"/>
    <!-- Lower bridge beam -->
    <line x1="280" y1="290" x2="520" y2="290" stroke="url(#bridgeGrad)" stroke-width="5" stroke-dasharray="10,6"/>
  </g>

  <!-- Center Warp Orb / Football in the middle of Bridge -->
  <g transform="translate(400, 280)">
    <circle cx="0" cy="0" r="44" fill="#0a0518" stroke="#FFFFFF" stroke-width="3"/>
    <polygon points="0,-14 13,-4 8,12 -8,12 -13,-4" fill="url(#bridgeGrad)"/>
    <text x="0" y="8" font-size="26" text-anchor="middle">🌉</text>
  </g>

  <!-- Right: Solana Logo -->
  <g transform="translate(600, 290)" filter="url(#bridgeGlow)">
    <circle cx="0" cy="0" r="75" fill="#140626" stroke="#9945FF" stroke-width="3"/>
    <!-- 3 Bars -->
    <g transform="translate(-40, -32) scale(0.2)">
      <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#bridgeGrad)"/>
      <path d="M332.4 118.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#bridgeGrad)"/>
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#bridgeGrad)"/>
    </g>
    <text x="0" y="110" font-family="'Impact', sans-serif" font-size="22" fill="#DC1FFF" text-anchor="middle">SOLANA</text>
  </g>

  <!-- Bottom Typography Banner -->
  <text x="400" y="615" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
    DUAL-CHAIN PROJECT
  </text>
  <text x="400" y="660" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" fill="url(#bridgeGrad)" text-anchor="middle" letter-spacing="4">
    🌉 PLAY &amp; TRADE ON BOTH CHAINS 🌉
  </text>
  <text x="400" y="710" font-family="'Arial', sans-serif" font-weight="700" font-size="18" fill="#e2e8f0" text-anchor="middle" letter-spacing="1">
    TWO ECOSYSTEMS • UNIFIED $EFOO LIQUIDITY
  </text>
</svg>
`;

async function renderAll() {
  console.log("🎨 Rendering Twitter Poll Images (800x800 PNG)...");

  await sharp(Buffer.from(svgSolana))
    .png({ compressionLevel: 8 })
    .toFile(path.join(outDir, "poll_choice_1_solana.png"));
  console.log("✅ Generated: branding/poll/poll_choice_1_solana.png");

  await sharp(Buffer.from(svgMultiversX))
    .png({ compressionLevel: 8 })
    .toFile(path.join(outDir, "poll_choice_2_multiversx.png"));
  console.log("✅ Generated: branding/poll/poll_choice_2_multiversx.png");

  await sharp(Buffer.from(svgDualChain))
    .png({ compressionLevel: 8 })
    .toFile(path.join(outDir, "poll_choice_3_dualchain.png"));
  console.log("✅ Generated: branding/poll/poll_choice_3_dualchain.png");

  console.log("🎉 All 3 poll choice images rendered successfully!");
}

renderAll().catch(err => {
  console.error("❌ Error rendering poll images:", err);
  process.exit(1);
});
