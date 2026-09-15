<script setup lang="ts">
import { computed } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import shared from '@/views/shared/showcase.module.css';
import styles from './ComponentDocLayout.module.css';
import type { DocPropRow } from './types';

defineProps<{
  propRows: DocPropRow[];
  eventRows?: DocPropRow[];
  slotRows?: DocPropRow[];
  propsSectionId?: string;
  showTitle?: boolean;
  /** When true, render tables only (section + title provided by parent). */
  bare?: boolean;
}>();

const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();
const { display } = useShowcaseDisplayText();

const propsTitle = computed(() => {
  void locale.value;
  return i18n.name('shell:props', 'Props');
});

const eventsTitle = computed(() => {
  void locale.value;
  return i18n.name('shell:events', 'Events');
});

const slotsTitle = computed(() => {
  void locale.value;
  return i18n.name('shell:slots', 'Slots');
});

const nameHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:table-name', 'Name');
});

const typeHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:table-type', 'Type');
});

const defaultHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:table-default', 'Default');
});

const descriptionHeader = computed(() => {
  void locale.value;
  return i18n.name('shell:table-description', 'Description');
});
</script>

<template>
  <component
    :is="bare ? 'div' : 'section'"
    :id="bare ? undefined : propsSectionId"
    :class="bare ? styles.propsTablesBare : shared.section"
  >
    <h2 v-if="!bare && showTitle !== false" :class="shared.sectionTitle">{{ propsTitle }}</h2>
    <div :class="shared.tableWrap">
      <table :class="shared.table">
        <thead>
          <tr>
            <th scope="col">{{ nameHeader }}</th>
            <th scope="col">{{ typeHeader }}</th>
            <th scope="col">{{ defaultHeader }}</th>
            <th scope="col">{{ descriptionHeader }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in propRows" :key="row.name">
            <td><span :class="styles.propName">{{ display(row.name) }}</span></td>
            <td><span :class="styles.propType">{{ row.type }}</span></td>
            <td><span :class="shared.mono">{{ display(row.defaultValue) }}</span></td>
            <td><span :class="shared.bodyText">{{ display(row.description) }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="eventRows?.length">
      <h3 :class="styles.propGroupTitle">{{ eventsTitle }}</h3>
      <div :class="shared.tableWrap">
        <table :class="shared.table">
          <thead>
            <tr>
              <th scope="col">{{ nameHeader }}</th>
              <th scope="col">{{ typeHeader }}</th>
              <th scope="col">{{ defaultHeader }}</th>
              <th scope="col">{{ descriptionHeader }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in eventRows" :key="row.name">
              <td><span :class="styles.propName">{{ display(row.name) }}</span></td>
              <td><span :class="styles.propType">{{ row.type }}</span></td>
              <td><span :class="shared.mono">{{ display(row.defaultValue) }}</span></td>
              <td><span :class="shared.bodyText">{{ display(row.description) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="slotRows?.length">
      <h3 :class="styles.propGroupTitle">{{ slotsTitle }}</h3>
      <div :class="shared.tableWrap">
        <table :class="shared.table">
          <thead>
            <tr>
              <th scope="col">{{ nameHeader }}</th>
              <th scope="col">{{ typeHeader }}</th>
              <th scope="col">{{ defaultHeader }}</th>
              <th scope="col">{{ descriptionHeader }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in slotRows" :key="row.name">
              <td><span :class="styles.propName">{{ display(row.name) }}</span></td>
              <td><span :class="styles.propType">{{ row.type }}</span></td>
              <td><span :class="shared.mono">{{ display(row.defaultValue) }}</span></td>
              <td><span :class="shared.bodyText">{{ display(row.description) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </component>
</template>
