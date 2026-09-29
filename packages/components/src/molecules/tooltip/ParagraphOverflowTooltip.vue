<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import EgTooltip, { type TooltipTrigger } from './AnchoredTooltip.vue';
import styles from './ParagraphOverflowTooltip.module.css';

const PARAGRAPH_OVERFLOW_TOOLTIP_MAX_WIDTH = 360;

const props = withDefaults(
  defineProps<{
    text?: string;
    trigger?: TooltipTrigger;
    lineClamp?: number;
    maxWidth?: number;
    disabled?: boolean;
  }>(),
  {
    text: '',
    trigger: 'hover',
    lineClamp: 2,
    maxWidth: PARAGRAPH_OVERFLOW_TOOLTIP_MAX_WIDTH,
    disabled: false,
  },
);

const contentRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const tooltipText = ref('');
let resizeObserver: ResizeObserver | null = null;

const showHoverTrigger = computed(() => overflowing.value && !props.disabled);

const contentStyle = computed(() => ({
  WebkitLineClamp: String(props.lineClamp),
}));

const tokenScopeClass = computed(
  () => `desktopTokens eds-overflow-text-tooltip ${styles.panel}`,
);

function measureOverflow() {
  const el = contentRef.value;
  if (!el) {
    overflowing.value = false;
    tooltipText.value = '';
    return;
  }
  overflowing.value = el.scrollHeight > el.clientHeight + 1;
  tooltipText.value = el.textContent?.trim() || props.text;
}

function bindResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (!contentRef.value) return;
  resizeObserver = new ResizeObserver(() => measureOverflow());
  resizeObserver.observe(contentRef.value);
}

watch(
  () => props.text,
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
  <div :class="styles.host">
    <EgTooltip
      :content="tooltipText"
      panel-kind="flotation"
      :trigger="trigger"
      placement="bottom"
      :disabled="disabled || !overflowing || !tooltipText"
      width-mode="adaptive"
      :max-width="maxWidth"
      height-mode="adaptive"
      :scrollable="false"
      :token-scope-class="tokenScopeClass"
    >
      <span
        :class="[
          styles.triggerWrap,
          showHoverTrigger && 'eds-hover-tooltip-trigger',
        ]"
      >
        <span
          :class="[
            styles.trigger,
            showHoverTrigger && 'eds-hover-tooltip-trigger__target',
            showHoverTrigger && 'eds-hover-tooltip-trigger__target--primary',
          ]"
        >
          <span
            ref="contentRef"
            :class="styles.text"
            :style="contentStyle"
          >
            <slot>{{ text }}</slot>
          </span>
        </span>
      </span>
    </EgTooltip>
  </div>
</template>
