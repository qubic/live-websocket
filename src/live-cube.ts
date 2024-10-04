
import { TransferWebSocketService } from "./services/websockets/wss.transfer.service";
import { MessageType } from './helpers/enums';
import { Cube } from './elements/cube';
import { BaseMessage, QuTransferMessage, RandomMiningSeedMessage, SystemInfoMessage, TickMessage } from './services/websockets/wss.transfer.model';

export class LiveCube {
    private webSocketService: TransferWebSocketService;
    private cubes: Cube[] = [];

    constructor() {
        this.webSocketService = new TransferWebSocketService();
        this.webSocketService.setOnMessageCallback((message: BaseMessage) => {
            this.handleWebSocketMessage(message);
        });
    }

    private displayMessage(title: string, text: string) {
        const messagesDiv = document.getElementById('terminal');
        if (messagesDiv) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'terminal-message';
            messageDiv.textContent =  new Date().toLocaleTimeString() + ` - ${title}: ${text}`;  
            messagesDiv.insertBefore(messageDiv, messagesDiv.firstChild); // Insert at the top
        }
    }
    
    private handleWebSocketMessage(message: BaseMessage) {
        console.log('Received WebSocket message:', message);
    
        let title = '';
        let text = '';
    
        // Nachrichtentypen abfangen und Text zuweisen
        switch (message.MessageType) {
            case MessageType[MessageType.QuTransfer]:
                const msgQuTransfer = message as QuTransferMessage;
                title = 'Transfer amount: ' + msgQuTransfer.Amount.toLocaleString();
                text = 'From: ' + msgQuTransfer.SourceAddress.substring(0, 5) + ' To: ' + msgQuTransfer.DestinationAddress.substring(0, 5);
                // text = 'From: ' + msgQuTransfer.SourceAddress + ' To: ' + msgQuTransfer.DestinationAddress;
                break;
            case MessageType[MessageType.RandomMiningSeed]:
                const msgSeed = message as RandomMiningSeedMessage;
                title = 'Random Mining Seed';
                text = msgSeed.Seed.substring(0, 5);
                // text = msgSeed.Seed;
                break;
            case MessageType[MessageType.Tick]:
                const msgTick = message as TickMessage;
                title = 'Tick';
                text = msgTick.Tick.toLocaleString();
                break;
            case MessageType[MessageType.SystemInfo]:
                const msgSystemInfo = message as SystemInfoMessage;
                title = 'System Info';
                // text = 'Epoch: ' + msgSystemInfo.QubicSystemInfo.Epoch + ' Tick: ' + msgSystemInfo.QubicSystemInfo.Tick;
                text = 'Epoch: ' + msgSystemInfo.QubicSystemInfo.Epoch + ' Tick: ' + msgSystemInfo.QubicSystemInfo.Tick + ' Version: ' + msgSystemInfo.QubicSystemInfo.Version;

                break;
            default:
                console.log('Unknown message type:', message);
                title = message.MessageType;
                text = "unknown message ";
                return;
        }
    
        // Display the message in the HTML page
        this.displayMessage(title, text);
    
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

    //Diese Methode soll alle Cubes löschen
    clear() {
        this.cubes = [];
    }
}
