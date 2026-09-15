<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { RouterLink } from 'vue-router';
import type { AnchorItem } from '@/data/types';
import styles from './PageAnchors.module.css';

const props = withDefaults(
  defineProps<{
    items: AnchorItem[];
    activeNavId: string;
    routePrefix?: string;
    isLinkActive: (item: AnchorItem) => boolean;
    isNavLabel: (item: AnchorItem) => boolean;
    anchorNavLabel: (item: AnchorItem) => string;
    isHiddenSidebarBody: (item: AnchorItem) => boolean;
  }>(),
  {
    routePrefix: 'components',
  },
);

function linkTo(item: AnchorItem) {
  return `/${props.routePrefix}/${item.pageSlug}`;
}

const listRef = ref<HTMLElement | null>(null);
const linkRefs = new Map<string, HTMLElement>();
const indicatorTop = ref(0);
const indicatorHeight = ref(0);
const indicatorVisible = ref(false);
const indicatorMoveTransition = ref(true);
let resizeObserver: ResizeObserver | undefined;

function setLinkRef(navId: string, element: Element | ComponentPublicInstance | null) {
  const node =
    element instanceof HTMLElement
      ? element
      : (element as ComponentPublicInstance | null)?.$el;

  if (node instanceof HTMLElement) {
    linkRefs.set(navId, node);
    return;
  }

  linkRefs.delete(navId);
}

function syncIndicatorPosition() {
  const list = listRef.value;
  const link = props.activeNavId ? linkRefs.get(props.activeNavId) : undefined;

  if (!list || !link) {
    indicatorVisible.value = false;
    return;
  }

  indicatorTop.value = link.offsetTop;
  indicatorHeight.value = link.offsetHeight;
  indicatorVisible.value = true;
}

function syncIndicatorWithAnimation(previousNavId = '') {
  if (!props.activeNavId) {
    indicatorMoveTransition.value = false;
    indicatorVisible.value = false;
    return;
  }

  const hasActiveLink = props.items.some(
    (item) =>
      !props.isNavLabel(item)
      && item.standalonePage
      && item.pageSlug
      && !props.isHiddenSidebarBody(item)
      && props.activeNavId === item.id,
  );

  if (!hasActiveLink) {
    indicatorVisible.value = false;
    return;
  }

  indicatorMoveTransition.value = Boolean(previousNavId);
  syncIndicatorPosition();
  indicatorVisible.value = true;
}

watch(
  () => props.activeNavId,
  (_nextId, previousId) => {
    nextTick(() => {
      syncIndicatorWithAnimation(previousId);
    });
  },
);

watch(
  () => props.items,
  () => {
    nextTick(() => {
      syncIndicatorWithAnimation('');
    });
  },
);

onMounted(() => {
  nextTick(() => {
    syncIndicatorWithAnimation('');
  });

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
  <nav ref="listRef" :class="styles.nav">
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

    <template v-for="item in items" :key="item.id">
      <span
        v-if="isNavLabel(item)"
        :class="[
          styles.navLabel,
          item.kind === 'navSection' && styles.navSectionLabel,
        ]"
      >
        {{ anchorNavLabel(item) }}
      </span>

      <RouterLink
        v-else-if="
          item.standalonePage &&
          item.pageSlug &&
          !isHiddenSidebarBody(item)
        "
        :ref="(element) => setLinkRef(item.id, element)"
        :to="linkTo(item)"
        :class="[
          styles.link,
          isLinkActive(item) && styles.linkActive,
        ]"
      >
        {{ anchorNavLabel(item) }}
      </RouterLink>
    </template>
  </nav>
</template>
