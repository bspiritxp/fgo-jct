# 数据模型草案

本文描述逻辑实体与约束，不是已经执行的 SQL Schema。待字段范围确认后形成版本化迁移。

| 实体 | 关键字段 | 说明 |
| --- | --- | --- |
| AccountProfile | id、label、region、master_level、cost_limit_override、cost_limit_source | 本地账号档案；不存游戏登录凭据 |
| ServantDefinition | id、name_zh、name_ja、source、data_version | 官方中／日名称身份条目，仅名称与必要来源元数据，不含官方图片或完整图鉴 |
| ServantNameVariant | id、definition_id、language、official_name、source | 经来源核实的其他官方显示名；名称不强制全局唯一，不保存模型猜测别名 |
| OwnedServant | id、account_id、definition_id、recognized_name_raw、class、rarity、cost、level、np_level、ascension_stage、revision | 玩家持有实例；definition_id 可暂空以容纳身份未知 |
| OwnedServantSkill | owned_servant_id、kind、slot、level | 主动与附加技能用 kind 区分；未识别 level 可空 |
| FieldEvidence | entity_id、field_path、value、source、frame_id、confidence、confirmed_at | 字段来源、自动/手工标记与确认记录 |
| Asset | id、content_hash、relative_path、kind、frame_id、crop_rect、surface | 原图/裁剪/缩略图与外观标记 |
| NameCalibration | id、owned_servant_id、frame_id、raw_text、candidate_ids、selected_definition_id、status | 原始名字、候选及用户校准记录；身份未解析时保留未知 |
| ServantAsset | owned_servant_id、asset_id、role、revision | 游戏截图的头像/立绘与持有实例关联，不设官方外观编号，不作识别模板 |
| CorrectionRecord | id、entity_id、before_revision、after_revision、changes、confirmed_at | 名称、培养字段和素材修正的变更记录，支持检查版本后撤销 |
| Quest | id、region、external_key、name、variant、metadata | 关卡定义，可先手动建立 |
| CraftEssenceDefinition | id、region、catalog_key、name、rarity、cost、effects、data_version | 本地概念礼装条目，来自游戏识别/手工录入；效果可未知，不默认导入官方图鉴 |
| OwnedCraftEssence | id、account_id、definition_id、level、limit_break_stage、revision | 概念礼装持有实例，支持同名多份 |
| MysticCodeDefinition | id、region、catalog_key、name、skills、data_version | 本地御主礼装条目，来自游戏识别/手工录入；技能资料可未知 |
| OwnedMysticCode | id、account_id、definition_id、level、revision | 账号已拥有的御主礼装 |
| SupportSpec | id、mode、servant_definition_id、servant_state、craft_essence_spec、observed_at | mode 区分期望条件和已观察配置；不引用本地持有实例 |
| CostRule | id、region、version、master_level_limits、quest_overrides、source | 本地 COST 规则与可选等级上限映射；缺映射时使用手工确认上限，外部规则来源另议 |
| Team | id、account_id、name、owned_mystic_code_id、revision | 御主礼装为队伍级关联；草稿允许空 |
| TeamSlot | team_id、position、source_kind、owned_servant_id、support_spec_id、owned_craft_essence_id | 六槽位；区分 own/support/empty |
| TeamQuest | team_id、quest_id、notes | 多对多关联；零关联即不绑定 |
| CaptureSession | id、account_id、device_serial、status、started_at | 多页采集上下文 |
| Frame | id、session_id、path、captured_at、width、height、orientation、layout_version | 原始截图及坐标转换元数据 |
| RecognitionCandidate | id、session_id、payload、status、recognizer_version | 识别候选；确认前不修改正式档案 |
| BattleSession | id、account_id、device_serial、quest_id、team_id | 一次战斗的上下文，关联可空 |
| BattleSnapshot | id、battle_session_id、frame_id、observed_state、unknowns、schema_version | 可观察状态及未知信息 |
| Advice | id、snapshot_id、provider、steps、rationale、created_at | 建议与状态版本绑定 |

## 约束与合并

- 所有持有实例使用本地稳定 ID；名称、头像哈希和名称条目 ID 均不作持有实例唯一键。
- 技能唯一键为 (owned_servant_id, kind, slot)，队伍槽位唯一键为 (team_id, position)。
- TeamQuest 以 (team_id, quest_id) 去重。
- 自有槽位必须引用相同账号的持有实例；support 不引用 OwnedServant；empty 不携带从者引用。
- 队伍常规规则中同一持有实例不能占两个槽位；同名不同实例是否合法由区服/关卡规则决定。
- 自有概念礼装必须属于队伍账号；同一持有礼装实例在同队中不可重复装备。助战礼装仅存于 SupportSpec，不占用本地持有礼装。空槽位不绑定礼装，礼装须随从者槽位一起移动。
- 御主礼装须属于队伍账号，(account_id, definition_id) 唯一；换队不改变其账号级等级。
- COST 由当前队伍、账号上限和规则版本派生，不单独维护易过期的总数；缺少必要数据时返回 unknown。常规规则不计助战及其礼装、御主礼装费用。
- 期望助战不能当作已观察战况传给 Agent；观察配置记录时间，避免把旧配置视为当前状态。
- 礼装人工修正、识别冲突和删除引用遵循与从者相同的校对及引用保护规则。
- level 等数值先校验类型和基本范围，再按规则数据校验上限；未知值为 null，不代表 0。
- 宝具等级通常为 1–5、主动技能等级通常为 1–10、再临阶段通常为 0–4；特殊从者和未来规则由版本化规则处理。
- 再临阶段与当前展示外观分开；不能仅凭头像确定再临值。不同页面外观分别记录，不假定头像、立绘和战斗外观同步。
- 头像和立绘仅作为游戏截图素材，不维护外观模板库。素材哈希仅用于文件去重，不能作为身份或持有实例标识。
- 官方名称条目可同名；名称规范化只用于检索，保留原始文本。同名或近似候选由用户校准，名称表更新不静默改绑已确认档案。
- class、rarity、cost 等非名称资料来自游戏识别或人工录入，并通过 FieldEvidence 记录来源；未知保留 null。
- 改绑身份保留持有实例 ID，显示编队引用并标记旧培养字段待复核；不自动合并实例。素材替换与字段修正分别确认，撤销须检查 revision，保留被撤销记录引用的素材。
- 扫描缺失字段不清空已有字段；人工确认数据遇冲突进入待复核。
- 更新携带 revision，过期候选需重新比较，避免覆盖用户刚修改的数据。
- 跨页采集不可靠时让用户选择实例，不自动把相同名称条目归并。
- 删除被编队引用的持有实例应阻止并提示处理引用，或归档保留引用；不静默级联破坏队伍。

## 数据边界

区分四类数据：官方名称资料、玩家本地档案与规则、识别候选/证据、瞬时战况。默认本地保存。模型密钥放系统凭据存储或受管理配置，不作为业务表字段。协议载荷与识别结果包含 schema_version，迁移由宿主统一管理。
