import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const target = `file:///${path.resolve("index.html").replace(/\\/g, "/")}`;
  await page.goto(target);

  await page.fill("#subscriber-email", "reader@example.com");
  await page.click("#subscribe-form button[type='submit']");
  await expectText(page, "#subscribe-message", "구독이 완료되었습니다. 환영합니다!");

  await page.fill("#signup-name", "홍길동");
  await page.fill("#signup-email", "hong@example.com");
  await page.fill("#signup-password", "secret12");
  await page.click("#signup-form button[type='submit']");
  await expectText(page, "#signup-message", "회원가입이 완료되었습니다.");

  await page.fill("#login-email", "hong@example.com");
  await page.fill("#login-password", "secret12");
  await page.click("#login-form button[type='submit']");
  await expectText(page, "#login-message", "홍길동님, 로그인되었습니다.");

  const sessionText = await page.locator("#session-status").textContent();
  assert.match(sessionText ?? "", /홍길동/);

  await page.click("#logout-btn");
  await expectText(page, "#session-status", "현재 로그인 상태: 없음");

  await page.click(".footer-link");
  await page.waitForURL(/privacy\.html$/);
  await expectText(page, "h1", "개인정보보호 정책");

  await browser.close();
  console.log("Playwright test passed: subscribe/signup/login/logout/privacy-link");
}

async function expectText(page, selector, expected) {
  await page.waitForFunction(
    ({ selector, expected }) => {
      const element = document.querySelector(selector);
      return element && element.textContent && element.textContent.includes(expected);
    },
    { selector, expected },
  );
}

run().catch((error) => {
  console.error("Playwright test failed:", error);
  process.exitCode = 1;
});
