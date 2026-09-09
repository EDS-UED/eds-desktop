<script setup lang="ts">
import { computed } from 'vue';
import { MOTION_HOVER_ENTER_ONLY } from '../../atoms/motion-hover-enter';
import styles from './IconButton.module.css';

/** Figma Type */
export type IconButtonShape = 'rectangular' | 'square' | 'round';
export type IconButtonSize = 'lg' | 'md' | 'sm' | 'xs';
export type IconButtonMotion = 'ease' | 'asym' | 'hover-enter-only' | 'none';

const props = withDefaults(
  defineProps<{
    shape?: IconButtonShape;
    size?: IconButtonSize;
    label: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    /** Motion semantic 场景；默认缓入缓出。 */
    motion?: IconButtonMotion;
    /**
     * Use `span` when nested inside another control (e.g. EgIconProButton)
     * to avoid invalid button-in-button markup.
     */
    as?: 'button' | 'span';
  }>(),
  {
    shape: 'rectangular',
    size: 'lg',
    disabled: false,
    type: 'button',
    as: 'button',
    motion: 'ease',
  },
);

const motionClass = computed(() => {
  if (props.motion === 'hover-enter-only') {
    return MOTION_HOVER_ENTER_ONLY;
  }
  if (props.motion === 'asym') {
    return 'motion-ease is-asym';
  }
  if (props.motion === 'none') {
    return 'motion-none';
  }
  return 'motion-ease is-paint';
});
</script>

<template>
  <component
    :is="as === 'span' ? 'span' : 'button'"
    :class="[
      'eds-icon-button',
      styles.button,
      motionClass,
      styles[props.shape],
      styles[props.size],
      as === 'span' && styles.decor,
      disabled && styles.isDisabled,
    ]"
    :disabled="as === 'button' ? disabled : undefined"
    :type="as === 'button' ? type : undefined"
    :aria-label="as === 'button' ? label : undefined"
    :aria-disabled="as === 'span' && disabled ? true : undefined"
    :aria-hidden="as === 'span' ? true : undefined"
  >
    <span :class="[styles.symbol, motionClass]">
      <slot name="symbol">
        <slot />
      </slot>
    </span>
  </component>
</template>
