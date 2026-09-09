<script setup lang="ts">
import { EgMnemonicVerify } from '@eds/desktop-animations';
import { EgIcon } from '../../atoms/icons';
import { EgTooltip } from '../tooltip';
import EgIconButton from './IconButton.vue';
import styles from './CopyActionIconButton.module.css';

withDefaults(
  defineProps<{
    label: string;
    icon: string;
    boundarySelector?: string;
    verifying?: boolean;
  }>(),
  {
    boundarySelector: '.eds-data-list',
    verifying: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <EgTooltip
    trigger="hover"
    placement="bottom"
    align="center"
    panel-kind="flotation"
    width-mode="adaptive"
    height-mode="adaptive"
    :scrollable="false"
    close-on-scroll
    :boundary-selector="boundarySelector"
    :open-delay="120"
    :close-delay="80"
    token-scope-class="desktopTokens"
  >
    <EgIconButton
      shape="square"
      size="xs"
      :label="label"
      @click="emit('click', $event)"
    >
      <EgMnemonicVerify
        v-if="verifying"
        :class="styles.mnemonicVerify"
        :active="true"
      />
      <EgIcon v-else :name="icon" fit />
    </EgIconButton>
    <template #content>
      <span :class="styles.tooltipLabel">{{ label }}</span>
    </template>
  </EgTooltip>
</template>
