type TooltipAlign = 'start' | 'center' | 'end';

/** 主轴间距：tooltip --spacing-025；popover（wrap-tooltip=false）--spacing-05；交叉轴 inset：--spacing-2 */
export const SPACING_MAIN_AXIS = '--spacing-025';
export const SPACING_MAIN_AXIS_POPOVER = '--spacing-05';
export const SPACING_EDGE_INSET = '--spacing-2';
export const FALLBACK_MAIN_AXIS_PX = 1;
export const FALLBACK_MAIN_AXIS_POPOVER_PX = 2;
export const FALLBACK_EDGE_INSET_PX = 8;

/**
 * 探针 append → getComputedStyle → remove 会强制同步样式重算；浮层挂载时每实例两次，
 * 与 Vue 的 DOM 写入交替即布局抖动（EgDataList 满页时上百次整树重算）。
 *
 * 可按 document 缓存的前提：`--spacing-*` → `--scale-*` 只在 tokens 的 `:root` 声明，
 * 运行时无写入，`.desktopTokens` 子作用域不覆写，故全文档取值恒定。
 * 若将来允许按作用域覆写 scale/spacing，此缓存须改为按作用域键并提供失效入口。
 */
const tokenLengthCache = new WeakMap<Document, Map<string, number>>();

/** token 尚未生效时返回 null，交由调用方回退且不写缓存，避免把兜底值固化。 */
function probeCssTokenLength(el: HTMLElement, tokenName: string): number | null {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;padding-top:var(' +
    tokenName +
    ')';
  el.appendChild(probe);
  const px = Number.parseFloat(getComputedStyle(probe).paddingTop);
  el.removeChild(probe);
  return Number.isFinite(px) && px > 0 ? px : null;
}

export function readCssTokenLength(
  el: HTMLElement,
  tokenName: string,
  fallback: number,
): number {
  const doc = el.ownerDocument;
  let docCache = tokenLengthCache.get(doc);
  if (!docCache) {
    docCache = new Map();
    tokenLengthCache.set(doc, docCache);
  }

  const cached = docCache.get(tokenName);
  if (cached !== undefined) return cached;

  const px = probeCssTokenLength(el, tokenName);
  if (px == null) return fallback;

  docCache.set(tokenName, px);
  return px;
}

/** start 向左扩 spacing-2；end 向右扩 spacing-2；center 不偏移。 */
export function resolveCrossAxisOffsetFromAlign(
  align: TooltipAlign,
  edgeInsetPx: number,
): number {
  if (align === 'end') {
    return edgeInsetPx;
  }
  if (align === 'center') {
    return 0;
  }
  return -edgeInsetPx;
}
