import { test, expect } from "@playwright/test";

test.describe("visual regression", () => {
  test("navigation", async ({ page }) => {
    await page.goto("/");
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

  test("articles list", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot();
  });
});

test.describe("anonymous user", () => {
  test("can see articles", async ({ page }) => {
    await page.goto("/");

    await test.step("first ten", async () => {
      await page.waitForResponse(
        (resp) => resp.url().includes("/articles") && resp.status() === 200
      );
      await expect(
        page.getByRole("button", { name: "Load More" })
      ).toBeVisible();
      expect(await page.getByTestId("article-preview").count()).toStrictEqual(
        10
      );
    });

    await test.step("load more articles", async () => {
      await page.getByRole("button", { name: "Load More" }).click();
      await page.waitForResponse(
        (resp) =>
          resp.url().includes("/articles?limit=10&offset=10") &&
          resp.status() === 200
      );
      await expect(
        page.getByRole("button", { name: "Load More" })
      ).toBeVisible();
      expect(await page.getByTestId("article-preview").count()).toStrictEqual(
        20
      );
    });
  });
});
