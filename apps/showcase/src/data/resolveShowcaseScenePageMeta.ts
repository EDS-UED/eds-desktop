import type { CatalogChildItem } from './types';

/** Showcase 文档路由 slug → 真实 Eg* 组件名（本体 + 场景化）。 */
const SHOWCASE_PAGE_COMPONENT_TAG: Record<string, string> = {
  icons: 'EgIcon',
  crypto: 'EgCrypto',
  avatar: 'EgAvatar',
  divider: 'EgDivider',
  'input-input': 'EgInput',
  'input-textarea': 'EgTextarea',
  'input-combo-input': 'EgComboInput',
  'input-verify-input': 'EgVerifyInput',
  'input-search': 'EgSearchInput',
  'input-combo-textarea': 'EgComboTextarea',
  'button-text': 'EgButton',
  'button-combo': 'EgComboButton',
  'button-icon': 'EgIconButton',
  'button-icon-pro': 'EgIconProButton',
  'button-link': 'EgLinkButton',
  'button-pagination': 'EgPaginationGroupButton',
  'tooltip-flotation': 'EgTooltip',
  'tooltip-subtle': 'EgTooltip',
  'tooltip-scene-text-overflow': 'EgFieldOvfTooltip',
  'tooltip-scene-paragraph-overflow': 'EgParagraphOvfTooltip',
  'tooltip-scene-multi-address': 'EgAddressOvfTooltip',
  'tooltip-scene-crypto-picker': 'EgCryptoTooltip',
  'tooltip-scene-member-picker': 'EgMemberTooltip',
  'tooltip-scene-date-picker': 'EgDatePickerTooltip',
  'tooltip-scene-status-picker': 'EgStatusTooltip',
  'popovers-popover': 'EgPopover',
  'popovers-scene-guidance': 'EgGuidancePopover',
  'popovers-scene-remark': 'EgRemarkPopover',
  'popovers-scene-gas-fee': 'EgGasFeePopover',
  'popovers-scene-confirm': 'EgConfirmPopover',
  flotation: 'EgFlotation',
  'flotation-trigger': 'EgFlotationTrigger',
  'flotation-trigger-scene-module-menu': 'EgModuleMenuTrigger',
  'flotation-container-tooltip': 'EgTooltip',
  'flotation-box': 'EgFlotationMenu',
  'flotation-box-scene-cascade-menu': 'EgCascadeMenu',
  'flotation-box-scene-address-dropdown': 'EgAddressDropdownMenu',
  'flotation-box-scene-address-hover': 'EgAddressHoverMenu',
  'tag-system': 'EgTag',
  'tag-scene-status': 'EgStatusTag',
  'tag-scene-colorful': 'EgColorfulTag',
  'tag-scene-palette': 'EgBusinessTag',
  'toggle-checkbox': 'EgCheckbox',
  'toggle-radio': 'EgRadio',
  'toggle-switch': 'EgSwitch',
  'toggle-decide': 'EgDecide',
  'tab-tabs': 'EgTabs',
  'tab-segmented': 'EgSegmented',
  'feedback-toast': 'EgToast',
  'feedback-message': 'EgMessage',
  'feedback-reddot': 'EgReddot',
  'feedback-end-feedback-card': 'EgEndFeedbackCard',
  'feedback-form-submission': 'EgFormSubmission',
  'feedback-streamer': 'EgStreamer',
  'dialog-standard': 'EgDialog',
  'dialog-scene-symbol': 'EgSymbolDialog',
  'dialog-scene-compose': 'EgBusinessDialog',
  progress: 'EgProgress',
  'nav-bar': 'EgNavBar',
  'nav-bar-scene-cregis': 'EgCregisNavBar',
  'module-menu': 'EgModuleMenu',
  'module-menu-scene-cregis': 'EgCregisModuleMenu',
  'module-menu-scene-udun': 'EgUdunModuleMenu',
  'tool-bar': 'EgToolBar',
  'batch-bar': 'EgBatchBar',
  'data-list': 'EgDataList',
  paginer: 'EgPaginer',
  filter: 'EgFilter',
  'filter-scene-standard': 'EgFilter',
  'filter-scene-advanced': 'EgFilter',
  verify: 'EgVerify',
  'verify-scene-email': 'EgEmailVerify',
  'verify-scene-google': 'EgGoogleVerify',
  'verify-scene-login-password': 'EgLoginPasswordVerify',
  'verify-scene-transaction-password': 'EgTransactionPasswordVerify',
  'verify-scene-passkey': 'EgPasskeyVerify',
  'verify-scene-locked': 'EgLockedVerify',
  detail: 'EgDetail',
  container: 'EgContainer',
  layout: 'EgLayout',
  popup: 'EgPopup',
  'popup-scene-detail': 'EgDetailPopup',
  'popup-scene-dialog': 'EgDialogPopup',
  'popup-scene-verify': 'EgVerifyPopup',
  skid: 'EgSkid',
};

export function isShowcaseScenesSectionChild(
  child: Pick<CatalogChildItem, 'navParent'>,
): boolean {
  return Boolean(child.navParent?.endsWith('-scenes'));
}

export function resolveShowcasePageComponentTag(pageSlug: string): string | undefined {
  return SHOWCASE_PAGE_COMPONENT_TAG[pageSlug];
}

/** @deprecated 使用 resolveShowcasePageComponentTag。 */
export function resolveShowcaseSceneComponentTag(pageSlug: string): string | undefined {
  return resolveShowcasePageComponentTag(pageSlug);
}

export function formatShowcaseSceneSidebarLabel(
  componentTag: string,
  sceneLabel: string,
): string {
  return `${componentTag}（${sceneLabel}）`;
}
