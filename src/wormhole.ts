import { MovingText } from './MovingText';
import { Star } from './Star';

let movingText = new MovingText("Qubic Stats");


// Initial call to start immediately

export const canvas = document.getElementById('wormholeCanvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array.from({ length: 1000 }, () => new Star());

function animate() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  movingText.update();
  movingText.draw();

  requestAnimationFrame(animate);
}


animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

