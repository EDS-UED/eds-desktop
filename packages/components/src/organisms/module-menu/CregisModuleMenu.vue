<script setup lang="ts">
import BusinessModuleMenu from './BusinessModuleMenu.vue';
import type {
  CregisModuleMenuBusinessTitle,
  ModuleMenuPresetGroup,
  ModuleMenuTranslate,
} from './moduleMenuPresets';

withDefaults(
  defineProps<{
    /** Cregis 模块名；决定菜单组数据与标题形态（WaaS / Payment Engine 为下拉标题）。 */
    title?: CregisModuleMenuBusinessTitle;
    translate?: ModuleMenuTranslate;
    /** 覆盖 preset 组数据（如 Tasks 动态 badge）；未传时按 title 从 preset 解析。 */
    groups?: ModuleMenuPresetGroup[];
    wide?: boolean;
    showEdgeDivider?: boolean;
  }>(),
  {
    title: 'Wallet',
    translate: undefined,
    groups: undefined,
    wide: false,
    showEdgeDivider: true,
  },
);

const emit = defineEmits<{
  itemSelect: [label: string];
}>();
</script>

<template>
  <BusinessModuleMenu
    scenario="cregis"
    :title="title"
    :translate="translate"
    :groups="groups"
    :wide="wide"
    :show-edge-divider="showEdgeDivider"
    @item-select="emit('itemSelect', $event)"
  />
</template>
