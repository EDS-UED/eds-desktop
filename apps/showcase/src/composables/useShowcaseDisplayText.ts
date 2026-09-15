import { computed } from 'vue';
import {
  resolveShowcaseDisplayText,
  resolveShowcaseGalleryLabel,
} from '@/data/i18n/showcaseDisplayText';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';

export function useShowcaseDisplayText() {
  const { locale } = useShowcaseLocale();
  const i18n = useShowcaseI18n();

  function display(raw: string): string {
    void locale.value;
    return resolveShowcaseDisplayText(raw, i18n.locale);
  }

  function gallery(raw: string): string {
    void locale.value;
    return resolveShowcaseGalleryLabel(raw, i18n.locale);
  }

  const displayText = computed(() => ({
    locale: locale.value,
    display,
    gallery,
  }));

  return {
    locale,
    display,
    gallery,
    displayText,
  };
}
