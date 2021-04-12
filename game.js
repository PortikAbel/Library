const r = 500;
const angle = Math.PI / 20;

const colors = [
  '#404E4D',
  '#C3423F',
  '#9BC53D',
  '#FDE74C',
  '#5BC0EB',
  '#EDE5A6',
  '#B2D3A8',
  '#52B788',
  '#498467',
  '#592941',
];
const buttons = document.querySelector('#buttons');
const hpField = document.createElement('div');

let lines, hp;

function initializeSticks() {
  lines = [];
  hp = 3;
  hpField.innerHTML = `health: ${hp}`;
  document.querySelector('.controls').appendChild(hpField);
  for (let i = 0; i < 10; i++) {
    let p1 = {
      x: r * (1 - Math.sin(angle * i)),
      y: r * (1 - Math.cos(angle * i)),
    };
    let p2 = {
      x: r * (1 + Math.sin(angle * (i + 10))),
      y: r * (1 + Math.cos(angle * (i + 10))),
    }
    lines.push({
        index: i, 
        start: p1, 
        end: p2, 
        color: colors[i], 
        visible: true,
      });
  }
}

function randomize(list){
  let newList = [];
  while (list.length > 0) {
    const index = Math.floor(Math.random() * list.length);
    newList.push(list[index]);
    list.splice(index, 1);
  }
  return newList;
}

function paintSticks(sticks) {
  const canvas = document.querySelector('#game-board');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 15;
  sticks.filter(x => x.visible).forEach(line => {
    ctx.beginPath();
    ctx.strokeStyle = line.color;
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
  }); 
}

function paintText(text, color) {
  const canvas = document.querySelector('#game-board');
  const ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.8;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.font = '50px Comic Sans MS';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width/2, canvas.height/2);
}

function btnClicked(event) {
  const button = event.target;
  let i = lines.findIndex(line => line.index == button.id);

  let good = true;
  for (let j = i + 1; j < lines.length; j++) {
    good &= !lines[j].visible;
  }
  
  if (good) {
    lines[i].visible = false;
    paintSticks(lines);
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    let win = true;
    buttons.childNodes.forEach(btn => {
      win &= btn.disabled;
    });
    if (win) {
      paintText('You won!', 'green');
    }
  } else {
    hp--;
    hpField.innerHTML = `health: ${hp}`;
    if (hp == 0) {
      buttons.childNodes.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
      });
      paintText('Game Over', 'red');
    }
  }
}

function addButtons(sticks) {
  sticks.forEach(line => {
    const button = document.createElement('button');
    button.className = 'colored-button';
    button.id = line.index;
    button.style.backgroundColor = line.color;
    button.onclick = btnClicked;
    buttons.appendChild(button);
  }); 
}

function load() {
  initializeSticks();
  addButtons(lines);
  lines = randomize(lines);
  paintSticks(lines);
}

function reload() {
  initializeSticks();
  lines = randomize(lines);
  paintSticks(lines);
  buttons.childNodes.forEach(btn => {
    btn.disabled = false;
    btn.style.cursor = 'pointer';
  });
}

window.onload = load;