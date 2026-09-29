<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterSearchPickerEmpty.module.css';

const t = useFilterTranslate();
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.inner">
      <EgIcon :class="styles.icon" name="eds-business-7" fit />
      <div :class="styles.text">{{ t('暂无数据') }}</div>
    </div>
  </div>
</template>
