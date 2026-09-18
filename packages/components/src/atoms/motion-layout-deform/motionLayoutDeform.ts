import { ref, type Ref } from 'vue';
import { createMotionLayoutContentSwitchIdle, MOTION_LAYOUT_CONTENT_SWAP_MS } from '../motion-layout-content/motionLayoutContent';

export const MOTION_LAYOUT_DEFORM_TO_SMALLER = 'motion-layout-deform-to-smaller' as const;
/** 变高（如 B→A）· 仅作方向标记（shell 高度推断）；内容位移见 glue CSS */
export const MOTION_LAYOUT_DEFORM_TO_LARGER = 'motion-layout-deform-to-larger' as const;

export type MotionLayoutDeformDirection =
  | typeof MOTION_LAYOUT_DEFORM_TO_SMALLER
  | typeof MOTION_LAYOUT_DEFORM_TO_LARGER;

export type MotionLayoutDeformPageSpec = {
  shellHeight: number;
};

function resolveDirection<T extends string>(
  pages: Record<T, MotionLayoutDeformPageSpec>,
  from: T,
  to: T,
): MotionLayoutDeformDirection {
  const fromHeight = pages[from].shellHeight;
  const toHeight = pages[to].shellHeight;
  return toHeight < fromHeight
    ? MOTION_LAYOUT_DEFORM_TO_SMALLER
    : MOTION_LAYOUT_DEFORM_TO_LARGER;
}

export function useMotionLayoutDeformPageSwitch<T extends string>(
  pages: Record<T, MotionLayoutDeformPageSpec>,
  initial: NoInfer<T>,
  swapMs: number = MOTION_LAYOUT_CONTENT_SWAP_MS,
): {
  activePage: Ref<T>;
  shellHeight: Ref<number>;
  contentExiting: Ref<boolean>;
  contentEntering: Ref<boolean>;
  contentDirection: Ref<MotionLayoutDeformDirection | null>;
  switchTo: (next: T) => void;
  toggleBetween: (left: T, right: T) => void;
  whenIdle: () => Promise<void>;
} {
  const activePage = ref(initial) as Ref<T>;
  const shellHeight = ref(pages[initial].shellHeight);
  const contentDirection = ref<MotionLayoutDeformDirection | null>(null);
  const contentIdle = createMotionLayoutContentSwitchIdle(swapMs);

  function switchTo(next: T) {
    if (
      next === activePage.value &&
      !contentIdle.contentExiting.value &&
      !contentIdle.contentEntering.value
    ) {
      void contentIdle.whenIdle();
      return;
    }

    const direction = resolveDirection(pages, activePage.value, next);
    contentDirection.value = direction;
    shellHeight.value = pages[next].shellHeight;

    contentIdle.runSwitch(() => {
      activePage.value = next;
    });
  }

  function toggleBetween(left: T, right: T) {
    switchTo(activePage.value === left ? right : left);
  }

  return {
    activePage,
    shellHeight,
    contentExiting: contentIdle.contentExiting,
    contentEntering: contentIdle.contentEntering,
    contentDirection,
    switchTo,
    toggleBetween,
    whenIdle: contentIdle.whenIdle,
  };
}
