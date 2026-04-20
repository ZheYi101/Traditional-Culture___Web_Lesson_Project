import { initTheme } from "./components/ThemeSwitcher.js";
import { initHomePage, HomePage } from "./pages/home/index.js";
import { bindTopBar, TopBar } from "./components/TopBar.js";
import { initPlayPage, PlayPage } from "./pages/play/index.js";

const pageRegistry = {
    home: {
        render: HomePage,
        init: initHomePage
    },
    play: {
        render: PlayPage,
        init: initPlayPage
    }
};

function getCurrentPageKey() {
    const rawHash = window.location.hash.replace(/^#\/?/, "");
    return pageRegistry[rawHash] ? rawHash : "home";
}

function mountApp() {
    const app = document.querySelector("#app");

    if (!app) {
        return;
    }

    const pageKey = getCurrentPageKey();
    const page = pageRegistry[pageKey];

    app.innerHTML = `
      ${TopBar(pageKey)}
      <main id="page-root">${page.render()}</main>
    `;

    bindTopBar();
    page.init();
}

initTheme();

if (!window.location.hash) {
    window.location.hash = "#/home";
}

mountApp();
window.addEventListener("hashchange", mountApp);
