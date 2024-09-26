import { canvas, ctx } from "../universe";
export class Cube {
  x: number;
  y: number;
  z: number;
  size: number;
  vertices: { x: number; y: number; z: number }[];
  constructor() {
    // Setzt die Position des Würfels
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = Math.random() * canvas.width + canvas.width / 2; // Startposition modifiziert
    // Setzt die Größe des Würfels
    this.size = 10; // Größe etwas erhöht
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
  }
  update() {
    // Bewegt den Würfel auf der Z-Achse
    this.z -= 5; // Geschwindigkeit verringert
    if (this.z <= 0) {
      this.z = canvas.width + canvas.width / 2; // Resette die Position
    }
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
    ctx.strokeStyle = 'rgb(97 240 254)';
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
    // Wendet eine perspektivische Projektion auf den Würfel an
    const projectedZ = this.z + vertex.z * this.size;
    if (projectedZ <= 0) return null; // Verhindert Division durch Null oder negative Werte
    const scale = canvas.width / projectedZ;
    const x = (vertex.x * this.size + this.x) * scale + canvas.width / 8;
    const y = (vertex.y * this.size + this.y) * scale + canvas.height / 6;
    return { x, y };
  }
}