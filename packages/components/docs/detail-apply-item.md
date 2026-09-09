# EgDetail · Apply_Item 变体契约

Figma：**Apply_Item@Cregis**（node `2267:11092`）

## 原则

Detail 内容区的标准行必须映射到 **Apply_Item 变体**。变体定义「这一行长什么样」——含 Title 图标、Value 符号、Tag、Link、Copy、地址簿、AML、区块浏览器等 **挂件**。

| 角色 | 允许 | 禁止 |
|------|------|------|
| **业务** | 选择变体 id；传入接口展示字段（`value`、`tag` 文案等） | 关闭/删除/替换挂件；手拼 `showValueCopy: false` 等「简化 UI」 |
| **EDS** | 维护变体 catalog 与 `EgDetail` 渲染 | 为单业务开 escape hatch（extra class、widget props） |
| **Showcase** | 文档演示；预设行仅切换「数据来源」 | 在 preset 路径 merge customize 挂件字段 |

非 catalog 行（完全自定义布局）仅用于 **例外**；须 PR 说明且不得作为常规列表详情实现。

## 业务用法（强制）

从 `@eds/desktop-components` 引入 **`createDetailApplyItemRow`**，不要手写字面量 `DetailItemData` 再改挂件字段。

```ts
import {
  createDetailApplyItemRow,
  type DetailApplyItemVariantId,
} from '@eds/desktop-components';

const rows = [
  createDetailApplyItemRow('crypto', {
    value: tokenSymbol,
    valueSymbolCrypto: tokenIcon,
    valueIcon: tokenIcon,
    tag: networkLabel,
  }),
  createDetailApplyItemRow('sender', {
    value: fromAddress,
    tag: fromAlias,
  }),
  createDetailApplyItemRow('receiver', {
    key: 'receiver',
    value: toAddress,
    tag: toAlias,
  }),
  createDetailApplyItemRow('status', {
    tag: statusLabel, // tagFamily / tagStatus 仍由变体锁死
  }),
];
```

### 可覆盖字段（仅此列表）

`key`、`title`、`value`、`tag`、`valueSymbolCrypto`、`valueIcon`、`valueSymbolAvatarName`

Sender / Receiver 多地址（Figma [2267:11822](https://www.figma.com/design/OkYrDmatUWtgw9n1uVHt6v/EverGreen-Design-System--Desktop-?node-id=2267-11822) / [2267:11830](https://www.figma.com/design/OkYrDmatUWtgw9n1uVHt6v/EverGreen-Design-System--Desktop-?node-id=2267-11830)）另可传：

`addressLayout`（`single` · `multi-collapsed` · `multi-expanded` · `multi-orders`）、`valueEntries`、`addressCount`、`addressViewMoreLabel`

- **multi-collapsed**：首行仅展示主地址；下方虚线分隔 + 独立一行 `addressViewMoreLabel` + `addressCount`（如 `Expand 16`）；点击触发 `itemValueLinkClick`。
- **multi-orders**：视觉同 multi-collapsed；链文案为 `{count} Orders`（如 `16 Orders`）；点击触发 `itemValueLinkClick`（业务可唤起自定义 Popup）。
- **multi-expanded**：主行下方展开其余地址；行间横虚线与 Tag 左缘对齐（2px 线段 / 2px 间距，`--stroke-base-quaternary`，0.5px）。
- `addressViewMoreLabel` 支持 `{count}` 占位；未写占位时自动拼接为 ``${label} ${addressCount}``。

其余字段（含 `showValueCopy`、`showValueLink`、`tagFamily`、`valueType`、`showValueSymbol` 等）**由变体决定**，传入会被 `createDetailApplyItemRow` 忽略（请只传上表字段）。

### 变体 id 一览

`crypto` · `initiated-by` · `status` · `sender` · `receiver` · `time` · `brand-number` · `tripartite-number` · `remark` · `memo` · `txid` · `text` · `fee` · `amount` · `type` · `reason` · `ip`

Catalog 真源：`packages/components/src/organisms/detail/applyItemPresets.ts`

## 反模式

```ts
// ❌ 手拼行并关掉 Copy
{ title: 'Sender', value: addr, showValueCopy: false }

// ❌ 从 preset  spread 后再改挂件
{ ...preset.item, showValueBrowser: false }

// ❌ 用 CSS 隐藏 EgIconButton / Tag
.itemRow .eds-icon-button { display: none }
```

```ts
// ✅ 只换变体 + 展示字段
createDetailApplyItemRow('sender', { value: addr, tag: name })
```

## Title 图标（section 级）

业务若需整块隐藏 Title 图标：对各行设 `showTitleIcon: false`（或在映射层统一 omit titleIcon），**不要**删变体定义。Value 挂件仍遵循变体。

## 新增变体

1. Figma Apply_Item 增变体并评审  
2. 更新 `applyItemPresets.ts`  
3. Showcase Detail 文档区自动含新数据来源（sync 后）  
4. 业务改用新 `DetailApplyItemVariantId`

## 相关

- 组件：`EgDetail` · `DetailItemData`  
- 项目约定：`.cursor/rules/work.mdc` §7 EgDetail · Apply_Item
