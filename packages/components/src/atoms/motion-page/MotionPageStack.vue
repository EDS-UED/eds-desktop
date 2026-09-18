<script setup lang="ts">
import { MOTION_PAGE_CONTENT, useMotionPageStack } from './motionPage';

const props = defineProps<{
  /** 初始页面 id（stack 根）。 */
  initialId: string;
}>();

const emit = defineEmits<{
  'update:currentId': [id: string];
  push: [id: string];
  pop: [];
}>();

const {
  currentId,
  pageKey,
  canPop,
  stackProps,
  transitionHandlers,
  push: pushPage,
  pop: popPage,
} = useMotionPageStack(props.initialId);

defineExpose({
  currentId,
  canPop,
  push: pushPage,
  pop: popPage,
});

function push(id: string) {
  pushPage(id);
  emit('update:currentId', id);
  emit('push', id);
}

function pop() {
  popPage();
  emit('update:currentId', currentId.value);
  emit('pop');
}
</script>

<template>
  <div v-bind="stackProps">
    <Transition
      name="motion-page"
      @before-enter="transitionHandlers.onBeforeEnter"
      @before-leave="transitionHandlers.onBeforeLeave"
      @after-enter="transitionHandlers.onAfterEnter"
      @after-leave="transitionHandlers.onAfterLeave"
    >
      <div :key="pageKey" class="motion-page">
        <div :class="MOTION_PAGE_CONTENT">
          <slot
            :current-id="currentId"
            :push="push"
            :pop="pop"
            :can-pop="canPop"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
