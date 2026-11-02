/**
 * TWITTER / X FETCHER & FORMATTER (via FxTwitter API)
 */
async function fetchTweetDetails(input) {
  try {
    let tweetId = '';
    let screenName = 'EFootball_X';

    if (input.includes('/status/')) {
      const match = input.match(/status\/(\d+)/);
      if (match) tweetId = match[1];
      const userMatch = input.match(/(?:twitter\.com|x\.com)\/([^\/]+)\/status/);
      if (userMatch) screenName = userMatch[1];
    } else if (/^\d+$/.test(input.trim())) {
      tweetId = input.trim();
    } else {
      return null;
    }

    const apiUrl = `https://api.fxtwitter.com/${screenName}/status/${tweetId}`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'EFootballX-TelegramBot/1.0' }
    });

    if (!res.ok) throw new Error(`FxTwitter API responded with HTTP ${res.status}`);
    const data = await res.json();
    if (data.code !== 200 || !data.tweet) return null;

    const t = data.tweet;
    const media = (t.media && t.media.all && t.media.all.length > 0) ? t.media.all[0].url : null;

    return {
      id: t.id,
      url: t.url,
      author: t.author?.name || 'EFootballX',
      screenName: t.author?.screen_name || screenName,
      text: t.text || '',
      likes: t.likes || 0,
      retweets: t.retweets || 0,
      mediaUrl: media
    };
  } catch (err) {
    console.error('[Twitter] Error parsing tweet:', err.message);
    return null;
  }
}

function formatTweetMessage(tweet) {
  const cleanText = tweet.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `🐦 <b>NEW POST ON X BY @${tweet.screenName}!</b>\n\n` +
         `<i>"${cleanText}"</i>\n\n` +
         `❤️ ${tweet.likes.toLocaleString()} Likes  •  🔁 ${tweet.retweets.toLocaleString()} Retweets\n\n` +
         `👉 <b>Support the community! Like & Retweet now:</b>`;
}

module.exports = {
  fetchTweetDetails,
  formatTweetMessage
};
