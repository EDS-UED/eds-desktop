import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  galleryLabelFromTokenLabel,
  inputSizeRows,
  propLabelSelectOptions,
  showcaseTagColorfulStyleLabels,
  showcaseTagCustomStyleLabels,
  showcaseTagStatusLabels,
  showcaseTagSystemTypeLabels,
} from '@/data/showcasePropLabels';

export const tagImportCode = `import { EgTag } from '@eds/desktop-components';`;

export const tagStatusSceneImportCode = `import { EgStatusTag } from '@eds/desktop-components';`;
export const tagColorfulSceneImportCode = `import { EgColorfulTag } from '@eds/desktop-components';`;
export const tagBusinessSceneImportCode = `import { EgBusinessTag } from '@eds/desktop-components';`;

export const TAG_SCENE_COMPONENT_TAG = {
  status: 'EgStatusTag',
  colorful: 'EgColorfulTag',
  custom: 'EgBusinessTag',
} as const;

const tagSizeProp: DocPropRow = {
  name: 'size',
  type: "'lg' | 'md' | 'sm'",
  defaultValue: "'md'",
  description: '尺寸；Sm 使用 Bar 字阶，Md/Lg 使用 Body Small Strong。',
};

export const tagSystemPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'system'",
    defaultValue: "'system'",
    description: 'System 族 Tag。',
  },
  {
    name: 'systemType',
    type: "'subtle' | 'solid-brand' | 'solid-red' | 'gray' | 'stroke-subtle' | 'stroke-solid'",
    defaultValue: "'subtle'",
    description: 'System 类型变体。',
  },
];

export const tagStatusPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'status'",
    defaultValue: "'status'",
    description: 'Status 族 Tag。',
  },
  {
    name: 'status',
    type: "'danger' | 'warning' | 'success' | 'ready' | 'invalid'",
    defaultValue: "'danger'",
    description: '语义色；来自 spec/color/tag-palette.json（display-p3）。',
  },
];

export const tagColorfulPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'colorful'",
    defaultValue: "'colorful'",
    description: 'Colorful 族 Tag。',
  },
  {
    name: 'colorfulStyle',
    type: 'TagColorfulStyle',
    defaultValue: "'apricot'",
    description: '样式名；色板见 spec/color/tag-palette.json（Figma Status/Colorful）。',
  },
];

export const tagCustomPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'custom'",
    defaultValue: "'custom'",
    description: 'Palette 族 Tag；radius-xs、左侧竖线配色、material-card-deep 底。',
  },
  {
    name: 'customStyle',
    type: 'TagCustomStyle',
    defaultValue: "'vermilion'",
    description: '竖线配色；见 spec/color/tag-palette.json custom（Figma 2439:7744）。',
  },
];

export const tagSystemCustomizeDefaults = {
  size: 'md',
  family: 'system',
  systemType: 'subtle',
  label: 'Tag',
} as const;

export const tagSystemStyleOptions = propLabelSelectOptions(
  [
    'subtle',
    'solid-brand',
    'solid-red',
    'gray',
    'stroke-subtle',
    'stroke-solid',
  ] as const,
  showcaseTagSystemTypeLabels,
);

/** 预览画廊：全部类型；标签仅中文（定制下拉仍用 tagSystemStyleOptions）。 */
export const tagSystemGalleryOptions = tagSystemStyleOptions.map((option) => ({
  value: option.value,
  label: galleryLabelFromTokenLabel(option.label),
}));

export const tagColorfulStyleOptions = propLabelSelectOptions(
  [
    'apricot',
    'khaki',
    'grass',
    'sage',
    'cyan',
    'ice-blue',
    'periwinkle',
    'lilac',
    'orchid',
    'mallow',
    'rose',
    'coral',
    'mauve',
    'moss',
    'steel',
    'grape',
    'samewhite',
    'lime',
  ] as const,
  showcaseTagColorfulStyleLabels,
);

export const tagColorfulGalleryOptions = tagColorfulStyleOptions.map((option) => ({
  value: option.value,
  label: galleryLabelFromTokenLabel(option.label),
}));

export const tagSystemCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'systemType',
    label: '类型',
    options: tagSystemStyleOptions,
  },
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'label', label: '文案' },
];

/** List Field General Structure 内嵌 Tag 固定 Sm，仅配置类型与文案。 */
export const tagSystemSmCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'systemType',
    label: '类型',
    options: tagSystemStyleOptions,
  },
  { kind: 'text', key: 'label', label: '文案' },
];

export const tagStatusStyleOptions = propLabelSelectOptions(
  ['danger', 'warning', 'success', 'ready', 'invalid'] as const,
  showcaseTagStatusLabels,
);

export const tagStatusGalleryOptions = tagStatusStyleOptions.map((option) => ({
  value: option.value,
  label: galleryLabelFromTokenLabel(option.label),
}));

export const tagStatusCustomizeDefaults = {
  size: 'md',
  family: 'status',
  status: 'danger',
  label: 'Tag',
} as const;

export const tagStatusCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'status',
    label: '状态',
    options: tagStatusStyleOptions,
  },
  { kind: 'text', key: 'label', label: '文案' },
];

export const tagColorfulCustomizeDefaults = {
  size: 'sm',
  family: 'colorful',
  colorfulStyle: 'apricot',
  label: 'Tag',
} as const;

export const tagColorfulCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'colorfulStyle',
    label: '样式',
    options: tagColorfulStyleOptions,
  },
  { kind: 'text', key: 'label', label: '文案' },
];

export const tagCustomStyleOptions = propLabelSelectOptions(
  [
    'vermilion',
    'orange',
    'amber',
    'lime',
    'mint',
    'teal',
    'clear-sky',
    'cobalt',
    'aurora',
    'orchid',
    'rose',
    'peach',
    'aml-danger',
    'aml-safe',
    'aml-suspicious',
    'aml-invalid',
  ] as const,
  showcaseTagCustomStyleLabels,
);

export const tagCustomGalleryOptions = tagCustomStyleOptions.map((option) => ({
  value: option.value,
  label: galleryLabelFromTokenLabel(option.label),
}));

export const tagAmlStyleOptions = propLabelSelectOptions(
  ['aml-danger', 'aml-safe', 'aml-suspicious', 'aml-invalid'] as const,
  showcaseTagCustomStyleLabels,
);

export const tagRiskCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'customStyle',
    label: '样式',
    options: tagAmlStyleOptions,
  },
  { kind: 'text', key: 'label', label: '文案' },
];

export const tagCustomCustomizeDefaults = {
  size: 'sm',
  family: 'custom',
  customStyle: 'vermilion',
  label: 'Tag',
} as const;

export const tagCustomCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'customStyle',
    label: '竖线色',
    options: tagCustomStyleOptions,
  },
  { kind: 'text', key: 'label', label: '文案' },
];

function buildTagSnippet(
  state: Record<string, unknown>,
  defaults: Record<string, unknown>,
  componentTag = 'EgTag',
): string {
  const props: Record<string, unknown> = {
    size: state.size,
    family: state.family,
  };
  if (state.family === 'system') props.systemType = state.systemType;
  if (state.family === 'status') props.status = state.status;
  if (state.family === 'colorful') props.colorfulStyle = state.colorfulStyle;
  if (state.family === 'custom') props.customStyle = state.customStyle;
  const label = String(state.label ?? 'Tag');
  const open = buildVueSelfClosingSnippet(componentTag, props, { defaults });
  return open.replace('/>', `>${label}</${componentTag}>`);
}

export function buildTagSystemUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet({ ...state, family: 'system' }, tagSystemCustomizeDefaults);
}

export function buildTagStatusUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet(
    { ...state, family: 'status' },
    tagStatusCustomizeDefaults,
    TAG_SCENE_COMPONENT_TAG.status,
  );
}

export function buildTagColorfulUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet(
    { ...state, family: 'colorful' },
    tagColorfulCustomizeDefaults,
    TAG_SCENE_COMPONENT_TAG.colorful,
  );
}

export function buildTagCustomUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet(
    { ...state, family: 'custom' },
    tagCustomCustomizeDefaults,
    TAG_SCENE_COMPONENT_TAG.custom,
  );
}
