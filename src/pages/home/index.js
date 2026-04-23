import "./components/DivinationSection.js";
import "../../components/SectionTitle.js";

class TcHomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <tc-divination-section></tc-divination-section>
      <section class="section home-filler-card">
        <tc-section-title text="闲读角"></tc-section-title>
        <ul class="home-filler-list">
          <li>山川有灵，草木有心。</li>
          <li>今日不赶路，只把脚步放轻。</li>
          <li>先把呼吸调匀，再决定去向。</li>
        </ul>
      </section>
    `;
  }
}

if (!customElements.get("tc-home-page")) {
  customElements.define("tc-home-page", TcHomePage);
}

export const homePageTag = "tc-home-page";
