import { bindDivination as bindHomeDivination, DivinationSection } from "./components/DivinationSection.js";
import { SolarTermsSection } from "./components/SolarTermsSection.js";

export function HomePage() {
  return `
    <header class="page-header">
      <div class="brand">
        <h1>节气灵签</h1>
        <p>传统文化卡片 + 哈希占卜 + 轻量小游戏入口</p>
      </div>
    </header>
    ${SolarTermsSection()}
    ${DivinationSection()}
    <section class="section" id="games">
      <h2 class="section-title">小游戏预告</h2>
      <div class="divination-panel">
        <p>划龙舟节奏点击小游戏将在下一阶段实现，目前保留模块与样式插槽。</p>
      </div>
    </section>
  `;
}

export function initHomePage() {
  bindHomeDivination();
}
