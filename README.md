# Tauri React Starter

加入 Tauri SQL 插件与 SQLite migrations、repository、mapper 和严格的浏览器 mock。数据读写、连接缓存/重试、SQL 契约及分层约束有对应单测；示例页面在下一步接入。首次 E2E 前运行 `pnpm exec playwright install chromium`。

## 开发

工具基线：Node 24.20.0、pnpm 11.10.0、Rust 1.93.1（含 rustfmt）。原生开发需要 [Tauri 系统依赖](https://v2.tauri.app/start/prerequisites/)。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

浏览器地址为 `http://localhost:1420`。本阶段的功能与相关测试一起提交；未提供跨平台发行包。

源码采用 [MIT](LICENSE)，素材许可见 [第三方声明](THIRD_PARTY_NOTICES.md)。
