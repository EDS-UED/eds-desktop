<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { EgTooltipOverflow } from '../tooltip';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import { copyToClipboard } from '../../utils/copyToClipboard';
import cryptoComboStyles from '../crypto-combo/CryptoCombo.module.css';
import styles from './ListFieldHashLike.module.css';

const props = withDefaults(
  defineProps<{
    text: string;
    variant?: 'primary' | 'secondary';
    identifierMode?: boolean;
    copyOnRowHover?: boolean;
    tooltipTrigger?: 'hover' | 'focus';
  }>(),
  {
    variant: 'primary',
    identifierMode: false,
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
  },
);

const cellCopied = ref(false);
let cellCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;

const targetTone = computed(() =>
  props.variant === 'secondary' ? 'secondary' : 'primary',
);

const lineTypographyClass = computed(() =>
  props.variant === 'primary' ? styles.primaryLine : styles.secondaryLine,
);

const copyLabel = computed(() =>
  props.identifierMode ? `复制编号 ${props.text}` : `复制哈希 ${props.text}`,
);

onBeforeUnmount(() => {
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
});

async function onCopy(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(props.text);
  if (!copied) return;

  cellCopied.value = true;
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
  cellCopiedResetTimer = setTimeout(() => {
    cellCopied.value = false;
  }, 2000);
}
</script>

<template>
  <div :class="[styles.cellLine, props.variant === 'secondary' && styles.cellLineSecondary]">
    <EgTooltipOverflow
      :tooltip-text="text"
      :copy-value="text"
      :trigger="tooltipTrigger"
      :target-tone="targetTone"
      :typography-class="lineTypographyClass"
      :copy-label="copyLabel"
      show-tooltip-copy
      boundary-selector=".eds-data-list"
      host-flex
      :host-class="styles.lineFlotationHost"
    >
      {{ text }}
    </EgTooltipOverflow>

    <EgIconButton
      v-if="copyOnRowHover"
      shape="square"
      size="xs"
      :label="copyLabel"
      :class="cellCopied && cryptoComboStyles.menuCopyButtonCopied"
      @click.stop="onCopy($event)"
    >
      <EgIcon
        :name="cellCopied ? 'eds-enable-fill' : 'eds-copy'"
        fit
      />
    </EgIconButton>
  </div>
</template>
