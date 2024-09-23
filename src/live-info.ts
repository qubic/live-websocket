import { TransferWebSocketService } from "./services/websockets/wss.transfer.service";
import { BaseMessage, QuTransferMessage, RandomMiningSeedMessage, TickMessage } from './services/websockets/wss.transfer.model';
import { MessageType } from './helpers/enums';

export class LiveInfo {
    private _title: string;
    private _text: string;
    // private _info: string;
    private _z: number;
    private _fontSize: number;
    private _divElement: HTMLDivElement;
    private baseSpeed: number = 5;

    private webSocketService: TransferWebSocketService;

    get text(): string {
        return this._text;
    }

    set text(newText: string) {
        this.removeDivElement();

        this._text = newText;

        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = this._title;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = this._text;

        this._divElement.appendChild(titleDiv);
        this._divElement.appendChild(valueDiv);

        document.body.appendChild(this._divElement);
    }

    constructor(text: string) {
        this._text = text;
        this._title = "";
        // this._info = "";
        this._z = window.innerWidth;
        this._fontSize = 10;

        // Initialize the WebSocket service
        this.webSocketService = new TransferWebSocketService();

        // Setze das Callback für eingehende Nachrichten
        this.webSocketService.setOnMessageCallback((message: BaseMessage) => {
            this.handleWebSocketMessage(message);
        });

        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';
        this._divElement.textContent = this._text;

        document.body.appendChild(this._divElement);
        // this.updateSpeed();
        // window.addEventListener('resize', () => this.updateSpeed());
    }

    update() {
        this._z -= this.baseSpeed;

        if (this._z <= 0) {
            this._z = window.innerWidth;

            this._divElement.classList.remove('fade-out');
            setTimeout(() => {
                setTimeout(() => {
                    this._divElement.classList.add('fade-out');
                }, 4000);
            }, 1500);
        }

        this._fontSize = 40 * (window.innerWidth / this._z);
        this._divElement.style.fontSize = `${this._fontSize}px`;
    }

    draw() {
        // middle div-Elements
        this._divElement.style.left = `${window.innerWidth / 2}px`;
        this._divElement.style.top = `${window.innerHeight / 2}px`;
    }

    private removeDivElement() {
        if (this._divElement) {
            document.body.removeChild(this._divElement);
        }
    }

    private handleWebSocketMessage(message: BaseMessage) {
        // Hier wird auf die eingehenden Nachrichten reagiert
        console.log('Received WebSocket message:', message);
        
        switch (message.MessageType) {
            case MessageType[MessageType.QuTransfer]:
                const msgQuTransfer = message as QuTransferMessage; 
            this._title = 'transfer amount:' + msgQuTransfer.Amount.toLocaleString();
            this.text = 'From: '+msgQuTransfer.SourceAddress.substring(0, 5) +' To: '+ msgQuTransfer.DestinationAddress.substring(0, 5);
                break;
            case MessageType[MessageType.RandomMiningSeed]:
                const msgSeed = message as RandomMiningSeedMessage; 
                this._title = `seed`;
                this.text = msgSeed.Seed.toString();
                break;
            case MessageType[MessageType.Tick]:
                const msgTick = message as TickMessage; 
                this._title = `tick`;
                this.text = msgTick.Tick.toLocaleString();
                break;
            default:
                console.log('Unknown message type:', message);
        }
    }
}
