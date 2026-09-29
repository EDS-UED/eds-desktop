<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EgAvatar } from '../../atoms/avatar';
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
import { EgTabs } from '../../molecules/tab';
import type { TooltipAlign, TooltipTrigger } from '../../molecules/tooltip';
import type { EgFilterFieldMemberOption, EgFilterFieldSelectionMode } from './types';
import { FILTER_SELECT_PLACEHOLDER } from './types';
import {
  FILTER_MEMBER_PICKER_HEIGHT,
  FILTER_MEMBER_PRESETS,
  FILTER_WAAS_PROJECT_PRESETS,
  isFilterWaasProjectPresetId,
  resolveFilterMemberPreset,
  type FilterMemberPreset,
  type FilterWaasProjectPreset,
} from './filterMemberPresets';
import FilterSearchPickerEmpty from './FilterSearchPickerEmpty.vue';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
import { useFilterPickerMenuWidthMode } from './useFilterPickerMenuWidthMode';
import { useFilterSearchPickerListAreaHeight } from './useFilterSearchPickerListAreaHeight';
import {
  resolveFilterPickerListSelectedDomIndex,
  useFilterSearchPickerScrollToSelected,
} from './useFilterSearchPickerScrollToSelected';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionMemberValue.module.css';

const t = useFilterTranslate();

const FILTER_MEMBER_SELECT_ALL_ICON = 'eds-list-lattice-mobile-fill';
type FilterMemberPickerOption = FilterMemberPreset | FilterWaasProjectPreset;

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    selectionMode?: EgFilterFieldSelectionMode;
    triggerWidthMode?: FlotationTriggerWidthMode;
    triggerWidth?: number;
    trigger?: TooltipTrigger;
    /** 成员 / WaaS 项目 Tab；关闭时仅展示成员列表。 */
    showTypeTabs?: boolean;
    /** 业务自定义成员（有头像）；传 [] 时不回退演示 catalog。 */
    memberOptions?: readonly EgFilterFieldMemberOption[];
    /** 业务自定义 WaaS 项目（无头像）。 */
    waasProjectOptions?: readonly EgFilterFieldMemberOption[];
    dropdownOpenId?: string;
    boundarySelector?: string;
    pickerAlign?: TooltipAlign;
  }>(),
  {
    placeholder: FILTER_SELECT_PLACEHOLDER,
    disabled: false,
    selectionMode: 'single',
    triggerWidthMode: 'adaptive',
    trigger: 'click',
    showTypeTabs: true,
    pickerAlign: 'end',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const rootRef = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const flotationRef = ref<{ close?: () => void } | null>(null);
const { onDropdownOpen, onDropdownClose } = useFilterPanelDropdownMutex(
  () => props.dropdownOpenId,
  flotationRef,
);
const activeTabIndex = ref(0);
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

const memberPickerTabLabels = computed(() => [t('成员'), t('WaaS项目')]);

const memberPresets = computed<FilterMemberPickerOption[]>(() => {
  if (props.memberOptions !== undefined) {
    return props.memberOptions as FilterMemberPickerOption[];
  }
  return FILTER_MEMBER_PRESETS;
});

const waasProjectPresets = computed<FilterMemberPickerOption[]>(() => {
  if (props.waasProjectOptions !== undefined) {
    return props.waasProjectOptions as FilterMemberPickerOption[];
  }
  return FILTER_WAAS_PROJECT_PRESETS;
});

const allPickerPresets = computed(() => [
  ...memberPresets.value,
  ...waasProjectPresets.value,
]);

const effectiveShowTypeTabs = computed(
  () =>
    props.showTypeTabs
    && memberPresets.value.length > 0
    && waasProjectPresets.value.length > 0,
);

const isWaasProjectTabActive = computed(() => {
  if (effectiveShowTypeTabs.value) return activeTabIndex.value === 1;
  return memberPresets.value.length === 0 && waasProjectPresets.value.length > 0;
});

const showSelectAllLeading = computed(() => !isWaasProjectTabActive.value);

const activePresetList = computed<FilterMemberPickerOption[]>(() =>
  isWaasProjectTabActive.value ? waasProjectPresets.value : memberPresets.value,
);

function resolveMemberPickerPresetById(id: string): FilterMemberPickerOption | undefined {
  const trimmed = id.trim();
  if (!trimmed) return undefined;
  return (
    allPickerPresets.value.find((option) => option.id === trimmed)
    ?? resolveFilterMemberPreset(trimmed)
  );
}

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return activePresetList.value;
  return activePresetList.value.filter((option) =>
    t(option.label).toLowerCase().includes(query),
  );
});

const showSearchEmpty = computed(
  () => Boolean(searchQuery.value.trim()) && filteredOptions.value.length === 0,
);

const pickerWidthLabels = computed(() => {
  const labels = allPickerPresets.value.map((option) => t(option.label));
  if (isMulti.value) labels.unshift(t('全部'));
  labels.push(t('搜索'));
  if (effectiveShowTypeTabs.value) {
    labels.push(...memberPickerTabLabels.value);
  }
  return labels;
});

const { flotationWidthMode, syncMenuWidthMode, syncMenuWidthModeAfterLayout } =
  useFilterPickerMenuWidthMode({
    rootRef,
    optionLabels: pickerWidthLabels,
    includeCheckbox: isMulti,
  });

const {
  listAreaStyle,
  resetListAreaHeight,
  scheduleCaptureListAreaHeight,
  onScrollMetricsDepsChange,
} = useFilterSearchPickerListAreaHeight({
  scrollRef,
  searchQuery,
  showSearchEmpty,
});

watch(
  () => [props.showTypeTabs, memberPresets.value.length, waasProjectPresets.value.length],
  () => {
    if (!effectiveShowTypeTabs.value) activeTabIndex.value = 0;
  },
);

watch(
  () => [
    filteredOptions.value.length,
    searchQuery.value,
    activeTabIndex.value,
    props.showTypeTabs,
    isMulti.value,
    showSearchEmpty.value,
  ],
  () => {
    updatePickerScroll();
    onScrollMetricsDepsChange();
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
  resetListAreaHeight();
}

function isOptionSelected(option: FilterMemberPickerOption): boolean {
  return activeSelectedValues.value.has(option.id);
}

const { scheduleScrollSelectedToCenter } = useFilterSearchPickerScrollToSelected({
  scrollRef,
  showSearchEmpty,
  resolveSelectedDomIndex: () => {
    const options = filteredOptions.value;
    const selectedListIndex = isMulti.value
      ? options.findIndex((option) => isOptionSelected(option))
      : options.findIndex((option) => option.id === props.modelValue.trim());
    return resolveFilterPickerListSelectedDomIndex({
      isMulti: isMulti.value,
      optionsLength: options.length,
      selectedListIndex,
    });
  },
  onScrolled: updatePickerScroll,
});

function onRootPointerDown() {
  if (props.disabled) return;
  syncMenuWidthMode();
}

function onPickerOpen() {
  onDropdownOpen();
  resetListAreaHeight();
  if (isMulti.value) {
    draftValues.value = cloneValueSet(parseValueSet(props.modelValue));
  }
  syncMenuWidthMode();
  void nextTick(() => {
    updatePickerScroll();
    scheduleCaptureListAreaHeight();
    void scheduleScrollSelectedToCenter();
    void syncMenuWidthModeAfterLayout();
  });
}

function onPickerClose() {
  onDropdownClose();
  resetSearch();
  activeTabIndex.value = 0;
}

function getOptionSelectionState(option: FilterMemberPickerOption): 'none' | 'full' {
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

function onCheckboxUpdate(option: FilterMemberPickerOption, checked: boolean) {
  if (props.disabled || !isMulti.value) return;
  setMultiValue(option.id, checked);
}

function onOptionClick(option: FilterMemberPickerOption, close: () => void) {
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

async function onPickerConfirm(close: () => void) {
  if (props.disabled) return;
  const nextValue = [...draftValues.value].join(',');
  emit('update:modelValue', nextValue);
  resetSearch();
  await nextTick();
  close();
  flotationRef.value?.close?.();
}

function onPickerCancel(close: () => void) {
  resetSearch();
  close();
}

const activeTriggerPreset = computed(() => {
  if (isMulti.value) {
    if (selectedCount.value === 0) return null;
    return resolveMemberPickerPresetById(firstSelectedValueKey.value) ?? null;
  }
  return resolveMemberPickerPresetById(props.modelValue) ?? null;
});

const triggerLabel = computed(() =>
  activeTriggerPreset.value?.label ?? t(props.placeholder),
);

const showTriggerAvatar = computed(() => {
  if (!activeTriggerPreset.value) return false;
  return !isFilterWaasProjectPresetId(activeTriggerPreset.value.id);
});

const showTriggerCountMessage = computed(() => isMulti.value && selectedCount.value > 0);

const triggerCountText = computed(() => String(selectedCount.value));
</script>

<template>
  <div ref="rootRef" :class="styles.root" @pointerdown="onRootPointerDown">
    <EgFlotation
      ref="flotationRef"
      :disabled="disabled"
      :trigger="trigger"
      placement="bottom"
      :align="pickerAlign"
      :width-mode="flotationWidthMode"
      :show-add="false"
      :show-menu-divider="false"
      :boundary-selector="boundarySelector"
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
          :show-symbol="showTriggerAvatar"
        >
          <template v-if="showTriggerAvatar && activeTriggerPreset" #symbol>
            <EgAvatar
              :name="activeTriggerPreset.name"
              :color-seed="activeTriggerPreset.id"
              size="sm"
            />
          </template>
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
          :class="[styles.menu, flotationWidthMode === 'adaptive' && styles.menuAdaptive]"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          :width-mode="menuWidthMode"
          :width="menuWidth"
          height-mode="fixed"
          :height="FILTER_MEMBER_PICKER_HEIGHT"
          :max-height="FILTER_MEMBER_PICKER_HEIGHT"
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

            <div v-if="effectiveShowTypeTabs" :class="styles.tabBar">
              <EgTabs
                v-model="activeTabIndex"
                :labels="memberPickerTabLabels"
                horizontal-gap="sm"
                vertical-gap="xs"
                width-mode="fixed"
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
                showSearchEmpty && styles.optionListScrollEmpty,
                pickerBottomScrim && !isMulti && !showSearchEmpty && styles.listScrollFadeBottom,
              ]"
              :style="listAreaStyle"
            >
              <FilterSearchPickerEmpty v-if="showSearchEmpty" />
              <div v-else ref="optionListRef" :class="styles.optionList">
                <EgFlotationMenuItem
                  v-if="isMulti && showSelectAllLeading"
                  key="select-all-with-leading"
                  box-type="image-text"
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
                        <EgIcon :name="FILTER_MEMBER_SELECT_ALL_ICON" fit />
                      </span>
                    </span>
                  </template>
                </EgFlotationMenuItem>
                <EgFlotationMenuItem
                  v-else-if="isMulti"
                  key="select-all-text-only"
                  box-type="text"
                  :label="t('全部')"
                  show-checkbox
                  :checked="selectAllChecked"
                  :checkbox-indeterminate="selectAllIndeterminate"
                  :show-tag="false"
                  @click="onSelectAllToggle"
                  @update:checked="onSelectAllToggle"
                />

                <EgFlotationMenuItem
                  v-for="option in filteredOptions"
                  :key="option.id"
                  :box-type="isWaasProjectTabActive ? 'text' : 'image-text'"
                  :label="t(option.label)"
                  :focused="!isMulti && isOptionSelected(option)"
                  :show-checkbox="isMulti"
                  :checked="isOptionSelected(option)"
                  :show-tag="false"
                  @click="onOptionClick(option, close)"
                  @update:checked="onCheckboxUpdate(option, $event)"
                >
                  <template v-if="!isWaasProjectTabActive" #leading>
                    <EgAvatar
                      :name="option.name"
                      :color-seed="option.id"
                      size="sm"
                    />
                  </template>
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
