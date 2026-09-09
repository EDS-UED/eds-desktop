/** Cregis 业务场景 Module Menu 模块名 — 与 Cregis Nav Bar 一致。 */
export const cregisModuleMenuBusinessTitles = [
  'Wallet',
  'Tasks',
  'WaaS',
  'Payment Engine',
  'Report',
  'Risk Control',
  'Manage',
  'Marketplace',
  'Notifications',
  'Account Settings',
] as const;

/** UDun 业务场景 Module Menu 模块名 — 与 UDun Nav Bar 一致；与 Cregis 列表独立。 */
export const udunModuleMenuBusinessTitles = [
  'Wallet',
  'Approval',
  'Developer',
  'Bill',
  'Manage',
  'Auto-Signing',
] as const;

export type CregisModuleMenuBusinessTitle = (typeof cregisModuleMenuBusinessTitles)[number];
export type UdunModuleMenuBusinessTitle = (typeof udunModuleMenuBusinessTitles)[number];

export type ModuleMenuBusinessScenario = 'cregis' | 'udun';

export const DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE: CregisModuleMenuBusinessTitle = 'Wallet';
export const DEFAULT_UDUN_MODULE_MENU_BUSINESS_TITLE: UdunModuleMenuBusinessTitle = 'Wallet';

/** Cregis：已在 `cregisModuleMenuByTitle` 单独维护菜单组数据的模块。 */
export const cregisModuleMenuBusinessTitlesWithMenuPreset: readonly CregisModuleMenuBusinessTitle[] =
  ['Tasks', 'Payment Engine', 'Manage', 'Notifications', 'Account Settings'];

/** UDun：已在 `udunModuleMenuByTitle` 单独维护菜单组数据的模块。 */
export const udunModuleMenuBusinessTitlesWithMenuPreset: readonly UdunModuleMenuBusinessTitle[] = [];

/** Cregis：标题走 EgFlotation Combo（模块菜单下拉标题）。 */
export const cregisModuleMenuBusinessTitlesWithFlotationTitle: readonly CregisModuleMenuBusinessTitle[] =
  ['WaaS', 'Payment Engine'];

/** UDun：标题走 EgFlotation Combo（暂无；按需扩展）。 */
export const udunModuleMenuBusinessTitlesWithFlotationTitle: readonly UdunModuleMenuBusinessTitle[] =
  [];

export function moduleMenuBusinessTitlesForScenario(
  scenario: ModuleMenuBusinessScenario,
): readonly string[] {
  return scenario === 'udun' ? udunModuleMenuBusinessTitles : cregisModuleMenuBusinessTitles;
}

export function defaultModuleMenuBusinessTitleForScenario(
  scenario: ModuleMenuBusinessScenario,
): string {
  return scenario === 'udun'
    ? DEFAULT_UDUN_MODULE_MENU_BUSINESS_TITLE
    : DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE;
}

export function moduleMenuBusinessTitleHasMenuPreset(
  scenario: ModuleMenuBusinessScenario,
  title: string,
): boolean {
  if (moduleMenuBusinessTitleUsesFlotationTitle(scenario, title)) return true;
  if (scenario === 'udun') {
    return (udunModuleMenuBusinessTitlesWithMenuPreset as readonly string[]).includes(title);
  }
  return (cregisModuleMenuBusinessTitlesWithMenuPreset as readonly string[]).includes(title);
}

export function moduleMenuBusinessTitleUsesFlotationTitle(
  scenario: ModuleMenuBusinessScenario,
  title: string,
): boolean {
  if (scenario === 'udun') {
    return (udunModuleMenuBusinessTitlesWithFlotationTitle as readonly string[]).includes(title);
  }
  return (cregisModuleMenuBusinessTitlesWithFlotationTitle as readonly string[]).includes(title);
}

export function buildModuleMenuBusinessTitleOptions(scenario: ModuleMenuBusinessScenario) {
  return moduleMenuBusinessTitlesForScenario(scenario).map((title) => ({
    value: title,
    label: moduleMenuBusinessTitleHasMenuPreset(scenario, title)
      ? title
      : `${title}（默认菜单）`,
  }));
}

export function resolveModuleMenuBusinessTitleForScenario(
  scenario: ModuleMenuBusinessScenario,
  raw: unknown,
): string {
  const value = String(raw ?? defaultModuleMenuBusinessTitleForScenario(scenario)).trim();
  if (moduleMenuBusinessTitlesForScenario(scenario).includes(value)) {
    return value;
  }
  return defaultModuleMenuBusinessTitleForScenario(scenario);
}
