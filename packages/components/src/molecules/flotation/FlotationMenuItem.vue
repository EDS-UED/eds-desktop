<script setup lang="ts">
import { computed, provide, useSlots } from 'vue';
import { EgCrypto, type CryptoName } from '../../atoms/crypto';
import { EgIcon } from '../../atoms/icons';
import { EgCheckbox } from '../toggle';
import { EgMessage, EgReddot, type MessageType } from '../feedback';
import { MESSAGE_PARENT_FOCUSED_KEY } from '../feedback/messageFocusContext';
import { EgTag, type TagStatus } from '../tag';
import styles from './Flotation.module.css';

/**
 * Figma Box Type（2059:4167）
 * - text：文案行
 * - symbol-text：前置 EgIcon + 文案
 * - image-text：前置图像/币种图标 + 文案（可带 Message）
 */
export type FlotationBoxType = 'text' | 'symbol-text' | 'image-text';

const props = withDefaults(
  defineProps<{
    /** 预置布局类型；#content 内可完全替换本组件。 */
    boxType?: FlotationBoxType;
    label?: string;
    disabled?: boolean;
    focused?: boolean;
    showCheckbox?: boolean;
    checked?: boolean;
    /** 文案使用 --text-danger-primary（Batch Bar 危险 Label 等）。 */
    danger?: boolean;
    showTag?: boolean;
    tagText?: string;
    /** 嵌套 EgTag family=status size=sm */
    tagStatus?: TagStatus;
    showReddot?: boolean;
    showCascader?: boolean;
    showMessage?: boolean;
    messageText?: string;
    messageType?: MessageType;
    symbolIcon?: string;
    /** 文案区允许多行换行（场景化地址等长文本）。 */
    labelWrap?: boolean;
    /** 行内嵌套 EgIconButton 等交互控件时用 div，避免 button 嵌套导致复制等点击失效。 */
    hostTag?: 'button' | 'div';
  }>(),
  {
    boxType: 'text',
    label: 'Label',
    disabled: false,
    focused: false,
    showCheckbox: false,
    checked: false,
    danger: false,
    showTag: true,
    tagText: 'Tag',
    tagStatus: 'danger',
    showReddot: false,
    showCascader: false,
    showMessage: false,
    messageText: '0',
    messageType: 'subtle',
    symbolIcon: 'eds-add',
    labelWrap: false,
    hostTag: 'button',
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
  'update:checked': [value: boolean];
}>();

const slots: ReturnType<typeof useSlots> = useSlots();

const showLeading = computed(
  () =>
    Boolean(slots.leading) ||
    props.boxType === 'symbol-text' ||
    props.boxType === 'image-text',
);

const showTrailing = computed(
  () =>
    props.showReddot ||
    props.showCascader ||
    props.showMessage ||
    Boolean(slots.trailing) ||
    Boolean(slots.message),
);

const leadingAsset = computed(() => props.symbolIcon);

const leadingCryptoName = computed(() => leadingAsset.value as CryptoName);

const itemClass = computed(() => [
  styles.boxRoot,
  props.labelWrap && styles.boxRootLabelWrap,
  props.focused && styles.boxFocused,
  props.disabled && styles.boxDisabled,
]);

const isRowFocused = computed(() => props.focused);
provide(MESSAGE_PARENT_FOCUSED_KEY, isRowFocused);

function onClick(event: MouseEvent) {
  if (props.disabled) return;
  emit('click', event);
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  emit('click', event as unknown as MouseEvent);
}
</script>

<template>
  <component
    :is="hostTag"
    :type="hostTag === 'button' ? 'button' : undefined"
    class="eds-flotation-menu-item"
    :class="itemClass"
    :disabled="hostTag === 'button' ? disabled : undefined"
    :aria-disabled="hostTag === 'div' && disabled ? true : undefined"
    :role="hostTag === 'div' ? 'menuitem' : undefined"
    :tabindex="hostTag === 'div' && !disabled ? 0 : undefined"
    :aria-pressed="hostTag === 'button' && (focused || undefined)"
    @click="onClick"
    @keydown="hostTag === 'div' ? onKeydown : undefined"
  >
    <span
      v-if="showCheckbox || slots.checkbox"
      :class="styles.boxCheckbox"
      @click.stop
    >
      <slot name="checkbox">
        <EgCheckbox
          :model-value="checked"
          :disabled="disabled"
          @update:model-value="emit('update:checked', $event)"
        />
      </slot>
    </span>

    <span v-if="showLeading" :class="styles.boxLeading">
      <slot name="leading">
        <EgCrypto
          v-if="boxType === 'image-text'"
          :name="leadingCryptoName"
          size="sm"
          fit
        />
        <EgIcon v-else :name="leadingAsset" size="sm" fit />
      </slot>
    </span>

    <span
      :class="[
        styles.boxMain,
        showTrailing && styles.boxMainGrow,
        labelWrap && styles.boxMainLabelWrap,
      ]"
    >
      <span
        :class="[
          styles.boxLabel,
          danger && styles.boxLabelDanger,
          labelWrap && styles.boxLabelWrap,
        ]"
      >
        <slot>{{ label }}</slot>
      </span>
      <span v-if="showTag || slots.tag" :class="styles.boxTag">
        <slot name="tag">
          <EgTag family="status" size="sm" :status="tagStatus">{{ tagText }}</EgTag>
        </slot>
      </span>
    </span>

    <span v-if="showTrailing" :class="styles.boxTrailing">
      <slot name="trailing">
        <span v-if="showMessage || slots.message" :class="styles.boxMessage">
          <slot name="message">
            <EgMessage :type="messageType" :text="messageText" />
          </slot>
        </span>
        <EgReddot v-if="showReddot" />
        <span v-if="showCascader" :class="styles.boxCascader" aria-hidden="true">
          <EgIcon name="eds-arrow-right-mini-ios" size="sm" fit />
        </span>
      </slot>
    </span>
  </component>
</template>
