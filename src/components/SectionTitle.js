class TcSectionTitle extends HTMLElement {
    static get observedAttributes() {
        return ["text"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const text = this.getAttribute("text") || "";
        this.innerHTML = `<h2 class="section-title">${text}</h2>`;
    }
}

if (!customElements.get("tc-section-title")) {
    customElements.define("tc-section-title", TcSectionTitle);
}
