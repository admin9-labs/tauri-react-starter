# 开发者入口

这是一个本地单用户桌面工具 starter。可以复用应用 Shell、视觉系统、SQLite 数据层和测试基线，也可以全部复制后替换示例业务。本指南是用户描述需求后，开发者或 Codex 接入新业务的入口。

## 先读与开发顺序

1. 读根目录 `AGENTS.md`、`README.md` 和 `DESIGN.md`，确认业务目标、范围和视觉约束。
2. 从 [项目索引](../project-index/README.md) 找到涉及的入口；修改基础控件前读 [组件边界](ui-components.md)。
3. 以 `概览 → 记录列表 → 记录详情 → 编辑或删除` 为参考，确定本次需要的页面与数据变化。
4. 数据经 repository 访问，页面只负责展示和交互；保留加载、失败、重试、空数据及保存反馈。
5. 按 [验收标准](../product/07-acceptance-criteria.md) 选择相关检查，记录实际结果和未验证范围。

## 复制与应用身份

复制到独立目录后，先替换派生项目的 `AGENTS.md` 业务定位、README 介绍及产品文档。骨架源仓库的“无真实业务”限制不应阻止派生项目实现业务；组件分层、repository 访问和验证规则继续保留。

在第一次原生运行前完成下面的身份检查，避免派生应用与模板共用应用身份和默认数据目录。

正常派生项目按 [工程说明](engineering.md#工具与命令) 选择工具版本，运行 `pnpm install --frozen-lockfile` 安装自己的依赖。临时演练若用符号链接复用骨架的 `node_modules`，pnpm 11 可能在运行脚本前自动安装依赖；仅在这种共享依赖的演练中，使用 `pnpm_config_verify_deps_before_run=false pnpm <命令>` 禁用该行为，避免修改源项目依赖。

| 位置                                                                          | 修改内容与关联                                                                                                                                            |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                                                | `name`；保留现有工具链和脚本，依赖变更时用 pnpm 更新 lockfile                                                                                             |
| `index.html`、`public/`                                                       | 页面 title、页面语言及浏览器图标；不需要的模板品牌素材按需替换                                                                                            |
| `src/components/layout/AppShell.tsx`、`src/pages/DashboardPage.tsx`           | 品牌名、说明、导航和概览文案                                                                                                                              |
| `src-tauri/tauri.conf.json`                                                   | 独立的 `identifier`、`productName`、`app.windows[].title`；发布前替换 bundle 图标                                                                         |
| `src-tauri/Cargo.toml`、`src-tauri/src/main.rs`                               | 协调 package `name`、lib `name` 与 `main.rs` 的 `<lib_name>::run()`；库名使用合法 Rust 标识符，保留 `_lib` 区分库和二进制                                 |
| `src-tauri/Cargo.lock`                                                        | Rust package 改名后先运行 `cargo check --manifest-path src-tauri/Cargo.toml` 让 Cargo 更新根包项，审阅 lockfile，再用 `--locked` 验证；不手工重写依赖版本 |
| `src/app/theme.tsx`                                                           | 将 `themeStorageKey` 改为派生项目命名空间，同步引用旧 key 的 E2E 断言                                                                                     |
| `src/data/migrations.ts`、`src-tauri/src/lib.rs`、`src-tauri/tauri.conf.json` | 数据库文件名可以保留；若修改，前端 `DATABASE_URL`、Rust `DATABASE_URL` 与 `plugins.sql.preload` 三处必须一致                                              |

相同数据库文件名不等于相同应用身份；派生项目仍必须使用独立 identifier。默认数据目录由原生运行时解析，不在页面写死绝对路径。验收时使用独立目录，见下方原生检查。

改完后搜索 `Desktop Starter`、`desktop-starter`、`desktop_starter`、`tauri-react-starter`，逐项处理残留，区分保留的模板说明与实际配置。窗口 `label` 当前为 `main`；通常无需更改，如更改需同步 capability 的 `windows` 关联。

## 替换示例实体

下面的文件路径以仓库根目录为基准；字段变化必须覆盖完整数据流，不能只改页面标签。

1. **类型与映射**：在 `src/types/app.ts` 定义业务实体及状态；替换 `src/data/mappers/exampleRecordMapper.ts`，保持数据库列名到前端属性名的明确映射。
2. **repository**：替换 `src/data/repositories/exampleRecordRepository.ts` 的 SQL、输入输出类型和示例 seed；同步 `src/data/repositories/index.ts` 导出及调用方 import。保持参数绑定，页面不写 SQL。
3. **schema**：实际 migration SQL 在 `src-tauri/src/lib.rs`；同步 `src/data/migrations.ts` 的版本和描述。后者只是描述信息，不会创建或升级数据库。
4. **浏览器 mock**：同步 `src/data/browserMockDatabase.ts` 中存储、查询分支、参数顺序和更新列；行类型复用 mapper，连接测试重置留在 `connection.ts`。它只识别当前示例使用的 SQL，不是通用 SQLite 引擎；新增实体或查询需要同步实现。
5. **页面与入口**：替换 `src/pages/RecordsPage.tsx`、`RecordDetailPage.tsx` 及概览相关内容；同步 `src/app/routes.ts` 的路由定义、解析和详情 ID 提取，更新 `src/app/App.tsx` 页面分发、`AppShell.tsx` 导航和选中判断。需要命令入口时同步 `src/components/layout/command-menu.tsx` 的标签、搜索词和目标。
6. **测试与文档**：同步数据、路由、页面和 E2E 的 fixture、字段、链接、标签与主题 key；重新搜索旧实体名称和字段，检查是否仍有实际调用。更新产品范围及开发入口。

例如把示例替换为笔记：可使用 `Note` / `NoteRepository`、`notes` 表和 `body` 字段，替换 `ExampleRecord`、`example_records` 和 `summary`。保留示例 seed、列表、详情、编辑和删除作为最小验证链路；不必为演练增加新建页。

## 数据与迁移边界

- 全新且没有需要保留的数据的派生项目，可重新定义初始 schema，同时更新描述和 mock。先确认所用应用身份、数据库目录确属新项目。
- 已有用户数据时，保持已执行 migration 不变，使用更高版本的追加迁移；增加对应原生升级验证，不靠删除旧库规避问题。
- 浏览器 mock 数据刷新后重置；它拒绝 `BEGIN` / `COMMIT` / `ROLLBACK` 等事务请求，`app_metadata` 查询也仅返回空结果，不能据此证明 SQL、约束、迁移、事务或元数据写入正确。
- 原生加载失败必须保留错误。连接失败后的下一次调用会重新尝试连接；页面通过用户点击重试发起调用，不自动切到 mock。

## 验证与交付

日常改动先运行最小相关检查，具体矩阵见 [工程验证](engineering.md#验证范围)。复制新项目或骨架定版需要完整基线，并做以下实际检查：

- 浏览器预览验证路由、seed、编辑、删除、错误恢复和主题；修改字段后确认 mock 的读写结果一致。
- 原生应用在独立临时数据目录完成生成、编辑、删除和退出重启；用只读 SQLite 检查确认落盘，步骤见 [原生数据验收](engineering.md#浏览器与原生数据验收)。
- 检查派生 identifier 和数据目录独立；在默认、最小窗口尺寸及明暗主题下检查页面与弹窗。
- 交付说明列出变更、验证命令与结果、截图和未验证平台。代码审阅或编译通过不能写成原生验收通过。
