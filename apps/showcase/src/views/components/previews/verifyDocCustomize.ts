import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import type { VerifyType } from '@eds/desktop-components';
import { getVerifyTypePreset, VERIFY_TYPE_PRESETS } from '@eds/desktop-components';
import { propLabelSelectOptions } from '@/data/showcasePropLabels';

export const verifyFigmaNode = '0:115';

export const showcaseVerifyTypeLabels = {
  'single-email': '单-邮箱验证',
  'single-google': '单-Google验证',
  'single-trade-password': '单-交易密码',
  'single-login-password': '单-登录密码',
  'single-passkey': '单-PassKey',
  'dual-2fa': '双-2FA',
  locked: '锁定',
} as const;

export const showcaseVerifyStateLabels = {
  idle: '默认',
  verifying: '校验中',
  success: '校验成功',
  error: '校验失败',
} as const;

export const showcaseVerifyActionToneLabels = {
  brand: 'Brand',
  decor: 'Decor',
} as const;

const VERIFY_TYPES = Object.keys(VERIFY_TYPE_PRESETS) as VerifyType[];

const isPasswordVerifyType = (type: unknown) =>
  type === 'single-trade-password' || type === 'single-login-password';

export const verifyCustomizeDefaults = {
  type: 'single-email' as VerifyType,
  state: 'idle' as 'idle' | 'verifying' | 'success' | 'error',
  title: VERIFY_TYPE_PRESETS['single-email'].title,
  secondaryText: VERIFY_TYPE_PRESETS['single-email'].secondaryText,
  countdownSeconds: '60',
  switchLabel: VERIFY_TYPE_PRESETS['single-email'].switchLabel,
  switchDisabled: false,
  demoCode: '',
  confirmLabel: '确定',
  cancelLabel: '取消',
  actionTone: 'decor',
  passwordErrorText: '密码有误，请重试',
};

export function applyVerifyTypePresetToState(
  state: Record<string, unknown>,
  type: VerifyType,
): void {
  const preset = getVerifyTypePreset(type);
  state.type = type;
  state.title = preset.title;
  state.secondaryText = preset.secondaryText;
  state.switchLabel = preset.switchLabel;
  if (type === 'locked') {
    state.switchDisabled = true;
  }
}

export function applyVerifyTypePresetToPopupState(
  state: Record<string, unknown>,
  type: VerifyType,
): void {
  applyVerifyTypePresetToState(state, type);
  state.verifyType = type;
}

export const popupVerifyCustomizeDefaults = {
  verifyType: verifyCustomizeDefaults.type,
};

export const popupVerifyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'verifyType',
    label: showcaseText('Calculation', '验证方式'),
    options: propLabelSelectOptions(VERIFY_TYPES, showcaseVerifyTypeLabels),
    visibleWhen: (state) => state.uses === 'verify',
  },
];

export const verifyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseText('Calculation', '验证方式'),
    options: propLabelSelectOptions(VERIFY_TYPES, showcaseVerifyTypeLabels),
  },
  {
    kind: 'select',
    key: 'state',
    label: showcaseText('Status', '状态'),
    options: propLabelSelectOptions(
      ['idle', 'verifying', 'success', 'error'] as const,
      showcaseVerifyStateLabels,
    ),
  },
  { kind: 'text', key: 'title', label: showcaseText('Title', '标题') },
  { kind: 'text', key: 'secondaryText', label: showcaseText('Secondary copy', '副文案') },
  {
    kind: 'text',
    key: 'countdownSeconds',
    label: showcaseText('Countdown (seconds)', '倒计时（秒）'),
    visibleWhen: (state) =>
      state.state !== 'error'
      && state.type !== 'locked'
      && state.type !== 'single-trade-password'
      && state.type !== 'single-login-password',
  },
  {
    kind: 'text',
    key: 'switchLabel',
    label: showcaseText('Toggle copy', '切换文案'),
    visibleWhen: (state) =>
      state.type !== 'locked'
      && state.type !== 'single-trade-password'
      && state.type !== 'single-login-password',
  },
  {
    kind: 'boolean',
    key: 'switchDisabled',
    label: showcaseText('Toggle not available', '切换不可用'),
    visibleWhen: (state) =>
      state.state === 'error'
      && state.type !== 'locked'
      && state.type !== 'single-trade-password'
      && state.type !== 'single-login-password',
  },
  {
    kind: 'text',
    key: 'confirmLabel',
    label: showcaseText('Confirm copy', '确认文案'),
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
  {
    kind: 'text',
    key: 'cancelLabel',
    label: showcaseText('Cancel copy.', '取消文案'),
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
  {
    kind: 'text',
    key: 'passwordErrorText',
    label: showcaseText('Wrong password copy', '密码错误文案'),
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
  {
    kind: 'select',
    key: 'actionTone',
    label: showcaseText('Button Tone', '按钮 Tone'),
    options: propLabelSelectOptions(
      ['brand', 'decor'] as const,
      showcaseVerifyActionToneLabels,
    ),
    visibleWhen: (state) => isPasswordVerifyType(state.type),
  },
];

export const verifyPropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'single-email' | 'single-google' | … | 'locked'",
    defaultValue: "'single-email'",
    description:
      showcaseText('[doc] Verification。Popup Box Fixed type （ 328×436、2FA 358×459），canin Showcase 。', '验证场景。Popup Box 固定宽高随 type 变化（如邮箱 328×436、2FA 358×459），不可在 Showcase 改。'),
  },
  {
    name: 'state',
    type: "'idle' | 'verifying' | 'success' | 'error'",
    defaultValue: "'idle'",
    description:
      showcaseText('[doc] ValidationStatus。 36 /（only verifying ）；success only；OTP error + ； error Default、Row EgFormSubmission danger； emit recover。', '校验状态。外圈 36 点静止/追光（仅 verifying 动）；success 仅内圈勾号；OTP error 红底 + 左右晃动；密码 error 输入框保持默认态、忘记密码行换 EgFormSubmission danger；重新输入 emit recover。'),
  },
  {
    name: 'title',
    type: 'string',
    defaultValue: '—',
    description: showcaseText('Title; use type preset when omitted.', '标题；省略时使用 type 预设。'),
  },
  {
    name: 'secondaryText',
    type: 'string',
    defaultValue: '—',
    description: showcaseText('Caption; use type preset when omitted.', '说明文案；省略时使用 type 预设。'),
  },
  {
    name: 'modelValue (v-model)',
    type: 'string',
    defaultValue: "''",
    description: showcaseText('Captcha string; OTP full codeLength bit or password point determines emit complete. Confirm button disabled when password is empty.', '验证码字符串；OTP 满 codeLength 位或密码点确定 emit complete。密码为空时确认按钮禁用。'),
  },
  {
    name: 'forgotPasswordLabel',
    type: 'string',
    defaultValue: "'忘记密码?'",
    description: showcaseText('Transaction/login password scene "Forgot password" link copy; hidden when error.', '交易/登录密码场景「忘记密码」链接文案；error 时隐藏。'),
  },
  {
    name: 'passwordErrorText',
    type: 'string',
    defaultValue: "'密码有误，请重试'",
    description: showcaseText('EgFormSubmission (type = danger) copy when transaction/login password verification fails; reenter to resume forgotten password line.', '交易/登录密码校验失败时 EgFormSubmission（type=danger）文案；重新输入后恢复忘记密码行。'),
  },
  {
    name: 'confirmLabel',
    type: 'string',
    defaultValue: "'确定'",
    description: showcaseText('Transaction/login password scene confirmation button copy.', '交易/登录密码场景确认按钮文案。'),
  },
  {
    name: 'cancelLabel',
    type: 'string',
    defaultValue: "'取消'",
    description: showcaseText('Transaction/login password scenario cancel button copy.', '交易/登录密码场景取消按钮文案。'),
  },
  {
    name: 'actionTone',
    type: "'brand' | 'decor'",
    defaultValue: "'decor'",
    description: showcaseText('Transaction/login password scene EgComboPopupButton button Tone (confirm solid, cancel text with tone).', '交易/登录密码场景 EgComboPopupButton 按钮 Tone（确认 solid、取消 text 同 tone）。'),
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: "'请输入'",
    description: showcaseText('Transaction/login password input box placeholder copy.', '交易/登录密码输入框占位文案。'),
  },
  {
    name: 'codeLength',
    type: 'number',
    defaultValue: '6',
    description: showcaseText('The number of digits in the verification code.', '验证码位数。'),
  },
  {
    name: 'countdownSeconds',
    type: 'number | null',
    defaultValue: '60',
    description: showcaseText('Countdown seconds (default 60); after zeroing, retryLabel is displayed at the countdown position; when error, retryLabel is at the bottom.', '倒计时秒数（默认 60）；归零后在倒计时位置显示 retryLabel；error 时 retryLabel 在底部。'),
  },
  {
    name: 'switchDisabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Bottom toggle not available (still shown, don\'t hide).', '底部切换不可用（仍展示，勿隐藏）。'),
  },
];

export const verifyEventRows: DocPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '—', description: showcaseText('Captcha/password value change.', '验证码 / 密码值变化。') },
  { name: 'complete', type: '(code: string) => void', defaultValue: '—', description: showcaseText('Fires when OTP is full or password confirmation.', 'OTP 输满或密码确认时触发。') },
  { name: 'recover', type: '() => void', defaultValue: '—', description: showcaseText('fires when re-entered after error.', 'error 后重新输入时触发。') },
  { name: 'retry', type: '() => void', defaultValue: '—', description: showcaseText('At the end of the countdown or after the error, click Retry.', '倒计时结束或 error 后点击重试。') },
  { name: 'cancel', type: '() => void', defaultValue: '—', description: showcaseText('Password scenario canceled.', '密码场景取消。') },
  { name: 'forgot', type: '() => void', defaultValue: '—', description: showcaseText('Click Forgot password.', '点击忘记密码。') },
  { name: 'switch', type: '() => void', defaultValue: '—', description: showcaseText('Toggle authentication at the bottom.', '底部切换验证方式。') },
  { name: 'paste', type: '() => void', defaultValue: '—', description: showcaseText('OTP paste operation.', 'OTP 粘贴操作。') },
];

export const verifySlotRows: DocPropRow[] = [
  {
    name: showcaseText('(No public slots)', '(无公开插槽)'),
    type: '—',
    defaultValue: '—',
    description: showcaseText('EgVerify has no exposed slots; sub-structures are driven by type presets and props (EgVerifyInput, EgVerifyRingDots, etc.).', 'EgVerify 无公开插槽；子结构由 type 预设与 props 驱动（EgVerifyInput、EgVerifyRingDots 等）。'),
  },
];

export const VERIFY_SCENE_COMPONENT_TAG: Partial<Record<VerifyType, string>> = {
  'single-email': 'EgEmailVerify',
  'single-google': 'EgGoogleVerify',
  'single-login-password': 'EgLoginPasswordVerify',
  'single-trade-password': 'EgTransactionPasswordVerify',
  'single-passkey': 'EgPasskeyVerify',
  locked: 'EgLockedVerify',
};

/** 与 catalog `children[].id` / 路由 slug 对齐（§17 `{family}-scene-{scene}`）。 */
export const VERIFY_SCENE_ANCHOR_ID: Partial<Record<VerifyType, string>> = {
  'single-email': 'verify-scene-email',
  'single-google': 'verify-scene-google',
  'single-login-password': 'verify-scene-login-password',
  'single-trade-password': 'verify-scene-transaction-password',
  'single-passkey': 'verify-scene-passkey',
  locked: 'verify-scene-locked',
};

export function resolveVerifySceneAnchorId(type: VerifyType): string {
  return VERIFY_SCENE_ANCHOR_ID[type] ?? 'verify';
}

export function resolveVerifySceneComponentTag(type: VerifyType): string {
  return VERIFY_SCENE_COMPONENT_TAG[type] ?? 'EgVerify';
}

export function resolveVerifySceneImportCode(type: VerifyType): string {
  const tag = resolveVerifySceneComponentTag(type);
  return `import { ${tag}, EgPopup, useVerifySubmit } from '@eds/desktop-components';`;
}
