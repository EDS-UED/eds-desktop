<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgCrypto, type CryptoName } from '../../atoms/crypto';
import { EgIcon } from '../../atoms/icons';
import { useScrollChromeScrim } from '../../composables/useScrollChromeScrim';
import { EgMessage } from '../../molecules/feedback';
import { EgTag } from '../../molecules/tag';
import comboActionStyles from '../../molecules/combo/ComboAction.module.css';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  type FlotationTriggerWidthMode,
} from '../../molecules/flotation';
import { EgComboFloatButton } from '../../molecules/combo';
import { EgSearchInput } from '../../molecules/search';
import type { TooltipPlacement, TooltipTrigger } from '../../molecules/tooltip';
import type { EgFilterCascadePlacement, EgFilterFieldSelectionMode } from './types';
import { FILTER_SELECT_PLACEHOLDER } from './types';
import {
  FILTER_CURRENCY_CASCADE_PICKER_HEIGHT,
  FILTER_CURRENCY_PICKER_HEIGHT,
  FILTER_CURRENCY_PICKER_WIDTH,
  FILTER_CURRENCY_PRESETS,
  parseFilterCurrencyValue,
  type FilterCurrencyPreset,
} from './filterCurrencyPresets';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
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
  }>(),
  {
    placeholder: FILTER_SELECT_PLACEHOLDER,
    disabled: false,
    selectionMode: 'single',
    triggerWidthMode: 'adaptive',
    trigger: 'click',
    cascadePlacement: 'auto',
  },
);

const resolvedCascadePlacement = computed((): TooltipPlacement =>
  props.cascadePlacement === 'left' ? 'left' : 'right',
);

const cascadeMenuFlip = computed(() => props.cascadePlacement === 'auto');

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

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

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return FILTER_CURRENCY_PRESETS;
  return FILTER_CURRENCY_PRESETS.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
});

watch(
  () => [filteredOptions.value.length, searchQuery.value, isMulti.value],
  () => {
    updatePickerScroll();
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
  const option = FILTER_CURRENCY_PRESETS.find((item) => item.id === currencyId);
  if (!option) return { symbol: valueKey, networkLabel: '', cryptoName: null };
  const network = networkKey
    ? option.networks?.find((item) => item.key === networkKey)
    : undefined;
  return {
    symbol: option.label,
    networkLabel: network?.label ?? '',
    cryptoName: option.cryptoName,
  };
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
}

function clearActiveCascade() {
  activeCascadeKey.value = null;
  cascadeDraftSnapshot.value = null;
}

function onPickerOpen() {
  onDropdownOpen();
  if (isMulti.value) {
    draftValues.value = cloneValueSet(parseValueSet(props.modelValue));
  }
  void nextTick(() => {
    updatePickerScroll();
  });
}

function getOptionSelectionState(option: FilterCurrencyPreset): FilterOptionSelectionState {
  const values = activeSelectedValues.value;

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
  if (isMulti.value) {
    cascadeDraftSnapshot.value = cloneValueSet(
      [...draftValues.value].filter(
        (valueKey) => valueKey === option.id || valueKey.startsWith(`${option.id}:`),
      ),
    );
  }
  void nextTick(() => {
    updateCascadeScroll();
  });
}

function onCascadeConfirm(closeNetwork: () => void) {
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

function isParentCheckboxChecked(option: FilterCurrencyPreset): boolean {
  return activeSelectedValues.value.has(option.id);
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
  if (isMulti.value) return isParentCheckboxChecked(option);
  return parsedValue.value.currencyId === option.id;
}

function isNetworkSelected(option: FilterCurrencyPreset, networkKey: string): boolean {
  if (isMulti.value) {
    return activeSelectedValues.value.has(buildValueKey(option.id, networkKey));
  }
  return parsedValue.value.currencyId === option.id && parsedValue.value.networkKey === networkKey;
}

function setMultiValue(valueKey: string, selected: boolean) {
  const next = cloneValueSet(draftValues.value);
  if (selected) next.add(valueKey);
  else next.delete(valueKey);
  draftValues.value = next;
}

function onCheckboxUpdate(option: FilterCurrencyPreset, checked: boolean) {
  if (props.disabled || !isMulti.value) return;
  setMultiValue(option.id, checked);
}

function onNetworkCheckboxUpdate(
  option: FilterCurrencyPreset,
  networkKey: string,
  checked: boolean,
) {
  if (props.disabled || !isMulti.value) return;
  setMultiValue(buildValueKey(option.id, networkKey), checked);
}

function onOptionClick(option: FilterCurrencyPreset, close: () => void) {
  if (props.disabled) return;

  if (isMulti.value) {
    setMultiValue(option.id, !isParentCheckboxChecked(option));
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
    const valueKey = buildValueKey(option.id, networkKey);
    setMultiValue(valueKey, !activeSelectedValues.value.has(valueKey));
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
  <div :class="styles.root">
    <EgFlotation
      ref="flotationRef"
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
          height-mode="fixed"
          :height="FILTER_CURRENCY_PICKER_HEIGHT"
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
                pickerBottomScrim && !isMulti && styles.listScrollFadeBottom,
              ]"
            >
              <div ref="optionListRef" :class="styles.optionList">
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
                      :width="FILTER_CURRENCY_PICKER_WIDTH"
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
                            :mode-tag="option.multiChain && option.modeTag ? t(option.modeTag) : undefined"
                            :show-message="Boolean(option.multiChain && option.messageText)"
                            :message-text="option.messageText ?? ''"
                            message-type="subtle"
                            show-cascader
                            :show-tag="false"
                            :show-checkbox="isMulti"
                            :checked="isParentCheckboxChecked(option)"
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
                          data-no-corner-smoothing
                          panel-radius="radius-md"
                          width-mode="fixed"
                          :width="FILTER_CURRENCY_PICKER_WIDTH"
                          height-mode="adaptive"
                          :scrollable="false"
                          :show-add="false"
                          :show-divider="false"
                        >
                          <EgFlotationMenuItem
                            v-for="network in option.networks"
                            :key="`${option.id}-${network.key}`"
                            box-type="image-text"
                            :label="network.label"
                            :symbol-icon="network.cryptoName"
                            :show-tag="false"
                            :focused="isNetworkSelected(option, network.key)"
                            @click="onNetworkClick(option, network.key, close, closeNetwork)"
                          />
                        </EgFlotationMenu>
                        <EgFlotationMenu
                          v-else
                          :class="styles.networkSubmenu"
                          data-no-corner-smoothing
                          panel-radius="radius-md"
                          width-mode="fixed"
                          :width="FILTER_CURRENCY_PICKER_WIDTH"
                          height-mode="fixed"
                          :height="FILTER_CURRENCY_CASCADE_PICKER_HEIGHT"
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
                                  box-type="text"
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
                    :mode-tag="option.multiChain && option.modeTag ? t(option.modeTag) : undefined"
                    :show-message="Boolean(option.multiChain && option.messageText)"
                    :message-text="option.messageText ?? ''"
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
