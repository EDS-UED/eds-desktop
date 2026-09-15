<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgInput } from '@eds/desktop-components';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { inputEventRows, inputPropRows, inputSlotRows } from './inputPreviewData';
import {
  inputCustomizeControls,
  inputCustomizeDefaults,
  inputImportCode,
} from './inputDocCustomize';
import {
  inputEventHostClass,
  inputEventSnapshotHostClass,
  inputSnapshotDisabled,
  inputSnapshotModelValue,
  inputSnapshotReadonly,
  isInputInteractiveEvent,
  readInputDocEvent,
} from './inputDocPreview';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
  resolveEgInputWidthMode,
  type ShowcaseInputWidthMode,
} from './inputPreviewWidth';

const { display } = useShowcaseDisplayText();
const heroValue = ref('');

const inputCustomize = reactive({
  ...inputCustomizeDefaults,
  type: inputCustomizeDefaults.type as 'standard' | 'amount',
  interaction: inputCustomizeDefaults.interaction as string,
  size: inputCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  widthMode: inputCustomizeDefaults.widthMode as ShowcaseInputWidthMode,
});

const inputPreviewStyle = computed(() =>
  previewFixedWidthStyle(inputCustomize.widthMode, inputCustomize.fixedWidth),
);

const inputUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgInput',
    inputCustomize,
    { defaults: inputCustomizeDefaults, vModel: 'value', omitKeys: ['interaction'] },
    buildVueSelfClosingSnippet,
  ),
);

function onInputMax() {
  heroValue.value = '100';
}

const inputPreviewUnit = computed(() => {
  const unit = String(inputCustomize.unit ?? '');
  if (unit) return unit;
  return inputCustomize.type === 'amount' ? 'ETH' : undefined;
});

const isInteractive = computed(() => isInputInteractiveEvent(inputCustomize.interaction));

const docEvent = computed(() => readInputDocEvent(inputCustomize.interaction));

const eventHostClass = computed(() => inputEventHostClass(inputCustomize.interaction));

const snapshotHostClass = computed(() =>
  inputEventSnapshotHostClass(inputCustomize.interaction),
);

const previewDisabled = computed(() => {
  if (isInteractive.value) {
    return Boolean(inputCustomize.disabled);
  }
  return inputSnapshotDisabled(docEvent.value);
});

const previewReadonly = computed(() => {
  if (isInteractive.value) {
    return Boolean(inputCustomize.readonly);
  }
  return inputSnapshotReadonly(docEvent.value);
});

const snapshotModelValue = computed(() =>
  inputSnapshotModelValue(docEvent.value, String(inputCustomize.placeholder)),
);

const sharedInputProps = computed(() => ({
  style: inputPreviewStyle.value,
  type: inputCustomize.type as 'standard' | 'amount',
  size: inputCustomize.size as 'lg' | 'md' | 'sm',
  widthMode: resolveEgInputWidthMode(inputCustomize.widthMode),
  placeholder: display(String(inputCustomize.placeholder)),
  disabled: previewDisabled.value,
  readonly: previewReadonly.value,
  unit: inputPreviewUnit.value,
  clearable: Boolean(inputCustomize.clearable),
  showMax: Boolean(inputCustomize.showMax),
  maxLabel: String(inputCustomize.maxLabel),
}));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="inputCustomize"
      title="Input"
      :show-doc-title="false"
      component-tag="EgInput"
      :import-code="inputImportCode"
      :customize-controls="inputCustomizeControls"
      :customize-defaults="inputCustomizeDefaults"
      :usage-snippet-override="inputUsageSnippet"
      :prop-rows="inputPropRows"
      :event-rows="inputEventRows"
      :slot-rows="inputSlotRows"
      props-section-id="input-props"
      @reset-preview="heroValue = ''"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewInputHost,
            eventHostClass,
            snapshotHostClass,
          ]"
        >
          <EgInput
            v-if="isInteractive"
            v-model="heroValue"
            v-bind="sharedInputProps"
            @max="onInputMax"
          />
          <EgInput
            v-else
            :model-value="snapshotModelValue"
            v-bind="sharedInputProps"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
