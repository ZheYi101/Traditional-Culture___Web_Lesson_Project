import "../../components/SectionTitle.js";
import "../../components/ResultBadge.js";
import { getFortuneResult } from "../../service/fortuneService.js";

const fortunePageTemplate = `
  <div class="fortune-page">
    <section class="fortune-hero">
      <span class="fortune-kicker">生辰八字</span>
      <h1 class="fortune-page-title">命理测算</h1>
    </section>

    <section class="fortune-layout">
      <section class="fortune-panel fortune-form-panel">
        <tc-section-title text="录入生辰"></tc-section-title>
        <p class="fortune-section-desc">请输入出生日期与时间，性别为可选项。同样输入会得到同样结果。</p>
        <div class="fortune-field-grid">
          <div class="fortune-field-row">
            <label class="fortune-input-group">
              <span class="fortune-input-label">出生日期</span>
              <input class="fortune-date" type="date" />
            </label>
            <label class="fortune-input-group">
              <span class="fortune-input-label">出生时间</span>
              <input class="fortune-time" type="time" />
            </label>
          </div>
          <label class="fortune-input-group">
            <span class="fortune-input-label">性别（可选）</span>
            <select class="fortune-gender">
              <option value="">暂不填写</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </label>
          <div class="fortune-action-row">
            <button class="fortune-primary-button fortune-submit" type="button">开始测算</button>
          </div>
        </div>
      </section>

      <section class="fortune-panel fortune-result-card is-empty">
        <div class="fortune-result-empty">
          <p class="fortune-empty-title">命盘待启</p>
          <p class="fortune-empty-text">输入出生信息后，这里将展示四柱、五行倾向与命理解读。</p>
        </div>
      </section>
    </section>
  </div>
`;

function renderFortuneWarning(hostElement) {
  const resultCard = hostElement.querySelector(".fortune-result-card");

  if (!resultCard) {
    return;
  }

  resultCard.classList.remove("is-empty");
  resultCard.innerHTML = `
    <div class="fortune-result-head">
      <div>
        <p class="fortune-result-eyebrow">资料不完整</p>
        <h3 class="fortune-result-title">请先补全出生日期与时间</h3>
      </div>
      <tc-result-badge text="待补全" variant="注意"></tc-result-badge>
    </div>
    <p class="fortune-warning-text">生辰八字模块需要完整的日期与时间才能生成稳定结果。</p>
  `;
}

function renderFortuneResult(hostElement, resultData) {
  const resultCard = hostElement.querySelector(".fortune-result-card");

  if (!resultCard) {
    return;
  }

  const pillarItems = resultData.pillarList
    .map((pillar) => {
      return `
        <div class="pillar-item">
          <span class="pillar-label">${pillar.label}</span>
          <strong class="pillar-value">${pillar.value}</strong>
        </div>
      `;
    })
    .join("");

  resultCard.classList.remove("is-empty");
  resultCard.innerHTML = `
    <div class="fortune-result-head">
      <div>
        <p class="fortune-result-eyebrow">四柱排盘</p>
        <h3 class="fortune-result-title">命理结果</h3>
      </div>
      <tc-result-badge text="已测算" variant="formal"></tc-result-badge>
    </div>
    <section class="fortune-summary-card">
      <p class="fortune-copy-label">八字结果</p>
      <p class="fortune-bazi">${resultData.baZiText}</p>
    </section>
    <section class="fortune-summary-card">
      <p class="fortune-copy-label">四柱</p>
      <div class="pillar-grid">${pillarItems}</div>
    </section>
    <section class="fortune-summary-card">
      <p class="fortune-copy-label">五行倾向</p>
      <p>${resultData.fiveElements}</p>
    </section>
    <section class="fortune-summary-card">
      <p class="fortune-copy-label">命理解读</p>
      <p>${resultData.interpretation}</p>
    </section>
    <section class="fortune-summary-card">
      <p class="fortune-copy-label">建议</p>
      <p>${resultData.suggestion}</p>
    </section>
  `;
}

class TcFortunePage extends HTMLElement {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.render();
    this.querySelector(".fortune-submit")?.addEventListener("click", this.handleSubmit);
  }

  disconnectedCallback() {
    this.querySelector(".fortune-submit")?.removeEventListener("click", this.handleSubmit);
  }

  handleSubmit() {
    const birthDate = this.querySelector(".fortune-date")?.value || "";
    const birthTime = this.querySelector(".fortune-time")?.value || "";
    const gender = this.querySelector(".fortune-gender")?.value || "";

    if (!birthDate || !birthTime) {
      renderFortuneWarning(this);
      return;
    }

    const resultData = getFortuneResult({ birthDate, birthTime, gender });
    renderFortuneResult(this, resultData);
  }

  render() {
    this.innerHTML = fortunePageTemplate;
  }
}

if (!customElements.get("tc-fortune-page")) {
  customElements.define("tc-fortune-page", TcFortunePage);
}

export function initFortunePage() { }

export const fortunePageTag = "tc-fortune-page";
