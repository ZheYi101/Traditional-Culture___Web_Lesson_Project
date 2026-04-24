import "../../components/SectionTitle.js";
import { participants } from "./constants/participants.js";

class TcAboutPage extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    renderCard(person) {
        const name = person.name || "未命名成员";
        const avatar = person.avatar || "";
        const linkItems = [];

        if (person.github) {
            linkItems.push(`<a class="about-link" href="${person.github}" target="_blank" rel="noreferrer noopener">GitHub</a>`);
        }

        if (person.blog) {
            linkItems.push(`<a class="about-link" href="${person.blog}" target="_blank" rel="noreferrer noopener">博客</a>`);
        }

        const linksHtml = linkItems.length > 0 ? `<div class="about-links">${linkItems.join("")}</div>` : "";
        const avatarHtml = avatar
            ? `<img class="about-avatar" src="${avatar}" alt="${name}头像" loading="lazy" />`
            : "";

        return `
      <article class="about-card">
        ${avatarHtml}
        <div class="about-card-body">
          <h3 class="about-name">${name}</h3>
          ${linksHtml}
        </div>
      </article>
    `;
    }

    render() {
        const cardList = participants.map((person) => this.renderCard(person)).join("");

        this.innerHTML = `
      <section class="section about-hero">
        <p class="about-kicker">项目协作</p>
        <h1 class="about-title">关于本项目</h1>
        <p class="about-desc">参与者可见下面参与者列表 详细代码可见footer的Github仓库</p>
        <p class="about-desc">本次也算是一次不错的团队合作了, 很轻松的就完成了该项目, 成品也还行。</p>
      </section>

      <section class="section about-board">
        <tc-section-title text="参与者列表"></tc-section-title>
        <div class="about-grid">
          ${cardList}
        </div>
      </section>
    `;
    }
}

if (!customElements.get("tc-about-page")) {
    customElements.define("tc-about-page", TcAboutPage);
}

export const aboutPageTag = "tc-about-page";
