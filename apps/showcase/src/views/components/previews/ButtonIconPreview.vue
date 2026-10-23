<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgIcon, EgIconButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildIconButtonUsageSnippet,
  iconButtonCustomizeControls,
  iconButtonCustomizeDefaults,
  iconButtonImportCode,
} from './buttonDocCustomize';
import { iconButtonPropRows, iconButtonSlotRows } from './buttonSubPreviewData';
import {
  iconButtonEventHostClass,
  isIconButtonInteractiveEvent,
} from './iconButtonDocPreview';

const iconButtonCustomize = reactive({ ...iconButtonCustomizeDefaults });

const iconButtonUsageSnippet = computed(() => buildIconButtonUsageSnippet(iconButtonCustomize));

const isInteractive = computed(() => isIconButtonInteractiveEvent(iconButtonCustomize.event));
const eventHostClass = computed(() => iconButtonEventHostClass(iconButtonCustomize.event));

const iconButtonProps = computed(() => ({
  shape: iconButtonCustomize.shape as 'rectangular' | 'square' | 'round',
  outlineStyle: iconButtonCustomize.outlineStyle as 'none' | 'bordered',
  size: iconButtonCustomize.size as 'lg' | 'md' | 'sm' | 'xs',
  label: String(iconButtonCustomize.label),
  disabled: Boolean(iconButtonCustomize.disabled),
  motion: iconButtonCustomize.motion as 'ease' | 'hover-enter-only' | 'asym' | 'none',
}));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="iconButtonCustomize"
      title="IconContainer"
      :show-doc-title="false"
      component-tag="EgIconButton"
      :import-code="iconButtonImportCode"
      :customize-controls="iconButtonCustomizeControls"
      :customize-defaults="iconButtonCustomizeDefaults"
      :usage-snippet-override="iconButtonUsageSnippet"
      :prop-rows="iconButtonPropRows"
      :slot-rows="iconButtonSlotRows"
      props-section-id="button-icon-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.previewButtonHost, eventHostClass]"
        >
          <EgIconButton
            v-bind="iconButtonProps"
            :tabindex="isInteractive ? undefined : -1"
          >
            <EgIcon :name="iconButtonCustomize.symbol" fit />
          </EgIconButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
