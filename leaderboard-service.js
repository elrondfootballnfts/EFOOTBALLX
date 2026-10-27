/**
 * ============================================================================
 * EFOOTBALLX — REAL-TIME GLOBAL DUAL LEADERBOARD SERVICE (FIREBASE REST API)
 * ============================================================================
 * 
 * Supports both:
 * 1. ⚡ WEEKLY DERBY LEADERBOARD: Resets weekly, tied to the 25.4M Stadium Jackpot.
 * 2. 👑 ALL-TIME HALL OF FAME: Permanent career records and all-time personal bests.
 * 
 * Features:
 * - 100% Free: Uses Google Firebase Realtime Database HTTPS REST API (Zero SDK needed).
 * - High-Score Guarantee: A lower score NEVER overwrites a higher personal best.
 * - Deduplication: Each MultiversX or Solana wallet appears at most once in Top ranks.
 * - Seamless Fallback: Automatically falls back to localStorage if offline.
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

  const STORAGE_LOCAL_KEY_WEEKLY = "efoo_leaderboard_v2";
  const STORAGE_LOCAL_KEY_ALLTIME = "efoo_leaderboard_alltime_v1";
  const STORAGE_URL_KEY = "efoo_firebase_rtdb_url";
  const DEFAULT_FIREBASE_URL = "https://efootballx-leaderboard-default-rtdb.europe-west1.firebasedatabase.app";

  let memoryCacheWeekly = null;
  let memoryCacheAllTime = null;
  let isFetchingWeekly = false;
  let isFetchingAllTime = false;
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
    fetchAll();
  }

  function sanitizeKey(address) {
    if (!address) return "guest";
    return String(address).toLowerCase().replace(/[^a-z0-9_]/g, "_");
  }

  function getLocalLeaderboard(type = "weekly") {
    const key = type === "alltime" ? STORAGE_LOCAL_KEY_ALLTIME : STORAGE_LOCAL_KEY_WEEKLY;
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {}
    return [];
  }

  function setLocalLeaderboard(list, type = "weekly") {
    const key = type === "alltime" ? STORAGE_LOCAL_KEY_ALLTIME : STORAGE_LOCAL_KEY_WEEKLY;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch (e) {}
  }

  function processRawLeaderboard(rawObject, maxItems = 25) {
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

    return sorted.slice(0, maxItems);
  }

  function notifyUpdate(list, type = "weekly") {
    if (type === "alltime") {
      memoryCacheAllTime = list;
    } else {
      memoryCacheWeekly = list;
    }
    setLocalLeaderboard(list, type);

    if (typeof window !== "undefined") {
      const evt = new CustomEvent("efoo:leaderboard-updated", {
        detail: { list, type }
      });
      window.dispatchEvent(evt);
    }
  }

  /**
   * Fetch weekly leaderboard (Top 10 / Top 25)
   */
  async function fetchWeeklyLeaderboard() {
    if (isFetchingWeekly) return memoryCacheWeekly || getLocalLeaderboard("weekly");
    isFetchingWeekly = true;

    const url = `${getBaseUrl()}/leaderboard.json`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        const topList = processRawLeaderboard(data, 20);
        notifyUpdate(topList, "weekly");
        isFetchingWeekly = false;
        return topList;
      }
    } catch (err) {
      console.warn("[EfooLeaderboard] Weekly fetch failed, using local cache:", err.message);
    }

    isFetchingWeekly = false;
    const fallback = getLocalLeaderboard("weekly");
    memoryCacheWeekly = fallback;
    return fallback;
  }

  /**
   * Fetch permanent All-Time Hall of Fame leaderboard
   */
  async function fetchAllTimeLeaderboard() {
    if (isFetchingAllTime) return memoryCacheAllTime || getLocalLeaderboard("alltime");
    isFetchingAllTime = true;

    const url = `${getBaseUrl()}/leaderboard_alltime.json`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        let data = await res.json();

        // Auto-seed: If all-time is initially empty, seed it from weekly / existing records
        if (!data || Object.keys(data).length === 0) {
          const weeklyData = memoryCacheWeekly || getLocalLeaderboard("weekly");
          if (weeklyData && weeklyData.length > 0) {
            console.log("[EfooLeaderboard] Seeding initial All-Time Hall of Fame from historical records...");
            data = {};
            weeklyData.forEach(item => {
              if (item.address) {
                const k = sanitizeKey(item.address);
                data[k] = item;
              }
            });
            // Background PUT to Firebase to persist All-Time baseline
            fetch(`${getBaseUrl()}/leaderboard_alltime.json`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            }).catch(() => {});
          }
        }

        const topList = processRawLeaderboard(data, 50);
        notifyUpdate(topList, "alltime");
        isFetchingAllTime = false;
        return topList;
      }
    } catch (err) {
      console.warn("[EfooLeaderboard] All-time fetch failed, using local cache:", err.message);
    }

    isFetchingAllTime = false;
    const fallback = getLocalLeaderboard("alltime");
    memoryCacheAllTime = fallback;
    return fallback;
  }

  /**
   * Universal fetch: fetches requested type or default weekly
   */
  async function fetchLeaderboard(type = "weekly") {
    if (type === "alltime") {
      return fetchAllTimeLeaderboard();
    }
    return fetchWeeklyLeaderboard();
  }

  /**
   * Fetch both tables in parallel
   */
  async function fetchAll() {
    return Promise.all([fetchWeeklyLeaderboard(), fetchAllTimeLeaderboard()]);
  }

  /**
   * Record a completed match to BOTH:
   * 1. Weekly Leaderboard (may be wiped at end of cycle for new jackpot)
   * 2. All-Time Hall of Fame (PERMANENT CAREER RECORDS)
   */
  async function recordScore(data) {
    if (!data || typeof data.score !== "number" || data.score <= 0) return null;

    const rawAddr = (data.address || "guest_player").trim();
    const isGuest = (!rawAddr.startsWith("erd1") && rawAddr.length < 32) || rawAddr.startsWith("guest");
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

    // 1. Instantly update Weekly in LocalStorage
    const localWeekly = getLocalLeaderboard("weekly");
    const wIdx = localWeekly.findIndex(x => x.address && x.address.toLowerCase() === rawAddr.toLowerCase());
    if (wIdx !== -1) {
      if (score > localWeekly[wIdx].score) {
        localWeekly[wIdx] = { ...localWeekly[wIdx], ...payload };
      }
    } else {
      localWeekly.push(payload);
    }
    const procWeekly = processRawLeaderboard(localWeekly, 20);
    notifyUpdate(procWeekly, "weekly");

    // 2. Instantly update All-Time in LocalStorage (Permanent Best)
    const localAllTime = getLocalLeaderboard("alltime");
    const aIdx = localAllTime.findIndex(x => x.address && x.address.toLowerCase() === rawAddr.toLowerCase());
    if (aIdx !== -1) {
      if (score > localAllTime[aIdx].score) {
        localAllTime[aIdx] = { ...localAllTime[aIdx], ...payload };
      }
    } else {
      localAllTime.push(payload);
    }
    const procAllTime = processRawLeaderboard(localAllTime, 50);
    notifyUpdate(procAllTime, "alltime");

    if (isGuest) {
      const myItem = procWeekly.find(x => x.address.toLowerCase() === rawAddr.toLowerCase());
      return myItem ? myItem.rank : null;
    }

    // 3. Central Firebase Sync for BOTH Weekly & All-Time
    const syncSingleTable = async (tablePath) => {
      const singleUrl = `${getBaseUrl()}/${tablePath}/${key}.json`;
      try {
        const checkRes = await fetch(singleUrl, { method: "GET" });
        if (checkRes.ok) {
          const existing = await checkRes.json();
          if (existing && typeof existing.score === "number" && existing.score >= score) {
            // Keep existing higher score, only patch metadata if changed
            if ((typeof isUltras === "boolean" && isUltras !== existing.isUltras) || (herotag && !existing.herotag)) {
              await fetch(singleUrl, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isUltras: !!isUltras, herotag: herotag || existing.herotag })
              });
            }
            return;
          }
        }

        // Write new high-score
        await fetch(singleUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn(`[EfooLeaderboard] Sync to ${tablePath} warning:`, err.message);
      }
    };

    // Parallel sync to weekly and alltime
    await Promise.all([
      syncSingleTable("leaderboard"),         // Weekly
      syncSingleTable("leaderboard_alltime")   // Permanent All-Time
    ]);

    // Refresh memory caches
    await fetchAll();
    const curList = memoryCacheWeekly || procWeekly;
    const match = curList.find(x => x.address.toLowerCase() === rawAddr.toLowerCase());
    return match ? match.rank : null;
  }

  /**
   * Delete a player entry (Admin function).
   */
  async function deletePlayer(address, target = "both") {
    if (!address) return;
    const key = sanitizeKey(address);
    try {
      if (target === "weekly" || target === "both") {
        await fetch(`${getBaseUrl()}/leaderboard/${key}.json`, { method: "DELETE" });
        const localList = getLocalLeaderboard("weekly").filter(x => x.address && x.address.toLowerCase() !== address.toLowerCase());
        notifyUpdate(localList, "weekly");
      }
      if (target === "alltime" || target === "both") {
        await fetch(`${getBaseUrl()}/leaderboard_alltime/${key}.json`, { method: "DELETE" });
        const localList = getLocalLeaderboard("alltime").filter(x => x.address && x.address.toLowerCase() !== address.toLowerCase());
        notifyUpdate(localList, "alltime");
      }
    } catch (e) {}

    return fetchAll();
  }

  /**
   * Reset / clear Weekly leaderboard (Admin weekly jackpot cycle restart).
   * IMPORTANT: NEVER touches leaderboard_alltime!
   */
  async function clearWeekly() {
    try {
      await fetch(`${getBaseUrl()}/leaderboard.json`, { method: "DELETE" });
    } catch (e) {}
    notifyUpdate([], "weekly");
    console.log("[EfooLeaderboard] ✅ Weekly leaderboard reset. All-Time Hall of Fame remains 100% intact.");
  }

  /**
   * clearAll(): Safe by default — only clears weekly, preserves All-Time Hall of Fame.
   */
  async function clearAll(options = {}) {
    await clearWeekly();
    if (options && options.wipeAllTimePermanently === true) {
      try {
        await fetch(`${getBaseUrl()}/leaderboard_alltime.json`, { method: "DELETE" });
      } catch (e) {}
      notifyUpdate([], "alltime");
    }
  }

  /**
   * Server-Sent Events (SSE) listener
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
            fetchAll();
          }
        } catch (err) {}
      });

      sseSource.onerror = () => {
        try { sseSource.close(); } catch (e) {}
        sseSource = null;
      };
    } catch (e) {}
  }

  // Periodic poll fallback when page is visible
  if (typeof window !== "undefined") {
    setInterval(() => {
      if (!document.hidden && !isFetchingWeekly && !isFetchingAllTime) {
        fetchAll();
      }
    }, 25000);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) fetchAll();
    });

    // Auto-init
    setTimeout(() => {
      fetchAll();
      setupSSE();
    }, 200);
  }

  return {
    getBaseUrl,
    setBaseUrl,
    getLeaderboardSync: (type = "weekly") => {
      if (type === "alltime") {
        return memoryCacheAllTime || getLocalLeaderboard("alltime");
      }
      return memoryCacheWeekly || getLocalLeaderboard("weekly");
    },
    fetchLeaderboard,
    fetchWeeklyLeaderboard,
    fetchAllTimeLeaderboard,
    fetchAll,
    recordScore,
    deletePlayer,
    clearWeekly,
    clearAll,
    onUpdate: (cb) => {
      if (typeof window !== "undefined" && typeof cb === "function") {
        window.addEventListener("efoo:leaderboard-updated", (e) => {
          const detail = e.detail || {};
          cb(detail.list || [], detail.type || "weekly");
        });
      }
    }
  };
});
