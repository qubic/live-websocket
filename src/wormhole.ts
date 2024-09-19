import { MovingText } from './MovingText';
import { Cube } from './cube';
import { Star } from './Star';

let movingText = new MovingText("Qubic Stats");
let isCube = false;

export const canvas = document.getElementById('wormholeCanvas') as HTMLCanvasElement;
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

  // Update current tick display
  updateCurrentTickDisplay(movingText.currentTick);

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Checkbox Event-Listener hinzufügen
document.getElementById('toggleView')!.addEventListener('change', (event) => {
  const checkbox = event.target as HTMLInputElement;
  isCube = checkbox.checked;
});

// Funktion zum Aktualisieren der Anzeige für Current Tick
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

// Funktion zum Blinken des Elements
function blinkElement(element: HTMLElement) {
  element.classList.add('blinking');

  // Entferne die Klasse nach 5 Sekunden
  setTimeout(() => {
    element.classList.remove('blinking');
  }, 5000); // 5 Sekunden
}
