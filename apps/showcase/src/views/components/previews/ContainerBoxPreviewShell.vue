<script setup lang="ts">
import { EgTooltipPanel } from '@eds/desktop-components';
import styles from './ContainerBoxPreviewShell.module.css';
</script>

<template>
  <EgTooltipPanel panel-kind="container" :class="styles.shell">
    <slot />
  </EgTooltipPanel>
</template>
