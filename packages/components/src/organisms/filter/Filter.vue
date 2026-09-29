<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgIconProButton } from '../../molecules/icon-button-pro';
import {
  EgTooltip,
  EgTooltipPanel,
  type TooltipAlign,
  type TooltipPlacement,
  type TooltipWidthMode,
} from '../../molecules/tooltip';
import { closeAllAnchoredTooltips } from '../../molecules/tooltip/anchoredTooltipManager';
import FilterPanel from './FilterPanel.vue';
import type {
  EgFilterCondition,
  EgFilterField,
  EgFilterLogicMode,
  EgFilterOperator,
} from './types';
import {
  cloneFilterConditions,
  DEFAULT_FILTER_OPERATORS,
  isValuelessOperator,
} from './types';
import {
  provideFilterTranslate,
  useFilterTranslate,
  type FilterTranslate,
} from './filterTranslate';
import styles from './Filter.module.css';

const props = withDefaults(
  defineProps<{
    modelValue?: EgFilterCondition[];
    fields: EgFilterField[];
    operators?: EgFilterOperator[];
    title?: string;
    addLabel?: string;
    placeholder?: string;
    removeLabel?: string;
    triggerLabel?: string;
    showTriggerBadge?: boolean;
    disabled?: boolean;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    boundarySelector?: string;
    teleportTo?: string | HTMLElement;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxHeight?: number;
    maxConditions?: number;
    logicMode?: EgFilterLogicMode;
    /** 展示文案翻译；简体中文为真源，未传时保持原文。 */
    translate?: FilterTranslate;
  }>(),
  {
    modelValue: () => [],
    logicMode: 'all',
    operators: () => DEFAULT_FILTER_OPERATORS,
    title: '设置筛选条件',
    addLabel: '添加条件',
    placeholder: '请输入',
    removeLabel: 'Remove condition',
    triggerLabel: '筛选',
    showTriggerBadge: true,
    disabled: false,
    placement: 'bottom',
    align: 'start',
    boundarySelector: '.eds-data-list',
    teleportTo: '.app-preview',
    widthMode: 'fixed',
    width: 480,
    maxHeight: 420,
    maxConditions: 10,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: EgFilterCondition[]];
  'update:logicMode': [value: EgFilterLogicMode];
  dismiss: [];
  open: [];
  close: [];
}>();

provideFilterTranslate((text) => props.translate?.(text) ?? text);

const t = useFilterTranslate();
const anchorRef = ref<InstanceType<typeof EgTooltip> | null>(null);
const expanded = ref(false);
const draftConditions = ref<EgFilterCondition[]>([]);
const draftLogicMode = ref<EgFilterLogicMode>(props.logicMode);
/** 面板内 apply 写回 v-model 时跳过外部 sync，避免覆盖进行中的 draft。 */
let applyingFromPanel = false;

const activeCount = computed(() =>
  props.modelValue.filter((condition) => {
    if (!condition.fieldId || !condition.operatorId) return false;
    if (isValuelessOperator(condition.operatorId)) return true;
    return Boolean(condition.value.trim());
  }).length,
);

function syncDraftFromModel() {
  draftConditions.value = cloneFilterConditions(props.modelValue);
  draftLogicMode.value = props.logicMode;
}

watch(
  () => props.modelValue,
  () => {
    if (!expanded.value || applyingFromPanel) return;
    syncDraftFromModel();
  },
  { deep: true },
);

watch(
  () => props.logicMode,
  (logicMode) => {
    if (!expanded.value || applyingFromPanel) return;
    draftLogicMode.value = logicMode;
  },
);

function onOpen() {
  expanded.value = true;
  syncDraftFromModel();
  emit('open');
}

function onClose() {
  expanded.value = false;
  emit('dismiss');
  emit('close');
}

function closePanel() {
  anchorRef.value?.close();
}

async function onTriggerClick() {
  if (props.disabled) return;

  if (expanded.value) {
    closePanel();
    return;
  }

  closeAllAnchoredTooltips();
  anchorRef.value?.openPanel();
}

function onDraftConditionsUpdate(conditions: EgFilterCondition[]) {
  draftConditions.value = conditions;
}

function onApplyConditions(conditions: EgFilterCondition[]) {
  applyingFromPanel = true;
  draftConditions.value = cloneFilterConditions(conditions);
  emit('update:modelValue', cloneFilterConditions(conditions));
  emit('update:logicMode', draftLogicMode.value);
  void nextTick(() => {
    applyingFromPanel = false;
  });
}

function onDraftLogicModeUpdate(logicMode: EgFilterLogicMode) {
  draftLogicMode.value = logicMode;
}
</script>

<template>
  <span class="eds-filter" :class="styles.root">
    <EgTooltip
      ref="anchorRef"
      class="eds-filter-tooltip"
      data-eds-filter-tooltip
      trigger="click"
      :click-toggle="false"
      :placement="placement"
      :align="align"
      :wrap-tooltip="false"
      :disabled="disabled"
      :teleport-to="teleportTo"
      :boundary-selector="boundarySelector"
      flip
      @open="onOpen"
      @close="onClose"
    >
      <slot
        name="trigger"
        :active="expanded"
        :count="activeCount"
        :on-click="onTriggerClick"
      >
        <EgIconProButton
          :label="t(triggerLabel)"
          :active="expanded"
          :show-badge="showTriggerBadge && activeCount > 0"
          :badge="activeCount"
          :disabled="disabled"
          :aria-expanded="expanded"
          @click.stop="onTriggerClick"
        >
          <EgIcon name="eds-filter" size="sm" />
        </EgIconProButton>
      </slot>

      <template #content>
        <EgTooltipPanel
          panel-kind="flotation"
          panel-micro-float
          :width-mode="widthMode"
          :width="width"
          height-mode="adaptive"
          :max-height="maxHeight"
          :scrollable="false"
        >
          <FilterPanel
            :conditions="draftConditions"
            :fields="fields"
            :operators="operators"
            :title="title"
            :add-label="addLabel"
            :placeholder="placeholder"
            :remove-label="removeLabel"
            :max-conditions="maxConditions"
            :logic-mode="draftLogicMode"
            @update:conditions="onDraftConditionsUpdate"
            @apply:conditions="onApplyConditions"
            @update:logic-mode="onDraftLogicModeUpdate"
          />
        </EgTooltipPanel>
      </template>
    </EgTooltip>
  </span>
</template>
