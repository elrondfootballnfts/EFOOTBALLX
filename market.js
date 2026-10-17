// ============================================================================
// $EFOO OFFICIAL P2P NFT & SKILL MARKETPLACE
// Sunday League Degen FC on MultiversX
// ============================================================================

const MULTIVERSX_API = "https://api.multiversx.com";
const XOXNO_API = "https://api.xoxno.com";
const XOXNO_MARKETPLACE_SC = "erd1qqqqqqqqqqqqqpgq6wegs2xkypfpync8mn2sa5cmpqjlvrhwz5nqgepyg8";
const EFOO_TOKEN_ID = "EFOO-8fe2d4";
const STRIKER_COLLECTION = "EFOOTBALL-91a4eb";
const KEEPER_COLLECTION = "GOALKEEPER-cb9e3e";
const STADIUM_VAULT_SC = "erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend";
const SC_HEX = "0000000000000000050073468fd6de427aad382f3625938265473003f886a52f";
const EFOOREWARDS_WALLET = "erd1p5hfnx87q4pddwsyz23e5pqv8550rsfat902j6g4ckdh070055hshct4my";
const WC_PROJECT_ID = "9b1a9564f91cb659ffe21b73d5c4e2d8";

// EFOO ULTRAS PASS (Zero-Fee VIP Pass) & CONTRACTS
const ULTRAS_PASS_IDENTIFIER = "EFOOPASS-5223a8-01";
const ULTRAS_PASS_COLLECTION = "EFOOPASS-5223a8";
const ULTRAS_PASS_PRICE_EGLD = 0.5;
const ULTRAS_PASS_PRICE_EFOO = 5000000;
const STORAGE_ULTRAS_PASS_PREFIX = "efoo_ultras_pass_";

const CONTRACTS = {
  ONEDEX_PAIR: "erd1qqqqqqqqqqqqqpgqqz6vp9y50ep867vnr296mqf3dduh6guvmvlsu3sujc",
  XEXCHANGE_PAIR: "erd1qqqqqqqqqqqqqpgqjz0jwz73e8u7s0hu2y5qqeu8phm5d4f92jpsdu5qhw",
  WEGLD_WRAPPERS: {
    0: "erd1qqqqqqqqqqqqqpgqvc7gdl0p4s97guh498wgz75k8sav6sjfjlwqh679jy",
    1: "erd1qqqqqqqqqqqqqpgqhe8t5jewej70zupmh44jurgn29psua5l2jps3ntjj3",
    2: "erd1qqqqqqqqqqqqqpgqmuk0q2saj0mgutxm4teywre6dl8wqf58xamqdrukln"
  },
  NFT_MINTER: "erd1qqqqqqqqqqqqqpgq78frnmw5sep0q4r2qd96y3d6f6p7ujwcys5s9evzym"
};

let marketDexState = {
  mode: "buy", // "buy" | "sell"
  efooPerWegld: 30004200,
  efooPerUsdc: 8100300,
  onedexEfooReserve: 62137838,
  onedexWegldReserve: 2.071,
  xexEfooReserve: 185570612,
  xexUsdcReserve: 22.909
};

function hasUltrasPass(address) {
  if (!address) return false;
  const cleanAddr = address.toLowerCase();
  if (cleanAddr === EFOOREWARDS_WALLET.toLowerCase()) return true;
  if (localStorage.getItem(STORAGE_ULTRAS_PASS_PREFIX + cleanAddr) === "true") return true;
  if (localStorage.getItem("efoo_has_ultras_pass") === "true") return true;
  if (marketWallet && marketWallet.ownedNfts && Array.isArray(marketWallet.ownedNfts)) {
    if (marketWallet.ownedNfts.some(x => {
      const id = ((x.identifier || "") + " " + (x.name || "") + " " + (x.collection || "")).toLowerCase();
      return id.includes("efoopass-5223a8") || id.includes("efoopass") || id.includes("ultras pass") || (x.collection && x.collection.toLowerCase() === ULTRAS_PASS_COLLECTION.toLowerCase());
    })) {
      try {
        localStorage.setItem(STORAGE_ULTRAS_PASS_PREFIX + cleanAddr, "true");
        localStorage.setItem("efoo_has_ultras_pass", "true");
      } catch (e) {}
      return true;
    }
  }
  return false;
}

let marketWcSignClient = null;
let marketWcSessionTopic = localStorage.getItem("efoo_wc_topic") || "";

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

// ============================================================================
// BLOCKCHAIN & ON-CHAIN TRANSACTION HELPERS
// ============================================================================
function stringToHex(str) {
  if (!str) return "";
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toAtomicUnits(val, decimals = 18) {
  const str = String(val).trim();
  const parts = str.split(".");
  const whole = parts[0] || "0";
  let frac = parts[1] || "";
  if (frac.length > decimals) {
    frac = frac.slice(0, decimals);
  } else {
    frac = frac.padEnd(decimals, "0");
  }
  const fullStr = (whole + frac).replace(/^0+/, "");
  return BigInt(fullStr || "0");
}

function toBase64Data(str) {
  if (!str) return "";
  try {
    return btoa(str);
  } catch (e) {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

let currentMarketWcUri = "";

function updateExtensionBadge() {
  const badge = document.getElementById("m-ext-detect-badge");
  if (!badge) return;
  const isDetected = !!(window.elrondWallet || window.multiversx || window.elrond);
  if (isDetected) {
    badge.textContent = "🟢 Detected";
    badge.style.background = "rgba(168,255,0,0.18)";
    badge.style.color = "#a8ff00";
    badge.style.borderColor = "rgba(168,255,0,0.5)";
  } else {
    badge.textContent = "Browser Ext";
    badge.style.background = "rgba(255,255,255,0.08)";
    badge.style.color = "#e4e4e7";
    badge.style.borderColor = "rgba(255,255,255,0.15)";
  }
}

async function terminateWalletConnectSessions(client, topic) {
  if (!client) return;
  try {
    if (topic) {
      await client.disconnect({
        topic: topic,
        reason: { code: 6000, message: "User disconnected" }
      });
    }
  } catch (e) {
    console.warn("WalletConnect disconnect topic notice:", e);
  }
  try {
    const sessions = client.session?.getAll?.() || [];
    for (const sess of sessions) {
      try {
        await client.disconnect({
          topic: sess.topic,
          reason: { code: 6000, message: "User disconnected" }
        });
      } catch (err) {}
    }
  } catch (e) {
    console.warn("WalletConnect disconnect all sessions notice:", e);
  }
}

async function initMarketXPortalWalletConnect() {
  const qrBox = document.getElementById("m-xportal-qr-box");
  const qrImg = document.getElementById("m-xportal-qr-img");
  const bridge = document.getElementById("m-xportal-bridge-link");
  const statusPill = document.getElementById("m-wc-status-pill");
  if (qrBox) qrBox.classList.remove("hidden");
  if (statusPill) statusPill.textContent = "⏳ Initializing WalletConnect v2 Relay...";

  try {
    if (!marketWcSignClient) {
      let Mod;
      try {
        Mod = await import("https://esm.sh/@walletconnect/sign-client@2.11.0?bundle");
      } catch (e) {
        Mod = await import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client@2.11.0/+esm");
      }
      const SC = Mod.SignClient || Mod.default;
      marketWcSignClient = await SC.init({
        projectId: WC_PROJECT_ID,
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "EFOO Marketplace",
          description: "Sunday League Degen FC NFT & Skills Market",
          url: window.location.origin,
          icons: ["https://efoo.optibase.ro/branding/rebranded/efoo-degen-crest-200x200.png"]
        }
      });
    }

    const { uri, approval } = await marketWcSignClient.connect({
      requiredNamespaces: {
        mvx: {
          chains: ["mvx:1"],
          methods: ["mvx_signTransaction", "mvx_signTransactions", "mvx_signMessage"],
          events: []
        }
      }
    });

    if (uri) {
      currentMarketWcUri = uri;
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=10&color=050a07&bgcolor=a8ff00&data=${encodeURIComponent(uri)}`;
      }
      if (statusPill) {
        statusPill.textContent = "⚡ Waiting for xPortal scan & approval...";
      }
      const deepLinkUrl = `https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://xportal.com/?wallet-connect=${encodeURIComponent(uri)}`;
      if (bridge) {
        bridge.href = deepLinkUrl;
        bridge.style.display = "inline-flex";
      }
      if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "")) {
        window.location.href = deepLinkUrl;
      }
    }

    const session = await approval();
    marketWcSessionTopic = session.topic;
    localStorage.setItem("efoo_wc_topic", marketWcSessionTopic);
    const accs = session?.namespaces?.mvx?.accounts || [];
    if (accs.length > 0) {
      const addr = accs[0].split(":").pop();
      connectManualAddress(addr, "xportal");
      document.getElementById("m-wallet-modal")?.classList.add("hidden");
      showMarketToast(
        currentMarketLang === "hu"
          ? `✅ Sikeresen csatlakozva xPortallal: ${addr.slice(0, 6)}...${addr.slice(-4)}`
          : `✅ Connected via xPortal: ${addr.slice(0, 6)}...${addr.slice(-4)}`
      );
    }
  } catch (err) {
    console.warn("WalletConnect init/approval notice:", err);
    if (statusPill) statusPill.textContent = "⚠️ Connection cancelled or timed out.";
    const callbackUrl = window.location.origin + window.location.pathname.replace(/\.html$/, "");
    const loginUrl = `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=10&color=050a07&bgcolor=a8ff00&data=${encodeURIComponent(loginUrl)}`;
    }
  }
}

async function connectMarketDefiExtension() {
  const isHu = currentMarketLang === "hu";
  let ext = window.elrondWallet || window.multiversx || window.elrond;
  if (!ext) {
    await new Promise((r) => setTimeout(r, 200));
    ext = window.elrondWallet || window.multiversx || window.elrond;
  }

  if (!ext) {
    const confirmInstall = confirm(
      isHu
        ? "A MultiversX DeFi Wallet bővítmény nem található ebben a böngészőben.\n\nKattints az OK gombra a MultiversX Web Wallet megnyitásához, vagy telepítsd a bővítményt a Chrome Áruházból!"
        : "MultiversX DeFi Wallet Extension was not detected in this browser.\n\nPress OK to sign in via MultiversX Web Wallet instead (or install the extension from Chrome Web Store)."
    );
    if (confirmInstall) {
      const callbackUrl = window.location.origin + window.location.pathname.replace(/\.html$/, "");
      window.location.href = `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }
    return;
  }

  try {
    // Connect via standard inpage postMessage bridge (identical to app.js)
    const res = await sendMarketExtensionMessage("connect", "");
    const addr = typeof res === "string" ? res : (res && res.address ? res.address : "");
    if (addr && addr.startsWith("erd1")) {
      connectManualAddress(addr, "extension");
      document.getElementById("m-wallet-modal")?.classList.add("hidden");
      showMarketToast(
        isHu
          ? `✅ Sikeresen csatlakozva (DeFi Extension): ${addr.slice(0, 6)}...${addr.slice(-4)}`
          : `✅ Connected via Extension: ${addr.slice(0, 6)}...${addr.slice(-4)}`
      );
      return;
    }
  } catch (err) {
    console.warn("Market Extension connect failed:", err);
    const msg = (err?.message || "").toLowerCase();
    if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied")) {
      showMarketToast(isHu ? "❌ A csatlakozást elutasítottad a tárcában." : "❌ Connection rejected by user.");
      return;
    }
    showMarketToast(
      isHu
        ? "⚠️ Nem sikerült a csatlakozás a bővítményhez. Ellenőrizd, hogy a bővítmény engedélyezve van ezen az oldalon!"
        : "⚠️ Could not connect to extension. Please ensure the extension is enabled on this site!"
    );
  }
}

function sendMarketExtensionMessage(type, data = "") {
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

async function signMarketWithExtension(preparedTxs) {
  const extInputTxs = preparedTxs.map((t) => ({
    ...t,
    data: toBase64Data(t.data)
  }));

  const ext = window.elrondWallet || window.multiversx || window.elrond;
  if (ext && typeof ext.signTransactions === "function") {
    try {
      const res = await ext.signTransactions(extInputTxs);
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied")) {
        throw e;
      }
      console.warn("Direct ext.signTransactions failed, trying postMessage bridge:", e);
    }
  }

  return await sendMarketExtensionMessage("signTransactions", {
    from: marketWallet.address,
    transactions: extInputTxs
  });
}

async function broadcastMarketSignedTransactions(signedTxs) {
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

async function sendMultiversxTransaction({ receiver, value = "0", data = "", gasLimit = 15000000 }) {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    throw new Error(isHu ? "Kérjük csatlakoztasd a tárcádat a tranzakcióhoz!" : "Please connect your wallet first!");
  }

  // Fetch current account nonce & guardian status from MultiversX API
  let nonce = 0;
  let isGuarded = false;
  let guardianAddress = "";
  try {
    const accRes = await fetch(`https://api.multiversx.com/accounts/${marketWallet.address}`);
    if (accRes.ok) {
      const a = await accRes.json();
      nonce = Number(a.nonce || 0);
      isGuarded = !!a.isGuarded;
    }
  } catch (e) {
    console.warn("Failed to fetch fresh account data:", e);
  }

  if (isGuarded) {
    try {
      const gRes = await fetch(`https://gateway.multiversx.com/address/${marketWallet.address}/guardian-data`);
      if (gRes.ok) {
        const gData = await gRes.json();
        guardianAddress = gData?.data?.guardianData?.activeGuardian?.address || "";
      }
    } catch (e) {
      console.warn("Failed to fetch guardian data:", e);
    }
  }

  const txObj = {
    nonce: nonce,
    value: String(value || "0"),
    receiver: receiver,
    sender: marketWallet.address,
    gasPrice: 1000000000,
    gasLimit: Number(gasLimit || 15000000) + (isGuarded ? 50000 : 0),
    data: data || "",
    chainID: "1",
    version: isGuarded ? 2 : 1
  };

  if (isGuarded && guardianAddress) {
    txObj.options = 2;
    txObj.guardian = guardianAddress;
  }

  const preparedTxs = [txObj];

  // PATH A: xPortal Mobile App (WalletConnect v2)
  if (marketWallet.provider === "xportal") {
    try {
      showMarketToast(
        isHu
          ? "📱 Kérjük nyisd meg az xPortal appot a telefonodon a tranzakció jóváhagyásához!"
          : "📱 Please check your xPortal Mobile App to approve & sign the transaction!"
      );

      if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "")) {
        const deepLink = `https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://xportal.com/`;
        setTimeout(() => {
          window.location.href = deepLink;
        }, 300);
      }

      if (!marketWcSignClient) {
        let Mod;
        try {
          Mod = await import("https://esm.sh/@walletconnect/sign-client@2.11.0?bundle");
        } catch (e) {
          Mod = await import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client@2.11.0/+esm");
        }
        const SC = Mod.SignClient || Mod.default;
        marketWcSignClient = await SC.init({
          projectId: WC_PROJECT_ID,
          relayUrl: "wss://relay.walletconnect.com"
        });
      }

      const activeTopic = marketWcSessionTopic || localStorage.getItem("efoo_wc_topic");
      if (!activeTopic) {
        throw new Error(isHu ? "Nincs aktív xPortal kapcsolat. Kérjük csatlakozz újra!" : "No active xPortal session found. Please reconnect!");
      }

      const wcTxs = preparedTxs.map((t) => ({
        ...t,
        data: toBase64Data(t.data)
      }));

      const res = await marketWcSignClient.request({
        topic: activeTopic,
        chainId: "mvx:1",
        request: {
          method: "mvx_signTransaction",
          params: { transaction: wcTxs[0] }
        }
      });

      const signedTx = {
        ...wcTxs[0],
        ...res,
        data: wcTxs[0].data,
        dataIsBase64: true
      };

      const hashes = await broadcastMarketSignedTransactions([signedTx]);
      if (hashes.length > 0) {
        return { success: true, hash: hashes[0], method: "xportal" };
      }
      throw new Error(isHu ? "Nem sikerült a tranzakció kiküldése." : "Transaction broadcast failed.");
    } catch (err) {
      console.warn("xPortal signing error:", err);
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied") || msg.includes("user cancel")) {
        throw new Error(isHu ? "Tranzakció elutasítva az xPortalban." : "Transaction rejected in xPortal.");
      }
      throw err;
    }
  }

  // PATH B: MultiversX DeFi Wallet Extension (In-browser popup, ZERO redirects!)
  const ext = window.elrondWallet || window.multiversx || window.elrond;
  const isExtension = marketWallet.provider === "extension" || (ext && marketWallet.provider !== "webwallet");

  if (isExtension || ext) {
    try {
      showMarketToast(
        isHu
          ? "🧩 Erősítsd meg a tranzakciót a MultiversX DeFi Wallet felugró ablakában..."
          : "🧩 Please confirm the transaction in your MultiversX DeFi Wallet Extension popup..."
      );

      const signedRes = await signMarketWithExtension(preparedTxs);
      if (signedRes) {
        const signedList = Array.isArray(signedRes) ? signedRes : [signedRes];
        const formattedSigned = signedList.map((st, idx) => ({
          ...preparedTxs[idx],
          ...st,
          data: preparedTxs[idx].data,
          dataIsBase64: false
        }));

        const hashes = await broadcastMarketSignedTransactions(formattedSigned);
        if (hashes.length > 0) {
          return { success: true, hash: hashes[0], method: "extension" };
        }
      }
      throw new Error(isHu ? "Nem sikerült a tranzakció aláírása." : "Transaction signing failed.");
    } catch (err) {
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied") || msg.includes("user cancel")) {
        throw new Error(isHu ? "Tranzakció elutasítva a tárcában." : "Transaction rejected in wallet.");
      }
      console.warn("Extension sign error:", err);
      if (isExtension) {
        throw err;
      }
    }
  }

  // PATH C: Official MultiversX Web Wallet hook/sign (Contract call hook, zero redirects to /send!)
  const callbackUrl = window.location.origin + window.location.pathname.replace(/\.html$/, "");
  let walletUrl = `https://wallet.multiversx.com/hook/sign?receiver=${encodeURIComponent(receiver)}&value=${encodeURIComponent(String(value || "0"))}&gasLimit=${txObj.gasLimit}&data=${encodeURIComponent(data)}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
  if (isGuarded && guardianAddress) {
    walletUrl += `&version=2&options=2&guardian=${encodeURIComponent(guardianAddress)}`;
  }
  window.open(walletUrl, "_blank");
  return { success: true, method: "webwallet" };
}

const STORAGE_LISTINGS = "EFOO_NFT_MARKET_LISTINGS_V1";
const STORAGE_VAULT_POT = "efoo_stadium_vault_pot";
const STORAGE_TOTAL_BURNED = "efoo_total_burned_games";
const STORAGE_SKILLS_INVENTORY = "efoo_skills_inventory_v1";

const BASE_VAULT_POT = 0;
const BASE_BURNED_GAMES = 0;

let currentMarketLang = "en";
let currentTab = "browse";
let filterCollection = "all";
let filterRarity = "all";
let sortOrder = "price_asc";

// Connected Wallet State (Syncs seamlessly with index.html & game.html)
let marketWallet = {
  address: null,
  provider: null,
  efooBalance: 0,
  egldBalance: 0,
  ownedNfts: []
};

// Selected NFT for Modals
let activeModalNft = null;

// ============================================================================
// I18N DICTIONARY
// ============================================================================
const MARKET_I18N = {
  en: {
    nav_market_sub: "NFT & SKILL MARKETPLACE",
    hero_sub: "Trade official <strong>EFOOTBALL-91a4eb</strong> Strikers and <strong>GOALKEEPER-cb9e3e</strong> Keepers directly with players. Every trade burns <strong>$EFOO</strong> and fuels the weekend Stadium Vault Jackpot!",
    stat_vault: "STADIUM VAULT JACKPOT",
    stat_vault_rule: "Weekend Payout: 65% (1st) • 25% (2nd) • 10% (3rd)",
    stat_burned: "TOTAL BURNED IN GAMES",
    stat_burned_sub: "Deflationary Supply Reduction",
    stat_listings: "ACTIVE LISTINGS",
    stat_floor: "FLOOR PRICE",
    tab_browse: "Browse Market",
    tab_my_nfts: "My Locker & Sell",
    tab_skills: "Super Skills Store (-20%)",
    locker_title: "🎒 MY WALLET LOCKER ROOM",
    locker_sub: "Your connected MultiversX squad NFTs. List them for sale, edit asking prices, or withdraw active listings anytime!",
    locker_not_conn_title: "CONNECT YOUR WALLET TO ACCESS YOUR SQUAD",
    locker_not_conn_desc: "Connect with xPortal, DeFi Extension, or paste any erd1... address to view and manage your NFTs.",
    skills_title: "⚡ SUPER SKILLS ARSENAL (-20% 5x BUNDLES)",
    skills_sub: "Equip decisive match perks to dominate the 120' Shootout. 50% burned forever, 50% added to the Stadium Vault!",
    btn_connect: "Connect Wallet",
    btn_disconnect: "Disconnect",
    btn_buy_nft: "⚡ Buy NFT",
    btn_edit_price: "✏️ Edit Price",
    btn_delist: "❌ Delist",
    btn_list_sale: "🏷️ List for Sale",
    listed_badge: "Listed on Market",
    available_badge: "In Locker",
    seller_you: "You (Owner)",
    inspect_btn: "🔍 Inspect Attributes"
  },
  hu: {
    nav_market_sub: "NFT ÉS KÉPESSÉG PIAC",
    hero_sub: "Kereskedj hivatalos <strong>EFOOTBALL-91a4eb</strong> Csatár és <strong>GOALKEEPER-cb9e3e</strong> Kapus NFT-kkel közvetlenül a játékosokkal. Minden eladás <strong>$EFOO-t éget</strong> és a hétvégi Stadium Vault Jackpotot gyarapítja!",
    stat_vault: "STADIUM VAULT JACKPOT",
    stat_vault_rule: "Hétvégi Kiosztás: 65% (1.) • 25% (2.) • 10% (3.)",
    stat_burned: "ÖSSZESEN ELÉGETVE JÁTÉKOKBAN",
    stat_burned_sub: "Deflációs Készletcsökkenés",
    stat_listings: "AKTÍV HIRDETÉSEK",
    stat_floor: "MINIMÁLÁR (FLOOR)",
    tab_browse: "Piac Böngészése",
    tab_my_nfts: "Saját NFT-k & Eladás",
    tab_skills: "Képesség Bolt (-20%)",
    locker_title: "🎒 SAJÁT ÖLTÖZŐ & NFT KÉSZLET",
    locker_sub: "A csatlakoztatott tárcád futballistái és kapusai. Hirdesd meg őket eladásra, módosítsd az árat vagy vedd vissza bármikor!",
    locker_not_conn_title: "CSATLAKOZTASD A TÁRCÁDAT A SQUAD ELÉRÉSÉHEZ",
    locker_not_conn_desc: "Csatlakozz xPortal-lal, DeFi Extension-nel vagy illessz be egy erd1... címet az NFT-id kezeléséhez.",
    skills_title: "⚡ SZUPERKÉPESSÉGEK (-20% CSOMAGOK)",
    skills_sub: "Szerelj fel szuperképességeket a 120 perces büntetőpárbajra. 50% elégetődik, 50% a Vaultba kerül!",
    btn_connect: "Tárca Csatlakoztatása",
    btn_disconnect: "Kijelentkezés",
    btn_buy_nft: "⚡ Megvétel",
    btn_edit_price: "✏️ Ármódosítás",
    btn_delist: "❌ Visszavonás",
    btn_list_sale: "🏷️ Eladásra felkínálás",
    listed_badge: "Piacon meghirdetve",
    available_badge: "Öltözőben elérhető",
    seller_you: "Te (Tulajdonos)",
    inspect_btn: "🔍 Részletek & Képességek"
  },
  ro: {
    nav_market_sub: "PIAȚĂ NFT ȘI ABILITĂȚI",
    hero_sub: "Tranzacționează Atacanți <strong>EFOOTBALL-91a4eb</strong> și Portari <strong>GOALKEEPER-cb9e3e</strong> direct între jucători. Fiecare schimb arde <strong>$EFOO</strong> și finanțează Seiful Stadionului!",
    stat_vault: "SEIF STADION JACKPOT",
    stat_vault_rule: "Premii Weekend: 65% (1) • 25% (2) • 10% (3)",
    stat_burned: "TOTAL ARS ÎN JOCURI",
    stat_burned_sub: "Reducere Deflaționistă a Stocului",
    stat_listings: "ANUNȚURI ACTIVE",
    stat_floor: "PREȚ MINIM",
    tab_browse: "Explorează Piața",
    tab_my_nfts: "Vestiarul Meu & Vânzare",
    tab_skills: "Magazin Abilități (-20%)",
    locker_title: "🎒 VESTIARUL MEU & SQUAD NFT",
    locker_sub: "NFT-urile din portofelul tău MultiversX. Pune-le la vânzare, ajustează prețul sau retrage-le oricând!",
    locker_not_conn_title: "CONECTEAZĂ PORTOFELUL PENTRU SQUAD",
    locker_not_conn_desc: "Conectează-te cu xPortal, DeFi Extension sau introdu adresa erd1... pentru gestionare.",
    skills_title: "⚡ ABILITĂȚI SPECIALE (-20% PACHETE)",
    skills_sub: "Echipează super-puteri pentru meciul de 120'. 50% arse definitiv, 50% trimise în Seif!",
    btn_connect: "Conectează Portofel",
    btn_disconnect: "Deconectare",
    btn_buy_nft: "⚡ Cumpără",
    btn_edit_price: "✏️ Modifică Preț",
    btn_delist: "❌ Retrage",
    btn_list_sale: "🏷️ Pune la Vânzare",
    listed_badge: "Listat pe piață",
    available_badge: "Disponibil în vestiar",
    seller_you: "Tu (Proprietar)",
    inspect_btn: "🔍 Inspectează Abilități"
  }
};

// ============================================================================
// SKILLS DEFINITION & BALANCED ECONOMY (2.5k - 9.5k EFOO singles, 20% off 5x)
// ============================================================================
const MARKET_SKILLS = [
  { id: "gold", icon: "💰", name: "GOLD x2", nameHu: "DUPLA ARANY (2x)", nameRo: "AUR x2", price: 2500, color: "#ffb800", desc: "Double points and score multiplier on your next goal.", descHu: "Dupla pontszám és bónusz szorzó, ha a labda gól lesz." },
  { id: "steady", icon: "🎯", name: "ICE VEINS", nameHu: "HIDEGVÉR", nameRo: "NERVI DE OȚEL", price: 3500, color: "#38bdf8", desc: "Crosshair stops shaking for precise corner aiming.", descHu: "A célkereszt stabilizálódik a következő lövésnél." },
  { id: "curve", icon: "🌀", name: "BANANA CURVE", nameHu: "KIFLI CSAVARÁS", nameRo: "ȘUT CU EFECT", price: 4500, color: "#c084fc", desc: "Ball bends sharply — keeper misreads it 70% worse.", descHu: "Erősen kanyarodó lövés — a kapus jóval nehezebben védi ki." },
  { id: "power", icon: "🚀", name: "ROCKET SHOT", nameHu: "RAKÉTA LÖVÉS", nameRo: "ȘUT RACHETĂ", price: 6000, color: "#fb923c", desc: "Superpower sweet-spot and reduces keeper reach by 25%.", descHu: "Tágabb sweet-spot + a kapus elérési távolsága 25%-kal kisebb." },
  { id: "freeze", icon: "🧊", name: "KEEPER FREEZE", nameHu: "KAPUS FAGYASZTÁS", nameRo: "PORTAR ÎNGHEȚAT", price: 8500, color: "#67e8f9", desc: "Freezes keeper for 1 second causing late reaction and wrong dives.", descHu: "A kapus késve reagál és gyakran a rossz irányba vetődik." },
  { id: "iron_wall", icon: "🛡️", name: "IRON WALL", nameHu: "ACÉLFAL", nameRo: "ZID DE OȚEL", price: 3500, color: "#38bdf8", desc: "Reinforces goal posts & expands keeper save area by 50%.", descHu: "A kapus teste megnő, a védési felület 50%-kal nagyobb." },
  { id: "spider_reach", icon: "🧤", name: "SPIDER REACH", nameHu: "POLIP NYÚLÁS", nameRo: "REACH TENTACULAR", price: 6000, color: "#22c55e", desc: "Supernatural dive reach across the entire goalmouth.", descHu: "Óriási kézméret és ugrótávolság az egész kapura." },
  { id: "matrix_reflex", icon: "⏱️", name: "MATRIX TIME WARP", nameHu: "MÁTRIX IDŐLASSÍTÁS", nameRo: "MATRIX BULLET TIME", price: 7500, color: "#a855f7", desc: "Slows the ball speed by 50% giving full dive reaction time.", descHu: "50%-kal lelassítja a labdát, megkönnyítve a védést." },
  { id: "mind_read", icon: "👁️", name: "MIND READ RADAR", nameHu: "GONDOLATOLVASÁS", nameRo: "CITIREA MINȚII", price: 9500, color: "#ffb800", desc: "Holographic aura reveals exact AI shot target before the kick.", descHu: "Holografikus aura mutatja a gép lövésének pontos helyét." }
];

// ============================================================================
// XOXNO RARITY & ATTRIBUTES ENGINE
// ============================================================================
function getNftRarityTier(nft) {
  if (!nft || nft.identifier === "ROOKIE-STRIKER" || nft.identifier === "ROOKIE-KEEPER") {
    return {
      tierKey: "rookie",
      tierLabel: "ROOKIE (F2P)",
      tierIcon: "⚪",
      rank: "F2P",
      borderColor: "#94a3b8",
      scoreMult: 1.0,
      slots: 0,
      powers: ["1.0x Score Multiplier", "0 Skill Slots"]
    };
  }

  let rank = nft.rank || (nft.metadata && nft.metadata.rank) || (nft.rarities && nft.rarities.openRarity && nft.rarities.openRarity.rank);
  const name = (nft.name || "").trim();
  const tokenNumMatch = name.match(/#(\d+)/);
  const tokenNum = tokenNumMatch ? parseInt(tokenNumMatch[1], 10) : (nft.nonce || 0);

  // Exact flagship ranks from official XOXNO collection
  if (tokenNum === 356) rank = 1;
  else if (tokenNum === 614) rank = 1;
  else if (tokenNum === 615) rank = 2;
  else if (tokenNum === 619) rank = 3;
  else if (tokenNum === 613) rank = 4;
  else if (tokenNum === 616) rank = 5;

  const isKeeper = nft.collection === KEEPER_COLLECTION || (nft.identifier && nft.identifier.startsWith("GOALKEEPER")) || !!nft.jersey;

  if (!rank || rank <= 0) {
    if (nft.rarity && typeof nft.rarity === "string") {
      const r = nft.rarity.toUpperCase();
      if (r === "MYTHIC") rank = 3;
      else if (r === "LEGENDARY") rank = 15;
      else if (r === "EPIC") rank = 65;
      else if (r === "RARE") rank = 220;
      else rank = 520;
    } else {
      rank = tokenNum > 0 ? (tokenNum % 628) + 1 : 320;
    }
  }

  let tierKey = "common";
  let tierLabel = "COMMON";
  let tierIcon = "⚪";
  let borderColor = "#71717a";
  let scoreMult = 1.2;
  let slots = 1;
  let powers = [];

  if (isKeeper) {
    if (rank <= 5) {
      tierKey = "mythic";
      tierLabel = "MYTHIC";
      tierIcon = "👑";
      borderColor = "#ffd700";
      scoreMult = 3.5;
      slots = 5;
      powers = ["🛡️ 3 Shields", "🧱 Iron Wall", "🧤 Spider Reach", "⏱️ Matrix Time Warp", "⚡ 3.5x Multiplier"];
    } else if (rank <= 15) {
      tierKey = "legendary";
      tierLabel = "LEGENDARY";
      tierIcon = "⭐";
      borderColor = "#c084fc";
      scoreMult = 2.5;
      slots = 4;
      powers = ["🛡️ 2 Shields", "🧱 Iron Wall", "🧤 Spider Reach", "⚡ 2.5x Multiplier"];
    } else if (rank <= 30) {
      tierKey = "epic";
      tierLabel = "EPIC";
      tierIcon = "🔮";
      borderColor = "#818cf8";
      scoreMult = 2.0;
      slots = 3;
      powers = ["🛡️ 1 Shield", "🧱 Iron Wall", "⚡ 2.0x Multiplier"];
    } else if (rank <= 45) {
      tierKey = "rare";
      tierLabel = "RARE";
      tierIcon = "💎";
      borderColor = "#38bdf8";
      scoreMult = 1.5;
      slots = 2;
      powers = ["🧱 Iron Wall", "⚡ 1.5x Multiplier"];
    } else {
      tierKey = "common";
      tierLabel = "COMMON";
      tierIcon = "⚪";
      borderColor = "#71717a";
      scoreMult = 1.2;
      slots = 1;
      powers = ["⚡ 1.2x Multiplier"];
    }
  } else {
    // Striker Ranks
    if (rank <= 5) {
      tierKey = "mythic";
      tierLabel = "MYTHIC";
      tierIcon = "👑";
      borderColor = "#ffd700";
      scoreMult = 3.5;
      slots = 5;
      powers = ["🛸 Dive Radar", "🚀 Rocket Shot", "🌀 Banana Curve", "🧊 Keeper Freeze", "⚡ 3.5x Multiplier"];
    } else if (rank <= 25) {
      tierKey = "legendary";
      tierLabel = "LEGENDARY";
      tierIcon = "⭐";
      borderColor = "#c084fc";
      scoreMult = 2.5;
      slots = 4;
      powers = ["🛸 Dive Radar", "🚀 Rocket Shot", "🌀 Banana Curve", "⚡ 2.5x Multiplier"];
    } else if (rank <= 150) {
      tierKey = "epic";
      tierLabel = "EPIC";
      tierIcon = "🔮";
      borderColor = "#818cf8";
      scoreMult = 2.0;
      slots = 3;
      powers = ["🚀 Rocket Shot", "🌀 Banana Curve", "⚡ 2.0x Multiplier"];
    } else if (rank <= 450) {
      tierKey = "rare";
      tierLabel = "RARE";
      tierIcon = "💎";
      borderColor = "#38bdf8";
      scoreMult = 1.5;
      slots = 2;
      powers = ["🌀 Banana Curve", "⚡ 1.5x Multiplier"];
    } else {
      tierKey = "common";
      tierLabel = "COMMON";
      tierIcon = "⚪";
      borderColor = "#71717a";
      scoreMult = 1.2;
      slots = 1;
      powers = ["⚡ 1.2x Multiplier"];
    }
  }

  return { tierKey, tierLabel, tierIcon, rank, borderColor, scoreMult, slots, powers };
}

// ============================================================================
// LIVE XOXNO MARKETPLACE INTEGRATION & AUTHENTIC P2P LISTINGS
// Zero ghost items: If no NFTs are listed, the market is truly empty!
// ============================================================================
let cachedXoxnoListings = [];
let isFetchingXoxno = false;

// Fetch live listings from official XOXNO collections (EFOOTBALL-91a4eb & GOALKEEPER-cb9e3e)
// Uses direct MultiversX API auction/marketplace indexing to prevent browser CORS 403 blocks!
async function fetchLiveXoxnoListings() {
  if (isFetchingXoxno) return cachedXoxnoListings;
  isFetchingXoxno = true;

  const results = [];
  const collections = [
    { id: STRIKER_COLLECTION, floor: 0.08, currency: "EGLD", fallbackImg: "branding/original/EFOOTBALL-91a4eb/logo.png" },
    { id: KEEPER_COLLECTION, floor: 0.48, currency: "EGLD", fallbackImg: "branding/original/GOALKEEPER-cb9e3e/logo.png" }
  ];

  for (const colConfig of collections) {
    const col = colConfig.id;
    try {
      // Primary: MultiversX API query for active marketplace / auction NFTs (No CORS issues!)
      const res = await fetch(`${MULTIVERSX_API}/collections/${col}/nfts?hasAuction=true&size=30`);
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          items.forEach((it) => {
            const tier = getNftRarityTier(it);
            results.push({
              id: `xoxno-${it.identifier}`,
              isXoxno: true,
              auctionId: it.nonce || 1,
              marketplaceSc: XOXNO_MARKETPLACE_SC,
              identifier: it.identifier,
              collection: col,
              nonce: it.nonce || 0,
              name: it.name || it.identifier,
              rarity: tier.tierLabel,
              rank: it.rank || tier.rank,
              ovr: it.metadata?.attributes?.find((a) => a.trait_type === "OVR")?.value || (col === KEEPER_COLLECTION ? 92 : 88),
              trait: "Official XOXNO Marketplace Listing",
              url: it.url || colConfig.fallbackImg,
              price: colConfig.floor,
              rawPrice: BigInt(Math.floor(colConfig.floor * 1e18)).toString(),
              currency: colConfig.currency,
              seller: "XOXNO Marketplace",
              createdAt: it.timestamp ? it.timestamp * 1000 : Date.now(),
              attributes: it.metadata?.attributes || []
            });
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch marketplace NFTs for", col, e);
    }
  }

  isFetchingXoxno = false;
  cachedXoxnoListings = results;
  renderMarketplaceGrid();
  renderTelemetry();
  return results;
}

// Load player-created listings from LocalStorage (Purging legacy dummy seed items)
function getMarketplaceListings() {
  try {
    const raw = localStorage.getItem(STORAGE_LISTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strict filter: purge any legacy phantom mock items
        const realListings = parsed.filter(
          (x) =>
            x &&
            x.seller &&
            !x.seller.startsWith("erd1ultra") &&
            !x.seller.startsWith("erd1degen") &&
            !x.seller.startsWith("erd1sniper") &&
            !x.seller.startsWith("erd1octo") &&
            !x.seller.startsWith("erd1finisher") &&
            !x.seller.startsWith("erd1catref") &&
            !x.seller.startsWith("erd1topbin") &&
            !x.seller.startsWith("erd1beerstriker")
        );
        return realListings;
      }
    }
  } catch (e) {}
  return [];
}

function getAllActiveListings() {
  const p2p = getMarketplaceListings();
  return [...p2p, ...cachedXoxnoListings];
}

function saveMarketplaceListings(listings) {
  try {
    localStorage.setItem(STORAGE_LISTINGS, JSON.stringify(listings));
  } catch (e) {}
}

// Vault & Burn Stats
function getVaultStats() {
  let pot = BASE_VAULT_POT;
  let burned = BASE_BURNED_GAMES;
  try {
    const p = localStorage.getItem(STORAGE_VAULT_POT);
    if (p) {
      const val = parseInt(p, 10) || 0;
      pot = (val === 25400000) ? 0 : Math.max(0, val);
    }
    const b = localStorage.getItem(STORAGE_TOTAL_BURNED);
    if (b) {
      const val = parseInt(b, 10) || 0;
      burned = (val === 92912450000) ? 0 : Math.max(0, val);
    }
  } catch (e) {}
  return { pot, burned };
}

function addVaultContributions(vaultAdd, burnAdd) {
  const stats = getVaultStats();
  stats.pot += (vaultAdd || 0);
  stats.burned += (burnAdd || 0);
  try {
    localStorage.setItem(STORAGE_VAULT_POT, String(stats.pot));
    localStorage.setItem(STORAGE_TOTAL_BURNED, String(stats.burned));
  } catch (e) {}
  renderTelemetry();
  return stats;
}

async function refreshOnChainVaultStats() {
  if (!STADIUM_VAULT_SC || !STADIUM_VAULT_SC.startsWith("erd1qqqq")) {
    renderTelemetry();
    return;
  }
  try {
    const res = await fetch(`https://api.multiversx.com/accounts/${STADIUM_VAULT_SC}/tokens/${EFOO_TOKEN_ID}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.balance) {
        const balanceBig = BigInt(data.balance);
        const potTokens = Number(balanceBig / 1000000000000000000n);
        localStorage.setItem(STORAGE_VAULT_POT, String(potTokens));
      }
    } else {
      localStorage.setItem(STORAGE_VAULT_POT, "0");
    }
    const queryRes = await fetch("https://api.multiversx.com/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scAddress: STADIUM_VAULT_SC,
        funcName: "getTotalBurnedGames",
        args: []
      })
    });
    if (queryRes.ok) {
      const qData = await queryRes.json();
      if (qData && qData.data && qData.data.returnData && qData.data.returnData[0]) {
        const hex = atob(qData.data.returnData[0]).split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        const burnedBig = BigInt('0x' + (hex || '0'));
        const burnedTokens = Number(burnedBig / 1000000000000000000n);
        localStorage.setItem(STORAGE_TOTAL_BURNED, String(burnedTokens));
      }
    }
  } catch (e) {
    console.warn("Could not refresh on-chain vault stats:", e);
  }
  renderTelemetry();
}

function renderTelemetry() {
  const stats = getVaultStats();
  const potEl = document.getElementById("tele-vault-val");
  const burnedEl = document.getElementById("tele-burned-val");
  const countEl = document.getElementById("tele-listings-count");
  const floorValEl = document.getElementById("tele-floor-val");
  const floorSubEl = document.getElementById("tele-floor-sub");

  if (potEl) potEl.textContent = `${stats.pot.toLocaleString("en-US")} $EFOO`;
  if (burnedEl) burnedEl.textContent = `${stats.burned.toLocaleString("en-US")} $EFOO`;

  const listings = getAllActiveListings();
  if (countEl) countEl.textContent = `${listings.length} NFTs`;

  // DYNAMIC FLOOR PRICE: Always find the absolute cheapest item on the market!
  if (!listings || listings.length === 0) {
    if (floorValEl) floorValEl.textContent = "—";
    if (floorSubEl) floorSubEl.textContent = "No Active Listings";
  } else {
    const egldItems = listings.filter((x) => x.currency === "EGLD");
    const efooItems = listings.filter((x) => x.currency === "EFOO" || !x.currency);

    let floorText = "—";
    let subText = "Lowest Listed Price (Floor)";

    if (egldItems.length > 0 && efooItems.length > 0) {
      const minEgld = Math.min(...egldItems.map((x) => Number(x.price) || 999999));
      const minEfoo = Math.min(...efooItems.map((x) => Number(x.price) || 999999));
      floorText = `${minEgld.toFixed(3)} EGLD`;
      subText = `or ${minEfoo.toLocaleString("en-US")} $EFOO (Cheapest)`;
    } else if (egldItems.length > 0) {
      const minEgld = Math.min(...egldItems.map((x) => Number(x.price) || 999999));
      floorText = `${minEgld.toFixed(3)} EGLD`;
      subText = "Lowest Listed Price (Floor)";
    } else if (efooItems.length > 0) {
      const minEfoo = Math.min(...efooItems.map((x) => Number(x.price) || 999999));
      floorText = `${minEfoo.toLocaleString("en-US")} $EFOO`;
      subText = "Lowest Listed Price (Floor)";
    }

    if (floorValEl) floorValEl.textContent = floorText;
    if (floorSubEl) floorSubEl.textContent = subText;
  }
}

// ============================================================================
// WALLET MANAGEMENT & AUTHENTICATION
// ============================================================================
function initMarketWallet() {
  try {
    // Check if returning from official MultiversX Web Wallet login callback
    const urlParams = new URLSearchParams(window.location.search);
    const callbackAddr = urlParams.get("address");
    if (callbackAddr && callbackAddr.startsWith("erd1")) {
      localStorage.setItem("multiversx_address", callbackAddr);
      localStorage.setItem("multiversx_provider", "webwallet");
      localStorage.setItem("efoo_wallet_address", callbackAddr);
      localStorage.setItem("efoo_wallet_provider", "webwallet");
      const cleanUrl = window.location.pathname + (urlParams.get("tab") ? "?tab=" + urlParams.get("tab") : "");
      window.history.replaceState({}, document.title, cleanUrl);
    }

    let savedAddr = localStorage.getItem("efoo_wallet_address") || localStorage.getItem("multiversx_address") || sessionStorage.getItem("efoo_wallet_address") || sessionStorage.getItem("multiversx_address");
    // Clear out any legacy placeholder docs address
    if (savedAddr && savedAddr.startsWith("erd1qyu5wthldz")) {
      savedAddr = null;
      localStorage.removeItem("multiversx_address");
      sessionStorage.removeItem("multiversx_address");
      localStorage.removeItem("efoo_wallet_address");
      localStorage.removeItem("efoo_connected_address");
    }
    const savedProv = localStorage.getItem("efoo_wallet_provider") || localStorage.getItem("multiversx_provider") || sessionStorage.getItem("efoo_wallet_provider") || sessionStorage.getItem("multiversx_provider") || "webwallet";
    if (savedAddr && savedAddr.startsWith("erd1")) {
      marketWallet.address = savedAddr;
      marketWallet.provider = savedProv;
      try {
        localStorage.setItem("efoo_wallet_address", savedAddr);
        localStorage.setItem("efoo_wallet_provider", savedProv);
        localStorage.setItem("multiversx_address", savedAddr);
        localStorage.setItem("multiversx_provider", savedProv);
        localStorage.setItem("efoo_connected_address", savedAddr);
      } catch (e) {}
      fetchWalletBalances(savedAddr);
      fetchWalletNfts(savedAddr);
    } else {
      marketWallet.address = null;
      marketWallet.provider = null;
      marketWallet.ownedNfts = [];
    }
  } catch (e) {}
  updateWalletUI();
}

async function fetchWalletBalances(address) {
  try {
    // Fetch EGLD
    const accRes = await fetch(`${MULTIVERSX_API}/accounts/${address}`);
    if (accRes.ok) {
      const acc = await accRes.json();
      marketWallet.egldBalance = parseFloat(acc.balance) / 1e18;
    }

    // Fetch EFOO
    const tokRes = await fetch(`${MULTIVERSX_API}/accounts/${address}/tokens/${EFOO_TOKEN_ID}`);
    if (tokRes.ok) {
      const tok = await tokRes.json();
      marketWallet.efooBalance = parseFloat(tok.balance) / 1e18;
    } else {
      marketWallet.efooBalance = 0;
    }
  } catch (e) {
    marketWallet.efooBalance = 0;
  }
  updateWalletUI();
}

async function fetchWalletNfts(address) {
  try {
    // Fetch all official team collections (EFOOTBALL-91a4eb, GOALKEEPER-cb9e3e, EFOOPASS-5223a8, FOOTBALL-64e58f)
    const res = await fetch(`${MULTIVERSX_API}/accounts/${address}/nfts?collections=${STRIKER_COLLECTION},${KEEPER_COLLECTION},${ULTRAS_PASS_COLLECTION},FOOTBALL-64e58f&size=100`);
    if (res.ok) {
      const nfts = await res.json();
      if (Array.isArray(nfts)) {
        marketWallet.ownedNfts = nfts;
        if (hasUltrasPass(address)) {
          try {
            localStorage.setItem(STORAGE_ULTRAS_PASS_PREFIX + address.toLowerCase(), "true");
            localStorage.setItem("efoo_has_ultras_pass", "true");
          } catch (e) {}
        }
        renderMyLockerGrid();
        updateWalletUI();
        updateUltrasPassUI();
        return;
      }
    }
  } catch (e) {}

  marketWallet.ownedNfts = [];
  renderMyLockerGrid();
  updateWalletUI();
  updateUltrasPassUI();
}

function updateWalletUI() {
  const isConn = !!marketWallet.address;
  const pill = document.getElementById("m-wallet-connected-pill");
  const connBtn = document.getElementById("m-btn-connect");
  const shortAddr = document.getElementById("m-wallet-short-addr");
  const balEl = document.getElementById("m-wallet-bal");
  const notConnBox = document.getElementById("locker-not-connected-banner");
  const vipBadge = document.getElementById("m-wallet-vip-badge");

  if (pill) pill.classList.toggle("hidden", !isConn);
  if (connBtn) connBtn.classList.toggle("hidden", isConn);
  if (notConnBox) notConnBox.classList.toggle("hidden", isConn);

  if (isConn) {
    const a = marketWallet.address;
    if (shortAddr) shortAddr.textContent = `${a.slice(0, 6)}...${a.slice(-4)}`;
    if (balEl) balEl.textContent = `${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO`;
    const isVip = hasUltrasPass(a);
    if (vipBadge) {
      vipBadge.classList.toggle("hidden", !isVip);
    }
  } else {
    if (vipBadge) vipBadge.classList.add("hidden");
  }

  const adminBtn = document.getElementById("m-btn-admin-vault");
  const isOwner = marketWallet.address === EFOOREWARDS_WALLET;
  if (adminBtn) {
    adminBtn.classList.toggle("hidden", !isOwner);
    if (isOwner) {
      sessionStorage.setItem("efoo_admin_session_auth_v1", "VALID_OWNER_AUTH");
      localStorage.setItem("efoo_connected_address", EFOOREWARDS_WALLET);
    } else {
      sessionStorage.removeItem("efoo_admin_session_auth_v1");
    }
  }
}

async function disconnectWallet() {
  const topicToDisconnect = marketWcSessionTopic || localStorage.getItem("efoo_wc_topic") || "";

  marketWallet.address = null;
  marketWallet.provider = null;
  marketWallet.ownedNfts = [];
  marketWcSessionTopic = "";

  // 1. Actively terminate xPortal WalletConnect session so xPortal app closes session immediately
  if (marketWcSignClient) {
    terminateWalletConnectSessions(marketWcSignClient, topicToDisconnect);
  } else if (topicToDisconnect) {
    (async () => {
      try {
        let Mod = await import("https://esm.sh/@walletconnect/sign-client@2.11.0?bundle").catch(() => import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client@2.11.0/+esm"));
        const SC = Mod.SignClient || Mod.default;
        const tempClient = await SC.init({
          projectId: WC_PROJECT_ID,
          relayUrl: "wss://relay.walletconnect.com"
        });
        await terminateWalletConnectSessions(tempClient, topicToDisconnect);
      } catch (e) {}
    })();
  }

  // 2. Revoke DeFi Extension session
  const ext = window.elrondWallet || window.multiversx || window.elrond;
  if (ext && typeof ext.logout === "function") {
    try {
      ext.logout();
    } catch (e) {}
  }
  try {
    sendMarketExtensionMessage("logout", "");
  } catch (e) {}

  // 3. Clear all storage keys
  try {
    localStorage.removeItem("multiversx_address");
    localStorage.removeItem("multiversx_provider");
    localStorage.removeItem("efoo_wallet_address");
    localStorage.removeItem("efoo_wallet_provider");
    localStorage.removeItem("efoo_connected_address");
    localStorage.removeItem("efoo_wc_topic");
    localStorage.removeItem("walletconnect");
    localStorage.removeItem("efoo_user_wallet");

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("wc@2:") || k.startsWith("walletconnect"))) {
        localStorage.removeItem(k);
      }
    }

    sessionStorage.removeItem("multiversx_address");
    sessionStorage.removeItem("multiversx_provider");
    sessionStorage.removeItem("efoo_connected_address");
    sessionStorage.removeItem("efoo_wallet_address");
    sessionStorage.removeItem("efoo_wallet_provider");
    sessionStorage.removeItem("efoo_admin_session_auth_v1");
  } catch (e) {}

  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (e) {}

  if (typeof updateOwnerAdminVisibility === "function") {
    updateOwnerAdminVisibility("");
  }
  updateWalletUI();
  renderMarketplaceGrid();
  renderMyLockerGrid();
  showMarketToast(
    currentMarketLang === "hu"
      ? "🚪 Sikeresen kijelentkeztél (xPortal és böngésző kapcsolat lezárva)!"
      : "🚪 Logged out successfully (xPortal & browser sessions closed)."
  );
}

// Cross-tab & Multi-page Synchronous Wallet State Listener
window.addEventListener("storage", (e) => {
  if (e.key === "efoo_wallet_address" || e.key === "multiversx_address" || e.key === null) {
    const newAddr = localStorage.getItem("efoo_wallet_address") || localStorage.getItem("multiversx_address") || "";
    const newProv = localStorage.getItem("efoo_wallet_provider") || localStorage.getItem("multiversx_provider") || "webwallet";
    if (newAddr && newAddr.startsWith("erd1") && newAddr !== marketWallet.address) {
      marketWallet.address = newAddr;
      marketWallet.provider = newProv;
      fetchWalletBalances(newAddr);
      fetchWalletNfts(newAddr);
      updateWalletUI();
      renderMarketplaceGrid();
      renderMyLockerGrid();
    } else if (!newAddr && marketWallet.address) {
      marketWallet.address = null;
      marketWallet.provider = null;
      marketWallet.ownedNfts = [];
      updateWalletUI();
      renderMarketplaceGrid();
      renderMyLockerGrid();
    }
  }
});

function connectManualAddress(raw, provider = "inspector") {
  const addr = (raw || "").trim();
  if (!addr.startsWith("erd1") || addr.length < 50) {
    showMarketToast("⚠️ Please enter a valid MultiversX address starting with erd1...");
    return;
  }
  marketWallet.address = addr;
  marketWallet.provider = provider;
  try {
    localStorage.setItem("multiversx_address", addr);
    localStorage.setItem("multiversx_provider", provider);
    localStorage.setItem("efoo_wallet_address", addr);
    localStorage.setItem("efoo_wallet_provider", provider);
    localStorage.setItem("efoo_connected_address", addr);
  } catch (e) {}
  fetchWalletBalances(addr);
  fetchWalletNfts(addr);
  document.getElementById("m-wallet-modal")?.classList.add("hidden");
  showMarketToast(`⚡ Connected to ${addr.slice(0, 6)}...${addr.slice(-4)}`);
  updateWalletUI();
  renderMarketplaceGrid();
}

// ============================================================================
// MARKETPLACE BROWSING & CARD RENDERING
// ============================================================================
function renderMarketplaceGrid() {
  const grid = document.getElementById("market-listings-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const allListings = getAllActiveListings();
  const isHu = currentMarketLang === "hu";
  const isRo = currentMarketLang === "ro";

  // If no listings exist at all on the market (Zero ghost items!)
  if (allListings.length === 0) {
    grid.innerHTML = `
      <div class="m-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(12, 20, 29, 0.6); border: 1px dashed rgba(255,255,255,0.15); border-radius: 16px;">
        <div style="font-size: 3.2rem; margin-bottom: 12px;">🏟️</div>
        <h3 style="font-family: var(--font-bebas); font-size: 2rem; color: #fff; letter-spacing: 0.05em; margin-bottom: 8px;">
          ${isHu ? "A PIAC JELENLEG ÜRES" : isRo ? "PIAȚA ESTE MOMENTAN LIBERĂ" : "THE MARKET IS CURRENTLY EMPTY"}
        </h3>
        <p style="color: var(--text-sub); max-width: 520px; margin: 0 auto 20px; font-size: 0.95rem; line-height: 1.6;">
          ${isHu 
            ? "Nincs aktív eladásra kínált játékos vagy kapus sem a játékosoknál, sem az XOXNO-n. Légy az első, aki meghirdet egy NFT-t a saját Öltözőjéből!"
            : isRo
            ? "Nu există NFT-uri listate la vânzare de către jucători sau pe piața XOXNO. Fii primul care își scoate la vânzare un atacant sau portar din vestiar!"
            : "No NFTs are currently listed for sale by players or on XOXNO. Be the first to list a Striker or Goalkeeper from your personal Locker Room!"}
        </p>
        <button type="button" class="m-btn-primary" id="btn-empty-goto-locker" style="display:inline-flex; align-items:center; gap:8px;">
          🎒 ${isHu ? "Ugrás a Saját Öltözőhöz & Eladás" : isRo ? "Deschide Vestiarul & Vinde" : "Open My Locker & Sell"}
        </button>
      </div>
    `;

    document.getElementById("btn-empty-goto-locker")?.addEventListener("click", () => {
      document.getElementById("tab-btn-my-nfts")?.click();
    });
    return;
  }

  // Apply Category Filter
  let filtered = allListings.filter((item) => {
    if (filterCollection === "striker") {
      return item.collection === STRIKER_COLLECTION || (item.identifier && item.identifier.includes("EFOOTBALL"));
    }
    if (filterCollection === "keeper") {
      return item.collection === KEEPER_COLLECTION || (item.identifier && item.identifier.includes("GOALKEEPER")) || !!item.jersey;
    }
    return true;
  });

  // Apply Rarity Filter
  if (filterRarity !== "all") {
    filtered = filtered.filter((item) => {
      const tierInfo = getNftRarityTier(item);
      return tierInfo.tierKey === filterRarity;
    });
  }

  // Apply Sort
  filtered.sort((a, b) => {
    if (sortOrder === "price_asc") return a.price - b.price;
    if (sortOrder === "price_desc") return b.price - a.price;
    if (sortOrder === "rank_asc") {
      const ra = getNftRarityTier(a).rank;
      const rb = getNftRarityTier(b).rank;
      return (parseInt(ra, 10) || 999) - (parseInt(rb, 10) || 999);
    }
    if (sortOrder === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
    return 0;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-sub);">
        <h3>${isHu ? "Nincs a szűrésnek megfelelő NFT." : "No NFTs match the selected filter."}</h3>
        <p>${isHu ? "Próbáld meg az 'Összes' fület!" : "Try switching to 'All' or check back soon!"}</p>
      </div>
    `;
    return;
  }

  const curAddr = marketWallet.address ? marketWallet.address.toLowerCase() : "";

  filtered.forEach((item) => {
    const tier = getNftRarityTier(item);
    const isOwner = curAddr && item.seller && item.seller.toLowerCase() === curAddr;

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey}`;

    const formattedPrice = item.currency === "EGLD"
      ? (typeof item.price === "number" ? item.price.toFixed(3) : item.price)
      : item.price.toLocaleString("en-US");

    const sellerShort = isOwner
      ? (isHu ? "Te (Tulajdonos)" : (isRo ? "Tu (Proprietar)" : "You (Owner)"))
      : `${item.seller.slice(0, 6)}...${item.seller.slice(-4)}`;

    card.innerHTML = `
      <div class="mnc-media-wrap" data-inspect="${item.id}">
        <img src="${item.url}" alt="${item.name}" class="mnc-media-img" loading="lazy" />
        <div class="mnc-rank-badge" style="border-color:${tier.borderColor}; color:${tier.borderColor};">
          ${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}
        </div>
        ${
          item.isXoxno
            ? `<div class="mnc-xoxno-badge" title="Verified listing on XOXNO Marketplace">
                 <img src="branding/rebranded/xoxno-logo.svg" alt="XOXNO" class="mnc-xoxno-logo-img" />
                 <span class="mnc-xoxno-text">XOXNO</span>
               </div>`
            : `<div class="mnc-col-tag">${item.jersey ? "🧤 KEEPER" : "⚽ STRIKER"}</div>`
        }
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${item.name}</strong>
          <span class="mnc-ovr">${item.ovr || 85} OVR</span>
        </div>

        <p class="mnc-trait-desc">${item.trait || (item.isXoxno ? "Listed on XOXNO Marketplace" : "Sunday League Degen Ultra")}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">ASKING PRICE</span>
            <strong class="mnc-price-val">${formattedPrice} $${item.currency || "EFOO"}</strong>
            <span class="mnc-seller-lbl">${item.isXoxno ? "⚡ XOXNO Listing" : `Seller: ${sellerShort}${hasUltrasPass(item.seller) ? ' <span class="mnc-seller-vip-crown" title="0% Fee VIP Ultras Seller">👑 VIP</span>' : ''}`}</span>
          </div>

          <div class="mnc-action-wrap">
            ${
              isOwner
                ? `<div class="mnc-owner-btns">
                     <button type="button" class="mnc-btn-edit" data-edit="${item.id}">✏️ Edit</button>
                     <button type="button" class="mnc-btn-delist" data-delist="${item.id}">✕ Delist</button>
                   </div>`
                : `<button type="button" class="mnc-btn-buy" data-buy="${item.id}">
                     ${item.isXoxno ? "⚡ BUY (XOXNO)" : "⚡ BUY"}
                   </button>`
            }
          </div>
        </div>
      </div>
    `;

    // Click on media to open detailed inspection popup
    card.querySelector(`[data-inspect="${item.id}"]`)?.addEventListener("click", () => {
      openNftDetailsModal(item);
    });

    // Buy Action (Direct XOXNO Smart Contract or P2P)
    card.querySelector(`[data-buy="${item.id}"]`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      executeBuyNft(item);
    });

    // Edit Price Action
    card.querySelector(`[data-edit="${item.id}"]`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditPriceModal(item);
    });

    // Delist Action
    card.querySelector(`[data-delist="${item.id}"]`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      executeDelistNft(item);
    });

    grid.appendChild(card);
  });
}

// ============================================================================
// TAB 2: MY LOCKER ROOM & SELL NFT
// ============================================================================
function renderMyLockerGrid() {
  const grid = document.getElementById("my-nfts-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!marketWallet.address) return;

  const listings = getMarketplaceListings();
  const curAddr = marketWallet.address.toLowerCase();

  const myNfts = marketWallet.ownedNfts || [];

  if (myNfts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-sub);">
        <h3>No NFTs found in your wallet locker room.</h3>
        <p>Mint a Striker or Keeper NFT, or buy one from the marketplace above!</p>
      </div>
    `;
    return;
  }

  myNfts.forEach((nft) => {
    const tier = getNftRarityTier(nft);
    const isListed = listings.find((x) => x.identifier === nft.identifier && x.seller && x.seller.toLowerCase() === curAddr);

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey}`;

    card.innerHTML = `
      <div class="mnc-media-wrap" data-locker-inspect="${nft.identifier}">
        <img src="${nft.url || 'branding/original/EFOOTBALL-91a4eb/logo.png'}" alt="${nft.name}" class="mnc-media-img" />
        <div class="mnc-rank-badge" style="border-color:${tier.borderColor}; color:${tier.borderColor};">
          ${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}
        </div>
        <div class="mnc-col-tag">${isListed ? "🏷️ LISTED" : "🎒 IN LOCKER"}</div>
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${nft.name || nft.identifier}</strong>
          <span class="mnc-ovr">${nft.ovr || 90} OVR</span>
        </div>

        <p class="mnc-trait-desc">${nft.trait || "Equipped for 120' Shootout Arena"}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">STATUS</span>
            <strong class="mnc-price-val" style="color:${isListed ? 'var(--gold)' : 'var(--neon)'};">
              ${isListed ? `${isListed.price.toLocaleString("en-US")} $${isListed.currency}` : "Available in Locker"}
            </strong>
          </div>

          <div class="mnc-action-wrap">
            ${
              isListed
                ? `<div class="mnc-owner-btns">
                     <button type="button" class="mnc-btn-edit" data-locker-edit="${isListed.id}">✏️ Edit</button>
                     <button type="button" class="mnc-btn-delist" data-locker-delist="${isListed.id}">✕ Withdraw</button>
                   </div>`
                : `<button type="button" class="m-btn-primary" data-locker-list="${nft.identifier}">🏷️ SELL</button>`
            }
          </div>
        </div>
      </div>
    `;

    card.querySelector(`[data-locker-inspect="${nft.identifier}"]`)?.addEventListener("click", () => {
      openNftDetailsModal(nft);
    });

    if (isListed) {
      card.querySelector(`[data-locker-edit="${isListed.id}"]`)?.addEventListener("click", () => {
        openEditPriceModal(isListed);
      });
      card.querySelector(`[data-locker-delist="${isListed.id}"]`)?.addEventListener("click", () => {
        executeDelistNft(isListed);
      });
    } else {
      card.querySelector(`[data-locker-list="${nft.identifier}"]`)?.addEventListener("click", () => {
        openListNftModal(nft);
      });
    }

    grid.appendChild(card);
  });
}

// ============================================================================
// TAB 3: SUPER SKILLS STORE
// ============================================================================
function renderSkillsStore() {
  const grid = document.getElementById("m-skills-store-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const isHu = currentMarketLang === "hu";
  const isRo = currentMarketLang === "ro";

  MARKET_SKILLS.forEach((s) => {
    const card = document.createElement("div");
    card.className = "m-skill-card";

    const name = isHu ? s.nameHu : (isRo ? s.nameRo : s.name);
    const desc = isHu ? s.descHu : s.desc;
    const singlePrice = (s.price / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });
    const packPrice5 = Math.round((s.price * 5 * 0.8) / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });

    card.innerHTML = `
      <div class="msk-head">
        <span class="msk-icon">${s.icon}</span>
        <div>
          <strong class="msk-name" style="color:${s.color};">${name}</strong>
          <small style="display:block; font-family:var(--font-mono); font-size:0.68rem; color:var(--neon);">50% BURN • 50% VAULT</small>
        </div>
      </div>

      <p class="msk-desc">${desc}</p>

      <div class="msk-actions">
        <button type="button" class="msk-btn-single" data-buy-single-skill="${s.id}">
          1x (${singlePrice}k $EFOO)
        </button>
        <button type="button" class="msk-btn-pack" data-buy-pack-skill="${s.id}">
          5x (${packPrice5}k $EFOO) 🔥 -20%
        </button>
      </div>
    `;

    card.querySelector(`[data-buy-single-skill="${s.id}"]`)?.addEventListener("click", () => {
      buySkillCharge(s, 1);
    });

    card.querySelector(`[data-buy-pack-skill="${s.id}"]`)?.addEventListener("click", () => {
      buySkillCharge(s, 5);
    });

    grid.appendChild(card);
  });
}

async function buySkillCharge(skill, count) {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(
      isHu
        ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a képességek megvásárlásához!"
        : "⚠️ Please connect your MultiversX wallet first to purchase skills!"
    );
    return;
  }

  const cost = count > 1 ? Math.round(skill.price * count * 0.8) : skill.price * count;

  if (marketWallet.efooBalance < cost) {
    showMarketToast(
      isHu
        ? `⚠️ Nincs elegendő $EFOO egyenleged! Szükséges: ${cost.toLocaleString("en-US")} $EFOO`
        : `⚠️ Insufficient $EFOO balance! Needed: ${cost.toLocaleString("en-US")} $EFOO`
    );
    return;
  }

  const efooTokenHex = stringToHex(EFOO_TOKEN_ID);
  const costAtomic = toAtomicUnits(cost, 18);
  let costHex = costAtomic.toString(16);
  if (costHex.length % 2 !== 0) costHex = "0" + costHex;

  // MultiversX ESDTTransfer to SC depositToVaultPot endpoint:
  // ESDTTransfer@<token_id_hex>@<amount_hex>@<endpoint_hex>
  const endpointHex = stringToHex("depositToVaultPot");
  const dataField = `ESDTTransfer@${efooTokenHex}@${costHex}@${endpointHex}`;

  showMarketToast(
    isHu
      ? `⏳ Tranzakció előkészítése: +${count}x ${skill.name} megvásárlása (${cost.toLocaleString()} $EFOO)...`
      : `⏳ Preparing transaction: Purchasing +${count}x ${skill.name} (${cost.toLocaleString()} $EFOO)...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 12000000,
      data: dataField
    });

    marketWallet.efooBalance = Math.max(0, marketWallet.efooBalance - cost);
    updateWalletUI();

    // 50% Burn, 50% to Stadium Vault
    const half = Math.floor(cost / 2);
    addVaultContributions(half, half);

    // Save to game inventory
    try {
      let inv = {};
      const raw = localStorage.getItem(STORAGE_SKILLS_INVENTORY);
      if (raw) inv = JSON.parse(raw);
      inv[skill.id] = (inv[skill.id] || 0) + count;
      localStorage.setItem(STORAGE_SKILLS_INVENTORY, JSON.stringify(inv));
    } catch (e) {}

    showMarketToast(
      isHu
        ? `✅ Sikeres tranzakció! +${count}x ${skill.name} megvéve és beküldve a Smart Contractba! (50% elégetve 🔥, 50% a Vaultba küldve 🏆)`
        : `✅ Transaction dispatched! +${count}x ${skill.name} purchased & sent to Smart Contract! (50% burned 🔥, 50% to Vault 🏆)`
    );
  } catch (err) {
    console.error("Skill purchase error:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a tranzakció során: ${err.message || "Megszakítva"}`
        : `❌ Transaction error: ${err.message || "Cancelled"}`
    );
  }
}

// ============================================================================
// BUY / LIST / DELIST / EDIT P2P LOGIC
// ============================================================================
async function executeBuyNft(item) {
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(
      currentMarketLang === "hu"
        ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a vásárláshoz!"
        : "⚠️ Please connect your MultiversX wallet first to purchase this NFT!"
    );
    return;
  }

  const isHu = currentMarketLang === "hu";

  // =========================================================================
  // DIRECT XOXNO SMART CONTRACT PURCHASE (NO REDIRECT TO XOXNO.COM)
  // Executes directly via MultiversX protocol from our dApp
  // =========================================================================
  if (item.isXoxno) {
    try {
      showMarketToast(
        isHu
          ? `⚡ XOXNO Tranzakció előkészítése: ${item.name}...`
          : `⚡ Preparing direct XOXNO Smart Contract purchase: ${item.name}...`
      );

      // Build data field: buy@<auctionId_hex>@<collection_hex>@<nonce_hex>@01
      const auctionNum = item.auctionId || 0;
      let auctionHex = auctionNum.toString(16);
      if (auctionHex.length % 2 !== 0) auctionHex = "0" + auctionHex;

      const colStr = item.collection || STRIKER_COLLECTION;
      const encoder = new TextEncoder();
      const colHex = Array.from(encoder.encode(colStr))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const nonceNum = item.nonce || 0;
      let nonceHex = nonceNum.toString(16);
      if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

      const dataField = `buy@${auctionHex}@${colHex}@${nonceHex}@01`;
      const receiverSc = item.marketplaceSc || XOXNO_MARKETPLACE_SC;

      let valueStr = "0";
      if (item.currency === "EGLD") {
        if (item.rawPrice && item.rawPrice !== "0") {
          valueStr = String(item.rawPrice);
        } else {
          valueStr = BigInt(Math.floor(Number(item.price) * 1e18)).toString();
        }
      }

      // Check balance
      if (item.currency === "EGLD" && marketWallet.egldBalance < Number(item.price)) {
        showMarketToast(
          isHu
            ? `⚠️ Nincs elegendő EGLD egyenleged! Szükséges: ${item.price} EGLD`
            : `⚠️ Insufficient EGLD balance! Needed: ${item.price} EGLD`
        );
        return;
      }

      await sendMultiversxTransaction({
        receiver: receiverSc,
        value: valueStr,
        data: dataField,
        gasLimit: 35000000
      });
      showMarketToast(
        isHu
          ? `🎉 XOXNO Vásárlási tranzakció sikeresen kiküldve! Az NFT a tárcádba érkezik!`
          : `🎉 XOXNO Buy transaction dispatched! NFT is on its way to your wallet!`
      );
    } catch (e) {
      console.error("XOXNO purchase failed:", e);
      showMarketToast(
        isHu
          ? `❌ Hiba a vásárlási tranzakció során: ${e.message || "Tranzakció megszakítva"}`
          : `❌ Purchase transaction error: ${e.message || "Cancelled"}`
      );
    }
    return;
  }

  // =========================================================================
  // P2P COMMUNITY LISTING PURCHASE ($EFOO / EGLD) VIA SMART CONTRACT
  // =========================================================================
  const isEgld = item.currency === "EGLD";
  const colStr = item.collection || (item.identifier ? item.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);
  let nonceNum = item.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (item.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  if (isEgld) {
    if (marketWallet.egldBalance < Number(item.price)) {
      showMarketToast(
        isHu
          ? `⚠️ Nincs elegendő EGLD egyenleged! Ár: ${item.price} EGLD (Egyenleg: ${marketWallet.egldBalance.toFixed(3)} EGLD)`
          : `⚠️ Insufficient EGLD balance! Price: ${item.price} EGLD (Balance: ${marketWallet.egldBalance.toFixed(3)} EGLD)`
      );
      return;
    }

    const priceAtomic = toAtomicUnits(item.price, 18);
    // buyNft@<colHex>@<nonceHex>
    const endpointHex = stringToHex("buyNft"); // 6275794e6674
    const dataField = `${endpointHex}@${colHex}@${nonceHex}`;

    showMarketToast(
      isHu
        ? `⚡ Smart Contract vásárlás előkészítése: ${item.name} (${item.price} EGLD)...`
        : `⚡ Preparing Smart Contract purchase: ${item.name} (${item.price} EGLD)...`
    );

    try {
      await sendMultiversxTransaction({
        receiver: STADIUM_VAULT_SC,
        value: priceAtomic.toString(),
        gasLimit: 15000000,
        data: dataField
      });

      // Transfer ownership in marketplace state
      let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
      saveMarketplaceListings(listings);

      if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
      marketWallet.ownedNfts.push({
        ...item,
        seller: marketWallet.address
      });

      renderMarketplaceGrid();
      renderMyLockerGrid();
      renderTelemetry();

      const sellerHasPass = hasUltrasPass(item.seller);
      const buyerHasPass = hasUltrasPass(marketWallet.address);
      const isZeroFeeTrade = sellerHasPass || buyerHasPass;

      if (isZeroFeeTrade) {
        showMarketToast(
          isHu
            ? `🎉 Vásárlási tranzakció elküldve! 0% VIP Ultras díjkedvezmény: az eladó a vételár 100%-át megkapja! Az NFT a címedre érkezik!`
            : `🎉 Buy transaction sent! 0% VIP Ultras fee applied: seller receives 100%! NFT incoming to your locker!`
        );
      } else {
        showMarketToast(
          isHu
            ? `🎉 Vásárlási tranzakció sikeresen kiküldve! 98% az eladónak, 2% díj az efoorewards tárcába ment. Az NFT a címedre érkezik!`
            : `🎉 Purchase transaction sent! 98% to seller, 2% fee to efoorewards. NFT transfers directly to your wallet!`
        );
      }
    } catch (err) {
      console.error("EGLD purchase failed:", err);
      showMarketToast(
        isHu
          ? `❌ Vásárlási hiba: ${err.message || "Megszakítva"}`
          : `❌ Purchase error: ${err.message || "Cancelled"}`
      );
    }
    return;
  }

  // $EFOO Trade
  if (marketWallet.efooBalance < Number(item.price)) {
    showMarketToast(
      isHu
        ? `⚠️ Nincs elegendő $EFOO egyenleged! Ár: ${Number(item.price).toLocaleString("en-US")} $EFOO (Egyenleg: ${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO)`
        : `⚠️ Insufficient $EFOO balance! Price: ${Number(item.price).toLocaleString("en-US")} $EFOO (Balance: ${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO)`
    );
    return;
  }

  const priceAtomic = toAtomicUnits(item.price, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  const efooTokenHex = stringToHex(EFOO_TOKEN_ID);
  const endpointHex = stringToHex("buyNft"); // 6275794e6674
  // MultiversX ESDTTransfer to SC endpoint: ESDTTransfer@<token_id_hex>@<amount_hex>@<endpoint_hex>@<colHex>@<nonceHex>
  const dataField = `ESDTTransfer@${efooTokenHex}@${priceHex}@${endpointHex}@${colHex}@${nonceHex}`;

  showMarketToast(
    isHu
      ? `⚡ Smart Contract vásárlás előkészítése: ${item.name} (${Number(item.price).toLocaleString()} $EFOO)...`
      : `⚡ Preparing Smart Contract purchase: ${item.name} (${Number(item.price).toLocaleString()} $EFOO)...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 15000000,
      data: dataField
    });

    const sellerHasPass = hasUltrasPass(item.seller);
    const buyerHasPass = hasUltrasPass(marketWallet.address);
    const isZeroFeeTrade = sellerHasPass || buyerHasPass;

    if (!isZeroFeeTrade) {
      const fee2_5 = Math.floor(Number(item.price) * 0.025);
      addVaultContributions(fee2_5, fee2_5);
    }

    let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
    saveMarketplaceListings(listings);

    if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
    marketWallet.ownedNfts.push({
      ...item,
      seller: marketWallet.address
    });

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    if (isZeroFeeTrade) {
      showMarketToast(
        isHu
          ? `🎉 Vásárlási tranzakció sikeresen kiküldve! 0% VIP Ultras díjkedvezmény: 100% az eladónak ment. Az NFT a címedre érkezik!`
          : `🎉 Buy transaction sent! 0% VIP Ultras fee benefit applied: 100% goes to seller. NFT is incoming!`
      );
    } else {
      showMarketToast(
        isHu
          ? `🎉 Vásárlási tranzakció sikeresen kiküldve! 95% az eladónak küldve, 2.5% elégetve 🔥, 2.5% a hétvégi Vault Reward Poolba került 🏆!`
          : `🎉 Buy transaction sent! 95% to seller, 2.5% burned 🔥, 2.5% to Stadium Vault Reward Pool 🏆!`
      );
    }
  } catch (err) {
    console.error("EFOO purchase failed:", err);
    showMarketToast(
      isHu
        ? `❌ Vásárlási hiba: ${err.message || "Megszakítva"}`
        : `❌ Purchase error: ${err.message || "Cancelled"}`
    );
  }
}

function updateListingFeePreview() {
  const currSelect = document.getElementById("list-select-currency");
  const priceInput = document.getElementById("list-input-price");
  const feeLabel = document.getElementById("list-fee-label");
  const feePct = document.getElementById("list-fee-pct");
  const recvLabel = document.getElementById("list-receive-label");
  const recvVal = document.getElementById("list-calc-receive");
  const ultrasHint = document.getElementById("list-ultras-hint");
  if (!currSelect || !priceInput) return;

  const currency = currSelect.value || "EFOO";
  const isHu = currentMarketLang === "hu";
  const val = parseFloat(priceInput.value) || 0;
  const isUltrasHolder = hasUltrasPass(marketWallet.address);

  if (isUltrasHolder) {
    if (feeLabel) feeLabel.textContent = isHu ? "VIP Ultras Kereskedési Díj:" : "VIP Ultras Trading Fee:";
    if (feePct) feePct.textContent = "0.0% (LIFETIME FREE)";
    if (recvLabel) recvLabel.textContent = isHu ? "Kézhez kapott összeg (100%):" : "You Receive (100%):";
    if (recvVal) {
      if (val > 0) {
        recvVal.textContent = currency === "EGLD" ? `${val.toFixed(4)} EGLD` : `${Math.floor(val).toLocaleString("en-US")} $EFOO`;
      } else {
        recvVal.textContent = isHu ? "100% az eladási árból" : "100% of sale proceeds";
      }
    }
    if (ultrasHint) {
      ultrasHint.innerHTML = isHu
        ? "👑 <strong>EFOO Ultras PASS Aktív:</strong> 0% díj eladáskor és vételkor, a bevétel 100%-át megtartod!"
        : "👑 <strong>EFOO Ultras PASS Active:</strong> 0% trading fee forever on buy and sell, keep 100% of your earnings!";
      ultrasHint.style.color = "#a8ff00";
      ultrasHint.style.borderColor = "rgba(168,255,0,0.4)";
      ultrasHint.style.background = "rgba(168,255,0,0.08)";
    }
  } else if (currency === "EGLD") {
    priceInput.placeholder = "e.g. 0.025";
    priceInput.min = "0.001";
    priceInput.step = "any";
    if (feeLabel) feeLabel.textContent = isHu ? "Kereskedési díj (2% efoorewards tárca):" : "Trading Fee (2% efoorewards wallet):";
    if (feePct) feePct.textContent = "2.0%";
    if (recvLabel) recvLabel.textContent = isHu ? "Kézhez kapott összeg (98%):" : "You Receive (98%):";
    if (recvVal) {
      if (val > 0) {
        const net = val * 0.98;
        recvVal.textContent = `${net.toFixed(4)} EGLD`;
      } else {
        recvVal.textContent = isHu ? "98% az eladási árból" : "98% of sale";
      }
    }
    if (ultrasHint) {
      ultrasHint.innerHTML = isHu
        ? "🎟️ Birtokolj <strong>EFOO Ultras PASS</strong>-t a <strong>0%</strong>-os kereskedési díjhoz (100% a tiéd)!"
        : "🎟️ Hold an <strong>EFOO Ultras PASS</strong> to reduce trading fee to <strong>0%</strong> (Keep 100%)!";
      ultrasHint.style.color = "#ffb800";
      ultrasHint.style.borderColor = "rgba(255,184,0,0.3)";
      ultrasHint.style.background = "rgba(255,184,0,0.08)";
    }
  } else {
    priceInput.placeholder = "e.g. 2,500,000";
    priceInput.min = "1000";
    priceInput.step = "1000";
    if (feeLabel) feeLabel.textContent = isHu ? "Kereskedési díj (2.5% Égetés 🔥 + 2.5% Reward Pool 🏆):" : "Trading Fee (2.5% Burn 🔥 + 2.5% Reward Pool 🏆):";
    if (feePct) feePct.textContent = "5.0%";
    if (recvLabel) recvLabel.textContent = isHu ? "Kézhez kapott összeg (95%):" : "You Receive (95%):";
    if (recvVal) {
      if (val > 0) {
        const net = Math.floor(val * 0.95);
        recvVal.textContent = `${net.toLocaleString("en-US")} $EFOO`;
      } else {
        recvVal.textContent = isHu ? "95% az eladási árból" : "95% of sale";
      }
    }
    if (ultrasHint) {
      ultrasHint.innerHTML = isHu
        ? "🎟️ Birtokolj <strong>EFOO Ultras PASS</strong>-t a <strong>0%</strong>-os kereskedési díjhoz (100% a tiéd)!"
        : "🎟️ Hold an <strong>EFOO Ultras PASS</strong> to reduce trading fee to <strong>0%</strong> (Keep 100%)!";
      ultrasHint.style.color = "#ffb800";
      ultrasHint.style.borderColor = "rgba(255,184,0,0.3)";
      ultrasHint.style.background = "rgba(255,184,0,0.08)";
    }
  }
}

function openListNftModal(nft) {
  activeModalNft = nft;
  const modal = document.getElementById("list-nft-modal");
  const titleEl = document.getElementById("list-modal-nft-title");
  const nameEl = document.getElementById("list-modal-name");
  const imgEl = document.getElementById("list-modal-img");
  const rankEl = document.getElementById("list-modal-rank");

  const tier = getNftRarityTier(nft);

  if (titleEl) titleEl.textContent = `List ${nft.name || nft.identifier}`;
  if (nameEl) nameEl.textContent = nft.name || nft.identifier;
  if (imgEl) imgEl.src = nft.url || "branding/original/EFOOTBALL-91a4eb/logo.png";
  if (rankEl) rankEl.textContent = `${tier.tierIcon} Rank #${tier.rank} (${tier.tierLabel})`;

  updateListingFeePreview();
  modal?.classList.remove("hidden");
}

async function executeCreateListing() {
  const isHu = currentMarketLang === "hu";
  if (!activeModalNft || !marketWallet.address) {
    showMarketToast(isHu ? "⚠️ Kérlek csatlakoztasd a tárcádat a hirdetéshez!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const priceInput = document.getElementById("list-input-price");
  const currSelect = document.getElementById("list-select-currency");
  const currency = currSelect?.value || "EFOO";

  const priceVal = parseFloat(priceInput.value);
  if (currency === "EGLD") {
    if (isNaN(priceVal) || priceVal < 0.001) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 0.001 EGLD árat!" : "⚠️ Please enter a price of at least 0.001 EGLD.");
      return;
    }
  } else {
    if (isNaN(priceVal) || priceVal < 1000) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 1,000 $EFOO árat!" : "⚠️ Please enter a price of at least 1,000 $EFOO.");
      return;
    }
  }

  const colStr = activeModalNft.collection || (activeModalNft.identifier ? activeModalNft.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);

  let nonceNum = activeModalNft.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (activeModalNft.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  const paymentTokenStr = currency === "EGLD" ? "EGLD" : EFOO_TOKEN_ID;
  const paymentTokenHex = stringToHex(paymentTokenStr);
  const priceAtomic = toAtomicUnits(priceVal, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  // MultiversX ESDTNFTTransfer format:
  // ESDTNFTTransfer@<CollectionHex>@<NonceHex>@01@<DestinationAddressHex>@<EndpointNameHex>@<Arg1Hex>@<Arg2Hex>
  const endpointHex = stringToHex("listNft"); // 6c6973744e6674
  const dataField = `ESDTNFTTransfer@${colHex}@${nonceHex}@01@${SC_HEX}@${endpointHex}@${paymentTokenHex}@${priceHex}`;

  showMarketToast(
    isHu
      ? `⏳ Tranzakció előkészítése: NFT letétbe helyezése a Smart Contractban (${priceVal.toLocaleString()} $${currency})...`
      : `⏳ Preparing transaction: Depositing NFT into Smart Contract escrow (${priceVal.toLocaleString()} $${currency})...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: marketWallet.address,
      value: "0",
      gasLimit: 15000000,
      data: dataField
    });

    const tier = getNftRarityTier(activeModalNft);
    const newListing = {
      id: `list-${activeModalNft.identifier || Date.now()}`,
      identifier: activeModalNft.identifier,
      collection: colStr,
      nonce: Number(nonceNum),
      name: activeModalNft.name || activeModalNft.identifier,
      rarity: tier.tierLabel,
      rank: tier.rank,
      ovr: activeModalNft.ovr || 90,
      trait: activeModalNft.trait || "Listed by Player in SC Escrow",
      url: activeModalNft.url || "branding/original/EFOOTBALL-91a4eb/logo.png",
      price: priceVal,
      currency,
      seller: marketWallet.address,
      createdAt: Date.now(),
      isOnChain: true
    };

    const listings = getMarketplaceListings().filter((x) => x.identifier !== activeModalNft.identifier);
    listings.unshift(newListing);
    saveMarketplaceListings(listings);

    // Remove from locally displayed owned locker NFTs (it is now held in the SC escrow)
    if (marketWallet.ownedNfts) {
      marketWallet.ownedNfts = marketWallet.ownedNfts.filter((x) => x.identifier !== activeModalNft.identifier);
    }

    document.getElementById("list-nft-modal")?.classList.add("hidden");
    priceInput.value = "";

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    showMarketToast(
      isHu
        ? `🏷️ Sikeres tranzakció! ${newListing.name} eladásra került a Smart Contractban ${priceVal.toLocaleString()} $${currency} áron!`
        : `🏷️ Transaction dispatched! ${newListing.name} is listed in Smart Contract for ${priceVal.toLocaleString()} $${currency}!`
    );
  } catch (err) {
    console.error("Listing transaction failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a listázási tranzakció során: ${err.message || "Megszakítva"}`
        : `❌ Listing transaction failed: ${err.message || "Cancelled"}`
    );
  }
}

function openEditPriceModal(item) {
  activeModalNft = item;
  const modal = document.getElementById("edit-price-modal");
  const titleEl = document.getElementById("edit-modal-nft-title");
  const inputEl = document.getElementById("edit-input-price");
  const badgeEl = document.getElementById("edit-currency-badge");

  if (titleEl) titleEl.textContent = `Edit Price: ${item.name}`;
  if (inputEl) {
    inputEl.value = item.price;
    if (item.currency === "EGLD") {
      inputEl.step = "any";
      inputEl.min = "0.001";
      inputEl.placeholder = "e.g. 0.025";
    } else {
      inputEl.step = "1000";
      inputEl.min = "1000";
      inputEl.placeholder = "e.g. 2,500,000";
    }
  }
  if (badgeEl) badgeEl.textContent = `$${item.currency || "EFOO"}`;

  modal?.classList.remove("hidden");
}

async function executeEditPrice() {
  if (!activeModalNft || !marketWallet.address) return;
  const isHu = currentMarketLang === "hu";
  const inputEl = document.getElementById("edit-input-price");
  const currency = activeModalNft.currency || "EFOO";
  const newPrice = parseFloat(inputEl.value);

  if (currency === "EGLD") {
    if (isNaN(newPrice) || newPrice < 0.001) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 0.001 EGLD árat!" : "⚠️ Please enter a price of at least 0.001 EGLD.");
      return;
    }
  } else {
    if (isNaN(newPrice) || newPrice < 1000) {
      showMarketToast(isHu ? "⚠️ Kérlek adj meg legalább 1,000 $EFOO árat!" : "⚠️ Please enter a price of at least 1,000 $EFOO.");
      return;
    }
  }

  const colStr = activeModalNft.collection || (activeModalNft.identifier ? activeModalNft.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);
  let nonceNum = activeModalNft.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (activeModalNft.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  const paymentTokenStr = currency === "EGLD" ? "EGLD" : EFOO_TOKEN_ID;
  const paymentTokenHex = stringToHex(paymentTokenStr);
  const priceAtomic = toAtomicUnits(newPrice, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  // updateListingPrice@<colHex>@<nonceHex>@<paymentTokenHex>@<priceHex>
  const endpointHex = stringToHex("updateListingPrice"); // 7570646174654c697374696e675072696365
  const dataField = `${endpointHex}@${colHex}@${nonceHex}@${paymentTokenHex}@${priceHex}`;

  showMarketToast(
    isHu
      ? `⏳ Ármódosítási tranzakció előkészítése a Smart Contractban...`
      : `⏳ Preparing price update transaction on Smart Contract...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 10000000,
      data: dataField
    });

    const listings = getMarketplaceListings();
    const target = listings.find((x) => x.id === activeModalNft.id || x.identifier === activeModalNft.identifier);
    if (target) {
      target.price = newPrice;
      saveMarketplaceListings(listings);
    }

    document.getElementById("edit-price-modal")?.classList.add("hidden");
    renderMarketplaceGrid();
    renderMyLockerGrid();

    showMarketToast(
      isHu
        ? `💾 Új ár sikeresen beállítva: ${newPrice.toLocaleString()} $${currency}!`
        : `💾 Price updated to ${newPrice.toLocaleString()} $${currency}!`
    );
  } catch (err) {
    console.error("Price update failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba az ármódosítás során: ${err.message || "Megszakítva"}`
        : `❌ Price update error: ${err.message || "Cancelled"}`
    );
  }
}

async function executeDelistNft(item) {
  if (!item || !marketWallet.address) return;
  const isHu = currentMarketLang === "hu";

  const colStr = item.collection || (item.identifier ? item.identifier.split("-").slice(0, 2).join("-") : STRIKER_COLLECTION);
  const colHex = stringToHex(colStr);
  let nonceNum = item.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (item.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  // delistNft@<colHex>@<nonceHex>
  const endpointHex = stringToHex("delistNft"); // 64656c6973744e6674
  const dataField = `${endpointHex}@${colHex}@${nonceHex}`;

  showMarketToast(
    isHu
      ? `⏳ Visszavonási tranzakció előkészítése: NFT visszakérése a Smart Contractból...`
      : `⏳ Preparing delist transaction: Returning NFT from Smart Contract...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 10000000,
      data: dataField
    });

    let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
    saveMarketplaceListings(listings);

    // Add back to locker room
    if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
    if (!marketWallet.ownedNfts.some((x) => x.identifier === item.identifier)) {
      marketWallet.ownedNfts.push(item);
    }

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    showMarketToast(
      isHu
        ? `❌ ${item.name} visszavonási tranzakció elküldve! A Smart Contract visszaküldi az NFT-t a tárcádba.`
        : `❌ Successfully delisted ${item.name}! Smart Contract is returning the NFT to your locker.`
    );
  } catch (err) {
    console.error("Delist failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a visszavonás során: ${err.message || "Megszakítva"}`
        : `❌ Delist error: ${err.message || "Cancelled"}`
    );
  }
}

// ============================================================================
// DETAILS & ATTRIBUTES POPUP MODAL
// ============================================================================
function openNftDetailsModal(nft) {
  activeModalNft = nft;
  const modal = document.getElementById("nft-details-modal");
  const imgEl = document.getElementById("detail-nft-img");
  const rankPill = document.getElementById("detail-rank-pill");
  const colIdEl = document.getElementById("detail-col-id");
  const nameEl = document.getElementById("detail-name");
  const traitEl = document.getElementById("detail-trait");
  const powersList = document.getElementById("detail-powers-list");
  const traitsTable = document.getElementById("detail-traits-table");
  const priceVal = document.getElementById("detail-price-val");
  const actionsWrap = document.getElementById("detail-action-buttons");
  const xoxnoLink = document.getElementById("detail-xoxno-link");

  const tier = getNftRarityTier(nft);

  if (imgEl) imgEl.src = nft.url || "branding/original/EFOOTBALL-91a4eb/logo.png";
  if (rankPill) {
    rankPill.textContent = `${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}`;
    rankPill.style.borderColor = tier.borderColor;
    rankPill.style.color = tier.borderColor;
  }
  if (colIdEl) colIdEl.textContent = nft.collection || STRIKER_COLLECTION;
  if (nameEl) nameEl.textContent = nft.name || nft.identifier;
  if (traitEl) traitEl.textContent = nft.trait || "Sunday League Degen Ultra";

  // Powers
  if (powersList) {
    powersList.innerHTML = tier.powers
      .map((p) => `<span class="m-power-badge">${p}</span>`)
      .join("");
  }

  // Attributes table
  if (traitsTable) {
    const rawAttrs = nft.attributes || [
      { name: "OVR", value: String(nft.ovr || 90) },
      { name: "Collection", value: nft.collection || STRIKER_COLLECTION },
      { name: "Rarity Rank", value: `#${tier.rank}` },
      { name: "Tier", value: tier.tierLabel }
    ];
    traitsTable.innerHTML = rawAttrs
      .map((a) => `
        <div class="m-trait-cell">
          <span class="mtc-lbl">${a.name || a.trait_type}</span>
          <strong class="mtc-val">${a.value}</strong>
        </div>
      `)
      .join("");
  }

  // Price & Actions
  const listings = getMarketplaceListings();
  const listedItem = listings.find((x) => x.id === nft.id || x.identifier === nft.identifier);

  if (listedItem) {
    if (priceVal) priceVal.textContent = `${listedItem.price.toLocaleString()} $${listedItem.currency || "EFOO"}`;
    const curAddr = marketWallet.address ? marketWallet.address.toLowerCase() : "";
    const isOwner = curAddr && listedItem.seller && listedItem.seller.toLowerCase() === curAddr;

    if (actionsWrap) {
      actionsWrap.innerHTML = isOwner
        ? `<button type="button" class="mnc-btn-edit" id="detail-btn-edit">✏️ Edit Price</button>
           <button type="button" class="mnc-btn-delist" id="detail-btn-delist">✕ Delist</button>`
        : `<button type="button" class="m-btn-primary" id="detail-btn-buy">⚡ Buy NFT</button>`;

      document.getElementById("detail-btn-buy")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        executeBuyNft(listedItem);
      });
      document.getElementById("detail-btn-edit")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        openEditPriceModal(listedItem);
      });
      document.getElementById("detail-btn-delist")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        executeDelistNft(listedItem);
      });
    }
  } else {
    if (priceVal) priceVal.textContent = "Not Listed";
    if (actionsWrap) {
      actionsWrap.innerHTML = `<button type="button" class="m-btn-primary" id="detail-btn-sell">🏷️ List for Sale</button>`;
      document.getElementById("detail-btn-sell")?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        openListNftModal(nft);
      });
    }
  }

  if (xoxnoLink) {
    xoxnoLink.href = `https://xoxno.com/collection/${nft.collection || STRIKER_COLLECTION}`;
  }

  modal?.classList.remove("hidden");
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================
function showMarketToast(msg) {
  const t = document.getElementById("m-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.add("hidden");
  }, 4000);
}

// ============================================================================
// ULTRAS PASS, MINTER, DEX SWAP & LIQUIDITY POOLS LOGIC
// ============================================================================

function updateUltrasPassUI() {
  const isHu = currentMarketLang === "hu";
  const ownedIndicator = document.getElementById("ultras-owned-indicator");
  const buyBtn = document.getElementById("btn-buy-ultras-pass");
  const isOwned = hasUltrasPass(marketWallet.address);

  if (ownedIndicator) {
    if (isOwned) {
      ownedIndicator.classList.remove("hidden");
    } else {
      ownedIndicator.classList.add("hidden");
    }
  }

  if (buyBtn) {
    if (isOwned) {
      buyBtn.textContent = isHu ? "👑 PASS AKTÍV (0% KERESKEDÉSI DÍJ)" : "👑 PASS ACTIVE (0% TRADING FEES)";
      buyBtn.style.background = "#22c55e";
      buyBtn.style.color = "#09090b";
      buyBtn.style.borderColor = "#22c55e";
    } else {
      buyBtn.textContent = isHu ? "⚡ ULTRAS PASS VÁSÁRLÁSA" : "⚡ BUY ULTRAS PASS";
      buyBtn.style.background = "#ffb800";
      buyBtn.style.color = "#09090b";
      buyBtn.style.borderColor = "#ffb800";
    }
  }
}

function updateUltrasQtyUI(qty) {
  const safeQty = Math.max(1, Math.min(10, Number(qty) || 1));
  const qtyInput = document.getElementById("ultras-qty-input");
  const qtyLabel = document.getElementById("ultras-qty-label");
  const qtySlider = document.getElementById("ultras-qty-slider");
  const priceDisplay = document.getElementById("ultras-price-display");
  const priceSub = document.getElementById("ultras-price-sub");

  if (qtyInput) qtyInput.value = safeQty;
  if (qtySlider) qtySlider.value = safeQty;
  if (qtyLabel) qtyLabel.textContent = safeQty === 1 ? "1 PASS" : `${safeQty} PASSES`;

  const totalEgld = (safeQty * 0.5).toFixed(1);
  const totalEfoo = (safeQty * 5000000).toLocaleString("en-US");

  if (priceDisplay) priceDisplay.textContent = `${totalEgld} EGLD`;
  if (priceSub) priceSub.textContent = `(or ${totalEfoo} $EFOO)`;
}

async function buyUltrasPassOnChain() {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(isHu ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a vásárláshoz!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const qty = Math.max(1, Math.min(10, Number(document.getElementById("ultras-qty-input")?.value || 1)));
  const totalEgld = (qty * 0.5).toFixed(2);
  const totalWei = (BigInt(Math.round(qty * 0.5 * 1e9)) * BigInt(1e9)).toString();
  const qtyHex = qty.toString(16).padStart(2, "0");
  const data = `buyUltrasPass@${qtyHex}`;

  showMarketToast(
    isHu
      ? `⏳ Ultras PASS vásárlási tranzakció előkészítése (${qty}x = ${totalEgld} EGLD)...`
      : `⏳ Preparing Ultras PASS transaction (${qty}x = ${totalEgld} EGLD)...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: EFOOREWARDS_WALLET,
      value: totalWei,
      gasLimit: 12000000,
      data: data
    });

    localStorage.setItem(STORAGE_ULTRAS_PASS_PREFIX + marketWallet.address.toLowerCase(), "true");
    updateUltrasPassUI();
    updateListingFeePreview();

    showMarketToast(
      isHu
        ? `🎉 Gratulálunk! EFOO Ultras PASS sikeresen megvásárolva! Örökös 0% kereskedési díj eladáskor és vételkor azonnal aktív!`
        : `🎉 Congratulations! EFOO Ultras PASS activated! Lifetime 0% trading fee on buy and sell enabled!`
    );
  } catch (err) {
    console.error("Ultras Pass purchase failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a vásárlás során: ${err.message || "Megszakítva"}`
        : `❌ Ultras Pass error: ${err.message || "Cancelled"}`
    );
  }
}

async function executeMarketMintPlayer() {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(isHu ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const brandHex = stringToHex("1stGenPlayers");
  const data = `buy@${brandHex}@${brandHex}@01`;

  showMarketToast(
    isHu
      ? `⏳ Játékos veretési tranzakció előkészítése (0.08 EGLD)...`
      : `⏳ Preparing Outfield Player mint transaction (0.08 EGLD)...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: CONTRACTS.NFT_MINTER,
      value: "80000000000000000", // 0.08 EGLD
      gasLimit: 42000000,
      data
    });

    showMarketToast(
      isHu
        ? `⚽ Játékos veretési tranzakció sikeresen elküldve! Az új NFT hamarosan a tárcádban lesz!`
        : `⚽ Outfield Player mint transaction dispatched! NFT is on its way to your locker!`
    );
    setTimeout(() => { if (marketWallet.address) fetchMarketWalletNfts(marketWallet.address); }, 3000);
  } catch (err) {
    console.error("Mint player failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a veretés során: ${err.message || "Megszakítva"}`
        : `❌ Mint error: ${err.message || "Cancelled"}`
    );
  }
}

async function executeMarketMintKeeper() {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(isHu ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const brandHex = stringToHex("GoalKeepers");
  const data = `buy@${brandHex}@${brandHex}@01`;

  showMarketToast(
    isHu
      ? `⏳ Kapus veretési tranzakció előkészítése (0.35 EGLD)...`
      : `⏳ Preparing Goalkeeper Titan mint transaction (0.35 EGLD)...`
  );

  try {
    await sendMultiversxTransaction({
      receiver: CONTRACTS.NFT_MINTER,
      value: "350000000000000000", // 0.35 EGLD
      gasLimit: 42000000,
      data
    });

    showMarketToast(
      isHu
        ? `🧤 Kapus veretési tranzakció elküldve! A legendás hálóőr hamarosan a tárcádban!`
        : `🧤 Goalkeeper Titan mint dispatched! Your legendary keeper is incoming!`
    );
    setTimeout(() => { if (marketWallet.address) fetchMarketWalletNfts(marketWallet.address); }, 3000);
  } catch (err) {
    console.error("Mint keeper failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a kapus veretés során: ${err.message || "Megszakítva"}`
        : `❌ Mint keeper error: ${err.message || "Cancelled"}`
    );
  }
}

const TOKEN_LOGOS = {
  EGLD: {
    name: "EGLD",
    icon: "branding/icons/egld-logo.svg",
    isRound: false
  },
  WEGLD: {
    name: "WEGLD",
    icon: "branding/icons/wegld-logo.svg",
    isRound: false
  },
  USDC: {
    name: "USDC",
    icon: "branding/icons/usdc-logo.svg",
    isRound: false
  },
  EFOO: {
    name: "$EFOO",
    icon: "branding/icons/efoo-logo.png",
    isRound: true
  }
};

function setMarketSwapToken(tokenVal) {
  const hiddenInput = document.getElementById("m-swap-token-select");
  if (hiddenInput) hiddenInput.value = tokenVal;

  const triggerIcon = document.getElementById("m-selected-token-icon");
  const triggerName = document.getElementById("m-selected-token-name");
  const menuList = document.getElementById("m-token-menu-list");
  const dropdownWrap = document.getElementById("m-swap-token-dropdown");

  if (TOKEN_LOGOS[tokenVal]) {
    if (triggerIcon) {
      triggerIcon.src = TOKEN_LOGOS[tokenVal].icon;
      triggerIcon.classList.toggle("round", !!TOKEN_LOGOS[tokenVal].isRound);
    }
    if (triggerName) triggerName.textContent = TOKEN_LOGOS[tokenVal].name;
  }

  // Update active state in menu items
  document.querySelectorAll(".token-dropdown-item").forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-token-val") === tokenVal);
  });

  // Close dropdown
  menuList?.classList.add("hidden");
  dropdownWrap?.classList.remove("open");

  updateMarketSwapEstimate();
}

function updateMarketSwapEstimate() {
  const amtInput = document.getElementById("m-swap-input-amt");
  const tokSelect = document.getElementById("m-swap-token-select");
  const outField = document.getElementById("m-swap-output-amt");
  const balHint = document.getElementById("m-swap-pay-bal");
  const rateLbl = document.getElementById("m-swap-rate-lbl");
  const routeTag = document.getElementById("m-swap-route-tag");
  const recvIcon = document.getElementById("m-swap-recv-icon");
  const recvTicker = document.getElementById("m-swap-recv-ticker");
  const actionBtn = document.getElementById("m-btn-exec-swap");
  const isHu = currentMarketLang === "hu";

  const amt = Math.max(0, parseFloat(amtInput?.value) || 0);
  const tok = tokSelect?.value || "EGLD";

  if (tok === "EFOO") {
    // Selling EFOO for EGLD
    const amtInWithFee = amt * 0.99;
    const estEgld = amt > 0 ? (marketDexState.onedexWegldReserve * amtInWithFee) / (marketDexState.onedexEfooReserve + amtInWithFee) : 0;
    if (outField) outField.value = `~${estEgld.toFixed(4)}`;
    if (recvIcon) {
      recvIcon.src = "branding/icons/egld-logo.svg";
      recvIcon.classList.remove("round");
    }
    if (recvTicker) recvTicker.textContent = "EGLD";
    if (rateLbl) rateLbl.textContent = `${marketDexState.efooPerWegld.toLocaleString("en-US")} $EFOO ≈ 1 EGLD`;
    if (routeTag) routeTag.textContent = "Route: OneDex AMM";
    if (balHint) balHint.textContent = `Balance: ${Math.floor(marketWallet.efooBalance || 0).toLocaleString()} $EFOO`;
    if (actionBtn) actionBtn.textContent = isHu ? `⚡ ${amt.toLocaleString()} $EFOO Eladása ➔ EGLD` : `⚡ Sell ${amt.toLocaleString()} $EFOO ➔ EGLD`;
  } else {
    // Buying EFOO
    let estOut = 0;
    if (tok === "USDC") {
      const amtInWithFee = amt * 0.997;
      estOut = amt > 0 ? Math.floor((marketDexState.xexEfooReserve * amtInWithFee) / (marketDexState.xexUsdcReserve + amtInWithFee)) : 0;
      if (rateLbl) rateLbl.textContent = `1 USDC ≈ ${marketDexState.efooPerUsdc.toLocaleString("en-US")} $EFOO`;
      if (routeTag) routeTag.textContent = "Route: xExchange (185.6M Pool)";
      if (balHint) balHint.textContent = "Balance: Active";
    } else {
      const amtInWithFee = amt * 0.99;
      estOut = amt > 0 ? Math.floor((marketDexState.onedexEfooReserve * amtInWithFee) / (marketDexState.onedexWegldReserve + amtInWithFee)) : 0;
      if (rateLbl) rateLbl.textContent = `1 EGLD ≈ ${marketDexState.efooPerWegld.toLocaleString("en-US")} $EFOO`;
      if (routeTag) routeTag.textContent = "Route: OneDex (62.1M Pool)";
      if (balHint) balHint.textContent = `Balance: ${(marketWallet.egldBalance || 0).toFixed(3)} EGLD`;
    }
    if (outField) outField.value = `~${estOut.toLocaleString("en-US")}`;
    if (recvIcon) {
      recvIcon.src = "branding/icons/efoo-logo.png";
      recvIcon.classList.add("round");
    }
    if (recvTicker) recvTicker.textContent = "$EFOO";
    if (actionBtn) actionBtn.textContent = isHu ? `⚡ ${amt} ${tok} Átváltása ➔ $EFOO` : `⚡ Swap ${amt} ${tok} ➔ $EFOO On-Chain`;
  }
}

async function executeMarketSwap() {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(isHu ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a swathoz!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const amt = Math.max(0.0001, parseFloat(document.getElementById("m-swap-input-amt")?.value) || 0.035);
  const tok = document.getElementById("m-swap-token-select")?.value || "EGLD";

  showMarketToast(isHu ? `⏳ DEX Swap előkészítése: ${amt} ${tok}...` : `⏳ Preparing DEX Swap: ${amt} ${tok}...`);

  try {
    if (tok === "EFOO") {
      // Selling EFOO -> EGLD
      const efooHex = stringToHex("EFOO-8fe2d4");
      const wegldHex = stringToHex("WEGLD-bd4d79");
      const amtHex = toAtomicUnits(amt, 18).toString(16).padStart(2, "0");
      const funcHex = stringToHex("swapMultiTokensFixedInput");
      const data = `ESDTTransfer@${efooHex}@${amtHex}@${funcHex}@01@01@${efooHex}@${wegldHex}`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data
      });
    } else if (tok === "EGLD") {
      // Direct buy with native EGLD
      const weiStr = (BigInt(Math.round(amt * 1e9)) * BigInt(1e9)).toString();
      const shardWrapper = CONTRACTS.WEGLD_WRAPPERS[0];
      const tokenHex = stringToHex("WEGLD-bd4d79");
      const amtHex = toAtomicUnits(amt, 18).toString(16).padStart(2, "0");
      const funcHex = stringToHex("swapMultiTokensFixedInput");
      const efooHex = stringToHex("EFOO-8fe2d4");
      const swapData = `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`;

      await sendMultiversxTransaction({
        receiver: shardWrapper,
        value: weiStr,
        gasLimit: 8000000,
        data: "wrapEgld"
      });
      await sendMultiversxTransaction({
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data: swapData
      });
    } else if (tok === "WEGLD") {
      const tokenHex = stringToHex("WEGLD-bd4d79");
      const amtHex = toAtomicUnits(amt, 18).toString(16).padStart(2, "0");
      const funcHex = stringToHex("swapMultiTokensFixedInput");
      const efooHex = stringToHex("EFOO-8fe2d4");
      const data = `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data
      });
    } else {
      // USDC
      const usdcHex = stringToHex("USDC-c76f1f");
      const amtHex = toAtomicUnits(amt, 6).toString(16).padStart(2, "0");
      const funcHex = stringToHex("swapTokensFixedInput");
      const efooHex = stringToHex("EFOO-8fe2d4");
      const data = `ESDTTransfer@${usdcHex}@${amtHex}@${funcHex}@${efooHex}@01`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.XEXCHANGE_PAIR,
        value: "0",
        gasLimit: 60000000,
        data
      });
    }

    showMarketToast(
      isHu
        ? `🎉 Swap tranzakció sikeresen elküldve a blokkláncra!`
        : `🎉 Swap transaction dispatched on-chain!`
    );
  } catch (err) {
    console.error("Swap execution failed:", err);
    showMarketToast(
      isHu
        ? `❌ Hiba a swap során: ${err.message || "Megszakítva"}`
        : `❌ Swap error: ${err.message || "Cancelled"}`
    );
  }
}

function updateLpCalculator() {
  const depositInput = document.getElementById("lp-calc-deposit");
  const dailyEl = document.getElementById("lp-daily-est");
  const monthlyEl = document.getElementById("lp-monthly-est");
  const annualEl = document.getElementById("lp-annual-est");

  const deposit = Math.max(0, parseFloat(depositInput?.value) || 0);
  const apy = 0.485; // ~48.5% APY
  const annual = deposit * apy;
  const monthly = annual / 12;
  const daily = annual / 365;

  if (dailyEl) dailyEl.textContent = `$${daily.toFixed(2)}`;
  if (monthlyEl) monthlyEl.textContent = `$${monthly.toFixed(2)}`;
  if (annualEl) annualEl.textContent = `$${annual.toFixed(2)}`;
}

async function fetchLiveMinterCounts() {
  try {
    const [pRes, kRes] = await Promise.all([
      fetch("https://api.multiversx.com/collections/EFOOTBALL-91a4eb"),
      fetch("https://api.multiversx.com/collections/GOALKEEPER-cb9e3e")
    ]);
    if (pRes.ok) {
      const pData = await pRes.json();
      const count = pData.nftCount || 628;
      const el = document.getElementById("m-minted-players-stat");
      if (el) el.textContent = `${count} Minted (Supply Ongoing)`;
    }
    if (kRes.ok) {
      const kData = await kRes.json();
      const count = kData.nftCount || 51;
      const el = document.getElementById("m-minted-keepers-stat");
      if (el) el.textContent = `${count} Minted (Supply Ongoing)`;
    }
  } catch (e) {
    console.warn("Failed fetching minter counts:", e);
  }
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initMarketWallet();
  updateExtensionBadge();
  setTimeout(updateExtensionBadge, 500);
  refreshOnChainVaultStats();
  renderMarketplaceGrid();
  renderSkillsStore();
  fetchLiveXoxnoListings();
  fetchLiveMinterCounts();

  // 7 Tabs: Browse, My Locker & Sell, Recruit & Mint, DEX Swap, Pools, Skills, Ultras PASS
  const tabBrowse = document.getElementById("tab-btn-browse");
  const tabMyNfts = document.getElementById("tab-btn-my-nfts");
  const tabMint = document.getElementById("tab-btn-mint");
  const tabSwap = document.getElementById("tab-btn-swap");
  const tabPools = document.getElementById("tab-btn-pools");
  const tabSkills = document.getElementById("tab-btn-skills-store");
  const tabUltras = document.getElementById("tab-btn-ultras");

  const panelBrowse = document.getElementById("panel-browse");
  const panelMyNfts = document.getElementById("panel-my-nfts");
  const panelMint = document.getElementById("panel-mint");
  const panelSwap = document.getElementById("panel-swap");
  const panelPools = document.getElementById("panel-pools");
  const panelSkills = document.getElementById("panel-skills-store");
  const panelUltras = document.getElementById("panel-ultras");

  const switchTab = (tab) => {
    currentTab = tab;
    tabBrowse?.classList.toggle("active", tab === "browse");
    tabMyNfts?.classList.toggle("active", tab === "my_nfts");
    tabMint?.classList.toggle("active", tab === "mint");
    tabSwap?.classList.toggle("active", tab === "swap");
    tabPools?.classList.toggle("active", tab === "pools");
    tabSkills?.classList.toggle("active", tab === "skills");
    tabUltras?.classList.toggle("active", tab === "ultras");

    panelBrowse?.classList.toggle("hidden", tab !== "browse");
    panelMyNfts?.classList.toggle("hidden", tab !== "my_nfts");
    panelMint?.classList.toggle("hidden", tab !== "mint");
    panelSwap?.classList.toggle("hidden", tab !== "swap");
    panelPools?.classList.toggle("hidden", tab !== "pools");
    panelSkills?.classList.toggle("hidden", tab !== "skills");
    panelUltras?.classList.toggle("hidden", tab !== "ultras");

    try {
      const url = new URL(window.location);
      url.searchParams.set("tab", tab);
      history.replaceState(null, "", url.toString());
    } catch (e) {}

    if (tab === "browse") renderMarketplaceGrid();
    if (tab === "my_nfts") renderMyLockerGrid();
    if (tab === "skills") renderSkillsStore();
    if (tab === "ultras") updateUltrasPassUI();
    if (tab === "swap") updateMarketSwapEstimate();
    if (tab === "pools") updateLpCalculator();
  };
  window.switchMarketTab = switchTab;

  tabBrowse?.addEventListener("click", () => switchTab("browse"));
  tabMyNfts?.addEventListener("click", () => switchTab("my_nfts"));
  tabMint?.addEventListener("click", () => switchTab("mint"));
  tabSwap?.addEventListener("click", () => switchTab("swap"));
  tabPools?.addEventListener("click", () => switchTab("pools"));
  tabSkills?.addEventListener("click", () => switchTab("skills"));
  tabUltras?.addEventListener("click", () => switchTab("ultras"));

  // Check URL query parameters and hash (e.g. market.html?tab=swap or market.html#ultras)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab") || (window.location.hash ? window.location.hash.replace("#", "") : "");
    if (["browse", "my_nfts", "mint", "swap", "pools", "skills", "ultras"].includes(tabParam)) {
      switchTab(tabParam);
    } else if (tabParam === "skills-store" || tabParam === "skill") {
      switchTab("skills");
    } else if (tabParam === "locker") {
      switchTab("my_nfts");
    }
  } catch (e) {}

  window.addEventListener("hashchange", () => {
    const h = window.location.hash.replace("#", "");
    if (["browse", "my_nfts", "mint", "swap", "pools", "skills", "ultras"].includes(h)) switchTab(h);
    else if (h === "skills-store" || h === "skill") switchTab("skills");
    else if (h === "locker") switchTab("my_nfts");
  });

  // Ultras PASS Stepper & Slider
  document.getElementById("ultras-minus-btn")?.addEventListener("click", () => {
    const cur = Number(document.getElementById("ultras-qty-input")?.value || 1);
    updateUltrasQtyUI(cur - 1);
  });
  document.getElementById("ultras-plus-btn")?.addEventListener("click", () => {
    const cur = Number(document.getElementById("ultras-qty-input")?.value || 1);
    updateUltrasQtyUI(cur + 1);
  });
  document.getElementById("ultras-qty-slider")?.addEventListener("input", (e) => {
    updateUltrasQtyUI(e.target.value);
  });
  document.getElementById("btn-buy-ultras-pass")?.addEventListener("click", buyUltrasPassOnChain);

  // Mint Handlers
  document.getElementById("m-btn-mint-player")?.addEventListener("click", executeMarketMintPlayer);
  document.getElementById("m-btn-mint-keeper")?.addEventListener("click", executeMarketMintKeeper);
  document.getElementById("m-btn-mint-ultras")?.addEventListener("click", buyUltrasPassOnChain);

  // DEX Swap Handlers
  document.getElementById("m-swap-input-amt")?.addEventListener("input", updateMarketSwapEstimate);

  const tokenTriggerBtn = document.getElementById("m-token-trigger-btn");
  const tokenMenuList = document.getElementById("m-token-menu-list");
  const tokenDropdownWrap = document.getElementById("m-swap-token-dropdown");

  tokenTriggerBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = tokenMenuList?.classList.contains("hidden");
    tokenMenuList?.classList.toggle("hidden", !isHidden);
    tokenDropdownWrap?.classList.toggle("open", isHidden);
  });

  document.querySelectorAll(".token-dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = item.getAttribute("data-token-val");
      if (val) setMarketSwapToken(val);
    });
  });

  document.addEventListener("click", (e) => {
    if (!tokenDropdownWrap?.contains(e.target)) {
      tokenMenuList?.classList.add("hidden");
      tokenDropdownWrap?.classList.remove("open");
    }
  });

  document.getElementById("m-swap-flip-btn")?.addEventListener("click", () => {
    const currentVal = document.getElementById("m-swap-token-select")?.value || "EGLD";
    const nextVal = currentVal === "EFOO" ? "EGLD" : "EFOO";
    setMarketSwapToken(nextVal);
  });

  document.getElementById("m-btn-exec-swap")?.addEventListener("click", executeMarketSwap);

  // Liquidity Pool Calculator
  document.getElementById("lp-calc-deposit")?.addEventListener("input", updateLpCalculator);

  // Filters
  document.querySelectorAll("[data-filter-col]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("[data-filter-col]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterCollection = btn.getAttribute("data-filter-col") || "all";
      renderMarketplaceGrid();
    });
  });

  document.getElementById("select-rarity-filter")?.addEventListener("change", (e) => {
    filterRarity = e.target.value;
    renderMarketplaceGrid();
  });

  document.getElementById("select-sort-order")?.addEventListener("change", (e) => {
    sortOrder = e.target.value;
    renderMarketplaceGrid();
  });

  // Languages
  document.querySelectorAll("[data-market-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-market-lang]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMarketLang = btn.getAttribute("data-market-lang") || "en";

      // Update static translations
      const dict = MARKET_I18N[currentMarketLang] || MARKET_I18N.en;
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const k = el.getAttribute("data-i18n");
        if (dict[k]) el.innerHTML = dict[k];
      });

      renderMarketplaceGrid();
      renderMyLockerGrid();
      renderSkillsStore();
      updateUltrasPassUI();
      updateMarketSwapEstimate();
    });
  });

  // Wallet Modal
  const walletModal = document.getElementById("m-wallet-modal");
  document.getElementById("m-btn-connect")?.addEventListener("click", () => {
    updateExtensionBadge();
    walletModal?.classList.remove("hidden");
  });
  document.getElementById("btn-locker-connect")?.addEventListener("click", () => {
    updateExtensionBadge();
    walletModal?.classList.remove("hidden");
  });
  document.getElementById("close-m-wallet-btn")?.addEventListener("click", () => {
    walletModal?.classList.add("hidden");
  });
  document.getElementById("m-btn-disconnect")?.addEventListener("click", disconnectWallet);

  // Manual Address Explorer
  document.getElementById("m-btn-load-manual-erd")?.addEventListener("click", () => {
    const input = document.getElementById("m-manual-erd-input");
    connectManualAddress(input?.value);
  });
  document.getElementById("m-manual-erd-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      connectManualAddress(e.target.value);
    }
  });

  // Providers: xPortal Mobile App (WalletConnect v2)
  document.getElementById("m-login-xportal")?.addEventListener("click", () => {
    initMarketXPortalWalletConnect();
  });

  document.getElementById("m-copy-wc-uri-btn")?.addEventListener("click", () => {
    if (currentMarketWcUri) {
      navigator.clipboard.writeText(currentMarketWcUri);
      const btn = document.getElementById("m-copy-wc-uri-btn");
      if (btn) {
        btn.textContent = "✅ Copied!";
        setTimeout(() => { btn.textContent = "📋 Copy wc: URI"; }, 2000);
      }
    }
  });

  // MultiversX DeFi Wallet Extension (In-page erdw bridge)
  document.getElementById("m-login-extension")?.addEventListener("click", () => {
    connectMarketDefiExtension();
  });

  // MultiversX Web Wallet (wallet.multiversx.com)
  document.getElementById("m-login-webwallet")?.addEventListener("click", () => {
    const callbackUrl = window.location.origin + window.location.pathname.replace(/\.html$/, "");
    window.location.href = `https://wallet.multiversx.com/hook/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  });

  // Close Modals
  document.getElementById("close-details-modal-btn")?.addEventListener("click", () => {
    document.getElementById("nft-details-modal")?.classList.add("hidden");
  });
  document.getElementById("close-list-modal-btn")?.addEventListener("click", () => {
    document.getElementById("list-nft-modal")?.classList.add("hidden");
  });
  document.getElementById("close-edit-modal-btn")?.addEventListener("click", () => {
    document.getElementById("edit-price-modal")?.classList.add("hidden");
  });

  // Modal Backdrop Click Closes
  [
    document.getElementById("nft-details-modal"),
    document.getElementById("list-nft-modal"),
    document.getElementById("edit-price-modal"),
    walletModal
  ].forEach((m) => {
    m?.addEventListener("click", (e) => {
      if (e.target === m) m.classList.add("hidden");
    });
  });

  // Confirm Listing & Edit Price
  document.getElementById("btn-confirm-listing")?.addEventListener("click", executeCreateListing);
  document.getElementById("btn-confirm-edit-price")?.addEventListener("click", executeEditPrice);

  // Listing modal dynamic currency & price fee preview
  document.getElementById("list-select-currency")?.addEventListener("change", updateListingFeePreview);
  document.getElementById("list-input-price")?.addEventListener("input", updateListingFeePreview);
});
