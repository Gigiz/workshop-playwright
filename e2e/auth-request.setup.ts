import { test as setup } from "@playwright/test";
import { requestAuthFile } from "../playwright.config";

setup("authenticate request context", async ({ request, browser }) => {
  await request.post(
    "https://api.realworld.io/api/users/login",
    {
      data: {
        user: {
          email: "user-playwright@test.com",
          password: "Playwright123!",
        },
      },
    }
  );

  await request.storageState({ path: requestAuthFile });
});
