const fs = require('fs');

let nd = fs.readFileSync('D:/zingcade/games/neon-dash/index.html', 'utf8');
nd = nd.replace(
  "@media(pointer:coarse), (max-width:720px){.mob-btns{display:grid}.mob-btn{min-height:60px}\r\n      .canvas-wrap{max-height:calc(100dvh - 260px);overflow:hidden}\r\n      canvas{height:100%;aspect-ratio:unset}}",
  "@media(pointer:coarse), (max-width:720px){.mob-btns{display:grid}.mob-btn{min-height:60px}\r\n      .canvas-wrap{max-width:min(var(--canvas-max-width), calc((100dvh - 280px) * 7 / 12))}}"
);

const ndBadButtons = `<div class="mob-btns">\r\n        <button class="mob-btn" id="mobLeft" type="button" style="grid-row:span 2">&lt; LEFT</button>\r\n        <button class="mob-btn" id="mobUp" type="button">JUMP</button>\r\n        <button class="mob-btn" id="mobRight" type="button" style="grid-row:span 2">RIGHT &gt;</button>\r\n        <button class="mob-btn" id="mobDown" type="button">SLIDE</button>\r\n      </div>`;

const ndGoodButtons = `<div class="mob-btns" style="grid-template-columns: 1fr 1fr 1fr;">\r\n        <button class="mob-btn" id="mobLeft" type="button" style="grid-row: 1 / 3; grid-column: 1">&lt; LEFT</button>\r\n        <button class="mob-btn" id="mobUp" type="button" style="grid-row: 1; grid-column: 2">JUMP</button>\r\n        <button class="mob-btn" id="mobDown" type="button" style="grid-row: 2; grid-column: 2">SLIDE</button>\r\n        <button class="mob-btn" id="mobRight" type="button" style="grid-row: 1 / 3; grid-column: 3">RIGHT &gt;</button>\r\n      </div>`;

nd = nd.replace(ndBadButtons, ndGoodButtons);
fs.writeFileSync('D:/zingcade/games/neon-dash/index.html', nd);

let dsb = fs.readFileSync('D:/zingcade/games/dont-stop-ball/index.html', 'utf8');
dsb = dsb.replace(
  "@media (pointer: coarse), (max-width: 720px) {\r\n        .touch-controls {\r\n          display: grid;\r\n        }\r\n      }",
  "@media (pointer: coarse), (max-width: 720px) {\r\n        .touch-controls {\r\n          display: grid;\r\n        }\r\n        .canvas-wrap {\r\n          max-width: min(var(--canvas-max-width), calc((100dvh - 360px) * 7 / 12));\r\n        }\r\n      }"
);
fs.writeFileSync('D:/zingcade/games/dont-stop-ball/index.html', dsb);
