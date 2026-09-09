<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import {
  EgComboInput,
  EgFlotationTrigger,
  EgFormSubmission,
  EgModuleMenuTrigger,
  type FlotationTriggerSize,
  type FlotationTriggerStyle,
  type FlotationTriggerWidthMode,
  type FormSubmissionType,
  type MessageType,
  type TagStatus,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationTriggerPageCustomizeControls,
  buildFlotationTriggerUsageSnippet,
  flotationTriggerCustomizeDefaults,
  flotationTriggerFormSubmissionCustomizeControls,
  flotationTriggerImportCode,
  flotationTriggerModuleMenuDefaults,
  flotationTriggerPropRows,
  flotationTriggerSlotRows,
  isFlotationTriggerModuleMenuKind,
  resolveFlotationTriggerSceneComponentTag,
  resolveFlotationTriggerSceneImportCode,
  usesFlotationTriggerComboShell,
  type FlotationTriggerKind,
} from './flotationDocCustomize';

const props = defineProps<{
  initialTriggerKind?: FlotationTriggerKind;
  pageTitle?: string;
}>();

const customize = createDocCustomizeState<typeof flotationTriggerCustomizeDefaults>(
  flotationTriggerCustomizeDefaults,
  props.initialTriggerKind ? { triggerKind: props.initialTriggerKind } : undefined,
);

watch(
  () => customize.triggerKind,
  (kind) => {
    if (kind !== 'module-menu') return;
    customize.label = String(flotationTriggerModuleMenuDefaults.label);
    customize.showReddot = Boolean(flotationTriggerModuleMenuDefaults.showReddot);
    customize.triggerStyle = 'text';
    customize.widthMode = 'trigger';
    customize.showFieldLabel = false;
    customize.feedback = false;
  },
);

const isModuleMenuKind = computed(() => isFlotationTriggerModuleMenuKind(customize));

const triggerPageControls = computed(() =>
  buildFlotationTriggerPageCustomizeControls(customize),
);

const pageTitle = computed(() => props.pageTitle ?? 'Trigger');

const docComponentTag = computed(() =>
  resolveFlotationTriggerSceneComponentTag(customize.triggerKind as FlotationTriggerKind),
);
const docImportCode = computed(() =>
  resolveFlotationTriggerSceneImportCode(customize.triggerKind as FlotationTriggerKind),
);

const usageSnippet = computed(() => buildFlotationTriggerUsageSnippet(customize));

const previewHostStyle = computed(() => ({
  width: '100%',
  maxWidth: isModuleMenuKind.value ? 'none' : 'var(--scale-50)',
}));

onMounted(() => {
  if (customize.triggerKind !== 'module-menu') return;
  customize.label = String(flotationTriggerModuleMenuDefaults.label);
  customize.showReddot = Boolean(flotationTriggerModuleMenuDefaults.showReddot);
  customize.triggerStyle = 'text';
  customize.widthMode = 'trigger';
  customize.showFieldLabel = false;
  customize.feedback = false;
});

const triggerFixedWidth = computed(() => {
  if (customize.widthMode !== 'fixed') return undefined;
  const parsed = Number.parseInt(String(customize.width ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
});

type FlotationTriggerBindings = InstanceType<typeof EgFlotationTrigger>['$props'];

const triggerProps = computed<FlotationTriggerBindings>(() => {
  if (isModuleMenuKind.value) {
    return {
      triggerStyle: 'text',
      widthMode: 'trigger',
      label: String(customize.label),
      showReddot: Boolean(customize.showReddot),
      disabled: Boolean(customize.disabled),
      expanded: Boolean(customize.expanded),
    };
  }

  return {
    triggerStyle: customize.triggerStyle as FlotationTriggerStyle,
    size: customize.size as FlotationTriggerSize,
    widthMode: customize.widthMode as FlotationTriggerWidthMode,
    width: triggerFixedWidth.value,
    label: String(customize.label),
    disabled: Boolean(customize.disabled),
    showSymbol: Boolean(customize.showSymbol),
    symbolIcon: String(customize.symbolIcon),
    symbolPosition: customize.symbolPosition === 'trailing' ? 'trailing' : 'leading',
    showTag: Boolean(customize.showTag),
    tagText: String(customize.tagText),
    tagStatus: customize.tagStatus as TagStatus,
    showMessage: Boolean(customize.showMessage),
    messageText: String(customize.messageText),
    messageType: customize.messageType as MessageType,
    expanded: Boolean(customize.expanded),
  };
});

const usesComboShell = computed(
  () => !isModuleMenuKind.value && usesFlotationTriggerComboShell(customize),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation-trigger"
      :title="pageTitle"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="triggerPageControls"
      :customize-sequential="true"
      :customize-row-columns="4"
      :customize-defaults="{ ...flotationTriggerCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationTriggerPropRows"
      :slot-rows="flotationTriggerSlotRows"
      props-section-id="flotation-trigger-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <div :style="previewHostStyle">
            <EgComboInput
              v-if="usesComboShell"
              :label="customize.showFieldLabel ? String(customize.fieldLabel) : ''"
              :feedback="Boolean(customize.feedback)"
            >
              <EgFlotationTrigger v-bind="triggerProps" />
              <template v-if="customize.feedback" #feedback>
                <EgFormSubmission
                  :type="customize.type as FormSubmissionType"
                  :text="String(customize.text)"
                  :link-label="String(customize.linkLabel)"
                  :show-link="Boolean(customize.showLink)"
                />
              </template>
            </EgComboInput>
            <EgModuleMenuTrigger v-else-if="isModuleMenuKind" v-bind="triggerProps" />
            <EgFlotationTrigger v-else v-bind="triggerProps" />
          </div>
        </div>
      </template>

      <template #customize-extra>
        <div v-if="customize.feedback && !isModuleMenuKind" :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            title="EgFormSubmission"
            nested
            embedded
            :controls="flotationTriggerFormSubmissionCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
