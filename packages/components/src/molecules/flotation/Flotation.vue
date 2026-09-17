<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue';
import {
  EgTooltip,
  type TooltipAlign,
  type TooltipHeightMode,
  type TooltipPlacement,
  type TooltipTrigger,
  type TooltipWidthMode,
} from '../tooltip';
import FlotationMenu from './FlotationMenu.vue';
import FlotationMenuItem from './FlotationMenuItem.vue';
import FlotationTrigger, {
  type FlotationTriggerSize,
  type FlotationTriggerStyle,
  type FlotationTriggerSymbolPosition,
} from './FlotationTrigger.vue';
import type { TagStatus } from '../tag';
import type { MessageType } from '../feedback';
import {
  createDefaultFlotationPresetItems,
  type FlotationMenuItemPreset,
} from './flotationPresets';
import {
  FALLBACK_EDGE_INSET_PX,
  FALLBACK_MAIN_AXIS_PX,
  readCssTokenLength,
  resolveCrossAxisOffsetFromAlign,
  SPACING_EDGE_INSET,
  SPACING_MAIN_AXIS,
} from '../../shared/cssSpacingTokens';

export type { FlotationMenuItemPreset } from './flotationPresets';
export type { FlotationTriggerSize, FlotationTriggerStyle, FlotationTriggerSymbolPosition } from './FlotationTrigger.vue';
export type { FlotationBoxType } from './FlotationMenuItem.vue';

/** Menu 宽度：跟触发器 / 自定义 px / 随内容 */
export type FlotationWidthMode = 'trigger' | 'fixed' | 'adaptive';

type AnchoredApi = {
  close: () => void;
  getTriggerElement: () => HTMLElement | null;
  getTriggerWidth: () => number;
  getTriggerHeight: () => number;
  updatePosition: () => void;
};

const props = withDefaults(
  defineProps<{
    placement?: TooltipPlacement;
    /** 自定义/自适应宽度时的交叉轴对齐；等宽触发器时固定 start。 */
    align?: TooltipAlign;
    disabled?: boolean;
    /** 主轴与触发器间距（px）；未传时读 --spacing-025。 */
    offset?: number;
    /** 交叉轴偏移（px）；未传时 start=-spacing-2、end=+spacing-2、center=0。 */
    crossAxisOffset?: number;
    widthMode?: FlotationWidthMode;
    width?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
    triggerLabel?: string;
    triggerStyle?: FlotationTriggerStyle;
    triggerSize?: FlotationTriggerSize;
    showSymbol?: boolean;
    symbolIcon?: string;
    /** 预置 Trigger 的 #symbol 位置；透传 EgFlotationTrigger.symbolPosition。 */
    symbolPosition?: FlotationTriggerSymbolPosition;
    showTag?: boolean;
    tagText?: string;
    tagStatus?: TagStatus;
    showMessage?: boolean;
    messageText?: string;
    messageType?: MessageType;
    showAdd?: boolean;
    addLabel?: string;
    showMenuDivider?: boolean;
    items?: FlotationMenuItemPreset[];
    /** 滚动容器滚动时关闭浮层（如 DataList 内嵌场景）。 */
    closeOnScroll?: boolean;
    /** 空间不足时翻转主轴 placement。 */
    flip?: boolean;
    /** 定位边界选择器（如 `.eds-data-list`）。 */
    boundarySelector?: string;
    /** 透传 EgTooltip：click / hover / focus。 */
    trigger?: TooltipTrigger;
    openDelay?: number;
    closeDelay?: number;
    /** 菜单高亮行；定制区等需与当前值对齐时传入。未传时默认 0。 */
    selectedIndex?: number | null;
  }>(),
  {
    placement: 'bottom',
    align: 'start',
    disabled: false,
    widthMode: 'fixed',
    width: 280,
    heightMode: 'adaptive',
    height: 306,
    maxHeight: undefined,
    triggerLabel: 'Trigger',
    triggerStyle: 'subtle',
    triggerSize: 'lg',
    showSymbol: false,
    symbolIcon: 'eds-coin-btc',
    symbolPosition: 'leading',
    showTag: false,
    tagText: 'Tag',
    tagStatus: 'danger',
    showMessage: false,
    messageText: '0',
    messageType: 'brand',
    showAdd: true,
    addLabel: 'Add',
    showMenuDivider: true,
    items: () => createDefaultFlotationPresetItems(),
    closeOnScroll: false,
    flip: false,
    trigger: 'click',
    openDelay: 0,
    closeDelay: 0,
  },
);

const emit = defineEmits<{
  'item-click': [item: FlotationMenuItemPreset, index: number, event: MouseEvent];
  add: [event: MouseEvent];
  open: [];
  close: [];
  'update:selectedIndex': [index: number | null];
}>();

const slots = useSlots();
const menuOpen = ref(false);
const selectedIndex = ref<number | null>(props.selectedIndex ?? 0);
const anchoredRef = ref<AnchoredApi | null>(null);
const triggerMatchWidth = ref<number | undefined>(undefined);
const mainAxisGapPx = ref(FALLBACK_MAIN_AXIS_PX);
const edgeInsetPx = ref(FALLBACK_EDGE_INSET_PX);
let triggerResizeObserver: ResizeObserver | undefined;

const usePresetContent = computed((): boolean => !slots.content);

const resolvedItems = computed(() => props.items ?? createDefaultFlotationPresetItems());

const selectedItem = computed(() => {
  if (selectedIndex.value === null) return null;
  return resolvedItems.value[selectedIndex.value] ?? null;
});

/** 任一 Box Item 带红点时，模块菜单标题触发器须同步显示红点。 */
const hasAnyItemReddot = computed(() =>
  resolvedItems.value.some((item) => Boolean(item.showReddot)),
);

const displayLabel = computed(() => selectedItem.value?.label ?? props.triggerLabel);
const displayTagText = computed(() => selectedItem.value?.tag ?? props.tagText);
const displayTagStatus = computed(
  () => selectedItem.value?.tagStatus ?? props.tagStatus,
);
const displayShowTag = computed(() => {
  if (selectedItem.value) {
    return Boolean(selectedItem.value.showTag);
  }
  return props.showTag;
});

const menuWidthMode = computed((): TooltipWidthMode =>
  props.widthMode === 'adaptive' ? 'adaptive' : 'fixed',
);

/**
 * trigger：面板宽 = 触发器宽 + 左右各 --spacing-2。
 * fixed：自定义 px；adaptive：随内容。
 */
const menuWidth = computed(() => {
  if (props.widthMode === 'trigger') {
    if (triggerMatchWidth.value == null || triggerMatchWidth.value <= 0) {
      return undefined;
    }
    return triggerMatchWidth.value + edgeInsetPx.value * 2;
  }
  if (props.widthMode === 'fixed') return props.width;
  return undefined;
});

/** 等宽触发器时 start；自定义宽度用 align。 */
const menuAlign = computed((): TooltipAlign =>
  props.widthMode === 'trigger' ? 'start' : props.align,
);

/** 主轴间距固定为 --spacing-025，可经 offset 覆盖。 */
const menuOffset = computed(() => props.offset ?? mainAxisGapPx.value);

/** 交叉轴 inset：start 向左扩 spacing-2；end 向右扩 spacing-2；center 不额外偏移。 */
const menuCrossAxisOffset = computed(() => {
  if (props.crossAxisOffset != null) {
    return props.crossAxisOffset;
  }
  return resolveCrossAxisOffsetFromAlign(menuAlign.value, edgeInsetPx.value);
});

function resolveSpacingTokens() {
  const el = anchoredRef.value?.getTriggerElement();
  if (!el) return;
  mainAxisGapPx.value = readCssTokenLength(el, SPACING_MAIN_AXIS, FALLBACK_MAIN_AXIS_PX);
  edgeInsetPx.value = readCssTokenLength(el, SPACING_EDGE_INSET, FALLBACK_EDGE_INSET_PX);
}

function syncTriggerSize() {
  const width = anchoredRef.value?.getTriggerWidth();
  if (width != null && width > 0) {
    triggerMatchWidth.value = width;
  }
}

function bindTriggerResizeObserver() {
  unbindTriggerResizeObserver();
  if (props.widthMode !== 'trigger') return;
  const el = anchoredRef.value?.getTriggerElement();
  if (!el || typeof ResizeObserver === 'undefined') return;
  triggerResizeObserver = new ResizeObserver(() => {
    syncTriggerSize();
    if (menuOpen.value) {
      nextTick(() => anchoredRef.value?.updatePosition());
    }
  });
  triggerResizeObserver.observe(el);
}

function unbindTriggerResizeObserver() {
  triggerResizeObserver?.disconnect();
  triggerResizeObserver = undefined;
}

function scheduleMenuReposition() {
  resolveSpacingTokens();
  nextTick(() => {
    anchoredRef.value?.updatePosition();
    requestAnimationFrame(() => {
      syncTriggerSize();
      anchoredRef.value?.updatePosition();
      requestAnimationFrame(() => anchoredRef.value?.updatePosition());
    });
  });
}

onMounted(() => {
  syncSelectedIndex();
  nextTick(() => {
    resolveSpacingTokens();
    if (props.widthMode === 'trigger') {
      syncTriggerSize();
      bindTriggerResizeObserver();
    }
  });
});

watch(
  () => props.widthMode,
  async (mode) => {
    if (mode === 'trigger') {
      await nextTick();
      syncTriggerSize();
      bindTriggerResizeObserver();
      if (menuOpen.value) scheduleMenuReposition();
      return;
    }
    unbindTriggerResizeObserver();
    if (menuOpen.value) scheduleMenuReposition();
  },
);

function syncSelectedIndex() {
  const len = resolvedItems.value.length;
  if (props.selectedIndex !== undefined) {
    if (len === 0) {
      selectedIndex.value = null;
      return;
    }
    const index = props.selectedIndex ?? 0;
    selectedIndex.value = index >= 0 && index < len ? index : 0;
    return;
  }
  if (len === 0) {
    if (selectedIndex.value !== null) {
      selectedIndex.value = null;
      emit('update:selectedIndex', null);
    }
    return;
  }
  if (selectedIndex.value === null || selectedIndex.value >= len) {
    selectedIndex.value = 0;
    emit('update:selectedIndex', 0);
  }
}

watch(() => props.items, syncSelectedIndex);

watch(
  () => props.selectedIndex,
  (index) => {
    if (index === undefined) return;
    syncSelectedIndex();
  },
);

watch(
  () =>
    [
      props.widthMode,
      props.triggerLabel,
      props.triggerSize,
      props.showSymbol,
      props.showTag,
      props.showMessage,
      displayLabel.value,
      displayShowTag.value,
    ] as const,
  async () => {
    if (props.widthMode !== 'trigger') return;
    await nextTick();
    syncTriggerSize();
    if (menuOpen.value) {
      scheduleMenuReposition();
    }
  },
  { flush: 'post' },
);

watch(
  () => triggerMatchWidth.value,
  async (width) => {
    if (props.widthMode !== 'trigger' || width == null || width <= 0) return;
    if (!menuOpen.value) return;
    scheduleMenuReposition();
  },
);

watch(
  () =>
    [
      menuWidth.value,
      menuAlign.value,
      menuOffset.value,
      menuCrossAxisOffset.value,
      props.placement,
    ] as const,
  async () => {
    if (!menuOpen.value) return;
    scheduleMenuReposition();
  },
);

async function onOpen() {
  menuOpen.value = true;
  resolveSpacingTokens();
  syncTriggerSize();
  bindTriggerResizeObserver();
  await nextTick();
  syncTriggerSize();
  scheduleMenuReposition();
  emit('open');
}

function onClose() {
  menuOpen.value = false;
  unbindTriggerResizeObserver();
  emit('close');
}

function onItemClick(item: FlotationMenuItemPreset, index: number, event: MouseEvent) {
  selectedIndex.value = index;
  emit('update:selectedIndex', index);
  emit('item-click', item, index, event);
  anchoredRef.value?.close();
}

onBeforeUnmount(() => {
  unbindTriggerResizeObserver();
});
</script>

<template>
  <!--
    EgFlotation
      └ EgTooltip（定位）
           ├ #trigger → EgFlotationTrigger（预置；可插槽替换）
           └ #content → EgFlotationMenu → EgTooltip
                              └ EgFlotationMenuItem / Box（预置；可插槽替换）
  -->
  <EgTooltip
    ref="anchoredRef"
    class="eds-flotation"
    :trigger="trigger"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :wrap-tooltip="false"
    :placement="placement"
    :align="menuAlign"
    :disabled="disabled"
    :offset="menuOffset"
    :cross-axis-offset="menuCrossAxisOffset"
    :close-on-scroll="closeOnScroll"
    :flip="flip"
    :boundary-selector="boundarySelector"
    token-scope-class="desktopTokens"
    @open="onOpen"
    @close="onClose"
  >
    <slot
      name="trigger"
      :expanded="menuOpen"
      :selected-item="selectedItem"
      :selected-index="selectedIndex"
      :has-any-item-reddot="hasAnyItemReddot"
    >
      <FlotationTrigger
        :label="displayLabel"
        :trigger-style="triggerStyle"
        :size="triggerSize"
        :disabled="disabled"
        :show-symbol="showSymbol"
        :symbol-icon="symbolIcon"
        :symbol-position="symbolPosition"
        :show-tag="displayShowTag"
        :tag-text="displayTagText"
        :tag-status="displayTagStatus"
        :show-message="showMessage"
        :message-text="messageText"
        :message-type="messageType"
        :expanded="menuOpen"
      />
    </slot>

    <template #content>
      <slot
        name="content"
        :selected-index="selectedIndex"
        :close="() => anchoredRef?.close()"
      >
        <FlotationMenu
          v-if="usePresetContent"
          panel-kind="flotation"
          :width-mode="menuWidthMode"
          :width="menuWidth"
          :height-mode="heightMode"
          :height="height"
          :max-height="maxHeight"
          :show-divider="showMenuDivider"
          :show-add="showAdd"
          :add-label="addLabel"
          @add="emit('add', $event)"
        >
          <FlotationMenuItem
            v-for="(item, index) in resolvedItems"
            :key="`${item.label}-${index}`"
            :box-type="item.boxType ?? 'text'"
            :label="item.label"
            :disabled="item.disabled"
            :focused="item.focused || selectedIndex === index"
            :show-checkbox="item.showCheckbox"
            :checked="item.checked"
            :show-tag="Boolean(item.showTag)"
            :tag-text="item.tag ?? tagText"
            :tag-status="item.tagStatus ?? tagStatus"
            :mode-tag="item.modeTag"
            :show-reddot="item.showReddot"
            :show-cascader="item.showCascader"
            :show-message="item.showMessage"
            :message-text="item.messageText ?? '0'"
            :message-type="item.messageType ?? 'subtle'"
            :symbol-icon="
              item.symbolIcon ??
              (item.boxType === 'image-text' ? 'eds-aave-aave' : 'eds-add')
            "
            @click="onItemClick(item, index, $event)"
          />
        </FlotationMenu>
      </slot>
    </template>
  </EgTooltip>
</template>
