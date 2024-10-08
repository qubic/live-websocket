import { StatsInfo } from './stats-info';
import { Star } from './elements/star';
import { LiveCube } from './live-cube';

let liveCube = new LiveCube();
let statsInfo = new StatsInfo("Qubic Stats");

export const canvas = document.getElementById('universeCanvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array.from({ length: 1000 }, () => new Star());

function animate() {
  ctx.fillStyle = 'rgb(0, 22, 29)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  liveCube.update();
  liveCube.draw();
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  statsInfo.update();
  statsInfo.draw();

  // Update display
  updateCurrentValueDisplay(statsInfo.currentValue);
  updateCurrentTickDisplay(statsInfo.currentTick);

  requestAnimationFrame(animate);
}

animate();

// Adjust canvas size when the window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Update the display element with the current value
function updateCurrentValueDisplay(currentValue: string | null) {
  const displayElement = document.getElementById('currentValueDisplay')!;

  if (currentValue !== null) {
    displayElement.textContent = currentValue;
  } else {
    displayElement.textContent = "0/12";
  }
}

// Update the display element with the current tick
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
