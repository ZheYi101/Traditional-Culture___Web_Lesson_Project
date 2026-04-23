import "./components/SeasonTermsBoard.js";

class TcTermsPage extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
      <section class="section terms-hero">
        <p class="terms-kicker">二十四节气</p>
        <h1 class="terms-title">节气长卷</h1>
      </section>
      <tc-season-terms-board></tc-season-terms-board>
    `;
    }
}

if (!customElements.get("tc-terms-page")) {
    customElements.define("tc-terms-page", TcTermsPage);
}

export const termsPageTag = "tc-terms-page";
