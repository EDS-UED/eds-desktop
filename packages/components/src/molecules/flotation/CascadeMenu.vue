<script setup lang="ts">
import { computed, useSlots } from 'vue';
import EgFlotationMenu from './FlotationMenu.vue';
import EgFlotationMenuItem from './FlotationMenuItem.vue';
import { createDefaultFlotationPresetItems, type FlotationMenuItemPreset } from './flotationPresets';

const props = withDefaults(
  defineProps<{
    /** 级联行数据；每行强制带级联箭头。 */
    items?: FlotationMenuItemPreset[];
  }>(),
  {
    items: () => createDefaultFlotationPresetItems(),
  },
);

const emit = defineEmits<{
  itemClick: [item: FlotationMenuItemPreset, index: number];
}>();

const slots = useSlots();
const hasHeaderSlot = computed(() => Boolean(slots.header));
</script>

<template>
  <EgFlotationMenu v-bind="$attrs" data-flotation-scene="cascade-menu">
    <template v-if="hasHeaderSlot" #header>
      <slot name="header" />
    </template>
    <slot>
      <EgFlotationMenuItem
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        :box-type="item.boxType ?? 'text'"
        :label="item.label"
        :disabled="item.disabled"
        :focused="item.focused"
        :show-checkbox="item.showCheckbox"
        :checked="item.checked"
        :show-tag="Boolean(item.showTag)"
        :tag-text="item.tag ?? 'Tag'"
        :tag-status="item.tagStatus ?? 'danger'"
        :show-reddot="item.showReddot"
        show-cascader
        :show-message="item.showMessage"
        :message-text="item.messageText ?? '0'"
        :message-type="item.messageType ?? 'subtle'"
        :symbol-icon="item.symbolIcon ?? 'eds-add'"
        @click="emit('itemClick', item, index)"
      />
    </slot>
  </EgFlotationMenu>
</template>
