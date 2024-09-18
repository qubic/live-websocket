const canvas = document.getElementById('wormholeCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Star {
  x: number;
  y: number;
  z: number;
  radius: number;

  constructor() {
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = Math.random() * canvas.width;
    this.radius = 0.5;
  }

  update() {
    this.z -= 5;
    if (this.z <= 0) {
      this.z = canvas.width;
    }
  }

  draw() {
    const x = this.x / (this.z / canvas.width) + canvas.width / 2;
    const y = this.y / (this.z / canvas.width) + canvas.height / 2;
    const r = this.radius * (canvas.width / this.z);

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

const stars = Array.from({ length: 1000 }, () => new Star());

function animate() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
