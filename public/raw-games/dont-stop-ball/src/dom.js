export function getDom() {
  return {
    score: document.getElementById("score"),
    best: document.getElementById("best-score"),
    lives: document.getElementById("lives-display"),
    streak: document.getElementById("chain-count"),
    speed: document.getElementById("speed"),
    stage: document.getElementById("stage-label"),
    challenge: document.getElementById("challenge-text"),
    power: document.getElementById("power-text"),
    note: document.getElementById("run-note"),
    canvasNote: document.getElementById("canvas-note"),
    damageFlash: document.getElementById("damage-flash"),
    overlay: document.getElementById("overlay"),
    overlayKicker: document.getElementById("overlay-kicker"),
    overlayTitle: document.getElementById("overlay-title"),
    overlayText: document.getElementById("overlay-text"),
    overlaySummary: document.getElementById("overlay-summary"),
    overlayScore: document.getElementById("overlay-score"),
    overlayBest: document.getElementById("overlay-best"),
    overlayChain: document.getElementById("overlay-chain"),
    actionButton: document.getElementById("action-button"),
    gamesLink: document.getElementById("games-link"),
    pauseButton: document.getElementById("pause-button")
  };
}

export function showOverlay(dom, { kicker, title, text, actionLabel, summary = null, showGames = false, result = null }) {
  dom.overlayKicker.textContent = kicker;
  dom.overlayTitle.textContent = title;
  dom.overlayText.textContent = text;
  dom.actionButton.textContent = actionLabel;
  dom.overlaySummary.hidden = !summary;
  dom.gamesLink.hidden = !showGames;

  if (summary) {
    dom.overlayScore.textContent = summary.score;
    dom.overlayBest.textContent = summary.best;
    dom.overlayChain.textContent = summary.bestStreak;
  }

  renderZingcadeResult(dom, result);
  dom.overlay.hidden = false;
}

export function hideOverlay(dom) {
  dom.overlay.hidden = true;
  dom.gamesLink.hidden = true;
  renderZingcadeResult(dom, null);
}

export function renderZingcadeResult(dom, result) {
  const existing = document.getElementById("zc-go-widget");
  if (existing) existing.remove();
  if (result && window.ZingcadeUI) {
    dom.overlaySummary.insertAdjacentHTML("afterend", `<div id="zc-go-widget">${window.ZingcadeUI.createGameOverWidget(result)}</div>`);
  }
}

export function updateLives(dom, lives) {
  dom.lives.innerHTML = Array.from({ length: 3 }, (_, index) => {
    const active = index < lives ? "heart active" : "heart";
    return `<span class="${active}">&#10084;</span>`;
  }).join("");
}

export function pulseElement(el) {
  if (!el) return;
  el.classList.remove("celebrate");
  void el.offsetWidth;
  el.classList.add("celebrate");
}
