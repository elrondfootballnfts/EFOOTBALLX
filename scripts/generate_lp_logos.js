const fs = require('fs');
const path = require('path');

const efooB64 = fs.readFileSync(path.join(__dirname, '../branding/rebranded/efoo-degen-crest-200x200.png')).toString('base64');

// 1. Generate EFOO-WEGLD LP SVG
const wegldSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#0e1f2b"/>
      <stop offset="60%" stop-color="#081018"/>
      <stop offset="100%" stop-color="#04080d"/>
    </radialGradient>
    
    <!-- Outer Rim Gradient (EFOO Neon Green to MultiversX Cyan) -->
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A8FF00"/>
      <stop offset="45%" stop-color="#23F7DD"/>
      <stop offset="100%" stop-color="#00A3FF"/>
    </linearGradient>

    <!-- Coin Drop Shadow -->
    <filter id="coinShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.8"/>
    </filter>

    <!-- Clip Path for EFOO Coin -->
    <clipPath id="efooClip">
      <circle cx="72" cy="94" r="42"/>
    </clipPath>
  </defs>

  <!-- Outer Disc -->
  <circle cx="100" cy="100" r="96" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="3"/>
  <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- Left Coin: EFOO Rocket Football Crest -->
  <g filter="url(#coinShadow)">
    <circle cx="72" cy="94" r="44" fill="#06130C" stroke="#A8FF00" stroke-width="2.5"/>
    <image x="30" y="52" width="84" height="84" clip-path="url(#efooClip)" xlink:href="data:image/png;base64,${efooB64}"/>
  </g>

  <!-- Right Coin: MultiversX / WEGLD Logo (Overlapping with Dark Stroke for depth) -->
  <g filter="url(#coinShadow)">
    <!-- Shadow / cutout stroke around right coin -->
    <circle cx="128" cy="106" r="45" fill="none" stroke="#04080d" stroke-width="5"/>
    <!-- WEGLD Disc -->
    <circle cx="128" cy="106" r="43" fill="#000000" stroke="#23F7DD" stroke-width="2.5"/>
    <circle cx="128" cy="106" r="39" fill="none" stroke="rgba(35, 247, 221, 0.25)" stroke-width="1"/>
    <!-- MultiversX <X> Vector Glyph -->
    <g transform="translate(128, 106) scale(0.046) translate(-1250, -1250)">
      <path fill="#23F7DD" d="M1313,1250l527-275l-88-165l-483,192c-11,5-27,5-38,0L748,810l-88,165l527,275l-527,275l88,165l483-192 c11-5,27-5,38,0l483,192l88-165L1313,1250z"/>
    </g>
  </g>

  <!-- Bottom LP Pill Badge -->
  <g filter="url(#coinShadow)">
    <rect x="36" y="156" width="128" height="25" rx="12.5" fill="#060c14" stroke="url(#rimGrad)" stroke-width="1.5"/>
    <text x="100" y="173" font-family="'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="10.5" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">EFOO / WEGLD LP</text>
  </g>
</svg>`;

// 2. Generate EFOO-USDC LP SVG
const usdcSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGradUsdc" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#0d1c2d"/>
      <stop offset="60%" stop-color="#081018"/>
      <stop offset="100%" stop-color="#04080d"/>
    </radialGradient>
    
    <!-- Outer Rim Gradient (EFOO Neon Green to USDC Blue) -->
    <linearGradient id="rimGradUsdc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A8FF00"/>
      <stop offset="50%" stop-color="#2775CA"/>
      <stop offset="100%" stop-color="#00C0FF"/>
    </linearGradient>

    <!-- Coin Drop Shadow -->
    <filter id="coinShadowUsdc" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.8"/>
    </filter>

    <!-- Clip Path for EFOO Coin -->
    <clipPath id="efooClipUsdc">
      <circle cx="72" cy="94" r="42"/>
    </clipPath>
  </defs>

  <!-- Outer Disc -->
  <circle cx="100" cy="100" r="96" fill="url(#bgGradUsdc)" stroke="url(#rimGradUsdc)" stroke-width="3"/>
  <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- Left Coin: EFOO Rocket Football Crest -->
  <g filter="url(#coinShadowUsdc)">
    <circle cx="72" cy="94" r="44" fill="#06130C" stroke="#A8FF00" stroke-width="2.5"/>
    <image x="30" y="52" width="84" height="84" clip-path="url(#efooClipUsdc)" xlink:href="data:image/png;base64,${efooB64}"/>
  </g>

  <!-- Right Coin: Official USDC Logo (Overlapping with Dark Stroke for depth) -->
  <g filter="url(#coinShadowUsdc)">
    <!-- Shadow / cutout stroke around right coin -->
    <circle cx="128" cy="106" r="45" fill="none" stroke="#04080d" stroke-width="5"/>
    <!-- USDC Coin Elements -->
    <circle cx="128" cy="106" r="43" fill="#2775CA" stroke="#5DA2EC" stroke-width="2"/>
    <g transform="translate(128, 106) scale(0.042) translate(-1000, -1000)">
      <!-- USDC Inner Dollar -->
      <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#ffffff"/>
      <!-- USDC Outer Arc Rings -->
      <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#ffffff"/>
    </g>
  </g>

  <!-- Bottom LP Pill Badge -->
  <g filter="url(#coinShadowUsdc)">
    <rect x="36" y="156" width="128" height="25" rx="12.5" fill="#060c14" stroke="url(#rimGradUsdc)" stroke-width="1.5"/>
    <text x="100" y="173" font-family="'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="10.5" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">EFOO / USDC LP</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../branding/rebranded/efoo-wegld-lp.svg'), wegldSvg.trim(), 'utf8');
fs.writeFileSync(path.join(__dirname, '../branding/rebranded/efoo-usdc-lp.svg'), usdcSvg.trim(), 'utf8');

console.log('Generated efoo-wegld-lp.svg and efoo-usdc-lp.svg successfully.');
