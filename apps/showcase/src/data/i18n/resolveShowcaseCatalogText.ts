import {
  formatShowcaseSceneSidebarLabel,
  isShowcaseScenesSectionChild,
  resolveShowcasePageComponentTag,
} from '../resolveShowcaseScenePageMeta';
import {
  componentFamilyI18nKey,
  componentPageI18nKey,
} from './buildShowcaseComponentI18n';
import type { ShowcaseI18nRegistry } from './types';
import type { CatalogChildItem } from '../types';

export function formatShowcaseI18nTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

/** 组件族名称固定 catalog 英文，不翻译。 */
export function resolveComponentFamilyName(catalogName: string): string {
  return catalogName;
}

function catalogChildIdFromAnchorId(anchorId: string | undefined): string | undefined {
  if (!anchorId?.includes(':')) return undefined;
  return anchorId.slice(anchorId.indexOf(':') + 1);
}

export function resolveComponentPageName(
  i18n: ShowcaseI18nRegistry,
  pageSlug: string,
  catalogLabel: string,
  anchorId?: string,
): string {
  const catalogChildId = catalogChildIdFromAnchorId(anchorId);
  const keys = [
    componentPageI18nKey(pageSlug),
    catalogChildId ? componentPageI18nKey(catalogChildId) : undefined,
  ].filter((key, index, list): key is ReturnType<typeof componentPageI18nKey> =>
    Boolean(key) && list.indexOf(key) === index,
  );

  for (const key of keys) {
    const resolved = i18n.tryName(key);
    if (resolved) return resolved;
  }

  return catalogLabel;
}

export function resolveShowcasePageHeaderTitle(pageSlug: string): string | undefined {
  return resolveShowcasePageComponentTag(pageSlug);
}

/** @deprecated 使用 resolveShowcasePageHeaderTitle。 */
export function resolveShowcaseScenePageHeaderTitle(
  pageSlug: string,
  _child: Pick<CatalogChildItem, 'navParent'>,
): string | undefined {
  return resolveShowcasePageHeaderTitle(pageSlug);
}

export function resolveShowcaseBodyPageSidebarName(pageSlug: string): string | undefined {
  return resolveShowcasePageComponentTag(pageSlug);
}

export type ShowcaseSceneSidebarLinkLabel = {
  componentTag: string;
  sceneLabel: string;
};

export function resolveShowcaseSceneSidebarLinkLabel(
  i18n: ShowcaseI18nRegistry,
  pageSlug: string,
  catalogLabel: string,
  child: Pick<CatalogChildItem, 'navParent'>,
  anchorId?: string,
): ShowcaseSceneSidebarLinkLabel | undefined {
  if (!isShowcaseScenesSectionChild(child)) return undefined;

  const componentTag = resolveShowcasePageComponentTag(pageSlug);
  if (!componentTag) return undefined;

  const sceneLabel = resolveComponentPageName(i18n, pageSlug, catalogLabel, anchorId);
  return { componentTag, sceneLabel };
}

/** @deprecated 使用 resolveShowcaseSceneSidebarLinkLabel 纵向两行展示。 */
export function resolveShowcaseSceneSidebarPageName(
  i18n: ShowcaseI18nRegistry,
  pageSlug: string,
  catalogLabel: string,
  child: Pick<CatalogChildItem, 'navParent'>,
  anchorId?: string,
): string | undefined {
  const linkLabel = resolveShowcaseSceneSidebarLinkLabel(
    i18n,
    pageSlug,
    catalogLabel,
    child,
    anchorId,
  );
  if (!linkLabel) return undefined;
  return formatShowcaseSceneSidebarLabel(linkLabel.componentTag, linkLabel.sceneLabel);
}

export function resolveComponentFamilyDescription(
  i18n: ShowcaseI18nRegistry,
  slug: string,
  catalogDescription: string,
): string {
  return i18n.description(componentFamilyI18nKey(slug), catalogDescription);
}

export function normalizeCatalogSubgroupId(subgroupId: string): string {
  return subgroupId.includes(':')
    ? subgroupId.slice(subgroupId.indexOf(':') + 1)
    : subgroupId;
}

export function resolveCatalogSubgroupLabel(
  i18n: ShowcaseI18nRegistry,
  subgroupId: string,
  catalogLabel: string,
): string {
  const normalized = normalizeCatalogSubgroupId(subgroupId);
  return i18n.name(`components:subgroup:${normalized}`, catalogLabel);
}
