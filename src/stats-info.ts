import { LatestStatsResponse } from "./services/apis/stats/api.stats.model";
import { ApiStatsService } from "./services/apis/stats/api.stats.service";

export class StatsInfo {
    private _title: string;
    private _text: string;
    private _info: string;
    private _z: number;
    private _fontSize: number;
    private _divElement: HTMLDivElement;
    private baseSpeed: number = 5;

    private apiStatsService = new ApiStatsService();
    private latestStats: LatestStatsResponse | null = null;
    private backupStats: LatestStatsResponse | null = null;
    private counter: number = 0;
    private currentValueDisplay: string | null = null;

    // Liste der Variablennamen als Strings
    private variableNames: string[] = [
        "epoch",
        "price",
        "marketCap",
        "currentTick",
        "timestamp",
        "activeAddresses",
        "ticksInCurrentEpoch",
        "emptyTicksInCurrentEpoch",
        "epochTickQuality",
        "circulatingSupply",
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
        //setInterval(this.fetchLatestStats, 10000);
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

    get currentTick(): number | null {
        return this.latestStats?.data?.currentTick ?? null;
    }

    get currentValue(): string | null {
        return this.currentValueDisplay ?? null;
    }

    private updateSpeed() {
        const scaleFactor = window.innerWidth / 1920; // 1920 ist eine Referenzbreite
        this.baseSpeed = 5 * scaleFactor;
    }

    update() {
        this._z -= this.baseSpeed;

        // Wenn der Text den Bildschirm verlässt
        if (this._z <= 0) {
            this.setNewLabel();
            this._z = window.innerWidth;

            // Setze den Text für eine Sekunde stehen und dann langsam ausblenden
            this._divElement.classList.remove('fade-out');
            setTimeout(() => {
                // Text stehen lassen für 1 Sekunde
                setTimeout(() => {
                    // Text ausblenden
                    this._divElement.classList.add('fade-out');
                }, 4000); // Verweildauer von 1 Sekunde
            }, 1500); // Kurze Verzögerung, um das Entfernen der Fade-Out-Klasse zu gewährleisten
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
            this.currentValueDisplay = (this.counter + 1) + "/" + (this.variableNames.length + 1);

            switch (this.variableNames[this.counter]) {
                case 'timestamp':
                    this._title = "timestamp";
                    const timestamp = parseInt(this.latestStats.data.timestamp);
                    const date = new Date(timestamp * 1000);
                    this.text = date.toLocaleString();
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
                    this._title = "marketcap";
                    this.text = parseInt(this.latestStats.data.marketCap).toLocaleString() + "$";
                    break;
                case 'epoch':
                    this._title = "epoch";
                    this.text = this.latestStats.data.epoch.toLocaleString();
                    break;
                case 'currentTick':
                    this._title = "current tick";
                    this.text = this.latestStats.data.currentTick.toLocaleString();
                    this._info = "";
                    break;
                case 'ticksInCurrentEpoch':
                    this._title = "number of ticks ";
                    this.text = this.latestStats.data.ticksInCurrentEpoch.toLocaleString();
                    break;
                case 'emptyTicksInCurrentEpoch':
                    this._title = "empty ticks";
                    this.text = this.latestStats.data.emptyTicksInCurrentEpoch.toLocaleString();
                    break;
                case 'epochTickQuality':
                    this._title = "tick quality";
                    this.text = this.latestStats.data.epochTickQuality.toString() + "%";
                    break;
                case 'burnedQus':
                    this._title = "burned qus";
                    this.text = parseInt(this.latestStats.data.burnedQus).toLocaleString();
                    break;
                default:
                    break
            }
            if (this.counter >= this.variableNames.length) {
                this.fetchLatestStats();
                this.counter = 0;
            } else {
                this.counter++;
            }
            console.log(this.counter + "/" + this.variableNames.length + ' ' + this.text);
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