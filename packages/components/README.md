# @eds/desktop-components

Vue 3 component library for EverGreen Design System (Desktop).

## Component encapsulation

Design System components follow a **closed implementation, limited extension** model:

> Except for slot content, which business apps may customize, all styles, structure, and interaction behavior are owned by the component library. Business apps must not override them.

### What business apps may change

| Area | Examples |
|------|----------|
| **Slot content** | Button label/icon, `EgInput` `#suffix` custom suffix |
| **Data & copy** | `v-model`, `placeholder`, `unit`, `maxLabel` |
| **Business logic** | Handlers for `@clear`, `@max`, `@focus`, `@blur` |
| **Design-system API** | Semantic props such as `size`, `type`, `variant`, `disabled` |

### What business apps must not change

| Area | Do not |
|------|--------|
| **Visual style** | Override padding, font size, color, radius, border via `class`, `style`, or outer CSS |
| **DOM structure** | Rearrange internal nodes (field / input / suffix, etc.) |
| **Interaction** | Reimplement focus, clear, disabled, or variant rules outside the component |
| **Escape hatches** | Add props like `inputClass`, `fieldStyle`, or pass arbitrary classes onto the root |

Business usage should look like this:

```vue
<EgInput v-model="value" size="lg" placeholder="请输入" />
```

Not like this:

```vue
<!-- Avoid: overriding component appearance from the outside -->
<EgInput v-model="value" class="my-custom-input" style="height: 40px" />
```

### Implementation rules (for contributors)

1. **Styles** — CSS Modules only; consume `@eds/desktop-tokens` variables; do not expose style-related props.
2. **Structure** — Template hierarchy matches Figma; keep internal markup stable across releases.
3. **Interaction** — State (default, focus, disabled, entering, etc.) is implemented inside the component.
4. **Props** — Use design semantics (`size="lg"`), not raw visual values (`height={48}`).
5. **Extension** — When customization is needed, add a **named slot** with a fixed insertion point instead of class/style props.
6. **Events** — Expose only business hooks (`update:modelValue`, `clear`, …); do not leak internal DOM for UI patching.
7. **Tokens** — Apps import `@eds/desktop-tokens` (or scoped wrappers in Showcase); components read token variables, they do not rely on app-level overrides.

### Reference: `EgInput`

- Styles live in `Input.module.css`; no `class` / `style` props on the public API.
- Focus, clearable visibility, and amount behavior are internal.
- Business selects behavior via semantic props: `size`, `type`, `unit`, `showMax`. `clearable` defaults to `true`; set `:clearable="false"` to disable the clear icon.
- `#suffix` is the extension point for custom suffix content; default clear / unit / Max remain component-owned.

### Reference: `EgButton`

- `tone` (`brand` | `danger` | `decor` | `subtle` | `sameWhite`), `variant` (`solid` | `outline` | `text`), `size` (`lg` | `md` | `sm` | `xs`), `disabled`, `loading`.
- Legacy aliases: `primary` → solid, `secondary` → outline, `ghost` → text.
- Default slot carries label; `#icon` slot for leading symbol.
- Button chrome (radius, hover/active/disabled/loading) is not customizable from outside.

### Reference: `EgIconButton`

- `shape` (`rectangular` | `square` | `round`), `size` (`lg` | `md` | `sm` | `xs`), `label` (required for `aria-label`), `disabled`.
- Default slot carries the icon; hover / active / focus use `event-hover`.
- Disabled uses `text-base-quaternary` on the icon; background stays transparent.

### Reference: `EgIconProButton`

- `label` (required), optional `showBadge` / `badge`, `showReddot`, `disabled`.
- Vertical icon + caption layout for toolbar-style actions.

### Reference: `EgLinkButton`

- `tone` (`brand` | `theme`), `size` (`lg` | `md` | `sm`), `href`, `disabled`.
- Default slot carries link text; hover matches default color, active uses secondary tone color.

### Reference: `EgPaginationGroupButton`

- `kind` (`number` | `symbol` | `button` | `borderArrow`), `tone` (`brand` | `decor`), `label` (number kind), `disabled`.
- Default slot carries icon for `symbol` / `button` / `borderArrow` kinds.

### Reference: `EgDetail` · Apply_Item

- Popup 内容区 organism；sections 传 `DetailSectionData[]`。
- **标准行**：`createDetailApplyItemRow(variantId, overrides)` — 变体 catalog 锁死挂件（Copy / Tag / Link / 符号等）；业务 **仅** 覆盖展示字段。
- **禁止** 手拼 `DetailItemData` 并关闭挂件或 CSS 隐藏。
- 详案：`docs/detail-apply-item.md` · Figma `2267:11092`。

### Showcase vs component

In the Website Showcase app, preview labels, group spacing, and demo layout are **documentation UI**, not part of the component API. Only the component instances inside `.desktopTokens` use Desktop tokens and component styles.

## Development

```bash
pnpm build:components   # from repo root
pnpm typecheck          # in this package
```

## Dependencies

- `vue` ^3.5 (peer)
- `@eds/desktop-tokens` — design tokens (loaded by the host app, not bundled into component CSS)
