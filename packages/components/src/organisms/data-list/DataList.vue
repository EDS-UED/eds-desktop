<script setup lang="ts">
import {
  computed,
  defineComponent,
  Fragment,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
  type ComponentPublicInstance,
  type VNode,
} from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgBatchBar } from '../batch-bar';
import DataListHeaderCell from './DataListHeaderCell.vue';
import DataListColumn from './DataListColumn.vue';
import styles from './DataList.module.css';
import type {
  DataListBatchAction,
  DataListBatchActionResult,
  DataListItem,
  DataListPrimaryAction,
  DataListRowAction,
  DataListSelectAllMode,
} from './types';
import {
  getVisibleColumnSlotIndices,
  resolveColumnMinWidthPx,
  DATA_LIST_FLEX_RESERVE_PX,
} from './useResponsiveColumns';
import { useVirtualRows } from './useVirtualRows';
import { SKID_AFFECTING_MAIN_KEY } from '../../shared/skidContext';
import {
  closeAllAnchoredTooltips,
  closeBarBlockingAnchoredTooltips,
  hasOpenClickAnchoredTooltip,
} from '../../molecules/tooltip/anchoredTooltipManager';
import type { PopoverWidthMode } from '../../molecules/popovers';

const RenderVNodes = defineComponent({
  name: 'EgDataListRenderVNodes',
  props: {
    nodes: { type: null, required: false, default: null },
  },
  setup(props) {
    return () => props.nodes as VNode | VNode[] | null;
  },
});

defineOptions({ name: 'EgDataList' });

const LOADING_BAR_HEIGHT = 28;
const LOADING_DONE_VISIBLE_MS = 1500;
const LOADING_TRANSITION_MS = 300;
const SELECT_COLUMN_WIDTH = 40;
const SELECT_COLUMN_ANIM_MS = 300;
const SELECT_CONTENT_SLIDE_PX = 16;
const RESIZE_DEBOUNCE_MS = 100;
const SCROLL_EDGE_EPSILON = 2;

const props = withDefaults(
  defineProps<{
    maxHeight?: string;
    headerHeight?: number;
    headerBg?: string;
    columnHeight?: number;
    loading?: boolean;
    initing?: boolean;
    selectMode?: boolean;
    dataList?: DataListItem[];
    emptyText?: string;
    initingText?: string;
    skidOpen?: boolean;
    batchActions?: DataListBatchAction[];
    onBatchAction?: (
      key: string,
      rows: Array<DataListItem & { _index: number }>,
    ) => void | DataListBatchActionResult | Promise<void | DataListBatchActionResult>;
    /** Popover 批操作项：点击后、开层前的准备逻辑（失败则不打开 Popover）。 */
    onBatchLabelBeforeOpen?: (
      key: string,
      rows: Array<DataListItem & { _index: number }>,
    ) => void | Promise<void>;
    /** BatchBar Label Popover 面板宽度模式（如批处理 Remark fixed 256）。 */
    batchPopoverWidthMode?: PopoverWidthMode;
    /** widthMode=fixed 时面板区宽度（px）。 */
    batchPopoverWidth?: number;
    /** placement=top 时 Popover 顶部工具条（如批处理 Remark）。 */
    batchPopoverTopTool?: boolean;
    batchPopoverTopToolTitle?: string;
    batchPopoverTopToolClosable?: boolean;
    /** BatchBar 统计后缀（如 selected / 已选择）。 */
    batchCountSuffix?: string;
    primaryAction?: DataListPrimaryAction;
    moreActions?: DataListRowAction[];
  }>(),
  {
    headerHeight: 32,
    columnHeight: 66,
    loading: false,
    initing: false,
    dataList: () => [],
    emptyText: 'No data',
    initingText: 'Loading',
    skidOpen: false,
    batchActions: () => [],
    batchCountSuffix: 'selected',
    moreActions: () => [],
  },
);

const emit = defineEmits<{
  'row-click': [row: DataListItem];
  'update:select-mode': [enabled: boolean];
  'update:selected-list': [rows: Array<DataListItem & { _index: number }>];
  'selected-change': [rows: Array<DataListItem & { _index: number }>];
  'update:pagination-locked': [locked: boolean];
  'batch-action': [key: string, rows: Array<DataListItem & { _index: number }>];
  'batch-error': [message: string];
  'batch-popover-dismiss': [label: string, index: number];
  'primary-action': [row: DataListItem, rowIndex: number];
  'more-action': [key: string, row: DataListItem, rowIndex: number];
}>();

const slots = useSlots() as {
  default?: () => VNode[];
  operation?: () => VNode[];
};

const layoutSkidAffecting = inject(SKID_AFFECTING_MAIN_KEY, null);
const effectiveSkidOpen = computed(() =>
  Boolean(layoutSkidAffecting?.value || props.skidOpen),
);

const tableWrapperRef = ref<HTMLElement | null>(null);
const tableContentRef = ref<HTMLElement | null>(null);
const headerCellRefs = ref<Array<{ resetSort?: () => void } | null>>([]);
const size = ref({ width: 0, height: 0 });
const clientViewportWidth = ref(
  typeof document !== 'undefined' ? document.documentElement.clientWidth : 0,
);
const tableKey = ref(0);
const selectMode = ref(false);
const selectAnimating = ref(false);
const dataColumnWidthsFullPx = ref<number[]>([]);
const selectedList = ref<Array<DataListItem & { _index: number }>>([]);
// 退出多选时 selectedList 立即清空以通知消费方，渲染层则沿用这份快照直到收起动画结束；
// 否则勾选态与计数会在收起的第一帧被抹掉，而展开并没有对应的瞬时内容变化。
const selectionExitSnapshot = ref<Array<DataListItem & { _index: number }> | null>(null);
const renderedSelectedList = computed(
  () => selectionExitSnapshot.value ?? selectedList.value,
);
const scrollTop = ref(0);
const batchLoadingKey = ref<string | null>(null);
let resizeDebounceTimer: ReturnType<typeof setTimeout> | undefined;
let selectionExitSnapshotTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.selectMode,
  (enabled) => {
    if (enabled === undefined || enabled === selectMode.value) return;
    selectMode.value = enabled;
    if (!enabled) {
      selectionExitSnapshot.value = selectedList.value;
      selectedList.value = [];
    }
  },
  { immediate: true },
);

watch(selectMode, (enabled) => {
  emit('update:pagination-locked', enabled);
  syncColumnWidthSnapshots();
  startSelectLayoutTransition();
  if (enabled) {
    closeAllAnchoredTooltips();
    if (selectionExitSnapshotTimer !== undefined) {
      clearTimeout(selectionExitSnapshotTimer);
      selectionExitSnapshotTimer = undefined;
    }
    selectionExitSnapshot.value = null;
    return;
  }

  selectionExitSnapshotTimer = window.setTimeout(() => {
    selectionExitSnapshot.value = null;
    selectionExitSnapshotTimer = undefined;
  }, SELECT_COLUMN_ANIM_MS);
}, { flush: 'post' });

const selectContentOpacity = computed(() => selectMode.value ? 1 : 0);
const selectContentTranslateX = computed(() =>
  `${selectMode.value ? 0 : -SELECT_CONTENT_SLIDE_PX}px`,
);

const headerHeightCss = computed(() => `${props.headerHeight}px`);

watch(
  () => props.dataList,
  () => {
    selectionExitSnapshot.value = null;
    selectedList.value = [];
  },
  { immediate: true },
);

const showIniting = ref(false);
let initingTimer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => props.initing,
  (value) => {
    if (value) {
      tableContentRef.value?.scrollTo({ top: 0, behavior: 'instant' });
      initingTimer = window.setTimeout(() => {
        showIniting.value = true;
      }, 500);
    } else {
      if (initingTimer !== undefined) clearTimeout(initingTimer);
      showIniting.value = false;
    }
  },
  { immediate: true },
);

const showLoadingBar = ref(false);
const loadingBarExpanded = ref(false);
const loadingBarLeaving = ref(false);
const loadingDoneIcon = ref(false);
let loadingTimer: ReturnType<typeof setTimeout> | undefined;
let loadingLeaveTimer: ReturnType<typeof setTimeout> | undefined;

function clearLoadingLeaveTimer() {
  if (loadingLeaveTimer !== undefined) {
    clearTimeout(loadingLeaveTimer);
    loadingLeaveTimer = undefined;
  }
}

function finishLoadingBarLeave() {
  clearLoadingLeaveTimer();
  showLoadingBar.value = false;
  loadingBarExpanded.value = false;
  loadingBarLeaving.value = false;
  loadingDoneIcon.value = false;
}

function startLoadingBarLeave() {
  clearLoadingLeaveTimer();
  loadingBarLeaving.value = true;
  loadingBarExpanded.value = false;
  loadingLeaveTimer = window.setTimeout(finishLoadingBarLeave, LOADING_TRANSITION_MS);
}

watch(
  () => props.loading,
  async (value, wasLoading) => {
    if (value) {
      if (loadingTimer !== undefined) clearTimeout(loadingTimer);
      clearLoadingLeaveTimer();
      tableContentRef.value?.scrollTo({ top: 0, behavior: 'instant' });
      loadingDoneIcon.value = false;
      loadingBarLeaving.value = false;
      showLoadingBar.value = true;
      loadingBarExpanded.value = false;
      await nextTick();
      loadingBarExpanded.value = true;
      return;
    }

    if (!wasLoading) return;

    tableContentRef.value?.scrollTo({ top: 0, behavior: 'instant' });
    loadingDoneIcon.value = true;
    loadingTimer = window.setTimeout(() => {
      loadingTimer = undefined;
      startLoadingBarLeave();
    }, LOADING_DONE_VISIBLE_MS);
  },
  { immediate: true },
);

const loadingBarHeight = computed(() => (showLoadingBar.value ? LOADING_BAR_HEIGHT : 0));

const ROW_GAP_PX = 1;

const listBodyLayout = computed(() => {
  const available = Math.max(0, size.value.height - props.headerHeight);
  const dataCount = props.dataList.length;
  const loadingH = loadingBarHeight.value;
  const dataH = dataCount * props.columnHeight;
  const rowGaps =
    dataCount > 0
      ? (loadingH > 0 ? dataCount + 1 : dataCount) * ROW_GAP_PX
      : 0;
  let contentHeight = loadingH + dataH + rowGaps;
  let overflows = available > 0 && contentHeight > available;

  let blankCount = 0;
  if (!overflows && dataCount > 0 && available > contentHeight) {
    let slack = available - contentHeight;
    while (slack >= props.columnHeight + ROW_GAP_PX) {
      blankCount += 1;
      contentHeight += props.columnHeight + ROW_GAP_PX;
      slack -= props.columnHeight + ROW_GAP_PX;
    }
  }

  return { available, contentHeight, overflows, blankCount };
});

const loadingRowStyle = computed(() => ({
  width: `${size.value.width}px`,
}));

const isScrollLocked = computed(() => props.loading || props.initing);

const rowHeightRef = computed(() => props.columnHeight);
const rowCountRef = computed(() => props.dataList.length);
const viewportHeightRef = computed(() =>
  Math.max(0, size.value.height - props.headerHeight),
);

const virtualRows = useVirtualRows({
  rowCount: rowCountRef,
  rowHeight: rowHeightRef,
  scrollTop,
  viewportHeight: viewportHeightRef,
});

const renderedRowIndices = computed(() => virtualRows.visibleRowIndices.value);

const showVirtualTopSpacer = computed(
  () => virtualRows.enabled.value && virtualRows.topSpacerPx.value > 0,
);

const showVirtualBottomSpacer = computed(
  () => virtualRows.enabled.value && virtualRows.bottomSpacerPx.value > 0,
);

const virtualTopSpacerPx = computed(() => virtualRows.topSpacerPx.value);

const virtualBottomSpacerPx = computed(() => virtualRows.bottomSpacerPx.value);

const blankRowCount = computed(() =>
  virtualRows.enabled.value ? 0 : listBodyLayout.value.blankCount,
);

const batchActionLabels = computed(() => props.batchActions.map((action) => action.label));

const batchActionDanger = computed(() => props.batchActions.map((action) => Boolean(action.danger)));

const batchActionPopover = computed(() => props.batchActions.map((action) => Boolean(action.popover)));

const batchActionPopoverTitles = computed(() =>
  props.batchActions.map(
    (action) => action.popoverTitle ?? props.batchPopoverTopToolTitle ?? '',
  ),
);

const batchLoadingLabelIndex = computed(() => {
  const key = batchLoadingKey.value;
  if (!key) return null;
  const index = props.batchActions.findIndex((action) => action.key === key);
  return index >= 0 ? index : null;
});

const useBuiltinBatchBar = computed(
  () => props.batchActions.length > 0 && !slots.operation,
);

const needsVerticalScroll = computed(
  () => virtualRows.enabled.value || listBodyLayout.value.overflows,
);

function readProp(propsBag: Record<string, unknown> | null | undefined, key: string, fallback?: unknown) {
  if (!propsBag) return fallback;
  if (Object.prototype.hasOwnProperty.call(propsBag, key)) return propsBag[key];
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (Object.prototype.hasOwnProperty.call(propsBag, kebab)) return propsBag[kebab];
  return fallback;
}

/** Vue boolean attr：`is-action` 无值时为 `''`。 */
function isPresentAttr(value: unknown): boolean {
  return value === true || value === '';
}

/**
 * 操作列须显式 `is-action`。
 * 未标记时：仅当 DataList 传入 primaryAction，才把最后一列视为操作列。
 * 避免记录类列表的尾列（状态等）被误当成 Action。
 */
function columnIsAction(
  propsBag: Record<string, unknown>,
  isLast: boolean,
  hasPrimaryAction: boolean,
): boolean {
  if (isPresentAttr(readProp(propsBag, 'isAction'))) return true;
  return isLast && hasPrimaryAction;
}

function columnTypeName(node: VNode): string | undefined {
  const type = node.type as { name?: string; __name?: string } | string | null | undefined;
  if (type == null || typeof type === 'string') return undefined;
  return type.name || type.__name;
}

function isDataListColumnVNode(node: VNode): boolean {
  const name = columnTypeName(node);
  return name === 'EgDataListColumn' || name === 'TableListColumn';
}

function flattenSlotVNodes(nodes: VNode[] | undefined): VNode[] {
  if (!nodes?.length) return [];
  const out: VNode[] = [];
  for (const node of nodes) {
    if (node.type === Fragment && Array.isArray(node.children)) {
      out.push(...flattenSlotVNodes(node.children as VNode[]));
      continue;
    }
    out.push(node);
  }
  return out;
}

function columnVNodes(): VNode[] {
  return flattenSlotVNodes(slots.default?.() || []).filter(
    (node) => isDataListColumnVNode(node) && node.props?.hidden !== true && node.props?.hidden !== '',
  );
}

const allColumnNodes = computed(() => columnVNodes());

function buildColumnMetas() {
  const nodes = allColumnNodes.value;
  return nodes.map((node, slotIndex) => {
    const p = (node.props || {}) as Record<string, unknown>;
    const isLast = slotIndex === nodes.length - 1;
    return {
      slotIndex,
      minWidthPx: resolveColumnMinWidthPx(readProp(p, 'minWidth') as string | undefined),
      displayOrder: Number(readProp(p, 'displayOrder') ?? slotIndex + 1),
      isAction: columnIsAction(p, isLast, Boolean(props.primaryAction)),
    };
  });
}

function visibleSlotsForSelectOffset(selectOffset: number) {
  return getVisibleColumnSlotIndices(buildColumnMetas(), size.value.width, {
    clientViewportWidth: clientViewportWidth.value,
    skidOpen: effectiveSkidOpen.value,
    selectOffsetPx: selectOffset,
  });
}

/** 多选停态可容纳的列：勾选列占去 40px，尾部若干列会被挤掉。 */
const selectModeSlotIndices = computed(() => visibleSlotsForSelectOffset(SELECT_COLUMN_WIDTH));
/** 常态可容纳的列，恒为多选停态列集的超集。 */
const idleSlotIndices = computed(() => visibleSlotsForSelectOffset(0));

// 常态列集始终驻留。多选容纳不下的列只把 <col> 宽度过渡到 0，不卸载对应业务单元格；
// 因而退出点击后没有重组件挂载，也没有 Vue 逐帧整表更新。
const visibleSlotIndices = idleSlotIndices;

const visibleColumnNodes = computed(() => {
  const visible = new Set(visibleSlotIndices.value);
  return allColumnNodes.value.filter((_, index) => visible.has(index));
});

function mapColumnConfig(node: VNode) {
  const p = (node.props || {}) as Record<string, unknown>;
  const children = node.children as
    | {
        header?: (payload?: Record<string, unknown>) => unknown;
        default?: (payload: { data: DataListItem }) => unknown;
      }
    | null;
  const slotIndex = allColumnNodes.value.indexOf(node);
  const isLast = slotIndex === allColumnNodes.value.length - 1;
  const isAction = columnIsAction(p, isLast, Boolean(props.primaryAction));

  return {
    label: (p.label as string) || '',
    align: (p.align as 'left' | 'center' | 'right') || 'left',
    sortable: Boolean(p.sortable),
    width: p.width as string | undefined,
    widthPercent: readProp(p, 'widthPercent') as number | undefined,
    minWidth: readProp(p, 'minWidth') as string | undefined,
    minTableWidth: readProp(p, 'minTableWidth') as number | undefined,
    displayOrder: Number(readProp(p, 'displayOrder') ?? slotIndex + 1),
    flexGrow: Boolean(readProp(p, 'flexGrow')),
    isAction,
    prop: (p.prop as string) || '',
    headerSlot: children?.header,
    slotDefault: children?.default,
    originalSortChangeHandler: p.onSortChange as ((order: string) => void) | undefined,
    primaryAction:
      effectiveSkidOpen.value && isAction
        ? undefined
        : ((readProp(p, 'primaryAction') as DataListPrimaryAction | undefined) ??
          (isAction ? props.primaryAction : undefined)),
    moreActions:
      effectiveSkidOpen.value && isAction
        ? undefined
        : ((readProp(p, 'moreActions') as DataListRowAction[] | undefined) ??
          (isAction ? props.moreActions : undefined)),
    hideActions: Boolean(effectiveSkidOpen.value && isAction),
    showOverflowTooltip: readProp(p, 'showOverflowTooltip', true) !== false,
  };
}

const headerColumns = computed(() => visibleColumnNodes.value.map((node) => mapColumnConfig(node)));

const bodyColumns = computed(() => visibleColumnNodes.value.map((node) => mapColumnConfig(node)));

function parsePx(value?: string): number {
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * 将 flex 列宽写入 widths：每列不低于 min-width；预算有余时在 min 之上均分 extra。
 */
function assignFlexColumnWidths(
  widths: number[],
  flexIndices: number[],
  flexMinWidths: number[],
  flexSpace: number,
): void {
  if (flexIndices.length === 0) return;

  const minSum = flexMinWidths.reduce((sum, min) => sum + min, 0);
  if (minSum <= 0) return;

  if (flexSpace <= minSum) {
    flexIndices.forEach((colIndex, flexOffset) => {
      widths[colIndex] = flexMinWidths[flexOffset];
    });
    return;
  }

  const extra = flexSpace - minSum;
  const extraPerCol = extra / flexIndices.length;
  flexIndices.forEach((colIndex, flexOffset) => {
    widths[colIndex] = Math.round(flexMinWidths[flexOffset] + extraPerCol);
  });

  const flexTotal = flexIndices.reduce((sum, colIndex) => sum + widths[colIndex], 0);
  const delta = flexSpace - flexTotal;
  if (delta !== 0) {
    const lastFlexIndex = flexIndices[flexIndices.length - 1];
    const lastFlexOffset = flexIndices.length - 1;
    widths[lastFlexIndex] = Math.max(
      flexMinWidths[lastFlexOffset] ?? 0,
      widths[lastFlexIndex] + delta,
    );
  }
}

function isTrailingFlexColumn(
  cols: ReturnType<typeof mapColumnConfig>[],
  lastIndex: number,
): boolean {
  return Boolean(cols[lastIndex]?.flexGrow);
}

/** Figma Apply_Data Table-Grids: trailing column shrink-0, leading columns flex equally with min-width. */
function computeRestDataColumnWidthsPx(cols = bodyColumns.value): number[] {
  const containerWidth = size.value.width;
  if (!containerWidth || cols.length === 0) return [];

  const hasLegacyPercent = cols.some((col) => col.widthPercent && !col.width);
  if (hasLegacyPercent) {
    return cols.map((col) => {
      if (col.width) return parsePx(col.width);
      if (col.widthPercent) {
        return Math.round((containerWidth * col.widthPercent) / 100);
      }
      return 0;
    });
  }

  if (cols.length === 1) {
    return [Math.max(0, containerWidth - DATA_LIST_FLEX_RESERVE_PX)];
  }

  const widths = new Array<number>(cols.length);
  const lastIndex = cols.length - 1;
  const lastCol = cols[lastIndex];
  const trailingIsFlex = isTrailingFlexColumn(cols, lastIndex);
  const trailingWidth = trailingIsFlex
    ? 0
    : Math.round(parsePx(lastCol?.width) || parsePx(lastCol?.minWidth));
  if (!trailingIsFlex) {
    widths[lastIndex] = trailingWidth;
  }

  const flexIndices: number[] = [];
  let fixedLeadingTotal = 0;
  const leadingEnd = trailingIsFlex ? cols.length : lastIndex;

  for (let index = 0; index < leadingEnd; index += 1) {
    const col = cols[index];
    if (col?.width) {
      const fixedWidth = Math.round(parsePx(col.width));
      widths[index] = fixedWidth;
      fixedLeadingTotal += fixedWidth;
    } else {
      flexIndices.push(index);
    }
  }

  const flexMinWidths = flexIndices.map((index) => parsePx(cols[index]?.minWidth));
  const flexSpace = Math.max(
    0,
    containerWidth - trailingWidth - fixedLeadingTotal - DATA_LIST_FLEX_RESERVE_PX,
  );
  assignFlexColumnWidths(widths, flexIndices, flexMinWidths, flexSpace);

  return widths;
}

function formatColWidthPx(width: number): string {
  return `${Math.round(width * 100) / 100}px`;
}

/** 批选勾选列占位不压缩数据列：保持 idle 宽度，且不低于 min-width。 */
function computeDataColumnLayoutWidthsPx(
  selectOffset: number,
  cols = bodyColumns.value,
  restWidths?: number[],
): number[] {
  const containerWidth = size.value.width;
  if (!containerWidth || cols.length === 0) return [];

  let rest = restWidths ?? dataColumnWidthsFullPx.value;
  if (rest.length !== cols.length) {
    rest = computeRestDataColumnWidthsPx(cols);
  }

  if (selectOffset <= 0) {
    return [...rest];
  }

  const lastIndex = cols.length - 1;
  const trailingIsFlex = isTrailingFlexColumn(cols, lastIndex);
  const trailingWidth = trailingIsFlex
    ? 0
    : rest[lastIndex] ??
      Math.round(parsePx(cols[lastIndex]?.width) || parsePx(cols[lastIndex]?.minWidth));

  return cols.map((col, index) => {
    if (!trailingIsFlex && index === lastIndex) return trailingWidth;
    if (col?.width) return rest[index] ?? Math.round(parsePx(col.width));
    const minWidth = parsePx(col.minWidth);
    return Math.max(rest[index] ?? minWidth, minWidth);
  });
}

function syncColumnWidthSnapshots() {
  dataColumnWidthsFullPx.value = computeRestDataColumnWidthsPx();
}

/** 按给定列集与勾选列占位算出一套停态布局，返回 slotIndex → 宽度。 */
function columnWidthsBySlot(slots: number[], selectOffset: number) {
  const cols = slots.map((slotIndex) => mapColumnConfig(allColumnNodes.value[slotIndex]));
  const widths = computeDataColumnLayoutWidthsPx(
    selectOffset,
    cols,
    computeRestDataColumnWidthsPx(cols),
  );
  const bySlot = new Map<number, number>();
  slots.forEach((slotIndex, index) => bySlot.set(slotIndex, widths[index] ?? 0));
  return bySlot;
}

// 插值的两个端点：都与动画进度无关，故整轮动画只算一次。
const idleColumnWidthsBySlot = computed(() => columnWidthsBySlot(idleSlotIndices.value, 0));
const selectModeColumnWidthsBySlot = computed(() =>
  columnWidthsBySlot(selectModeSlotIndices.value, SELECT_COLUMN_WIDTH),
);

const columnLayoutWidths = computed((): string[] => {
  if (!size.value.width || bodyColumns.value.length === 0) return [];
  if (dataColumnWidthsFullPx.value.length === 0) {
    syncColumnWidthSnapshots();
  }

  const idleWidths = idleColumnWidthsBySlot.value;
  const selectedWidths = selectModeColumnWidthsBySlot.value;
  const nodes = allColumnNodes.value;
  return visibleColumnNodes.value.map((node) => {
    const slotIndex = nodes.indexOf(node);
    const idleWidth = idleWidths.get(slotIndex) ?? 0;
    const selectedWidth = selectedWidths.get(slotIndex) ?? 0;
    return formatColWidthPx(selectMode.value ? selectedWidth : idleWidth);
  });
});

const selectColumnWidthCss = computed(() =>
  formatColWidthPx(selectMode.value ? SELECT_COLUMN_WIDTH : 0),
);

const tableLayoutWidthCss = computed(() => {
  const selectWidth = parsePx(selectColumnWidthCss.value);
  const dataSum = columnLayoutWidths.value.reduce((sum, width) => sum + parsePx(width), 0);
  const contentWidth = selectWidth + dataSum;
  return formatColWidthPx(Math.max(size.value.width, contentWidth));
});

// 可见列集合变化时快照必须同帧跟上（含动画中途），否则宽度插值仍按旧列集算。
watch(visibleSlotIndices, () => {
  syncColumnWidthSnapshots();
});

watch(
  [() => size.value.width, () => bodyColumns.value.length],
  () => {
    if (!selectAnimating.value) {
      syncColumnWidthSnapshots();
    }
  },
);

watch(
  () => effectiveSkidOpen.value,
  () => {
    if (!selectAnimating.value) {
      syncColumnWidthSnapshots();
    }
  },
);

function rowStyle() {
  return {
    height: `${props.columnHeight}px`,
  };
}

function onSortChange(columnIndex: number, order: 'asc' | 'desc') {
  headerCellRefs.value.forEach((cell, index) => {
    if (index !== columnIndex) cell?.resetSort?.();
  });
  const column = headerColumns.value[columnIndex];
  column?.originalSortChangeHandler?.(order);
}

function toggleRowSelect(index: number | undefined) {
  if (index === undefined) return;
  const existing = selectedList.value.find((row) => row._index === index);
  if (existing) {
    selectedList.value = selectedList.value.filter((row) => row._index !== index);
  } else {
    selectedList.value.push({ ...props.dataList[index], _index: index });
  }
  emit('update:selected-list', selectedList.value);
  emit('selected-change', selectedList.value);
}

function onSelectAllMode(mode: DataListSelectAllMode) {
  if (mode === 'all') {
    selectedList.value = [];
  } else {
    selectedList.value = props.dataList.map((row, index) => ({ ...row, _index: index }));
  }
  emit('update:selected-list', selectedList.value);
  emit('selected-change', selectedList.value);
}

function onRowClick(row: DataListItem, index: number) {
  if (selectMode.value) {
    toggleRowSelect(index);
    return;
  }
  if (props.primaryAction) {
    emit('primary-action', row, index);
    return;
  }
  emit('row-click', row);
}

function setSelectMode(enabled: boolean) {
  if (selectMode.value === enabled) return;
  selectMode.value = enabled;
  emit('update:select-mode', enabled);
  if (!enabled) {
    selectionExitSnapshot.value = selectedList.value;
    selectedList.value = [];
    emit('update:selected-list', []);
    emit('selected-change', []);
  }
}

let selectLayoutTimer: ReturnType<typeof setTimeout> | undefined;

function startSelectLayoutTransition() {
  if (selectLayoutTimer !== undefined) clearTimeout(selectLayoutTimer);
  const reducedMotion =
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    selectAnimating.value = false;
    return;
  }

  selectAnimating.value = true;
  selectLayoutTimer = window.setTimeout(() => {
    selectAnimating.value = false;
    selectLayoutTimer = undefined;
  }, SELECT_COLUMN_ANIM_MS);
}

function openSelect() {
  setSelectMode(true);
}

/** Batch Bar 在 DataList 内，hover tooltip 在 .app-preview（z-index:1000）；交互前关闭避免挡点击。 */
function onOperationBarInteract() {
  closeBarBlockingAnchoredTooltips();
}

function closeSelect() {
  if (!selectMode.value) {
    if (props.selectMode) {
      emit('update:select-mode', false);
    }
    return;
  }
  setSelectMode(false);
  void nextTick(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
  });
}

function onSelectModeEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !selectMode.value) return;
  if (hasOpenClickAnchoredTooltip()) return;
  event.preventDefault();
  event.stopPropagation();
  closeSelect();
}

defineExpose({ openSelect, closeSelect });

let resizeObserver: ResizeObserver | null = null;
let viewportResizeTimer: ReturnType<typeof setTimeout> | undefined;
let tableContentWheelTarget: HTMLElement | null = null;

function clampTableScroll(region: HTMLElement) {
  const maxScrollTop = Math.max(0, region.scrollHeight - region.clientHeight);
  if (region.scrollTop < 0) {
    region.scrollTop = 0;
  } else if (region.scrollTop > maxScrollTop) {
    region.scrollTop = maxScrollTop;
  }
}

function onTableContentWheel(event: WheelEvent) {
  const region = tableContentRef.value;
  if (!region) return;

  const maxScrollTop = region.scrollHeight - region.clientHeight;
  if (maxScrollTop <= 0) return;

  const atTop = region.scrollTop <= 0;
  const atBottom = region.scrollTop >= maxScrollTop - SCROLL_EDGE_EPSILON;
  const scrollingUp = event.deltaY < 0;
  const scrollingDown = event.deltaY > 0;

  if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
    event.preventDefault();
  }
}

function bindTableContentWheelListener() {
  const region = tableContentRef.value;
  if (!region || region === tableContentWheelTarget) return;

  tableContentWheelTarget?.removeEventListener('wheel', onTableContentWheel);
  tableContentWheelTarget = region;
  region.addEventListener('wheel', onTableContentWheel, { passive: false });
}

function unbindTableContentWheelListener() {
  tableContentWheelTarget?.removeEventListener('wheel', onTableContentWheel);
  tableContentWheelTarget = null;
}

function syncClientViewportWidth() {
  if (typeof document === 'undefined') return;
  clientViewportWidth.value = document.documentElement.clientWidth;
}

function onViewportResize() {
  if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer);
  viewportResizeTimer = window.setTimeout(() => {
    syncClientViewportWidth();
    viewportResizeTimer = undefined;
  }, RESIZE_DEBOUNCE_MS);
}

onMounted(() => {
  syncClientViewportWidth();
  window.addEventListener('resize', onViewportResize, { passive: true });
  window.addEventListener('keydown', onSelectModeEscape, { capture: true });

  if (!tableWrapperRef.value) return;
  resizeObserver = new ResizeObserver((entries) => {
    if (resizeDebounceTimer !== undefined) clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = window.setTimeout(() => {
      const entry = entries[0];
      size.value = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
      if (!selectAnimating.value) {
        syncColumnWidthSnapshots();
      }
      resizeDebounceTimer = undefined;
    }, RESIZE_DEBOUNCE_MS);
  });
  resizeObserver.observe(tableWrapperRef.value);
  size.value = {
    width: tableWrapperRef.value.clientWidth,
    height: tableWrapperRef.value.clientHeight,
  };
  emit('update:pagination-locked', selectMode.value);
  syncColumnWidthSnapshots();
  nextTick(() => {
    bindTableContentWheelListener();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportResize);
  window.removeEventListener('keydown', onSelectModeEscape, { capture: true });
  unbindTableContentWheelListener();
  if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer);
  resizeObserver?.disconnect();
  if (selectLayoutTimer !== undefined) clearTimeout(selectLayoutTimer);
  if (initingTimer !== undefined) clearTimeout(initingTimer);
  if (loadingTimer !== undefined) clearTimeout(loadingTimer);
  if (resizeDebounceTimer !== undefined) clearTimeout(resizeDebounceTimer);
  if (selectionExitSnapshotTimer !== undefined) clearTimeout(selectionExitSnapshotTimer);
  clearLoadingLeaveTimer();
});

function setHeaderRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!el || !('resetSort' in (el as object))) {
    headerCellRefs.value[index] = null;
    return;
  }
  headerCellRefs.value[index] = el as { resetSort?: () => void };
}

function renderHeaderSlot(column: (typeof headerColumns.value)[number]) {
  const slot = column.headerSlot as ((payload?: Record<string, unknown>) => unknown) | undefined;
  return slot?.({}) ?? null;
}

function renderCellSlot(
  column: (typeof bodyColumns.value)[number],
  slotProps: { data: DataListItem },
) {
  return column.slotDefault?.(slotProps) ?? null;
}

function isRowSelected(index: number) {
  return renderedSelectedList.value.some((row) => row._index === index);
}

function showBatchError(message: string) {
  emit('batch-error', message);
}

async function onBatchLabelBeforeOpen(_label: string, index: number) {
  const action = props.batchActions[index];
  if (!action || batchLoadingKey.value || selectedList.value.length === 0) {
    throw new Error('batch-before-open-blocked');
  }

  try {
    if (props.onBatchLabelBeforeOpen) {
      await props.onBatchLabelBeforeOpen(action.key, selectedList.value);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'batch-before-open-blocked') {
      throw error;
    }
    const message =
      error instanceof Error && error.message ? error.message : 'Batch action failed';
    showBatchError(message);
    throw error;
  }
}

async function onBatchLabelClick(_label: string, index: number) {
  const action = props.batchActions[index];
  if (!action || batchLoadingKey.value || selectedList.value.length === 0) return;

  batchLoadingKey.value = action.key;
  emit('batch-action', action.key, selectedList.value);

  try {
    let preserveSelection = false;
    if (props.onBatchAction) {
      const result = await props.onBatchAction(action.key, selectedList.value);
      preserveSelection = result?.preserveSelection === true;
    }
    if (!preserveSelection) {
      selectedList.value = [];
      emit('update:selected-list', []);
      emit('selected-change', []);
    }
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'Batch action failed';
    showBatchError(message);
  } finally {
    batchLoadingKey.value = null;
  }
}

function onPrimaryAction(row: DataListItem, rowIndex: number) {
  emit('primary-action', row, rowIndex);
}

function onMoreAction(key: string, row: DataListItem, rowIndex: number) {
  emit('more-action', key, row, rowIndex);
}

function onTableScroll(event: Event) {
  const target = event.target as HTMLElement;
  clampTableScroll(target);
  scrollTop.value = target.scrollTop;
}
</script>

<template>
  <div
    ref="tableWrapperRef"
    class="eds-data-list"
    :class="[styles.root, selectMode && styles.rootSelectMode]"
    :data-eds-data-list-layout-animating="selectAnimating || undefined"
    :style="{
      '--eds-data-list-row-height': `${columnHeight}px`,
      '--eds-data-list-header-height': headerHeightCss,
      '--eds-data-list-select-column-width': `${SELECT_COLUMN_WIDTH}px`,
      '--eds-data-list-select-content-opacity': String(selectContentOpacity),
      '--eds-data-list-select-content-translate-x': selectContentTranslateX,
    }"
  >
    <Transition
      :enter-active-class="styles.operationBarEnterActive"
      :leave-active-class="styles.operationBarLeaveActive"
      :enter-from-class="styles.operationBarEnterFrom"
      :enter-to-class="styles.operationBarEnterTo"
      :leave-from-class="styles.operationBarLeaveFrom"
      :leave-to-class="styles.operationBarLeaveTo"
    >
      <div
        v-if="selectMode"
        :class="styles.operationBar"
        @pointerenter="onOperationBarInteract"
        @pointerdown.capture="onOperationBarInteract"
      >
        <EgBatchBar
          :selected-count="renderedSelectedList.length"
          :count-suffix="batchCountSuffix"
          :labels="useBuiltinBatchBar ? batchActionLabels : undefined"
          :label-danger="useBuiltinBatchBar ? batchActionDanger : undefined"
          :label-popover="useBuiltinBatchBar ? batchActionPopover : undefined"
          :label-popover-width-mode="batchPopoverWidthMode"
          :label-popover-width="batchPopoverWidth"
          :label-popover-top-tool="batchPopoverTopTool"
          :label-popover-top-tool-title="batchPopoverTopToolTitle"
          :label-popover-top-tool-titles="batchActionPopoverTitles"
          :label-popover-top-tool-closable="batchPopoverTopToolClosable"
          :loading-label-index="useBuiltinBatchBar ? batchLoadingLabelIndex : null"
          :on-label-before-open="onBatchLabelBeforeOpen"
          @dismiss="closeSelect"
          @label-click="onBatchLabelClick"
          @label-popover-dismiss="(label, index) => emit('batch-popover-dismiss', label, index)"
        >
          <template v-if="useBuiltinBatchBar && $slots['batch-popover']" #label-popover="slotProps">
            <slot
              name="batch-popover"
              :action="batchActions[slotProps.index]"
              :selected-count="renderedSelectedList.length"
              v-bind="slotProps"
            />
          </template>
          <template v-if="!useBuiltinBatchBar && $slots.operation" #actions>
            <slot name="operation" />
          </template>
        </EgBatchBar>
      </div>
    </Transition>

    <div
      ref="tableContentRef"
      :class="[
        styles.tableContent,
        needsVerticalScroll && !isScrollLocked && styles.tableContentScrollY,
        isScrollLocked && styles.tableContentScrollLocked,
      ]"
      @scroll="onTableScroll"
    >
      <div
        :class="styles.headerBackdrop"
        :style="{
          backgroundColor: headerBg || undefined,
          ...(headerBg ? { backdropFilter: 'none' } : {}),
        }"
        aria-hidden="true"
      />
      <table :key="tableKey" :class="styles.table" :style="{ width: tableLayoutWidthCss }">
        <colgroup>
          <col
            :class="styles.layoutColumn"
            :style="{ width: selectColumnWidthCss }"
          />
          <col
            v-for="(width, index) in columnLayoutWidths"
            :key="index"
            :class="styles.layoutColumn"
            :style="{ width }"
          />
        </colgroup>
        <thead :style="{ height: headerHeightCss }">
          <tr>
            <DataListHeaderCell
              type="select"
              :height="headerHeightCss"
              :bg="headerBg"
              :select-mode="selectMode"
              :select-all-mode="
                renderedSelectedList.length === 0
                  ? 'none'
                  : renderedSelectedList.length === dataList.length
                    ? 'all'
                    : 'some'
              "
              @select-all-mode="onSelectAllMode"
            />
            <DataListHeaderCell
              v-for="(column, index) in headerColumns"
              :key="index"
              :ref="(el) => setHeaderRef(el, index)"
              :label="column.label"
              :align="column.align"
              :height="headerHeightCss"
              :sortable="column.sortable"
              :has-custom-header="Boolean(column.headerSlot)"
              :select-mode="selectMode"
              :bg="headerBg"
              @sort-change="(order) => onSortChange(index, order)"
            >
              <template v-if="column.headerSlot">
                <RenderVNodes :nodes="renderHeaderSlot(column)" />
              </template>
            </DataListHeaderCell>
          </tr>
        </thead>

        <tbody
          v-if="dataList.length > 0"
          :class="[styles.body, showLoadingBar && styles.bodyLoading]"
        >
          <tr :class="styles.loadingRow" :style="loadingRowStyle">
            <td :colspan="bodyColumns.length + 1">
              <div
                :class="[
                  styles.loadingSlot,
                  loadingBarExpanded && styles.loadingSlotExpanded,
                  loadingBarLeaving && styles.loadingSlotLeaving,
                ]"
              >
                <div :class="styles.loadingInner">
                  <div v-if="loadingDoneIcon" :class="styles.loadingDone">
                    <EgIcon name="eds-tick" size="sm" :class="styles.loadingDoneIcon" />
                    <span :class="styles.loadingDoneText">已刷新</span>
                  </div>
                  <EgIcon
                    v-else-if="showLoadingBar"
                    :class="styles.loadingSpin"
                    name="eds-load"
                    size="sm"
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr
            v-if="showVirtualTopSpacer"
            :class="styles.virtualSpacerRow"
            aria-hidden="true"
          >
            <td
              :colspan="bodyColumns.length + 1"
              :style="{ height: `${virtualTopSpacerPx}px` }"
            />
          </tr>

          <tr
            v-for="rowIndex in renderedRowIndices"
            :key="rowIndex"
            class="motion-ease is-paint"
            :style="rowStyle()"
            @click="onRowClick(dataList[rowIndex], rowIndex)"
          >
            <DataListColumn
              type="select"
              :index="rowIndex"
              :column-height="columnHeight"
              :data="dataList[rowIndex]"
              :selected="isRowSelected(rowIndex)"
              @select-change="toggleRowSelect"
            />
            <DataListColumn
              v-for="(column, colIndex) in bodyColumns"
              :key="`${rowIndex}-${colIndex}`"
              :index="rowIndex"
              :column-height="columnHeight"
              :prop="column.prop"
              :align="column.align"
              :data="dataList[rowIndex]"
              :primary-action="column.primaryAction"
              :more-actions="column.moreActions"
              :hide-actions="column.hideActions"
              :show-overflow-tooltip="column.showOverflowTooltip"
              @primary-action="onPrimaryAction(dataList[rowIndex], rowIndex)"
              @more-action="(key) => onMoreAction(key, dataList[rowIndex], rowIndex)"
            >
              <template v-if="column.slotDefault" #default="slotProps">
                <RenderVNodes :nodes="renderCellSlot(column, slotProps)" />
              </template>
            </DataListColumn>
          </tr>

          <tr
            v-if="showVirtualBottomSpacer"
            :class="styles.virtualSpacerRow"
            aria-hidden="true"
          >
            <td
              :colspan="bodyColumns.length + 1"
              :style="{ height: `${virtualBottomSpacerPx}px` }"
            />
          </tr>

          <tr
            v-for="blankIndex in blankRowCount"
            :key="`blank-${blankIndex}`"
            :class="styles.blankRow"
            :style="rowStyle()"
            aria-hidden="true"
          >
            <td :colspan="bodyColumns.length + 1" />
          </tr>
        </tbody>
      </table>

      <div v-if="showIniting" :class="styles.initing">
        <div :class="styles.initingContent">
          <EgIcon :class="styles.initingIcon" name="eds-load" size="md" />
          <div :class="styles.initingText">{{ initingText }}</div>
        </div>
      </div>

      <!-- initing = 首次加载未完成，此时无数据不等于空结果，不得宣称 emptyText。 -->
      <div v-if="!loading && !initing && dataList.length === 0" :class="styles.empty">
        <slot name="empty">
          <div :class="styles.emptyInner">
            <EgIcon :class="styles.emptyIcon" name="eds-business-7" fit />
            <div :class="styles.emptyText">{{ emptyText }}</div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
