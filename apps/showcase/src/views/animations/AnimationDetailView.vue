<script setup lang="ts">
import { computed } from 'vue';
import { findAnimationMeta } from '@/data/animations';
import MotionPageDemoPreview from '@/views/animations/MotionPageDemoPreview.vue';
import SceneMotionPreview from '@/views/components/previews/SceneMotionPreview.vue';

const props = defineProps<{
  slug: string;
}>();

const meta = computed(() => findAnimationMeta(props.slug));
const isMotionPageDemo = computed(() => props.slug === 'motion-page-navigation');
</script>

<template>
  <MotionPageDemoPreview v-if="isMotionPageDemo" />
  <SceneMotionPreview
    v-else-if="meta"
    :key="meta.scenario"
    :initial-scenario="meta.scenario"
    :page-title="meta.name"
  />
</template>
