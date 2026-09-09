<script setup lang="ts">
import { computed, reactive } from 'vue';
import {
  EgBusinessDialog,
  EgDialog,
  EgIcon,
  EgSymbolDialog,
  EgTooltipPanel,
  resolveDialogPanelWidthPx,
  type DialogType,
  type IconName,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  applyDialogTypeLayout,
  buildDialogCustomizeControls,
  buildDialogCustomizeDefaults,
  buildDialogSymbolStyle,
  dialogComposeFlotationToolbarControls,
  dialogEventRows,
  dialogImportCode,
  dialogPopupWindowControls,
  dialogPropRows,
  dialogSlotRows,
  dialogStandardFlotationToolbarControls,
  resolveDialogSceneComponentTag,
  resolveDialogSceneImportCode,
  type DialogCustomizeType,
} from './dialogDocCustomize';

const props = defineProps<{
  variant: DialogCustomizeType;
  title: string;
}>();

const customize = reactive(buildDialogCustomizeDefaults(props.variant));

applyDialogTypeLayout(customize, props.variant);

const panelWidthPx = computed(() =>
  resolveDialogPanelWidthPx(customize.type as DialogType),
);

const dialogSymbolStyle = computed(() =>
  customize.type === 'symbol'
    ? buildDialogSymbolStyle(String(customize.symbolBackground))
    : undefined,
);

const customizeControls = computed(() => buildDialogCustomizeControls(props.variant));
const customizeDefaults = computed(() => buildDialogCustomizeDefaults(props.variant));

const docComponentTag = computed(() => resolveDialogSceneComponentTag(props.variant));
const docImportCode = computed(() => resolveDialogSceneImportCode(props.variant));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :title="title"
      doc-tier="molecule"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="customizeControls"
      :customize-defaults="customizeDefaults"
      :customize-sequential="true"
      :customize-row-columns="4"
      :prop-rows="dialogPropRows"
      :event-rows="dialogEventRows"
      :slot-rows="dialogSlotRows"
      :props-section-id="`dialog-${variant}-props`"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="organismStyles.previewOrganismDialogBoxHost"
        >
          <EgTooltipPanel
            panel-kind="popup"
            panel-radius="radius-lg"
            width-mode="fixed"
            :width="panelWidthPx"
            height-mode="adaptive"
            :scrollable="false"
            panel-flush
          >
            <EgSymbolDialog
              v-if="variant === 'symbol'"
              :title="String(customize.title)"
              :show-secondary-text="customize.showSecondaryText !== false"
              :secondary-text="String(customize.secondaryText)"
              :confirm-label="String(customize.confirmLabel)"
              :cancel-label="String(customize.cancelLabel)"
              :action-count="Number(customize.actionCount) === 2 ? 2 : 1"
              :style="dialogSymbolStyle"
            >
              <template #symbol>
                <EgIcon :name="String(customize.symbolIcon) as IconName" size="lg" />
              </template>
            </EgSymbolDialog>
            <EgBusinessDialog
              v-else-if="variant === 'compose'"
              :title="String(customize.title)"
              :show-secondary-text="customize.showSecondaryText !== false"
              :secondary-text="String(customize.secondaryText)"
              :confirm-label="String(customize.confirmLabel)"
              :cancel-label="String(customize.cancelLabel)"
              :show-clear="Boolean(customize.showClear)"
              :clear-label="String(customize.clearLabel)"
              :toolbar-tone="customize.toolbarTone as 'brand' | 'decor'"
              :toolbar-variant="customize.toolbarVariant as 'solid' | 'outline' | 'text'"
              :toolbar-divider-pinned="Boolean(customize.toolbarDividerPinned)"
            >
              <template #default>
                <div style="white-space: pre-line">{{ customize.composeText }}</div>
              </template>
            </EgBusinessDialog>
            <EgDialog
              v-else
              :type="variant"
              :title="String(customize.title)"
              :show-secondary-text="customize.showSecondaryText !== false"
              :secondary-text="String(customize.secondaryText)"
              :confirm-label="String(customize.confirmLabel)"
              :cancel-label="String(customize.cancelLabel)"
              :show-clear="Boolean(customize.showClear)"
              :clear-label="String(customize.clearLabel)"
              :toolbar-tone="customize.toolbarTone as 'brand' | 'decor'"
              :toolbar-variant="customize.toolbarVariant as 'solid' | 'outline' | 'text'"
              :toolbar-divider-pinned="Boolean(customize.toolbarDividerPinned)"
            />
          </EgTooltipPanel>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-if="variant === 'symbol'"
            v-model="customize"
            title="EgComboPopupButton"
            nested
            embedded
            sequential
            :row-columns="4"
            :controls="dialogPopupWindowControls"
          />
          <CustomizePanel
            v-else-if="variant === 'compose'"
            v-model="customize"
            title="EgComboFloatButton"
            nested
            embedded
            sequential
            :row-columns="4"
            :controls="dialogComposeFlotationToolbarControls"
          />
          <CustomizePanel
            v-else
            v-model="customize"
            title="EgComboFloatButton"
            nested
            embedded
            sequential
            :row-columns="4"
            :controls="dialogStandardFlotationToolbarControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
