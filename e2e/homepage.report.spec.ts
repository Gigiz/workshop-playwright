import { test, expect } from "@playwright/test";
import fs from "fs/promises";

test.use({ defaultBrowserType: "chromium" });

test("generate article pdf from page scraping", async ({ page, browser }) => {
  await page.goto("/");

  await page.waitForResponse(
    (resp) => resp.url().includes("/articles") && resp.status() === 200
  );
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();

  const firstArticle = (
    await page.innerHTML('[data-testid="article-preview"]')
  ).toString();

  const page2 = await browser.newPage();
  const buffer = await fs.readFile(`${__dirname}/../automation/index.html`);
  const htmlString = buffer.toString();

  const htmlReport =
    htmlString.slice(0, 278) +
    firstArticle +
    htmlString.slice(278, htmlString.length);

  await fs.writeFile(`${__dirname}/../reports/index.html`, htmlReport, {
    flag: "w+",
  });
  await page2.goto(`file://${__dirname}/../reports/index.html`);

  await page2.pdf({ path: "./reports/article.pdf" });
});
