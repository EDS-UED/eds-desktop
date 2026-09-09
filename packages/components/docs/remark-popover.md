# EgRemarkPopover · 批处理备注 Popover

批处理 Pass/Reject、Detail 内 Remark 等场景的 **仅备注** Popover（336×adaptive，placement=top）。

## 组件

| 导出 | 用途 |
|------|------|
| `EgRemarkPopover` | `EgAnchoredPopover` + TopTool（标题 + 关闭）+ 面板；fixed 336 |
| `EgRemarkPopoverPanel` | 面板内容：Combo 备注 + 确认；可单独嵌入已有 Popover 壳 |
| `REMARK_POPOVER_MAX_LENGTH` | 备注最大字数（256） |

## 面板结构

```
TopTool: Remark + Close
├─ EgComboTextarea（hideLabel：标题已在 TopTool）
│  ├─ EgTextarea：Paste / Clear（EDS 内置）
│  └─ EgFormSubmission type="notes"：Optional, Max. 256 characters
└─ EgButton decor solid md：Confirm（可 hideConfirm）
```

## 业务用法

**完整壳（推荐）**

```vue
<EgRemarkPopover
  v-model="remark"
  :title="ui('Remark')"
  :placeholder="ui('Please enter')"
  :feedback-text="ui('Optional, Max. 256 characters')"
  :confirm-label="ui('Confirm')"
  boundary-selector=".eds-data-list"
  @confirm="onConfirm"
>
  <template #trigger="{ active, onClick }">
    <EgButton … @click="onClick">{{ ui('Remark') }}</EgButton>
  </template>
</EgRemarkPopover>
```

**仅面板（已有 `EgAnchoredPopover` / 矿工费复合 Popover）**

```vue
<EgRemarkPopoverPanel
  v-model="remark"
  hide-label
  :label="ui('Remark')"
  :placeholder="ui('Please enter')"
  :feedback-text="ui('Optional, Max. 256 characters')"
  :confirm-label="ui('Confirm')"
  @confirm="onConfirm"
/>
```

## 默认与约束

- 宽度：`POPOVER_PRESET_WIDTH_BASE`（336px）
- 方向：`placement="top"`（箭头朝下，锚于 BatchBar / 按钮上方）
- `hideLabel: true`：TopTool 已展示标题，Combo 内 label 隐藏
- `resetOnMount` / `autofocus`：打开后清空并聚焦 textarea
- 文案 props 由业务 i18n 传入；EDS 仅提供英文 fallback

## Showcase

`/components/popovers` → 场景 **备注**。
