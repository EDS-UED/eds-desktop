<script setup lang="ts">
import { useSlots } from 'vue';
import EgFlotationMenu from './FlotationMenu.vue';

const slotNames = Object.keys(useSlots()) as string[];
</script>

<template>
  <EgFlotationMenu v-bind="{ ...$attrs, 'data-flotation-scene': 'address-dropdown' }">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData ?? {}" />
    </template>
  </EgFlotationMenu>
</template>
