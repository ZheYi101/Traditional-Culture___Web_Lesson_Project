import { streamTravelAdvice } from "../../services/travelAdvisorApi.js";

class TcAdvisorPage extends HTMLElement {
    constructor() {
        super();
        this.messages = [];
        this.abortController = null;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMessageKeydown = this.handleMessageKeydown.bind(this);
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    disconnectedCallback() {
        this.abortController?.abort();
        this.unbindEvents();
    }

    bindEvents() {
        this.querySelector(".advisor-form")?.addEventListener("submit", this.handleSubmit);
        this.querySelector("#advisor-message")?.addEventListener("keydown", this.handleMessageKeydown);
    }

    unbindEvents() {
        this.querySelector(".advisor-form")?.removeEventListener("submit", this.handleSubmit);
        this.querySelector("#advisor-message")?.removeEventListener("keydown", this.handleMessageKeydown);
    }

    handleMessageKeydown(event) {
        if (event.key !== "Enter" || event.shiftKey || event.isComposing) {
            return;
        }

        event.preventDefault();
        this.querySelector(".advisor-form")?.requestSubmit();
    }

    async handleSubmit(event) {
        event.preventDefault();

        const messageInput = this.querySelector("#advisor-message");
        const sendButton = this.querySelector(".advisor-send");
        const message = messageInput?.value.trim() || "";

        if (!message) {
            return;
        }

        this.abortController?.abort();
        this.abortController = new AbortController();
        this.setBusy(true, sendButton);

        const userText = message;
        this.addMessage("user", userText);
        const assistantMessage = this.addMessage("assistant", "");

        if (messageInput) {
            messageInput.value = "";
        }

        try {
            await streamTravelAdvice(
                {
                    message: userText,
                    history: this.messages.slice(0, -2)
                },
                {
                    onDelta: (content) => {
                        assistantMessage.content += content;
                        this.updateMessageNode(assistantMessage.id, assistantMessage.content);
                    },
                    onError: (error) => {
                        assistantMessage.content += `\n${error}`;
                        this.updateMessageNode(assistantMessage.id, assistantMessage.content);
                    },
                    onDone: () => {
                        this.setBusy(false, sendButton);
                    }
                },
                this.abortController.signal
            );
        } catch (error) {
            if (error.name !== "AbortError") {
                assistantMessage.content = `服务暂不可用：${error.message}`;
                this.updateMessageNode(assistantMessage.id, assistantMessage.content);
            }
        } finally {
            this.setBusy(false, sendButton);
        }
    }

    addMessage(role, content) {
        const message = {
            id: `message-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            role,
            content
        };

        this.messages.push(message);
        this.renderMessages();
        return message;
    }

    updateMessageNode(id, content) {
        const node = this.querySelector(`[data-message-id="${id}"] .advisor-message-text`);
        if (node) {
            node.textContent = content || "正在生成建议...";
        }

        const messages = this.querySelector(".advisor-messages");
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }

    setBusy(isBusy, button) {
        this.classList.toggle("is-streaming", isBusy);
        if (button) {
            button.disabled = isBusy;
            button.textContent = isBusy ? "生成中" : "发送";
        }
    }

    render() {
        this.replaceChildren(
            createHero(),
            createWorkspace()
        );

        this.renderMessages();
    }

    renderMessages() {
        const container = this.querySelector(".advisor-messages");
        if (!container) {
            return;
        }

        container.replaceChildren();

        if (this.messages.length === 0) {
            const empty = document.createElement("p");
            empty.className = "advisor-empty";
            empty.textContent = "告诉我想去哪里、哪天出发，也可以补充同行人和偏好。我会结合天气与黄历给出出行建议。";
            container.append(empty);
            return;
        }

        this.messages.forEach((message) => {
            const item = document.createElement("article");
            item.className = `advisor-message is-${message.role}`;
            item.dataset.messageId = message.id;

            const label = document.createElement("span");
            label.className = "advisor-message-role";
            label.textContent = message.role === "user" ? "你" : "出行顾问";

            const text = document.createElement("p");
            text.className = "advisor-message-text";
            text.textContent = message.content || "正在生成建议...";

            item.append(label, text);
            container.append(item);
        });

        container.scrollTop = container.scrollHeight;
    }
}

function createHero() {
    const section = document.createElement("section");
    section.className = "advisor-hero section";

    const content = document.createElement("div");
    content.className = "advisor-hero-content";

    const title = document.createElement("h1");
    title.textContent = "出行问策";
    title.className = "play-title";

    const desc = document.createElement("p");
    desc.textContent = "结合天气、黄历与风险规则，为你的行程生成流式建议。";

    content.append(title, desc);
    section.append(content);
    return section;
}

function createWorkspace() {
    const section = document.createElement("section");
    section.className = "advisor-workspace section";

    const chat = document.createElement("div");
    chat.className = "advisor-chat";

    const messages = document.createElement("div");
    messages.className = "advisor-messages";
    messages.setAttribute("aria-live", "polite");

    const form = createForm();
    chat.append(messages, form);

    section.append(chat);
    return section;
}

function createForm() {
    const form = document.createElement("form");
    form.className = "advisor-form";

    const label = document.createElement("label");
    label.className = "advisor-textarea-label";
    label.setAttribute("for", "advisor-message");
    label.textContent = "向出行顾问提问";

    const textarea = document.createElement("textarea");
    textarea.id = "advisor-message";
    textarea.className = "advisor-textarea";
    textarea.rows = 3;
    textarea.placeholder = "例如：明天上午想去杭州西湖走走，偏户外，下午返程，帮我判断是否适合出行。";

    const button = document.createElement("button");
    button.className = "advisor-send";
    button.type = "submit";
    button.textContent = "发送";

    const composer = document.createElement("div");
    composer.className = "advisor-composer";
    composer.append(textarea, button);

    form.append(label, composer);
    return form;
}

if (!customElements.get("tc-advisor-page")) {
    customElements.define("tc-advisor-page", TcAdvisorPage);
}

export const advisorPageTag = "tc-advisor-page";
