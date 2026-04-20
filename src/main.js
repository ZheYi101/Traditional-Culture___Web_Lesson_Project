import { initTheme } from "./components/ThemeSwitcher.js";
import "./components/TopBar.js";
import { homePageTag } from "./pages/home/index.js";
import { playPageTag } from "./pages/play/index.js";

const pageRegistry = {
    home: homePageTag,
    play: playPageTag
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
    const pageTag = pageRegistry[pageKey];

    app.innerHTML = `
            <tc-top-bar current-page="${pageKey}"></tc-top-bar>
            <main id="page-root"><${pageTag}></${pageTag}></main>
    `;
}

initTheme();

if (!window.location.hash) {
    window.location.hash = "#/home";
}

mountApp();
window.addEventListener("hashchange", mountApp);
