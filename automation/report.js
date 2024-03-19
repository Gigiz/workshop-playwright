const { chromium } = require("playwright");
const fs = require("fs/promises");

(async () => {
  console.time("generate pdf");

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  fs.mkdir(`${__dirname}/../reports`, { recursive: true });

  await page.goto("http://localhost:5173");
  await page.waitForLoadState("networkidle");
  await page.pdf({ path: "./reports/homepage.pdf", format: "A4" });
  await browser.close();

  console.timeEnd("generate pdf");
})();
