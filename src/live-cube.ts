
import { TransferWebSocketService } from "./services/websockets/wss.transfer.service";
// import { BaseMessage, QuTransferMessage, RandomMiningSeedMessage, TickMessage } from './services/websockets/wss.transfer.model';
import { BaseMessage, } from './services/websockets/wss.transfer.model';
// import { MessageType } from './helpers/enums';
import { Cube } from './elements/cube';
// import { canvas, ctx } from "./universe";

export class LiveCube {
    private webSocketService: TransferWebSocketService;
    private cubes: Cube[] = [];

    constructor() {
        this.webSocketService = new TransferWebSocketService();
        this.webSocketService.setOnMessageCallback((message: BaseMessage) => {
            this.handleWebSocketMessage(message);
        });
    }

    private handleWebSocketMessage(message: BaseMessage) {
        console.log('Received WebSocket message:', message);
        
        // Create a new cube for each incoming message
        const newCube = new Cube();
        this.cubes.push(newCube);
    }

    update() {
        this.cubes = this.cubes.filter(cube => {
            const shouldKeep = cube.update();
            return !shouldKeep; // Keep the cube if update() returns false
        });
    }

    draw() {
        this.cubes.forEach(cube => cube.draw());
    }
}
