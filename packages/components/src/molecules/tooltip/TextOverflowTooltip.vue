<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue';
import { EgFlotation, EgFlotationMenu, EgFlotationMenuItem } from '../flotation';
import CopyActionIconButton from '../icon-button/CopyActionIconButton.vue';
import { EgTag } from '../tag';
import CryptoAddressTags from '../crypto-combo/CryptoAddressTags.vue';
import type { CryptoAddressSideTags } from '../crypto-combo/cryptoAddressTypes';
import { hasAddressTags } from '../crypto-combo/cryptoAddressTagUtils';
import cryptoComboStyles from '../crypto-combo/CryptoCombo.module.css';
import { copyToClipboard } from '../../utils/copyToClipboard';
import {
  clearLayoutSettleTimer,
  scheduleOverflowMeasureAfterLayoutSettle,
  type LayoutSettleTimerRef,
} from '../../utils/overflowMeasureDuringLayout';
import {
  isClippedInsideBoundary,
  isElementTextOverflowing,
  isTextWiderThanContainers,
} from '../../utils/overflowTextMeasure';
import EgTooltip, { type TooltipTrigger } from './AnchoredTooltip.vue';
import styles from './TextOverflowTooltip.module.css';
import {
  COPYABLE_OVERFLOW_MENU_CLASS,
  COPYABLE_OVERFLOW_TOOLTIP_MAX_HEIGHT,
  COPYABLE_OVERFLOW_TOOLTIP_MAX_WIDTH,
  FLOTATION_OVERFLOW_CLOSE_DELAY,
  FLOTATION_OVERFLOW_OPEN_DELAY,
  TEXT_OVERFLOW_TOOLTIP_MAX_WIDTH,
  TEXT_OVERFLOW_TOOLTIP_TOKEN_SCOPE,
  type TextOverflowTooltipTargetTone,
} from './textOverflowTooltipConstants';

const props = withDefaults(
  defineProps<{
    tooltipText?: string;
    trigger?: TooltipTrigger;
    targetTone?: TextOverflowTooltipTargetTone;
    panelScopeClass?: string;
    menuTextClass?: string | string[];
    typographyClass?: string | string[];
    measureClass?: string | string[];
    hostClass?: string;
    hostFlex?: boolean;
    wrapClass?: string;
    boundarySelector?: string;
    maxWidth?: number;
    showTooltipCopy?: boolean;
    copyLabel?: string;
    copyValue?: string;
    disabled?: boolean;
    /** 展示文本已语义截断（如 6…6 地址）时也启用只读 Tooltip / 复制 Menu。 */
    semanticTruncated?: boolean;
    /** CryptoAddress Menu：别名 Tag（solid-brand）。 */
    menuAlias?: string;
    /** CryptoAddress / ListFieldAddress Menu：meta 行副文本（Wallet Name 等）。 */
    menuSecondaryText?: string;
    /** CryptoAddress Menu：第二行展开全部 Tag（tooltip-mode）。 */
    menuTags?: CryptoAddressSideTags;
    /** 扩大 Flotation trigger 区域时，将 hover 虚线仅交给 slot 内元素（如地址文案）。 */
    deferHoverTarget?: boolean;
  }>(),
  {
    trigger: 'hover',
    targetTone: 'primary',
    panelScopeClass: '',
    menuTextClass: undefined,
    typographyClass: undefined,
    measureClass: undefined,
    hostClass: undefined,
    wrapClass: undefined,
    boundarySelector: '',
    maxWidth: TEXT_OVERFLOW_TOOLTIP_MAX_WIDTH,
    showTooltipCopy: false,
    copyLabel: '复制',
    copyValue: undefined,
    disabled: false,
    semanticTruncated: false,
    menuAlias: undefined,
    menuSecondaryText: undefined,
    menuTags: undefined,
    deferHoverTarget: false,
  },
);

const hostRef = ref<HTMLElement | null>(null);
const measureRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const resolvedTooltipText = ref('');
const tooltipCopied = ref(false);
let resizeObserver: ResizeObserver | null = null;
let tooltipCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;
const layoutSettleRef: LayoutSettleTimerRef = {};

const hasMenuAlias = computed(() => Boolean(props.menuAlias?.trim()));

const hasMenuSecondaryText = computed(() => Boolean(props.menuSecondaryText?.trim()));

const showMenuFlotation = computed(() => {
  if (hasMenuAlias.value || hasMenuMetaRow.value) return true;
  if (!props.showTooltipCopy) return false;
  return overflowing.value || props.semanticTruncated;
});

const showHoverTrigger = computed(() => {
  if (!showMenuFlotation.value) return false;
  if (props.trigger === 'focus') return true;
  return (
    overflowing.value ||
    props.semanticTruncated ||
    hasMenuAlias.value ||
    hasMenuMetaRow.value
  );
});

const showFlatHoverTrigger = computed(
  () => overflowing.value || props.semanticTruncated,
);

const tooltipDisabled = computed(
  () =>
    props.disabled ||
    (!showMenuFlotation.value && !overflowing.value && !props.semanticTruncated) ||
    !resolvedTooltipText.value,
);

const hoverTriggerClass = computed(() =>
  props.trigger === 'focus' ? 'eds-hover-tooltip-trigger--focus' : undefined,
);

const tooltipTargetModifier = computed(() => {
  if (props.targetTone === 'inherit') {
    return 'eds-hover-tooltip-trigger__target--inherit';
  }
  if (props.targetTone === 'secondary') {
    return 'eds-hover-tooltip-trigger__target--secondary';
  }
  return 'eds-hover-tooltip-trigger__target--primary';
});

const hasHoverTriggerMarkup = computed(
  () => showHoverTrigger.value || showFlatHoverTrigger.value,
);

const targetShellMotionClass = computed(() => {
  if (!hasHoverTriggerMarkup.value) {
    return undefined;
  }
  return props.trigger === 'focus'
    ? styles.targetShellFocusMotion
    : styles.targetShellHoverMotion;
});

const tokenScopeClass = computed(() =>
  [TEXT_OVERFLOW_TOOLTIP_TOKEN_SCOPE, props.panelScopeClass]
    .filter(Boolean)
    .join(' '),
);

const hostClasses = computed(() => [
  styles.host,
  props.hostFlex && styles.hostFlex,
  props.hostClass,
]);

const typographyClasses = computed(() => {
  const value = props.typographyClass;
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
});

const menuTextClasses = computed(() => {
  const value = props.menuTextClass;
  if (!value) return [cryptoComboStyles.menuAddress];
  return Array.isArray(value) ? value : [value];
});

const measureClasses = computed(() => {
  const value = props.measureClass;
  const extra = value ? (Array.isArray(value) ? value : [value]) : [];
  return [styles.measure, ...extra];
});

const panelCopyValue = computed(
  () => props.copyValue ?? props.tooltipText ?? resolvedTooltipText.value,
);

const showMenuExpandedTags = computed(() => {
  if (!props.menuTags) return false;
  return hasAddressTags(props.menuTags.system, props.menuTags.custom);
});

const hasMenuMetaRow = computed(
  () => hasMenuSecondaryText.value || showMenuExpandedTags.value,
);

const resolvedBoundarySelector = computed(() => props.boundarySelector || undefined);

function measureOverflow() {
  const el = measureRef.value;
  const host = hostRef.value;
  if (!el) {
    overflowing.value = false;
    resolvedTooltipText.value = '';
    return;
  }

  const text =
    props.tooltipText?.trim() ||
    el.textContent?.trim() ||
    '';
  resolvedTooltipText.value = text;

  if (!text) {
    overflowing.value = false;
    return;
  }

  const scrollWidth = el.scrollWidth;
  if (isElementTextOverflowing(el)) {
    overflowing.value = true;
    return;
  }

  if (
    isTextWiderThanContainers(el, [
      host,
      host?.parentElement,
      host?.parentElement?.parentElement,
    ])
  ) {
    overflowing.value = true;
    return;
  }

  if (host && scrollWidth > host.clientWidth + 1) {
    overflowing.value = true;
    return;
  }

  if (host) {
    const cell = host.closest('td') ?? host.closest('th');
    if (isClippedInsideBoundary(host, cell)) {
      overflowing.value = true;
      return;
    }
  }

  overflowing.value = false;
}

function requestOverflowMeasure() {
  scheduleOverflowMeasureAfterLayoutSettle(
    hostRef.value ?? measureRef.value,
    () => measureOverflow(),
    layoutSettleRef,
  );
}

function bindResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = null;
  resizeObserver = new ResizeObserver(() => requestOverflowMeasure());
  if (measureRef.value) {
    resizeObserver.observe(measureRef.value);
  }
  if (hostRef.value) {
    resizeObserver.observe(hostRef.value);
    const wrap = hostRef.value.parentElement;
    const segment = wrap?.parentElement;
    if (wrap) {
      resizeObserver.observe(wrap);
    }
    if (segment) {
      resizeObserver.observe(segment);
    }
    const cell = hostRef.value.closest('td') ?? hostRef.value.closest('th');
    if (cell) {
      resizeObserver.observe(cell);
    }
  }
}

function scheduleOverflowMeasure() {
  nextTick(() => {
    requestOverflowMeasure();
    bindResizeObserver();
  });
}

watch(
  () =>
    [
      props.tooltipText,
      props.semanticTruncated,
      props.menuAlias,
      props.menuSecondaryText,
      props.menuTags,
      props.trigger,
    ] as const,
  () => {
    scheduleOverflowMeasure();
  },
);

onMounted(() => {
  scheduleOverflowMeasure();
});

onUpdated(() => {
  requestOverflowMeasure();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  clearLayoutSettleTimer(layoutSettleRef);
  if (tooltipCopiedResetTimer) clearTimeout(tooltipCopiedResetTimer);
});

async function onTooltipCopy(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(panelCopyValue.value);
  if (!copied) return;

  tooltipCopied.value = true;
  if (tooltipCopiedResetTimer) clearTimeout(tooltipCopiedResetTimer);
  tooltipCopiedResetTimer = setTimeout(() => {
    tooltipCopied.value = false;
  }, 2000);
}
</script>

<template>
  <span ref="hostRef" :class="hostClasses">
    <EgFlotation
      v-if="showMenuFlotation"
      :trigger="trigger"
      placement="bottom"
      align="start"
      :open-delay="FLOTATION_OVERFLOW_OPEN_DELAY"
      :close-delay="FLOTATION_OVERFLOW_CLOSE_DELAY"
      :show-add="false"
      :show-menu-divider="false"
      close-on-scroll
      :boundary-selector="resolvedBoundarySelector"
      :class="styles.copyFlotationHost"
    >
      <template #trigger>
        <span
          :class="[
            styles.wrap,
            wrapClass,
            showHoverTrigger && !deferHoverTarget && 'eds-hover-tooltip-trigger',
            showHoverTrigger && !deferHoverTarget && hoverTriggerClass,
          ]"
        >
          <span
            :class="[
              styles.targetShell,
              showHoverTrigger && !deferHoverTarget && 'eds-hover-tooltip-trigger__target',
              showHoverTrigger && !deferHoverTarget && tooltipTargetModifier,
              showHoverTrigger && !deferHoverTarget && targetShellMotionClass,
              showHoverTrigger && !deferHoverTarget && typographyClasses,
            ]"
            :tabindex="showHoverTrigger && trigger === 'focus' ? 0 : undefined"
          >
            <span
              v-if="deferHoverTarget"
              ref="measureRef"
              :class="[styles.measure, styles.deferredMeasure, typographyClasses]"
              aria-hidden="true"
            >
              {{ resolvedTooltipText }}
            </span>
            <span
              v-else
              ref="measureRef"
              :class="[
                measureClasses,
                !showHoverTrigger && typographyClasses,
              ]"
            >
              <slot />
            </span>
            <span v-if="deferHoverTarget" :class="measureClasses">
              <slot />
            </span>
          </span>
        </span>
      </template>

      <template #content>
        <EgFlotationMenu
          :class="COPYABLE_OVERFLOW_MENU_CLASS"
          height-mode="adaptive"
          :max-height="COPYABLE_OVERFLOW_TOOLTIP_MAX_HEIGHT"
          width-mode="adaptive"
          :max-width="COPYABLE_OVERFLOW_TOOLTIP_MAX_WIDTH"
          :show-add="false"
          list-scroll
        >
          <EgFlotationMenuItem
            box-type="text"
            label-wrap
            host-tag="div"
            :show-tag="false"
            @click="showTooltipCopy ? onTooltipCopy($event) : undefined"
          >
            <span :class="cryptoComboStyles.menuRowContent">
              <span :class="cryptoComboStyles.menuRowMain">
                <EgTag
                  v-if="menuAlias"
                  family="system"
                  system-type="solid-brand"
                  size="sm"
                >
                  {{ menuAlias }}
                </EgTag>
                <span :class="cryptoComboStyles.menuAddressLine">
                  <span :class="menuTextClasses">{{ resolvedTooltipText }}</span>
                  <span
                    v-if="showTooltipCopy"
                    :class="[
                      cryptoComboStyles.menuCopyButton,
                      tooltipCopied && cryptoComboStyles.menuCopyButtonCopied,
                    ]"
                    @click.stop
                  >
                    <CopyActionIconButton
                      :label="copyLabel"
                      :icon="tooltipCopied ? 'eds-enable-fill' : 'eds-copy'"
                      :boundary-selector="resolvedBoundarySelector"
                      @click="onTooltipCopy"
                    />
                  </span>
                </span>
              </span>

              <span
                v-if="hasMenuMetaRow"
                :class="cryptoComboStyles.menuRowTags"
              >
                <span
                  v-if="hasMenuSecondaryText"
                  :class="cryptoComboStyles.menuRowSecondary"
                >
                  {{ menuSecondaryText }}
                </span>
                <CryptoAddressTags
                  v-if="showMenuExpandedTags && menuTags"
                  :tags="menuTags"
                  :default-show-more="false"
                  tooltip-mode
                />
              </span>
            </span>
          </EgFlotationMenuItem>
        </EgFlotationMenu>
      </template>
    </EgFlotation>

    <span
      v-else-if="showTooltipCopy"
      :class="[styles.wrap, wrapClass]"
    >
      <span :class="styles.targetShell">
        <span ref="measureRef" :class="[measureClasses, typographyClasses]">
          <slot />
        </span>
      </span>
    </span>

    <EgTooltip
      v-else
      :content="resolvedTooltipText"
      :disabled="tooltipDisabled"
      :trigger="trigger"
      panel-kind="flotation"
      placement="bottom"
      align="start"
      width-mode="adaptive"
      :max-width="maxWidth"
      height-mode="adaptive"
      :scrollable="false"
      close-on-scroll
      :boundary-selector="resolvedBoundarySelector"
      :token-scope-class="tokenScopeClass"
    >
      <span
        :class="[
          styles.wrap,
          wrapClass,
          showFlatHoverTrigger && 'eds-hover-tooltip-trigger',
          showFlatHoverTrigger && hoverTriggerClass,
        ]"
      >
        <span
          :class="[
            styles.targetShell,
            showFlatHoverTrigger && 'eds-hover-tooltip-trigger__target',
            showFlatHoverTrigger && tooltipTargetModifier,
            showFlatHoverTrigger && targetShellMotionClass,
            showFlatHoverTrigger && typographyClasses,
          ]"
          :tabindex="showFlatHoverTrigger && trigger === 'focus' ? 0 : undefined"
        >
          <span
            ref="measureRef"
            :class="[
              measureClasses,
              !showFlatHoverTrigger && typographyClasses,
            ]"
          >
            <slot />
          </span>
        </span>
      </span>
    </EgTooltip>
  </span>
</template>
