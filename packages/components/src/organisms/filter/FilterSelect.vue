<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgFlotation,
  type FlotationMenuItemPreset,
  type FlotationTriggerSize,
  type FlotationTriggerStyle,
} from '../../molecules/flotation';
import type { TooltipAlign } from '../../molecules/tooltip';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
import { useFilterPickerMenuWidthMode } from './useFilterPickerMenuWidthMode';
import { useFilterTranslate } from './filterTranslate';
import { FILTER_DROPDOWN_MAX_HEIGHT } from './types';
import styles from './FilterSelect.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: Array<{ id: string; label: string }>;
    disabled?: boolean;
    variant?: 'field' | 'operator';
    /** fixed：行内定宽；adaptive：随文案 hug；stretch：占满剩余宽度。 */
    layout?: 'fixed' | 'adaptive' | 'stretch';
    triggerStyle?: FlotationTriggerStyle;
    triggerSize?: FlotationTriggerSize;
    /** 长列表菜单最大高度（如日历年）。 */
    menuMaxHeight?: number;
    /** 仅列表区滚动（配合 menuMaxHeight）。 */
    menuListScroll?: boolean;
    /** 打开时将当前选中项滚至列表中间（如日历年）。 */
    scrollSelectedToCenter?: boolean;
    /** EgFilter 面板内互斥 id；未传时不参与面板级互斥。 */
    openId?: string;
    /** 同组互斥 key（如日历年/月）；与 openId 分离，避免误关外层 picker。 */
    groupOpenId?: string;
    /** 同组下拉互斥状态；配合 update:activeOpenId。 */
    activeOpenId?: string | null;
    boundarySelector?: string;
    align?: TooltipAlign;
    placeholder?: string;
  }>(),
  {
    disabled: false,
    variant: 'field',
    layout: 'fixed',
    triggerStyle: 'outline',
    triggerSize: 'sm',
    placeholder: undefined,
    menuMaxHeight: FILTER_DROPDOWN_MAX_HEIGHT,
    menuListScroll: true,
    scrollSelectedToCenter: true,
    openId: undefined,
    groupOpenId: undefined,
    activeOpenId: undefined,
    boundarySelector: undefined,
    align: 'start',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:activeOpenId': [value: string | null];
}>();

const rootRef = ref<HTMLElement | null>(null);
const flotationRef = ref<{ close?: () => void } | null>(null);
const { onDropdownOpen, onDropdownClose } = useFilterPanelDropdownMutex(
  () => props.openId,
  flotationRef,
);
const usesActiveOpenGroup = computed(() => props.activeOpenId !== undefined);

const siblingMutexId = computed(() => props.groupOpenId ?? props.openId);

const menuItems = computed((): FlotationMenuItemPreset[] =>
  props.options.map((option) => ({ label: t(option.label) })),
);

const selectedIndex = computed(() => {
  const index = props.options.findIndex((option) => option.id === props.modelValue);
  return index >= 0 ? index : 0;
});

const selectedLabel = computed(() => {
  const label = props.options.find((option) => option.id === props.modelValue)?.label;
  if (!label) {
    return props.placeholder ? t(props.placeholder) : '';
  }
  return t(label);
});

const pickerOptionLabels = computed(() => props.options.map((option) => t(option.label)));

const { flotationWidthMode, syncMenuWidthMode, syncMenuWidthModeAfterLayout } =
  useFilterPickerMenuWidthMode({
    rootRef,
    optionLabels: pickerOptionLabels,
  });

function onItemClick(_item: FlotationMenuItemPreset, index: number) {
  const option = props.options[index];
  if (!option) return;
  emit('update:modelValue', option.id);
}

watch(
  () => [props.modelValue, selectedLabel.value, props.triggerSize, props.layout, props.variant] as const,
  () => {
    void syncMenuWidthModeAfterLayout();
  },
  { flush: 'post' },
);

function onRootPointerDown() {
  if (props.disabled) return;
  syncMenuWidthMode();
}

function onFlotationOpen() {
  const mutexId = siblingMutexId.value;
  if (usesActiveOpenGroup.value && mutexId !== undefined) {
    emit('update:activeOpenId', mutexId);
  }
  if (props.openId !== undefined) {
    onDropdownOpen();
  }
  syncMenuWidthMode();
  void syncMenuWidthModeAfterLayout();
}

function onFlotationClose() {
  const mutexId = siblingMutexId.value;
  if (
    usesActiveOpenGroup.value
    && mutexId !== undefined
    && props.activeOpenId === mutexId
  ) {
    emit('update:activeOpenId', null);
  }
  if (props.openId !== undefined) {
    onDropdownClose();
  }
}

watch(
  () => props.activeOpenId,
  (activeId) => {
    const id = siblingMutexId.value;
    if (!usesActiveOpenGroup.value || id === undefined || activeId == null) return;
    if (activeId === id) return;
    flotationRef.value?.close?.();
  },
);

function closeMenu() {
  flotationRef.value?.close?.();
}

defineExpose({ close: closeMenu });
</script>

<template>
  <div
    ref="rootRef"
    @pointerdown="onRootPointerDown"
    :class="[
      styles.select,
      layout === 'stretch'
        ? styles.selectStretch
        : layout === 'adaptive'
          ? styles.selectAdaptive
          : variant === 'field'
            ? styles.selectField
            : styles.selectOperator,
    ]"
  >
    <EgFlotation
      ref="flotationRef"
      :disabled="disabled"
      placement="bottom"
      :align="align"
      :width-mode="flotationWidthMode"
      :trigger-style="triggerStyle"
      :trigger-size="triggerSize"
      :trigger-label="selectedLabel"
      :show-add="false"
      :show-menu-divider="false"
      :list-scroll="menuListScroll"
      :scroll-selected-to-center="scrollSelectedToCenter"
      :max-height="menuMaxHeight"
      :items="menuItems"
      :selected-index="selectedIndex"
      :boundary-selector="boundarySelector"
      flip
      @open="onFlotationOpen"
      @close="onFlotationClose"
      @item-click="onItemClick"
    />
  </div>
</template>
