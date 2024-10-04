import { canvas, ctx } from "../universe";
import { Dialog } from "./dialog";


export class Cube {
  x: number;
  y: number;
  z: number;
  size: number;
  vertices: { x: number; y: number; z: number }[];
  speed = 8;
  baseSpeed: number = this.speed;


  private static currentDialog: Dialog | null = null;

  constructor() {
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = canvas.width * 2; // Start from far back

    this.size = 80;

    // Definiert die 8 Eckpunkte des Würfels
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
    canvas.addEventListener('click', (event) => this.handleClick(event));
  }

  private updateSpeed() {
    const scaleFactor = window.innerWidth / 1920; // 1920 ist eine Referenzbreite
    this.baseSpeed = this.speed * scaleFactor;
    this.size = 80 * scaleFactor;
  }

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

  draw() {
    // Zeichnet die Linien des Würfels
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

  drawLine(startIndex: number, endIndex: number) {
    // Holt die Start- und Endpunkte der Linie
    const start = this.project(this.vertices[startIndex]);
    const end = this.project(this.vertices[endIndex]);

    // Zeichnet eine Linie zwischen den beiden Punkten, nur wenn sie auf dem Bildschirm sichtbar sind
    if (start && end) {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }
  }


  project(vertex: { x: number; y: number; z: number }) {
    const projectedZ = this.z + vertex.z * this.size;
    if (projectedZ <= 0) return null;

    const scale = canvas.width / projectedZ;
    const x = (vertex.x * this.size + this.x) * scale + canvas.width / 2;
    const y = (vertex.y * this.size + this.y) * scale + canvas.height / 2;
    return { x, y };
  }


  handleClick(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the click is within the cube's boundaries
    const projectedCenter = this.project({ x: 0, y: 0, z: 0 });
    if (projectedCenter) {
      const distance = Math.sqrt(
        Math.pow(mouseX - projectedCenter.x, 2) +
        Math.pow(mouseY - projectedCenter.y, 2)
      );

      if (distance <= this.size / 2) {
        if (Cube.currentDialog) {
          Cube.currentDialog.close();
        }
        Cube.currentDialog = new Dialog('Cube Info', 'You clicked on a cube!');
        Cube.currentDialog.show();
      }
    }
  }}