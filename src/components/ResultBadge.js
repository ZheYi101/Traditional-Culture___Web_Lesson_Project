class TcResultBadge extends HTMLElement {
  static get observedAttributes() {
    return ["text", "variant"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const text = this.getAttribute("text") || "";
    const variant = this.getAttribute("variant") || "default";
    this.innerHTML = `<span class="result-badge result-badge-${variant}">${text}</span>`;
  }
}

if (!customElements.get("tc-result-badge")) {
  customElements.define("tc-result-badge", TcResultBadge);
}
