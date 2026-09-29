<script setup lang="ts">
import { computed, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgInput } from '../../molecules/input';
import EgCryptoTooltip from './FilterConditionCurrencyValue.vue';
import EgMemberTooltip from './FilterConditionMemberValue.vue';
import FilterConditionNumericValue from './FilterConditionNumericValue.vue';
import FilterConditionSelectValue from './FilterConditionSelectValue.vue';
import EgDatePickerTooltip from './DatePickerTooltip.vue';
import EgStatusTooltip from './FilterConditionStatusValue.vue';
import type { TooltipAlign } from '../../molecules/tooltip';
import FilterSelect from './FilterSelect.vue';
import { FILTER_DROPDOWN_PRESETS } from './filterSelectValuePresets';
import type { EgFilterField, EgFilterFieldKind } from './types';
import {
  defaultPlaceholderForFilterFieldKind,
  isNumericFilterFieldKind,
  isNumericFilterOperator,
  isValuelessOperator,
  resolveFilterFieldKind,
  resolveFilterOperatorsForFieldKind,
} from './types';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionRow.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    conditionId: string;
    fieldId: string;
    operatorId: string;
    value: string;
    fields: EgFilterField[];
    placeholder?: string;
    removeLabel?: string;
    boundarySelector?: string;
    valueAlign?: TooltipAlign;
  }>(),
  {
    placeholder: '请输入',
    removeLabel: 'Remove condition',
    valueAlign: 'end',
  },
);

type EgFilterConditionRowPatch = {
  fieldId: string;
  operatorId: string;
  value: string;
};

const fieldSelectOpenId = computed(() => `${props.conditionId}:field`);
const operatorSelectOpenId = computed(() => `${props.conditionId}:operator`);
const valueSelectOpenId = computed(() => `${props.conditionId}:value`);

const emit = defineEmits<{
  'update:operatorId': [value: string];
  /** 值编辑态（输入中 / draft），不触发筛选。 */
  'update:value': [value: string];
  /** 值提交（选择完成 / 输入失焦），触发筛选。 */
  'commit:value': [value: string];
  /** 字段切换等需原子写入，避免 FilterPanel 多次 patch 读到 stale conditions。 */
  patch: [patch: Partial<EgFilterConditionRowPatch>];
  remove: [];
}>();

function onValueCommit(nextValue = props.value) {
  emit('commit:value', nextValue);
}

const valueDisabled = computed(() => isValuelessOperator(props.operatorId));

const activeField = computed(() => props.fields.find((field) => field.id === props.fieldId));

/** 值编辑器 kind：以 condition.fieldId 为准（预置字段 id 即 kind slug）。 */
const activeFieldKind = computed((): EgFilterFieldKind | undefined =>
  resolveFilterFieldKind(activeField.value, props.fieldId),
);

const isCurrencyField = computed(() => activeFieldKind.value === 'currency');
const isMemberField = computed(() => activeFieldKind.value === 'member');
const isNumericField = computed(() =>
  activeFieldKind.value ? isNumericFilterFieldKind(activeFieldKind.value) : false,
);
const isTimeField = computed(() => activeFieldKind.value === 'time');
const isTimeRangeField = computed(() => activeFieldKind.value === 'time-range');
const isStatusField = computed(() => activeFieldKind.value === 'status');
const isDropdownField = computed(() => activeFieldKind.value === 'dropdown');
const isInputField = computed(() => activeFieldKind.value === 'input');

const operatorOptions = computed(() =>
  resolveFilterOperatorsForFieldKind(activeFieldKind.value),
);

const valuePlaceholder = computed(() => {
  if (activeField.value?.placeholder) return t(activeField.value.placeholder);
  if (activeFieldKind.value) {
    return t(defaultPlaceholderForFilterFieldKind(activeFieldKind.value));
  }
  return t(props.placeholder);
});

const valueEditorKey = computed(
  () =>
    `${props.fieldId}:${activeFieldKind.value ?? 'unknown'}:${activeField.value?.amountMode ?? ''}:${activeField.value?.selectionMode ?? ''}`,
);

const dropdownOptions = computed(
  () => activeField.value?.dropdownOptions ?? FILTER_DROPDOWN_PRESETS,
);

watch(
  () => [props.fieldId, props.operatorId] as const,
  ([fieldId, operatorId]) => {
    const kind = resolveFilterFieldKind(
      props.fields.find((item) => item.id === fieldId),
      fieldId,
    );
    if (!kind) return;

    const allowedOperatorIds = new Set(
      resolveFilterOperatorsForFieldKind(kind).map((operator) => operator.id),
    );
    if (allowedOperatorIds.has(operatorId)) return;
    emit('patch', { operatorId: 'equals' });
  },
);

function onFieldChange(nextFieldId: string) {
  const nextField = props.fields.find((field) => field.id === nextFieldId);
  const nextKind = resolveFilterFieldKind(nextField, nextFieldId);
  const patch: Partial<EgFilterConditionRowPatch> = {
    fieldId: nextFieldId,
    value: '',
  };

  if (nextKind && isNumericFilterFieldKind(nextKind) && !isNumericFilterOperator(props.operatorId)) {
    patch.operatorId = 'equals';
  } else if (
    nextKind
    && !isNumericFilterFieldKind(nextKind)
    && isNumericFilterOperator(props.operatorId)
  ) {
    patch.operatorId = 'equals';
  }

  emit('patch', patch);
}
</script>

<template>
  <div :class="styles.row">
    <FilterSelect
      variant="field"
      :model-value="fieldId"
      :options="fields"
      :open-id="fieldSelectOpenId"
      @update:model-value="onFieldChange"
    />
    <div :class="styles.valueGroup">
      <FilterSelect
        variant="operator"
        :model-value="operatorId"
        :options="operatorOptions"
        :open-id="operatorSelectOpenId"
        @update:model-value="emit('update:operatorId', $event)"
      />
      <div :class="styles.value">
        <EgCryptoTooltip
          v-if="isCurrencyField"
          :key="valueEditorKey"
          :model-value="value"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :selection-mode="activeField?.selectionMode"
          :dropdown-open-id="valueSelectOpenId"
          :boundary-selector="boundarySelector"
          :picker-align="valueAlign"
          :currency-preset-ids="activeField?.currencyPresetIds"
          :currency-symbols="activeField?.currencySymbols"
          @update:model-value="onValueCommit($event)"
        />
        <EgMemberTooltip
          v-else-if="isMemberField"
          :key="valueEditorKey"
          :model-value="value"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :selection-mode="activeField?.selectionMode"
          :dropdown-open-id="valueSelectOpenId"
          :boundary-selector="boundarySelector"
          :picker-align="valueAlign"
          @update:model-value="onValueCommit($event)"
        />
        <FilterConditionNumericValue
          v-else-if="isNumericField"
          :key="valueEditorKey"
          :model-value="value"
          :field-kind="activeFieldKind ?? (fieldId as EgFilterFieldKind)"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :amount-mode="activeField?.amountMode"
          :unit="activeField?.unit"
          @update:model-value="emit('update:value', $event)"
          @commit="onValueCommit()"
        />
        <EgDatePickerTooltip
          v-else-if="isTimeField"
          :key="valueEditorKey"
          mode="date"
          :model-value="value"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :dropdown-open-id="valueSelectOpenId"
          :boundary-selector="boundarySelector"
          picker-align="center"
          @update:model-value="onValueCommit($event)"
        />
        <EgDatePickerTooltip
          v-else-if="isTimeRangeField"
          :key="valueEditorKey"
          mode="range"
          :model-value="value"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :dropdown-open-id="valueSelectOpenId"
          :boundary-selector="boundarySelector"
          :picker-align="valueAlign"
          @update:model-value="onValueCommit($event)"
        />
        <EgStatusTooltip
          v-else-if="isStatusField"
          :key="valueEditorKey"
          :model-value="value"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :selection-mode="activeField?.selectionMode"
          :dropdown-open-id="valueSelectOpenId"
          @update:model-value="onValueCommit($event)"
        />
        <FilterConditionSelectValue
          v-else-if="isDropdownField"
          :key="valueEditorKey"
          :model-value="value"
          :options="dropdownOptions"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :selection-mode="activeField?.selectionMode"
          :dropdown-open-id="valueSelectOpenId"
          :boundary-selector="boundarySelector"
          :picker-align="valueAlign"
          @update:model-value="onValueCommit($event)"
        />
        <EgInput
          v-else-if="isInputField"
          :key="valueEditorKey"
          :model-value="value"
          size="sm"
          width-mode="full"
          :placeholder="valuePlaceholder"
          :disabled="valueDisabled"
          :clearable="!valueDisabled"
          @update:model-value="emit('update:value', $event)"
          @blur="onValueCommit()"
        />
      </div>
      <div :class="styles.remove">
        <EgIconButton
          shape="square"
          size="lg"
          :label="removeLabel"
          @click="emit('remove')"
        >
          <EgIcon name="eds-close" size="sm" />
        </EgIconButton>
      </div>
    </div>
  </div>
</template>
