class TcSolarTermCard extends HTMLElement {
  static get observedAttributes() {
    return ["name", "season", "intro"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") || "";
    const season = this.getAttribute("season") || "";
    const intro = this.getAttribute("intro") || "";
    this.innerHTML = `
      <article class="term-card" tabindex="0" aria-label="${name}介绍">
        <h3>${name}</h3>
        <small>${season}季节气</small>
        <p>${intro}</p>
      </article>
    `;
  }
}

if (!customElements.get("tc-solar-term-card")) {
  customElements.define("tc-solar-term-card", TcSolarTermCard);
}
