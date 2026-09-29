<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
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
import TooltipFilterPickerScenePreview from './TooltipFilterPickerScenePreview.vue';
import {
  buildTooltipFilterPickerUsageSnippet,
  findTooltipFilterPickerSceneSection,
  isTooltipFilterPickerSceneSlug,
  tooltipFilterPickerCustomizeDefaults,
  tooltipFilterPickerPropRows,
  tooltipFilterPickerSceneCustomizeControls,
  type TooltipFilterPickerScenarioValue,
} from './tooltipFilterPickerDocCustomize';

const route = useRoute();

const pageSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const isOverflowScene = computed(() => isTooltipOverflowSceneSlug(pageSlug.value));
const isFilterPickerScene = computed(() => isTooltipFilterPickerSceneSlug(pageSlug.value));

const isStandardContainerPage = computed(
  () => pageSlug.value === 'flotation-container-tooltip',
);

const isTooltipBodyPage = computed(
  () =>
    pageSlug.value === 'tooltip-flotation' || isStandardContainerPage.value,
);

const overflowScene = computed(() => findTooltipOverflowSceneSection(pageSlug.value));
const filterPickerScene = computed(() => findTooltipFilterPickerSceneSection(pageSlug.value));

const customize = reactive<Record<string, unknown>>({
  ...buildTooltipSectionCustomizeDefaults('flotation'),
  ...tooltipFilterPickerCustomizeDefaults,
  scenario: 'crypto-picker' satisfies TooltipFilterPickerScenarioValue,
});

const filterPickerValue = ref('');

watch(
  pageSlug,
  (slug) => {
    if (isTooltipOverflowSceneSlug(slug)) {
      Object.assign(customize, buildTooltipSectionCustomizeDefaults('flotation'));
      filterPickerValue.value = '';
      return;
    }
    if (isTooltipFilterPickerSceneSlug(slug)) {
      const section = findTooltipFilterPickerSceneSection(slug);
      Object.assign(customize, {
        ...tooltipFilterPickerCustomizeDefaults,
        scenario: section?.scenario ?? 'crypto-picker',
      });
      filterPickerValue.value = '';
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
  if (filterPickerScene.value) {
    return {
      id: filterPickerScene.value.id,
      label: filterPickerScene.value.label,
      panelKind: 'flotation' as const,
    };
  }
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
  if (isFilterPickerScene.value) {
    return tooltipFilterPickerSceneCustomizeControls;
  }
  if (isOverflowScene.value) {
    return tooltipOverflowSceneCustomizeControls;
  }
  return buildTooltipBodyCustomizeControls(customize, {
    hidePanelKind: isStandardContainerPage.value,
  });
});

const usageSnippet = computed(() => {
  if (filterPickerScene.value) {
    return buildTooltipFilterPickerUsageSnippet(filterPickerScene.value.scenario, customize);
  }
  return buildTooltipPanelKindPageUsageSnippet(panelKind.value, customize);
});

const panelProps = computed(() =>
  tooltipPanelPropsForPreview({ ...customize, panelKind: panelKind.value }),
);

const customizeDefaults = computed(() => {
  if (isFilterPickerScene.value) {
    return {
      ...tooltipFilterPickerCustomizeDefaults,
      scenario: filterPickerScene.value?.scenario ?? 'crypto-picker',
    };
  }
  if (isOverflowScene.value) {
    return buildTooltipSectionCustomizeDefaults('flotation');
  }
  return buildTooltipSectionCustomizeDefaults(panelKind.value);
});

const docPropRows = computed(() =>
  isFilterPickerScene.value ? tooltipFilterPickerPropRows : tooltipPropRows,
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

const activeFilterPickerScenario = computed(
  () => filterPickerScene.value?.scenario ?? 'crypto-picker',
);

const filterPickerTriggerWidth = computed(() => {
  if (String(customize.triggerWidthMode ?? 'trigger') !== 'fixed') {
    return undefined;
  }
  const width = Number(customize.triggerWidth);
  return Number.isFinite(width) && width > 0 ? width : undefined;
});

const propsSectionId = computed(() => `${pageSlug.value}-props`);

const anchorId = computed(() => section.value?.id ?? pageSlug.value);

const pageTitle = computed(() => {
  if (filterPickerScene.value || overflowScene.value) {
    return section.value?.label ?? 'Tooltip';
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
      :prop-rows="docPropRows"
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
            isFilterPickerScene && tooltipStyles.filterPickerScene,
            isFilterPickerScene
              && String(customize.triggerWidthMode ?? 'trigger') === 'adaptive'
              && tooltipStyles.filterPickerSceneFullWidth,
          ]"
        >
          <TooltipFilterPickerScenePreview
            v-if="isFilterPickerScene"
            v-model="filterPickerValue"
            :scenario="activeFilterPickerScenario"
            :placeholder="String(customize.placeholder ?? '')"
            :disabled="Boolean(customize.disabled)"
            :selection-mode="String(customize.selectionMode ?? 'single') as 'single' | 'multi'"
            :date-picker-type="String(customize.datePickerType ?? 'date') as 'date' | 'range'"
            :trigger-width-mode="String(customize.triggerWidthMode ?? 'trigger') as 'trigger' | 'adaptive' | 'fixed'"
            :trigger-width="filterPickerTriggerWidth"
            :trigger="String(customize.trigger ?? 'click') as 'click' | 'hover'"
            :show-type-tabs="Boolean(customize.showTypeTabs ?? true)"
            :cascade-placement="String(customize.cascadePlacement ?? 'auto') as 'auto' | 'right' | 'left'"
          />
          <TooltipFlotationTextOverflowPreview
            v-else-if="isTextOverflowScenario"
            :tooltip-trigger="String(customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus'"
          />
          <TooltipFlotationParagraphOverflowPreview
            v-else-if="isParagraphOverflowInfoScenario"
            :tooltip-trigger="String(customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus'"
          />
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

      <section v-if="!isFilterPickerScene" :class="shared.section">
        <h2 :class="shared.sectionTitle">EgTooltip</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="anchoredTooltipPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
