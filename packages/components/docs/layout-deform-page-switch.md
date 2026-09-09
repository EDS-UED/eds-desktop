# Layout Deform — Popover / Tooltip 多页切换

**场景：** 同一 Popover / Tooltip 内 A↔B 子页切换 — 固定宽度 + shell 高度 morph + 内容 crossfade（macOS Popover 风格）。

**不适用：**

| 场景 | 用 |
|------|-----|
| Detail 整页推动 | `.motion-page` + `motionPageTransition.css` |
| 浮层进出场 | `.motion-flotation` + microFloat |
| Tab 滑块形变 | `.motion-deform` |

---

## 原则

两层动画 **并行**（对齐 HTML demo）：

```text
┌─ shell：.motion-layout-deform ─────────────┐  height 350ms morph
│  overflow: hidden                         │
│  ┌─ content：.motion-layout-deform-content ┐  fade + translateY
│  │  单 wrapper · v-if 换子页              │
│  └────────────────────────────────────────┘
└───────────────────────────────────────────┘
```

**时序（锁死）：**

1. 点击 → **同时** shell 高度 morph + 内容 `.is-exiting`（`translateY(+offset)` + 淡出）
2. **120ms** → 换页（`activePage`）+ `.is-entering`（保持同一 `+offset`）
3. **下一帧 rAF** → 去掉 `.is-entering`，内容从 `+offset` 淡入到 `0`

内容位移 **始终是 `+offset → 0`**。禁止 to-smaller / to-larger 反向 transform（换页帧会跳 ~20px，视觉上「弹一下」）。

| 角色 | 允许 | 禁止 |
|------|------|------|
| **EDS** | token semantic + glue CSS + `useMotionLayoutDeformPageSwitch` | 在 semantic 写 `enter-from` / direction lifecycle |
| **业务** | 固定 shell 结构、测量高度、`switchTo`、class 全绑 | 自写 `<Transition>`、反向 transform、提前切 layout state |
| **Showcase** | Upload 临时 demo（`LayoutDeformDemoPreview.vue`） | 与 composable 混用 Transition |

---

## 业务用法（强制）

### 1. Composable

```ts
import {
  MOTION_LAYOUT_DEFORM_CONTENT,
  MOTION_LAYOUT_DEFORM_CONTENT_ENTERING,
  MOTION_LAYOUT_DEFORM_CONTENT_EXITING,
  useMotionLayoutDeformPageSwitch,
  type MotionLayoutDeformPageSpec,
} from '@eds/desktop-components';

const pageSpecs = reactive<Record<'list' | 'custom', MotionLayoutDeformPageSpec>>({
  list: { shellHeight: 400 },
  custom: { shellHeight: 360 },
});

const {
  activePage,
  shellHeight,
  contentExiting,
  contentEntering,
  switchTo,
} = useMotionLayoutDeformPageSwitch(pageSpecs, 'list');
```

### 2. 模板结构（锁死）

```vue
<div
  class="motion-layout-deform"
  :style="{ width: `${PANEL_W}px`, height: `${shellHeight}px` }"
>
  <div
    :class="[
      MOTION_LAYOUT_DEFORM_CONTENT,
      contentExiting && MOTION_LAYOUT_DEFORM_CONTENT_EXITING,
      contentEntering && MOTION_LAYOUT_DEFORM_CONTENT_ENTERING,
    ]"
  >
    <div v-if="activePage === 'list'">...</div>
    <div v-else>...</div>
  </div>
</div>
```

**四个 class 必须全绑：** `motion-layout-deform-content`、`is-exiting`、`is-entering`。只绑 `is-exiting` 会导致内容硬切 + shell 单独收缩 → 「弹一下」。

### 3. 子页高度 — 切换前量准

- 每页 `shellHeight` 来自 **真实 DOM**（`scrollHeight`），禁止写死猜值
- 目标页未 mount 时，用 **离屏预测量节点**（`visibility: hidden` + `clip-path: inset(100% 0 0 0)`）
- `switchTo(next)` **之前**更新 `pageSpecs[next].shellHeight`

参考：`work-cregis-desktop` → `ApprovalRemarkPopoverPanel.vue`（`minerFeeMeasureHost` + `listMeasureRef`）

### 4. 业务 layout 跟 `activePage` 走

子页相关的 `data-*`、`:has()` 样式、padding、标题栏、Teleport → 绑 **`activePage`**，不要绑「用户点击意图」的临时 state。

`switchTo` 后 **120ms** 才换页；提前改 layout 会在动画中途抖/弹。

```vue
<!-- ✅ -->
:data-screen="activePage"

<!-- ❌ 点击瞬间就切 -->
:data-screen="pendingScreen"
```

### 5. 只走 `switchTo(next)`

不要手动 `shellHeight` + `v-if` 两套逻辑；不要 `<Transition mode="out-in">` 与 composable 混用。

---

## Token / 常量

| 名称 | 值 | 含义 |
|------|-----|------|
| `--motion-recipe-layout-deform-shell` | 350ms | shell height morph |
| `--motion-recipe-layout-deform-content` | opacity 180ms + transform 350ms | 内容 crossfade |
| `--motion-offset-layout-deform-y` | 10px（`spacing-2-5`） | 位移量 |
| `--motion-delay-layout-deform-content-swap` | 120ms | 换页时机 |
| `MOTION_LAYOUT_DEFORM_CONTENT_SWAP_MS` | 120 | composable 默认 swap |

真源：`packages/tokens/spec/motion/{base,recipe,semantic}.json`  
Glue：`packages/components/src/styles/motionLayoutDeformTransition.css`  
Composable：`packages/components/src/atoms/motion-layout-deform/motionLayoutDeform.ts`

---

## 反模式

```vue
<!-- ❌ 漏 is-entering -->
:class="[MOTION_LAYOUT_DEFORM_CONTENT, contentExiting && MOTION_LAYOUT_DEFORM_CONTENT_EXITING]"

<!-- ❌ Vue Transition 替代 composable -->
<Transition name="motion-layout-deform" mode="out-in">

<!-- ❌ 点击瞬间切 layout（padding / 标题 / Teleport） -->
@click="pendingScreen = 'custom'; switchTo('custom')"
```

```ts
// ❌ 写死高度
switchTo('custom'); // pageSpecs.custom.shellHeight 仍是过时的 360

// ❌ 自写方向 transform
.is-exiting.to-smaller { transform: translateY(-10px) }
```

---

## 自检清单

- [ ] shell 有 `motion-layout-deform` + 动态 `height`（+ 固定 `width`）
- [ ] content wrapper 绑齐 `motion-layout-deform-content` / `is-exiting` / `is-entering`
- [ ] 各页高度已测量，`switchTo` 前更新 `pageSpecs`
- [ ] 子页 layout 样式绑 `activePage`，不提前切
- [ ] 未用 Vue `<Transition>` 替代 composable
- [ ] A→B、B→A 各测一次：无 Popover 整体上下跳、无内容硬切

---

## 参考文件

| 文件 | 说明 |
|------|------|
| `apps/showcase/.../LayoutDeformDemoPreview.vue` | EDS 标准最小 demo |
| `work-cregis-desktop/.../ApprovalRemarkPopoverPanel.vue` | 业务完整接入（预测量 + activePage） |
| `motionLayoutDeformTransition.css` | glue CSS |
| `motionLayoutDeform.ts` | composable |
