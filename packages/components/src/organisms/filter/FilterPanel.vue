<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import {
  SCROLL_CHROME_EDGE_EPSILON,
  useScrollChromeScrim,
} from '../../composables/useScrollChromeScrim';
import { EgButton } from '../../molecules/button';
import FilterConditionRow from './FilterConditionRow.vue';
import FilterLogicRow from './FilterLogicRow.vue';
import type {
  EgFilterCondition,
  EgFilterField,
  EgFilterLogicMode,
  EgFilterOperator,
} from './types';
import {
  createFilterCondition,
  isValuelessOperator,
} from './types';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterPanel.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    conditions: EgFilterCondition[];
    fields: EgFilterField[];
    operators: EgFilterOperator[];
    title?: string;
    addLabel?: string;
    placeholder?: string;
    removeLabel?: string;
    maxConditions?: number;
    logicMode?: EgFilterLogicMode;
  }>(),
  {
    title: '设置筛选条件',
    addLabel: '添加条件',
    placeholder: '请输入',
    removeLabel: 'Remove condition',
    maxConditions: 10,
    logicMode: 'all',
  },
);

const emit = defineEmits<{
  'update:conditions': [conditions: EgFilterCondition[]];
  'update:logicMode': [logicMode: EgFilterLogicMode];
}>();

const showLogicRow = computed(() => props.conditions.length >= 2);

function updateConditions(next: EgFilterCondition[]) {
  emit('update:conditions', next);
}

function updateCondition(index: number, patch: Partial<EgFilterCondition>) {
  const next = props.conditions.map((condition, conditionIndex) =>
    conditionIndex === index ? { ...condition, ...patch } : condition,
  );
  updateConditions(next);
}

function onOperatorChange(index: number, operatorId: string) {
  const patch: Partial<EgFilterCondition> = { operatorId };
  if (isValuelessOperator(operatorId)) {
    patch.value = '';
  }
  updateCondition(index, patch);
}

function onRemove(index: number) {
  updateConditions(props.conditions.filter((_, conditionIndex) => conditionIndex !== index));
}

function onAdd() {
  if (props.conditions.length >= props.maxConditions) return;
  const defaultFieldId = props.fields[0]?.id ?? '';
  updateConditions([...props.conditions, createFilterCondition(defaultFieldId)]);
}

const conditionsScrollRef = ref<HTMLElement | null>(null);

const {
  canScroll: conditionsCanScroll,
  update: updateConditionsScroll,
} = useScrollChromeScrim(conditionsScrollRef);

function scrollConditionsToEnd() {
  void nextTick(() => {
    const region = conditionsScrollRef.value;
    if (!region) return;

    const canScroll =
      region.scrollHeight - region.clientHeight > SCROLL_CHROME_EDGE_EPSILON;

    if (canScroll) {
      region.scrollTop = region.scrollHeight;
    }

    updateConditionsScroll();
  });
}

watch(
  () => props.conditions.length,
  (next, prev) => {
    if (next > (prev ?? 0)) {
      scrollConditionsToEnd();
      return;
    }
    updateConditionsScroll();
  },
  { flush: 'post' },
);
</script>

<template>
  <div
    :class="styles.panel"
    data-eds-filter-panel
    :data-has-conditions="conditions.length > 0 ? '' : undefined"
  >
    <div :class="styles.headerGroup">
      <h3 :class="styles.title">{{ t(title) }}</h3>

      <FilterLogicRow
        v-if="showLogicRow"
        :model-value="logicMode"
        @update:model-value="emit('update:logicMode', $event)"
      />
    </div>

    <div
      :class="[
        styles.bodyGroup,
        conditionsCanScroll && styles.bodyGroupCompactGap,
      ]"
    >
      <div v-if="conditions.length > 0" :class="styles.conditionsBody">
        <div ref="conditionsScrollRef" :class="styles.conditions">
          <FilterConditionRow
            v-for="(condition, index) in conditions"
            :key="condition.id"
            :field-id="condition.fieldId"
            :operator-id="condition.operatorId"
            :value="condition.value"
            :fields="fields"
            :operators="operators"
            :placeholder="placeholder"
            :remove-label="removeLabel"
            @patch="updateCondition(index, $event)"
            @update:operator-id="onOperatorChange(index, $event)"
            @update:value="updateCondition(index, { value: $event })"
            @remove="onRemove(index)"
          />
        </div>

      </div>

      <div v-if="conditions.length > 0" :class="styles.addButtonBlock">
        <EgButton
          :class="styles.addButton"
          tone="subtle"
          variant="text"
          size="md"
          :disabled="conditions.length >= maxConditions"
          @click="onAdd"
        >
          <template #icon>
            <EgIcon name="eds-add" fit size="md" />
          </template>
          {{ t(addLabel) }}
        </EgButton>
      </div>

      <EgButton
        v-else
        :class="styles.addButton"
        tone="subtle"
        variant="solid"
        size="md"
        :disabled="conditions.length >= maxConditions"
        @click="onAdd"
      >
        <template #icon>
          <EgIcon name="eds-add" fit size="md" />
        </template>
        {{ t(addLabel) }}
      </EgButton>
    </div>
  </div>
</template>
