/**
 * FIREBASE LEADERBOARD & STADIUM VAULT SERVICE
 */
const config = require('../config');

async function getLiveLeaderboard(limit = 5) {
  try {
    const url = `${config.FIREBASE_RTDB_URL}/leaderboard.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data) return [];

    const items = Object.entries(data).map(([key, val]) => ({
      key,
      ...val
    }));

    // Sort by highest score descending
    items.sort((a, b) => (b.score || 0) - (a.score || 0));
    return items.slice(0, limit);
  } catch (err) {
    console.error('[Firebase] Error fetching leaderboard:', err.message);
    return [];
  }
}

async function getVaultStats() {
  const pot = 25400000; // 25.4M $EFOO baseline pot
  return {
    totalPot: pot,
    firstPlace: Math.floor(pot * 0.65),
    secondPlace: Math.floor(pot * 0.25),
    thirdPlace: Math.floor(pot * 0.10)
  };
}

module.exports = {
  getLiveLeaderboard,
  getVaultStats
};
