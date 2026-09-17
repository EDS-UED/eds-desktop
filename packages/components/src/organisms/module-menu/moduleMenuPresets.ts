import type { FlotationMenuItemPreset } from '../../molecules/flotation/flotationPresets';

/** 场景菜单文案本地化入口；未传时按原文渲染。 */
export type ModuleMenuTranslate = (text: string) => string;

export type ModuleMenuBusinessScenario = 'cregis' | 'udun';

export type ModuleMenuPresetAvatar = {
  name: string;
  colorIndex?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export type ModuleMenuPresetSubItem = {
  label: string;
  icon: string;
};

export type ModuleMenuPresetItem = {
  label: string;
  icon: string;
  tier?: 1 | 2;
  subitems?: ModuleMenuPresetSubItem[];
  avatar?: ModuleMenuPresetAvatar;
  message?: string;
  messageType?: 'subtle' | 'brand' | 'danger';
  focusBackground?: 'inherit' | 'same-white';
  showReddot?: boolean;
};

export type ModuleMenuPresetGroup = {
  title?: string;
  items: ModuleMenuPresetItem[];
};

/** Cregis 模块名 — 与 Cregis Nav Bar 一致。 */
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

/** UDun 模块名 — 与 UDun Nav Bar 一致；与 Cregis 列表独立。 */
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

export const DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE: CregisModuleMenuBusinessTitle = 'Wallet';
export const DEFAULT_UDUN_MODULE_MENU_BUSINESS_TITLE: UdunModuleMenuBusinessTitle = 'Wallet';

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

export function moduleMenuBusinessTitleUsesFlotationTitle(
  scenario: ModuleMenuBusinessScenario,
  title: string,
): boolean {
  const titles =
    scenario === 'udun'
      ? udunModuleMenuBusinessTitlesWithFlotationTitle
      : cregisModuleMenuBusinessTitlesWithFlotationTitle;
  return (titles as readonly string[]).includes(title);
}

const cregisTasksModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    title: 'To Do',
    items: [
      { label: 'Approval', icon: 'eds-stamp' },
      {
        label: 'Signing',
        icon: 'eds-signature-pen',
        message: '99+',
        messageType: 'danger',
        focusBackground: 'same-white',
      },
    ],
  },
  {
    title: 'Completed',
    items: [
      { label: 'Approved', icon: 'eds-batch' },
      { label: 'Signed', icon: 'eds-work-done' },
    ],
  },
  {
    items: [
      { label: 'All Records', icon: 'eds-list-square' },
      {
        label: 'Sent Request',
        icon: 'eds-list-square',
        avatar: { name: 'Point', colorIndex: 10, size: 'xs' },
      },
    ],
  },
];

/** Cregis Payment (Order) — WaaS 订单模式同步项目的模块菜单。 */
export const cregisPaymentOrderModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    items: [
      { label: 'Payment Record', icon: 'eds-text-journal' },
      { label: 'Settlement Record', icon: 'eds-task-list' },
      { label: 'Payment Exception Record', icon: 'eds-text-abnormal', showReddot: true },
    ],
  },
  {
    title: 'Callback',
    items: [
      { label: 'Callback Error', icon: 'eds-text-abnormal' },
      { label: 'History Callback', icon: 'eds-history' },
    ],
  },
  {
    items: [{ label: 'Settings', icon: 'eds-gear' }],
  },
];

const cregisPaymentEngineModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    items: [
      { label: 'Order Record', icon: 'eds-text-journal' },
      { label: 'Bulk Transfer Record', icon: 'eds-arrow-left-right' },
      { label: 'Refund Record', icon: 'eds-arrow-exit-left' },
      { label: 'Payment Exception Record', icon: 'eds-text-abnormal', showReddot: true },
    ],
  },
  {
    title: 'Payout Record',
    items: [{ label: 'Wallet Payout', icon: 'eds-arrow-launch-square' }],
  },
  {
    title: 'Callback',
    items: [
      { label: 'Callback Error', icon: 'eds-text-abnormal' },
      { label: 'History Callback', icon: 'eds-history' },
    ],
  },
  {
    items: [{ label: 'Settings', icon: 'eds-gear' }],
  },
];

const cregisAccountSettingsModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    items: [
      { label: 'Preference', icon: 'eds-user-preference' },
      { label: 'Account Security', icon: 'eds-asafety' },
      { label: 'MPC Network', icon: 'eds-website' },
      { label: 'About Cregis', icon: 'eds-cregis' },
    ],
  },
];

const cregisNotificationsModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    items: [
      { label: 'Team Activities', icon: 'eds-team' },
      { label: 'Transactions', icon: 'eds-convert' },
      { label: 'Tasks', icon: 'eds-circulation' },
      { label: 'Announcements', icon: 'eds-push' },
      { label: 'AML Alerts', icon: 'eds-alarm' },
    ],
  },
];

const cregisManageModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    items: [
      { label: 'Team Subscription', icon: 'eds-diamond' },
      { label: 'Team Account Balance', icon: 'eds-usd-accounting' },
      { label: 'Order Management', icon: 'eds-text-order' },
    ],
  },
  {
    items: [
      { label: 'Member', icon: 'eds-user-information' },
      { label: 'Role', icon: 'eds-team' },
    ],
  },
  {
    items: [
      { label: 'Team Security', icon: 'eds-asafety' },
      { label: 'API Manage', icon: 'eds-api-box' },
    ],
  },
];

export const cregisWaasModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    items: [{ label: 'Sub-Address', icon: 'eds-address-books' }],
  },
  {
    title: 'Payout Record',
    items: [
      { label: 'Wallet Payout', icon: 'eds-arrow-launch-square' },
      { label: 'Sub-Address Payout', icon: 'eds-payor-book' },
    ],
  },
  {
    title: 'Transactions',
    items: [
      { label: 'History', icon: 'eds-text-journal' },
      { label: 'Processing', icon: 'eds-clocks' },
    ],
  },
  {
    title: 'Collection',
    items: [
      { label: 'Rule Configuration', icon: 'eds-list-configure' },
      { label: 'Task Record', icon: 'eds-arrow-reply-all-email' },
      { label: 'API Collection', icon: 'eds-api-box' },
      {
        label: 'Collection Record',
        icon: 'eds-gather',
        tier: 2,
        subitems: [
          { label: 'History', icon: 'eds-text-journal' },
          { label: 'Processing', icon: 'eds-clocks' },
        ],
      },
    ],
  },
  {
    title: 'Callback',
    items: [
      { label: 'Callback Error', icon: 'eds-text-abnormal' },
      { label: 'History Callback', icon: 'eds-history' },
    ],
  },
  {
    items: [{ label: 'Settings', icon: 'eds-gear' }],
  },
];

/** 未单独配置模块（Wallet / Report 等）的回退结构。 */
export const moduleMenuFallbackGroups: ModuleMenuPresetGroup[] = [
  {
    items: [
      { label: 'Label', icon: 'eds-add' },
      { label: 'Label', icon: 'eds-add' },
    ],
  },
  {
    title: 'Title',
    items: [
      {
        label: 'Label',
        icon: 'eds-add',
        tier: 2,
        subitems: [
          { label: 'Label', icon: 'eds-add' },
          { label: 'Label', icon: 'eds-add' },
        ],
      },
      { label: 'Label', icon: 'eds-add' },
    ],
  },
  {
    title: 'Title 2',
    items: [
      { label: 'Label', icon: 'eds-add' },
      { label: 'Label', icon: 'eds-add' },
    ],
  },
];

export const cregisModuleMenuByTitle: Partial<
  Record<CregisModuleMenuBusinessTitle, ModuleMenuPresetGroup[]>
> = {
  Tasks: cregisTasksModuleMenuGroups,
  WaaS: cregisWaasModuleMenuGroups,
  'Payment Engine': cregisPaymentEngineModuleMenuGroups,
  Manage: cregisManageModuleMenuGroups,
  Notifications: cregisNotificationsModuleMenuGroups,
  'Account Settings': cregisAccountSettingsModuleMenuGroups,
};

/** UDun 菜单组数据 — 待业务定稿；未列出的模块回退 `moduleMenuFallbackGroups`。 */
export const udunModuleMenuByTitle: Partial<
  Record<UdunModuleMenuBusinessTitle, ModuleMenuPresetGroup[]>
> = {};

export function getCregisModuleMenuGroups(title: string): ModuleMenuPresetGroup[] {
  return (
    cregisModuleMenuByTitle[title as CregisModuleMenuBusinessTitle] ?? moduleMenuFallbackGroups
  );
}

export function getUdunModuleMenuGroups(title: string): ModuleMenuPresetGroup[] {
  return udunModuleMenuByTitle[title as UdunModuleMenuBusinessTitle] ?? moduleMenuFallbackGroups;
}

export function getModuleMenuGroups(
  scenario: ModuleMenuBusinessScenario,
  title: string,
): ModuleMenuPresetGroup[] {
  return scenario === 'udun' ? getUdunModuleMenuGroups(title) : getCregisModuleMenuGroups(title);
}

/** 已单独维护菜单组数据（非回退）的模块。 */
export function moduleMenuBusinessTitleHasMenuPreset(
  scenario: ModuleMenuBusinessScenario,
  title: string,
): boolean {
  if (moduleMenuBusinessTitleUsesFlotationTitle(scenario, title)) return true;
  const byTitle = scenario === 'udun' ? udunModuleMenuByTitle : cregisModuleMenuByTitle;
  return Object.prototype.hasOwnProperty.call(byTitle, title);
}

const FLOTATION_TITLE_MENU_LABELS = [
  'Aurora Merchant',
  'Borealis Acquire',
  'Cascade Disburse',
  'Delta Escrow',
  'Ember Exchange',
  'Flint Ledger',
  'Granite Invoice',
  'Harbor Transit',
  'Ivory Vault',
  'Jasper Capture',
] as const;

const FLOTATION_TITLE_ENABLED_ROWS = new Set([1, 2, 3, 5, 7, 8, 9, 10]);
const FLOTATION_TITLE_REDDOT_ROWS = new Set([3, 4, 5, 7]);

/** Module Menu 下拉标题的项目列表。 */
export const cregisModuleMenuTitleFlotationItems: FlotationMenuItemPreset[] =
  FLOTATION_TITLE_MENU_LABELS.map((label, index) => {
    const row = index + 1;
    const enabled = FLOTATION_TITLE_ENABLED_ROWS.has(row);

    return {
      label,
      boxType: 'text',
      showTag: !enabled,
      tag: enabled ? undefined : 'Disabled',
      tagStatus: 'danger',
      showReddot: FLOTATION_TITLE_REDDOT_ROWS.has(row),
    };
  });

export const cregisModuleMenuTitleFlotationProps = {
  width: 288,
  maxHeight: 540,
  addLabel: 'Create Project',
  closeOnScroll: true,
  placement: 'bottom' as const,
  align: 'start' as const,
};

/** WaaS → Doris Studio；其余浮层标题模块 → 模块名。 */
export function resolveCregisModuleMenuFlotationTitle(moduleTitle: string): string {
  if (moduleTitle === 'WaaS') return 'Doris Studio';
  return moduleTitle;
}
