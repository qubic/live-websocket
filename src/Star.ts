import { canvas, ctx } from "./wormhole";

export class Star {
  x: number;
  y: number;
  z: number;
  radius: number; 
  baseSpeed: number = 5;

  constructor() {
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = Math.random() * canvas.width;
    this.radius = 0.5;
    this.updateSpeed();
    window.addEventListener('resize', () => this.updateSpeed());
  }

  private updateSpeed() {
    const scaleFactor = window.innerWidth / 1920; // 1920 ist eine Referenzbreite
    this.baseSpeed = 5 * scaleFactor;
}

  update() {
    this.z -= this.baseSpeed;
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
