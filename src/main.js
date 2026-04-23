import { initTheme } from "./components/ThemeSwitcher.js";
import "./components/TopBar.js";
import { pageRegistry } from "./pages/pageRegistry.js";

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
    const pageItem = pageRegistry[pageKey];
    const pageTag = pageItem.pageTag;
    const initPage = pageItem.initPage;
    const topBar = document.createElement("tc-top-bar");
    const pageRoot = document.createElement("main");
    const pageElement = document.createElement(pageTag);

    topBar.setAttribute("current-page", pageKey);
    pageRoot.id = "page-root";
    pageRoot.append(pageElement);
    app.replaceChildren(topBar, pageRoot);

    initPage?.(pageElement);
}

initTheme();

if (!window.location.hash) {
    window.location.hash = "#/home";
}

mountApp();
window.addEventListener("hashchange", mountApp);
