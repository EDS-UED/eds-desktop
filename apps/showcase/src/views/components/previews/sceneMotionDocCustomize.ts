import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { propLabelSelectOptions } from '@/data/showcasePropLabels';

export const sceneMotionScenarioLabels = {
  'verify-ring-dots': '验证外圈点阵',
  'done-tick': '成功',
  'motion-processing': '时间',
  'ripple-pulse': '波纹脉冲',
  'mnemonic-verify': '助记词校验中',
  odometer: '数字滚轮',
  gear: '自动齿轮',
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

export const sceneMotionGearToneLabels = {
  brand: '品牌',
  danger: '危险',
  warning: '警告',
} as const;

export const sceneMotionGearSizeLabels = {
  lg: 'lg（88）',
  md: 'md（64）',
  sm: 'sm（40）',
  xs: 'xs（16）',
  custom: '自定义',
} as const;

export type SceneMotionGearTone = keyof typeof sceneMotionGearToneLabels;
export type SceneMotionGearSize = keyof typeof sceneMotionGearSizeLabels;

export const sceneMotionCustomizeDefaults = {
  scenario: 'verify-ring-dots' as SceneMotionScenario,
  interaction: 'full' as SceneMotionInteraction,
  tone: 'brand' as SceneMotionTone,
  gearTone: 'brand' as SceneMotionGearTone,
  gearSize: 'lg' as SceneMotionGearSize,
  gearCustomSizePx: '88',
};

export const sceneMotionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: showcaseText('Scenes', '场景化'),
    options: propLabelSelectOptions(
      Object.keys(sceneMotionScenarioLabels) as SceneMotionScenario[],
      sceneMotionScenarioLabels,
    ),
  },
  {
    kind: 'select',
    key: 'interaction',
    label: showcaseText('Interaction', '交互'),
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
  label: showcaseText('Tone', '色调'),
  options: propLabelSelectOptions(
    Object.keys(sceneMotionToneLabels) as SceneMotionTone[],
    sceneMotionToneLabels,
  ),
};

export const sceneMotionProcessingToneControl: DocCustomizeControl = {
  kind: 'select',
  key: 'tone',
  label: showcaseText('Tone', '色调'),
  options: propLabelSelectOptions(
    Object.keys(sceneMotionProcessingToneLabels) as SceneMotionProcessingTone[],
    sceneMotionProcessingToneLabels,
  ),
};

export const sceneMotionGearToneControl: DocCustomizeControl = {
  kind: 'select',
  key: 'gearTone',
  label: showcaseText('Tone', '色调'),
  options: propLabelSelectOptions(
    Object.keys(sceneMotionGearToneLabels) as SceneMotionGearTone[],
    sceneMotionGearToneLabels,
  ),
};

export const sceneMotionGearSizeControl: DocCustomizeControl = {
  kind: 'select',
  key: 'gearSize',
  label: showcaseText('Size', '尺寸'),
  options: propLabelSelectOptions(
    Object.keys(sceneMotionGearSizeLabels) as SceneMotionGearSize[],
    sceneMotionGearSizeLabels,
  ),
};

export const sceneMotionGearCustomSizeControl: DocCustomizeControl = {
  kind: 'text',
  key: 'gearCustomSizePx',
  label: showcaseText('Custom size (px)', '自定义尺寸（px）'),
  placeholder: '88',
  visibleWhen: (state) => state.scenario === 'gear' && state.gearSize === 'custom',
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
  } else if (scenario === 'gear') {
    controls.push(sceneMotionGearToneControl);
    controls.push(sceneMotionGearSizeControl);
    controls.push(sceneMotionGearCustomSizeControl);
  }

  return controls;
}

export const sceneMotionOdometerImportCode =
  "import { EgOdometer } from '@eds/desktop-components';";

export const sceneMotionGearImportCode =
  "import { EgGear } from '@eds/desktop-components';";

export const sceneMotionGearPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText(
      'When true: vector-b ring CW, vector-a leaves CCW (paths from eds-automatic-gear.svg); when false, static.',
      '为 true 时 vector-b 齿环顺时针、vector-a 内三叶逆时针（path 来自 eds-automatic-gear.svg）；false 静止。',
    ),
  },
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description: showcaseText(
      'Color via --gear-color (default var(--material-base-primary); brand var(--material-brand-primary), danger var(--status-danger), warning var(--status-warning)). Size via --gear-size (default var(--icon-lg); Showcase presets lg 88 / md 64 / sm 40 / xs 16 px).',
      '颜色由 --gear-color 控制（默认 var(--material-base-primary)；品牌 var(--material-brand-primary)、危险 var(--status-danger)、警告 var(--status-warning)）。尺寸由 --gear-size 控制（默认 var(--icon-lg)；Showcase 预设 lg 88 / md 64 / sm 40 / xs 16 px）。',
    ),
  },
];

export const sceneMotionOdometerPropRows: DocPropRow[] = [
  {
    name: 'value',
    type: 'number | string',
    defaultValue: '0',
    description: showcaseText(
      'Single field value; strings may carry formatting (e.g. $8,888,888.88) and only digits roll. Display typography + --material-base-primary via --odometer-color.',
      '单字段显示值；字符串可带格式（如 $8,888,888.88），仅其中数字滚动。Display 字号，颜色默认 --material-base-primary（--odometer-color）。',
    ),
  },
  {
    name: 'animateIntro',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText(
      'When true: on mount each digit starts at its real value and rolls one full turn back to it; later value updates are instant.',
      '为 true 时：挂载时每位数字以真实值为起点，滚动一整圈回到真实值；之后 value 变更不再动画。',
    ),
  },
];

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
    description: showcaseText(
      'When true: 36-dot chase light (--verify-ring-dot-color: var(--material-brand-primary)); when false: static (--material-brand-tertiary).',
      '为 true 时 36 点追光（--verify-ring-dot-color: var(--material-brand-primary)）；false 时静止（--material-brand-tertiary）。',
    ),
  },
];

export const sceneMotionDoneTickPropRows: DocPropRow[] = [
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description: showcaseText(
      'EgDoneTick has no props; plays SVG stroke animation on mount (eds-animation-done timing). Color via --done-tick-color (default var(--status-success); brand var(--material-brand-primary)).',
      'EgDoneTick 无 props；挂载后播放 SVG 描边动画（eds-animation-done 时序）；颜色由 --done-tick-color 控制（默认 var(--status-success)，品牌 var(--material-brand-primary)）。',
    ),
  },
];

export const sceneMotionMotionProcessingPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText(
      'When true: major axis 1.2s / minor axis 20s independent uniform rotation (minor axis starts at 45°); when false: static. --motion-processing-size scales axis length/center (base 26); --motion-processing-stroke line width (default 2px, not scaled with size); --motion-processing-color color.',
      '为 true 时长轴 1.2s / 短轴 20s 独立匀速旋转（短轴初始 45°）；false 时静止。--motion-processing-size 缩放轴长/中心点（基准 26）；--motion-processing-stroke 线宽（默认 2px，不随 size 变）；--motion-processing-color 颜色。',
    ),
  },
];

export const sceneMotionRipplePulsePropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText(
      'When true: triple-ring ripple (1.5s ease-out, 500ms stagger, scale 0.1→1.2); when false: static. --ripple-pulse-size (80px) / --ripple-pulse-stroke (0.5px) / --ripple-pulse-duration / --ripple-pulse-stagger / --ripple-pulse-start-scale / --ripple-pulse-end-scale / --ripple-pulse-color.',
      '为 true 时三环 ripple（1.5s ease-out，stagger 500ms，scale 0.1→1.2）；false 时静止。--ripple-pulse-size（80px）/ --ripple-pulse-stroke（0.5px）/ --ripple-pulse-duration / --ripple-pulse-stagger / --ripple-pulse-start-scale / --ripple-pulse-end-scale / --ripple-pulse-color。',
    ),
  },
];

export const sceneMotionMnemonicVerifyPropRows: DocPropRow[] = [
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText(
      'When true: 4×4 blocks scale 0→1→0 along the diagonal (1533ms / 100ms stagger, Lottie 46f@30fps); when false: static full grid. --mnemonic-verify-size (32px) / --mnemonic-verify-duration / --mnemonic-verify-stagger / --mnemonic-verify-color.',
      '为 true 时 4×4 方块沿对角线 scale 0→1→0（1533ms / stagger 100ms，Lottie 46f@30fps）；false 时静止满格。--mnemonic-verify-size（32px）/ --mnemonic-verify-duration / --mnemonic-verify-stagger / --mnemonic-verify-color。',
    ),
  },
];
