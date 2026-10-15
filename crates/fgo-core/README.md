# fgo-core

可独立于 Tauri 编译的领域与应用核心，仅依赖 serde 提供数据序列化。

- `domain/`：名称候选、持有实例、设备状态、常规六槽位 COST 规则。
- `application/`：工作区读取与名称查询用例、输入校验、版本化输出。
- `ports.rs`：设备、档案仓储、名称资料、Agent 状态接口。
- `error.rs`：稳定错误代码与可展示消息。

依赖方向为 application → domain/ports；本 crate 不导入 Tauri、Vue、ADB、数据库或任何具体适配器。端口目前是同步只读接口，宿主在阻塞任务池调用；真实长任务接入时需增加超时/取消契约。

`cargo test -p fgo-core` 可验证名称歧义与 COST 规则。COST 目前只有常规费用规则，尚未接入编队 UI；通过 COST 不等同于整队可出战。
