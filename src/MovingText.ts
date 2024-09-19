import { LatestStatsResponse } from "./services/apis/stats/api.stats.model";
import { ApiStatsService } from "./services/apis/stats/api.stats.service";

export class MovingText {
    private _text: string;
    private _z: number;
    private _fontSize: number;
    private _divElement: HTMLDivElement;

    private apiStatsService = new ApiStatsService();
    private latestStats: LatestStatsResponse | null = null;
    private backupStats: LatestStatsResponse | null = null;
    private counter: number = 0;

    // Liste der Variablennamen als Strings
    private variableNames: string[] = [
        "timestamp",
        "circulatingSupply",
        "activeAddresses",
        "price",
        "marketCap",
        "epoch",
        "currentTick",
        "ticksInCurrentEpoch",
        "emptyTicksInCurrentEpoch",
        "epochTickQuality",
        "burnedQus"
    ];


    constructor(text: string) {
        this._text = text;
        this._z = window.innerWidth;
        this._fontSize = 10;

        // Bind `fetchLatestStats` to the current context
        this.fetchLatestStats = this.fetchLatestStats.bind(this);

        // Call fetchLatestStats every 30 seconds
        setInterval(this.fetchLatestStats, 30000);
        this.fetchLatestStats();

        // Erstellen des div-Elements
        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';
        this._divElement.textContent = this._text;

        // Hinzufügen des div-Elements zum Body
        document.body.appendChild(this._divElement);
    }

    get text(): string {
        return this._text;
    }

    set text(newText: string) {
        // Entfernen des alten div-Elements, wenn der Text geändert wird
        this.removeDivElement();

        this._text = newText;

        // Erstellen und Hinzufügen des neuen div-Elements
        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';
        this._divElement.textContent = this._text;
        document.body.appendChild(this._divElement);
    }

    update() {
        this._z -= 4;
        if (this._z <= 0) {
            this.setNewLabel();
            this._z = window.innerWidth;
        }
        this._fontSize = 60 * (window.innerWidth / this._z);

        // Aktualisieren des div-Elements
        this._divElement.style.fontSize = `${this._fontSize}px`;
    }

    draw() {
        // Zentrieren des div-Elements auf der Seite
        this._divElement.style.left = `${window.innerWidth / 2}px`;
        this._divElement.style.top = `${window.innerHeight / 2}px`;
    }

    private removeDivElement() {
        if (this._divElement) {
            document.body.removeChild(this._divElement);
        }
    }

    private setNewLabel() {
        if (this.latestStats && this.latestStats.data) {
            switch (this.variableNames[this.counter]) {
                case 'timestamp':
                    this.text = this.latestStats.data.timestamp;
                    break;
                case 'circulatingSupply':
                    this.text = this.latestStats.data.circulatingSupply;
                    break;
                case 'activeAddresses':
                    this.text = this.latestStats.data.activeAddresses.toString();
                    break;
                case 'price':
                    this.text = this.latestStats.data.price.toString();
                    break;
                case 'marketCap':
                    this.text = this.latestStats.data.marketCap;
                    break;
                case 'epoch':
                    this.text = this.latestStats.data.epoch.toString();
                    break;
                case 'currentTick':
                    this.text = this.latestStats.data.currentTick.toString();
                    break;
                case 'ticksInCurrentEpoch':
                    this.text = this.latestStats.data.ticksInCurrentEpoch.toString();
                    break;
                case 'emptyTicksInCurrentEpoch':
                    this.text = this.latestStats.data.emptyTicksInCurrentEpoch.toString();
                    break;
                case 'epochTickQuality':
                    this.text = this.latestStats.data.epochTickQuality.toString();
                    break;
                case 'burnedQus':
                    this.text = this.latestStats.data.burnedQus;
                    this.counter = 0;
                    break;
                default:
                    this.text = 'N/A';
                    break;
            }
            if (this.counter >= this.variableNames.length) {
                this.counter = 0;
            } else {
                this.counter++;
            }
            console.log('Value:', this.text);
        }
    }


    fetchLatestStats() {
        console.log("fetchLatestStats called");
        if (this.apiStatsService && typeof this.apiStatsService.getLatestStats === 'function') {
            this.apiStatsService.getLatestStats()
                .then((response: LatestStatsResponse) => {
                    // Backup des aktuellen Stats-Objekts erstellen
                    if (this.latestStats) {
                        this.backupStats = { ...this.latestStats }; // Tiefes Kopieren
                    }

                    // Setze das aktuelle Stats-Objekt
                    this.latestStats = response;

                    // Vergleiche die Daten
                    this.compareStats();
                })
                .catch((error) => {
                    console.error('Error fetching latest stats:', error);
                });
        } else {
            console.error('apiStatsService or getLatestStats method is not available');
        }
    }

    compareStats() {
        if (this.latestStats?.data && this.backupStats?.data) {
            if (this.latestStats.data.currentTick !== this.backupStats.data.currentTick) {
                console.log('Tick hat sich geändert:', this.latestStats.data.currentTick);
            }
        }
    }

}
