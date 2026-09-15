<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import ToolBarTitle from './ToolBarTitle.vue';
import styles from './ToolBar.module.css';
import '../../styles/frostedPageChrome.css';

withDefaults(
  defineProps<{
    title?: string;
    showBack?: boolean;
    showOperation?: boolean;
    showDivider?: boolean;
    showSection?: boolean;
  }>(),
  {
    title: 'Title',
    showBack: false,
    showOperation: true,
    showDivider: false,
    showSection: false,
  },
);

const emit = defineEmits<{
  back: [];
}>();
</script>

<template>
  <header class="eds-tool-bar" :class="styles.root">
    <div :class="styles.chrome">
      <div :class="['eds-frosted-page-chrome', styles.raw]">
        <ToolBarTitle :title="title" :show-back="showBack" @back="emit('back')">
          <slot name="title">{{ title }}</slot>
        </ToolBarTitle>
        <div v-if="showOperation" :class="styles.functional">
          <div :class="styles.functionalGroup">
            <slot name="functional" />
          </div>
          <template v-if="showSection">
            <EgDivider
              :class="styles.sectionDivider"
              type="page"
              direction="vertical"
            />
            <div :class="styles.functionalGroup">
              <slot name="section" />
            </div>
          </template>
          <div v-else-if="$slots.operation" :class="styles.operation">
            <slot name="operation" />
          </div>
        </div>
      </div>
      <EgDivider
        v-if="showDivider"
        :class="styles.divider"
        type="module"
        direction="horizontal"
      />
    </div>
  </header>
</template>
