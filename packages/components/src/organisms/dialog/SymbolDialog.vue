<script setup lang="ts">
import { useSlots } from 'vue';
import EgDialog from './Dialog.vue';

const slotNames = Object.keys(useSlots()) as string[];
</script>

<template>
  <EgDialog v-bind="$attrs" type="symbol">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData ?? {}" />
    </template>
  </EgDialog>
</template>
