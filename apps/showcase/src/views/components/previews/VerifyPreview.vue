<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import {
  EgEmailVerify,
  EgGoogleVerify,
  EgLockedVerify,
  EgLoginPasswordVerify,
  EgPasskeyVerify,
  EgTooltipPanel,
  EgTransactionPasswordVerify,
  EgVerify,
  resolveVerifyPanelHeightPx,
  resolveVerifyPanelWidthPx,
  useVerifySubmit,
  type VerifyType,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  applyVerifyTypePresetToState,
  verifyCustomizeControls,
  verifyCustomizeDefaults,
  verifyEventRows,
  verifyPropRows,
  verifySlotRows,
  resolveVerifySceneComponentTag,
  resolveVerifySceneImportCode,
  resolveVerifySceneAnchorId,
} from './verifyDocCustomize';

const props = withDefaults(
  defineProps<{
    initialVerifyType?: VerifyType;
    pageTitle?: string;
    lockVerifyType?: boolean;
  }>(),
  {
    lockVerifyType: false,
  },
);

const customize = reactive({
  ...verifyCustomizeDefaults,
  ...(props.initialVerifyType ? { type: props.initialVerifyType } : {}),
});

const verifyType = computed(() => customize.type as VerifyType);

const panelWidthPx = computed(() => resolveVerifyPanelWidthPx(verifyType.value));
const panelHeightPx = computed(() => resolveVerifyPanelHeightPx(verifyType.value));

const panelMotionActive = ref(false);

const { verify, onComplete, onRecover, reset } = useVerifySubmit({
  submit: () => true,
  requestClose: () => {
    reset();
  },
});

let syncingCustomizeState = false;

const countdownSeconds = computed(() => {
  if (
    verifyType.value === 'locked'
    || verifyType.value === 'single-trade-password'
    || verifyType.value === 'single-login-password'
  ) {
    return null;
  }
  if (verify.state === 'error') {
    return null;
  }
  const parsed = Number.parseInt(String(customize.countdownSeconds), 10);
  return Number.isFinite(parsed) ? parsed : null;
});

watch(
  () => customize.type,
  (type) => {
    applyVerifyTypePresetToState(customize, type as VerifyType);
    reset();
    syncingCustomizeState = true;
    customize.state = 'idle';
    syncingCustomizeState = false;
  },
);

watch(
  () => customize.state,
  (state) => {
    if (syncingCustomizeState || verify.state === state) {
      return;
    }
    reset();
    verify.state = state;
    if (state === 'idle') {
      verify.code = '';
      verify.switchDisabled = false;
      return;
    }
    if (state === 'error') {
      verify.code = '';
      verify.switchDisabled = true;
    }
  },
);

watch(
  () => verify.state,
  (state) => {
    if (customize.state === state) {
      return;
    }
    syncingCustomizeState = true;
    customize.state = state;
    syncingCustomizeState = false;
    if (state === 'error' && customize.type !== 'locked') {
      customize.switchDisabled = true;
    }
  },
);

function handleRecover() {
  onRecover();
}

function syncPanelMotionEnter() {
  panelMotionActive.value = false;
  nextTick(() => {
    requestAnimationFrame(() => {
      panelMotionActive.value = true;
    });
  });
}

onMounted(() => {
  syncPanelMotionEnter();
  if (props.initialVerifyType) {
    applyVerifyTypePresetToState(customize, props.initialVerifyType);
  }
});

watch(verifyType, () => {
  syncPanelMotionEnter();
});

const verifyControls = computed(() =>
  props.lockVerifyType
    ? verifyCustomizeControls.filter((control) => control.key !== 'type')
    : verifyCustomizeControls,
);

const pageTitle = computed(() => props.pageTitle ?? 'Verify');

const docAnchorId = computed(() =>
  props.lockVerifyType
    ? resolveVerifySceneAnchorId(verifyType.value)
    : 'verify',
);

const docComponentTag = computed(() =>
  props.lockVerifyType
    ? resolveVerifySceneComponentTag(verifyType.value)
    : 'EgVerify',
);

const docImportCode = computed(() =>
  props.lockVerifyType
    ? resolveVerifySceneImportCode(verifyType.value)
    : 'import { EgVerify, EgPopup, useVerifySubmit } from \'@eds/desktop-components\';',
);

const VERIFY_SCENE_COMPONENT = {
  'single-email': EgEmailVerify,
  'single-google': EgGoogleVerify,
  'single-login-password': EgLoginPasswordVerify,
  'single-trade-password': EgTransactionPasswordVerify,
  'single-passkey': EgPasskeyVerify,
  locked: EgLockedVerify,
} as const;

const previewVerifyComponent = computed(() =>
  props.lockVerifyType
    ? VERIFY_SCENE_COMPONENT[verifyType.value as keyof typeof VERIFY_SCENE_COMPONENT] ?? EgVerify
    : EgVerify,
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :anchor-id="docAnchorId"
      :title="pageTitle"
      doc-tier="organism"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="verifyControls"
      :customize-defaults="verifyCustomizeDefaults"
      :prop-rows="verifyPropRows"
      :event-rows="verifyEventRows"
      :slot-rows="verifySlotRows"
      props-section-id="verify-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="organismStyles.previewOrganismVerifyBoxHost"
        >
          <EgTooltipPanel
            :class="[
              'glassMicroFloatHost',
              panelMotionActive && 'glassMicroFloatHostActive',
            ]"
            panel-kind="popup"
            panel-radius="radius-lg"
            :panel-layout-motion="true"
            width-mode="fixed"
            :width="panelWidthPx"
            height-mode="fixed"
            :height="panelHeightPx"
            :scrollable="false"
            panel-flush
          >
            <component
              :is="previewVerifyComponent"
              v-model="verify.code"
              :state="verify.state"
              :title="String(customize.title)"
              :secondary-text="String(customize.secondaryText)"
              :countdown-seconds="countdownSeconds"
              :switch-label="String(customize.switchLabel)"
              :switch-disabled="verify.switchDisabled"
              :confirm-label="String(customize.confirmLabel)"
              :cancel-label="String(customize.cancelLabel)"
              :password-error-text="String(customize.passwordErrorText)"
              :action-tone="customize.actionTone as 'brand' | 'decor'"
              v-bind="props.lockVerifyType ? {} : { type: verifyType }"
              @complete="onComplete"
              @recover="handleRecover"
            />
          </EgTooltipPanel>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
