export function PlayPage() {
  return `
    <section class="play-hero section">
      <h1 class="play-title">龙舟节奏 · 预备页</h1>
      <p class="play-desc">这是一个示例新页面。后续你可以把划龙舟小游戏的逻辑和组件放到这个目录下。</p>
    </section>

    <section class="play-board section">
      <h2 class="section-title">页面切换已生效</h2>
      <p>当前通过 hash 路由进行页面级切换：<code>#/home</code> 与 <code>#/play</code>。</p>
    </section>
  `;
}

export function initPlayPage() {
  // 预留：小游戏事件绑定入口
}
