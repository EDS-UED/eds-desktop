<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgButton } from '../../molecules/button';
import FilterSelect from './FilterSelect.vue';
import {
  FILTER_WEEKDAY_LABELS,
  buildCalendarCells,
  buildFilterMonthOptions,
  buildFilterYearOptions,
  FILTER_CALENDAR_SELECT_MENU_MAX_HEIGHT,
  compareFilterDates,
  formatFilterMonthTitle,
  isFilterDateInRange,
  isSameFilterDate,
  startOfTodayParts,
  type FilterDateParts,
} from './filterDateUtils';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterCalendarPanel.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    viewYear: number;
    viewMonth: number;
    headerMode?: 'select' | 'nav';
    selectionMode?: 'single' | 'range';
    selectedDate?: FilterDateParts | null;
    focusedDate?: FilterDateParts | null;
    rangeStart?: FilterDateParts | null;
    rangeEnd?: FilterDateParts | null;
    rangePendingStart?: FilterDateParts | null;
    rangeHoverEnd?: FilterDateParts | null;
    headerAction?: 'today' | 'reset' | 'hidden';
    headerActionLabel?: string;
    disabled?: boolean;
  }>(),
  {
    headerMode: 'select',
    selectionMode: 'single',
    selectedDate: null,
    focusedDate: null,
    rangeStart: null,
    rangeEnd: null,
    rangePendingStart: null,
    rangeHoverEnd: null,
    headerAction: 'today',
    headerActionLabel: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:viewYear': [value: number];
  'update:viewMonth': [value: number];
  'day-click': [value: FilterDateParts];
  'prev-month': [];
  'next-month': [];
  'prev-year': [];
  'next-year': [];
  'today-click': [];
  'reset-click': [];
  'day-hover': [value: FilterDateParts | null];
}>();

const yearOptions = computed(() =>
  buildFilterYearOptions(props.viewYear).map((option) => ({
    ...option,
    label: t(option.label),
  })),
);
const monthOptions = computed(() =>
  buildFilterMonthOptions().map((option) => ({
    ...option,
    label: t(option.label),
  })),
);
const monthTitle = computed(() =>
  t(formatFilterMonthTitle(props.viewYear, props.viewMonth)),
);
const weekdayLabels = computed(() => FILTER_WEEKDAY_LABELS.map((label) => t(label)));

const calendarCells = computed(() => buildCalendarCells(props.viewYear, props.viewMonth));

const showTodayAction = computed(() => {
  const today = startOfTodayParts();
  const viewingTodayMonth = props.viewYear === today.year && props.viewMonth === today.month;

  if (!viewingTodayMonth) return true;

  if (props.selectionMode === 'single') {
    return !isSameFilterDate(props.selectedDate ?? null, today);
  }

  const start = props.rangeStart ?? null;
  const end = props.rangeEnd ?? null;
  if (!start || !end) return true;
  return !(isSameFilterDate(start, today) && isSameFilterDate(end, today));
});

const showHeaderActionButton = computed(() => {
  if (props.headerAction === 'hidden') return false;
  if (props.headerAction === 'reset') return true;
  return showTodayAction.value;
});

const resolvedHeaderActionLabel = computed(() => {
  if (props.headerActionLabel) return t(props.headerActionLabel);
  return t(props.headerAction === 'reset' ? '重置' : '今天');
});

const activeHeaderSelectId = ref<'year' | 'month' | null>(null);

function onHeaderSelectOpenChange(value: string | null) {
  activeHeaderSelectId.value = value === 'year' || value === 'month' ? value : null;
}

function onYearChange(value: string) {
  const year = Number.parseInt(value, 10);
  if (!Number.isFinite(year)) return;
  emit('update:viewYear', year);
}

function onMonthChange(value: string) {
  const month = Number.parseInt(value, 10);
  if (!Number.isFinite(month)) return;
  emit('update:viewMonth', month);
}

function emptyDayState() {
  return {
    isSelected: false,
    isFocused: false,
    isToday: false,
    showTodayMarker: false,
    isRangeStart: false,
    isRangeEnd: false,
    isInRange: false,
    isHovered: false,
    isSameDayRange: false,
  };
}

function withTodayMarker<T extends {
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}>(
  state: T,
  isToday: boolean,
) {
  return {
    ...state,
    isToday,
    showTodayMarker: isToday && !state.isSelected && !state.isRangeStart && !state.isRangeEnd,
  };
}

function resolveDayState(cell: FilterDateParts & { inMonth?: boolean }) {
  if (cell.inMonth === false) {
    return emptyDayState();
  }

  const isToday = isSameFilterDate(cell, startOfTodayParts());

  if (props.selectionMode === 'single') {
    const isSelected = isSameFilterDate(cell, props.selectedDate ?? null);
    return withTodayMarker(
      {
        isSelected,
        isFocused: !isToday && !isSelected && isSameFilterDate(cell, props.focusedDate ?? null),
        isRangeStart: false,
        isRangeEnd: false,
        isInRange: false,
        isHovered: false,
        isSameDayRange: false,
      },
      isToday,
    );
  }

  const start = props.rangeStart ?? null;
  const end = props.rangeEnd ?? null;
  const pendingStart = props.rangePendingStart ?? null;
  const hoverEnd = props.rangeHoverEnd ?? null;

  if (pendingStart && hoverEnd) {
    const isPendingStartCell = isSameFilterDate(cell, pendingStart);
    const isHoverCell = isSameFilterDate(cell, hoverEnd);
    const hasDistinctRange = compareFilterDates(pendingStart, hoverEnd) !== 0;

    if (!hasDistinctRange) {
      return withTodayMarker(
        {
          isSelected: false,
          isFocused: false,
          isRangeStart: isPendingStartCell,
          isRangeEnd: false,
          isInRange: false,
          isHovered: false,
          isSameDayRange: false,
        },
        isToday,
      );
    }

    const rangeStart =
      compareFilterDates(pendingStart, hoverEnd) <= 0 ? pendingStart : hoverEnd;
    const rangeEnd =
      compareFilterDates(pendingStart, hoverEnd) <= 0 ? hoverEnd : pendingStart;

    return withTodayMarker(
      {
        isSelected: false,
        isFocused: false,
        isRangeStart: isPendingStartCell,
        isRangeEnd: isHoverCell && !isPendingStartCell,
        isInRange:
          isFilterDateInRange(cell, rangeStart, rangeEnd)
          && !isPendingStartCell
          && !isHoverCell,
        isHovered: isHoverCell && !isPendingStartCell,
        isSameDayRange: false,
      },
      isToday,
    );
  }

  if (pendingStart) {
    const isPendingStart = isSameFilterDate(cell, pendingStart);
    return withTodayMarker(
      {
        isSelected: false,
        isFocused: !isToday && !isPendingStart && isSameFilterDate(cell, props.focusedDate ?? null),
        isRangeStart: isPendingStart,
        isRangeEnd: false,
        isInRange: false,
        isHovered: false,
        isSameDayRange: false,
      },
      isToday,
    );
  }

  const isStart = isSameFilterDate(cell, start);
  const isEnd = isSameFilterDate(cell, end);
  const hasDistinctRange = Boolean(start && end && compareFilterDates(start, end) !== 0);

  const isCommitted =
    isStart
    || isEnd
    || (hasDistinctRange && isFilterDateInRange(cell, start, end));

  return withTodayMarker(
    {
      isSelected: false,
      isFocused: !isToday && !isCommitted && isSameFilterDate(cell, props.focusedDate ?? null),
      isRangeStart: isStart,
      isRangeEnd: isEnd,
      isInRange:
        hasDistinctRange && isFilterDateInRange(cell, start, end) && !isStart && !isEnd,
      isHovered: false,
      isSameDayRange: false,
    },
    isToday,
  );
}

function onDayMouseEnter(cell: FilterDateParts & { inMonth?: boolean }) {
  if (props.disabled || cell.inMonth === false) return;
  emit('day-hover', cell);
}

function onDayMouseLeave() {
  emit('day-hover', null);
}

function onDayClick(cell: FilterDateParts & { inMonth?: boolean }) {
  if (props.disabled || cell.inMonth === false) return;
  emit('day-click', cell);
}

function onHeaderActionClick() {
  if (props.disabled || !showHeaderActionButton.value) return;
  if (props.headerAction === 'reset') {
    emit('reset-click');
    return;
  }
  emit('today-click');
}
</script>

<template>
  <div :class="[styles.root, headerMode === 'nav' && styles.rootNav]">
    <div v-if="headerMode === 'select'" :class="styles.headerChrome">
      <div :class="styles.headerSelectRow">
        <div :class="styles.headerSelectGroup">
          <FilterSelect
            variant="operator"
            layout="adaptive"
            trigger-style="subtle"
            trigger-size="xs"
            open-id="year"
            :active-open-id="activeHeaderSelectId"
            :menu-max-height="FILTER_CALENDAR_SELECT_MENU_MAX_HEIGHT"
            menu-list-scroll
            :model-value="String(viewYear)"
            :options="yearOptions"
            :disabled="disabled"
            @update:active-open-id="onHeaderSelectOpenChange"
            @update:model-value="onYearChange"
          />
          <FilterSelect
            variant="operator"
            layout="adaptive"
            trigger-style="subtle"
            trigger-size="xs"
            open-id="month"
            :active-open-id="activeHeaderSelectId"
            :model-value="String(viewMonth)"
            :options="monthOptions"
            :disabled="disabled"
            @update:active-open-id="onHeaderSelectOpenChange"
            @update:model-value="onMonthChange"
          />
        </div>
        <EgButton
          v-if="showHeaderActionButton"
          :class="styles.headerAction"
          variant="text"
          size="xs"
          :disabled="disabled"
          @click="onHeaderActionClick"
        >
          {{ resolvedHeaderActionLabel }}
        </EgButton>
      </div>
      <EgDivider type="module" direction="horizontal" :class="styles.headerDivider" />
    </div>

    <div v-else :class="styles.headerNavChrome">
      <div :class="styles.headerNavRow">
        <div :class="styles.headerNav">
          <div :class="styles.navGroup">
            <EgIconButton shape="square" size="xs" label="Previous year" :disabled="disabled" @click="emit('prev-year')">
              <EgIcon name="eds-arrow-go-first" size="sm" fit />
            </EgIconButton>
            <EgIconButton shape="square" size="xs" label="Previous month" :disabled="disabled" @click="emit('prev-month')">
              <EgIcon name="eds-arrow-left-mini-ios" size="sm" fit />
            </EgIconButton>
          </div>
          <span :class="styles.navTitle">{{ monthTitle }}</span>
          <div :class="styles.navGroup">
            <EgIconButton shape="square" size="xs" label="Next month" :disabled="disabled" @click="emit('next-month')">
              <EgIcon name="eds-arrow-right-mini-ios" size="sm" fit />
            </EgIconButton>
            <EgIconButton shape="square" size="xs" label="Next year" :disabled="disabled" @click="emit('next-year')">
              <EgIcon name="eds-arrow-go-last" size="sm" fit />
            </EgIconButton>
          </div>
        </div>
        <EgButton
          v-if="showHeaderActionButton"
          :class="styles.headerAction"
          variant="text"
          size="xs"
          :disabled="disabled"
          @click="onHeaderActionClick"
        >
          {{ resolvedHeaderActionLabel }}
        </EgButton>
      </div>
      <EgDivider type="page" direction="horizontal" :class="styles.headerDivider" />
    </div>

    <div :class="styles.weekdayRow">
      <span
        v-for="(sourceLabel, index) in FILTER_WEEKDAY_LABELS"
        :key="sourceLabel"
        :class="styles.weekday"
      >
        {{ weekdayLabels[index] }}
      </span>
    </div>

    <div :class="styles.grid" @mouseleave="onDayMouseLeave">
      <button
        v-for="cell in calendarCells"
        :key="`${cell.year}-${cell.month}-${cell.day}`"
        type="button"
        :class="[
          styles.dayCell,
          !cell.inMonth && styles.dayOutside,
          resolveDayState(cell).isSelected && styles.daySelected,
          resolveDayState(cell).isFocused && styles.dayFocused,
          resolveDayState(cell).showTodayMarker && styles.dayToday,
          resolveDayState(cell).isRangeStart && styles.dayRangeStart,
          resolveDayState(cell).isRangeEnd && styles.dayRangeEnd,
          resolveDayState(cell).isInRange && styles.dayInRange,
          resolveDayState(cell).isHovered && styles.dayHovered,
        ]"
        :disabled="disabled || !cell.inMonth"
        @mouseenter="onDayMouseEnter(cell)"
        @click="onDayClick(cell)"
      >
        <span :class="styles.dayLabel">{{ cell.day }}</span>
      </button>
    </div>
  </div>
</template>
