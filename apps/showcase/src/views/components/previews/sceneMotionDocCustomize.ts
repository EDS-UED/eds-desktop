import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { propLabelSelectOptions } from '@/data/showcasePropLabels';

export const sceneMotionScenarioLabels = {
  'verify-ring-dots': '验证外圈点阵',
  'done-tick': '成功',
  'motion-processing': '时间',
  'ripple-pulse': '波纹脉冲',
  'mnemonic-verify': '助记词校验中',
} as const;

export type SceneMotionScenario = keyof typeof sceneMotionScenarioLabels;

export const sceneMotionInteractionLabels = {
  full: '完整',
  idle: '默认',
  verifying: '进行中',
  success: '成功',
  error: '失败',
} as const;

export type SceneMotionInteraction = keyof typeof sceneMotionInteractionLabels;

export const sceneMotionToneLabels = {
  success: '成功',
  brand: '品牌',
} as const;

export const sceneMotionProcessingToneLabels = {
  warning: '进行中',
  brand: '品牌',
} as const;

export type SceneMotionTone = keyof typeof sceneMotionToneLabels;
export type SceneMotionProcessingTone = keyof typeof sceneMotionProcessingToneLabels;

export const sceneMotionCustomizeDefaults = {
  scenario: 'verify-ring-dots' as SceneMotionScenario,
  interaction: 'full' as SceneMotionInteraction,
  tone: 'brand' as SceneMotionTone,
};

export const sceneMotionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: '场景化',
    options: propLabelSelectOptions(
      Object.keys(sceneMotionScenarioLabels) as SceneMotionScenario[],
      sceneMotionScenarioLabels,
    ),
  },
  {
    kind: 'select',
    key: 'interaction',
    label: '交互',
    options: propLabelSelectOptions(
      Object.keys(sceneMotionInteractionLabels) as SceneMotionInteraction[],
      sceneMotionInteractionLabels,
    ),
    visibleWhen: (state) => state.scenario === 'verify-ring-dots',
  },
];

export const sceneMotionSuccessBrandToneControl: DocCustomizeControl = {
  kind: 'select',
  key: 'tone',
  label: '色调',
  options: propLabelSelectOptions(
    Object.keys(sceneMotionToneLabels) as SceneMotionTone[],
    sceneMotionToneLabels,
  ),
};

export const sceneMotionProcessingToneControl: DocCustomizeControl = {
  kind: 'select',
  key: 'tone',
  label: '色调',
  options: propLabelSelectOptions(
    Object.keys(sceneMotionProcessingToneLabels) as SceneMotionProcessingTone[],
    sceneMotionProcessingToneLabels,
  ),
};

export function buildSceneMotionCustomizeControls(options?: {
  lockScenario?: boolean;
  scenario?: SceneMotionScenario;
}): DocCustomizeControl[] {
  const scenario = options?.scenario ?? sceneMotionCustomizeDefaults.scenario;
  const controls: DocCustomizeControl[] = [];

  if (!options?.lockScenario) {
    controls.push(sceneMotionCustomizeControls[0]);
  }

  if (scenario === 'verify-ring-dots') {
    controls.push(sceneMotionCustomizeControls[1]);
    controls.push(sceneMotionSuccessBrandToneControl);
  } else if (scenario === 'motion-processing') {
    controls.push(sceneMotionProcessingToneControl);
  } else if (
    scenario === 'done-tick' ||
    scenario === 'ripple-pulse' ||
    scenario === 'mnemonic-verify'
  ) {
    controls.push(sceneMotionSuccessBrandToneControl);
  }

  return controls;
}

export const sceneMotionRingDotsImportCode =
  "import { EgVerifyRingDots } from '@eds/desktop-components';";

export const sceneMotionDoneTickImportCode =
  "import { EgDoneTick } from '@eds/desktop-components';";

export const sceneMotionMotionProcessingImportCode =
  "import { EgMotionProcessing } from '@eds/desktop-components';";

export const sceneMotionRipplePulseImportCode =
  "import { EgRipplePulse } from '@eds/desktop-components';";

export const sceneMotionMnemonicVerifyImportCode =
  "import { EgMnemonicVerify } from '@eds/desktop-components';";

export const sceneMotionRingDotsPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description:
      '为 true 时 36 点追光（--verify-ring-dot-color: var(--material-brand-primary)）；false 时静止（--material-brand-tertiary）。',
  },
];

export const sceneMotionDoneTickPropRows: DocPropRow[] = [
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description:
      'EgDoneTick 无 props；挂载后播放 SVG 描边动画（eds-animation-done 时序）；颜色由 --done-tick-color 控制（默认 var(--status-success)，品牌 var(--material-brand-primary)）。',
  },
];

export const sceneMotionMotionProcessingPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '为 true 时长轴 1.2s / 短轴 20s 独立匀速旋转（短轴初始 45°）；false 时静止。--motion-processing-size 缩放轴长/中心点（基准 26）；--motion-processing-stroke 线宽（默认 2px，不随 size 变）；--motion-processing-color 颜色。',
  },
];

export const sceneMotionRipplePulsePropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '为 true 时三环 ripple（1.5s ease-out，stagger 500ms，scale 0.1→1.2）；false 时静止。--ripple-pulse-size（80px）/ --ripple-pulse-stroke（0.5px）/ --ripple-pulse-duration / --ripple-pulse-stagger / --ripple-pulse-start-scale / --ripple-pulse-end-scale / --ripple-pulse-color。',
  },
];

export const sceneMotionMnemonicVerifyPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '为 true 时 4×4 方块沿对角线 scale 0→1→0（1533ms / stagger 100ms，Lottie 46f@30fps）；false 时静止满格。--mnemonic-verify-size（32px）/ --mnemonic-verify-duration / --mnemonic-verify-stagger / --mnemonic-verify-color。',
  },
];
