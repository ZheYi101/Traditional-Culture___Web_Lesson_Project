import { loginWithApiKey, USERNAME_MAX_LENGTH } from "../../services/authService.js";

class TcLoginPage extends HTMLElement {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    disconnectedCallback() {
        this.unbindEvents();
    }

    bindEvents() {
        this.querySelector(".login-form")?.addEventListener("submit", this.handleSubmit);
    }

    unbindEvents() {
        this.querySelector(".login-form")?.removeEventListener("submit", this.handleSubmit);
    }

    handleSubmit(event) {
        event.preventDefault();

        const usernameInput = this.querySelector("#login-username");
        const passwordInput = this.querySelector("#login-password");
        const tipNode = this.querySelector(".login-tip");

        const result = loginWithApiKey({
            username: usernameInput?.value || "",
            password: passwordInput?.value || ""
        });

        if (!result.ok) {
            if (tipNode) {
                tipNode.textContent = result.message;
                tipNode.classList.add("is-error");
            }
            return;
        }

        window.location.hash = "#/home";
    }

    render() {
        this.innerHTML = `
      <section class="section login-shell">
        <div class="login-card">
          <p class="login-kicker">欢迎回来</p>
          <h1 class="login-title">登录节气灵签</h1>
          <form class="login-form" autocomplete="off">
            <label class="login-field" for="login-username">
              <span>用户名</span>
              <input id="login-username" name="username" type="text" maxlength="${USERNAME_MAX_LENGTH}" placeholder="请输入用户名" required />
            </label>
            <label class="login-field" for="login-password">
              <span>密码（API Key）</span>
              <input id="login-password" name="password" type="password" placeholder="请输入 API Key" required />
            </label>
            <button class="login-submit" type="submit">登录</button>
          </form>
        </div>
      </section>
    `;
    }
}

if (!customElements.get("tc-login-page")) {
    customElements.define("tc-login-page", TcLoginPage);
}

export const loginPageTag = "tc-login-page";
