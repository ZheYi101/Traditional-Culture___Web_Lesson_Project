import "./components/DivinationSection.js";
import "./components/ReadingCorner.js";
import "../../components/SectionTitle.js";

class TcHomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <tc-divination-section></tc-divination-section>
      <tc-reading-corner></tc-reading-corner>
    `;
  }
}

if (!customElements.get("tc-home-page")) {
  customElements.define("tc-home-page", TcHomePage);
}

export const homePageTag = "tc-home-page";
