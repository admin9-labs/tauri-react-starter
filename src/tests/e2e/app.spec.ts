import { expect, test } from "playwright/test";

test.use({ colorScheme: "dark" });

test("keeps navigation consistent across back and forward history", async ({
  page,
}) => {
  await page.goto("/#/dashboard");
  await page.getByRole("link", { name: "组件", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "概览", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "概览", exact: true }),
  ).toBeVisible();

  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "组件", exact: true }),
  ).toHaveClass(/native-sidebar-active/);

  await page.goBack();
  await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
  await expect(page.getByRole("link", { name: "概览" })).toHaveClass(
    /native-sidebar-active/,
  );

  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "组件", exact: true }),
  ).toHaveClass(/native-sidebar-active/);
});

test("updates the page and navigation through the command menu", async ({
  page,
}) => {
  await page.goto("/#/dashboard");
  await page.getByRole("button", { name: /命令面板/ }).click();
  await page
    .getByRole("dialog", { name: "Command Center" })
    .getByText("打开组件", { exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "组件", exact: true }),
  ).toHaveClass(/native-sidebar-active/);
  await expect(
    page.getByRole("dialog", { name: "Command Center" }),
  ).toBeHidden();

  await page.getByRole("button", { name: /命令面板/ }).click();
  await page
    .getByRole("dialog", { name: "Command Center" })
    .getByText("打开概览", { exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
  await expect(page.getByRole("link", { name: "概览" })).toHaveClass(
    /native-sidebar-active/,
  );
});

test("shows the reusable desktop starter dashboard", async ({ page }) => {
  await page.goto("/#/dashboard");

  await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
  await expect(page.getByText("干净的本地桌面工具骨架")).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "主导航" });
  await expect(navigation.getByRole("link", { name: "概览" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "组件" })).toBeVisible();
  await expect(page.getByRole("button", { name: "设置" })).toBeVisible();
  await expect(page.locator("[data-window-drag-strip]")).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => ({
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        bodyBackground: getComputedStyle(document.body).backgroundColor,
      })),
    )
    .toEqual(
      expect.objectContaining({
        colorScheme: "dark",
      }),
    );
});

test("opens settings and persists theme choices", async ({ page }) => {
  await page.goto("/#/dashboard");
  await page.getByRole("button", { name: "设置" }).click();

  await expect(page.getByRole("dialog", { name: "设置" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "跟随系统" })).toBeChecked();

  await page.getByText("浅色", { exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => ({
        storedTheme: window.localStorage.getItem("desktop-starter:theme"),
        theme: document.documentElement.dataset.theme,
        preference: document.documentElement.dataset.themePreference,
      })),
    )
    .toEqual({
      storedTheme: "light",
      theme: "light",
      preference: "light",
    });

  await page.reload();
  await page.getByRole("button", { name: "设置" }).click();
  await expect(page.getByRole("radio", { name: "浅色" })).toBeChecked();
});

test("shows the UI Lab components page and interactive primitives", async ({
  page,
}) => {
  await page.goto("/#/components");

  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("项目内组件样板")).toBeVisible();
  await expect(page.getByRole("link", { name: "组件" })).toHaveClass(
    /native-sidebar-active/,
  );

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

test("keeps button primitive chrome single-layer on hover", async ({
  page,
}) => {
  await page.goto("/#/dashboard");

  const outlineButton = page.getByRole("link", { name: "查看组件示例" });
  const toolbarButton = page
    .locator("header")
    .getByRole("link", { name: "查看组件" });

  for (const button of [outlineButton, toolbarButton]) {
    await expect(button).toHaveAttribute("data-slot", "button");
    await expect(button).toHaveAttribute("data-variant", /outline|toolbar/);
    await expect(button).toHaveCSS("appearance", "none");
    await expect(button).toHaveCSS("background-clip", "border-box");
    await expect(button).toHaveCSS("box-sizing", "border-box");
  }

  const restBox = await outlineButton.boundingBox();
  await outlineButton.hover();
  const hoverBox = await outlineButton.boundingBox();

  expect(hoverBox?.width).toBeCloseTo(restBox?.width ?? 0, 1);
  expect(hoverBox?.height).toBeCloseTo(restBox?.height ?? 0, 1);
  await expect(outlineButton).toHaveCSS("box-shadow", /rgba\(0, 0, 0, 0\)/);
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
