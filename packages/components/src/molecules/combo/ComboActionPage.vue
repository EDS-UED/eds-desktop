<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '../../atoms/divider';
import '../../styles/frostedPageChrome.css';
import ComboActionPageActions from './ComboActionPageActions.vue';
import type { ButtonVariant } from '../button/Button.vue';
import styles from './ComboAction.module.css';

export type ComboActionPageTone = 'brand' | 'decor';

const props = withDefaults(
  defineProps<{
    tone?: ComboActionPageTone;
    variant?: ButtonVariant;
    divider?: boolean;
    /** Page 底栏毛玻璃（与 ToolBar / Paginer 同套 page chrome）；用于 EgLayout #paginer 叠层。 */
    pageChrome?: boolean;
    direction?: 'left' | 'right';
    /** Page 场景按钮组左侧 28px 外边距。 */
    actionsLeadingInset?: boolean;
    loading?: boolean;
    confirmDisabled?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    divider: false,
    pageChrome: false,
    direction: 'right',
    actionsLeadingInset: false,
    loading: false,
    confirmDisabled: false,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const pageRootAlignClass = computed(() =>
  props.direction === 'left' ? styles.pageRootAlignStart : styles.pageRootAlignEnd,
);

const pageActionsRowClass = computed(() => [
  styles.pageActions,
  props.pageChrome && styles.pageActionsInChrome,
  props.direction === 'left' ? styles.pageActionsLeft : styles.pageActionsRight,
]);

const pageActionsGroupClass = computed(() => [
  styles.pageActionsGroup,
  props.direction === 'right' && styles.pageActionsGroupAtRight,
  props.actionsLeadingInset &&
    props.direction === 'left' &&
    styles.pageActionsGroupLeadingInset,
]);

const actionBindings = computed(() => ({
  tone: props.tone,
  variant: props.variant,
  direction: props.direction,
  loading: props.loading,
  confirmDisabled: props.confirmDisabled,
  confirmLabel: props.confirmLabel,
  cancelLabel: props.cancelLabel,
}));
</script>

<template>
  <footer
    v-if="pageChrome"
    class="eds-combo-page-button"
    :class="[styles.pageChromeRoot, pageRootAlignClass]"
  >
    <EgDivider
      v-if="divider"
      :class="[styles.divider, styles.dividerAnimated]"
      type="module"
      direction="horizontal"
    />
    <div :class="['eds-frosted-page-chrome', styles.pageChromeFrosted]">
      <div :class="pageActionsRowClass">
        <div :class="pageActionsGroupClass">
          <ComboActionPageActions
            v-bind="actionBindings"
            @confirm="emit('confirm')"
            @cancel="emit('cancel')"
          />
        </div>
      </div>
    </div>
  </footer>
  <div
    v-else-if="divider"
    :class="[styles.pageRoot, pageRootAlignClass]"
  >
    <EgDivider
      :class="[styles.divider, styles.dividerAnimated]"
      type="module"
      direction="horizontal"
    />
    <div :class="pageActionsRowClass">
      <div :class="pageActionsGroupClass">
        <ComboActionPageActions
          v-bind="actionBindings"
          @confirm="emit('confirm')"
          @cancel="emit('cancel')"
        />
      </div>
    </div>
  </div>
  <div v-else :class="pageActionsRowClass">
    <div :class="pageActionsGroupClass">
      <ComboActionPageActions
        v-bind="actionBindings"
        @confirm="emit('confirm')"
        @cancel="emit('cancel')"
      />
    </div>
  </div>
</template>
