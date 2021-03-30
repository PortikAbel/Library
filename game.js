const r = 250;
const angle = Math.PI / 10;

lines = [];
for (let i = 0; i < 10; i++) {
  let p1 = {
    x: r * (1 + Math.sin(angle * 2 * i)),
    y: r * (1 + Math.cos(angle * 2 * i)),
  };
  let p2 = {
    x: r * (1 + Math.sin(angle * (2 * i + 9))),
    y: r * (1 + Math.cos(angle * (2 * i + 9))),
  }
  lines.push({start: p1, end: p2});
}

function load() {
  let ctx = document.querySelector('#game-board').getContext('2d');
  ctx.lineWidth = 5;
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
  }); 
}

window.onload = load;