import type { DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';

export const dividerImportCode = `import { EgDivider } from '@eds/desktop-components';`;

export const dividerPropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'module' | 'page' | 'navigator'",
    defaultValue: "'module'",
    description:
      showcaseText('[doc] Divider：Module（stroke-sm + stroke-divider-module）、Page（stroke-xs + stroke-divider-page）、Navigator（stroke-xs + stroke-base-quaternary）。', '分割线语义：Module（stroke-sm + stroke-divider-module）、Page（stroke-xs + stroke-divider-page）、Navigator（stroke-xs + stroke-base-quaternary）。'),
  },
  {
    name: 'direction',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: showcaseText('Direction; horizontal is the barrier line, vertical is the barrier line (container needs height). The thickness depends on the type (Module is sm, Page/Navigator is xs).', '方向；水平为通栏线，垂直为通高线（容器需有高度）。粗细随 type 而定（Module 为 sm，Page / Navigator 为 xs）。'),
  },
  {
    name: 'hide',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('When true, stroke-hide is used, leaving the placeholder without lines (e.g. Combo optional top part spacing).', '为 true 时使用 stroke-hide，保留占位不显示线条（如 Combo 可选顶部分隔）。'),
  },
];
