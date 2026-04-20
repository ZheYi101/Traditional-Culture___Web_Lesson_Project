const THEME_KEY = "tc_theme";
const DEFAULT_THEME = "qingdai";

const THEMES = {
    qingdai: "青黛古卷",
    danzhu: "丹朱节庆"
};

function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    return saved && THEMES[saved] ? saved : DEFAULT_THEME;
}

function setTheme(theme) {
    if (!THEMES[theme]) {
        return;
    }

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
    setTheme(getTheme());
}

class TcThemeSwitcher extends HTMLElement {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    connectedCallback() {
        this.render();
        const select = this.querySelector(".select-theme");

        if (!select) {
            return;
        }

        select.value = getTheme();
        select.addEventListener("change", this.handleChange);
    }

    disconnectedCallback() {
        const select = this.querySelector(".select-theme");

        if (!select) {
            return;
        }

        select.removeEventListener("change", this.handleChange);
    }

    handleChange(event) {
        setTheme(event.target.value);
    }

    render() {
        const options = Object.entries(THEMES)
            .map(([value, label]) => `<option value="${value}">${label}</option>`)
            .join("");

        this.innerHTML = `
      <label class="theme-switcher">
        <span>主题</span>
        <select class="select-theme" aria-label="切换主题">
          ${options}
        </select>
      </label>
    `;
    }
}

if (!customElements.get("tc-theme-switcher")) {
    customElements.define("tc-theme-switcher", TcThemeSwitcher);
}
