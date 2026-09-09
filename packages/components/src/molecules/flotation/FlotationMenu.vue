<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import EgTooltipPanel, {
  type TooltipHeightMode,
  type TooltipWidthMode,
} from '../tooltip/Tooltip.vue';
import type { TooltipPanelKind, TooltipPanelRadiusToken } from '../tooltip/tooltipPanelRadius';
import styles from './Flotation.module.css';

defineOptions({ inheritAttrs: false });

const SCROLL_EDGE_EPSILON = 2;

const attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    /** Figma Menu：浮层外壳由 EgTooltip 提供（flotation box）。 */
    panelKind?: TooltipPanelKind;
    /** 透传 EgTooltip；仅 Radius token（--radius-*）。 */
    panelRadius?: TooltipPanelRadiusToken;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
    /** false：随内容增高，不滚动、不裁剪。 */
    scrollable?: boolean;
    showDivider?: boolean;
    showAdd?: boolean;
    addLabel?: string;
    /** 无 Add 底栏时仅 #default 列表区滚动（配合吸顶 Header 等）。 */
    listScroll?: boolean;
  }>(),
  {
    panelKind: 'flotation',
    widthMode: 'fixed',
    width: undefined,
    heightMode: 'adaptive',
    height: 306,
    maxHeight: undefined,
    scrollable: true,
    showDivider: true,
    showAdd: true,
    addLabel: 'Add',
    listScroll: false,
  },
);

const emit = defineEmits<{
  add: [event: MouseEvent];
}>();

/** Add 行 + 分割线在底部固定；或 listScroll 时仅列表区滚动。 */
const useScrollableList = computed(
  () => props.scrollable && (props.showAdd || props.listScroll),
);
const useStickyFooter = computed(() => props.showAdd);
const slots = useSlots();
const showListHeader = computed(
  () => useScrollableList.value && props.scrollable && Boolean(slots.header),
);

const listScrollRef = ref<HTMLElement | null>(null);
const listFadeTop = ref(false);
const listFadeBottom = ref(false);
let listResizeObserver: ResizeObserver | undefined;

function updateListScrollFade() {
  const element = listScrollRef.value;

  if (!element || !useScrollableList.value || !props.scrollable) {
    listFadeTop.value = false;
    listFadeBottom.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;

  listFadeTop.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
  listFadeBottom.value =
    !useStickyFooter.value &&
    canScroll &&
    scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;
}

function onListScroll() {
  updateListScrollFade();
}

onMounted(() => {
  updateListScrollFade();
  listResizeObserver = new ResizeObserver(() => {
    updateListScrollFade();
  });
  if (listScrollRef.value) {
    listResizeObserver.observe(listScrollRef.value);
  }
});

watch(listScrollRef, (nextElement, previousElement) => {
  if (previousElement) {
    listResizeObserver?.unobserve(previousElement);
  }
  if (nextElement) {
    listResizeObserver?.observe(nextElement);
  }
  updateListScrollFade();
});

watch(useScrollableList, () => {
  updateListScrollFade();
});

onBeforeUnmount(() => {
  listResizeObserver?.disconnect();
});
</script>

<template>
  <EgTooltipPanel
    v-bind="attrs"
    :class="[
      'eds-flotation-menu',
      useScrollableList && scrollable && 'eds-flotation-menu--scrollable-list',
      useStickyFooter && 'eds-flotation-menu--sticky-footer',
      showListHeader && 'eds-flotation-menu--list-header',
    ]"
    :panel-kind="panelKind"
    :panel-radius="panelRadius"
    :width-mode="widthMode"
    :width="width"
    :max-width="maxWidth"
    :height-mode="heightMode"
    :height="height"
    :max-height="maxHeight"
    :scrollable="!useScrollableList && scrollable"
    panel-micro-float
  >
    <div
      :class="[
        'eds-flotation-menu-body',
        styles.menuBody,
        useScrollableList && scrollable && styles.menuBodySticky,
      ]"
    >
      <div v-if="showListHeader" :class="styles.menuHeader">
        <slot name="header" />
      </div>
      <div
        v-if="useScrollableList && scrollable"
        :class="styles.menuListOuter"
      >
        <div
          ref="listScrollRef"
          :class="[
            styles.menuList,
            styles.menuListScrollable,
            listFadeTop && styles.menuListScrollFadeTop,
            listFadeBottom && styles.menuListScrollFadeBottom,
          ]"
          @scroll="onListScroll"
        >
          <slot />
          <div
            v-if="useStickyFooter && scrollable"
            :class="styles.menuListScrollEnd"
            aria-hidden="true"
          />
        </div>
      </div>
      <div v-else :class="styles.menuList">
        <slot />
      </div>
      <div v-if="showAdd" class="eds-flotation-menu-footer" :class="styles.menuFooter">
        <div v-if="showDivider" :class="styles.menuDivider">
          <EgDivider type="page" direction="horizontal" />
        </div>
        <button
          type="button"
          class="eds-flotation-menu-add"
          :class="styles.addRow"
          @click="emit('add', $event)"
        >
          <span :class="styles.addIcon" aria-hidden="true">
            <EgIcon name="eds-add" size="sm" />
          </span>
          {{ addLabel }}
        </button>
      </div>
    </div>
  </EgTooltipPanel>
</template>
