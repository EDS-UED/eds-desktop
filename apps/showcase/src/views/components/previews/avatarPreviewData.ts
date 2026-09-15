import type { DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';

export const avatarImportCode = `import { EgAvatar } from '@eds/desktop-components';`;

export const avatarPropRows: DocPropRow[] = [
  {
    name: 'name',
    type: 'string',
    defaultValue: 'undefined',
    description: showcaseText('Username; use initials as abbreviation when initials are not passed.', '用户名；未传 initials 时取首字作为缩写。'),
  },
  {
    name: 'initials',
    type: 'string',
    defaultValue: 'undefined',
    description: showcaseText('Abbreviated copy, preferred to name derivation.', '缩写文案，优先于 name 推导。'),
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'lg'",
    description:
      showcaseText('[doc] Size， token --avatar-xs/sm/md/lg/xl（16 / 24 / 32 / 36 / 40px）。initials ：xs/sm 8px，md/lg/xl 12px， 700（）。', '尺寸，对应 token --avatar-xs/sm/md/lg/xl（16 / 24 / 32 / 36 / 40px）。initials 首字：xs/sm 视觉 8px，md/lg/xl 视觉 12px，字重 700（硬编码）。'),
  },
  {
    name: 'variant',
    type: "'initials' | 'robot'",
    defaultValue: "'initials'",
    description: showcaseText('initials: native palette + initial; robot: eds-avatar-0 robot.', 'initials：原色盘 + 首字；robot：eds-avatar-0 机器人。'),
  },
  {
    name: 'colorIndex',
    type: 'number',
    defaultValue: 'undefined',
    description: showcaseText('Specifies the web3 primary disc index (0–19); stable mapping by colorSeed/name when not transmitted.', '指定 web3 原色盘索引（0–19）；未传时按 colorSeed / name 稳定映射。'),
  },
  {
    name: 'randomColor',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('When true, each render is randomly picked from the primary color palette (for demonstration).', '为 true 时每次渲染从原色盘随机取色（演示用）。'),
  },
  {
    name: 'colorSeed',
    type: 'string',
    defaultValue: 'undefined',
    description: showcaseText('Primary color mapping seed, default name.', '原色映射 seed，默认取 name。'),
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: 'undefined',
    description: showcaseText('Accessible aria-label.', '无障碍 aria-label。'),
  },
];
