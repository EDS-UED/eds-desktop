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
import { findPatternCatalogItem, patternAnchorItems } from '@/data/patterns';
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

const catalogLocation = computed(() => findPatternCatalogItem(activeSlug.value));

const headerTitle = computed(() => {
  void locale.value;
  const item = catalogLocation.value?.item;
  if (item) return resolveComponentFamilyName(item.name);
  return i18n.name('nav:patterns', 'Patterns');
});

const headerLead = computed(() => {
  void locale.value;
  const item = catalogLocation.value?.item;
  if (item) {
    return resolveComponentFamilyDescription(i18n, item.slug, item.description);
  }
  return display('可复用页面与数据组合。');
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
      route-prefix="patterns"
      aria-label="Patterns navigation"
      :items="patternAnchorItems"
    />
  </div>
</template>
