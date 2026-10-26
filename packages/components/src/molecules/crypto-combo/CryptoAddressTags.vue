<script setup lang="ts">
import { computed } from 'vue';
import { EgTag } from '../tag';
import tagStyles from '../tag/Tag.module.css';
import { EgTooltip } from '../tooltip';
import { EgFormSubmission, type FormSubmissionType } from '../feedback';
import type { CryptoAddressSideTags, CryptoAddressTagSlotConfig } from './cryptoAddressTypes';
import {
  flattenAddressTags,
  formatMoreTagLabel,
  splitTagsForDisplay,
} from './cryptoAddressTagUtils';
import styles from './CryptoAddressTags.module.css';

export type CryptoAddressSideFeedback = {
  type?: FormSubmissionType;
  text: string;
  showLink?: boolean;
};

const AML_FEEDBACK_TAG_TOOLTIP_STYLES = new Set(['aml-danger', 'aml-suspicious']);

const props = withDefaults(
  defineProps<{
    tags?: CryptoAddressSideTags;
    /** 行内是否展示溢出计数（+N） */
    defaultShowMore?: boolean;
    /** Tooltip 内展示全部 Tag（不含溢出计数占位） */
    tooltipMode?: boolean;
    /** 行内展示全部 Tag（不折叠 +N） */
    revealAll?: boolean;
    /** Detail 地址侧风险反馈：悬停 aml-danger / aml-suspicious Tag 时在 tooltip 内展示。 */
    addressSideFeedback?: CryptoAddressSideFeedback;
  }>(),
  {
    defaultShowMore: true,
    tooltipMode: false,
    revealAll: false,
  },
);

const allTags = computed(() =>
  flattenAddressTags(props.tags?.system, props.tags?.custom),
);

const inlineTags = computed(() =>
  splitTagsForDisplay(props.tags?.system, props.tags?.custom).inline,
);

const hiddenTags = computed(() =>
  splitTagsForDisplay(props.tags?.system, props.tags?.custom).hidden,
);

const displayTags = computed(() => {
  if (props.tooltipMode || props.revealAll) return allTags.value;
  return inlineTags.value;
});

const more = computed(() => ({
  show:
    !props.tooltipMode &&
    !props.revealAll &&
    props.defaultShowMore &&
    hiddenTags.value.length > 0,
  label: formatMoreTagLabel(hiddenTags.value.length),
}));

function isColorfulTag(tag: CryptoAddressTagSlotConfig): boolean {
  return tag.colorfulStyle != null || tag.family === 'colorful';
}

function isCustomTag(tag: CryptoAddressTagSlotConfig): boolean {
  return tag.family === 'custom';
}

function tagShowsAddressSideFeedbackTooltip(tag: CryptoAddressTagSlotConfig): boolean {
  if (!props.addressSideFeedback) return false;
  if (!isCustomTag(tag)) return false;
  const style = tag.customStyle ?? 'vermilion';
  return AML_FEEDBACK_TAG_TOOLTIP_STYLES.has(style);
}
</script>

<template>
  <span :class="styles.root">
    <template v-for="(tag, index) in displayTags" :key="`tag-${index}`">
      <span :class="tooltipMode ? styles.tooltipTag : styles.inlineTag">
        <EgTooltip
          v-if="tagShowsAddressSideFeedbackTooltip(tag)"
          trigger="hover"
          placement="bottom"
          align="start"
          boundary-selector=".eds-popup"
          close-on-scroll
          width-mode="adaptive"
          height-mode="adaptive"
          :scrollable="false"
          :max-width="480"
          :open-delay="120"
          :close-delay="80"
          token-scope-class="desktopTokens"
        >
          <EgTag
            v-if="isCustomTag(tag)"
            family="custom"
            :custom-style="tag.customStyle ?? 'vermilion'"
            :size="tag.size ?? 'sm'"
            :truncate="!tooltipMode"
          >
            {{ tag.label }}
          </EgTag>
          <template #content>
            <div :class="styles.addressSideFeedbackTooltip">
              <EgFormSubmission
                :type="addressSideFeedback?.type ?? 'danger'"
                :text="addressSideFeedback?.text ?? ''"
                :show-link="addressSideFeedback?.showLink ?? false"
              />
            </div>
          </template>
        </EgTooltip>
        <EgTag
          v-else-if="isCustomTag(tag)"
          family="custom"
          :custom-style="tag.customStyle ?? 'vermilion'"
          :size="tag.size ?? 'sm'"
          :truncate="!tooltipMode"
        >
          {{ tag.label }}
        </EgTag>
        <EgTag
          v-else-if="isColorfulTag(tag)"
          family="colorful"
          :colorful-style="tag.colorfulStyle ?? 'apricot'"
          :size="tag.size ?? 'sm'"
          :truncate="!tooltipMode"
        >
          {{ tag.label }}
        </EgTag>
        <EgTag
          v-else
          family="system"
          :system-type="tag.systemType ?? 'solid-red'"
          :size="tag.size ?? 'sm'"
          :truncate="!tooltipMode"
        >
          {{ tag.label }}
        </EgTag>
      </span>
    </template>
    <span v-if="more.show" :class="styles.moreTag">
      <span :class="tagStyles.smText">
        <span :class="tagStyles.smTextPaint" aria-hidden="true">{{ more.label }}</span>
        <span :class="tagStyles.smTextSizer">{{ more.label }}</span>
      </span>
    </span>
  </span>
</template>
