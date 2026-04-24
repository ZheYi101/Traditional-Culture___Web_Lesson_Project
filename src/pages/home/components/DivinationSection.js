import "../../../components/SectionTitle.js";
import "../../../components/ResultBadge.js";
import { getDailyFortuneResult } from "../../../services/divinationService.js";

function renderResultHtml(result) {

  return `
    <div class="daily-fortune-head">
      <div>
        <p class="daily-fortune-date">今日运势 · ${result.dateKey}</p>
        <h3 class="daily-fortune-title">${result.resultTitle}</h3>
      </div>
      <tc-result-badge text="${result.resultTag}" variant="${result.resultTag}"></tc-result-badge>
    </div>
    <div class="daily-fortune-score-row">
      <span class="daily-fortune-score">${result.resultScore}</span>
      <span class="daily-fortune-score-unit">/ 100</span>
    </div>
    <div class="daily-fortune-copy">
      <p class="daily-fortune-label">运势解读</p>
      <p>${result.interpretation}</p>
    </div>
    <div class="daily-fortune-copy">
      <p class="daily-fortune-label">今日建议</p>
      <p>${result.suggestion}</p>
    </div>
    <p class="divination-tip">同一天结果保持一致，次日会自动刷新。</p>
  `;
}

class TcDivinationSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const result = getDailyFortuneResult();

    this.innerHTML = `
      <section class="section" id="divination">
        <div class="divination-panel">
          <tc-section-title text="今日运势" class="play-title"></tc-section-title>
          <div class="divination-result">
            ${renderResultHtml(result)}
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get("tc-divination-section")) {
  customElements.define("tc-divination-section", TcDivinationSection);
}
