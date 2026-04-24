import { initTheme } from "./components/ThemeSwitcher.js";
import "./components/TopBar.js";
import "./components/SiteFooter.js";
import { pageRegistry } from "./pages/pageRegistry.js";
import { getCurrentUsername, isAuthenticated } from "./services/authService.js";

const LOGIN_PAGE_KEY = "login";
const HOME_PAGE_KEY = "home";

function getRequestedPageKey() {
    const rawHash = window.location.hash.replace(/^#\/?/, "");
    return rawHash || "";
}

function getAccessiblePageKey(requestedPageKey) {
    if (!isAuthenticated()) {
        return LOGIN_PAGE_KEY;
    }

    if (requestedPageKey === LOGIN_PAGE_KEY) {
        return HOME_PAGE_KEY;
    }

    return pageRegistry[requestedPageKey] ? requestedPageKey : HOME_PAGE_KEY;
}

function mountApp() {
    const app = document.querySelector("#app");

    if (!app) {
        return;
    }

    const requestedPageKey = getRequestedPageKey();
    const pageKey = getAccessiblePageKey(requestedPageKey);

    if (requestedPageKey !== pageKey) {
        window.location.hash = `#/${pageKey}`;
    }

    const pageItem = pageRegistry[pageKey];

    if (!pageItem) {
        return;
    }

    const pageTag = pageItem.pageTag;
    const initPage = pageItem.initPage;
    const pageRoot = document.createElement("main");
    const pageElement = document.createElement(pageTag);
    const footer = document.createElement("tc-site-footer");
    const children = [];

    if (pageKey !== LOGIN_PAGE_KEY) {
        const topBar = document.createElement("tc-top-bar");
        topBar.setAttribute("current-page", pageKey);
        topBar.setAttribute("current-user", getCurrentUsername());
        children.push(topBar);
    }

    pageRoot.id = "page-root";
    pageRoot.append(pageElement);
    children.push(pageRoot, footer);
    app.replaceChildren(...children);

    initPage?.(pageElement);
}

initTheme();

if (!window.location.hash) {
    window.location.hash = isAuthenticated() ? `#/${HOME_PAGE_KEY}` : `#/${LOGIN_PAGE_KEY}`;
}

mountApp();
window.addEventListener("hashchange", mountApp);
