import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  buttonToneRows,
  buttonSizeRows,
  buttonVariantRows,
  linkSizeRows,
  linkToneRows,
  propLabelRows,
  showcaseFeedbackMessageTypeLabels,
  showcaseFeedbackToastTypeLabels,
  showcaseFormSubmissionTypeLabels,
  showcaseStreamerTypeLabels,
  showcaseStreamerVisualLabels,
} from '@/data/showcasePropLabels';

export const endFeedbackCardImportCode = `import { EgEndFeedbackCard } from '@eds/desktop-components';`;
export const toastImportCode = `import { EgToast } from '@eds/desktop-components';`;
export const messageImportCode = `import { EgMessage } from '@eds/desktop-components';`;
export const reddotImportCode = `import { EgReddot } from '@eds/desktop-components';`;
export const formSubmissionImportCode = `import { EgFormSubmission } from '@eds/desktop-components';`;
export const streamerImportCode = `import { EgStreamer } from '@eds/desktop-components';`;

/** Figma Streamer doc — node 2534:5785 */
export const streamerFigmaNode = '2534:5785';

export const endFeedbackCardPropRows: DocPropRow[] = [
  { name: 'text', type: 'string', defaultValue: "'I am Text'", description: showcaseText('The body of the card.', '卡片正文。') },
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description:
      showcaseText('[doc] Success EgDoneTick（16px ， --motion-delay-feedback-tick ）。', '成功勾号使用 EgDoneTick（16px 白描边，延迟 --motion-delay-feedback-tick 于绿圆入场后播放）。'),
  },
];

export const toastPropRows: DocPropRow[] = [
  { name: 'type', type: "'result' | 'danger'", defaultValue: "'result'", description: showcaseText('Toast type.', 'Toast 类型。') },
  { name: 'text', type: 'string', defaultValue: "'Connect to EDS'", description: showcaseText('Copy。', '文案。') },
];

export const messagePropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'subtle' | 'brand' | 'danger'",
    defaultValue: "'subtle'",
    description:
      showcaseText('[doc] Subtle：--material-card-moderate + --text-base-primary；Brand：--material-brand-primary + ；Danger：--status-danger + 。', 'Subtle：--material-card-moderate + --text-base-primary；Brand：--material-brand-primary + 白字；Danger：--status-danger + 白字。'),
  },
  { name: 'text', type: 'string', defaultValue: "'0'", description: showcaseText('Copywriting or counting (Bar 11px/line-height 14px).', '文案或计数（Bar 11px / line-height 14px）。') },
  {
    name: 'focused',
    type: 'boolean',
    defaultValue: 'false',
    description:
      showcaseText('[doc] RowFocus；Module Menu item Focuswhenby provide，can。FocuswhenCopy --text-same-black-primary。', '行聚焦态；Module Menu item 聚焦时由父级 provide，亦可受控。聚焦时文案 --text-same-black-primary。'),
  },
  {
    name: 'focusBackground',
    type: "'inherit' | 'same-white'",
    defaultValue: "'inherit'",
    description:
      showcaseText('[doc] FocusBackground：inherit type ；same-white as --material-same-white-primary。Module Menu item message-focus-background prop；#accessory whenin EgMessage 。', '聚焦背景：inherit 保持 type 原色；same-white 为 --material-same-white-primary。Module Menu item 用 message-focus-background prop；#accessory 嵌套时写在 EgMessage 上。'),
  },
];

export const reddotPropRows: DocPropRow[] = [
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Reddot has no props, 8px danger colored dots.', 'Reddot 无 props，为 8px 危险色圆点。'),
  },
];

export const formSubmissionPropRows: DocPropRow[] = [
  { name: 'type', type: "'notes' | 'danger' | 'success'", defaultValue: "'notes'", description: showcaseText('The form feedback type.', '表单反馈类型。') },
  { name: 'text', type: 'string', defaultValue: "'Connect to EDS'", description: showcaseText('Description copy.', '说明文案。') },
  {
    name: 'linkLabel',
    type: 'string',
    defaultValue: "'Button'",
    description: showcaseText('Notes/Danger modal copy (nested EgLinkButton size = sm); Success no link.', 'Notes / Danger 态链接文案（嵌套 EgLinkButton size=sm）；Success 无链接。'),
  },
  { name: 'href', type: 'string', defaultValue: "'#'", description: showcaseText('Notes/Danger status link address.', 'Notes / Danger 态链接地址。') },
  {
    name: 'showLink',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Whether the link is displayed or not; Notes/Danger is active and Success has no link.', '是否显示链接；Notes / Danger 生效，Success 无链接。'),
  },
];

export const streamerPropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'info' | 'warning' | 'danger'",
    defaultValue: "'info'",
    description: showcaseText('Group-level banner semantic color. info background `--material-card-moderate`; warning/danger use type weaken when visual = brand, uniform `--material-card-moderate` when moderate.', '组级横幅语义色。info 背景 `--material-card-moderate`；warning / danger 在 visual=brand 时用类型 weaken，moderate 时统一 `--material-card-moderate`。'),
  },
  {
    name: 'visual',
    type: "'brand' | 'moderate'",
    defaultValue: "'brand'",
    description: showcaseText('Visual: brand type weaken background; moderate unified `--material-card-moderate`.', '视觉：brand 类型 weaken 背景；moderate 统一 `--material-card-moderate`。'),
  },
  { name: 'text', type: 'string', defaultValue: "'Connect to EDS'", description: showcaseText('Banner copy.', '横幅文案。') },
  {
    name: 'showSymbol',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Whether ShowLeadingIconIcon.', '是否显示左侧符号图标。'),
  },
  {
    name: 'showButton',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Whether inTrailingShow EgButton（Default outline · xs · subtle，Border `--stroke-xs`）.', '是否在右侧显示 EgButton（默认 outline · xs · subtle，边框 `--stroke-xs`）。'),
  },
  {
    name: 'buttonLabel',
    type: 'string',
    defaultValue: "'Button'",
    description: showcaseText('ButtonCopy；only showButton as true whenShow。', '按钮文案；仅 showButton 为 true 时显示。'),
  },
  {
    name: 'buttonVariant',
    type: "'solid' | 'outline' | 'text'",
    defaultValue: "'outline'",
    description: showcaseText('EgButton Style.', 'EgButton 风格（Style）。'),
  },
  {
    name: 'buttonTone',
    type: "'brand' | 'decor' | 'subtle'",
    defaultValue: "'subtle'",
    description: 'EgButton tone。',
  },
  {
    name: 'buttonSize',
    type: "'lg' | 'md' | 'sm' | 'xs'",
    defaultValue: "'xs'",
    description: showcaseText('EgButton size.', 'EgButton 尺寸。'),
  },
  {
    name: 'showLink',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Whether or not to display the EgLinkButton on the right (can co-exist with buttons for document comparison).', '是否在右侧显示 EgLinkButton（可与按钮并存，用于文档对比）。'),
  },
  {
    name: 'linkLabel',
    type: 'string',
    defaultValue: "'Button'",
    description: showcaseText('Link Copy；only showLink as true whenShow。', 'Link 文案；仅 showLink 为 true 时显示。'),
  },
  {
    name: 'linkTone',
    type: "'brand' | 'decor'",
    defaultValue: "'brand'",
    description: 'EgLinkButton tone。',
  },
  {
    name: 'linkSize',
    type: "'md'",
    defaultValue: "'md'",
    description: showcaseText('EgLinkButton size.', 'EgLinkButton 尺寸。'),
  },
  { name: 'href', type: 'string', defaultValue: "'#'", description: showcaseText('Link Address。', 'Link 地址。') },
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Warning bar at the top of the block, `role = "alert"`; used for group_failure group level verification failures.', '区块顶部警告条，`role="alert"`；用于 group_failure 组级校验失败。'),
  },
];

export const endFeedbackCardCustomizeDefaults = { text: 'I am Text' };
export const endFeedbackCardCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'text', label: showcaseText('Copy', '文案') },
];

export const toastCustomizeDefaults = { type: 'result', text: 'Connect to EDS' };
export const toastCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseText('Type', '类型'),
    options: propLabelRows(['result', 'danger'] as const, showcaseFeedbackToastTypeLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
  { kind: 'text', key: 'text', label: showcaseText('Copy', '文案') },
];

export const messageCustomizeDefaults = {
  type: 'subtle',
  text: '0',
};
export const messageCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseText('Type', '类型'),
    options: propLabelRows(['subtle', 'brand', 'danger'] as const, showcaseFeedbackMessageTypeLabels).map(
      (row) => ({ value: row.key, label: row.label }),
    ),
  },
  { kind: 'text', key: 'text', label: showcaseText('Copy', '文案') },
];

export const reddotCustomizeDefaults = {};
export const reddotCustomizeControls: DocCustomizeControl[] = [];

export const formSubmissionCustomizeDefaults = {
  type: 'notes',
  text: 'Connect to EDS',
  linkLabel: 'Button',
  showLink: true,
};
export const formSubmissionCustomizeControls: DocCustomizeControl[] =
  buildFormSubmissionExpandCustomizeControls();

type FormSubmissionExpandOptions = {
  row?: number;
  /** 为 true 时才展示（如 Combo 勾选「反馈区」）。 */
  visibleWhen?: (state: Record<string, unknown>) => boolean;
  /** 避免与 EgInput `type` 等同名冲突（Combo Input）。 */
  keyPrefix?: string;
};

function submissionKey(prefix: string | undefined, key: string): string {
  return prefix ? `${prefix}${key[0]!.toUpperCase()}${key.slice(1)}` : key;
}

/** 反馈区展开项：类型 / 文案 / 链接（勾选反馈区后同行或续行展示）。 */
export function buildFormSubmissionExpandCustomizeControls(
  options: FormSubmissionExpandOptions = {},
): DocCustomizeControl[] {
  const { row, visibleWhen, keyPrefix } = options;
  const gate = (state: Record<string, unknown>) =>
    visibleWhen ? visibleWhen(state) : true;
  const typeKey = submissionKey(keyPrefix, 'type');
  const textKey = submissionKey(keyPrefix, 'text');
  const linkLabelKey = submissionKey(keyPrefix, 'linkLabel');
  const showLinkKey = submissionKey(keyPrefix, 'showLink');

  return [
    {
      kind: 'select',
      key: typeKey,
      label: showcaseText('Type', '类型'),
      row,
      options: propLabelRows(['notes', 'danger', 'success'] as const, showcaseFormSubmissionTypeLabels).map(
        (row) => ({ value: row.key, label: row.label }),
      ),
      visibleWhen: gate,
    },
    {
      kind: 'text',
      key: textKey,
      label: showcaseText('Copy', '文案'),
      row,
      visibleWhen: gate,
    },
    {
      kind: 'boolean',
      key: showLinkKey,
      label: showcaseText('Show Link', '显示链接'),
      row,
      visibleWhen: (s) => gate(s) && (s[typeKey] === 'notes' || s[typeKey] === 'danger'),
    },
    {
      kind: 'text',
      key: linkLabelKey,
      label: showcaseText('Button copy.', '按钮文案'),
      row,
      visibleWhen: (s) =>
        gate(s) &&
        (s[typeKey] === 'notes' || s[typeKey] === 'danger') &&
        Boolean(s[showLinkKey]),
    },
  ];
}

/** 从 customize 状态读取 EgFormSubmission props（支持 submission* 前缀键）。 */
export function formSubmissionPropsFromCustomizeState(
  state: Record<string, unknown>,
  keyPrefix?: string,
): Record<string, unknown> {
  const type = String(state[submissionKey(keyPrefix, 'type')] ?? formSubmissionCustomizeDefaults.type);
  const props: Record<string, unknown> = {
    type,
    text: String(state[submissionKey(keyPrefix, 'text')] ?? formSubmissionCustomizeDefaults.text),
  };
  if (type === 'notes' || type === 'danger') {
    props.linkLabel = String(
      state[submissionKey(keyPrefix, 'linkLabel')] ?? formSubmissionCustomizeDefaults.linkLabel,
    );
    props.showLink =
      state[submissionKey(keyPrefix, 'showLink')] !== false;
  }
  return props;
}

export const streamerCustomizeDefaults = {
  type: 'info',
  visual: 'brand',
  text: 'Connect to EDS',
  showSymbol: true,
  showButton: true,
  buttonLabel: 'Button',
  buttonVariant: 'outline',
  buttonTone: 'subtle',
  buttonSize: 'xs',
  showLink: false,
  linkLabel: 'Button',
  linkTone: 'brand',
  linkSize: 'md',
};

export const streamerVisualCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'visual',
    label: showcaseText('&Visual', '视觉'),
    options: propLabelRows(['brand', 'moderate'] as const, showcaseStreamerVisualLabels).map(
      (row) => ({ value: row.key, label: row.label }),
    ),
  },
];

export const streamerSymbolCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showSymbol', label: showcaseText('ShowIcon', '显示符号') },
];

export const streamerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseText('Type', '类型'),
    options: propLabelRows(['info', 'warning', 'danger'] as const, showcaseStreamerTypeLabels).map(
      (row) => ({ value: row.key, label: row.label }),
    ),
  },
  { kind: 'text', key: 'text', label: showcaseText('Copy', '文案') },
  ...streamerVisualCustomizeControls,
  ...streamerSymbolCustomizeControls,
];

const streamerButtonToneOptions = buttonToneRows
  .filter((row) => row.key === 'brand' || row.key === 'decor' || row.key === 'subtle')
  .map((row) => ({ value: row.key, label: row.label }));

export const streamerButtonCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showButton', label: showcaseText('ShowButton', '显示按钮'), row: 0 },
  {
    kind: 'select',
    key: 'buttonVariant',
    label: showcaseText('Style', '风格'),
    row: 0,
    visibleWhen: (state) => Boolean(state.showButton),
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'buttonTone',
    label: showcaseText('Tone', '色调'),
    row: 1,
    visibleWhen: (state) => Boolean(state.showButton),
    options: streamerButtonToneOptions,
  },
  {
    kind: 'select',
    key: 'buttonSize',
    label: showcaseText('Size', '尺寸'),
    row: 1,
    visibleWhen: (state) => Boolean(state.showButton),
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'buttonLabel',
    label: showcaseText('Button copy.', '按钮文案'),
    row: 1,
    visibleWhen: (state) => Boolean(state.showButton),
  },
];

const streamerLinkToneOptions = linkToneRows
  .filter((row) => row.key === 'brand' || row.key === 'decor')
  .map((row) => ({ value: row.key, label: row.label }));

const streamerLinkSizeOptions = linkSizeRows
  .filter((row) => row.key === 'md')
  .map((row) => ({ value: row.key, label: row.label }));

export const streamerLinkCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showLink', label: showcaseText('Show Link', '显示 Link'), row: 0 },
  {
    kind: 'select',
    key: 'linkTone',
    label: showcaseText('Tone', '色调'),
    row: 0,
    visibleWhen: (state) => Boolean(state.showLink),
    options: streamerLinkToneOptions,
  },
  {
    kind: 'select',
    key: 'linkSize',
    label: showcaseText('Size', '尺寸'),
    row: 0,
    visibleWhen: (state) => Boolean(state.showLink),
    options: streamerLinkSizeOptions,
  },
  {
    kind: 'text',
    key: 'linkLabel',
    label: showcaseText('Copy', '文案'),
    visibleWhen: (state) => Boolean(state.showLink),
  },
];

export function buildStreamerUsageSnippet(state: Record<string, unknown>): string {
  const props: Record<string, unknown> = {
    type: String(state.type ?? streamerCustomizeDefaults.type),
    text: String(state.text ?? streamerCustomizeDefaults.text),
    showSymbol: state.showSymbol !== false,
  };
  if (state.visual && state.visual !== streamerCustomizeDefaults.visual) {
    props.visual = String(state.visual);
  }
  if (state.showButton) {
    props.showButton = true;
    props.buttonLabel = String(state.buttonLabel ?? streamerCustomizeDefaults.buttonLabel);
    props.buttonVariant = String(state.buttonVariant ?? streamerCustomizeDefaults.buttonVariant);
    props.buttonTone = String(state.buttonTone ?? streamerCustomizeDefaults.buttonTone);
    props.buttonSize = String(state.buttonSize ?? streamerCustomizeDefaults.buttonSize);
  }
  if (state.showLink) {
    props.showLink = true;
    props.linkLabel = String(state.linkLabel ?? streamerCustomizeDefaults.linkLabel);
    props.linkTone = String(state.linkTone ?? streamerCustomizeDefaults.linkTone);
    props.linkSize = String(state.linkSize ?? streamerCustomizeDefaults.linkSize);
    props.href = String(state.href ?? '#');
  }
  return buildVueSelfClosingSnippet('EgStreamer', props, {
    defaults: {
      ...streamerCustomizeDefaults,
      /** 组件 API 默认仍为 false；文档预览打开按钮时须写出 show-button。 */
      showButton: false,
    },
  });
}

export function buildFormSubmissionUsageSnippet(
  state: Record<string, unknown>,
  keyPrefix?: string,
): string {
  const props = formSubmissionPropsFromCustomizeState(state, keyPrefix);
  const type = String(props.type ?? formSubmissionCustomizeDefaults.type);
  if (type === 'notes' || type === 'danger') {
    props.href = String(state.href ?? '#');
  }
  return buildVueSelfClosingSnippet('EgFormSubmission', props, {
    defaults: formSubmissionCustomizeDefaults,
  });
}
