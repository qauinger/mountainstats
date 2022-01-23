class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div>
                    <ol id="footer_hypers">
                        <li><a href="https://github.com/qauinger/mountainstats/" target="_blank">Contribute</a></li>
                     </ol>
                </div>
            </footer>
        `;
    }
}

customElements.define('footer-component', Footer);
