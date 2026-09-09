import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueOpeningTag } from '@/views/shared/componentDoc/buildUsageSnippet';
import type {
  PopoverAlign,
  PopoverHeightMode,
  PopoverPlacement,
  PopoverWidthMode,
  ButtonTone,
} from '@eds/desktop-components';
import {
  showcaseTooltipCustomizeFieldLabels,
  triggerRows,
  buttonToneRows,
} from '@/data/showcasePropLabels';
import {
  buildAnchoredContainerPanelControls,
  parseAnchoredContainerOptionalInt,
} from './anchoredContainerDocCustomize';

export const popoverComponentImportCode = `import {
  EgAnchoredPopover,
  EgTooltip,
  EgButton,
  EgPopover,
} from '@eds/desktop-components';`;

export const popoverSceneImportCode = `import {
  EgButton,
  EgConfirmPopover,
  EgGasFeePopover,
  EgGuidancePopover,
  EgRemarkPopover,
} from '@eds/desktop-components';`;

export const popoverGasFeeNetworkOptions = [
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'ethereum', label: 'Ethereum Mainnet' },
  { value: 'ton', label: 'The Open Network' },
  { value: 'tron', label: 'Tron' },
] as const;

export type PopoverGasFeeNetwork = (typeof popoverGasFeeNetworkOptions)[number]['value'];

export const popoverPlacementOptions = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
] as const;

export const popoverAlignOptions = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
] as const;

export const popoverSceneScenarioOptions = [
  { value: 'guidance', label: '引导' },
  { value: 'remark', label: '备注' },
  { value: 'gas-fee', label: '矿工费' },
  { value: 'confirm', label: '二次确认' },
] as const;

export type PopoverSceneScenario = (typeof popoverSceneScenarioOptions)[number]['value'];

export type PopoverScenario = 'component' | PopoverSceneScenario;

export const popoverComponentCustomizeDefaults = {
  scenario: 'component',
  placement: 'top',
  align: 'center',
  trigger: 'hover',
  disabled: false,
  triggerLabel: '触发',
  slotContent: 'Popover 内容',
  guidanceBody: '引导说明文案',
  guidanceActionLabel: '知道了',
  widthMode: 'fixed',
  presetWidth: '336',
  heightMode: 'adaptive',
  width: '336',
  height: '490',
  maxWidth: '',
  maxHeight: '',
  crossAxisOffset: '',
  topTool: true,
  topToolTitle: 'Title',
  topToolClosable: true,
  remarkPlaceholder: 'Please enter',
  remarkFeedback: 'Optional, Max. 256 characters',
  remarkConfirmLabel: 'Confirm',
  confirmMessage: 'Alternate text, are you sure you want to do this?',
  confirmActionLabel: 'Confirm',
  confirmTone: 'danger',
  gasFeeNetwork: 'ethereum',
  gasFeeMulti: false,
} as const;

export const popoverSceneCustomizeDefaults = {
  ...popoverComponentCustomizeDefaults,
  scenario: 'guidance',
} as const;

export const popoverWidthModeOptions = [
  { value: 'adaptive', label: '自适应 adaptive' },
  { value: 'fixed', label: '固定 fixed' },
  { value: 'preset', label: '预置宽度 preset' },
] as const;

export const popoverPresetWidthOptions = [
  { value: '256', label: '256（引导）' },
  { value: '336', label: '336（基础业务）' },
  { value: '460', label: '460（复杂业务）' },
] as const;

const L = showcaseTooltipCustomizeFieldLabels;

function isPopoverWidthPreset(state: Record<string, unknown>): boolean {
  return String(state.widthMode ?? popoverComponentCustomizeDefaults.widthMode) === 'preset';
}

function isPopoverWidthFixed(state: Record<string, unknown>): boolean {
  return String(state.widthMode ?? popoverComponentCustomizeDefaults.widthMode) === 'fixed';
}

function isPopoverWidthFixedOrPreset(state: Record<string, unknown>): boolean {
  return isPopoverWidthFixed(state) || isPopoverWidthPreset(state);
}

function isPopoverHeightFixed(state: Record<string, unknown>): boolean {
  return String(state.heightMode ?? popoverComponentCustomizeDefaults.heightMode) === 'fixed';
}

function isPopoverPlacementTop(state: Record<string, unknown>): boolean {
  return String(state.placement ?? popoverComponentCustomizeDefaults.placement) === 'top';
}

function isPopoverTopToolEnabled(state: Record<string, unknown>): boolean {
  return isPopoverPlacementTop(state) && Boolean(state.topTool);
}

function isPopoverGuidanceScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoverComponentCustomizeDefaults.scenario) === 'guidance';
}

function isPopoverRemarkScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoverComponentCustomizeDefaults.scenario) === 'remark';
}

function isPopoverGasFeeScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoverComponentCustomizeDefaults.scenario) === 'gas-fee';
}

function isPopoverConfirmScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoverComponentCustomizeDefaults.scenario) === 'confirm';
}

function isPopoverComponentScenario(state: Record<string, unknown>): boolean {
  const scenario = String(state.scenario ?? popoverComponentCustomizeDefaults.scenario);
  return (
    scenario !== 'guidance'
    && scenario !== 'remark'
    && scenario !== 'gas-fee'
    && scenario !== 'confirm'
  );
}

const POPOVER_SCENARIO_PRESETS: Record<PopoverScenario, Record<string, unknown>> = {
  component: {
    placement: 'top',
    align: 'center',
    trigger: 'hover',
    widthMode: 'fixed',
    width: '336',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Title',
    topToolClosable: true,
    triggerLabel: '触发',
    slotContent: 'Popover 内容',
  },
  guidance: {
    placement: 'top',
    align: 'center',
    trigger: 'hover',
    widthMode: 'preset',
    presetWidth: '256',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Title',
    topToolClosable: false,
    triggerLabel: '悬浮我',
    guidanceBody: '引导说明文案',
    guidanceActionLabel: '知道了',
  },
  remark: {
    placement: 'top',
    align: 'center',
    trigger: 'click',
    widthMode: 'fixed',
    width: '336',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Remark',
    topToolClosable: true,
    triggerLabel: '备注',
    remarkPlaceholder: 'Please enter',
    remarkFeedback: 'Optional, Max. 256 characters',
    remarkConfirmLabel: 'Confirm',
  },
  'gas-fee': {
    placement: 'top',
    align: 'center',
    trigger: 'click',
    widthMode: 'fixed',
    width: '336',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Gas Fee',
    topToolClosable: true,
    triggerLabel: '矿工费',
    gasFeeNetwork: 'ethereum',
  },
  confirm: {
    placement: 'bottom',
    align: 'center',
    trigger: 'click',
    widthMode: 'fixed',
    width: '296',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Title',
    topToolClosable: true,
    triggerLabel: '二次确认',
    confirmMessage: 'Alternate text, are you sure you want to do this?',
    confirmActionLabel: 'Confirm',
    confirmTone: 'danger',
  },
};

export function applyPopoverScenarioPreset(
  target: Record<string, unknown>,
  scenario: PopoverScenario,
): void {
  Object.assign(target, POPOVER_SCENARIO_PRESETS[scenario]);
}

function isPopoverTopToolClosableVisible(state: Record<string, unknown>): boolean {
  return (
    isPopoverTopToolEnabled(state)
    || isPopoverRemarkScenario(state)
    || isPopoverGasFeeScenario(state)
    || isPopoverConfirmScenario(state)
    || isPopoverComponentScenario(state)
  );
}

function buildPopoverPanelCustomizeControls(
  state: Record<string, unknown>,
  rowOffset = 0,
): DocCustomizeControl[] {
  const metaRow = rowOffset + 3;
  const geometry = buildAnchoredContainerPanelControls(state, {
    rowOffset,
    includeOffset: false,
    alignVisibleWhen: () => true,
    widthModeOptions: popoverWidthModeOptions.map((row) => ({
      key: row.value,
      label: row.label.replace(/\s+\w+$/, ''),
    })),
  });

  return [
    ...geometry,
    {
      kind: 'select',
      key: 'presetWidth',
      label: '预置宽度',
      row: rowOffset + 1,
      options: popoverPresetWidthOptions.map((row) => ({ value: row.value, label: row.label })),
      visibleWhen: isPopoverWidthPreset,
    },
    {
      kind: 'text',
      key: 'maxWidth',
      label: '最大宽度',
      row: rowOffset + 1,
      visibleWhen: (s) => !isPopoverWidthFixedOrPreset(s),
    },
    {
      kind: 'select',
      key: 'trigger',
      label: L.trigger,
      row: metaRow,
      options: triggerRows.map((row) => ({ value: row.key, label: row.label })),
    },
  ];
}

const popoverPanelCustomizeControls: DocCustomizeControl[] = buildPopoverPanelCustomizeControls(
  popoverComponentCustomizeDefaults,
);

const popoverTopToolCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'boolean',
    key: 'topToolClosable',
    label: '显示关闭',
    row: 4,
    visibleWhen: isPopoverTopToolClosableVisible,
  },
];

export const popoverComponentCustomizeControls: DocCustomizeControl[] = [
  ...buildPopoverPanelCustomizeControls(popoverComponentCustomizeDefaults),
  {
    kind: 'text',
    key: 'topToolTitle',
    label: '标题',
    row: 4,
    visibleWhen: isPopoverTopToolEnabled,
  },
  {
    kind: 'text',
    key: 'slotContent',
    label: '插槽内容',
    row: 4,
  },
  ...popoverTopToolCustomizeControls,
];

const popoverSceneScenarioCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'text',
    key: 'guidanceBody',
    label: '引导正文',
    visibleWhen: isPopoverGuidanceScenario,
  },
  {
    kind: 'text',
    key: 'guidanceActionLabel',
    label: '按钮文案',
    visibleWhen: isPopoverGuidanceScenario,
  },
  {
    kind: 'text',
    key: 'remarkPlaceholder',
    label: '占位符',
    visibleWhen: isPopoverRemarkScenario,
  },
  {
    kind: 'text',
    key: 'remarkFeedback',
    label: '辅助说明',
    visibleWhen: isPopoverRemarkScenario,
  },
  {
    kind: 'text',
    key: 'remarkConfirmLabel',
    label: '确认按钮',
    visibleWhen: isPopoverRemarkScenario,
  },
  {
    kind: 'select',
    key: 'gasFeeNetwork',
    label: '矿工费网络',
    options: popoverGasFeeNetworkOptions.map((row) => ({ value: row.value, label: row.label })),
    visibleWhen: isPopoverGasFeeScenario,
  },
  {
    kind: 'boolean',
    key: 'gasFeeMulti',
    label: '多笔',
    visibleWhen: isPopoverGasFeeScenario,
  },
  {
    kind: 'text',
    key: 'confirmMessage',
    label: '确认正文',
    visibleWhen: isPopoverConfirmScenario,
  },
  {
    kind: 'text',
    key: 'confirmActionLabel',
    label: '确认按钮',
    visibleWhen: isPopoverConfirmScenario,
  },
  {
    kind: 'select',
    key: 'confirmTone',
    label: '确认 tone',
    options: buttonToneRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: isPopoverConfirmScenario,
  },
];

export const popoverSceneCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: '场景',
    row: 0,
    options: popoverSceneScenarioOptions.map((row) => ({ value: row.value, label: row.label })),
  },
  ...buildPopoverPanelCustomizeControls(popoverSceneCustomizeDefaults, 1),
  {
    kind: 'text',
    key: 'topToolTitle',
    label: '标题',
    row: 5,
    visibleWhen: (state) =>
      isPopoverTopToolEnabled(state)
      || isPopoverRemarkScenario(state)
      || isPopoverGasFeeScenario(state)
      || isPopoverConfirmScenario(state),
  },
  ...popoverSceneScenarioCustomizeControls,
  {
    kind: 'text',
    key: 'triggerLabel',
    label: L.triggerLabel,
    row: 5,
  },
  ...popoverTopToolCustomizeControls,
];

const CUSTOMIZE_ONLY_KEYS = new Set([
  'triggerLabel',
  'scenario',
  'slotContent',
  'guidanceBody',
  'guidanceActionLabel',
  'remarkPlaceholder',
  'remarkFeedback',
  'remarkConfirmLabel',
  'confirmMessage',
  'confirmActionLabel',
  'confirmTone',
  'gasFeeNetwork',
  'gasFeeMulti',
]);

function parseOptionalPx(value: unknown): number | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolvePopoverWidthPx(state: Record<string, unknown>): number | undefined {
  if (isPopoverWidthPreset(state)) {
    return parseOptionalPx(state.presetWidth ?? popoverComponentCustomizeDefaults.presetWidth);
  }
  if (isPopoverWidthFixed(state)) {
    return parseOptionalPx(state.width);
  }
  return undefined;
}

function buildPopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    widthMode: isPopoverWidthFixedOrPreset(state) ? 'fixed' : state.widthMode,
    heightMode: state.heightMode,
  };

  const crossAxisOffset = parseAnchoredContainerOptionalInt(state.crossAxisOffset);
  if (crossAxisOffset !== undefined) {
    props.crossAxisOffset = crossAxisOffset;
  }

  const width = resolvePopoverWidthPx(state);
  const height = parseOptionalPx(state.height);
  const maxWidth = parseOptionalPx(state.maxWidth);
  const maxHeight = parseOptionalPx(state.maxHeight);

  if (isPopoverWidthFixedOrPreset(state) && width != null) {
    props.width = width;
  }
  if (!isPopoverWidthFixedOrPreset(state) && maxWidth != null) {
    props.maxWidth = maxWidth;
  }
  if (isPopoverHeightFixed(state) && height != null) {
    props.height = height;
  }
  if (!isPopoverHeightFixed(state) && maxHeight != null) {
    props.maxHeight = maxHeight;
  }

  if (String(state.placement) === 'top') {
    const isGuidance = String(state.scenario ?? popoverComponentCustomizeDefaults.scenario) === 'guidance';
    props.topTool = isGuidance ? true : Boolean(state.topTool);
    if (props.topTool) {
      props.topToolTitle = String(state.topToolTitle ?? popoverComponentCustomizeDefaults.topToolTitle);
      props.topToolClosable = Boolean(state.topToolClosable);
    }
  }

  return props;
}

export function buildRemarkPopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const popoverProps = buildPopoverProps(state);

  const props: Record<string, unknown> = {
    placement: popoverProps.placement,
    align: popoverProps.align,
    widthMode: popoverProps.widthMode,
    heightMode: popoverProps.heightMode,
    topToolClosable: Boolean(state.topToolClosable),
  };

  if (popoverProps.width != null) {
    props.width = popoverProps.width;
  }
  if (popoverProps.maxWidth != null) {
    props.maxWidth = popoverProps.maxWidth;
  }
  if (popoverProps.height != null) {
    props.height = popoverProps.height;
  }
  if (popoverProps.maxHeight != null) {
    props.maxHeight = popoverProps.maxHeight;
  }

  return props;
}

export type ConfirmPopoverPreviewBindings = {
  message: string;
  title: string;
  confirmLabel: string;
  confirmTone: ButtonTone;
  placement: PopoverPlacement;
  align: PopoverAlign;
  widthMode: PopoverWidthMode;
  heightMode: PopoverHeightMode;
  topToolClosable: boolean;
  width?: number;
  maxWidth?: number;
  height?: number;
  maxHeight?: number;
};

export function buildConfirmPopoverProps(
  state: Record<string, unknown>,
): ConfirmPopoverPreviewBindings {
  const popoverProps = buildPopoverProps(state);

  const props: ConfirmPopoverPreviewBindings = {
    placement: popoverProps.placement as PopoverPlacement,
    align: popoverProps.align as PopoverAlign,
    widthMode: popoverProps.widthMode as PopoverWidthMode,
    heightMode: popoverProps.heightMode as PopoverHeightMode,
    topToolClosable: Boolean(state.topToolClosable),
    message: String(state.confirmMessage ?? popoverComponentCustomizeDefaults.confirmMessage),
    confirmLabel: String(
      state.confirmActionLabel ?? popoverComponentCustomizeDefaults.confirmActionLabel,
    ),
    confirmTone: String(state.confirmTone ?? popoverComponentCustomizeDefaults.confirmTone) as ButtonTone,
    title: String(state.topToolTitle ?? popoverComponentCustomizeDefaults.topToolTitle),
  };

  if (popoverProps.width != null) {
    props.width = popoverProps.width as number;
  }
  if (popoverProps.maxWidth != null) {
    props.maxWidth = popoverProps.maxWidth as number;
  }
  if (popoverProps.height != null) {
    props.height = popoverProps.height as number;
  }
  if (popoverProps.maxHeight != null) {
    props.maxHeight = popoverProps.maxHeight as number;
  }

  return props;
}

export function buildGuidancePopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const popoverProps = buildPopoverProps(state);

  const props: Record<string, unknown> = {
    placement: popoverProps.placement,
    align: popoverProps.align,
    widthMode: popoverProps.widthMode,
    heightMode: popoverProps.heightMode,
    topToolClosable: Boolean(state.topToolClosable),
    body: String(state.guidanceBody ?? popoverComponentCustomizeDefaults.guidanceBody),
    actionLabel: String(
      state.guidanceActionLabel ?? popoverComponentCustomizeDefaults.guidanceActionLabel,
    ),
    title: String(state.topToolTitle ?? popoverComponentCustomizeDefaults.topToolTitle),
  };

  if (popoverProps.width != null) {
    props.width = popoverProps.width;
  }
  if (popoverProps.maxWidth != null) {
    props.maxWidth = popoverProps.maxWidth;
  }
  if (popoverProps.height != null) {
    props.height = popoverProps.height;
  }
  if (popoverProps.maxHeight != null) {
    props.maxHeight = popoverProps.maxHeight;
  }

  return props;
}

export function buildGasFeePopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const popoverProps = buildPopoverProps(state);

  const props: Record<string, unknown> = {
    placement: popoverProps.placement,
    align: popoverProps.align,
    widthMode: popoverProps.widthMode,
    heightMode: popoverProps.heightMode,
    topToolClosable: Boolean(state.topToolClosable),
    network: String(state.gasFeeNetwork ?? popoverComponentCustomizeDefaults.gasFeeNetwork),
    translate: 'ui',
    transactionCount: Boolean(state.gasFeeMulti) ? 3 : 1,
    title: String(state.topToolTitle ?? 'Gas Fee'),
  };

  if (popoverProps.width != null) {
    props.width = popoverProps.width;
  }
  if (popoverProps.maxWidth != null) {
    props.maxWidth = popoverProps.maxWidth;
  }
  if (popoverProps.height != null) {
    props.height = popoverProps.height;
  }
  if (popoverProps.maxHeight != null) {
    props.maxHeight = popoverProps.maxHeight;
  }

  return props;
}

function buildScenePopoverTriggerSnippet(label: string): string {
  return `  <template #trigger="{ active, onClick }">
    <EgButton variant="outline" :aria-expanded="active" @click="onClick">
      ${label}
    </EgButton>
  </template>`;
}

export function buildPopoverSceneUsageSnippet(state: Record<string, unknown>): string {
  const label = String(state.triggerLabel ?? popoverComponentCustomizeDefaults.triggerLabel);

  if (isPopoverConfirmScenario(state)) {
    const confirmOpen = buildVueOpeningTag(
      'EgConfirmPopover',
      buildConfirmPopoverProps(state),
      {
        defaults: {
          placement: 'bottom',
          align: popoverComponentCustomizeDefaults.align,
          widthMode: popoverComponentCustomizeDefaults.widthMode,
          width: 296,
          topToolClosable: popoverComponentCustomizeDefaults.topToolClosable,
          message: popoverComponentCustomizeDefaults.confirmMessage,
          confirmLabel: popoverComponentCustomizeDefaults.confirmActionLabel,
          confirmTone: popoverComponentCustomizeDefaults.confirmTone,
          title: 'Title',
        },
      },
    ).replace(/>$/, '\n  @confirm="onConfirm">');

    return `${confirmOpen}
${buildScenePopoverTriggerSnippet(label)}
</EgConfirmPopover>`;
  }

  if (isPopoverRemarkScenario(state)) {
    const remarkOpen = buildVueOpeningTag(
      'EgRemarkPopover',
      {
        ...buildRemarkPopoverProps(state),
        title: String(state.topToolTitle ?? 'Remark'),
        placeholder: String(
          state.remarkPlaceholder ?? popoverComponentCustomizeDefaults.remarkPlaceholder,
        ),
        'feedback-text': String(
          state.remarkFeedback ?? popoverComponentCustomizeDefaults.remarkFeedback,
        ),
        'confirm-label': String(
          state.remarkConfirmLabel ?? popoverComponentCustomizeDefaults.remarkConfirmLabel,
        ),
      },
      {
        defaults: {
          placement: popoverComponentCustomizeDefaults.placement,
          align: popoverComponentCustomizeDefaults.align,
          widthMode: popoverComponentCustomizeDefaults.widthMode,
          width: Number.parseInt(popoverComponentCustomizeDefaults.width, 10),
          topToolClosable: popoverComponentCustomizeDefaults.topToolClosable,
        },
      },
    ).replace(/>$/, '\n  v-model="remark"\n  @confirm="onRemarkConfirm">');

    return `${remarkOpen}
${buildScenePopoverTriggerSnippet(label)}
</EgRemarkPopover>`;
  }

  if (isPopoverGasFeeScenario(state)) {
    const gasFeeOpen = buildVueOpeningTag('EgGasFeePopover', buildGasFeePopoverProps(state), {
      defaults: {
        placement: popoverComponentCustomizeDefaults.placement,
        align: popoverComponentCustomizeDefaults.align,
        widthMode: popoverComponentCustomizeDefaults.widthMode,
        width: Number.parseInt(popoverComponentCustomizeDefaults.width, 10),
        network: popoverComponentCustomizeDefaults.gasFeeNetwork,
        title: 'Gas Fee',
      },
    }).replace(/>$/, '\n  @confirm="onGasFeeConfirm">');

    return `${gasFeeOpen}
${buildScenePopoverTriggerSnippet(label)}
</EgGasFeePopover>`;
  }

  const guidanceOpen = buildVueOpeningTag('EgGuidancePopover', buildGuidancePopoverProps(state), {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      widthMode: 'fixed',
      width: 256,
      topToolClosable: false,
      body: popoverComponentCustomizeDefaults.guidanceBody,
      actionLabel: popoverComponentCustomizeDefaults.guidanceActionLabel,
      title: 'Title',
    },
  }).replace(/>$/, '\n  @action="onGuidanceAction">');

  return `${guidanceOpen}
${buildScenePopoverTriggerSnippet(label)}
</EgGuidancePopover>`;
}

export function buildPopoverComponentUsageSnippet(state: Record<string, unknown>): string {
  const anchoredProps: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    trigger: state.trigger,
    disabled: state.disabled,
    'wrap-tooltip': false,
  };

  const openTag = buildVueOpeningTag('EgTooltip', anchoredProps, {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      trigger: popoverComponentCustomizeDefaults.trigger,
      disabled: popoverComponentCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  }).replace(/>$/, '\n  :wrap-tooltip="false">');

  const popoverOpen = buildVueOpeningTag('EgPopover', buildPopoverProps(state), {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      widthMode: popoverComponentCustomizeDefaults.widthMode,
      heightMode: popoverComponentCustomizeDefaults.heightMode,
      width: Number.parseInt(popoverComponentCustomizeDefaults.width, 10),
      height: Number.parseInt(popoverComponentCustomizeDefaults.height, 10),
    },
  });

  const label = String(state.triggerLabel ?? popoverComponentCustomizeDefaults.triggerLabel);

  return `${openTag}
  <EgButton variant="outline">${label}</EgButton>
  <template #content>
    ${popoverOpen}
      <!-- 插槽内容：bottom/left/right 默认四周 spacing-4；top 默认上 0、左右/下 spacing-4 -->
      <div><!-- … --></div>
    </EgPopover>
  </template>
</EgTooltip>`;
}

export const popoverPropRows: DocPropRow[] = [
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'bottom'",
    description: '相对锚点的弹出方向；箭头落在朝向锚点的一侧。',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'center'",
    description: '交叉轴对齐：top/bottom 控制水平位置；left/right 控制垂直位置。',
  },
  {
    name: 'widthMode',
    type: "'fixed' | 'adaptive'",
    defaultValue: "'fixed'",
    description:
      '面板宽度模式：fixed 使用 width（默认 336）；adaptive 随 slot 内容（受 maxWidth 约束）。Showcase 另有 preset（256/336/460 预置宽，映射为 fixed + width）。',
  },
  {
    name: 'width',
    type: 'number',
    defaultValue: '336',
    description: 'widthMode=fixed 时面板区宽度（px，不含箭头）。预置宽见 Showcase presetWidth。',
  },
  {
    name: 'maxWidth',
    type: 'number',
    defaultValue: '-',
    description: 'widthMode=adaptive 时面板区最大宽度（px）。',
  },
  {
    name: 'heightMode',
    type: "'fixed' | 'adaptive'",
    defaultValue: "'adaptive'",
    description: '面板高度模式：fixed 使用 height；adaptive 随 slot 内容（受 maxHeight 约束）。',
  },
  {
    name: 'height',
    type: 'number',
    defaultValue: '490',
    description: 'heightMode=fixed 时面板区高度（px，不含箭头）。',
  },
  {
    name: 'maxHeight',
    type: 'number',
    defaultValue: '-',
    description: 'heightMode=adaptive 时面板区最大高度（px）。',
  },
  {
    name: 'topTool',
    type: 'boolean',
    defaultValue: 'false',
    description: 'placement=top 时顶部工具条（标题 + 可选关闭）。',
  },
  {
    name: 'topToolTitle',
    type: 'string',
    defaultValue: "'Title'",
    description: 'topTool 标题文案。',
  },
  {
    name: 'topToolClosable',
    type: 'boolean',
    defaultValue: 'true',
    description: 'topTool 显示关闭按钮；点击 emit topToolClose。',
  },
  {
    name: 'contentPaddingTop',
    type: 'number',
    defaultValue: 'placement 默认',
    description: '插槽区内边距上（px）。未传：placement=top 为 0；bottom/left/right 为 spacing-4。',
  },
  {
    name: 'contentPaddingInline',
    type: 'number',
    defaultValue: 'spacing-4',
    description: '插槽区内边距左右（px）；未传时使用 spacing-4。',
  },
  {
    name: 'contentPaddingBottom',
    type: 'number',
    defaultValue: 'spacing-4',
    description: '插槽区内边距下（px）；未传时使用 spacing-4。',
  },
  {
    name: 'microFloat',
    type: 'boolean',
    defaultValue: 'true',
    description: '启用微浮动进出场（semantic `.motion-flotation` + spring）。',
  },
];

export const popoverSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description:
      '弹出层内容；默认内边距：placement=top 为上 0 / 左右下 spacing-4；bottom/left/right 为四周 spacing-4。可用 contentPadding* props 覆盖。',
  },
];

export const POPOVER_PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const satisfies readonly PopoverPlacement[];

export const POPOVER_ALIGNS = ['start', 'center', 'end'] as const satisfies readonly PopoverAlign[];

export {
  buildPopoverPanelCustomizeControls,
  buildPopoverProps,
  isPopoverConfirmScenario,
  isPopoverGasFeeScenario,
  isPopoverGuidanceScenario,
  isPopoverHeightFixed,
  isPopoverRemarkScenario,
  isPopoverWidthFixed,
  isPopoverWidthPreset,
};
