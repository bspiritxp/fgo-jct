# 桌面应用

Tauri 2 + Vue 3 + TypeScript，面向 Windows/macOS。

- `src/app/`：组合入口、导航与依赖注入。
- `src/features/`：从者、设备、名称校准等垂直功能模块。
- `src/infrastructure/`：Tauri IPC 和浏览器 demo 网关。
- `src/shared/`：通用样式与错误展示。
- `src-tauri/src/`：Rust 宿主组合与薄命令层，业务规则位于独立核心 crate。

根目录运行 `pnpm dev` 启动浏览器演示，`pnpm desktop:dev` 启动 Tauri。当前两者均使用明确标注的虚构演示数据。详见 [开发文档](../../docs/development.md)。
