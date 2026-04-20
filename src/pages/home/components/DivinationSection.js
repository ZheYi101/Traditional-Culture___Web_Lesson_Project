import "../../../components/SectionTitle.js";
import { divinations } from "../constants/divinations.js";

function hashToIndex(text, size) {
  if (!size || size < 1) {
    return 0;
  }

  const normalized = String(text || "").trim();

  if (!normalized) {
    return 0;
  }

  let hash = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash) % size;
}

function renderResultHtml(result) {
  if (!result) {
    return "<p class=\"divination-tip\">输入一个问题，例如：我该先做哪件事？</p>";
  }

  return `
    <h3>${result.title}</h3>
    <p>${result.message}</p>
    <p class="divination-tip">提示：相同输入会得到相同签文。</p>
  `;
}

class TcDivinationSection extends HTMLElement {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.render();
    const form = this.querySelector(".divination-form");

    if (!form) {
      return;
    }

    form.addEventListener("submit", this.handleSubmit);
  }

  disconnectedCallback() {
    const form = this.querySelector(".divination-form");

    if (!form) {
      return;
    }

    form.removeEventListener("submit", this.handleSubmit);
  }

  handleSubmit(event) {
    event.preventDefault();
    const input = this.querySelector(".divination-input");
    const resultEl = this.querySelector(".divination-result");

    if (!input || !resultEl) {
      return;
    }

    const index = hashToIndex(input.value, divinations.length);
    const result = divinations[index];
    resultEl.innerHTML = renderResultHtml(result);
  }

  render() {
    this.innerHTML = `
      <section class="section" id="divination">
        <tc-section-title text="今日占卜"></tc-section-title>
        <div class="divination-panel">
          <form class="divination-form">
            <input class="divination-input" name="question" maxlength="80" placeholder="请输入你的问题" required />
            <button class="divination-submit" type="submit">起一签</button>
          </form>
          <div class="divination-result">
            ${renderResultHtml(null)}
          </div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get("tc-divination-section")) {
  customElements.define("tc-divination-section", TcDivinationSection);
}
