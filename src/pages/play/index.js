import "../../components/SectionTitle.js";

class TcPlayPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="play-hero section">
        <h1 class="play-title">龙舟节奏 · 预备页</h1>
        <p class="play-desc">这是一个示例新页面。后续你可以把划龙舟小游戏的逻辑和组件放到这个目录下。</p>
      </section>

      <section class="play-board section">
        <tc-section-title text="页面切换已生效"></tc-section-title>
        <p>当前通过 hash 路由进行页面级切换：<code>#/home</code> 与 <code>#/play</code>。</p>
      </section>
    `;
  }
}

if (!customElements.get("tc-play-page")) {
  customElements.define("tc-play-page", TcPlayPage);
}

export const playPageTag = "tc-play-page";
