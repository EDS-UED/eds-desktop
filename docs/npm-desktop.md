# EverGreen Desktop 使用指南

> **npm 包：** [`@eds-evergreen/desktop`](https://www.npmjs.com/package/@eds-evergreen/desktop)  
> **在线文档：** [Showcase 预览站](https://eds-ued.github.io/eds-desktop/)  
> **适用版本：** `0.1.5` 起（EgIcon 线稿描边 Chrome 兼容：`--eds-icon-stroke-user` 反算；详见 `packages/components/docs/icon-stroke-scaling.md`）

EverGreen Desktop 是一套面向 **Vue 3 桌面端** 的设计系统，包含设计 Token、场景动画、UI 组件等能力。对外以 **一个 npm 包** 发布，通过 **子路径（subpath）** 按需引用。

---

## 目录

- [环境要求](#环境要求)
- [安装](#安装)
- [5 分钟上手](#5-分钟上手)
- [入口配置（必做）](#入口配置必做)
- [使用组件](#使用组件)
- [使用动画](#使用动画)
- [设计 Token](#设计-token)
- [主题（浅色 / 深色）](#主题浅色--深色)
- [包结构与子路径](#包结构与子路径)
- [TypeScript](#typescript)
- [从零创建项目](#从零创建项目)
- [常见问题](#常见问题)
- [版本更新](#版本更新)

---

## 环境要求

| 项 | 要求 |
|----|------|
| **Vue** | `^3.5.0`（peer dependency，需自行安装） |
| **Node.js** | 建议 20+ |
| **包管理器** | pnpm / npm / yarn 均可 |
| **构建工具** | Vite、Webpack、Nuxt 等标准 Vue 3 工具链 |

> 不需要 clone `eds-desktop` 仓库，也不需要本地 build 设计系统源码。

---

## 安装

```bash
pnpm add @eds-evergreen/desktop vue
```

或使用 npm / yarn：

```bash
npm install @eds-evergreen/desktop vue
# yarn add @eds-evergreen/desktop vue
```

---

## 5 分钟上手

**1. 安装依赖**（见上）

**2. 在应用入口引入样式**

```ts
// main.ts
import '@eds-evergreen/desktop/tokens';
import '@eds-evergreen/desktop/components/style.css';
import '@eds-evergreen/desktop/animations/style.css';
```

**3. 在组件中按需 import**

```vue
<script setup lang="ts">
import { EgButton, EgInput } from '@eds-evergreen/desktop/components';
import { EgVerifyRingDots } from '@eds-evergreen/desktop/animations';
</script>

<template>
  <EgButton variant="primary">确认</EgButton>
  <EgInput placeholder="请输入" />
  <EgVerifyRingDots tone="brand" :active="true" />
</template>
```

完成。启动 dev server 即可看到带完整样式的组件。

---

## 入口配置（必做）

在 `main.ts`（或应用根布局）中 **至少** 引入以下三行 CSS：

```ts
import '@eds-evergreen/desktop/tokens';                 // 颜色、尺寸、字体、动效等 CSS 变量
import '@eds-evergreen/desktop/components/style.css';   // 组件样式
import '@eds-evergreen/desktop/animations/style.css';   // 场景动画样式
```

| 引入项 | 作用 | 是否必须 |
|--------|------|----------|
| `tokens` | 全局设计 Token（CSS 变量） | ✅ 必须 |
| `components/style.css` | 组件视觉样式 | ✅ 使用组件时必须 |
| `animations/style.css` | 动画组件样式 | 使用动画时必须 |

> 只使用 Token、不用组件时，可只引 `tokens`。

---

## 使用组件

### 导入方式

组件统一从子路径 `@eds-evergreen/desktop/components` 按需导入：

```ts
import {
  EgButton,
  EgInput,
  EgDialog,
  EgTag,
  EgCheckbox,
  // … 更多组件见 Showcase
} from '@eds-evergreen/desktop/components';
```

### 命名约定

- 所有组件以 **`Eg`** 前缀命名（如 `EgButton`、`EgDialog`）
- 使用 **PascalCase**，与 Showcase 文档一致

### 示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { EgButton, EgDialog } from '@eds-evergreen/desktop/components';

const open = ref(false);
</script>

<template>
  <EgButton @click="open = true">打开对话框</EgButton>

  <EgDialog v-model:open="open" title="提示">
    这是一段说明文字。
  </EgDialog>
</template>
```

### 组件文档

完整组件列表、Props、交互示例请查看在线 Showcase：

**https://eds-ued.github.io/eds-desktop/**

导航结构：

- **Tokens** — 设计变量
- **Animations** — 场景动画
- **Components** — UI 组件（Atoms / Molecules / Organisms / Templates）
- **Patterns** — 页面级组合（持续扩展）
- **Workflows** — 业务工作流（持续扩展）

---

## 使用动画

动画组件从 `@eds-evergreen/desktop/animations` 导入：

```ts
import {
  EgVerifyRingDots,    // 校验环点阵
  EgDoneTick,          // 完成勾选
  EgMotionProcessing,  // 处理中旋转
  EgRipplePulse,       // 波纹脉冲
  EgMnemonicVerify,    // 助记词校验波
} from '@eds-evergreen/desktop/animations';
```

### 示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { EgVerifyRingDots } from '@eds-evergreen/desktop/animations';

const active = ref(true);
</script>

<template>
  <EgVerifyRingDots :active="active" tone="brand" />
</template>
```

> 记得在入口引入 `@eds-evergreen/desktop/animations/style.css`。

---

## 设计 Token

### 全套引入（推荐）

```ts
import '@eds-evergreen/desktop/tokens';
```

一次加载颜色、尺寸、字体（EDS Text + IBM Plex Mono）、排版、动效、效果等全部 Token。

> `@eds/desktop-tokens` 已内置 `@font-face`（通过 `typography/index.css` → `fonts.css`），**无需**再单独 `import '…/tokens/fonts'`，除非只要字体文件。

**字体标准**

| 用途 | Token | 栈 |
|------|-------|-----|
| UI 正文 | `--eds-family-sans` | EDS Text, PingFang SC, SourceHanSansSC, Apple Color Emoji, Segoe UI Emoji |
| 代码 / 等宽 | `--eds-family-mono` | IBM Plex Mono, ui-monospace, monospace |

全局默认（`typography/global.css`）：`body, input, textarea, button` → `--eds-family-sans` + `text-rendering: geometricPrecision`。  
代码元素（`code, pre, kbd, samp, .eds-code-text`）→ `--eds-family-mono`。

### 按需引入

```ts
// 颜色主题
import '@eds-evergreen/desktop/tokens/color/light';
import '@eds-evergreen/desktop/tokens/color/dark';

// 动效
import '@eds-evergreen/desktop/tokens/motion';
import '@eds-evergreen/desktop/tokens/motion/base';
import '@eds-evergreen/desktop/tokens/motion/recipe';
import '@eds-evergreen/desktop/tokens/motion/semantic';

// 效果（毛玻璃等）
import '@eds-evergreen/desktop/tokens/effect/ready';

// 字体 — 已含于 tokens 主入口；仅需字体时可单独引：
// import '@eds-evergreen/desktop/tokens/fonts';

// 尺寸 / 排版
import '@eds-evergreen/desktop/tokens/scale';
import '@eds-evergreen/desktop/tokens/typography';
```

### JS 工具

```ts
import { initCornerSmoothing } from '@eds-evergreen/desktop/tokens/corner-smoothing';
import liquidGlass from '@eds-evergreen/desktop/tokens/liquid-glass';

// 圆角平滑（Figma squircle）
initCornerSmoothing();
```

### Token JSON

```ts
import tokens from '@eds-evergreen/desktop/tokens/json';
// tokens 为设计 Token 的 JSON 快照
```

### 在 CSS 中使用

**Text Styles（推荐）** — Figma 角色整组排版，类名与 `spec/text/styles.json` 一致；已随 `@eds/desktop-tokens` / `typography` 主入口加载，亦可单独引 `@eds/desktop-tokens/text/styles`：

```html
<p class="typography-body-medium">正文</p>
```

```css
/* CSS Modules */
.label {
  composes: typography-body-medium from global;
}
```

**Semantic 变量** — 仅需单轴覆盖时使用：

```css
.my-card {
  background: var(--color-surface-elevated);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  font-size: var(--eds-body-medium-size);
  line-height: var(--eds-body-medium-line-height);
}
```

旧写法（三行 size/weight/line-height）仍可用，新代码请优先 `.typography-*` 类。

变量名以 Showcase **Tokens** 页为准。

---

## 主题（浅色 / 深色）

### 方式一：HTML 属性

在根元素设置 `data-theme`：

```html
<html data-theme="light">
<!-- 或 -->
<html data-theme="dark">
```

配合引入对应颜色 Token：

```ts
import '@eds-evergreen/desktop/tokens/color/light';
// 或
import '@eds-evergreen/desktop/tokens/color/dark';
```

若使用全套 `import '@eds-evergreen/desktop/tokens'`，通常已包含主题切换所需变量。

### 方式二：组件库提供的 API

```ts
import {
  applyTheme,
  getPreferredTheme,
  toggleTheme,
  initThemeProvider,
  useThemeProvider,
} from '@eds-evergreen/desktop/components';

// 应用启动时
initThemeProvider(); // 读取系统偏好或已有 data-theme

// 或在组件内
const { theme, setTheme, toggleTheme } = useThemeProvider();
setTheme('dark');
```

---

## 包结构与子路径

`@eds-evergreen/desktop` 是 **伞形总包**，内部按五根柱子组织：

| 子路径 | 内容 | 典型 import |
|--------|------|-------------|
| `@eds-evergreen/desktop/tokens` | 设计 Token（CSS） | `import '@eds-evergreen/desktop/tokens'` |
| `@eds-evergreen/desktop/animations` | 场景动画（Vue） | `import { EgVerifyRingDots } from '…/animations'` |
| `@eds-evergreen/desktop/components` | UI 组件（Vue） | `import { EgButton } from '…/components'` |
| `@eds-evergreen/desktop/patterns` | 页面级组合 | 持续扩展 |
| `@eds-evergreen/desktop/workflows` | 业务工作流 | 持续扩展 |

### 完整 Token 子路径一览

```
@eds-evergreen/desktop/tokens              # 全套
@eds-evergreen/desktop/tokens/color
@eds-evergreen/desktop/tokens/color/light
@eds-evergreen/desktop/tokens/color/dark
@eds-evergreen/desktop/tokens/scale
@eds-evergreen/desktop/tokens/typography
@eds-evergreen/desktop/tokens/motion
@eds-evergreen/desktop/tokens/effect
@eds-evergreen/desktop/tokens/tag
@eds-evergreen/desktop/tokens/fonts
@eds-evergreen/desktop/tokens/corner-smoothing   # JS
@eds-evergreen/desktop/tokens/liquid-glass       # JS
@eds-evergreen/desktop/tokens/json               # JSON
```

### 样式子路径

```
@eds-evergreen/desktop/components/style.css
@eds-evergreen/desktop/animations/style.css
```

---

## TypeScript

包内置 `.d.ts` 类型声明，**无需额外安装 `@types`**。

```ts
import type { ThemeMode } from '@eds-evergreen/desktop/components';
```

确保 `tsconfig.json` 启用模块解析：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vite/client"]
  }
}
```

---

## 从零创建项目

以 **Vite + Vue + TypeScript** 为例：

```bash
pnpm create vite my-evergreen-app --template vue-ts
cd my-evergreen-app
pnpm install
pnpm add @eds-evergreen/desktop vue
```

编辑 `src/main.ts`：

```ts
import { createApp } from 'vue';
import App from './App.vue';

import '@eds-evergreen/desktop/tokens';
import '@eds-evergreen/desktop/components/style.css';
import '@eds-evergreen/desktop/animations/style.css';

createApp(App).mount('#app');
```

编辑 `src/App.vue`：

```vue
<script setup lang="ts">
import { EgButton } from '@eds-evergreen/desktop/components';
</script>

<template>
  <EgButton variant="primary">Hello EverGreen</EgButton>
</template>
```

```bash
pnpm dev
```

---

## 常见问题

### 组件没有样式 / 看起来像裸 HTML

**原因：** 未在入口引入 CSS。

**解决：** 确认 `main.ts` 中有：

```ts
import '@eds-evergreen/desktop/tokens';
import '@eds-evergreen/desktop/components/style.css';
```

### 动画不显示或样式错乱

**原因：** 未引入动画样式。

**解决：**

```ts
import '@eds-evergreen/desktop/animations/style.css';
```

### 颜色 / 间距变量未生效

**原因：** 未引入 Token，或自定义 CSS 在 Token 之前加载。

**解决：** 将 `import '@eds-evergreen/desktop/tokens'` 放在入口文件 **最前面**。

### Vite 需要配置 alias 吗？

**不需要。** npm 包通过 `package.json` 的 `exports` 字段映射子路径，Vite / Webpack 5+ 开箱即用。

### 和 `link:` 本地开发有什么区别？

| 方式 | 适用场景 |
|------|----------|
| **npm 安装** | 外部项目、生产依赖、团队协作 |
| **`link:` 本地路径** | 设计系统维护者与 consumer 联调（仅 eds-desktop 维护者使用） |

外部使用者 **只需 npm 安装**，不要配置 `link:`。

### Peer dependency 警告

请确保项目已安装 `vue@^3.5.0`：

```bash
pnpm add vue@^3.5.0
```

---

## 版本更新

查看当前最新版本：

```bash
npm view @eds-evergreen/desktop version
```

升级到最新版：

```bash
pnpm update @eds-evergreen/desktop
# 或指定版本
pnpm add @eds-evergreen/desktop@0.1.1
```

升级后若样式异常，先确认入口 CSS import 未变，再对照 [Showcase](https://eds-ued.github.io/eds-desktop/) 变更说明。

---

## 快速参考卡片

```bash
# 安装
pnpm add @eds-evergreen/desktop vue
```

```ts
// main.ts — 三行 CSS
import '@eds-evergreen/desktop/tokens';
import '@eds-evergreen/desktop/components/style.css';
import '@eds-evergreen/desktop/animations/style.css';
```

```vue
<!-- 任意 .vue -->
<script setup lang="ts">
import { EgButton } from '@eds-evergreen/desktop/components';
import { EgVerifyRingDots } from '@eds-evergreen/desktop/animations';
</script>
```

---

## 链接

| 资源 | 地址 |
|------|------|
| npm 包 | https://www.npmjs.com/package/@eds-evergreen/desktop |
| 在线 Showcase | https://eds-ued.github.io/eds-desktop/ |
| 源码仓库 | https://github.com/EDS-UED/eds-desktop |

---

**License:** MIT · **Organization:** [eds-evergreen](https://www.npmjs.com/org/eds-evergreen)
