<script setup lang="ts">
import { computed } from 'vue';
import { EgIconButton } from '../icon-button';
import { EgMessage, type MessageType } from '../feedback';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import styles from './IconButtonPro.module.css';

const props = withDefaults(
  defineProps<{
    label: string;
    badge?: string | number;
    showBadge?: boolean;
    showReddot?: boolean;
    disabled?: boolean;
    /** 浮层展开等选中态；背景 `--event-focus`。 */
    active?: boolean;
    type?: 'button' | 'submit' | 'reset';
    /** showBadge 时 EgMessage 的 type。 */
    messageType?: MessageType;
  }>(),
  {
    badge: 0,
    showBadge: false,
    showReddot: false,
    disabled: false,
    active: false,
    type: 'button',
    messageType: 'brand',
  },
);

const formattedBadge = computed(() => formatGroupedNumber(props.badge));

const showBadgeIndicator = computed(() => props.showBadge);
const showReddotIndicator = computed(() => props.showReddot && !props.showBadge);
</script>

<template>
  <button
    :class="[
      'eds-icon-button-pro',
      styles.root,
      active && styles.active,
      disabled && styles.disabled,
    ]"
    :disabled="disabled"
    :type="type"
    :aria-label="label"
  >
    <span :class="styles.iconSlot" data-eds-trigger-metrics>
      <!-- Nested Simple container; as=span avoids invalid button-in-button. -->
      <EgIconButton
        as="span"
        shape="rectangular"
        size="sm"
        :label="label"
        :disabled="disabled"
      >
        <slot />
      </EgIconButton>
      <span v-if="showBadgeIndicator" :class="styles.badge" aria-hidden="true">
        <EgMessage :type="messageType" :text="formattedBadge" />
      </span>
      <span v-if="showReddotIndicator" :class="styles.reddot" aria-hidden="true" />
    </span>
    <span :class="styles.labelWrap">
      <span :class="styles.labelPaint" aria-hidden="true">{{ label }}</span>
      <span :class="styles.labelSizer">{{ label }}</span>
    </span>
  </button>
</template>
