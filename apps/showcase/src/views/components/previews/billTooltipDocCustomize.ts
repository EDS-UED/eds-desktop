import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText, triggerRows } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import { SHOWCASE_BILL_DEFAULT_RANGE } from './billTooltipShowcaseMock';

export const tooltipBillSceneSection = {
  id: 'tooltip-scene-bill',
  label: showcaseText('Bill export', '账单导出'),
} as const;

export function isTooltipBillSceneSlug(pageSlug: string): boolean {
  return pageSlug === tooltipBillSceneSection.id;
}

export const billTooltipCustomizeDefaults = {
  trigger: 'click',
  disabled: false,
  exportLoading: false,
  dateRange: SHOWCASE_BILL_DEFAULT_RANGE,
} as const;

export const billTooltipSceneCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'trigger',
    label: showcaseText('Interaction', '交互方式'),
    options: triggerRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'boolean',
    key: 'disabled',
    label: showcaseText('Disabled', '禁用'),
  },
  {
    kind: 'boolean',
    key: 'exportLoading',
    label: showcaseText('Export loading', '导出 loading'),
  },
];

export function buildBillTooltipUsageSnippet(state: Record<string, unknown>): string {
  const attrs = buildVueSelfClosingSnippet(
    'EgBillTooltip',
    {
      modelValue: String(state.dateRange ?? SHOWCASE_BILL_DEFAULT_RANGE),
      disabled: Boolean(state.disabled),
      exportLoading: Boolean(state.exportLoading),
      trigger: String(state.trigger ?? billTooltipCustomizeDefaults.trigger),
      ':translate': 'billUi',
      ':history-items': 'billHistory',
      '@export': 'onBillExport',
      '@download-history': 'onBillDownload',
    },
    {
      defaults: billTooltipCustomizeDefaults,
      omitKeys: ['dateRange'],
    },
  ).replace(/\/>$/, '>');
  return `${attrs}
  <template #trigger="{ expanded }">
    <EgIconProButton label="Export" :active="expanded" :aria-expanded="expanded">
      <EgIcon name="eds-arrow-download" size="sm" />
    </EgIconProButton>
  </template>
</EgBillTooltip>`;
}

export const billTooltipPropRows: DocPropRow[] = [
  {
    name: 'modelValue',
    type: 'string',
    defaultValue: "''",
    description: showcaseText('Export date range (`start,end` ISO keys).', '导出时间段（`start,end` ISO 日期键）。'),
  },
  {
    name: 'historyItems',
    type: 'BillExportHistoryItem[]',
    defaultValue: '[]',
    description: showcaseText('Export history rows.', '导出历史列表。'),
  },
  {
    name: 'translate',
    type: 'BillTranslate',
    defaultValue: 'undefined',
    description: showcaseText('i18n callback for panel copy.', '面板文案 i18n 回调。'),
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Disables export and history actions.', '禁用导出与历史操作。'),
  },
  {
    name: 'exportLoading',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Export button loading state.', '导出按钮 loading。'),
  },
  {
    name: 'trigger',
    type: "'click' | 'hover'",
    defaultValue: "'click'",
    description: showcaseText('How the panel opens.', '面板打开方式。'),
  },
  {
    name: 'export',
    type: 'event',
    defaultValue: '—',
    description: showcaseText('Emitted when export is confirmed.', '点击导出时触发。'),
  },
  {
    name: 'download-history',
    type: 'event',
    defaultValue: '—',
    description: showcaseText('Emitted with history item id when download is clicked.', '点击历史下载时携带 id。'),
  },
];
