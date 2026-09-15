<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import PageHeader from '@/components/shared/PageHeader.vue';
import CatalogPageAnchors from '@/components/shared/CatalogPageAnchors.vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import {
  resolveComponentFamilyDescription,
  resolveComponentFamilyName,
} from '@/data/i18n/resolveShowcaseCatalogText';
import { animationAnchorItems, findAnimationMeta } from '@/data/animations';
import styles from '../components/ComponentsView.module.css';
import shared from '@/views/shared/showcase.module.css';

const route = useRoute();
const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();
const { display } = useShowcaseDisplayText();

const activeSlug = computed(() => {
  const param = route.params.slug;
  return typeof param === 'string' ? param : '';
});

const meta = computed(() => findAnimationMeta(activeSlug.value));

const headerTitle = computed(() => {
  void locale.value;
  if (meta.value) return resolveComponentFamilyName(meta.value.name);
  return i18n.name('nav:animations', 'Animations');
});

const headerLead = computed(() => {
  void locale.value;
  if (meta.value) {
    return display(meta.value.description);
  }
  return display('场景动画 — 可直接复用的成品动画资产。');
});

watch(activeSlug, () => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div :class="[styles.pageWithAnchors, styles.pageWithAnchorsWithAside]">
    <div :class="[shared.page, styles.componentPage]">
      <PageHeader :title="headerTitle" :lead="headerLead" />

      <RouterView :key="activeSlug" />
    </div>

    <CatalogPageAnchors
      route-prefix="animations"
      aria-label="Animations navigation"
      :items="animationAnchorItems"
    />
  </div>
</template>
