# 06 术语与数据规则

## 骨架

指可复制到其他本地桌面工具的工程底座，包括 Shell、UI primitives、SQLite 数据层和测试配置。

## 示例记录

指 `example_records` 表中的演示实体。它只用于证明 repository、列表、详情和编辑流程，不代表真实业务对象。

字段：

- `id`
- `title`
- `summary`
- `status`
- `created_at`
- `updated_at`

## 状态

示例记录状态只包含：

- `active`
- `paused`
- `archived`

后续项目应替换为自己的业务枚举。
