<script setup lang="ts">
import { EgAvatar } from '../../atoms/avatar';
import { EgDivider } from '../../atoms/divider';
import type { DetailPersonDeviceInfo } from './detailTypes';
import DetailPersonDeviceInfoTrigger from './DetailPersonDeviceInfoTrigger.vue';
import styles from './DetailPersonValue.module.css';

defineProps<{
  displayName: string;
  avatarName: string;
  secondaryText?: string;
  deviceInfo?: DetailPersonDeviceInfo;
  deviceInfoLabel?: string;
  deviceTypeLabel?: string;
  deviceIdLabel?: string;
  deviceIpLabel?: string;
  copyLabel?: string;
}>();
</script>

<template>
  <div :class="styles.host">
    <EgAvatar
      size="sm"
      :name="avatarName"
    />
    <span :class="styles.textGroup">
      <span :class="styles.name">{{ displayName }}</span>
      <template v-if="secondaryText?.trim()">
        <EgDivider
          type="navigator"
          direction="vertical"
          :class="styles.divider"
        />
        <span :class="styles.secondary">{{ secondaryText }}</span>
      </template>
    </span>
    <DetailPersonDeviceInfoTrigger
      v-if="deviceInfo"
      :device-info="deviceInfo"
      :device-info-label="deviceInfoLabel ?? 'Device information'"
      :device-type-label="deviceTypeLabel ?? 'Device Type'"
      :device-id-label="deviceIdLabel ?? 'Device ID'"
      :device-ip-label="deviceIpLabel ?? 'IP'"
      :copy-label="copyLabel ?? 'Copy'"
    />
  </div>
</template>
