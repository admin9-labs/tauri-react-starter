# Contributing

感谢反馈问题和提交改进。这个仓库提供通用桌面工具骨架；真实业务、云同步或权限系统应放在派生项目中。

## 开始开发

按 [工程说明](docs/tech/engineering.md#工具与命令) 准备固定工具链和原生系统依赖，然后运行：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

修改前阅读 [AGENTS.md](AGENTS.md)；界面工作另读 [DESIGN.md](DESIGN.md) 和 [UI 组件规范](docs/tech/ui-components.md)。

## 提交改动

- 保持改动聚焦；说明解决的问题、影响范围与实际验证结果。
- 日常改动按 [验证矩阵](docs/tech/engineering.md#验证范围) 执行相关检查；定版使用 `pnpm check`。首次 E2E 前执行 `pnpm exec playwright install chromium`。
- UI 改动提供相关截图；数据持久化或迁移改动提供原生运行证据。浏览器 mock 不能代替 SQLite 验收。
- 契约变化同步对应权威文档；保留锁文件，除非依赖确实发生变化。
- 不提交 `.env`、密钥、用户数据库、调试包或生成的测试数据。

## 反馈问题

通过 [Issues](https://github.com/admin9-labs/tauri-react-starter/issues) 提供系统和架构、工具版本、复现步骤、预期与实际结果，以及脱敏日志或截图。安全问题请按 [SECURITY.md](SECURITY.md) 私下报告。
