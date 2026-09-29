import { nextTick, type ComputedRef, type Ref } from 'vue';
import { readCssTokenLength } from '../../shared/cssSpacingTokens';

const SCROLL_SELECTED_CENTER_BIAS = '--spacing-4';
const FALLBACK_SCROLL_SELECTED_CENTER_BIAS_PX = 16;

export function useFilterSearchPickerScrollToSelected(options: {
  scrollRef: Ref<HTMLElement | null>;
  showSearchEmpty: ComputedRef<boolean>;
  resolveSelectedDomIndex: () => number;
  onScrolled?: () => void;
}) {
  function scrollSelectedToCenter() {
    const container = options.scrollRef.value;
    if (!container || options.showSearchEmpty.value) return;

    const targetIndex = options.resolveSelectedDomIndex();
    if (targetIndex < 0) return;

    const items = container.querySelectorAll('.eds-flotation-menu-item');
    const item = items[targetIndex] as HTMLElement | undefined;
    if (!item) return;

    const centerBiasPx = readCssTokenLength(
      container,
      SCROLL_SELECTED_CENTER_BIAS,
      FALLBACK_SCROLL_SELECTED_CENTER_BIAS_PX,
    );
    const targetScrollTop =
      item.offsetTop - (container.clientHeight - item.offsetHeight) / 2 - centerBiasPx;
    container.scrollTop = Math.max(0, targetScrollTop);
  }

  async function scheduleScrollSelectedToCenter() {
    await nextTick();
    scrollSelectedToCenter();
    requestAnimationFrame(() => {
      scrollSelectedToCenter();
      options.onScrolled?.();
    });
  }

  return {
    scrollSelectedToCenter,
    scheduleScrollSelectedToCenter,
  };
}

/** 多选列表首行「全部」占位时的选中项 DOM 索引。 */
export function resolveFilterPickerListSelectedDomIndex(options: {
  isMulti: boolean;
  optionsLength: number;
  selectedListIndex: number;
}): number {
  if (options.selectedListIndex < 0 || options.optionsLength <= 0) return -1;
  return options.isMulti ? options.selectedListIndex + 1 : options.selectedListIndex;
}
