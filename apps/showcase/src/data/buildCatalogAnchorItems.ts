import {
  CATALOG_NAV_ROLE_GROUP_LABELS,
  resolveCatalogChildNavRole,
} from './catalogNavRole';
import type { AnchorDepth, AnchorItem, CatalogChildItem, CatalogItem, CatalogSection } from './types';
import { catalogSectionId } from './catalogSectionId';

export type CatalogChildPageSlugResolver = (child: CatalogChildItem) => string;

const MAX_ANCHOR_DEPTH: AnchorDepth = 5;

/** 侧栏缩进最深 5 层，超出的子层级并入最深层。 */
function nextAnchorDepth(depth: AnchorDepth, step: 1 | 2): AnchorDepth {
  return Math.min(depth + step, MAX_ANCHOR_DEPTH) as AnchorDepth;
}

function appendFamilyChildren(
  items: AnchorItem[],
  family: CatalogItem,
  familyDepth: AnchorDepth,
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
) {
  let activeNavGroup: ReturnType<typeof resolveCatalogChildNavRole> | null = null;

  for (const child of family.children ?? []) {
    if (child.navSubgroup) {
      activeNavGroup = null;
      items.push({
        id: `${family.slug}:${child.id}`,
        label: child.label,
        depth: nextAnchorDepth(familyDepth, 1),
        kind: 'navSubgroup',
      });
      continue;
    }

    if (child.navSection) {
      activeNavGroup = null;
      items.push({
        id: `${family.slug}:${child.id}`,
        label: child.label,
        depth: nextAnchorDepth(familyDepth, 1),
        kind: 'navSection',
      });
      continue;
    }

    const navRole = resolveCatalogChildNavRole(child.navRole);

    if (navRole === 'standard') {
      activeNavGroup = null;
    } else if (!child.navParent && navRole !== activeNavGroup) {
      items.push({
        id: `${family.slug}:nav-group:${navRole}:${child.id}`,
        label: CATALOG_NAV_ROLE_GROUP_LABELS[navRole],
        depth: nextAnchorDepth(familyDepth, 1),
        kind: 'navGroup',
      });
      activeNavGroup = navRole;
    }

    if (!child.standalonePage) continue;

    const linkDepth = nextAnchorDepth(familyDepth, child.navParent ? 2 : 1);

    items.push({
      id: `${family.slug}:${child.id}`,
      label: child.label,
      depth: linkDepth,
      parentSlug: family.slug,
      anchorId: child.id,
      pageSlug: resolveChildPageSlug?.(child) ?? child.pageSlug ?? child.id,
      standalonePage: true,
      ...(child.navParent ? { navParent: child.navParent } : {}),
      ...(child.hideSidebarBody ? { hideSidebarBody: true } : {}),
    });
  }
}

function appendFamilies(
  items: AnchorItem[],
  families: CatalogItem[],
  familyDepth: AnchorDepth,
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
) {
  for (const family of families) {
    items.push({
      id: family.slug,
      label: family.name,
      depth: familyDepth,
    });

    appendFamilyChildren(items, family, familyDepth, resolveChildPageSlug);
  }
}

export function buildCatalogAnchorItems(
  catalog: CatalogSection[],
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
): AnchorItem[] {
  const items: AnchorItem[] = [];

  for (const section of catalog) {
    items.push({
      id: catalogSectionId(section.title),
      label: section.title,
      depth: 1,
    });

    if (section.groups?.length) {
      for (const group of section.groups) {
        items.push({
          id: `${catalogSectionId(section.title)}:${group.title}`,
          label: group.title,
          depth: 2,
          kind: 'navGroup',
        });

        appendFamilies(items, group.items, 3, resolveChildPageSlug);
      }
    }

    if (section.items.length) {
      appendFamilies(items, section.items, 2, resolveChildPageSlug);
    }
  }

  return items;
}
