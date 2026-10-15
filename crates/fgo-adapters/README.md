# fgo-adapters

实现核心定义的端口。当前只有 `demo`，读取共享的虚构测试数据，不访问设备、不调用模型、不持久化。

后续分别增加 `adb`、`sqlite`、`name_catalog` 和 `agent_cli` 等模块，在宿主组合入口替换注入。适配器只处理外部协议/存储，不承载名称归并或编队规则。共享样本位于 `tests/fixtures/demo/`，由 Rust 序列化测试与 TypeScript Schema 共同验证字段兼容性。
