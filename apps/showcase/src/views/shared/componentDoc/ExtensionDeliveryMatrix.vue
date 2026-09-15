<script setup lang="ts">
import { computed } from 'vue';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { formatShowcaseI18nTemplate } from '@/data/i18n/resolveShowcaseCatalogText';
import shared from '@/views/shared/showcase.module.css';
import styles from './ExtensionDeliveryMatrix.module.css';
import {
  EXTENSION_LAYER_LABELS,
  buildExtensionLayerStatus,
  type ComponentDocTier,
  type ExtensionLayer,
} from './extensionDelivery';

const props = defineProps<{
  tier: ComponentDocTier;
  layers: Partial<Record<ExtensionLayer, boolean>>;
}>();

const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const rows = computed(() => buildExtensionLayerStatus(props.tier, props.layers));

const metRequiredCount = computed(
  () => rows.value.filter((row) => row.required && row.met).length,
);

const requiredCount = computed(() => rows.value.filter((row) => row.required).length);

const sectionTitle = computed(() => {
  void locale.value;
  return i18n.name('shell:extension-delivery', 'Extension delivery');
});

const summaryText = computed(() => {
  void locale.value;
  const template = i18n.name(
    'shell:extension-summary',
    '{met}/{total} required layers covered',
  );
  return `Variants → Props → Slots → Composition → Scenarios · ${formatShowcaseI18nTemplate(template, {
    met: metRequiredCount.value,
    total: requiredCount.value,
  })}`;
});

const layerHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:layer', 'Layer');
});

const requiredHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:required', 'Required');
});

const statusHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:status', 'Status');
});

const yesLabel = computed(() => {
  void locale.value;
  return i18n.name('shell:yes', 'Yes');
});

const deliveredLabel = computed(() => {
  void locale.value;
  return i18n.name('shell:delivered', 'Delivered');
});

const pendingLabel = computed(() => {
  void locale.value;
  return i18n.name('shell:pending', 'Missing');
});

const optionalLabel = computed(() => {
  void locale.value;
  return i18n.name('shell:optional', 'Optional');
});
</script>

<template>
  <section :class="shared.section">
    <div :class="styles.header">
      <h2 :class="shared.sectionTitle">{{ sectionTitle }}</h2>
      <p :class="[shared.bodyText, styles.summary]">
        {{ summaryText }}
      </p>
    </div>
    <div :class="shared.tableWrap">
      <table :class="shared.table">
        <thead>
          <tr>
            <th scope="col">{{ layerHeader }}</th>
            <th scope="col">{{ requiredHeader }}</th>
            <th scope="col">{{ statusHeader }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.layer">
            <td><span :class="styles.layerName">{{ EXTENSION_LAYER_LABELS[row.layer] }}</span></td>
            <td>
              <span :class="shared.mono">{{ row.required ? yesLabel : '—' }}</span>
            </td>
            <td>
              <span
                :class="[
                  styles.status,
                  row.met ? styles.statusMet : row.required ? styles.statusMissing : styles.statusOptional,
                ]"
              >
                {{ row.met ? deliveredLabel : row.required ? pendingLabel : optionalLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
