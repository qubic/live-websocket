import { LatestStatsResponse } from "./services/apis/stats/api.stats.model";
import { ApiStatsService } from "./services/apis/stats/api.stats.service";

export class MovingText {
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

        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
        infoDiv.textContent = this._info;

        this._divElement.appendChild(titleDiv);
        this._divElement.appendChild(valueDiv);
        // this._divElement.appendChild(infoDiv);

        document.body.appendChild(this._divElement);
    }

    get currentTick(): number | null {
        return this.latestStats?.data?.currentTick ?? null;
    }

    get currentValue(): string | null {
        return this.currentValueDisplay ?? null;
    }

    private updateSpeed() {
        const scaleFactor = window.innerWidth / 1920;
        this.baseSpeed = 5 * scaleFactor;
    }


    constructor(text: string) {
        this._text = text;
        this._title = "";
        this._info = "";
        this._z = window.innerWidth;
        this._fontSize = 10;

        // Bind `fetchLatestStats` to the current context
        this.fetchLatestStats = this.fetchLatestStats.bind(this);

        // Call fetchLatestStats every 60 seconds
        //setInterval(this.fetchLatestStats, 60000);
        this.fetchLatestStats();

        this._divElement = document.createElement('div');
        this._divElement.className = 'moving-text';
        this._divElement.textContent = this._text;

        document.body.appendChild(this._divElement);
        this.updateSpeed();
        window.addEventListener('resize', () => this.updateSpeed());
    }


    update() {
        this._z -= this.baseSpeed;

        if (this._z <= 0) {
            this.setNewText();
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


    private setNewText() {
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
                    // Backup current Stats-Objekts 
                    if (this.latestStats) {
                        this.backupStats = { ...this.latestStats };
                    }

                    this.latestStats = response;
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
