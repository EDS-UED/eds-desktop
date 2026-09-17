<script setup lang="ts">
import BusinessModuleMenu from './BusinessModuleMenu.vue';
import type { FlotationMenuItemPreset } from '../../molecules/flotation/flotationPresets';
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
    /** 覆盖标题浮层项目列表（如 Payment Engine 按 WaaS 订单模式同步）。 */
    titleFlotationItems?: FlotationMenuItemPreset[];
    titleFlotationSelectedIndex?: number;
    wide?: boolean;
    showEdgeDivider?: boolean;
  }>(),
  {
    title: 'Wallet',
    translate: undefined,
    groups: undefined,
    titleFlotationItems: undefined,
    titleFlotationSelectedIndex: undefined,
    wide: false,
    showEdgeDivider: true,
  },
);

const emit = defineEmits<{
  itemSelect: [label: string];
  titleAdd: [];
  titleFlotationItemSelect: [label: string, index: number];
}>();
</script>

<template>
  <BusinessModuleMenu
    scenario="cregis"
    :title="title"
    :translate="translate"
    :groups="groups"
    :title-flotation-items="titleFlotationItems"
    :title-flotation-selected-index="titleFlotationSelectedIndex"
    :wide="wide"
    :show-edge-divider="showEdgeDivider"
    @item-select="emit('itemSelect', $event)"
    @title-add="emit('titleAdd')"
    @title-flotation-item-select="(label, index) => emit('titleFlotationItemSelect', label, index)"
  />
</template>
