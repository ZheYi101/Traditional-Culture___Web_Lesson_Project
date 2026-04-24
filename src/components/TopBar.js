import "./ThemeSwitcher.js";

const PAGE_SWITCH_ITEMS = [
  { id: "home", label: "首页" },
  { id: "terms", label: "二十四节气" },
  { id: "fortune", label: "算命" },
  { id: "play", label: "小游戏" },
  { id: "advisor", label: "出行问策" }
];

class TcTopBar extends HTMLElement {
  static get observedAttributes() {
    return ["current-page", "current-user"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const currentPage = this.getAttribute("current-page") || "home";
    const currentUser = this.getAttribute("current-user") || "游客";

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
        link.setAttribute("aria-current", "page");
      }

      nav.append(link);
    });

    const theme = document.createElement("div");
    theme.className = "top-bar-theme";
    const user = document.createElement("span");
    user.className = "top-bar-user";
    user.title = currentUser;
    user.textContent = `用户：${currentUser}`;

    theme.append(user);
    theme.append(document.createElement("tc-theme-switcher"));

    wrapper.append(nav, theme);
    this.replaceChildren(wrapper);
  }
}

if (!customElements.get("tc-top-bar")) {
  customElements.define("tc-top-bar", TcTopBar);
}
