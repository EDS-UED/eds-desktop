import { computed, nextTick, onBeforeUnmount, ref, type ComputedRef, type Ref } from 'vue';

export const MOTION_LAYOUT_CONTENT = 'motion-layout-content' as const;
export const MOTION_LAYOUT_CONTENT_EXITING = 'is-exiting' as const;
export const MOTION_LAYOUT_CONTENT_ENTERING = 'is-entering' as const;

/** 与 `--motion-delay-layout-deform-content-swap` 一致 · 内容淡出中途换页 */
export const MOTION_LAYOUT_CONTENT_SWAP_MS = 120;

type MotionLayoutContentSwitchIdle = {
  contentExiting: Ref<boolean>;
  contentEntering: Ref<boolean>;
  isAnimating: ComputedRef<boolean>;
  runSwitch: (onSwap: () => void) => void;
  whenIdle: () => Promise<void>;
  reset: () => void;
};

export function createMotionLayoutContentSwitchIdle(
  swapMs: number = MOTION_LAYOUT_CONTENT_SWAP_MS,
): MotionLayoutContentSwitchIdle {
  const contentExiting = ref(false);
  const contentEntering = ref(false);
  const isAnimating = computed(() => contentExiting.value || contentEntering.value);

  let swapTimer: ReturnType<typeof setTimeout> | undefined;
  let enterFrame = 0;
  let idleResolvers: Array<() => void> = [];

  function clearSwapTimer() {
    if (swapTimer !== undefined) {
      clearTimeout(swapTimer);
      swapTimer = undefined;
    }
  }

  function clearEnterFrame() {
    if (enterFrame) {
      cancelAnimationFrame(enterFrame);
      enterFrame = 0;
    }
  }

  function notifyIdle() {
    if (contentExiting.value || contentEntering.value) {
      return;
    }
    const pending = idleResolvers;
    idleResolvers = [];
    pending.forEach((resolve) => resolve());
  }

  function whenIdle(): Promise<void> {
    if (!contentExiting.value && !contentEntering.value) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      idleResolvers.push(resolve);
    });
  }

  function reset() {
    clearSwapTimer();
    clearEnterFrame();
    contentExiting.value = false;
    contentEntering.value = false;
    idleResolvers = [];
  }

  function runSwitch(onSwap: () => void) {
    clearSwapTimer();
    clearEnterFrame();
    contentEntering.value = false;
    contentExiting.value = true;

    swapTimer = setTimeout(() => {
      onSwap();
      contentExiting.value = false;
      contentEntering.value = true;

      void nextTick(() => {
        enterFrame = requestAnimationFrame(() => {
          contentEntering.value = false;
          enterFrame = 0;
          notifyIdle();
        });
      });

      swapTimer = undefined;
    }, swapMs);
  }

  onBeforeUnmount(() => {
    reset();
  });

  return {
    contentExiting,
    contentEntering,
    isAnimating,
    runSwitch,
    whenIdle,
    reset,
  };
}

/** 同壳内容切换 · crossfade（Detail Tab、Segmented、Layout Deform / Motion Page 内层）。 */
export function useMotionLayoutContentSwitch(
  swapMs: number = MOTION_LAYOUT_CONTENT_SWAP_MS,
): {
  contentExiting: Ref<boolean>;
  contentEntering: Ref<boolean>;
  isAnimating: ComputedRef<boolean>;
  switchContent: (onSwap: () => void) => void;
  whenIdle: () => Promise<void>;
  reset: () => void;
} {
  const idle = createMotionLayoutContentSwitchIdle(swapMs);

  return {
    contentExiting: idle.contentExiting,
    contentEntering: idle.contentEntering,
    isAnimating: idle.isAnimating,
    switchContent: idle.runSwitch,
    whenIdle: idle.whenIdle,
    reset: idle.reset,
  };
}

export function motionLayoutContentClass(
  contentExiting: boolean,
  contentEntering: boolean,
): Array<string | false> {
  return [
    MOTION_LAYOUT_CONTENT,
    contentExiting && MOTION_LAYOUT_CONTENT_EXITING,
    contentEntering && MOTION_LAYOUT_CONTENT_ENTERING,
  ];
}
