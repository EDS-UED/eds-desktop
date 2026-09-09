<script setup lang="ts">
import BusinessModuleMenu from './BusinessModuleMenu.vue';
import type {
  ModuleMenuPresetGroup,
  ModuleMenuTranslate,
  UdunModuleMenuBusinessTitle,
} from './moduleMenuPresets';

withDefaults(
  defineProps<{
    /** UDun 模块名；菜单组数据待业务定稿，未配置模块回退默认结构。 */
    title?: UdunModuleMenuBusinessTitle;
    translate?: ModuleMenuTranslate;
    /** 覆盖 preset 组数据；未传时按 title 从 preset 解析。 */
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
    scenario="udun"
    :title="title"
    :translate="translate"
    :groups="groups"
    :wide="wide"
    :show-edge-divider="showEdgeDivider"
    @item-select="emit('itemSelect', $event)"
  />
</template>
