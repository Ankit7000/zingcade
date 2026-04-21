/**
 * Zingcade shared profile, progression, and badge UI.
 */

window.ZingcadeUI = (function () {
  function ensureStyles() {
    if (document.getElementById("zc-progression-css")) return;
    const style = document.createElement("style");
    style.id = "zc-progression-css";
    style.textContent = `
      .zc-profile-banner,
      .zc-card-progress,
      .zc-gameover-xp-card,
      .zc-badge-panel {
        border: 1px solid rgba(140, 245, 218, 0.18);
        background: linear-gradient(180deg, rgba(10, 18, 30, 0.92), rgba(5, 10, 17, 0.96));
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
      }
      .zc-profile-banner {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        margin-bottom: 1.25rem;
        border-radius: 22px;
      }
      .zc-profile-kicker,
      .zc-progress-label,
      .zc-badge-kicker {
        margin: 0;
        color: #8cf5da;
        font-size: 0.72rem;
        letter-spacing: 0.13em;
        text-transform: uppercase;
      }
      .zc-profile-title {
        margin: 0.35rem 0 0;
        font-size: clamp(1.35rem, 3vw, 2rem);
        line-height: 1.05;
      }
      .zc-profile-copy,
      .zc-progress-copy,
      .zc-badge-copy {
        margin: 0.45rem 0 0;
        color: #b6c2bf;
        line-height: 1.55;
      }
      .zc-profile-stats,
      .zc-card-stats,
      .zc-badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }
      .zc-profile-stat,
      .zc-card-stat,
      .zc-badge-pill {
        padding: 0.7rem 0.8rem;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.045);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .zc-profile-stat strong,
      .zc-card-stat strong {
        display: block;
        color: #f3f6ef;
        font-size: 1rem;
      }
      .zc-profile-stat span,
      .zc-card-stat span {
        display: block;
        margin-top: 0.2rem;
        color: #b6c2bf;
        font-size: 0.78rem;
      }
      .zc-progress-track {
        height: 9px;
        margin-top: 0.7rem;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.08);
      }
      .zc-progress-fill {
        display: block;
        height: 100%;
        width: 0;
        border-radius: inherit;
        background: linear-gradient(90deg, #8cf5da, #ffc672);
        box-shadow: 0 0 18px rgba(140, 245, 218, 0.28);
      }
      .zc-card-progress {
        display: grid;
        gap: 0.75rem;
        margin-top: 0.85rem;
        padding: 0.9rem;
        border-radius: 18px;
      }
      .zc-badge-panel {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 18px;
      }
      .zc-card-progress-head {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: center;
      }
      .zc-rank-pill {
        display: inline-flex;
        align-items: center;
        min-height: 30px;
        padding: 0 0.7rem;
        border-radius: 999px;
        color: #071019;
        background: linear-gradient(135deg, #8cf5da, #d3fff0);
        font-weight: 800;
        white-space: nowrap;
      }
      .zc-badge-row {
        margin-top: 0.8rem;
      }
      .zc-badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        color: #f3f6ef;
        font-weight: 700;
      }
      .zc-badge-icon {
        display: inline-grid;
        place-items: center;
        width: 1.65rem;
        height: 1.65rem;
        border-radius: 50%;
        color: #071019;
        background: linear-gradient(135deg, #ffc672, #8cf5da);
        font-size: 0.9rem;
      }
      .zc-gameover-xp-card {
        display: grid;
        gap: 0.8rem;
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 18px;
        text-align: left;
      }
      .zc-gameover-xp-card h3 {
        margin: 0;
        line-height: 1.1;
      }
      .zc-gameover-xp-card p {
        margin: 0;
        color: #b6c2bf;
        line-height: 1.5;
      }
      .zc-unlock-list {
        display: grid;
        gap: 0.55rem;
      }
      .zc-unlock {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.65rem;
        align-items: center;
        padding: 0.7rem;
        border-radius: 14px;
        background: rgba(255, 198, 114, 0.08);
        border: 1px solid rgba(255, 198, 114, 0.22);
      }
      .zc-unlock strong {
        display: block;
      }
      .zc-unlock span {
        display: block;
        margin-top: 0.2rem;
        color: #b6c2bf;
        font-size: 0.86rem;
      }
      @media (max-width: 720px) {
        .zc-profile-banner {
          grid-template-columns: 1fr;
        }
        .zc-card-progress-head {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderProfileBanner(targetElementId) {
    ensureStyles();
    const target = document.getElementById(targetElementId);
    if (!target || !window.Zingcade) return;
    const profile = window.Zingcade.getProfile();
    const rankInfo = window.Zingcade.getGlobalRankInfo(profile.totalXp);
    const badges = window.Zingcade.getEarnedBadges();
    const latestBadge = badges[0];
    target.innerHTML = `
      <section class="zc-profile-banner" aria-label="Zingcade profile progress">
        <div>
          <p class="zc-profile-kicker">Arcade Profile</p>
          <h2 class="zc-profile-title" style="color:${rankInfo.rank.color}">${rankInfo.rank.name} Player</h2>
          <p class="zc-profile-copy">
            ${rankInfo.needed > 0 ? `${window.Zingcade.formatNumber(rankInfo.needed)} XP to ${rankInfo.nextRank.name}.` : "Legend rank reached."}
            ${latestBadge ? `Latest badge: ${escapeHtml(latestBadge.title)}.` : "Badges unlock as you play cabinets."}
          </p>
          <div class="zc-progress-track" aria-label="Global rank progress">
            <span class="zc-progress-fill" style="width:${rankInfo.pct}%"></span>
          </div>
        </div>
        <div class="zc-profile-stats">
          <div class="zc-profile-stat"><strong>${window.Zingcade.formatNumber(profile.totalXp)}</strong><span>Total XP</span></div>
          <div class="zc-profile-stat"><strong>${profile.totalSessions}</strong><span>Sessions</span></div>
          <div class="zc-profile-stat"><strong>${badges.length}</strong><span>Badges</span></div>
        </div>
      </section>
    `;
  }

  function renderGameCards() {
    ensureStyles();
    if (!window.Zingcade) return;
    const profile = window.Zingcade.getProfile();
    document.querySelectorAll(".more-game-card, .hub-card").forEach((card) => {
      const link = card.querySelector('a[href*="/games/"]');
      if (!link) return;
      const gameId = gameIdFromHref(link.getAttribute("href"));
      if (!gameId || !profile.games[gameId]) return;
      const existing = card.querySelector(".zc-card-progress");
      if (existing) existing.remove();
      const game = profile.games[gameId];
      const rankInfo = window.Zingcade.getGameRankInfo(gameId);
      const earned = window.Zingcade.getEarnedBadges({ gameId }).length;
      const available = window.Zingcade.getBadgeDefinitions({ gameId }).length;
      const progress = document.createElement("div");
      progress.className = "zc-card-progress";
      progress.innerHTML = `
        <div class="zc-card-progress-head">
          <div>
            <p class="zc-progress-label">Cabinet Mastery</p>
            <p class="zc-progress-copy">${escapeHtml(game.bestLabel || "No runs yet")}</p>
          </div>
          <span class="zc-rank-pill" style="background:linear-gradient(135deg, ${rankInfo.rank.color}, #d3fff0)">${rankInfo.rank.name}</span>
        </div>
        <div class="zc-progress-track" aria-label="${escapeHtml(game.name)} rank progress">
          <span class="zc-progress-fill" style="width:${rankInfo.pct}%"></span>
        </div>
        <div class="zc-card-stats">
          <div class="zc-card-stat"><strong>${game.totalPlays}</strong><span>Plays</span></div>
          <div class="zc-card-stat"><strong>${earned}/${available}</strong><span>Badges</span></div>
        </div>
      `;
      card.appendChild(progress);
    });
  }

  function createGameOverWidget(result) {
    ensureStyles();
    if (!result) return "";
    const badgeHtml = result.unlockedBadges && result.unlockedBadges.length
      ? `<div class="zc-unlock-list">${result.unlockedBadges.map(renderUnlock).join("")}</div>`
      : `<p>No new badges this run. The next unlock is still on the board.</p>`;
    return `
      <section class="zc-gameover-xp-card" aria-label="Zingcade progression result">
        <div>
          <p class="zc-profile-kicker">Arcade Progress</p>
          <h3>+${window.Zingcade.formatNumber(result.xpEarned || 0)} XP${result.globalRankUp ? " &middot; Rank Up" : ""}</h3>
          <p>${escapeHtml(result.gameRank.rank.name)} cabinet rank &middot; ${Math.round(result.gameRank.pct)}% to next tier.</p>
        </div>
        ${badgeHtml}
      </section>
    `;
  }

  function renderBadgePanel(targetElementId, options) {
    ensureStyles();
    const target = document.getElementById(targetElementId);
    if (!target || !window.Zingcade) return;
    const earned = window.Zingcade.getEarnedBadges(options);
    const definitions = window.Zingcade.getBadgeDefinitions(options);
    target.innerHTML = `
      <section class="zc-badge-panel" aria-label="Badge summary">
        <p class="zc-badge-kicker">Badges</p>
        <p class="zc-badge-copy">${earned.length}/${definitions.length} earned${earned[0] ? ` &middot; Latest: ${escapeHtml(earned[0].title)}` : ""}</p>
        <div class="zc-badge-row">
          ${earned.slice(0, 4).map((badge) => `<span class="zc-badge-pill"><span class="zc-badge-icon">${iconFor(badge.icon)}</span>${escapeHtml(badge.title)}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function renderCurrentGameBadgePanel() {
    if (!window.Zingcade) return;
    const gameId = Object.keys(window.Zingcade.GAME_CONFIG).find((id) => window.location.pathname.includes(`/games/${id}/`));
    if (!gameId || document.getElementById("game-badge-panel")) return;
    const host = document.createElement("div");
    host.id = "game-badge-panel";
    const topbar = document.querySelector(".topbar");
    if (topbar && topbar.parentNode) {
      topbar.insertAdjacentElement("afterend", host);
    } else {
      const parent = document.querySelector("main") || document.querySelector(".app") || document.body;
      parent.insertBefore(host, parent.firstChild);
    }
    renderBadgePanel("game-badge-panel", { gameId });
  }

  function showProgressToast(result) {
    ensureStyles();
    if (!result || (!result.xpEarned && (!result.unlockedBadges || !result.unlockedBadges.length))) return;
    const existing = document.getElementById("zc-progress-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "zc-progress-toast";
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "1rem";
    toast.style.width = "min(92vw, 420px)";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "9999";
    toast.innerHTML = createGameOverWidget(result);
    document.body.appendChild(toast);
    window.setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, result.unlockedBadges && result.unlockedBadges.length ? 7000 : 4200);
  }

  function renderUnlock(badge) {
    return `
      <div class="zc-unlock">
        <span class="zc-badge-icon">${iconFor(badge.icon)}</span>
        <div>
          <strong>${escapeHtml(badge.title)}</strong>
          <span>${escapeHtml(badge.description)}</span>
        </div>
      </div>
    `;
  }

  function gameIdFromHref(href) {
    return Object.keys(window.Zingcade.GAME_CONFIG).find((id) => href && href.includes(id));
  }

  function iconFor(key) {
    const icons = {
      token: "XP", map: "3", seven: "7", sweep: "ALL", rank: "R", calendar: "D", target: "T",
      merge: "M", dragon: "D", score: "S", void: "V", storm: "R", runner: "R",
      bolt: "B", machine: "A", tokens: "$", prestige: "P", row: "5", vault: "V",
      streak: "3", perfect: "1", save: "6", ball: "B", chain: "C", redline: "R",
      cloud: "S", height: "H", aurora: "A", dash: "N", coin: "C", overdrive: "O",
      crown: "C", quarter: "25", loop: "L", control: "50"
    };
    return icons[key] || "*";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCurrentGameBadgePanel);
  } else {
    renderCurrentGameBadgePanel();
  }

  return {
    renderProfileBanner,
    renderGameCards,
    renderBadgePanel,
    renderCurrentGameBadgePanel,
    showProgressToast,
    createGameOverWidget
  };
})();
