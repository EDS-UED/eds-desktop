<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  EgDivider,
  EgFlotationMenuItem,
  EgIcon,
  EgIconButton,
  EgTag,
} from '@eds/desktop-components';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import {
  getSceneAddressDropdownRows,
  getSceneAddressFilterTabs,
} from './flotationBoxSceneAddressPreviewData';
import {
  parseSceneAddressItemCount,
  parseSceneAddressSelectionMode,
  sceneAddressItemKey,
} from './flotationBoxSceneAddressCustomize';
import styles from './FlotationBoxSceneAddressPreview.module.css';

const props = withDefaults(
  defineProps<{
    /** 场景化-下拉地址显示顶部分段；地址悬浮不显示。 */
    showFilterTabs?: boolean;
  }>(),
  { showFilterTabs: true },
);

const customize = defineModel<Record<string, unknown>>('customize', { required: true });

const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const activeTab = ref(0);

const filterTabs = computed(() => {
  void locale.value;
  return getSceneAddressFilterTabs(i18n);
});

const rows = computed(() => {
  void locale.value;
  const state = customize.value;
  return getSceneAddressDropdownRows(parseSceneAddressItemCount(state), state, i18n);
});

const filterAriaLabel = computed(() => {
  void locale.value;
  return i18n.name('demo:scene-address-filter-aria', 'Address filter');
});

const copyButtonLabel = computed(() => {
  void locale.value;
  return i18n.name('demo:scene-address-copy', 'Copy');
});

const showCheckbox = computed(
  () =>
    props.showFilterTabs && parseSceneAddressSelectionMode(customize.value) === 'multiple',
);

const showCopyButton = computed(() => !props.showFilterTabs);

const copiedRowKey = ref<string | null>(null);
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

function rowKey(row: { id: string }, index: number) {
  return `${row.id}-${index}`;
}

function onRowClick(index: number) {
  if (!props.showFilterTabs) return;

  const n = index + 1;
  const mode = parseSceneAddressSelectionMode(customize.value);

  if (mode === 'multiple') return;

  const count = parseSceneAddressItemCount(customize.value);
  for (let i = 1; i <= count; i += 1) {
    customize.value[sceneAddressItemKey('Checked', i)] = i === n;
  }
}

function onCheckboxUpdate(index: number, checked: boolean) {
  customize.value[sceneAddressItemKey('Checked', index + 1)] = checked;
}

function onMenuItemClick(
  row: { id: string; address: string },
  index: number,
  event: MouseEvent,
) {
  if (showCopyButton.value) {
    void onCopyAddress(rowKey(row, index), row.address, event);
    return;
  }
  onRowClick(index);
}

async function onCopyAddress(key: string, address: string, event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  try {
    await navigator.clipboard.writeText(address);
    copiedRowKey.value = key;
    if (copiedResetTimer) clearTimeout(copiedResetTimer);
    copiedResetTimer = setTimeout(() => {
      if (copiedRowKey.value === key) copiedRowKey.value = null;
    }, 2000);
  } catch {
    // Showcase 演示：忽略复制失败
  }
}

onBeforeUnmount(() => {
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
});
</script>

<template>
  <div :class="styles.root">
    <div v-if="showFilterTabs" :class="styles.filterHeader">
      <div :class="styles.filterBar" role="tablist" :aria-label="filterAriaLabel">
        <button
          v-for="(tab, index) in filterTabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="index === activeTab"
          :class="[styles.filterItem, index === activeTab && styles.filterItemActive]"
          @click="activeTab = index"
        >
          <span :class="styles.filterIcon">
            <EgIcon :name="tab.icon" size="sm" fit />
          </span>
          {{ tab.label }}
        </button>
      </div>
      <EgDivider type="module" direction="horizontal" />
    </div>

    <div :class="styles.list">
      <EgFlotationMenuItem
        v-for="(row, index) in rows"
        :key="`${row.id}-${index}`"
        box-type="text"
        label-wrap
        :show-tag="false"
        :disabled="row.disabled"
        :focused="showFilterTabs && row.focused"
        :show-checkbox="showCheckbox"
        :checked="row.checked"
        @click="onMenuItemClick(row, index, $event)"
        @update:checked="onCheckboxUpdate(index, $event)"
      >
        <span :class="styles.rowContent">
          <span :class="styles.rowMain">
            <EgTag v-if="row.alias" family="system" system-type="solid-brand" size="sm">
              {{ row.alias }}
            </EgTag>
            <span :class="styles.addressLine">
              <span :class="styles.address">{{ row.address }}</span>
              <span
                v-if="showCopyButton"
                :class="[
                  styles.copyButton,
                  copiedRowKey === rowKey(row, index) && styles.copyButtonCopied,
                ]"
                @click.stop
              >
                <EgIconButton
                  shape="square"
                  size="xs"
                  :label="copyButtonLabel"
                  @click="onCopyAddress(rowKey(row, index), row.address, $event)"
                >
                  <EgIcon
                    :name="copiedRowKey === rowKey(row, index) ? 'eds-enable-fill' : 'eds-copy'"
                    fit
                  />
                </EgIconButton>
              </span>
            </span>
          </span>

          <span v-if="row.trailingLabel" :class="styles.rowTags">
            <EgTag family="system" system-type="stroke-subtle" size="sm">
              {{ row.trailingLabel }}
            </EgTag>
          </span>
        </span>
      </EgFlotationMenuItem>
    </div>
  </div>
</template>
