import { test, expect } from "@playwright/test";
import { authFile } from "../playwright.config";
import feedJson from "./api-mocks/feed?limit=10&offset=0.json";

test.use({ storageState: authFile });

test.describe("visual regression", () => {
  test("navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForResponse(/user/);
    const navigation = await page.getByRole("navigation");
    await expect(navigation).toHaveScreenshot();
  });

  test("banner", async ({ page }) => {
    await page.goto("/");
    const banner = await page
      .locator("div")
      .filter({ hasText: "conduitA place to share your" })
      .nth(2);
    await expect(banner).toHaveScreenshot();
  });

  test("logged user feed list", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot();
  });
});

test.describe("logged user", () => {
  test("can see empty feed", async ({ page }) => {
    await page.goto("/");
    await page.waitForResponse(
      (resp) => resp.url().includes("/feed") && resp.status() === 200
    );
    await expect(page.getByText("No articles are here... yet.")).toBeVisible();
  });

  test("can see some mocked feeds", async ({ page }) => {
    await page.route("**/feed?limit=10&offset=0", async (route) => {
      route.fulfill({
        json: feedJson,
      });
    });

    await page.goto("/");

    await expect(page.getByText("Maksim Esteban")).toBeVisible();
    expect(await page.getByTestId("article-preview").count()).toStrictEqual(1);
  });
});
