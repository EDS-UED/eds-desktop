<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { useScrollChromeScrim } from '../../composables/useScrollChromeScrim';
import { EgMessage } from '../../molecules/feedback';
import comboActionStyles from '../../molecules/combo/ComboAction.module.css';
import { EgComboFloatButton } from '../../molecules/combo';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  type FlotationTriggerWidthMode,
} from '../../molecules/flotation';
import { EgSearchInput } from '../../molecules/search';
import { EgStatusTag } from '../../molecules/tag';
import type { TooltipTrigger } from '../../molecules/tooltip';
import type { EgFilterFieldSelectionMode } from './types';
import { FILTER_SELECT_PLACEHOLDER } from './types';
import {
  FILTER_STATUS_PICKER_HEIGHT,
  FILTER_STATUS_PRESETS,
  resolveFilterStatusPreset,
  type FilterStatusPreset,
} from './filterStatusPresets';
import FilterSearchPickerEmpty from './FilterSearchPickerEmpty.vue';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionStatusValue.module.css';

const t = useFilterTranslate();

const FILTER_STATUS_SELECT_ALL_ICON = 'eds-list-lattice-mobile-fill';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    selectionMode?: EgFilterFieldSelectionMode;
    triggerWidthMode?: FlotationTriggerWidthMode;
    triggerWidth?: number;
    trigger?: TooltipTrigger;
  }>(),
  {
    placeholder: FILTER_SELECT_PLACEHOLDER,
    disabled: false,
    selectionMode: 'single',
    triggerWidthMode: 'adaptive',
    trigger: 'click',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const searchQuery = ref('');
const draftValues = ref<Set<string>>(new Set());
const scrollRef = ref<HTMLElement | null>(null);
const optionListRef = ref<HTMLElement | null>(null);

const {
  canScroll: pickerCanScroll,
  topScrim: pickerTopScrim,
  bottomScrim: pickerBottomScrim,
  update: updatePickerScroll,
} = useScrollChromeScrim(scrollRef, { contentRef: optionListRef });

const isMulti = computed(() => props.selectionMode === 'multi');

type FilterSelectAllMode = 'none' | 'some' | 'all';

const selectedValueList = computed(() => {
  const raw = props.modelValue.trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
});

const selectedValues = computed(() => new Set(selectedValueList.value));

const activeSelectedValues = computed(() =>
  isMulti.value ? draftValues.value : selectedValues.value,
);

const firstSelectedValueKey = computed(() => selectedValueList.value[0] ?? '');

const selectedCount = computed(() => selectedValueList.value.length);

const hasDraftSelection = computed(() => draftValues.value.size > 0);

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return FILTER_STATUS_PRESETS;
  return FILTER_STATUS_PRESETS.filter((option) =>
    t(option.label).toLowerCase().includes(query),
  );
});

const showSearchEmpty = computed(
  () => Boolean(searchQuery.value.trim()) && filteredOptions.value.length === 0,
);

watch(
  () => [filteredOptions.value.length, searchQuery.value, isMulti.value, showSearchEmpty.value],
  () => {
    updatePickerScroll();
  },
);

function cloneValueSet(values: Iterable<string>): Set<string> {
  return new Set(values);
}

function parseValueSet(raw: string): Set<string> {
  const trimmed = raw.trim();
  if (!trimmed) return new Set();
  return new Set(
    trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function resetSearch() {
  searchQuery.value = '';
}

function onPickerOpen() {
  if (isMulti.value) {
    draftValues.value = cloneValueSet(parseValueSet(props.modelValue));
  }
  void nextTick(() => {
    updatePickerScroll();
  });
}

function onPickerClose() {
  resetSearch();
}

function isOptionSelected(option: FilterStatusPreset): boolean {
  return activeSelectedValues.value.has(option.id);
}

function getOptionSelectionState(option: FilterStatusPreset): 'none' | 'full' {
  return isOptionSelected(option) ? 'full' : 'none';
}

const selectAllMode = computed<FilterSelectAllMode>(() => {
  const options = filteredOptions.value;
  if (!options.length) return 'none';

  const states = options.map((option) => getOptionSelectionState(option));
  const fullCount = states.filter((state) => state === 'full').length;
  if (fullCount === options.length) return 'all';
  if (states.some((state) => state !== 'none')) return 'some';
  return 'none';
});

const selectAllChecked = computed(() => selectAllMode.value === 'all');
const selectAllIndeterminate = computed(() => selectAllMode.value === 'some');

function onSelectAllToggle() {
  if (props.disabled || !isMulti.value) return;

  const next = cloneValueSet(draftValues.value);
  const shouldSelectAll = selectAllMode.value !== 'all';

  filteredOptions.value.forEach((option) => {
    if (shouldSelectAll) next.add(option.id);
    else next.delete(option.id);
  });

  draftValues.value = next;
}

function setMultiValue(valueKey: string, selected: boolean) {
  const next = cloneValueSet(draftValues.value);
  if (selected) next.add(valueKey);
  else next.delete(valueKey);
  draftValues.value = next;
}

function onCheckboxUpdate(option: FilterStatusPreset, checked: boolean) {
  if (props.disabled || !isMulti.value) return;
  setMultiValue(option.id, checked);
}

function onOptionClick(option: FilterStatusPreset, close: () => void) {
  if (props.disabled) return;

  if (isMulti.value) {
    setMultiValue(option.id, !isOptionSelected(option));
    return;
  }

  emit('update:modelValue', option.id);
  resetSearch();
  close();
}

function onPickerClear() {
  if (props.disabled || !isMulti.value) return;
  draftValues.value = new Set();
}

function onPickerConfirm(close: () => void) {
  if (props.disabled) return;
  emit('update:modelValue', [...draftValues.value].join(','));
  resetSearch();
  close();
}

function onPickerCancel(close: () => void) {
  resetSearch();
  close();
}

const activeTriggerPreset = computed(() => {
  if (isMulti.value) {
    if (selectedCount.value === 0) return null;
    return resolveFilterStatusPreset(firstSelectedValueKey.value) ?? null;
  }
  return resolveFilterStatusPreset(props.modelValue) ?? null;
});

const showTriggerCountMessage = computed(() => isMulti.value && selectedCount.value > 0);

const triggerCountText = computed(() => String(selectedCount.value));
</script>

<template>
  <div :class="styles.root">
    <EgFlotation
      :disabled="disabled"
      :trigger="trigger"
      placement="bottom"
      align="start"
      width-mode="trigger"
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
          <EgStatusTag
            v-if="activeTriggerPreset"
            size="md"
            :status="activeTriggerPreset.status"
          >
            {{ t(activeTriggerPreset.label) }}
          </EgStatusTag>
          <span v-else :class="styles.triggerPlaceholder">{{ t(placeholder) }}</span>
          <template v-if="showTriggerCountMessage" #message>
            <EgMessage
              type="subtle"
              :text="triggerCountText"
              focus-background="same-white"
            />
          </template>
        </EgFlotationTrigger>
      </template>

      <template #content="{ close, menuWidth, menuWidthMode }">
        <EgFlotationMenu
          :class="styles.menu"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          :width-mode="menuWidthMode"
          :width="menuWidth"
          height-mode="adaptive"
          :max-height="FILTER_STATUS_PICKER_HEIGHT"
          :show-add="false"
          :show-divider="false"
          :scrollable="false"
        >
          <div :class="styles.pickerRows">
            <div :class="styles.searchHeader">
              <EgSearchInput
                v-model="searchQuery"
                :placeholder="t('搜索')"
                width-mode="full"
              />
            </div>

            <EgDivider
              v-if="pickerCanScroll"
              type="module"
              direction="horizontal"
              :class="[
                comboActionStyles.divider,
                comboActionStyles.dividerAnimated,
                !pickerTopScrim && comboActionStyles.dividerAnimatedHidden,
                styles.headerDivider,
              ]"
              :hide="!pickerTopScrim"
            />

            <div
              ref="scrollRef"
              :class="[
                styles.optionListScroll,
                pickerBottomScrim && !isMulti && !showSearchEmpty && styles.listScrollFadeBottom,
              ]"
            >
              <FilterSearchPickerEmpty v-if="showSearchEmpty" />
              <div v-else ref="optionListRef" :class="styles.optionList">
                <EgFlotationMenuItem
                  v-if="isMulti"
                  box-type="text"
                  :label="t('全部')"
                  show-checkbox
                  :checked="selectAllChecked"
                  :checkbox-indeterminate="selectAllIndeterminate"
                  :show-tag="false"
                  @click="onSelectAllToggle"
                  @update:checked="onSelectAllToggle"
                >
                  <template #leading>
                    <span :class="styles.selectAllIcon">
                      <span :class="styles.selectAllIconGlyph">
                        <EgIcon :name="FILTER_STATUS_SELECT_ALL_ICON" fit />
                      </span>
                    </span>
                  </template>
                </EgFlotationMenuItem>

                <EgFlotationMenuItem
                  v-for="option in filteredOptions"
                  :key="option.id"
                  box-type="text"
                  :focused="!isMulti && isOptionSelected(option)"
                  :show-checkbox="isMulti"
                  :checked="isOptionSelected(option)"
                  :show-tag="false"
                  @click="onOptionClick(option, close)"
                  @update:checked="onCheckboxUpdate(option, $event)"
                >
                  <span :class="styles.optionTag">
                    <EgStatusTag size="md" :status="option.status">
                      {{ t(option.label) }}
                    </EgStatusTag>
                  </span>
                </EgFlotationMenuItem>
              </div>
            </div>

            <EgComboFloatButton
              v-if="isMulti"
              :class="styles.pickerAction"
              tone="decor"
              :count="2"
              :clear="hasDraftSelection"
              direction="right"
              bar-padding="compact"
              divider
              :cancel-label="t('取消')"
              :confirm-label="t('确定')"
              @clear="onPickerClear"
              @cancel="onPickerCancel(close)"
              @confirm="onPickerConfirm(close)"
            />
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
