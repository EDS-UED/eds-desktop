import type { CatalogSection } from '../types';
import type { SceneMotionScenario } from '@/views/components/previews/sceneMotionDocCustomize';

export type AnimationCatalogMeta = {
  slug: string;
  name: string;
  scenario: SceneMotionScenario;
  description: string;
};

export const animationCatalogMeta: AnimationCatalogMeta[] = [
  {
    slug: 'verification-ring-dots',
    name: 'VerificationRingDots',
    scenario: 'verify-ring-dots',
    description: '验证外圈点阵动画。',
  },
  {
    slug: 'business-success',
    name: 'BusinessSuccess',
    scenario: 'done-tick',
    description: '业务成功完成动效。',
  },
  {
    slug: 'business-processing',
    name: 'BusinessProcessing',
    scenario: 'motion-processing',
    description: '业务处理中时间动效。',
  },
  {
    slug: 'ripple-pulse',
    name: 'RipplePulse',
    scenario: 'ripple-pulse',
    description: '波纹脉冲动画。',
  },
  {
    slug: 'mnemonic-verification',
    name: 'MnemonicVerification',
    scenario: 'mnemonic-verify',
    description: '助记词校验中动画。',
  },
];

export const animationsCatalog: CatalogSection[] = [
  {
    title: 'Animations',
    items: animationCatalogMeta.map((entry) => ({
      name: entry.name,
      slug: entry.slug,
      description: entry.description,
      status: 'implemented' as const,
    })),
  },
];

export const defaultAnimationSlug = animationCatalogMeta[0].slug;

export function findAnimationMeta(slug: string): AnimationCatalogMeta | undefined {
  return animationCatalogMeta.find((entry) => entry.slug === slug);
}

export function isValidAnimationSlug(slug: string): boolean {
  return findAnimationMeta(slug) !== undefined;
}
