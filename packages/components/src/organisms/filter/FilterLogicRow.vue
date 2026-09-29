<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgFlotation,
  EgFlotationTrigger,
  type FlotationMenuItemPreset,
} from '../../molecules/flotation';
import { FILTER_LOGIC_MODE_OPTIONS, type EgFilterLogicMode } from './types';
import { useFilterPanelDropdownMutex } from './filterPanelDropdownMutex';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterLogicRow.module.css';

const t = useFilterTranslate();

const props = defineProps<{
  modelValue: EgFilterLogicMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: EgFilterLogicMode];
}>();

const flotationRef = ref<{ close?: () => void } | null>(null);
const { onDropdownOpen, onDropdownClose } = useFilterPanelDropdownMutex(
  () => 'logic-mode',
  flotationRef,
);

const menuItems = computed((): FlotationMenuItemPreset[] =>
  FILTER_LOGIC_MODE_OPTIONS.map((option) => ({ label: t(option.label) })),
);

const selectedIndex = computed(() => {
  const index = FILTER_LOGIC_MODE_OPTIONS.findIndex((option) => option.id === props.modelValue);
  return index >= 0 ? index : 0;
});

const selectedLabel = computed(() => {
  const label = FILTER_LOGIC_MODE_OPTIONS.find((option) => option.id === props.modelValue)?.label ?? '';
  return t(label);
});

function onItemClick(_item: FlotationMenuItemPreset, index: number) {
  const option = FILTER_LOGIC_MODE_OPTIONS[index];
  if (!option) return;
  emit('update:modelValue', option.id);
}
</script>

<template>
  <div :class="styles.logicRow">
    <span :class="styles.text">{{ t('符合以下') }}</span>
    <div :class="styles.logicSelect">
      <EgFlotation
        ref="flotationRef"
        placement="bottom"
        align="start"
        width-mode="trigger"
        trigger-style="subtle"
        trigger-size="xs"
        :trigger-label="selectedLabel"
        :show-add="false"
        :show-menu-divider="false"
        :items="menuItems"
        :selected-index="selectedIndex"
        flip
        @open="onDropdownOpen"
        @close="onDropdownClose"
        @item-click="onItemClick"
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="subtle"
            size="xs"
            width-mode="trigger"
            :label="selectedLabel"
            :expanded="expanded"
          />
        </template>
      </EgFlotation>
    </div>
    <span :class="styles.text">{{ t('条件') }}</span>
  </div>
</template>
