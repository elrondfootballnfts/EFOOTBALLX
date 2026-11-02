/**
 * EFOOTBALLX TELEGRAM BOT CONFIGURATION
 */
const path = require('path');
const fs = require('fs');

// Simple .env file loader (Zero dependency)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

module.exports = {
  // Telegram Bot Token (loaded from .env or fallback)
  BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '5335259322:AAHN1WD3QCKJoCV4aRLcjYP7BKtrn60WV-M',
  
  // Default Target Telegram Chat / Channel
  GROUP_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '@elrondfootball',
  
  // Admin user IDs allowed to run /ban, /mute, /postx, /broadcast (numbers or usernames)
  ADMIN_IDS: (process.env.ADMIN_IDS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),

  // Official Links
  WEBSITE_URL: 'https://efootballx.com',
  GAME_URL: 'https://efootballx.com/game',
  TWITTER_URL: 'https://x.com/EFootball_X',
  TWITTER_HANDLE: 'EFootball_X',
  TELEGRAM_URL: 'https://t.me/elrondfootball',
  
  // Blockchain Contracts & Tokens
  MVX_TOKEN_ID: 'EFOO-8fe2d4',
  MVX_EXPLORER_TOKEN: 'https://explorer.multiversx.com/tokens/EFOO-8fe2d4',
  SOLANA_TOKEN_MINT: 'AWvvUNraPXGSwRnRos81ScCdJ7TzkuenYxWfS37qASFV',
  SOLANA_EXPLORER_TOKEN: 'https://explorer.solana.com/address/AWvvUNraPXGSwRnRos81ScCdJ7TzkuenYxWfS37qASFV',
  
  // Live Leaderboard & Vault DB
  FIREBASE_RTDB_URL: 'https://efootballx-leaderboard-default-rtdb.europe-west1.firebasedatabase.app',
  
  // Port for optional incoming webhooks (e.g. from Zapier / Make / IFTTT for Twitter auto-post)
  PORT: process.env.PORT || 3030
};
