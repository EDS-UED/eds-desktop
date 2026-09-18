<script setup lang="ts">
import { EgButton, EgMotionPageStack } from '@eds/desktop-components';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { showcaseText } from '@/data/showcasePropLabels';
import styles from './MotionPageDemoPreview.module.css';

const { display } = useShowcaseDisplayText();

const demoNote = showcaseText(
  'Motion Page · macOS App Store Push / Pop. Home → Detail → Back.',
  'Motion Page · macOS App Store Push / Pop。Home → Detail → 返回。',
);
const homeTitle = showcaseText('Home', '首页');
const homeBody = showcaseText(
  'List page · tap below to push Detail.',
  '列表页 · 点击下方进入 Detail。',
);
const openDetailLabel = showcaseText('Open Detail', '进入 Detail');
const detailTitle = showcaseText('Detail', '详情');
const detailBody = showcaseText(
  'Detail page · pushed from the right with parallax.',
  '详情页 · 从右侧推进，旧页 parallax 后退。',
);
const backLabel = showcaseText('Back', '返回');
</script>

<template>
  <div :class="styles.root">
    <p :class="styles.note">{{ display(demoNote) }}</p>

    <div :class="[styles.viewport, 'desktopTokens']">
      <EgMotionPageStack initial-id="home">
        <template #default="{ currentId, push, pop, canPop }">
          <div v-if="currentId === 'home'" :class="styles.page">
            <h2 :class="styles.pageTitle">{{ display(homeTitle) }}</h2>
            <p :class="styles.pageBody">{{ display(homeBody) }}</p>
            <div :class="styles.actions">
              <EgButton size="sm" @click="push('detail')">
                {{ display(openDetailLabel) }}
              </EgButton>
            </div>
          </div>

          <div v-else :class="styles.page">
            <h2 :class="styles.pageTitle">{{ display(detailTitle) }}</h2>
            <p :class="styles.pageBody">{{ display(detailBody) }}</p>
            <div :class="styles.actions">
              <EgButton v-if="canPop" size="sm" variant="outline" @click="pop()">
                {{ display(backLabel) }}
              </EgButton>
            </div>
          </div>
        </template>
      </EgMotionPageStack>
    </div>
  </div>
</template>
