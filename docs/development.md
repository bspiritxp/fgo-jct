# 开发与目录约定

## 当前实现范围

可运行的 Vue 六页界面预览与 Tauri 宿主骨架。界面使用独立的展示数据，支持浏览、筛选、详情和选人交互；不连接真实设备、不持久化。名称查询示例仍通过注入的 Gateway 调用，位于采集页内；原有宿主工作区读取命令保留供后续业务接入。

已实现的独立领域规则为名称精确/包含查询与常规六槽位 COST 计算。未实现 ADB、截图/OCR、数据库保存、用户修正提交、真实官方名称导入、编队编辑与外部 Agent 调用。界面没有伪装成已完成的保存或连接按钮。

## 工具链与启动

- Node.js 22.12+（或更新的受支持版本），使用 npm workspaces。
- Rust stable；`Cargo.lock` 与 `package-lock.json` 均提交，复现依赖。
- Windows：Rust MSVC 工具链、Visual Studio C++ Build Tools、WebView2 Runtime。
- macOS：Xcode Command Line Tools 与 Rust。两平台实际桌面构建需分别验证。
- Linux 仅作为开发检查环境时，核心 crate 与浏览器演示不需要 GTK；运行 Tauri 需安装 WebKitGTK 4.1 等系统依赖。

在项目根目录执行：

```sh
npm ci
npm run dev
```

浏览器访问 `http://127.0.0.1:1420`。具备桌面依赖后执行：

```sh
npm run desktop:dev
```

Tauri CLI 会自动启动 Vite，不必同时手动运行第二个 Vite。`npm run build` 产出 `apps/desktop/dist`；`npm run desktop:build` 编译桌面可执行文件，当前 `bundle.active=false`，尚不生成安装包。发布标识、签名、安装包与正式图标后续配置。

## 依赖与职责

```text
apps/desktop/src/
  app/                  Vue 组合入口、导航、依赖注入
  features/             按功能组织组件与页面状态
  infrastructure/       Tauri IPC 与浏览器演示适配器
  shared/               通用样式与错误展示
apps/desktop/src-tauri/
  src/lib.rs            Rust 组合入口，注入具体适配器
  src/commands.rs       薄 IPC 命令层，阻塞工作交给后台任务
crates/fgo-core/
  src/domain/           无桌面框架依赖的领域数据与规则
  src/application/      用例编排、输入检查、输出对象
  src/ports.rs          外部能力的接口
crates/fgo-adapters/     端口的具体实现，当前为 demo
packages/contracts/     TypeScript 类型与运行时 Zod 校验
```

页面和 composable 只依赖 `DesktopGateway`，不得直接调用 invoke、shell、SQL 或具体适配器。适配器仅在 `main.ts` 与 Rust `lib.rs` 组装；浏览器演示只供 UI 开发，不是第二套正式业务后端。桌面中 IPC 错误直接展示，不自动切换演示模式掩盖失败。

Rust 核心不依赖适配器；适配器依赖核心；Tauri 宿主组合两者。增加真实 ADB 或数据库时实现端口并替换注入，不在 Vue 页面添加平台判断。Agent 首先只暴露状态能力，截图分析输入/输出、超时与取消应在真实接入时明确后增加，不先搭通用 Agent 框架。

## 数据契约

IPC 方法为 `load_workspace` 与 `search_names`，响应含 `protocolVersion: 1`。Rust 使用 camelCase 序列化，前端在边界做 Schema 校验；错误返回 `{ code, message }`。共享样本保证基础响应兼容，后续增加命令时补充对应跨端契约样本/测试；目前没有自动生成 TS 类型。

官方中／日名称资料只用于名称校准；当前查询仅 trim + 精确/包含匹配，不承诺 OCR 或复杂模糊纠错。同名候选完整保留，不自动改绑身份。未知培养字段用 null；不存在“未知就是 0”的默认值。图片仅作为游戏截图素材，不做官方头像匹配。

常规 COST 中助战及其礼装不计费，未装备与装备费用未知分开建模；费用或上限未知时返回 Unknown。特殊关卡与整体队伍合法性不在该函数的判断范围内。

## 检查

```sh
npm run check
cargo test --locked -p fgo-core -p fgo-adapters
cargo fmt --all --check
cargo clippy --locked -p fgo-core -p fgo-adapters --all-targets -- -D warnings
cargo check --locked -p fgo-desktop
```

前端检查包括 TypeScript、IPC Schema、演示适配器、组件交互与生产构建；Rust 测试覆盖名称歧义、重复持有、字段序列化和 COST 未知/超限边界。最后的桌面检查需要对应系统构建依赖。GitHub Actions 配置 Windows/macOS 检查矩阵，提交配置不代表远端已通过。

## 本轮验证记录

2026-10-15：TypeScript 检查、4 项前端测试、Vite 生产构建、开发服务器 HTTP 检查、3 项 Rust 测试、核心 Clippy 和 Rust 格式检查通过。Linux 环境缺少桌面系统库；尝试 Windows GNU 目标检查时已修复缺失的开发图标，后续被缺少 `x86_64-w64-mingw32-windres` 资源编译器阻断。未完成 Windows/macOS 本机窗口运行、完整桌面编译或安装包验证；CI 矩阵尚未运行。

## 六页 UI 预览验证

已引入 Naive UI 与 @lucide/vue，六页布局与抽屉/弹窗使用组件库，截图素材统一使用占位图形。`npm run check` 通过；真实 Chromium 中的 `CHROMIUM_PATH=/usr/bin/chromium npm run test:ui` 通过（其他环境可安装 Playwright Chromium 后直接运行 `npm run test:ui`）。预览数据不会发送到真实仓储或模型。

## 云环境预览地址说明

云工作区的 `localhost:1420` 只用于工作区内部检查，不能作为用户本机可访问的预览入口。浏览器打开工具仅发起导航，不建立端口转发。对用户交付使用 Sites 私有托管地址，部署目录独立位于 `/workspace/sites/fgo-jct-ui-preview`，站点 ID 保存在该目录的 `.openai/hosting.json`。托管内容是当前 `apps/desktop/dist` 的静态快照，后续改动需要重新构建并发布，不会自动跟随 Vite 更新。

已验证部署成功的私有预览：[FGO JCT 界面预览](https://fgo-jct-ui-preview.sleek-koi-0731.chatgpt.site)。访问可能需要登录站点所属的 ChatGPT 账号。
