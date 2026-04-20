import { bindThemeSwitcher, ThemeSwitcher } from "./ThemeSwitcher.js";

const PAGE_SWITCH_ITEMS = [
    { id: "home", label: "首页" },
    { id: "play", label: "小游戏" }
];

export function TopBar(currentPage = "home") {
    const navLinks = PAGE_SWITCH_ITEMS
        .map((item) => {
            const activeClass = item.id === currentPage ? " is-active" : "";
            return `<a class="page-switch-link${activeClass}" data-page="${item.id}" href="#/${item.id}">${item.label}</a>`;
        })
        .join("");

    return `
    <div class="top-bar">
      <nav class="page-switch" aria-label="页面切换">
        ${navLinks}
      </nav>
      <div class="top-bar-theme">
        ${ThemeSwitcher()}
      </div>
    </div>
  `;
}

export function bindTopBar() {
    bindThemeSwitcher();
}
