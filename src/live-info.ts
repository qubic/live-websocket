import { TransferWebSocketService } from "./services/websockets/wss.transfer.service";
import { BaseMessage, QuTransferMessage, RandomMiningSeedMessage, TickMessage } from './services/websockets/wss.transfer.model';
import { MessageType } from './helpers/enums';

export class LiveInfo {
    private webSocketService: TransferWebSocketService;
    private container: HTMLDivElement;
    private messageQueue: Array<{ title: string, text: string }> = []; // Warteschlange für Nachrichten
    private isAnimating: boolean = false; // Ob gerade eine Animation läuft

    constructor() {
        // WebSocket-Service initialisieren
        this.webSocketService = new TransferWebSocketService();

        // Container für die Nachrichten erstellen
        this.container = document.createElement('div');
        this.container.className = 'message-container';
        document.body.appendChild(this.container);

        // Callback für eingehende Nachrichten setzen
        this.webSocketService.setOnMessageCallback((message: BaseMessage) => {
            this.handleWebSocketMessage(message);
        });

        setInterval(() => {
            this.processQueue();
        }, 1000); // 2000 Millisekunden = 2 Sekunden

    }

    private createDivElement(title: string, text: string) {
        const divElement = document.createElement('div');
        divElement.className = 'live-moving-text';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = title;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = text;

        divElement.appendChild(titleDiv);
        divElement.appendChild(valueDiv);

        // Neue Nachricht am Ende des Containers einfügen
        this.container.appendChild(divElement);

        // Starte die Animation und zeige die nächste Nachricht, wenn die Animation fertig ist
        this.animateDivElement(divElement).then(() => {
            this.isAnimating = false; // Animation beendet
            this.processQueue(); // Zeige die nächste Nachricht in der Warteschlange
        });
    }

    private animateDivElement(divElement: HTMLDivElement): Promise<void> {
        return new Promise((resolve) => {
            divElement.style.animation = 'starWarsCrawl 17s linear forwards'; // Animation auf 17s ändern
    
            // Entferne das Element nach Abschluss der Animation
            setTimeout(() => {
                divElement.remove();
                resolve();
            }, 17000); // Warten bis 17 Sekunden nach dem Start der Animation
        });
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
                break;
            case MessageType[MessageType.RandomMiningSeed]:
                const msgSeed = message as RandomMiningSeedMessage;
                title = 'Seed';
                text = msgSeed.Seed.substring(0, 5);
                break;
            case MessageType[MessageType.Tick]:
                const msgTick = message as TickMessage;
                title = 'Tick';
                text = msgTick.Tick.toLocaleString();
                break;
            default:
                console.log('Unknown message type:', message);
                return;
        }

        // Nachricht zur Warteschlange hinzufügen
        this.messageQueue.push({ title, text });

         this.processQueue();
        if (!this.isAnimating) {
        }
    }

    private processQueue() {
        // Wenn Nachrichten in der Warteschlange vorhanden sind
        if (this.messageQueue.length > 0) {
            const nextMessage = this.messageQueue.shift(); // Nächste Nachricht aus der Warteschlange holen
            if (nextMessage) {
                this.isAnimating = true; // Setze das Animations-Flag
                this.createDivElement(nextMessage.title, nextMessage.text); // Starte die Anzeige der Nachricht
            }
        }
    }
    
    show() {
        this.container.style.display = 'block';
    }
    
    hide() {
        this.container.style.display = 'none';
    }
    
}