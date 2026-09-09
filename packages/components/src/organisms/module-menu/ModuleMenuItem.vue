<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, useId, useSlots, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import {
  MOTION_HOVER_ENTER_ONLY,
  MOTION_HOVER_ENTER_SUPPRESSED,
} from '../../atoms/motion-hover-enter';
import {
  EgMessage,
  EgReddot,
  type MessageFocusBackground,
  type MessageType,
} from '../../molecules/feedback';
import { MESSAGE_PARENT_FOCUSED_KEY } from '../../molecules/feedback/messageFocusContext';
import { useModuleMenuItemFocus } from './moduleMenuItemFocus';
import styles from './ModuleMenu.module.css';

export type ModuleMenuItemTier = 1 | 2;

const props = withDefaults(
  defineProps<{
    label?: string;
    tier?: ModuleMenuItemTier;
    subitem?: boolean;
    /** 无 EgModuleMenu 聚焦上下文时的受控聚焦。 */
    focused?: boolean;
    trailingIcon?: string;
    message?: string;
    messageType?: MessageType;
    messageFocusBackground?: MessageFocusBackground;
    showReddot?: boolean;
  }>(),
  {
    label: 'Label',
    tier: 1,
    subitem: false,
    focused: false,
    trailingIcon: undefined,
    message: undefined,
    messageType: 'subtle',
    messageFocusBackground: 'inherit',
    showReddot: false,
  },
);

const expanded = defineModel<boolean>('expanded', { default: false });

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const slots = useSlots();
const itemId = useId();
const menuFocus = useModuleMenuItemFocus();

const isSubitem = computed(() => props.subitem);

const isTier2Parent = computed(() => props.tier === 2 && !isSubitem.value);

const hasSubitems = computed(() => isTier2Parent.value && Boolean(slots.default));

/** 有下属 Item 的分组父级只负责展开/收起，不参与菜单聚焦。 */
const participatesInFocus = computed(() => !(isTier2Parent.value && hasSubitems.value));

function syncFocusRegistration() {
  if (!menuFocus) return;
  if (participatesInFocus.value) {
    menuFocus.register(itemId);
  } else {
    menuFocus.unregister(itemId);
  }
}

onMounted(syncFocusRegistration);
watch(participatesInFocus, syncFocusRegistration);
onBeforeUnmount(() => {
  menuFocus?.unregister(itemId);
});

const isFocused = computed(() => {
  if (!participatesInFocus.value) return false;
  if (menuFocus) {
    return menuFocus.isFocused(itemId);
  }
  return props.focused;
});

provide(MESSAGE_PARENT_FOCUSED_KEY, isFocused);

const branchTrailingIcon = computed((): string | undefined => {
  if (!hasSubitems.value) return undefined;
  if (props.trailingIcon) return props.trailingIcon;
  return expanded.value ? 'eds-arrow-up-mini-ios' : 'eds-arrow-right-mini-ios';
});

const showAccessoryMessage = computed(() => Boolean(props.message?.trim()));

function accessorySlotHasContent(): boolean {
  if (!slots.accessory) return false;
  return slots.accessory({}).length > 0;
}

const showAccessoryReddot = computed(
  () => props.showReddot && !props.message?.trim() && !accessorySlotHasContent(),
);

const hasAccessory = computed(
  () =>
    accessorySlotHasContent() ||
    showAccessoryMessage.value ||
    showAccessoryReddot.value,
);

const itemClass = computed(() => [
  styles.item,
  MOTION_HOVER_ENTER_ONLY,
  isSubitem.value && styles.itemLevel1,
  isFocused.value && styles.itemFocused,
  isFocused.value && MOTION_HOVER_ENTER_SUPPRESSED,
]);

function onBranchClick(event: MouseEvent) {
  if (participatesInFocus.value) {
    menuFocus?.select(itemId, event);
  }
  if (hasSubitems.value) {
    expanded.value = !expanded.value;
  }
  emit('click', event);
}

function onItemClick(event: MouseEvent) {
  menuFocus?.select(itemId, event);
  emit('click', event);
}
</script>

<template>
  <div v-if="isTier2Parent" :class="styles.itemBranch">
    <button
      type="button"
      class="eds-module-menu-item"
      :class="itemClass"
      :aria-expanded="hasSubitems ? expanded : undefined"
      :aria-pressed="isFocused || undefined"
      @click="onBranchClick"
    >
      <span :class="styles.itemIcon">
        <slot name="icon">
          <EgIcon name="eds-add" size="sm" />
        </slot>
      </span>
      <span :class="styles.itemMain">
        <span :class="styles.itemLabel">{{ label }}</span>
        <span v-if="branchTrailingIcon" :class="styles.itemTrailing">
          <EgIcon :name="branchTrailingIcon" size="sm" fit />
        </span>
      </span>
      <span v-if="hasAccessory" :class="styles.itemAccessory">
        <slot name="accessory">
          <EgMessage
            v-if="showAccessoryMessage"
            :text="String(message)"
            :type="messageType"
            :focus-background="messageFocusBackground"
          />
          <EgReddot v-else-if="showAccessoryReddot" />
        </slot>
      </span>
    </button>
    <div v-if="hasSubitems && expanded" :class="styles.itemSubList">
      <slot />
    </div>
  </div>
  <button
    v-else
    type="button"
    class="eds-module-menu-item"
    :class="itemClass"
    :aria-pressed="isFocused || undefined"
    @click="onItemClick"
  >
    <span :class="styles.itemIcon">
      <slot name="icon">
        <EgIcon name="eds-add" size="sm" />
      </slot>
    </span>
    <span :class="styles.itemMain">
      <span :class="styles.itemLabel">{{ label }}</span>
    </span>
    <span v-if="hasAccessory" :class="styles.itemAccessory">
      <slot name="accessory">
        <EgMessage
          v-if="showAccessoryMessage"
          :text="String(message)"
          :type="messageType"
          :focus-background="messageFocusBackground"
        />
        <EgReddot v-else-if="showAccessoryReddot" />
      </slot>
    </span>
  </button>
</template>
