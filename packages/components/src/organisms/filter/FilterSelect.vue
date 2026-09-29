<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgFlotation,
  type FlotationMenuItemPreset,
  type FlotationTriggerSize,
  type FlotationTriggerStyle,
} from '../../molecules/flotation';
import type { FlotationWidthMode } from '../../molecules/flotation/Flotation.vue';
import { OVERFLOW_EPSILON } from '../../utils/overflowTextMeasure';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
import { useFilterTranslate } from './filterTranslate';
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
    /** EgFilter 面板内互斥 id；未传时不参与互斥。 */
    openId?: string;
    boundarySelector?: string;
    placeholder?: string;
  }>(),
  {
    disabled: false,
    variant: 'field',
    layout: 'fixed',
    triggerStyle: 'outline',
    triggerSize: 'sm',
    placeholder: undefined,
    menuMaxHeight: undefined,
    menuListScroll: false,
    openId: undefined,
    boundarySelector: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const rootRef = ref<HTMLElement | null>(null);
const flotationRef = ref<{ close?: () => void } | null>(null);
const { onDropdownOpen, onDropdownClose } = useFilterPanelDropdownMutex(
  () => props.openId,
  flotationRef,
);
const menuWidthMode = ref<FlotationWidthMode>('trigger');

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

const flotationWidthMode = computed(() =>
  props.variant === 'operator' ? menuWidthMode.value : 'trigger',
);

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
function measureOperatorMenuOptionWidth(label: string, root: HTMLElement): number {
  const rootStyle = getComputedStyle(root);
  const fontSize = readTypographyToken('--eds-body-medium-size', '13px');
  const fontWeight = readTypographyToken('--eds-body-medium-weight', '400');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  ctx.font = `${fontWeight} ${fontSize} ${rootStyle.fontFamily}`;
  const itemPaddingX = readSpacingToken('--spacing-2', 8) * 2;
  return ctx.measureText(label).width + itemPaddingX;
}

function resolveOperatorMenuWidthMode(): FlotationWidthMode {
  const root = rootRef.value;
  if (!root) return 'trigger';

  const trigger = root.querySelector('.eds-flotation-trigger') as HTMLElement | null;
  if (!trigger) return 'trigger';

  const triggerWidth = trigger.getBoundingClientRect().width;
  if (triggerWidth <= 0) return 'trigger';

  const edgeInset = readSpacingToken('--spacing-2', 8);
  const shellPadding = readSpacingToken('--spacing-1', 4);
  /** trigger 模式下浮层宽 = 触发器 + 左右 cross-axis inset；内容区再扣 effect padding。 */
  const menuContentWidth = triggerWidth + edgeInset * 2 - shellPadding * 2;

  const maxOptionWidth = Math.max(
    0,
    ...props.options.map((option) => measureOperatorMenuOptionWidth(t(option.label), root)),
  );

  return maxOptionWidth > menuContentWidth + OVERFLOW_EPSILON ? 'adaptive' : 'trigger';
}

function syncOperatorMenuWidthMode() {
  if (props.variant !== 'operator') {
    menuWidthMode.value = 'trigger';
    return;
  }
  menuWidthMode.value = resolveOperatorMenuWidthMode();
}

async function syncOperatorMenuWidthModeAfterLayout() {
  await nextTick();
  syncOperatorMenuWidthMode();
}

function onItemClick(_item: FlotationMenuItemPreset, index: number) {
  const option = props.options[index];
  if (!option) return;
  emit('update:modelValue', option.id);
}

watch(
  () => props.options,
  () => {
    void syncOperatorMenuWidthModeAfterLayout();
  },
  { deep: true },
);

watch(
  () => [props.modelValue, selectedLabel.value, props.triggerSize, props.layout] as const,
  () => {
    void syncOperatorMenuWidthModeAfterLayout();
  },
  { flush: 'post' },
);

function onRootPointerDown() {
  if (props.disabled || props.variant !== 'operator') return;
  syncOperatorMenuWidthMode();
}

function onFlotationOpen() {
  onDropdownOpen();
  syncOperatorMenuWidthMode();
  void syncOperatorMenuWidthModeAfterLayout();
}

function onFlotationClose() {
  onDropdownClose();
}
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
      align="start"
      :width-mode="flotationWidthMode"
      :trigger-style="triggerStyle"
      :trigger-size="triggerSize"
      :trigger-label="selectedLabel"
      :show-add="false"
      :show-menu-divider="false"
      :list-scroll="menuListScroll"
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
