<script setup lang="ts">
import { EgSegmented } from '../../molecules/tab';
import PaginerSetInput from './PaginerSetInput.vue';
import styles from './Paginer.module.css';

const props = withDefaults(
  defineProps<{
    levelLabel?: string;
    jumpLabel?: string;
    levelLabels?: string[];
    levelIndex?: number;
    jumpPlaceholder?: string;
  }>(),
  {
    levelLabel: 'Items Per Page',
    jumpLabel: 'Go to Page',
    levelLabels: () => ['20', '50', '100'],
    levelIndex: 1,
    jumpPlaceholder: 'Please Enter',
  },
);

const levelIndexModel = defineModel<number>('levelIndex', { default: 1 });
const jumpValue = defineModel<string>('jumpValue', { default: '' });

const emit = defineEmits<{
  jump: [value: string];
  'level-select': [index: number, label: string];
}>();

function onLevelSelect(index: number) {
  const label = props.levelLabels[index] ?? String(index);
  emit('level-select', index, label);
}
</script>

<template>
  <div class="eds-paginer-settings" :class="styles.settings" data-no-corner-smoothing>
    <div :class="styles.settingsSection">
      <span :class="styles.settingsLabel">{{ levelLabel }}</span>
      <EgSegmented
        v-model="levelIndexModel"
        shape="square"
        item-width-mode="fixed"
        :labels="levelLabels"
        :class="styles.settingsSegment"
        @update:model-value="onLevelSelect"
      />
    </div>
    <div :class="styles.settingsSection">
      <span :class="styles.settingsLabel">{{ jumpLabel }}</span>
      <PaginerSetInput
        v-model="jumpValue"
        :placeholder="jumpPlaceholder"
        @submit="emit('jump', $event)"
      />
    </div>
  </div>
</template>
