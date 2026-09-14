<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
  type Ref,
} from 'vue';
import { POPOVER_MOTION_ACTIVE_KEY } from './popoverMotion';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import {
  buildPopoverOutlinePath,
  DEFAULT_POPOVER_PANEL,
  getPopoverShellMetrics,
  POPOVER_PANEL_H,
  POPOVER_PANEL_W,
  resolvePopoverPanelMins,
  type PopoverAlign,
  type PopoverPanelDimensions,
  type PopoverPlacement,
  type PopoverSize,
} from './popoverShape';
import '../../styles/overlayGlassMicroFloat.module.css';
import styles from './Popover.module.css';

export type PopoverWidthMode = 'fixed' | 'adaptive';
export type PopoverHeightMode = 'fixed' | 'adaptive';
export type { PopoverAlign, PopoverPlacement, PopoverSize };

const props = withDefaults(
  defineProps<{
    /** 弹出层相对锚点的方向；箭头落在朝向锚点的一侧。 */
    placement?: PopoverPlacement;
    /** 交叉轴对齐：top/bottom → 水平；left/right → 垂直。 */
    align?: PopoverAlign;
    /** 面板宽度模式：fixed 用 width；adaptive 随内容（受 maxWidth 约束）。 */
    widthMode?: PopoverWidthMode;
    /** 面板高度模式：fixed 用 height；adaptive 随内容（受 maxHeight 约束）。 */
    heightMode?: PopoverHeightMode;
    /** 面板区宽度（px）；widthMode=fixed 时生效，默认 340。 */
    width?: number;
    /** 面板区高度（px）；heightMode=fixed 时生效，默认 490。 */
    height?: number;
    /** 面板区最大宽度（px）；adaptive 或 fixed+可扩展时生效。 */
    maxWidth?: number;
    /** 面板区最大高度（px）；adaptive 或 fixed+可扩展时生效。 */
    maxHeight?: number;
    /** 启用微浮动进出场（overlay micro-float scenario）。 */
    microFloat?: boolean;
    /** 显式 active；未传且非 AnchoredTooltip 注入时，挂载后自动入场。 */
    active?: boolean;
    /** 顶部工具条（标题 + 可选关闭）；与 placement 独立，壳内布局一致。 */
    topTool?: boolean;
    topToolTitle?: string;
    /** 显示关闭按钮；点击 emit topToolClose。 */
    topToolClosable?: boolean;
    /** 插槽区内边距（px）；未传时 topTool 为上下左右 spacing-4（上 0）；否则四周 spacing-4。与 placement 无关。 */
    contentPaddingTop?: number;
    contentPaddingInline?: number;
    contentPaddingBottom?: number;
    /** default 常规面板；compact 单行短文案，adaptive 随内容收缩。 */
    size?: PopoverSize;
  }>(),
  {
    placement: 'bottom',
    align: 'center',
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    microFloat: true,
    topTool: false,
    topToolTitle: 'Title',
    topToolClosable: true,
    size: 'default',
  },
);

const emit = defineEmits<{
  topToolClose: [];
}>();

const injectedMotionActive = inject(POPOVER_MOTION_ACTIVE_KEY, null);
const localMotionActive = ref(false);
const CONTENT_OVERFLOW_EPSILON = 2;

const shellRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const contentSlotRef = ref<HTMLElement | null>(null);
const contentSlotOverflow = ref(false);
const panelMins = computed(() => resolvePopoverPanelMins(props.size));
const measuredPanel = ref<PopoverPanelDimensions>({
  panelW: resolvePopoverPanelMins(props.size).panelMinW,
  panelH: resolvePopoverPanelMins(props.size).panelMinH,
});

const motionActive = computed(() => {
  if (!props.microFloat) {
    return false;
  }
  if (injectedMotionActive) {
    return false;
  }
  if (props.active !== undefined) {
    return props.active;
  }
  return localMotionActive.value;
});

const showMotionClasses = computed(
  () => props.microFloat && !injectedMotionActive,
);

const usesAdaptiveWidth = computed(() => props.widthMode === 'adaptive');
const usesAdaptiveHeight = computed(() => props.heightMode === 'adaptive');

const resolvedFixedWidth = computed(() => props.width ?? POPOVER_PANEL_W);
const resolvedFixedHeight = computed(() => props.height ?? POPOVER_PANEL_H);

const panelDimensions = computed((): PopoverPanelDimensions => {
  let panelW = usesAdaptiveWidth.value
    ? measuredPanel.value.panelW
    : resolvedFixedWidth.value;
  let panelH = usesAdaptiveHeight.value
    ? measuredPanel.value.panelH
    : resolvedFixedHeight.value;

  if (props.maxWidth != null) {
    panelW = Math.min(panelW, props.maxWidth);
  }
  if (props.maxHeight != null) {
    panelH = Math.min(panelH, props.maxHeight);
  }

  return { panelW, panelH };
});

const shellMetrics = computed(() =>
  getPopoverShellMetrics(props.placement, panelDimensions.value, panelMins.value),
);

const outlinePath = computed(() =>
  buildPopoverOutlinePath(
    props.placement,
    props.align,
    panelDimensions.value,
    panelMins.value,
  ),
);

const clipPathStyle = computed(() => {
  const clip = `path("${outlinePath.value}")`;
  return {
    clipPath: clip,
    WebkitClipPath: clip,
  };
});

const motionClass = computed(() => (props.microFloat ? 'motion-flotation' : null));

const contentHostClass = computed(() => [
  styles.content,
  motionClass.value,
  (props.maxWidth != null || props.maxHeight != null) &&
    !showTopTool.value &&
    styles.contentConstrained,
]);

const showTopTool = computed(() => Boolean(props.topTool));

/** topTool：内容区上 0 / 左右下 spacing-4；与 placement 解耦，切方向不改变壳内布局。 */
const usesTopPlacementSlotPadding = computed(() => showTopTool.value);

const contentBodyClass = computed(() => [
  styles.contentBody,
  showTopTool.value && styles.contentBodyWithTopTool,
  usesAdaptiveWidth.value && styles.contentBodyAdaptiveWidth,
  usesAdaptiveHeight.value && styles.contentBodyAdaptiveHeight,
]);

const contentHostStyle = computed((): CSSProperties => {
  const inset = shellMetrics.value.contentInset;
  const style: CSSProperties = {};

  if (inset.top > 0) {
    style.paddingTop = `${inset.top}px`;
  }
  if (inset.right > 0) {
    style.paddingRight = `${inset.right}px`;
  }
  if (inset.bottom > 0) {
    style.paddingBottom = `${inset.bottom}px`;
  }
  if (inset.left > 0) {
    style.paddingLeft = `${inset.left}px`;
  }

  if (props.maxWidth != null && usesAdaptiveWidth.value) {
    style.maxWidth = `${props.maxWidth + inset.left + inset.right}px`;
  }
  if (props.maxHeight != null && usesAdaptiveHeight.value) {
    style.maxHeight = `${props.maxHeight + inset.top + inset.bottom}px`;
  }

  return style;
});

const contentBodyStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  if (!usesAdaptiveWidth.value) {
    style.width = `${resolvedFixedWidth.value}px`;
  } else {
    style.minWidth = `${panelMins.value.panelMinW}px`;
    if (props.maxWidth != null) {
      style.maxWidth = `${props.maxWidth}px`;
    }
  }

  if (!usesAdaptiveHeight.value) {
    style.height = `${resolvedFixedHeight.value}px`;
  } else {
    style.minHeight = `${panelMins.value.panelMinH}px`;
    if (props.maxHeight != null) {
      style.maxHeight = `${props.maxHeight}px`;
    }
  }

  return style;
});

const contentSlotStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  if (props.contentPaddingTop != null) {
    style.paddingTop = `${props.contentPaddingTop}px`;
  }
  if (props.contentPaddingInline != null) {
    style.paddingLeft = `${props.contentPaddingInline}px`;
    style.paddingRight = `${props.contentPaddingInline}px`;
  }
  if (props.contentPaddingBottom != null) {
    style.paddingBottom = `${props.contentPaddingBottom}px`;
  }

  return style;
});

let contentObserver: ResizeObserver | undefined;
let contentMutationObserver: MutationObserver | undefined;
let slotOverflowObserver: ResizeObserver | undefined;
let slotOverflowMutationObserver: MutationObserver | undefined;
let measureFrame = 0;

function updateContentSlotOverflow() {
  const element = contentSlotRef.value;

  if (!element || !showTopTool.value) {
    contentSlotOverflow.value = false;
    return;
  }

  contentSlotOverflow.value =
    element.scrollHeight - element.clientHeight > CONTENT_OVERFLOW_EPSILON;
}

function bindSlotOverflowObserver() {
  slotOverflowObserver?.disconnect();
  slotOverflowObserver = undefined;
  slotOverflowMutationObserver?.disconnect();
  slotOverflowMutationObserver = undefined;

  updateContentSlotOverflow();

  if (!showTopTool.value) {
    return;
  }

  const element = contentSlotRef.value;
  if (!element) {
    return;
  }

  slotOverflowObserver = new ResizeObserver(() => {
    updateContentSlotOverflow();
  });
  slotOverflowObserver.observe(element);

  slotOverflowMutationObserver = new MutationObserver(() => {
    updateContentSlotOverflow();
  });
  slotOverflowMutationObserver.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

function readPanelSizeFromShell(shell: HTMLElement): PopoverPanelDimensions {
  const rect = shell.getBoundingClientRect();
  const inset = getPopoverShellMetrics(
    props.placement,
    DEFAULT_POPOVER_PANEL,
    panelMins.value,
  ).contentInset;
  const { panelMinW, panelMinH } = panelMins.value;

  return {
    panelW: usesAdaptiveWidth.value
      ? Math.max(Math.ceil(rect.width - inset.left - inset.right), panelMinW)
      : resolvedFixedWidth.value,
    panelH: usesAdaptiveHeight.value
      ? Math.max(Math.ceil(rect.height - inset.top - inset.bottom), panelMinH)
      : resolvedFixedHeight.value,
  };
}

function measureContentPanel() {
  const shell = shellRef.value;
  if (!shell) {
    return;
  }

  const next = readPanelSizeFromShell(shell);

  if (
    next.panelW === measuredPanel.value.panelW &&
    next.panelH === measuredPanel.value.panelH
  ) {
    return;
  }

  measuredPanel.value = next;
}

function scheduleMeasureContentPanel() {
  cancelAnimationFrame(measureFrame);
  measureFrame = requestAnimationFrame(() => {
    measureContentPanel();
    measureFrame = requestAnimationFrame(measureContentPanel);
  });
}

function bindContentObserver() {
  contentObserver?.disconnect();
  contentObserver = undefined;
  contentMutationObserver?.disconnect();
  contentMutationObserver = undefined;

  if (!usesAdaptiveWidth.value && !usesAdaptiveHeight.value) {
    measuredPanel.value = {
      panelW: resolvedFixedWidth.value,
      panelH: resolvedFixedHeight.value,
    };
    return;
  }

  const shell = shellRef.value;
  const element = contentRef.value;
  if (!shell || !element) {
    return;
  }

  contentObserver = new ResizeObserver(() => {
    scheduleMeasureContentPanel();
  });
  contentObserver.observe(shell);
  contentObserver.observe(element);

  contentMutationObserver = new MutationObserver(() => {
    scheduleMeasureContentPanel();
  });
  contentMutationObserver.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  scheduleMeasureContentPanel();
}

watch(
  () => props.active,
  (value) => {
    if (!props.microFloat || injectedMotionActive || value === undefined) {
      return;
    }
    if (value) {
      requestAnimationFrame(() => {
        localMotionActive.value = true;
      });
      return;
    }
    localMotionActive.value = false;
  },
);

watch(
  () => [props.widthMode, props.heightMode, props.width, props.height, props.maxWidth, props.maxHeight, props.size],
  () => {
    measuredPanel.value = {
      panelW: panelMins.value.panelMinW,
      panelH: panelMins.value.panelMinH,
    };
    nextTick(() => {
      bindContentObserver();
      bindSlotOverflowObserver();
    });
  },
);

watch(showTopTool, () => {
  nextTick(() => bindSlotOverflowObserver());
});

const injectedMotionActiveRef = injectedMotionActive as Ref<boolean> | null;
if (injectedMotionActiveRef) {
  watch(
    () => injectedMotionActiveRef.value,
    (active) => {
      if (!active) {
        return;
      }
      nextTick(() => {
        bindContentObserver();
        bindSlotOverflowObserver();
        scheduleMeasureContentPanel();
      });
    },
  );
}

onMounted(() => {
  nextTick(() => {
    bindContentObserver();
    bindSlotOverflowObserver();
  });

  if (!props.microFloat || injectedMotionActive || props.active !== undefined) {
    return;
  }
  requestAnimationFrame(() => {
    localMotionActive.value = true;
  });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(measureFrame);
  contentObserver?.disconnect();
  contentMutationObserver?.disconnect();
  slotOverflowObserver?.disconnect();
  slotOverflowMutationObserver?.disconnect();
});
</script>

<template>
  <div
    class="eds-popover desktopTokens"
    :class="[
      styles.root,
      microFloat && showMotionClasses && 'glassMicroFloatHost',
      microFloat && showMotionClasses && motionActive && 'glassMicroFloatHostActive',
    ]"
  >
    <div ref="shellRef" :class="styles.shell">
      <div
        :class="[
          styles.shapeSurface,
          'effect-popover-box',
          motionClass,
        ]"
        :style="clipPathStyle"
        aria-hidden="true"
      />

      <svg
        :class="[styles.outline, motionClass]"
        :viewBox="shellMetrics.viewBox"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path :class="styles.shapeFill" :d="outlinePath" />
        <path :class="styles.shapeTint" :d="outlinePath" />
      </svg>

      <div :class="contentHostClass" :style="contentHostStyle">
        <div
          ref="contentRef"
          class="eds-popover-content"
          :class="contentBodyClass"
          :style="contentBodyStyle"
        >
          <div v-if="showTopTool" :class="styles.topTool">
            <p
              :class="[
                styles.topToolTitle,
                props.topToolClosable && styles.topToolTitleWithClose,
              ]"
            >
              {{ props.topToolTitle }}
            </p>
            <div v-if="props.topToolClosable" :class="styles.topToolClose">
              <EgIconButton
                shape="square"
                size="sm"
                label="关闭"
                motion="ease"
                @click="emit('topToolClose')"
              >
                <EgIcon name="eds-close-circle-fill" fit />
              </EgIconButton>
            </div>
          </div>
          <EgDivider
            v-if="showTopTool"
            type="page"
            direction="horizontal"
            :hide="!contentSlotOverflow"
          />
          <div
            ref="contentSlotRef"
            :class="[
              styles.contentSlot,
              usesTopPlacementSlotPadding
                ? styles.contentSlotPaddingTop
                : styles.contentSlotPaddingSide,
              showTopTool && styles.contentSlotWithTopTool,
            ]"
            :style="contentSlotStyle"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
