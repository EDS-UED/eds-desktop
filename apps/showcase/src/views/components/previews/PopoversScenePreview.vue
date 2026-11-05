<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  EgButton,
  EgConfirmPopover,
  EgGasFeePopover,
  EgGuidancePopover,
  EgRemarkPopover,
  type ButtonTone,
  type PopoverAlign,
  type PopoverPlacement,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import previewPageStyles from './InputPreview.module.css';
import {
  applyPopoverScenarioPreset,
  buildConfirmPopoverProps,
  buildGasFeePopoverProps,
  buildGuidancePopoverProps,
  buildPopoverSceneUsageSnippet,
  buildRemarkPopoverProps,
  popoverPropRows,
  gasFeeSceneBasicCustomizeControls,
  gasFeeSceneBasicCustomizeTitle,
  gasFeeSceneNetworkCustomizeControls,
  gasFeeSceneNetworkCustomizeTitle,
  popoverSceneCustomizeControls,
  popoverSceneCustomizeDefaults,
  popoverSceneImportCode,
  type PopoverGasFeeEvmDisplayMode,
  type PopoverGasFeeNetwork,
  type PopoverSceneScenario,
} from './popoversDocCustomize';
import {
  resolveShowcaseGasFeePanelProps,
  showcaseGasFeeUi,
} from './gasFeeShowcaseMock';

const SCENE_COMPONENT_TAG: Record<PopoverSceneScenario, string> = {
  guidance: 'EgGuidancePopover',
  remark: 'EgRemarkPopover',
  'gas-fee': 'EgGasFeePopover',
  confirm: 'EgConfirmPopover',
};

const props = withDefaults(
  defineProps<{
    initialScenario?: PopoverSceneScenario;
    pageTitle?: string;
  }>(),
  {},
);

const customize = reactive({
  ...popoverSceneCustomizeDefaults,
  scenario: (props.initialScenario ?? popoverSceneCustomizeDefaults.scenario) as PopoverSceneScenario,
  placement: popoverSceneCustomizeDefaults.placement as PopoverPlacement,
  align: popoverSceneCustomizeDefaults.align as PopoverAlign,
  trigger: popoverSceneCustomizeDefaults.trigger as 'click' | 'hover',
  widthMode: popoverSceneCustomizeDefaults.widthMode as 'fixed' | 'adaptive' | 'preset',
  heightMode: popoverSceneCustomizeDefaults.heightMode as 'fixed' | 'adaptive',
  gasFeeNetwork: popoverSceneCustomizeDefaults.gasFeeNetwork as PopoverGasFeeNetwork,
  gasFeeEvmDisplayMode:
    popoverSceneCustomizeDefaults.gasFeeEvmDisplayMode as PopoverGasFeeEvmDisplayMode,
  gasFeeMulti: popoverSceneCustomizeDefaults.gasFeeMulti,
  confirmTone: popoverSceneCustomizeDefaults.confirmTone as ButtonTone,
});

const remarkValue = ref('');

const activeScenario = computed(
  () => (props.initialScenario ?? customize.scenario) as PopoverSceneScenario,
);

const previewComponentTag = computed(() => SCENE_COMPONENT_TAG[activeScenario.value]);

const isGasFeeScenePage = computed(() => props.initialScenario === 'gas-fee');

const sceneCustomizeControls = computed(() => {
  if (isGasFeeScenePage.value) return [];
  return props.initialScenario
    ? popoverSceneCustomizeControls.filter((control) => control.key !== 'scenario')
    : popoverSceneCustomizeControls;
});

const pageTitle = computed(() => props.pageTitle ?? 'Scenes');
const anchorId = computed(() => `popovers-scene-${activeScenario.value}`);
const propsSectionId = computed(() => `${anchorId.value}-props`);

watch(
  () => customize.scenario,
  (scenario) => {
    applyPopoverScenarioPreset(customize, scenario);
  },
  { immediate: true },
);

const guidancePreviewProps = computed(() => buildGuidancePopoverProps(customize));
const remarkPreviewProps = computed(() => buildRemarkPopoverProps(customize));
const gasFeePreviewProps = computed(() => ({
  ...buildGasFeePopoverProps(customize),
  ...resolveShowcaseGasFeePanelProps(
    customize.gasFeeNetwork,
    Boolean(customize.gasFeeMulti),
    customize.gasFeeEvmDisplayMode,
    {
      evmBalanceInsufficient: Boolean(customize.gasFeeEvmBalanceInsufficient),
      tronAddressInactive: Boolean(customize.gasFeeTronAddressInactive),
      tronTeamBalanceInsufficient: Boolean(customize.gasFeeTronTeamBalanceInsufficient),
    },
  ),
}));
const confirmPreviewProps = computed(() => buildConfirmPopoverProps(customize));
const usageSnippet = computed(() => buildPopoverSceneUsageSnippet(customize));

const gasFeeTitle = computed(() =>
  String(customize.topToolTitle ?? showcaseGasFeeUi('Gas Fee')),
);

</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :anchor-id="anchorId"
      :title="pageTitle"
      :show-doc-title="false"
      :component-tag="previewComponentTag"
      :import-code="popoverSceneImportCode"
      :customize-controls="sceneCustomizeControls"
      :customize-defaults="popoverSceneCustomizeDefaults"
      :customize-sequential="true"
      :usage-snippet-override="usageSnippet"
      :prop-rows="popoverPropRows"
      :props-section-id="propsSectionId"
    >
      <template v-if="isGasFeeScenePage" #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            :title="gasFeeSceneBasicCustomizeTitle"
            nested
            embedded
            sequential
            :controls="gasFeeSceneBasicCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            :title="gasFeeSceneNetworkCustomizeTitle"
            nested
            embedded
            sequential
            :controls="gasFeeSceneNetworkCustomizeControls"
          />
        </div>
      </template>

      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.subPreviewWidth,
            docStyles.previewEffectPanelHost,
            docStyles.previewInputHost,
          ]"
        >
          <EgGuidancePopover
            v-if="activeScenario === 'guidance'"
            :key="`guidance-${customize.placement}-${customize.align}-${customize.topToolClosable}`"
            v-bind="guidancePreviewProps"
            teleport-to="body"
          >
            <template #trigger="{ onClick, active }">
              <EgButton variant="outline" :aria-expanded="active" @click="onClick">
                {{ customize.triggerLabel }}
              </EgButton>
            </template>
          </EgGuidancePopover>

          <EgRemarkPopover
            v-else-if="activeScenario === 'remark'"
            :key="`remark-${customize.placement}-${customize.align}-${customize.topToolClosable}`"
            v-model="remarkValue"
            :title="String(customize.topToolTitle ?? 'Remark')"
            :placeholder="String(customize.remarkPlaceholder ?? 'Please enter')"
            :feedback-text="String(customize.remarkFeedback ?? 'Optional, Max. 256 characters')"
            :confirm-label="String(customize.remarkConfirmLabel ?? 'Confirm')"
            :placement="customize.placement"
            :align="customize.align"
            v-bind="remarkPreviewProps"
            teleport-to="body"
          >
            <template #trigger="{ onClick }">
              <EgButton variant="outline" @click="onClick">
                {{ customize.triggerLabel }}
              </EgButton>
            </template>
          </EgRemarkPopover>

          <EgGasFeePopover
            v-else-if="activeScenario === 'gas-fee'"
            :key="`gas-fee-${customize.placement}-${customize.align}-${customize.gasFeeNetwork}-${customize.gasFeeEvmDisplayMode}-${customize.gasFeeMulti}-${customize.gasFeeEvmBalanceInsufficient}-${customize.gasFeeTronAddressInactive}-${customize.gasFeeTronTeamBalanceInsufficient}`"
            v-bind="gasFeePreviewProps"
            :title="gasFeeTitle"
            teleport-to="body"
          >
            <template #trigger="{ onClick, active }">
              <EgButton variant="outline" :aria-expanded="active" @click="onClick">
                {{ customize.triggerLabel }}
              </EgButton>
            </template>
          </EgGasFeePopover>

          <EgConfirmPopover
            v-else
            :key="`confirm-${customize.placement}-${customize.align}-${customize.topToolClosable}-${customize.confirmTone}`"
            v-bind="confirmPreviewProps"
            :confirm-tone="customize.confirmTone"
            teleport-to="body"
          >
            <template #trigger="{ onClick, active }">
              <EgButton variant="outline" :aria-expanded="active" @click="onClick">
                {{ customize.triggerLabel }}
              </EgButton>
            </template>
          </EgConfirmPopover>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
