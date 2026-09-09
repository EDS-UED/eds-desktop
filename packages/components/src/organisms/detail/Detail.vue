<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgAvatar } from '../../atoms/avatar';
import { EgCrypto } from '../../atoms/crypto';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgLinkButton } from '../../molecules/link';
import DetailValueActionIcon from './DetailValueActionIcon.vue';
import { EgTag, type TagSize, type TagStatus } from '../../molecules/tag';
import { EgButton, type ButtonTone } from '../../molecules/button';
import type { ComboActionPageTone } from '../../molecules/combo';
import comboActionStyles from '../../molecules/combo/ComboAction.module.css';
import { EgPaginationGroupButton } from '../../molecules/pagination-item';
import { EgTabs, type TabsSpacingSize } from '../../molecules/tab';
import { hasOpenClickAnchoredTooltip } from '../../molecules/tooltip/anchoredTooltipManager';
import cryptoComboStyles from '../../molecules/crypto-combo/CryptoCombo.module.css';
import CryptoAddressTags from '../../molecules/crypto-combo/CryptoAddressTags.vue';
import { hasAddressTags } from '../../molecules/crypto-combo/cryptoAddressTagUtils';
import { EgFormSubmission } from '../../molecules/feedback';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import chromeScrimStyles from '../../styles/popupChromeScrim.module.css';
import '../../styles/motionPageTransition.css';
import '../../styles/popupInnerBackdrop.css';
import styles from './Detail.module.css';
import {
  createDefaultDetailSections,
  type DetailAddressLayout,
  type DetailItemData,
  type DetailItemValueEntry,
  type DetailSectionData,
} from './detailTypes';

function itemShowsTitleIcon(item: DetailItemData): boolean {
  if (item.showTitleIcon === false) return false;
  return Boolean(item.titleIcon);
}

function itemShowsValueSymbol(item: DetailItemData): boolean {
  if (item.showValueSymbol) return true;
  return item.valueType === 'crypto' || item.valueType === 'user';
}

function itemShowsValueCrypto(item: DetailItemData): boolean {
  if (item.showValueSymbol) return item.valueSymbolKind === 'crypto';
  return item.valueType === 'crypto' && Boolean(item.valueIcon);
}

function itemValueCryptoName(item: DetailItemData): string | undefined {
  if (item.showValueSymbol && item.valueSymbolKind === 'crypto') {
    return item.valueSymbolCrypto;
  }
  return item.valueIcon;
}

function itemShowsValueAvatar(item: DetailItemData): boolean {
  if (item.showValueSymbol) return item.valueSymbolKind === 'avatar';
  return item.valueType === 'user';
}

function itemValueAvatarName(item: DetailItemData): string {
  if (item.showValueSymbol && item.valueSymbolKind === 'avatar') {
    return item.valueSymbolAvatarName ?? item.value;
  }
  return item.value;
}

function itemHasValueTrailingActions(item: DetailItemData): boolean {
  return Boolean(
    item.showValueLink
      || item.showValueCopy
      || item.showValueAddressBook
      || item.showValueAmlSearch
      || item.showValueBrowser,
  );
}

function itemCopyKey(
  sectionIndex: number,
  itemIndex: number,
  item: DetailItemData,
  entryIndex = 0,
): string {
  const base = item.key ?? `${sectionIndex}-${itemIndex}`;
  return entryIndex > 0 ? `${base}-${entryIndex}` : base;
}

type DetailItemResolvedValueEntry = DetailItemValueEntry & {
  tagBeforeValue: boolean;
  tagFamily: NonNullable<DetailItemData['tagFamily']>;
  tagSystemType: NonNullable<DetailItemData['tagSystemType']>;
};

function itemAddressLayout(item: DetailItemData): DetailAddressLayout {
  return item.addressLayout ?? 'single';
}

function itemResolvedValueEntries(item: DetailItemData): DetailItemResolvedValueEntry[] {
  const tagFamily = item.tagFamily ?? 'system';
  const tagSystemType = item.tagSystemType ?? 'stroke-subtle';

  if (item.valueEntries?.length) {
    return item.valueEntries.map((entry) => ({
      ...entry,
      tagBeforeValue: entry.tagBeforeValue ?? item.tagBeforeValue ?? false,
      tagFamily: entry.tagFamily ?? tagFamily,
      tagSystemType: entry.tagSystemType ?? tagSystemType,
    }));
  }

  return [
    {
      value: item.value,
      tag: item.tag,
      tagBeforeValue: item.tagBeforeValue ?? false,
      tagFamily,
      tagSystemType,
      dashed: item.dashed,
    },
  ];
}

function itemDisplayValueEntries(item: DetailItemData): DetailItemResolvedValueEntry[] {
  const entries = itemResolvedValueEntries(item);
  const layout = itemAddressLayout(item);

  if (layout === 'multi-expanded') {
    return entries;
  }

  return entries.slice(0, 1);
}

function itemAddressCount(item: DetailItemData): number {
  const count = item.addressCount ?? itemResolvedValueEntries(item).length;
  return Math.max(1, count);
}

function itemShowsAddressCollapsedFooter(item: DetailItemData): boolean {
  const layout = itemAddressLayout(item);
  if (layout !== 'multi-collapsed' && layout !== 'multi-orders') {
    return false;
  }
  if (itemAddressCount(item) <= 1) {
    return false;
  }
  if (layout === 'multi-orders') {
    return true;
  }
  return Boolean(item.addressViewMoreLabel);
}

function itemAddressViewMoreText(item: DetailItemData): string {
  const layout = itemAddressLayout(item);
  const count = String(itemAddressCount(item));
  if (layout === 'multi-orders') {
    const label = item.addressViewMoreLabel ?? '{count} Orders';
    if (label.includes('{count}')) {
      return label.replaceAll('{count}', count);
    }
    return `${count} Orders`;
  }
  const label = item.addressViewMoreLabel ?? 'Expand';
  if (label.includes('{count}')) {
    return label.replaceAll('{count}', count);
  }
  return `${label} ${count}`;
}

function itemHasAddressBranch(item: DetailItemData): boolean {
  return itemAddressLayout(item) === 'multi-expanded'
    && itemResolvedValueEntries(item).length > 1;
}

function itemAddressBranchEntries(item: DetailItemData): DetailItemResolvedValueEntry[] {
  return itemResolvedValueEntries(item).slice(1);
}

function itemPrimaryValueEntry(item: DetailItemData): DetailItemResolvedValueEntry {
  return itemDisplayValueEntries(item)[0]!;
}

function entryAddressTagsBelow(entry: DetailItemResolvedValueEntry): boolean {
  return entry.valueAddressSideTagsBelow === true;
}

function resolveItemCopyValue(item: DetailItemData, entry: DetailItemResolvedValueEntry): string {
  return item.valueCopyText ?? entry.value;
}

function itemRowCopyable(item: DetailItemData, entry: DetailItemResolvedValueEntry): boolean {
  return Boolean(item.showValueCopy && resolveItemCopyValue(item, entry));
}

function itemValueTagText(item: DetailItemData, entry: DetailItemResolvedValueEntry): string | undefined {
  return entry.tag ?? item.tag;
}

function itemValueTagBeforeValue(item: DetailItemData, entry: DetailItemResolvedValueEntry): boolean {
  return entry.tagBeforeValue ?? item.tagBeforeValue ?? false;
}

function itemValueTagFamily(
  item: DetailItemData,
  entry: DetailItemResolvedValueEntry,
): NonNullable<DetailItemData['tagFamily']> {
  return entry.tagFamily ?? item.tagFamily ?? 'system';
}

function itemValueTagSystemType(
  item: DetailItemData,
  entry: DetailItemResolvedValueEntry,
): NonNullable<DetailItemData['tagSystemType']> {
  return entry.tagSystemType ?? item.tagSystemType ?? 'stroke-subtle';
}

function inlineValueSegmentClass(
  segment: DetailItemValueEntry,
  styles: Record<string, string>,
): Record<string, boolean> {
  return {
    [styles.itemValueText]: true,
    [styles.itemValueTextNowrap]: true,
    [styles.itemValueTextSecondary]: segment.valueMuted === true,
  };
}

const copiedItemKey = ref<string | null>(null);
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

async function onCopyItemValue(
  copyKey: string,
  value: string,
  event?: MouseEvent,
) {
  event?.stopPropagation();
  event?.preventDefault();
  const copied = await copyToClipboard(value);
  if (!copied) return;

  copiedItemKey.value = copyKey;
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
  copiedResetTimer = setTimeout(() => {
    if (copiedItemKey.value === copyKey) copiedItemKey.value = null;
  }, 2000);
}

function onItemRowCopyClick(
  sectionIndex: number,
  itemIndex: number,
  item: DetailItemData,
  entry: DetailItemResolvedValueEntry,
  entryIndex: number,
  event?: MouseEvent,
) {
  if (!itemRowCopyable(item, entry)) return;
  void onCopyItemValue(
    itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
    resolveItemCopyValue(item, entry),
    event,
  );
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    headline?: string;
    statusTag?: string;
    statusTagSize?: TagSize;
    statusTagStatus?: TagStatus;
    showEyebrow?: boolean;
    showStatusTag?: boolean;
    showTabs?: boolean;
    tabLabels?: string[];
    tabHorizontalGap?: TabsSpacingSize;
    tabVerticalGap?: TabsSpacingSize;
    sections?: DetailSectionData[];
    showToolbar?: boolean;
    showToolbarNav?: boolean;
    toolbarCurrent?: string | number;
    toolbarTotal?: string | number;
    /** motion-page 切换 key；省略时用 toolbarCurrent（同序号换条目时需传唯一值）。 */
    toolbarPageKey?: string | number;
    /**
     * 自定义 #toolbar 槽翻页时由宿主递增，配合 toolbarNavDirection 驱动 motion-page 方向。
     * 内置翻页按钮会自行设置方向，无需传此 prop。
     */
    toolbarNavPulse?: number;
    toolbarNavDirection?: 'prev' | 'next';
    toolbarPrevDisabled?: boolean;
    toolbarNextDisabled?: boolean;
    toolbarTone?: ComboActionPageTone;
    /** Cancel 按钮 tone；默认与 toolbarTone 一致。 */
    toolbarCancelTone?: ButtonTone;
    toolbarDirection?: 'left' | 'right';
    /** 工具栏顶部分割线常驻（不依赖底部是否仍有内容被裁切）。 */
    toolbarDividerPinned?: boolean;
    showToolbarNote?: boolean;
    toolbarNoteLabel?: string;
    toolbarConfirmLabel?: string;
    toolbarCancelLabel?: string;
    valueCopyLabel?: string;
    valueAddressBookLabel?: string;
    valueAmlSearchLabel?: string;
    valueBrowserLabel?: string;
    amlSearchActiveItemKey?: string | null;
  }>(),
  {
    eyebrow: 'Title',
    headline: 'Headline',
    statusTag: 'Tag',
    statusTagSize: 'lg',
    statusTagStatus: 'danger',
    showEyebrow: true,
    showStatusTag: true,
    showTabs: false,
    tabLabels: () => ['Tab', 'Tab', 'Tab', 'Tab', 'Tab'],
    tabHorizontalGap: 'xl',
    tabVerticalGap: 'xl',
    sections: () => createDefaultDetailSections(),
    showToolbar: true,
    showToolbarNav: true,
    toolbarCurrent: 12,
    toolbarTotal: 1000,
    toolbarPrevDisabled: false,
    toolbarNextDisabled: false,
    toolbarTone: 'decor',
    toolbarDirection: 'right',
    toolbarDividerPinned: false,
    showToolbarNote: true,
    toolbarNoteLabel: 'Info.',
    toolbarConfirmLabel: 'Confirm',
    toolbarCancelLabel: 'Cancel',
    valueCopyLabel: 'Copy',
    valueAddressBookLabel: 'Add to address book',
    valueAmlSearchLabel: 'AML Search',
    valueBrowserLabel: 'Block explorer',
    amlSearchActiveItemKey: null,
  },
);

const emit = defineEmits<{
  close: [];
  toolbarPrev: [];
  toolbarNext: [];
  toolbarNote: [];
  toolbarConfirm: [];
  toolbarCancel: [];
  itemValueLinkClick: [key: string];
  itemValueAmlSearchClick: [key: string];
}>();

function isAmlSearchActive(copyKey: string): boolean {
  return props.amlSearchActiveItemKey === copyKey;
}

function onAmlSearchClick(copyKey: string, event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  emit('itemValueAmlSearchClick', copyKey);
}

function onItemValueLinkClick(
  item: DetailItemData,
  sectionIndex: number,
  itemIndex: number,
  event: MouseEvent,
) {
  event.stopPropagation();
  event.preventDefault();
  emit('itemValueLinkClick', item.key ?? `${sectionIndex}-${itemIndex}`);
}

const toolbarCounterCurrentText = computed(() =>
  formatGroupedNumber(props.toolbarCurrent),
);

const toolbarCounterTotalText = computed(() =>
  formatGroupedNumber(props.toolbarTotal),
);

const resolvedToolbarCancelTone = computed(
  (): ButtonTone => props.toolbarCancelTone ?? props.toolbarTone,
);

const rootRef = ref<HTMLElement | null>(null);

const contentNavDirection = ref<'prev' | 'next'>('next');
const toolbarNavFlash = ref<'prev' | 'next' | null>(null);
let toolbarNavFlashTimer: ReturnType<typeof setTimeout> | undefined;

const TOOLBAR_NAV_FLASH_MS = 300;

const resolvedToolbarPageKey = computed(() =>
  props.toolbarPageKey != null ? String(props.toolbarPageKey) : String(props.toolbarCurrent),
);

const contentPageStackDirection = computed((): 'forward' | 'backward' | 'none' => {
  if (!props.showToolbarNav) return 'none';
  return contentNavDirection.value === 'prev' ? 'backward' : 'forward';
});

const showToolbarDivider = computed(
  () => scrollOverflows.value || props.toolbarDividerPinned,
);

function flashToolbarNav(direction: 'prev' | 'next') {
  toolbarNavFlash.value = direction;
  if (toolbarNavFlashTimer) clearTimeout(toolbarNavFlashTimer);
  toolbarNavFlashTimer = setTimeout(() => {
    toolbarNavFlash.value = null;
    toolbarNavFlashTimer = undefined;
  }, TOOLBAR_NAV_FLASH_MS);
}

function onToolbarPrev() {
  contentNavDirection.value = 'prev';
  flashToolbarNav('prev');
  emit('toolbarPrev');
}

function onToolbarNext() {
  contentNavDirection.value = 'next';
  flashToolbarNav('next');
  emit('toolbarNext');
}

function isEditableKeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

function isDetailInOpenPopup(): boolean {
  const root = rootRef.value;
  if (!root) return false;
  return Boolean(root.closest('.eds-popup'));
}

/** Detail 打开时：焦点在 Detail 内、body，或 Popup 外背景（如列表仍持有焦点）时接管方向键。 */
function shouldHandleDetailKeyboard(): boolean {
  const root = rootRef.value;
  if (!root) return false;

  const active = document.activeElement;
  if (active instanceof HTMLElement && isEditableKeyTarget(active)) {
    return false;
  }

  if (active instanceof HTMLElement && root.contains(active)) {
    return true;
  }

  if (active === document.body || active === null) {
    return true;
  }

  if (isDetailInOpenPopup() && active instanceof HTMLElement) {
    const popup = root.closest('.eds-popup');
    if (popup && !popup.contains(active)) {
      return true;
    }
  }

  return false;
}

const DETAIL_KEYBOARD_SCROLL_STEP_PX = 40;

function onWindowDetailKeydown(event: KeyboardEvent) {
  if (!shouldHandleDetailKeyboard()) return;

  if (event.key === 'Escape') {
    if (hasOpenClickAnchoredTooltip()) {
      return;
    }
    event.preventDefault();
    emit('close');
    return;
  }

  if (
    props.showToolbar
    && props.showToolbarNav
    && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
  ) {
    if (event.key === 'ArrowLeft' && !props.toolbarPrevDisabled) {
      event.preventDefault();
      onToolbarPrev();
      return;
    }

    if (event.key === 'ArrowRight' && !props.toolbarNextDisabled) {
      event.preventDefault();
      onToolbarNext();
    }
    return;
  }

  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const scroll = scrollRef.value;
    if (!scroll) return;

    const delta = event.key === 'ArrowUp' ? -DETAIL_KEYBOARD_SCROLL_STEP_PX : DETAIL_KEYBOARD_SCROLL_STEP_PX;
    scroll.scrollBy({ top: delta });
    event.preventDefault();
  }
}

const activeTab = defineModel<number>('activeTab', { default: 0 });

const SCROLL_EDGE_EPSILON = 2;

const scrollRef = ref<HTMLElement | null>(null);
const scrollContentRef = ref<HTMLElement | null>(null);
const scrollFadeTop = ref(false);
const scrollOverflows = ref(false);
let scrollResizeObserver: ResizeObserver | undefined;

function updateScrollState() {
  const element = scrollRef.value;

  if (!element) {
    scrollFadeTop.value = false;
    scrollOverflows.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  const hasHiddenContentBelow =
    canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;

  /* 底部仍有内容被裁切时显示工具栏分割线；滚到底、底部完全露出时不显示 */
  scrollOverflows.value = hasHiddenContentBelow;
  scrollFadeTop.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
}

function scheduleScrollStateUpdate() {
  void nextTick(updateScrollState);
}

function onScroll() {
  updateScrollState();
}

function observeScrollTargets() {
  scrollResizeObserver?.disconnect();
  scrollResizeObserver = new ResizeObserver(() => {
    updateScrollState();
  });
  if (scrollRef.value) {
    scrollResizeObserver.observe(scrollRef.value);
  }
  if (scrollContentRef.value) {
    scrollResizeObserver.observe(scrollContentRef.value);
  }
  updateScrollState();
}

onMounted(() => {
  scheduleScrollStateUpdate();
  observeScrollTargets();
  window.addEventListener('keydown', onWindowDetailKeydown, { capture: true });
});

watch(scrollRef, () => {
  observeScrollTargets();
});

watch(scrollContentRef, () => {
  observeScrollTargets();
});

watch(
  () => props.toolbarNavPulse,
  (pulse, previousPulse) => {
    if (pulse == null || previousPulse == null || pulse === previousPulse) return;
    const direction = props.toolbarNavDirection;
    if (direction === 'prev' || direction === 'next') {
      contentNavDirection.value = direction;
    }
  },
);

watch(
  () => [props.toolbarCurrent, resolvedToolbarPageKey.value] as const,
  ([nextCurrent, nextKey], [prevCurrent, prevKey]) => {
    if (!props.showToolbarNav || prevCurrent === undefined) return;

    const currentChanged = nextCurrent !== prevCurrent;
    const keyChanged = nextKey !== prevKey;
    if (!currentChanged && !keyChanged) return;

    if (currentChanged) {
      const nextNum = Number(nextCurrent);
      const prevNum = Number(prevCurrent);
      if (Number.isFinite(nextNum) && Number.isFinite(prevNum) && nextNum !== prevNum) {
        contentNavDirection.value = nextNum > prevNum ? 'next' : 'prev';
      }
    } else if (keyChanged) {
      contentNavDirection.value = 'next';
    }

    scrollRef.value?.scrollTo({ top: 0, behavior: 'instant' });
  },
);

watch(
  () => [
    props.sections,
    props.showEyebrow,
    props.showStatusTag,
    props.showTabs,
    props.headline,
    props.tabLabels,
  ],
  scheduleScrollStateUpdate,
  { deep: true },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onWindowDetailKeydown, { capture: true });
  scrollResizeObserver?.disconnect();
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
  if (toolbarNavFlashTimer) clearTimeout(toolbarNavFlashTimer);
});
</script>

<template>
  <div
    ref="rootRef"
    class="eds-detail eds-popup-inner-backdrop"
    :class="styles.root"
    data-no-corner-smoothing
  >
    <div :class="styles.systemBarClose">
      <EgIconButton
        shape="square"
        size="md"
        label="关闭"
        motion="asym"
        @click="emit('close')"
      >
        <EgIcon name="eds-close-circle-fill" fit />
      </EgIconButton>
    </div>

    <div
      ref="scrollRef"
      :class="[
        styles.scroll,
        scrollFadeTop && styles.scrollFadeTop,
      ]"
      @scroll="onScroll"
    >
      <div ref="scrollContentRef" :class="styles.scrollContent">
      <div
        :class="[styles.scrollTopEdge, scrollFadeTop && styles.scrollTopEdgeVisible]"
        aria-hidden="true"
      />

      <div
        class="motion-page-stack"
        :class="styles.scrollPageHost"
        :data-page-direction="contentPageStackDirection"
      >
        <Transition name="motion-page">
          <div :key="resolvedToolbarPageKey" :class="['motion-page', styles.scrollBody]">
      <slot name="body">
          <header :class="styles.headline">
            <div :class="styles.headlineMain">
              <span v-if="showEyebrow" :class="styles.eyebrow">{{ eyebrow }}</span>
              <div :class="styles.headlineRow">
                <h2 :class="styles.headlineText">
                  <slot name="headline-text">{{ headline }}</slot>
                </h2>
                <EgTag
                  v-if="showStatusTag && statusTag"
                  family="status"
                  :status="statusTagStatus"
                  :size="statusTagSize"
                >
                  {{ statusTag }}
                </EgTag>
              </div>
            </div>

            <div v-if="showTabs" :class="styles.tabsWrap">
              <EgTabs
                v-model="activeTab"
                :class="styles.tabsHost"
                :labels="tabLabels"
                :horizontal-gap="tabHorizontalGap"
                :vertical-gap="tabVerticalGap"
              />
              <EgDivider
                :class="styles.headlineDivider"
                type="page"
                direction="horizontal"
              />
            </div>

            <EgDivider
              v-else
              :class="styles.headlineDivider"
              type="page"
              direction="horizontal"
            />
          </header>

          <div :class="styles.sections">
            <template
              v-for="(section, sectionIndex) in sections"
              :key="section.key ?? sectionIndex"
            >
              <div :class="styles.sectionContent">
                <div v-if="section.title" :class="styles.sectionTitleRow">
                  <span :class="styles.sectionTitle">{{ section.title }}</span>
                </div>

                <div :class="styles.itemList">
                  <div
                    v-for="(item, itemIndex) in section.items"
                    :key="item.key ?? itemIndex"
                    :class="[
                      styles.item,
                      (itemHasAddressBranch(item) || itemShowsAddressCollapsedFooter(item))
                        && styles.itemAddressMulti,
                      itemHasAddressBranch(item) && styles.itemAddressExpanded,
                    ]"
                  >
                    <div
                      :class="[
                        styles.itemRow,
                        itemRowCopyable(item, itemPrimaryValueEntry(item)) && styles.itemRowCopyable,
                      ]"
                      :role="itemRowCopyable(item, itemPrimaryValueEntry(item)) ? 'button' : undefined"
                      :tabindex="itemRowCopyable(item, itemPrimaryValueEntry(item)) ? 0 : undefined"
                      @click="onItemRowCopyClick(
                        sectionIndex,
                        itemIndex,
                        item,
                        itemPrimaryValueEntry(item),
                        0,
                        $event,
                      )"
                      @keydown.enter.prevent="onItemRowCopyClick(
                        sectionIndex,
                        itemIndex,
                        item,
                        itemPrimaryValueEntry(item),
                        0,
                      )"
                      @keydown.space.prevent="onItemRowCopyClick(
                        sectionIndex,
                        itemIndex,
                        item,
                        itemPrimaryValueEntry(item),
                        0,
                      )"
                    >
                      <div :class="styles.itemTitle">
                        <span
                          v-if="itemShowsTitleIcon(item)"
                          :class="styles.itemTitleIcon"
                        >
                          <EgIcon :name="item.titleIcon!" fit />
                        </span>
                        <span :class="styles.itemTitleText">{{ item.title }}</span>
                      </div>
                      <div
                        :class="[
                          styles.itemValue,
                          entryAddressTagsBelow(itemPrimaryValueEntry(item))
                            && styles.itemValueAddressStack,
                        ]"
                      >
                        <slot
                          v-if="item.key && $slots[`item-value-${item.key}`]"
                          :name="`item-value-${item.key}`"
                          :item="item"
                        />
                        <template v-else>
                        <template
                          v-for="(entry, entryIndex) in [itemPrimaryValueEntry(item)]"
                          :key="`${item.key ?? itemIndex}-primary`"
                        >
                            <div
                              v-if="entryAddressTagsBelow(entry)"
                              :class="styles.itemValueAddressMainLine"
                            >
                            <EgTag
                              v-if="itemValueTagText(item, entry) && itemValueTagBeforeValue(item, entry)"
                              :family="itemValueTagFamily(item, entry)"
                              :status="entry.tagStatus ?? item.tagStatus"
                              :system-type="itemValueTagSystemType(item, entry)"
                              size="sm"
                            >
                              {{ itemValueTagText(item, entry) }}
                            </EgTag>
                            <span
                              v-if="itemShowsValueCrypto(item) && itemValueCryptoName(item)"
                              :class="styles.itemValueCrypto"
                            >
                              <EgCrypto
                                :name="itemValueCryptoName(item)!"
                                fit
                              />
                            </span>
                            <EgAvatar
                              v-else-if="itemShowsValueAvatar(item)"
                              size="xs"
                              :name="itemValueAvatarName(item)"
                            />
                            <template v-if="item.inlineValueEntries && item.valueEntries?.length">
                              <span
                                v-for="(segment, segmentIndex) in item.valueEntries"
                                :key="`${item.key ?? itemIndex}-segment-${segmentIndex}`"
                                :class="inlineValueSegmentClass(segment, styles)"
                              >
                                {{ segment.value }}
                              </span>
                            </template>
                            <div
                              v-else-if="!item.valueTagOnly && entry.value"
                              :class="styles.itemValueAddressInlineCluster"
                            >
                            <span
                              :class="[styles.itemValueText, styles.itemValueTextNowrap]"
                            >
                              {{ resolveItemCopyValue(item, entry) }}
                            </span>
                            <div
                              v-if="itemHasValueTrailingActions(item)"
                              :class="styles.itemValueTrailing"
                            >
                              <EgLinkButton
                                v-if="item.showValueLink"
                                size="sm"
                                tone="brand"
                                @click="onItemValueLinkClick(item, sectionIndex, itemIndex, $event)"
                              >
                                {{ item.valueLinkLabel ?? 'Edit' }}
                              </EgLinkButton>
                                <span
                                  v-if="item.showValueCopy"
                                  :class="[
                                    cryptoComboStyles.menuCopyButton,
                                    copiedItemKey === itemCopyKey(sectionIndex, itemIndex, item, entryIndex)
                                      && cryptoComboStyles.menuCopyButtonCopied,
                                  ]"
                                  @click.stop
                                >
                                  <DetailValueActionIcon
                                    :label="valueCopyLabel"
                                    :icon="
                                      copiedItemKey === itemCopyKey(sectionIndex, itemIndex, item, entryIndex)
                                        ? 'eds-enable-fill'
                                        : 'eds-copy'
                                    "
                                    @click="onCopyItemValue(
                                      itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
                                      resolveItemCopyValue(item, entry),
                                      $event,
                                    )"
                                  />
                                </span>
                                <DetailValueActionIcon
                                  v-if="item.showValueAddressBook"
                                  :label="valueAddressBookLabel"
                                  icon="eds-associates"
                                />
                                <DetailValueActionIcon
                                  v-if="item.showValueAmlSearch"
                                  :label="valueAmlSearchLabel"
                                  icon="eds-aml-search"
                                  :verifying="isAmlSearchActive(
                                    itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
                                  )"
                                  @click="onAmlSearchClick(
                                    itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
                                    $event,
                                  )"
                                />
                                <DetailValueActionIcon
                                  v-if="item.showValueBrowser"
                                  :label="valueBrowserLabel"
                                  icon="eds-earth"
                                />
                            </div>
                            </div>
                            <EgTag
                              v-if="itemValueTagText(item, entry) && !itemValueTagBeforeValue(item, entry)"
                              :family="itemValueTagFamily(item, entry)"
                              :status="entry.tagStatus ?? item.tagStatus"
                              :system-type="itemValueTagSystemType(item, entry)"
                              size="sm"
                            >
                              {{ itemValueTagText(item, entry) }}
                            </EgTag>
                          </div>
                          <CryptoAddressTags
                            v-if="entryAddressTagsBelow(entry)
                              && entry.valueAddressSideTags
                              && hasAddressTags(
                                entry.valueAddressSideTags.system,
                                entry.valueAddressSideTags.custom,
                              )"
                            :tags="entry.valueAddressSideTags"
                            :reveal-all="entry.valueAddressSideTagsRevealAll === true"
                            :class="[
                              styles.itemValueAddressTags,
                              styles.itemValueAddressTagsBelow,
                            ]"
                          />
                          <EgFormSubmission
                            v-if="entryAddressTagsBelow(entry) && entry.valueAddressSideFeedback"
                            :class="styles.itemValueAddressFeedbackBelow"
                            :type="entry.valueAddressSideFeedback.type ?? 'notes'"
                            :text="entry.valueAddressSideFeedback.text"
                            :show-link="entry.valueAddressSideFeedback.showLink ?? false"
                          />
                          <template v-if="!entryAddressTagsBelow(entry)">
                            <EgTag
                              v-if="itemValueTagText(item, entry) && itemValueTagBeforeValue(item, entry)"
                              :family="itemValueTagFamily(item, entry)"
                              :status="entry.tagStatus ?? item.tagStatus"
                              :system-type="itemValueTagSystemType(item, entry)"
                              size="sm"
                            >
                              {{ itemValueTagText(item, entry) }}
                            </EgTag>
                            <CryptoAddressTags
                              v-if="entry.valueAddressSideTags && hasAddressTags(entry.valueAddressSideTags.system, entry.valueAddressSideTags.custom)"
                              :tags="entry.valueAddressSideTags"
                              :reveal-all="entry.valueAddressSideTagsRevealAll === true"
                              :class="styles.itemValueAddressTags"
                            />
                            <span
                              v-if="itemShowsValueCrypto(item) && itemValueCryptoName(item)"
                              :class="styles.itemValueCrypto"
                            >
                              <EgCrypto
                                :name="itemValueCryptoName(item)!"
                                fit
                              />
                            </span>
                            <EgAvatar
                              v-else-if="itemShowsValueAvatar(item)"
                              size="xs"
                              :name="itemValueAvatarName(item)"
                            />
                            <template v-if="item.inlineValueEntries && item.valueEntries?.length">
                              <span
                                v-for="(segment, segmentIndex) in item.valueEntries"
                                :key="`${item.key ?? itemIndex}-segment-${segmentIndex}`"
                                :class="inlineValueSegmentClass(segment, styles)"
                              >
                                {{ segment.value }}
                              </span>
                            </template>
                            <span
                              v-else-if="!item.valueTagOnly && entry.value"
                              :class="[
                                styles.itemValueText,
                                !itemShowsValueAvatar(item) && styles.itemValueTextNowrap,
                              ]"
                            >
                              {{ entry.value }}
                            </span>
                            <EgTag
                              v-if="itemValueTagText(item, entry) && !itemValueTagBeforeValue(item, entry)"
                              :family="itemValueTagFamily(item, entry)"
                              :status="entry.tagStatus ?? item.tagStatus"
                              :system-type="itemValueTagSystemType(item, entry)"
                              size="sm"
                            >
                              {{ itemValueTagText(item, entry) }}
                            </EgTag>
                            <div
                              v-if="itemHasValueTrailingActions(item)"
                              :class="styles.itemValueTrailing"
                            >
                              <EgLinkButton
                                v-if="item.showValueLink"
                                size="sm"
                                tone="brand"
                                @click="onItemValueLinkClick(item, sectionIndex, itemIndex, $event)"
                              >
                                {{ item.valueLinkLabel ?? 'Edit' }}
                              </EgLinkButton>
                                <span
                                  v-if="item.showValueCopy"
                                  :class="[
                                    cryptoComboStyles.menuCopyButton,
                                    copiedItemKey === itemCopyKey(sectionIndex, itemIndex, item, entryIndex)
                                      && cryptoComboStyles.menuCopyButtonCopied,
                                  ]"
                                  @click.stop
                                >
                                  <DetailValueActionIcon
                                    :label="valueCopyLabel"
                                    :icon="
                                      copiedItemKey === itemCopyKey(sectionIndex, itemIndex, item, entryIndex)
                                        ? 'eds-enable-fill'
                                        : 'eds-copy'
                                    "
                                    @click="onCopyItemValue(
                                      itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
                                      resolveItemCopyValue(item, entry),
                                      $event,
                                    )"
                                  />
                                </span>
                                <DetailValueActionIcon
                                  v-if="item.showValueAddressBook"
                                  :label="valueAddressBookLabel"
                                  icon="eds-associates"
                                />
                                <DetailValueActionIcon
                                  v-if="item.showValueAmlSearch"
                                  :label="valueAmlSearchLabel"
                                  icon="eds-aml-search"
                                  :verifying="isAmlSearchActive(
                                    itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
                                  )"
                                  @click="onAmlSearchClick(
                                    itemCopyKey(sectionIndex, itemIndex, item, entryIndex),
                                    $event,
                                  )"
                                />
                                <DetailValueActionIcon
                                  v-if="item.showValueBrowser"
                                  :label="valueBrowserLabel"
                                  icon="eds-earth"
                                />
                            </div>
                          </template>
                        </template>
                        </template>
                      </div>
                    </div>

                    <div
                      v-if="itemShowsAddressCollapsedFooter(item)"
                      :class="styles.itemAddressCollapsedFooter"
                    >
                      <div
                        :class="styles.itemAddressDashRule"
                        aria-hidden="true"
                      />
                      <div :class="styles.itemRow">
                        <div
                          :class="styles.itemTitleSpacer"
                          aria-hidden="true"
                        />
                        <EgLinkButton
                          size="sm"
                          tone="brand"
                          @click="onItemValueLinkClick(item, sectionIndex, itemIndex, $event)"
                        >
                          {{ itemAddressViewMoreText(item) }}
                        </EgLinkButton>
                      </div>
                    </div>

                    <div
                      v-if="itemHasAddressBranch(item)"
                      :class="styles.itemAddressBranch"
                    >
                      <template
                        v-for="(entry, branchIndex) in itemAddressBranchEntries(item)"
                        :key="`${item.key ?? itemIndex}-branch-${branchIndex}`"
                      >
                        <div
                          :class="styles.itemAddressDashRule"
                          aria-hidden="true"
                        />
                        <div
                          :class="[
                            styles.itemRow,
                            itemRowCopyable(item, entry) && styles.itemRowCopyable,
                          ]"
                          :role="itemRowCopyable(item, entry) ? 'button' : undefined"
                          :tabindex="itemRowCopyable(item, entry) ? 0 : undefined"
                          @click="onItemRowCopyClick(
                            sectionIndex,
                            itemIndex,
                            item,
                            entry,
                            branchIndex + 1,
                            $event,
                          )"
                          @keydown.enter.prevent="onItemRowCopyClick(
                            sectionIndex,
                            itemIndex,
                            item,
                            entry,
                            branchIndex + 1,
                          )"
                          @keydown.space.prevent="onItemRowCopyClick(
                            sectionIndex,
                            itemIndex,
                            item,
                            entry,
                            branchIndex + 1,
                          )"
                        >
                          <div
                            :class="styles.itemTitleSpacer"
                            aria-hidden="true"
                          />
                          <div
                            :class="[
                              styles.itemValue,
                              entryAddressTagsBelow(entry) && styles.itemValueAddressStack,
                            ]"
                          >
                            <div
                              v-if="entryAddressTagsBelow(entry)"
                              :class="styles.itemValueAddressMainLine"
                            >
                              <EgTag
                                v-if="entry.tag && entry.tagBeforeValue"
                                :family="entry.tagFamily"
                                :status="entry.tagStatus"
                                :system-type="entry.tagSystemType"
                                size="sm"
                              >
                                {{ entry.tag }}
                              </EgTag>
                              <div
                                v-if="entry.value"
                                :class="styles.itemValueAddressInlineCluster"
                              >
                              <span
                                :class="[styles.itemValueText, styles.itemValueTextNowrap]"
                              >
                                {{ resolveItemCopyValue(item, entry) }}
                              </span>
                              <div
                                v-if="itemHasValueTrailingActions(item)"
                                :class="styles.itemValueTrailing"
                              >
                                <span
                                  v-if="item.showValueCopy"
                                  :class="[
                                    cryptoComboStyles.menuCopyButton,
                                    copiedItemKey === itemCopyKey(
                                      sectionIndex,
                                      itemIndex,
                                      item,
                                      branchIndex + 1,
                                    ) && cryptoComboStyles.menuCopyButtonCopied,
                                  ]"
                                  @click.stop
                                >
                                  <DetailValueActionIcon
                                    :label="valueCopyLabel"
                                    :icon="
                                      copiedItemKey === itemCopyKey(
                                        sectionIndex,
                                        itemIndex,
                                        item,
                                        branchIndex + 1,
                                      )
                                        ? 'eds-enable-fill'
                                        : 'eds-copy'
                                    "
                                    @click="onCopyItemValue(
                                      itemCopyKey(sectionIndex, itemIndex, item, branchIndex + 1),
                                      resolveItemCopyValue(item, entry),
                                      $event,
                                    )"
                                  />
                                </span>
                                <DetailValueActionIcon
                                  v-if="item.showValueAddressBook"
                                  :label="valueAddressBookLabel"
                                  icon="eds-associates"
                                />
                                <DetailValueActionIcon
                                  v-if="item.showValueAmlSearch"
                                  :label="valueAmlSearchLabel"
                                  icon="eds-aml-search"
                                  :verifying="isAmlSearchActive(
                                    itemCopyKey(sectionIndex, itemIndex, item, branchIndex + 1),
                                  )"
                                  @click="onAmlSearchClick(
                                    itemCopyKey(sectionIndex, itemIndex, item, branchIndex + 1),
                                    $event,
                                  )"
                                />
                              </div>
                              </div>
                            </div>
                            <CryptoAddressTags
                              v-if="entryAddressTagsBelow(entry)
                                && entry.valueAddressSideTags
                                && hasAddressTags(
                                  entry.valueAddressSideTags.system,
                                  entry.valueAddressSideTags.custom,
                                )"
                              :tags="entry.valueAddressSideTags"
                              :reveal-all="entry.valueAddressSideTagsRevealAll === true"
                              :class="[
                                styles.itemValueAddressTags,
                                styles.itemValueAddressTagsBelow,
                              ]"
                            />
                            <EgFormSubmission
                              v-if="entryAddressTagsBelow(entry) && entry.valueAddressSideFeedback"
                              :class="styles.itemValueAddressFeedbackBelow"
                              :type="entry.valueAddressSideFeedback.type ?? 'notes'"
                              :text="entry.valueAddressSideFeedback.text"
                              :show-link="entry.valueAddressSideFeedback.showLink ?? false"
                            />
                            <template v-if="!entryAddressTagsBelow(entry)">
                              <EgTag
                                v-if="entry.tag && entry.tagBeforeValue"
                                :family="entry.tagFamily"
                                :status="entry.tagStatus"
                                :system-type="entry.tagSystemType"
                                size="sm"
                              >
                                {{ entry.tag }}
                              </EgTag>
                              <CryptoAddressTags
                                v-if="entry.valueAddressSideTags && hasAddressTags(entry.valueAddressSideTags.system, entry.valueAddressSideTags.custom)"
                                :tags="entry.valueAddressSideTags"
                                :reveal-all="entry.valueAddressSideTagsRevealAll === true"
                                :class="styles.itemValueAddressTags"
                              />
                              <span
                                v-if="entry.value"
                                :class="[styles.itemValueText, styles.itemValueTextNowrap]"
                              >
                                {{ entry.value }}
                              </span>
                              <div
                                v-if="itemHasValueTrailingActions(item)"
                                :class="styles.itemValueTrailing"
                              >
                                <span
                                  v-if="item.showValueCopy"
                                  :class="[
                                    cryptoComboStyles.menuCopyButton,
                                    copiedItemKey === itemCopyKey(
                                      sectionIndex,
                                      itemIndex,
                                      item,
                                      branchIndex + 1,
                                    ) && cryptoComboStyles.menuCopyButtonCopied,
                                  ]"
                                  @click.stop
                                >
                                  <DetailValueActionIcon
                                    :label="valueCopyLabel"
                                    :icon="
                                      copiedItemKey === itemCopyKey(
                                        sectionIndex,
                                        itemIndex,
                                        item,
                                        branchIndex + 1,
                                      )
                                        ? 'eds-enable-fill'
                                        : 'eds-copy'
                                    "
                                    @click="onCopyItemValue(
                                      itemCopyKey(sectionIndex, itemIndex, item, branchIndex + 1),
                                      resolveItemCopyValue(item, entry),
                                      $event,
                                    )"
                                  />
                                </span>
                                <DetailValueActionIcon
                                  v-if="item.showValueAddressBook"
                                  :label="valueAddressBookLabel"
                                  icon="eds-associates"
                                />
                                <DetailValueActionIcon
                                  v-if="item.showValueAmlSearch"
                                  :label="valueAmlSearchLabel"
                                  icon="eds-aml-search"
                                  :verifying="isAmlSearchActive(
                                    itemCopyKey(sectionIndex, itemIndex, item, branchIndex + 1),
                                  )"
                                  @click="onAmlSearchClick(
                                    itemCopyKey(sectionIndex, itemIndex, item, branchIndex + 1),
                                    $event,
                                  )"
                                />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <div v-if="section.showCollapse" :class="styles.collapseRow">
                  <EgLinkButton size="sm" tone="brand">
                    {{ section.collapseLabel ?? 'Connect to EDS' }}
                  </EgLinkButton>
                </div>
              </div>

              <EgDivider
                v-if="section.showDivider && sectionIndex < sections.length - 1"
                :class="styles.sectionDivider"
                type="page"
                direction="horizontal"
              />
            </template>
          </div>
        </slot>

        <div v-if="$slots.append" :class="styles.append">
          <slot name="append" />
        </div>
          </div>
        </Transition>
      </div>
      </div>
    </div>

    <footer
        v-if="showToolbar || $slots.toolbar"
        :class="[
          styles.toolbar,
          !scrollOverflows && styles.toolbarSolid,
          chromeScrimStyles.root,
          scrollOverflows && chromeScrimStyles.active,
        ]"
      >
        <div :class="chromeScrimStyles.content">
          <slot name="toolbar">
            <div
              v-if="showToolbar"
              :class="[
                styles.toolbarPage,
                !showToolbarNav && toolbarDirection === 'left' && styles.toolbarPageAlignStart,
                !showToolbarNav && toolbarDirection === 'right' && styles.toolbarPageAlignEnd,
              ]"
            >
              <EgDivider
                :class="[
                  comboActionStyles.divider,
                  comboActionStyles.dividerAnimated,
                  !showToolbarDivider && comboActionStyles.dividerAnimatedHidden,
                ]"
                type="module"
                direction="horizontal"
                :hide="!showToolbarDivider"
              />
              <div :class="styles.toolbarBar">
                <div v-if="showToolbarNote" :class="styles.toolbarLeading">
                  <EgButton
                    tone="subtle"
                    variant="outline"
                    size="md"
                    @click="emit('toolbarNote')"
                  >
                    <template #icon>
                      <EgIcon name="eds-editor" fit size="md" />
                    </template>
                    {{ toolbarNoteLabel }}
                  </EgButton>
                </div>
                <div v-if="showToolbarNav" :class="styles.toolbarStart">
                  <div :class="styles.toolbarNav">
                    <EgPaginationGroupButton
                      kind="borderArrow"
                      label="上一项"
                      :disabled="toolbarPrevDisabled"
                      :visual-active="toolbarNavFlash === 'prev'"
                      @click="onToolbarPrev"
                    >
                      <EgIcon name="eds-arrow-left" fit />
                    </EgPaginationGroupButton>
                    <span :class="styles.toolbarCounter">
                      <span :class="styles.toolbarCounterCurrent">{{ toolbarCounterCurrentText }}</span>
                      <span :class="styles.toolbarCounterRest">/ {{ toolbarCounterTotalText }}</span>
                    </span>
                    <EgPaginationGroupButton
                      kind="borderArrow"
                      label="下一项"
                      :disabled="toolbarNextDisabled"
                      :visual-active="toolbarNavFlash === 'next'"
                      @click="onToolbarNext"
                    >
                      <EgIcon name="eds-arrow-right" fit />
                    </EgPaginationGroupButton>
                  </div>
                </div>
                <div
                  :class="[
                    styles.toolbarActions,
                    !showToolbarNav && toolbarDirection === 'left' && styles.toolbarActionsLeft,
                    !showToolbarNav && toolbarDirection === 'right' && styles.toolbarActionsRight,
                    showToolbarNav && styles.toolbarActionsRight,
                  ]"
                >
                  <slot name="toolbar-actions">
                    <EgButton
                      :tone="resolvedToolbarCancelTone"
                      variant="text"
                      size="md"
                      @click="emit('toolbarCancel')"
                    >
                      {{ toolbarCancelLabel }}
                    </EgButton>
                    <EgButton
                      :tone="toolbarTone"
                      variant="solid"
                      size="md"
                      @click="emit('toolbarConfirm')"
                    >
                      {{ toolbarConfirmLabel }}
                    </EgButton>
                  </slot>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </footer>
  </div>
</template>
