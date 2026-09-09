<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationTrigger,
  type FlotationWidthMode,
  type TooltipAlign,
  type TooltipHeightMode,
  type TooltipPlacement,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationComboBoxPanelControls,
  buildFlotationComboTriggerPanelControls,
  buildFlotationMenuPanelControls,
  buildFlotationUsageSnippet,
  enforceFlotationSingleSelection,
  flotationCustomizeDefaults,
  flotationImportCode,
  flotationPropRows,
  flotationSlotRows,
  flotationTriggerModuleMenuDefaults,
  isFlotationBoxSceneAddressKind,
  isFlotationBoxEditingRow,
  isFlotationTriggerModuleMenuKind,
  parseFlotationCrossAxisOffset,
  parseFlotationOffset,
  parseFlotationEditBoxIndex,
  parseFlotationItemCount,
  parseFlotationMaxHeight,
  parseFlotationBoxSelectionMode,
  flotationBoxItemKey,
  flotationDefaultCryptoAsset,
  resolveFlotationComboTriggerProps,
} from './flotationDocCustomize';
import { applyFlotationBoxSceneAddressPreset } from './flotationBoxSceneAddressCustomize';
import FlotationBoxSceneAddressPreview from './FlotationBoxSceneAddressPreview.vue';
import FlotationBoxStandardPreview from './FlotationBoxStandardPreview.vue';
import { useFlotationBoxMenuShellProps } from './flotationBoxPreviewShell';
import './FlotationBoxSceneAddressPreview.module.css';
import {
  enforceSceneAddressSingleSelection,
  parseSceneAddressSelectionMode,
  sceneAddressItemKey,
  sceneAddressStateKey,
} from './flotationBoxSceneAddressCustomize';

const customize = createDocCustomizeState<typeof flotationCustomizeDefaults>(
  flotationCustomizeDefaults,
);

watch(
  () => customize.triggerKind,
  (kind, prev) => {
    if (kind === 'module-menu') {
      customize.triggerLabel = String(flotationTriggerModuleMenuDefaults.label);
      customize.showReddot = Boolean(flotationTriggerModuleMenuDefaults.showReddot);
      customize.triggerStyle = 'text';
      customize.widthMode = 'trigger';
      return;
    }
    if (prev === 'module-menu') {
      customize.triggerLabel = String(flotationCustomizeDefaults.triggerLabel);
      customize.showReddot = Boolean(flotationCustomizeDefaults.showReddot);
      customize.triggerStyle = flotationCustomizeDefaults.triggerStyle;
      customize.widthMode = flotationCustomizeDefaults.widthMode;
    }
  },
);

watch(
  () => customize.itemCount,
  () => {
    if (isFlotationBoxSceneAddressKind(customize)) return;
    if (!isFlotationBoxEditingRow(customize)) return;
    customize.editBoxIndex = String(parseFlotationEditBoxIndex(customize));
  },
);

watch(
  () => customize[sceneAddressStateKey.itemCount],
  () => {
    if (!isFlotationBoxSceneAddressKind(customize)) return;
    if (!isFlotationBoxEditingRow({ editBoxIndex: customize[sceneAddressStateKey.editBoxIndex] })) {
      return;
    }
    customize[sceneAddressStateKey.editBoxIndex] = String(
      parseFlotationEditBoxIndex({
        editBoxIndex: customize[sceneAddressStateKey.editBoxIndex],
        itemCount: String(customize[sceneAddressStateKey.itemCount]),
      }),
    );
  },
);

watch(
  () => customize.boxItemType,
  (type) => {
    if (type !== 'image-text') return;
    if (isFlotationBoxSceneAddressKind(customize)) return;
    const count = parseFlotationItemCount(customize);
    for (let n = 1; n <= count; n += 1) {
      customize[flotationBoxItemKey('SymbolIcon', n)] = flotationDefaultCryptoAsset;
    }
  },
);

watch(
  () => customize.boxKind,
  (kind, prevKind) => {
    if (kind === 'standard-cascade-menu' && isFlotationBoxEditingRow(customize)) {
      const editIndex = parseFlotationEditBoxIndex(customize);
      customize[flotationBoxItemKey('ShowCascader', editIndex)] = true;
      return;
    }
    const enteringScene =
      isFlotationBoxSceneAddressKind({ boxKind: kind }) &&
      !isFlotationBoxSceneAddressKind({ boxKind: prevKind });
    if (enteringScene) {
      applyFlotationBoxSceneAddressPreset(customize);
    }
  },
);

watch(
  () => {
    if (isFlotationBoxSceneAddressKind(customize)) return null;
    const count = parseFlotationItemCount(customize);
    const keys = Array.from({ length: count }, (_, index) =>
      Boolean(customize[flotationBoxItemKey('Checked', index + 1)]),
    );
    return [parseFlotationBoxSelectionMode(customize), ...keys] as const;
  },
  () => enforceFlotationSingleSelection(customize),
);

watch(
  () => {
    if (customize.boxKind !== 'scene-address-dropdown') return null;
    const count = parseFlotationItemCount({
      itemCount: customize[sceneAddressStateKey.itemCount],
    });
    const keys = Array.from({ length: count }, (_, index) =>
      Boolean(customize[sceneAddressItemKey('Checked', index + 1)]),
    );
    return [parseSceneAddressSelectionMode(customize), ...keys] as const;
  },
  () => enforceSceneAddressSingleSelection(customize),
);

const usageSnippet = computed(() => buildFlotationUsageSnippet(customize));

const menuPanelControls = computed(() => buildFlotationMenuPanelControls(customize));

const boxPanelControls = computed(() => buildFlotationComboBoxPanelControls(customize));

const menuShell = useFlotationBoxMenuShellProps(customize);

const panelWidth = computed(() => {
  if (customize.widthMode !== 'fixed') return undefined;
  return Number.parseInt(String(customize.width), 10) || 280;
});

const panelHeight = computed(() => {
  if (customize.heightMode !== 'fixed') return undefined;
  return Number.parseInt(String(customize.height), 10) || 306;
});

const panelMaxHeight = computed(() => {
  if (customize.heightMode !== 'adaptive') return undefined;
  return parseFlotationMaxHeight(customize);
});

const panelCrossAxisOffset = computed(() => parseFlotationCrossAxisOffset(customize));

const panelOffset = computed(() => parseFlotationOffset(customize));

const isModuleMenuKind = computed(() => isFlotationTriggerModuleMenuKind(customize));

const isSceneAddressKind = computed(() => isFlotationBoxSceneAddressKind(customize));

const isSceneAddressDropdown = computed(
  () => customize.boxKind === 'scene-address-dropdown',
);

const flotationTriggerPanelControls = computed(() =>
  buildFlotationComboTriggerPanelControls(customize),
);

const previewHostClass = computed(() =>
  isModuleMenuKind.value ? undefined : docStyles.subPreviewWidth,
);

onMounted(() => {
  if (
    customize.boxKind === 'standard-cascade-menu' &&
    isFlotationBoxEditingRow(customize)
  ) {
    const editIndex = parseFlotationEditBoxIndex(customize);
    customize[flotationBoxItemKey('ShowCascader', editIndex)] = true;
  }
  if (isFlotationBoxSceneAddressKind(customize)) {
    applyFlotationBoxSceneAddressPreset(customize);
  }
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation"
      title="Combo"
      doc-tier="molecule"
      :show-doc-title="false"
      component-tag="EgFlotation"
      :import-code="flotationImportCode"
      :customize-controls="menuPanelControls"
      :customize-sequential="true"
      :customize-defaults="{ ...flotationCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationPropRows"
      :slot-rows="flotationSlotRows"
      props-section-id="flotation-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[previewHostClass, docStyles.previewEffectPanelHost]"
        >
          <EgFlotation
            :placement="customize.placement as TooltipPlacement"
            :offset="panelOffset"
            :cross-axis-offset="panelCrossAxisOffset"
            :disabled="Boolean(customize.disabled)"
            :width-mode="customize.widthMode as FlotationWidthMode"
            :width="panelWidth"
            :align="customize.align as TooltipAlign"
            :height-mode="customize.heightMode as TooltipHeightMode"
            :height="panelHeight"
            :max-height="panelMaxHeight"
          >
            <template #trigger="{ expanded, selectedItem, hasAnyItemReddot }">
              <EgFlotationTrigger
                v-bind="resolveFlotationComboTriggerProps(customize, { expanded, selectedItem, hasAnyItemReddot })"
              />
            </template>
            <template #content>
              <EgFlotationMenu
                :class="menuShell.menuClass"
                :width-mode="menuShell.widthMode"
                :width="menuShell.width"
                :max-width="menuShell.maxWidth"
                height-mode="adaptive"
                :max-height="menuShell.maxHeight"
                :show-add="menuShell.showAdd"
                :list-scroll="menuShell.listScroll"
                :add-label="String(customize.addLabel)"
              >
                <FlotationBoxSceneAddressPreview
                  v-if="isSceneAddressKind"
                  v-model:customize="customize"
                  :show-filter-tabs="isSceneAddressDropdown"
                />
                <FlotationBoxStandardPreview v-else v-model:customize="customize" />
              </EgFlotationMenu>
            </template>
          </EgFlotation>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            title="EgFlotationTrigger"
            nested
            embedded
            sequential
            :row-columns="4"
            :controls="flotationTriggerPanelControls"
          />
          <CustomizePanel
            v-model="customize"
            title="EgFlotationMenu"
            nested
            embedded
            sequential
            :row-columns="5"
            :controls="boxPanelControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
