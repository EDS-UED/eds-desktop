<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import EgTabItem from './TabItem.vue';
import styles from './Tab.module.css';
import { useSlidingThumb } from './useSlidingThumb';
import { useTabsTrackPan } from './useTabsTrackPan';

export type TabsSpacingSize = 'xl' | 'md' | 'sm' | 'xs';
export type TabsWidthMode = 'adaptive' | 'fixed';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    labels?: string[];
    /** Tab 项水平间距（gap）。 */
    horizontalGap?: TabsSpacingSize;
    /** Tab 轨道与底部指示条之间的垂直间距（padding-bottom）。 */
    verticalGap?: TabsSpacingSize;
    /** 最外层容器宽度：adaptive=内容 hug；fixed=定宽容器，Tab 项布局不变。 */
    widthMode?: TabsWidthMode;
    /** widthMode=fixed 时可指定容器宽度（px）；未传则 width:100% 跟随父级。 */
    width?: number;
    /** 定宽溢出横向滚动时，左右边缘 mask 虚化。 */
    scrollFade?: boolean;
  }>(),
  {
    modelValue: 0,
    labels: () => ['Tab', 'Tab', 'Tab', 'Tab', 'Tab'],
    horizontalGap: 'xl',
    verticalGap: 'xl',
    widthMode: 'adaptive',
    width: undefined,
    scrollFade: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [index: number];
}>();

const horizontalGapClass = computed(() => {
  switch (props.horizontalGap) {
    case 'md':
      return styles.tabsHorizontalGapMd;
    case 'sm':
      return styles.tabsHorizontalGapSm;
    case 'xs':
      return styles.tabsHorizontalGapXs;
    default:
      return styles.tabsHorizontalGapXl;
  }
});

const verticalGapClass = computed(() => {
  switch (props.verticalGap) {
    case 'md':
      return styles.tabsVerticalGapMd;
    case 'sm':
      return styles.tabsVerticalGapSm;
    case 'xs':
      return styles.tabsVerticalGapXs;
    default:
      return styles.tabsVerticalGapXl;
  }
});

const items = computed(() => props.labels);
const activeIndex = toRef(props, 'modelValue');
const itemCount = computed(() => props.labels.length);

const rootRef = ref<HTMLElement | null>(null);
const clipRef = ref<HTMLElement | null>(null);

const isFixedContainerWidth = computed(() => props.widthMode === 'fixed');
const usesOverflowPan = computed(() => isFixedContainerWidth.value);

const rootStyle = computed(() => {
  if (!isFixedContainerWidth.value || props.width == null || props.width <= 0) {
    return undefined;
  }
  return { width: `${props.width}px` };
});

const scrollFadeLeft = ref(false);
const scrollFadeRight = ref(false);
let clipResizeObserver: ResizeObserver | undefined;

const { trackRef, setItemRef, thumbStyle, ready, scheduleUpdate, itemEls } = useSlidingThumb(
  activeIndex,
  itemCount,
);

const { trackPanX, trackPanReady, syncTrackPan, resolveScrollFade } = useTabsTrackPan({
  enabled: usesOverflowPan,
  clipRef,
  trackRef,
  activeIndex,
  itemEls,
  onPanChange: () => updateScrollFade(),
});

function updateScrollFade() {
  const clip = clipRef.value;
  const track = trackRef.value;

  if (!clip || !track || !usesOverflowPan.value || !props.scrollFade) {
    scrollFadeLeft.value = false;
    scrollFadeRight.value = false;
    return;
  }

  const fade = resolveScrollFade(clip.clientWidth, track.scrollWidth, true);
  scrollFadeLeft.value = fade.left;
  scrollFadeRight.value = fade.right;
}

const trackPanStyle = computed(() => {
  if (!usesOverflowPan.value) return undefined;
  return { transform: `translateX(${trackPanX.value}px)` };
});

function select(index: number) {
  emit('update:modelValue', index);
}

onMounted(() => {
  updateScrollFade();
  clipResizeObserver = new ResizeObserver(() => {
    syncTrackPan();
    scheduleUpdate();
  });
  if (clipRef.value) {
    clipResizeObserver.observe(clipRef.value);
  }
  if (trackRef.value) {
    clipResizeObserver.observe(trackRef.value);
  }
});

watch(clipRef, (nextElement, previousElement) => {
  if (previousElement) {
    clipResizeObserver?.unobserve(previousElement);
  }
  if (nextElement) {
    clipResizeObserver?.observe(nextElement);
  }
  syncTrackPan();
});

watch(trackRef, (nextElement, previousElement) => {
  if (previousElement) {
    clipResizeObserver?.unobserve(previousElement);
  }
  if (nextElement) {
    clipResizeObserver?.observe(nextElement);
  }
  syncTrackPan();
  scheduleUpdate();
});

watch(
  () => [props.widthMode, props.width, props.labels.length, props.scrollFade] as const,
  () => {
    syncTrackPan();
    updateScrollFade();
  },
);

onBeforeUnmount(() => {
  clipResizeObserver?.disconnect();
});
</script>

<template>
  <div
    ref="rootRef"
    :class="[styles.tabsRoot, isFixedContainerWidth && styles.tabsRootFixedWidth]"
    :style="rootStyle"
  >
    <div
      ref="clipRef"
      :class="[
        usesOverflowPan ? styles.tabsScrollViewport : styles.tabsClipPassive,
        usesOverflowPan && scrollFade && scrollFadeLeft && styles.tabsScrollFadeLeft,
        usesOverflowPan && scrollFade && scrollFadeRight && styles.tabsScrollFadeRight,
      ]"
    >
      <div
        ref="trackRef"
        class="eds-tabs"
        :class="[
          styles.tabs,
          horizontalGapClass,
          verticalGapClass,
          usesOverflowPan && styles.tabsTrackPannable,
          usesOverflowPan && trackPanReady && styles.tabsTrackPannableReady,
        ]"
        :style="trackPanStyle"
        role="tablist"
      >
        <EgTabItem
          v-for="(label, index) in items"
          :key="index"
          :ref="setItemRef(index)"
          :label="label"
          :selected="modelValue === index"
          @select="select(index)"
        />
        <span
          :class="[styles.tabsSlideIndicator, ready && styles.tabsSlideIndicatorReady]"
          :style="thumbStyle"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>
