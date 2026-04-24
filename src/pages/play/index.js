import "../../components/SectionTitle.js";
import "./components/BoatDragonGame.js";
import "./components/DanmakuShooterGame.js";
import { GAME_ITEMS } from "./constants/gameItems.js";

class TcPlayPage extends HTMLElement {
  constructor() {
    super();
    this.activeGameKey = null;
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  handleClick(event) {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) {
      return;
    }

    if (actionButton.dataset.action === "open-game") {
      const nextGameKey = actionButton.dataset.game;

      if (GAME_ITEMS[nextGameKey]) {
        this.activeGameKey = nextGameKey;
        this.render();
      }

      return;
    }

    if (actionButton.dataset.action === "back-to-hall") {
      this.activeGameKey = null;
      this.render();
    }
  }

  renderHall() {
    const cards = Object.entries(GAME_ITEMS)
      .map(
        ([gameKey, gameItem]) => `
          <article class="play-card">
            <div class="play-card-copy">
              <p class="play-card-kicker">小游戏</p>
              <h2 class="play-card-title">${gameItem.title}</h2>
              <p class="play-card-desc">${gameItem.desc}</p>
            </div>
            <button class="play-card-action" type="button" data-action="open-game" data-game="${gameKey}">
              开始游戏
            </button>
          </article>
        `
      )
      .join("");

    this.innerHTML = `
      <section class="play-hero section">
        <p class="play-kicker">Traditional Games</p>
        <h1 class="play-title">小游戏大厅</h1>
        <p class="play-desc">倾心愉悦小游戏</p>
      </section>

      <section class="play-board section">
        <tc-section-title text="选择玩法"></tc-section-title>
        <div class="play-grid">
          ${cards}
        </div>
      </section>
    `;
  }

  renderGame() {
    const gameItem = GAME_ITEMS[this.activeGameKey];

    if (!gameItem) {
      this.renderHall();
      return;
    }

    this.innerHTML = `
      <section class="play-hero section">
        <div class="play-hero-header">
          <div>
            <p class="play-kicker">Traditional Games</p>
            <h1 class="play-title">${gameItem.title}</h1>
            <p class="play-desc">${gameItem.desc}</p>
          </div>
          <button class="play-back-button" type="button" data-action="back-to-hall">
            返回大厅
          </button>
        </div>
      </section>

      <section class="play-board section">
        <tc-section-title text="开始挑战"></tc-section-title>
        <div class="play-game-shell">
          <${gameItem.tagName}></${gameItem.tagName}>
        </div>
      </section>
    `;
  }

  render() {
    if (this.activeGameKey) {
      this.renderGame();
      return;
    }

    this.renderHall();
  }
}

if (!customElements.get("tc-play-page")) {
  customElements.define("tc-play-page", TcPlayPage);
}

export const playPageTag = "tc-play-page";
