# Tauri React Starter

接入示例记录列表、筛选、详情、连续编辑和删除流程；异步结果归属于发起记录，读取与保存错误可恢复。浏览器刷新重置 mock 数据，原生使用 SQLite。完整单测与 E2E 随功能集成。首次 E2E 前运行 `pnpm exec playwright install chromium`。

## 开发

工具基线：Node 24.20.0、pnpm 11.10.0、Rust 1.93.1（含 rustfmt）。原生开发需要 [Tauri 系统依赖](https://v2.tauri.app/start/prerequisites/)。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

浏览器地址为 `http://localhost:1420`。本阶段的功能与相关测试一起提交；未提供跨平台发行包。

源码采用 [MIT](LICENSE)，素材许可见 [第三方声明](THIRD_PARTY_NOTICES.md)。
