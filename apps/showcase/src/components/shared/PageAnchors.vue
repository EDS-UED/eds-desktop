<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useScrollSpy } from '@/composables/useScrollSpy';
import type { AnchorItem } from '@/data/types';
import styles from './PageAnchors.module.css';

const props = defineProps<{
  items: AnchorItem[];
}>();

const sectionIds = computed(() => props.items.map((item) => item.id));
const { activeId } = useScrollSpy(sectionIds);

const listRef = ref<HTMLElement | null>(null);
const linkRefs = new Map<string, HTMLElement>();
const indicatorTop = ref(0);
const indicatorHeight = ref(0);
const indicatorVisible = ref(false);
const indicatorMoveTransition = ref(true);
let resizeObserver: ResizeObserver | undefined;

function setLinkRef(id: string, element: Element | null) {
  if (element instanceof HTMLElement) {
    linkRefs.set(id, element);
    return;
  }

  linkRefs.delete(id);
}

function syncIndicatorPosition() {
  const list = listRef.value;
  const link = activeId.value ? linkRefs.get(activeId.value) : undefined;

  if (!list || !link) {
    indicatorVisible.value = false;
    return;
  }

  indicatorTop.value = link.offsetTop;
  indicatorHeight.value = link.offsetHeight;
  indicatorVisible.value = true;
}

function syncIndicatorWithAnimation(previousActiveId = '') {
  if (!activeId.value) {
    indicatorMoveTransition.value = false;
    indicatorVisible.value = false;
    return;
  }

  indicatorMoveTransition.value = Boolean(previousActiveId);
  syncIndicatorPosition();
  indicatorVisible.value = true;
}

function scrollToSection(event: MouseEvent, id: string) {
  event.preventDefault();

  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

watch(activeId, (_nextId, previousId) => {
  syncIndicatorWithAnimation(previousId);
}, { flush: 'sync' });

watch(
  () => props.items,
  () => {
    nextTick(() => {
      syncIndicatorWithAnimation('');
    });
  },
);

onMounted(() => {
  syncIndicatorWithAnimation('');

  resizeObserver = new ResizeObserver(() => {
    syncIndicatorPosition();
  });

  if (listRef.value) {
    resizeObserver.observe(listRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <aside :class="styles.anchors" aria-label="Page anchors">
    <nav ref="listRef" :class="styles.nav" data-no-corner-smoothing>
      <div
        :class="[
          styles.activeIndicator,
          indicatorVisible && styles.activeIndicatorVisible,
          indicatorMoveTransition && styles.activeIndicatorMove,
        ]"
        :style="{
          transform: `translateY(${indicatorTop}px)`,
          height: `${indicatorHeight}px`,
        }"
        aria-hidden="true"
      />

      <a
        v-for="item in items"
        :key="item.id"
        :ref="(element) => setLinkRef(item.id, element as Element | null)"
        :href="`#${item.id}`"
        :class="[
          styles.link,
          item.depth === 2 && styles.linkNested,
          activeId === item.id && styles.linkActive,
        ]"
        @click="scrollToSection($event, item.id)"
      >
        {{ item.label }}
      </a>
    </nav>
  </aside>
</template>
