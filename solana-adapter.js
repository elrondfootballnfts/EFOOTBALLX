/**
 * EFOOTBALLX - Solana Devnet Web3 Adapter
 * Handles Phantom / Solflare wallet connection, Devnet RPC queries for $EFOO SPL tokens and EFOO Ultras VIP Pass SFT.
 */
(function (window) {
  "use strict";

  const SOLANA_CONFIG = {
    CLUSTER: "devnet",
    RPC_URL: "https://api.devnet.solana.com",
    EFOO_MINT: "EB5Zr98z8iGcd7tsP4YXLpPqfwa46FmsqFcop2ztFs2K",
    ULTRAS_PASS_MINT: "8T7GWartHkssv5uL9Ru4QEsVXVKouK5wbqBnA4LvJDak",
    EXPLORER_BASE: "https://explorer.solana.com"
  };

  function isSolanaAddress(addr) {
    if (!addr || typeof addr !== "string") return false;
    const clean = addr.trim();
    if (clean.startsWith("erd1")) return false;
    return clean.length >= 32 && clean.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(clean);
  }

  function getPhantomProvider() {
    if (typeof window === "undefined") return null;
    if (window.phantom && window.phantom.solana && window.phantom.solana.isPhantom) {
      return window.phantom.solana;
    }
    if (window.solana && window.solana.isPhantom) {
      return window.solana;
    }
    return null;
  }

  async function rpcCall(method, params = []) {
    const res = await fetch(SOLANA_CONFIG.RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params
      })
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error.message || "Solana RPC error");
    }
    return json.result;
  }

  async function fetchAccountData(pubkey) {
    if (!isSolanaAddress(pubkey)) {
      return { solBalance: 0, efooBalance: 0, hasUltrasPass: false };
    }

    try {
      const [solRes, tokenRes] = await Promise.allSettled([
        rpcCall("getBalance", [pubkey, { commitment: "confirmed" }]),
        rpcCall("getTokenAccountsByOwner", [
          pubkey,
          { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
          { encoding: "jsonParsed", commitment: "confirmed" }
        ])
      ]);

      let solBalance = 0;
      if (solRes.status === "fulfilled" && solRes.value && typeof solRes.value.value === "number") {
        solBalance = solRes.value.value / 1e9;
      }

      let efooBalance = 0;
      let hasUltrasPass = false;

      if (tokenRes.status === "fulfilled" && tokenRes.value && Array.isArray(tokenRes.value.value)) {
        tokenRes.value.value.forEach((item) => {
          const info = item?.account?.data?.parsed?.info;
          if (!info) return;
          const mint = info.mint;
          const amount = Number(info.tokenAmount?.uiAmount || 0);

          if (mint === SOLANA_CONFIG.EFOO_MINT) {
            efooBalance = amount;
          }
          if (mint === SOLANA_CONFIG.ULTRAS_PASS_MINT && amount >= 1) {
            hasUltrasPass = true;
          }
        });
      }

      return {
        solBalance,
        efooBalance,
        hasUltrasPass,
        pubkey
      };
    } catch (err) {
      console.warn("[SolanaAdapter] Error fetching account data:", err);
      return { solBalance: 0, efooBalance: 0, hasUltrasPass: false, pubkey };
    }
  }

  async function connectPhantom() {
    const provider = getPhantomProvider();
    if (!provider) {
      window.open("https://phantom.app/", "_blank");
      throw new Error("PHANTOM_NOT_INSTALLED");
    }

    const resp = await provider.connect();
    const pubkey = resp.publicKey.toString();

    // Persist session
    try {
      localStorage.setItem("efoo_wallet_address", pubkey);
      localStorage.setItem("efoo_wallet_provider", "phantom");
      localStorage.setItem("efoo_active_chain", "solana_devnet");
      localStorage.setItem("multiversx_address", ""); // clear MVX address to avoid conflict
    } catch (e) {}

    return pubkey;
  }

  async function disconnectPhantom() {
    const provider = getPhantomProvider();
    if (provider && provider.disconnect) {
      try {
        await provider.disconnect();
      } catch (e) {}
    }
    try {
      if (localStorage.getItem("efoo_wallet_provider") === "phantom") {
        localStorage.removeItem("efoo_wallet_address");
        localStorage.removeItem("efoo_wallet_provider");
        localStorage.removeItem("efoo_active_chain");
      }
    } catch (e) {}
  }

  window.SolanaAdapter = {
    CONFIG: SOLANA_CONFIG,
    isSolanaAddress,
    getPhantomProvider,
    rpcCall,
    fetchAccountData,
    connectPhantom,
    disconnectPhantom
  };
})(typeof window !== "undefined" ? window : this);
