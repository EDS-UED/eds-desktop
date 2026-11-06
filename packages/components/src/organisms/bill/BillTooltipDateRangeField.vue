<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgFlotation, EgFlotationMenu } from '../../molecules/flotation';
import FilterCalendarPanel from '../filter/FilterCalendarPanel.vue';
import {
  formatFilterDateRangeValue,
  normalizeFilterDateRange,
  parseFilterDateRangeValue,
  shiftFilterMonth,
  startOfTodayParts,
  type FilterDateParts,
} from '../filter/filterDateUtils';
import { formatBillIsoDate } from './billDateUtils';
import { useBillTranslate } from './billTranslate';
import styles from './BillTooltip.module.css';

const ui = useBillTranslate();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const flotationRef = ref<{ close?: () => void } | null>(null);

const parsedRange = computed(() => parseFilterDateRangeValue(props.modelValue));

const todayParts = startOfTodayParts();
const leftViewYear = ref(todayParts.year);
const leftViewMonth = ref(todayParts.month);
const initialRightView = shiftFilterMonth(todayParts.year, todayParts.month, 1);
const rightViewYear = ref(initialRightView.year);
const rightViewMonth = ref(initialRightView.month);

const pendingRangeStart = ref<FilterDateParts | null>(null);
const rangeHoverEnd = ref<FilterDateParts | null>(null);
const panelFocusedDate = ref<FilterDateParts | null>(null);

const startLabel = computed(() => {
  const { start } = parsedRange.value;
  return start ? formatBillIsoDate(start) : '';
});

const endLabel = computed(() => {
  const { end } = parsedRange.value;
  return end ? formatBillIsoDate(end) : '';
});

function syncViewsFromValue() {
  const { start, end } = parsedRange.value;
  const today = startOfTodayParts();

  if (start) {
    leftViewYear.value = start.year;
    leftViewMonth.value = start.month;
  } else if (end) {
    leftViewYear.value = end.year;
    leftViewMonth.value = end.month;
  } else {
    leftViewYear.value = today.year;
    leftViewMonth.value = today.month;
  }

  if (end) {
    rightViewYear.value = end.year;
    rightViewMonth.value = end.month;
  } else if (start) {
    const next = shiftFilterMonth(start.year, start.month, 1);
    rightViewYear.value = next.year;
    rightViewMonth.value = next.month;
  } else {
    const next = shiftFilterMonth(today.year, today.month, 1);
    rightViewYear.value = next.year;
    rightViewMonth.value = next.month;
  }
}

watch(
  () => props.modelValue,
  () => syncViewsFromValue(),
  { immediate: true },
);

function emitRange(start: FilterDateParts, end: FilterDateParts) {
  const normalized = normalizeFilterDateRange(start, end);
  emit('update:modelValue', formatFilterDateRangeValue(normalized.start, normalized.end));
}

function onDayClick(parts: FilterDateParts, close: () => void) {
  panelFocusedDate.value = null;
  rangeHoverEnd.value = null;

  if (!pendingRangeStart.value) {
    pendingRangeStart.value = parts;
    return;
  }

  emitRange(pendingRangeStart.value, parts);
  pendingRangeStart.value = null;
  close();
}

function onDayHover(parts: FilterDateParts | null) {
  if (!pendingRangeStart.value) {
    rangeHoverEnd.value = null;
    return;
  }
  rangeHoverEnd.value = parts;
}

function onPickerOpen() {
  pendingRangeStart.value = null;
  rangeHoverEnd.value = null;
  const { start, end } = parsedRange.value;
  panelFocusedDate.value = !start && !end ? startOfTodayParts() : null;
  syncViewsFromValue();
}

function onPickerClose() {
  pendingRangeStart.value = null;
  rangeHoverEnd.value = null;
  panelFocusedDate.value = null;
}

function shiftLeftViewMonth(offset: number) {
  const next = shiftFilterMonth(leftViewYear.value, leftViewMonth.value, offset);
  leftViewYear.value = next.year;
  leftViewMonth.value = next.month;
}

function shiftLeftViewYear(offset: number) {
  leftViewYear.value += offset;
}

function shiftRightViewMonth(offset: number) {
  const next = shiftFilterMonth(rightViewYear.value, rightViewMonth.value, offset);
  rightViewYear.value = next.year;
  rightViewMonth.value = next.month;
}

function shiftRightViewYear(offset: number) {
  rightViewYear.value += offset;
}
</script>

<template>
  <EgFlotation
    ref="flotationRef"
    :disabled="disabled"
    trigger="click"
    placement="bottom"
    align="start"
    width-mode="trigger"
    :show-add="false"
    :show-menu-divider="false"
    @open="onPickerOpen"
    @close="onPickerClose"
  >
    <template #trigger="{ expanded }">
      <button
        type="button"
        :class="[styles.dateRangeTrigger, expanded && styles.dateRangeTriggerExpanded]"
        :disabled="disabled"
        :aria-expanded="expanded"
      >
        <span :class="styles.dateRangeField">
          <span :class="styles.dateRangeValue">{{ startLabel || ui('Bill export date placeholder') }}</span>
          <EgIcon name="eds-calendar" size="sm" :class="styles.dateRangeIcon" />
        </span>
        <span :class="styles.dateRangeSep">{{ ui('Bill export date range to') }}</span>
        <span :class="styles.dateRangeField">
          <span :class="styles.dateRangeValue">{{ endLabel || ui('Bill export date placeholder') }}</span>
          <EgIcon name="eds-calendar" size="sm" :class="styles.dateRangeIcon" />
        </span>
      </button>
    </template>

    <template #content="{ close }">
      <EgFlotationMenu
        data-no-corner-smoothing
        panel-flush
        panel-radius="radius-md"
        width-mode="adaptive"
        height-mode="adaptive"
        :scrollable="false"
        :show-add="false"
        :show-divider="false"
      >
        <div :class="styles.calendarPanelBody">
          <div :class="styles.calendars">
            <div :class="styles.calendarPane">
              <FilterCalendarPanel
                v-model:view-year="leftViewYear"
                v-model:view-month="leftViewMonth"
                header-mode="nav"
                selection-mode="range"
                header-action="hidden"
                :range-start="parsedRange.start"
                :range-end="parsedRange.end"
                :range-pending-start="pendingRangeStart"
                :range-hover-end="rangeHoverEnd"
                :focused-date="panelFocusedDate"
                :disabled="disabled"
                @day-click="(parts) => onDayClick(parts, close)"
                @day-hover="onDayHover"
                @prev-month="shiftLeftViewMonth(-1)"
                @next-month="shiftLeftViewMonth(1)"
                @prev-year="shiftLeftViewYear(-1)"
                @next-year="shiftLeftViewYear(1)"
              />
            </div>
            <span :class="styles.calendarDivider" aria-hidden="true" />
            <div :class="styles.calendarPane">
              <FilterCalendarPanel
                v-model:view-year="rightViewYear"
                v-model:view-month="rightViewMonth"
                header-mode="nav"
                selection-mode="range"
                header-action="hidden"
                :range-start="parsedRange.start"
                :range-end="parsedRange.end"
                :range-pending-start="pendingRangeStart"
                :range-hover-end="rangeHoverEnd"
                :disabled="disabled"
                @day-click="(parts) => onDayClick(parts, close)"
                @day-hover="onDayHover"
                @prev-month="shiftRightViewMonth(-1)"
                @next-month="shiftRightViewMonth(1)"
                @prev-year="shiftRightViewYear(-1)"
                @next-year="shiftRightViewYear(1)"
              />
            </div>
          </div>
        </div>
      </EgFlotationMenu>
    </template>
  </EgFlotation>
</template>
