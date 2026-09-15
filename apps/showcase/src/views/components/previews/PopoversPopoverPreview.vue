<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  EgTooltip,
  EgButton,
  EgPopover,
  POPOVER_PANEL_MIN_H,
  POPOVER_PANEL_MIN_W,
  type PopoverAlign,
  type PopoverPlacement,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import previewPageStyles from './InputPreview.module.css';
import matrixStyles from './PopoversPreview.module.css';
import {
  POPOVER_ALIGNS,
  applyPopoverScenarioPreset,
  buildPopoverComponentUsageSnippet,
  buildPopoverProps,
  popoverAlignOptions,
  popoverComponentCustomizeControls,
  popoverComponentCustomizeDefaults,
  popoverComponentImportCode,
  popoverPlacementOptions,
  popoverPropRows,
  popoverSlotRows,
} from './popoversDocCustomize';
import { parseAnchoredContainerOptionalInt } from './anchoredContainerDocCustomize';

const { display } = useShowcaseDisplayText();
const allDirectionsTitle = showcaseText('All directions', '全部方向');
const popoverSlotContentAriaLabel = showcaseText('Popover slot content', 'Popover 插槽内容');

const customize = reactive({
  ...popoverComponentCustomizeDefaults,
  scenario: 'component' as const,
  placement: popoverComponentCustomizeDefaults.placement as PopoverPlacement,
  align: popoverComponentCustomizeDefaults.align as PopoverAlign,
  trigger: popoverComponentCustomizeDefaults.trigger as 'click' | 'hover',
  widthMode: popoverComponentCustomizeDefaults.widthMode as 'fixed' | 'adaptive' | 'preset',
  heightMode: popoverComponentCustomizeDefaults.heightMode as 'fixed' | 'adaptive',
});

applyPopoverScenarioPreset(customize, 'component');

const anchoredRef = ref<{ close: () => void } | null>(null);

const previewFloatingScopeClass = 'desktopTokens';

const popoverPreviewProps = computed(() => buildPopoverProps(customize));

const panelCrossAxisOffset = computed(() =>
  parseAnchoredContainerOptionalInt(customize.crossAxisOffset),
);

function onTopToolClose() {
  anchoredRef.value?.close();
}

const slotDemoUsesFill = computed(
  () =>
    (customize.widthMode === 'fixed' || customize.widthMode === 'preset') &&
    customize.heightMode === 'fixed',
);

const usageSnippet = computed(() => buildPopoverComponentUsageSnippet(customize));

type MatrixCell = {
  placement: PopoverPlacement;
  align: PopoverAlign;
};

const topRow: MatrixCell[] = POPOVER_ALIGNS.map((align) => ({
  placement: 'bottom',
  align,
}));

const bottomRow: MatrixCell[] = POPOVER_ALIGNS.map((align) => ({
  placement: 'top' as const,
  align,
}));

const leftColumn: MatrixCell[] = POPOVER_ALIGNS.map((align) => ({
  placement: 'right' as const,
  align,
}));

const rightColumn: MatrixCell[] = POPOVER_ALIGNS.map((align) => ({
  placement: 'left' as const,
  align,
}));

function matrixLabel(placement: PopoverPlacement, align: PopoverAlign): string {
  const placementLabel =
    popoverPlacementOptions.find((row) => row.value === placement)?.label ?? placement;
  const alignLabel = popoverAlignOptions.find((row) => row.value === align)?.label ?? align;
  return `${placementLabel} · ${alignLabel}`;
}
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="popovers-popover"
      title="Standard"
      :show-doc-title="false"
      component-tag="EgPopover"
      :import-code="popoverComponentImportCode"
      :customize-controls="popoverComponentCustomizeControls"
      :customize-defaults="popoverComponentCustomizeDefaults"
      :customize-sequential="true"
      :usage-snippet-override="usageSnippet"
      :prop-rows="popoverPropRows"
      :slot-rows="popoverSlotRows"
      props-section-id="popovers-popover-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.subPreviewWidth,
            docStyles.previewEffectPanelHost,
            docStyles.previewInputHost,
          ]"
        >
          <EgTooltip
            ref="anchoredRef"
            :placement="customize.placement"
            :align="customize.align"
            :cross-axis-offset="panelCrossAxisOffset"
            :trigger="customize.trigger"
            :disabled="Boolean(customize.disabled)"
            :wrap-tooltip="false"
            :token-scope-class="previewFloatingScopeClass"
          >
            <EgButton variant="outline">{{ customize.triggerLabel }}</EgButton>
            <template #content>
              <EgPopover
                :key="`popover-${customize.placement}-${customize.topToolClosable}-${customize.topTool}`"
                v-bind="popoverPreviewProps"
                @top-tool-close="onTopToolClose"
              >
                <div
                  :class="[
                    matrixStyles.slotDemo,
                    slotDemoUsesFill && matrixStyles.slotDemoFixed,
                  ]"
                >
                  <textarea
                    v-model="customize.slotContent"
                    :class="matrixStyles.slotEditor"
                    rows="2"
                    :aria-label="display(popoverSlotContentAriaLabel)"
                  />
                </div>
              </EgPopover>
            </template>
          </EgTooltip>
        </div>
      </template>
    </ComponentDocLayout>

    <section :class="matrixStyles.matrixSection">
      <h2 :class="matrixStyles.matrixTitle">{{ display(allDirectionsTitle) }}</h2>
      <div :class="matrixStyles.matrixFrame">
        <div :class="matrixStyles.topRow">
          <div
            v-for="cell in topRow"
            :key="`top-${cell.align}`"
            :class="matrixStyles.cell"
          >
            <EgPopover
              :placement="cell.placement"
              :align="cell.align"
              width-mode="fixed"
              :width="POPOVER_PANEL_MIN_W"
              height-mode="fixed"
              :height="POPOVER_PANEL_MIN_H"
            >
              <div :class="[matrixStyles.slotDemo, matrixStyles.slotDemoFixed]">Label</div>
            </EgPopover>
            <span :class="matrixStyles.cellLabel">{{ matrixLabel(cell.placement, cell.align) }}</span>
          </div>
        </div>

        <div :class="matrixStyles.middleRow">
          <div :class="matrixStyles.sideColumn">
            <div
              v-for="cell in leftColumn"
              :key="`left-${cell.align}`"
              :class="matrixStyles.cell"
            >
              <EgPopover
                :placement="cell.placement"
                :align="cell.align"
                width-mode="fixed"
                :width="POPOVER_PANEL_MIN_W"
                height-mode="fixed"
                :height="POPOVER_PANEL_MIN_H"
              >
                <div :class="[matrixStyles.slotDemo, matrixStyles.slotDemoFixed]">Label</div>
              </EgPopover>
              <span :class="matrixStyles.cellLabel">{{ matrixLabel(cell.placement, cell.align) }}</span>
            </div>
          </div>

          <div :class="matrixStyles.centerGap" aria-hidden="true" />

          <div :class="matrixStyles.sideColumn">
            <div
              v-for="cell in rightColumn"
              :key="`right-${cell.align}`"
              :class="matrixStyles.cell"
            >
              <EgPopover
                :placement="cell.placement"
                :align="cell.align"
                width-mode="fixed"
                :width="POPOVER_PANEL_MIN_W"
                height-mode="fixed"
                :height="POPOVER_PANEL_MIN_H"
              >
                <div :class="[matrixStyles.slotDemo, matrixStyles.slotDemoFixed]">Label</div>
              </EgPopover>
              <span :class="matrixStyles.cellLabel">{{ matrixLabel(cell.placement, cell.align) }}</span>
            </div>
          </div>
        </div>

        <div :class="matrixStyles.bottomRow">
          <div
            v-for="cell in bottomRow"
            :key="`bottom-${cell.align}`"
            :class="matrixStyles.cell"
          >
            <EgPopover
              :placement="cell.placement"
              :align="cell.align"
              width-mode="fixed"
              :width="POPOVER_PANEL_MIN_W"
              height-mode="fixed"
              :height="POPOVER_PANEL_MIN_H"
            >
              <div :class="[matrixStyles.slotDemo, matrixStyles.slotDemoFixed]">Label</div>
            </EgPopover>
            <span :class="matrixStyles.cellLabel">{{ matrixLabel(cell.placement, cell.align) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
