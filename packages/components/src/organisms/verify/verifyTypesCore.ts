import type { IconName } from '../../atoms/icons';

/** Verify 场景类型 — 每种方式 Popup Box 固定宽高（不可改）。 */
export type VerifyType =
  | 'single-email'
  | 'single-google'
  | 'single-trade-password'
  | 'single-login-password'
  | 'single-passkey'
  | 'dual-2fa'
  | 'locked';

export type VerifyTypePreset = {
  title: string;
  secondaryText: string;
  switchLabel: string;
  symbolIcon: IconName;
  showCodeInput: boolean;
  showPasswordInput: boolean;
  showCountdown: boolean;
  showSwitch: boolean;
  /** Popup Box 固定宽（px，不含箭头）。 */
  panelWidth: number;
  /** Popup Box 固定高（px）。 */
  panelHeight: number;
};

export const VERIFY_TYPE_PRESETS: Record<VerifyType, VerifyTypePreset> = {
  'single-email': {
    title: '邮箱验证',
    secondaryText: '包含验证信息的电子邮件已发送至你注册邮箱“t******t@gmail.com”',
    switchLabel: '切换Google验证',
    symbolIcon: 'eds-email-fill',
    showCodeInput: true,
    showPasswordInput: false,
    showCountdown: true,
    showSwitch: true,
    panelWidth: 328,
    panelHeight: 436,
  },
  'single-google': {
    title: 'Google验证',
    secondaryText: '请输入 Google Authenticator 中的 6 位验证码',
    switchLabel: '切换邮箱验证',
    symbolIcon: 'eds-google-authenticator-colorful',
    showCodeInput: true,
    showPasswordInput: false,
    showCountdown: true,
    showSwitch: true,
    panelWidth: 328,
    panelHeight: 412,
  },
  'single-trade-password': {
    title: '交易密码',
    secondaryText: '请定期更改你的交易密码',
    switchLabel: '切换Google验证',
    symbolIcon: 'eds-key-fill',
    showCodeInput: false,
    showPasswordInput: true,
    showCountdown: false,
    showSwitch: false,
    panelWidth: 328,
    panelHeight: 416,
  },
  'single-login-password': {
    title: '登录密码',
    secondaryText: '请定期更改你的登录密码',
    switchLabel: '切换Google验证',
    symbolIcon: 'eds-interface-lock-fill',
    showCodeInput: false,
    showPasswordInput: true,
    showCountdown: false,
    showSwitch: false,
    panelWidth: 328,
    panelHeight: 416,
  },
  'single-passkey': {
    title: 'PassKey 验证',
    secondaryText: '请使用已注册的 PassKey 完成验证',
    switchLabel: '切换Google验证',
    symbolIcon: 'eds-passkey-fill',
    showCodeInput: true,
    showPasswordInput: false,
    showCountdown: true,
    showSwitch: true,
    panelWidth: 328,
    panelHeight: 406,
  },
  'dual-2fa': {
    title: '双重验证',
    secondaryText: '请依次完成邮箱与 Google 验证码',
    switchLabel: '切换验证方式',
    symbolIcon: 'eds-user-security',
    showCodeInput: true,
    showPasswordInput: false,
    showCountdown: true,
    showSwitch: true,
    panelWidth: 358,
    panelHeight: 459,
  },
  locked: {
    title: '账户已锁定',
    secondaryText: '验证失败次数过多，请稍后再试或联系客服',
    switchLabel: '切换Google验证',
    symbolIcon: 'eds-interface-lock-fill',
    showCodeInput: false,
    showPasswordInput: false,
    showCountdown: false,
    showSwitch: false,
    panelWidth: 328,
    panelHeight: 416,
  },
};

export function getVerifyTypePreset(type: VerifyType): VerifyTypePreset {
  return VERIFY_TYPE_PRESETS[type];
}

export function resolveVerifyPanelWidthPx(type: VerifyType = 'single-email'): number {
  return VERIFY_TYPE_PRESETS[type].panelWidth;
}

export function resolveVerifyPanelHeightPx(type: VerifyType = 'single-email'): number {
  return VERIFY_TYPE_PRESETS[type].panelHeight;
}
