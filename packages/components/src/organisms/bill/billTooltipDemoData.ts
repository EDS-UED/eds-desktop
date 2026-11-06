import type { BillExportHistoryItem } from './billTooltipTypes';

/** Showcase / 文档默认导出历史（与 Figma 账单导出浮层对齐）。 */
export function createBillTooltipDemoHistory(): BillExportHistoryItem[] {
  return [
    {
      id: 'export-1',
      title: 'Social Media 2027-06-23～2027-06-23',
      operatorName: 'Sam',
      operatorEmailMasked: 't******@gmail.com',
      createdAt: '2027-06-23 20:32:06',
      status: 'preparing',
    },
    {
      id: 'export-2',
      title: '前缀 + 2027-06-23～2027-06-23',
      operatorName: 'Sam',
      operatorEmailMasked: 't******@gmail.com',
      createdAt: '2027-06-23 20:32:06',
      status: 'ready',
    },
    {
      id: 'export-3',
      title: '前缀 + 2027-06-23～2027-06-23',
      operatorName: 'Sam',
      operatorEmailMasked: 't******@gmail.com',
      createdAt: '2027-06-23 20:32:06',
      status: 'ready',
    },
  ];
}
