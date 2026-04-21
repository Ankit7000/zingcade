import { H, W } from "./config.js?v=1";

async function boot() {
  const root = globalThis;
  const doc = root.document;
  if (!root.Phaser) {
    const overlay = doc?.getElementById("overlay");
    const title = doc?.getElementById("overlay-title");
    const text = doc?.getElementById("overlay-text");
    if (overlay && title && text) {
      title.textContent = "Phaser failed to load";
      text.textContent = "Check the network connection and reload Dont Stop Ball.";
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
    import("./scenes/BootScene.js?v=1"),
    import("./scenes/GameScene.js?v=1"),
    import("./scenes/UIScene.js?v=1"),
    import("./scenes/MenuScene.js?v=1"),
    import("./scenes/GameOverScene.js?v=1")
  ]);

  const Phaser = root.Phaser;
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "phaser-game",
    width: W,
    height: H,
    backgroundColor: "#07111d",
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
