<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { EgSearchInput } from '@eds/desktop-components';
import PageHeader from '@/components/shared/PageHeader.vue';
import ComponentsPageAnchors from '@/components/shared/ComponentsPageAnchors.vue';
import { findCatalogChildPage, findCatalogItem, getComponentRouteSlug } from '@/data/components/navigation';
import { componentAnchorItems } from '@/data/components';
import { anchorItemsForFamily } from '@/data/components/anchorItemsForFamily';
import { buildCatalogNavSegments } from '@/data/buildCatalogNavSegments';
import { findComponentsSidebarFamilyId } from '@/layout/buildComponentsSidebarSections';
import { componentPreviewBySlug, usesCompactComponentPreview, usesScrollComponentPreview } from '@/views/components/previews';
import { getIconsPageLead } from '@/views/components/previews/iconPreviewData';
import { getCryptoPageLead } from '@/views/components/previews/cryptoPreviewData';
import {
  atomsGallerySearchPlaceholder,
  isAtomsGallerySearchSlug,
  provideAtomsGallerySearch,
} from '@/views/components/previews/atomsGallerySearch';
import shared from '@/views/shared/showcase.module.css';
import styles from './ComponentsView.module.css';

const route = useRoute();
const gallerySearchQuery = provideAtomsGallerySearch();

const activeSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const childPage = computed(() => findCatalogChildPage(activeSlug.value));

const moleculeLocation = computed(() => {
  if (childPage.value) return childPage.value.parent;
  return findCatalogItem(activeSlug.value);
});

const previewEntry = computed(() => componentPreviewBySlug[activeSlug.value]);

const headerTitle = computed(() => {
  if (childPage.value) return childPage.value.child.label;
  const entry = findCatalogItem(activeSlug.value);
  if (entry) return entry.item.name;
  if (previewEntry.value?.title) return previewEntry.value.title;
  return 'Components';
});

const headerLead = computed(() => {
  if (activeSlug.value === 'icons') return getIconsPageLead();
  if (activeSlug.value === 'crypto') return getCryptoPageLead();
  return moleculeLocation.value?.item.description ?? '';
});

const isGallerySearchPage = computed(() => isAtomsGallerySearchSlug(activeSlug.value));

const gallerySearchPlaceholder = computed(() => {
  const slug = activeSlug.value;
  return isAtomsGallerySearchSlug(slug) ? atomsGallerySearchPlaceholder(slug) : '';
});

const showPageAnchors = computed(() => {
  const familySlug = findComponentsSidebarFamilyId(activeSlug.value);
  const items = anchorItemsForFamily(familySlug, componentAnchorItems);
  return buildCatalogNavSegments(items).length > 0;
});

const usesCompactDocPreview = computed(
  () =>
    usesCompactComponentPreview(activeSlug.value) ||
    usesScrollComponentPreview(activeSlug.value),
);

watch(activeSlug, () => {
  window.scrollTo(0, 0);
  gallerySearchQuery.value = '';
});
</script>

<template>
  <div :class="[styles.pageWithAnchors, showPageAnchors && styles.pageWithAnchorsWithAside]">
    <div :class="[shared.page, styles.componentPage]">
      <PageHeader
        :class="usesCompactDocPreview && styles.pageHeaderCompactDoc"
        :title="headerTitle"
        :lead="headerLead"
      >
        <template v-if="isGallerySearchPage" #afterLead>
          <div class="desktopTokens">
            <EgSearchInput
              v-model="gallerySearchQuery"
              :placeholder="gallerySearchPlaceholder"
              width-mode="full"
            />
          </div>
        </template>
      </PageHeader>

      <RouterView :key="activeSlug" />
    </div>

    <ComponentsPageAnchors v-if="showPageAnchors" />
  </div>
</template>
