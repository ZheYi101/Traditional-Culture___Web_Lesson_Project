import "../../../components/SolarTermCard.js";
import "../../../components/SectionTitle.js";
import { solarTerms } from "../constants/solarTerms.js";

class TcSolarTermsSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const cards = solarTerms
      .map((term) => `<tc-solar-term-card name="${term.name}" season="${term.season}" intro="${term.intro}"></tc-solar-term-card>`)
      .join("");

    this.innerHTML = `
      <section class="section" id="solar-terms">
        <tc-section-title text="二十四节气卡片"></tc-section-title>
        <div class="card-grid">
          ${cards}
        </div>
      </section>
    `;
  }
}

if (!customElements.get("tc-solar-terms-section")) {
  customElements.define("tc-solar-terms-section", TcSolarTermsSection);
}
