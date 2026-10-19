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

function bigIntToHex(bigIntVal) {
  let hex = BigInt(bigIntVal).toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex;
  return hex || "00";
}

function toBase64Data(str) {
  if (!str) return "";
  try {
    return btoa(str);
  } catch (e) {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

// ============================================================================
// BECH32 & ON-CHAIN SC LISTING STRUCT DECODERS
// ============================================================================
const BECH32_ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

function bech32Polymod(values) {
  const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (let p = 0; p < values.length; ++p) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ values[p];
    for (let i = 0; i < 5; ++i) {
      if ((top >> i) & 1) chk ^= GENERATOR[i];
    }
  }
  return chk;
}

function bech32HrpExpand(hrp) {
  const ret = [];
  for (let p = 0; p < hrp.length; ++p) ret.push(hrp.charCodeAt(p) >> 5);
  ret.push(0);
  for (let p = 0; p < hrp.length; ++p) ret.push(hrp.charCodeAt(p) & 31);
  return ret;
}

function hexToBech32Address(hex, hrp = "erd") {
  if (!hex || hex.length !== 64) return "";
  try {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16));
    let bits = 0, value = 0, data = [];
    for (let b of bytes) {
      value = (value << 8) | b;
      bits += 8;
      while (bits >= 5) {
        bits -= 5;
        data.push((value >> bits) & 31);
      }
    }
    if (bits > 0) data.push((value << (5 - bits)) & 31);
    const values = bech32HrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
    const mod = bech32Polymod(values) ^ 1;
    const checksum = [];
    for (let p = 0; p < 6; ++p) checksum.push((mod >> (5 * (5 - p))) & 31);
    return hrp + "1" + data.concat(checksum).map((d) => BECH32_ALPHABET[d]).join("");
  } catch (e) {
    return "";
  }
}

function bech32ToHex(bech32Addr) {
  if (!bech32Addr || typeof bech32Addr !== "string") return "";
  const parts = bech32Addr.trim().split("1");
  if (parts.length < 2) return "";
  const dataPart = parts[1].slice(0, -6);
  const data = [];
  for (let c of dataPart) {
    const idx = BECH32_ALPHABET.indexOf(c);
    if (idx === -1) return "";
    data.push(idx);
  }
  let acc = 0;
  let bits = 0;
  const bytes = [];
  for (let val of data) {
    acc = (acc << 5) | val;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      bytes.push((acc >> bits) & 0xff);
    }
  }
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function decodeBase64ToUint8(b64) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

function parseScListingStruct(b64) {
  try {
    const u8 = decodeBase64ToUint8(b64);
    const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    let offset = 0;

    let sellerHex = "";
    for (let i = 0; i < 32; i++) sellerHex += u8[offset + i].toString(16).padStart(2, "0");
    offset += 32;

    const tokenIdLen = view.getUint32(offset, false);
    offset += 4;
    let tokenId = "";
    for (let i = 0; i < tokenIdLen; i++) tokenId += String.fromCharCode(u8[offset + i]);
    offset += tokenIdLen;

    const nonceHigh = view.getUint32(offset, false);
    const nonceLow = view.getUint32(offset + 4, false);
    const nonce = (BigInt(nonceHigh) << 32n) | BigInt(nonceLow);
    offset += 8;

    const payLen = view.getUint32(offset, false);
    offset += 4;
    let paymentToken = "";
    for (let i = 0; i < payLen; i++) paymentToken += String.fromCharCode(u8[offset + i]);
    offset += payLen;

    const priceLen = view.getUint32(offset, false);
    offset += 4;
    let priceHex = "";
    for (let i = 0; i < priceLen; i++) priceHex += u8[offset + i].toString(16).padStart(2, "0");
    const priceBig = BigInt("0x" + (priceHex || "0"));

    const nonceNum = Number(nonce);
    const nonceHex = nonceNum.toString(16).padStart(nonceNum < 256 ? 2 : 4, "0");
    const identifier = `${tokenId}-${nonceHex}`;

    return {
      sellerHex,
      tokenId,
      nonce: nonceNum,
      identifier,
      paymentToken: paymentToken || "EGLD",
      priceBig,
      price: Number(priceBig) / 1e18
    };
  } catch (e) {
    return null;
  }
}

// ============================================================================
// OFFICIAL CRYPTO LOGO BADGE GENERATOR FOR NFT PRICES
// ============================================================================
function getCurrencyBadgeHtml(currency) {
  const rawCur = String(currency || "EFOO").trim().replace(/^\$/, "");
  const cur = rawCur.toUpperCase();

  let iconSrc = "branding/icons/efoo-logo.png";
  let ticker = "$EFOO";
  let isRound = true;

  if (cur === "EGLD" || cur === "WEGLD") {
    iconSrc = "branding/icons/egld-logo.svg";
    ticker = "EGLD";
    isRound = false;
  } else if (cur === "USDC") {
    iconSrc = "branding/icons/usdc-logo.svg";
    ticker = "USDC";
    isRound = false;
  } else if (typeof SWAP_TOKENS !== "undefined" && SWAP_TOKENS[cur]) {
    iconSrc = SWAP_TOKENS[cur].icon;
    ticker = SWAP_TOKENS[cur].symbol || cur;
    isRound = !!SWAP_TOKENS[cur].isRound;
  }

  return `<span class="m-price-curr-pill" title="${ticker}">
    <img src="${iconSrc}" alt="${ticker}" class="m-price-curr-logo ${isRound ? 'round' : ''}" />
    <span class="m-price-curr-ticker">${ticker}</span>
  </span>`;
}

let currentMarketWcUri = "";

function getMarketDefiExtension() {
  if (typeof window === "undefined") return null;
  return window.multiversxWallet || window.elrondWallet || window.multiversx || window.elrond || null;
}

function extractAddressFromExtensionResponse(res) {
  if (!res) return "";
  if (typeof res === "string" && res.startsWith("erd1")) return res;
  if (res.address && typeof res.address === "string" && res.address.startsWith("erd1")) return res.address;
  if (res.account?.address && typeof res.account.address === "string" && res.account.address.startsWith("erd1")) return res.account.address;
  if (res.data) {
    if (typeof res.data === "string" && res.data.startsWith("erd1")) return res.data;
    if (res.data.address && typeof res.data.address === "string" && res.data.address.startsWith("erd1")) return res.data.address;
    if (res.data.account?.address && typeof res.data.account.address === "string" && res.data.account.address.startsWith("erd1")) return res.data.account.address;
  }
  return "";
}

function updateExtensionBadge() {
  const badge = document.getElementById("m-ext-detect-badge");
  if (!badge) return;
  const isDetected = !!getMarketDefiExtension();
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
  let ext = getMarketDefiExtension();
  if (!ext) {
    await new Promise((r) => setTimeout(r, 200));
    ext = getMarketDefiExtension();
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
    let addr = extractAddressFromExtensionResponse(ext);
    if (!addr && typeof ext.login === "function") {
      try {
        const res = await ext.login();
        addr = extractAddressFromExtensionResponse(res);
      } catch (e) {
        console.warn("Direct ext.login failed, trying postMessage bridge:", e);
      }
    }
    if (!addr) {
      const res = await sendMarketExtensionMessage("connect", "");
      addr = extractAddressFromExtensionResponse(res);
    }

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
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", handleMessage);
      reject(new Error("Extension response timed out"));
    }, 60000);

    function handleMessage(event) {
      if (settled) return;
      if (!event.data || event.data.target !== "erdw-contentScript") return;
      const msg = event.data;

      // Handle user cancellation / error across ALL operations (connect, signTransactions, etc.)
      if (
        msg.type === "cancelResponse" ||
        msg.type === "cancelActionResponse" ||
        msg.type === "errorResponse" ||
        msg.error ||
        (msg.data && msg.data.error)
      ) {
        settled = true;
        clearTimeout(timer);
        window.removeEventListener("message", handleMessage);
        const err = msg.error || (msg.data && msg.data.error) || "User cancelled";
        const errMsg = typeof err === "string" ? err : (err.message || JSON.stringify(err));
        reject(new Error(errMsg));
        return;
      }

      // If we are waiting for connect/login:
      if (type === "connect" || type === "login") {
        settled = true;
        clearTimeout(timer);
        window.removeEventListener("message", handleMessage);
        resolve(msg.data !== undefined ? msg.data : msg);
        return;
      }

      // Non-connect operations (signTransactions, signMessage, etc.):
      // Ignore stale connect responses
      if (msg.type === "connectResponse" || msg.type === "loginResponse") return;

      // ANY other message targeting erdw-contentScript resolves the pending action!
      settled = true;
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
      resolve(msg.data !== undefined ? msg.data : msg);
    }

    window.addEventListener("message", handleMessage, false);
    window.postMessage({ target: "erdw-inpage", type, data }, window.origin || "*");
  });
}

function normalizeSignedResult(res) {
  if (!res) return null;
  if (Array.isArray(res) && res.length > 0) return res;
  if (res.transactions && Array.isArray(res.transactions) && res.transactions.length > 0) return res.transactions;
  if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
  if (res.data && res.data.transactions && Array.isArray(res.data.transactions)) return res.data.transactions;
  if (typeof res === "object" && (res.signature || (res.signatures && res.signatures.length > 0) || res.txHash || res.hash)) return [res];
  return null;
}

function extractSignatureHex(sig) {
  if (!sig) return "";
  if (typeof sig === "string") return sig;
  if (typeof sig.hex === "function") return sig.hex();
  if (typeof sig.hex === "string") return sig.hex;
  if (sig instanceof Uint8Array || (Array.isArray(sig) && typeof sig[0] === "number")) {
    return Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  if (typeof sig === "object") {
    if (sig.data && (Array.isArray(sig.data) || sig.data instanceof Uint8Array)) {
      return Array.from(sig.data).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    if (typeof sig.toString === "function") {
      const s = sig.toString("hex");
      if (s && s !== "[object Object]") return s;
    }
  }
  return String(sig);
}

async function signMarketWithExtension(preparedTxs) {
  const extInputTxs = preparedTxs.map((t) => ({
    ...t,
    data: toBase64Data(t.data)
  }));

  const ext = getMarketDefiExtension();
  if (ext && typeof ext.signTransactions === "function") {
    try {
      const raw = await ext.signTransactions(extInputTxs);
      const normalized = normalizeSignedResult(raw);
      if (normalized) return normalized;
    } catch (e) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("cancel") || msg.includes("reject") || msg.includes("denied") || msg.includes("user cancel")) {
        throw e;
      }
      console.warn("Direct ext.signTransactions failed, trying postMessage bridge:", e);
    }
  }

  const res = await sendMarketExtensionMessage("signTransactions", {
    from: marketWallet.address,
    transactions: extInputTxs
  });
  return normalizeSignedResult(res);
}

async function broadcastMarketSignedTransactions(signedTxs) {
  const hashes = [];
  for (const rawTx of signedTxs) {
    let tx = rawTx;
    if (tx && typeof tx.toPlainObject === "function") {
      try { tx = { ...tx.toPlainObject(), ...tx }; } catch (e) {}
    }

    // 1. If extension auto-broadcasted ("Sign & Submit") and already returned txHash / hash
    const existingHash = tx.txHash || tx.hash || (typeof tx.getHash === "function" ? tx.getHash().hex() : null);
    if (existingHash) {
      hashes.push(existingHash);
      continue;
    }

    const rawSig = tx.signature || (tx.signatures && tx.signatures[0]) || (typeof tx.getSignature === "function" ? tx.getSignature() : null);
    const sigHex = extractSignatureHex(rawSig);

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
      signature: sigHex
    };
    if (tx.options !== undefined && tx.options !== null && Number(tx.options) !== 0) {
      payload.options = Number(tx.options);
    }
    if (tx.guardian) payload.guardian = tx.guardian;
    if (tx.guardianSignature) payload.guardianSignature = tx.guardianSignature;

    let txSent = false;
    // Primary: API endpoint
    try {
      const res = await fetch("https://api.multiversx.com/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.txHash) {
          hashes.push(resData.txHash);
          txSent = true;
        }
      } else {
        const errText = await res.text();
        if (errText.includes("already exists") || errText.includes("lowerNonceInTx")) {
          console.log("Transaction already submitted/in pool:", errText);
          txSent = true;
        }
      }
    } catch (e) {
      console.warn("API broadcast failed, trying gateway fallback:", e);
    }

    // Fallback: Gateway endpoint
    if (!txSent) {
      const gRes = await fetch("https://gateway.multiversx.com/transaction/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        const h = gData?.data?.txHash || gData?.txHash;
        if (h) {
          hashes.push(h);
          txSent = true;
        }
      } else {
        const gErr = await gRes.text();
        if (gErr.includes("already exists") || gErr.includes("lowerNonceInTx")) {
          console.log("Transaction already in pool on gateway:", gErr);
          txSent = true;
        } else {
          throw new Error(`MultiversX Hálózati Hiba: ${gErr}`);
        }
      }
    }
  }
  return hashes;
}

/**
 * Polls the MultiversX API for the on-chain status of a transaction
 * and notifies the user with clear feedback upon success or failure.
 */
function watchMarketTransaction(txHash, onConfirmed = null, onFailed = null) {
  if (!txHash || txHash === "broadcasted" || !txHash.length || txHash.length < 32) return;
  const isHu = currentMarketLang === "hu";
  let attempts = 0;
  const maxAttempts = 20; // ~40 seconds

  const interval = setInterval(async () => {
    attempts++;
    if (attempts > maxAttempts) {
      clearInterval(interval);
      return;
    }

    try {
      const res = await fetch(`https://api.multiversx.com/transactions/${txHash}`);
      if (!res.ok) return;
      const data = await res.json();
      const status = (data.status || "").toLowerCase();

      if (status === "success") {
        clearInterval(interval);
        showMarketToast(
          isHu
            ? "✅ Tranzakció sikeresen jóváhagyva a MultiversX blokkláncon!"
            : "✅ Transaction successfully confirmed on MultiversX blockchain!",
          4000
        );
        if (typeof onConfirmed === "function") onConfirmed(data);
      } else if (status === "fail" || status === "invalid") {
        clearInterval(interval);
        const returnMsg = data.returnMessage || (data.results && data.results[0]?.returnMessage) || "";
        showMarketToast(
          isHu
            ? `❌ A tranzakció meghiúsult a blokkláncon! ${returnMsg ? `(Hiba: ${returnMsg})` : ""}`
            : `❌ Transaction failed on blockchain! ${returnMsg ? `(Error: ${returnMsg})` : ""}`,
          6500
        );
        if (typeof onFailed === "function") onFailed(data);
      }
    } catch (e) {
      // Ignore network polling glitches
    }
  }, 2000);
}

async function sendMultiversxTransaction({ txs = null, receiver, value = "0", data = "", gasLimit = 15000000, onSigned = null }) {
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

  let preparedTxs = [];
  if (Array.isArray(txs) && txs.length > 0) {
    preparedTxs = txs.map((tx, idx) => {
      const single = {
        nonce: nonce + idx,
        value: String(tx.value || "0"),
        receiver: tx.receiver,
        sender: marketWallet.address,
        gasPrice: 1000000000,
        gasLimit: Number(tx.gasLimit || 15000000) + (isGuarded ? 50000 : 0),
        data: tx.data || "",
        chainID: "1",
        version: isGuarded ? 2 : 1
      };
      if (isGuarded && guardianAddress) {
        single.options = 2;
        single.guardian = guardianAddress;
      }
      return single;
    });
  } else {
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
    preparedTxs = [txObj];
  }

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

      let signedList = [];
      if (wcTxs.length > 1) {
        try {
          const multiRes = await marketWcSignClient.request({
            topic: activeTopic,
            chainId: "mvx:1",
            request: {
              method: "mvx_signTransactions",
              params: { transactions: wcTxs }
            }
          });
          if (Array.isArray(multiRes?.signatures)) {
            signedList = multiRes.signatures.map((sig, i) => ({
              ...wcTxs[i],
              signature: sig,
              data: wcTxs[i].data,
              dataIsBase64: true
            }));
          } else if (Array.isArray(multiRes)) {
            signedList = multiRes.map((st, i) => ({
              ...wcTxs[i],
              ...st,
              data: wcTxs[i].data,
              dataIsBase64: true
            }));
          }
        } catch (multiErr) {
          console.warn("xPortal multi-sign error, falling back to sequential:", multiErr);
        }
      }

      if (signedList.length === 0) {
        for (let i = 0; i < wcTxs.length; i++) {
          const singleRes = await marketWcSignClient.request({
            topic: activeTopic,
            chainId: "mvx:1",
            request: {
              method: "mvx_signTransaction",
              params: { transaction: wcTxs[i] }
            }
          });
          signedList.push({
            ...wcTxs[i],
            ...singleRes,
            data: wcTxs[i].data,
            dataIsBase64: true
          });
        }
      }

      const hashes = await broadcastMarketSignedTransactions(signedList);
      if (hashes.length > 0) {
        if (typeof onSigned === "function") {
          try { onSigned(hashes); } catch (e) { console.warn("onSigned callback error:", e); }
        }
        return { success: true, hash: hashes[hashes.length - 1], hashes, method: "xportal" };
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
  const ext = getMarketDefiExtension();
  const isExtension = marketWallet.provider === "extension" || (ext && marketWallet.provider !== "webwallet");

  if (isExtension || ext) {
    try {
      showMarketToast(
        isHu
          ? "🧩 Erősítsd meg a tranzakciót a MultiversX DeFi Wallet felugró ablakában..."
          : "🧩 Please confirm the transaction in your MultiversX DeFi Wallet Extension popup...",
        0
      );

      const signedRes = await signMarketWithExtension(preparedTxs);
      if (signedRes) {
        if (typeof onSigned === "function") {
          try { onSigned(signedRes); } catch (e) { console.warn("onSigned callback error:", e); }
        }

        showMarketToast(
          isHu
            ? "📡 Tranzakció aláírva! Közvetítés a MultiversX hálózatra..."
            : "📡 Transaction signed! Broadcasting to MultiversX network...",
          0
        );

        const signedList = Array.isArray(signedRes) ? signedRes : [signedRes];
        const formattedSigned = signedList.map((st, idx) => ({
          ...preparedTxs[idx],
          ...st,
          data: preparedTxs[idx]?.data || st.data,
          dataIsBase64: false
        }));

        const hashes = await broadcastMarketSignedTransactions(formattedSigned);
        if (hashes.length > 0 || signedList.length > 0) {
          const txHash = hashes[hashes.length - 1] || (signedList[signedList.length - 1]?.txHash || signedList[signedList.length - 1]?.hash) || "broadcasted";
          return { success: true, hash: txHash, hashes, method: "extension" };
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

// Marketplace Pagination State
let marketCurrentPage = 1;
let marketPageSize = 24; // 24 items per page by default (6 full rows of 4)
try {
  const savedSize = localStorage.getItem("efoo_market_page_size");
  if (savedSize === "all") marketPageSize = "all";
  else if (savedSize) {
    const p = parseInt(savedSize, 10);
    if ([24, 48, 96].includes(p)) marketPageSize = p;
  }
} catch (e) {}

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
  { id: "gold", icon: "💰", img: "branding/rebranded/skill-gold-multiplier-badge.png", name: "GOLD x2", nameHu: "DUPLA ARANY (2x)", nameRo: "AUR x2", price: 2500, color: "#ffb800", desc: "Double points and score multiplier on your next goal.", descHu: "Dupla pontszám és bónusz szorzó, ha a labda gól lesz." },
  { id: "steady", icon: "🎯", img: "branding/rebranded/skill-laser-aim-badge.png", name: "ICE VEINS", nameHu: "HIDEGVÉR", nameRo: "NERVI DE OȚEL", price: 3500, color: "#38bdf8", desc: "Crosshair stops shaking for precise corner aiming.", descHu: "A célkereszt stabilizálódik a következő lövésnél." },
  { id: "curve", icon: "🌀", img: "branding/rebranded/skill-banana-curve-badge.png", name: "BANANA CURVE", nameHu: "KIFLI CSAVARÁS", nameRo: "ȘUT CU EFECT", price: 4500, color: "#c084fc", desc: "Ball bends sharply — keeper misreads it 70% worse.", descHu: "Erősen kanyarodó lövés — a kapus jóval nehezebben védi ki." },
  { id: "power", icon: "🚀", img: "branding/rebranded/skill-rocket-ball-badge.png", name: "ROCKET SHOT", nameHu: "RAKÉTA LÖVÉS", nameRo: "ȘUT RACHETĂ", price: 6000, color: "#fb923c", desc: "Superpower sweet-spot and reduces keeper reach by 25%.", descHu: "Tágabb sweet-spot + a kapus elérési távolsága 25%-kal kisebb." },
  { id: "freeze", icon: "🧊", img: "branding/rebranded/skill-freeze-keeper-badge.png", name: "KEEPER FREEZE", nameHu: "KAPUS FAGYASZTÁS", nameRo: "PORTAR ÎNGHEȚAT", price: 8500, color: "#67e8f9", desc: "Freezes keeper for 1 second causing late reaction and wrong dives.", descHu: "A kapus késve reagál és gyakran a rossz irányba vetődik." },
  { id: "iron_wall", icon: "🛡️", img: "branding/rebranded/skill-iron-wall-badge.png", name: "IRON WALL", nameHu: "ACÉLFAL", nameRo: "ZID DE OȚEL", price: 3500, color: "#38bdf8", desc: "Reinforces goal posts & expands keeper save area by 50%.", descHu: "A kapus teste megnő, a védési felület 50%-kal nagyobb." },
  { id: "spider_reach", icon: "🧤", img: "branding/rebranded/skill-giant-gloves-badge.png", name: "SPIDER REACH", nameHu: "POLIP NYÚLÁS", nameRo: "REACH TENTACULAR", price: 6000, color: "#22c55e", desc: "Supernatural dive reach across the entire goalmouth.", descHu: "Óriási kézméret és ugrótávolság az egész kapura." },
  { id: "matrix_reflex", icon: "⏱️", img: "branding/rebranded/skill-matrix-warp-badge.png", name: "MATRIX TIME WARP", nameHu: "MÁTRIX IDŐLASSÍTÁS", nameRo: "MATRIX BULLET TIME", price: 7500, color: "#a855f7", desc: "Slows the ball speed by 50% giving full dive reaction time.", descHu: "50%-kal lelassítja a labdát, megkönnyítve a védést." },
  { id: "mind_read", icon: "👁️", img: "branding/rebranded/skill-mind-radar-badge.png", name: "MIND READ RADAR", nameHu: "GONDOLATOLVASÁS", nameRo: "CITIREA MINȚII", price: 9500, color: "#ffb800", desc: "Holographic aura reveals exact AI shot target before the kick.", descHu: "Holografikus aura mutatja a gép lövésének pontos helyét." }
];

// ============================================================================
// XOXNO RARITY & ATTRIBUTES ENGINE
// ============================================================================
function isUltrasPassNft(nft) {
  if (!nft) return false;
  const col = (nft.collection || "").toLowerCase();
  const id = (nft.identifier || "").toLowerCase();
  const name = (nft.name || "").toLowerCase();
  return col === ULTRAS_PASS_COLLECTION.toLowerCase() ||
         id.includes("efoopass-5223a8") ||
         id.includes("efoopass") ||
         name.includes("ultras pass");
}

function isSkillSftNft(nft) {
  if (!nft) return false;
  const col = (nft.collection || "").toLowerCase();
  const id = (nft.identifier || "").toLowerCase();
  return col.includes("efooskill") || id.includes("efooskill");
}

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

  // EFOO ULTRAS PASS (Special VIP Pass SFT - NOT a footballer player card!)
  if (isUltrasPassNft(nft)) {
    return {
      tierKey: "ultras-pass",
      tierLabel: "ULTRAS VIP PASS",
      tierIcon: "👑",
      rank: "VIP",
      borderColor: "#ffb800",
      scoreMult: 1.5,
      slots: 0,
      powers: [
        "0% Market Fees for Life",
        "+1.5x Match Multiplier",
        "+1 VIP Shield in Shootout",
        "300 Max Supply SFT"
      ]
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
        // Strict filter: purge any legacy phantom mock items or test addresses
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

let cachedScListings = [];
let isFetchingScListings = false;

// Fetch live listings from our Smart Contract (erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend)
async function fetchLiveScListings() {
  if (isFetchingScListings) return cachedScListings;
  if (!STADIUM_VAULT_SC || !STADIUM_VAULT_SC.startsWith("erd1qqqq")) return [];
  isFetchingScListings = true;
  try {
    // 1. Fetch on-chain active listings directly from smart contract view getAllListings
    const scListingsMap = new Map();
    try {
      const qRes = await fetch(`${MULTIVERSX_API}/vm-values/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scAddress: STADIUM_VAULT_SC,
          funcName: "getAllListings",
          args: []
        })
      });
      if (qRes.ok) {
        const qData = await qRes.json();
        const returnData = qData?.data?.data?.returnData || [];
        for (const b64 of returnData) {
          const parsed = parseScListingStruct(b64);
          if (parsed && parsed.identifier) {
            scListingsMap.set(parsed.identifier, parsed);
          }
        }
      }
    } catch (scErr) {
      console.warn("Failed querying getAllListings on SC:", scErr);
    }

    // 2. Fetch NFTs currently deposited in the smart contract escrow account
    const res = await fetch(`${MULTIVERSX_API}/accounts/${STADIUM_VAULT_SC}/nfts?size=50`);
    if (res.ok) {
      const escrowNfts = await res.json();
      if (Array.isArray(escrowNfts) && escrowNfts.length > 0) {
        // Also check local marketplace storage in case user just listed and query has delay
        const localListings = getMarketplaceListings();
        const localMap = new Map(localListings.map((x) => [x.identifier, x]));

        const scItems = [];
        for (const it of escrowNfts) {
          const tier = getNftRarityTier(it);
          const scInfo = scListingsMap.get(it.identifier);
          const localInfo = localMap.get(it.identifier);
          const isPass = isUltrasPassNft(it);
          let price = isPass ? ULTRAS_PASS_PRICE_EGLD : 0.05;
          let currency = "EGLD";
          let seller = isPass ? "Official NFooT Escrow" : "On-Chain Escrow";

          let paymentToken = "EGLD";

          if (scInfo) {
            price = scInfo.price;
            paymentToken = scInfo.paymentToken || "EGLD";
            if (scInfo.paymentToken === "WEGLD-bd4d79" || scInfo.paymentToken === "EGLD") {
              currency = "EGLD";
            } else if (scInfo.paymentToken === "EFOO-8fe2d4" || scInfo.paymentToken === "EFOO") {
              currency = "EFOO";
            } else {
              currency = scInfo.paymentToken;
            }
            if (scInfo.sellerHex) {
              const bech32Addr = hexToBech32Address(scInfo.sellerHex);
              if (bech32Addr) seller = bech32Addr;
            }
          } else if (localInfo) {
            price = localInfo.price;
            currency = localInfo.currency;
            paymentToken = localInfo.paymentToken || (localInfo.currency === "EGLD" ? "EGLD" : EFOO_TOKEN_ID);
            seller = localInfo.seller;
          }

          scItems.push({
            id: `sc-${it.identifier}`,
            isScListing: true,
            identifier: it.identifier,
            collection: it.collection,
            nonce: it.nonce || 0,
            name: isPass ? "EFOO ULTRAS PASS" : (it.name || it.identifier),
            rarity: tier.tierLabel,
            rank: it.rank || tier.rank,
            trait: isPass ? "Exclusive MultiversX VIP Access SFT (0% Trading Fees for Life)" : "Official NFooT SC Escrow Listing",
            url: it.url || (isPass ? "branding/rebranded/efoo-ultras-pass-badge.png" : (it.collection === KEEPER_COLLECTION ? "branding/original/GOALKEEPER-cb9e3e/logo.png" : "branding/original/EFOOTBALL-91a4eb/logo.png")),
            price: price,
            currency: currency,
            paymentToken: paymentToken,
            seller: seller,
            createdAt: it.timestamp ? it.timestamp * 1000 : Date.now(),
            attributes: it.metadata?.attributes || []
          });
        }
        // Preserve any recent locally listed items awaiting blockchain indexing (within 60s)
        const now = Date.now();
        const pendingLocal = getMarketplaceListings().filter(
          (p) => p && (now - (p.createdAt || 0) < 60000) && !scItems.some((s) => s.identifier === p.identifier)
        );
        cachedScListings = [...pendingLocal, ...scItems];
        renderMarketplaceGrid();
        renderTelemetry();
      }
    }
  } catch (err) {
    console.warn("fetchLiveScListings error:", err);
  } finally {
    isFetchingScListings = false;
  }
  return cachedScListings;
}

function getAllActiveListings() {
  const p2p = getMarketplaceListings();
  const scIds = new Set(cachedScListings.map((x) => x.identifier));
  const uniqueP2p = p2p.filter((x) => !scIds.has(x.identifier));
  return [...cachedScListings, ...uniqueP2p, ...cachedXoxnoListings];
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

    // Fetch All User ESDT Tokens (WEGLD, EFOO, USDC, FOXSY, etc.)
    const allTokensRes = await fetch(`${MULTIVERSX_API}/accounts/${address}/tokens?size=100`);
    if (allTokensRes.ok) {
      const allTokens = await allTokensRes.json();
      marketWallet.tokens = {};
      if (Array.isArray(allTokens)) {
        allTokens.forEach((t) => {
          const dec = t.decimals !== undefined ? t.decimals : 18;
          marketWallet.tokens[t.identifier] = parseFloat(t.balance) / Math.pow(10, dec);
        });
      }
      marketWallet.efooBalance = marketWallet.tokens[EFOO_TOKEN_ID] || 0;
    } else {
      // Fallback single token fetch
      const tokRes = await fetch(`${MULTIVERSX_API}/accounts/${address}/tokens/${EFOO_TOKEN_ID}`);
      if (tokRes.ok) {
        const tok = await tokRes.json();
        marketWallet.efooBalance = parseFloat(tok.balance) / 1e18;
      } else {
        marketWallet.efooBalance = 0;
      }
    }
  } catch (e) {
    marketWallet.efooBalance = 0;
  }
  updateWalletUI();
  updateMarketSwapEstimate();
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
    const isVip = hasUltrasPass(a) || (marketWallet.ownedNfts && marketWallet.ownedNfts.length > 0);
    if (vipBadge) {
      vipBadge.classList.toggle("hidden", !isVip);
    }
  } else {
    if (vipBadge) vipBadge.classList.add("hidden");
  }

  const adminBtn = document.getElementById("m-btn-admin-vault");
  const isOwner = marketWallet.address && (
    marketWallet.address.toLowerCase() === EFOOREWARDS_WALLET.toLowerCase() ||
    marketWallet.address.toLowerCase() === "erd1qqqqqqqqqqqqqpgqwdrgl4k7gfa26wp0xcje8qn9gucq87yx55hs39eend"
  );
  if (adminBtn) {
    adminBtn.classList.toggle("hidden", !isOwner);
    if (isOwner) {
      sessionStorage.setItem("efoo_admin_session_auth_v1", "VALID_OWNER_AUTH");
      localStorage.setItem("efoo_connected_address", EFOOREWARDS_WALLET);
    } else {
      sessionStorage.removeItem("efoo_admin_session_auth_v1");
    }
  }

  updateMarketBonusUI();
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
  const ext = getMarketDefiExtension();
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

  // Apply Sort: Native NFooT marketplace listings ALWAYS come first!
  filtered.sort((a, b) => {
    const aIsNative = !a.isXoxno;
    const bIsNative = !b.isXoxno;
    if (aIsNative && !bIsNative) return -1;
    if (!aIsNative && bIsNative) return 1;

    // Within same marketplace tier, apply selected sort
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

  const paginationBar = document.getElementById("market-pagination-bar");

  if (filtered.length === 0) {
    if (paginationBar) paginationBar.classList.add("hidden");
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-sub);">
        <h3>${isHu ? "Nincs a szűrésnek megfelelő NFT." : "No NFTs match the selected filter."}</h3>
        <p>${isHu ? "Próbáld meg az 'Összes' fület!" : "Try switching to 'All' or check back soon!"}</p>
      </div>
    `;
    return;
  }

  // Calculate Pagination Slices
  if (paginationBar) paginationBar.classList.remove("hidden");
  const totalCount = filtered.length;
  const pageSizeNum = marketPageSize === "all" ? totalCount : Number(marketPageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSizeNum));

  if (marketCurrentPage > totalPages) marketCurrentPage = totalPages;
  if (marketCurrentPage < 1) marketCurrentPage = 1;

  const startIdx = marketPageSize === "all" ? 0 : (marketCurrentPage - 1) * pageSizeNum;
  const endIdx = marketPageSize === "all" ? totalCount : Math.min(startIdx + pageSizeNum, totalCount);
  const pageItems = filtered.slice(startIdx, endIdx);

  // Update Pagination Controls UI
  updateMarketPaginationUI(totalCount, totalPages, startIdx, endIdx);

  const curAddr = marketWallet.address ? marketWallet.address.toLowerCase() : "";
  let isFirstXoxno = true;
  const hasNativeItems = pageItems.some((x) => !x.isXoxno);

  pageItems.forEach((item) => {
    const tier = getNftRarityTier(item);
    const isOwner = curAddr && item.seller && item.seller.toLowerCase() === curAddr;
    const isNative = !item.isXoxno;

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey} ${isNative ? "is-nfoot-native" : "is-xoxno-card"}`;

    // Separate our marketplace NFTs: only the very first XOXNO card starts a new row,
    // all subsequent XOXNO cards stay together in standard grid flow (e.g. 4 per row)
    if (!isNative && hasNativeItems && isFirstXoxno) {
      card.style.gridColumnStart = "1";
      isFirstXoxno = false;
    }

    card.style.setProperty("--tier-color", tier.borderColor);
    card.style.setProperty("--tier-glow", `${tier.borderColor}66`);

    const isEgld = item.currency === "EGLD" || item.currency === "WEGLD";
    const formattedPrice = isEgld
      ? (Number(item.price) === 0.5 ? "0.50" : (Number(item.price) < 0.1 ? Number(item.price).toFixed(3) : Number(item.price).toFixed(2)))
      : (typeof item.price === "number" ? item.price.toLocaleString("en-US") : item.price);

    const sellerShort = isOwner
      ? (isHu ? "Te (Tulajdonos)" : (isRo ? "Tu (Proprietar)" : "You (Owner)"))
      : isUltrasPassNft(item)
      ? (isHu ? "Hivatalos Letét" : "Official Escrow")
      : (item.seller && item.seller.startsWith("erd1") ? `${item.seller.slice(0, 6)}...${item.seller.slice(-4)}` : (item.seller || "Escrow"));

    card.innerHTML = `
      ${
        isNative
          ? `<div class="mnc-circuit-frame" aria-hidden="true">
               <div class="circuit-top-bar"></div>
               <div class="circuit-bot-bar"></div>
               <svg class="circuit-corner tl" viewBox="0 0 54 54"><path d="M 0,36 L 0,12 Q 0,0 12,0 L 36,0" class="cc-outer"/><path d="M 8,24 L 18,14 L 38,14" class="cc-inner"/><circle cx="38" cy="14" r="3" class="cc-node"/><circle cx="0" cy="36" r="2.5" class="cc-node"/></svg>
               <svg class="circuit-corner tr" viewBox="0 0 54 54"><path d="M 54,36 L 54,12 Q 54,0 42,0 L 18,0" class="cc-outer"/><path d="M 46,24 L 36,14 L 16,14" class="cc-inner"/><circle cx="16" cy="14" r="3" class="cc-node"/><circle cx="54" cy="36" r="2.5" class="cc-node"/></svg>
               <svg class="circuit-corner bl" viewBox="0 0 54 54"><path d="M 0,18 L 0,42 Q 0,54 12,54 L 36,54" class="cc-outer"/><path d="M 8,30 L 18,40 L 38,40" class="cc-inner"/><circle cx="38" cy="40" r="3" class="cc-node"/><circle cx="0" cy="18" r="2.5" class="cc-node"/></svg>
               <svg class="circuit-corner br" viewBox="0 0 54 54"><path d="M 54,18 L 54,42 Q 54,54 42,54 L 18,54" class="cc-outer"/><path d="M 46,30 L 36,40 L 16,40" class="cc-inner"/><circle cx="16" cy="40" r="3" class="cc-node"/><circle cx="54" cy="18" r="2.5" class="cc-node"/></svg>
               <div class="circuit-bus-l"></div>
               <div class="circuit-bus-r"></div>
               <div class="circuit-frame-badge"><span class="cfb-dot"></span>NFOOT ESCROW</div>
             </div>`
          : ""
      }
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
            : `<div class="mnc-nfoot-badge" title="Official NFooT Marketplace Listing">
                 <img src="branding/rebranded/nfoot-icon-128x128.png" alt="NFooT Marketplace" class="mnc-nfoot-logo-img" />
                 <span class="mnc-nfoot-text">NFooT</span>
               </div>`
        }
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${item.name}</strong>
          <div class="mnc-title-tags">
            ${
              isUltrasPassNft(item)
                ? `<span class="mnc-vip-tag" style="background:linear-gradient(135deg, #ffb800, #ff8c00); color:#050d08; font-family:var(--font-mono); font-size:0.72rem; font-weight:800; padding:2px 8px; border-radius:6px;">VIP PASS</span>`
                : `<span class="mnc-role-tag">${item.jersey ? "🧤 KEEPER" : "⚽ STRIKER"}</span>`
            }
          </div>
        </div>

        <p class="mnc-trait-desc">${isUltrasPassNft(item) ? (isHu ? "Élethosszig tartó 0% kereskedési díj az Áruházban • Match Booster" : "Lifetime 0% marketplace trading fee • Match Booster") : (item.trait || (item.isXoxno ? "Listed on XOXNO Marketplace" : "Sunday League Degen Ultra"))}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">ASKING PRICE</span>
            <div class="mnc-price-row">
              <strong class="mnc-price-val">${formattedPrice}</strong>
              ${getCurrencyBadgeHtml(item.currency)}
            </div>
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

function updateMarketPaginationUI(totalCount, totalPages, startIdx, endIdx) {
  const bar = document.getElementById("market-pagination-bar");
  if (!bar) return;

  const isHu = currentMarketLang === "hu";
  const isRo = currentMarketLang === "ro";

  const lblPerPage = document.getElementById("m-lbl-per-page");
  if (lblPerPage) {
    lblPerPage.textContent = isHu ? "Oldalanként:" : isRo ? "Pe pagină:" : "Show per page:";
  }

  document.querySelectorAll(".m-page-size-btn").forEach((btn) => {
    const sz = btn.getAttribute("data-size");
    const isAct = String(marketPageSize) === sz;
    btn.classList.toggle("active", isAct);
    if (sz === "all") {
      btn.textContent = isHu ? "Mind" : isRo ? "Toate" : "All";
    }
  });

  const prevBtn = document.getElementById("m-btn-prev-page");
  const nextBtn = document.getElementById("m-btn-next-page");
  const infoText = document.getElementById("m-page-info-text");

  if (prevBtn) {
    prevBtn.disabled = marketCurrentPage <= 1 || marketPageSize === "all";
    prevBtn.textContent = isHu ? "◀ Előző" : isRo ? "◀ Anterior" : "◀ Prev";
  }

  if (nextBtn) {
    nextBtn.disabled = marketCurrentPage >= totalPages || marketPageSize === "all";
    nextBtn.textContent = isHu ? "Következő ▶" : isRo ? "Următor ▶" : "Next ▶";
  }

  if (infoText) {
    if (totalCount === 0) {
      infoText.textContent = "0 NFT";
    } else if (marketPageSize === "all") {
      infoText.textContent = isHu 
        ? `Összes megjelenítve (${totalCount} db NFT)`
        : isRo
        ? `Toate afișate (${totalCount} NFT-uri)`
        : `Showing all ${totalCount} NFTs`;
    } else {
      infoText.textContent = isHu
        ? `${marketCurrentPage}. / ${totalPages} oldal (${startIdx + 1} - ${endIdx} / ${totalCount} NFT)`
        : isRo
        ? `Pagina ${marketCurrentPage} din ${totalPages} (${startIdx + 1} - ${endIdx} din ${totalCount})`
        : `Page ${marketCurrentPage} of ${totalPages} (${startIdx + 1} - ${endIdx} of ${totalCount})`;
    }
  }
}

function scrollToMarketGrid() {
  const grid = document.getElementById("market-listings-grid");
  if (grid) {
    const y = grid.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }
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
    const isPass = isUltrasPassNft(nft);
    const tier = getNftRarityTier(nft);
    const isListed = listings.find((x) => x.identifier === nft.identifier && x.seller && x.seller.toLowerCase() === curAddr);

    const card = document.createElement("div");
    card.className = `m-nft-card tier-${tier.tierKey}`;

    if (isPass) {
      const isHu = currentMarketLang === "hu";
      const sftQty = parseInt(nft.balance || "1", 10) || 1;
      const sftFormatted = sftQty.toLocaleString("en-US");

      card.innerHTML = `
        <div class="mnc-media-wrap" data-locker-inspect="${nft.identifier}">
          <img src="${nft.url || 'branding/rebranded/efoo-ultras-pass-badge.png'}" alt="${nft.name}" class="mnc-media-img" />
          <div class="mnc-rank-badge" style="border-color:#ffb800; color:#ffb800; background:rgba(255,184,0,0.15);">
            👑 VIP PASS • 0% FEES
          </div>
          <div class="mnc-col-tag" style="background:linear-gradient(135deg, #ffb800, #ff8c00); color:#050d08; font-weight:900; box-shadow:0 0 10px rgba(255,184,0,0.4);">
            👑 ${sftFormatted} SFT
          </div>
        </div>

        <div class="mnc-body">
          <div class="mnc-title-row">
            <strong class="mnc-title" style="color:#ffb800;">${nft.name || "EFOO ULTRAS PASS"}</strong>
            <span class="mnc-vip-tag" style="background:linear-gradient(135deg, #ffb800, #ff8c00); color:#050d08; font-family:var(--font-mono); font-size:0.72rem; font-weight:800; padding:2px 8px; border-radius:6px;">VIP PASS</span>
          </div>

          <p class="mnc-trait-desc" style="color:#f3f7f4;">
            ${isHu ? "Élethosszig tartó 0% piactéri díjkedvezmény • +1.5x szorzó és +1 VIP pajzs a meccseken!" : "Lifetime 0% marketplace trading fee • +1.5x score multiplier & +1 VIP shield!"}
          </p>

          <div class="mnc-powers-row">
            <span class="mnc-power-pill" style="border-color:rgba(255,184,0,0.5); color:#ffb800;">⚡ 0% Trading Fee</span>
            <span class="mnc-power-pill" style="border-color:rgba(255,184,0,0.5); color:#ffb800;">👑 VIP Leaderboard Crown</span>
            <span class="mnc-power-pill" style="border-color:rgba(255,184,0,0.5); color:#ffb800;">🛡️ +1 Extra Shield in Match</span>
          </div>

          <div class="mnc-footer">
            <div class="mnc-price-box">
              <span class="mnc-price-lbl">MEMBERSHIP</span>
              <strong class="mnc-price-val" style="color:var(--neon);">
                👑 Active VIP Pass
              </strong>
            </div>

            <div class="mnc-action-wrap">
              <a href="https://xspotlight.com/nfts/${nft.identifier || 'EFOOPASS-5223a8-01'}" target="_blank" rel="noopener" class="m-btn-primary" style="background:linear-gradient(135deg, #ffb800, #ff8c00); color:#050d08; text-decoration:none; padding:8px 12px; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;">
                xSpotlight ↗
              </a>
            </div>
          </div>
        </div>
      `;

      card.querySelector(`[data-locker-inspect="${nft.identifier}"]`)?.addEventListener("click", () => {
        openNftDetailsModal(nft);
      });

      grid.appendChild(card);
      return;
    }

    const isKeeper = (nft.collection === KEEPER_COLLECTION) || 
      (nft.identifier && nft.identifier.toUpperCase().startsWith("GOALKEEPER")) || 
      (nft.name && nft.name.toLowerCase().includes("goalkeeper"));
    const keeperFallback = "branding/original/GOALKEEPER-cb9e3e/logo.png";
    const strikerFallback = "branding/original/EFOOTBALL-91a4eb/logo.png";
    const nftImgUrl = nft.url || (isKeeper ? keeperFallback : strikerFallback);

    card.innerHTML = `
      <div class="mnc-media-wrap" data-locker-inspect="${nft.identifier}">
        <img src="${nftImgUrl}" alt="${nft.name}" class="mnc-media-img" />
        <div class="mnc-rank-badge" style="border-color:${tier.borderColor}; color:${tier.borderColor};">
          ${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel}
        </div>
        <div class="mnc-col-tag">${isListed ? "🏷️ LISTED" : "🎒 IN LOCKER"}</div>
      </div>

      <div class="mnc-body">
        <div class="mnc-title-row">
          <strong class="mnc-title">${nft.name || nft.identifier}</strong>
          <div class="mnc-title-tags">
            ${
              isUltrasPassNft(nft)
                ? `<span class="mnc-vip-tag" style="background:linear-gradient(135deg, #ffb800, #ff8c00); color:#050d08; font-family:var(--font-mono); font-size:0.72rem; font-weight:800; padding:2px 8px; border-radius:6px;">VIP PASS</span>`
                : `<span class="mnc-role-tag">${isKeeper ? "🧤 KEEPER" : "⚽ STRIKER"}</span>`
            }
          </div>
        </div>

        <p class="mnc-trait-desc">${nft.trait || "Equipped for 120' Shootout Arena"}</p>

        <div class="mnc-powers-row">
          ${tier.powers.slice(0, 3).map((p) => `<span class="mnc-power-pill">${p}</span>`).join("")}
        </div>

        <div class="mnc-footer">
          <div class="mnc-price-box">
            <span class="mnc-price-lbl">STATUS</span>
            ${
              isListed
                ? `<div class="mnc-price-row">
                     <strong class="mnc-price-val" style="color:var(--gold);">${isListed.currency === "EGLD" ? Number(isListed.price).toFixed(3) : Number(isListed.price).toLocaleString("en-US")}</strong>
                     ${getCurrencyBadgeHtml(isListed.currency)}
                   </div>`
                : `<strong class="mnc-price-val" style="color:var(--neon);">Available in Locker</strong>`
            }
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
        ${s.img ? `<img src="${s.img}" class="msk-badge-thumb" alt="${name}" onerror="this.style.display='none'" />` : `<span class="msk-icon">${s.icon}</span>`}
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

  // Ultras Pass SFT purchase delegates directly to buyUltrasPassOnChain (0.5 EGLD on Smart Contract)
  if (isUltrasPassNft(item)) {
    return buyUltrasPassOnChain();
  }

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
    const isNativeEgld = item.paymentToken === "EGLD";
    const priceAtomic = toAtomicUnits(item.price, 18);
    let priceHex = priceAtomic.toString(16);
    if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

    const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
    const egldBal = marketWallet.egldBalance || 0;
    const requiredPrice = Number(item.price);

    if (isNativeEgld && egldBal < requiredPrice) {
      showMarketToast(
        isHu
          ? `⚠️ Nincs elegendő EGLD egyenleged! Ár: ${item.price} EGLD (Egyenleg: ${egldBal.toFixed(3)} EGLD)`
          : `⚠️ Insufficient EGLD balance! Price: ${item.price} EGLD (Balance: ${egldBal.toFixed(3)} EGLD)`
      );
      return;
    }

    if (!isNativeEgld && (wegldBal + egldBal) < requiredPrice) {
      showMarketToast(
        isHu
          ? `⚠️ Nincs elegendő egyenleged! Ár: ${item.price} EGLD (Egyenleg: ${egldBal.toFixed(3)} EGLD / ${wegldBal.toFixed(3)} WEGLD)`
          : `⚠️ Insufficient balance! Price: ${item.price} EGLD (Balance: ${egldBal.toFixed(3)} EGLD / ${wegldBal.toFixed(3)} WEGLD)`
      );
      return;
    }

    try {
      if (isNativeEgld) {

        // buyNft@<colHex>@<nonceHex> (DIRECT SC call: function name must be plain text UTF-8!)
        const dataField = `buyNft@${colHex}@${nonceHex}`;

        showMarketToast(`⚡ Preparing Smart Contract purchase: ${item.name} (${item.price} EGLD)...`);

        await sendMultiversxTransaction({
          receiver: STADIUM_VAULT_SC,
          value: priceAtomic.toString(),
          gasLimit: 25000000,
          data: dataField
        });
      } else {
        // WEGLD listing (standard MultiversX ESDT escrow)
        if (wegldBal < requiredPrice) {
          if (egldBal >= requiredPrice + 0.005) {
            showMarketToast(`🔄 Wrapping ${requiredPrice} EGLD to WEGLD for purchase...`);

            const shard = marketWallet.shard !== undefined ? marketWallet.shard : 1;
            const shardWrapper = CONTRACTS.WEGLD_WRAPPERS[shard] || CONTRACTS.WEGLD_WRAPPERS[1];
            const wrapWei = priceAtomic.toString();

            await sendMultiversxTransaction({
              receiver: shardWrapper,
              value: wrapWei,
              gasLimit: 8000000,
              data: "wrapEgld"
            });

            if (!marketWallet.tokens) marketWallet.tokens = {};
            marketWallet.tokens["WEGLD-bd4d79"] = (marketWallet.tokens["WEGLD-bd4d79"] || 0) + requiredPrice;
            marketWallet.egldBalance = Math.max(0, marketWallet.egldBalance - requiredPrice);
          } else {
            showMarketToast(`⚠️ Insufficient balance! Price: ${item.price} EGLD (Balance: ${egldBal.toFixed(3)} EGLD / ${wegldBal.toFixed(3)} WEGLD)`);
            return;
          }
        }

        const wegldHex = stringToHex("WEGLD-bd4d79");
        const endpointHex = stringToHex("buyNft");
        const dataField = `ESDTTransfer@${wegldHex}@${priceHex}@${endpointHex}@${colHex}@${nonceHex}`;

        showMarketToast(`⚡ Preparing Smart Contract purchase: ${item.name} (${item.price} EGLD)...`);

        await sendMultiversxTransaction({
          receiver: STADIUM_VAULT_SC,
          value: "0",
          gasLimit: 25000000,
          data: dataField
        });
      }

      // Remove from both local cache and active SC listings
      cachedScListings = (cachedScListings || []).filter((x) => x.id !== item.id && x.identifier !== item.identifier);
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

      setTimeout(async () => {
        if (marketWallet.address) {
          await fetchWalletNfts(marketWallet.address);
          await fetchLiveScListings();
          renderMarketplaceGrid();
          renderMyLockerGrid();
          renderTelemetry();
        }
      }, 4500);

      const sellerHasPass = hasUltrasPass(item.seller);
      const buyerHasPass = hasUltrasPass(marketWallet.address);
      const isZeroFeeTrade = sellerHasPass || buyerHasPass;

      if (isZeroFeeTrade) {
        showMarketToast(`🎉 Buy transaction sent! 0% VIP Ultras fee applied: seller receives 100%! NFT incoming to your locker!`);
      } else {
        showMarketToast(`🎉 Purchase transaction sent! 98% to seller, 2% fee to efoorewards. NFT transfers directly to your wallet!`);
      }
    } catch (err) {
      console.error("EGLD purchase failed:", err);
      showMarketToast(`❌ Purchase error: ${err.message || "Cancelled"}`);
    }
    return;
  }

  // $EFOO Trade
  if (marketWallet.efooBalance < Number(item.price)) {
    showMarketToast(`⚠️ Insufficient $EFOO balance! Price: ${Number(item.price).toLocaleString("en-US")} $EFOO (Balance: ${Math.floor(marketWallet.efooBalance).toLocaleString("en-US")} $EFOO)`);
    return;
  }

  const priceAtomic = toAtomicUnits(item.price, 18);
  let priceHex = priceAtomic.toString(16);
  if (priceHex.length % 2 !== 0) priceHex = "0" + priceHex;

  const efooTokenHex = stringToHex(EFOO_TOKEN_ID);
  const endpointHex = stringToHex("buyNft"); // 6275794e6674
  // MultiversX ESDTTransfer to SC endpoint: ESDTTransfer@<token_id_hex>@<amount_hex>@<endpoint_hex>@<colHex>@<nonceHex>
  const dataField = `ESDTTransfer@${efooTokenHex}@${priceHex}@${endpointHex}@${colHex}@${nonceHex}`;

  showMarketToast(`⚡ Preparing Smart Contract purchase: ${item.name} (${Number(item.price).toLocaleString("en-US")} $EFOO)...`);

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 25000000,
      data: dataField
    });

    const sellerHasPass = hasUltrasPass(item.seller);
    const buyerHasPass = hasUltrasPass(marketWallet.address);
    const isZeroFeeTrade = sellerHasPass || buyerHasPass;

    if (!isZeroFeeTrade) {
      const fee2_5 = Math.floor(Number(item.price) * 0.025);
      addVaultContributions(fee2_5, fee2_5);
    }

    // Remove from both local cache and active SC listings
    cachedScListings = (cachedScListings || []).filter((x) => x.id !== item.id && x.identifier !== item.identifier);
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

    setTimeout(async () => {
      if (marketWallet.address) {
        await fetchWalletNfts(marketWallet.address);
        await fetchLiveScListings();
        renderMarketplaceGrid();
        renderMyLockerGrid();
        renderTelemetry();
      }
    }, 4500);

    if (isZeroFeeTrade) {
      showMarketToast(`🎉 Buy transaction sent! 0% VIP Ultras fee benefit applied: 100% goes to seller. NFT is incoming!`);
    } else {
      showMarketToast(`🎉 Buy transaction sent! 95% to seller, 2.5% burned 🔥, 2.5% to Stadium Vault Reward Pool 🏆!`);
    }
  } catch (err) {
    console.error("EFOO purchase failed:", err);
    showMarketToast(`❌ Purchase error: ${err.message || "Cancelled"}`);
  }
}

function setListingCurrency(val) {
  const hiddenSelect = document.getElementById("list-select-currency");
  const nameEl = document.getElementById("list-selected-currency-name");
  const iconEl = document.getElementById("list-selected-currency-icon");
  const priceInput = document.getElementById("list-input-price");
  const menuList = document.getElementById("list-currency-menu-list");
  const dropdownWrap = document.getElementById("list-currency-dropdown");

  if (hiddenSelect) {
    hiddenSelect.value = val;
    hiddenSelect.dispatchEvent(new Event("change"));
  }

  if (val === "EGLD") {
    if (nameEl) nameEl.textContent = "EGLD";
    if (iconEl) {
      iconEl.src = "branding/icons/egld-logo.svg";
      iconEl.classList.remove("round");
    }
    if (priceInput) {
      priceInput.placeholder = "e.g. 0.5";
    }
  } else {
    if (nameEl) nameEl.textContent = "$EFOO";
    if (iconEl) {
      iconEl.src = "branding/icons/efoo-logo.png";
      iconEl.classList.add("round");
    }
    if (priceInput) {
      priceInput.placeholder = "e.g. 2500000";
    }
  }

  // Update active state in menu list
  document.querySelectorAll("#list-currency-menu-list .token-dropdown-item").forEach((it) => {
    const isAct = it.getAttribute("data-currency-val") === val;
    it.classList.toggle("active", isAct);
  });

  menuList?.classList.add("hidden");
  dropdownWrap?.classList.remove("open");
  updateListingFeePreview();
}

function updateListingFeePreview() {
  const currSelect = document.getElementById("list-select-currency");
  const priceInput = document.getElementById("list-input-price");
  const feeLabel = document.getElementById("list-fee-label");
  const feePct = document.getElementById("list-fee-pct");
  const recvLabel = document.getElementById("list-receive-label");
  const recvVal = document.getElementById("list-calc-receive");
  const ultrasHint = document.getElementById("list-ultras-hint");
  const breakdownRow = document.getElementById("list-fee-breakdown-row");
  const breakdownVal = document.getElementById("list-fee-breakdown-val");
  if (!currSelect || !priceInput) return;

  const currency = currSelect.value || "EGLD";
  const rawPriceStr = String(priceInput.value || "").replace(/,/g, "").trim();
  const val = parseFloat(rawPriceStr) || 0;
  const isUltrasHolder = hasUltrasPass(marketWallet.address);

  if (isUltrasHolder) {
    if (feeLabel) feeLabel.textContent = "VIP Ultras Trading Fee:";
    if (feePct) feePct.textContent = "0.0% (LIFETIME FREE)";
    if (recvLabel) recvLabel.textContent = "You Receive (100%):";
    if (breakdownRow) breakdownRow.style.display = "none";
    if (recvVal) {
      if (val > 0) {
        recvVal.textContent = currency === "EGLD" ? `${val.toFixed(4)} EGLD` : `${Math.floor(val).toLocaleString("en-US")} $EFOO`;
      } else {
        recvVal.textContent = "100% of sale proceeds";
      }
    }
    if (ultrasHint) {
      ultrasHint.innerHTML = "👑 <strong>EFOO Ultras PASS Active:</strong> 0% trading fee forever on buy and sell, keep 100% of your earnings!";
      ultrasHint.style.color = "#a8ff00";
      ultrasHint.style.borderColor = "rgba(168,255,0,0.4)";
      ultrasHint.style.background = "rgba(168,255,0,0.08)";
    }
  } else if (currency === "EGLD") {
    if (feeLabel) feeLabel.textContent = "Trading Fee (2% efoorewards wallet):";
    if (feePct) feePct.textContent = "2.0%";
    if (recvLabel) recvLabel.textContent = "You Receive (98%):";
    if (breakdownRow) breakdownRow.style.display = "none";
    if (recvVal) {
      if (val > 0) {
        const net = val * 0.98;
        recvVal.textContent = `${net.toFixed(4)} EGLD`;
      } else {
        recvVal.textContent = "98% of sale";
      }
    }
    if (ultrasHint) {
      ultrasHint.innerHTML = "🎟️ Hold an <strong>EFOO Ultras PASS</strong> to reduce trading fee to <strong>0%</strong> (Keep 100%)!";
      ultrasHint.style.color = "#ffb800";
      ultrasHint.style.borderColor = "rgba(255,184,0,0.3)";
      ultrasHint.style.background = "rgba(255,184,0,0.08)";
    }
  } else {
    // $EFOO Trade: 95% to seller, 2.5% burn, 2.5% Stadium Vault Reward Pool
    if (feeLabel) feeLabel.textContent = "Trading Fee (2.5% Burn 🔥 + 2.5% Reward Pool 🏆):";
    if (feePct) feePct.textContent = "5.0%";
    if (recvLabel) recvLabel.textContent = "You Receive (95%):";
    if (breakdownRow) breakdownRow.style.display = "flex";
    if (breakdownVal) {
      if (val > 0) {
        const burnAmt = Math.floor(val * 0.025).toLocaleString("en-US");
        const vaultAmt = Math.floor(val * 0.025).toLocaleString("en-US");
        breakdownVal.textContent = `2.5% Burn 🔥 (${burnAmt}) + 2.5% Stadium Vault 🏆 (${vaultAmt})`;
      } else {
        breakdownVal.textContent = "2.5% Burn 🔥 + 2.5% Stadium Vault Reward Pool 🏆";
      }
    }
    if (recvVal) {
      if (val > 0) {
        const net = Math.floor(val * 0.95);
        recvVal.textContent = `${net.toLocaleString("en-US")} $EFOO`;
      } else {
        recvVal.textContent = "95% of sale";
      }
    }
    if (ultrasHint) {
      ultrasHint.innerHTML = "🎟️ Hold an <strong>EFOO Ultras PASS</strong> to reduce trading fee to <strong>0%</strong> (Keep 100%)!";
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
  const isKeeper = (nft.collection === KEEPER_COLLECTION) || 
    (nft.identifier && nft.identifier.toUpperCase().startsWith("GOALKEEPER")) || 
    (nft.name && nft.name.toLowerCase().includes("goalkeeper"));
  const fallbackImg = isKeeper ? "branding/original/GOALKEEPER-cb9e3e/logo.png" : "branding/original/EFOOTBALL-91a4eb/logo.png";

  if (titleEl) titleEl.textContent = `List ${nft.name || nft.identifier}`;
  if (nameEl) nameEl.textContent = nft.name || nft.identifier;
  if (imgEl) imgEl.src = nft.url || fallbackImg;
  if (rankEl) rankEl.textContent = `${tier.tierIcon} Rank #${tier.rank} (${tier.tierLabel}) • ${isKeeper ? "🧤 Goalkeeper" : "⚽ Striker"}`;

  setListingCurrency("EGLD");
  modal?.classList.remove("hidden");
}

async function executeCreateListing() {
  if (!activeModalNft || !marketWallet.address) {
    showMarketToast("⚠️ Please connect your wallet first!");
    return;
  }

  const priceInput = document.getElementById("list-input-price");
  const currSelect = document.getElementById("list-select-currency");
  const currency = currSelect?.value || "EFOO";

  const rawPriceStr = String(priceInput?.value || "").replace(/,/g, "").trim();
  const priceVal = parseFloat(rawPriceStr);
  if (currency === "EGLD") {
    if (isNaN(priceVal) || priceVal < 0.001) {
      showMarketToast("⚠️ Please enter a price of at least 0.001 EGLD.");
      return;
    }
  } else {
    if (isNaN(priceVal) || priceVal < 1000) {
      showMarketToast("⚠️ Please enter a price of at least 1,000 $EFOO.");
      return;
    }
  }

  const isKeeper = (activeModalNft.collection === KEEPER_COLLECTION) || 
    (activeModalNft.identifier && activeModalNft.identifier.toUpperCase().startsWith("GOALKEEPER")) || 
    (activeModalNft.name && activeModalNft.name.toLowerCase().includes("goalkeeper"));
  const fallbackImg = isKeeper ? "branding/original/GOALKEEPER-cb9e3e/logo.png" : "branding/original/EFOOTBALL-91a4eb/logo.png";

  const colStr = activeModalNft.collection || (activeModalNft.identifier ? activeModalNft.identifier.split("-").slice(0, 2).join("-") : (isKeeper ? KEEPER_COLLECTION : STRIKER_COLLECTION));
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

  showMarketToast(`⏳ Preparing transaction: Depositing NFT into Smart Contract escrow (${priceVal.toLocaleString("en-US")} $${currency})...`);

  const listBtn = document.getElementById("btn-confirm-listing");
  const origBtnText = listBtn ? listBtn.innerHTML : "";
  if (listBtn) {
    listBtn.disabled = true;
    listBtn.style.opacity = "0.7";
    listBtn.innerHTML = "⏳ Broadcasting...";
  }

  try {
    const txResult = await sendMultiversxTransaction({
      receiver: marketWallet.address,
      value: "0",
      gasLimit: 25000000,
      data: dataField,
      onSigned: () => {
        document.getElementById("list-nft-modal")?.classList.add("hidden");
        showMarketToast("📡 Transaction signed in wallet! Broadcasting to MultiversX network...", 0);
      }
    });

    document.getElementById("list-nft-modal")?.classList.add("hidden");
    if (priceInput) priceInput.value = "";

    const tier = getNftRarityTier(activeModalNft);
    const newListing = {
      id: `list-${activeModalNft.identifier || Date.now()}`,
      identifier: activeModalNft.identifier,
      collection: colStr,
      nonce: Number(nonceNum),
      name: activeModalNft.name || activeModalNft.identifier,
      rarity: tier.tierLabel,
      rank: tier.rank,
      trait: activeModalNft.trait || "Official NFooT SC Escrow Listing",
      url: activeModalNft.url || fallbackImg,
      price: priceVal,
      currency,
      paymentToken: paymentTokenStr,
      seller: marketWallet.address,
      createdAt: Date.now(),
      isOnChain: true
    };

    const listings = getMarketplaceListings().filter((x) => x.identifier !== activeModalNft.identifier);
    listings.unshift(newListing);
    saveMarketplaceListings(listings);

    if (!cachedScListings.some((x) => x.identifier === newListing.identifier)) {
      cachedScListings.unshift(newListing);
    }

    if (marketWallet.ownedNfts) {
      marketWallet.ownedNfts = marketWallet.ownedNfts.filter((x) => x.identifier !== activeModalNft.identifier && x.nonce !== activeModalNft.nonce);
    }

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    // Watch blockchain status of the transaction
    if (txResult?.hash && txResult.hash !== "broadcasted") {
      watchMarketTransaction(
        txResult.hash,
        async () => {
          if (marketWallet.address) {
            await fetchWalletNfts(marketWallet.address);
            await fetchLiveScListings();
            renderMarketplaceGrid();
            renderMyLockerGrid();
            renderTelemetry();
          }
        },
        async (failData) => {
          // Revert optimistic listing if transaction failed on-chain
          cachedScListings = (cachedScListings || []).filter((x) => x.identifier !== activeModalNft.identifier);
          const currentLocal = getMarketplaceListings().filter((x) => x.identifier !== activeModalNft.identifier);
          saveMarketplaceListings(currentLocal);

          if (marketWallet.address) {
            await fetchWalletNfts(marketWallet.address);
            await fetchLiveScListings();
            renderMarketplaceGrid();
            renderMyLockerGrid();
            renderTelemetry();
          }
        }
      );
    }

    // Trigger auto-refresh from blockchain
    setTimeout(async () => {
      if (marketWallet.address) {
        await fetchWalletNfts(marketWallet.address);
        await fetchLiveScListings();
        renderMarketplaceGrid();
        renderMyLockerGrid();
        renderTelemetry();
      }
    }, 4500);
    setTimeout(async () => {
      if (marketWallet.address) {
        await fetchWalletNfts(marketWallet.address);
        await fetchLiveScListings();
        renderMarketplaceGrid();
        renderMyLockerGrid();
        renderTelemetry();
      }
    }, 10000);

    const shortHash = txResult?.hash && txResult.hash !== "broadcasted" 
      ? ` (${txResult.hash.slice(0, 8)}...)` 
      : "";

    showMarketToast(
      `🎉 Listing live! ${activeModalNft.name || activeModalNft.identifier} is now listed for ${priceVal.toLocaleString("en-US")} $${currency} in Smart Contract escrow!${shortHash}`,
      7000
    );
  } catch (err) {
    console.error("Listing transaction failed:", err);
    showMarketToast(`❌ Listing transaction failed: ${err.message || "Cancelled"}`, 5000);
  } finally {
    if (listBtn) {
      listBtn.disabled = false;
      listBtn.style.opacity = "1";
      listBtn.innerHTML = origBtnText;
    }
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
      inputEl.placeholder = "e.g. 2500000";
    }
  }
  if (badgeEl) {
    const curr = (item.currency || "EGLD").toUpperCase();
    const isEgld = curr === "EGLD";
    badgeEl.innerHTML = `<img src="branding/icons/${isEgld ? 'egld-logo.svg' : 'efoo-logo.png'}" class="token-logo-img ${isEgld ? '' : 'round'}" width="18" height="18" style="vertical-align:middle; display:inline-block; margin-right:6px;" alt="${curr}" />${isEgld ? 'EGLD' : '$EFOO'}`;
  }

  modal?.classList.remove("hidden");
}

async function executeEditPrice() {
  if (!activeModalNft || !marketWallet.address) return;
  const inputEl = document.getElementById("edit-input-price");
  const currency = activeModalNft.currency || "EFOO";
  const newPrice = parseFloat(String(inputEl?.value || "").replace(/,/g, "").trim());

  if (currency === "EGLD") {
    if (isNaN(newPrice) || newPrice < 0.001) {
      showMarketToast("⚠️ Please enter a price of at least 0.001 EGLD.");
      return;
    }
  } else {
    if (isNaN(newPrice) || newPrice < 1000) {
      showMarketToast("⚠️ Please enter a price of at least 1,000 $EFOO.");
      return;
    }
  }

  const isKeeper = (activeModalNft.collection === KEEPER_COLLECTION) || 
    (activeModalNft.identifier && activeModalNft.identifier.toUpperCase().startsWith("GOALKEEPER")) || 
    (activeModalNft.name && activeModalNft.name.toLowerCase().includes("goalkeeper"));
  const colStr = activeModalNft.collection || (activeModalNft.identifier ? activeModalNft.identifier.split("-").slice(0, 2).join("-") : (isKeeper ? KEEPER_COLLECTION : STRIKER_COLLECTION));
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

  // updateListingPrice@<colHex>@<nonceHex>@<paymentTokenHex>@<priceHex> (DIRECT SC call: function name must be plain text UTF-8!)
  const dataField = `updateListingPrice@${colHex}@${nonceHex}@${paymentTokenHex}@${priceHex}`;

  showMarketToast(`⏳ Preparing price update transaction on Smart Contract...`);

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 20000000,
      data: dataField
    });

    const listings = getMarketplaceListings();
    const target = listings.find((x) => x.id === activeModalNft.id || x.identifier === activeModalNft.identifier);
    if (target) {
      target.price = newPrice;
      target.currency = currency;
      saveMarketplaceListings(listings);
    }

    const targetSc = (cachedScListings || []).find((x) => x.id === activeModalNft.id || x.identifier === activeModalNft.identifier);
    if (targetSc) {
      targetSc.price = newPrice;
      targetSc.currency = currency;
    }

    document.getElementById("edit-price-modal")?.classList.add("hidden");
    renderMarketplaceGrid();
    renderMyLockerGrid();

    setTimeout(async () => {
      if (marketWallet.address) {
        await fetchLiveScListings();
        renderMarketplaceGrid();
        renderMyLockerGrid();
      }
    }, 4500);

    showMarketToast(`💾 Price updated to ${newPrice.toLocaleString("en-US")} $${currency}!`);
  } catch (err) {
    console.error("Price update failed:", err);
    showMarketToast(`❌ Price update error: ${err.message || "Cancelled"}`);
  }
}

async function executeDelistNft(item) {
  if (!item || !marketWallet.address) return;

  const isKeeper = (item.collection === KEEPER_COLLECTION) || 
    (item.identifier && item.identifier.toUpperCase().startsWith("GOALKEEPER")) || 
    (item.name && item.name.toLowerCase().includes("goalkeeper"));
  const colStr = item.collection || (item.identifier ? item.identifier.split("-").slice(0, 2).join("-") : (isKeeper ? KEEPER_COLLECTION : STRIKER_COLLECTION));
  const colHex = stringToHex(colStr);
  let nonceNum = item.nonce;
  if (nonceNum === undefined || nonceNum === null) {
    const parts = (item.identifier || "").split("-");
    nonceNum = parts.length >= 3 ? parseInt(parts[parts.length - 1], 16) : 0;
  }
  let nonceHex = Number(nonceNum).toString(16);
  if (nonceHex.length % 2 !== 0) nonceHex = "0" + nonceHex;

  // delistNft@<colHex>@<nonceHex> (DIRECT SC call: function name must be plain text UTF-8!)
  const dataField = `delistNft@${colHex}@${nonceHex}`;

  showMarketToast(`⏳ Preparing delist transaction: Returning NFT from Smart Contract...`);

  try {
    const txResult = await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: "0",
      gasLimit: 20000000,
      data: dataField
    });

    // Remove from both local cache and active SC listings
    cachedScListings = (cachedScListings || []).filter((x) => x.id !== item.id && x.identifier !== item.identifier);
    let listings = getMarketplaceListings().filter((x) => x.id !== item.id && x.identifier !== item.identifier);
    saveMarketplaceListings(listings);

    // Add back to locker room (NFT is returning to user's wallet)
    if (!marketWallet.ownedNfts) marketWallet.ownedNfts = [];
    if (!marketWallet.ownedNfts.some((x) => x.identifier === item.identifier)) {
      marketWallet.ownedNfts.push({
        ...item,
        seller: marketWallet.address
      });
    }

    renderMarketplaceGrid();
    renderMyLockerGrid();
    renderTelemetry();

    const shortHash = txResult?.hash && txResult.hash !== "broadcasted" 
      ? ` (${txResult.hash.slice(0, 8)}...)` 
      : "";

    showMarketToast(`✅ Successfully delisted${shortHash}! ${item.name || item.identifier} returned to your locker!`);

    if (txResult?.hash && txResult.hash !== "broadcasted") {
      watchMarketTransaction(
        txResult.hash,
        async () => {
          if (marketWallet.address) {
            await fetchWalletNfts(marketWallet.address);
            await fetchLiveScListings();
            renderMarketplaceGrid();
            renderMyLockerGrid();
            renderTelemetry();
          }
        },
        async () => {
          if (marketWallet.address) {
            await fetchWalletNfts(marketWallet.address);
            await fetchLiveScListings();
            renderMarketplaceGrid();
            renderMyLockerGrid();
            renderTelemetry();
          }
        }
      );
    }

    // Refresh wallet NFTs & on-chain listings automatically after block inclusion
    setTimeout(async () => {
      if (marketWallet.address) {
        await fetchWalletNfts(marketWallet.address);
        await fetchLiveScListings();
        renderMarketplaceGrid();
        renderMyLockerGrid();
        renderTelemetry();
      }
    }, 4500);
    setTimeout(async () => {
      if (marketWallet.address) {
        await fetchWalletNfts(marketWallet.address);
        await fetchLiveScListings();
        renderMarketplaceGrid();
        renderMyLockerGrid();
        renderTelemetry();
      }
    }, 10000);
  } catch (err) {
    console.error("Delist failed:", err);
    showMarketToast(`❌ Delist error: ${err.message || "Cancelled"}`);
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

  const isPass = isUltrasPassNft(nft);
  const sftQty = parseInt(nft.balance || "1", 10) || 1;
  const sftFormatted = sftQty.toLocaleString("en-US");

  const isKeeper = (nft.collection === KEEPER_COLLECTION) || 
    (nft.identifier && nft.identifier.toUpperCase().startsWith("GOALKEEPER")) || 
    (nft.name && nft.name.toLowerCase().includes("goalkeeper"));
  const keeperFallback = "branding/original/GOALKEEPER-cb9e3e/logo.png";
  const strikerFallback = "branding/original/EFOOTBALL-91a4eb/logo.png";

  if (imgEl) imgEl.src = nft.url || (isPass ? "branding/rebranded/efoo-ultras-pass-badge.png" : (isKeeper ? keeperFallback : strikerFallback));
  if (rankPill) {
    if (isPass) {
      rankPill.textContent = `👑 VIP PASS • ${sftFormatted} SFT IN WALLET`;
      rankPill.style.borderColor = "#ffb800";
      rankPill.style.color = "#ffb800";
    } else {
      rankPill.textContent = `${tier.tierIcon} Rank #${tier.rank} • ${tier.tierLabel} • ${isKeeper ? "🧤 Keeper" : "⚽ Striker"}`;
      rankPill.style.borderColor = tier.borderColor;
      rankPill.style.color = tier.borderColor;
    }
  }
  if (colIdEl) colIdEl.textContent = isPass ? ULTRAS_PASS_COLLECTION : (nft.collection || (isKeeper ? KEEPER_COLLECTION : STRIKER_COLLECTION));
  if (nameEl) nameEl.textContent = nft.name || nft.identifier;
  if (traitEl) {
    traitEl.textContent = isPass
      ? "Exclusive MultiversX VIP Access SFT (0% Trading Fees for Life)"
      : (nft.trait || (isKeeper ? "Official Sunday League Goalkeeper" : "Sunday League Degen Ultra"));
  }

  // Powers
  if (powersList) {
    powersList.innerHTML = tier.powers
      .map((p) => `<span class="m-power-badge" style="${isPass ? 'border-color:#ffb800; color:#ffb800;' : ''}">${p}</span>`)
      .join("");
  }

  // Attributes table
  if (traitsTable) {
    const rawAttrs = isPass
      ? [
          { name: "Type", value: "VIP Membership SFT" },
          { name: "Wallet Balance", value: `${sftFormatted} SFT (VIP Active)` },
          { name: "Trading Fee", value: "0% (Zero Fees for Life)" },
          { name: "Match Booster", value: "+1.5x Multiplier & +1 Shield" },
          { name: "Max Supply", value: "300 SFT" },
          { name: "Collection", value: ULTRAS_PASS_COLLECTION }
        ]
      : (Array.isArray(nft.attributes) && nft.attributes.length
          ? nft.attributes.filter((a) => (a.name || a.trait_type) !== "OVR")
          : [
              { name: "Collection", value: nft.collection || (isKeeper ? KEEPER_COLLECTION : STRIKER_COLLECTION) },
              { name: "Role", value: isKeeper ? "Goalkeeper (🧤)" : "Striker (⚽)" },
              { name: "Rarity Rank", value: `#${tier.rank}` },
              { name: "Tier", value: tier.tierLabel }
            ]);
    traitsTable.innerHTML = rawAttrs
      .map((a) => `
        <div class="m-trait-cell">
          <span class="mtc-lbl">${a.name || a.trait_type}</span>
          <strong class="mtc-val" style="${isUltrasPassNft(nft) ? 'color:#ffb800;' : ''}">${a.value}</strong>
        </div>
      `)
      .join("");
  }

  // Price & Actions
  const allListings = getAllActiveListings();
  const listedItem = allListings.find((x) => x.id === nft.id || x.identifier === nft.identifier) || getMarketplaceListings().find((x) => x.id === nft.id || x.identifier === nft.identifier);

  if (listedItem) {
    const isEgld = listedItem.currency === "EGLD" || listedItem.currency === "WEGLD";
    const formattedPrice = isEgld
      ? (Number(listedItem.price) === 0.5 ? "0.50" : (Number(listedItem.price) < 0.1 ? Number(listedItem.price).toFixed(3) : Number(listedItem.price).toFixed(2)))
      : (typeof listedItem.price === "number" ? listedItem.price.toLocaleString("en-US") : listedItem.price);

    if (priceVal) {
      priceVal.innerHTML = `
        <div style="display:inline-flex; align-items:center; gap:8px;">
          <span style="font-family:var(--font-bebas); font-size:1.85rem; color:#ffffff; line-height:1;">${formattedPrice}</span>
          ${getCurrencyBadgeHtml(listedItem.currency)}
        </div>
      `;
    }
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
function showMarketToast(msg, duration = 4000) {
  const t = document.getElementById("m-toast");
  if (!t) return;
  t.innerHTML = msg;
  t.classList.remove("hidden");
  clearTimeout(t._timer);
  if (duration > 0) {
    t._timer = setTimeout(() => {
      t.classList.add("hidden");
    }, duration);
  }
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

  fetchUltrasPassStock();
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
  if (priceDisplay) priceDisplay.textContent = `${totalEgld} EGLD`;
  if (priceSub) priceSub.textContent = "";
}

async function fetchUltrasPassStock() {
  try {
    const res = await fetch("https://api.multiversx.com/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scAddress: STADIUM_VAULT_SC,
        funcName: "getUltrasPassStock",
        args: []
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.returnCode === "ok" && data?.data?.returnData?.length > 0) {
        const b64 = data.data.returnData[0];
        const hex = atob(b64).split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
        const stock = hex ? Number(BigInt("0x" + hex)) : 0;
        
        const badge1 = document.getElementById("m-minted-ultras-stat");
        if (badge1) {
          badge1.textContent = `${stock} in Stock (300 Total Cap)`;
          badge1.style.color = stock > 0 ? "#00ff88" : "#ff3b30";
        }
        const badge2 = document.getElementById("ultras-supply-stat");
        if (badge2) {
          badge2.textContent = stock > 0 
            ? `${stock} AVAILABLE • 300 SFT STRICTLY CAPPED SUPPLY`
            : "SOLD OUT IN THIS BATCH • 300 SFT STRICTLY CAPPED SUPPLY";
        }
        return stock;
      }
    }
  } catch (e) {
    console.warn("Could not query Ultras Pass stock:", e);
  }
  return null;
}

async function buyUltrasPassOnChain() {
  const isHu = currentMarketLang === "hu";
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast(isHu ? "⚠️ Kérlek előbb csatlakoztasd a tárcádat a vásárláshoz!" : "⚠️ Please connect your wallet first!");
    return;
  }

  const totalWei = "500000000000000000"; // 0.5 EGLD in wei
  const data = "buyUltrasPass";

  showMarketToast(
    isHu
      ? "⏳ Ultras PASS vásárlási tranzakció előkészítése (0.50 EGLD)..."
      : "⏳ Preparing Ultras PASS transaction (0.50 EGLD)..."
  );

  try {
    await sendMultiversxTransaction({
      receiver: STADIUM_VAULT_SC,
      value: totalWei,
      gasLimit: 15000000,
      data: data
    });

    localStorage.setItem(STORAGE_ULTRAS_PASS_PREFIX + marketWallet.address.toLowerCase(), "true");
    updateUltrasPassUI();
    updateListingFeePreview();
    fetchUltrasPassStock();

    showMarketToast(
      isHu
        ? "🎉 Gratulálunk! EFOO Ultras PASS sikeresen megvásárolva! A Smart Contract átadta az SFT-t a tárcádba, az örökös 0% kereskedési díj azonnal aktív!"
        : "🎉 Congratulations! EFOO Ultras PASS activated! The Smart Contract delivered the SFT to your wallet with lifetime 0% trading fee!"
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

const SWAP_TOKENS = {
  WEGLD: {
    symbol: "EGLD",
    realSymbol: "WEGLD",
    name: "EGLD",
    sub: "Wrapped EGLD (OneDex Direct)",
    identifier: "WEGLD-bd4d79",
    decimals: 18,
    icon: "branding/icons/egld-logo.svg",
    isRound: false,
    route: "OneDex AMM (Direct)",
    dex: "onedex_direct"
  },
  USDC: {
    symbol: "USDC",
    realSymbol: "USDC",
    name: "USDC",
    sub: "USD Coin (xExchange)",
    identifier: "USDC-c76f1f",
    decimals: 6,
    icon: "branding/icons/usdc-logo.svg",
    isRound: false,
    route: "xExchange (185.6M Pool)",
    dex: "xexchange"
  },
  FOXSY: {
    symbol: "FOXSY",
    realSymbol: "FOXSY",
    name: "FOXSY",
    sub: "Foxsy AI",
    identifier: "FOXSY-5d5f3e",
    decimals: 18,
    icon: "branding/icons/foxsy-logo.svg",
    isRound: true,
    route: "OneDex (FOXSY ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  MEX: {
    symbol: "MEX",
    realSymbol: "MEX",
    name: "MEX",
    sub: "xExchange Token",
    identifier: "MEX-455c57",
    decimals: 18,
    icon: "branding/icons/mex-logo.svg",
    isRound: false,
    route: "OneDex (MEX ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  WBTC: {
    symbol: "WBTC",
    realSymbol: "WBTC",
    name: "WBTC",
    sub: "Wrapped Bitcoin",
    identifier: "WBTC-5349b3",
    decimals: 8,
    icon: "branding/icons/wbtc-logo.svg",
    isRound: false,
    route: "OneDex (WBTC ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  WETH: {
    symbol: "WETH",
    realSymbol: "WETH",
    name: "WETH",
    sub: "Wrapped Ethereum",
    identifier: "WETH-b4ca29",
    decimals: 18,
    icon: "branding/icons/weth-logo.svg",
    isRound: false,
    route: "OneDex (WETH ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  XOXNO: {
    symbol: "XOXNO",
    realSymbol: "XOXNO",
    name: "XOXNO",
    sub: "XOXNO Token",
    identifier: "XOXNO-c1293a",
    decimals: 18,
    icon: "branding/icons/xoxno-logo.svg",
    isRound: true,
    route: "OneDex (XOXNO ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  BOBER: {
    symbol: "BOBER",
    realSymbol: "BOBER",
    name: "BOBER",
    sub: "Bober Kurwa",
    identifier: "BOBER-9eb764",
    decimals: 18,
    icon: "branding/icons/bober-logo.svg",
    isRound: true,
    route: "OneDex (BOBER ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  OFE: {
    symbol: "OFE",
    realSymbol: "OFE",
    name: "OFE",
    sub: "Ofero Network",
    identifier: "OFE-29eb54",
    decimals: 4,
    icon: "branding/icons/ofe-logo.svg",
    isRound: true,
    route: "OneDex Router (OFE ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  JEX: {
    symbol: "JEX",
    realSymbol: "JEX",
    name: "JEX",
    sub: "JEXchange",
    identifier: "JEX-9040ca",
    decimals: 18,
    icon: "branding/icons/jex-logo.svg",
    isRound: true,
    route: "OneDex (JEX ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  VICTOR: {
    symbol: "VICTOR",
    realSymbol: "VICTOR",
    name: "VICTOR",
    sub: "Victor Token",
    identifier: "VICTOR-9fa27f",
    decimals: 18,
    icon: "branding/icons/victor-logo.svg",
    isRound: true,
    route: "OneDex (VICTOR ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  WAM: {
    symbol: "WAM",
    realSymbol: "WAM",
    name: "WAM",
    sub: "WAM Gaming",
    identifier: "WAM-510e42",
    decimals: 18,
    icon: "branding/icons/wam-logo.svg",
    isRound: true,
    route: "OneDex Router (WAM ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  RARE: {
    symbol: "RARE",
    realSymbol: "RARE",
    name: "RARE",
    sub: "SuperRare Token",
    identifier: "RARE-99e8b0",
    decimals: 18,
    icon: "branding/icons/rare-logo.svg",
    isRound: true,
    route: "OneDex (RARE ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  JOJO: {
    symbol: "JOJO",
    realSymbol: "JOJO",
    name: "JOJO",
    sub: "JoJo Token",
    identifier: "JOJO-0e7858",
    decimals: 18,
    icon: "branding/icons/jojo-logo.svg",
    isRound: true,
    route: "OneDex (JOJO ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  SUPER: {
    symbol: "SUPER",
    realSymbol: "SUPER",
    name: "SUPER",
    sub: "SuperVerse",
    identifier: "SUPER-507aa6",
    decimals: 18,
    icon: "branding/icons/super-logo.svg",
    isRound: true,
    route: "OneDex Router (SUPER ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  PLATA: {
    symbol: "PLATA",
    realSymbol: "PLATA",
    name: "PLATA",
    sub: "Plata Token",
    identifier: "PLATA-9ba6c3",
    decimals: 8,
    icon: "branding/icons/plata-logo.svg",
    isRound: true,
    route: "OneDex (PLATA ➔ WEGLD ➔ EFOO)",
    dex: "onedex_hop"
  },
  EFOO: {
    symbol: "$EFOO",
    realSymbol: "EFOO",
    name: "$EFOO",
    sub: "Sunday League Degen FC",
    identifier: "EFOO-8fe2d4",
    decimals: 18,
    icon: "branding/icons/efoo-logo.png",
    isRound: true,
    route: "OneDex AMM (Sell to EGLD)",
    dex: "sell_efoo"
  }
};

let TOKEN_PRICES = {
  "WEGLD-bd4d79": 3.4626,
  "USDC-c76f1f": 1.0,
  "FOXSY-5d5f3e": 0.002647,
  "MEX-455c57": 0.0000004896,
  "WBTC-5349b3": 81006.57,
  "WETH-b4ca29": 2366.73,
  "XOXNO-c1293a": 0.006361,
  "BOBER-9eb764": 0.00004412,
  "OFE-29eb54": 0.0004763,
  "JEX-9040ca": 0.0003583,
  "VICTOR-9fa27f": 0.002716,
  "WAM-510e42": 0.0004124,
  "RARE-99e8b0": 0.0003397,
  "JOJO-0e7858": 0.01031,
  "SUPER-507aa6": 0.0005001,
  "PLATA-9ba6c3": 0.00001687,
  "EFOO-8fe2d4": 0.00000012257
};

async function fetchSwapTokenPrices() {
  try {
    const ids = Object.values(SWAP_TOKENS).map((t) => t.identifier).join(",");
    const res = await fetch(`${MULTIVERSX_API}/tokens?identifiers=${ids}`);
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        list.forEach((t) => {
          if (t && t.identifier && typeof t.price === "number") {
            TOKEN_PRICES[t.identifier] = t.price;
          }
        });
      }
      updateMarketSwapEstimate();
    }
  } catch (e) {}
}

function setMarketSwapToken(tokenVal) {
  const hiddenInput = document.getElementById("m-swap-token-select");
  if (hiddenInput) hiddenInput.value = tokenVal;

  const triggerIcon = document.getElementById("m-selected-token-icon");
  const triggerName = document.getElementById("m-selected-token-name");
  const menuList = document.getElementById("m-token-menu-list");
  const dropdownWrap = document.getElementById("m-swap-token-dropdown");

  const conf = SWAP_TOKENS[tokenVal] || SWAP_TOKENS.WEGLD;
  if (conf) {
    if (triggerIcon) {
      triggerIcon.src = conf.icon;
      triggerIcon.classList.toggle("round", !!conf.isRound);
    }
    if (triggerName) triggerName.textContent = conf.symbol || conf.name;
  }

  // Update active state in menu items
  document.querySelectorAll("#m-token-menu-list .token-dropdown-item").forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-token-val") === tokenVal);
  });

  // Close dropdown
  menuList?.classList.add("hidden");
  dropdownWrap?.classList.remove("open");

  updateMarketSwapEstimate();
}

let marketSwapSlippage = 1.0;

function applyMarketSwapMaxBalance() {
  const tokSelect = document.getElementById("m-swap-token-select");
  const amtInput = document.getElementById("m-swap-input-amt");
  if (!amtInput) return;

  const tok = tokSelect?.value || "WEGLD";
  const tConf = SWAP_TOKENS[tok] || SWAP_TOKENS.WEGLD;
  let maxBal = 0;

  if (tok === "EFOO") {
    maxBal = marketWallet.efooBalance || 0;
  } else if (tok === "WEGLD") {
    const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
    if (wegldBal > 0) {
      maxBal = wegldBal;
    } else {
      maxBal = Math.max(0, (marketWallet.egldBalance || 0) - 0.005);
    }
  } else {
    maxBal = (marketWallet.tokens && marketWallet.tokens[tConf.identifier]) || 0;
  }

  if (maxBal <= 0) {
    const isHu = currentMarketLang === "hu";
    showMarketToast(
      isHu
        ? `⚠️ Nincs elérhető ${tConf.symbol} egyenleg a tárcádban!`
        : `⚠️ No ${tConf.symbol} balance available in your wallet!`
    );
    return;
  }

  let formattedMax = "";
  if (tok === "EFOO") {
    formattedMax = String(Math.floor(maxBal));
  } else if (maxBal < 0.0001) {
    formattedMax = maxBal.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  } else if (maxBal < 1) {
    formattedMax = maxBal.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  } else {
    formattedMax = maxBal.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  }

  amtInput.value = formattedMax;
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
  const tok = tokSelect?.value || "WEGLD";
  const tConf = SWAP_TOKENS[tok] || SWAP_TOKENS.WEGLD;

  // Update Balance Hint
  if (balHint) {
    if (!marketWallet.address) {
      balHint.textContent = "Balance: —";
    } else if (tok === "EFOO") {
      balHint.textContent = `Balance: ${Math.floor(marketWallet.efooBalance || 0).toLocaleString()} $EFOO`;
    } else if (tok === "WEGLD") {
      const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
      balHint.textContent = `Balance: ${wegldBal.toFixed(4)} WEGLD (${(marketWallet.egldBalance || 0).toFixed(3)} EGLD)`;
    } else {
      const tBal = (marketWallet.tokens && marketWallet.tokens[tConf.identifier]) || 0;
      balHint.textContent = `Balance: ${tBal > 0 ? (tBal < 1 ? tBal.toFixed(4) : tBal.toLocaleString()) : "0"} ${tConf.symbol}`;
    }
  }

  if (tok === "EFOO") {
    // Selling EFOO for EGLD (WEGLD)
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
    if (actionBtn) actionBtn.textContent = `⚡ Sell ${amt.toLocaleString()} $EFOO ➔ EGLD`;
    updateMarketBonusUI(0);
  } else {
    // Buying EFOO
    let estOut = 0;
    let rateStr = "";
    let routeStr = tConf.route || "OneDex AMM";

    if (tok === "USDC") {
      const amtInWithFee = amt * 0.997;
      estOut = amt > 0 ? Math.floor((marketDexState.xexEfooReserve * amtInWithFee) / (marketDexState.xexUsdcReserve + amtInWithFee)) : 0;
      rateStr = `1 USDC ≈ ${marketDexState.efooPerUsdc.toLocaleString("en-US")} $EFOO`;
    } else if (tok === "WEGLD") {
      const amtInWithFee = amt * 0.99;
      estOut = amt > 0 ? Math.floor((marketDexState.onedexEfooReserve * amtInWithFee) / (marketDexState.onedexWegldReserve + amtInWithFee)) : 0;
      rateStr = `1 EGLD ≈ ${marketDexState.efooPerWegld.toLocaleString("en-US")} $EFOO`;
    } else {
      // Dynamic calculation for other tokens based on live USD pricing
      const tokenUsd = TOKEN_PRICES[tConf.identifier] || 0.01;
      const efooUsd = TOKEN_PRICES["EFOO-8fe2d4"] || 0.00000012257;
      const tokensPerEfoo = efooUsd > 0 ? (tokenUsd / efooUsd) : 1;
      estOut = Math.floor(amt * tokensPerEfoo * 0.985);
      rateStr = `1 ${tConf.symbol} ≈ ${Math.round(tokensPerEfoo).toLocaleString("en-US")} $EFOO`;
    }

    // Update manual bonus UI state & tooltip dynamically based on live estOut
    updateMarketBonusUI(estOut);

    const bonusCheckbox = document.getElementById("m-swap-bonus-checkbox");
    const isBonusApplied = bonusCheckbox && bonusCheckbox.checked && !bonusCheckbox.disabled;

    if (outField) {
      if (isBonusApplied) {
        outField.value = `~${estOut.toLocaleString("en-US")} + 500k BONUS = ~${(estOut + 500000).toLocaleString("en-US")} $EFOO 🎁`;
      } else {
        outField.value = `~${estOut.toLocaleString("en-US")} $EFOO`;
      }
    }
    if (recvIcon) {
      recvIcon.src = "branding/icons/efoo-logo.png";
      recvIcon.classList.add("round");
    }
    if (recvTicker) recvTicker.textContent = "$EFOO";
    if (rateLbl) rateLbl.textContent = rateStr;
    if (routeTag) routeTag.textContent = `Route: ${routeStr}`;
    if (actionBtn) actionBtn.textContent = `⚡ Swap ${amt} ${tConf.symbol} ➔ $EFOO On-Chain`;
  }
}

async function executeMarketSwap() {
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast("⚠️ Please connect your wallet first!");
    return;
  }

  const amt = Math.max(0.0001, parseFloat(document.getElementById("m-swap-input-amt")?.value) || 0.01);
  const tok = document.getElementById("m-swap-token-select")?.value || "WEGLD";
  const tConf = SWAP_TOKENS[tok] || SWAP_TOKENS.WEGLD;

  showMarketToast(`⏳ Preparing DEX Swap: ${amt} ${tConf.symbol}...`);

  try {
    if (tok === "EFOO") {
      // Selling EFOO -> WEGLD (unwrap to native EGLD)
      const efooHex = stringToHex("EFOO-8fe2d4");
      const wegldHex = stringToHex("WEGLD-bd4d79");
      const amtHex = bigIntToHex(toAtomicUnits(amt, 18));
      const funcHex = stringToHex("swapMultiTokensFixedInput");
      const data = `ESDTTransfer@${efooHex}@${amtHex}@${funcHex}@01@01@${efooHex}@${wegldHex}`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data
      });
    } else if (tok === "WEGLD") {
      // Direct Single-Transaction WEGLD -> EFOO swap (No separate wrap transaction!)
      const tokenHex = stringToHex("WEGLD-bd4d79");
      const amtHex = bigIntToHex(toAtomicUnits(amt, 18));
      const funcHex = stringToHex("swapMultiTokensFixedInput");
      const efooHex = stringToHex("EFOO-8fe2d4");
      const data = `ESDTTransfer@${tokenHex}@${amtHex}@${funcHex}@01@@${tokenHex}@${efooHex}`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 85000000,
        data
      });
    } else if (tok === "USDC") {
      // xExchange USDC -> EFOO
      const usdcHex = stringToHex("USDC-c76f1f");
      const amtHex = bigIntToHex(toAtomicUnits(amt, 6));
      const funcHex = stringToHex("swapTokensFixedInput");
      const efooHex = stringToHex("EFOO-8fe2d4");
      const data = `ESDTTransfer@${usdcHex}@${amtHex}@${funcHex}@${efooHex}@01`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.XEXCHANGE_PAIR,
        value: "0",
        gasLimit: 60000000,
        data
      });
    } else {
      // Multi-hop routing on OneDex: TokenIn -> WEGLD -> EFOO
      const tokenInHex = stringToHex(tConf.identifier);
      const dec = tConf.decimals !== undefined ? tConf.decimals : 18;
      const amtHex = bigIntToHex(toAtomicUnits(amt, dec));
      const funcHex = stringToHex("swapMultiTokensFixedInput");
      const wegldHex = stringToHex("WEGLD-bd4d79");
      const efooHex = stringToHex("EFOO-8fe2d4");
      const data = `ESDTTransfer@${tokenInHex}@${amtHex}@${funcHex}@01@@${tokenInHex}@${wegldHex}@${efooHex}`;

      await sendMultiversxTransaction({
        receiver: CONTRACTS.ONEDEX_PAIR,
        value: "0",
        gasLimit: 95000000,
        data
      });
    }

    const bonusCheckbox = document.getElementById("m-swap-bonus-checkbox");
    const isBonusChecked = bonusCheckbox && bonusCheckbox.checked && !bonusCheckbox.disabled;

    let bonusToast = "";
    if (isBonusChecked) {
      markAddressClaimedBonus(marketWallet.address);
      bonusToast = " 🎁 +500,000 $EFOO Starter Bonus claimed from Stadium Vault!";
    }

    showMarketToast(
      `🎉 Swap transaction dispatched! Your $EFOO is being confirmed on-chain!${bonusToast}`,
      8000
    );

    // Refresh wallet balances
    setTimeout(() => {
      if (marketWallet.address) fetchWalletBalances(marketWallet.address);
    }, 6000);
  } catch (err) {
    console.error("Swap execution failed:", err);
    showMarketToast(
      `❌ Swap error: ${err.message || "Cancelled"}`,
      5000
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
  // Cleanse any legacy phantom non-escrowed listings from local storage
  try {
    saveMarketplaceListings(getMarketplaceListings());
  } catch (e) {}

  initMarketWallet();
  updateExtensionBadge();
  setTimeout(updateExtensionBadge, 500);
  refreshOnChainVaultStats();
  renderMarketplaceGrid();
  renderSkillsStore();
  fetchLiveXoxnoListings();
  fetchLiveScListings();
  fetchLiveMinterCounts();
  fetchSwapTokenPrices();

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
    if (tab === "swap") {
      fetchSwapTokenPrices();
      updateMarketSwapEstimate();
      updateMarketBonusUI();
    }
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
  document.getElementById("m-swap-max-btn")?.addEventListener("click", applyMarketSwapMaxBalance);
  document.getElementById("m-swap-pay-bal")?.addEventListener("click", applyMarketSwapMaxBalance);

  document.querySelectorAll(".m-slip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".m-slip-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      marketSwapSlippage = parseFloat(btn.getAttribute("data-slip")) || 1.0;
      updateMarketSwapEstimate();
    });
  });

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
    const currentVal = document.getElementById("m-swap-token-select")?.value || "WEGLD";
    const nextVal = currentVal === "EFOO" ? "WEGLD" : "EFOO";
    setMarketSwapToken(nextVal);
  });

  document.getElementById("m-btn-exec-swap")?.addEventListener("click", executeMarketSwap);

  // Manual Starter Bonus Checkbox & Info Tooltip Handlers
  const swapBonusCheckbox = document.getElementById("m-swap-bonus-checkbox");
  swapBonusCheckbox?.addEventListener("change", () => {
    const row = document.getElementById("m-swap-bonus-row");
    if (row && !swapBonusCheckbox.disabled) {
      row.classList.toggle("checked", swapBonusCheckbox.checked);
    }
    updateMarketSwapEstimate();
  });

  const bonusInfoWrap = document.getElementById("m-bonus-info-wrap");
  const bonusInfoBtn = document.getElementById("m-bonus-info-btn");
  if (bonusInfoBtn && bonusInfoWrap) {
    bonusInfoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      bonusInfoWrap.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!bonusInfoWrap.contains(e.target)) {
        bonusInfoWrap.classList.remove("active");
      }
    });
  }

  // Liquidity Pool Calculator
  document.getElementById("lp-calc-deposit")?.addEventListener("input", updateLpCalculator);

  // Filters
  document.querySelectorAll("[data-filter-col]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("[data-filter-col]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterCollection = btn.getAttribute("data-filter-col") || "all";
      marketCurrentPage = 1;
      renderMarketplaceGrid();
    });
  });

  document.getElementById("select-rarity-filter")?.addEventListener("change", (e) => {
    filterRarity = e.target.value;
    marketCurrentPage = 1;
    renderMarketplaceGrid();
  });

  document.getElementById("select-sort-order")?.addEventListener("change", (e) => {
    sortOrder = e.target.value;
    marketCurrentPage = 1;
    renderMarketplaceGrid();
  });

  // Marketplace Pagination & Page Size controls
  document.querySelectorAll(".m-page-size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sz = btn.getAttribute("data-size");
      marketPageSize = sz === "all" ? "all" : parseInt(sz, 10);
      try { localStorage.setItem("efoo_market_page_size", String(marketPageSize)); } catch (e) {}
      marketCurrentPage = 1;
      renderMarketplaceGrid();
    });
  });

  document.getElementById("m-btn-prev-page")?.addEventListener("click", () => {
    if (marketCurrentPage > 1 && marketPageSize !== "all") {
      marketCurrentPage--;
      renderMarketplaceGrid();
      scrollToMarketGrid();
    }
  });

  document.getElementById("m-btn-next-page")?.addEventListener("click", () => {
    const totalCount = getAllActiveListings().length;
    const pageSizeNum = marketPageSize === "all" ? totalCount : Number(marketPageSize);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSizeNum));
    if (marketCurrentPage < totalPages && marketPageSize !== "all") {
      marketCurrentPage++;
      renderMarketplaceGrid();
      scrollToMarketGrid();
    }
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

  // Listing modal custom currency dropdown toggle & selection
  const listCurrTriggerBtn = document.getElementById("list-currency-trigger-btn");
  const listCurrMenuList = document.getElementById("list-currency-menu-list");
  const listCurrDropdownWrap = document.getElementById("list-currency-dropdown");

  listCurrTriggerBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = listCurrMenuList?.classList.contains("hidden");
    listCurrMenuList?.classList.toggle("hidden", !isHidden);
    listCurrDropdownWrap?.classList.toggle("open", isHidden);
  });

  document.querySelectorAll("#list-currency-menu-list .token-dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = item.getAttribute("data-currency-val");
      if (val) setListingCurrency(val);
    });
  });

  document.addEventListener("click", (e) => {
    if (!listCurrDropdownWrap?.contains(e.target)) {
      listCurrMenuList?.classList.add("hidden");
      listCurrDropdownWrap?.classList.remove("open");
    }
  });

  // Direct On-Chain Add Liquidity Handlers
  document.getElementById("m-btn-add-egld-pool")?.addEventListener("click", () => openAddLiquidityModal("WEGLD"));
  document.getElementById("m-btn-add-usdc-pool")?.addEventListener("click", () => openAddLiquidityModal("USDC"));
  document.getElementById("m-close-liq-modal")?.addEventListener("click", () => {
    document.getElementById("m-add-liquidity-modal")?.classList.add("hidden");
  });
  document.getElementById("m-add-liquidity-modal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("m-add-liquidity-modal")) {
      document.getElementById("m-add-liquidity-modal")?.classList.add("hidden");
    }
  });
  document.getElementById("m-liq-input-a")?.addEventListener("input", updateLiqCalculation);
  document.getElementById("m-btn-confirm-add-liq")?.addEventListener("click", executeAddLiquidityOnChain);

  document.getElementById("m-liq-max-a")?.addEventListener("click", () => {
    const inputA = document.getElementById("m-liq-input-a");
    if (!inputA) return;
    if (activeLiqPool === "WEGLD") {
      const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
      const egldBal = marketWallet.egldBalance || 0;
      const avail = wegldBal > 0 ? wegldBal : Math.max(0, egldBal - 0.005);
      inputA.value = avail.toFixed(4);
    } else {
      const usdcBal = (marketWallet.tokens && marketWallet.tokens["USDC-c76f1f"]) || 0;
      inputA.value = usdcBal.toFixed(2);
    }
    updateLiqCalculation();
  });

  document.getElementById("m-liq-max-b")?.addEventListener("click", () => {
    const inputA = document.getElementById("m-liq-input-a");
    const inputB = document.getElementById("m-liq-input-b");
    const efooBal = marketWallet.efooBalance || 0;
    if (!inputA || !inputB || efooBal <= 0) return;
    inputB.value = String(Math.floor(efooBal));
    const rate = activeLiqPool === "WEGLD" ? 30004200 : 1180000;
    inputA.value = (efooBal / rate).toFixed(4);
  });
});

// ============================================================================
// 1-TIME 500k $EFOO STARTER BONUS & ANTI-BOT GATED CONDITIONS
// Requirements: Holds min 1 EFOOTBALL/GOALKEEPER NFT OR scored >= 5 goals
// ============================================================================
function getClaimedBonusAddresses() {
  try {
    const raw = localStorage.getItem("efoo_claimed_bonus_addresses");
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function hasAddressClaimedBonus(addr) {
  if (!addr) return false;
  const list = getClaimedBonusAddresses();
  return list.includes(addr.toLowerCase().trim());
}

function markAddressClaimedBonus(addr) {
  if (!addr) return;
  const clean = addr.toLowerCase().trim();
  const list = getClaimedBonusAddresses();
  if (!list.includes(clean)) {
    list.push(clean);
    localStorage.setItem("efoo_claimed_bonus_addresses", JSON.stringify(list));
  }
  updateMarketBonusUI();
  updateMarketSwapEstimate();
}

function getBonusEligibilityState(address, ownedNfts) {
  const nfts = Array.isArray(ownedNfts) ? ownedNfts : (marketWallet.ownedNfts || []);
  const matchingNfts = nfts.filter((nft) => {
    const col = (nft.collection || nft.identifier || "").toUpperCase();
    return col.startsWith("EFOOTBALL-") || col.startsWith("GOALKEEPER-") || col.startsWith("FOOTBALL-");
  });
  const hasQualifyingNft = matchingNfts.length > 0;

  let goalsScored = 0;
  try {
    if (address) {
      const addrKey = "efoo_player_goals_" + address.toLowerCase();
      goalsScored = parseInt(localStorage.getItem(addrKey), 10) || 0;
    }
    if (!goalsScored) {
      goalsScored = parseInt(localStorage.getItem("efoo_total_goals_scored"), 10) || 0;
    }
  } catch (e) {}

  const hasFiveGoals = goalsScored >= 5;
  const isEligible = hasQualifyingNft || hasFiveGoals;
  const isClaimed = address ? hasAddressClaimedBonus(address) : false;

  return {
    isEligible,
    isClaimed,
    hasQualifyingNft,
    nftCount: matchingNfts.length,
    hasFiveGoals,
    goalsScored
  };
}

function updateMarketBonusUI(currentEstOut = null) {
  const row = document.getElementById("m-swap-bonus-row");
  const checkbox = document.getElementById("m-swap-bonus-checkbox");
  const labelText = document.getElementById("m-bonus-label-text");
  const nftItem = document.getElementById("m-btt-nft");
  const nftIcon = document.getElementById("m-btt-nft-icon");
  const nftText = document.getElementById("m-btt-nft-text");
  const goalsItem = document.getElementById("m-btt-goals");
  const goalsIcon = document.getElementById("m-btt-goals-icon");
  const goalsText = document.getElementById("m-btt-goals-text");
  const amtItem = document.getElementById("m-btt-amt");
  const amtIcon = document.getElementById("m-btt-amt-icon");
  const amtText = document.getElementById("m-btt-amt-text");
  const statusText = document.getElementById("m-bonus-tt-status-text");
  const linksBox = document.getElementById("m-bonus-tt-links");

  if (!row || !checkbox) return;

  const addr = marketWallet.address;
  const tok = document.getElementById("m-swap-token-select")?.value || "WEGLD";
  const isBuyingEfoo = (tok !== "EFOO");

  // Determine current estimated output if not passed
  let estOut = typeof currentEstOut === "number" ? currentEstOut : 0;
  if (currentEstOut === null) {
    const rawVal = (document.getElementById("m-swap-output-amt")?.value || "").replace(/[^0-9.]/g, "");
    estOut = parseFloat(rawVal) || 0;
  }

  const meetsMinOutput = estOut >= 1000000;
  const state = getBonusEligibilityState(addr, marketWallet.ownedNfts);

  // Update tooltip criteria items
  if (nftIcon && nftText && nftItem) {
    const met = state.hasQualifyingNft;
    nftIcon.textContent = met ? "✔" : "○";
    nftItem.className = "m-btt-item " + (met ? "met" : "unmet");
    nftText.textContent = `Own min. 1 EFOOTBALL / GOALKEEPER NFT (${state.nftCount} owned)`;
  }

  if (goalsIcon && goalsText && goalsItem) {
    const met = state.hasFiveGoals;
    goalsIcon.textContent = met ? "✔" : "○";
    goalsItem.className = "m-btt-item " + (met ? "met" : "unmet");
    goalsText.textContent = `Score min. 5 goals in-game (${state.goalsScored}/5 scored)`;
  }

  if (amtIcon && amtText && amtItem) {
    const met = meetsMinOutput;
    amtIcon.textContent = met ? "✔" : "○";
    amtItem.className = "m-btt-item " + (met ? "met" : "unmet");
    amtText.textContent = `Swap output min. 1,000,000 $EFOO (${estOut > 0 ? "~" + Math.floor(estOut).toLocaleString("en-US") : "0"} est.)`;
  }

  // 1. Not connected
  if (!addr) {
    checkbox.disabled = true;
    checkbox.checked = false;
    row.className = "m-swap-bonus-row disabled";
    if (labelText) {
      labelText.innerHTML = `<strong>🎁 +500,000 $EFOO</strong> Starter Bonus <span class="m-bonus-badge locked">Connect Wallet</span>`;
    }
    if (statusText) statusText.textContent = "Connect wallet to check eligibility";
    if (linksBox) linksBox.style.display = "none";
    return;
  }

  // 2. Already claimed
  if (state.isClaimed) {
    checkbox.disabled = true;
    checkbox.checked = false;
    row.className = "m-swap-bonus-row claimed";
    if (labelText) {
      labelText.innerHTML = `<strong>🎁 +500,000 $EFOO</strong> Starter Bonus <span class="m-bonus-badge claimed">Already Claimed</span>`;
    }
    if (statusText) statusText.textContent = "Already Claimed (Strictly 1x per address)";
    if (linksBox) linksBox.style.display = "none";
    return;
  }

  // 3. Selling EFOO (bonus only when buying EFOO)
  if (!isBuyingEfoo) {
    checkbox.disabled = true;
    checkbox.checked = false;
    row.className = "m-swap-bonus-row disabled";
    if (labelText) {
      labelText.innerHTML = `<strong>🎁 +500,000 $EFOO</strong> Starter Bonus`;
    }
    if (statusText) statusText.textContent = "Available only when buying $EFOO";
    if (linksBox) linksBox.style.display = "none";
    return;
  }

  // 4. Anti-Bot Condition NOT met (0 NFTs and <5 goals)
  if (!state.isEligible) {
    checkbox.disabled = true;
    checkbox.checked = false;
    row.className = "m-swap-bonus-row disabled";
    if (labelText) {
      labelText.innerHTML = `<strong>🎁 +500,000 $EFOO</strong> Starter Bonus <span class="m-bonus-badge locked">Locked</span>`;
    }
    if (statusText) statusText.textContent = "Locked (Requires 1 NFT or 5 goals)";
    if (linksBox) linksBox.style.display = "flex";
    return;
  }

  // 5. Anti-Bot condition MET, but swap output < 1,000,000 $EFOO
  if (!meetsMinOutput) {
    checkbox.disabled = true;
    checkbox.checked = false;
    row.className = "m-swap-bonus-row disabled";
    if (labelText) {
      labelText.innerHTML = `<strong>🎁 +500,000 $EFOO</strong> Starter Bonus <span class="m-bonus-badge locked">Min. 1M $EFOO</span>`;
    }
    if (statusText) statusText.textContent = "Swap output must be at least 1,000,000 $EFOO";
    if (linksBox) linksBox.style.display = "none";
    return;
  }

  // 6. ALL CONDITIONS FULLY MET! Eligible to manually activate!
  checkbox.disabled = false;
  row.className = "m-swap-bonus-row eligible" + (checkbox.checked ? " checked" : "");
  if (labelText) {
    labelText.innerHTML = `<strong>🎁 +500,000 $EFOO</strong> Starter Bonus <span class="m-bonus-badge eligible">Eligible</span>`;
  }
  if (statusText) {
    statusText.textContent = checkbox.checked ? "Activated (Bonus applied to swap!)" : "Eligible • Check box to activate";
  }
  if (linksBox) linksBox.style.display = "none";
}

// ============================================================================
// DIRECT ON-CHAIN ADD LIQUIDITY (100% In-DApp • Zero Redirection!)
// ============================================================================
let activeLiqPool = "WEGLD";

function openAddLiquidityModal(poolKey) {
  activeLiqPool = poolKey || "WEGLD";
  const modal = document.getElementById("m-add-liquidity-modal");
  const title = document.getElementById("m-liq-modal-title");
  const sym = document.getElementById("m-liq-token-a-sym");
  const icon = document.getElementById("m-liq-token-a-icon");
  const rateLbl = document.getElementById("m-liq-rate-lbl");
  const settlLbl = document.getElementById("m-liq-settlement-lbl");
  const inputA = document.getElementById("m-liq-input-a");
  const inputB = document.getElementById("m-liq-input-b");
  const balA = document.getElementById("m-liq-token-a-bal");
  const balB = document.getElementById("m-liq-token-b-bal");
  const subDesc = document.getElementById("m-liq-sub-desc");
  const autoWrapNote = document.getElementById("m-liq-autowrap-note");

  if (activeLiqPool === "WEGLD") {
    if (title) title.textContent = "ADD WEGLD / $EFOO LIQUIDITY";
    if (sym) sym.textContent = "WEGLD";
    if (icon) icon.src = "branding/icons/wegld-logo.svg";
    if (rateLbl) rateLbl.textContent = "1 WEGLD / EGLD ≈ 30,004,200 $EFOO";
    if (settlLbl) settlLbl.textContent = "Direct OneDex AMM Pair";
    if (inputA) inputA.value = "0.05";
    if (inputB) inputB.value = String(Math.floor(0.05 * 30004200));

    const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
    const egldBal = marketWallet.egldBalance || 0;
    const totalAvail = wegldBal + Math.max(0, egldBal - 0.008);
    if (balA) balA.textContent = `WEGLD: ${wegldBal.toFixed(4)} | EGLD: ${egldBal.toFixed(4)}`;
    if (subDesc) subDesc.textContent = `Total Available: ${totalAvail.toFixed(4)} (Auto-wraps EGLD)`;
    if (autoWrapNote) autoWrapNote.textContent = "⚡ In-DApp Auto-Wrap";
  } else {
    if (title) title.textContent = "ADD USDC / $EFOO LIQUIDITY";
    if (sym) sym.textContent = "USDC";
    if (icon) icon.src = "branding/icons/usdc-logo.svg";
    if (rateLbl) rateLbl.textContent = "1 USDC ≈ 1,180,000 $EFOO";
    if (settlLbl) settlLbl.textContent = "Direct xExchange Pair";
    if (inputA) inputA.value = "5";
    if (inputB) inputB.value = String(Math.floor(5 * 1180000));

    const usdcBal = (marketWallet.tokens && marketWallet.tokens["USDC-c76f1f"]) || 0;
    if (balA) balA.textContent = `Balance: ${usdcBal.toFixed(2)} USDC`;
    if (subDesc) subDesc.textContent = "Direct xExchange AMM Pair";
    if (autoWrapNote) autoWrapNote.textContent = "🔒 100% In-DApp";
  }

  const efooBal = marketWallet.efooBalance || 0;
  if (balB) balB.textContent = `Balance: ${Math.floor(efooBal).toLocaleString("en-US")} $EFOO`;

  updateLiqCalculation();
  modal?.classList.remove("hidden");
}

function updateLiqCalculation() {
  const inputA = document.getElementById("m-liq-input-a");
  const inputB = document.getElementById("m-liq-input-b");
  const btn = document.getElementById("m-btn-confirm-add-liq");
  if (!inputA || !inputB) return;
  const aVal = parseFloat(inputA.value) || 0;

  if (activeLiqPool === "WEGLD") {
    inputB.value = String(Math.floor(aVal * 30004200));
    const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
    const egldBal = marketWallet.egldBalance || 0;
    const totalAvail = wegldBal + Math.max(0, egldBal - 0.008);

    if (btn) {
      if (aVal <= 0) {
        btn.textContent = "💧 ENTER DEPOSIT AMOUNT";
      } else if (wegldBal >= aVal) {
        btn.textContent = "💧 DEPOSIT LIQUIDITY (DIRECT WEGLD)";
      } else if (totalAvail >= aVal) {
        btn.textContent = "⚡ AUTO-WRAP EGLD & DEPOSIT LIQUIDITY";
      } else {
        btn.textContent = "⚠️ INSUFFICIENT BALANCE";
      }
    }
  } else {
    inputB.value = String(Math.floor(aVal * 1180000));
    if (btn) {
      btn.textContent = "💧 DEPOSIT USDC LIQUIDITY ON-CHAIN";
    }
  }
}

async function executeAddLiquidityOnChain() {
  if (!marketWallet.address) {
    document.getElementById("m-wallet-modal")?.classList.remove("hidden");
    showMarketToast("⚠️ Please connect your wallet first!");
    return;
  }

  const inputA = document.getElementById("m-liq-input-a");
  const inputB = document.getElementById("m-liq-input-b");
  const aVal = parseFloat(inputA?.value) || 0;
  const bVal = parseFloat(inputB?.value) || 0;

  if (aVal <= 0 || bVal <= 0) {
    showMarketToast("⚠️ Please enter valid deposit amounts!");
    return;
  }

  if ((marketWallet.efooBalance || 0) < bVal) {
    showMarketToast(`⚠️ Insufficient $EFOO balance! Needed: ${bVal.toLocaleString("en-US")} $EFOO (Your balance: ${Math.floor(marketWallet.efooBalance || 0).toLocaleString("en-US")} $EFOO)`);
    return;
  }

  const pairSc = activeLiqPool === "WEGLD" ? CONTRACTS.ONEDEX_PAIR : CONTRACTS.XEXCHANGE_PAIR;
  const pairHex = bech32ToHex(pairSc);
  const tokenAId = activeLiqPool === "WEGLD" ? "WEGLD-bd4d79" : "USDC-c76f1f";
  const tokenADecimals = activeLiqPool === "WEGLD" ? 18 : 6;
  const tokenBId = "EFOO-8fe2d4";

  const tokAHex = stringToHex(tokenAId);
  const amtAHex = bigIntToHex(toAtomicUnits(aVal, tokenADecimals));
  const tokBHex = stringToHex(tokenBId);
  const amtBHex = bigIntToHex(toAtomicUnits(bVal, 18));
  const funcHex = stringToHex("addLiquidity");

  // MultiversX on-chain MultiESDTNFTTransfer data format:
  // MultiESDTNFTTransfer@<destination_hex_64>@02@<token1_id_hex>@@<amt1_hex>@<token2_id_hex>@@<amt2_hex>@<func_hex>@01@01
  let depositData = "";
  if (activeLiqPool === "WEGLD") {
    // OneDex pair order: WEGLD, EFOO
    depositData = `MultiESDTNFTTransfer@${pairHex}@02@${tokAHex}@@${amtAHex}@${tokBHex}@@${amtBHex}@${funcHex}@01@01`;
  } else {
    // xExchange pair order: EFOO, USDC
    depositData = `MultiESDTNFTTransfer@${pairHex}@02@${tokBHex}@@${amtBHex}@${tokAHex}@@${amtAHex}@${funcHex}@01@01`;
  }

  if (activeLiqPool === "WEGLD") {
    const wegldBal = (marketWallet.tokens && marketWallet.tokens["WEGLD-bd4d79"]) || 0;
    const egldBal = marketWallet.egldBalance || 0;
    const totalAvail = wegldBal + Math.max(0, egldBal - 0.008);

    if (totalAvail < aVal) {
      showMarketToast(`⚠️ Insufficient balance! Needed: ${aVal} WEGLD/EGLD (You have: ${wegldBal.toFixed(4)} WEGLD / ${egldBal.toFixed(4)} EGLD)`);
      return;
    }

    let txsToSend = [];
    if (wegldBal >= aVal) {
      showMarketToast("⏳ Preparing direct OneDex Liquidity Deposit (100% In-DApp)...");
      txsToSend.push({
        receiver: marketWallet.address,
        value: "0",
        gasLimit: 85000000,
        data: depositData
      });
    } else {
      const neededWrap = aVal - wegldBal;
      const shard = marketWallet.shard !== undefined ? marketWallet.shard : 1;
      const shardWrapper = CONTRACTS.WEGLD_WRAPPERS[shard] || CONTRACTS.WEGLD_WRAPPERS[1];
      const wrapWei = toAtomicUnits(neededWrap, 18).toString();

      showMarketToast(`⚡ In-DApp Auto-Wrap & Deposit: Wrapping ${neededWrap.toFixed(4)} EGLD & depositing into OneDex (Zero Redirect)...`);

      txsToSend.push({
        receiver: shardWrapper,
        value: wrapWei,
        gasLimit: 8000000,
        data: "wrapEgld"
      });
      txsToSend.push({
        receiver: marketWallet.address,
        value: "0",
        gasLimit: 85000000,
        data: depositData
      });
    }

    try {
      const txResult = await sendMultiversxTransaction({ txs: txsToSend });
      document.getElementById("m-add-liquidity-modal")?.classList.add("hidden");

      const shortHash = txResult?.hash && txResult.hash !== "broadcasted" ? ` (${txResult.hash.slice(0, 8)}...)` : "";
      showMarketToast(`🎉 Liquidity deposit submitted${shortHash}! 100% In-DApp — now earning trading fees!`, 8000);

      if (txResult?.hash && txResult.hash !== "broadcasted") {
        watchMarketTransaction(txResult.hash, async () => {
          if (marketWallet.address) fetchWalletBalances(marketWallet.address);
        });
      }

      setTimeout(() => {
        if (marketWallet.address) fetchWalletBalances(marketWallet.address);
      }, 5000);
    } catch (err) {
      console.error("Add liquidity failed:", err);
      showMarketToast(`❌ Liquidity deposit error: ${err.message || "Cancelled"}`);
    }
  } else {
    const usdcBal = (marketWallet.tokens && marketWallet.tokens["USDC-c76f1f"]) || 0;
    if (usdcBal < aVal) {
      showMarketToast(`⚠️ Insufficient USDC balance! Needed: ${aVal} USDC (You have: ${usdcBal.toFixed(2)} USDC)`);
      return;
    }

    showMarketToast("⏳ Preparing USDC & $EFOO xExchange Liquidity Deposit (100% In-DApp)...");

    try {
      const txResult = await sendMultiversxTransaction({
        receiver: marketWallet.address,
        value: "0",
        gasLimit: 85000000,
        data: depositData
      });
      document.getElementById("m-add-liquidity-modal")?.classList.add("hidden");

      const shortHash = txResult?.hash && txResult.hash !== "broadcasted" ? ` (${txResult.hash.slice(0, 8)}...)` : "";
      showMarketToast(`🎉 Liquidity deposit submitted${shortHash}! Direct in-dApp deposit to xExchange!`, 8000);

      if (txResult?.hash && txResult.hash !== "broadcasted") {
        watchMarketTransaction(txResult.hash, async () => {
          if (marketWallet.address) fetchWalletBalances(marketWallet.address);
        });
      }

      setTimeout(() => {
        if (marketWallet.address) fetchWalletBalances(marketWallet.address);
      }, 5000);
    } catch (err) {
      console.error("USDC Add liquidity failed:", err);
      showMarketToast(`❌ Liquidity deposit error: ${err.message || "Cancelled"}`);
    }
  }
}

