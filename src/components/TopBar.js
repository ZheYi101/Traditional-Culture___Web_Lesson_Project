import "./ThemeSwitcher.js";

const PAGE_SWITCH_ITEMS = [
  { id: "home", label: "首页" },
  { id: "play", label: "小游戏" }
];

class TcTopBar extends HTMLElement {
  static get observedAttributes() {
    return ["current-page"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const currentPage = this.getAttribute("current-page") || "home";
    const navLinks = PAGE_SWITCH_ITEMS
      .map((item) => {
        const activeClass = item.id === currentPage ? " is-active" : "";
        return `<a class="page-switch-link${activeClass}" data-page="${item.id}" href="#/${item.id}">${item.label}</a>`;
      })
      .join("");

    this.innerHTML = `
      <div class="top-bar">
        <nav class="page-switch" aria-label="页面切换">
          ${navLinks}
        </nav>
        <div class="top-bar-theme">
          <tc-theme-switcher></tc-theme-switcher>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("tc-top-bar")) {
  customElements.define("tc-top-bar", TcTopBar);
}
