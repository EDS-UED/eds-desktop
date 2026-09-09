<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { EgIcon, type IconName } from '../../atoms/icons';
import { EgButton } from '../../molecules/button';
import { EgComboPopupButton, type ComboActionPopupTone } from '../../molecules/combo';
import { EgInput } from '../../molecules/input';
import { EgFormSubmission } from '../../molecules/feedback';
import { EgLinkButton } from '../../molecules/link';
import { EgVerifyInput } from '../../molecules/verify-input';
import { EgVerifyRingDots, EgDoneTick } from '@eds/desktop-animations';
import { getVerifyTypePreset, type VerifyType } from './verifyTypesCore';
import styles from './Verify.module.css';

export type VerifyState = 'idle' | 'verifying' | 'success' | 'error';

const props = withDefaults(
  defineProps<{
    type?: VerifyType;
    state?: VerifyState;
    title?: string;
    secondaryText?: string;
    codeLength?: number;
    countdownSeconds?: number | null;
    pasteLabel?: string;
    switchLabel?: string;
    retryLabel?: string;
    forgotPasswordLabel?: string;
    /** 交易/登录密码校验失败文案（error 时替换「忘记密码」行）。 */
    passwordErrorText?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    placeholder?: string;
    actionTone?: ComboActionPopupTone;
    switchDisabled?: boolean;
    symbolIcon?: IconName;
  }>(),
  {
    type: 'single-email',
    state: 'idle',
    title: undefined,
    secondaryText: undefined,
    codeLength: 6,
    countdownSeconds: 60,
    pasteLabel: '粘贴',
    switchLabel: undefined,
    retryLabel: '重试',
    forgotPasswordLabel: '忘记密码?',
    passwordErrorText: '密码有误，请重试',
    confirmLabel: '确定',
    cancelLabel: '取消',
    placeholder: '请输入',
    actionTone: 'decor',
    switchDisabled: false,
    symbolIcon: undefined,
  },
);

const modelValue = defineModel<string>('modelValue', { default: '' });

const emit = defineEmits<{
  complete: [code: string];
  paste: [];
  switch: [];
  retry: [];
  recover: [];
  cancel: [];
  forgot: [];
}>();

const verifyInputRef = ref<InstanceType<typeof EgVerifyInput> | null>(null);
const passwordInputRef = ref<InstanceType<typeof EgInput> | null>(null);
const symbolWrapRef = ref<HTMLElement | null>(null);

const VERIFY_HOST_CLASS = 'eds-verify';
let popupContentHost: HTMLElement | null = null;

function findPopupContentHost(from: HTMLElement | null): HTMLElement | null {
  let element = from?.parentElement ?? null;

  while (element) {
    if (element.classList.contains('eds-popup-box-content')) {
      return element;
    }
    element = element.parentElement;
  }

  return null;
}

function syncPopupContentHostAttrs() {
  if (!popupContentHost) {
    return;
  }

  popupContentHost.dataset.verifyState = props.state;
  popupContentHost.dataset.verifyType = props.type;
  popupContentHost.setAttribute('role', 'dialog');
  popupContentHost.setAttribute('aria-modal', 'true');
}

function bindPopupContentHost() {
  popupContentHost = findPopupContentHost(symbolWrapRef.value);
  if (!popupContentHost) {
    return false;
  }

  popupContentHost.classList.add(VERIFY_HOST_CLASS);
  syncPopupContentHostAttrs();
  return true;
}

function unbindPopupContentHost() {
  if (!popupContentHost) {
    return;
  }

  popupContentHost.classList.remove(VERIFY_HOST_CLASS);
  delete popupContentHost.dataset.verifyState;
  delete popupContentHost.dataset.verifyType;
  popupContentHost.removeAttribute('role');
  popupContentHost.removeAttribute('aria-modal');
  popupContentHost = null;
}

const typePreset = computed(() => getVerifyTypePreset(props.type));

const resolvedTitle = computed(() => props.title ?? typePreset.value.title);
const resolvedSecondaryText = computed(
  () => props.secondaryText ?? typePreset.value.secondaryText,
);
const resolvedSwitchLabel = computed(
  () => props.switchLabel ?? typePreset.value.switchLabel,
);
const showCodeInput = computed(() => typePreset.value.showCodeInput);
const showPasswordInput = computed(() => typePreset.value.showPasswordInput);
const showSwitch = computed(() => typePreset.value.showSwitch);
const showStatusArea = computed(() => showCodeInput.value && typePreset.value.showCountdown);

const resolvedIcon = computed<IconName>(() => {
  if (props.symbolIcon) {
    return props.symbolIcon;
  }
  return typePreset.value.symbolIcon;
});

const isThemedSuccess = computed(
  () => props.state === 'verifying' || props.state === 'success',
);

const verifyInputState = computed((): 'idle' | 'verifying' | 'error' => {
  if (props.state === 'error') {
    return 'error';
  }
  if (props.state === 'verifying' || props.state === 'success') {
    return 'verifying';
  }
  return 'idle';
});

const verifyInputReadonly = computed(() => isThemedSuccess.value);

const verifyInputAutofocus = computed(() => props.state === 'idle');

const passwordReadonly = computed(() => isThemedSuccess.value);
const passwordConfirmDisabled = computed(
  () => isThemedSuccess.value || modelValue.value.trim().length === 0,
);
const passwordAutofocus = computed(
  () => props.state === 'idle' || props.state === 'error',
);

const showPasswordError = computed(
  () => showPasswordInput.value && props.state === 'error',
);

const showForgotPassword = computed(
  () => showPasswordInput.value && props.state !== 'error',
);

const countdownInitial = computed(() => {
  if (props.countdownSeconds == null || props.countdownSeconds < 0) {
    return null;
  }
  return props.countdownSeconds;
});

const remainingSeconds = ref<number | null>(null);
let countdownTimer: ReturnType<typeof setInterval> | undefined;

function clearCountdownTimer() {
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer);
    countdownTimer = undefined;
  }
}

function resetCountdown() {
  clearCountdownTimer();
  if (!typePreset.value.showCountdown) {
    remainingSeconds.value = null;
    return;
  }
  const initial = countdownInitial.value;
  if (
    initial == null
    || props.state === 'error'
    || props.state === 'verifying'
    || props.state === 'success'
  ) {
    remainingSeconds.value = null;
    return;
  }
  remainingSeconds.value = initial;
  if (initial <= 0) {
    return;
  }
  countdownTimer = setInterval(() => {
    if (remainingSeconds.value == null || remainingSeconds.value <= 0) {
      clearCountdownTimer();
      return;
    }
    remainingSeconds.value -= 1;
    if (remainingSeconds.value <= 0) {
      clearCountdownTimer();
    }
  }, 1000);
}

const showCountdown = computed(
  () =>
    typePreset.value.showCountdown
    && remainingSeconds.value != null
    && remainingSeconds.value > 0
    && props.state !== 'error'
    && props.state !== 'verifying'
    && props.state !== 'success',
);

const showCountdownExpiredRetry = computed(
  () =>
    typePreset.value.showCountdown
    && remainingSeconds.value === 0
    && countdownInitial.value != null
    && props.state === 'idle',
);

const showErrorRetry = computed(
  () => props.state === 'error' && showCodeInput.value,
);

const showBottomRetry = computed(() => showErrorRetry.value);

const showSwitchRow = computed(() => showSwitch.value);

watch(
  [countdownInitial, () => props.state],
  () => {
    resetCountdown();
  },
  { immediate: true },
);

watch(
  () => [props.state, props.type] as const,
  () => {
    syncPopupContentHostAttrs();
  },
);

onMounted(async () => {
  await nextTick();
  if (!bindPopupContentHost()) {
    await nextTick();
    bindPopupContentHost();
  }
  if (showCodeInput.value && verifyInputAutofocus.value) {
    await nextTick();
    verifyInputRef.value?.focus();
  }
  if (showPasswordInput.value && passwordAutofocus.value) {
    await nextTick();
    passwordInputRef.value?.focus();
  }
});

onUnmounted(() => {
  clearCountdownTimer();
  unbindPopupContentHost();
});

function sanitizeCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, props.codeLength);
}

function onVerifyInputUpdate(value: string) {
  const sanitized = sanitizeCode(value);
  const hadError = props.state === 'error';

  if (sanitized === modelValue.value) {
    return;
  }

  modelValue.value = sanitized;

  if (hadError && sanitized.length > 0) {
    emit('recover');
  }
}

function onRetryClick() {
  emit('retry');
  if (props.state === 'error') {
    modelValue.value = '';
    if (showCodeInput.value) {
      verifyInputRef.value?.focus();
    } else if (showPasswordInput.value) {
      passwordInputRef.value?.focus();
    }
    return;
  }
  resetCountdown();
}

function onPasswordUpdate(value: string) {
  const hadError = props.state === 'error';

  if (value === modelValue.value) {
    return;
  }

  modelValue.value = value;

  if (hadError && value.length > 0) {
    emit('recover');
  }
}

function onPasswordConfirm() {
  if (passwordConfirmDisabled.value) {
    return;
  }
  emit('complete', modelValue.value);
}

function onPasswordKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') {
    return;
  }
  event.preventDefault();
  onPasswordConfirm();
}

function onPasswordCancel() {
  if (isThemedSuccess.value) {
    return;
  }
  emit('cancel');
}

function onForgotClick() {
  if (isThemedSuccess.value) {
    return;
  }
  emit('forgot');
}

function onSwitchClick() {
  if (isThemedSuccess.value) {
    return;
  }
  emit('switch');
}

function onVerifyComplete(code: string) {
  emit('complete', code);
}

watch(
  () => props.codeLength,
  () => {
    if (!showCodeInput.value) {
      return;
    }
    modelValue.value = sanitizeCode(modelValue.value);
  },
);

watch(
  () => [showCodeInput.value, verifyInputAutofocus.value] as const,
  async ([showInput, autofocus]) => {
    if (!showInput || !autofocus) {
      return;
    }
    await nextTick();
    verifyInputRef.value?.focus();
  },
  { flush: 'post' },
);

watch(
  () => [showPasswordInput.value, passwordAutofocus.value] as const,
  async ([showInput, autofocus]) => {
    if (!showInput || !autofocus) {
      return;
    }
    await nextTick();
    passwordInputRef.value?.focus();
  },
  { flush: 'post' },
);
</script>

<template>
  <div ref="symbolWrapRef" :class="styles.symbolWrap">
    <div :class="styles.symbolRing">
      <EgVerifyRingDots
        :class="[
          styles.symbolRingDots,
          state === 'verifying' && styles.symbolRingDotsActive,
        ]"
        :active="state === 'verifying'"
      />
      <div :class="styles.symbolInner">
        <EgDoneTick v-if="state === 'success'" />
        <EgIcon v-else :name="resolvedIcon" fit />
      </div>
    </div>
  </div>

  <p :class="styles.title">{{ resolvedTitle }}</p>
  <p :class="styles.secondary">{{ resolvedSecondaryText }}</p>

  <template v-if="showStatusArea">
    <p v-if="showCountdown" :class="styles.statusLine">{{ remainingSeconds }}s</p>
    <div v-else-if="showCountdownExpiredRetry" :class="styles.statusRetryHost">
      <EgLinkButton tone="theme" size="sm" href="#" @click.prevent.stop="onRetryClick">
        {{ retryLabel }}
      </EgLinkButton>
    </div>
    <p v-else :class="styles.statusLine" aria-hidden="true">&nbsp;</p>
  </template>

  <EgVerifyInput
    v-if="showCodeInput"
    ref="verifyInputRef"
    :class="styles.codeInputHost"
    :model-value="modelValue"
    width-mode="full"
    :code-length="codeLength"
    :state="verifyInputState"
    :readonly="verifyInputReadonly"
    :paste-label="pasteLabel"
    :autofocus="verifyInputAutofocus"
    @update:model-value="onVerifyInputUpdate"
    @complete="onVerifyComplete"
    @paste="emit('paste')"
  />

  <div
    v-if="showPasswordInput"
    :class="styles.passwordBody"
    @keydown="onPasswordKeydown"
  >
    <EgInput
      ref="passwordInputRef"
      v-model="modelValue"
      :class="styles.passwordInput"
      width-mode="full"
      size="md"
      secure
      :placeholder="placeholder"
      :readonly="passwordReadonly"
      @update:model-value="onPasswordUpdate"
    />
    <div v-if="showForgotPassword" :class="styles.forgotRow">
      <EgLinkButton tone="brand" size="sm" href="#" @click.prevent.stop="onForgotClick">
        {{ forgotPasswordLabel }}
      </EgLinkButton>
    </div>
    <div v-else-if="showPasswordError" :class="styles.passwordErrorRow">
      <EgFormSubmission type="danger" :text="passwordErrorText" :show-link="false" />
    </div>
  </div>

  <div v-if="showPasswordInput" :class="styles.passwordActions">
    <EgComboPopupButton
      :tone="actionTone"
      :count="2"
      :confirm-label="confirmLabel"
      :cancel-label="cancelLabel"
      :confirm-disabled="passwordConfirmDisabled"
      @confirm="onPasswordConfirm"
      @cancel="onPasswordCancel"
    />
  </div>

  <div v-if="showBottomRetry || showSwitchRow" :class="styles.bottomRow">
    <EgLinkButton
      v-if="showBottomRetry"
      tone="theme"
      size="sm"
      href="#"
      :class="styles.bottomRetry"
      @click.prevent.stop="onRetryClick"
    >
      {{ retryLabel }}
    </EgLinkButton>
    <EgButton
      v-if="showSwitchRow"
      tone="subtle"
      variant="text"
      size="xs"
      icon-position="trailing"
      :class="styles.switchButton"
      :disabled="switchDisabled"
      @click.stop="onSwitchClick"
    >
      <template #icon>
        <EgIcon name="eds-arrow-right-mini-ios" fit size="md" />
      </template>
      {{ resolvedSwitchLabel }}
    </EgButton>
  </div>
</template>
