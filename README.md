# EverGreen Design System (Desktop)

Vue 3 design system with CSS Modules, Figma-synced design tokens, and Showcase documentation.

| | |
|---|---|
| **GitHub** | [EDS-UED/eds-desktop](https://github.com/EDS-UED/eds-desktop) |
| **Live Showcase** | https://eds-ued.github.io/eds-desktop/ |
| **npm** | [`@eds-evergreen/desktop`](https://www.npmjs.com/package/@eds-evergreen/desktop)（当前 **0.1.8**） |

## Requirements

- Node.js 20+
- pnpm 9+

## Quick start

```bash
pnpm install
pnpm build:tokens
pnpm build:components
pnpm dev                # Showcase 预览站 → http://localhost:5177
pnpm dev:storybook      # Storybook → http://localhost:6006
```

## Project structure

```
eds-desktop/
├── packages/
│   ├── desktop/         # @eds-evergreen/desktop — **唯一对外发布的 npm 总包**
│   ├── tokens/          # 内部：tokens 构建产物（含 Tag Colorful / Custom 色板）
│   ├── animations/      # 内部：场景动画
│   ├── components/      # 内部：Vue 组件
│   ├── patterns/        # 内部：页面模式（持续扩展）
│   └── workflows/       # 内部：业务流程（持续扩展）
├── apps/
│   ├── showcase/        # Desktop 预览站（token + 组件画廊）→ GitHub Pages
│   └── storybook/       # 组件文档 + 设计规范（Storybook）
└── figma.config.json    # Figma file configuration
```

## Publish to npm (`@eds-evergreen/desktop`)

npm 组织：**eds-evergreen**

对外只发布 **一个包**，五根柱子通过 subpath 使用：

```bash
pnpm add @eds-evergreen/desktop vue
```

```ts
import '@eds-evergreen/desktop/tokens';
import '@eds-evergreen/desktop/components/style.css';
import { EgButton, EgTag } from '@eds-evergreen/desktop/components';
import { EgVerifyRingDots } from '@eds-evergreen/desktop/animations';
```

> **EgTag Colorful / Custom / Status** 依赖 Tag 色板 token（`spec/color/tag-palette.json` → `@eds-evergreen/desktop/tokens` 已包含；勿只引 color 子路径而漏 tag）。

维护者发布流程：

```bash
pnpm build:desktop
pnpm --filter @eds-evergreen/desktop publish --access public --no-git-checks
```

若 `~/.npmrc` 里配置了普通 token 且报 `EOTP`，先删掉 token 再走浏览器登录：

```bash
npm config delete //registry.npmjs.org/:_authToken
npm login --auth-type=web
pnpm --filter @eds-evergreen/desktop publish --access public --no-git-checks
```

详见 [packages/desktop/README.md](packages/desktop/README.md) 与 [docs/npm-desktop.md](docs/npm-desktop.md)。

## GitHub Pages（Showcase）

- **URL：** https://eds-ued.github.io/eds-desktop/
- **触发：** `main` 分支 push 自动部署（`.github/workflows/deploy-pages.yml`）
- **构建：** `pnpm build:tokens` → `build:animations` → `build:components` → `apps/showcase build:pages`
- 组织迁移至 [EDS-UED](https://github.com/EDS-UED/eds-desktop) 后，旧 `theyangsong.github.io` Pages URL 不再可用

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Showcase preview site |
| `pnpm dev:showcase` | Start Showcase preview site |
| `pnpm dev:storybook` | Start Storybook |
| `pnpm build` | Build unified `@eds-evergreen/desktop` package |
| `pnpm build:desktop` | Same as `build` |
| `pnpm publish:desktop` | Build and publish `@eds-evergreen/desktop` to npm |
| `pnpm build:tokens` | Build CSS variables from tokens |
| `pnpm build:components` | Build Vue component library |
| `pnpm sync:tokens` | Figma token sync helper |

## Figma integration

Linked file: [EverGreen Design System (Desktop)](https://www.figma.com/design/OkYrDmatUWtgw9n1uVHt6v/EverGreen-Design-System--Desktop-)

| Field | Value |
|-------|-------|
| fileKey | `OkYrDmatUWtgw9n1uVHt6v` |
| Variable collections | Color System, Scale System |

1. Open the Figma file above
2. Compare Figma variables with `packages/tokens/spec/*.json`
3. Update the relevant spec files
4. Run `pnpm build:tokens` to regenerate CSS variables

Check sync status: `pnpm sync:tokens`

## License

MIT
