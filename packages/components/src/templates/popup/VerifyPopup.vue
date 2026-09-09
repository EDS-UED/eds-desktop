<script setup lang="ts">
import { useSlots } from 'vue';
import EgPopup from './Popup.vue';

const slotNames = Object.keys(useSlots()) as string[];
</script>

<template>
  <EgPopup v-bind="$attrs" uses="verify">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData ?? {}" />
    </template>
  </EgPopup>
</template>
