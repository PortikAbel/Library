const r = 250;
const angle = Math.PI / 10;

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

let lines, sticks;

function initializeSticks() {
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
    lines.push({start: p1, end: p2, color: colors[i]});
  }
}

function randomize(list){
  let newList = [];
  while(list.length > 0) {
    const index = Math.floor(Math.random() * list.length);
    newList.push({ind: index, element: list[index]});
    list.splice(index, 1);
  }
  return newList;
}

function paintSticks(sticks) {
  let ctx = document.querySelector('#game-board').getContext('2d');
  ctx.lineWidth = 5;
  sticks.forEach(stick => {
    let line = stick.element;
    ctx.beginPath();
    ctx.strokeStyle = line.color;
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
  }); 
}

function addButtons(sticks) {
  sticks.forEach(line => {
    const button = document.createElement('button');
    button.className = 'colored-button';
    button.style.backgroundColor = line.color;
    buttons.appendChild(button);
  }); 
}

function load() {
  initializeSticks();
  addButtons(lines);
  sticks = randomize(lines);
  paintSticks(sticks);
}

function reload() {
  initializeSticks();
  sticks = randomize(lines);
  paintSticks(sticks);
}

window.onload = load;