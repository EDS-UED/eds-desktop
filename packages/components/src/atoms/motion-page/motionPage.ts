import { computed, onBeforeUnmount, ref, type ComputedRef, type Ref } from 'vue';

export const MOTION_PAGE_CONTENT = 'motion-layout-content' as const;
export const MOTION_PAGE_STACK = 'motion-page-stack' as const;

export type MotionPageDirection = 'forward' | 'backward' | 'none';

export type MotionPageStackProps = {
  class: string;
  'data-page-direction': MotionPageDirection;
};

export type MotionPageTransitionHandlers = {
  onBeforeEnter: () => void;
  onBeforeLeave: () => void;
  onAfterEnter: () => void;
  onAfterLeave: () => void;
};

function createMotionPageTransitionIdle(): {
  isAnimating: ComputedRef<boolean>;
  handlers: MotionPageTransitionHandlers;
  reset: () => void;
} {
  const pending = ref(0);
  const isAnimating = computed(() => pending.value > 0);

  function onBeforeEnter() {
    pending.value += 1;
  }

  function onBeforeLeave() {
    pending.value += 1;
  }

  function onAfterEnter() {
    pending.value = Math.max(0, pending.value - 1);
  }

  function onAfterLeave() {
    pending.value = Math.max(0, pending.value - 1);
  }

  function reset() {
    pending.value = 0;
  }

  return {
    isAnimating,
    handlers: {
      onBeforeEnter,
      onBeforeLeave,
      onAfterEnter,
      onAfterLeave,
    },
    reset,
  };
}

/** 手动 `<Transition name="motion-page">` 时：direction + 动画锁定。 */
export function useMotionPageTransition(initialDirection: MotionPageDirection = 'none'): {
  direction: Ref<MotionPageDirection>;
  isAnimating: ComputedRef<boolean>;
  stackProps: ComputedRef<MotionPageStackProps>;
  transitionHandlers: MotionPageTransitionHandlers;
  setDirection: (next: MotionPageDirection) => void;
} {
  const direction = ref<MotionPageDirection>(initialDirection);
  const idle = createMotionPageTransitionIdle();

  const stackProps = computed(
    (): MotionPageStackProps => ({
      class: [MOTION_PAGE_STACK, idle.isAnimating.value ? 'is-animating' : '']
        .filter(Boolean)
        .join(' '),
      'data-page-direction': direction.value,
    }),
  );

  function setDirection(next: MotionPageDirection) {
    direction.value = next;
  }

  onBeforeUnmount(() => {
    idle.reset();
  });

  return {
    direction,
    isAnimating: idle.isAnimating,
    stackProps,
    transitionHandlers: idle.handlers,
    setDirection,
  };
}

/** Navigation Stack · A→B 带返回页面切换（Push / Pop）。 */
export function useMotionPageStack(initialId: string): {
  stack: Ref<string[]>;
  currentId: ComputedRef<string>;
  pageKey: ComputedRef<string>;
  direction: Ref<MotionPageDirection>;
  isAnimating: ComputedRef<boolean>;
  canPop: ComputedRef<boolean>;
  stackProps: ComputedRef<MotionPageStackProps>;
  transitionHandlers: MotionPageTransitionHandlers;
  push: (id: string) => void;
  pop: () => void;
  reset: (id?: string) => void;
} {
  const stack = ref<string[]>([initialId]);
  const direction = ref<MotionPageDirection>('none');
  const idle = createMotionPageTransitionIdle();

  const currentId = computed(() => stack.value[stack.value.length - 1] as string);
  const pageKey = computed(() => currentId.value);
  const canPop = computed(() => stack.value.length > 1);

  const stackProps = computed(
    (): MotionPageStackProps => ({
      class: [MOTION_PAGE_STACK, idle.isAnimating.value ? 'is-animating' : '']
        .filter(Boolean)
        .join(' '),
      'data-page-direction': direction.value,
    }),
  );

  function push(id: string) {
    if (idle.isAnimating.value || id === currentId.value) {
      return;
    }
    direction.value = 'forward';
    stack.value.push(id);
  }

  function pop() {
    if (idle.isAnimating.value || stack.value.length <= 1) {
      return;
    }
    direction.value = 'backward';
    stack.value.pop();
  }

  function reset(id: string = initialId) {
    idle.reset();
    direction.value = 'none';
    stack.value = [id];
  }

  onBeforeUnmount(() => {
    idle.reset();
  });

  return {
    stack,
    currentId,
    pageKey,
    direction,
    isAnimating: idle.isAnimating,
    canPop,
    stackProps,
    transitionHandlers: idle.handlers,
    push,
    pop,
    reset,
  };
}
