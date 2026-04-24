import "../../../components/SectionTitle.js";
import "./TermFlipCard.js";
import { seasonMediaBySeason, solarTerms24 } from "../constants/solarTerms24.js";

const SEASONS = ["春", "夏", "秋", "冬"];

class TcSeasonTermsBoard extends HTMLElement {
    constructor() {
        super();
        this.currentSeason = "春";
        this.handleSeasonClick = this.handleSeasonClick.bind(this);
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    disconnectedCallback() {
        this.unbindEvents();
    }

    bindEvents() {
        this.querySelector(".terms-season-switch")?.addEventListener("click", this.handleSeasonClick);
    }

    unbindEvents() {
        this.querySelector(".terms-season-switch")?.removeEventListener("click", this.handleSeasonClick);
    }

    handleSeasonClick(event) {
        const target = event.target.closest(".terms-season-button");

        if (!target) {
            return;
        }

        const nextSeason = target.dataset.season;

        if (!SEASONS.includes(nextSeason) || nextSeason === this.currentSeason) {
            return;
        }

        this.currentSeason = nextSeason;
        this.renderSeasonMedia();
        this.renderCards();
        this.renderButtons();
    }

    renderSeasonMedia() {
        const mediaSection = this.querySelector(".terms-season-media");

        if (!mediaSection) {
            return;
        }

        const flvSrc = seasonMediaBySeason[this.currentSeason] || "";
        const mp4Src = flvSrc.replace(/\.mp4$/i, ".mp4");

        mediaSection.innerHTML = `
            <div class="terms-season-media-wrap">
                <video class="terms-season-video" muted autoplay loop playsinline preload="metadata" aria-label="${this.currentSeason}季节气影像">
                    <source src="${mp4Src}" type="video/mp4">
                </video>
            </div>
        `;

        const mediaWrap = mediaSection.querySelector(".terms-season-media-wrap");
        const media = mediaSection.querySelector(".terms-season-video");
        const fallback = mediaSection.querySelector(".terms-season-media-fallback");

        if (!mediaWrap || !media || !fallback) {
            return;
        }

        const showFallback = () => {
            mediaWrap.classList.add("is-fallback");
            fallback.hidden = false;
        };

        const hideFallback = () => {
            mediaWrap.classList.remove("is-fallback");
            fallback.hidden = true;
        };

        media.addEventListener("loadeddata", hideFallback, { once: true });
        media.addEventListener("error", showFallback, { once: true });
    }

    renderButtons() {
        const switcher = this.querySelector(".terms-season-switch");

        if (!switcher) {
            return;
        }

        switcher.replaceChildren();

        SEASONS.forEach((season) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "terms-season-button";
            button.dataset.season = season;
            button.textContent = `${season}季`;
            button.setAttribute("aria-pressed", String(season === this.currentSeason));

            if (season === this.currentSeason) {
                button.classList.add("is-active");
            }

            switcher.append(button);
        });
    }

    renderCards() {
        const grid = this.querySelector(".terms-cards-grid");

        if (!grid) {
            return;
        }

        grid.replaceChildren();

        const terms = solarTerms24.filter((item) => item.season === this.currentSeason);

        terms.forEach((term) => {
            const card = document.createElement("tc-terms-flip-card");
            card.data = term;
            grid.append(card);
        });
    }

    render() {
        const section = document.createElement("section");
        section.className = "section terms-board";

        const title = document.createElement("tc-section-title");
        title.setAttribute("text", "四季流转 · 二十四节气");

        const toolbar = document.createElement("div");
        toolbar.className = "terms-toolbar";

        const switcher = document.createElement("div");
        switcher.className = "terms-season-switch";
        switcher.setAttribute("role", "tablist");
        switcher.setAttribute("aria-label", "选择季节");

        toolbar.append(switcher);

        const mediaSection = document.createElement("section");
        mediaSection.className = "terms-season-media";

        const grid = document.createElement("div");
        grid.className = "terms-cards-grid";

        section.append(title, toolbar, mediaSection, grid);
        this.replaceChildren(section);

        this.renderButtons();
        this.renderSeasonMedia();
        this.renderCards();
    }
}

if (!customElements.get("tc-season-terms-board")) {
    customElements.define("tc-season-terms-board", TcSeasonTermsBoard);
}
