# fgo-jct

FGO 游戏辅助桌面工具，面向 Windows/macOS + MuMu + 国服。使用官方中／日从者名称校准游戏内识别结果；头像与立绘取自游戏截图。管理从者与完整编队，接入已有 Agent 给出战况建议，由玩家手动操作。

## 当前状态

已建立 Tauri 2 + Vue 3 + TypeScript 工程、独立 Rust 核心和可运行的演示界面。已增加 Naive UI + Lucide 的六页界面预览，支持搜索筛选、详情抽屉、队伍选人及设置分组；核心包含名称查询和常规 COST 规则。

当前全部使用虚构演示数据，未连接 ADB、OCR、数据库或真实 Agent；编队和战斗助手提供可点击的界面演示，尚未接入真实业务。演示查询不写入档案，不进行头像身份比对。

## 启动

需要 Node.js 22.12+。在项目根目录：

```sh
npm ci
npm run dev
```

浏览器访问 `http://127.0.0.1:1420`。安装 Rust 与目标操作系统的 Tauri 构建依赖后，可执行 `npm run desktop:dev` 启动桌面宿主。详细依赖、构建及测试命令见 [开发文档](docs/development.md)。

## 模块结构

```text
apps/desktop/src/         Vue 页面、功能状态、统一网关与前端适配器
apps/desktop/src-tauri/   Tauri 组合入口及薄命令层
crates/fgo-core/          领域模型、业务规则、应用用例与端口
crates/fgo-adapters/      设备/存储/Agent 的具体适配器（当前仅 demo）
packages/contracts/      TypeScript 数据契约与运行时校验
resources/catalog/       官方中／日名称资料说明
resources/profiles/      设备与页面布局配置预留
database/migrations/     数据库迁移预留
services/recognition/     按需加入的独立 OCR/CV 服务预留
tests/fixtures/demo/      跨 Rust/TypeScript 共享的虚构演示样本
docs/                    需求、架构、开发与决策记录
```

页面通过接口访问能力，核心不依赖桌面框架；具体适配器仅在应用入口组装。数据库、截图、日志和凭据不提交源码仓库。项目采用 npm/Cargo workspaces，锁文件随源码保存。

## 检查

```sh
npm run check
cargo test --locked -p fgo-core -p fgo-adapters
cargo fmt --all --check
cargo clippy --locked -p fgo-core -p fgo-adapters --all-targets -- -D warnings
```

Windows/macOS CI 检查配置已加入；真实设备联调和安装包验证尚未完成。全部设计见 [文档索引](docs/README.md)。
