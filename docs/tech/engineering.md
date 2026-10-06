# 工程契约与验证

本文件维护模块依赖、数据契约、工具和验证方法。产品范围见 [骨架定位](../product/02-prd.md)，通过条件见 [验收标准](../product/07-acceptance-criteria.md)，复制项目见 [开发者入口](developer-start.md)。

## 文档职责

| 入口      | 权威职责                                           |
| --------- | -------------------------------------------------- |
| 根 README | 项目简介、最短启动步骤、文档入口                   |
| AGENTS    | 代理工作约束、修改原则、专项规范入口               |
| DESIGN    | 视觉与交互方向；实际 token 以 `src/index.css` 为准 |
| 产品文档  | 范围、流程、页面地图、术语和验收通过条件           |
| 工程说明  | 模块依赖、数据契约、工具链、复制和验证操作         |
| 代码索引  | 实际文件入口、调用关系和修改位置                   |
| 验收记录  | 指定源码状态的环境、结果、证据和未验证范围         |

其他入口使用摘要和链接，不另维护完整规则。路由事实以 `src/app/routes.ts` 为准，数据库 migration SQL 以 `src-tauri/src/lib.rs` 为准。修改代码时同步对应说明；验收记录保留历史事实。

## 模块依赖

- `app` 负责路由与 providers；`pages` 负责页面请求、表单和交互状态。
- 页面通过 `data/repositories` 访问数据，SQL 只放在数据层。
- `components/ui` 负责基础控件；`patterns` 组合控件；`layout` 负责页面框架与应用外壳。API 规则见 [UI 组件规范](ui-components.md)。
- AppShell 是应用组合入口，可以装配设置面板；不要求为了目录对称而增加包装层。
- repository 封装查询、参数绑定和返回值，mapper 显式转换数据库列名，连接模块负责运行时选择与连接生命周期。
- 详情请求和异步保存、删除归属于发起时的记录实例。离开该实例后，迟到结果不得修改新页面或执行导航；已发出的数据库写入不作可取消承诺。

### 自动依赖约束

ESLint 检查静态导入及再导出，支持别名和相对路径。生产代码使用静态导入，避免动态导入绕过边界。

- 页面访问数据时只能导入 repository。
- UI 不依赖 patterns、layout、页面、数据或 app；patterns 不依赖页面、数据或 app。
- 数据层不依赖 React、页面或 UI。
- 生产代码不导入测试目录、Vitest、Testing Library 或连接重置函数。
- Tauri API 仅由数据库连接、主题和启动入口使用，三处统一调用官方 `isTauri()`。
- 应用、测试和工具的 TypeScript 配置分别检查；生产构建不加载测试全局类型。

## 数据契约

- `sqlDatabase.ts` 只暴露 `execute` 和行数组 `select`，绑定值为字符串、数字或 null，不暴露共享连接的 `close/path`。泛型不验证 SQL 内容；mock 只在返回行数组边界做局部断言。
- 原生通过 Tauri SQL plugin 访问 SQLite。并发加载共享 Promise，成功后缓存，失败清除缓存并继续抛出原错误；下一次用户调用可以重试，不自动重试或切换 mock。
- `browserMockDatabase.ts` 只接受已实现的示例查询、字段和参数形状；未知查询、列和事务请求会抛错。每个 mock 实例拥有独立存储，行类型复用 mapper。它不证明 SQLite 约束、事务或 migration 正确。
- `src/data/migrations.ts` 只保存 URL 和 migration 描述，不执行迁移。数据库 URL 还须与 Rust 注册 URL、Tauri SQL preload 保持一致。
- repository 的 `null`、异常和写入结果语义见 [示例记录模块](example-records.md)。
- 数据保留、应用身份和 schema 替换规则统一见 [开发者入口](developer-start.md#数据与迁移边界)。

## 工具与命令

命令定义以 `package.json` 为准。浏览器开发使用 `pnpm dev`，地址为 `http://localhost:1420`；原生开发使用 `pnpm tauri dev`。首次执行 E2E 前运行 `pnpm exec playwright install chromium`。E2E 使用独立的 `http://127.0.0.1:1423`，不复用已有服务；端口被占用时失败，不自动终止未知进程。

完整验收的工具版本以 `.node-version`、`package.json` 的 `packageManager` 和 `rust-toolchain.toml` 为准。Node 版本管理器选择项目版本；pnpm 安装声明版本；Rust 使用 rustup 选择文件中的 channel 与 rustfmt。使用 Homebrew 等不读取工具链文件的安装方式时，也必须通过 `pnpm check:toolchain` 核对实际二进制。

Node 日常开发兼容范围以 package 的 `engines` 为准，这不是已执行的多版本验收矩阵；TypeScript 保持在现有 ESLint 支持范围内。`pnpm-workspace.yaml` 只允许 esbuild 的安装脚本，前端和 Rust 依赖分别由两份锁文件固定。

## 验证范围

日常改动只执行最小相关检查；共享基础变更、影响无法界定或定版时扩大范围。已通过检查只有在相关源码、依赖、配置和环境未变时才复用。

| 改动             | 日常验证                                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| 文档             | 修改文件格式、链接及代码位置核对                                         |
| 页面、组件、交互 | typecheck、lint、相关单测；可见流程增加浏览器 smoke，受影响 E2E 按需运行 |
| 数据访问         | 相关单测；涉及真实 SQL、迁移或持久化时增加原生验证                       |
| 构建与依赖       | 前端构建和受影响测试                                                     |
| Rust、Tauri      | Cargo 检查和相关原生构建或运行                                           |

完整基线运行 `pnpm check`：工具版本 → 应用/测试/工具类型 → lint → 格式 → 全量单测 → E2E → 前端构建 → Rust 格式与 `cargo check --locked`。单项命令保持可用，`pnpm check:rust` 单独执行 Rust 检查。新环境安装使用 `pnpm install --frozen-lockfile`，不得默默更新锁文件。

GitHub Actions 的 `check.yml` 使用固定 macOS runner、配置中的工具版本和同一个 `pnpm check`，然后构建未签名调试 `.app`。Actions 固定到完整 commit SHA，失败保留诊断附件。CI 编译不能代替原生 UI 或持久化验收；未接入远程仓库时只能报告本地等价检查及工作流配置完成。

pre-commit 只运行类型检查和暂存文件 lint/格式处理，各格式匹配不重叠；完整检查与打包在集中验收和 CI 执行。

Playwright 保持零重试，失败保留 trace 和截图，HTML 报告位于 `playwright-report/` 且不自动打开。异步行为测试用 deferred Promise 控制顺序，业务计时按需使用受控时钟；保留真实通知退出动画集成回归。

测试超时先定位具体异步步骤，不能只提高阈值。成功报告摘要，失败保留有效错误、相关堆栈和 UI 证据。提交 hook 负责快速检查，不代替完整验收。

## 浏览器与原生数据验收

浏览器预览和 Web E2E 使用内存 mock。刷新页面后示例记录重置；查询分支只覆盖示例用法，不验证真实 SQL、约束、事务或 migration。原生验收必须实际加载 Tauri SQL 插件，并获得 main 窗口的 SQL capability 授权。

原生验收使用独立临时目录，通过 Tauri CLI 的 `--config` 覆盖；将以下内容保存为仓库外的临时配置文件：

```json
{
  "app": {
    "appDirectoriesOverride": "/absolute/path/to/temporary-smoke-data"
  }
}
```

已通过前端构建且 `dist` 与源码指纹未变化时，可在临时覆盖配置中设置 `build.beforeBuildCommand` 为 `null`，复用产物而不再次运行前端构建；先核对产物摘要。正式配置不修改。

1. 运行 `pnpm tauri build --debug --no-bundle --config <配置文件>`，启动生成的 debug 应用。macOS 系统 UI 自动化需要 app bundle 时，改用 `pnpm tauri build --debug --bundles app --no-sign --config <配置文件>` 并打开生成的本地 `.app`。
2. 在记录页生成示例，记录待编辑和待删除记录的 ID；编辑其中一条为易辨认的测试内容，删除另一条。
3. 完全退出应用，再从同一 debug 产物启动；检查编辑值保留、被删记录未恢复。
4. 以只读方式检查临时目录中的 `desktop-starter.db`，将 ID 和字段与页面结果对照；派生项目按其数据库名和表名调整。

```bash
python3 - /absolute/path/to/temporary-smoke-data/desktop-starter.db <<'PY'
import sqlite3
import sys
from pathlib import Path

connection = sqlite3.connect(Path(sys.argv[1]).resolve().as_uri() + "?mode=ro", uri=True)
for row in connection.execute("SELECT id, title, summary FROM example_records ORDER BY id"):
    print(row)
connection.close()
PY
```

正式配置、identifier、已有用户数据和 migration 不为验收而修改。桌面编译成功仅证明可构建；只有页面操作、重启结果及只读数据库结果一致，才能声明持久化验收通过。

## 窗口、主题与键盘验收

默认窗口为 **1180×760**，最小支持目标为 **1100×680 逻辑像素**。检查时记录实际逻辑尺寸，截图的物理像素尺寸可能受屏幕缩放影响。

- 在默认／最小尺寸与浅色／深色主题的四种组合下检查概览、记录、详情编辑、组件页、设置和命令面板，并保存画面。
- 页面工具栏、主要操作、表单和弹窗底部可达；长内容正确换行、截断或滚动，没有遮挡控件的溢出。
- Tab 焦点可见且顺序合理；Enter 可激活当前操作；命令面板支持方向键选择，Esc 能关闭设置、命令面板及确认弹窗。
- 通过页面和受控失败测试检查读取重试、刷新失败及保存错误，确认错误持续显示且可以恢复。
- 浏览器检查使用项目约定的工具，原生窗口运行和截图单独留证。未经原生实测，不声明窗口目标通过；未运行的平台标为“尚未验证”。

## 证据记录

在仓库外保存日志、截图、数据库只读结果和源码指纹。交付记录列明基准提交、实际源码状态、环境、命令、结果、证据包位置和未验证范围。使用已有证据时说明输入未变化的依据。

页面单测证明交互结果；mock repository 测试证明示例应用数据流；插件 mock 测试证明调用参数和连接策略；浏览器 E2E 证明页面集成。原生操作、退出重启与只读 SQLite 核对共同证明指定平台上的真实持久化。编译不等于原生运行验收。
