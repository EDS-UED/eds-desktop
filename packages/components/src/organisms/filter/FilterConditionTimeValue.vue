<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationTrigger,
  type FlotationTriggerWidthMode,
} from '../../molecules/flotation';
import FilterCalendarPanel from './FilterCalendarPanel.vue';
import {
  fromDateKey,
  startOfTodayParts,
  toDateKey,
  type FilterDateParts,
} from './filterDateUtils';
import type { TooltipTrigger } from '../../molecules/tooltip';
import { FILTER_SELECT_PLACEHOLDER } from './types';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionTimeValue.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    triggerWidthMode?: FlotationTriggerWidthMode;
    triggerWidth?: number;
    trigger?: TooltipTrigger;
    dropdownOpenId?: string;
  }>(),
  {
    placeholder: FILTER_SELECT_PLACEHOLDER,
    disabled: false,
    triggerWidthMode: 'adaptive',
    trigger: 'click',
  },
);

const flotationWidthMode = computed(() =>
  props.triggerWidthMode === 'adaptive' ? 'adaptive' : 'trigger',
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const flotationRef = ref<{ close?: () => void } | null>(null);
const { onDropdownOpen, onDropdownClose } = useFilterPanelDropdownMutex(
  () => props.dropdownOpenId,
  flotationRef,
);

const viewYear = ref(startOfTodayParts().year);
const viewMonth = ref(startOfTodayParts().month);
const panelFocusedDate = ref<FilterDateParts | null>(null);

const todayParts = computed(() => startOfTodayParts());

const selectedDate = computed(() => fromDateKey(props.modelValue));

const triggerLabel = computed(() => {
  if (!selectedDate.value) return t(props.placeholder);
  return toDateKey(selectedDate.value);
});

function syncViewFromValue() {
  const next = selectedDate.value ?? todayParts.value;
  viewYear.value = next.year;
  viewMonth.value = next.month;
}

watch(
  () => props.modelValue,
  () => {
    syncViewFromValue();
  },
  { immediate: true },
);

function onPickerOpen() {
  onDropdownOpen();
  if (!selectedDate.value) {
    panelFocusedDate.value = todayParts.value;
    viewYear.value = todayParts.value.year;
    viewMonth.value = todayParts.value.month;
    return;
  }

  panelFocusedDate.value = null;
  syncViewFromValue();
}

function onPickerClose() {
  onDropdownClose();
  panelFocusedDate.value = null;
}

function onDayClick(parts: FilterDateParts) {
  panelFocusedDate.value = null;
  emit('update:modelValue', toDateKey(parts));
}

function onTodayClick() {
  const today = todayParts.value;
  panelFocusedDate.value = null;
  viewYear.value = today.year;
  viewMonth.value = today.month;
  emit('update:modelValue', toDateKey(today));
}
</script>

<template>
  <div :class="styles.root">
    <EgFlotation
      ref="flotationRef"
      :disabled="disabled"
      :trigger="trigger"
      placement="bottom"
      align="center"
      :width-mode="flotationWidthMode"
      :show-add="false"
      :show-menu-divider="false"
      flip
      @open="onPickerOpen"
      @close="onPickerClose"
    >
      <template #trigger="{ expanded }">
        <EgFlotationTrigger
          trigger-style="subtle"
          size="sm"
          :width-mode="triggerWidthMode"
          :width="triggerWidth"
          :label="triggerLabel"
          :expanded="expanded"
          :disabled="disabled"
        >
          <template #symbol>
            <span :class="styles.triggerCalendarSymbol">
              <EgIcon name="eds-calendar" size="sm" />
            </span>
          </template>
        </EgFlotationTrigger>
      </template>

      <template #content="{ close }">
        <EgFlotationMenu
          :class="styles.menu"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          width-mode="adaptive"
          height-mode="adaptive"
          :show-add="false"
          :show-divider="false"
          :scrollable="false"
        >
          <div :class="styles.panelBody">
            <FilterCalendarPanel
              v-model:view-year="viewYear"
              v-model:view-month="viewMonth"
              header-mode="select"
              selection-mode="single"
              :selected-date="selectedDate"
              :focused-date="panelFocusedDate"
              :disabled="disabled"
              @day-click="(parts) => { onDayClick(parts); close(); }"
              @today-click="onTodayClick"
            />
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
