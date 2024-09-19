import { LatestStatsResponse } from "./services/apis/stats/api.stats.model";
import { ApiStatsService } from "./services/apis/stats/api.stats.service";

export class MovingText {
    private _title: string;
    private _text: string;
    private _info: string;
    private _z: number;
    private _fontSize: number;
    private _divElement: HTMLDivElement;
    private baseSpeed: number = 6;

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
        this._title = "";
        this._info = "";
        this._z = window.innerWidth;
        this._fontSize = 10;

        // Bind `fetchLatestStats` to the current context
        this.fetchLatestStats = this.fetchLatestStats.bind(this);

        // Call fetchLatestStats every 30 seconds
        setInterval(this.fetchLatestStats, 60000);
        this.fetchLatestStats();


        // Erstellen des div-Elements
        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';
        this._divElement.textContent = this._text;

        // Hinzufügen des div-Elements zum Body
        document.body.appendChild(this._divElement);
        this.updateSpeed();
        window.addEventListener('resize', () => this.updateSpeed());
    }

    get text(): string {
        return this._text;
    }

    set text(newText: string) {
        // Entfernen des alten div-Elements, wenn der Text geändert wird
        this.removeDivElement();

        this._text = newText;

        // Erstellen und Hinzufügen des neuen div-Elements
        // this._divElement = document.createElement('div');
        // this._divElement.className = 'moving-text';
        // this._divElement.textContent = this._text;
        // document.body.appendChild(this._divElement);

        // Erstellen und Hinzufügen des neuen div-Elements basierend auf dem neuen HTML
        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';

        // Erstellen des div-Elements für den Titel
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = this._title;

        // Erstellen des div-Elements für den Textwert
        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = this._text;

        // Erstellen des div-Elements für die Info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
        infoDiv.textContent = this._info;

        // Zusammenbau der Elemente
        this._divElement.appendChild(titleDiv);
        this._divElement.appendChild(valueDiv);
        // this._divElement.appendChild(infoDiv);

        // Hinzufügen des div-Elements zum Body
        document.body.appendChild(this._divElement);


    }

    private updateSpeed() {
        const scaleFactor = window.innerWidth / 1920; // 1920 ist eine Referenzbreite
        this.baseSpeed = 6 * scaleFactor;
    }

    update() {
        this._z -= this.baseSpeed;
        if (this._z <= 0) {
            this.setNewLabel();
            this._z = window.innerWidth;
        }
        this._fontSize = 40 * (window.innerWidth / this._z);

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
            this._info = this.latestStats.data.currentTick.toLocaleString();
            switch (this.variableNames[this.counter]) {
                case 'Timestamp':
                    this._title = "timestamp";
                    // Wandeln des Zeitstempels in ein UTC-Datum und Formatierung als Zeichenkette
                    const date = new Date(this.latestStats.data.timestamp);

                    // Formatierung als UTC-Zeit
                    this.text = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ` +
                        `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')} UTC`;
                    this.text = this.latestStats.data.timestamp;
                    break;
                case 'circulatingSupply':
                    this._title = "circulating supply";
                    this.text = parseInt(this.latestStats.data.circulatingSupply).toLocaleString();
                    break;
                case 'activeAddresses':
                    this._title = "active addresses";
                    this.text = this.latestStats.data.activeAddresses.toLocaleString();
                    break;
                case 'price':
                    this._title = "price";
                    this.text = this.latestStats.data.price.toString() + "$";
                    break;
                case 'marketCap':
                    this._title = "market cap";
                    this.text = parseInt(this.latestStats.data.marketCap).toLocaleString()+ "$";
                    break;
                case 'epoch':
                    this._title = "epoch";
                    this.text = this.latestStats.data.epoch.toLocaleString();
                    break;
                case 'ticksInCurrentEpoch':
                    this._title = "ticks in current epoch";
                    this.text = this.latestStats.data.ticksInCurrentEpoch.toLocaleString();
                    break;
                case 'emptyTicksInCurrentEpoch':
                    this._title = "Empty ticks in current epoch";
                    this.text = this.latestStats.data.emptyTicksInCurrentEpoch.toLocaleString();
                    break;
                case 'epochTickQuality':
                    this._title = "epoch tick quality";
                    this.text = this.latestStats.data.epochTickQuality.toString() + "%";
                    break;
                case 'burnedQus':
                    this._title = "burned qus";
                    this.text = parseInt(this.latestStats.data.burnedQus).toLocaleString();
                    this.counter = 0;
                    break;
                default:
                case 'currentTick':
                    this._title = "Current Tick";
                    this.text = this.latestStats.data.currentTick.toLocaleString();
                    this._info = "";
                    break;
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
