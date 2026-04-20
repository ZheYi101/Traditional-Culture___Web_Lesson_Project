import "./components/SolarTermsSection.js";
import "./components/DivinationSection.js";
import "../../components/SectionTitle.js";

class TcHomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header class="page-header">
        <div class="brand">
          <h1>节气灵签</h1>
          <p>传统文化卡片 + 哈希占卜 + 轻量小游戏入口</p>
        </div>
      </header>
      <tc-solar-terms-section></tc-solar-terms-section>
      <tc-divination-section></tc-divination-section>
      <section class="section" id="games">
        <tc-section-title text="小游戏预告"></tc-section-title>
        <div class="divination-panel">
          <p>划龙舟节奏点击小游戏将在下一阶段实现，目前保留模块与样式插槽。</p>
        </div>
      </section>
    `;
  }
}

if (!customElements.get("tc-home-page")) {
  customElements.define("tc-home-page", TcHomePage);
}

export const homePageTag = "tc-home-page";
