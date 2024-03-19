import { test, expect } from "@playwright/test";

test('load pages without images', async ({ page }) => {
  //await page.route(/(png|jpeg)$/, route => route.abort())
  await page.goto('https://playwright.dev')
})