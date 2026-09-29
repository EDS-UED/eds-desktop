import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from 'vue';
import type { FlotationWidthMode } from '../../molecules/flotation/Flotation.vue';
import { OVERFLOW_EPSILON } from '../../utils/overflowTextMeasure';

function readSpacingToken(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readTypographyToken(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || fallback;
}

/** 菜单项 EgFlotationMenuItem（body-medium + spacing-2 左右内边距）文案占位。 */
function measureMenuOptionWidth(
  label: string,
  root: HTMLElement,
  includeCheckbox: boolean,
): number {
  const rootStyle = getComputedStyle(root);
  const fontSize = readTypographyToken('--eds-body-medium-size', '13px');
  const fontWeight = readTypographyToken('--eds-body-medium-weight', '400');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  ctx.font = `${fontWeight} ${fontSize} ${rootStyle.fontFamily}`;
  const itemPaddingX = readSpacingToken('--spacing-2', 8) * 2;
  const listInset = readSpacingToken('--spacing-1', 4) * 2;
  const checkboxExtra = includeCheckbox
    ? readSpacingToken('--icon-md', 16) + readSpacingToken('--spacing-2', 8)
    : 0;
  return ctx.measureText(label).width + itemPaddingX + listInset + checkboxExtra;
}

export function useFilterPickerMenuWidthMode(options: {
  rootRef: Ref<HTMLElement | null>;
  optionLabels: ComputedRef<string[]>;
  /** 多选 Checkbox 行占位（默认 false）。 */
  includeCheckbox?: ComputedRef<boolean>;
}) {
  const menuWidthMode = ref<FlotationWidthMode>('trigger');

  const flotationWidthMode = computed(() => menuWidthMode.value);

  function resolveMenuWidthMode(): FlotationWidthMode {
    const root = options.rootRef.value;
    if (!root) return 'trigger';

    const trigger = root.querySelector('.eds-flotation-trigger') as HTMLElement | null;
    if (!trigger) return 'trigger';

    const triggerWidth = trigger.getBoundingClientRect().width;
    if (triggerWidth <= 0) return 'trigger';

    const edgeInset = readSpacingToken('--spacing-2', 8);
    const shellPadding = readSpacingToken('--spacing-1', 4);
    const listInset = readSpacingToken('--spacing-1', 4) * 2;
    /** trigger 模式下浮层宽 = 触发器 + 左右 cross-axis inset；内容区再扣 effect padding 与列表 inset。 */
    const menuContentWidth =
      triggerWidth + edgeInset * 2 - shellPadding * 2 - listInset;

    const includeCheckbox = options.includeCheckbox?.value ?? false;
    const maxOptionWidth = Math.max(
      0,
      ...options.optionLabels.value.map((label) =>
        measureMenuOptionWidth(label, root, includeCheckbox),
      ),
    );

    return maxOptionWidth > menuContentWidth + OVERFLOW_EPSILON ? 'adaptive' : 'trigger';
  }

  function syncMenuWidthMode() {
    menuWidthMode.value = resolveMenuWidthMode();
  }

  async function syncMenuWidthModeAfterLayout() {
    await nextTick();
    syncMenuWidthMode();
  }

  watch(
    [options.optionLabels, () => options.includeCheckbox?.value],
    () => {
      void syncMenuWidthModeAfterLayout();
    },
    { deep: true },
  );

  return {
    menuWidthMode,
    flotationWidthMode,
    syncMenuWidthMode,
    syncMenuWidthModeAfterLayout,
  };
}
