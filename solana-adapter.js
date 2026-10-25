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

  const PHANTOM_ICON_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" class="phantom-icon-svg" style="vertical-align:middle; display:inline-block;"><rect width="24" height="24" rx="12" fill="#AB9FF2"/><path d="M5.7655 15.797C5.7655 17.222 6.49879 17.55 7.26141 17.55C8.87463 17.55 10.087 16.0841 10.8105 14.9256C10.7225 15.1819 10.6736 15.4382 10.6736 15.6842C10.6736 16.3609 11.0452 16.8427 11.7785 16.8427C12.7855 16.8427 13.861 15.92 14.4183 14.9256C14.3792 15.0692 14.3596 15.2024 14.3596 15.3254C14.3596 15.797 14.6138 16.0943 15.132 16.0943C16.7648 16.0943 18.4074 13.0701 18.4074 10.4252C18.4074 8.36459 17.4101 6.55005 14.9071 6.55005C10.5074 6.55005 5.7655 12.1679 5.7655 15.797ZM13.3917 10.1996C13.3917 9.68705 13.6654 9.32825 14.0663 9.32825C14.4574 9.32825 14.7312 9.68705 14.7312 10.1996C14.7312 10.7122 14.4574 11.0813 14.0663 11.0813C13.6654 11.0813 13.3917 10.7122 13.3917 10.1996ZM15.484 10.1996C15.484 9.68705 15.7578 9.32825 16.1586 9.32825C16.5497 9.32825 16.8235 9.68705 16.8235 10.1996C16.8235 10.7122 16.5497 11.0813 16.1586 11.0813C15.7578 11.0813 15.484 10.7122 15.484 10.1996Z" fill="#FEFDF8"/></svg>`;

  const PHANTOM_ICON_LARGE = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" class="phantom-icon-svg" style="vertical-align:middle; display:inline-block;"><rect width="24" height="24" rx="6" fill="#AB9FF2"/><path d="M5.7655 15.797C5.7655 17.222 6.49879 17.55 7.26141 17.55C8.87463 17.55 10.087 16.0841 10.8105 14.9256C10.7225 15.1819 10.6736 15.4382 10.6736 15.6842C10.6736 16.3609 11.0452 16.8427 11.7785 16.8427C12.7855 16.8427 13.861 15.92 14.4183 14.9256C14.3792 15.0692 14.3596 15.2024 14.3596 15.3254C14.3596 15.797 14.6138 16.0943 15.132 16.0943C16.7648 16.0943 18.4074 13.0701 18.4074 10.4252C18.4074 8.36459 17.4101 6.55005 14.9071 6.55005C10.5074 6.55005 5.7655 12.1679 5.7655 15.797ZM13.3917 10.1996C13.3917 9.68705 13.6654 9.32825 14.0663 9.32825C14.4574 9.32825 14.7312 9.68705 14.7312 10.1996C14.7312 10.7122 14.4574 11.0813 14.0663 11.0813C13.6654 11.0813 13.3917 10.7122 13.3917 10.1996ZM15.484 10.1996C15.484 9.68705 15.7578 9.32825 16.1586 9.32825C16.5497 9.32825 16.8235 9.68705 16.8235 10.1996C16.8235 10.7122 16.5497 11.0813 16.1586 11.0813C15.7578 11.0813 15.484 10.7122 15.484 10.1996Z" fill="#FEFDF8"/></svg>`;

  const SOLANA_ICON_SVG = `<svg viewBox="0 0 397 311" width="16" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" class="solana-icon-svg" style="vertical-align:middle; display:inline-block;"><defs><linearGradient id="solLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#00FFA3"/><stop offset="100%" stop-color="#DC1FFF"/></linearGradient></defs><path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zm267.8 115.1c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solLogoGrad)"/></svg>`;

  const SOLANA_BADGE_SVG = `<svg viewBox="0 0 32 32" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" class="solana-badge-svg" style="vertical-align:middle; display:inline-block;"><defs><linearGradient id="solBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14F195"/><stop offset="100%" stop-color="#9945FF"/></linearGradient></defs><circle cx="16" cy="16" r="16" fill="#000"/><path d="M9.925 19.687a.59.59 0 01.415-.17h14.366a.29.29 0 01.207.497l-2.838 2.815a.59.59 0 01-.415.171H7.294a.291.291 0 01-.207-.498l2.838-2.815zm0-10.517A.59.59 0 0110.34 9h14.366c.261 0 .392.314.207.498l-2.838 2.815a.59.59 0 01-.415.17H7.294a.291.291 0 01-.207-.497L9.925 9.17zm12.15 5.225a.59.59 0 00-.415-.17H7.294a.291.291 0 00-.207.498l2.838 2.815c.11.109.26.17.415.17h14.366a.291.291 0 00.207-.498l-2.838-2.815z" fill="url(#solBadgeGrad)"/></svg>`;

  const MULTIVERSX_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 200 200" class="egld-icon-svg" aria-hidden="true"><circle cx="100" cy="100" r="100" fill="#000000"/><path fill="#23f7dd" d="M 105.65625 99.953125 L 152.476562 75.019531 L 144.613281 60 L 101.714844 77.234375 C 100.617188 77.683594 99.382812 77.683594 98.285156 77.234375 L 55.386719 60 L 47.5 75.066406 L 94.320312 100 L 47.5 124.933594 L 55.386719 140 L 98.285156 122.632812 C 99.382812 122.1875 100.617188 122.1875 101.714844 122.632812 L 144.613281 139.914062 L 152.5 124.847656 Z M 105.65625 99.953125 "/></svg>`;

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
    PHANTOM_ICON_SVG,
    PHANTOM_ICON_LARGE,
    SOLANA_ICON_SVG,
    SOLANA_BADGE_SVG,
    MULTIVERSX_ICON_SVG,
    isSolanaAddress,
    getPhantomProvider,
    rpcCall,
    fetchAccountData,
    connectPhantom,
    disconnectPhantom
  };
})(typeof window !== "undefined" ? window : this);
