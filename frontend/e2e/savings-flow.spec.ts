import { expect, test } from "@playwright/test";

const demoWallet = {
  address: "ckt1-fibersave-demo-wallet",
  ckbBalance: "500",
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript((wallet) => {
    window.localStorage.setItem("fibersave.demo-wallet.v1", JSON.stringify(wallet));
  }, demoWallet);
});

test("creates, updates, and reviews a savings goal", async ({ page }) => {
  await page.goto("/goals/new");
  await page.waitForLoadState("networkidle");
  await page.reload();
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading", { name: "New savings goal" })).toBeVisible();
  await page.getByLabel("Goal name").fill("School Fees");
  await page.getByLabel("Target amount").fill("100");
  await page.getByRole("button", { name: "Create Goal" }).click();

  await expect(page).toHaveURL(/\/goals\/(?!new$)[^/]+$/);
  await expect(page.getByRole("heading", { name: "School Fees" })).toBeVisible();

  await page.getByLabel("Assign amount").fill("40");
  await page.getByRole("button", { name: "Assign" }).click();
  await expect(page.getByText("40 CKB assigned toward 100 CKB")).toBeVisible();

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "Active goals" })).toBeVisible();
  await expect(page.getByText("School Fees")).toBeVisible();
  await expect(page.getByText("40 CKB of 100 CKB")).toBeVisible();

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.getByTestId("goal-progress-track")).toHaveCSS(
    "background-color",
    "rgb(47, 47, 47)",
  );
  await expect(page.getByTestId("goal-progress-fill")).toHaveCSS(
    "background-color",
    "rgb(245, 245, 245)",
  );

  await page.getByText("School Fees").click();
  await page.getByLabel("Remove amount").fill("10");
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("30 CKB assigned toward 100 CKB")).toBeVisible();

  await page.goto("/activity");
  await expect(page.getByText("Created savings goal: School Fees")).toBeVisible();
  await expect(page.getByText("Assigned funds to School Fees")).toBeVisible();
  await expect(page.getByText("Removed funds from School Fees")).toBeVisible();
});

test("renders the demo-wallet dashboard and deposit state", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("complementary").getByTitle(demoWallet.address),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary").getByText("500.00", { exact: true }),
  ).toBeVisible();

  await page.goto("/deposit");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "Receive funds" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy Address" })).toBeVisible();
});

test("persists dark mode across reloads", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(245, 245, 245)");
  await expect(page.getByRole("navigation")).toHaveCSS(
    "border-bottom-color",
    "rgb(66, 66, 66)",
  );

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(page.getByRole("button", { name: "Toggle color theme" })).toBeVisible();

  await page.goto("/goals/new");
  await expect(page.getByLabel("Goal name")).toHaveCSS(
    "border-color",
    "rgb(66, 66, 66)",
  );
});
