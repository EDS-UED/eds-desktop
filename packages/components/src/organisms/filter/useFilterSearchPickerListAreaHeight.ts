import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from 'vue';
import { readCssTokenLength } from '../../shared/cssSpacingTokens';

export function useFilterSearchPickerListAreaHeight(options: {
  scrollRef: Ref<HTMLElement | null>;
  searchQuery: Ref<string>;
  showSearchEmpty: ComputedRef<boolean>;
}) {
  const listAreaHeight = ref<number | null>(null);

  const listAreaStyle = computed(() => {
    if (!options.showSearchEmpty.value) return undefined;

    const captured = listAreaHeight.value;
    if (captured != null && captured > 0) {
      return { minHeight: `${captured}px` };
    }

    const element = options.scrollRef.value;
    if (element) {
      const fallback = readCssTokenLength(element, '--graphic-sm', 56);
      return { minHeight: `${fallback}px` };
    }

    return { minHeight: '56px' };
  });

  async function captureListAreaHeight() {
    await nextTick();
    const element = options.scrollRef.value;
    if (!element) return;
    const height = element.getBoundingClientRect().height;
    if (height > 0) {
      listAreaHeight.value = height;
    }
  }

  function resetListAreaHeight() {
    listAreaHeight.value = null;
  }

  function scheduleCaptureListAreaHeight() {
    void nextTick(() => {
      void captureListAreaHeight();
      requestAnimationFrame(() => {
        void captureListAreaHeight();
      });
    });
  }

  watch(
    () => options.showSearchEmpty.value,
    (empty) => {
      if (empty && listAreaHeight.value == null) {
        void captureListAreaHeight();
      }
    },
  );

  watch(options.searchQuery, (query, previous) => {
    if (!previous?.trim() && query.trim() && listAreaHeight.value == null) {
      void captureListAreaHeight();
    }
    if (!query.trim()) {
      listAreaHeight.value = null;
    }
  });

  function onScrollMetricsDepsChange() {
    if (!options.showSearchEmpty.value) {
      void captureListAreaHeight();
    }
  }

  return {
    listAreaStyle,
    resetListAreaHeight,
    scheduleCaptureListAreaHeight,
    onScrollMetricsDepsChange,
  };
}
