import { canvas, ctx } from "../universe";

export class Cube {
  x: number;
  y: number;
  z: number;
  vertices: { x: number; y: number; z: number }[];
  size = 80;
  speed = 25;
  startFromFarBack = 10;
  baseSize = this.size;
  baseSpeed = this.speed;

  constructor() {
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = canvas.width * this.startFromFarBack; // Start from far back

    this.size = this.baseSize; // Initial size value
    this.baseSize = this.size;

    // Defines the 8 vertices of the cube
    this.vertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 }
    ];

    this.updateSpeed();
    window.addEventListener('resize', () => this.updateSpeed());
  }

  // Updates the speed and size of the cube based on the window width
  private updateSpeed() {
    const scaleFactor = window.innerWidth / 1920; // 1920 is a reference width
    this.baseSpeed = this.speed * scaleFactor;
    this.size = this.baseSize * scaleFactor;
  }

  // Updates the position of the cube and resets it if it reaches the front
  update() {
    this.z -= this.baseSpeed;
    if (this.z <= 0) {
      // Reset to the far back when it reaches the front
      this.z = canvas.width / 2;
      // Optionally, randomize x and y positions again
      this.x = Math.random() * canvas.width - canvas.width / 2;
      this.y = Math.random() * canvas.height - canvas.height / 2;
      return true;
    }
    return false;
  }

  // Draws the cube by connecting its vertices with lines
  draw() {
    ctx.beginPath();
    this.drawLine(0, 1);
    this.drawLine(1, 2);
    this.drawLine(2, 3);
    this.drawLine(3, 0);
    this.drawLine(4, 5);
    this.drawLine(5, 6);
    this.drawLine(6, 7);
    this.drawLine(7, 4);
    this.drawLine(0, 4);
    this.drawLine(1, 5);
    this.drawLine(2, 6);
    this.drawLine(3, 7);
    ctx.strokeStyle = 'rgba(176, 250, 255, 0.8)';
    ctx.stroke();
  }

  // Draws a line between two vertices if they are visible on the screen
  drawLine(startIndex: number, endIndex: number) {
    const start = this.project(this.vertices[startIndex]);
    const end = this.project(this.vertices[endIndex]);

    if (start && end) {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }
  }

  // Projects a 3D vertex to a 2D point on the canvas
  project(vertex: { x: number; y: number; z: number }) {
    const projectedZ = this.z + vertex.z * this.size;
    if (projectedZ <= 0) return null;

    const scale = canvas.width / projectedZ;
    const x = (vertex.x * this.size + this.x) * scale + canvas.width / 2;
    const y = (vertex.y * this.size + this.y) * scale + canvas.height / 2;
    return { x, y };
  }
}