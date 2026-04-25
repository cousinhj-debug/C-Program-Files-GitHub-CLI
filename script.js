const STORAGE_KEYS = {
  subscribers: "newsletterSubscribers",
  users: "newsletterUsers",
  session: "newsletterSession",
};

function readJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setMessage(el, text, type) {
  el.textContent = text;
  el.classList.remove("ok", "error");
  if (type) el.classList.add(type);
}

function updateSessionUI() {
  const statusEl = document.getElementById("session-status");
  const logoutBtn = document.getElementById("logout-btn");
  const session = readJSON(STORAGE_KEYS.session, null);

  if (!session) {
    statusEl.textContent = "현재 로그인 상태: 없음";
    logoutBtn.disabled = true;
    return;
  }

  statusEl.textContent = `현재 로그인 상태: ${session.name} (${session.email})`;
  logoutBtn.disabled = false;
}

function bindSubscribeForm() {
  const form = document.getElementById("subscribe-form");
  const messageEl = document.getElementById("subscribe-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim().toLowerCase();

    const subscribers = readJSON(STORAGE_KEYS.subscribers, []);
    if (subscribers.includes(email)) {
      setMessage(messageEl, "이미 구독된 이메일입니다.", "error");
      return;
    }

    subscribers.push(email);
    writeJSON(STORAGE_KEYS.subscribers, subscribers);
    setMessage(messageEl, "구독이 완료되었습니다. 환영합니다!", "ok");
    form.reset();
  });
}

function bindSignupForm() {
  const form = document.getElementById("signup-form");
  const messageEl = document.getElementById("signup-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    const users = readJSON(STORAGE_KEYS.users, []);
    const exists = users.some((user) => user.email === email);
    if (exists) {
      setMessage(messageEl, "이미 가입된 이메일입니다.", "error");
      return;
    }

    users.push({ name, email, password });
    writeJSON(STORAGE_KEYS.users, users);
    setMessage(messageEl, "회원가입이 완료되었습니다.", "ok");
    form.reset();
  });
}

function bindLoginForm() {
  const form = document.getElementById("login-form");
  const messageEl = document.getElementById("login-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    const users = readJSON(STORAGE_KEYS.users, []);
    const user = users.find((item) => item.email === email && item.password === password);
    if (!user) {
      setMessage(messageEl, "이메일 또는 비밀번호가 올바르지 않습니다.", "error");
      return;
    }

    writeJSON(STORAGE_KEYS.session, { name: user.name, email: user.email });
    setMessage(messageEl, `${user.name}님, 로그인되었습니다.`, "ok");
    form.reset();
    updateSessionUI();
  });
}

function bindLogout() {
  const btn = document.getElementById("logout-btn");
  btn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    updateSessionUI();
  });
}

bindSubscribeForm();
bindSignupForm();
bindLoginForm();
bindLogout();
updateSessionUI();
