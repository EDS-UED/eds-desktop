<script setup lang="ts">
import { computed } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import {
  EgAvatar,
  EgCregisModuleMenu,
  EgFlotation,
  EgFlotationTrigger,
  EgIcon,
  EgModuleMenu,
  EgModuleMenuGroup,
  EgModuleMenuItem,
  EgUdunModuleMenu,
  getProcessedIcon,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';
import {
  buildFlotationPresetItems,
  flotationTriggerModuleMenuDefaults,
  parseFlotationItemCount,
  resolveFlotationComboEgFlotationProps,
  resolveFlotationComboTriggerProps,
  withFlotationComboTriggerKind,
} from './flotationDocCustomize';
import {
  ORGANISM_IMPORT,
  MODULE_MENU_MAX_GROUPS,
  MODULE_MENU_MAX_SUB_ITEMS,
  cregisModuleMenuPropRows,
  udunModuleMenuPropRows,
  buildModuleMenuBusinessTitleCustomizeControls,
  isModuleMenuEdsScenario,
  moduleMenuCustomizeControls,
  moduleMenuCustomizeDefaults,
  moduleMenuGroupCustomizeControlsList,
  moduleMenuGroupItemCountKey,
  moduleMenuGroupItemHasSubKey,
  moduleMenuGroupItemIconKey,
  moduleMenuGroupItemAccessoryKey,
  moduleMenuGroupItemMessageTextKey,
  moduleMenuGroupItemMessageTypeKey,
  moduleMenuGroupItemMessageFocusBackgroundKey,
  moduleMenuGroupItemLabelKey,
  moduleMenuGroupItemSubCountKey,
  moduleMenuGroupItemSubIconKey,
  moduleMenuGroupItemSubLabelKey,
  moduleMenuGroupSortKey,
  moduleMenuGroupTitleKey,
  moduleMenuPropRows,
  moduleMenuGroupPropRows,
  moduleMenuItemPropRows,
  moduleMenuTitleCustomizeControls,
  isModuleMenuTitlePresetKind,
  type ModuleMenuScenario,
} from './organismTemplateDocData';
import type { ModuleMenuBusinessScenario } from '@/presets/module-menu/businessModuleTitles';
import type {
  CregisModuleMenuBusinessTitle,
  UdunModuleMenuBusinessTitle,
} from '@/presets/module-menu/businessModuleTitles';
import {
  createCregisModuleMenuShowcaseTranslate,
  translateCregisModuleMenuPresetGroups,
} from '@/presets/module-menu/cregisModuleMenuShowcaseTranslate';
import {
  buildModuleMenuBusinessUsageSnippet,
  resolveModuleMenuSceneComponentTag,
  resolveModuleMenuSceneImportCode,
  buildModuleMenuComponentUsageSnippet,
  buildCregisModuleMenuCustomizeDefaults,
  buildUdunModuleMenuCustomizeDefaults,
  isModuleMenuBusinessScenario,
  moduleMenuBusinessTitleUsesFlotationTrigger,
  resolveModuleMenuBusinessGroups,
  resolveModuleMenuBusinessTitle,
  resolveModuleMenuBusinessFlotationTitle,
  resolveModuleMenuTitleFlotationMenuState,
  resolveModuleMenuTitleFlotationTriggerState,
} from './moduleMenuPreviewCustomize';
import { resolveModuleMenuPreviewTitle } from './moduleMenuPreviewGroups';

const props = withDefaults(
  defineProps<{
    initialScenario?: Exclude<ModuleMenuScenario, 'module-menu'>;
    pageTitle?: string;
  }>(),
  {},
);

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const moduleTitlePanelTitle = showcaseText('Module title', '模块标题');
const groupPanelTitlePrefix = showcaseText('Group ', '组');

const resolvedModuleTitlePanelTitle = computed(() => {
  void locale.value;
  return display(moduleTitlePanelTitle);
});

function resolveGroupPanelTitle(groupIndex: number): string {
  void locale.value;
  return `${display(groupPanelTitlePrefix)}${groupIndex}`;
}

const lockedScenario = computed(() => props.initialScenario);

const customizeDefaults = computed(() => {
  if (lockedScenario.value === 'cregis') return buildCregisModuleMenuCustomizeDefaults();
  if (lockedScenario.value === 'udun') return buildUdunModuleMenuCustomizeDefaults();
  return moduleMenuCustomizeDefaults;
});

const customize = createDocCustomizeState<typeof moduleMenuCustomizeDefaults>(
  customizeDefaults.value,
  props.initialScenario ? { scenario: props.initialScenario } : undefined,
);

function resetModuleMenuCustomize() {
  const defaults = customizeDefaults.value as Record<string, unknown>;
  Object.keys(customize).forEach((key) => {
    delete customize[key];
  });
  Object.assign(customize, defaults);
}

const businessModuleTitle = computed(() => resolveModuleMenuBusinessTitle(customize));

const moduleMenuTitleFlotationMenuState = resolveModuleMenuTitleFlotationMenuState();

const moduleMenuTitleMenuItems = computed(() =>
  buildFlotationPresetItems(
    parseFlotationItemCount(moduleMenuTitleFlotationMenuState),
    moduleMenuTitleFlotationMenuState,
  ),
);

const moduleMenuTitleEgFlotationProps = computed(() =>
  resolveFlotationComboEgFlotationProps(moduleMenuTitleFlotationMenuState, {
    closeOnScroll: true,
    placement: 'bottom',
    align: 'start',
  }),
);

const isEdsScenario = computed(() =>
  lockedScenario.value ? false : isModuleMenuEdsScenario(customize),
);

const isBusinessScenario = computed(() =>
  lockedScenario.value
    ? isModuleMenuBusinessScenario(lockedScenario.value)
    : isModuleMenuBusinessScenario(customize.scenario),
);

const businessScenario = computed((): ModuleMenuBusinessScenario =>
  String(lockedScenario.value ?? customize.scenario) === 'udun' ? 'udun' : 'cregis',
);

const docAnchorId = computed(() => {
  if (lockedScenario.value === 'cregis') return 'module-menu-scene-cregis';
  if (lockedScenario.value === 'udun') return 'module-menu-scene-udun';
  return 'module-menu';
});

const docTitle = computed(() => props.pageTitle ?? 'ModuleMenu');

const businessModuleUsesFlotationTitle = computed(() => {
  if (!isBusinessScenario.value) return false;
  if (!moduleMenuBusinessTitleUsesFlotationTrigger(customize)) return false;
  return true;
});

const moduleMenuTitleFlotationTriggerState = computed(() => {
  if (businessModuleUsesFlotationTitle.value) {
    return withFlotationComboTriggerKind(
      {
        triggerLabel: resolveModuleMenuBusinessFlotationTitle(customize),
      },
      'module-menu',
    );
  }
  return resolveModuleMenuTitleFlotationTriggerState(customize);
});

const moduleMenuTitleUsesTrigger = computed(() => {
  if (businessModuleUsesFlotationTitle.value) return true;
  if (isBusinessScenario.value) {
    return false;
  }
  return isModuleMenuTitlePresetKind(customize);
});

const moduleMenuBusinessTitleControls = computed(() =>
  buildModuleMenuBusinessTitleCustomizeControls(businessScenario.value),
);

const docPropRows = computed(() => {
  if (isEdsScenario.value) return moduleMenuPropRows;
  return businessScenario.value === 'udun' ? udunModuleMenuPropRows : cregisModuleMenuPropRows;
});

const moduleMenuSlotRows = [...moduleMenuGroupPropRows, ...moduleMenuItemPropRows];

const docUsageSnippet = computed(() => {
  void customize.scenario;
  void customize.moduleBusinessTitle;
  void customize.paymentEngineMenuVariant;
  void customize.waasMenuVariant;

  if (isModuleMenuBusinessScenario(String(customize.scenario ?? 'module-menu'))) {
    return buildModuleMenuBusinessUsageSnippet(customize);
  }
  return buildModuleMenuComponentUsageSnippet(customize);
});

const groupCountNum = computed(() => {
  const parsed = Number(customize.groupCount);
  if (!Number.isFinite(parsed)) return 2;
  return Math.min(MODULE_MENU_MAX_GROUPS, Math.max(1, Math.floor(parsed)));
});

const moduleMenuTitle = computed(() => {
  if (isModuleMenuBusinessScenario(customize.scenario)) {
    if (businessModuleUsesFlotationTitle.value) {
      return resolveModuleMenuBusinessFlotationTitle(customize);
    }
    return resolveModuleMenuBusinessTitle(customize);
  }
  return resolveModuleMenuPreviewTitle(customize);
});

const moduleTitleRowColumns = computed(() =>
  isModuleMenuTitlePresetKind(customize) ? 4 : 2,
);

const moduleTitleNestedVariant = computed(() =>
  moduleMenuTitleUsesTrigger.value ? 'referenced-component' : 'simple-title',
);

const docImportCode = computed(() => {
  if (lockedScenario.value) {
    return resolveModuleMenuSceneImportCode(lockedScenario.value);
  }
  if (!moduleMenuTitleUsesTrigger.value) return ORGANISM_IMPORT;
  return ORGANISM_IMPORT.replace(
    'EgModuleMenu,',
    'EgFlotation,\n  EgFlotationTrigger,\n  EgModuleMenu,',
  );
});

const docComponentTag = computed(() => {
  const scenario = (lockedScenario.value ??
    customize.scenario) as ModuleMenuScenario;
  return resolveModuleMenuSceneComponentTag(scenario);
});

const businessGroups = computed(() =>
  resolveModuleMenuBusinessGroups(
    String(customize.scenario) as ModuleMenuScenario,
    businessModuleTitle.value,
    customize,
  ),
);

const cregisModuleMenuTranslate = computed(() =>
  createCregisModuleMenuShowcaseTranslate(locale.value),
);

const displayBusinessGroups = computed(() =>
  translateCregisModuleMenuPresetGroups(businessGroups.value, locale.value),
);

function parseGroupSort(value: unknown, fallbackIndex: number): number {
  const parsed = Number.parseFloat(String(value ?? '').trim());
  if (Number.isFinite(parsed)) return parsed;
  return fallbackIndex + 1;
}

function groupTitleAt(index: number): string | undefined {
  const raw = String(customize[moduleMenuGroupTitleKey(index)] ?? '').trim();
  return raw === '' ? undefined : raw;
}

function groupItemCountAt(index: number): number {
  const parsed = Number(customize[moduleMenuGroupItemCountKey(index)]);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, Math.floor(parsed)));
}

function labelAt(key: string, fallback = 'Label'): string {
  const value = String(customize[key] ?? '').trim();
  return value === '' ? fallback : value;
}

function groupItemHasSubAt(groupIndex: number, itemIndex: number): boolean {
  return String(customize[moduleMenuGroupItemHasSubKey(groupIndex, itemIndex)] ?? 'no') === 'yes';
}

function groupItemTierAt(groupIndex: number, itemIndex: number): 1 | 2 {
  return groupItemHasSubAt(groupIndex, itemIndex) ? 2 : 1;
}

function iconAt(groupIndex: number, itemIndex: number): string {
  const key = moduleMenuGroupItemIconKey(groupIndex, itemIndex);
  const name = String(customize[key] ?? '').trim();
  if (name && getProcessedIcon(name)) return name;
  return showcaseDefaultIconName;
}

function subIconAt(groupIndex: number, itemIndex: number, subIndex: number): string {
  const key = moduleMenuGroupItemSubIconKey(groupIndex, itemIndex, subIndex);
  const name = String(customize[key] ?? '').trim();
  if (name && getProcessedIcon(name)) return name;
  return showcaseDefaultIconName;
}

function groupItemSubCountAt(groupIndex: number, itemIndex: number): number {
  const parsed = Number(customize[moduleMenuGroupItemSubCountKey(groupIndex, itemIndex)]);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(MODULE_MENU_MAX_SUB_ITEMS, Math.max(1, Math.floor(parsed)));
}

type PreviewSubItem = {
  label: string;
  icon: string;
};

type PreviewItem = {
  tier: 1 | 2;
  label: string;
  icon: string;
  subitems: PreviewSubItem[];
  accessory: 'none' | 'message' | 'reddot';
  messageText: string;
  messageType: 'subtle' | 'brand' | 'danger';
  messageFocusBackground: 'inherit' | 'same-white';
};

type PreviewGroup = {
  index: number;
  key: string;
  title?: string;
  sort: number;
  items: PreviewItem[];
};

const previewGroups = computed((): PreviewGroup[] => {
  const groups = Array.from({ length: groupCountNum.value }, (_, index) => {
    const itemCount = groupItemCountAt(index);
    const items = Array.from({ length: itemCount }, (_, itemOffset) => {
      const itemIndex = itemOffset + 1;
      const tier = groupItemTierAt(index, itemIndex);
      const label = labelAt(moduleMenuGroupItemLabelKey(index, itemIndex));
      const subCount = tier === 2 ? groupItemSubCountAt(index, itemIndex) : 0;
      const subitems =
        tier === 2
          ? Array.from({ length: subCount }, (_, subOffset) => {
              const subIndex = subOffset + 1;
              return {
                label: labelAt(moduleMenuGroupItemSubLabelKey(index, itemIndex, subIndex)),
                icon: subIconAt(index, itemIndex, subIndex),
              };
            })
          : [];

      const accessoryRaw = String(
        customize[moduleMenuGroupItemAccessoryKey(index, itemIndex)] ?? 'none',
      );
      const accessory: PreviewItem['accessory'] =
        accessoryRaw === 'message' || accessoryRaw === 'reddot' ? accessoryRaw : 'none';
      const messageText = String(
        customize[moduleMenuGroupItemMessageTextKey(index, itemIndex)] ?? '0',
      );
      const messageTypeRaw = String(
        customize[moduleMenuGroupItemMessageTypeKey(index, itemIndex)] ?? 'subtle',
      );
      const messageType: PreviewItem['messageType'] =
        messageTypeRaw === 'brand' || messageTypeRaw === 'danger' ? messageTypeRaw : 'subtle';
      const messageFocusBackgroundRaw = String(
        customize[moduleMenuGroupItemMessageFocusBackgroundKey(index, itemIndex)] ?? 'inherit',
      );
      const messageFocusBackground: PreviewItem['messageFocusBackground'] =
        messageFocusBackgroundRaw === 'same-white' ? 'same-white' : 'inherit';

      return {
        tier,
        label,
        icon: iconAt(index, itemIndex),
        subitems,
        accessory,
        messageText,
        messageType,
        messageFocusBackground,
      };
    });

    return {
      index,
      key: `group-${index}`,
      title: groupTitleAt(index),
      sort: parseGroupSort(customize[moduleMenuGroupSortKey(index)], index),
      items,
    };
  });

  return [...groups].sort((left, right) => {
    if (left.sort !== right.sort) return left.sort - right.sort;
    return left.index - right.index;
  });
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :anchor-id="docAnchorId"
      :title="docTitle"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="moduleMenuCustomizeControls"
      :customize-defaults="customizeDefaults"
      :usage-snippet-override="docUsageSnippet"
      :prop-rows="docPropRows"
      :slot-rows="moduleMenuSlotRows"
      props-section-id="module-menu-props"
      @reset-preview="resetModuleMenuCustomize"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            organismStyles.previewOrganismPanelHost,
          ]"
        >
          <EgCregisModuleMenu
            v-if="isBusinessScenario && businessScenario === 'cregis'"
            :key="`${customize.scenario}-${businessModuleTitle}-${customize.waasMenuVariant}`"
            :title="businessModuleTitle as CregisModuleMenuBusinessTitle"
            :groups="businessGroups"
            :translate="cregisModuleMenuTranslate"
            :wide="Boolean(customize.wide)"
            :show-edge-divider="Boolean(customize.showEdgeDivider)"
          />
          <EgUdunModuleMenu
            v-else-if="isBusinessScenario && businessScenario === 'udun'"
            :key="`${customize.scenario}-${businessModuleTitle}`"
            :title="businessModuleTitle as UdunModuleMenuBusinessTitle"
            :groups="businessGroups"
            :wide="Boolean(customize.wide)"
            :show-edge-divider="Boolean(customize.showEdgeDivider)"
          />
          <EgModuleMenu
            v-else
            :key="`${customize.scenario}-${moduleMenuTitle}`"
            :title="moduleMenuTitle"
            :title-mode="moduleMenuTitleUsesTrigger ? 'trigger' : 'text'"
            :wide="Boolean(customize.wide)"
            :show-edge-divider="Boolean(customize.showEdgeDivider)"
          >
            <template v-if="moduleMenuTitleUsesTrigger" #title>
              <EgFlotation
                v-bind="moduleMenuTitleEgFlotationProps"
                :items="moduleMenuTitleMenuItems"
              >
                <template #trigger="{ expanded, selectedItem, hasAnyItemReddot }">
                  <EgFlotationTrigger
                    v-bind="
                      resolveFlotationComboTriggerProps(moduleMenuTitleFlotationTriggerState, {
                        expanded,
                        selectedItem,
                        hasAnyItemReddot,
                      })
                    "
                  />
                </template>
              </EgFlotation>
            </template>
            <EgModuleMenuGroup
              v-for="group in previewGroups"
              :key="group.key"
              :title="group.title"
            >
              <template v-for="(item, itemIndex) in group.items" :key="`${group.key}-item-${itemIndex}`">
                <EgModuleMenuItem
                  :tier="item.tier"
                  :label="item.label"
                  :message="item.accessory === 'message' ? item.messageText : undefined"
                  :message-type="item.messageType"
                  :message-focus-background="item.messageFocusBackground"
                  :show-reddot="item.accessory === 'reddot'"
                >
                  <template #icon>
                    <EgIcon :name="item.icon" size="sm" />
                  </template>
                  <template v-if="item.tier === 2">
                    <EgModuleMenuItem
                      v-for="(subItem, subIndex) in item.subitems"
                      :key="`${group.key}-item-${itemIndex}-sub-${subIndex}`"
                      subitem
                      :label="subItem.label"
                    >
                      <template #icon>
                        <EgIcon :name="subItem.icon" size="sm" />
                      </template>
                    </EgModuleMenuItem>
                  </template>
                </EgModuleMenuItem>
              </template>
            </EgModuleMenuGroup>
          </EgModuleMenu>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-if="isEdsScenario"
            v-model="customize"
            :title="resolvedModuleTitlePanelTitle"
            nested
            embedded
            sequential
            :nested-title-variant="moduleTitleNestedVariant"
            :row-columns="moduleTitleRowColumns"
            :controls="moduleMenuTitleCustomizeControls"
          />
          <CustomizePanel
            v-else-if="isBusinessScenario"
            v-model="customize"
            :title="resolvedModuleTitlePanelTitle"
            nested
            embedded
            sequential
            :nested-title-variant="moduleTitleNestedVariant"
            :controls="moduleMenuBusinessTitleControls"
          />
          <template v-if="isEdsScenario">
            <CustomizePanel
              v-for="groupIndex in groupCountNum"
              :key="`group-panel-${groupIndex}`"
              v-model="customize"
              :title="resolveGroupPanelTitle(groupIndex)"
              nested
              embedded
              sequential
              nested-title-variant="simple-title"
              :controls="moduleMenuGroupCustomizeControlsList[groupIndex - 1]"
            />
          </template>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
