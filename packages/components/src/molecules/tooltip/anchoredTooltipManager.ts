type AnchoredTooltipCloseEntry = {
  close: () => void;
  /** false：click Popover 等；Batch Bar pointerenter 时不应关闭。 */
  dismissOnBarInteract: boolean;
  /** 当前浮层宿主（含嵌套 trigger 的面板 DOM）。 */
  getHostElement?: () => HTMLElement | null;
};

/** 登记 AnchoredTooltip 实例，便于批处理等场景一次性关闭 hover 浮层。 */
const closeHandlers = new Set<AnchoredTooltipCloseEntry>();

let openClickAnchoredTooltipCount = 0;

export type CloseAllAnchoredTooltipsOptions = {
  /** 不关闭「宿主包含该节点」的浮层（如 Filter 面板内的字段/运算符下拉）。 */
  exceptAncestorsOf?: HTMLElement | null;
};

export function registerAnchoredTooltipClose(
  handler: () => void,
  options?: { dismissOnBarInteract?: boolean; getHostElement?: () => HTMLElement | null },
): () => void {
  const entry: AnchoredTooltipCloseEntry = {
    close: handler,
    dismissOnBarInteract: options?.dismissOnBarInteract ?? true,
    getHostElement: options?.getHostElement,
  };
  closeHandlers.add(entry);
  return () => {
    closeHandlers.delete(entry);
  };
}

function shouldSkipCloseForExceptNode(
  entry: AnchoredTooltipCloseEntry,
  exceptNode: HTMLElement,
): boolean {
  const host = entry.getHostElement?.();
  if (!host) {
    return false;
  }
  if (host.contains(exceptNode)) {
    return true;
  }
  /** EgFilter 面板 + teleport 子 Flotation（币种 list / 多链级联等）不在同一 host 子树，但同属面板会话。 */
  if (
    host.querySelector('[data-eds-filter-panel]') &&
    exceptNode.closest('.eds-flotation-menu, .eds-flotation')
  ) {
    return true;
  }
  return false;
}

/** 关闭全部 AnchoredTooltip（含 click Popover）。 */
export function closeAllAnchoredTooltips(options?: CloseAllAnchoredTooltipsOptions): void {
  const exceptNode = options?.exceptAncestorsOf ?? null;
  closeHandlers.forEach((entry) => {
    if (exceptNode instanceof HTMLElement && shouldSkipCloseForExceptNode(entry, exceptNode)) {
      return;
    }
    entry.close();
  });
}

/**
 * 仅关闭会在 Batch Bar 上挡住点击的 hover/focus 浮层；
 * click Popover 须保持至取消 / 空白 / Esc。
 */
export function closeBarBlockingAnchoredTooltips(): void {
  closeHandlers.forEach((entry) => {
    if (entry.dismissOnBarInteract) {
      entry.close();
    }
  });
}

/** 是否有 click 触发的 AnchoredTooltip / Popover 正在打开。 */
export function hasOpenClickAnchoredTooltip(): boolean {
  return openClickAnchoredTooltipCount > 0;
}

export function setClickAnchoredTooltipOpen(open: boolean): void {
  if (open) {
    openClickAnchoredTooltipCount += 1;
    return;
  }
  openClickAnchoredTooltipCount = Math.max(0, openClickAnchoredTooltipCount - 1);
}
