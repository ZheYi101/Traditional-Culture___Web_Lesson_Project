const AUTH_TOKEN_KEY = "tc_auth_token";
const USERNAME_KEY = "tc_username";
const ACCESS_KEY = "2026";

export const USERNAME_MAX_LENGTH = 16;

function normalizeUsername(username = "") {
    return String(username || "").trim().slice(0, USERNAME_MAX_LENGTH);
}

export function isAuthenticated() {
    return localStorage.getItem(AUTH_TOKEN_KEY) === ACCESS_KEY;
}

export function getCurrentUsername() {
    return localStorage.getItem(USERNAME_KEY) || "游客";
}

export function loginWithApiKey({ username = "", password = "" }) {
    if (String(password) !== ACCESS_KEY) {
        return {
            ok: false,
            message: "密码错误，请输入正确的 API Key"
        };
    }

    const safeUsername = normalizeUsername(username) || "游客";
    localStorage.setItem(AUTH_TOKEN_KEY, ACCESS_KEY);
    localStorage.setItem(USERNAME_KEY, safeUsername);

    return {
        ok: true,
        username: safeUsername
    };
}

export function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
}
