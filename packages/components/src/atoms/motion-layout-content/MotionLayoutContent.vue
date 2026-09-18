<script setup lang="ts">
import { computed, toValue, type MaybeRef } from 'vue';
import { motionLayoutContentClass } from './motionLayoutContent';

const props = withDefaults(
  defineProps<{
    contentExiting?: MaybeRef<boolean>;
    contentEntering?: MaybeRef<boolean>;
  }>(),
  {
    contentExiting: false,
    contentEntering: false,
  },
);

const rootClass = computed(() =>
  motionLayoutContentClass(
    toValue(props.contentExiting),
    toValue(props.contentEntering),
  ),
);
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>
