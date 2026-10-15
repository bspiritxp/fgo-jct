import { test, expect } from "@playwright/test";

test("preview navigation, filtering, detail and team selection", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".servant-card")).toHaveCount(8);
  await page.getByPlaceholder("搜索从者中文 / 日文名称").fill("玛修");
  await expect(page.locator(".servant-card")).toHaveCount(1);
  await page.locator(".servant-card").click();
  await expect(page.locator(".n-drawer")).toBeVisible();
  await page.getByRole("button", { name: "关闭", exact: true }).click();
  await page.getByPlaceholder("搜索从者中文 / 日文名称").fill("");
  await page.getByRole("button", { name: "列表视图", exact: true }).click();
  await expect(page.locator(".data-table tbody tr")).toHaveCount(8);
  await page.getByRole("button", { name: "卡片视图", exact: true }).click();
  await page.screenshot({
    path: testInfo.outputPath("servants.png"),
    fullPage: true,
  });
  for (const name of ["礼装", "编队", "采集", "战斗助手"]) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name, exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath(`page-${name}.png`),
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "查看分析示例", exact: true }).click();
  await expect(page.getByText("布局示例 · 非实际战术建议")).toBeVisible();
  await page.locator(".settings-nav").click();
  await page
    .locator(".n-tabs-tab")
    .filter({ hasText: /^Agent$/ })
    .click();
  await expect(page.getByText("外部 Agent", { exact: true })).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "编队", exact: true })
    .click();
  await page
    .getByRole("button", { name: "选择从者", exact: true })
    .first()
    .click();
  await page
    .locator(".picker-list button")
    .filter({ hasText: "库·丘林" })
    .click();
  await expect(
    page.locator(".team-slot").filter({ hasText: "库·丘林" }),
  ).toHaveCount(1);
  await expect(page.locator(".picker-list")).not.toBeVisible();
  await page.setViewportSize({ width: 760, height: 900 });
  await page.screenshot({
    path: testInfo.outputPath("narrow.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
