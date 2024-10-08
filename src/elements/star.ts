import { canvas, ctx } from "../universe";

export class Star {
  x: number;
  y: number;
  z: number;
  radius: number; 
  baseSpeed: number = 5;

  constructor() {
    // Initialize the star's position and speed
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = Math.random() * canvas.width;
    this.radius = 0.5;
    this.updateSpeed();
    window.addEventListener('resize', () => this.updateSpeed());
  }

  // Update the speed of the star based on the window width
  private updateSpeed() {
    const scaleFactor = window.innerWidth / 1920; // 1920 is a reference width
    this.baseSpeed = 5 * scaleFactor;
  }

  // Update the star's position
  update() {
    this.z -= this.baseSpeed;
    if (this.z <= 0) {
      this.z = canvas.width;
    }
  }

  // Draw the star on the canvas
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