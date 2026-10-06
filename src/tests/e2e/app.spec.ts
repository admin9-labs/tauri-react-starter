import { expect, test } from "playwright/test";

test.use({ colorScheme: "dark" });

for (const hash of [
  "#/records-extra",
  "#/records/example/extra",
  "#/unknown",
]) {
  test(`keeps fallback content and navigation consistent for ${hash}`, async ({
    page,
  }) => {
    await page.goto(`/${hash}`);

    await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
    await expect(page.getByRole("link", { name: "概览" })).toHaveClass(
      /native-sidebar-active/,
    );
    await expect(
      page.getByRole("link", { name: "记录", exact: true }),
    ).not.toHaveClass(/native-sidebar-active/);
  });
}

test("keeps navigation consistent across back and forward history", async ({
  page,
}) => {
  await page.goto("/#/dashboard");
  await page.getByRole("link", { name: "记录", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "记录", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "组件", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "组件", exact: true }),
  ).toBeVisible();

  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "记录", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "记录", exact: true }),
  ).toHaveClass(/native-sidebar-active/);

  await page.goBack();
  await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
  await expect(page.getByRole("link", { name: "概览" })).toHaveClass(
    /native-sidebar-active/,
  );

  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "记录", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "记录", exact: true }),
  ).toHaveClass(/native-sidebar-active/);
});

test("updates the page and navigation through the command menu", async ({
  page,
}) => {
  await page.goto("/#/dashboard");
  await page.getByRole("button", { name: /命令面板/ }).click();
  await page
    .getByRole("dialog", { name: "Command Center" })
    .getByText("打开记录", { exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "记录", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "记录", exact: true }),
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
  await expect(navigation.getByRole("link", { name: "记录" })).toBeVisible();
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

test("seeds example records and opens record detail", async ({ page }) => {
  await page.goto("/#/records");

  await expect(page.getByRole("heading", { name: "记录" })).toBeVisible();
  await expect(page.locator("[data-record-list-surface]")).toBeVisible();
  await expect(page.getByText("暂无记录")).toBeVisible();

  await page
    .locator("header")
    .getByRole("button", { name: "生成示例" })
    .click();

  await expect(page.getByText("3 条记录").first()).toBeVisible();
  await expect(page.getByText("Records").first()).toBeVisible();
  await expect(page.getByText("Record Inspector")).toBeVisible();
  await expect(page.getByRole("link", { name: "打开详情" })).toBeVisible();

  await page.getByRole("link", { name: /Application shell/ }).click();

  await expect(page).toHaveURL(/#\/records\/.+/);
  await expect(page.getByRole("heading", { name: "记录详情" })).toBeVisible();
  await expect(page.getByText("Inspector")).toBeVisible();
  await expect(page.getByRole("button", { name: "编辑记录" })).toBeVisible();
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

test("keeps light sidebar active color clean on hover", async ({ page }) => {
  await page.goto("/#/dashboard");
  await page.getByRole("button", { name: "设置" }).click();
  await page.getByText("浅色", { exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
    .toBe("light");
  await page.keyboard.press("Escape");

  const navigation = page.getByRole("navigation", { name: "主导航" });
  const recordsLink = navigation.getByRole("link", {
    name: "记录",
    exact: true,
  });

  await recordsLink.click();
  await recordsLink.hover();

  await expect(recordsLink).toHaveClass(/native-sidebar-active/);
  await expect
    .poll(() =>
      recordsLink.evaluate((element) => {
        const styles = getComputedStyle(element);
        const probe = document.createElement("span");
        probe.style.color = styles.getPropertyValue("--primary");
        element.append(probe);
        const primaryColor = getComputedStyle(probe).color;
        probe.remove();

        return {
          color: styles.color,
          primaryColor,
        };
      }),
    )
    .toEqual({
      color: "rgb(0, 102, 204)",
      primaryColor: "rgb(0, 102, 204)",
    });
  await expect
    .poll(() =>
      recordsLink.evaluate(
        (element) => getComputedStyle(element, "::before").backgroundColor,
      ),
    )
    .toBe("rgba(0, 0, 0, 0)");
  await expect(recordsLink).toHaveCSS("transform", "none");
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

test("keeps page toolbar pinned while full-width page body scrolls", async ({
  page,
}) => {
  await page.goto("/#/records");

  const shell = page.locator("#root > div").first();
  const main = page.locator("main");
  const pageToolbar = page.locator("[data-page-toolbar]");
  const pageBody = page.locator("[data-page-body]");
  const recordSurface = page.locator("[data-record-list-surface]");
  const seedButton = page
    .locator("header")
    .getByRole("button", { name: "生成示例" });

  await expect(shell).toHaveCSS("overflow", "hidden");
  await expect(main).toHaveCSS("overflow", "hidden");
  await expect(page.locator("[data-window-drag-strip]")).toHaveCount(0);
  await expect(page.locator("[data-tauri-drag-region]")).toHaveCount(0);
  await expect(pageToolbar).toHaveCSS("flex-shrink", "0");
  await expect(pageToolbar).toHaveCSS("height", "52px");
  await expect(pageBody).toHaveCSS("overflow-y", "auto");
  await expect(pageBody).toHaveCSS("overscroll-behavior-y", "none");
  await expect(pageBody).toHaveCSS("padding-top", "0px");
  await expect(pageBody).toHaveCSS("padding-left", "0px");
  await expect(pageBody).toHaveCSS("padding-right", "0px");

  const mainBox = await main.boundingBox();
  const pageBodyBox = await pageBody.boundingBox();
  const surfaceBox = await recordSurface.boundingBox();
  expect(mainBox?.y).toBeCloseTo(0, 1);
  expect(pageBodyBox?.x).toBeCloseTo(mainBox?.x ?? 0, 1);
  expect(pageBodyBox?.width).toBeCloseTo(mainBox?.width ?? 0, 1);
  expect(surfaceBox?.x).toBeCloseTo(pageBodyBox?.x ?? 0, 1);
  expect(surfaceBox?.width).toBeCloseTo(pageBodyBox?.width ?? 0, 1);
  expect(surfaceBox?.y).toBeCloseTo(pageBodyBox?.y ?? 0, 1);
  await expect
    .poll(() =>
      page.evaluate(() => ({
        documentOverflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
      })),
    )
    .toEqual({ documentOverflow: 0, bodyOverflow: 0 });
  await expect
    .poll(() =>
      pageBody.evaluate((element) => element.scrollWidth - element.clientWidth),
    )
    .toBeLessThanOrEqual(1);

  const initialToolbarBox = await pageToolbar.boundingBox();
  const initialButtonBox = await seedButton.boundingBox();

  await pageBody.evaluate((element) => {
    const spacer = document.createElement("div");
    spacer.setAttribute("data-test-scroll-spacer", "true");
    spacer.style.height = "900px";
    element.append(spacer);
    element.scrollTop = element.scrollHeight;
  });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect
    .poll(() => pageBody.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);

  const finalToolbarBox = await pageToolbar.boundingBox();
  const finalButtonBox = await seedButton.boundingBox();

  expect(finalToolbarBox?.y).toBeCloseTo(initialToolbarBox?.y ?? 0, 1);
  expect(finalButtonBox?.y).toBeCloseTo(initialButtonBox?.y ?? 0, 1);
  await expect(seedButton).toBeVisible();
});

test("keeps button primitive chrome single-layer on hover", async ({
  page,
}) => {
  await page.goto("/#/dashboard");

  const outlineButton = page.getByRole("link", { name: "查看示例数据" });
  const toolbarButton = page
    .locator("header")
    .getByRole("link", { name: "查看记录" });

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

test("keeps records list row chrome in the record list primitive", async ({
  page,
}) => {
  await page.goto("/#/records");
  await page
    .locator("header")
    .getByRole("button", { name: "生成示例" })
    .click();

  const firstRecord = page.locator('[data-slot="record-list-item"]').first();

  await expect(firstRecord).toHaveAttribute("data-slot", "record-list-item");
  await expect(firstRecord).toHaveAttribute("data-active", "true");
  await expect(firstRecord).not.toHaveClass(/hover:bg-/);
  await expect(page.locator('[data-slot="record-list-header"]')).toBeVisible();
  await expect(page.locator('[data-slot="record-list-footer"]')).toBeVisible();
});

test("edits twice and confirms deletion through the record flow", async ({
  page,
}) => {
  await page.goto("/#/records");
  await page
    .locator("header")
    .getByRole("button", { name: "生成示例" })
    .click();
  await page.getByRole("link", { name: /Application shell/ }).click();
  for (const title of ["First browser save", "Second browser save"]) {
    await page.getByRole("button", { name: "编辑记录" }).click();
    await page.getByLabel("标题", { exact: true }).fill(title);
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("记录已保存", { exact: true }).last(),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "删除记录" }).click();
  const dialog = page.getByRole("dialog", { name: "删除记录" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "删除", exact: true }).click();
  await expect(page).toHaveURL(/#\/records$/);
  await expect(
    page.getByRole("link", { name: /Second browser save/ }),
  ).toHaveCount(0);
  await expect(page.locator('[data-slot="record-list-item"]')).toHaveCount(2);
});

test("keeps records beyond twenty reachable and includes them in filters", async ({
  page,
}) => {
  await page.goto("/#/records");
  await expect(page.getByText("暂无记录")).toBeVisible();
  await page.evaluate(async (modulePath) => {
    const module: unknown = await import(modulePath);
    const { ExampleRecordRepository } =
      module as typeof import("@/data/repositories");
    const repository = new ExampleRecordRepository();
    const older = await repository.create({
      title: "Older paused browser record",
      summary: "Beyond twenty",
      status: "paused",
    });
    await repository.update(older.id, { updatedAt: "2020-01-01T00:00:00Z" });
    for (let i = 0; i < 24; i++)
      await repository.create({
        title: `Browser entry ${i}`,
        summary: "Active fixture",
      });
  }, "/src/data/repositories/index.ts");
  await page.getByRole("button", { name: "刷新", exact: true }).click();
  await expect(page.locator('[data-slot="record-list-item"]')).toHaveCount(25);
  await expect(page.getByRole("button", { name: /暂停/ })).toContainText("1");
  await page.getByRole("button", { name: /暂停/ }).click();
  await expect(page.locator('[data-slot="record-list-item"]')).toHaveCount(1);
  await page.getByRole("link", { name: /Older paused browser record/ }).click();
  await expect(
    page.getByRole("heading", { name: "Older paused browser record" }),
  ).toBeVisible();
});
