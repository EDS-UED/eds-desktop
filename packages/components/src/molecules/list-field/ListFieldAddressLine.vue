<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { EgFlotation } from '../flotation';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { truncateAddressMiddle } from '../crypto-combo/cryptoAddressUtils';
import CryptoAddressTags from '../crypto-combo/CryptoAddressTags.vue';
import CryptoAddressSideMenuPanel, {
  type CryptoAddressSideMenuRow,
} from '../crypto-combo/CryptoAddressSideMenuPanel.vue';
import type { CryptoAddressSideTags } from '../crypto-combo/cryptoAddressTypes';
import { hasAddressTags } from '../crypto-combo/cryptoAddressTagUtils';
import { EgTag, type TagSystemType } from '../tag';
import type { TooltipTrigger } from '../tooltip';
import {
  FLOTATION_OVERFLOW_CLOSE_DELAY,
  FLOTATION_OVERFLOW_OPEN_DELAY,
} from '../tooltip/textOverflowTooltipConstants';
import cryptoComboStyles from '../crypto-combo/CryptoCombo.module.css';
import styles from './ListFieldAddressLine.module.css';

const props = withDefaults(
  defineProps<{
    text: string;
    copyOnRowHover?: boolean;
    tooltipTrigger?: TooltipTrigger;
    tags?: CryptoAddressSideTags;
    showRowTag?: boolean;
    rowTagLabel?: string;
    rowTagSystemType?: TagSystemType;
    secondaryText?: string;
    /** 多地址计数；>2 时地址行尾展示 (N)，与 EgCryptoAddress 对齐。 */
    addressCount?: number;
    /** 多地址完整列表（Tooltip Menu 各行）；未传时按 count 生成演示条目。 */
    addresses?: string[];
  }>(),
  {
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
    showRowTag: false,
    rowTagLabel: 'Tag',
    rowTagSystemType: 'gray',
    secondaryText: '',
    addressCount: 1,
  },
);

const cellCopied = ref(false);
const copiedRowKey = ref<string | null>(null);
let cellCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;
let menuCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;

function normalizeAddressCount(value?: number): number {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function buildAddressList(
  address: string,
  count: number,
  provided?: string[],
): string[] {
  if (provided?.length) {
    return provided.slice(0, count);
  }
  return Array.from({ length: count }, (_, index) =>
    index === 0 ? address : `${address} · ${index + 1}`,
  );
}

const displayText = computed(() => truncateAddressMiddle(props.text));
const normalizedAddressCount = computed(() => normalizeAddressCount(props.addressCount));
const showAddressCollection = computed(() => normalizedAddressCount.value > 2);
const showAddressCount = computed(() => showAddressCollection.value);
const showTags = computed(() =>
  hasAddressTags(props.tags?.system, props.tags?.custom),
);
const showRowTag = computed(
  () => props.showRowTag && String(props.rowTagLabel ?? '').trim().length > 0,
);
const showSecondaryText = computed(() => String(props.secondaryText ?? '').trim().length > 0);
const showMetaRow = computed(() => showTags.value || showSecondaryText.value);
const copyLabel = computed(() => `复制地址 ${props.text}`);
const semanticallyTruncated = computed(() => displayText.value !== props.text);
const addressList = computed(() =>
  buildAddressList(props.text, normalizedAddressCount.value, props.addresses),
);
const showSideMenu = computed(
  () => showAddressCollection.value || showMetaRow.value || semanticallyTruncated.value,
);
const hoverTriggerClass = computed(() =>
  props.tooltipTrigger === 'focus' ? 'eds-hover-tooltip-trigger--focus' : undefined,
);
const hoverMotionClass = computed(() =>
  props.tooltipTrigger === 'focus' ? ['motion-ease', 'is-paint-fade'] : ['motion-ease', 'is-paint'],
);

const sideMenuRows = computed((): CryptoAddressSideMenuRow[] => {
  const rows: CryptoAddressSideMenuRow[] = [
    {
      key: 'primary',
      address: props.text,
      tags: props.tags,
      showExpandedTags: showTags.value,
    },
  ];

  if (!showAddressCollection.value) {
    return rows;
  }

  addressList.value.slice(1).forEach((address, index) => {
    rows.push({
      key: `rest-${index}`,
      address,
      showExpandedTags: false,
    });
  });

  return rows;
});

const sideMenuFlotationProps = {
  placement: 'bottom' as const,
  align: 'start' as const,
  openDelay: FLOTATION_OVERFLOW_OPEN_DELAY,
  closeDelay: FLOTATION_OVERFLOW_CLOSE_DELAY,
  showAdd: false,
  showMenuDivider: false,
  closeOnScroll: true,
  boundarySelector: '.eds-data-list',
};

onBeforeUnmount(() => {
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
  if (menuCopiedResetTimer) clearTimeout(menuCopiedResetTimer);
});

async function onCopy(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(props.text);
  if (!copied) return;

  cellCopied.value = true;
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
  cellCopiedResetTimer = setTimeout(() => {
    cellCopied.value = false;
  }, 2000);
}

async function onMenuCopy(key: string, address: string, event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(address);
  if (!copied) return;

  copiedRowKey.value = key;
  if (menuCopiedResetTimer) clearTimeout(menuCopiedResetTimer);
  menuCopiedResetTimer = setTimeout(() => {
    if (copiedRowKey.value === key) copiedRowKey.value = null;
  }, 2000);
}
</script>

<template>
  <span
    :class="[
      styles.addressTooltipHost,
      showSideMenu && 'eds-hover-tooltip-trigger',
      showSideMenu && hoverTriggerClass,
    ]"
  >
    <EgFlotation
      v-if="showSideMenu"
      class="eds-crypto-address-flotation"
      :trigger="tooltipTrigger"
      v-bind="sideMenuFlotationProps"
    >
      <template #trigger>
        <span :class="styles.tooltipTriggerBody">
          <div :class="styles.cellLine">
            <div :class="styles.cellLineMain">
              <span
                :class="[
                  styles.addressLineCluster,
                  'eds-hover-tooltip-trigger__target',
                  'eds-hover-tooltip-trigger__target--primary',
                  hoverMotionClass,
                ]"
                data-eds-trigger-metrics
                :tabindex="tooltipTrigger === 'focus' ? 0 : undefined"
              >
                <span :class="styles.addressLine">
                  {{ displayText }}
                </span>
                <span v-if="showAddressCount" :class="styles.addressCount">
                  ({{ normalizedAddressCount }})
                </span>
              </span>

              <EgTag
                v-if="showRowTag"
                :class="styles.rowTag"
                size="sm"
                :system-type="rowTagSystemType"
                truncate
              >
                {{ rowTagLabel }}
              </EgTag>
            </div>

            <EgIconButton
              v-if="copyOnRowHover"
              shape="square"
              size="xs"
              :label="copyLabel"
              :class="cellCopied && cryptoComboStyles.menuCopyButtonCopied"
              @click.stop="onCopy($event)"
            >
              <EgIcon
                :name="cellCopied ? 'eds-enable-fill' : 'eds-copy'"
                fit
              />
            </EgIconButton>
          </div>

          <div v-if="showMetaRow" :class="styles.metaRow">
            <span v-if="showSecondaryText" :class="styles.metaSecondaryText">
              {{ secondaryText }}
            </span>

            <CryptoAddressTags v-if="showTags" :tags="tags" />
          </div>
        </span>
      </template>

      <template #content>
        <CryptoAddressSideMenuPanel
          :rows="sideMenuRows"
          :copied-row-key="copiedRowKey"
          @copy="onMenuCopy"
        />
      </template>
    </EgFlotation>

    <span v-else :class="styles.tooltipTriggerBody">
      <div :class="styles.cellLine">
        <div :class="styles.cellLineMain">
          <span :class="styles.addressLineCluster">
            <span :class="styles.addressLine">
              {{ displayText }}
            </span>
          </span>

          <EgTag
            v-if="showRowTag"
            :class="styles.rowTag"
            size="sm"
            :system-type="rowTagSystemType"
            truncate
          >
            {{ rowTagLabel }}
          </EgTag>
        </div>

        <EgIconButton
          v-if="copyOnRowHover"
          shape="square"
          size="xs"
          :label="copyLabel"
          :class="cellCopied && cryptoComboStyles.menuCopyButtonCopied"
          @click.stop="onCopy($event)"
        >
          <EgIcon
            :name="cellCopied ? 'eds-enable-fill' : 'eds-copy'"
            fit
          />
        </EgIconButton>
      </div>

      <div v-if="showMetaRow" :class="styles.metaRow">
        <span v-if="showSecondaryText" :class="styles.metaSecondaryText">
          {{ secondaryText }}
        </span>

        <CryptoAddressTags v-if="showTags" :tags="tags" />
      </div>
    </span>
  </span>
</template>
