<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import {
  resolveCatalogSubgroupLabel,
  resolveComponentFamilyName,
  resolveComponentPageName,
} from '@/data/i18n/resolveShowcaseCatalogText';
import { componentAnchorItems } from '@/data/components';
import { anchorItemsForFamily } from '@/data/components/anchorItemsForFamily';
import { findComponentsSidebarFamilyId } from '@/layout/buildComponentsSidebarSections';
import {
  findCatalogChildPage,
  findCatalogItem,
  getCatalogChildAnchorIds,
  getComponentRouteSlug,
  moleculeUsesChildPages,
} from '@/data/components/navigation';
import type { AnchorItem } from '@/data/types';
import { useScrollSpy } from '@/composables/useScrollSpy';
import PageAnchorLinkNav from './PageAnchorLinkNav.vue';
import styles from './PageAnchors.module.css';

type AnchorNavSection = {
  id: string;
  heading: string | null;
  items: AnchorItem[];
};

type AnchorNavBlock = {
  id: 'body' | 'scenes';
  heading: string;
  sections: AnchorNavSection[];
};

function splitBodyAndScenes(items: AnchorItem[]) {
  const sectionIndex = items.findIndex((item) => item.kind === 'navSection');

  if (sectionIndex < 0) {
    return { body: items, scenes: [] as AnchorItem[] };
  }

  return {
    body: items.slice(0, sectionIndex),
    scenes: items.slice(sectionIndex + 1),
  };
}

function groupAnchorNavSections(items: AnchorItem[]): AnchorNavSection[] {
  const hasSubgroup = items.some((item) => item.kind === 'navSubgroup');

  if (!hasSubgroup) {
    return [{ id: 'default', heading: null, items }];
  }

  const sections: AnchorNavSection[] = [];

  for (const item of items) {
    if (item.kind === 'navSubgroup') {
      sections.push({
        id: item.id,
        heading: item.label,
        items: [],
      });
      continue;
    }

    const section = sections[sections.length - 1];
    if (!section) {
      sections.push({ id: 'default', heading: null, items: [item] });
      continue;
    }

    section.items.push(item);
  }

  return sections;
}

function isVisibleAnchorLink(item: AnchorItem) {
  return Boolean(item.standalonePage && item.pageSlug && !item.hideSidebarBody);
}

function sectionHasVisibleContent(
  section: AnchorNavSection,
  isNavLabel: (item: AnchorItem) => boolean,
) {
  if (section.heading) {
    return section.items.some((item) => !isNavLabel(item) && isVisibleAnchorLink(item));
  }

  return section.items.some(
    (item) =>
      isVisibleAnchorLink(item)
      || (isNavLabel(item) && item.kind !== 'navSubgroup' && item.kind !== 'navSection'),
  );
}

function buildAnchorNavBlock(
  id: AnchorNavBlock['id'],
  heading: string,
  items: AnchorItem[],
  isNavLabel: (item: AnchorItem) => boolean,
): AnchorNavBlock | null {
  const sections = groupAnchorNavSections(items).filter((section) =>
    sectionHasVisibleContent(section, isNavLabel),
  );

  if (!sections.length) {
    return null;
  }

  return { id, heading, sections };
}

const route = useRoute();
const { locale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const activeSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const activeFamilySlug = computed(() => findComponentsSidebarFamilyId(activeSlug.value));

const scopedAnchorItems = computed(() =>
  anchorItemsForFamily(activeFamilySlug.value, componentAnchorItems).filter(
    (item) => item.kind !== 'navGroup',
  ),
);

const childPage = computed(() => findCatalogChildPage(activeSlug.value));

const scrollSpyMoleculeSlug = computed(() => {
  if (childPage.value) return '';
  const entry = findCatalogItem(activeSlug.value);
  if (entry && moleculeUsesChildPages(entry.item)) return '';
  return activeSlug.value;
});

const childAnchorIds = computed(() =>
  scrollSpyMoleculeSlug.value ? getCatalogChildAnchorIds(scrollSpyMoleculeSlug.value) : [],
);

const { activeId: scrollActiveId, refresh: refreshScrollSpy } = useScrollSpy(childAnchorIds);

const activeNavId = computed(() => {
  if (childPage.value) {
    const { parent, child } = childPage.value;
    if (child.hideSidebarBody) {
      return parent.item.slug;
    }
    return `${parent.item.slug}:${child.id}`;
  }

  if (childAnchorIds.value.length && scrollActiveId.value) {
    return `${activeSlug.value}:${scrollActiveId.value}`;
  }

  return activeSlug.value;
});

const anchorNavBlocks = computed((): AnchorNavBlock[] => {
  const { body, scenes } = splitBodyAndScenes(scopedAnchorItems.value);
  const blocks: AnchorNavBlock[] = [];

  void locale.value;
  const bodyBlock = buildAnchorNavBlock(
    'body',
    i18n.name('shell:body-block', 'Body'),
    body,
    isNavLabel,
  );
  if (bodyBlock) {
    blocks.push(bodyBlock);
  }

  const scenesBlock = buildAnchorNavBlock(
    'scenes',
    i18n.name('shell:scenes-block', 'Scenes'),
    scenes,
    isNavLabel,
  );
  if (scenesBlock) {
    blocks.push(scenesBlock);
  }

  return blocks;
});

function shouldShowBlockHeading(block: AnchorNavBlock) {
  return !(block.id === 'body' && activeFamilySlug.value === 'flotation');
}

function isHiddenSidebarBody(item: (typeof componentAnchorItems)[number]) {
  return Boolean(item.hideSidebarBody);
}

function isLinkActive(item: (typeof scopedAnchorItems.value)[number]) {
  if (item.depth && item.depth >= 2 && item.depth <= 5 && item.standalonePage) {
    return activeNavId.value === item.id;
  }

  if (childAnchorIds.value.length) {
    return false;
  }

  return activeNavId.value === item.id;
}

function isNavLabel(item: (typeof scopedAnchorItems.value)[number]) {
  return item.kind === 'navGroup' || item.kind === 'navSection' || item.kind === 'navSubgroup';
}

function anchorNavLabel(item: (typeof scopedAnchorItems.value)[number]) {
  void locale.value;
  if (item.kind === 'navSubgroup') {
    return resolveCatalogSubgroupLabel(i18n, item.id, item.label);
  }
  if (item.standalonePage && item.pageSlug) {
    return resolveComponentPageName(i18n, item.pageSlug, item.label, item.id);
  }
  return resolveComponentFamilyName(item.label);
}

function anchorSectionHeading(section: AnchorNavSection) {
  void locale.value;
  if (!section.heading) return '';
  return resolveCatalogSubgroupLabel(i18n, section.id, section.heading);
}

watch(activeSlug, () => {
  nextTick(() => {
    void refreshScrollSpy();
  });
});

onMounted(() => {
  nextTick(() => {
    void refreshScrollSpy();
  });
});
</script>

<template>
  <aside :class="[styles.anchors, styles.componentsAnchors]" aria-label="Components navigation">
    <div
      v-for="block in anchorNavBlocks"
      :key="block.id"
      :class="styles.navCategory"
    >
      <span
        v-if="shouldShowBlockHeading(block)"
        :class="styles.anchorsHeading"
      >
        {{ block.heading }}
      </span>

      <div
        v-for="section in block.sections"
        :key="section.id"
        :class="styles.navSection"
      >
        <span
          v-if="section.heading"
          :class="styles.anchorsHeading"
        >
          {{ anchorSectionHeading(section) }}
        </span>

        <PageAnchorLinkNav
          :items="section.items"
          :active-nav-id="activeNavId"
          :is-link-active="isLinkActive"
          :is-nav-label="isNavLabel"
          :anchor-nav-label="anchorNavLabel"
          :is-hidden-sidebar-body="isHiddenSidebarBody"
        />
      </div>
    </div>
  </aside>
</template>
