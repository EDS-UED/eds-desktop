<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgButton, type ButtonSize } from '../button';
import { EgIconButton } from '../icon-button';
import { EgPopover } from '../popovers';
import { EgTooltip } from '../tooltip';
import {
  FLOTATION_OVERFLOW_CLOSE_DELAY,
  TEXT_OVERFLOW_TOOLTIP_MAX_WIDTH,
} from '../tooltip/textOverflowTooltipConstants';
import { FALLBACK_SPACING_1_PX } from '../../shared/cssSpacingTokens';
import { OVERFLOW_EPSILON } from '../../utils/overflowTextMeasure';
import styles from './Input.module.css';

export type InputType = 'standard' | 'amount';
export type InputSize = 'lg' | 'md' | 'sm';
export type InputWidthMode = 'fixed' | 'full';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    type?: InputType;
    size?: InputSize;
    widthMode?: InputWidthMode;
    placeholder?: string;
    amountPlaceholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    unit?: string;
    clearable?: boolean;
    secure?: boolean;
    showMax?: boolean;
    maxLabel?: string;
    inputmode?: 'text' | 'decimal' | 'numeric';
    /** 内容溢出时在输入框上方 Popover 展示完整值。 */
    overflowFeedback?: boolean;
  }>(),
  {
    modelValue: '',
    type: 'standard',
    size: 'md',
    widthMode: 'fixed',
    placeholder: '请输入',
    amountPlaceholder: '0',
    disabled: false,
    readonly: false,
    clearable: true,
    secure: false,
    showMax: false,
    maxLabel: 'Max',
    inputmode: undefined,
    overflowFeedback: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
  max: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  'overflow-change': [overflowing: boolean];
}>();

const slots = useSlots();
const inputRef = ref<HTMLInputElement | null>(null);
const fieldRef = ref<HTMLElement | null>(null);
const fieldFocused = ref(false);
const suppressBlur = ref(false);
const passwordVisible = ref(false);
const unitLeftPx = ref(0);
const valueWidthPx = ref(0);
const unitWidthPx = ref(0);
const valueOverflowing = ref(false);
const overflowScrollFadeLeft = ref(false);
const overflowScrollFadeRight = ref(false);
const overflowTeleportTo = ref<string | HTMLElement>('body');
const overflowBoundarySelector = ref<string | undefined>(undefined);
const fieldHovered = ref(false);
const SCROLL_EDGE_EPSILON = 2;
const overflowAnchorRef = ref<{
  openPanel?: () => void;
  close?: () => void;
  updatePosition?: () => void;
} | null>(null);
let overflowResizeObserver: ResizeObserver | undefined;

/** Inline — WebKit often omits stylesheet text-rendering on native inputs in Computed. */
const inputRenderStyle = {
  textRendering: 'geometricPrecision',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
} as const;

const isAmount = computed(() => props.type === 'amount');

/** Max suffix: Input Lg/Md/Sm → Button Md/Sm/Xs (Subtle solid). */
const maxButtonSize = computed<ButtonSize>(() => {
  switch (props.size) {
    case 'lg':
      return 'md';
    case 'md':
      return 'sm';
    default:
      return 'xs';
  }
});

/** Amount + unit: unit trails the typed value (follows caret), not right-aligned. */
const useGhostUnit = computed(() => isAmount.value && Boolean(props.unit));

const resolvedInputMode = computed(
  () => props.inputmode ?? (isAmount.value ? 'decimal' : 'text'),
);

const resolvedPlaceholder = computed(() => {
  if (useGhostUnit.value) {
    return `${props.amountPlaceholder} ${props.unit}`;
  }

  return isAmount.value ? props.amountPlaceholder : props.placeholder;
});

const resolvedInputType = computed(() => {
  if (!props.secure) {
    return 'text';
  }
  return passwordVisible.value ? 'text' : 'password';
});

const showSecureToggle = computed(() => props.secure && !slots.suffix);

const showClear = computed(
  () =>
    !props.secure &&
    props.clearable &&
    fieldFocused.value &&
    !props.disabled &&
    !props.readonly &&
    props.modelValue.length > 0,
);

const showInlineUnit = computed(
  () => Boolean(props.unit) && !useGhostUnit.value,
);

const showGhostUnit = computed(
  () => useGhostUnit.value && props.modelValue.length > 0,
);

/** Reserve clear width when suffix siblings (inline unit / Max / custom) may sit beside it. */
const reserveClearSpace = computed(
  () =>
    props.clearable &&
    (showInlineUnit.value || props.showMax || Boolean(slots.suffix)),
);

const showDefaultSuffix = computed(
  () =>
    showClear.value ||
    reserveClearSpace.value ||
    showInlineUnit.value ||
    showSecureToggle.value,
);

const showSuffix = computed(
  () => Boolean(slots.suffix) || showDefaultSuffix.value,
);

/** Max 预置：在 field 外单独挂载，不参与 field padding 计算 */
const showAttachedMax = computed(
  () => props.showMax && !slots.suffix,
);

const amountControlStyle = computed(() => {
  if (!useGhostUnit.value) {
    return undefined;
  }

  const gap = 4;

  if (props.modelValue.length > 0) {
    return {
      '--eds-input-unit-left': `${unitLeftPx.value}px`,
      width: `${valueWidthPx.value + gap + unitWidthPx.value}px`,
    };
  }

  if (props.widthMode === 'full') {
    return {
      '--eds-input-unit-left': '0px',
    };
  }

  if (valueWidthPx.value > 0) {
    return {
      '--eds-input-unit-left': '0px',
      width: `${valueWidthPx.value}px`,
    };
  }

  return undefined;
});

/** Ghost unit: size the native input to the typed value so the unit trails the caret. */
const shrinkInputStyle = computed(() => {
  if (!useGhostUnit.value) {
    return undefined;
  }

  if (props.modelValue.length > 0) {
    return { width: `${Math.max(valueWidthPx.value, 1)}px` };
  }

  if (props.widthMode === 'full') {
    return undefined;
  }

  if (valueWidthPx.value > 0) {
    return { width: `${valueWidthPx.value}px` };
  }

  return undefined;
});

const amountControlEmptyFull = computed(
  () =>
    useGhostUnit.value &&
    props.widthMode === 'full' &&
    props.modelValue.length === 0,
);

const outerRootClasses = computed(() => {
  if (props.overflowFeedback) {
    return [
      styles.overflowFeedbackRoot,
      props.widthMode === 'full' && styles.widthFull,
    ];
  }

  return [
    styles.root,
    props.widthMode === 'full' ? styles.widthFull : styles.widthFixed,
  ];
});

const innerRootClasses = computed(() =>
  props.overflowFeedback
    ? [
        styles.root,
        props.widthMode === 'full' ? styles.widthFull : styles.widthFixed,
      ]
    : undefined,
);

const overflowPopoverDisabled = computed(
  () =>
    !props.modelValue.trim()
    || !valueOverflowing.value
    || props.disabled,
);

function resolveOverflowMountContext() {
  const el = fieldRef.value;
  if (!el) {
    overflowTeleportTo.value = 'body';
    overflowBoundarySelector.value = undefined;
    return;
  }

  if (el.closest('.app-preview') instanceof HTMLElement) {
    overflowBoundarySelector.value = '.app-preview';
    overflowTeleportTo.value = '.app-preview';
    return;
  }

  if (el.closest('.eds-popup') instanceof HTMLElement) {
    overflowBoundarySelector.value = '.eds-popup';
    overflowTeleportTo.value = '.eds-popup';
    return;
  }

  if (el.closest('.eds-data-list') instanceof HTMLElement) {
    overflowBoundarySelector.value = '.eds-data-list';
    overflowTeleportTo.value = '.eds-data-list';
    return;
  }

  overflowTeleportTo.value = 'body';
  overflowBoundarySelector.value = undefined;
}

const overflowPopoverAnchorBind = computed(() => ({
  disabled: overflowPopoverDisabled.value,
  trigger: 'hover' as const,
  placement: 'top' as const,
  align: 'center' as const,
  wrapTooltip: false,
  /** 溢出反馈主轴间距 --spacing-1（4px）。 */
  offset: FALLBACK_SPACING_1_PX,
  openDelay: 0,
  closeDelay: FLOTATION_OVERFLOW_CLOSE_DELAY,
  teleportTo: overflowTeleportTo.value,
  boundarySelector: overflowBoundarySelector.value,
  flip: true,
}));

async function syncOverflowPopoverOpen() {
  if (!props.overflowFeedback) return;

  await nextTick();
  const anchor = overflowAnchorRef.value;
  if (!anchor) return;

  const shouldOpen =
    valueOverflowing.value
    && !props.disabled
    && props.modelValue.trim().length > 0
    && (fieldFocused.value || fieldHovered.value);

  if (shouldOpen) {
    anchor.openPanel?.();
    await nextTick();
    anchor.updatePosition?.();
    requestAnimationFrame(() => {
      anchor.updatePosition?.();
    });
    return;
  }

  if (
    !valueOverflowing.value
    || (!fieldFocused.value && !fieldHovered.value)
  ) {
    anchor.close?.();
  }
}

function onOverflowFieldPointerEnter() {
  fieldHovered.value = true;
  void syncOverflowPopoverOpen();
}

function onOverflowFieldPointerLeave() {
  fieldHovered.value = false;
  if (!fieldFocused.value) {
    void syncOverflowPopoverOpen();
  }
}

function measureTextWidth(text: string, source: HTMLElement) {
  const style = getComputedStyle(source);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return text.length * 8;
  }

  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return context.measureText(text).width;
}

function clearOverflowScrollFade() {
  overflowScrollFadeLeft.value = false;
  overflowScrollFadeRight.value = false;
}

function updateOverflowScrollFade() {
  if (!props.overflowFeedback) {
    clearOverflowScrollFade();
    return;
  }

  const input = inputRef.value;
  if (!input || !props.modelValue.trim()) {
    clearOverflowScrollFade();
    return;
  }

  const overflowing = input.scrollWidth > input.clientWidth + OVERFLOW_EPSILON;
  if (!overflowing) {
    clearOverflowScrollFade();
    return;
  }

  const { scrollLeft, scrollWidth, clientWidth } = input;
  overflowScrollFadeLeft.value = scrollLeft > SCROLL_EDGE_EPSILON;
  overflowScrollFadeRight.value =
    scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_EPSILON;
}

function measureValueOverflow() {
  if (!props.overflowFeedback) {
    valueOverflowing.value = false;
    clearOverflowScrollFade();
    return;
  }

  const input = inputRef.value;
  if (!input || !props.modelValue.trim()) {
    valueOverflowing.value = false;
    clearOverflowScrollFade();
    return;
  }

  valueOverflowing.value =
    input.scrollWidth > input.clientWidth + OVERFLOW_EPSILON;
  updateOverflowScrollFade();
}

const overflowScrollFadeClasses = computed(() => [
  overflowScrollFadeLeft.value && styles.prefixScrollFadeLeft,
  overflowScrollFadeRight.value && styles.prefixScrollFadeRight,
]);

function bindOverflowResizeObserver() {
  overflowResizeObserver?.disconnect();
  overflowResizeObserver = undefined;

  if (!props.overflowFeedback || typeof ResizeObserver === 'undefined') {
    return;
  }

  overflowResizeObserver = new ResizeObserver(() => {
    measureValueOverflow();
  });

  if (inputRef.value) {
    overflowResizeObserver.observe(inputRef.value);
  }
  if (fieldRef.value) {
    overflowResizeObserver.observe(fieldRef.value);
  }
}

function scheduleOverflowMeasure() {
  if (!props.overflowFeedback) {
    valueOverflowing.value = false;
    return;
  }

  void nextTick(() => {
    resolveOverflowMountContext();
    measureValueOverflow();
    bindOverflowResizeObserver();
    void syncOverflowPopoverOpen();
  });
}

function updateGhostUnitMetrics() {
  const input = inputRef.value;
  if (!input || !useGhostUnit.value || !props.unit) {
    unitLeftPx.value = 0;
    valueWidthPx.value = 0;
    unitWidthPx.value = 0;
    return;
  }

  const gap = 4;
  const value = props.modelValue;
  unitWidthPx.value = measureTextWidth(props.unit, input);

  if (value.length > 0) {
    valueWidthPx.value = measureTextWidth(value, input);
    unitLeftPx.value = valueWidthPx.value + gap;
  } else {
    valueWidthPx.value = measureTextWidth(resolvedPlaceholder.value, input);
    unitLeftPx.value = 0;
  }
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
  requestAnimationFrame(() => updateOverflowScrollFade());
}

function onInputScroll() {
  updateOverflowScrollFade();
}

function onFieldFocusIn() {
  fieldFocused.value = true;
  void syncOverflowPopoverOpen();
}

function onFieldFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement;
  if (field.contains(event.relatedTarget as Node)) {
    return;
  }

  fieldFocused.value = false;
  void syncOverflowPopoverOpen();
}

function onFocus(event: FocusEvent) {
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  if (suppressBlur.value) {
    return;
  }

  const field = fieldRef.value;
  if (field?.contains(event.relatedTarget as Node)) {
    return;
  }

  emit('blur', event);
}

function onClear() {
  suppressBlur.value = true;
  emit('update:modelValue', '');
  emit('clear');

  void nextTick(() => {
    inputRef.value?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      suppressBlur.value = false;
    });
  });
}

function onMax() {
  emit('max');
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value;
}

function focusInput() {
  inputRef.value?.focus();
}

defineExpose({
  focus: focusInput,
});

function onFieldClick(event: MouseEvent) {
  if (props.disabled || props.readonly) {
    return;
  }

  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }

  inputRef.value?.focus();
}

watch(
  () => [props.modelValue, props.unit, props.type, props.size] as const,
  async () => {
    await nextTick();
    updateGhostUnitMetrics();
    scheduleOverflowMeasure();
  },
  { immediate: true },
);

watch(
  () =>
    [
      props.overflowFeedback,
      props.clearable,
      props.showMax,
      props.disabled,
      props.widthMode,
    ] as const,
  () => {
    scheduleOverflowMeasure();
  },
);

watch(
  valueOverflowing,
  (overflowing) => {
    if (!props.overflowFeedback) return;
    emit('overflow-change', overflowing);
    void syncOverflowPopoverOpen();
  },
  { immediate: true },
);

onMounted(() => {
  resolveOverflowMountContext();
  updateGhostUnitMetrics();
  scheduleOverflowMeasure();
});

onBeforeUnmount(() => {
  overflowResizeObserver?.disconnect();
});
</script>

<template>
  <component
    :is="overflowFeedback ? EgTooltip : 'div'"
    ref="overflowAnchorRef"
    v-bind="overflowFeedback ? overflowPopoverAnchorBind : undefined"
    :class="outerRootClasses"
  >
    <template v-if="overflowFeedback" #content>
      <EgPopover
        class="eds-input-overflow-popover"
        placement="top"
        align="center"
        size="compact"
        width-mode="adaptive"
        height-mode="adaptive"
        :max-width="TEXT_OVERFLOW_TOOLTIP_MAX_WIDTH"
      >
        <span :class="styles.overflowPopoverText">{{ modelValue }}</span>
      </EgPopover>
    </template>
    <div :class="innerRootClasses">
      <div
      ref="fieldRef"
      data-eds-trigger-metrics
      :class="[
        'eds-input-field',
        styles.field,
        styles[size],
        isAmount && styles.amount,
        showAttachedMax && styles.fieldWithMax,
        disabled && styles.fieldDisabled,
      ]"
      @click="onFieldClick"
      @mouseenter="onOverflowFieldPointerEnter"
      @mouseleave="onOverflowFieldPointerLeave"
      @focusin="onFieldFocusIn"
      @focusout="onFieldFocusOut"
    >
      <div
        :class="[showAttachedMax ? styles.fieldMain : styles.fieldBody]"
      >
        <!-- Left: input content. Default = native input -->
        <div :class="[styles.prefix, overflowScrollFadeClasses]">
          <slot name="prefix">
            <div
              :class="[
                styles.valueGroup,
                useGhostUnit && styles.amountControl,
                amountControlEmptyFull && styles.amountControlEmptyFull,
              ]"
              :style="amountControlStyle"
            >
              <input
                ref="inputRef"
                :class="[
                  'eds-input-control',
                  styles.input,
                  useGhostUnit && styles.shrinkInput,
                  useGhostUnit && styles.amountInput,
                ]"
                :style="[inputRenderStyle, shrinkInputStyle]"
                :value="modelValue"
                :type="resolvedInputType"
                :inputmode="resolvedInputMode"
                :placeholder="resolvedPlaceholder"
                :disabled="disabled"
                :readonly="readonly"
                spellcheck="false"
                @input="onInput"
                @scroll="onInputScroll"
                @focus="onFocus"
                @blur="onBlur"
              />

              <!-- Amount unit: trails value / caret -->
              <span
                v-if="showGhostUnit"
                :class="['eds-input-unit', styles.ghostUnit]"
                aria-hidden="true"
              >
                {{ unit }}
              </span>
            </div>
          </slot>
        </div>

        <!-- Right: clear / inline unit（Max 在 field 内、不参与 padding 高度） -->
        <div v-if="showSuffix" :class="styles.suffix">
          <slot name="suffix">
            <EgIconButton
              v-if="clearable && (showClear || reserveClearSpace)"
              shape="square"
              size="sm"
              label="Clear"
              :class="!showClear && styles.clearButtonHidden"
              :aria-hidden="!showClear ? true : undefined"
              tabindex="-1"
              @mousedown.prevent
              @pointerdown.prevent
              @click="onClear"
            >
              <EgIcon name="eds-close-circle-fill" fit />
            </EgIconButton>

            <span
              v-if="showInlineUnit"
              :class="['eds-input-unit', styles.unit]"
            >
              {{ unit }}
            </span>

            <EgIconButton
              v-if="showSecureToggle"
              size="sm"
              shape="square"
              :label="passwordVisible ? '隐藏密码' : '显示密码'"
              :disabled="disabled || readonly"
              @mousedown.prevent
              @click.stop="togglePasswordVisible"
            >
              <EgIcon
                :name="passwordVisible ? 'eds-eye' : 'eds-uneye'"
                fit
                size="md"
              />
            </EgIconButton>
          </slot>
        </div>
      </div>

      <span v-if="showAttachedMax" :class="styles.maxAttach">
        <EgButton
          tone="subtle"
          variant="solid"
          :size="maxButtonSize"
          :disabled="disabled"
          type="button"
          @mousedown.prevent
          @click="onMax"
        >
          {{ maxLabel }}
        </EgButton>
      </span>
    </div>
    </div>
  </component>
</template>
