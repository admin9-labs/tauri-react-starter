import { expect, test } from "playwright/test";

test.use({ colorScheme: "dark" });

test("shows the UI Lab components page and interactive primitives", async ({
  page,
}) => {
  await page.goto("/#/components");

  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("项目内组件样板")).toBeVisible();

  await expect(page.getByRole("heading", { name: "按钮与标记" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "表单" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "表格" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "状态" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Inspector" })).toBeVisible();
  await expect(
    page.getByRole("radiogroup", { name: "组件密度" }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "标题" })).toBeVisible();
  const typeSelect = page.getByRole("combobox", { name: "类型" });
  await expect(typeSelect).toBeVisible();
  await expect(typeSelect).toHaveAttribute("data-slot", "native-select");
  await expect(typeSelect).toHaveCSS("appearance", "none");
  await expect(typeSelect).toHaveCSS("cursor", "pointer");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.getByText("暂无匹配组件")).toBeVisible();

  await page.getByRole("button", { name: "打开弹窗" }).click();
  await expect(page.getByRole("dialog", { name: "组件弹窗" })).toBeVisible();
  await page.getByRole("button", { name: "确认" }).click();
  await expect(page.getByText("弹窗已确认")).toBeVisible();

  await page.getByRole("button", { name: "验证" }).click();
  await expect(
    page.getByRole("dialog", { name: "确认危险操作" }),
  ).toBeVisible();
  await page
    .getByRole("dialog", { name: "确认危险操作" })
    .getByRole("button", { name: "确认", exact: true })
    .click();
  await expect(page.getByText("确认流程完成")).toBeVisible();
});

test("keeps primary button chrome free of visible border", async ({ page }) => {
  await page.goto("/#/components");

  const primaryButton = page.getByRole("button", { name: "新建" });

  await expect(primaryButton).toHaveAttribute("data-slot", "button");
  await expect(primaryButton).toHaveAttribute("data-variant", "default");
  await expect(primaryButton).toHaveCSS("border-top-width", "0px");
  await expect(primaryButton).toHaveCSS("box-shadow", /rgba\(0, 0, 0, 0\)/);
});

test("keeps action icon and list item chrome owned by primitives", async ({
  page,
}) => {
  await page.goto("/#/components");

  const defaultIcon = page.getByRole("button", { name: "复制标识" });
  const destructiveIcon = page.getByRole("button", { name: "危险操作" });
  const sourceItem = page.getByRole("button", { name: /全部记录/ });

  await expect(defaultIcon).toHaveAttribute("data-slot", "action-icon");
  await expect(defaultIcon).toHaveAttribute("data-variant", "default");
  await expect(defaultIcon).toHaveCSS("appearance", "none");
  await expect(defaultIcon).toHaveCSS("box-sizing", "border-box");
  await expect(defaultIcon).toHaveCSS("background-clip", "border-box");

  await expect(destructiveIcon).toHaveAttribute("data-slot", "action-icon");
  await expect(destructiveIcon).toHaveAttribute("data-variant", "destructive");
  await expect(destructiveIcon).not.toHaveClass(/red-/);

  await expect(sourceItem).toHaveAttribute("data-active", "true");
  await expect(sourceItem).not.toHaveClass(/hover:bg-/);
});
