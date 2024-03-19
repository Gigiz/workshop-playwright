import { test, expect } from "./fixtures/extensionTest";

test.use({ defaultBrowserType: "chromium" });

test.describe("Load example extension in chrome", () => {
  test("and open the index page and verify its contents", async ({
    page,
    extensionId,
  }) => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    const extensionh1 = page.getByTestId("extension_h1");
    await expect(extensionh1).toHaveText("Extension h1");
    const extensionDate = page.getByTestId("extension_date");
    await expect(extensionDate).toBeVisible();
    await expect(extensionDate).toHaveText(new Date().toDateString());

    await page.waitForTimeout(3_000);
  });

  test("and verify test div is appended", async ({ page }) => {
    await page.goto("https://example.com");
    const testDiv = page.getByTestId("testDiv");
    await expect(testDiv).toHaveText("testDivText");

    await page.waitForTimeout(3_000);
  });
});
