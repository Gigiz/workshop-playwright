import { test, expect } from "@playwright/test";

type Paint = { startTime: number };

// test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("First Contentful Paint (FCP) test @performance", async ({ page }) => {
  const fcp: Paint = await page.evaluate(async () => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        resolve(entries[entries.length - 1]);
      }).observe({
        type: "paint",
        buffered: true,
      });
    });
  });

  if (fcp) {
    expect(fcp.startTime).toBeLessThan(300);
  }
});

test("Largest Contentful Paint (LCP) test @performance", async ({ page }) => {
  const lcp: Paint = await page.evaluate(async () => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        resolve(entries[entries.length - 1]);
      }).observe({
        type: "largest-contentful-paint",
        buffered: true,
      });
    });
  });

  if (lcp) {
    expect(lcp.startTime).toBeLessThan(2500);
  }
});

test("Time to First Byte (TTFB) test @performance", async ({ page }) => {
  const ttfb = await page.evaluate(async () => {
    return new Promise((resolve) => {
      window.performance.mark("start");
      resolve(
        performance.timing.responseStart - performance.timing.requestStart
      );
    });
  });

  if (ttfb) {
    expect(ttfb).toBeLessThan(800);
  }
});

test("First Input Delay (FID) test @performance", async ({ page }) => {
  await page.waitForTimeout(500);

  await page.getByRole("button", { name: "Global Feed" }).click();

  const fid = await page.evaluate(async () => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          resolve(entries[0]);
        }
      }).observe({
        type: "first-input",
        buffered: true,
      });
    });
  });

  if (fid) {
    expect(fid.processingStart - fid.startTime).toBeLessThan(100);
  }
});
