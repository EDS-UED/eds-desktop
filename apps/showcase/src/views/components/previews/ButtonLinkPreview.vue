<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgLinkButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildLinkUsageSnippet,
  linkCustomizeControls,
  linkCustomizeDefaults,
  linkImportCode,
} from './buttonDocCustomize';
import { linkPropRows, linkSlotRows } from './buttonSubPreviewData';

const linkCustomize = reactive({ ...linkCustomizeDefaults });

const linkUsageSnippet = computed(() => buildLinkUsageSnippet(linkCustomize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="linkCustomize"
      title="Link"
      :show-doc-title="false"
      component-tag="EgLinkButton"
      :import-code="linkImportCode"
      :customize-controls="linkCustomizeControls"
      :customize-defaults="linkCustomizeDefaults"
      :usage-snippet-override="linkUsageSnippet"
      :prop-rows="linkPropRows"
      :slot-rows="linkSlotRows"
      props-section-id="button-link-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewButtonHost">
          <EgLinkButton
            :tone="linkCustomize.tone as 'brand' | 'theme'"
            :size="linkCustomize.size as 'lg' | 'md' | 'sm'"
            :href="String(linkCustomize.href)"
            :disabled="Boolean(linkCustomize.disabled)"
          >
            {{ linkCustomize.label }}
          </EgLinkButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
