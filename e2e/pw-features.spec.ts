import { test, expect } from "@playwright/test";
import path from "path";

test.describe("crazy feature", () => {
  test.use({
    geolocation: { latitude: 43.23997, longitude: -107.1393702 },
    permissions: ["geolocation"],
    timezoneId: "Australia/Melbourne",
    colorScheme: "dark",
  });

  test("geolocation", async ({ page }) => {
    await page.goto("https://webbrowsertools.com/geolocation/");
    await expect(
      page.getByRole("cell", { name: "United States", exact: true })
    ).toBeVisible();
  });

  test("color schema light", async ({ page }) => {
    await page.goto("https://playwright.dev");
  });

  test("file upload", async ({ page }) => {
    await page.goto(
      "https://meidy.csb.app/"
    );

    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, 'api-mocks', 'foto.jpg'));
 
    await page.getByRole('button', { name: 'Upload' }).click()

    await page.waitForTimeout(3_000)
  });
});
