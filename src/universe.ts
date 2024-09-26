import { StatsInfo } from './stats-info';
import { Cube } from './elements/cube';
import { Star } from './elements/star';
import { LiveInfo } from './live-info';

let statsInfo = new StatsInfo("Qubic Stats");
let liveInfo = new LiveInfo();
let isCube = false;
let isWebSockets = true;

// Add these lines near the top of the file
const navLive = document.getElementById('nav-live') as HTMLAnchorElement;
const navStats = document.getElementById('nav-stats') as HTMLAnchorElement;

// Add this function
function switchView(view: 'live' | 'stats') {
  if (view === 'live') {
    isWebSockets = true;
    liveInfo.show();
    statsInfo.hide();
  } else {
    isWebSockets = false;
    liveInfo.hide();
    statsInfo.show();
  }
}

// Add these event listeners
navLive.addEventListener('click', (e) => {
  e.preventDefault();
  switchView('live');
});

navStats.addEventListener('click', (e) => {
  e.preventDefault();
  switchView('stats');
});


export const canvas = document.getElementById('universeCanvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array.from({ length: 1000 }, () => new Star());
const cubes = Array.from({ length: 200 }, () => new Cube());

function animate() {
  ctx.fillStyle = 'rgb(0, 22, 29)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!isWebSockets) {

    if (isCube) {
      cubes.forEach(cube => {
        cube.update();
        cube.draw();
      });
    } else {
      stars.forEach(star => {
        star.update();
        star.draw();
      });
    }

    statsInfo.update();
    statsInfo.draw();
  }

  // Update display
  updateCurrentValueDisplay(statsInfo.currentValue);
  updateCurrentTickDisplay(statsInfo.currentTick);

  requestAnimationFrame(animate);
}

animate();


window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// Checkbox Event-Listener isCube
document.getElementById('toggleViewIsCube')!.addEventListener('change', (event) => {
  const checkbox = event.target as HTMLInputElement;
  isCube = checkbox.checked;
});



function updateCurrentValueDisplay(currentValue: string | null) {
  const displayElement = document.getElementById('currentValueDisplay')!;

  if (currentValue !== null) {
    displayElement.textContent = currentValue;

  } else {
    displayElement.textContent = "0/12";
  }
}


function updateCurrentTickDisplay(currentTick: number | null) {
  const displayElement = document.getElementById('currentTickDisplay')!;

  if (displayElement.textContent != `Current Tick: ${currentTick?.toLocaleString()}`) {
    blinkElement(displayElement);
  }
  if (currentTick !== null) {
    displayElement.textContent = `Current Tick: ${currentTick.toLocaleString()}`;
  } else {
    displayElement.textContent = `Current Tick: Not Available`;
  }
}


function blinkElement(element: HTMLElement) {
  element.classList.add('blinking');
  setTimeout(() => {
    element.classList.remove('blinking');
  }, 3000);
}
