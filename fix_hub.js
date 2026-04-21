const fs = require('fs');

function inject(file) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Inject Banner Hook
    if (!html.includes('id="hub-profile-banner"')) {
        let heroToken = '<div class="hero-copy">';
        if (file.includes('games/index.html')) {
            html = html.replace(heroToken, '<div style="grid-column: 1 / -1; width: 100%" id="hub-profile-banner"></div>\n          ' + heroToken);
        }
    }

    // Inject Scripts before </body>
    if (!html.includes('zingcade-progression.js')) {
        html = html.replace('</body>', 
`<script src="/js/zingcade-progression.js"></script>
    <script src="/js/progression-ui.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
         window.ZingcadeUI.renderProfileBanner("hub-profile-banner");
         window.ZingcadeUI.renderGameCards();
      });
    </script>
  </body>`);
    }

    fs.writeFileSync(file, html);
    console.log("Injected " + file);
}

inject('games/index.html');
