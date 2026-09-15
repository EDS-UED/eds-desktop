<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import PageHeader from '@/components/shared/PageHeader.vue';
import CatalogPageAnchors from '@/components/shared/CatalogPageAnchors.vue';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import {
  resolveComponentFamilyDescription,
  resolveComponentFamilyName,
} from '@/data/i18n/resolveShowcaseCatalogText';
import { findSceneCatalogItem, getSceneRouteSlug, sceneAnchorItems } from '@/data/scenes';
import styles from '../components/ComponentsView.module.css';
import shared from '@/views/shared/showcase.module.css';

const route = useRoute();
const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const activeSlug = computed(() => getSceneRouteSlug(route.path, route.params.slug));

const catalogLocation = computed(() => findSceneCatalogItem(activeSlug.value));

const headerTitle = computed(() => {
  void locale.value;
  const item = catalogLocation.value?.item;
  if (item) return resolveComponentFamilyName(item.name);
  return i18n.name('nav:components', 'Scenes');
});

const headerLead = computed(() => {
  void locale.value;
  const item = catalogLocation.value?.item;
  if (!item) return '';
  return resolveComponentFamilyDescription(i18n, item.slug, item.description);
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
      route-prefix="scenes"
      aria-label="Scenes navigation"
      :items="sceneAnchorItems"
    />
  </div>
</template>
