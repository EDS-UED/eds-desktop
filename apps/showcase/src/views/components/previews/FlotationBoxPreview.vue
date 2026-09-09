<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import {
  EgAddressDropdownMenu,
  EgAddressHoverMenu,
  EgCascadeMenu,
  EgFlotationMenu,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationBoxKindPanelControls,
  buildFlotationBoxUsageSnippet,
  enforceFlotationSingleSelection,
  flotationBoxImportCode,
  flotationBoxDocPropRows,
  flotationBoxDocSlotRows,
  flotationBoxPageCustomizeDefaults,
  isFlotationBoxSceneAddressKind,
  isFlotationBoxEditingRow,
  parseFlotationEditBoxIndex,
  parseFlotationItemCount,
  parseFlotationBoxSelectionMode,
  flotationBoxItemKey,
  flotationDefaultCryptoAsset,
  resolveFlotationBoxSceneComponentTag,
  resolveFlotationBoxSceneImportCode,
  type FlotationBoxKind,
} from './flotationDocCustomize';
import { applyFlotationBoxSceneAddressPreset } from './flotationBoxSceneAddressCustomize';
import FlotationBoxSceneAddressPreview from './FlotationBoxSceneAddressPreview.vue';
import FlotationBoxStandardPreview from './FlotationBoxStandardPreview.vue';
import { useFlotationBoxMenuShellProps } from './flotationBoxPreviewShell';
import './FlotationBoxSceneAddressPreview.module.css';
import {
  buildFlotationBoxSceneAddressPanelControls,
  enforceSceneAddressSingleSelection,
  parseSceneAddressSelectionMode,
  sceneAddressItemKey,
  sceneAddressStateKey,
} from './flotationBoxSceneAddressCustomize';

const props = defineProps<{
  initialBoxKind?: FlotationBoxKind;
  pageTitle?: string;
}>();

const customize = createDocCustomizeState<typeof flotationBoxPageCustomizeDefaults>(
  flotationBoxPageCustomizeDefaults,
  props.initialBoxKind ? { boxKind: props.initialBoxKind } : undefined,
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
  (value) => {
    if (value == null) return;
    enforceFlotationSingleSelection(customize);
  },
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
  (value) => {
    if (value == null) return;
    enforceSceneAddressSingleSelection(customize);
  },
);

const usageSnippet = computed(() => buildFlotationBoxUsageSnippet(customize));

const isSceneAddressKind = computed(() => isFlotationBoxSceneAddressKind(customize));

const isSceneAddressDropdown = computed(
  () => customize.boxKind === 'scene-address-dropdown',
);

const boxPanelControls = computed(() =>
  isSceneAddressKind.value
    ? buildFlotationBoxSceneAddressPanelControls(customize)
    : buildFlotationBoxKindPanelControls(customize),
);

const menuShell = useFlotationBoxMenuShellProps(customize);

const pageTitle = computed(() => props.pageTitle ?? 'Box');

const docComponentTag = computed(() =>
  resolveFlotationBoxSceneComponentTag(customize.boxKind as FlotationBoxKind),
);
const docImportCode = computed(() =>
  resolveFlotationBoxSceneImportCode(customize.boxKind as FlotationBoxKind),
);

const previewMenuComponent = computed(() => {
  switch (customize.boxKind) {
    case 'standard-cascade-menu':
      return EgCascadeMenu;
    case 'scene-address-dropdown':
      return EgAddressDropdownMenu;
    case 'scene-address-hover':
      return EgAddressHoverMenu;
    default:
      return EgFlotationMenu;
  }
});

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
      anchor-id="flotation-box"
      :title="pageTitle"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="boxPanelControls"
      :customize-sequential="true"
      :customize-row-columns="5"
      :customize-defaults="{ ...flotationBoxPageCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationBoxDocPropRows"
      :slot-rows="flotationBoxDocSlotRows"
      props-section-id="flotation-box-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.subPreviewWidth, docStyles.previewEffectPanelHost]"
        >
          <component
            :is="previewMenuComponent"
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
          </component>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
