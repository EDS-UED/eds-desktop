<script setup lang="ts">
import {
  MOTION_LAYOUT_DEFORM_CONTENT,
  MOTION_LAYOUT_DEFORM_CONTENT_ENTERING,
  MOTION_LAYOUT_DEFORM_CONTENT_EXITING,
  MOTION_LAYOUT_DEFORM_TO_LARGER,
  MOTION_LAYOUT_DEFORM_TO_SMALLER,
  useMotionLayoutDeformPageSwitch,
} from '@eds/desktop-components';
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
</script>

<template>
  <div :class="pageStyles.previewPage">
    <div class="desktopTokens" :class="styles.page">
      <p :class="styles.note">
        临时 Demo · 离场/入场均为 translateY(+offset) → 0（对齐 HTML demo）。
      </p>

      <div :class="styles.stage">
        <button
          type="button"
          :class="styles.toggle"
          @click="toggleBetween('a', 'b')"
        >
          切换 A / B
        </button>

        <div
          :class="['motion-layout-deform', styles.shell]"
          :style="{ width: `${PANEL_WIDTH}px`, height: `${shellHeight}px` }"
        >
          <div
            :class="[
              MOTION_LAYOUT_DEFORM_CONTENT,
              contentDirection,
              contentExiting && MOTION_LAYOUT_DEFORM_CONTENT_EXITING,
              contentEntering && MOTION_LAYOUT_DEFORM_CONTENT_ENTERING,
            ]"
          >
            <div
              v-if="activePage === 'a'"
              :class="[styles.content, styles.pageA]"
            >
              <div :class="styles.title">Popover A</div>
              <div :class="styles.item">高度：200px</div>
              <div :class="styles.item">内容区域</div>
            </div>
            <div v-else :class="[styles.content, styles.pageB]">
              <div :class="styles.title">Popover B</div>
              <div :class="styles.item">高度：150px</div>
            </div>
          </div>
        </div>

        <p :class="styles.meta">
          {{ contentDirection === MOTION_LAYOUT_DEFORM_TO_SMALLER ? 'A→B · 变矮' : contentDirection === MOTION_LAYOUT_DEFORM_TO_LARGER ? 'B→A · 变高' : '—' }}
          · shell {{ shellHeight }}px
        </p>
      </div>
    </div>
  </div>
</template>
