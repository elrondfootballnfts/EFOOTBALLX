/**
 * EFOOTBALLX OFFICIAL TELEGRAM BOT
 * Complete Community Manager, Anti-Spam Shield, Live Stats & Gamification Engine
 */

const http = require('http');
const config = require('./config');
const { getLiveLeaderboard, getVaultStats } = require('./services/firebase');
const { fetchTweetDetails, formatTweetMessage } = require('./services/twitter');
const { isSpam, recordWarning } = require('./services/moderation');

const TELEGRAM_API = `https://api.telegram.org/bot${config.BOT_TOKEN}`;

// State
let lastUpdateId = 0;
let isPolling = false;
let lastWelcomeMsgId = null;

// ============================================================================
// TELEGRAM HTTP API CLIENT
// ============================================================================

async function apiCall(method, body = {}) {
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.ok) {
      console.warn(`[Telegram API Error] ${method}:`, data.description || data);
    }
    return data;
  } catch (err) {
    console.error(`[Telegram Network Error] ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

async function sendMessage(chatId, text, options = {}) {
  return apiCall('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode || 'HTML',
    disable_web_page_preview: options.disable_web_page_preview || false,
    reply_markup: options.reply_markup || undefined,
    reply_to_message_id: options.reply_to_message_id || undefined
  });
}

async function sendPhoto(chatId, photoUrl, caption, options = {}) {
  return apiCall('sendPhoto', {
    chat_id: chatId,
    photo: photoUrl,
    caption,
    parse_mode: options.parse_mode || 'HTML',
    reply_markup: options.reply_markup || undefined
  });
}

async function sendDice(chatId, emoji = '⚽') {
  return apiCall('sendDice', {
    chat_id: chatId,
    emoji
  });
}

async function deleteMessage(chatId, messageId) {
  return apiCall('deleteMessage', { chat_id: chatId, message_id: messageId });
}

async function banChatMember(chatId, userId) {
  return apiCall('banChatMember', { chat_id: chatId, user_id: userId });
}

async function restrictChatMember(chatId, userId, untilSeconds = 300) {
  const untilDate = Math.floor(Date.now() / 1000) + untilSeconds;
  return apiCall('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions: {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false
    },
    until_date: untilDate
  });
}

async function pinChatMessage(chatId, messageId) {
  return apiCall('pinChatMessage', {
    chat_id: chatId,
    message_id: messageId,
    disable_notification: false
  });
}

async function unpinChatMessage(chatId, messageId) {
  return apiCall('unpinChatMessage', {
    chat_id: chatId,
    message_id: messageId
  });
}

async function isChatAdmin(chatId, user) {
  if (!user) return false;
  // Check config override
  if (config.ADMIN_IDS.includes(String(user.id)) || (user.username && config.ADMIN_IDS.includes(user.username.toLowerCase()))) {
    return true;
  }
  try {
    const res = await apiCall('getChatMember', { chat_id: chatId, user_id: user.id });
    if (res.ok && res.result) {
      const status = res.result.status;
      return status === 'creator' || status === 'administrator';
    }
  } catch (e) {}
  return false;
}

// ============================================================================
// COMMUNITY WELCOME & ONBOARDING
// ============================================================================

async function handleNewMembers(chatId, newMembers) {
  for (const member of newMembers) {
    if (member.is_bot && member.username === 'ElrondFootball_bot') {
      console.log(`[Bot] Added to chat: ${chatId}`);
      await sendMessage(chatId, `⚽ <b>EFoo Manager is now live in this stadium!</b>\n\nPromote me to Administrator to activate automated anti-spam moderation, live leaderboard integration, and X auto-posts!`);
      continue;
    }

    const name = member.first_name || 'Striker';
    const mention = member.username ? `@${member.username}` : name;

    const welcomeText = 
      `⚽🔥 <b>WELCOME TO EFOOTBALLX, ${mention}!</b> 🔥⚽\n\n` +
      `You just entered the official stadium of the first dual-chain (MultiversX & Solana) Web3 penalty shootout arcade game!\n\n` +
      `🏆 <b>Current Stadium Vault Jackpot:</b> 25,400,000 $EFOO\n` +
      `⚡ <b>100 Levels Expansion:</b> 7 Leagues & Save Scoring live!\n` +
      `🎁 <b>5-Day Daily Streak:</b> Claim 1% of the Vault on-chain!\n\n` +
      `👇 <i>Choose an action below to kick off:</i>`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🎮 PLAY EFOOTBALLX NOW', url: config.GAME_URL }
        ],
        [
          { text: '📈 Live Leaderboard', url: config.GAME_URL },
          { text: '💎 Buy $EFOO', url: config.MVX_EXPLORER_TOKEN }
        ],
        [
          { text: '🐦 Follow on X (@EFootball_X)', url: config.TWITTER_URL },
          { text: '🌐 Official Website', url: config.WEBSITE_URL }
        ]
      ]
    };

    // Clean up previous welcome message
    if (lastWelcomeMsgId) {
      deleteMessage(chatId, lastWelcomeMsgId).catch(() => {});
    }

    const res = await sendMessage(chatId, welcomeText, { reply_markup: keyboard });
    if (res.ok && res.result) {
      lastWelcomeMsgId = res.result.message_id;
    }
  }
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

async function handleCommand(msg) {
  const chatId = msg.chat.id;
  const user = msg.from;
  const text = (msg.text || '').trim();
  const cmd = text.split(/\s+/)[0].toLowerCase().replace('@elrondfootball_bot', '');
  const args = text.split(/\s+/).slice(1);

  // 1. /start & /help
  if (cmd === '/start' || cmd === '/help') {
    const helpMsg = 
      `⚽ <b>EFOOTBALLX OFFICIAL BOT COMMANDS</b>\n\n` +
      `🌐 <b>Ecosystem & Overview:</b>\n` +
      `• /project or /about — Full EFOOTBALLX & NFooT overview\n` +
      `• /links — All official dApp, swap, market & social links\n` +
      `• /ca or /token — Official Contract Addresses ($EFOO)\n\n` +
      `🎮 <b>Game & Rewards:</b>\n` +
      `• /play or /game — Direct link to play the 100-level game\n` +
      `• /top or /leaderboard — Live Top 5 strikers & scores\n` +
      `• /vault or /jackpot — Stadium Vault Jackpot breakdown\n` +
      `• /streak — 5-Day Daily Login Streak rewards\n` +
      `• /penalty or /shoot — Shoot an interactive penalty in chat!\n\n` +
      `🛡️ <b>Admin Controls:</b>\n` +
      `• /postx &lt;url&gt; — Broadcast an X post to the group\n` +
      `• /warn — Issue a yellow card to a member (reply)\n` +
      `• /mute &lt;minutes&gt; — Mute a member (reply)\n` +
      `• /ban — Ban a spammer (reply)\n` +
      `• /pin — Pin important announcement (reply)`;

    await sendMessage(chatId, helpMsg);
    return;
  }

  // 2. /play & /game
  if (cmd === '/play' || cmd === '/game') {
    const playMsg = 
      `⚽ <b>STEP ONTO THE PITCH!</b>\n\n` +
      `Conquer 100 levels against lethal AI keepers and strikers, arm decisive Super Skills, and battle for the <b>25.4M $EFOO Stadium Vault</b>!\n\n` +
      `🔗 Play instantly in any browser: ${config.GAME_URL}`;

    await sendMessage(chatId, playMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 PLAY EFOOTBALLX NOW', url: config.GAME_URL }]
        ]
      }
    });
    return;
  }

  // 2B. /links (All official project & ecosystem links)
  if (cmd === '/links') {
    const linksMsg = 
      `🌐 <b>EFOOTBALLX OFFICIAL ECOSYSTEM LINKS</b>\n\n` +
      `🎮 <b>Game & Market dApps:</b>\n` +
      `• <b>Play 100 Levels Game:</b> <a href="${config.GAME_URL}">${config.GAME_URL}</a>\n` +
      `• <b>NFooT P2P Marketplace:</b> <a href="${config.MARKET_URL}">${config.MARKET_URL}</a>\n` +
      `• <b>Official Website:</b> <a href="${config.WEBSITE_URL}">${config.WEBSITE_URL}</a>\n\n` +
      `💎 <b>Token & Swaps ($EFOO):</b>\n` +
      `• <b>OneDex (EGLD/EFOO):</b> <a href="${config.ONEDEX_URL}">Swap on OneDex ↗</a>\n` +
      `• <b>xExchange (USDC/EFOO):</b> <a href="${config.XEXCHANGE_URL}">Trade on xExchange ↗</a>\n` +
      `• <b>DexScreener (Solana SPL):</b> <a href="${config.DEXSCREENER_SOL_URL}">Live Chart & Trade ↗</a>\n` +
      `• <b>MultiversX Explorer:</b> <a href="${config.MVX_EXPLORER_TOKEN}">EFOO-8fe2d4 ↗</a>\n` +
      `• <b>Solana Explorer:</b> <a href="${config.SOLANA_EXPLORER_TOKEN}">Solana Mint ↗</a>\n\n` +
      `🖼️ <b>Official NFT Collections:</b>\n` +
      `• <b>XOXNO Strikers:</b> <a href="${config.XOXNO_STRIKERS_URL}">EFOOTBALL-91a4eb ↗</a>\n` +
      `• <b>XOXNO Goalkeepers:</b> <a href="${config.XOXNO_KEEPERS_URL}">GOALKEEPER-cb9e3e ↗</a>\n\n` +
      `📢 <b>Socials & Community:</b>\n` +
      `• <b>X (Twitter):</b> <a href="${config.TWITTER_URL}">@${config.TWITTER_HANDLE} ↗</a>\n` +
      `• <b>Telegram:</b> <a href="${config.TELEGRAM_URL}">@elrondfootball ↗</a>\n` +
      `• <b>GitHub:</b> <a href="${config.GITHUB_URL}">EFOOTBALLX Open-Source ↗</a>`;

    await sendMessage(chatId, linksMsg, {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎮 Play 100 Levels', url: config.GAME_URL },
            { text: '🛍️ NFooT Market', url: config.MARKET_URL }
          ],
          [
            { text: '💎 Buy on OneDex', url: config.ONEDEX_URL },
            { text: '📈 DexScreener SOL', url: config.DEXSCREENER_SOL_URL }
          ],
          [
            { text: '🐦 Follow on X', url: config.TWITTER_URL },
            { text: '🖼️ XOXNO NFTs', url: config.XOXNO_STRIKERS_URL }
          ]
        ]
      }
    });
    return;
  }

  // 2C. /project or /about or /info (Complete Project & Ecosystem Overview)
  if (cmd === '/project' || cmd === '/about' || cmd === '/info') {
    const projectMsg = 
      `⚽👑 <b>EFOOTBALLX — DUAL-CHAIN WEB3 FOOTBALL POWERHOUSE</b>\n\n` +
      `<b>EFOOTBALLX</b> is the first dual-chain (<b>MultiversX & Solana</b>) Web3 penalty shootout arcade, fusing high-speed reflex gameplay with a sustainable deflationary economy and P2P NFT marketplace!\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🎮 <b>1. 100-LEVEL ARCADE GAMEPLAY</b>\n` +
      `• <b>7 Competitive Leagues:</b> Sunday League ➔ Amateur ➔ Semi-Pro ➔ Professional ➔ World Class ➔ Galactic ➔ <b>Immortal Legend</b>!\n` +
      `• <b>Striker & Goalkeeper Dual Roles:</b> Score curving rocket penalties, and dive to save clutch shots as goalkeeper.\n` +
      `• <b>5 Super Skills:</b> Rocket Shot, Keeper Freeze, Iron Wall, Laser Aim, and Banana Curve.\n` +
      `• <b>Real-time 2X Multiplier Ring:</b> Hit moving bullseyes for explosive leaderboard score surges!\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🛍️ <b>2. NFooT P2P MARKETPLACE</b>\n` +
      `• Trade verified Striker and Goalkeeper NFTs directly player-to-player.\n` +
      `• Dual-currency settlement: buy/sell in <b>$EFOO</b> or native <b>EGLD</b>.\n` +
      `• <b>Ultras VIP Pass:</b> 0% lifetime trading fees + in-game score bonuses!\n` +
      `• Deflationary split: 50% burned forever, 50% added to the Stadium Vault.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏆 <b>3. 25.4M $EFOO STADIUM VAULT JACKPOT</b>\n` +
      `• Payouts distributed automatically every Sunday 23:59 UTC to the Top 3 verified strikers (<b>65% 1st</b>, <b>25% 2nd</b>, <b>10% 3rd</b>).\n` +
      `• Deflationary engine: 50% of all skill purchases and match streak revives are burned on-chain forever.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔥 <b>4. 5-DAY STREAK ON-CHAIN REWARDS</b>\n` +
      `• Play 5 consecutive days to sign an on-chain transaction claiming <b>1% of the live Stadium Vault Jackpot</b> directly into your wallet!\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ <b>5. DUAL-CHAIN MULTI-WALLET FREEDOM</b>\n` +
      `• Connect instantly with MultiversX (xPortal, DeFi Extension, Web Wallet) or Solana (Phantom Wallet).`;

    await sendMessage(chatId, projectMsg, {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎮 PLAY EFOOTBALLX', url: config.GAME_URL },
            { text: '🛍️ NFooT MARKETPLACE', url: config.MARKET_URL }
          ],
          [
            { text: '🏆 Live Leaderboard', url: config.GAME_URL },
            { text: '🌐 Official Website', url: config.WEBSITE_URL }
          ]
        ]
      }
    });
    return;
  }

  // 3. /top & /leaderboard
  if (cmd === '/top' || cmd === '/leaderboard') {
    const topStrikers = await getLiveLeaderboard(5);
    if (!topStrikers || topStrikers.length === 0) {
      await sendMessage(chatId, `⚠️ Could not reach the live leaderboard database. Visit ${config.GAME_URL} directly!`);
      return;
    }

    let boardText = `🏆 <b>EFOOTBALLX LIVE DERBY LEADERBOARD</b>\n\n`;
    topStrikers.forEach((s, idx) => {
      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
      const medal = medals[idx] || `#${idx + 1}`;
      const isSol = s.address && !s.address.startsWith('erd1');
      const chainBadge = isSol ? '[SOL]' : '[MVX]';
      const name = s.nickname || (s.herotag ? `@${s.herotag}` : `${s.address.slice(0, 6)}...${s.address.slice(-4)}`);
      const score = (s.score || 0).toLocaleString();
      const lvl = s.level || 1;

      boardText += `${medal} <b>${chainBadge} ${name}</b>\n`;
      boardText += `   Score: <b>${score} PTS</b> • Level: <b>LVL ${lvl}</b>\n\n`;
    });

    boardText += `⏳ <i>Weekly reset occurs every Sunday at 23:59 UTC!</i>`;

    await sendMessage(chatId, boardText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '⚔️ Climb Ranks & Play', url: config.GAME_URL }]
        ]
      }
    });
    return;
  }

  // 4. /vault & /jackpot
  if (cmd === '/vault' || cmd === '/jackpot') {
    const v = await getVaultStats();
    const vaultMsg = 
      `🏆 <b>WEEKLY STADIUM VAULT JACKPOT</b>\n\n` +
      `💰 <b>Total Pot:</b> <code>${v.totalPot.toLocaleString()} $EFOO</code>\n\n` +
      `🥇 <b>1st Place (65%):</b> <code>${v.firstPlace.toLocaleString()} $EFOO</code>\n` +
      `🥈 <b>2nd Place (25%):</b> <code>${v.secondPlace.toLocaleString()} $EFOO</code>\n` +
      `🥉 <b>3rd Place (10%):</b> <code>${v.thirdPlace.toLocaleString()} $EFOO</code>\n\n` +
      `🔥 <i>The pot grows with every skill purchase, match revive, and marketplace trade (50% burn, 50% to Vault)!</i>`;

    await sendMessage(chatId, vaultMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎯 Compete for the Pot', url: config.GAME_URL }]
        ]
      }
    });
    return;
  }

  // 5. /ca & /token
  if (cmd === '/ca' || cmd === '/token') {
    const caMsg = 
      `💎 <b>OFFICIAL $EFOO TOKEN DETAILS</b>\n\n` +
      `⚡ <b>MultiversX (ESDT):</b>\n` +
      `Token ID: <code>${config.MVX_TOKEN_ID}</code>\n` +
      `🔗 <a href="${config.MVX_EXPLORER_TOKEN}">View on MultiversX Explorer ↗</a>\n\n` +
      `🟣 <b>Solana (SPL):</b>\n` +
      `Mint: <code>${config.SOLANA_TOKEN_MINT}</code>\n` +
      `🔗 <a href="${config.SOLANA_EXPLORER_TOKEN}">View on Solana Explorer ↗</a>\n\n` +
      `🛡️ <b>Security Warning:</b> Admins will NEVER DM you first or ask for your secret seed phrase!`;

    await sendMessage(chatId, caMsg, { disable_web_page_preview: true });
    return;
  }

  // 6. /streak
  if (cmd === '/streak') {
    const streakMsg = 
      `🔥 <b>DAILY LOGIN STREAK REWARDS</b>\n\n` +
      `Play every day to build your streak! On every 5th consecutive day, sign an on-chain transaction to claim <b>1% of the Stadium Vault Jackpot</b> directly into your wallet!\n\n` +
      `⚡ Gas-free in-game credits can also be used to purchase decisive Super Skills and protect your win streak!`;

    await sendMessage(chatId, streakMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔥 Check My Streak', url: config.GAME_URL }]
        ]
      }
    });
    return;
  }

  // 7. /penalty & /shoot (Interactive Chat Mini-game!)
  if (cmd === '/penalty' || cmd === '/shoot') {
    const diceRes = await sendDice(chatId, '⚽');
    if (diceRes.ok && diceRes.result && diceRes.result.dice) {
      const val = diceRes.result.dice.value;
      const shooter = user.first_name || 'Striker';

      // Wait 3 seconds for the Telegram ball animation to finish rolling
      setTimeout(async () => {
        if (val >= 3) {
          const cheers = [
            `🚀 <b>GOOOAL!</b> ${shooter} blasts a rocket shot into the top-corner! (+1,200 PTS)`,
            `⚽🔥 <b>WHAT A STRIKE!</b> ${shooter} curves it around the wall! GÓÓÓL!`,
            `🎯 <b>BULLSEYE!</b> ${shooter} hits the 2X ring and nets it clean!`
          ];
          const cheer = cheers[Math.floor(Math.random() * cheers.length)];
          await sendMessage(chatId, cheer, { reply_to_message_id: diceRes.result.message_id });
        } else {
          const saves = [
            `🧤 <b>DENIED!</b> The AI Goalkeeper dives full stretch to make a world-class save!`,
            `💥 <b>OFF THE CROSSBAR!</b> ${shooter}'s shot rattles the wood and bounces out!`,
            `🧱 <b>BLOCKED!</b> The defensive wall stops the strike in its tracks!`
          ];
          const save = saves[Math.floor(Math.random() * saves.length)];
          await sendMessage(chatId, save, { reply_to_message_id: diceRes.result.message_id });
        }
      }, 3000);
    }
    return;
  }

  // 8. /postx (Admin broadcast an X tweet)
  if (cmd === '/postx' || cmd === '/x') {
    const isAdmin = await isChatAdmin(chatId, user);
    if (!isAdmin) {
      await sendMessage(chatId, `❌ Only group administrators can use /postx!`, { reply_to_message_id: msg.message_id });
      return;
    }

    const inputUrl = args[0];
    if (!inputUrl) {
      await sendMessage(chatId, `⚠️ Usage: <code>/postx https://x.com/EFootball_X/status/...</code>`);
      return;
    }

    const tweet = await fetchTweetDetails(inputUrl);
    if (!tweet) {
      await sendMessage(chatId, `❌ Could not fetch tweet details. Please check the URL.`);
      return;
    }

    const postHtml = formatTweetMessage(tweet);
    const keyboard = {
      inline_keyboard: [
        [{ text: '🚀 View & Retweet on X', url: tweet.url }]
      ]
    };

    if (tweet.mediaUrl) {
      await sendPhoto(chatId, tweet.mediaUrl, postHtml, { reply_markup: keyboard });
    } else {
      await sendMessage(chatId, postHtml, { reply_markup: keyboard, disable_web_page_preview: false });
    }

    // Delete the original command message to keep chat tidy
    deleteMessage(chatId, msg.message_id).catch(() => {});
    return;
  }

  // 9. /warn (Admin Yellow Card)
  if (cmd === '/warn') {
    const isAdmin = await isChatAdmin(chatId, user);
    if (!isAdmin || !msg.reply_to_message) return;

    const targetUser = msg.reply_to_message.from;
    const warns = recordWarning(chatId, targetUser.id);
    const targetName = targetUser.first_name || 'Member';

    if (warns >= 2) {
      await restrictChatMember(chatId, targetUser.id, 86400); // 24h mute
      await sendMessage(chatId, `🟥 <b>RED CARD!</b> ${targetName} received 2 warnings and has been muted for 24 hours.`);
    } else {
      await sendMessage(chatId, `🟨 <b>YELLOW CARD!</b> Warning 1/2 for ${targetName}. One more foul and you are on the bench!`);
    }
    return;
  }

  // 10. /mute & /ban (Admin Moderation)
  if (cmd === '/ban' || cmd === '/mute') {
    const isAdmin = await isChatAdmin(chatId, user);
    if (!isAdmin || !msg.reply_to_message) return;

    const targetUser = msg.reply_to_message.from;
    if (cmd === '/ban') {
      await banChatMember(chatId, targetUser.id);
      await sendMessage(chatId, `🔨 <b>SENT OFF!</b> ${targetUser.first_name} has been banned from the stadium.`);
    } else {
      const minutes = parseInt(args[0], 10) || 60;
      await restrictChatMember(chatId, targetUser.id, minutes * 60);
      await sendMessage(chatId, `🔇 <b>BENCHED!</b> ${targetUser.first_name} has been muted for ${minutes} minutes.`);
    }
    deleteMessage(chatId, msg.message_id).catch(() => {});
    return;
  }

  // 11. /pin (Admin Pin Message)
  if (cmd === '/pin') {
    const isAdmin = await isChatAdmin(chatId, user);
    if (!isAdmin || !msg.reply_to_message) return;
    await pinChatMessage(chatId, msg.reply_to_message.message_id);
    deleteMessage(chatId, msg.message_id).catch(() => {});
    return;
  }
}

// ============================================================================
// MESSAGE MONITORING & ANTI-SPAM
// ============================================================================

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const user = msg.from;
  const text = msg.text || msg.caption || '';

  // 1. Check for newly joined members
  if (msg.new_chat_members && msg.new_chat_members.length > 0) {
    await handleNewMembers(chatId, msg.new_chat_members);
    return;
  }

  // 2. Anti-Spam Check (Non-admin only)
  const isAdmin = await isChatAdmin(chatId, user);
  if (!isAdmin && isSpam(text)) {
    console.log(`[Anti-Spam] Deleted scam message from ${user.id} (${user.username || user.first_name}): "${text.slice(0, 50)}..."`);
    await deleteMessage(chatId, msg.message_id);
    const warns = recordWarning(chatId, user.id);
    if (warns >= 2) {
      await banChatMember(chatId, user.id);
      await sendMessage(chatId, `🛡️ <b>Spam detected:</b> User ${user.first_name} was removed from the group.`);
    }
    return;
  }

  // 3. Command router
  if (text.startsWith('/')) {
    await handleCommand(msg);
  }
}

// ============================================================================
// POLLING ENGINE
// ============================================================================

async function pollUpdates() {
  if (!isPolling) return;

  try {
    const data = await apiCall('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 25,
      limit: 100,
      allowed_updates: ['message', 'callback_query']
    });

    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    }
  } catch (err) {
    console.error('[Polling Loop Error]:', err.message);
  }

  if (isPolling) {
    setTimeout(pollUpdates, 1000);
  }
}

async function startBot() {
  console.log('====================================================');
  console.log('🚀 STARTING EFOOTBALLX TELEGRAM COMMUNITY BOT...');
  console.log('====================================================');

  // 1. Verify token
  const me = await apiCall('getMe');
  if (!me.ok) {
    console.error('❌ Failed to authenticate with Telegram API:', me.description);
    process.exit(1);
  }

  console.log(`✅ Authenticated as @${me.result.username} (${me.result.first_name})`);

  // 2. Clear old webhooks if any to allow long-polling
  const delWh = await apiCall('deleteWebhook', { drop_pending_updates: false });
  if (delWh.ok) {
    console.log('✅ Webhook cleared: polling engine active.');
  }

  // 3. Set bot command suggestions in Telegram UI
  await apiCall('setMyCommands', {
    commands: [
      { command: 'play', description: '🎮 Play EFOOTBALLX now' },
      { command: 'project', description: '⚽ EFOOTBALLX & NFooT overview' },
      { command: 'links', description: '🌐 All official links & swaps' },
      { command: 'leaderboard', description: '🏆 Live Derby Leaderboard' },
      { command: 'vault', description: '💰 25.4M Stadium Vault Pot' },
      { command: 'token', description: '💎 $EFOO Contract Addresses' },
      { command: 'penalty', description: '⚽ Shoot penalty shootout in chat' },
      { command: 'streak', description: '🔥 5-Day Daily Streak info' },
      { command: 'help', description: '📜 All commands & rules' }
    ]
  });

  isPolling = true;
  pollUpdates();
  console.log('⚡ Polling engine running. Bot is listening for messages...');

  // 4. Start lightweight Webhook server (for Zapier / IFTTT / Make tweet automations)
  startHttpServer();
}

// ============================================================================
// OPTIONAL HTTP WEBHOOK SERVER (For automated X / Twitter posting)
// ============================================================================

function startHttpServer() {
  const server = http.createServer(async (req, res) => {
    // Health check
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', bot: 'EFootball_bot' }));
      return;
    }

    // Automated Tweet Webhook: POST /api/tweet
    if (req.method === 'POST' && req.url === '/api/tweet') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const tweetUrl = payload.url || payload.tweet_url;
          if (!tweetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing url in payload' }));
            return;
          }

          const tweet = await fetchTweetDetails(tweetUrl);
          if (tweet) {
            const postHtml = formatTweetMessage(tweet);
            const keyboard = {
              inline_keyboard: [[{ text: '🚀 View & Retweet on X', url: tweet.url }]]
            };

            const targetChat = payload.chat_id || config.GROUP_CHAT_ID;
            if (tweet.mediaUrl) {
              await sendPhoto(targetChat, tweet.mediaUrl, postHtml, { reply_markup: keyboard });
            } else {
              await sendMessage(targetChat, postHtml, { reply_markup: keyboard, disable_web_page_preview: false });
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, tweet: tweet.id }));
            return;
          }
        } catch (e) {
          console.error('[Webhook Server Error]:', e.message);
        }
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process tweet' }));
      });
      return;
    }

    res.writeHead(404);
    res.end();
  });

  server.listen(config.PORT, () => {
    console.log(`🌐 Webhook HTTP server listening on port ${config.PORT}`);
  });
}

// Start
startBot();
