<script setup lang="ts">
import { ref } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgTooltip } from '../../molecules/tooltip';
import { copyToClipboard } from '../../utils/copyToClipboard';
import type { DetailPersonDeviceInfo } from './detailTypes';
import styles from './DetailPersonDeviceInfoTrigger.module.css';

const props = defineProps<{
  deviceInfo: DetailPersonDeviceInfo;
  deviceInfoLabel: string;
  deviceTypeLabel: string;
  deviceIdLabel: string;
  deviceIpLabel: string;
  copyLabel: string;
}>();

const rows = [
  { key: 'device-type', label: () => props.deviceTypeLabel, valueKey: 'deviceType' as const },
  { key: 'device-id', label: () => props.deviceIdLabel, valueKey: 'deviceId' as const },
  { key: 'ip', label: () => props.deviceIpLabel, valueKey: 'ip' as const },
];

const copiedRowKey = ref<string | null>(null);
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

async function onCopyRow(
  rowKey: string,
  value: string,
  event?: MouseEvent,
) {
  event?.stopPropagation();
  event?.preventDefault();
  const copied = await copyToClipboard(value);
  if (!copied) return;

  copiedRowKey.value = rowKey;
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
  copiedResetTimer = setTimeout(() => {
    if (copiedRowKey.value === rowKey) copiedRowKey.value = null;
  }, 2000);
}
</script>

<template>
  <EgTooltip
    :class="styles.deviceInfoTooltip"
    trigger="hover"
    placement="bottom"
    align="start"
    boundary-selector=".eds-popup"
    close-on-scroll
    width-mode="adaptive"
    height-mode="adaptive"
    :open-delay="120"
    :close-delay="80"
  >
    <EgIconButton
      shape="square"
      size="xs"
      :class="styles.infoButton"
      :label="deviceInfoLabel"
      @click.stop
    >
      <EgIcon :class="styles.iconOutline" name="eds-information" fit />
      <EgIcon :class="styles.iconFill" name="eds-information-fill" fit />
    </EgIconButton>

    <template #content>
      <div :class="styles.rows" data-detail-device-info-copy>
        <div
          v-for="row in rows"
          :key="row.key"
          :class="styles.row"
          role="button"
          tabindex="0"
          @click="onCopyRow(row.key, deviceInfo[row.valueKey], $event)"
          @keydown.enter.prevent="onCopyRow(row.key, deviceInfo[row.valueKey])"
          @keydown.space.prevent="onCopyRow(row.key, deviceInfo[row.valueKey])"
        >
          <span :class="styles.label">{{ row.label() }}</span>
          <span :class="styles.valueCluster">
            <span :class="styles.value">{{ deviceInfo[row.valueKey] }}</span>
            <span
              :class="[
                styles.copyButton,
                copiedRowKey === row.key && styles.copyButtonCopied,
              ]"
              @click.stop
            >
              <EgIconButton
                shape="square"
                size="xs"
                :label="copyLabel"
                @click="onCopyRow(row.key, deviceInfo[row.valueKey], $event)"
              >
                <EgIcon
                  :name="copiedRowKey === row.key ? 'eds-enable-fill' : 'eds-copy'"
                  fit
                />
              </EgIconButton>
            </span>
          </span>
        </div>
      </div>
    </template>
  </EgTooltip>
</template>
