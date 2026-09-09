export { default as EgPopup } from './Popup.vue';
export { default as EgDetailPopup } from './DetailPopup.vue';
export { default as EgDialogPopup } from './DialogPopup.vue';
export { default as EgVerifyPopup } from './VerifyPopup.vue';
export type { PopupUses, PopupAlertVerticalAlign } from './Popup.vue';
export type { DialogType } from '../../organisms/dialog';
export type { VerifyType } from '../../organisms/verify';
export {
  DIALOG_PANEL_WIDTH_PX,
  resolveDialogPanelWidthPx,
} from '../../organisms/dialog';
export {
  VERIFY_PANEL_WIDTH_PX,
  VERIFY_PANEL_HEIGHT_PX,
  resolveVerifyPanelWidthPx,
  resolveVerifyPanelHeightPx,
} from '../../organisms/verify';
export {
  EgDetail,
  type DetailItemData as PopupDetailItemData,
  type DetailSectionData as PopupDetailSectionData,
} from '../../organisms/detail';
