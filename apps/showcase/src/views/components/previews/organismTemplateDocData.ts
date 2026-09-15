import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  buildVueOpeningTag,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  buttonToneRows,
  countSelectOptions,
  propLabelSelectOptions,
  showcaseBatchBarActionTypeLabels,
  showcaseComboPopupCountLabels,
  showcaseLayoutTypeLabels,
  showcaseModuleMenuAccessoryLabels,
  showcaseModuleMenuScenarioLabels,
  showcaseModuleMenuTitleKindLabels,
  showcaseFeedbackMessageTypeLabels,
  showcaseMessageFocusBackgroundLabels,
  showcasePageBgLabels,
  showcasePaginerDataVolumeLabels,
  showcasePopupUsesLabels,
  showcasePopupAlertVerticalAlignLabels,
  showcaseDialogTypeLabels,
  showcaseYesNoLabels,
  tokenLabel,
  tokenOption,
} from '@/data/showcasePropLabels';
import {
  DIALOG_TYPES,
  dialogCustomizeControls,
  dialogCustomizeDefaults,
  dialogFigmaNode,
  dialogPropRows,
} from './dialogDocCustomize';
import {
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  buildModuleMenuBusinessTitleOptions,
  moduleMenuBusinessTitleUsesFlotationTitle,
  resolveModuleMenuBusinessTitleForScenario,
  type ModuleMenuBusinessScenario,
} from '@/presets/module-menu/businessModuleTitles';
import {
  flotationTriggerModuleMenuDefaults,
  flotationTriggerOverviewModuleMenuControls,
} from './flotationDocCustomize';
import {
  buildIconButtonProSingleCustomizeControls,
  buildIconButtonProZoneItemControls,
  buildPaginerPaginationCustomizeControls,
  iconButtonProSingleItemDefaults,
  iconButtonProZoneItemDefaultsForRange,
  paginerPaginationCustomizeDefaults,
} from './buttonDocCustomize';
import {
  DATA_LIST_PREVIEW_COLUMN_COUNT,
  dataListColumnDataSourceOptions,
  dataListColumnSettingDefaults,
  dataListColumnSettingLabel,
} from './dataListPagePreviewData';
import { popupVerifyCustomizeControls, popupVerifyCustomizeDefaults } from './verifyDocCustomize';
import {
  popupCustomBoxSizePresetControl,
  isPopupCustomBoxSizePresetCustom,
  popupCustomChromeDefaults,
  popupCustomBoxSizeDefaults,
  popupCustomContentInsetDefaults,
  popupCustomContentInsetPresetControl,
} from './popupDocCustomize';

export const ORGANISM_IMPORT = `import {
  EgNavBar,
  EgNavBarCorporation,
  EgNavBarModuleItem,
  EgNavBarBottomIcon,
  EgNavBarAvatar,
  EgModuleMenu,
  EgModuleMenuGroup,
  EgModuleMenuItem,
  EgModuleMenuSection,
  EgModuleMenuSectionTitle,
  EgToolBar,
  EgIconProButton,
  EgPaginer,
  EgPaginationGroupButton,
  EgDataList,
  EgDataListColumn,
  EgDialog,
  EgMessage,
  EgReddot,
  EgBatchBar,
  EgBatchBarActionItem,
  EgContainer,
  EgLayout,
  EgPopup,
  EgDetail,
  EgSkid,
  EgIcon,
  EgAvatar,
  EgComboPopupButton,
} from '@eds/desktop-components';`;

export type OrganismPropRow = DocPropRow;

export const navBarFigmaNode = '2085:772';

const NAV_BAR_MODULE_COUNT_MAX = 20;
const NAV_BAR_APP_ENTRY_COUNT_MAX = 20;

const navBarModuleCountOptions = countSelectOptions(NAV_BAR_MODULE_COUNT_MAX);

const navBarAppEntryCountOptions = Array.from({ length: NAV_BAR_APP_ENTRY_COUNT_MAX + 1 }, (_, index) => {
  const value = String(index);
  return { value, label: value === '0' ? tokenLabel('无', '0') : `${value} 个` };
});

function navBarModuleLabelDefaults(label = 'Label'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_MODULE_COUNT_MAX; index += 1) {
    entries[`moduleLabel${index}`] = label;
  }
  return entries;
}

function navBarModuleIconDefaults(icon = 'eds-add'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_MODULE_COUNT_MAX; index += 1) {
    entries[`moduleIcon${index}`] = icon;
    entries[`moduleFocusIcon${index}`] = icon;
  }
  return entries;
}

function navBarModuleReddotDefaults(show = false): Record<string, boolean> {
  const entries: Record<string, boolean> = {};
  for (let index = 1; index <= NAV_BAR_MODULE_COUNT_MAX; index += 1) {
    entries[`moduleReddot${index}`] = show;
  }
  return entries;
}

function navBarAppEntryLabelDefaults(label = 'Label'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_APP_ENTRY_COUNT_MAX; index += 1) {
    entries[`appEntryLabel${index}`] = label;
  }
  entries.appEntryLabel1 = 'UniChain';
  entries.appEntryLabel2 = 'MetaMask';
  return entries;
}

function navBarAppEntryIconDefaults(icon = 'eds-add'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_APP_ENTRY_COUNT_MAX; index += 1) {
    entries[`appEntryIcon${index}`] = icon;
    entries[`appEntryFocusIcon${index}`] = icon;
  }
  entries.appEntryIcon1 = 'eds-application-22';
  entries.appEntryFocusIcon1 = 'eds-application-22';
  entries.appEntryIcon2 = 'eds-application-5';
  entries.appEntryFocusIcon2 = 'eds-application-5';
  return entries;
}

function navBarAppEntryReddotDefaults(show = false): Record<string, boolean> {
  const entries: Record<string, boolean> = {};
  for (let index = 1; index <= NAV_BAR_APP_ENTRY_COUNT_MAX; index += 1) {
    entries[`appEntryReddot${index}`] = show;
  }
  return entries;
}

export type NavBarScenario = 'nav-bar' | 'cregis';

export const navBarWidthOptions = propLabelSelectOptions(['74', '210'] as const, {
  '74': '74px（默认）',
  '210': '210px',
});

export function isNavBarWideCustomize(state: Record<string, unknown>): boolean {
  return String(state.navBarWidth ?? '74') === '210';
}

export const cregisNavBarPropRows: OrganismPropRow[] = [
  {
    name: 'moduleCount',
    type: 'number',
    defaultValue: '8',
    description: showcaseText('Number of declarative modules (paired with moduleLabelN/moduleIconN/moduleFocusIconN).', '声明式模块数量（与 moduleLabelN / moduleIconN / moduleFocusIconN 配套）。'),
  },
  {
    name: 'moduleLabelN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Nth module copy (N = 1… 20), e.g. moduleLabel1 = "Wallet".', '第 N 个模块文案（N=1…20），如 moduleLabel1="Wallet"。'),
  },
  {
    name: 'moduleIconN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('The Nth module default icon name.', '第 N 个模块默认 icon name。'),
  },
  {
    name: 'moduleFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('The Nth module focuses on the icon name.', '第 N 个模块聚焦 icon name。'),
  },
  {
    name: 'appEntryLabelN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Applies the entry copy (N = 1… 20); automatically renders the entry under the Module Divider when there is a value.', '应用入口文案（N=1…20）；有值时自动渲染 Module Divider 下入口项。'),
  },
  {
    name: 'appEntryIconN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Applies the default icon name for the portal.', '应用入口默认 icon name。'),
  },
  {
    name: 'appEntryFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Apply the entry focus icon name.', '应用入口聚焦 icon name。'),
  },
];

export const navBarCustomizeDefaults = {
  scenario: 'nav-bar' as NavBarScenario,
  showDivider: true,
  navBarWidth: '74',
  moduleCount: '4',
  appEntryCount: '2',
  ...navBarModuleLabelDefaults(),
  ...navBarModuleIconDefaults(),
  ...navBarModuleReddotDefaults(),
  ...navBarAppEntryLabelDefaults(),
  ...navBarAppEntryIconDefaults(),
  ...navBarAppEntryReddotDefaults(),
  corporationLabel: 'G',
  corporationTitle: 'Fat-Test',
  corporationSubtitle: 'Basic',
  avatarInitials: 'N',
};

export const navBarCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'navBarWidth',
    label: showcaseText('Width', '宽度'),
    options: navBarWidthOptions,
  },
  {
    kind: 'select',
    key: 'moduleCount',
    label: showcaseText('ModuleCount', '模块数量'),
    options: navBarModuleCountOptions,
  },
  {
    kind: 'select',
    key: 'appEntryCount',
    label: showcaseText('Number of entries applied', '应用入口数量'),
    options: navBarAppEntryCountOptions,
  },
  {
    kind: 'text',
    key: 'corporationLabel',
    label: showcaseText('Corporate Identity', '企业标识'),
    visibleWhen: (state) => !isNavBarWideCustomize(state),
  },
  {
    kind: 'text',
    key: 'corporationTitle',
    label: showcaseText('Company name', '企业名称'),
    visibleWhen: (state) => isNavBarWideCustomize(state),
  },
  {
    kind: 'text',
    key: 'corporationSubtitle',
    label: showcaseText('Version', '版本'),
    visibleWhen: (state) => isNavBarWideCustomize(state),
  },
  {
    kind: 'text',
    key: 'avatarInitials',
    label: showcaseText('Avatar Initials', '头像缩写'),
  },
  {
    kind: 'boolean',
    key: 'showDivider',
    label: showcaseText('TrailingDivider', '右侧分割线'),
  },
];

export const navBarModuleLabelCustomizeControls: DocCustomizeControl[] = Array.from(
  { length: NAV_BAR_MODULE_COUNT_MAX },
  (_, index) => {
    const moduleIndex = index + 1;
    const visibleWhen = (state: Record<string, unknown>) => {
      const count = Number(state.moduleCount);
      return Number.isFinite(count) && count >= moduleIndex;
    };

    return [
      {
        kind: 'text' as const,
        key: `moduleLabel${moduleIndex}`,
        label: `顺序 ${moduleIndex}`,
        row: moduleIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `moduleIcon${moduleIndex}`,
        label: showcaseText('Default Icon.', '默认图标'),
        placeholder: 'eds-add',
        row: moduleIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `moduleFocusIcon${moduleIndex}`,
        label: showcaseText('FocusIcon', '聚焦图标'),
        placeholder: 'eds-add',
        row: moduleIndex,
        visibleWhen,
      },
      {
        kind: 'boolean' as const,
        key: `moduleReddot${moduleIndex}`,
        label: showcaseText('red dot', '红点'),
        row: moduleIndex,
        visibleWhen,
      },
    ];
  },
).flat();

export const navBarAppEntryLabelCustomizeControls: DocCustomizeControl[] = Array.from(
  { length: NAV_BAR_APP_ENTRY_COUNT_MAX },
  (_, index) => {
    const entryIndex = index + 1;
    const visibleWhen = (state: Record<string, unknown>) => {
      const count = Number(state.appEntryCount);
      return Number.isFinite(count) && count >= entryIndex;
    };

    return [
      {
        kind: 'text' as const,
        key: `appEntryLabel${entryIndex}`,
        label: `应用入口 ${entryIndex}`,
        row: entryIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `appEntryIcon${entryIndex}`,
        label: showcaseText('Default Icon.', '默认图标'),
        placeholder: entryIndex === 1 ? 'eds-application-22' : entryIndex === 2 ? 'eds-application-5' : 'eds-add',
        row: entryIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `appEntryFocusIcon${entryIndex}`,
        label: showcaseText('FocusIcon', '聚焦图标'),
        placeholder: entryIndex === 1 ? 'eds-application-22' : entryIndex === 2 ? 'eds-application-5' : 'eds-add',
        row: entryIndex,
        visibleWhen,
      },
      {
        kind: 'boolean' as const,
        key: `appEntryReddot${entryIndex}`,
        label: showcaseText('red dot', '红点'),
        row: entryIndex,
        visibleWhen,
      },
    ];
  },
).flat();

export const navBarPropRows: OrganismPropRow[] = [
  {
    name: 'wide',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('false → 74px (scale-18 + scale-05); true → 210px (scale-50 + scale-2-5). Showcase Document Preview defaults to false.', 'false → 74px（scale-18 + scale-05）；true → 210px（scale-50 + scale-2-5）。Showcase 文档预览默认 false。'),
  },
  { name: 'split', type: 'boolean', defaultValue: 'false', description: showcaseText('Page Divider between Corporation and Module area. Figma Split.', 'Corporation 与 Module 区之间 Page Divider。Figma Split。') },
  { name: 'showSystemButtons', type: 'boolean', defaultValue: 'true', description: showcaseText('Top bar system buttons (traffic lights).', '顶栏系统按钮（交通灯）。') },
  {
    name: 'showDivider',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Module Divider (vertical) on the right side of the navigation; does not occupy the 74px width of the navigation, the total width when displayed = navigation + line width.', '导航右侧 Module Divider（vertical）；不占导航 74px 宽度，显示时总宽 = 导航 + 线宽。'),
  },
  {
    name: 'moduleCount',
    type: 'number',
    defaultValue: '-',
    description: showcaseText('Declarative: number of modules; paired with moduleLabelN/moduleIconN/moduleFocusIconN. Ignored when there is a default slot.', '声明式：模块数量；与 moduleLabelN / moduleIconN / moduleFocusIconN 配套。有 default slot 时忽略。'),
  },
  {
    name: 'moduleLabelN / moduleIconN / moduleFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Declarative: the Nth module (N = 1… 20).', '声明式：第 N 个模块（N=1…20）。'),
  },
  {
    name: 'appEntryLabelN / appEntryIconN / appEntryFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Declarative: application portal (N = 1… 20); automatically inserts the Navigator Divider when there is an appEntryLabel.', '声明式：应用入口（N=1…20）；有 appEntryLabel 时自动插入 Navigator Divider。'),
  },
  {
    name: 'corporationLabel',
    type: 'string',
    defaultValue: "'G'",
    description: showcaseText('The word in the logo in 74px mode; the first letter of the corporationTitle in 210px mode.', '74px 模式下 Logo 内单字；210px 模式下取 corporationTitle 首字母。'),
  },
  {
    name: 'corporationTitle',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('the name of the business (Body Medium Strong) in wide mode; the letters in the logo take their initials.', 'wide 模式下企业名称（Body Medium Strong）；Logo 内字母取其首字。'),
  },
  {
    name: 'corporationSubtitle',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('version copy (Footnote Strong/tertiary) in wide mode.', 'wide 模式下版本文案（Footnote Strong / tertiary）。'),
  },
  {
    name: 'avatarInitials',
    type: 'string',
    defaultValue: "'N'",
    description: showcaseText('Avatar abbreviation when declarative and without # avatar slot.', '声明式且无 #avatar slot 时的头像缩写。'),
  },
];

export const navBarSlotRows: OrganismPropRow[] = [
  { name: 'corporation', type: 'slot', defaultValue: '-', description: showcaseText('Enterprise logo area; default EgNavBarCorporation.', '企业 Logo 区；默认 EgNavBarCorporation。') },
  { name: 'default', type: 'slot', defaultValue: 'EgNavBarModuleItem[]', description: showcaseText('Module navigation item.', '模块导航项。') },
  {
    name: 'appEntries',
    type: 'slot',
    defaultValue: 'EgNavBarModuleItem[]',
    description: showcaseText('Apply entry under Module Divider (Figma Split = Yes Module Combo under Divider 2085: 804).', 'Module Divider 下方应用入口（Figma Split=Yes Module Combo 内 Divider 2085:804 之下）。'),
  },
  { name: 'utilities', type: 'slot', defaultValue: 'EgNavBarBottomIcon[]', description: showcaseText('Bottom circular icon area (structure is always preserved, 3 Bottom iCons can be placed by default).', '底部圆形图标区（结构始终保留，默认可放 3 个 Bottom iCon）。') },
  { name: 'avatar', type: 'slot', defaultValue: 'EgNavBarAvatar', description: showcaseText('User Avatars', '用户头像。') },
];

export const navBarCorporationPropRows: OrganismPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'G'", description: showcaseText('Default word/logo copy.', '默认单字/Logo 文案。') },
];

export const navBarModuleItemPropRows: OrganismPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'Label'", description: showcaseText('Bar Copy + aria-label。', 'Bar 文案 + aria-label。') },
  { name: 'active', type: 'boolean', defaultValue: 'false', description: showcaseText('Select the state copy primary.', '选中态文案 primary。') },
  { name: 'showReddot', type: 'boolean', defaultValue: 'false', description: showcaseText('The red dot in the upper right corner of the module icon.', '模块 icon 右上角红点。') },
];

export const navBarModuleItemSlotRows: OrganismPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: 'EgIcon', description: showcaseText('Default icon (e.g. eds-add).', '默认 icon（如 eds-add）。') },
  {
    name: 'focusIcon',
    type: 'slot',
    defaultValue: '-',
    description:
      showcaseText('[doc] Focus icon；ModuleFocuswhen default Show。ModuleandTotalFocus，Same aswhenonly；EmptyCancel。', '聚焦 icon；模块处于聚焦态时替换 default 显示。模块区与应用入口共用一组聚焦，同一时刻仅一项；点空白不取消。'),
  },
];

export const moduleMenuFigmaNode = '2090:4337';

export const MODULE_MENU_MAX_GROUPS = 10;

export const MODULE_MENU_MAX_ITEMS_PER_GROUP = 20;

export const MODULE_MENU_MAX_SUB_ITEMS = 20;

export const moduleMenuHasSubItemOptions = propLabelSelectOptions(['yes', 'no'] as const, showcaseYesNoLabels);

export const moduleMenuItemCountOptions = countSelectOptions(MODULE_MENU_MAX_ITEMS_PER_GROUP);

export const moduleMenuSubItemCountOptions = countSelectOptions(MODULE_MENU_MAX_SUB_ITEMS);

export type ModuleMenuScenario = 'module-menu' | 'cregis' | 'udun';

export const moduleMenuScenarioOptions = propLabelSelectOptions(
  ['module-menu', 'cregis', 'udun'] as const,
  showcaseModuleMenuScenarioLabels,
);

export const moduleMenuTitleKindOptions = propLabelSelectOptions(
  ['text', 'preset'] as const,
  showcaseModuleMenuTitleKindLabels,
);

function isModuleMenuTitleTextKind(state: Record<string, unknown>): boolean {
  return String(state.moduleTitleKind ?? 'preset') === 'text';
}

function isModuleMenuTitlePresetKind(state: Record<string, unknown>): boolean {
  return String(state.moduleTitleKind ?? 'preset') === 'preset';
}

export { isModuleMenuTitleTextKind, isModuleMenuTitlePresetKind };

export function isModuleMenuEdsScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? 'module-menu') === 'module-menu';
}

export const moduleMenuBusinessTitleOptions = buildModuleMenuBusinessTitleOptions('cregis');

function isModuleMenuBusinessFlotationTitleState(state: Record<string, unknown>): boolean {
  const scenario: ModuleMenuBusinessScenario =
    String(state.scenario ?? 'module-menu') === 'udun' ? 'udun' : 'cregis';
  const title = resolveModuleMenuBusinessTitleForScenario(scenario, state.moduleBusinessTitle);
  return moduleMenuBusinessTitleUsesFlotationTitle(scenario, title);
}

export function buildModuleMenuBusinessTitleCustomizeControls(
  scenario: ModuleMenuBusinessScenario,
): DocCustomizeControl[] {
  const moduleControl: DocCustomizeControl = {
    kind: 'select',
    key: 'moduleBusinessTitle',
    label: showcaseText('Module', '模块'),
    options: buildModuleMenuBusinessTitleOptions(scenario),
    row: 0,
  };

  const flotationTriggerControls: DocCustomizeControl[] =
    flotationTriggerOverviewModuleMenuControls.map((control) => ({
      ...control,
      row: 1,
      visibleWhen: (state: Record<string, unknown>) => {
        if (!isModuleMenuBusinessFlotationTitleState(state)) return false;
        return control.visibleWhen ? control.visibleWhen(state) : true;
      },
    }));

  return [moduleControl, ...flotationTriggerControls];
}

export function moduleMenuGroupTitleKey(index: number): string {
  return `groupTitle_${index}`;
}

export function moduleMenuGroupSortKey(index: number): string {
  return `groupSort_${index}`;
}

export function moduleMenuGroupItemCountKey(index: number): string {
  return `groupItemCount_${index}`;
}

export function moduleMenuGroupItemHasSubKey(groupIndex: number, itemIndex: number): string {
  return `groupItemHasSub_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemLabelKey(groupIndex: number, itemIndex: number): string {
  return `groupItemLabel_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemIconKey(groupIndex: number, itemIndex: number): string {
  return `groupItemIcon_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemAccessoryKey(groupIndex: number, itemIndex: number): string {
  return `groupItemAccessory_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemMessageTextKey(groupIndex: number, itemIndex: number): string {
  return `groupItemMessage_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemMessageTypeKey(groupIndex: number, itemIndex: number): string {
  return `groupItemMessageType_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemMessageFocusBackgroundKey(
  groupIndex: number,
  itemIndex: number,
): string {
  return `groupItemMessageFocusBg_${groupIndex}_${itemIndex}`;
}

export const moduleMenuItemAccessoryOptions = propLabelSelectOptions(
  ['none', 'message', 'reddot'] as const,
  showcaseModuleMenuAccessoryLabels,
);

export const moduleMenuMessageTypeOptions = propLabelSelectOptions(
  ['subtle', 'brand', 'danger'] as const,
  showcaseFeedbackMessageTypeLabels,
);

export const moduleMenuMessageFocusBackgroundOptions = propLabelSelectOptions(
  ['inherit', 'same-white'] as const,
  showcaseMessageFocusBackgroundLabels,
);

export function moduleMenuGroupItemSubCountKey(groupIndex: number, itemIndex: number): string {
  return `groupItemSubCount_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemSubLabelKey(
  groupIndex: number,
  itemIndex: number,
  subIndex: number,
): string {
  return `groupItemSubLabel_${groupIndex}_${itemIndex}_${subIndex}`;
}

export function moduleMenuGroupItemSubIconKey(
  groupIndex: number,
  itemIndex: number,
  subIndex: number,
): string {
  return `groupItemSubIcon_${groupIndex}_${itemIndex}_${subIndex}`;
}

function defaultGroupTitle(index: number): string {
  if (index === 0) return '';
  if (index === 1) return 'Title';
  return `Title ${index}`;
}

function defaultGroupItemCount(index: number): string {
  return '2';
}

function defaultGroupItemHasSub(groupIndex: number, itemIndex: number): string {
  if (groupIndex === 1 && itemIndex === 1) return 'yes';
  return 'no';
}

export function buildModuleMenuCustomizeDefaults(): Record<string, unknown> {
  const defaults: Record<string, unknown> = {
    scenario: 'module-menu' as ModuleMenuScenario,
    showEdgeDivider: true,
    wide: false,
    groupCount: '3',
    moduleTitleKind: 'text',
    moduleTitleText: 'Module',
    moduleBusinessTitle: DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
    triggerLabel: flotationTriggerModuleMenuDefaults.label,
    ...flotationTriggerModuleMenuDefaults,
  };

  for (let index = 0; index < MODULE_MENU_MAX_GROUPS; index += 1) {
    defaults[moduleMenuGroupTitleKey(index)] = defaultGroupTitle(index);
    defaults[moduleMenuGroupSortKey(index)] = String(index + 1);
    defaults[moduleMenuGroupItemCountKey(index)] = defaultGroupItemCount(index);

    for (let itemIndex = 1; itemIndex <= MODULE_MENU_MAX_ITEMS_PER_GROUP; itemIndex += 1) {
      defaults[moduleMenuGroupItemHasSubKey(index, itemIndex)] = defaultGroupItemHasSub(index, itemIndex);
      defaults[moduleMenuGroupItemLabelKey(index, itemIndex)] = 'Label';
      defaults[moduleMenuGroupItemIconKey(index, itemIndex)] = '';
      defaults[moduleMenuGroupItemAccessoryKey(index, itemIndex)] = 'none';
      defaults[moduleMenuGroupItemMessageTextKey(index, itemIndex)] = '0';
      defaults[moduleMenuGroupItemMessageTypeKey(index, itemIndex)] = 'subtle';
      defaults[moduleMenuGroupItemMessageFocusBackgroundKey(index, itemIndex)] = 'inherit';
      defaults[moduleMenuGroupItemSubCountKey(index, itemIndex)] = '2';

      for (let subIndex = 1; subIndex <= MODULE_MENU_MAX_SUB_ITEMS; subIndex += 1) {
        defaults[moduleMenuGroupItemSubLabelKey(index, itemIndex, subIndex)] = 'Label';
        defaults[moduleMenuGroupItemSubIconKey(index, itemIndex, subIndex)] = '';
      }
    }
  }

  return defaults;
}

export const moduleMenuCustomizeDefaults = buildModuleMenuCustomizeDefaults();

export const moduleMenuGroupCountOptions = countSelectOptions(MODULE_MENU_MAX_GROUPS);

export const moduleMenuCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'groupCount',
    label: showcaseText('Number of groups', '组数量'),
    options: moduleMenuGroupCountOptions,
    visibleWhen: isModuleMenuEdsScenario,
  },
  { kind: 'boolean', key: 'showEdgeDivider', label: showcaseText('TrailingDivider', '右侧分割线') },
  { kind: 'boolean', key: 'wide', label: showcaseText('NavBarExpanded', 'NavBar展开') },
];

const moduleMenuTitleTriggerCustomizeControls: DocCustomizeControl[] =
  flotationTriggerOverviewModuleMenuControls.map((control) => ({
    ...control,
    row: 1,
    visibleWhen: (state: Record<string, unknown>) => {
      if (!isModuleMenuTitlePresetKind(state)) return false;
      return control.visibleWhen ? control.visibleWhen(state) : true;
    },
  }));

export const moduleMenuTitleCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'moduleTitleKind',
    label: showcaseText('Type', '类型'),
    options: moduleMenuTitleKindOptions,
    row: 0,
  },
  {
    kind: 'text',
    key: 'moduleTitleText',
    label: showcaseText('Copy', '文案'),
    row: 1,
    visibleWhen: isModuleMenuTitleTextKind,
  },
  ...moduleMenuTitleTriggerCustomizeControls,
];

/** 场景化 Cregis / UDun：切换业务模块菜单（各场景模块列表独立，见 businessModuleTitles.ts）。 */
export const moduleMenuBusinessTitleCustomizeControls =
  buildModuleMenuBusinessTitleCustomizeControls('cregis');

export function buildModuleMenuGroupCustomizeControls(groupIndex: number): DocCustomizeControl[] {
  const groupNumber = groupIndex + 1;

  const groupVisible = (state: Record<string, unknown>) => {
    const count = Number(state.groupCount);
    return Number.isFinite(count) && count >= groupNumber;
  };

  const itemVisible = (itemIndex: number) => (state: Record<string, unknown>) => {
    if (!groupVisible(state)) return false;
    const itemCount = Number(state[moduleMenuGroupItemCountKey(groupIndex)]);
    return Number.isFinite(itemCount) && itemCount >= itemIndex;
  };

  const itemHasSubIs = (itemIndex: number, hasSub: boolean) => (state: Record<string, unknown>) => {
    if (!itemVisible(itemIndex)(state)) return false;
    const value = String(state[moduleMenuGroupItemHasSubKey(groupIndex, itemIndex)] ?? 'no');
    return hasSub ? value === 'yes' : value === 'no';
  };

  const subItemVisible =
    (itemIndex: number, subIndex: number) => (state: Record<string, unknown>) => {
      if (!itemHasSubIs(itemIndex, true)(state)) return false;
      const subCount = Number(state[moduleMenuGroupItemSubCountKey(groupIndex, itemIndex)]);
      return Number.isFinite(subCount) && subCount >= subIndex;
    };

  const controls: DocCustomizeControl[] = [
    {
      kind: 'text',
      key: moduleMenuGroupTitleKey(groupIndex),
      label: showcaseText('Group Headers', '组标题'),
      placeholder: showcaseText('Leave blank for no title', '留空为无标题'),
      row: 0,
      visibleWhen: groupVisible,
    },
    {
      kind: 'text',
      key: moduleMenuGroupSortKey(groupIndex),
      label: showcaseText('Group Order', '组顺序'),
      placeholder: showcaseText('Value', '数值'),
      row: 0,
      visibleWhen: groupVisible,
    },
    {
      kind: 'select',
      key: moduleMenuGroupItemCountKey(groupIndex),
      label: showcaseText('Number of entries', '条目数'),
      options: moduleMenuItemCountOptions,
      row: 0,
      visibleWhen: groupVisible,
    },
  ];

  for (let itemIndex = 1; itemIndex <= MODULE_MENU_MAX_ITEMS_PER_GROUP; itemIndex += 1) {
    const itemRow = itemIndex;

    controls.push(
      {
        kind: 'text',
        key: moduleMenuGroupItemLabelKey(groupIndex, itemIndex),
        label: `条目 ${itemIndex}`,
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemHasSubKey(groupIndex, itemIndex),
        label: showcaseText('Child Entries', '下级条目'),
        options: moduleMenuHasSubItemOptions,
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'text',
        key: moduleMenuGroupItemIconKey(groupIndex, itemIndex),
        label: showcaseText('Icon', '图标'),
        placeholder: 'eds-add',
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemAccessoryKey(groupIndex, itemIndex),
        label: showcaseText('Right accessory', '右侧配件'),
        options: moduleMenuItemAccessoryOptions,
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemMessageTypeKey(groupIndex, itemIndex),
        label: showcaseText('Message type.', 'Message 类型'),
        options: moduleMenuMessageTypeOptions,
        row: itemRow,
        visibleWhen: (state) => {
          if (!itemVisible(itemIndex)(state)) return false;
          return (
            state[moduleMenuGroupItemAccessoryKey(groupIndex, itemIndex)] === 'message'
          );
        },
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemMessageFocusBackgroundKey(groupIndex, itemIndex),
        label: showcaseText('FocusBackground', '聚焦背景'),
        options: moduleMenuMessageFocusBackgroundOptions,
        row: itemRow,
        visibleWhen: (state) => {
          if (!itemVisible(itemIndex)(state)) return false;
          return (
            state[moduleMenuGroupItemAccessoryKey(groupIndex, itemIndex)] === 'message'
          );
        },
      },
      {
        kind: 'text',
        key: moduleMenuGroupItemMessageTextKey(groupIndex, itemIndex),
        label: showcaseText('Message copy.', 'Message 文案'),
        row: itemRow,
        visibleWhen: (state) => {
          if (!itemVisible(itemIndex)(state)) return false;
          return (
            state[moduleMenuGroupItemAccessoryKey(groupIndex, itemIndex)] === 'message'
          );
        },
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemSubCountKey(groupIndex, itemIndex),
        label: showcaseText('Number of secondary entries', '二级条目数'),
        options: moduleMenuSubItemCountOptions,
        row: itemRow,
        visibleWhen: itemHasSubIs(itemIndex, true),
      },
    );

    for (let subIndex = 1; subIndex <= MODULE_MENU_MAX_SUB_ITEMS; subIndex += 1) {
      const subRow = itemRow * 100 + subIndex;
      controls.push(
        {
          kind: 'text',
          key: moduleMenuGroupItemSubLabelKey(groupIndex, itemIndex, subIndex),
          label: `二级 ${subIndex} 文案`,
          row: subRow,
          visibleWhen: subItemVisible(itemIndex, subIndex),
        },
        {
          kind: 'text',
          key: moduleMenuGroupItemSubIconKey(groupIndex, itemIndex, subIndex),
          label: showcaseText('Icon', '图标'),
          placeholder: 'eds-add',
          row: subRow,
          visibleWhen: subItemVisible(itemIndex, subIndex),
        },
      );
    }
  }

  return controls;
}

export const moduleMenuGroupCustomizeControlsList = Array.from(
  { length: MODULE_MENU_MAX_GROUPS },
  (_, groupIndex) => buildModuleMenuGroupCustomizeControls(groupIndex),
);

export const moduleMenuPropRows: OrganismPropRow[] = [
  {
    name: 'wide',
    type: 'boolean',
    defaultValue: 'false',
    description: 'false → 240px（scale-50 + scale-10）；true → 280px（scale-50 + scale-20）。',
  },
  {
    name: 'titleMode',
    type: "'text' | 'trigger'",
    defaultValue: "'text'",
    description: showcaseText('text → plain copy title; trigger → # title slot embedded EgFlotationTrigger trigger-style = "text".', 'text → 纯文案标题；trigger → #title 插槽嵌 EgFlotationTrigger trigger-style="text"。'),
  },
  {
    name: 'title',
    type: 'string',
    defaultValue: "'Module'",
    description:
      showcaseText('[doc] Module Menu-Title Copy。titleMode=trigger whenas EgFlotationTrigger label ；OverflowandScrollwhen，TitleShow EgDivider type=module（can prop ，and showEdgeDivider None）。', 'Module Menu-Title 文案。titleMode=trigger 时作为 EgFlotationTrigger label 回退；内容溢出且向下滚动时，标题下自动显示 EgDivider type=module（不可 prop 定制，与 showEdgeDivider 无关）。'),
  },
  { name: 'showEdgeDivider', type: 'boolean', defaultValue: 'true', description: showcaseText('Right vertical EgDivider type = module.', '右侧竖向 EgDivider type=module。') },
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description:
      showcaseText('[doc] EgModuleMenuItem `.motion-ease.is-enter-only`： 600ms（--motion-recipe-hover-asym + enter easing）； / focus / active None。must @eds/desktop-tokens/motion/*。', 'EgModuleMenuItem 内置 `.motion-ease.is-enter-only`：悬浮入场 600ms（--motion-recipe-hover-asym + enter easing）；离场 / focus / active 无过渡。须全局引入 @eds/desktop-tokens/motion/*。'),
  },
];

export const cregisModuleMenuPropRows: OrganismPropRow[] = [
  {
    name: 'title',
    type: 'string',
    defaultValue: "'Wallet'",
    description:
      showcaseText('[doc] ModuleTitle（Wallet / Tasks / WaaS ，and Cregis Nav Bar Module； cregisModuleMenuBusinessTitles）。', '当前模块区标题（Wallet / Tasks / WaaS 等，与 Cregis Nav Bar 模块名一致；见 cregisModuleMenuBusinessTitles）。'),
  },
  {
    name: 'default',
    type: 'slot',
    defaultValue: 'EgModuleMenuGroup[]',
    description:
      showcaseText('[doc] BusinessMenu；Module title presets/module-menu/cregisModuleMenuGroups.ts（cregisModuleMenuByTitle）。', '业务菜单组；按模块标题配置见 presets/module-menu/cregisModuleMenuGroups.ts（cregisModuleMenuByTitle）。'),
  },
];

export const udunModuleMenuPropRows: OrganismPropRow[] = [
  {
    name: 'title',
    type: 'string',
    defaultValue: "'Wallet'",
    description:
      showcaseText('[doc] ModuleTitle（Wallet / Approval / Developer ，and UDun Nav Bar Module； udunModuleMenuBusinessTitles）。', '当前模块区标题（Wallet / Approval / Developer 等，与 UDun Nav Bar 模块名一致；见 udunModuleMenuBusinessTitles）。'),
  },
  {
    name: 'default',
    type: 'slot',
    defaultValue: 'EgModuleMenuGroup[]',
    description:
      showcaseText('[doc] BusinessMenu；Module title presets/module-menu/udunModuleMenuGroups.ts（udunModuleMenuByTitle）。', '业务菜单组；按模块标题配置见 presets/module-menu/udunModuleMenuGroups.ts（udunModuleMenuByTitle）。'),
  },
];

export const moduleMenuGroupPropRows: OrganismPropRow[] = [
  {
    name: 'title',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('Optional. Values are grouped with a title; omitted are grouped without a title. Multiple groups of EgModuleMenuGroups are arranged in the default slot with group spacing of spacing-3 (12px).', '可选。有值为带标题组合；省略为不带标题组合。多组 EgModuleMenuGroup 在 default slot 中排列，组间距 spacing-3（12px）。'),
  },
];

export const moduleMenuItemPropRows: OrganismPropRow[] = [
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description:
      showcaseText('[doc] `.motion-ease.is-enter-only`（token semantic · ）：only hover ；mouseleave / :focus-visible / :active NoneMotion。Background hover by CSS `--event-hover` 。', '内置 `.motion-ease.is-enter-only`（token semantic · 悬浮入）：仅 hover 入场有过渡；mouseleave / :focus-visible / :active 无动效。背景 hover 由 CSS `--event-hover` 驱动。'),
  },
  { name: 'label', type: 'string', defaultValue: "'Label'", description: showcaseText('Body Medium copy.', 'Body Medium 文案。') },
  {
    name: 'tier',
    type: '1 | 2',
    defaultValue: '1',
    description: showcaseText('1 = No secondary items; 2 = Secondary items can be placed in the default slot.', '1 = 无二级 item；2 = 可包 default slot 放置二级 item。'),
  },
  { name: 'subitem', type: 'boolean', defaultValue: 'false', description: showcaseText('Secondary item row, indent spacing-8 on the left.', '二级 item 行，左侧缩进 spacing-8。') },
  {
    name: 'focused',
    type: 'boolean',
    defaultValue: 'false',
    description:
      showcaseText('[doc] EgModuleMenu byClickFocus（tier=2 and item onlyExpanded/，andFocus）；NoneMenuwhencan。', 'EgModuleMenu 内由点击切换聚焦（tier=2 且含二级 item 的父级仅展开/收起，不参与聚焦）；无菜单上下文时可受控。'),
  },
  {
    name: 'message',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('EgMessage copy on the right (handy prop); Showcase recommends # accessory nested EgMessage.', '右侧 EgMessage 文案（便捷 prop）；Showcase 推荐 #accessory 嵌套 EgMessage。'),
  },
  {
    name: 'messageType',
    type: 'MessageType',
    defaultValue: "'subtle'",
    description: showcaseText('EgMessage type (with message prop); # accessory Write on EgMessage when nested.', 'EgMessage type（配合 message prop）；#accessory 嵌套时写在 EgMessage 上。'),
  },
  {
    name: 'messageFocusBackground',
    type: "'inherit' | 'same-white'",
    defaultValue: "'inherit'",
    description: showcaseText('EgMessage Focus Background (with message prop).', 'EgMessage 聚焦背景（配合 message prop）。'),
  },
  { name: 'showReddot', type: 'boolean', defaultValue: 'false', description: showcaseText('Right EgReddot; and message.', '右侧 EgReddot；与 message 互斥。') },
  {
    name: 'accessory',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('Right accessory area; nested EgMessage or EgReddot (mutually exclusive with message/showReddot prop).', '右侧配件区；嵌套 EgMessage 或 EgReddot（与 message / showReddot prop 互斥）。'),
  },
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Deprecated: Equivalent to focused.', '已废弃：等价于 focused。'),
  },
  {
    name: 'trailingIcon',
    type: 'string',
    defaultValue: '-',
    description: showcaseText('tier = 2 with a secondary item overrides the default collapse icon (arrow-up/arrow-right).', 'tier=2 且含二级 item 时覆盖默认折叠图标（arrow-up / arrow-right）。'),
  },
  {
    name: 'expanded',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('tier = 2 Parent expanded state (v-model: expanded); default false collapse, click the entire line to switch.', 'tier=2 父级展开态（v-model:expanded）；默认 false 收起，点击整行切换。'),
  },
  {
    name: 'level',
    type: '0 | 1',
    defaultValue: '-',
    description: showcaseText('Deprecated: 1 is equivalent to subitem.', '已废弃：1 等价于 subitem。'),
  },
];

export const toolBarFigmaNode = '2087:3918';

const TOOL_BAR_ZONE_ITEM_COUNT_MAX = 10;

const toolBarZoneCountOptions = countSelectOptions(TOOL_BAR_ZONE_ITEM_COUNT_MAX);

export const toolBarCustomizeDefaults = {
  title: 'Title',
  showBack: false,
  showOperation: true,
  showDivider: true,
  showSection: false,
  functionalCount: '1',
  sectionCount: '1',
  ...iconButtonProZoneItemDefaultsForRange('functional', TOOL_BAR_ZONE_ITEM_COUNT_MAX),
  ...iconButtonProZoneItemDefaultsForRange('section', TOOL_BAR_ZONE_ITEM_COUNT_MAX),
};

export const toolBarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'title', label: showcaseText('Title', '标题') },
  { kind: 'boolean', key: 'showBack', label: showcaseText('Back', '返回') },
  { kind: 'boolean', key: 'showOperation', label: showcaseText('Operating area', '操作区') },
  { kind: 'boolean', key: 'showDivider', label: showcaseText('BottomDivider', '底部分割线') },
  { kind: 'boolean', key: 'showSection', label: showcaseText('Water conservation capacity', '功能分区') },
];

export const toolBarFunctionalCustomizeControls = buildIconButtonProZoneItemControls(
  'functional',
  'functionalCount',
  toolBarZoneCountOptions,
  TOOL_BAR_ZONE_ITEM_COUNT_MAX,
);

export const toolBarSectionCustomizeControls = buildIconButtonProZoneItemControls(
  'section',
  'sectionCount',
  toolBarZoneCountOptions,
  TOOL_BAR_ZONE_ITEM_COUNT_MAX,
);

export const toolBarPropRows: OrganismPropRow[] = [
  { name: 'title', type: 'string', defaultValue: "'Title'", description: 'ToolBar-Title Body Large Strong。' },
  { name: 'showBack', type: 'boolean', defaultValue: 'false', description: 'ToolBar-Title Back=Yes。' },
  { name: 'showOperation', type: 'boolean', defaultValue: 'true', description: showcaseText('Operation switch: operate Icons on the right.', 'Operation 开关：右侧操作 Icons。') },
  { name: 'showDivider', type: 'boolean', defaultValue: 'true', description: showcaseText('Bottom divider (EgDivider type = module); when turned on, it will be displayed by default and will not be hidden with scrolling.', '底部分割线（EgDivider type=module）；开启后默认即显示，不随滚动隐藏。') },
  { name: 'showSection', type: 'boolean', defaultValue: 'false', description: showcaseText('Vertical EgDivider type = page partition in Functional.', 'Functional 内以竖向 EgDivider type=page 分区。') },
];

export const toolBarSlotRows: OrganismPropRow[] = [
  { name: 'title', type: 'slot', defaultValue: '-', description: showcaseText('Title Heading', '标题区。') },
  { name: 'functional', type: 'slot', defaultValue: 'EgIconProButton', description: showcaseText('left functional icon group when showSection.', 'showSection 时左区功能图标组。') },
  { name: 'section', type: 'slot', defaultValue: '-', description: showcaseText('Group of functional icons in the right zone; to the right of the divider when showSection.', '右区功能图标组；showSection 时在分割线右侧。') },
  { name: 'operation', type: 'slot', defaultValue: '-', description: showcaseText('Additional operations in the Operation area.', 'Operation 区额外操作。') },
];

export const paginerFigmaNode = '2092:8240';

const PAGINER_STATISTICS_COUNT_MAX = 5;

const paginerStatisticsCountOptions = countSelectOptions(PAGINER_STATISTICS_COUNT_MAX);

function paginerStatisticsItemDefaults(text = 'Title', number = '0'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= PAGINER_STATISTICS_COUNT_MAX; index += 1) {
    entries[`stat${index}Text`] = text;
    entries[`stat${index}Number`] = number;
  }
  return entries;
}

export const paginerCustomizeDefaults = {
  dataVolume: 'few' as 'few' | 'many',
  currentPage: '1',
  showScrollbar: false,
  showStatistics: false,
  statisticsCollapse: false,
  statisticsCount: '2',
  scrollbarProgress: 0.35,
  settingsLevelLabel: 'Items Per Page',
  settingsJumpLabel: 'Go to Page',
  settingsLevelLabels: '20,50,100',
  ...paginerPaginationCustomizeDefaults(),
  ...paginerStatisticsItemDefaults(),
};

export const paginerPaginationCustomizeControls =
  buildPaginerPaginationCustomizeControls();

export const paginerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'dataVolume',
    label: showcaseText('Data volume', '数据量'),
    options: propLabelSelectOptions(['few', 'many'] as const, showcasePaginerDataVolumeLabels),
  },
  { kind: 'text', key: 'currentPage', label: showcaseText('Page', '页码') },
  { kind: 'boolean', key: 'showScrollbar', label: showcaseText('Scroll Bar', '滚动条') },
  { kind: 'boolean', key: 'showStatistics', label: showcaseText('Statistics area', '统计区') },
];

export const paginerSettingsCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'settingsLevelLabel', label: showcaseText('Number of bars per page title', '每页条数标题'), row: 0 },
  { kind: 'text', key: 'settingsJumpLabel', label: showcaseText('Jump to title', '跳转标题'), row: 0 },
  {
    kind: 'text',
    key: 'settingsLevelLabels',
    label: showcaseText('Number of bars per page option', '每页条数选项'),
    placeholder: '20,50,100',
    row: 0,
  },
];

export const paginerStatisticsCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'statisticsCount',
    label: showcaseText('Count', '数量'),
    options: paginerStatisticsCountOptions,
  },
  {
    kind: 'boolean',
    key: 'statisticsCollapse',
    label: showcaseText('Statistics Collapse', '统计折叠'),
  },
  ...Array.from(
  { length: PAGINER_STATISTICS_COUNT_MAX },
  (_, index) => {
    const itemIndex = index + 1;
    const visibleWhen = (state: Record<string, unknown>) => {
      const count = Number(state.statisticsCount);
      return Number.isFinite(count) && count >= itemIndex;
    };

    return [
      {
        kind: 'text' as const,
        key: `stat${itemIndex}Text`,
        label: `统计 ${itemIndex} 标题`,
        row: itemIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `stat${itemIndex}Number`,
        label: `统计 ${itemIndex} 数值`,
        row: itemIndex,
        visibleWhen,
      },
    ];
  },
).flat(),
];

export const paginerPropRows: OrganismPropRow[] = [
  { name: 'showScrollbar', type: 'boolean', defaultValue: 'false', description: 'Paginer-Scrollbar。' },
  { name: 'showStatistics', type: 'boolean', defaultValue: 'true', description: 'Statistics=Yes。' },
  {
    name: 'statisticsCollapse',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Statistics Collapsedas eds-more-ios。', 'Statistics 折叠为 eds-more-ios。'),
  },
  { name: 'scrollbarProgress', type: 'number', defaultValue: '0.35', description: showcaseText('Scrollbar indicator bar position 0–1.', 'Scrollbar 指示条位置 0–1。') },
  {
    name: 'scrollbarSize',
    type: "'few' | 'many'",
    defaultValue: "'many'",
    description: showcaseText('Scrollbar indicator bar width.', 'Scrollbar 指示条宽度。'),
  },
  {
    name: 'statisticsItems',
    type: 'PaginerStatisticsItem[]',
    defaultValue: '[{ text, number }×2]',
    description: showcaseText('Paginer-Statistics combination; can be replaced with # statistics slot.', 'Paginer-Statistics 组合；可用 #statistics 插槽替换。'),
  },
  { name: 'dataVolumeTotal', type: 'string', defaultValue: "'Total'", description: showcaseText('Data Volume Total copy.', 'Data Volume Total 文案。') },
  { name: 'dataVolumeCount', type: 'string', defaultValue: "'0'", description: showcaseText('Data Volume Count。', 'Data Volume 数量。') },
  { name: 'dataVolumeResults', type: 'string', defaultValue: "'Results'", description: showcaseText('Data Volume Results copy.', 'Data Volume Results 文案。') },
  { name: 'showDataVolumeDropdown', type: 'boolean', defaultValue: 'true', description: showcaseText('Data Volume drop-down.', 'Data Volume 下拉。') },
  {
    name: 'statisticsCollapseLabel',
    type: 'string',
    defaultValue: "'Show statistics'",
    description: showcaseText('Statistics collapses the trigger aria-label.', 'Statistics 折叠触发器 aria-label。'),
  },
  { name: 'settingsLevelLabel', type: 'string', defaultValue: "'Items Per Page'", description: showcaseText('Dropdown settings Level Title。', '下拉设置 Level 标题。') },
  { name: 'settingsJumpLabel', type: 'string', defaultValue: "'Go to Page'", description: showcaseText('Dropdown settings Jump Title。', '下拉设置 Jump 标题。') },
  { name: 'settingsLevelLabels', type: 'string[]', defaultValue: "['20','50','100']", description: showcaseText('Level Segmented option.', 'Level Segmented 选项。') },
  { name: 'settingsJumpPlaceholder', type: 'string', defaultValue: "'Please Enter'", description: showcaseText('Jump input box placeholder.', 'Jump 输入框占位符。') },
  { name: 'settingsLevelIndex', type: 'number', defaultValue: '1', description: showcaseText('Level Checks the index (v-model).', 'Level 选中索引（v-model）。') },
  { name: 'settingsJumpValue', type: 'string', defaultValue: "''", description: showcaseText('Jump input value (v-model).', 'Jump 输入值（v-model）。') },
];

export const paginerEventRows: OrganismPropRow[] = [
  {
    name: 'settings-level-select',
    type: '(index: number, label: string) => void',
    defaultValue: '-',
    description: showcaseText('Data Volume drop-down Level option changed.', 'Data Volume 下拉 Level 选项变更。'),
  },
  {
    name: 'settings-jump',
    type: '(value: string) => void',
    defaultValue: '-',
    description: showcaseText('The Data Volume drop-down Jump confirms the jump.', 'Data Volume 下拉 Jump 确认跳转。'),
  },
];

export const paginerSlotRows: OrganismPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: 'EgPaginationGroupButton×5',
    description: showcaseText('Pagination Raw: First/Front/Page Number/After/End (Showcase "Data Volume/Page Number" is in demo state, not component prop).', 'Pagination Raw：首/前/页码/后/末（Showcase「数据量/页码」为演示状态，非组件 prop）。'),
  },
  {
    name: 'dataVolume',
    type: 'slot',
    defaultValue: 'EgPaginerDataVolume',
    description: showcaseText('Paginer-Data Volume; dropdown triggers EgFlotation → # dropdown-content (default EgPaginerSettings).', 'Paginer-Data Volume；下拉触发 EgFlotation → #dropdown-content（默认 EgPaginerSettings）。'),
  },
  {
    name: 'dataVolume-dropdown-content',
    type: 'slot',
    defaultValue: 'EgPaginerSettings',
    description: showcaseText('Data Volume drop-down float content (Figma 2092: 8003).', 'Data Volume 下拉浮层内容（Figma 2092:8003）。'),
  },
  { name: 'statistics', type: 'slot', defaultValue: 'EgPaginerStatistics×2', description: showcaseText('When Statistics is not collapsed.', 'Statistics 未折叠时。') },
  {
    name: 'statistics-collapse',
    type: 'slot',
    defaultValue: 'EgPaginerStatisticsCollapse',
    description: showcaseText('When Statistics is collapsed: EgFlotation + Statistical Float.', 'Statistics 折叠时：EgFlotation + 统计浮层。'),
  },
];

export {
  DIALOG_TYPES,
  dialogFigmaNode,
  dialogCustomizeDefaults,
  dialogCustomizeControls,
  dialogPropRows,
} from './dialogDocCustomize';

export const batchBarFigmaNode = '2840:4360';
export const batchBarActionItemFigmaNode = '2840:3358';

const BATCH_BAR_LABEL_COUNT_MAX = 20;

const batchBarLabelCountOptions = countSelectOptions(BATCH_BAR_LABEL_COUNT_MAX);

function batchBarLabelItemDefaults(label = 'Label'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= BATCH_BAR_LABEL_COUNT_MAX; index += 1) {
    entries[`label${index}`] = label;
  }
  return entries;
}

function batchBarLabelDangerDefaults(): Record<string, boolean> {
  const entries: Record<string, boolean> = {};
  for (let index = 1; index <= BATCH_BAR_LABEL_COUNT_MAX; index += 1) {
    entries[`label${index}Danger`] = false;
  }
  return entries;
}

export function parseBatchBarLabelCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.labelCount ?? '1'), 10);
  return Number.isFinite(parsed) ? Math.min(BATCH_BAR_LABEL_COUNT_MAX, Math.max(1, parsed)) : 1;
}

export function buildBatchBarLabels(state: Record<string, unknown>): string[] {
  const count = parseBatchBarLabelCount(state);
  return Array.from({ length: count }, (_, index) => {
    const key = `label${index + 1}`;
    return String(state[key] ?? 'Label');
  });
}

export function buildBatchBarLabelDanger(state: Record<string, unknown>): boolean[] {
  const count = parseBatchBarLabelCount(state);
  return Array.from({ length: count }, (_, index) => {
    const itemIndex = index + 1;
    return Boolean(state[`label${itemIndex}Danger`]);
  });
}

export const batchBarCustomizeDefaults = {
  selectedCount: '0',
  countSuffix: 'Selectd',
  labelCount: '4',
  moreLabel: 'More',
  ...batchBarLabelItemDefaults(),
  ...batchBarLabelDangerDefaults(),
};

export const batchBarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'selectedCount', label: showcaseText('Number of selections', '选中数'), row: 0 },
  { kind: 'text', key: 'countSuffix', label: showcaseText('Statistical Suffix', '统计后缀'), row: 0 },
  {
    kind: 'select',
    key: 'labelCount',
    label: showcaseText('New Tag Count', '标签数'),
    row: 1,
    options: batchBarLabelCountOptions,
  },
  { kind: 'text', key: 'moreLabel', label: showcaseText('More copywriting', '更多文案'), row: 1 },
];

export function buildBatchBarLabelCustomizeControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const count = parseBatchBarLabelCount(state);
  const controls: DocCustomizeControl[] = [];

  for (let index = 0; index < count; index += 1) {
    const itemIndex = index + 1;
    controls.push({
      kind: 'text',
      key: `label${itemIndex}`,
      label: `标签 ${itemIndex}`,
      row: itemIndex,
    });
    controls.push({
      kind: 'boolean',
      key: `label${itemIndex}Danger`,
      label: showcaseText('Danger', '危险'),
      row: itemIndex,
    });
  }

  return controls;
}

export const batchBarActionCustomizeDefaults = {
  actionType: 'text' as 'text' | 'symbol' | 'statistics',
  actionLabel: 'Label',
  actionCount: '0',
  actionCountSuffix: 'Selectd',
  actionDisabled: false,
  actionActive: false,
  actionLoading: false,
};

export const batchBarActionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'actionType',
    label: showcaseText('Type', '类型'),
    row: 0,
    options: propLabelSelectOptions(
      ['text', 'symbol', 'statistics'] as const,
      showcaseBatchBarActionTypeLabels,
    ),
  },
  { kind: 'boolean', key: 'actionDisabled', label: showcaseText('Disabled Disable', '禁用 Disable'), row: 0 },
  {
    kind: 'boolean',
    key: 'actionActive',
    label: showcaseText('Active Active', '激活 Active'),
    row: 0,
    visibleWhen: (s) => String(s.actionType ?? 'text') === 'text',
  },
  {
    kind: 'boolean',
    key: 'actionLoading',
    label: showcaseText('Loading Loading', '加载 Loading'),
    row: 0,
    visibleWhen: (s) => String(s.actionType ?? 'text') === 'text',
  },
  {
    kind: 'text',
    key: 'actionLabel',
    label: showcaseText('Copy', '文案'),
    row: 1,
    visibleWhen: (s) => String(s.actionType ?? 'text') === 'text',
  },
  {
    kind: 'text',
    key: 'actionCount',
    label: showcaseText('Statistics', '统计数字'),
    row: 1,
    visibleWhen: (s) => String(s.actionType ?? 'text') === 'statistics',
  },
  {
    kind: 'text',
    key: 'actionCountSuffix',
    label: showcaseText('Statistical Suffix', '统计后缀'),
    row: 1,
    visibleWhen: (s) => String(s.actionType ?? 'text') === 'statistics',
  },
];

export const batchBarPropRows: OrganismPropRow[] = [
  { name: 'selectedCount', type: 'string | number', defaultValue: "'0'", description: showcaseText('Statistics Primary number.', 'Statistics 主数字。') },
  { name: 'countSuffix', type: 'string', defaultValue: "'Selectd'", description: showcaseText('Statistics suffix copy.', 'Statistics 后缀文案。') },
  {
    name: 'labels',
    type: 'string[]',
    defaultValue: "['Label']",
    description: showcaseText('Text action item, 1–20 items; collapsed to first collapsedVisibleCount item + More when collapseThreshold is exceeded.', 'Text 操作项，1–20 项；超过 collapseThreshold 时折叠为前 collapsedVisibleCount 项 + More。'),
  },
  {
    name: 'labelDanger',
    type: 'boolean[]',
    defaultValue: '[]',
    description: showcaseText('Equal length to labels; if true, this Text uses --text-danger-primary.', '与 labels 等长；为 true 时该项 Text 使用 --text-danger-primary。'),
  },
  { name: 'moreLabel', type: 'string', defaultValue: "'More'", description: showcaseText('Collapsedwhen More copy.', '折叠时的 More 文案。') },
  { name: 'collapseThreshold', type: 'number', defaultValue: '4', description: showcaseText('Collapse when the number of labels exceeds this value (default 4).', 'Label 数超过该值时折叠（默认 4）。') },
  {
    name: 'collapsedVisibleCount',
    type: 'number',
    defaultValue: '3',
    description: showcaseText('After folding, the number of labels can be seen in the capsule; the rest goes into the More cladding (Figma 3557: 14071).', '折叠后胶囊内可见 Label 数；其余进 More 覆层（Figma 3557:14071）。'),
  },
  {
    name: 'morePlacement',
    type: "'top' | 'bottom'",
    defaultValue: "'top'",
    description: showcaseText('The direction of the More cladding relative to the spindle of the trigger.', 'More 覆层相对触发器的主轴方向。'),
  },
  {
    name: 'moreAlign',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'start'",
    description: showcaseText('More cladding cross-axis alignment; default start, menu left edge paste More, long copy extends to the right.', 'More 覆层交叉轴对齐；默认 start，菜单左缘贴 More，长文案向右拓展。'),
  },
  {
    name: 'loadingLabelIndex',
    type: 'number | null',
    defaultValue: 'null',
    description: showcaseText('The Label global index being loaded; the Text item displays the eds-load rotation icon, and the More button displays when the overflow item is loaded.', '正在加载的 Label 全局 index；Text 项展示 eds-load 旋转图标，overflow 项时 More 按钮展示。'),
  },
];

export const batchBarEventRows: OrganismPropRow[] = [
  { name: 'dismiss', type: '() => void', defaultValue: '-', description: showcaseText('Symbol Off。', 'Symbol 关闭。') },
  {
    name: 'label-click',
    type: '(label: string, index: number) => void',
    defaultValue: '-',
    description: showcaseText('Text Label Click。', 'Text Label 点击。'),
  },
  { name: 'more', type: '() => void', defaultValue: '-', description: showcaseText('When the More cladding menu opens.', 'More 覆层菜单打开时。') },
];

export const batchBarSlotRows: OrganismPropRow[] = [
  { name: 'leading', type: 'slot', defaultValue: 'EgBatchBarActionItem Symbol', description: showcaseText('Closed area on the left.', '左侧关闭区。') },
  { name: 'statistics', type: 'slot', defaultValue: 'EgBatchBarActionItem Statistics', description: showcaseText('Select the statistics area.', '选中统计区。') },
  {
    name: 'actions',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('Customize the operation area on the right; ignore the labels/More folding logic when provided.', '自定义右侧操作区；提供时忽略 labels / More 折叠逻辑。'),
  },
  {
    name: 'more-menu',
    type: 'slot',
    defaultValue: 'EgFlotationMenu + EgFlotationMenuItem',
    description: showcaseText('More cladding content (Figma Menu Box 3557: 14071); renders overflow labels by default.', 'More 覆层内容（Figma Menu Box 3557:14071）；默认渲染 overflow labels。'),
  },
];

export const batchBarActionPropRows: OrganismPropRow[] = [
  { name: 'type', type: "'text' | 'symbol' | 'statistics'", defaultValue: "'text'", description: showcaseText('BatchBar Action Item Type（Figma 2840:3358）。', 'BatchBar Action Item 类型（Figma 2840:3358）。') },
  { name: 'label', type: 'string', defaultValue: "'Label'", description: 'Type=Text。' },
  { name: 'count', type: 'string | number', defaultValue: "'0'", description: 'Type=Statistics。' },
  { name: 'countSuffix', type: 'string', defaultValue: "'Selectd'", description: showcaseText('Type = Statistics suffix.', 'Type=Statistics 后缀。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Disable State: Copywriter/Icon --text-base-quaternary.', 'Disable 态：文案/图标 --text-base-quaternary。') },
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Text Active state (--event-focus + --text-base-secondary); Hover/Focus is CSS-driven.', 'Text Active 态（--event-focus 底 + --text-base-secondary）；Hover / Focus 由 CSS 驱动。'),
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Text Loading state: eds-load rotation icon (same as DataList loading).', 'Text Loading 态：eds-load 旋转图标（同 DataList loading）。'),
  },
  {
    name: 'danger',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Text Hazardous state: --text-danger-primary.', 'Text 危险态：--text-danger-primary。'),
  },
];

export const containerFigmaNode = '2110:6736';

export const containerCustomizeDefaults = {
  pageBg: 'none' as 'none' | 'right' | 'center',
};

export const containerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'pageBg',
    label: showcaseText('BackgroundPosition', '背景位置'),
    options: propLabelSelectOptions(['none', 'right', 'center'] as const, showcasePageBgLabels),
  },
];

export const containerPropRows: OrganismPropRow[] = [
  { name: 'pageBg', type: "'none' | 'right' | 'center'", defaultValue: "'none'", description: showcaseText('Container-Page BG trim strip position.', 'Container-Page BG 装饰条位置。') },
];

export const layoutFigmaNode = '2091:6707';

const layoutTypeOf = (state: Record<string, unknown>) =>
  String(state.type ?? layoutCustomizeDefaults.type);

const isEmptyLayout = (state: Record<string, unknown>) =>
  layoutTypeOf(state) === 'empty';

export const layoutCustomizeDefaults = {
  type: 'free' as 'empty' | 'free',
  pageBg: containerCustomizeDefaults.pageBg,
  showNavBar: false,
  showModuleMenu: false,
  showToolbar: false,
  showPaginer: false,
  showDataList: false,
  showSkid: false,
};

const isFreeLayout = (state: Record<string, unknown>) => layoutTypeOf(state) === 'free';

export const layoutCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseText('Type', '类型'),
    options: propLabelSelectOptions(['empty', 'free'] as const, showcaseLayoutTypeLabels),
  },
  {
    kind: 'select',
    key: 'pageBg',
    label: showcaseText('BackgroundPosition', '背景位置'),
    options: propLabelSelectOptions(['none', 'right', 'center'] as const, showcasePageBgLabels),
    visibleWhen: isEmptyLayout,
  },
  { kind: 'boolean', key: 'showNavBar', label: 'Nav Bar', visibleWhen: isFreeLayout },
  { kind: 'boolean', key: 'showModuleMenu', label: 'Module Menu', visibleWhen: isFreeLayout },
  { kind: 'boolean', key: 'showToolbar', label: 'Tool Bar', visibleWhen: isFreeLayout },
  { kind: 'boolean', key: 'showPaginer', label: 'Paginer', visibleWhen: isFreeLayout },
  { kind: 'boolean', key: 'showDataList', label: 'Data List', visibleWhen: isFreeLayout },
  { kind: 'boolean', key: 'showSkid', label: 'Skid', visibleWhen: isFreeLayout },
];

export const layoutPropRows: OrganismPropRow[] = [
  {
    name: 'type',
    type: "'empty' | 'navigation' | 'module-menu' | 'free'",
    defaultValue: "'free'",
    description:
      showcaseText('[doc] Layout Type；Showcase by free。 Container Box 960×720，Default 1280×800。', 'Layout 骨架类型；Showcase 自由布局对应 free。外层 Container Box 客户端最小 960×720，默认参考 1280×800。'),
  },
  { name: 'showToolbar', type: 'boolean', defaultValue: 'false', description: 'ToolBar=Yes。' },
  { name: 'showPaginer', type: 'boolean', defaultValue: 'false', description: 'Paginer=Yes。' },
  { name: 'showSkid', type: 'boolean', defaultValue: 'false', description: showcaseText('Skid slider open and close; supports v-model: show-skid. The EgSkid close button sets it to false.', 'Skid 滑层开合；支持 v-model:show-skid。EgSkid 关闭按钮会将其置为 false。') },
];

export const layoutSlotRows: OrganismPropRow[] = [
  { name: 'nav', type: 'slot', defaultValue: 'EgNavBar', description: showcaseText('Nav Bar on the left (free layout optional).', '左侧 Nav Bar（自由布局可选）。') },
  {
    name: 'moduleMenu',
    type: 'slot',
    defaultValue: 'EgModuleMenu',
    description: showcaseText('Module Menu sidebar (type = module-menu | free and when slot is passed in).', 'Module Menu 侧栏（type=module-menu | free 且传入插槽时）。'),
  },
  { name: 'toolbar', type: 'slot', defaultValue: 'EgToolBar', description: 'showToolbar。' },
  { name: 'default', type: 'slot', defaultValue: '-', description: showcaseText('The main content area.', '主内容区。') },
  { name: 'paginer', type: 'slot', defaultValue: 'EgPaginer', description: 'showPaginer。' },
  { name: 'skid', type: 'slot', defaultValue: 'EgSkid', description: showcaseText('showSkid Right slider.', 'showSkid 右侧滑层。') },
];

export function layoutPropRowsForType(type: string): OrganismPropRow[] {
  if (type === 'empty') return containerPropRows;
  return layoutPropRows;
}

export function layoutSlotRowsForType(type: string): OrganismPropRow[] {
  if (type === 'empty') return [];

  return [...layoutSlotRows];
}

/** Desktop 无限嵌套：Container（底层）→ box-page 插槽 → Layout */
export function buildLayoutUsageSnippet(
  customize: Record<string, unknown>,
): string {
  const type = layoutTypeOf(customize);

  if (type === 'empty') {
    return buildVueSelfClosingSnippet(
      'EgContainer',
      { pageBg: customize.pageBg },
      { defaults: { pageBg: layoutCustomizeDefaults.pageBg } },
    );
  }

  const includeLayoutSkid = Boolean(customize.showSkid);

  const layoutOpen = buildVueOpeningTag(
    'EgLayout',
    {
      type: customize.type,
      showToolbar: customize.showDataList ? false : customize.showToolbar,
      showPaginer: customize.showDataList ? false : customize.showPaginer,
    },
    { defaults: layoutCustomizeDefaults },
  ).replace(
    '<EgLayout',
    includeLayoutSkid ? '<EgLayout\n    v-model:show-skid="skidOpen"' : '<EgLayout',
  );

  const lines: string[] = [layoutOpen];

  const includeNavBar = type === 'free' && Boolean(customize.showNavBar);

  if (includeNavBar) {
    lines.push('    <template #nav>');
    lines.push('      <EgNavBar>');
    lines.push('        <template #corporation>');
    lines.push('          <EgNavBarCorporation label="G" />');
    lines.push('        </template>');
    lines.push('        <EgNavBarModuleItem label="Label">');
    lines.push('          <EgIcon name="eds-add" size="md" />');
    lines.push('        </EgNavBarModuleItem>');
    lines.push('        <template #utilities>');
    lines.push('          <EgNavBarBottomIcon label="Setting">');
    lines.push('            <EgIcon name="eds-setting" size="sm" />');
    lines.push('          </EgNavBarBottomIcon>');
    lines.push('        </template>');
    lines.push('        <template #avatar>');
    lines.push('          <EgNavBarAvatar initials="N" />');
    lines.push('        </template>');
    lines.push('      </EgNavBar>');
    lines.push('    </template>');
  }

  if (type === 'free' && Boolean(customize.showModuleMenu)) {
    lines.push('    <template #moduleMenu>');
    lines.push('      <EgModuleMenu />');
    lines.push('    </template>');
  }

  if (customize.showToolbar && !customize.showDataList) {
    lines.push('    <template #toolbar>');
    lines.push('      <EgToolBar title="Item" />');
    lines.push('    </template>');
  }

  if (customize.showDataList) {
    lines.push('    <!-- Data List 页面（EgLayout + ToolBar + EgDataList + Paginer） -->');
    lines.push('    <EgLayout type="empty" show-toolbar show-paginer>');
    lines.push('      <EgDataList :data-list="rows">');
    lines.push('        <EgDataListColumn prop="primary" label="Header" min-width="160px" />');
    lines.push('      </EgDataList>');
    lines.push('    </EgLayout>');
  } else {
    lines.push('    <!-- 主内容 -->');
  }

  if (customize.showPaginer && !customize.showDataList) {
    lines.push('    <template #paginer>');
    lines.push('      <EgPaginer />');
    lines.push('    </template>');
  }

  if (includeLayoutSkid) {
    lines.push('    <template #skid>');
    lines.push('      <EgSkid />');
    lines.push('    </template>');
  }

  lines.push('  </EgLayout>');

  return ['<EgContainer>', '  <!-- 默认插槽：EgContainer 提供 --box-page 页面层 -->', ...lines, '</EgContainer>'].join(
    '\n',
  );
}

export const popupFigmaNode = '2170:3023';

export const popupCustomizeDefaults = {
  uses: 'custom' as 'detail' | 'dialog' | 'verify' | 'custom',
  alertVerticalAlign: 'center' as 'center' | 'offset-top',
  dialogType: 'symbol' as 'symbol' | 'compose' | 'standard',
  ...popupCustomBoxSizeDefaults,
  ...popupCustomContentInsetDefaults,
  ...popupCustomChromeDefaults,
  ...popupVerifyCustomizeDefaults,
};

export const popupUsesCustomizeControl: DocCustomizeControl = {
  kind: 'select',
  key: 'uses',
  label: showcaseText('Scenes', '场景化'),
  options: propLabelSelectOptions(
    ['detail', 'dialog', 'verify', 'custom'] as const,
    showcasePopupUsesLabels,
  ),
};

export const popupAlertVerticalAlignCustomizeControl: DocCustomizeControl = {
  kind: 'select',
  key: 'alertVerticalAlign',
  label: showcaseText('Vertical Alignment', '垂直对齐方式'),
  options: propLabelSelectOptions(
    ['center', 'offset-top'] as const,
    showcasePopupAlertVerticalAlignLabels,
  ),
  visibleWhen: (state) => state.uses !== 'detail',
};

export const popupCustomBoxWidthControl: DocCustomizeControl = {
  kind: 'text',
  key: 'boxWidth',
  label: showcaseText('Popup Box width.', 'Popup Box 宽度'),
  visibleWhen: (state) => state.uses === 'custom' && isPopupCustomBoxSizePresetCustom(state),
};

export const popupCustomBoxHeightControl: DocCustomizeControl = {
  kind: 'text',
  key: 'boxHeight',
  label: showcaseText('Popup Box height.', 'Popup Box 高度'),
  visibleWhen: (state) => state.uses === 'custom' && isPopupCustomBoxSizePresetCustom(state),
};

export const popupDialogTypeCustomizeControl: DocCustomizeControl = {
  kind: 'select',
  key: 'dialogType',
  label: showcaseText('My scene', '场景'),
  options: propLabelSelectOptions(DIALOG_TYPES, showcaseDialogTypeLabels),
  visibleWhen: (state) => state.uses === 'dialog',
};

export type PopupSceneUses = 'detail' | 'dialog' | 'verify';

export type PopupCustomizeUses = 'custom' | PopupSceneUses;

export function buildPopupCustomizeDefaults(uses: PopupCustomizeUses = 'custom') {
  return {
    ...popupCustomizeDefaults,
    uses,
    alertVerticalAlign: uses === 'custom' ? ('center' as const) : ('offset-top' as const),
    ...(uses === 'dialog' ? { dialogType: 'standard' as const } : {}),
  };
}

export function buildPopupCustomizeControls(uses: PopupCustomizeUses): DocCustomizeControl[] {
  if (uses === 'custom') {
    return [
      popupAlertVerticalAlignCustomizeControl,
      popupCustomBoxSizePresetControl,
      popupCustomContentInsetPresetControl,
      popupCustomBoxWidthControl,
      popupCustomBoxHeightControl,
    ];
  }

  if (uses === 'detail') {
    return [];
  }

  const controls: DocCustomizeControl[] = [popupAlertVerticalAlignCustomizeControl];

  if (uses === 'dialog') {
    return [popupDialogTypeCustomizeControl, popupAlertVerticalAlignCustomizeControl];
  }

  return [...controls, ...popupVerifyCustomizeControls];
}

/** Popup 本体页 — 仅 Custom 外壳定制（场景化 uses 走侧栏 Scenes）。 */
export const popupCustomizeControls: DocCustomizeControl[] = buildPopupCustomizeControls('custom');

export const popupPropRows: OrganismPropRow[] = [
  {
    name: 'open (v-model)',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Whether Popup is on; play shell appearance (`.motion-layout`) before uninstalling when closing.', 'Popup 是否打开；关闭时先播放 shell 出场（`.motion-layout`），再卸载。'),
  },
  {
    name: 'uses',
    type: "'detail' | 'dialog' | 'verify' | 'custom'",
    defaultValue: "'custom'",
    description:
      showcaseText('[doc] Popup Scenes。Detail 880×620；Dialog / Verify asFixed Popup Box + organism；Custom asFixedSize Popup Box + DefaultSlot。', 'Popup 场景化。Detail 880×620；Dialog / Verify 为固定 Popup Box + 内容 organism；Custom 为固定尺寸 Popup Box + 默认插槽。'),
  },
  {
    name: 'alertVerticalAlign',
    type: "'center' | 'offset-top'",
    defaultValue: 'dialog / verify → offset-top；custom → center',
    description:
      showcaseText('[doc] Alert VerticalAlign（Detail ）。center：；offset-top： 168px （`--eds-popup-alert-offset-top`）。when dialog / verify Default offset-top；custom Default center。', 'Alert 舞台垂直对齐（Detail 忽略）。center：几何居中；offset-top：顶边距 168px 偏上（`--eds-popup-alert-offset-top`）。未传时 dialog / verify 默认 offset-top；custom 默认 center。'),
  },
  {
    name: 'boxWidth',
    type: 'number',
    defaultValue: '780',
    description: showcaseText('uses = custom and size = Popup Box width when custom (px); lg/md/sm is a fixed preset.', 'uses=custom 且尺寸=自定义时 Popup Box 宽度（px）；lg/md/sm 为固定预设。'),
  },
  {
    name: 'boxHeight',
    type: 'number',
    defaultValue: '560',
    description: showcaseText('uses = custom and size = Popup Box height when custom (px); lg/md/sm is a fixed preset.', 'uses=custom 且尺寸=自定义时 Popup Box 高度（px）；lg/md/sm 为固定预设。'),
  },
  {
    name: 'verifyType',
    type: 'VerifyType',
    defaultValue: "'single-email'",
    description:
      showcaseText('[doc] uses=verify whenand Popup Box FixedSize（ 328×436、Google 328×412、Transaction// 328×416、PassKey 328×406、2FA 358×459）。', 'uses=verify 时内容场景与 Popup Box 固定尺寸（邮箱 328×436、Google 328×412、交易/登录/锁定 328×416、PassKey 328×406、2FA 358×459）。'),
  },
  {
    name: 'dialogType',
    type: "'symbol' | 'compose' | 'standard'",
    defaultValue: "dialog → 'standard'；其它 → 'symbol'",
    description: showcaseText('egDialog scenario when uses = dialog (Symbolic Conversation/Standard/Business Conversation; Symbol 280px/Compose · Standard 460px).', 'uses=dialog 时 EgDialog 场景（带符号的对话 / 标准 / 业务对话；Symbol 280px / Compose·Standard 460px）。'),
  },
  {
    name: 'microFloat',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Shell entry and exit motion (`.motion-layout` + host active).', 'Shell 进出场动效（`.motion-layout` + host active）。'),
  },
];

export const skidFigmaNode = '2260:3822';

export const skidCustomizeDefaults = {
  title: 'Title',
  showButton: true,
  tone: 'decor',
  confirmLabel: 'Confirm',
};

export const skidCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'title', label: showcaseText('Title', '标题') },
  { kind: 'boolean', key: 'showButton', label: showcaseText('Bottom Actions', '底部操作') },
];

export const skidActionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseText('Tone', '色调'),
    options: buttonToneRows
      .filter((row) => ['brand', 'decor', 'danger'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'confirmLabel', label: showcaseText('Confirm copy', '确认文案') },
];

export const skidPropRows: OrganismPropRow[] = [
  { name: 'title', type: 'string', defaultValue: "'Title'", description: showcaseText('Skid-Title copy (required).', 'Skid-Title 文案（必填）。') },
  {
    name: 'showButton',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Whether the bottom Action area is displayed; it is displayed by default.', '是否显示底部 Action 区；默认显示。'),
  },
  {
    name: 'actionTone',
    type: "'brand' | 'decor' | 'danger'",
    defaultValue: "'decor'",
    description: showcaseText('showButton whenDefault EgComboButton tone。', 'showButton 时默认 EgComboButton tone。'),
  },
  {
    name: 'confirmLabel',
    type: 'string',
    defaultValue: "'Confirm'",
    description: showcaseText('default EgComboButton confirmation copy when showButton.', 'showButton 时默认 EgComboButton 确认文案。'),
  },
];

export const skidSlotRows: OrganismPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: '-', description: showcaseText('Skid body content.', 'Skid 主体内容。') },
  {
    name: 'action',
    type: 'slot',
    defaultValue: 'EgComboButton',
    description: showcaseText('Bottom Action；Default EgComboButton。', '底部 Action；默认 EgComboButton。'),
  },
];

export function buildSkidUsageSnippet(state: Record<string, unknown>): string {
  const openTag = buildVueOpeningTag(
    'EgSkid',
    {
      title: state.title,
      showButton: state.showButton,
      actionTone: state.showButton ? state.tone : undefined,
      confirmLabel: state.showButton ? state.confirmLabel : undefined,
    },
    { defaults: skidCustomizeDefaults },
  );

  if (state.showButton) {
    const comboSnippet = buildVueSelfClosingSnippet(
      'EgComboButton',
      { tone: state.tone, confirmLabel: state.confirmLabel },
      { defaults: { tone: skidCustomizeDefaults.tone, confirmLabel: skidCustomizeDefaults.confirmLabel } },
    );
    return `${openTag}>\n  <template #action>\n    ${comboSnippet}\n  </template>\n</EgSkid>`;
  }

  return `${openTag} />`;
}

export const dataListCustomizeDefaults = {
  pageHeightMode: 'fixed' as 'fixed' | 'adaptive',
  columnHeight: '66' as '66' | '48',
  dataVolume: '103',
  loading: false,
  initing: false,
  empty: false,
  selectMode: false,
  showBatch: true,
  showExport: true,
  showBack: false,
  showStatistics: false,
  ...iconButtonProSingleItemDefaults('batch', {
    label: 'Batch',
    icon: 'eds-batch',
  }),
  ...iconButtonProSingleItemDefaults('filter', {
    label: 'Filter',
    icon: 'eds-filter',
  }),
  ...iconButtonProSingleItemDefaults('refresh', {
    label: 'Refresh',
    icon: 'eds-arrow-refresh',
  }),
  ...iconButtonProSingleItemDefaults('export', {
    label: 'Export',
    icon: 'eds-arrow-download',
  }),
  statisticsCount: '2',
  statisticsCollapse: false,
  toolbarCustomizeKey: 'batch',
  ...paginerPaginationCustomizeDefaults('dataListPaginationKey'),
  ...paginerStatisticsItemDefaults('Item', '0'),
  ...dataListColumnSettingDefaults(),
};

export const dataListPaginationCustomizeControls = buildPaginerPaginationCustomizeControls(
  'dataListPaginationKey',
);

/** Figma CE - Data List · frame DataList (3128:4483) 右侧 Page 区基准场景。 */
export const dataListFigmaNode = '3128:4483';

export const dataListPageHeightOptions = [
  { value: 'fixed', label: showcaseText('Fixed 800', '固定 800') },
  { value: 'adaptive', label: showcaseText('Adaptive（min 720）', '自适应（min 720）') },
];

export const dataListColumnHeightOptions = [
  { value: '66', label: '66（Xl）' },
  { value: '48', label: '48（Md）' },
];

export const dataListCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'pageHeightMode',
    label: showcaseText('Height', '高度'),
    options: dataListPageHeightOptions,
  },
  {
    kind: 'select',
    key: 'columnHeight',
    label: showcaseText('Line Height', '行高'),
    options: dataListColumnHeightOptions,
  },
  { kind: 'text', key: 'dataVolume', label: showcaseText('Data volume', '数据量') },
  { kind: 'boolean', key: 'initing', label: showcaseText('Inisialisasi', '初始化') },
  { kind: 'boolean', key: 'loading', label: showcaseText('Loading', '加载中') },
  { kind: 'boolean', key: 'empty', label: showcaseText('Empty data', '空数据') },
  {
    kind: 'boolean',
    key: 'selectMode',
    label: showcaseText('Multiple Selection Mode', '多选模式'),
    visibleWhen: (state) => Boolean(state.showBatch),
  },
  { kind: 'boolean', key: 'showBatch', label: showcaseText('Proses Batch', '批处理') },
  { kind: 'boolean', key: 'showExport', label: showcaseText('Exporting', '导出') },
  { kind: 'boolean', key: 'showBack', label: showcaseText('Back', '返回') },
  { kind: 'boolean', key: 'showStatistics', label: showcaseText('Statistics area', '统计区') },
];

const DATA_LIST_TOOLBAR_BUTTON_KEYS = ['batch', 'filter', 'refresh', 'export'] as const;

const dataListToolbarButtonOptions = [
  { value: 'batch', label: showcaseText('Proses Batch', '批处理') },
  { value: 'filter', label: showcaseText('Filter', '筛选') },
  { value: 'refresh', label: showcaseText('Refresh', '刷新') },
  { value: 'export', label: showcaseText('Exporting', '导出') },
];

/** ToolBar 区批处理 / 筛选 / 刷新 / 导出共用一个 EgIconProButton 嵌套面板。 */
export const dataListToolbarCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'toolbarCustomizeKey',
    label: showcaseText('Button', '按钮'),
    options: dataListToolbarButtonOptions,
    row: 0,
  },
  ...DATA_LIST_TOOLBAR_BUTTON_KEYS.flatMap((prefix) =>
    buildIconButtonProSingleCustomizeControls(prefix).map((control) => ({
      ...control,
      visibleWhen: (state: Record<string, unknown>) => {
        if (String(state.toolbarCustomizeKey ?? 'batch') !== prefix) return false;
        return control.visibleWhen ? control.visibleWhen(state) : true;
      },
    })),
  ),
];

const dataListColumnAlignOptions = [
  tokenOption('左', 'left'),
  tokenOption('中', 'center'),
  tokenOption('右', 'right'),
];

const dataListColumnSettingIndexOptions = Array.from(
  { length: DATA_LIST_PREVIEW_COLUMN_COUNT },
  (_, offset) => {
    const index = offset + 1;
    return { value: String(index), label: dataListColumnSettingLabel(index) };
  },
);

export const dataListColumnSettingControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'columnSettingIndex',
    label: showcaseText('Column', '列'),
    options: dataListColumnSettingIndexOptions,
    row: 0,
  },
  ...Array.from({ length: DATA_LIST_PREVIEW_COLUMN_COUNT }, (_, offset) => {
    const index = offset + 1;
    const visibleWhen = (state: Record<string, unknown>) =>
      String(state.columnSettingIndex ?? '1') === String(index);

    return [
      ...(index > 1 && index < DATA_LIST_PREVIEW_COLUMN_COUNT
        ? [
            {
              kind: 'select' as const,
              key: `columnAlign${index}`,
              label: showcaseText('Alignment', '对齐方式'),
              options: dataListColumnAlignOptions,
              row: 0,
              visibleWhen,
            },
          ]
        : []),
      {
        kind: 'text' as const,
        key: `columnMinWidth${index}`,
        label: showcaseText('Minimal width', '最小宽度'),
        placeholder: '168px',
        row: 1,
        visibleWhen,
      },
      {
        kind: 'select' as const,
        key: `columnDataSource${index}`,
        label: showcaseText('Sources of Data Used', '数据来源'),
        options: dataListColumnDataSourceOptions,
        row: 1,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `columnLabel${index}`,
        label: index === 1 ? '表头 1' : '表头',
        placeholder: 'Header',
        row: 1,
        visibleWhen,
      },
      {
        kind: 'boolean' as const,
        key: `columnSortable${index}`,
        label: showcaseText('Sort', '排序'),
        row: 1,
        visibleWhen,
      },
      ...(index === 1
        ? [
            {
              kind: 'text' as const,
              key: 'columnSecondaryLabel1',
              label: showcaseText('Header 2', '表头 2'),
              placeholder: 'Header',
              row: 1,
              visibleWhen,
            },
            {
              kind: 'boolean' as const,
              key: 'columnSecondarySortable1',
              label: showcaseText('Sort', '排序'),
              row: 1,
              visibleWhen,
            },
          ]
        : []),
    ];
  }).flat(),
];

export const dataListPropRows: OrganismPropRow[] = [
  { name: 'dataList', type: 'DataListItem[]', defaultValue: '[]', description: showcaseText('Row', '行数据。') },
  { name: 'headerHeight', type: 'number', defaultValue: '32', description: showcaseText('Header height (px).', '表头高度（px）。') },
  { name: 'columnHeight', type: 'number', defaultValue: '66', description: showcaseText('Line height (px): Xl = 66, Md = 48.', '行高（px）：Xl=66，Md=48。') },
  { name: 'headerBg', type: 'string', defaultValue: '-', description: showcaseText('Table header background; default --data-table-head.', '表头背景；默认 --data-table-head。') },
  { name: 'maxHeight', type: 'string', defaultValue: '-', description: showcaseText('Max. Width (Optional)', '最大高度（可选）。') },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: showcaseText('Top loading bar.', '顶部加载条。') },
  { name: 'initing', type: 'boolean', defaultValue: 'false', description: showcaseText('Full table initialization mask (delayed occurrence).', '全表初始化遮罩（延迟出现）。') },
  { name: 'selectMode', type: 'boolean', defaultValue: 'false', description: showcaseText('Multi-select mode (v-model: select-mode).', '多选模式（v-model:select-mode）。') },
  { name: 'emptyText', type: 'string', defaultValue: "'No data'", description: showcaseText('EmptyStatus copy.', '空状态文案。') },
  {
    name: 'skidOpen',
    type: 'boolean',
    defaultValue: 'false',
    description:
      showcaseText('[doc] Skid whenHiddenColumnand；Offwhenin Skid Motion（EgLayout + EgDataList）。', 'Skid 抽屉打开时隐藏尾列与操作区；关闭时在 Skid 推动动效结束后再恢复（EgLayout + EgDataList）。'),
  },
  { name: 'batchActions', type: 'DataListBatchAction[]', defaultValue: '[]', description: showcaseText('Batch button; built-in BatchBar when no # operation.', '批处理按钮；无 #operation 时内置 BatchBar。') },
  { name: 'onBatchAction', type: '(key, rows) => Promise<void>', defaultValue: '-', description: showcaseText('Batch callback; failed throw triggers Toast.', '批处理回调；失败 throw 触发 Toast。') },
  { name: 'primaryAction', type: 'DataListPrimaryAction', defaultValue: '-', description: showcaseText('Action column main button.', '操作列主按钮。') },
  { name: 'moreActions', type: 'DataListRowAction[]', defaultValue: '[]', description: showcaseText('Actions column for more menu items.', '操作列更多菜单项。') },
];

export const dataListColumnPropRows: OrganismPropRow[] = [
  { name: 'prop', type: 'string', defaultValue: '-', description: showcaseText('Field name; take data [prop] if no default slot is provided.', '字段名；默认槽未提供时取 data[prop]。') },
  { name: 'label', type: 'string', defaultValue: '-', description: showcaseText('Header copy.', '表头文案。') },
  { name: 'width', type: 'string', defaultValue: '-', description: showcaseText('Column width (e.g. 160px).', '列宽（如 160px）。') },
  { name: 'widthPercent', type: 'number', defaultValue: '-', description: showcaseText('Percent of Column', '列宽百分比。') },
  { name: 'minWidth', type: 'string', defaultValue: '-', description: showcaseText('Minimum column width (responsive calculation).', '最小列宽（响应式计算）。') },
  { name: 'displayOrder', type: 'number', defaultValue: '-', description: showcaseText('Show the priority, smaller is more to the left.', '展示优先级，越小越靠左。') },
  { name: 'isAction', type: 'boolean', defaultValue: 'false', description: showcaseText('Action column; defaults to the last column.', '操作列；默认最后一列。') },
  { name: 'minTableWidth', type: 'number', defaultValue: '-', description: showcaseText('(legacy) container width threshold.', '（legacy）容器宽度门槛。') },
  { name: 'align', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: showcaseText('Align。', '对齐。') },
  { name: 'sortable', type: 'boolean', defaultValue: 'false', description: showcaseText('Header sort menu.', '表头排序菜单。') },
  { name: 'hidden', type: 'boolean', defaultValue: 'false', description: showcaseText('HiddenColumn。', '隐藏列。') },
  { name: 'type', type: "'default' | 'select'", defaultValue: "'default'", description: showcaseText('default data column; select is injected by the list multi-select mode.', 'default 数据列；select 由列表多选模式注入。') },
];

export const dataListSlotRows: OrganismPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: 'EgDataListColumn[]', description: showcaseText('The column definition (EgDataListColumn).', '列定义（EgDataListColumn）。') },
  { name: 'operation', type: 'slot', defaultValue: '-', description: showcaseText('The Batch Bar action area when multiple selections are made (when batchActions is empty).', '多选时 Batch Bar 操作区（batchActions 为空时）。') },
  { name: 'empty', type: 'slot', defaultValue: '-', description: showcaseText('EmptyStatusCustom。', '空状态自定义。') },
  { name: 'header', type: 'slot', defaultValue: '-', description: showcaseText('Column-level table header customization (EgDataListColumn # header).', '列级表头自定义（EgDataListColumn #header）。') },
];
