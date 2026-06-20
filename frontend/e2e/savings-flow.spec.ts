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
  await expect(page.getByText(demoWallet.address)).toBeVisible();
  await expect(page.getByRole("complementary").getByText("500 CKB")).toBeVisible();

  await page.goto("/deposit");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "Receive funds" })).toBeVisible();
  await expect(page.getByText(demoWallet.address)).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy Address" })).toBeVisible();
});
