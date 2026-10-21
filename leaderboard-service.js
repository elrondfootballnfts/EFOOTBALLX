/**
 * ============================================================================
 * EFOOTBALLX — REAL-TIME GLOBAL LEADERBOARD SERVICE (FIREBASE REST API)
 * ============================================================================
 * 
 * Synchronizes player high-scores worldwide in real-time across all devices.
 * 
 * Features:
 * - 100% Free: Uses Google Firebase Realtime Database HTTPS REST API (Zero SDK needed).
 * - High-Score Guarantee: A lower score NEVER overwrites a higher personal best.
 * - Deduplication: Each MultiversX wallet (erd1...) appears at most once in Top 10.
 * - Seamless Fallback: Automatically falls back to localStorage if offline or no network.
 * - Live Event Sync: Dispatches 'efoo:leaderboard-updated' on changes for instant UI refresh.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EfooLeaderboard = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  const STORAGE_LOCAL_KEY = "efoo_leaderboard_v2";
  const STORAGE_URL_KEY = "efoo_firebase_rtdb_url";
  const DEFAULT_FIREBASE_URL = "https://efootballx-leaderboard-default-rtdb.europe-west1.firebasedatabase.app";

  let memoryCache = null;
  let isFetching = false;
  let sseSource = null;

  function getBaseUrl() {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_URL_KEY);
        if (stored && stored.trim().startsWith("http")) return stored.trim().replace(/\/+$/, "");
        if (window.EFOO_FIREBASE_URL && window.EFOO_FIREBASE_URL.trim().startsWith("http")) {
          return window.EFOO_FIREBASE_URL.trim().replace(/\/+$/, "");
        }
      }
    } catch (e) {}
    return DEFAULT_FIREBASE_URL;
  }

  function setBaseUrl(url) {
    if (!url) return;
    const clean = String(url).trim().replace(/\/+$/, "");
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_URL_KEY, clean);
      }
      if (typeof window !== "undefined") {
        window.EFOO_FIREBASE_URL = clean;
      }
    } catch (e) {}
    setupSSE();
    fetchLeaderboard();
  }

  function sanitizeKey(address) {
    if (!address) return "guest";
    return String(address).toLowerCase().replace(/[^a-z0-9_]/g, "_");
  }

  function getLocalLeaderboard() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(STORAGE_LOCAL_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {}
    return [];
  }

  function setLocalLeaderboard(list) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_LOCAL_KEY, JSON.stringify(list));
      }
    } catch (e) {}
  }

  function processRawLeaderboard(rawObject) {
    const list = [];
    if (!rawObject) return list;

    if (Array.isArray(rawObject)) {
      rawObject.forEach(item => { if (item && item.address) list.push(item); });
    } else if (typeof rawObject === "object") {
      Object.keys(rawObject).forEach(key => {
        const item = rawObject[key];
        if (item && item.address) list.push(item);
      });
    }

    // Filter valid wallets / guests
    const cleanList = list.filter(row => {
      if (!row || !row.address) return false;
      const addr = String(row.address).trim().toLowerCase();
      if (addr.includes("...")) return false;
      if (row.isSimulated) return false;
      return true;
    });

    // Deduplication by address: keep STRICTLY each address's highest score
    const bestByAddress = new Map();
    cleanList.forEach(row => {
      const key = String(row.address).toLowerCase();
      const scoreNum = Number(row.score) || 0;
      const candidate = {
        ...row,
        score: scoreNum,
        goals: Number(row.goals) || 0,
        level: Number(row.level) || 1,
        date: row.date || (row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "Just now")
      };

      const existing = bestByAddress.get(key);
      if (!existing || scoreNum > existing.score) {
        bestByAddress.set(key, candidate);
      }
    });

    const sorted = Array.from(bestByAddress.values());
    sorted.sort((a, b) => b.score - a.score);
    sorted.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return sorted.slice(0, 10);
  }

  function notifyUpdate(top10) {
    memoryCache = top10;
    setLocalLeaderboard(top10);
    if (typeof window !== "undefined") {
      const evt = new CustomEvent("efoo:leaderboard-updated", { detail: { list: top10 } });
      window.dispatchEvent(evt);
    }
  }

  /**
   * Fetch current global leaderboard from Firebase.
   * Falls back to local cached copy on failure.
   */
  async function fetchLeaderboard() {
    if (isFetching) return memoryCache || getLocalLeaderboard();
    isFetching = true;

    const url = `${getBaseUrl()}/leaderboard.json`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        const top10 = processRawLeaderboard(data);
        notifyUpdate(top10);
        isFetching = false;
        return top10;
      }
    } catch (err) {
      console.warn("[EfooLeaderboard] Central fetch failed, using local cache:", err.message);
    }

    isFetching = false;
    const fallback = getLocalLeaderboard();
    memoryCache = fallback;
    return fallback;
  }

  /**
   * Record a completed match to the central Firebase database.
   * If an entry already exists for this wallet, updates ONLY IF new score > previous score.
   */
  async function recordScore(data) {
    if (!data || typeof data.score !== "number" || data.score <= 0) return null;

    const rawAddr = (data.address || "guest_player").trim();
    const isGuest = !rawAddr.startsWith("erd1") || rawAddr.length !== 62;
    const key = sanitizeKey(rawAddr);
    const score = data.score;
    const goals = data.goals || 0;
    const level = data.level || 1;
    const herotag = data.herotag || "";
    const isUltras = !!data.isUltras;

    const payload = {
      address: rawAddr,
      score: score,
      goals: goals,
      level: level,
      herotag: herotag,
      nickname: data.nickname || (isGuest ? "Guest Striker" : (herotag ? "" : "Striker")),
      isGuest: isGuest,
      isUltras: isUltras,
      updatedAt: Date.now(),
      date: new Date().toLocaleDateString()
    };

    // 1. Immediately update local storage so UI reacts instantly
    const localList = getLocalLeaderboard();
    const localIdx = localList.findIndex(x => x.address && x.address.toLowerCase() === rawAddr.toLowerCase());
    if (localIdx !== -1) {
      if (score > localList[localIdx].score) {
        localList[localIdx] = { ...localList[localIdx], ...payload };
      }
    } else {
      localList.push(payload);
    }
    const processedLocal = processRawLeaderboard(localList);
    notifyUpdate(processedLocal);

    // If it's a guest without a real wallet, do not push to public on-chain prize database
    if (isGuest) {
      const myItem = processedLocal.find(x => x.address.toLowerCase() === rawAddr.toLowerCase());
      return myItem ? myItem.rank : null;
    }

    // 2. Fetch existing record from Firebase to ensure strictly highest score is kept
    const singleUrl = `${getBaseUrl()}/leaderboard/${key}.json`;
    try {
      const checkRes = await fetch(singleUrl, { method: "GET" });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing && typeof existing.score === "number" && existing.score >= score) {
          // Existing record is already higher or equal - DO NOT OVERWRITE!
          console.log(`[EfooLeaderboard] Preserving existing personal best (${existing.score} pts >= ${score} pts) for ${rawAddr}`);
          // Just update herotag or ultras badge if missing
          if ((isUltras && !existing.isUltras) || (herotag && !existing.herotag)) {
            await fetch(singleUrl, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isUltras: true, herotag: herotag || existing.herotag })
            });
          }
          await fetchLeaderboard();
          const curList = memoryCache || processedLocal;
          const match = curList.find(x => x.address.toLowerCase() === rawAddr.toLowerCase());
          return match ? match.rank : null;
        }
      }

      // New high-score! Write to Firebase
      const putRes = await fetch(singleUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (putRes.ok) {
        console.log(`[EfooLeaderboard] ✅ High score recorded to central database: ${score} pts for ${rawAddr}`);
        const freshList = await fetchLeaderboard();
        const match = freshList.find(x => x.address.toLowerCase() === rawAddr.toLowerCase());
        return match ? match.rank : null;
      }
    } catch (err) {
      console.warn("[EfooLeaderboard] Central PUT failed, using local score:", err.message);
    }

    const match = (memoryCache || processedLocal).find(x => x.address.toLowerCase() === rawAddr.toLowerCase());
    return match ? match.rank : null;
  }

  /**
   * Delete a player entry (Admin function).
   */
  async function deletePlayer(address) {
    if (!address) return;
    const key = sanitizeKey(address);
    try {
      await fetch(`${getBaseUrl()}/leaderboard/${key}.json`, { method: "DELETE" });
    } catch (e) {}

    const localList = getLocalLeaderboard().filter(x => x.address && x.address.toLowerCase() !== address.toLowerCase());
    notifyUpdate(localList);
    return fetchLeaderboard();
  }

  /**
   * Reset / clear entire leaderboard (Admin weekly reset).
   */
  async function clearAll() {
    try {
      await fetch(`${getBaseUrl()}/leaderboard.json`, { method: "DELETE" });
    } catch (e) {}
    notifyUpdate([]);
  }

  /**
   * Set up Server-Sent Events (SSE) for zero-latency live updates across open browser tabs.
   */
  function setupSSE() {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;
    if (sseSource) {
      try { sseSource.close(); } catch (e) {}
      sseSource = null;
    }

    try {
      const sseUrl = `${getBaseUrl()}/leaderboard.json`;
      sseSource = new EventSource(sseUrl);

      sseSource.addEventListener("put", (e) => {
        if (!e || !e.data) return;
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.data !== undefined) {
            fetchLeaderboard();
          }
        } catch (err) {}
      });

      sseSource.onerror = () => {
        // Fallback: poll every 30s when window is visible
        try { sseSource.close(); } catch (e) {}
        sseSource = null;
      };
    } catch (e) {}
  }

  // Periodic poll fallback when page is visible
  if (typeof window !== "undefined") {
    setInterval(() => {
      if (!document.hidden && !isFetching) {
        fetchLeaderboard();
      }
    }, 25000);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) fetchLeaderboard();
    });

    // Auto-init
    setTimeout(() => {
      fetchLeaderboard();
      setupSSE();
    }, 300);
  }

  return {
    getBaseUrl,
    setBaseUrl,
    getLeaderboardSync: () => memoryCache || getLocalLeaderboard(),
    fetchLeaderboard,
    recordScore,
    deletePlayer,
    clearAll,
    onUpdate: (cb) => {
      if (typeof window !== "undefined" && typeof cb === "function") {
        window.addEventListener("efoo:leaderboard-updated", (e) => cb(e.detail ? e.detail.list : []));
      }
    }
  };
});
