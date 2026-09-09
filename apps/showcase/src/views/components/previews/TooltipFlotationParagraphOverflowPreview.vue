<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgTooltip } from '@eds/desktop-components';
import { tooltipFlotationParagraphOverflowSampleText } from './tooltipFlotationParagraphOverflowPreviewData';
import styles from './TooltipPreview.module.css';

const PARAGRAPH_OVERFLOW_TOOLTIP_MAX_WIDTH = 360;

const sampleText = tooltipFlotationParagraphOverflowSampleText;

const contentRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const tooltipText = ref('');
let resizeObserver: ResizeObserver | null = null;

const showHoverTrigger = computed(() => overflowing.value);

function measureOverflow() {
  const el = contentRef.value;
  if (!el) {
    overflowing.value = false;
    tooltipText.value = '';
    return;
  }
  overflowing.value = el.scrollHeight > el.clientHeight + 1;
  tooltipText.value = el.textContent?.trim() || sampleText;
}

function bindResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (!contentRef.value) return;
  resizeObserver = new ResizeObserver(() => measureOverflow());
  resizeObserver.observe(contentRef.value);
}

watch(
  () => sampleText,
  () => {
    nextTick(() => {
      measureOverflow();
      bindResizeObserver();
    });
  },
);

onMounted(() => {
  measureOverflow();
  bindResizeObserver();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div :class="styles.paragraphOverflowHost">
    <EgTooltip
      :content="tooltipText"
      panel-kind="flotation"
      trigger="hover"
      placement="bottom"
      :disabled="!overflowing || !tooltipText"
      width-mode="adaptive"
      :max-width="PARAGRAPH_OVERFLOW_TOOLTIP_MAX_WIDTH"
      height-mode="adaptive"
      :scrollable="false"
      :token-scope-class="`desktopTokens eds-overflow-text-tooltip ${styles.paragraphOverflowTooltip}`"
    >
      <span
        :class="[
          styles.paragraphOverflowTriggerWrap,
          showHoverTrigger && 'eds-hover-tooltip-trigger',
        ]"
      >
        <span
          :class="[
            styles.paragraphOverflowTrigger,
            showHoverTrigger && 'eds-hover-tooltip-trigger__target',
            showHoverTrigger && 'eds-hover-tooltip-trigger__target--primary',
          ]"
        >
          <span ref="contentRef" :class="styles.paragraphOverflowText">{{ sampleText }}</span>
        </span>
      </span>
    </EgTooltip>
  </div>
</template>
