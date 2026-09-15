import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';

export const progressCustomizeDefaults = {
  value: '39',
  showTooltip: true,
} as const;

export const progressCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'value',
    label: showcaseText('Progres', '进度'),
    options: ['0', '10', '25', '39', '50', '75', '100'].map((value) => ({
      value,
      label: `${value}%`,
    })),
  },
  { kind: 'boolean', key: 'showTooltip', label: showcaseText('Show Bubbles', '显示气泡') },
];

export function buildProgressUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgProgress', state, {
    defaults: progressCustomizeDefaults,
  });
}
