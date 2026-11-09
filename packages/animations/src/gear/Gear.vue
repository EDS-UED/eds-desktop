<script setup lang="ts">
import './gearOnly.css';
import { gearLeavesPath, gearRingPath } from './gearPaths';

/** eds-automatic-gear：齿环 vector-b 顺时针，内三叶 vector-a 逆时针。 */
withDefaults(
  defineProps<{
    active?: boolean;
  }>(),
  {
    active: true,
  },
);
</script>

<template>
  <div
    class="eds-gear"
    :class="{ 'is-idle': !active }"
    role="img"
    :aria-label="active ? '设置中' : '设置'"
    :aria-busy="active || undefined"
  >
    <svg
      class="eds-gear-svg"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g class="eds-gear-ring">
        <path
          :d="gearRingPath.d"
          :transform="gearRingPath.transform"
          fill="currentColor"
          :fill-rule="gearRingPath.fillRule"
          :clip-rule="gearRingPath.fillRule"
        />
      </g>
      <g class="eds-gear-leaves">
        <path
          :d="gearLeavesPath.d"
          :transform="gearLeavesPath.transform"
          fill="currentColor"
          :fill-rule="gearLeavesPath.fillRule"
          :clip-rule="gearLeavesPath.fillRule"
        />
      </g>
    </svg>
  </div>
</template>
