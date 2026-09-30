<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon, getProcessedIcon, iconNames } from '@eds/desktop-components';
import shared from '@/views/shared/showcase.module.css';
import styles from '../ComponentsView.module.css';
import { matchIconGallerySearch } from '@/data/iconSearchIndex';
import { useAtomsGallerySearch } from './atomsGallerySearch';

const registeredIconNames = computed(() =>
  iconNames.filter((name) => Boolean(getProcessedIcon(name))),
);

const query = useAtomsGallerySearch();

const filteredIconNames = computed(() => {
  const q = query.value;
  if (!q.trim()) return registeredIconNames.value;
  return registeredIconNames.value.filter((name) => matchIconGallerySearch(name, q));
});
</script>

<template>
  <section id="icons-gallery" :class="shared.section">
    <div :class="styles.iconGrid">
      <div v-for="name in filteredIconNames" :key="name" :class="styles.iconCell">
        <div class="desktopTokens">
          <EgIcon :name="name" size="lg" :label="name" />
        </div>
        <span :class="styles.iconCellName">{{ name }}</span>
      </div>
    </div>
  </section>
</template>
