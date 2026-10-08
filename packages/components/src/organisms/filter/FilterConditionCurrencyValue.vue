<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgCrypto, type CryptoName } from '../../atoms/crypto';
import { EgIcon } from '../../atoms/icons';
import { useScrollChromeScrim } from '../../composables/useScrollChromeScrim';
import { EgMessage, type MessageType } from '../../molecules/feedback';
import { EgTag } from '../../molecules/tag';
import comboActionStyles from '../../molecules/combo/ComboAction.module.css';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  type FlotationTriggerStyle,
  type FlotationTriggerWidthMode,
  type FlotationWidthMode,
} from '../../molecules/flotation';
import { EgComboFloatButton } from '../../molecules/combo';
import { EgSearchInput } from '../../molecules/search';
import type { TooltipAlign, TooltipPlacement, TooltipTrigger } from '../../molecules/tooltip';
import type { EgFilterCascadePlacement, EgFilterFieldSelectionMode } from './types';
import { FILTER_SELECT_PLACEHOLDER } from './types';
import {
  FILTER_CURRENCY_CASCADE_PICKER_HEIGHT,
  FILTER_CURRENCY_CASCADE_PICKER_WIDTH,
  FILTER_CURRENCY_PICKER_HEIGHT,
  FILTER_CURRENCY_PICKER_WIDTH,
  FILTER_CURRENCY_PRESETS,
  parseFilterCurrencyValue,
  type FilterCurrencyPreset,
} from './filterCurrencyPresets';
import type { EgFilterFieldCurrencyOption } from './types';
import FilterSearchPickerEmpty from './FilterSearchPickerEmpty.vue';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
import { useFilterPickerMenuWidthMode } from './useFilterPickerMenuWidthMode';
import { useFilterSearchPickerListAreaHeight } from './useFilterSearchPickerListAreaHeight';
import {
  resolveFilterPickerListSelectedDomIndex,
  useFilterSearchPickerScrollToSelected,
} from './useFilterSearchPickerScrollToSelected';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionCurrencyValue.module.css';

const t = useFilterTranslate();

/** 与 consumer WaasSubAddressCurrencyPicker 一致，避免窄面板 clamp 级联菜单。 */
const CASCADE_BOUNDARY_SELECTOR = '.app-preview';
const FILTER_CURRENCY_SELECT_ALL_ICON = 'eds-list-lattice-mobile-fill';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    selectionMode?: EgFilterFieldSelectionMode;
    triggerWidthMode?: FlotationTriggerWidthMode;
    triggerWidth?: number;
    trigger?: TooltipTrigger;
    /** 多链级联子菜单方向；auto 默认右侧，空间不足自动翻转到左侧。 */
    cascadePlacement?: EgFilterCascadePlacement;
    /** EgFilter 面板内下拉互斥 id。 */
    dropdownOpenId?: string;
    boundarySelector?: string;
    pickerAlign?: TooltipAlign;
    /** 业务传入时仅展示列表数据对应的币种 preset id。 */
    currencyPresetIds?: readonly string[];
    /** 业务传入时按 symbol 展示列表中出现的币种（优先于 currencyPresetIds）。 */
    currencySymbols?: readonly string[];
    /** 业务传入时完整币种/网络（最高优先级）。 */
    currencyOptions?: readonly EgFilterFieldCurrencyOption[];
    /** Module Menu 标题区 text 触发器（如 Waas Sub-Address 工具栏）。 */
    moduleMenuTitle?: boolean;
    triggerStyle?: FlotationTriggerStyle;
    closeOnScroll?: boolean;
    /** 覆盖 useFilterPickerMenuWidthMode 推断（如工具栏固定 280px）。 */
    menuWidthMode?: FlotationWidthMode;
    menuWidth?: number;
    menuHeightMode?: 'fixed' | 'adaptive';
  }>(),
  {
    placeholder: FILTER_SELECT_PLACEHOLDER,
    disabled: false,
    selectionMode: 'single',
    triggerWidthMode: 'adaptive',
    trigger: 'click',
    cascadePlacement: 'auto',
    pickerAlign: 'end',
    boundarySelector: CASCADE_BOUNDARY_SELECTOR,
    moduleMenuTitle: false,
    triggerStyle: 'subtle',
    closeOnScroll: false,
  },
);

const resolvedCascadePlacement = computed((): TooltipPlacement =>
  props.cascadePlacement === 'left' ? 'left' : 'right',
);

const cascadeMenuFlip = computed(() => props.cascadePlacement === 'auto');

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const rootRef = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const activeCascadeKey = ref<string | null>(null);
const draftValues = ref<Set<string>>(new Set());
const cascadeDraftSnapshot = ref<Set<string> | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const optionListRef = ref<HTMLElement | null>(null);
const cascadeScrollRef = ref<HTMLElement | null>(null);
const cascadeListRef = ref<HTMLElement | null>(null);
const flotationRef = ref<{ close?: () => void } | null>(null);
const { onDropdownOpen, onDropdownClose } = useFilterPanelDropdownMutex(
  () => props.dropdownOpenId,
  flotationRef,
);

const {
  canScroll: pickerCanScroll,
  topScrim: pickerTopScrim,
  bottomScrim: pickerBottomScrim,
  update: updatePickerScroll,
} = useScrollChromeScrim(scrollRef, { contentRef: optionListRef });

const {
  topScrim: cascadeTopScrim,
  update: updateCascadeScroll,
} = useScrollChromeScrim(cascadeScrollRef, { contentRef: cascadeListRef });

const isMulti = computed(() => props.selectionMode === 'multi');

type FilterSelectAllMode = 'none' | 'some' | 'all';
type FilterOptionSelectionState = 'none' | 'partial' | 'full';

const parsedValue = computed(() => parseFilterCurrencyValue(props.modelValue));

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

const visibleCurrencyPresets = computed((): FilterCurrencyPreset[] => {
  if (props.currencyOptions?.length) {
    return props.currencyOptions as FilterCurrencyPreset[];
  }

  const symbolAllowlist = props.currencySymbols;
  if (symbolAllowlist?.length) {
    const allowed = new Set(
      symbolAllowlist.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean),
    );
    const seen = new Set<string>();
    return FILTER_CURRENCY_PRESETS.filter((option) => {
      const label = option.label.trim().toUpperCase();
      if (!allowed.has(label) || seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }

  const allowlist = props.currencyPresetIds;
  if (!allowlist?.length) return FILTER_CURRENCY_PRESETS;
  const allowed = new Set(allowlist);
  return FILTER_CURRENCY_PRESETS.filter((option) => allowed.has(option.id));
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const presets = visibleCurrencyPresets.value;
  if (!query) return presets;
  return presets.filter((option) => option.label.toLowerCase().includes(query));
});

const showSearchEmpty = computed(
  () => Boolean(searchQuery.value.trim()) && filteredOptions.value.length === 0,
);

const pickerWidthLabels = computed(() => {
  const labels = visibleCurrencyPresets.value.flatMap((option) => {
    const rowLabels = [option.label];
    option.networks?.forEach((network) => rowLabels.push(network.label));
    return rowLabels;
  });
  if (isMulti.value) labels.unshift(t('全部'));
  labels.push(t('搜索'));
  return labels;
});

const { flotationWidthMode, syncMenuWidthMode, syncMenuWidthModeAfterLayout } =
  useFilterPickerMenuWidthMode({
    rootRef,
    optionLabels: pickerWidthLabels,
    includeCheckbox: isMulti,
  });

const resolvedFlotationWidthMode = computed((): FlotationWidthMode => {
  if (props.menuWidthMode) return props.menuWidthMode;
  if (props.moduleMenuTitle) return 'fixed';
  return flotationWidthMode.value;
});

const resolvedFlotationWidth = computed(() => {
  if (resolvedFlotationWidthMode.value !== 'fixed') return undefined;
  return props.menuWidth ?? FILTER_CURRENCY_PICKER_WIDTH;
});

const resolvedMenuHeightMode = computed((): 'fixed' | 'adaptive' => {
  if (props.menuHeightMode) return props.menuHeightMode;
  if (props.moduleMenuTitle) return 'adaptive';
  return 'fixed';
});

const cascadeSubmenuStyle = computed(() => ({
  '--filter-cascade-max-height': `${FILTER_CURRENCY_CASCADE_PICKER_HEIGHT}px`,
}));

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
  () => [filteredOptions.value.length, searchQuery.value, isMulti.value, showSearchEmpty.value],
  () => {
    updatePickerScroll();
    onScrollMetricsDepsChange();
  },
);

function buildValueKey(currencyId: string, networkKey?: string): string {
  return networkKey ? `${currencyId}:${networkKey}` : currencyId;
}

function resolveTriggerValueParts(valueKey: string): {
  symbol: string;
  networkLabel: string;
  cryptoName: CryptoName | null;
} {
  const { currencyId, networkKey } = parseFilterCurrencyValue(valueKey);
  const option =
    visibleCurrencyPresets.value.find((item) => item.id === currencyId)
    ?? FILTER_CURRENCY_PRESETS.find((item) => item.id === currencyId);
  if (!option) return { symbol: valueKey, networkLabel: '', cryptoName: null };
  const network = networkKey
    ? option.networks?.find((item) => item.key === networkKey)
    : undefined;
  return {
    symbol: option.label,
    networkLabel: network?.label ?? option.chainTagLabel ?? '',
    cryptoName: option.cryptoName,
  };
}

function resolveOptionModeTag(option: FilterCurrencyPreset): string | undefined {
  if (option.chainTagLabel?.trim()) return option.chainTagLabel;
  if (option.multiChain && option.modeTag) return t(option.modeTag);
  return undefined;
}

const activeTriggerValueKey = computed(() => {
  if (isMulti.value) {
    if (selectedCount.value === 0) return '';
    return firstSelectedValueKey.value;
  }
  return props.modelValue.trim();
});

const triggerValueParts = computed(() => {
  const valueKey = activeTriggerValueKey.value;
  if (!valueKey) return null;
  return resolveTriggerValueParts(valueKey);
});

const triggerLabel = computed(() =>
  triggerValueParts.value?.symbol ?? t(props.placeholder),
);

const showTriggerNetworkTag = computed(() => Boolean(triggerValueParts.value?.networkLabel));

const triggerNetworkLabel = computed(() => triggerValueParts.value?.networkLabel ?? '');

const triggerCryptoName = computed(() => triggerValueParts.value?.cryptoName ?? null);

const showTriggerSymbol = computed(() => Boolean(triggerCryptoName.value));

const showTriggerCountMessage = computed(() => isMulti.value && selectedCount.value > 0);

const triggerCountText = computed(() => String(selectedCount.value));

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

function clearActiveCascade() {
  activeCascadeKey.value = null;
  cascadeDraftSnapshot.value = null;
}

function getOptionSelectionStateFromValues(
  option: FilterCurrencyPreset,
  values: Set<string>,
): FilterOptionSelectionState {
  if (option.multiChain && option.networks?.length) {
    if (values.has(option.id)) return 'full';

    const networkKeys = option.networks.map((network) => buildValueKey(option.id, network.key));
    const selectedCount = networkKeys.filter((valueKey) => values.has(valueKey)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === networkKeys.length) return 'full';
    return 'partial';
  }

  return values.has(option.id) ? 'full' : 'none';
}

function getOptionSelectionState(option: FilterCurrencyPreset): FilterOptionSelectionState {
  return getOptionSelectionStateFromValues(option, activeSelectedValues.value);
}

/** 级联子菜单编辑未点「确定」前，父行 checkbox / 数量保持打开时快照。 */
function resolveOptionValueSetForParentRow(option: FilterCurrencyPreset): Set<string> {
  if (
    !isMulti.value
    || activeCascadeKey.value !== option.id
    || cascadeDraftSnapshot.value === null
  ) {
    return activeSelectedValues.value;
  }

  const merged = cloneValueSet(draftValues.value);
  removeOptionKeys(merged, option);
  cascadeDraftSnapshot.value.forEach((valueKey) => merged.add(valueKey));
  return merged;
}

function getOptionParentSelectionState(option: FilterCurrencyPreset): FilterOptionSelectionState {
  return getOptionSelectionStateFromValues(option, resolveOptionValueSetForParentRow(option));
}

function getOptionParentSelectedNetworkCount(option: FilterCurrencyPreset): number {
  const networks = option.networks ?? [];
  if (!networks.length) return 0;

  const values = resolveOptionValueSetForParentRow(option);
  if (values.has(option.id)) return networks.length;

  return networks.filter((network) =>
    values.has(buildValueKey(option.id, network.key)),
  ).length;
}

/** 多链父行：有部分网络选中即视为勾选，不用半选 indeterminate。 */
function isOptionParentCheckboxChecked(option: FilterCurrencyPreset): boolean {
  return getOptionParentSelectionState(option) !== 'none';
}

function getOptionParentNetworkTotalCount(option: FilterCurrencyPreset): number {
  const networks = option.networks ?? [];
  if (networks.length) return networks.length;
  const parsed = Number(option.messageText);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function showOptionParentMessage(option: FilterCurrencyPreset): boolean {
  if (!option.multiChain) return false;
  if (!isMulti.value) return Boolean(option.messageText);
  return getOptionParentNetworkTotalCount(option) > 0;
}

function getOptionParentMessageText(option: FilterCurrencyPreset): string {
  const selected = getOptionParentSelectedNetworkCount(option);
  if (selected > 0) return String(selected);
  return String(getOptionParentNetworkTotalCount(option));
}

function getOptionParentMessageType(option: FilterCurrencyPreset): MessageType {
  return getOptionParentSelectedNetworkCount(option) > 0 ? 'brand' : 'subtle';
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

function getNetworkSelectAllMode(option: FilterCurrencyPreset): FilterSelectAllMode {
  const networks = option.networks ?? [];
  if (!networks.length) return 'none';

  const values = activeSelectedValues.value;
  if (values.has(option.id)) return 'all';

  const networkKeys = networks.map((network) => buildValueKey(option.id, network.key));
  const selectedCount = networkKeys.filter((valueKey) => values.has(valueKey)).length;
  if (selectedCount === 0) return 'none';
  if (selectedCount === networkKeys.length) return 'all';
  return 'some';
}

function hasOptionDraftSelection(option: FilterCurrencyPreset): boolean {
  if (draftValues.value.has(option.id)) return true;
  const prefix = `${option.id}:`;
  return [...draftValues.value].some((valueKey) => valueKey.startsWith(prefix));
}

function removeOptionKeys(values: Set<string>, option: FilterCurrencyPreset) {
  values.delete(option.id);
  option.networks?.forEach((network) => {
    values.delete(buildValueKey(option.id, network.key));
  });
}

function selectOptionFully(values: Set<string>, option: FilterCurrencyPreset) {
  removeOptionKeys(values, option);
  values.add(option.id);
}

function expandOptionIdToNetworkKeys(values: Set<string>, option: FilterCurrencyPreset) {
  if (!values.has(option.id)) return;
  values.delete(option.id);
  option.networks?.forEach((network) => {
    values.add(buildValueKey(option.id, network.key));
  });
}

/** 多链全选时合并为 option.id，便于父级与子级「全部」一致。 */
function normalizeOptionSelection(values: Set<string>, option: FilterCurrencyPreset) {
  const networks = option.networks ?? [];
  if (!networks.length) return;

  const networkKeys = networks.map((network) => buildValueKey(option.id, network.key));
  const selectedCount = networkKeys.filter((valueKey) => values.has(valueKey)).length;
  if (values.has(option.id) || selectedCount === networkKeys.length) {
    selectOptionFully(values, option);
  }
}

function normalizeDraftMultiChainValues() {
  const next = cloneValueSet(draftValues.value);
  visibleCurrencyPresets.value.forEach((option) => {
    if (option.multiChain && option.networks?.length) {
      normalizeOptionSelection(next, option);
    }
  });
  draftValues.value = next;
}

function onSelectAllToggle() {
  if (props.disabled || !isMulti.value) return;

  const next = cloneValueSet(draftValues.value);
  const shouldSelectAll = selectAllMode.value !== 'all';

  filteredOptions.value.forEach((option) => {
    if (shouldSelectAll) {
      selectOptionFully(next, option);
    } else {
      removeOptionKeys(next, option);
    }
  });

  draftValues.value = next;
}

function onNetworkSelectAllToggle(option: FilterCurrencyPreset) {
  if (props.disabled || !isMulti.value) return;

  const networks = option.networks ?? [];
  if (!networks.length) return;

  const next = cloneValueSet(draftValues.value);
  const mode = getNetworkSelectAllMode(option);
  next.delete(option.id);

  networks.forEach((network) => {
    const valueKey = buildValueKey(option.id, network.key);
    if (mode === 'all') next.delete(valueKey);
    else next.add(valueKey);
  });

  if (mode !== 'all') {
    normalizeOptionSelection(next, option);
  }

  draftValues.value = next;
}

function setCascadeScrollRef(optionId: string, element: HTMLElement | null) {
  if (activeCascadeKey.value !== optionId) return;
  cascadeScrollRef.value = element;
}

function setCascadeListRef(optionId: string, element: HTMLElement | null) {
  if (activeCascadeKey.value !== optionId) return;
  cascadeListRef.value = element;
}

function onCascadeOpen(option: FilterCurrencyPreset) {
  activeCascadeKey.value = option.id;
  if (isMulti.value) {
    cascadeDraftSnapshot.value = cloneValueSet(
      [...draftValues.value].filter(
        (valueKey) => valueKey === option.id || valueKey.startsWith(`${option.id}:`),
      ),
    );
  }
  void nextTick(() => {
    updateCascadeScroll();
    void scheduleCascadeScrollSelectedToCenter();
  });
}

function onCascadeConfirm(closeNetwork: () => void) {
  const optionId = activeCascadeKey.value;
  if (isMulti.value && optionId) {
    const option = filteredOptions.value.find((item) => item.id === optionId);
    if (option?.multiChain && option.networks?.length) {
      const next = cloneValueSet(draftValues.value);
      normalizeOptionSelection(next, option);
      draftValues.value = next;
    }
  }
  cascadeDraftSnapshot.value = null;
  closeNetwork();
}

function onCascadeCancel(option: FilterCurrencyPreset, closeNetwork: () => void) {
  if (cascadeDraftSnapshot.value) {
    const next = cloneValueSet(draftValues.value);
    removeOptionKeys(next, option);
    cascadeDraftSnapshot.value.forEach((valueKey) => next.add(valueKey));
    draftValues.value = next;
    cascadeDraftSnapshot.value = null;
  }
  closeNetwork();
}

function onCascadeClear(option: FilterCurrencyPreset) {
  if (props.disabled || !isMulti.value) return;
  const next = cloneValueSet(draftValues.value);
  removeOptionKeys(next, option);
  draftValues.value = next;
}

function onPickerClear() {
  if (props.disabled || !isMulti.value) return;
  draftValues.value = new Set();
}

function onPickerConfirm(close: () => void) {
  if (props.disabled) return;
  normalizeDraftMultiChainValues();
  emit('update:modelValue', [...draftValues.value].join(','));
  resetSearch();
  clearActiveCascade();
  close();
}

function onPickerCancel(close: () => void) {
  resetSearch();
  clearActiveCascade();
  close();
}

watch(activeCascadeKey, () => {
  void nextTick(() => {
    updateCascadeScroll();
  });
});

function onCascadeRowEnter(optionId: string) {
  activeCascadeKey.value = optionId;
}

function isCascadeFlotationDisabled(optionId: string): boolean {
  return activeCascadeKey.value !== null && activeCascadeKey.value !== optionId;
}

function onCascadeFlotationClose(optionId: string) {
  if (activeCascadeKey.value === optionId) {
    activeCascadeKey.value = null;
  }
}

function isParentRowFocused(option: FilterCurrencyPreset): boolean {
  if (!isMulti.value) {
    return parsedValue.value.currencyId === option.id;
  }
  const prefix = `${option.id}:`;
  return (
    activeSelectedValues.value.has(option.id)
    || [...activeSelectedValues.value].some((valueKey) => valueKey.startsWith(prefix))
  );
}

function isOptionSelected(option: FilterCurrencyPreset): boolean {
  if (isMulti.value) {
    if (option.multiChain && option.networks?.length) {
      return getOptionSelectionState(option) === 'full';
    }
    return activeSelectedValues.value.has(option.id);
  }
  return parsedValue.value.currencyId === option.id;
}

function isNetworkSelected(option: FilterCurrencyPreset, networkKey: string): boolean {
  if (isMulti.value) {
    const values = activeSelectedValues.value;
    if (values.has(option.id)) return true;
    return values.has(buildValueKey(option.id, networkKey));
  }
  return parsedValue.value.currencyId === option.id && parsedValue.value.networkKey === networkKey;
}

const cascadeScrollEmpty = computed(() => false);

const { scheduleScrollSelectedToCenter } = useFilterSearchPickerScrollToSelected({
  scrollRef,
  showSearchEmpty,
  resolveSelectedDomIndex: () => {
    const options = filteredOptions.value;
    const selectedListIndex = isMulti.value
      ? options.findIndex((option) => getOptionSelectionState(option) !== 'none')
      : options.findIndex((option) => option.id === parsedValue.value.currencyId);
    return resolveFilterPickerListSelectedDomIndex({
      isMulti: isMulti.value,
      optionsLength: options.length,
      selectedListIndex,
    });
  },
  onScrolled: updatePickerScroll,
});

const { scheduleScrollSelectedToCenter: scheduleCascadeScrollSelectedToCenter } =
  useFilterSearchPickerScrollToSelected({
    scrollRef: cascadeScrollRef,
    showSearchEmpty: cascadeScrollEmpty,
    resolveSelectedDomIndex: () => {
      const optionId = activeCascadeKey.value;
      if (!optionId) return -1;

      const option = filteredOptions.value.find((item) => item.id === optionId);
      if (!option) return -1;

      const networks = option.networks ?? [];
      if (!networks.length) return -1;

      const selectedListIndex = networks.findIndex((network) =>
        isNetworkSelected(option, network.key),
      );
      return resolveFilterPickerListSelectedDomIndex({
        isMulti: isMulti.value,
        optionsLength: networks.length,
        selectedListIndex,
      });
    },
    onScrolled: updateCascadeScroll,
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

function setMultiValue(valueKey: string, selected: boolean) {
  const next = cloneValueSet(draftValues.value);
  if (selected) next.add(valueKey);
  else next.delete(valueKey);
  draftValues.value = next;
}

function setNetworkMultiValue(
  option: FilterCurrencyPreset,
  networkKey: string,
  selected: boolean,
) {
  const next = cloneValueSet(draftValues.value);
  if (option.networks?.length && next.has(option.id)) {
    expandOptionIdToNetworkKeys(next, option);
  }
  const valueKey = buildValueKey(option.id, networkKey);
  if (selected) next.add(valueKey);
  else next.delete(valueKey);
  normalizeOptionSelection(next, option);
  draftValues.value = next;
}

function setMultiChainOptionSelected(option: FilterCurrencyPreset, selected: boolean) {
  const next = cloneValueSet(draftValues.value);
  if (selected) {
    selectOptionFully(next, option);
  } else {
    removeOptionKeys(next, option);
  }
  draftValues.value = next;
}

function onCheckboxUpdate(option: FilterCurrencyPreset, checked: boolean) {
  if (props.disabled || !isMulti.value) return;
  if (option.multiChain && option.networks?.length) {
    setMultiChainOptionSelected(option, checked);
    return;
  }
  setMultiValue(option.id, checked);
}

function onNetworkCheckboxUpdate(
  option: FilterCurrencyPreset,
  networkKey: string,
  checked: boolean,
) {
  if (props.disabled || !isMulti.value) return;
  setNetworkMultiValue(option, networkKey, checked);
}

function onOptionClick(option: FilterCurrencyPreset, close: () => void) {
  if (props.disabled) return;

  if (isMulti.value) {
    if (option.multiChain && option.networks?.length) {
      setMultiChainOptionSelected(option, getOptionSelectionState(option) !== 'full');
    } else {
      setMultiValue(option.id, !activeSelectedValues.value.has(option.id));
    }
    return;
  }

  emit('update:modelValue', option.id);
  resetSearch();
  close();
}

function onNetworkClick(
  option: FilterCurrencyPreset,
  networkKey: string,
  closeRoot: () => void,
  closeNetwork?: () => void,
) {
  if (props.disabled) return;

  if (isMulti.value) {
    const values = activeSelectedValues.value;
    const valueKey = buildValueKey(option.id, networkKey);
    const currentlySelected = values.has(option.id) || values.has(valueKey);
    setNetworkMultiValue(option, networkKey, !currentlySelected);
    return;
  }

  emit('update:modelValue', buildValueKey(option.id, networkKey));
  resetSearch();
  clearActiveCascade();
  closeNetwork?.();
  closeRoot();
}

function onPickerClose() {
  onDropdownClose();
  resetSearch();
  clearActiveCascade();
}
</script>

<template>
  <div ref="rootRef" :class="styles.root" @pointerdown="onRootPointerDown">
    <EgFlotation
      ref="flotationRef"
      :disabled="disabled"
      :trigger="trigger"
      placement="bottom"
      :align="pickerAlign"
      :width-mode="resolvedFlotationWidthMode"
      :width="resolvedFlotationWidth"
      :show-add="false"
      :show-menu-divider="false"
      :boundary-selector="boundarySelector"
      :close-on-scroll="closeOnScroll"
      flip
      @open="onPickerOpen"
      @close="onPickerClose"
    >
      <template #trigger="{ expanded }">
        <EgFlotationTrigger
          :trigger-style="triggerStyle"
          size="sm"
          :module-menu-title="moduleMenuTitle"
          :width-mode="triggerWidthMode"
          :width="triggerWidth"
          :label="triggerLabel"
          :expanded="expanded"
          :disabled="disabled"
          :show-symbol="showTriggerSymbol"
          :show-tag="showTriggerNetworkTag"
        >
          <template v-if="showTriggerSymbol && triggerCryptoName" #symbol>
            <EgCrypto :name="triggerCryptoName" size="md" fit />
          </template>
          <template v-if="showTriggerNetworkTag" #tag>
            <EgTag family="system" system-type="stroke-subtle" size="sm" truncate>
              {{ triggerNetworkLabel }}
            </EgTag>
          </template>
          <template v-if="showTriggerCountMessage" #message>
            <EgMessage
              type="brand"
              :text="triggerCountText"
              focus-background="inherit"
            />
          </template>
        </EgFlotationTrigger>
      </template>

      <template #content="{ close, menuWidth, menuWidthMode }">
        <EgFlotationMenu
          :class="[
            styles.menu,
            resolvedFlotationWidthMode === 'adaptive' && styles.menuAdaptive,
            moduleMenuTitle && styles.menuToolbar,
          ]"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          :width-mode="menuWidthMode"
          :width="menuWidth"
          :height-mode="resolvedMenuHeightMode"
          :height="resolvedMenuHeightMode === 'fixed' ? FILTER_CURRENCY_PICKER_HEIGHT : undefined"
          :max-height="FILTER_CURRENCY_PICKER_HEIGHT"
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
                showSearchEmpty && styles.optionListScrollEmpty,
                pickerBottomScrim && !isMulti && !showSearchEmpty && styles.listScrollFadeBottom,
              ]"
              :style="listAreaStyle"
            >
              <FilterSearchPickerEmpty v-if="showSearchEmpty" />
              <div v-else ref="optionListRef" :class="styles.optionList">
                <EgFlotationMenuItem
                  v-if="isMulti"
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
                        <EgIcon :name="FILTER_CURRENCY_SELECT_ALL_ICON" fit />
                      </span>
                    </span>
                  </template>
                </EgFlotationMenuItem>

                <template v-for="option in filteredOptions" :key="option.id">
                  <div
                    v-if="option.multiChain && option.networks?.length"
                    :class="styles.optionRowWrap"
                    :data-currency-key="option.id"
                    @mouseenter="onCascadeRowEnter(option.id)"
                  >
                    <EgFlotation
                      :class="styles.networkFlotation"
                      :placement="resolvedCascadePlacement"
                      align="start"
                      :flip="cascadeMenuFlip"
                      trigger="hover"
                      width-mode="fixed"
                      :width="FILTER_CURRENCY_CASCADE_PICKER_WIDTH"
                      :show-add="false"
                      :show-menu-divider="false"
                      :disabled="isCascadeFlotationDisabled(option.id)"
                      :boundary-selector="CASCADE_BOUNDARY_SELECTOR"
                      close-on-scroll
                      @open="onCascadeOpen(option)"
                      @close="onCascadeFlotationClose(option.id)"
                    >
                      <template #trigger>
                        <div
                          :class="[
                            styles.cascadeRow,
                            !isMulti && isParentRowFocused(option) && styles.cascadeRowSelected,
                          ]"
                          data-eds-trigger-metrics
                        >
                          <EgFlotationMenuItem
                            host-tag="div"
                            box-type="image-text"
                            :label="option.label"
                            :symbol-icon="option.cryptoName"
                            :mode-tag="resolveOptionModeTag(option)"
                            :show-message="showOptionParentMessage(option)"
                            :message-text="getOptionParentMessageText(option)"
                            :message-type="getOptionParentMessageType(option)"
                            message-static
                            show-cascader
                            :show-tag="false"
                            :show-checkbox="isMulti"
                            :checked="isOptionParentCheckboxChecked(option)"
                            :checkbox-indeterminate="false"
                            :focused="!isMulti && isParentRowFocused(option)"
                            @click="isMulti ? onOptionClick(option, close) : undefined"
                            @update:checked="onCheckboxUpdate(option, $event)"
                          />
                        </div>
                      </template>
                      <template #content="{ close: closeNetwork }">
                        <EgFlotationMenu
                          v-if="!isMulti"
                          :class="styles.networkSubmenu"
                          :style="cascadeSubmenuStyle"
                          data-no-corner-smoothing
                          panel-flush
                          panel-radius="radius-md"
                          width-mode="fixed"
                          :width="FILTER_CURRENCY_CASCADE_PICKER_WIDTH"
                          height-mode="adaptive"
                          :max-height="FILTER_CURRENCY_CASCADE_PICKER_HEIGHT"
                          list-scroll
                          :scrollable="true"
                          :show-add="false"
                          :show-divider="false"
                        >
                          <div :class="styles.cascadeList">
                            <EgFlotationMenuItem
                              v-for="network in option.networks"
                              :key="`${option.id}-${network.key}`"
                              data-eds-filter-cascade-item
                              box-type="image-text"
                              :label="network.label"
                              :symbol-icon="network.cryptoName"
                              :show-tag="false"
                              :focused="isNetworkSelected(option, network.key)"
                              @click="onNetworkClick(option, network.key, close, closeNetwork)"
                            />
                          </div>
                        </EgFlotationMenu>
                        <EgFlotationMenu
                          v-else
                          :class="styles.networkSubmenu"
                          :style="cascadeSubmenuStyle"
                          data-no-corner-smoothing
                          panel-flush
                          panel-radius="radius-md"
                          width-mode="fixed"
                          :width="FILTER_CURRENCY_CASCADE_PICKER_WIDTH"
                          height-mode="adaptive"
                          :max-height="FILTER_CURRENCY_CASCADE_PICKER_HEIGHT"
                          :scrollable="false"
                          :show-add="false"
                          :show-divider="false"
                        >
                          <div :class="styles.cascadePanel">
                            <div
                              :ref="(element) => setCascadeScrollRef(option.id, element as HTMLElement | null)"
                              :class="[
                                styles.cascadeListScroll,
                                cascadeTopScrim && styles.listScrollFadeTop,
                              ]"
                            >
                              <div
                                :ref="(element) => setCascadeListRef(option.id, element as HTMLElement | null)"
                                :class="styles.cascadeList"
                              >
                                <EgFlotationMenuItem
                                  data-eds-filter-cascade-item
                                  box-type="image-text"
                                  :label="t('全部')"
                                  show-checkbox
                                  :checked="getNetworkSelectAllMode(option) === 'all'"
                                  :checkbox-indeterminate="getNetworkSelectAllMode(option) === 'some'"
                                  :show-tag="false"
                                  @click="onNetworkSelectAllToggle(option)"
                                  @update:checked="onNetworkSelectAllToggle(option)"
                                >
                                  <template #leading>
                                    <span :class="styles.selectAllIcon">
                                      <span :class="styles.selectAllIconGlyph">
                                        <EgIcon :name="FILTER_CURRENCY_SELECT_ALL_ICON" fit />
                                      </span>
                                    </span>
                                  </template>
                                </EgFlotationMenuItem>
                                <EgFlotationMenuItem
                                  v-for="network in option.networks"
                                  :key="`${option.id}-${network.key}`"
                                  data-eds-filter-cascade-item
                                  box-type="image-text"
                                  :label="network.label"
                                  :symbol-icon="network.cryptoName"
                                  :show-tag="false"
                                  show-checkbox
                                  :checked="isNetworkSelected(option, network.key)"
                                  @click="onNetworkClick(option, network.key, close, closeNetwork)"
                                  @update:checked="onNetworkCheckboxUpdate(option, network.key, $event)"
                                />
                              </div>
                            </div>
                            <EgComboFloatButton
                              :class="styles.cascadeAction"
                              tone="decor"
                              :count="2"
                              :clear="hasOptionDraftSelection(option)"
                              direction="right"
                              bar-padding="compact"
                              divider
                              :cancel-label="t('取消')"
                              :confirm-label="t('确定')"
                              @clear="onCascadeClear(option)"
                              @cancel="onCascadeCancel(option, closeNetwork)"
                              @confirm="onCascadeConfirm(closeNetwork)"
                            />
                          </div>
                        </EgFlotationMenu>
                      </template>
                    </EgFlotation>
                  </div>

                  <EgFlotationMenuItem
                    v-else
                    box-type="image-text"
                    :label="option.label"
                    :symbol-icon="option.cryptoName"
                    :mode-tag="resolveOptionModeTag(option)"
                    :show-message="Boolean(option.multiChain && option.messageText)"
                    :message-text="option.messageText ?? ''"
                    message-static
                    :focused="!isMulti && isOptionSelected(option)"
                    :show-checkbox="isMulti"
                    :checked="isOptionSelected(option)"
                    :show-tag="false"
                    @mouseenter="clearActiveCascade"
                    @click="onOptionClick(option, close)"
                    @update:checked="onCheckboxUpdate(option, $event)"
                  />
                </template>
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
