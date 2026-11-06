export type BillExportHistoryStatus = 'preparing' | 'ready';

export type BillExportHistoryItem = {
  id: string;
  title: string;
  operatorName: string;
  operatorEmailMasked: string;
  createdAt: string;
  status: BillExportHistoryStatus;
};

/** 账单导出浮层固定宽（对齐 EgPopover 默认 336）。 */
export const BILL_TOOLTIP_PANEL_WIDTH = 336;

/** 导出历史列表最大高度（px）；超出滚动 + 底缘 mask。 */
export const BILL_TOOLTIP_HISTORY_MAX_HEIGHT = 240;
