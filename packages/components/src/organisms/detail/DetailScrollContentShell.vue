<script setup lang="ts">
import { EgMotionLayoutContent } from '../../atoms/motion-layout-content';
import type { MotionPageDirection, MotionPageTransitionHandlers } from '../../atoms/motion-page';

defineProps<{
  mode: 'none' | 'content' | 'page';
  motionContentKey: string;
  contentPageStackDirection: MotionPageDirection;
  contentExiting: boolean;
  contentEntering: boolean;
  motionPageAnimating: boolean;
  scrollPageHostClass: string;
  transitionHandlers: MotionPageTransitionHandlers;
}>();
</script>

<template>
  <div
    v-if="mode === 'page'"
    class="motion-page-stack"
    :class="[scrollPageHostClass, motionPageAnimating && 'is-animating']"
    :data-page-direction="contentPageStackDirection"
  >
    <Transition
      name="motion-page"
      @before-enter="transitionHandlers.onBeforeEnter"
      @before-leave="transitionHandlers.onBeforeLeave"
      @after-enter="transitionHandlers.onAfterEnter"
      @after-leave="transitionHandlers.onAfterLeave"
    >
      <div :key="motionContentKey" class="motion-page">
        <EgMotionLayoutContent>
          <slot />
        </EgMotionLayoutContent>
      </div>
    </Transition>
  </div>
  <div v-else-if="mode === 'content'" :class="scrollPageHostClass">
    <EgMotionLayoutContent
      :content-exiting="contentExiting"
      :content-entering="contentEntering"
    >
      <slot />
    </EgMotionLayoutContent>
  </div>
  <template v-else>
    <slot />
  </template>
</template>
