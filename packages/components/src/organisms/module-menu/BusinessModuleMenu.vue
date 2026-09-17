<script setup lang="ts">
import { computed } from 'vue';
import { EgAvatar } from '../../atoms/avatar';
import { EgIcon } from '../../atoms/icons';
import EgFlotation from '../../molecules/flotation/Flotation.vue';
import EgModuleMenuTrigger from '../../molecules/flotation/ModuleMenuTrigger.vue';
import EgModuleMenu from './ModuleMenu.vue';
import EgModuleMenuGroup from './ModuleMenuGroup.vue';
import EgModuleMenuItem from './ModuleMenuItem.vue';
import type { FlotationMenuItemPreset } from '../../molecules/flotation/flotationPresets';
import {
  cregisModuleMenuTitleFlotationItems,
  cregisModuleMenuTitleFlotationProps,
  defaultModuleMenuBusinessTitleForScenario,
  getModuleMenuGroups,
  moduleMenuBusinessTitleUsesFlotationTitle,
  resolveCregisModuleMenuFlotationTitle,
  type ModuleMenuBusinessScenario,
  type ModuleMenuPresetGroup,
  type ModuleMenuTranslate,
} from './moduleMenuPresets';

const props = withDefaults(
  defineProps<{
    scenario: ModuleMenuBusinessScenario;
    /** 模块名；决定菜单组数据与标题形态。 */
    title?: string;
    translate?: ModuleMenuTranslate;
    /** 覆盖 preset 组数据（如 Tasks 动态 badge）；未传时按 title 从 preset 解析。 */
    groups?: ModuleMenuPresetGroup[];
    /** 覆盖标题浮层项目列表（如 Payment Engine 按 WaaS 订单模式同步）。 */
    titleFlotationItems?: FlotationMenuItemPreset[];
    /** 标题浮层当前选中行；与 EgFlotation selectedIndex 对齐，勿再设 item.focused。 */
    titleFlotationSelectedIndex?: number;
    wide?: boolean;
    showEdgeDivider?: boolean;
  }>(),
  {
    title: undefined,
    translate: undefined,
    groups: undefined,
    titleFlotationItems: undefined,
    titleFlotationSelectedIndex: undefined,
    wide: false,
    showEdgeDivider: true,
  },
);

const emit = defineEmits<{
  /** 原文（英文）label，便于业务侧路由与状态匹配。 */
  itemSelect: [label: string];
  /** 模块标题浮层底部「创建项目」等 Add 行点击。 */
  titleAdd: [];
  /** 标题浮层项目行点击（原文 label + 行索引）。 */
  titleFlotationItemSelect: [label: string, index: number];
}>();

const moduleTitle = computed(
  () => props.title ?? defaultModuleMenuBusinessTitleForScenario(props.scenario),
);

function t(text: string): string {
  return props.translate ? props.translate(text) : text;
}

const groups = computed(
  () => props.groups ?? getModuleMenuGroups(props.scenario, moduleTitle.value),
);

const usesFlotationTitle = computed(() =>
  moduleMenuBusinessTitleUsesFlotationTitle(props.scenario, moduleTitle.value),
);

const menuTitle = computed(() =>
  t(
    usesFlotationTitle.value
      ? resolveCregisModuleMenuFlotationTitle(moduleTitle.value)
      : moduleTitle.value,
  ),
);

const flotationItems = computed(() => {
  const items = props.titleFlotationItems ?? cregisModuleMenuTitleFlotationItems;
  return items.map((item) => ({
    ...item,
    tag: item.tag ? t(item.tag) : item.tag,
    modeTag: item.modeTag ? t(item.modeTag) : item.modeTag,
  }));
});

const flotationProps = computed(() => ({
  ...cregisModuleMenuTitleFlotationProps,
  addLabel: t(cregisModuleMenuTitleFlotationProps.addLabel),
}));
</script>

<template>
  <EgModuleMenu
    :key="moduleTitle"
    :title="menuTitle"
    :title-mode="usesFlotationTitle ? 'trigger' : 'text'"
    :wide="wide"
    :show-edge-divider="showEdgeDivider"
  >
    <template v-if="usesFlotationTitle" #title>
      <EgFlotation
        v-bind="flotationProps"
        :items="flotationItems"
        :selected-index="titleFlotationSelectedIndex"
        @item-click="(_item, index) => emit('titleFlotationItemSelect', _item.label, index)"
        @add="emit('titleAdd')"
      >
        <template #trigger="{ expanded, selectedItem, hasAnyItemReddot }">
          <EgModuleMenuTrigger
            trigger-style="text"
            width-mode="trigger"
            :label="selectedItem?.label ?? menuTitle"
            :show-reddot="hasAnyItemReddot"
            :expanded="expanded"
          />
        </template>
      </EgFlotation>
    </template>

    <EgModuleMenuGroup
      v-for="(group, groupIndex) in groups"
      :key="`group-${groupIndex}`"
      :title="group.title ? t(group.title) : undefined"
    >
      <template
        v-for="(item, itemIndex) in group.items"
        :key="`group-${groupIndex}-item-${itemIndex}`"
      >
        <EgModuleMenuItem
          :tier="item.tier ?? 1"
          :label="t(item.label)"
          :message="item.message?.trim() || undefined"
          :message-type="item.messageType ?? 'subtle'"
          :message-focus-background="item.focusBackground ?? 'inherit'"
          :show-reddot="Boolean(item.showReddot)"
          @click="emit('itemSelect', item.label)"
        >
          <template #icon>
            <EgAvatar
              v-if="item.avatar"
              :name="item.avatar.name"
              :size="item.avatar.size ?? 'xs'"
              :color-index="item.avatar.colorIndex"
            />
            <EgIcon v-else :name="item.icon" size="sm" />
          </template>
          <template v-if="(item.tier ?? 1) === 2 && item.subitems?.length">
            <EgModuleMenuItem
              v-for="(subItem, subIndex) in item.subitems"
              :key="`group-${groupIndex}-item-${itemIndex}-sub-${subIndex}`"
              subitem
              :label="t(subItem.label)"
              @click="emit('itemSelect', subItem.label)"
            >
              <template #icon>
                <EgIcon :name="subItem.icon" size="sm" />
              </template>
            </EgModuleMenuItem>
          </template>
        </EgModuleMenuItem>
      </template>
    </EgModuleMenuGroup>
  </EgModuleMenu>
</template>
