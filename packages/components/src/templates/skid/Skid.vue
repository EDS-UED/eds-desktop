<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import { SKID_REQUEST_CLOSE_KEY } from '../../shared/skidContext';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import {
  EgComboButton,
  type ComboActionSkidTone,
} from '../../molecules/combo';
import styles from './Skid.module.css';
import '../../styles/frostedPageChrome.css';
import '../../styles/scrollAreaHiddenScrollbar.css';

const props = withDefaults(
  defineProps<{
    title?: string;
    showButton?: boolean;
    actionTone?: ComboActionSkidTone;
    confirmLabel?: string;
  }>(),
  {
    title: 'Title',
    showButton: true,
    actionTone: 'decor',
    confirmLabel: 'Confirm',
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const requestLayoutSkidClose = inject(SKID_REQUEST_CLOSE_KEY, undefined);

function onCloseClick() {
  emit('close');
  requestLayoutSkidClose?.();
}

const scrollRef = ref<HTMLElement | null>(null);
const bodyCanScroll = ref(false);
const bodyScrollTop = ref(0);
const bodyClientHeight = ref(0);
const bodyScrollHeight = ref(0);

const SCROLL_EDGE_EPSILON = 2;

const titleScrollDividerReserved = computed(() => bodyCanScroll.value);
const titleScrollDividerVisible = computed(
  () => bodyCanScroll.value && bodyScrollTop.value > SCROLL_EDGE_EPSILON,
);
const actionDividerVisible = computed(
  () =>
    props.showButton &&
    bodyCanScroll.value &&
    bodyScrollTop.value + bodyClientHeight.value <
      bodyScrollHeight.value - SCROLL_EDGE_EPSILON,
);

let resizeObserver: ResizeObserver | undefined;
const observedElements = new Set<Element>();

function updateScrollDividers() {
  const region = scrollRef.value;

  if (!region) {
    bodyCanScroll.value = false;
    bodyScrollTop.value = 0;
    bodyClientHeight.value = 0;
    bodyScrollHeight.value = 0;
    return;
  }

  const { scrollTop, clientHeight, scrollHeight } = region;
  bodyCanScroll.value = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  bodyScrollTop.value = scrollTop;
  bodyClientHeight.value = clientHeight;
  bodyScrollHeight.value = scrollHeight;
}

function scheduleScrollDividerCheck() {
  nextTick(() => {
    requestAnimationFrame(updateScrollDividers);
  });
}

function observeBodyOverflow() {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      scheduleScrollDividerCheck();
    });
  }

  const region = scrollRef.value;
  if (!region || observedElements.has(region)) return;
  resizeObserver.observe(region);
  observedElements.add(region);
}

function onPanelScroll() {
  updateScrollDividers();
}

onMounted(() => {
  observeBodyOverflow();
  scheduleScrollDividerCheck();
});

onUpdated(() => {
  observeBodyOverflow();
  scheduleScrollDividerCheck();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  observedElements.clear();
});
</script>

<template>
  <aside class="eds-skid" :class="styles.root" aria-label="Skid panel">
    <div :class="styles.pageBg" aria-hidden="true">
      <EgDivider direction="vertical" />
    </div>
    <div ref="scrollRef" :class="['eds-scroll-area-hidden-scrollbar', styles.panel]" @scroll="onPanelScroll">
      <header :class="[styles.title, titleScrollDividerVisible && 'eds-frosted-page-chrome']">
        <div :class="styles.heading">
          <p :class="styles.titleText">{{ title }}</p>
          <EgIconButton
            :class="styles.closeAction"
            label="关闭"
            size="md"
            @click="onCloseClick"
          >
            <EgIcon name="eds-close" fit />
          </EgIconButton>
        </div>
        <EgDivider
          v-if="titleScrollDividerReserved"
          :class="styles.titleDivider"
          :hide="!titleScrollDividerVisible"
        />
      </header>
      <div :class="styles.body">
        <slot />
      </div>
      <footer v-if="showButton" :class="[styles.action, actionDividerVisible && 'eds-frosted-page-chrome']">
        <slot name="action">
          <EgComboButton
            :tone="actionTone"
            :divider="actionDividerVisible"
            :confirm-label="confirmLabel"
            @confirm="emit('confirm')"
          />
        </slot>
      </footer>
    </div>
  </aside>
</template>
