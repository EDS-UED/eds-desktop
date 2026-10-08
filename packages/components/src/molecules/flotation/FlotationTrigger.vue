<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgMessage, EgReddot, type MessageType } from '../feedback';
import { EgTag, type TagStatus } from '../tag';
import EgFieldOvfTooltip from '../tooltip/TextOverflowTooltip.vue';
import styles from './Flotation.module.css';

/** Figma Trigger Style（2059:3679） */
export type FlotationTriggerStyle = 'subtle' | 'outline' | 'text';
/** Figma Trigger Size */
export type FlotationTriggerSize = 'lg' | 'md' | 'sm' | 'xs';

/** 触发器在父级内的宽度：内容 hug / 撑满 / 固定 px */
export type FlotationTriggerWidthMode = 'trigger' | 'adaptive' | 'fixed';
/** #symbol 相对文案区：leading 在左，trailing 在右（箭头前）。 */
export type FlotationTriggerSymbolPosition = 'leading' | 'trailing';

const props = withDefaults(
  defineProps<{
    /** 预置样式；#trigger 可完全替换本组件。 */
    triggerStyle?: FlotationTriggerStyle;
    size?: FlotationTriggerSize;
    widthMode?: FlotationTriggerWidthMode;
    /** widthMode=fixed 时的宽度（px） */
    width?: number;
    disabled?: boolean;
    label?: string;
    /** 展示币种 / 头像区（#symbol） */
    showSymbol?: boolean;
    /** #symbol 预置 EgIcon 名称 */
    symbolIcon?: string;
    /** showSymbol 时 #symbol 在文案 leading（左）或 trailing（右，箭头前）。 */
    symbolPosition?: FlotationTriggerSymbolPosition;
    /** 展示 Tag（#tag）；预置为 EgTag Status sm */
    showTag?: boolean;
    tagText?: string;
    tagStatus?: TagStatus;
    /** 展示 Message（#message） */
    showMessage?: boolean;
    messageText?: string;
    /** EgMessage type */
    messageType?: MessageType;
    /** 展开态：箭头朝上 */
    expanded?: boolean;
    /** Figma TriggerComboModuleTitle（2090:2655）— Module Menu 标题区 text 触发器。 */
    moduleMenuTitle?: boolean;
    /** Module Menu 标题旁 EgReddot。 */
    showReddot?: boolean;
    /** 文案 ellipsis 溢出时 hover 展示 EgFieldOvfTooltip。 */
    labelOverflowTooltip?: boolean;
    /** 溢出 Tooltip 定位边界（透传 EgFieldOvfTooltip）。 */
    boundarySelector?: string;
  }>(),
  {
    triggerStyle: 'subtle',
    size: 'lg',
    widthMode: 'adaptive',
    width: undefined,
    disabled: false,
    label: 'Trigger',
    showSymbol: false,
    symbolIcon: 'eds-coin-btc',
    symbolPosition: 'leading',
    showTag: false,
    tagText: 'Tag',
    tagStatus: 'danger',
    showMessage: false,
    messageText: '0',
    messageType: 'brand',
    expanded: false,
    moduleMenuTitle: false,
    showReddot: false,
    labelOverflowTooltip: true,
    boundarySelector: undefined,
  },
);

const slots = useSlots();

const rootClass = computed(() => [
  styles.triggerRoot,
  styles[`triggerStyle${capitalize(props.triggerStyle)}`],
  props.moduleMenuTitle
    ? styles.triggerModuleMenuTitle
    : styles[`triggerSize${capitalize(props.size)}`],
  props.widthMode === 'trigger'
    ? styles.triggerWidthTrigger
    : props.widthMode === 'fixed'
      ? styles.triggerWidthFixed
      : styles.triggerWidthAdaptive,
  props.expanded && styles.triggerExpanded,
]);

const arrowIconSize = computed(() => {
  if (props.moduleMenuTitle) return 'sm';
  return props.size === 'lg' ? 'md' : 'sm';
});

const symbolIconSize = computed(() => arrowIconSize.value);

const rootStyle = computed(() => {
  if (props.widthMode !== 'fixed' || props.width == null || props.width <= 0) {
    return undefined;
  }
  return { width: `${props.width}px` };
});

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const showSymbolBlock = computed(
  () => Boolean(props.showSymbol || slots.symbol),
);

const symbolLeading = computed(
  () => showSymbolBlock.value && props.symbolPosition === 'leading',
);

const symbolTrailing = computed(
  () => showSymbolBlock.value && props.symbolPosition === 'trailing',
);
</script>

<template>
  <button
    type="button"
    class="eds-flotation-trigger"
    :class="rootClass"
    :style="rootStyle"
    :disabled="disabled"
    :aria-expanded="expanded"
  >
    <span v-if="symbolLeading" :class="styles.triggerSymbol">
      <slot name="symbol">
        <EgIcon :name="symbolIcon" :size="symbolIconSize" fit />
      </slot>
    </span>

    <span :class="styles.triggerTitle">
      <span :class="styles.triggerRaw">
        <span :class="styles.triggerLabel">
          <EgFieldOvfTooltip
            v-if="labelOverflowTooltip"
            :tooltip-text="slots.default ? undefined : label"
            host-flex
            :host-class="styles.triggerLabelOverflowHost"
            target-tone="inherit"
            :boundary-selector="boundarySelector"
            :disabled="disabled"
          >
            <slot>{{ label }}</slot>
          </EgFieldOvfTooltip>
          <template v-else>
            <slot>{{ label }}</slot>
          </template>
        </span>
        <span v-if="showTag || slots.tag" :class="styles.triggerTag">
          <slot name="tag">
            <EgTag family="status" size="sm" :status="tagStatus" truncate>{{ tagText }}</EgTag>
          </slot>
        </span>
      </span>
    </span>

    <span v-if="showReddot || slots.reddot" :class="styles.triggerReddot">
      <slot name="reddot">
        <EgReddot />
      </slot>
    </span>

    <span v-if="showMessage || slots.message" :class="styles.triggerMessage">
      <slot name="message">
        <EgMessage :type="messageType" :text="messageText" />
      </slot>
    </span>

    <span v-if="symbolTrailing" :class="styles.triggerSymbol">
      <slot name="symbol">
        <EgIcon :name="symbolIcon" :size="symbolIconSize" fit />
      </slot>
    </span>

    <span :class="styles.triggerArrow" aria-hidden="true">
      <slot name="arrow">
        <EgIcon
          :name="expanded ? 'eds-arrow-up-mini-ios' : 'eds-arrow-down-mini-ios'"
          :size="arrowIconSize"
          fit
        />
      </slot>
    </span>
  </button>
</template>
