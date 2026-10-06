# Tauri React Starter

在原生启动基线上加入 Radix/Tailwind UI、组合 patterns、明暗及系统主题、通知和组件展示页。主题运行时单测与组件交互 E2E 随功能接入。首次 E2E 前运行 `pnpm exec playwright install chromium`。

## 开发

工具基线：Node 24.20.0、pnpm 11.10.0、Rust 1.93.1（含 rustfmt）。原生开发需要 [Tauri 系统依赖](https://v2.tauri.app/start/prerequisites/)。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

浏览器地址为 `http://localhost:1420`。本阶段的功能与相关测试一起提交；未提供跨平台发行包。

源码采用 [MIT](LICENSE)，素材许可见 [第三方声明](THIRD_PARTY_NOTICES.md)。
