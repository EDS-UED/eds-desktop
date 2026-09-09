<script setup lang="ts">
import { useSlots } from 'vue';
import EgFlotationTrigger from './FlotationTrigger.vue';

const slotNames = Object.keys(useSlots()) as string[];
</script>

<template>
  <EgFlotationTrigger v-bind="$attrs" module-menu-title>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData ?? {}" />
    </template>
  </EgFlotationTrigger>
</template>
