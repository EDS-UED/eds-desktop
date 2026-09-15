import type { DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';

export const progressImportCode = `import { EgProgress } from '@eds/desktop-components';`;

export const progressPropRows: DocPropRow[] = [
  {
    name: 'value',
    type: 'number',
    defaultValue: '0',
    description: showcaseText('Progress 0–100.', '进度 0–100。'),
  },
  {
    name: 'showTooltip',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Whether to show the percentage bubble (eds-popover-fill) at the end of the progress.', '是否在进度末端显示百分比气泡（eds-popover-fill）。'),
  },
  {
    name: 'ariaLabel',
    type: 'string',
    defaultValue: "'进度'",
    description: showcaseText('progressbar accessibility tags.', 'progressbar 无障碍标签。'),
  },
];
