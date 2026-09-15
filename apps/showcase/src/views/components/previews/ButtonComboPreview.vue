<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  EgComboFloatButton,
  EgComboPageButton,
  EgComboPopupButton,
  EgComboButton,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  comboEventRows,
  comboPropRows,
  comboSlotRows,
} from './comboPreviewData';
import {
  buildComboActionUsageSnippet,
  comboActionCustomizeControls,
  comboActionCustomizeDefaults,
  resolveComboActionComponentTag,
  resolveComboActionImportCode,
  resolveComboActionTitle,
  type ComboActionKindValue,
} from './buttonDocCustomize';

const customize = reactive({
  ...comboActionCustomizeDefaults,
  kind: comboActionCustomizeDefaults.kind,
  tone: comboActionCustomizeDefaults.tone as 'brand' | 'decor' | 'danger',
  variant: comboActionCustomizeDefaults.variant as 'solid' | 'outline' | 'text',
  count: comboActionCustomizeDefaults.count as 1 | 2,
  direction: comboActionCustomizeDefaults.direction as 'left' | 'right',
});

const comboKind = computed(() => String(customize.kind) as ComboActionKindValue);

const comboComponentTag = computed(() => resolveComboActionComponentTag(comboKind.value));
const comboImportCode = computed(() => resolveComboActionImportCode(comboKind.value));
const comboTitle = computed(() => resolveComboActionTitle(comboKind.value));
const comboUsageSnippet = computed(() => buildComboActionUsageSnippet(customize));

const previewHostClass = computed(() => {
  switch (comboKind.value) {
    case 'popup-window':
      return docStyles.comboActionPopupHost;
    case 'flotation':
      return docStyles.comboActionFlotationHost;
    case 'page':
      return docStyles.comboActionPageHost;
    default:
      return docStyles.comboActionSkidHost;
  }
});

const comboToneBrandDecor = computed(() =>
  customize.tone === 'danger' ? 'brand' : (customize.tone as 'brand' | 'decor'),
);

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const designReferenceLabel = showcaseText('Design reference', '设计参考');
const designReferenceSuffix = showcaseText(
  '（Combo/Action-Skid, Popup Window, Flotation, Page).',
  '（Combo/Action-Skid、Popup Window、Flotation、Page）。',
);

const resolvedDesignReferenceLabel = computed(() => {
  void locale.value;
  return display(designReferenceLabel);
});

const resolvedDesignReferenceSuffix = computed(() => {
  void locale.value;
  return display(designReferenceSuffix);
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="button-combo"
      :title="comboTitle"
      :show-doc-title="false"
      :component-tag="comboComponentTag"
      :import-code="comboImportCode"
      :customize-controls="comboActionCustomizeControls"
      :customize-defaults="comboActionCustomizeDefaults"
      :customize-sequential="true"
      :customize-row-columns="4"
      :usage-snippet-override="comboUsageSnippet"
      :prop-rows="comboPropRows"
      :event-rows="comboEventRows"
      :slot-rows="comboSlotRows"
      props-section-id="button-combo-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="previewHostClass">
          <EgComboButton
            v-if="comboKind === 'skid'"
            :tone="customize.tone as 'brand' | 'decor' | 'danger'"
            :variant="customize.variant as 'solid' | 'outline' | 'text'"
            :divider="Boolean(customize.divider)"
            :confirm-label="String(customize.confirmLabel)"
          />
          <EgComboPopupButton
            v-else-if="comboKind === 'popup-window'"
            :tone="comboToneBrandDecor"
            :variant="customize.variant as 'solid' | 'outline' | 'text'"
            :count="customize.count"
            :confirm-label="String(customize.confirmLabel)"
            :cancel-label="String(customize.cancelLabel)"
          />
          <EgComboFloatButton
            v-else-if="comboKind === 'flotation'"
            :tone="comboToneBrandDecor"
            :variant="customize.variant as 'solid' | 'outline' | 'text'"
            :divider="Boolean(customize.divider)"
            :clear="Boolean(customize.clear)"
            :confirm-label="String(customize.confirmLabel)"
            :cancel-label="String(customize.cancelLabel)"
          />
          <EgComboPageButton
            v-else
            :tone="comboToneBrandDecor"
            :variant="customize.variant as 'solid' | 'outline' | 'text'"
            :divider="Boolean(customize.divider)"
            :direction="customize.direction"
            :confirm-label="String(customize.confirmLabel)"
            :cancel-label="String(customize.cancelLabel)"
          />
        </div>
      </template>

      <p :class="docStyles.comboFeedbackNote">
        {{ resolvedDesignReferenceLabel }}
        <a
          href="https://www.figma.com/design/OkYrDmatUWtgw9n1uVHt6v/EverGreen-Design-System--Desktop-?node-id=185-3456"
          target="_blank"
          rel="noopener noreferrer"
        >Figma 185:3456</a>
        {{ resolvedDesignReferenceSuffix }}
      </p>
    </ComponentDocLayout>
  </div>
</template>
