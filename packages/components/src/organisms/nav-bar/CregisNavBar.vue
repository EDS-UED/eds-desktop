<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import EgNavBar from './NavBar.vue';
import { buildCregisNavBarDeclarativeAttrs } from './cregisNavBarPreset';

const props = withDefaults(
  defineProps<{
    /** 模块 / 应用入口 label 的本地化入口；未传时按原文渲染。 */
    translate?: (text: string) => string;
    corporationLabel?: string;
    corporationTitle?: string;
    corporationSubtitle?: string;
    avatarInitials?: string;
  }>(),
  {
    translate: undefined,
    corporationLabel: 'G',
    corporationTitle: '',
    corporationSubtitle: '',
    avatarInitials: 'A',
  },
);

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const slotNames = Object.keys(useSlots()) as string[];

/** preset 在前、$attrs 在后：调用方可覆盖单个模块名或企业标识。 */
const navBarAttrs = computed(() => ({
  ...buildCregisNavBarDeclarativeAttrs(props.translate),
  corporationLabel: props.corporationLabel,
  corporationTitle: props.corporationTitle,
  corporationSubtitle: props.corporationSubtitle,
  avatarInitials: props.avatarInitials,
  ...attrs,
}));
</script>

<template>
  <EgNavBar v-bind="navBarAttrs">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData ?? {}" />
    </template>
  </EgNavBar>
</template>
