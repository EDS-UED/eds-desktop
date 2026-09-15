<script setup lang="ts">
import { computed } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import shared from '@/views/shared/showcase.module.css';

const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();
const { display } = useShowcaseDisplayText();

const sectionTitle = computed(() => {
  void locale.value;
  return i18n.name('nav:workflows', 'Workflows');
});

const bodyText = computed(() =>
  display(
    '可复用业务流程（Authentication、Verification、Transaction、Submission、Approval、Onboarding 等）将在此落地。',
  ),
);
</script>

<template>
  <section :class="shared.section">
    <h2 :class="shared.sectionTitle">{{ sectionTitle }}</h2>
    <p :class="shared.bodyText">
      {{ bodyText }}
    </p>
  </section>
</template>
