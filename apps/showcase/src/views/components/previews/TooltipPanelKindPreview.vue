<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { EgTooltip, EgButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import tooltipStyles from './TooltipPreview.module.css';
import { getComponentRouteSlug } from '@/data/components/navigation';
import {
  anchoredTooltipPropRows,
  buildTooltipBodyCustomizeControls,
  buildTooltipPanelKindPageUsageSnippet,
  buildTooltipSectionCustomizeDefaults,
  findTooltipOverflowSceneSection,
  findTooltipPanelKindSection,
  isTooltipOverflowSceneSlug,
  tooltipImportCode,
  tooltipOverflowSceneCustomizeControls,
  tooltipPanelKindSections,
  tooltipPanelPropsForPreview,
  tooltipPropRows,
  tooltipSlotRows,
  resolveTooltipPageComponentTag,
  resolveTooltipPageImportCode,
  type TooltipPanelKindValue,
} from './tooltipDocCustomize';
import TooltipFlotationTextOverflowPreview from './TooltipFlotationTextOverflowPreview.vue';
import TooltipFlotationParagraphOverflowPreview from './TooltipFlotationParagraphOverflowPreview.vue';
import TooltipFlotationMultiAddressPreview from './TooltipFlotationMultiAddressPreview.vue';

const route = useRoute();

const pageSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const isOverflowScene = computed(() => isTooltipOverflowSceneSlug(pageSlug.value));

const isStandardContainerPage = computed(
  () => pageSlug.value === 'flotation-container-tooltip',
);

const isTooltipBodyPage = computed(
  () =>
    pageSlug.value === 'tooltip-flotation' || isStandardContainerPage.value,
);

const overflowScene = computed(() => findTooltipOverflowSceneSection(pageSlug.value));

const customize = reactive(buildTooltipSectionCustomizeDefaults('flotation'));

watch(
  pageSlug,
  (slug) => {
    if (isTooltipOverflowSceneSlug(slug)) {
      Object.assign(customize, buildTooltipSectionCustomizeDefaults('flotation'));
      return;
    }
    if (slug === 'flotation-container-tooltip') {
      Object.assign(customize, {
        ...buildTooltipSectionCustomizeDefaults('container'),
        panelKind: 'container',
      });
      return;
    }
    if (slug === 'tooltip-flotation') {
      const kind = String(customize.panelKind ?? 'flotation') as TooltipPanelKindValue;
      Object.assign(customize, {
        ...buildTooltipSectionCustomizeDefaults(kind),
        panelKind: kind,
      });
    }
  },
  { immediate: true },
);

const panelKind = computed(() => {
  if (isOverflowScene.value) {
    return 'flotation' as const;
  }
  return String(customize.panelKind ?? 'flotation') as TooltipPanelKindValue;
});

const section = computed(() => {
  if (overflowScene.value) {
    return {
      id: overflowScene.value.id,
      label: overflowScene.value.label,
      panelKind: 'flotation' as const,
    };
  }
  return (
    tooltipPanelKindSections.find((item) => item.panelKind === panelKind.value) ??
    tooltipPanelKindSections[0]
  );
});

const customizeControls = computed(() => {
  if (isOverflowScene.value) {
    return tooltipOverflowSceneCustomizeControls;
  }
  return buildTooltipBodyCustomizeControls(customize, {
    hidePanelKind: isStandardContainerPage.value,
  });
});

const usageSnippet = computed(() =>
  buildTooltipPanelKindPageUsageSnippet(panelKind.value, customize),
);

const panelProps = computed(() =>
  tooltipPanelPropsForPreview({ ...customize, panelKind: panelKind.value }),
);

const customizeDefaults = computed(() =>
  isOverflowScene.value
    ? buildTooltipSectionCustomizeDefaults('flotation')
    : buildTooltipSectionCustomizeDefaults(panelKind.value),
);

const isTextOverflowScenario = computed(
  () => pageSlug.value === 'tooltip-scene-text-overflow',
);

const isParagraphOverflowInfoScenario = computed(
  () => pageSlug.value === 'tooltip-scene-paragraph-overflow',
);

const isMultiAddressScenario = computed(
  () => pageSlug.value === 'tooltip-scene-multi-address',
);

const propsSectionId = computed(() => `${pageSlug.value}-props`);

const anchorId = computed(() => section.value?.id ?? pageSlug.value);

const pageTitle = computed(() => {
  if (overflowScene.value) {
    return overflowScene.value.label;
  }
  if (isTooltipBodyPage.value) {
    return 'Tooltip';
  }
  return section.value?.label ?? 'Tooltip';
});

const docComponentTag = computed(() => resolveTooltipPageComponentTag(pageSlug.value));
const docImportCode = computed(() => resolveTooltipPageImportCode(pageSlug.value));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-if="section"
      v-model:customize-state="customize"
      :anchor-id="anchorId"
      :title="pageTitle"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="customizeControls"
      :customize-defaults="customizeDefaults"
      :customize-sequential="isTooltipBodyPage"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tooltipPropRows"
      :slot-rows="tooltipSlotRows"
      :props-section-id="propsSectionId"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.subPreviewWidth,
            docStyles.previewEffectPanelHost,
            panelKind === 'molde' && tooltipStyles.moldeScene,
            isTextOverflowScenario && tooltipStyles.textOverflowScene,
            isParagraphOverflowInfoScenario && tooltipStyles.paragraphOverflowScene,
            isMultiAddressScenario && tooltipStyles.multiAddressScene,
          ]"
        >
          <TooltipFlotationTextOverflowPreview
            v-if="isTextOverflowScenario"
            :tooltip-trigger="String(customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus'"
          />
          <TooltipFlotationParagraphOverflowPreview v-else-if="isParagraphOverflowInfoScenario" />
          <TooltipFlotationMultiAddressPreview
            v-else-if="isMultiAddressScenario"
            :tooltip-trigger="String(customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus'"
          />
          <EgTooltip
            v-else
            :placement="customize.placement as 'top' | 'bottom' | 'left' | 'right'"
            :align="customize.align as 'start' | 'center' | 'end'"
            :trigger="customize.trigger as 'click' | 'hover'"
            :disabled="Boolean(customize.disabled)"
            v-bind="panelProps"
          >
            <EgButton variant="outline">{{ customize.triggerLabel }}</EgButton>
            <template #content>
              <div :class="tooltipStyles.slotDemo">{{ section.label }}</div>
            </template>
          </EgTooltip>
        </div>
      </template>

      <section :class="shared.section">
        <h2 :class="shared.sectionTitle">EgTooltip</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="anchoredTooltipPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
