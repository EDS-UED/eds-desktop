<script setup lang="ts">
import { useSlots } from 'vue';
import EgVerify from './Verify.vue';

const slotNames = Object.keys(useSlots()) as string[];
</script>

<template>
  <EgVerify v-bind="$attrs" type="single-login-password">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData ?? {}" />
    </template>
  </EgVerify>
</template>
