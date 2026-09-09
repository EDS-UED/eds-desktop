import {
  getCregisModuleMenuGroups,
  type ModuleMenuPresetGroup,
  type ModuleMenuPresetItem,
} from '@/presets/module-menu/cregisModuleMenuGroups';
import {
  resolveModuleMenuBusinessTitleForScenario,
  moduleMenuBusinessTitleUsesFlotationTitle,
  type ModuleMenuBusinessScenario,
} from '@/presets/module-menu/businessModuleTitles';
import { getUdunModuleMenuGroups } from '@/presets/module-menu/udunModuleMenuGroups';
import {
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  DEFAULT_UDUN_MODULE_MENU_BUSINESS_TITLE,
} from '@/presets/module-menu/businessModuleTitles';
import type { ModuleMenuScenario } from './organismTemplateDocData';

export const MODULE_MENU_SCENE_COMPONENT_TAG: Record<ModuleMenuScenario, string> = {
  'module-menu': 'EgModuleMenu',
  cregis: 'EgCregisModuleMenu',
  udun: 'EgUdunModuleMenu',
};

export function resolveModuleMenuSceneComponentTag(scenario: ModuleMenuScenario): string {
  return MODULE_MENU_SCENE_COMPONENT_TAG[scenario] ?? 'EgModuleMenu';
}

export function resolveModuleMenuSceneImportCode(scenario: ModuleMenuScenario): string {
  const tag = resolveModuleMenuSceneComponentTag(scenario);
  return `import { ${tag} } from '@eds/desktop-components';`;
}
import {
  buildModuleMenuCustomizeDefaults,
  isModuleMenuTitlePresetKind,
} from './organismTemplateDocData';
import {
  buildModuleMenuPreviewGroups,
  resolveModuleMenuPreviewTitle,
  type ModuleMenuPreviewGroup,
  type ModuleMenuPreviewItem,
} from './moduleMenuPreviewGroups';
import {
  buildFlotationComboNestedSnippet,
  buildFlotationPresetItems,
  flotationTriggerModuleMenuDefaults,
  moduleMenuTitleFlotationDemoState,
  parseFlotationItemCount,
  parseFlotationMaxHeight,
  parseFlotationMenuWidth,
  withFlotationComboTriggerKind,
} from './flotationDocCustomize';

export function isModuleMenuBusinessScenario(scenario: unknown): scenario is Exclude<ModuleMenuScenario, 'module-menu'> {
  return scenario === 'cregis' || scenario === 'udun';
}

export function buildCregisModuleMenuCustomizeDefaults(): Record<string, unknown> {
  return {
    ...buildModuleMenuCustomizeDefaults(),
    scenario: 'cregis',
    moduleBusinessTitle: DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  };
}

export function buildUdunModuleMenuCustomizeDefaults(): Record<string, unknown> {
  return {
    ...buildModuleMenuCustomizeDefaults(),
    scenario: 'udun',
    moduleBusinessTitle: DEFAULT_UDUN_MODULE_MENU_BUSINESS_TITLE,
  };
}

export function resolveModuleMenuBusinessGroups(
  scenario: ModuleMenuScenario,
  title: string,
): ModuleMenuPresetGroup[] {
  if (scenario === 'udun') {
    return getUdunModuleMenuGroups(
      title as Parameters<typeof getUdunModuleMenuGroups>[0],
    );
  }
  if (scenario === 'cregis') {
    return getCregisModuleMenuGroups(
      title as Parameters<typeof getCregisModuleMenuGroups>[0],
    );
  }
  return [];
}

function resolveBusinessScenario(state: Record<string, unknown>): ModuleMenuBusinessScenario {
  const scenario = String(state.scenario ?? 'module-menu');
  return scenario === 'udun' ? 'udun' : 'cregis';
}

export function resolveModuleMenuBusinessTitle(state: Record<string, unknown>): string {
  if (!isModuleMenuBusinessScenario(state.scenario)) {
    return resolveModuleMenuBusinessTitleForScenario('cregis', state.moduleBusinessTitle);
  }
  return resolveModuleMenuBusinessTitleForScenario(
    resolveBusinessScenario(state),
    state.moduleBusinessTitle,
  );
}

/** 业务模块标题走 EgFlotation Combo（Cregis WaaS 等）；按场景独立配置。 */
export function moduleMenuBusinessTitleUsesFlotationTrigger(
  state: Record<string, unknown>,
): boolean {
  if (!isModuleMenuBusinessScenario(state.scenario)) return false;
  const scenario = resolveBusinessScenario(state);
  const title = resolveModuleMenuBusinessTitle(state);
  return moduleMenuBusinessTitleUsesFlotationTitle(scenario, title);
}

function escapeAttr(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildModuleMenuItemSnippet(item: ModuleMenuPresetItem, indent: string): string {
  const tier = item.tier ?? 1;
  const attrs = [`label="${escapeAttr(item.label)}"`];
  if (tier === 2) attrs.push('tier="2"');

  if (item.message?.trim()) {
    attrs.push(`message="${escapeAttr(item.message.trim())}"`);
    if ((item.messageType ?? 'subtle') !== 'subtle') {
      attrs.push(`message-type="${item.messageType}"`);
    }
    if (item.focusBackground === 'same-white') {
      attrs.push('message-focus-background="same-white"');
    }
  } else if (item.showReddot) {
    attrs.push('show-reddot');
  }

  const iconSlot = item.avatar
    ? `${indent}  <template #icon><EgAvatar name="${escapeAttr(item.avatar.name)}" size="${item.avatar.size ?? 'xs'}"${
        item.avatar.colorIndex === undefined ? '' : ` :color-index="${item.avatar.colorIndex}"`
      } /></template>`
    : `${indent}  <template #icon><EgIcon name="${escapeAttr(item.icon)}" size="sm" /></template>`;

  const subSnippets =
    tier === 2 && item.subitems?.length
      ? item.subitems
          .map(
            (sub) =>
              [
                `${indent}  <EgModuleMenuItem subitem label="${escapeAttr(sub.label)}">`,
                `${indent}    <template #icon><EgIcon name="${escapeAttr(sub.icon)}" size="sm" /></template>`,
                `${indent}  </EgModuleMenuItem>`,
              ].join('\n'),
          )
          .join('\n')
      : '';

  return [
    `${indent}<EgModuleMenuItem ${attrs.join(' ')}>`,
    iconSlot,
    subSnippets,
    `${indent}</EgModuleMenuItem>`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function buildModuleMenuGroupSnippet(group: ModuleMenuPresetGroup): string {
  const titleAttr = group.title ? ` title="${escapeAttr(group.title)}"` : '';
  const items = group.items.map((item) => buildModuleMenuItemSnippet(item, '    ')).join('\n');

  return [`  <EgModuleMenuGroup${titleAttr}>`, items, '  </EgModuleMenuGroup>'].join('\n');
}

function buildModuleMenuPreviewItemSnippet(item: ModuleMenuPreviewItem, indent: string): string {
  const attrs = [`label="${escapeAttr(item.label)}"`];
  if (item.tier === 2) attrs.push('tier="2"');

  if (item.accessory === 'message') {
    attrs.push(`message="${escapeAttr(item.messageText)}"`);
    if (item.messageType !== 'subtle') {
      attrs.push(`message-type="${item.messageType}"`);
    }
    if (item.messageFocusBackground === 'same-white') {
      attrs.push('message-focus-background="same-white"');
    }
  } else if (item.accessory === 'reddot') {
    attrs.push('show-reddot');
  }

  const iconSlot = `${indent}  <template #icon><EgIcon name="${escapeAttr(item.icon)}" size="sm" /></template>`;

  const subSnippets =
    item.tier === 2 && item.subitems.length
      ? item.subitems
          .map(
            (sub) =>
              [
                `${indent}  <EgModuleMenuItem subitem label="${escapeAttr(sub.label)}">`,
                `${indent}    <template #icon><EgIcon name="${escapeAttr(sub.icon)}" size="sm" /></template>`,
                `${indent}  </EgModuleMenuItem>`,
              ].join('\n'),
          )
          .join('\n')
      : '';

  return [
    `${indent}<EgModuleMenuItem ${attrs.join(' ')}>`,
    iconSlot,
    subSnippets,
    `${indent}</EgModuleMenuItem>`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function buildModuleMenuPreviewGroupSnippet(group: ModuleMenuPreviewGroup): string {
  const titleAttr = group.title ? ` title="${escapeAttr(group.title)}"` : '';
  const items = group.items
    .map((item) => buildModuleMenuPreviewItemSnippet(item, '    '))
    .join('\n');

  return [`  <EgModuleMenuGroup${titleAttr}>`, items, '  </EgModuleMenuGroup>'].join('\n');
}

/** 组件场景（Showcase「组件」）— 按 customize 面板生成完整 usage 片段。 */
export function buildModuleMenuComponentUsageSnippet(state: Record<string, unknown>): string {
  if (isModuleMenuBusinessScenario(String(state.scenario ?? 'module-menu'))) {
    return buildModuleMenuBusinessUsageSnippet(state);
  }

  const usesTrigger = isModuleMenuTitlePresetKind(state);
  const title = resolveModuleMenuPreviewTitle(state);
  const groups = buildModuleMenuPreviewGroups(state);
  const groupSnippets = groups.map(buildModuleMenuPreviewGroupSnippet).join('\n');
  const titleSlot = usesTrigger ? buildModuleMenuTitleTriggerSnippet(state, '  ') : '';

  const rootAttrs = [`title="${escapeAttr(title)}"`];
  if (usesTrigger) rootAttrs.push('title-mode="trigger"');
  if (Boolean(state.wide)) rootAttrs.push('wide');
  if (state.showEdgeDivider === false) rootAttrs.push(':show-edge-divider="false"');

  return [
    `<EgModuleMenu ${rootAttrs.join(' ')}>`,
    titleSlot,
    groupSnippets,
    '</EgModuleMenu>',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

/** 业务场景 Module Menu 标题浮层 Trigger 文案（WaaS → Doris Studio；其余浮层模块 → 模块名）。 */
export function resolveModuleMenuBusinessFlotationTitle(state: Record<string, unknown>): string {
  if (isCregisWaasBusinessState(state)) {
    const label = String(
      state.triggerLabel ?? state.label ?? flotationTriggerModuleMenuDefaults.label,
    ).trim();
    return label === '' ? flotationTriggerModuleMenuDefaults.label : label;
  }
  if (moduleMenuBusinessTitleUsesFlotationTrigger(state)) {
    return resolveModuleMenuBusinessTitle(state);
  }
  const label = String(
    state.triggerLabel ?? state.label ?? flotationTriggerModuleMenuDefaults.label,
  ).trim();
  return label === '' ? flotationTriggerModuleMenuDefaults.label : label;
}

export function isCregisWaasBusinessState(state: Record<string, unknown>): boolean {
  return (
    String(state.scenario ?? 'module-menu') === 'cregis' &&
    resolveModuleMenuBusinessTitle(state) === 'WaaS'
  );
}

/** 业务模块：title-mode="trigger" + #title EgFlotation + 模块菜单组。 */
export function buildModuleMenuFlotationTitleBusinessUsageSnippet(
  state: Record<string, unknown>,
): string {
  const scenario = String(state.scenario ?? 'module-menu') as ModuleMenuScenario;
  const moduleTitle = resolveModuleMenuBusinessTitle(state);
  const menuState = resolveModuleMenuTitleFlotationMenuState();
  const width = parseFlotationMenuWidth(menuState) ?? 288;
  const maxHeight = parseFlotationMaxHeight(menuState) ?? 540;
  const addLabel = String(menuState.addLabel ?? 'Create Project');
  const titleLabel = resolveModuleMenuBusinessFlotationTitle(state);
  const groupSnippets = resolveModuleMenuBusinessGroups(scenario, moduleTitle)
    .map(buildModuleMenuGroupSnippet)
    .join('\n');

  return [
    `<EgModuleMenu title="${escapeAttr(titleLabel)}" title-mode="trigger">`,
    '  <template #title>',
    '    <EgFlotation',
    `  add-label="${escapeAttr(addLabel)}"`,
    `  :width="${width}"`,
    `  :max-height="${maxHeight}"`,
    '  :items="titleMenuItems">',
    '    <template #trigger="{ expanded, selectedItem, hasAnyItemReddot }">',
    '      <EgFlotationTrigger',
    '        module-menu-title',
    '        trigger-style="text"',
    '        width-mode="trigger"',
    `        :label="selectedItem?.label ?? '${escapeAttr(titleLabel)}'"`,
    '        :show-reddot="hasAnyItemReddot"',
    '        :expanded="expanded"',
    '      />',
    '    </template>',
    '    </EgFlotation>',
    '  </template>',
    groupSnippets,
    '</EgModuleMenu>',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

/** Module Menu #title 浮层：Menu/Box 演示 customize（与 Combo 页默认项独立，见 moduleMenuTitleFlotationDemoState）。 */
export function resolveModuleMenuTitleFlotationMenuState(): Record<string, unknown> {
  return { ...moduleMenuTitleFlotationDemoState };
}

/** Module Menu #title：Combo 触发器 customize（模块菜单预置 triggerKind）。 */
export function resolveModuleMenuTitleFlotationTriggerState(
  state: Record<string, unknown>,
): Record<string, unknown> {
  return withFlotationComboTriggerKind(state, 'module-menu');
}

export function buildModuleMenuTitleFlotationPresetItems(): ReturnType<typeof buildFlotationPresetItems> {
  const menuState = resolveModuleMenuTitleFlotationMenuState();
  return buildFlotationPresetItems(parseFlotationItemCount(menuState), menuState);
}

/** EgModuleMenu #title 槽：嵌套 EgFlotation Combo（模块菜单 trigger + 本页 Menu/Box 数据）。 */
export function buildModuleMenuTitleTriggerSnippet(
  state: Record<string, unknown>,
  indent = '',
): string {
  return buildFlotationComboNestedSnippet(
    resolveModuleMenuTitleFlotationTriggerState(state),
    resolveModuleMenuTitleFlotationMenuState(),
    {
      indent,
      wrapTemplate: 'title',
      closeOnScroll: true,
      itemsExpression: 'titleMenuItems',
    },
  );
}

export function buildModuleMenuBusinessUsageSnippet(state: Record<string, unknown>): string {
  if (moduleMenuBusinessTitleUsesFlotationTrigger(state)) {
    return buildModuleMenuFlotationTitleBusinessUsageSnippet(state);
  }

  const scenario = String(state.scenario ?? 'module-menu') as ModuleMenuScenario;
  const menuTitle = resolveModuleMenuBusinessTitle(state);
  const groups = resolveModuleMenuBusinessGroups(scenario, menuTitle);
  const groupSnippets = groups.map(buildModuleMenuGroupSnippet).join('\n');

  return [`<EgModuleMenu title="${escapeAttr(menuTitle)}">`, groupSnippets, '</EgModuleMenu>']
    .filter((line) => line !== '')
    .join('\n');
}
