<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import {
  EgDecide,
  EgFlotation,
  EgFlotationTrigger,
  EgInput,
} from '@eds/desktop-components';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import styles from './ComponentDocLayout.module.css';
import type {
  DocCustomizeBooleanControl,
  DocCustomizeControl,
  DocCustomizeSelectControl,
} from './types';
import { useCustomizeFlotationGroup } from './customizeFlotationGroup';

const props = defineProps<{
  control: DocCustomizeControl;
  value: unknown;
  inlineSelectValue?: unknown;
}>();

const { display, gallery } = useShowcaseDisplayText();

const emit = defineEmits<{
  update: [value: unknown];
  inlineSelectUpdate: [value: unknown];
}>();

const flotationGroup = useCustomizeFlotationGroup();
const flotationId = useId();
const inlineFlotationRef = ref<{ close?: () => void } | null>(null);
const selectFlotationRef = ref<{ close?: () => void } | null>(null);

function registerFlotation(id: string, close: () => void) {
  flotationGroup?.register(id, close);
}

function unregisterFlotation(id: string) {
  flotationGroup?.unregister(id);
}

function onFlotationOpen(id: string) {
  flotationGroup?.exclusiveOpen(id);
}

onMounted(() => {
  registerFlotation(`${flotationId}-inline`, () => inlineFlotationRef.value?.close?.());
  registerFlotation(`${flotationId}-select`, () => selectFlotationRef.value?.close?.());
});

onBeforeUnmount(() => {
  unregisterFlotation(`${flotationId}-inline`);
  unregisterFlotation(`${flotationId}-select`);
});

const booleanControl = computed(() =>
  props.control.kind === 'boolean' ? (props.control as DocCustomizeBooleanControl) : null,
);

const inlineSelect = computed(() => booleanControl.value?.inlineSelect);

const showInlineSelect = computed(
  () => Boolean(props.value) && inlineSelect.value != null,
);

const inlineSelectModel = computed(
  () =>
    String(
      props.inlineSelectValue
        ?? inlineSelect.value?.options[0]?.value
        ?? '',
    ),
);

function selectOptionIndex(
  control: { options: DocCustomizeSelectControl['options'] },
  currentValue: unknown,
): number {
  const index = control.options.findIndex(
    (option) => option.value === String(currentValue ?? ''),
  );
  return index >= 0 ? index : 0;
}

function customizeSelectDisplayLabel(label: string): string {
  return gallery(label);
}

function selectFlotationItems(control: { options: DocCustomizeSelectControl['options'] }) {
  return control.options.map((option) => ({
    label: customizeSelectDisplayLabel(option.label),
    boxType: 'text' as const,
  }));
}

function selectCurrentLabel(
  control: { options: DocCustomizeSelectControl['options'] },
  currentValue: unknown,
) {
  const match = control.options.find(
    (option) => option.value === String(currentValue ?? ''),
  );
  const label = match?.label ?? control.options[0]?.label ?? '';
  return customizeSelectDisplayLabel(label);
}

function onSelectOption(
  control: { options: DocCustomizeSelectControl['options'] },
  index: number,
  handler: (value: unknown) => void,
) {
  const option = control.options[index];
  if (!option) return;
  handler(option.value);
}

function emitSelectUpdate(control: DocCustomizeSelectControl, index: number) {
  onSelectOption(control, index, (next) => emit('update', next));
}

function emitInlineSelectUpdate(
  control: NonNullable<DocCustomizeBooleanControl['inlineSelect']>,
  index: number,
) {
  onSelectOption(control, index, (next) => emit('inlineSelectUpdate', next));
}

function handleSelectItemClick(control: DocCustomizeControl, index: number) {
  if (control.kind !== 'select') return;
  emitSelectUpdate(control, index);
}
</script>

<template>
  <div :class="styles.customizeField">
    <span :class="styles.customizeLabel">{{ display(control.label) }}</span>
    <div
      :class="[
        styles.customizeControlSlot,
        showInlineSelect && styles.customizeControlSlotWithInline,
      ]"
    >
      <template v-if="control.kind === 'boolean'">
        <EgDecide
          :class="styles.customizeDecide"
          :model-value="Boolean(value)"
          @update:model-value="emit('update', $event)"
        />
        <div v-if="showInlineSelect && inlineSelect" :class="styles.customizeInlineSelectGroup">
          <span :class="styles.customizeInlineSelectLabel">{{ display(inlineSelect.label) }}</span>
          <EgFlotation
            ref="inlineFlotationRef"
            :key="`${inlineSelect.key}-${inlineSelectModel}`"
            :class="styles.customizeInlineFlotation"
            trigger-size="sm"
            trigger-style="subtle"
            width-mode="trigger"
            :show-add="false"
            :show-menu-divider="false"
            :selected-index="selectOptionIndex(inlineSelect, inlineSelectModel)"
            :items="selectFlotationItems(inlineSelect)"
            @open="onFlotationOpen(`${flotationId}-inline`)"
            @item-click="(_item, index) => emitInlineSelectUpdate(inlineSelect!, index)"
          >
            <template #trigger="{ expanded }">
              <EgFlotationTrigger
                trigger-style="subtle"
                size="sm"
                width-mode="adaptive"
                :label="selectCurrentLabel(inlineSelect, inlineSelectModel)"
                :expanded="expanded"
              />
            </template>
          </EgFlotation>
        </div>
      </template>
      <EgFlotation
        v-else-if="control.kind === 'select'"
        ref="selectFlotationRef"
        :key="`${control.key}-${String(value ?? '')}`"
        :class="styles.customizeFlotationSelect"
        trigger-size="sm"
        trigger-style="subtle"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        :selected-index="selectOptionIndex(control, value)"
        :items="selectFlotationItems(control)"
        @open="onFlotationOpen(`${flotationId}-select`)"
        @item-click="(_item, index) => handleSelectItemClick(control, index)"
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="subtle"
            size="sm"
            width-mode="adaptive"
            :label="selectCurrentLabel(control, value)"
            :expanded="expanded"
          />
        </template>
      </EgFlotation>
      <EgInput
        v-else-if="control.kind === 'text'"
        size="sm"
        width-mode="full"
        clearable
        :class="styles.customizeInput"
        :model-value="display(String(value ?? ''))"
        :placeholder="control.placeholder ? display(control.placeholder) : undefined"
        @update:model-value="emit('update', $event)"
      />
    </div>
  </div>
</template>
