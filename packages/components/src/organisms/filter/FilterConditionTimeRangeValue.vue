<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgButton } from '../../molecules/button';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationTrigger,
  type FlotationTriggerWidthMode,
} from '../../molecules/flotation';
import { EgTooltipOverflow } from '../../molecules/tooltip';
import { closeBarBlockingAnchoredTooltips } from '../../molecules/tooltip/anchoredTooltipManager';
import FilterCalendarPanel from './FilterCalendarPanel.vue';
import {
  FILTER_TIME_QUICK_PRESETS,
  formatFilterDateRangeDisplay,
  formatFilterDateRangeValue,
  normalizeFilterDateRange,
  parseFilterDateRangeValue,
  resolveFilterTimeQuickPresetRange,
  shiftFilterMonth,
  startOfTodayParts,
  type FilterDateParts,
  type FilterTimeQuickPresetId,
} from './filterDateUtils';
import type { TooltipTrigger } from '../../molecules/tooltip';
import { FILTER_SELECT_PLACEHOLDER } from './types';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionTimeRangeValue.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    triggerWidthMode?: FlotationTriggerWidthMode;
    triggerWidth?: number;
    trigger?: TooltipTrigger;
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

const parsedRange = computed(() => parseFilterDateRangeValue(props.modelValue));

const todayParts = startOfTodayParts();
const leftViewYear = ref(todayParts.year);
const leftViewMonth = ref(todayParts.month);

const rightViewYear = computed(() =>
  shiftFilterMonth(leftViewYear.value, leftViewMonth.value, 1).year,
);
const rightViewMonth = computed(() =>
  shiftFilterMonth(leftViewYear.value, leftViewMonth.value, 1).month,
);

const pendingRangeStart = ref<FilterDateParts | null>(null);
const rangeHoverEnd = ref<FilterDateParts | null>(null);
const panelFocusedDate = ref<FilterDateParts | null>(null);

const triggerLabel = computed(() => {
  const { start, end } = parsedRange.value;
  if (!start || !end) return t(props.placeholder);
  return t(formatFilterDateRangeDisplay(start, end));
});

const triggerTooltipText = computed(() => {
  const { start, end } = parsedRange.value;
  if (!start || !end) return '';
  return t(formatFilterDateRangeDisplay(start, end));
});

function syncViewsFromValue() {
  const { start, end } = parsedRange.value;
  const anchor = start ?? end ?? startOfTodayParts();
  leftViewYear.value = anchor.year;
  leftViewMonth.value = anchor.month;
}

watch(
  () => props.modelValue,
  () => {
    syncViewsFromValue();
  },
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

function onPresetClick(presetId: FilterTimeQuickPresetId, close: () => void) {
  const { start, end } = resolveFilterTimeQuickPresetRange(presetId);
  pendingRangeStart.value = null;
  rangeHoverEnd.value = null;
  panelFocusedDate.value = null;
  emitRange(start, end);
  syncViewsFromValue();
  close();
}

function onPickerOpen() {
  closeBarBlockingAnchoredTooltips();
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

function shiftViewMonth(offset: number) {
  const next = shiftFilterMonth(leftViewYear.value, leftViewMonth.value, offset);
  leftViewYear.value = next.year;
  leftViewMonth.value = next.month;
}

function shiftViewYear(offset: number) {
  leftViewYear.value += offset;
}
</script>

<template>
  <div :class="styles.root">
    <EgFlotation
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
          :expanded="expanded"
          :disabled="disabled"
        >
          <EgTooltipOverflow
            v-if="triggerTooltipText"
            :tooltip-text="triggerTooltipText"
            :disabled="disabled || expanded"
            target-tone="inherit"
            defer-hover-target
            host-flex
            :host-class="styles.triggerOverflowHost"
            :measure-class="styles.triggerOverflowText"
            :typography-class="styles.triggerOverflowText"
            :panel-scope-class="styles.triggerOverflowTooltip"
          >
            {{ triggerLabel }}
          </EgTooltipOverflow>
          <span
            v-else
            :class="[styles.triggerOverflowText, styles.triggerPlaceholder]"
          >
            {{ triggerLabel }}
          </span>
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
            <div :class="styles.presetChrome">
              <div :class="styles.presetRow">
                <div :class="styles.presetGroup">
                  <EgButton
                    v-for="preset in FILTER_TIME_QUICK_PRESETS"
                    :key="preset.id"
                    tone="subtle"
                    variant="text"
                    size="xs"
                    :disabled="disabled"
                    @click="onPresetClick(preset.id, close)"
                  >
                    {{ t(preset.label) }}
                  </EgButton>
                </div>
              </div>
              <EgDivider type="module" direction="horizontal" :class="styles.presetDivider" />
            </div>

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
                  @prev-month="shiftViewMonth(-1)"
                  @next-month="shiftViewMonth(1)"
                  @prev-year="shiftViewYear(-1)"
                  @next-year="shiftViewYear(1)"
                />
              </div>

              <span :class="styles.calendarDivider" aria-hidden="true" />

              <div :class="styles.calendarPane">
                <FilterCalendarPanel
                  :view-year="rightViewYear"
                  :view-month="rightViewMonth"
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
                  @prev-month="shiftViewMonth(-1)"
                  @next-month="shiftViewMonth(1)"
                  @prev-year="shiftViewYear(-1)"
                  @next-year="shiftViewYear(1)"
                />
              </div>
            </div>
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
