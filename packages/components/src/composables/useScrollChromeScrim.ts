import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue';

export const SCROLL_CHROME_EDGE_EPSILON = 2;

export type ScrollChromeScrimState = {
  canScroll: boolean;
  topScrim: boolean;
  bottomScrim: boolean;
};

export function readScrollChromeScrimState(
  element: HTMLElement,
  epsilon = SCROLL_CHROME_EDGE_EPSILON,
): ScrollChromeScrimState {
  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > epsilon;

  return {
    canScroll,
    topScrim: canScroll && scrollTop > epsilon,
    bottomScrim:
      canScroll && scrollTop + clientHeight < scrollHeight - epsilon,
  };
}

const EMPTY_STATE: ScrollChromeScrimState = {
  canScroll: false,
  topScrim: false,
  bottomScrim: false,
};

export type UseScrollChromeScrimOptions = {
  epsilon?: number;
  contentRef?: Ref<HTMLElement | null>;
};

/** 单滚动容器顶/底缘状态（§13 / consumer useScrollChromeScrim 对齐）。 */
export function useScrollChromeScrim(
  scrollRef: Ref<HTMLElement | null>,
  options: UseScrollChromeScrimOptions = {},
) {
  const canScroll = ref(false);
  const topScrim = ref(false);
  const bottomScrim = ref(false);

  let resizeObserver: ResizeObserver | undefined;

  function applyState(state: ScrollChromeScrimState) {
    canScroll.value = state.canScroll;
    topScrim.value = state.topScrim;
    bottomScrim.value = state.bottomScrim;
  }

  function update() {
    const element = scrollRef.value;

    if (!element) {
      applyState(EMPTY_STATE);
      return;
    }

    applyState(readScrollChromeScrimState(element, options.epsilon));
  }

  function onScroll() {
    update();
  }

  function teardownScrollTarget(element: HTMLElement | null) {
    element?.removeEventListener('scroll', onScroll);
  }

  function observeTargets() {
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(() => {
      update();
    });

    const scrollElement = scrollRef.value;
    if (scrollElement) {
      resizeObserver.observe(scrollElement);
    }

    const contentElement = options.contentRef?.value;
    if (contentElement) {
      resizeObserver.observe(contentElement);
    }

    update();
  }

  function bind() {
    teardownScrollTarget(scrollRef.value);
    const scrollElement = scrollRef.value;

    if (!scrollElement) {
      applyState(EMPTY_STATE);
      return;
    }

    scrollElement.addEventListener('scroll', onScroll, { passive: true });
    observeTargets();
  }

  function scheduleBind() {
    void nextTick(bind);
  }

  onMounted(scheduleBind);

  watch(scrollRef, scheduleBind);

  watch(
    () => options.contentRef?.value,
    () => {
      observeTargets();
    },
  );

  onBeforeUnmount(() => {
    teardownScrollTarget(scrollRef.value);
    resizeObserver?.disconnect();
  });

  return {
    canScroll,
    topScrim,
    bottomScrim,
    update,
  };
}
