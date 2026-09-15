import { animationsCatalog } from '../animations/catalog';
import { catalogSectionId } from '../catalogSectionId';
import { getCatalogChildPageSlug } from '../components/navigation';
import { componentCatalog } from '../components/catalog';
import { patternsCatalog } from '../patterns/catalog';
import { scenesCatalog } from '../scenes/catalog';
import type { CatalogItem, CatalogSection } from '../types';
import { showcaseI18nOverrides } from './showcaseI18nOverrides';
import { toShowcaseI18nText } from './showcaseDisplayText';
import {
  defineComponentName,
  defineShowcaseI18nText,
  mergeShowcaseI18nText,
} from './showcaseI18nText';
import type {
  ShowcaseI18nEntry,
  ShowcaseI18nKey,
  ShowcaseI18nNamespace,
  ShowcaseI18nPartialText,
  ShowcaseI18nText,
} from './types';
function autoDescription(description: string) {
  const registered = toShowcaseI18nText(description);
  if (registered) {
    return registered;
  }
  if (!/[\u4e00-\u9fff]/.test(description)) {
    return defineShowcaseI18nText(description, description);
  }
  return defineShowcaseI18nText(description, description);
}

function isShowcaseI18nObjectOverride(
  override: ShowcaseI18nPartialText | { name: ShowcaseI18nPartialText; description?: ShowcaseI18nPartialText },
): override is { name: ShowcaseI18nPartialText; description?: ShowcaseI18nPartialText } {
  return 'name' in override;
}

function applyOverride(
  key: string,
  baseName: ShowcaseI18nText,
  baseDescription?: ShowcaseI18nText,
): ShowcaseI18nEntry {
  const override = showcaseI18nOverrides[key];
  if (!override) {
    return {
      key: key as ShowcaseI18nKey,
      name: baseName,
      description: baseDescription,
    };
  }

  if (isShowcaseI18nObjectOverride(override)) {
    return {
      key: key as ShowcaseI18nKey,
      name: mergeShowcaseI18nText(baseName, override.name),
      description: override.description
        ? mergeShowcaseI18nText(baseDescription ?? autoDescription(''), override.description)
        : baseDescription,
    };
  }

  return {
    key: key as ShowcaseI18nKey,
    name: mergeShowcaseI18nText(baseName, override),
    description: baseDescription,
  };
}

function registerFamily(
  map: Map<string, ShowcaseI18nEntry>,
  namespace: ShowcaseI18nNamespace,
  item: CatalogItem,
) {
  const key = `${namespace}:family:${item.slug}`;
  const baseName = defineComponentName(item.name);
  const baseDescription = autoDescription(item.description);
  map.set(key, applyOverride(key, baseName, baseDescription));

  for (const child of item.children ?? []) {
    if (child.navSubgroup) {
      const subgroupKey = `${namespace}:subgroup:${child.id}`;
      if (!map.has(subgroupKey)) {
        map.set(subgroupKey, applyOverride(subgroupKey, defineComponentName(child.label)));
      }
      continue;
    }

    if (child.navSection) {
      const navKey = 'nav:scenes';
      if (!map.has(navKey)) {
        map.set(navKey, applyOverride(navKey, defineComponentName(child.label)));
      }
      continue;
    }

    if (!child.standalonePage) continue;

    const pageSlug = getCatalogChildPageSlug(child);
    const pageKey = `${namespace}:page:${pageSlug}`;
    const pageName = defineComponentName(child.label);
    map.set(pageKey, applyOverride(pageKey, pageName));
  }
}

function registerCatalog(
  map: Map<string, ShowcaseI18nEntry>,
  namespace: ShowcaseI18nNamespace,
  catalog: CatalogSection[],
) {
  for (const section of catalog) {
    const sectionKey = `${namespace}:section:${catalogSectionId(section.title)}`;
    const sectionBase = defineComponentName(section.title);
    map.set(sectionKey, applyOverride(sectionKey, sectionBase));

    for (const item of section.items) {
      registerFamily(map, namespace, item);
    }

    for (const group of section.groups ?? []) {
      const groupKey = `${namespace}:group:${catalogSectionId(group.title)}`;
      const groupBase = defineComponentName(group.title);
      map.set(groupKey, applyOverride(groupKey, groupBase));
      for (const item of group.items) {
        registerFamily(map, namespace, item);
      }
    }
  }
}

let cachedEntries: ShowcaseI18nEntry[] | undefined;

/** 从 Components / Patterns / Scenes / Animations catalog 构建全量 i18n 词条。 */
export function buildShowcaseComponentI18nEntries(): ShowcaseI18nEntry[] {
  if (cachedEntries) return cachedEntries;

  const map = new Map<string, ShowcaseI18nEntry>();
  registerCatalog(map, 'components', componentCatalog);
  registerCatalog(map, 'patterns', patternsCatalog);
  registerCatalog(map, 'scenes', scenesCatalog);
  registerCatalog(map, 'animations', animationsCatalog);

  for (const key of Object.keys(showcaseI18nOverrides)) {
    if (map.has(key)) continue;
    const override = showcaseI18nOverrides[key]!;
    const en = isShowcaseI18nObjectOverride(override)
      ? (override.name.en ?? key)
      : (override.en ?? key);
    map.set(key, applyOverride(key, defineComponentName(en)));
  }

  cachedEntries = [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
  return cachedEntries;
}

export function buildShowcaseComponentI18nIndex(): ReadonlyMap<string, ShowcaseI18nEntry> {
  return new Map(buildShowcaseComponentI18nEntries().map((entry) => [entry.key, entry]));
}

export function componentFamilyI18nKey(slug: string): ShowcaseI18nKey {
  return `components:family:${slug}`;
}

export function componentPageI18nKey(pageSlug: string): ShowcaseI18nKey {
  return `components:page:${pageSlug}`;
}
