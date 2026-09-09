/** Nav Bar 模块项 — label 走场景翻译，icon 对聚焦态成对出现。 */
export type CregisNavBarModulePreset = {
  label: string;
  icon: string;
  focusIcon: string;
};

/** Cregis 主模块（与 Cregis Module Menu 模块名一致）。 */
export const cregisNavBarModules: readonly CregisNavBarModulePreset[] = [
  { label: 'Wallet', icon: 'eds-wallet', focusIcon: 'eds-wallet-fill' },
  { label: 'Tasks', icon: 'eds-circulation', focusIcon: 'eds-circulation-fill' },
  { label: 'WaaS', icon: 'eds-floder-favorite', focusIcon: 'eds-floder-favorite-fill' },
  { label: 'Payment Engine', icon: 'eds-global-payments', focusIcon: 'eds-global-payments-fill' },
  { label: 'Report', icon: 'eds-bill', focusIcon: 'eds-bill-fill' },
  { label: 'Risk Control', icon: 'eds-database-safety', focusIcon: 'eds-database-safety-fill' },
  { label: 'Manage', icon: 'eds-categorization', focusIcon: 'eds-categorization-fill' },
  { label: 'Marketplace', icon: 'eds-app-ecology', focusIcon: 'eds-app-ecology-fill' },
];

/** 应用入口 — 保留库内图标原色，不参与聚焦 icon 切换。 */
export const cregisNavBarAppEntries: readonly CregisNavBarModulePreset[] = [
  { label: 'UniChain', icon: 'eds-application-22', focusIcon: 'eds-application-22' },
  { label: 'MetaMask', icon: 'eds-application-5', focusIcon: 'eds-application-5' },
];

type NavBarDeclarativeAttrs = Record<string, string | number>;

/**
 * 结构化 preset → EgNavBar 索引式声明属性（`moduleLabel1` …）。
 * `translate` 仅作用于 label；icon 名不翻译。
 */
export function buildCregisNavBarDeclarativeAttrs(
  translate?: (text: string) => string,
): NavBarDeclarativeAttrs {
  const t = (text: string) => (translate ? translate(text) : text);
  const attrs: NavBarDeclarativeAttrs = {
    moduleCount: cregisNavBarModules.length,
    appEntryCount: cregisNavBarAppEntries.length,
  };

  cregisNavBarModules.forEach((module, index) => {
    const slot = index + 1;
    attrs[`moduleLabel${slot}`] = t(module.label);
    attrs[`moduleIcon${slot}`] = module.icon;
    attrs[`moduleFocusIcon${slot}`] = module.focusIcon;
  });

  cregisNavBarAppEntries.forEach((entry, index) => {
    const slot = index + 1;
    attrs[`appEntryLabel${slot}`] = t(entry.label);
    attrs[`appEntryIcon${slot}`] = entry.icon;
    attrs[`appEntryFocusIcon${slot}`] = entry.focusIcon;
  });

  return attrs;
}
