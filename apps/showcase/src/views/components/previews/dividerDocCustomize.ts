import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  propLabelRows,
  showcaseDirectionLabels,
  showcaseDividerTypeLabels,
} from '@/data/showcasePropLabels';

export const dividerCustomizeDefaults = {
  type: 'module',
  direction: 'horizontal',
  hide: false,
} as const;

export const dividerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseText('Type', '类型'),
    options: propLabelRows(['module', 'page', 'navigator'] as const, showcaseDividerTypeLabels).map(
      (row) => ({ value: row.key, label: row.label }),
    ),
  },
  {
    kind: 'select',
    key: 'direction',
    label: showcaseText('Direction', '方向'),
    options: propLabelRows(['horizontal', 'vertical'] as const, showcaseDirectionLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
  { kind: 'boolean', key: 'hide', label: showcaseText('Hidden', '隐藏') },
];

export function buildDividerUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgDivider', state, {
    defaults: dividerCustomizeDefaults,
  });
}
