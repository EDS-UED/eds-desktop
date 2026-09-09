<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
import {
  DATA_LIST_CELL_OVERFLOW_TOOLTIP_MAX_WIDTH,
  DATA_LIST_HEADER_OVERFLOW_TOOLTIP_MAX_WIDTH,
  EgTooltip,
  type TooltipPlacement,
} from '../../molecules/tooltip';
import {
  clearLayoutSettleTimer,
  scheduleOverflowMeasureAfterLayoutSettle,
  type LayoutSettleTimerRef,
} from '../../utils/overflowMeasureDuringLayout';
import {
  isClippedInsideBoundary,
  isElementTextOverflowing,
  isTextWiderThanContainers,
} from '../../utils/overflowTextMeasure';
import styles from './DataList.module.css';

const props = withDefaults(
  defineProps<{
    text?: string;
    disabled?: boolean;
    contentClass?: string;
    placement?: TooltipPlacement;
    boundarySelector?: string;
    maxWidth?: number;
    /** 表头 overflow tooltip 使用更窄面板与内边距。 */
    context?: 'cell' | 'header';
  }>(),
  {
    text: '',
    disabled: false,
    boundarySelector: '.eds-data-list',
    context: 'cell',
  },
);

const wrapRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const tooltipText = ref('');
let resizeObserver: ResizeObserver | null = null;
const layoutSettleRef: LayoutSettleTimerRef = {};

const resolvedContentClass = computed(() => props.contentClass ?? styles.cellText);

const resolvedPlacement = computed(
  () => props.placement ?? (props.context === 'header' ? 'bottom' : 'top'),
);

const resolvedMaxWidth = computed(() => {
  if (props.maxWidth != null) return props.maxWidth;
  return props.context === 'header'
    ? DATA_LIST_HEADER_OVERFLOW_TOOLTIP_MAX_WIDTH
    : DATA_LIST_CELL_OVERFLOW_TOOLTIP_MAX_WIDTH;
});

const resolvedTokenScopeClass = computed(() =>
  props.context === 'header'
    ? `desktopTokens eds-overflow-text-tooltip ${styles.headerOverflowTooltip}`
    : 'desktopTokens eds-overflow-text-tooltip',
);

const resolvedHeightMode = computed(() =>
  props.context === 'header' ? 'adaptive' : 'fixed',
);

const resolvedScrollable = computed(() => props.context !== 'header');

const showHeaderHoverTrigger = computed(
  () => props.context === 'header' && overflowing.value,
);

function measureOverflow() {
  const el = contentRef.value;
  if (!el) {
    overflowing.value = false;
    tooltipText.value = '';
    return;
  }
  const text = el.textContent?.trim() || String(props.text ?? '').trim();
  tooltipText.value = text;
  if (!text) {
    overflowing.value = false;
    return;
  }

  if (isElementTextOverflowing(el)) {
    overflowing.value = true;
    return;
  }

  if (props.context === 'header') {
    const host = wrapRef.value;
    if (
      isTextWiderThanContainers(el, [el, host, host?.parentElement])
      || isClippedInsideBoundary(host ?? el, host?.closest('th') ?? el.closest('th'))
    ) {
      overflowing.value = true;
      return;
    }
  }

  overflowing.value = false;
}

function requestOverflowMeasure() {
  scheduleOverflowMeasureAfterLayoutSettle(
    wrapRef.value ?? contentRef.value,
    () => measureOverflow(),
    layoutSettleRef,
  );
}

watch(
  () => props.text,
  () => {
    nextTick(measureOverflow);
  },
);

function bindResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(() => requestOverflowMeasure());
  if (contentRef.value) {
    resizeObserver.observe(contentRef.value);
  }
  if (props.context === 'header' && wrapRef.value) {
    resizeObserver.observe(wrapRef.value);
    const textWrap = wrapRef.value.parentElement;
    const segment = textWrap?.parentElement;
    if (textWrap) {
      resizeObserver.observe(textWrap);
    }
    if (segment) {
      resizeObserver.observe(segment);
    }
    const th = wrapRef.value.closest('th');
    if (th) {
      resizeObserver.observe(th);
    }
  }
}

onMounted(() => {
  nextTick(() => {
    bindResizeObserver();
    requestAnimationFrame(() => {
      measureOverflow();
      requestAnimationFrame(measureOverflow);
    });
  });
});

onUpdated(() => {
  nextTick(requestOverflowMeasure);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  clearLayoutSettleTimer(layoutSettleRef);
});
</script>

<template>
  <component
    :is="context === 'header' ? 'div' : 'span'"
    ref="wrapRef"
    :class="context === 'header' ? styles.headerOverflowHost : styles.cellOverflowHost"
  >
    <EgTooltip
      :content="tooltipText"
      :disabled="disabled || !overflowing || !tooltipText"
      :placement="resolvedPlacement"
      trigger="hover"
      width-mode="adaptive"
      :max-width="resolvedMaxWidth"
      :height-mode="resolvedHeightMode"
      :scrollable="resolvedScrollable"
      :token-scope-class="resolvedTokenScopeClass"
      :boundary-selector="boundarySelector"
      :flip="context !== 'header'"
    >
      <span
        :class="[
          styles.overflowTriggerWrap,
          context === 'header' && styles.overflowTriggerWrapHeader,
          showHeaderHoverTrigger && 'eds-hover-tooltip-trigger',
        ]"
      >
        <span
          v-if="context === 'header'"
          :class="[
            styles.headerOverflowTargetShell,
            showHeaderHoverTrigger && 'eds-hover-tooltip-trigger__target',
            showHeaderHoverTrigger && 'eds-hover-tooltip-trigger__target--inherit',
            showHeaderHoverTrigger && styles.headerOverflowTargetShellMotion,
            showHeaderHoverTrigger && resolvedContentClass,
          ]"
        >
          <span
            ref="contentRef"
            :class="[
              styles.headerOverflowTrigger,
              !showHeaderHoverTrigger && resolvedContentClass,
            ]"
          >
            <slot>{{ text }}</slot>
          </span>
        </span>
        <span
          v-else
          ref="contentRef"
          :class="[resolvedContentClass]"
        >
          <slot>{{ text }}</slot>
        </span>
      </span>
    </EgTooltip>
  </component>
</template>
