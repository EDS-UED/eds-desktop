<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '@eds/desktop-components';
import { useShowcaseContentTheme } from '@/composables/useShowcaseContentTheme';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';

const { theme, toggleTheme } = useShowcaseContentTheme();
const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const label = computed(() => {
  void locale.value;
  return theme.value === 'light'
    ? i18n.name('shell:theme-dark', 'Dark')
    : i18n.name('shell:theme-light', 'Light');
});
</script>

<template>
  <div class="desktopTokens">
    <EgButton
      tone="sameWhite"
      variant="outline"
      size="md"
      @click="toggleTheme"
    >
      {{ label }}
    </EgButton>
  </div>
</template>
