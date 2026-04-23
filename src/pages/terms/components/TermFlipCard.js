class TcTermsFlipCard extends HTMLElement {
    constructor() {
        super();
        this.termData = null;
        this.isFlipped = false;
        this.handleFlip = this.handleFlip.bind(this);
    }

    set data(value) {
        this.termData = value;
        this.isFlipped = false;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    handleFlip() {
        this.isFlipped = !this.isFlipped;
        this.classList.toggle("is-flipped", this.isFlipped);
        const trigger = this.querySelector(".term-flip-trigger");

        if (trigger) {
            trigger.setAttribute("aria-pressed", String(this.isFlipped));
        }
    }

    render() {
        if (!this.termData) {
            this.replaceChildren();
            return;
        }

        const { name, season, solarWindow, impression, detail } = this.termData;

        this.className = `term-flip-card season-${season}`;

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "term-flip-trigger";
        trigger.setAttribute("aria-pressed", String(this.isFlipped));
        trigger.setAttribute("aria-label", `${name}卡片，点击翻转查看详细介绍`);

        const shell = document.createElement("span");
        shell.className = "term-flip-shell";

        const front = document.createElement("span");
        front.className = "term-face term-front";
        front.innerHTML = `
      <span class="term-season-tag">${season}季</span>
      <strong class="term-name">${name}</strong>
      <span class="term-window">${solarWindow}</span>
      <span class="term-divider" aria-hidden="true"></span>
      <span class="term-impression">${impression}</span>
      <span class="term-hint">点击翻面查看详解</span>
    `;

        const back = document.createElement("span");
        back.className = "term-face term-back";
        back.innerHTML = `
      <span class="term-back-label">${name} · 详细介绍</span>
      <span class="term-back-copy">${detail}</span>
      <span class="term-hint">再次点击返回正面</span>
    `;

        shell.append(front, back);
        trigger.append(shell);

        const oldTrigger = this.querySelector(".term-flip-trigger");

        if (oldTrigger) {
            oldTrigger.removeEventListener("click", this.handleFlip);
        }

        trigger.addEventListener("click", this.handleFlip);
        this.replaceChildren(trigger);
        this.classList.toggle("is-flipped", this.isFlipped);
    }
}

if (!customElements.get("tc-terms-flip-card")) {
    customElements.define("tc-terms-flip-card", TcTermsFlipCard);
}
