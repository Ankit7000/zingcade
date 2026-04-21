import { SceneTransitions } from "../../_shared/phaser/systems/SceneTransitions.js";

export function getDom() {
  return {
    score: document.getElementById("score"),
    best: document.getElementById("best"),
    coins: document.getElementById("coins"),
    stage: document.getElementById("stage"),
    speed: document.getElementById("speed"),
    powerName: document.getElementById("pname"),
    powerTime: document.getElementById("ptime"),
    powerFill: document.getElementById("pfill"),
    tip: document.getElementById("tip"),
    pauseBtn: document.getElementById("pauseBtn"),
    overlay: document.getElementById("overlay"),
    overlayKicker: document.getElementById("okicker"),
    overlayTitle: document.getElementById("otitle"),
    overlayText: document.getElementById("otext"),
    overlaySummary: document.getElementById("osummary"),
    overlayScore: document.getElementById("oscore"),
    overlayBest: document.getElementById("obest"),
    overlayCoins: document.getElementById("ocoins"),
    overlayNote: document.getElementById("onote"),
    actionBtn: document.getElementById("actionBtn"),
    continueBtn: document.getElementById("continueBtn"),
    gamesLink: document.getElementById("gamesLink")
  };
}

export function hideOverlay(dom) {
  dom.overlay.hidden = true;
  dom.overlaySummary.hidden = true;
  dom.overlayNote.hidden = true;
  dom.actionBtn.hidden = false;
  dom.continueBtn.hidden = true;
  dom.gamesLink.hidden = true;
  const existing = document.getElementById("zc-go-widget");
  if (existing) existing.remove();
}

export function showOverlay(dom, { kicker, title, text, actionLabel, summary, note, showContinue = false, showGames = false, result = null }) {
  dom.overlayKicker.textContent = kicker;
  dom.overlayTitle.textContent = title;
  dom.overlayText.textContent = text;
  dom.actionBtn.textContent = actionLabel;
  dom.overlaySummary.hidden = !summary;
  dom.overlayNote.hidden = !note;
  dom.continueBtn.hidden = !showContinue;
  dom.gamesLink.hidden = !showGames;
  if (summary) {
    dom.overlayScore.textContent = summary.score;
    dom.overlayBest.textContent = summary.best;
    dom.overlayCoins.textContent = summary.coins;
  }
  if (note) dom.overlayNote.textContent = note;
  const existing = document.getElementById("zc-go-widget");
  if (existing) existing.remove();
  if (result && window.ZingcadeUI) {
    dom.overlayNote.insertAdjacentHTML("afterend", `<div id="zc-go-widget">${window.ZingcadeUI.createGameOverWidget(result)}</div>`);
  }
  dom.overlay.hidden = false;
}

export function updatePowerHud(dom, state) {
  let name = "No Power";
  let time = "--";
  let fill = 0;
  let background = "linear-gradient(135deg,#8cf5da,#d3fff0)";
  if (state.boostT > 0) {
    name = "BOOST";
    time = `${state.boostT.toFixed(1)}s`;
    fill = state.boostT / 3 * 100;
    background = "linear-gradient(135deg,#bb78ff,#ff88ff)";
  } else if (state.magnetT > 0) {
    name = "MAGNET";
    time = `${state.magnetT.toFixed(1)}s`;
    fill = state.magnetT / 6 * 100;
    background = "linear-gradient(135deg,#ffc672,#ffe0a0)";
  } else if (state.shield) {
    name = "SHIELD";
    time = "ACTIVE";
    fill = 100;
    background = "linear-gradient(135deg,#77b8ff,#aaddff)";
  }
  dom.powerName.textContent = name;
  dom.powerTime.textContent = time;
  dom.powerFill.style.width = `${fill}%`;
  dom.powerFill.style.background = background;
}

export function pulse(el) {
  SceneTransitions.pulseElement(el);
}
