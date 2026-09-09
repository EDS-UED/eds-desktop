export type DataListItem = Record<string, unknown>;

export type DataListColumnAlign = 'left' | 'center' | 'right';

export type DataListSelectAllMode = 'none' | 'all' | 'some';

export type DataListSortOrder = 'asc' | 'desc' | '';

export type DataListBatchAction = {
  key: string;
  label: string;
  danger?: boolean;
  /** true 时点击打开 Popover（EgTooltip + EgPopover），确认后再触发 batch-action。 */
  popover?: boolean;
  /** Popover 顶部工具条标题；省略时使用 DataList 的 batchPopoverTopToolTitle。 */
  popoverTitle?: string;
};

/** onBatchAction 返回值；多步批处理（如 Remark → Verify）可保留勾选至流程结束。 */
export type DataListBatchActionResult = {
  preserveSelection?: boolean;
};

export type DataListRowAction = {
  key: string;
  label: string;
  danger?: boolean;
};

export type DataListPrimaryAction = {
  label: string;
};
