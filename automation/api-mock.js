const { chromium } = require("playwright");
const fs = require("fs");
const prettier = require("prettier");

(async () => {
  console.time("generate api mocks");

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.route("**/*.{png,jpg,jpeg,webp,svg}", (route) => route.abort());

  page.on("response", async (res) => {
    if (res.url().includes("api.realworld.io/api")) {
      const url = res.url().replace("https://api.realworld.io", "");
      const indexToSplit = url.lastIndexOf("/");
      const fileName = url
        .substring(indexToSplit + 1, url.length)
        .concat(".json");

      fs.promises.mkdir(`${__dirname}/../e2e/api-mocks`, {
        recursive: true,
      });

      const json = await res.json();

      fs.writeFileSync(
        `${__dirname}/../e2e/api-mocks/${fileName}`,
        await prettier.format(JSON.stringify(json), { parser: "json" }),
        { flag: "a+" }
      );
    }
  });

  await page.goto("http://localhost:5173");
  await page.waitForLoadState("networkidle");

  await browser.close();

  console.timeEnd("generate api mocks");
})();
