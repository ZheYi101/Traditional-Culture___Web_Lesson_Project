import "../../../components/SectionTitle.js";
import { readingNotes } from "../constants/readingNotes.js";

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.06;

function getCardPair(activeIndex) {
  const activeCard = readingNotes[activeIndex % readingNotes.length];
  const nextCard = readingNotes[(activeIndex + 1) % readingNotes.length];
  return { activeCard, nextCard };
}

class TcReadingCorner extends HTMLElement {
  constructor() {
    super();
    this.activeIndex = 0;
    this.dragState = null;
    this.stackElement = null;
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
  }

  connectedCallback() {
    this.renderShell();
    this.stackElement = this.querySelector(".reading-stack");
    this.renderCards();
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    this.querySelector(".reading-card.is-active")?.addEventListener("pointerdown", this.handlePointerDown);
  }

  unbindEvents() {
    this.querySelector(".reading-card.is-active")?.removeEventListener("pointerdown", this.handlePointerDown);
  }

  handlePointerDown(event) {
    const activeCard = this.querySelector(".reading-card.is-active");

    if (!activeCard) {
      return;
    }

    this.dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX
    };

    activeCard.classList.add("is-dragging");
    activeCard.setPointerCapture(event.pointerId);
    activeCard.addEventListener("pointermove", this.handlePointerMove);
    activeCard.addEventListener("pointerup", this.handlePointerUp);
    activeCard.addEventListener("pointercancel", this.handlePointerCancel);
  }

  handlePointerMove(event) {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
      return;
    }

    this.dragState.currentX = event.clientX;
    const deltaX = this.dragState.currentX - this.dragState.startX;
    this.applyDragStyles(deltaX);
  }

  handlePointerUp(event) {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
      return;
    }

    const deltaX = this.dragState.currentX - this.dragState.startX;
    const shouldDismiss = Math.abs(deltaX) >= SWIPE_THRESHOLD;

    if (shouldDismiss) {
      this.flyOutCard(deltaX > 0 ? 1 : -1);
      return;
    }

    this.resetCardPosition();
  }

  handlePointerCancel(event) {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
      return;
    }

    this.resetCardPosition();
  }

  applyDragStyles(deltaX) {
    const activeCard = this.querySelector(".reading-card.is-active");
    const nextCard = this.querySelector(".reading-card.is-next");

    if (!activeCard) {
      return;
    }

    const rotateDeg = deltaX * ROTATION_FACTOR;
    const progress = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);

    activeCard.style.transform = `translateX(${deltaX}px) rotate(${rotateDeg}deg)`;
    activeCard.style.opacity = String(1 - progress * 0.18);

    if (nextCard) {
      nextCard.style.transform = `scale(${0.96 + progress * 0.04}) translateY(${-10 + progress * 10}px)`;
    }
  }

  resetCardPosition() {
    const activeCard = this.querySelector(".reading-card.is-active");
    const nextCard = this.querySelector(".reading-card.is-next");

    if (activeCard) {
      activeCard.classList.remove("is-flying-out");
      activeCard.style.transform = "";
      activeCard.style.opacity = "";
      activeCard.classList.remove("is-dragging");
      this.teardownPointerListeners(activeCard);
    }

    if (nextCard) {
      nextCard.style.transform = "";
    }

    this.dragState = null;
  }

  flyOutCard(direction) {
    const activeCard = this.querySelector(".reading-card.is-active");
    const nextCard = this.querySelector(".reading-card.is-next");

    if (!activeCard) {
      return;
    }

    activeCard.classList.add("is-flying-out", direction > 0 ? "to-right" : "to-left");
    activeCard.classList.remove("is-dragging");
    activeCard.style.transform = "";
    activeCard.style.opacity = "";
    this.teardownPointerListeners(activeCard);

    if (nextCard) {
      nextCard.style.transform = "scale(1) translateY(0)";
    }

    this.dragState = null;

    window.setTimeout(() => {
      this.activeIndex = (this.activeIndex + 1) % readingNotes.length;
      this.renderCards();
      this.bindEvents();
    }, 260);
  }

  teardownPointerListeners(activeCard) {
    if (!activeCard) {
      return;
    }

    if (this.dragState?.pointerId !== undefined && activeCard.hasPointerCapture?.(this.dragState.pointerId)) {
      activeCard.releasePointerCapture(this.dragState.pointerId);
    }

    activeCard.removeEventListener("pointermove", this.handlePointerMove);
    activeCard.removeEventListener("pointerup", this.handlePointerUp);
    activeCard.removeEventListener("pointercancel", this.handlePointerCancel);
  }

  renderShell() {
    this.innerHTML = `
      <section class="section home-reading-card">
        <tc-section-title text="闲读角"></tc-section-title>
        <div class="reading-stack" aria-label="闲读角卡片堆叠"></div>
      </section>
    `;
  }

  renderCards() {
    if (!this.stackElement) {
      return;
    }

    this.unbindEvents();

    const { activeCard, nextCard } = getCardPair(this.activeIndex);

    this.stackElement.innerHTML = `
      <article class="reading-card is-next" aria-hidden="true">
        <p class="reading-card-kicker">下一页</p>
        <h3 class="reading-card-title">${nextCard.title}</h3>
        <p class="reading-card-quote">${nextCard.quote}</p>
      </article>
      <article class="reading-card is-active" tabindex="0" aria-label="可拖拽闲读卡片">
        <p class="reading-card-kicker">闲读角</p>
        <h3 class="reading-card-title">${activeCard.title}</h3>
        <p class="reading-card-quote">${activeCard.quote}</p>
        <p class="reading-card-note">${activeCard.note}</p>
      </article>
    `;
  }
}

if (!customElements.get("tc-reading-corner")) {
  customElements.define("tc-reading-corner", TcReadingCorner);
}
