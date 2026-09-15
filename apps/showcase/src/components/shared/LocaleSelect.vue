<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgButton, EgFlotation, EgFlotationMenu, EgSearchInput } from '@eds/desktop-components';
import { SHOWCASE_LOCALE_OPTIONS } from '@/data/i18n/showcaseLocaleOptions';
import {
  getShowcaseLocaleDirection,
  getShowcaseLocaleSecondaryLabel,
  getShowcaseLocaleShortLabel,
  type ShowcaseLocale,
} from '@/data/i18n/showcaseLocaleCatalog';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import styles from './LocaleSelect.module.css';

const MENU_WIDTH = 216;
const MENU_HEIGHT = 320;

const { locale, setLocale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();
const languageAriaLabel = showcaseText('Language', '语言');
const searchPlaceholder = showcaseText('Search', '搜索');

const searchQuery = ref('');

const shortLabel = computed(() => getShowcaseLocaleShortLabel(locale.value));

const isRtlLocale = computed(() => getShowcaseLocaleDirection(locale.value) === 'rtl');

const localeOptions = computed(() => {
  const uiLocale = locale.value;
  return SHOWCASE_LOCALE_OPTIONS.map((entry) => ({
    ...entry,
    secondaryLabel: getShowcaseLocaleSecondaryLabel(entry.id, uiLocale),
  }));
});

const filteredLocaleOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return localeOptions.value;

  return localeOptions.value.filter((entry) => {
    const haystack = [
      entry.id,
      entry.shortLabel,
      entry.nativeLabel,
      entry.secondaryLabel,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });
});

function resetSearch() {
  searchQuery.value = '';
}

function selectLocale(next: ShowcaseLocale, close: () => void) {
  setLocale(next);
  resetSearch();
  close();
}
</script>

<template>
  <div class="desktopTokens" :class="styles.root">
    <EgFlotation
      :class="styles.flotation"
      placement="top"
      align="start"
      trigger="click"
      :close-on-scroll="true"
      @close="resetSearch"
    >
      <template #trigger>
        <EgButton
          tone="sameWhite"
          variant="outline"
          size="md"
          :class="styles.trigger"
          :aria-label="display(languageAriaLabel)"
          aria-haspopup="listbox"
        >
          <span :class="styles.triggerLabel">{{ shortLabel }}</span>
        </EgButton>
      </template>

      <template #content="{ close }">
        <EgFlotationMenu
          :class="styles.menu"
          panel-kind="flotation"
          width-mode="fixed"
          :width="MENU_WIDTH"
          :show-add="false"
          :scrollable="true"
          list-scroll
          height-mode="fixed"
          :height="MENU_HEIGHT"
          :max-height="MENU_HEIGHT"
        >
          <template #header>
            <div :class="styles.searchHeader">
              <EgSearchInput
                v-model="searchQuery"
                :placeholder="display(searchPlaceholder)"
                width-mode="full"
              />
            </div>
          </template>

          <div :class="styles.optionList">
            <button
              v-for="entry in filteredLocaleOptions"
              :key="entry.id"
              type="button"
              role="option"
              :aria-selected="locale === entry.id"
              :class="[
                styles.option,
                isRtlLocale ? styles.optionRtl : styles.optionLtr,
                locale === entry.id && styles.optionSelected,
              ]"
              @click="selectLocale(entry.id, close)"
            >
              <span
                :class="[
                  styles.optionPrimary,
                  isRtlLocale ? styles.optionTextRtl : styles.optionTextLtr,
                ]"
              >
                {{ entry.nativeLabel }}
              </span>
              <span
                :class="[
                  styles.optionSecondary,
                  isRtlLocale ? styles.optionTextRtl : styles.optionTextLtr,
                ]"
              >
                {{ entry.secondaryLabel }}
              </span>
            </button>
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
