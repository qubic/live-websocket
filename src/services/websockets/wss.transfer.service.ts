import { BaseMessage, QuTransferMessage, RandomMiningSeedMessage, TickMessage } from './wss.transfer.model';
import { MessageType } from '../../helpers/enums';

export class TransferWebSocketService {
    private socket: WebSocket;
    private onMessageCallback?: (message: BaseMessage) => void;


    constructor() {
        this.socket = new WebSocket('wss://rt.qubic.li/live');

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data.toString()) as BaseMessage;
            this.handleMessage(message);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

     // Ermöglicht das Setzen eines Callback, das bei neuen Nachrichten aufgerufen wird
     public setOnMessageCallback(callback: (message: BaseMessage) => void) {
        this.onMessageCallback = callback;
    }


    private handleMessage(message: BaseMessage) {
        if (this.onMessageCallback) {
            this.onMessageCallback(message); // Callback aufrufen
        }
    
        switch (message.MessageType) {
            case MessageType[MessageType.QuTransfer]:
                this.handleQuTransfer(message as QuTransferMessage);
                break;
            case MessageType[MessageType.RandomMiningSeed]:
                this.handleRandomMiningSeed(message as RandomMiningSeedMessage);
                break;
            case MessageType[MessageType.Tick]:
                this.handleTick(message as TickMessage);
                break;
            default:
                console.log('Unknown message type:', message);
        }
    }
    

    private handleQuTransfer(message: QuTransferMessage) {
        console.log('QuTransfer:', {
            tick: message.Tick,
            logId: message.LogId,
            logDigest: message.LogDigest,
            amount: message.Amount,
            destinationAddress: message.DestinationAddress,
            sourceAddress: message.SourceAddress
        });
    }

    private handleRandomMiningSeed(message: RandomMiningSeedMessage) {
        console.log('RandomMiningSeed:', {
            seed: message.Seed
        });
    }

    private handleTick(message: TickMessage) {
        console.log('Tick:', {
            tick: message.Tick
        });
    }
}
