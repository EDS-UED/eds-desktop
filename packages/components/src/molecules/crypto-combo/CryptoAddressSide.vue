<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { EgFlotation } from '../flotation';
import { EgTooltipOverflow } from '../tooltip';
import CryptoAddressTags from './CryptoAddressTags.vue';
import CryptoAddressSideMenuPanel, {
  type CryptoAddressSideMenuRow,
} from './CryptoAddressSideMenuPanel.vue';
import styles from './CryptoCombo.module.css';
import type { CryptoAddressSideTags } from './cryptoAddressTypes';
import { truncateAddressMiddle } from './cryptoAddressUtils';
import { hasAddressTags, splitTagsForDisplay } from './cryptoAddressTagUtils';
import {
  FLOTATION_OVERFLOW_CLOSE_DELAY,
  FLOTATION_OVERFLOW_OPEN_DELAY,
} from '../tooltip/textOverflowTooltipConstants';
import { copyToClipboard } from '../../utils/copyToClipboard';

/**
 * CryptoAddress 侧：
 * - Side Menu：根节点仍是 span.cryptoAddressSide；内嵌 EgFlotation；行内地址仍用 footnote 排版（与 plain 同 DOM）
 */

export type CryptoAddressTooltipTrigger = 'hover' | 'focus';

const props = withDefaults(
  defineProps<{
    address: string;
    alias?: string;
    addressCount?: number;
    addresses?: string[];
    tags?: CryptoAddressSideTags;
    addressTags?: CryptoAddressSideTags[];
    addressMode?: 'single' | 'double';
    minWidth?: number;
    defaultShowMore?: boolean;
    tooltipTrigger?: CryptoAddressTooltipTrigger;
  }>(),
  {
    addressCount: 1,
    addressMode: 'double',
    defaultShowMore: true,
    tooltipTrigger: 'hover',
  },
);

function normalizeCount(value?: number): number {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function buildAddressList(
  address: string,
  alias: string | undefined,
  count: number,
  provided?: string[],
): string[] {
  if (provided?.length) {
    return provided.slice(0, count);
  }
  const first = alias?.trim() || address;
  return Array.from({ length: count }, (_, index) =>
    index === 0 ? first : `${address} · ${index + 1}`,
  );
}

function resolveAddressTags(index: number): CryptoAddressSideTags | undefined {
  return props.addressTags?.[index] ?? (index === 0 ? props.tags : undefined);
}

const count = computed(() => normalizeCount(props.addressCount));

const primaryTags = computed(() => resolveAddressTags(0));

const showAddressCollection = computed(() => count.value > 2);

const hasOverflowTags = computed(() => {
  const tags = primaryTags.value;
  if (!tags) return false;
  return splitTagsForDisplay(tags.system, tags.custom).hidden.length > 0;
});

const hasInlineTags = computed(() => {
  const tags = primaryTags.value;
  if (!tags) return false;
  return hasAddressTags(tags.system, tags.custom);
});

const addressList = computed(() =>
  buildAddressList(props.address, props.alias, count.value, props.addresses),
);

const primaryAlias = computed(() => props.alias?.trim() || undefined);

const displayAddress = computed(() => truncateAddressMiddle(props.address));

const addressDisplayText = computed(
  () => primaryAlias.value ?? displayAddress.value,
);

const addressTypographyClass = computed(() =>
  primaryAlias.value
    ? [styles.cryptoAddressText, styles.cryptoAddressAlias]
    : styles.cryptoAddressText,
);

const addressCopyLabel = computed(() => `复制地址 ${props.address}`);

const addressSemanticallyTruncated = computed(
  () => !primaryAlias.value && displayAddress.value !== props.address,
);

/** 需 Side Menu 时走内嵌 Flotation；根节点 layout 不变。 */
const showSideMenu = computed(
  () =>
    showAddressCollection.value ||
    hasOverflowTags.value ||
    Boolean(primaryAlias.value) ||
    hasInlineTags.value ||
    addressSemanticallyTruncated.value,
);

const useCountAsMenuTrigger = computed(
  () => !showSideMenu.value && showAddressCollection.value && !hasOverflowTags.value,
);

const hoverTriggerClass = computed(() =>
  props.tooltipTrigger === 'focus' ? 'eds-hover-tooltip-trigger--focus' : undefined,
);

const sideMenuRows = computed((): CryptoAddressSideMenuRow[] => {
  const rows: CryptoAddressSideMenuRow[] = [];

  rows.push({
    key: 'primary',
    address: props.address,
    alias: primaryAlias.value,
    tags: primaryTags.value,
    showExpandedTags: primaryTags.value
      ? hasAddressTags(primaryTags.value.system, primaryTags.value.custom)
      : false,
  });

  if (showAddressCollection.value) {
    const rest = props.addresses?.length
      ? props.addresses.slice(1, count.value)
      : addressList.value.slice(1);
    rest.forEach((address, index) => {
      const tags = resolveAddressTags(index + 1);
      rows.push({
        key: `rest-${index}`,
        address,
        tags,
        showExpandedTags: tags
          ? hasAddressTags(tags.system, tags.custom)
          : false,
      });
    });
  }

  return rows;
});

const copiedRowKey = ref<string | null>(null);
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

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

async function onCopyAddress(key: string, address: string, event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(address);
  if (!copied) return;

  copiedRowKey.value = key;
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
  copiedResetTimer = setTimeout(() => {
    if (copiedRowKey.value === key) copiedRowKey.value = null;
  }, 2000);
}

onBeforeUnmount(() => {
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
});
</script>

<template>
  <span
    :class="[
      styles.cryptoAddressSide,
      'eds-crypto-address-side',
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
        <span :class="styles.cryptoAddressSideMenuTrigger">
          <span
            :class="[
              styles.cryptoAddressLine,
              primaryAlias && styles.cryptoAddressLineAlias,
              'eds-hover-tooltip-trigger__target',
              'eds-hover-tooltip-trigger__target--secondary',
              tooltipTrigger === 'focus' ? ['motion-ease', 'is-paint-fade'] : ['motion-ease', 'is-paint'],
            ]"
            :tabindex="tooltipTrigger === 'focus' ? 0 : undefined"
          >
            <span :class="styles.cryptoAddressTextHost">
              <span :class="addressTypographyClass">{{ addressDisplayText }}</span>
            </span>

            <span v-if="showAddressCollection" :class="styles.cryptoAddressCount">
              (<span :class="styles.cryptoAddressCountValue">{{ count }}</span>)
            </span>
          </span>

          <span v-if="hasInlineTags" :class="styles.cryptoAddressTags">
            <CryptoAddressTags
              :tags="primaryTags"
              :default-show-more="defaultShowMore"
            />
          </span>
        </span>
      </template>

      <template #content>
        <CryptoAddressSideMenuPanel
          :rows="sideMenuRows"
          :copied-row-key="copiedRowKey"
          @copy="onCopyAddress"
        />
      </template>
    </EgFlotation>

    <template v-else>
      <span
        :class="[
          styles.cryptoAddressLine,
          primaryAlias && styles.cryptoAddressLineAlias,
        ]"
      >
        <EgTooltipOverflow
          :tooltip-text="props.address"
          :copy-value="props.address"
          :copy-label="addressCopyLabel"
          show-tooltip-copy
          :trigger="tooltipTrigger"
          :semantic-truncated="addressSemanticallyTruncated"
          :menu-alias="primaryAlias"
          :menu-tags="primaryTags"
          target-tone="secondary"
          :typography-class="addressTypographyClass"
          :menu-text-class="styles.menuAddress"
          :host-class="styles.cryptoAddressTextHost"
          host-flex
          boundary-selector=".eds-data-list"
        >
          {{ addressDisplayText }}
        </EgTooltipOverflow>

        <EgFlotation
          v-if="useCountAsMenuTrigger"
          class="eds-crypto-address-flotation"
          :trigger="tooltipTrigger"
          v-bind="sideMenuFlotationProps"
        >
          <template #trigger>
            <span :class="styles.cryptoAddressCount">
              (<span :class="styles.cryptoAddressCountValue">{{ count }}</span>)
            </span>
          </template>
          <template #content>
            <CryptoAddressSideMenuPanel
              :rows="sideMenuRows"
              :copied-row-key="copiedRowKey"
              @copy="onCopyAddress"
            />
          </template>
        </EgFlotation>

        <span v-else-if="showAddressCollection" :class="styles.cryptoAddressCount">
          (<span :class="styles.cryptoAddressCountValue">{{ count }}</span>)
        </span>
      </span>

      <EgFlotation
        v-if="hasOverflowTags"
        class="eds-crypto-address-flotation"
        :trigger="tooltipTrigger"
        v-bind="sideMenuFlotationProps"
      >
        <template #trigger>
          <span :class="styles.cryptoAddressTags">
            <CryptoAddressTags
              :tags="primaryTags"
              :default-show-more="defaultShowMore"
            />
          </span>
        </template>
        <template #content>
          <CryptoAddressSideMenuPanel
            :rows="sideMenuRows"
            :copied-row-key="copiedRowKey"
            @copy="onCopyAddress"
          />
        </template>
      </EgFlotation>

      <span v-else-if="hasInlineTags" :class="styles.cryptoAddressTags">
        <CryptoAddressTags
          :tags="primaryTags"
          :default-show-more="defaultShowMore"
        />
      </span>
    </template>
  </span>
</template>
