<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
  computed,
} from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import { EgButton, EgDivider, EgIcon, EgIconButton, type ButtonTone, type ButtonVariant } from '@eds/desktop-components';
import comboActionStyles from '../../../../../../packages/components/src/molecules/combo/ComboAction.module.css';
import chromeScrimStyles from '../../../../../../packages/components/src/styles/popupChromeScrim.module.css';
import '../../../../../../packages/components/src/styles/popupInnerBackdrop.css';
import { popupCustomContentInsetPresets } from './popupDocCustomize';
import styles from './PopupCustomSlotChromePreview.module.css';

const props = withDefaults(
  defineProps<{
    showSystemBarClose?: boolean;
    showToolbar?: boolean;
    showToolbarButtons?: boolean;
    showToolbarCancel?: boolean;
    showScrollBody?: boolean;
    toolbarTone?: 'brand' | 'decor' | 'danger';
    toolbarVariant?: ButtonVariant;
    toolbarCancelTone?: ButtonTone;
    toolbarCancelVariant?: ButtonVariant;
    toolbarConfirmLabel?: string;
    toolbarCancelLabel?: string;
    toolbarDirection?: 'left' | 'right';
    toolbarDividerPinned?: boolean;
    contentInsetPreset?: 'lg' | 'md' | 'sm' | 'xs';
  }>(),
  {
    showSystemBarClose: true,
    showToolbar: true,
    showToolbarButtons: true,
    showToolbarCancel: true,
    showScrollBody: true,
    toolbarTone: 'decor',
    toolbarVariant: 'solid',
    toolbarCancelVariant: 'text',
    toolbarConfirmLabel: 'Confirm',
    toolbarCancelLabel: 'Cancel',
    toolbarDirection: 'right',
    toolbarDividerPinned: false,
    contentInsetPreset: 'lg',
  },
);

const emit = defineEmits<{
  close: [];
  toolbarCancel: [];
  toolbarConfirm: [];
}>();

const slots = useSlots();

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const closeButtonLabel = showcaseText('Close', '关闭');
const defaultSlotBodyText = showcaseText(
  'Popup Box default slot · Business content area',
  'Popup Box 默认插槽 · 业务内容区',
);

const resolvedCloseButtonLabel = computed(() => {
  void locale.value;
  return display(closeButtonLabel);
});

const resolvedDefaultSlotBodyText = computed(() => {
  void locale.value;
  return display(defaultSlotBodyText);
});

const SCROLL_EDGE_EPSILON = 2;

const scrollRef = ref<HTMLElement | null>(null);
const scrollContentRef = ref<HTMLElement | null>(null);
const scrollFadeTop = ref(false);
const scrollOverflows = ref(false);
let scrollResizeObserver: ResizeObserver | undefined;

const resolvedToolbarCancelTone = (): ButtonTone =>
  props.toolbarCancelTone ?? props.toolbarTone;

const showToolbarDivider = computed(
  () => scrollOverflows.value || props.toolbarDividerPinned,
);

function updateScrollState() {
  const element = scrollRef.value;

  if (!element) {
    scrollFadeTop.value = false;
    scrollOverflows.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  const hasHiddenContentBelow =
    canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;

  scrollOverflows.value = hasHiddenContentBelow;
  scrollFadeTop.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
}

function scheduleScrollStateUpdate() {
  void nextTick(updateScrollState);
}

function onScroll() {
  updateScrollState();
}

function observeScrollTargets() {
  scrollResizeObserver?.disconnect();
  scrollResizeObserver = new ResizeObserver(() => {
    updateScrollState();
  });
  if (scrollRef.value) {
    scrollResizeObserver.observe(scrollRef.value);
  }
  if (scrollContentRef.value) {
    scrollResizeObserver.observe(scrollContentRef.value);
  }
  updateScrollState();
}

onMounted(() => {
  scheduleScrollStateUpdate();
  observeScrollTargets();
});

watch(scrollRef, () => {
  observeScrollTargets();
});

watch(scrollContentRef, () => {
  observeScrollTargets();
});

watch(
  () => [props.showScrollBody, props.showToolbar] as const,
  scheduleScrollStateUpdate,
);

onBeforeUnmount(() => {
  scrollResizeObserver?.disconnect();
});
</script>

<template>
  <div
    class="eds-popup-slot-chrome eds-popup-inner-backdrop"
    :class="styles.root"
    data-no-corner-smoothing
  >
    <div v-if="showSystemBarClose" :class="styles.systemBarClose">
      <EgIconButton
        shape="square"
        size="md"
        :label="resolvedCloseButtonLabel"
        motion="asym"
        @click="emit('close')"
      >
        <EgIcon name="eds-close-circle-fill" fit />
      </EgIconButton>
    </div>

    <div
      ref="scrollRef"
      :class="[
        styles.scroll,
        scrollFadeTop && styles.scrollFadeTop,
      ]"
      @scroll="onScroll"
    >
      <div
        :class="[styles.scrollTopEdge, scrollFadeTop && styles.scrollTopEdgeVisible]"
        aria-hidden="true"
      />

      <div
        ref="scrollContentRef"
        :class="styles.scrollBody"
        :style="{ padding: popupCustomContentInsetPresets[contentInsetPreset] }"
      >
        <div :class="styles.slotHost">
          <slot>
            <div v-if="showScrollBody" :class="styles.scrollDemoBody">
              <p>{{ resolvedDefaultSlotBodyText }}</p>
              <div
                v-for="index in 12"
                :key="index"
                :class="styles.scrollDemoLine"
              />
            </div>
          </slot>
        </div>
      </div>
    </div>

    <footer
      v-if="showToolbar || slots.toolbar || slots['toolbar-actions']"
      :class="[
        styles.toolbar,
        chromeScrimStyles.root,
        scrollOverflows && chromeScrimStyles.active,
      ]"
    >
      <div :class="chromeScrimStyles.content">
        <EgDivider
          :class="[
            comboActionStyles.divider,
            comboActionStyles.dividerAnimated,
            !showToolbarDivider && comboActionStyles.dividerAnimatedHidden,
          ]"
          type="module"
          direction="horizontal"
          :hide="!showToolbarDivider"
        />
        <div :class="styles.toolbarBar">
          <div v-if="slots.toolbar" :class="styles.toolbarLeading">
            <slot name="toolbar" />
          </div>
          <div
            v-if="slots['toolbar-actions'] || showToolbarButtons"
            :class="[
              styles.toolbarActions,
              toolbarDirection === 'left' && styles.toolbarActionsLeft,
              toolbarDirection === 'right' && styles.toolbarActionsRight,
              slots.toolbar && styles.toolbarActionsWithLeading,
            ]"
          >
            <slot name="toolbar-actions" />
            <template v-if="showToolbarButtons">
              <EgButton
                v-if="showToolbarCancel"
                :tone="resolvedToolbarCancelTone()"
                :variant="toolbarCancelVariant"
                size="md"
                @click="emit('toolbarCancel')"
              >
                {{ toolbarCancelLabel }}
              </EgButton>
              <EgButton
                :tone="toolbarTone"
                :variant="toolbarVariant"
                size="md"
                @click="emit('toolbarConfirm')"
              >
                {{ toolbarConfirmLabel }}
              </EgButton>
            </template>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
