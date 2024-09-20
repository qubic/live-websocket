import { MovingText } from './moving-text';
import { Cube } from './elements/cube';
import { Star } from './elements/star';

let movingText = new MovingText("Qubic Stats");
let isCube = false;

export const canvas = document.getElementById('universeCanvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array.from({ length: 1000 }, () => new Star());
const cubes = Array.from({ length: 200 }, () => new Cube());

function animate() {
  ctx.fillStyle = 'rgb(0, 22, 29)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  movingText.update();
  movingText.draw();

  // Update display
  updateCurrentValueDisplay(movingText.currentValue);
  updateCurrentTickDisplay(movingText.currentTick);

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Checkbox Event-Listener 
document.getElementById('toggleView')!.addEventListener('change', (event) => {
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
