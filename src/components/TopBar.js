import "./ThemeSwitcher.js";

const PAGE_SWITCH_ITEMS = [
  { id: "home", label: "首页" },
  { id: "fortune", label: "算命" },
  { id: "play", label: "小游戏" },
  { id: "advisor", label: "出行问策" }
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

    const wrapper = document.createElement("div");
    wrapper.className = "top-bar";

    const nav = document.createElement("nav");
    nav.className = "page-switch";
    nav.setAttribute("aria-label", "页面切换");

    PAGE_SWITCH_ITEMS.forEach((item) => {
      const link = document.createElement("a");
      link.className = "page-switch-link";
      link.dataset.page = item.id;
      link.href = `#/${item.id}`;
      link.textContent = item.label;

      if (item.id === currentPage) {
        link.classList.add("is-active");
      }

      nav.append(link);
    });

    const theme = document.createElement("div");
    theme.className = "top-bar-theme";
    theme.append(document.createElement("tc-theme-switcher"));

    wrapper.append(nav, theme);
    this.replaceChildren(wrapper);
  }
}

if (!customElements.get("tc-top-bar")) {
  customElements.define("tc-top-bar", TcTopBar);
}
