import type { DialogType } from './Dialog.vue';

type DialogTypeInput = DialogType | 'slot';

function normalizeDialogType(type: DialogTypeInput): DialogType {
  if (type === 'slot') return 'compose';
  return type;
}

/** Figma Dialog 2769:8357 — Popup Box 固定宽度（高度随内容）。 */
export const DIALOG_PANEL_WIDTH_PX: Record<DialogType, number> = {
  symbol: 280,
  compose: 460,
  standard: 460,
};

export function resolveDialogPanelWidthPx(type: DialogTypeInput): number {
  return DIALOG_PANEL_WIDTH_PX[normalizeDialogType(type)];
}
