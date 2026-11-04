<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgSwitch } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildSwitchUsageSnippet,
  isSwitchInteractiveMode,
  mapSwitchFixedPreviewProps,
  switchCustomizeControls,
  switchCustomizeDefaults,
  switchImportCode,
  switchPropRows,
} from './toggleDocCustomize';

const customize = reactive({
  ...switchCustomizeDefaults,
  size: switchCustomizeDefaults.size as 'lg' | 'md' | 'sm',
});

const usageSnippet = computed(() => buildSwitchUsageSnippet(customize));
const interactive = computed(() => isSwitchInteractiveMode(customize.mode));
const fixedPreview = computed(() => mapSwitchFixedPreviewProps(customize.mode));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Switch"
      :show-doc-title="false"
      component-tag="EgSwitch"
      :import-code="switchImportCode"
      :customize-controls="switchCustomizeControls"
      :customize-defaults="switchCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="switchPropRows"
      props-section-id="toggle-switch-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgSwitch
            v-if="interactive"
            :model-value="Boolean(customize.on)"
            :size="customize.size"
            @update:model-value="(v) => { customize.on = v; }"
          />
          <EgSwitch
            v-else
            :model-value="fixedPreview?.modelValue ?? false"
            :size="customize.size"
            disabled
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
