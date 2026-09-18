<script setup lang="ts">
import { computed } from 'vue';
import {
  EgMotionLayoutContent,
  MOTION_LAYOUT_DEFORM_TO_LARGER,
  MOTION_LAYOUT_DEFORM_TO_SMALLER,
  useMotionLayoutDeformPageSwitch,
} from '@eds/desktop-components';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import pageStyles from './InputPreview.module.css';
import styles from './LayoutDeformDemoPreview.module.css';

const PANEL_WIDTH = 300;

const pages = {
  a: { shellHeight: 200 },
  b: { shellHeight: 150 },
} as const;

const {
  activePage,
  shellHeight,
  contentExiting,
  contentEntering,
  contentDirection,
  toggleBetween,
} = useMotionLayoutDeformPageSwitch<keyof typeof pages>(pages, 'a');

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const demoNote = showcaseText(
  'Temporary Demo · Both exit and enter use translateY(+offset) → 0 (aligned with HTML demo).',
  '临时 Demo · 离场/入场均为 translateY(+offset) → 0（对齐 HTML demo）。',
);
const switchPagesLabel = showcaseText('Switch A / B', '切换 A / B');
const height200Label = showcaseText('Height: 200px', '高度：200px');
const height150Label = showcaseText('Height: 150px', '高度：150px');
const contentAreaLabel = showcaseText('Content area', '内容区域');
const shrinkDirectionLabel = showcaseText('A→B · Shorter', 'A→B · 变矮');
const growDirectionLabel = showcaseText('B→A · Taller', 'B→A · 变高');

const resolvedDemoNote = computed(() => {
  void locale.value;
  return display(demoNote);
});

const resolvedSwitchPagesLabel = computed(() => {
  void locale.value;
  return display(switchPagesLabel);
});

const resolvedHeight200Label = computed(() => {
  void locale.value;
  return display(height200Label);
});

const resolvedHeight150Label = computed(() => {
  void locale.value;
  return display(height150Label);
});

const resolvedContentAreaLabel = computed(() => {
  void locale.value;
  return display(contentAreaLabel);
});

const resolvedDirectionMeta = computed(() => {
  void locale.value;
  if (contentDirection.value === MOTION_LAYOUT_DEFORM_TO_SMALLER) {
    return display(shrinkDirectionLabel);
  }
  if (contentDirection.value === MOTION_LAYOUT_DEFORM_TO_LARGER) {
    return display(growDirectionLabel);
  }
  return '—';
});
</script>

<template>
  <div :class="pageStyles.previewPage">
    <div class="desktopTokens" :class="styles.page">
      <p :class="styles.note">
        {{ resolvedDemoNote }}
      </p>

      <div :class="styles.stage">
        <button
          type="button"
          :class="styles.toggle"
          @click="toggleBetween('a', 'b')"
        >
          {{ resolvedSwitchPagesLabel }}
        </button>

        <div
          :class="['motion-layout-deform', styles.shell]"
          :style="{ width: `${PANEL_WIDTH}px`, height: `${shellHeight}px` }"
        >
          <EgMotionLayoutContent
            :class="contentDirection"
            :content-exiting="contentExiting"
            :content-entering="contentEntering"
          >
            <div
              v-if="activePage === 'a'"
              :class="[styles.content, styles.pageA]"
            >
              <div :class="styles.title">Popover A</div>
              <div :class="styles.item">{{ resolvedHeight200Label }}</div>
              <div :class="styles.item">{{ resolvedContentAreaLabel }}</div>
            </div>
            <div v-else :class="[styles.content, styles.pageB]">
              <div :class="styles.title">Popover B</div>
              <div :class="styles.item">{{ resolvedHeight150Label }}</div>
            </div>
          </EgMotionLayoutContent>
        </div>

        <p :class="styles.meta">
          {{ resolvedDirectionMeta }}
          · shell {{ shellHeight }}px
        </p>
      </div>
    </div>
  </div>
</template>
