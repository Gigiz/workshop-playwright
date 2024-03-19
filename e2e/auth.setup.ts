import { test as setup } from "@playwright/test";
import { authFile } from "../playwright.config";

setup("authenticate page context", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.getByPlaceholder("Email").fill("user-playwright@test.com");
  await page.getByPlaceholder("Password").fill("Playwright123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForResponse(/login/);
  await page.waitForURL("/profile/user-playwright/");
  await page.context().storageState({ path: authFile });
});
