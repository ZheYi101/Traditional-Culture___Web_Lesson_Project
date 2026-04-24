const FOOTER_GITHUB_URL = "https://github.com/ZheYi101/Traditional-Culture___Web_Lesson_Project";
const FOOTER_COPYRIGHT_TEXT = "© 2026 弘精络网. All rights reserved.";

class TcSiteFooter extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
      <footer class="site-footer" aria-label="站点页尾">
        <a class="site-footer-link" href="${FOOTER_GITHUB_URL}" target="_blank" rel="noreferrer noopener">
          GitHub 仓库
        </a>
        <p class="site-footer-copy">${FOOTER_COPYRIGHT_TEXT}</p>
      </footer>
    `;
    }
}

if (!customElements.get("tc-site-footer")) {
    customElements.define("tc-site-footer", TcSiteFooter);
}
