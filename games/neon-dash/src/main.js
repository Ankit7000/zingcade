import { H, W } from "./config.js";

async function boot() {
  const root = globalThis;
  const doc = root.document;
  if (!root.Phaser) {
    const overlay = doc?.getElementById("overlay");
    const title = doc?.getElementById("otitle");
    const text = doc?.getElementById("otext");
    if (overlay && title && text) {
      title.textContent = "Phaser failed to load";
      text.textContent = "Check the network connection and reload Neon Dash.";
      overlay.hidden = false;
    }
    return;
  }

  const [
    { BootScene },
    { GameScene },
    { UIScene },
    { MenuScene },
    { GameOverScene }
  ] = await Promise.all([
    import("./scenes/BootScene.js"),
    import("./scenes/GameScene.js"),
    import("./scenes/UIScene.js"),
    import("./scenes/MenuScene.js"),
    import("./scenes/GameOverScene.js")
  ]);

  const Phaser = root.Phaser;
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "phaser-game",
    width: W,
    height: H,
    backgroundColor: "#040a12",
    pixelArt: false,
    roundPixels: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
      antialias: true,
      powerPreference: "high-performance"
    },
    scene: [BootScene, GameScene, UIScene, MenuScene, GameOverScene]
  });
}

boot();
