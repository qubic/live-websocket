import { canvas } from "../universe";

export class Dialog {
    private dialogElement: HTMLDivElement;

    constructor(title: string, content: string) {
        this.dialogElement = document.createElement('div');
        this.dialogElement.className = 'dialog';
        this.dialogElement.innerHTML = `
            <div class="dialog-content">
                <h2>${title}</h2>
                <p>${content}</p>
                <button id="closeDialog">Schließen</button>
            </div>
        `;

        document.body.appendChild(this.dialogElement);

        const closeButton = this.dialogElement.querySelector('#closeDialog');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
    }

    close() {
        if (this.dialogElement && this.dialogElement.parentNode === document.body) {
            document.body.removeChild(this.dialogElement);
        }
        this.dialogElement.remove();
    }

    show() {
        this.dialogElement.style.display = 'flex';
    }
}
