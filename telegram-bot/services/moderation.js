/**
 * AUTOMATED MODERATION & ANTI-SPAM SHIELD
 */
const SPAM_PATTERNS = [
  /airdrop.*claim/i,
  /claim.*free.*tokens?/i,
  /guaranteed.*profit/i,
  /dm.*me.*for.*(signals|profit|crypto)/i,
  /whatsapp.*group/i,
  /t\.me\/(joinchat|\+[a-zA-Z0-9_-]{10,})/i, // Unauthorized invite links
  /gift.*card.*giveaway/i,
  /seed.*phrase/i,
  /private.*key/i,
  /crypto.*recovery/i
];

// In-memory warning tracker: { "chatId:userId": warnCount }
const warnings = new Map();

function isSpam(text) {
  if (!text || typeof text !== 'string') return false;
  return SPAM_PATTERNS.some(regex => regex.test(text));
}

function recordWarning(chatId, userId) {
  const key = `${chatId}:${userId}`;
  const count = (warnings.get(key) || 0) + 1;
  warnings.set(key, count);
  return count;
}

function clearWarnings(chatId, userId) {
  const key = `${chatId}:${userId}`;
  warnings.delete(key);
}

module.exports = {
  isSpam,
  recordWarning,
  clearWarnings
};
