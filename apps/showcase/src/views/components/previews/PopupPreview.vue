<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  EgButton,
  EgDetail,
  EgDetailPopup,
  EgDialog,
  EgDialogPopup,
  EgPopup,
  EgVerify,
  EgVerifyPopup,
  useVerifySubmit,
  type DialogType,
  type VerifyType,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import PopupCustomSlotChromePreview from './PopupCustomSlotChromePreview.vue';
import chromePreviewStyles from './PopupCustomSlotChromePreview.module.css';
import {
  popupCustomChromeSlotRows,
  popupCustomContentCustomizeControls,
  popupCustomSystemBarCustomizeControls,
  popupCustomToolbarCustomizeControls,
  resolvePopupCustomBoxSize,
  resolvePopupCustomSystemBarProps,
  resolvePopupCustomToolbarProps,
  resolvePopupCustomContentInsetPreset,
} from './popupDocCustomize';
import {
  ORGANISM_IMPORT,
  buildPopupCustomizeControls,
  buildPopupCustomizeDefaults,
  popupPropRows,
  type PopupCustomizeUses,
  type PopupSceneUses,
} from './organismTemplateDocData';

type PopupUses = PopupCustomizeUses;

const props = withDefaults(
  defineProps<{
    lockedUses?: PopupSceneUses;
    pageTitle?: string;
  }>(),
  {},
);

const { display } = useShowcaseDisplayText();
const reopenPopupLabel = showcaseText('Reopen Popup', '重新打开 Popup');

const resolvedUses = computed((): PopupUses => props.lockedUses ?? 'custom');

const customizeDefaults = computed(() => buildPopupCustomizeDefaults(resolvedUses.value));

const customize = reactive({
  ...buildPopupCustomizeDefaults(props.lockedUses),
});

const docCustomizeControls = computed(() => buildPopupCustomizeControls(resolvedUses.value));

const docAnchorId = computed(() => {
  if (resolvedUses.value === 'detail') return 'popup-scene-detail';
  if (resolvedUses.value === 'dialog') return 'popup-scene-dialog';
  if (resolvedUses.value === 'verify') return 'popup-scene-verify';
  return 'popup';
});

const docTitle = computed(() => props.pageTitle ?? 'Popup');

const docComponentTag = computed(() => {
  if (resolvedUses.value === 'detail') return 'EgDetailPopup';
  if (resolvedUses.value === 'dialog') return 'EgDialogPopup';
  if (resolvedUses.value === 'verify') return 'EgVerifyPopup';
  return 'EgPopup';
});

const docImportCode = computed(() => {
  if (resolvedUses.value === 'detail') {
    return `import { EgDetailPopup, EgDetail } from '@eds/desktop-components';`;
  }
  if (resolvedUses.value === 'dialog') {
    return `import { EgDialogPopup, EgDialog } from '@eds/desktop-components';`;
  }
  if (resolvedUses.value === 'verify') {
    return `import { EgVerifyPopup, EgVerify, useVerifySubmit } from '@eds/desktop-components';`;
  }
  return ORGANISM_IMPORT;
});
const popupCustomSystemBarProps = computed(() => resolvePopupCustomSystemBarProps(customize));
const popupCustomToolbarProps = computed(() => resolvePopupCustomToolbarProps(customize));
const popupCustomContentInsetPreset = computed(() => resolvePopupCustomContentInsetPreset(customize));

const popupDocSlotRows = computed(() =>
  customize.uses === 'custom' ? popupCustomChromeSlotRows : undefined,
);

const popupOpen = ref(true);

const { verify, onComplete, onRecover, reset: resetVerifySubmit } = useVerifySubmit({
  submit: () => true,
  requestClose: () => {
    closePopup();
  },
});

const verifyType = computed(() => customize.verifyType as VerifyType);

watch(resolvedUses, (uses) => {
  customize.uses = uses;
  if (uses === 'custom') {
    customize.alertVerticalAlign = 'center';
    return;
  }
  customize.alertVerticalAlign = 'offset-top';
  if (uses === 'verify') {
    resetVerifySubmit();
  }
});

watch(popupOpen, (open) => {
  if (open) {
    resetVerifySubmit();
  }
});

watch(verifyType, () => {
  resetVerifySubmit();
});

const customBoxWidth = computed(() => {
  if (customize.uses !== 'custom') {
    return 328;
  }
  return resolvePopupCustomBoxSize(customize).width;
});

const customBoxHeight = computed(() => {
  if (customize.uses !== 'custom') {
    return 436;
  }
  return resolvePopupCustomBoxSize(customize).height;
});

function closePopup() {
  popupOpen.value = false;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :anchor-id="docAnchorId"
      :title="docTitle"
      doc-tier="template"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="docCustomizeControls"
      :customize-defaults="customizeDefaults"
      :prop-rows="popupPropRows"
      :slot-rows="popupDocSlotRows"
      props-section-id="popup-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="organismStyles.previewOrganismPopupHost"
          @click.self="!popupOpen && (popupOpen = true)"
        >
          <EgDetailPopup
            v-if="customize.uses === 'detail'"
            v-model:open="popupOpen"
            :alert-vertical-align="customize.alertVerticalAlign as 'center' | 'offset-top'"
          >
            <EgDetail @close="closePopup" />
          </EgDetailPopup>
          <EgDialogPopup
            v-else-if="customize.uses === 'dialog'"
            v-model:open="popupOpen"
            :alert-vertical-align="customize.alertVerticalAlign as 'center' | 'offset-top'"
            :dialog-type="customize.dialogType as DialogType"
          >
            <EgDialog
              :type="customize.dialogType as DialogType"
              @cancel="closePopup"
              @confirm="closePopup"
            >
              <template v-if="customize.dialogType === 'compose'" #default>
                <div style="white-space: pre-line">
                  Compose content

                  Scroll to preview frosted toolbar blur.
                </div>
              </template>
            </EgDialog>
          </EgDialogPopup>
          <EgVerifyPopup
            v-else-if="customize.uses === 'verify'"
            v-model:open="popupOpen"
            :alert-vertical-align="customize.alertVerticalAlign as 'center' | 'offset-top'"
            :verify-type="verifyType"
          >
            <EgVerify
              v-model="verify.code"
              :type="verifyType"
              :state="verify.state"
              @complete="onComplete"
              @recover="onRecover"
            />
          </EgVerifyPopup>
          <EgPopup
            v-else
            v-model:open="popupOpen"
            :uses="customize.uses as PopupUses"
            :alert-vertical-align="customize.alertVerticalAlign as 'center' | 'offset-top'"
            :box-width="customBoxWidth"
            :box-height="customBoxHeight"
          >
            <PopupCustomSlotChromePreview
              :class="chromePreviewStyles.root"
              :system-bar-props="popupCustomSystemBarProps"
              :toolbar-props="popupCustomToolbarProps"
              :content-inset-preset="popupCustomContentInsetPreset"
            />
          </EgPopup>
        </div>
      </template>

      <template #customize-extra>
        <div v-if="customize.uses === 'custom'" :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            title="System Bar"
            nested
            embedded
            :controls="popupCustomSystemBarCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            title="Toolbar"
            nested
            embedded
            :controls="popupCustomToolbarCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            title="Content"
            nested
            embedded
            :controls="popupCustomContentCustomizeControls"
          />
        </div>
        <div v-if="!popupOpen" :class="docStyles.previewReopenHint">
          <EgButton size="md" tone="brand" @click="popupOpen = true">{{ display(reopenPopupLabel) }}</EgButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
