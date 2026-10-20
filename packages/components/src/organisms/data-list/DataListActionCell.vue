<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '../../molecules/button';
import {
  DATA_LIST_ROW_MORE_EXCLUSIVE_GROUP,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '../../molecules/flotation';
import styles from './DataList.module.css';
import type { DataListRowAction } from './types';

const props = withDefaults(
  defineProps<{
    primaryAction?: { label: string };
    moreActions?: DataListRowAction[];
  }>(),
  {
    moreActions: () => [],
  },
);

const emit = defineEmits<{
  'primary-click': [];
  'more-click': [key: string];
}>();

const resolvedMore = computed(() => {
  const items = props.moreActions.slice(0, 20);
  const normal = items.filter((action) => !action.danger);
  const danger = items.filter((action) => action.danger);
  return [...normal, ...danger];
});

const showSecondButton = computed(
  () => Boolean(props.primaryAction) && resolvedMore.value.length === 1,
);

const showMoreMenu = computed(
  () => Boolean(props.primaryAction) && resolvedMore.value.length > 1,
);

const secondAction = computed(() => resolvedMore.value[0]);
</script>

<template>
  <div v-if="primaryAction" :class="styles.actionCell" @click.stop>
    <EgFlotation
      v-if="showMoreMenu"
      placement="bottom"
      align="end"
      flip
      boundary-selector=".eds-data-list"
      width-mode="adaptive"
      height-mode="adaptive"
      :exclusive-group="DATA_LIST_ROW_MORE_EXCLUSIVE_GROUP"
      :show-add="false"
      :show-menu-divider="false"
      close-on-scroll
    >
      <template #trigger="{ expanded }">
        <EgButton variant="text" tone="subtle" size="md" :active="expanded" :aria-expanded="expanded">
          More
        </EgButton>
      </template>
      <template #content="{ close }">
        <EgFlotationMenu
          panel-radius="radius-md"
          width-mode="adaptive"
          height-mode="adaptive"
          :scrollable="false"
          :show-add="false"
          :show-divider="false"
        >
          <EgFlotationMenuItem
            v-for="action in resolvedMore"
            :key="action.key"
            box-type="text"
            :label="action.label"
            :danger="action.danger"
            :show-tag="false"
            @click="
              () => {
                emit('more-click', action.key);
                close();
              }
            "
          />
        </EgFlotationMenu>
      </template>
    </EgFlotation>

    <EgButton
      v-else-if="showSecondButton && secondAction"
      variant="text"
      size="md"
      :tone="secondAction.danger ? 'danger' : 'subtle'"
      @click="emit('more-click', secondAction.key)"
    >
      {{ secondAction.label }}
    </EgButton>

    <EgButton variant="solid" size="md" tone="decor" @click="emit('primary-click')">
      {{ primaryAction.label }}
    </EgButton>
  </div>
</template>
