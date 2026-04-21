/**
 * Zingcade platform progression and badge engine.
 * Local-first, versioned, and shared by every live cabinet.
 */

window.Zingcade = (function () {
  const STORAGE_KEY = "zingcade-profile-v2";
  const LEGACY_KEY = "zingcade-profile-v1";
  const VERSION = 2;

  const RANKS = [
    { id: "bronze", name: "Bronze", floor: 0, color: "#cd7f32" },
    { id: "silver", name: "Silver", floor: 1000, color: "#c0c0c0" },
    { id: "gold", name: "Gold", floor: 4500, color: "#ffd700" },
    { id: "platinum", name: "Platinum", floor: 12000, color: "#e5e4e2" },
    { id: "diamond", name: "Diamond", floor: 28000, color: "#b9f2ff" },
    { id: "master", name: "Master", floor: 65000, color: "#ffb26f" },
    { id: "grandmaster", name: "Grandmaster", floor: 140000, color: "#ff7d6c" },
    { id: "legend", name: "Legend", floor: 300000, color: "#8cf5da" }
  ];

  const GAME_RANK_FRACTIONS = [
    { id: "bronze", name: "Bronze", fraction: 0 },
    { id: "silver", name: "Silver", fraction: 0.1 },
    { id: "gold", name: "Gold", fraction: 0.25 },
    { id: "platinum", name: "Platinum", fraction: 0.45 },
    { id: "diamond", name: "Diamond", fraction: 0.65 },
    { id: "master", name: "Master", fraction: 0.82 },
    { id: "grandmaster", name: "Grandmaster", fraction: 0.95 },
    { id: "legend", name: "Legend", fraction: 1 }
  ];

  const GAME_CONFIG = {
    "merge-monster-2048": {
      name: "Merge Monster 2048",
      category: "Puzzle Addiction",
      rankTarget: 90000,
      metricLabel: "Best run",
      metric: (stats) => Math.max(0, stats.score || 0) + Math.max(0, stats.bestTier || stats.tier || 0) * 3500,
      bestLabel: (stats) => `${fmt(stats.score || 0)} pts`,
      xp: (stats) => 30 + Math.floor(Math.sqrt(Math.max(0, stats.score || 0)) * 3) + Math.max(0, stats.bestTier || 0) * 12
    },
    "rainball-rush": {
      name: "Rainball Rush",
      category: "Reflex Rage",
      rankTarget: 15000,
      metricLabel: "Best score",
      metric: (stats) => Math.max(0, stats.score || 0),
      bestLabel: (stats) => `${fmt(stats.score || 0)} pts`,
      xp: (stats) => 25 + Math.floor(Math.max(0, stats.score || 0) / 45)
    },
    "arcade-tycoon": {
      name: "Arcade Tycoon Clicker",
      category: "Idle / Progression",
      rankTarget: 1000000000,
      metricLabel: "Lifetime tokens",
      metric: (stats) => Math.max(0, stats.lifetime || stats.bestLifetime || 0) + Math.max(0, stats.prestige || stats.tickets || 0) * 10000000,
      bestLabel: (stats) => `${fmt(stats.lifetime || stats.bestLifetime || 0)} lifetime`,
      xp: (stats) => {
        const lifetime = Math.max(0, stats.lifetime || stats.bestLifetime || 0);
        const tickets = Math.max(0, stats.tickets || stats.prestige || 0);
        return 40 + Math.floor(Math.cbrt(lifetime) * 3) + tickets * 120;
      }
    },
    "daily-vault": {
      name: "Daily Vault",
      category: "Daily Challenge",
      rankTarget: 30,
      metricLabel: "Best streak",
      metric: (stats) => Math.max(0, stats.bestStreak || stats.streak || 0),
      bestLabel: (stats) => `${fmt(stats.bestStreak || stats.streak || 0)} streak`,
      xp: (stats) => {
        const attempts = Math.max(1, stats.attempts || 6);
        if (stats.won && stats.mode === "daily") return 320 + Math.max(0, 6 - attempts) * 30;
        if (stats.won) return 120 + Math.max(0, 6 - attempts) * 15;
        return stats.mode === "daily" ? 45 : 25;
      }
    },
    "dont-stop-ball": {
      name: "Dont Stop Ball",
      category: "Arcade Survival",
      rankTarget: 40000,
      metricLabel: "Best score",
      metric: (stats) => Math.max(0, stats.score || 0),
      bestLabel: (stats) => `${fmt(stats.score || 0)} pts`,
      xp: (stats) => 25 + Math.floor(Math.max(0, stats.score || 0) / 120) + Math.max(0, stats.bestStreak || stats.streak || 0) * 2
    },
    "sky-hop": {
      name: "Sky Hop",
      category: "Sky Platformer",
      rankTarget: 420,
      metricLabel: "Best height",
      metric: (stats) => Math.max(0, stats.height || stats.bestHeight || 0),
      bestLabel: (stats) => `${fmt(stats.height || stats.bestHeight || 0)}m`,
      xp: (stats) => 25 + Math.floor(Math.max(0, stats.height || stats.bestHeight || 0) * 2) + Math.floor(Math.max(0, stats.score || 0) / 250)
    },
    "neon-dash": {
      name: "Neon Dash",
      category: "Endless Runner",
      rankTarget: 250,
      metricLabel: "Best score",
      metric: (stats) => Math.max(0, stats.score || 0),
      bestLabel: (stats) => `${fmt(stats.score || 0)} pts`,
      xp: (stats) => 25 + Math.floor(Math.max(0, stats.score || 0) * 1.5) + Math.max(0, stats.coins || 0) * 2
    },
    "color-crown": {
      name: "Color Crown",
      category: "Growth / Control",
      rankTarget: 100000,
      metricLabel: "Best control",
      metric: (stats) =>
        Math.max(0, stats.score || 0) +
        Math.max(0, stats.capturePercent || stats.bestCapture || 0) * 900 +
        Math.max(0, stats.largestCapture || 0) * 22,
      bestLabel: (stats) => `${fmt(stats.score || 0)} pts / ${fmt(stats.capturePercent || stats.bestCapture || 0)}%`,
      xp: (stats) =>
        35 +
        Math.floor(Math.max(0, stats.score || 0) / 85) +
        Math.floor(Math.max(0, stats.capturePercent || stats.bestCapture || 0) * 5) +
        Math.floor(Math.max(0, stats.largestCapture || 0) / 8) +
        (stats.cleared ? 250 : 0)
    }
  };

  const BADGE_DEFINITIONS = [
    badge("global:first-cabinet", "First Cabinet", "Play your first Zingcade cabinet.", "global", null, "token", "common", (ctx) => ctx.profile.totalSessions >= 1),
    badge("global:arcade-explorer", "Arcade Explorer", "Play 3 different cabinets.", "global", null, "map", "rare", (ctx) => playedGames(ctx.profile).length >= 3, (ctx) => progress(playedGames(ctx.profile).length, 3)),
    badge("global:seven-cabinet-run", "Full Cabinet Run", "Play every live Zingcade cabinet.", "global", null, "sweep", "legendary", (ctx) => playedGames(ctx.profile).length >= Object.keys(GAME_CONFIG).length, (ctx) => progress(playedGames(ctx.profile).length, Object.keys(GAME_CONFIG).length)),
    badge("global:rank-up", "Rank Up", "Reach Silver global rank.", "global", null, "rank", "rare", (ctx) => getRankInfo(ctx.profile.totalXp).rank.id !== "bronze"),
    badge("global:daily-loyalist", "Daily Loyalist", "Solve 3 Daily Vault challenges.", "global", null, "calendar", "epic", (ctx) => stat(ctx.profile, "daily-vault", "dailyWins") >= 3, (ctx) => progress(stat(ctx.profile, "daily-vault", "dailyWins"), 3)),
    badge("global:score-hunter", "Score Hunter", "Set a best score in 4 different cabinets.", "global", null, "target", "epic", (ctx) => scoredGames(ctx.profile).length >= 4, (ctx) => progress(scoredGames(ctx.profile).length, 4)),

    badge("merge:first-run", "First Merge", "Finish a Merge Monster run.", "game", "merge-monster-2048", "merge", "common", (ctx) => g(ctx).totalPlays >= 1),
    badge("merge:dragon", "Reach Dragon", "Reach the Dragon tier in a run.", "game", "merge-monster-2048", "dragon", "rare", (ctx) => stat(ctx.profile, "merge-monster-2048", "bestTier") >= 6),
    badge("merge:score-10k", "10K Monster", "Score 10,000 in Merge Monster 2048.", "game", "merge-monster-2048", "score", "epic", (ctx) => g(ctx).bestMetric >= 10000, (ctx) => progress(g(ctx).bestMetric, 10000)),
    badge("merge:void-path", "Void Path", "Reach a high evolution beyond Dragon.", "game", "merge-monster-2048", "void", "legendary", (ctx) => stat(ctx.profile, "merge-monster-2048", "bestTier") >= 9),

    badge("rain:first-survival", "First Survival", "Complete a Rainball Rush run.", "game", "rainball-rush", "storm", "common", (ctx) => g(ctx).totalPlays >= 1),
    badge("rain:storm-runner", "Storm Runner", "Score 2,500 in Rainball Rush.", "game", "rainball-rush", "runner", "rare", (ctx) => g(ctx).bestMetric >= 2500, (ctx) => progress(g(ctx).bestMetric, 2500)),
    badge("rain:legend-push", "Legend Push", "Score 10,000 in Rainball Rush.", "game", "rainball-rush", "bolt", "epic", (ctx) => g(ctx).bestMetric >= 10000, (ctx) => progress(g(ctx).bestMetric, 10000)),

    badge("tycoon:first-machine", "First Machine", "Buy your first arcade machine.", "game", "arcade-tycoon", "machine", "common", (ctx) => stat(ctx.profile, "arcade-tycoon", "machinesOwned") >= 1),
    badge("tycoon:100k", "100K Tokens", "Reach 100,000 lifetime tokens.", "game", "arcade-tycoon", "tokens", "rare", (ctx) => g(ctx).bestMetric >= 100000, (ctx) => progress(g(ctx).bestMetric, 100000)),
    badge("tycoon:prestige", "Prestige Once", "Prestige your arcade once.", "game", "arcade-tycoon", "prestige", "epic", (ctx) => stat(ctx.profile, "arcade-tycoon", "prestiges") >= 1),
    badge("tycoon:five-machines", "Cabinet Row", "Own 5 machine types at once.", "game", "arcade-tycoon", "row", "rare", (ctx) => stat(ctx.profile, "arcade-tycoon", "machineTypes") >= 5, (ctx) => progress(stat(ctx.profile, "arcade-tycoon", "machineTypes"), 5)),

    badge("vault:first-opened", "First Vault", "Open your first Daily Vault.", "game", "daily-vault", "vault", "common", (ctx) => stat(ctx.profile, "daily-vault", "wins") >= 1),
    badge("vault:three-day", "3-Day Streak", "Build a 3-day Daily Vault streak.", "game", "daily-vault", "streak", "rare", (ctx) => g(ctx).bestMetric >= 3, (ctx) => progress(g(ctx).bestMetric, 3)),
    badge("vault:perfect", "Perfect Solve", "Solve a vault on the first attempt.", "game", "daily-vault", "perfect", "epic", (ctx) => stat(ctx.profile, "daily-vault", "perfectSolves") >= 1),
    badge("vault:last-try", "Last-Try Save", "Solve a vault on the final attempt.", "game", "daily-vault", "save", "rare", (ctx) => stat(ctx.profile, "daily-vault", "lastTryWins") >= 1),

    badge("ball:first-dodge", "First Dodge Run", "Complete a Dont Stop Ball run.", "game", "dont-stop-ball", "ball", "common", (ctx) => g(ctx).totalPlays >= 1),
    badge("ball:hot-chain", "Hot Chain", "Reach a 12-dodge streak.", "game", "dont-stop-ball", "chain", "rare", (ctx) => stat(ctx.profile, "dont-stop-ball", "bestStreak") >= 12, (ctx) => progress(stat(ctx.profile, "dont-stop-ball", "bestStreak"), 12)),
    badge("ball:redline", "Redline Survivor", "Score 15,000 in Dont Stop Ball.", "game", "dont-stop-ball", "redline", "epic", (ctx) => g(ctx).bestMetric >= 15000, (ctx) => progress(g(ctx).bestMetric, 15000)),

    badge("sky:first-hop", "First Hop", "Complete a Sky Hop run.", "game", "sky-hop", "cloud", "common", (ctx) => g(ctx).totalPlays >= 1),
    badge("sky:hundred", "High Clouds", "Climb to 100m.", "game", "sky-hop", "height", "rare", (ctx) => g(ctx).bestMetric >= 100, (ctx) => progress(g(ctx).bestMetric, 100)),
    badge("sky:aurora", "Aurora Climber", "Climb to 260m.", "game", "sky-hop", "aurora", "epic", (ctx) => g(ctx).bestMetric >= 260, (ctx) => progress(g(ctx).bestMetric, 260)),

    badge("neon:first-dash", "First Dash", "Complete a Neon Dash run.", "game", "neon-dash", "dash", "common", (ctx) => g(ctx).totalPlays >= 1),
    badge("neon:coin-line", "Coin Line", "Collect 25 coins in one run.", "game", "neon-dash", "coin", "rare", (ctx) => stat(ctx.profile, "neon-dash", "bestCoins") >= 25, (ctx) => progress(stat(ctx.profile, "neon-dash", "bestCoins"), 25)),
    badge("neon:overdrive", "Overdrive Run", "Score 150 in Neon Dash.", "game", "neon-dash", "overdrive", "epic", (ctx) => g(ctx).bestMetric >= 150, (ctx) => progress(g(ctx).bestMetric, 150)),

    badge("crown:first-claim", "First Claim", "Finish a Color Crown run.", "game", "color-crown", "crown", "common", (ctx) => g(ctx).totalPlays >= 1),
    badge("crown:quarter-map", "Quarter Crown", "Capture 25% of the Color Crown arena.", "game", "color-crown", "quarter", "rare", (ctx) => stat(ctx.profile, "color-crown", "capturePercent") >= 25 || stat(ctx.profile, "color-crown", "bestCapture") >= 25, (ctx) => progress(Math.max(stat(ctx.profile, "color-crown", "capturePercent"), stat(ctx.profile, "color-crown", "bestCapture")), 25)),
    badge("crown:big-loop", "Big Loop", "Claim 120 cells in one Color Crown capture.", "game", "color-crown", "loop", "epic", (ctx) => stat(ctx.profile, "color-crown", "largestCapture") >= 120, (ctx) => progress(stat(ctx.profile, "color-crown", "largestCapture"), 120)),
    badge("crown:half-map", "Crown Control", "Capture 50% of the Color Crown arena.", "game", "color-crown", "control", "legendary", (ctx) => stat(ctx.profile, "color-crown", "capturePercent") >= 50 || stat(ctx.profile, "color-crown", "bestCapture") >= 50, (ctx) => progress(Math.max(stat(ctx.profile, "color-crown", "capturePercent"), stat(ctx.profile, "color-crown", "bestCapture")), 50))
  ];

  let profile = null;

  function badge(id, title, description, scope, gameId, icon, rarity, test, progressFn) {
    return { id, title, description, scope, gameId, icon, rarity, test, progress: progressFn || null };
  }

  function defaultProfile() {
    return {
      version: VERSION,
      totalXp: 0,
      totalGamesPlayed: 0,
      totalSessions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      badges: {},
      games: {}
    };
  }

  function defaultGame(gameId) {
    const config = GAME_CONFIG[gameId] || {};
    return {
      id: gameId,
      name: config.name || gameId,
      category: config.category || "Arcade",
      xp: 0,
      totalPlays: 0,
      bestMetric: 0,
      bestLabel: "No runs yet",
      bestStats: {},
      stats: {},
      badges: {},
      lastPlayedAt: null,
      latestRun: null
    };
  }

  function normalizeProfile(raw) {
    const next = { ...defaultProfile(), ...(raw && typeof raw === "object" ? raw : {}) };
    next.version = VERSION;
    next.totalXp = safeNumber(next.totalXp);
    next.totalGamesPlayed = safeNumber(next.totalGamesPlayed);
    next.totalSessions = safeNumber(next.totalSessions || next.totalGamesPlayed);
    next.badges = next.badges && typeof next.badges === "object" ? next.badges : {};
    next.games = next.games && typeof next.games === "object" ? next.games : {};
    Object.keys(GAME_CONFIG).forEach((gameId) => {
      next.games[gameId] = normalizeGame(gameId, next.games[gameId]);
    });
    return next;
  }

  function normalizeGame(gameId, gameData) {
    const next = { ...defaultGame(gameId), ...(gameData && typeof gameData === "object" ? gameData : {}) };
    next.xp = safeNumber(next.xp);
    next.totalPlays = safeNumber(next.totalPlays);
    next.bestMetric = safeNumber(next.bestMetric);
    next.bestStats = next.bestStats && typeof next.bestStats === "object" ? next.bestStats : {};
    next.stats = next.stats && typeof next.stats === "object" ? next.stats : {};
    next.badges = next.badges && typeof next.badges === "object" ? next.badges : {};
    return next;
  }

  function loadProfile() {
    if (profile) return profile;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        profile = normalizeProfile(JSON.parse(stored));
        return profile;
      }
      const legacy = localStorage.getItem(LEGACY_KEY);
      profile = normalizeProfile(legacy ? JSON.parse(legacy) : defaultProfile());
      saveProfile();
      return profile;
    } catch (error) {
      console.warn("Zingcade profile load failed; starting fresh.", error);
      profile = normalizeProfile(defaultProfile());
      return profile;
    }
  }

  function saveProfile() {
    if (!profile) return;
    profile.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.warn("Zingcade profile save failed.", error);
    }
  }

  function syncGameProgress(gameId, stats) {
    loadProfile();
    if (!GAME_CONFIG[gameId]) return null;
    const game = profile.games[gameId];
    const normalized = normalizeStats(stats);
    updateGameBest(gameId, game, normalized);
    mergeStats(game, normalized);
    const unlockedBadges = evaluateBadges({ gameId, stats: normalized, eventType: normalized.eventType || "sync" });
    saveProfile();
    return buildResult(gameId, 0, false, false, unlockedBadges);
  }

  function postRun(gameId, stats) {
    loadProfile();
    if (!GAME_CONFIG[gameId]) return null;
    const game = profile.games[gameId];
    const normalized = normalizeStats(stats);
    const beforeGlobal = getRankInfo(profile.totalXp);
    const beforeGame = getGameRankInfo(gameId);
    const wasUnplayed = game.totalPlays === 0;
    const previousBest = game.bestMetric || 0;
    const metric = metricFor(gameId, normalized);
    const isNewBest = metric > previousBest;
    const baseXp = Math.max(5, Math.floor(GAME_CONFIG[gameId].xp(normalized)));
    const firstPlayBonus = wasUnplayed ? 75 : 0;
    const newBestBonus = isNewBest && previousBest > 0 ? 100 : 0;

    game.totalPlays += 1;
    profile.totalGamesPlayed += 1;
    profile.totalSessions += 1;
    game.latestRun = { ...normalized, metric, playedAt: new Date().toISOString() };
    game.lastPlayedAt = game.latestRun.playedAt;
    updateGameBest(gameId, game, normalized);
    mergeStats(game, normalized);

    const afterGameBeforeBonus = getGameRankInfo(gameId);
    const gameRankBonus = afterGameBeforeBonus.rankIndex > beforeGame.rankIndex ? 150 : 0;
    const xpEarned = baseXp + firstPlayBonus + newBestBonus + gameRankBonus;
    game.xp += xpEarned;
    profile.totalXp += xpEarned;

    const afterGlobalBeforeBonus = getRankInfo(profile.totalXp);
    const globalRankUp = afterGlobalBeforeBonus.rankIndex > beforeGlobal.rankIndex;
    if (globalRankUp) {
      profile.totalXp += 250;
    }

    const unlockedBadges = evaluateBadges({ gameId, stats: normalized, eventType: normalized.eventType || "run" });
    saveProfile();
    return buildResult(gameId, xpEarned + (globalRankUp ? 250 : 0), isNewBest, globalRankUp, unlockedBadges, beforeGlobal, beforeGame);
  }

  function updateGameBest(gameId, game, stats) {
    const metric = metricFor(gameId, stats);
    if (metric >= game.bestMetric) {
      game.bestMetric = metric;
      game.bestStats = { ...game.bestStats, ...stats };
      game.bestLabel = GAME_CONFIG[gameId].bestLabel(stats);
    }
  }

  function mergeStats(game, stats) {
    Object.keys(stats).forEach((key) => {
      if (key === "eventType" || key === "mode" || key === "won") return;
      const value = stats[key];
      if (typeof value === "number" && Number.isFinite(value)) {
        const existing = safeNumber(game.stats[key]);
        if (key.startsWith("total") || key === "wins" || key === "dailyWins" || key === "prestiges") {
          game.stats[key] = existing + value;
        } else if (key.startsWith("best") || key === "score" || key === "height" || key === "lifetime" || key === "machinesOwned" || key === "machineTypes" || key === "streak") {
          game.stats[key] = Math.max(existing, value);
        } else {
          game.stats[key] = value;
        }
      } else {
        game.stats[key] = value;
      }
    });
    if (stats.won) game.stats.wins = safeNumber(game.stats.wins) + 1;
    if (stats.won && stats.mode === "daily") game.stats.dailyWins = safeNumber(game.stats.dailyWins) + 1;
    if (stats.won && safeNumber(stats.attempts) === 1) game.stats.perfectSolves = safeNumber(game.stats.perfectSolves) + 1;
    if (stats.won && safeNumber(stats.attempts) >= 6) game.stats.lastTryWins = safeNumber(game.stats.lastTryWins) + 1;
    if (stats.prestige || stats.eventType === "prestige") game.stats.prestiges = safeNumber(game.stats.prestiges) + 1;
  }

  function evaluateBadges(event) {
    const unlocked = [];
    const ctxBase = { profile, event };
    BADGE_DEFINITIONS.forEach((definition) => {
      if (definition.gameId && definition.gameId !== event.gameId) return;
      if (hasBadge(definition.id)) return;
      const ctx = { ...ctxBase, definition, game: definition.gameId ? profile.games[definition.gameId] : null };
      if (definition.test(ctx)) {
        unlockBadge(definition, unlocked);
      }
    });
    return unlocked;
  }

  function unlockBadge(definition, unlocked) {
    const earned = {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      scope: definition.scope,
      gameId: definition.gameId,
      icon: definition.icon,
      rarity: definition.rarity,
      unlockedAt: new Date().toISOString()
    };
    profile.badges[definition.id] = earned;
    if (definition.gameId && profile.games[definition.gameId]) {
      profile.games[definition.gameId].badges[definition.id] = earned;
    }
    unlocked.push(earned);
  }

  function hasBadge(id) {
    return Boolean(profile.badges && profile.badges[id]);
  }

  function getRankInfo(xp) {
    const value = safeNumber(xp);
    let rankIndex = 0;
    for (let index = 0; index < RANKS.length; index += 1) {
      if (value >= RANKS[index].floor) rankIndex = index;
    }
    const rank = RANKS[rankIndex];
    const nextRank = RANKS[rankIndex + 1] || rank;
    const span = Math.max(1, nextRank.floor - rank.floor);
    const pct = rank === nextRank ? 100 : clamp(((value - rank.floor) / span) * 100, 0, 100);
    return { rank, nextRank, rankIndex, xp: value, pct, current: value - rank.floor, needed: Math.max(0, nextRank.floor - value) };
  }

  function getGameRankInfo(gameId, metricOverride) {
    loadProfile();
    const config = GAME_CONFIG[gameId];
    const game = profile.games[gameId] || defaultGame(gameId);
    const metric = metricOverride === undefined ? game.bestMetric : safeNumber(metricOverride);
    const fraction = config ? clamp(metric / config.rankTarget, 0, 1) : 0;
    let rankIndex = 0;
    for (let index = 0; index < GAME_RANK_FRACTIONS.length; index += 1) {
      if (fraction >= GAME_RANK_FRACTIONS[index].fraction) rankIndex = index;
    }
    const rank = { ...GAME_RANK_FRACTIONS[rankIndex], color: RANKS[rankIndex].color };
    const nextRank = GAME_RANK_FRACTIONS[rankIndex + 1]
      ? { ...GAME_RANK_FRACTIONS[rankIndex + 1], color: RANKS[rankIndex + 1].color }
      : rank;
    const floor = GAME_RANK_FRACTIONS[rankIndex].fraction;
    const next = GAME_RANK_FRACTIONS[rankIndex + 1] ? GAME_RANK_FRACTIONS[rankIndex + 1].fraction : 1;
    const pct = rank.id === "legend" ? 100 : clamp(((fraction - floor) / Math.max(0.01, next - floor)) * 100, 0, 100);
    return { rank, nextRank, rankIndex, metric, pct, target: config ? config.rankTarget : 1, label: config ? config.metricLabel : "Best" };
  }

  function buildResult(gameId, xpEarned, isNewBest, globalRankUp, unlockedBadges, beforeGlobal, beforeGame) {
    const globalRank = getRankInfo(profile.totalXp);
    const gameRank = getGameRankInfo(gameId);
    return {
      gameId,
      game: profile.games[gameId],
      xpEarned,
      isNewBest,
      globalRankUp,
      unlockedBadges: unlockedBadges || [],
      badgeUnlocks: unlockedBadges || [],
      beforeGlobal,
      beforeGame,
      globalRank,
      gameRank,
      totalBadges: getEarnedBadges().length
    };
  }

  function getBadgeDefinitions(filter) {
    return BADGE_DEFINITIONS.filter((definition) => {
      if (!filter) return true;
      if (filter.scope && definition.scope !== filter.scope) return false;
      if (filter.gameId && definition.gameId !== filter.gameId) return false;
      return true;
    }).map(publicBadgeDefinition);
  }

  function getEarnedBadges(filter) {
    loadProfile();
    return Object.values(profile.badges || {}).filter((earned) => {
      if (!filter) return true;
      if (filter.scope && earned.scope !== filter.scope) return false;
      if (filter.gameId && earned.gameId !== filter.gameId) return false;
      return true;
    }).sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
  }

  function getBadgeProgress(definitionId) {
    loadProfile();
    const definition = BADGE_DEFINITIONS.find((item) => item.id === definitionId);
    if (!definition) return null;
    const earned = profile.badges[definition.id] || null;
    const ctx = { profile, event: null, definition, game: definition.gameId ? profile.games[definition.gameId] : null };
    const prog = definition.progress ? definition.progress(ctx) : null;
    return { definition: publicBadgeDefinition(definition), earned, progress: prog };
  }

  function publicBadgeDefinition(definition) {
    const { test, progress: progressFn, ...publicFields } = definition;
    return publicFields;
  }

  function metricFor(gameId, stats) {
    const config = GAME_CONFIG[gameId];
    return config ? safeNumber(config.metric(stats || {})) : 0;
  }

  function normalizeStats(stats) {
    const normalized = stats && typeof stats === "object" ? { ...stats } : {};
    Object.keys(normalized).forEach((key) => {
      if (typeof normalized[key] === "string" && normalized[key].trim() !== "" && !Number.isNaN(Number(normalized[key]))) {
        normalized[key] = Number(normalized[key]);
      }
    });
    return normalized;
  }

  function stat(sourceProfile, gameId, key) {
    return safeNumber(sourceProfile.games && sourceProfile.games[gameId] && sourceProfile.games[gameId].stats && sourceProfile.games[gameId].stats[key]);
  }

  function g(ctx) {
    return ctx.game || (ctx.definition.gameId ? ctx.profile.games[ctx.definition.gameId] : defaultGame("unknown"));
  }

  function playedGames(sourceProfile) {
    return Object.values(sourceProfile.games || {}).filter((game) => safeNumber(game.totalPlays) > 0).map((game) => game.id);
  }

  function scoredGames(sourceProfile) {
    return Object.values(sourceProfile.games || {}).filter((game) => safeNumber(game.bestMetric) > 0).map((game) => game.id);
  }

  function progress(value, target) {
    const current = Math.min(safeNumber(value), safeNumber(target));
    const total = Math.max(1, safeNumber(target));
    return { current, target: total, pct: clamp((current / total) * 100, 0, 100) };
  }

  function safeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function fmt(value) {
    return Math.floor(safeNumber(value)).toLocaleString();
  }

  loadProfile();

  return {
    VERSION,
    GAME_CONFIG,
    RANKS,
    loadProfile,
    saveProfile,
    getProfile: () => loadProfile(),
    getRankInfo,
    getGlobalRankInfo: getRankInfo,
    getGameRankInfo,
    postRun,
    syncGameProgress,
    getBadgeDefinitions,
    getEarnedBadges,
    getBadgeProgress,
    formatNumber: fmt
  };
})();
