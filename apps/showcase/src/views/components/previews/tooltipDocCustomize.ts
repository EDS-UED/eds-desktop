import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buildVueOpeningTag } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  placementRows,
  showcaseTooltipCustomizeFieldLabels,
  showcaseTooltipFlotationScenarioLabels,
  showcaseTooltipPanelKindCustomizeLabels,
  showcaseTooltipPanelKindLabels,
  showcaseTooltipPanelRadiusLabels,
  triggerRows,
} from '@/data/showcasePropLabels';
import {
  buildAnchoredContainerPanelControls,
  parseAnchoredContainerOptionalInt,
} from './anchoredContainerDocCustomize';

export const tooltipFlotationScenarioOptions = [
  { value: 'text-overflow', label: showcaseTooltipFlotationScenarioLabels['text-overflow'] },
  {
    value: 'paragraph-overflow-info',
    label: showcaseTooltipFlotationScenarioLabels['paragraph-overflow-info'],
  },
  { value: 'multi-address', label: showcaseTooltipFlotationScenarioLabels['multi-address'] },
] as const;

export type TooltipFlotationScenarioValue =
  (typeof tooltipFlotationScenarioOptions)[number]['value'];

/** 本体页「容器」下拉：panelKind（flotation / container / popup / molde）。 */
export const tooltipPanelKindCustomizeOptions = [
  { value: 'flotation', label: showcaseTooltipPanelKindCustomizeLabels.flotation },
  { value: 'container', label: showcaseTooltipPanelKindCustomizeLabels.container },
  { value: 'popup', label: showcaseTooltipPanelKindCustomizeLabels.popup },
  { value: 'molde', label: showcaseTooltipPanelKindCustomizeLabels.molde },
] as const;

export const tooltipOverflowSceneSections = [
  { id: 'tooltip-scene-text-overflow', label: showcaseText('Field overflow', '字段溢出'), scenario: 'text-overflow' },
  {
    id: 'tooltip-scene-paragraph-overflow',
    label: showcaseText('Paragraph overflow', '段落溢出'),
    scenario: 'paragraph-overflow-info',
  },
  {
    id: 'tooltip-scene-multi-address',
    label: showcaseText('Address overflow (item, copyable)', '地址溢出（Item、可复制）'),
    scenario: 'multi-address',
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  scenario: TooltipFlotationScenarioValue;
}>;

export type TooltipOverflowSceneSection = (typeof tooltipOverflowSceneSections)[number];

export function isTooltipOverflowSceneSlug(pageSlug: string): boolean {
  return tooltipOverflowSceneSections.some((section) => section.id === pageSlug);
}

export function scenarioForTooltipOverflowSceneSlug(
  pageSlug: string,
): TooltipFlotationScenarioValue | undefined {
  return tooltipOverflowSceneSections.find((section) => section.id === pageSlug)?.scenario;
}

export function findTooltipOverflowSceneSection(
  pageSlug: string,
): TooltipOverflowSceneSection | undefined {
  return tooltipOverflowSceneSections.find((section) => section.id === pageSlug);
}

export const tooltipPanelRadiusOptions = [
  { value: '', label: showcaseTooltipPanelRadiusLabels[''] },
  { value: 'radius-0', label: showcaseTooltipPanelRadiusLabels['radius-0'] },
  { value: 'radius-xs', label: showcaseTooltipPanelRadiusLabels['radius-xs'] },
  { value: 'radius-sm', label: showcaseTooltipPanelRadiusLabels['radius-sm'] },
  { value: 'radius-md', label: showcaseTooltipPanelRadiusLabels['radius-md'] },
  { value: 'radius-lg', label: showcaseTooltipPanelRadiusLabels['radius-lg'] },
  { value: 'radius-full', label: showcaseTooltipPanelRadiusLabels['radius-full'] },
] as const;

export const tooltipImportCode = `import {
  EgTooltip,
  EgButton,
} from '@eds/desktop-components';`;

export const tooltipPanelKindOptions = [
  { value: 'container', label: showcaseTooltipPanelKindLabels.container },
  { value: 'flotation', label: showcaseTooltipPanelKindLabels.flotation },
  { value: 'popup', label: showcaseTooltipPanelKindLabels.popup },
  { value: 'subtle', label: showcaseTooltipPanelKindLabels.subtle },
  { value: 'molde', label: showcaseTooltipPanelKindLabels.molde },
] as const;

export type TooltipPanelKindValue = (typeof tooltipPanelKindOptions)[number]['value'];

export const tooltipPanelKindSections = [
  { id: 'tooltip-flotation', label: 'StandardBox', panelKind: 'flotation' },
  { id: 'tooltip-container', label: 'ContainerBox', panelKind: 'container' },
  { id: 'tooltip-popup', label: 'PopupBox', panelKind: 'popup' },
  { id: 'tooltip-subtle', label: 'SubtleCard', panelKind: 'subtle' },
  { id: 'tooltip-molde', label: 'ModeLevel', panelKind: 'molde' },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  panelKind: TooltipPanelKindValue;
}>;

export type TooltipPanelKindSection = (typeof tooltipPanelKindSections)[number];

export const tooltipPanelKindDefaultRadiusLabel: Record<TooltipPanelKindValue, string> = {
  container: 'radius-md',
  flotation: 'radius-md',
  popup: 'radius-lg',
  subtle: 'radius-md',
  molde: '—',
};

export const tooltipCustomizeDefaults = {
  panelKind: 'flotation',
  panelRadius: '',
  widthMode: 'fixed',
  width: '328',
  height: '380',
  heightMode: 'fixed',
  maxHeight: '',
  placement: 'bottom',
  align: 'start',
  offset: '',
  crossAxisOffset: '',
  trigger: 'click',
  tooltipTrigger: 'hover',
  disabled: false,
  triggerLabel: '点击我',
} as const;

const isFixedWidth = (state: Record<string, unknown>) =>
  String(state.widthMode ?? 'fixed') === 'fixed';

const L = showcaseTooltipCustomizeFieldLabels;

export const tooltipOverflowSceneCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tooltipTrigger',
    label: showcaseText('Tooltip Interaction', 'Tooltip 交互'),
    options: [
      { value: 'hover', label: showcaseText('When floating', '悬浮时') },
      { value: 'focus', label: showcaseText('Focuswhen', '聚焦时') },
    ],
  },
];

export function buildTooltipBodyCustomizeControls(
  state: Record<string, unknown>,
  options: { hidePanelKind?: boolean } = {},
): DocCustomizeControl[] {
  const rowOffset = options.hidePanelKind ? 0 : 1;
  const metaRow = rowOffset + 3;

  const prefix: DocCustomizeControl[] = options.hidePanelKind
    ? []
    : [
        {
          kind: 'select',
          key: 'panelKind',
          label: L.panelKind,
          row: 0,
          options: tooltipPanelKindCustomizeOptions.map(({ value, label }) => ({ value, label })),
        },
      ];

  return [
    ...prefix,
    ...buildAnchoredContainerPanelControls(state, { rowOffset }),
    {
      kind: 'select',
      key: 'panelRadius',
      label: L.panelRadius,
      row: metaRow,
      options: tooltipPanelRadiusOptions.map(({ value, label }) => ({ value, label })),
    },
    {
      kind: 'select',
      key: 'trigger',
      label: L.trigger,
      row: metaRow,
      options: triggerRows.map((row) => ({ value: row.key, label: row.label })),
    },
    { kind: 'boolean', key: 'disabled', label: L.disabled, row: metaRow },
  ];
}

const CUSTOMIZE_ONLY_KEYS = new Set(['triggerLabel']);

function buildAnchoredTooltipUsageSnippet(
  state: Record<string, unknown>,
  panelKind: TooltipPanelKindValue,
): string {
  const anchoredProps: Record<string, unknown> = {
    ...panelPropsFromState({ ...state, panelKind }),
    placement: state.placement,
    trigger: state.trigger,
    disabled: state.disabled,
  };

  const openTag = buildVueOpeningTag('EgTooltip', anchoredProps, {
    defaults: {
      placement: tooltipCustomizeDefaults.placement,
      trigger: tooltipCustomizeDefaults.trigger,
      panelKind,
      widthMode: tooltipCustomizeDefaults.widthMode,
      height: Number.parseInt(tooltipCustomizeDefaults.height, 10),
      disabled: tooltipCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  });

  const label = String(state.triggerLabel ?? tooltipCustomizeDefaults.triggerLabel);
  return `${openTag}
  <EgButton variant="outline">${label}</EgButton>
  <template #content />
</EgTooltip>`;
}

export function buildTooltipPanelSectionUsageSnippet(
  panelKind: TooltipPanelKindValue,
  state: Record<string, unknown>,
): string {
  return buildAnchoredTooltipUsageSnippet(state, panelKind);
}

function panelPropsFromState(state: Record<string, unknown>): Record<string, unknown> {
  const panelKind = String(state.panelKind ?? tooltipCustomizeDefaults.panelKind);
  const props: Record<string, unknown> = {
    panelKind: state.panelKind,
    widthMode: state.widthMode,
    align: state.align ?? tooltipCustomizeDefaults.align,
  };

  const offset = parseAnchoredContainerOptionalInt(state.offset);
  if (offset !== undefined) props.offset = offset;

  const crossAxisOffset = parseAnchoredContainerOptionalInt(state.crossAxisOffset);
  if (crossAxisOffset !== undefined) props.crossAxisOffset = crossAxisOffset;

  const heightMode =
    String(state.heightMode ?? '').trim() !== ''
      ? String(state.heightMode)
      : panelKind !== 'container'
        ? 'fixed'
        : 'adaptive';
  props.heightMode = heightMode;

  if (heightMode === 'fixed') {
    const height = Number.parseInt(String(state.height ?? ''), 10);
    if (Number.isFinite(height)) props.height = height;
  }

  if (isFixedWidth(state)) {
    const width = Number.parseInt(String(state.width ?? ''), 10);
    if (Number.isFinite(width)) props.width = width;
  }

  const maxHeightRaw = String(state.maxHeight ?? '').trim();
  if (maxHeightRaw !== '') {
    const maxHeight = Number.parseInt(maxHeightRaw, 10);
    if (Number.isFinite(maxHeight)) props.maxHeight = maxHeight;
  }

  const panelRadius = String(state.panelRadius ?? '').trim();
  if (panelRadius !== '') {
    props.panelRadius = panelRadius;
  }

  return props;
}

export function buildTooltipSectionCustomizeDefaults(
  panelKind: TooltipPanelKindValue,
): Record<string, unknown> {
  return {
    panelKind,
    panelRadius: tooltipCustomizeDefaults.panelRadius,
    widthMode: tooltipCustomizeDefaults.widthMode,
    width: tooltipCustomizeDefaults.width,
    height: tooltipCustomizeDefaults.height,
    heightMode: panelKind === 'container' ? 'adaptive' : tooltipCustomizeDefaults.heightMode,
    maxHeight: tooltipCustomizeDefaults.maxHeight,
    placement: tooltipCustomizeDefaults.placement,
    align: tooltipCustomizeDefaults.align,
    offset: tooltipCustomizeDefaults.offset,
    crossAxisOffset: tooltipCustomizeDefaults.crossAxisOffset,
    trigger: tooltipCustomizeDefaults.trigger,
    tooltipTrigger: tooltipCustomizeDefaults.tooltipTrigger,
    disabled: tooltipCustomizeDefaults.disabled,
    triggerLabel: tooltipCustomizeDefaults.triggerLabel,
  };
}

export function buildTooltipUsageSnippet(state: Record<string, unknown>): string {
  const panelKind = String(state.panelKind ?? tooltipCustomizeDefaults.panelKind) as TooltipPanelKindValue;
  return buildAnchoredTooltipUsageSnippet(state, panelKind);
}

export function buildTooltipPanelKindPageUsageSnippet(
  panelKind: TooltipPanelKindValue,
  state: Record<string, unknown>,
): string {
  return buildAnchoredTooltipUsageSnippet({ ...state, panelKind }, panelKind);
}

export function findTooltipPanelKindSection(pageSlug: string): TooltipPanelKindSection | undefined {
  if (pageSlug === 'flotation-container-tooltip') {
    return tooltipPanelKindSections.find((section) => section.panelKind === 'container');
  }
  if (isTooltipOverflowSceneSlug(pageSlug)) {
    return undefined;
  }
  if (pageSlug === 'tooltip-flotation') {
    return tooltipPanelKindSections.find((section) => section.id === 'tooltip-flotation');
  }
  return tooltipPanelKindSections.find((section) => section.id === pageSlug);
}

export const tooltipPropRows: DocPropRow[] = [
  {
    name: 'panelKind',
    type: "'container' | 'flotation' | 'popup' | 'subtle' | 'molde'",
    defaultValue: "'flotation'",
    description:
      'container → effect-container-box；flotation → effect-flotation-box；popup → effect-popup-box；subtle → effect-subtle-card；molde → effect-molde-level。',
  },
  {
    name: 'panelRadius',
    type: "'radius-0' | 'radius-xs' | 'radius-sm' | 'radius-md' | 'radius-lg' | 'radius-full'",
    defaultValue: showcaseText('Press panelKind (container/flotation/subtle → radius-md; popup → radius-lg; molde → none)', '按 panelKind（container/flotation/subtle → radius-md；popup → radius-lg；molde → 无）'),
    description:
      showcaseText('[doc] PanelRadius，only Scale Radius token（--radius-*）。when panelKind in effect semantic DefaultRadius。', '面板圆角，仅允许 Scale Radius token（--radius-*）。未传时使用各 panelKind 在 effect semantic 中的默认圆角。'),
  },
  {
    name: 'widthMode',
    type: "'adaptive' | 'fixed'",
    defaultValue: "'adaptive'",
    description: showcaseText('adaptive: width with content; fixed: use width.', 'adaptive：宽度随内容；fixed：使用 width。'),
  },
  {
    name: 'width',
    type: 'number',
    defaultValue: '—',
    description: showcaseText('fixed width in fixed mode (px).', 'fixed 模式下固定宽度（px）。'),
  },
  {
    name: 'maxWidth',
    type: 'number',
    defaultValue: '—',
    description: showcaseText('Optional maximum width (px).', '可选最大宽度（px）。'),
  },
  {
    name: 'heightMode',
    type: "'adaptive' | 'fixed'",
    defaultValue: "'adaptive'",
    description: showcaseText('adaptive: height is determined by effect semantic or content; fixed: uses height.', 'adaptive：高度由 effect semantic 或内容决定；fixed：使用 height。'),
  },
  {
    name: 'height',
    type: 'number',
    defaultValue: '—',
    description: showcaseText('heightMode = panel height when fixed (px). The container scene is provided by the effect-container-box, do not pass.', 'heightMode=fixed 时面板高度（px）。container 场景由 effect-container-box 提供，勿传。'),
  },
  {
    name: 'maxHeight',
    type: 'number',
    defaultValue: '—',
    description: showcaseText('Optional maximum height (px); scrolls the content area vertically when exceeded.', '可选最大高度（px）；超出时内容区纵向滚动。'),
  },
];

export const anchoredTooltipPropRows: DocPropRow[] = [
  {
    name: 'trigger',
    type: "'click' | 'hover'",
    defaultValue: "'click'",
    description: showcaseText('click: click to toggle; right-click menu blocked in click mode.', 'click：点击切换；click 模式下阻止右键菜单。'),
  },
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'bottom'",
    description: showcaseText('The ejection direction relative to the trigger.', '相对触发器的弹出方向。'),
  },
  {
    name: 'offset',
    type: 'number',
    defaultValue: '--spacing-025 (1px)',
    description: showcaseText('Spindle-to-trigger spacing (px); read when not passing - spacing-025.', '主轴与触发器间距（px）；未传时读 --spacing-025。'),
  },
  {
    name: 'crossAxisOffset',
    type: 'number',
    defaultValue: showcaseText('Press align (start = -spacing-2, end = + spacing-2, center = 0)', '按 align（start=-spacing-2，end=+spacing-2，center=0）'),
    description: showcaseText('Cross-axis displacement (px); calculated as align and --spacing-2 when not transmitted.', '交叉轴位移（px）；未传时按 align 与 --spacing-2 计算。'),
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'start'",
    description: showcaseText('Cross-axis alignment; affects the default inset when crossAxisOffset is not passed.', '交叉轴对齐；同时影响未传 crossAxisOffset 时的默认 inset。'),
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Cannot be opened when true.', '为 true 时不可打开。'),
  },
  {
    name: 'panelKind / panelRadius / widthMode / width / height / maxHeight',
    type: '同 EgTooltip',
    defaultValue: showcaseText('See EgTooltip', '见 EgTooltip'),
    description: showcaseText('Transparent to internal EgTooltip.', '透传给内部 EgTooltip。'),
  },
  {
    name: 'tokenScopeClass',
    type: 'string',
    defaultValue: "'desktopTokens'",
    description: showcaseText('Teleport outer class for loading Desktop tokens.', 'Teleport 外层 class，用于加载 Desktop token。'),
  },
];

export const tooltipSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: '—',
    defaultValue: '—',
    description: showcaseText('EgTooltip: Trigger. EgTooltip: The panel content.', 'EgTooltip：触发器。EgTooltip：面板内容。'),
  },
  {
    name: 'content',
    type: '—',
    defaultValue: '—',
    description: showcaseText('EgTooltip: Teleport back panel content (packaged inside EgTooltip).', 'EgTooltip：Teleport 后面板内容（包在 EgTooltip 内）。'),
  },
];

export function tooltipPanelPropsForPreview(state: Record<string, unknown>) {
  return panelPropsFromState(state);
}

export function resolveTooltipPageComponentTag(pageSlug: string): string {
  if (pageSlug === 'tooltip-scene-text-overflow') {
    return 'EgTooltipOverflow';
  }
  return 'EgTooltip';
}

export function resolveTooltipPageImportCode(pageSlug: string): string {
  const tag = resolveTooltipPageComponentTag(pageSlug);
  return `import { ${tag} } from '@eds/desktop-components';`;
}
