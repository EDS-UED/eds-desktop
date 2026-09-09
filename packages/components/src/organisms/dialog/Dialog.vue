<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgComboFloatButton, EgComboPopupButton } from '../../molecules/combo';
import chromeScrimStyles from '../../styles/popupChromeScrim.module.css';
import '../../styles/popupInnerBackdrop.css';
import styles from './Dialog.module.css';

export type DialogType = 'symbol' | 'compose' | 'standard';

type DialogTypeInput = DialogType | 'slot';

function normalizeDialogType(type?: DialogTypeInput): DialogType {
  if (type === 'slot') return 'compose';
  return type ?? 'symbol';
}

const props = withDefaults(
  defineProps<{
    type?: DialogTypeInput;
    title?: string;
    secondaryText?: string;
    showSecondaryText?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    actionCount?: 1 | 2;
    showClear?: boolean;
    clearLabel?: string;
    toolbarTone?: 'brand' | 'decor';
    toolbarVariant?: 'solid' | 'outline' | 'text';
    /** Compose / Standard · true 时工具栏顶部分割线常驻；false 时仅在底部仍有内容被裁切时显示。未传时 Compose 默认 true、Standard 默认 false。 */
    toolbarDividerPinned?: boolean;
  }>(),
  {
    type: 'symbol',
    title: 'Title',
    secondaryText: 'This is a description',
    showSecondaryText: true,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    actionCount: 2,
    showClear: false,
    clearLabel: 'Clear',
    toolbarTone: 'decor',
    toolbarVariant: 'solid',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  clear: [];
}>();

const SCROLL_EDGE_EPSILON = 2;

const scrollRef = ref<HTMLElement | null>(null);
const scrollOverflows = ref(false);

const dialogType = computed(() => normalizeDialogType(props.type));

const resolvedToolbarDividerPinned = computed(
  () => props.toolbarDividerPinned ?? dialogType.value === 'compose',
);

const showToolbarDivider = computed(
  () => scrollOverflows.value || resolvedToolbarDividerPinned.value,
);

const rootLayoutClass = computed(() => {
  if (dialogType.value === 'compose') return styles.composeLayout;
  if (dialogType.value === 'standard') return styles.standardLayout;
  return styles.symbolLayout;
});

let scrollResizeObserver: ResizeObserver | undefined;

function updateScrollState() {
  const element = scrollRef.value;

  if (!element) {
    scrollOverflows.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  scrollOverflows.value =
    canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;
}

function scheduleScrollStateUpdate() {
  void nextTick(updateScrollState);
}

function onScroll() {
  updateScrollState();
}

onMounted(() => {
  scheduleScrollStateUpdate();
  if (typeof ResizeObserver !== 'undefined' && scrollRef.value) {
    scrollResizeObserver = new ResizeObserver(scheduleScrollStateUpdate);
    scrollResizeObserver.observe(scrollRef.value);
  }
});

onBeforeUnmount(() => {
  scrollResizeObserver?.disconnect();
});

watch(
  () => [dialogType.value, props.showSecondaryText, props.secondaryText, props.title],
  scheduleScrollStateUpdate,
);
</script>

<template>
  <div
    class="eds-dialog eds-popup-inner-backdrop"
    :class="[styles.root, rootLayoutClass]"
    :data-dialog-type="dialogType"
    role="dialog"
    aria-modal="true"
  >
    <template v-if="dialogType === 'symbol'">
      <div :class="styles.symbolBody">
        <div :class="[styles.symbol, 'eds-dialog-symbol']">
          <slot name="symbol">
            <EgIcon name="eds-warning-lonely" size="lg" />
          </slot>
        </div>

        <div :class="[styles.symbolCopy, 'eds-dialog-info-copy']">
          <p :class="styles.symbolTitle">{{ title }}</p>
          <p v-if="showSecondaryText" :class="styles.symbolSecondary">
            {{ secondaryText }}
          </p>
        </div>

        <div :class="[styles.symbolActions, 'eds-dialog-info-actions']">
          <slot name="actions">
            <EgComboPopupButton
              :tone="toolbarTone"
              :variant="toolbarVariant"
              :count="actionCount"
              :confirm-label="confirmLabel"
              :cancel-label="cancelLabel"
              @confirm="emit('confirm')"
              @cancel="emit('cancel')"
            />
          </slot>
        </div>
      </div>
    </template>

    <template v-else-if="dialogType === 'standard'">
      <div ref="scrollRef" :class="styles.scrollRoot" @scroll="onScroll">
        <div :class="styles.scrollContent">
          <div :class="styles.standardCopy">
            <p :class="styles.dialogTitle">{{ title }}</p>
            <p v-if="showSecondaryText" :class="styles.standardBodyText">
              {{ secondaryText }}
            </p>
          </div>

          <div v-if="$slots.default" :class="styles.composeBody">
            <slot />
          </div>
        </div>

        <footer
          :class="[
            styles.dialogToolbar,
            !scrollOverflows && styles.dialogToolbarSolid,
            chromeScrimStyles.root,
            scrollOverflows && chromeScrimStyles.active,
          ]"
        >
          <div :class="chromeScrimStyles.content">
            <slot name="actions">
              <EgComboFloatButton
                bar-padding="inset-5"
                :tone="toolbarTone"
                :variant="toolbarVariant"
                :divider="showToolbarDivider"
                :clear="showClear"
                :confirm-label="confirmLabel"
                :cancel-label="cancelLabel"
                @confirm="emit('confirm')"
                @cancel="emit('cancel')"
                @clear="emit('clear')"
              />
            </slot>
          </div>
        </footer>
      </div>
    </template>

    <template v-else>
      <div ref="scrollRef" :class="styles.scrollRoot" @scroll="onScroll">
        <div :class="styles.scrollContent">
          <div :class="styles.composeCopy">
            <p :class="styles.dialogTitle">{{ title }}</p>
            <p v-if="showSecondaryText" :class="styles.composeBar">
              {{ secondaryText }}
            </p>
          </div>

          <div v-if="$slots.default" :class="styles.composeBody">
            <slot />
          </div>
        </div>

        <footer
          :class="[
            styles.dialogToolbar,
            !scrollOverflows && styles.dialogToolbarSolid,
            chromeScrimStyles.root,
            scrollOverflows && chromeScrimStyles.active,
          ]"
        >
          <div :class="chromeScrimStyles.content">
            <slot name="actions">
              <EgComboFloatButton
                :tone="toolbarTone"
                :variant="toolbarVariant"
                :divider="showToolbarDivider"
                :clear="showClear"
                :confirm-label="confirmLabel"
                :cancel-label="cancelLabel"
                @confirm="emit('confirm')"
                @cancel="emit('cancel')"
                @clear="emit('clear')"
              />
            </slot>
          </div>
        </footer>
      </div>
    </template>
  </div>
</template>
