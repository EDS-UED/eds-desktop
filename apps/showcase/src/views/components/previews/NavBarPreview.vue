<script setup lang="ts">
import { computed, watch } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import { EgCregisNavBar, EgNavBar } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import NavBarPreviewNest from './NavBarPreviewNest.vue';
import {
  buildCregisNavBarCustomizeDefaults,
  buildNavBarDeclarativePropsFromCustomize,
  healNavBarCustomizeState,
} from './navBarPreviewCustomize';
import {
  ORGANISM_IMPORT,
  cregisNavBarPropRows,
  navBarAppEntryLabelCustomizeControls,
  navBarCustomizeControls,
  navBarCustomizeDefaults,
  navBarModuleLabelCustomizeControls,
  navBarPropRows,
  navBarSlotRows,
  type NavBarScenario,
} from './organismTemplateDocData';

const props = withDefaults(
  defineProps<{
    initialScenario?: NavBarScenario;
    pageTitle?: string;
  }>(),
  {},
);

const lockedScenario = computed(() => props.initialScenario);

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const moduleNamePanelTitle = showcaseText('Module name', '模块名称');
const appEntryNamePanelTitle = showcaseText('App entry name', '应用入口名称');

const resolvedModuleNamePanelTitle = computed(() => {
  void locale.value;
  return display(moduleNamePanelTitle);
});

const resolvedAppEntryNamePanelTitle = computed(() => {
  void locale.value;
  return display(appEntryNamePanelTitle);
});

const customizeDefaults = computed(() =>
  lockedScenario.value === 'cregis'
    ? buildCregisNavBarCustomizeDefaults()
    : navBarCustomizeDefaults,
);

const customize = createDocCustomizeState<typeof navBarCustomizeDefaults>(
  customizeDefaults.value,
  props.initialScenario ? { scenario: props.initialScenario } : undefined,
);
healNavBarCustomizeState(customize, customizeDefaults.value as Record<string, unknown>);

watch(
  () => customize.appEntryCount,
  () => healNavBarCustomizeState(customize, customizeDefaults.value as Record<string, unknown>),
);

const isNavBarScenario = computed(
  () => (lockedScenario.value ?? customize.scenario) === 'nav-bar',
);

const docAnchorId = computed(() =>
  lockedScenario.value === 'cregis' ? 'nav-bar-scene-cregis' : 'nav-bar',
);

const docTitle = computed(() => props.pageTitle ?? 'NavBar');

const docComponentTag = computed(() =>
  lockedScenario.value === 'cregis' ? 'EgCregisNavBar' : 'EgNavBar',
);

const docImportCode = computed(() =>
  lockedScenario.value === 'cregis'
    ? `import { EgCregisNavBar } from '@eds/desktop-components';`
    : ORGANISM_IMPORT,
);

const docPropRows = computed(() => (isNavBarScenario.value ? navBarPropRows : cregisNavBarPropRows));

const docSlotRows = computed(() => (isNavBarScenario.value ? navBarSlotRows : []));

const isNavBarWide = computed(() => customize.navBarWidth === '210');

const navBarDeclarativePreviewProps = computed(() =>
  buildNavBarDeclarativePropsFromCustomize(customize, { wide: isNavBarWide.value }),
);

const docUsageSnippet = computed(() => {
  const defaults = customizeDefaults.value as Record<string, unknown>;
  const declarativeDefaults = buildNavBarDeclarativePropsFromCustomize(defaults, { wide: false });

  if (!isNavBarScenario.value) {
    return buildVueSelfClosingSnippet('EgCregisNavBar', navBarDeclarativePreviewProps.value, {
      defaults: declarativeDefaults,
      omitKeys: ['scenario', 'navBarWidth'],
    });
  }

  return buildVueSelfClosingSnippet(
    'EgNavBar',
    {
      ...customize,
      wide: isNavBarWide.value,
    },
    {
      defaults: { ...navBarCustomizeDefaults, wide: false },
      omitKeys: ['scenario', 'navBarWidth'],
    },
  );
});

function resetNavBarCustomize() {
  const defaults = customizeDefaults.value as Record<string, unknown>;
  Object.keys(customize).forEach((key) => {
    delete customize[key];
  });
  Object.assign(customize, defaults);
  healNavBarCustomizeState(customize, defaults);
}
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
      :customize-controls="navBarCustomizeControls"
      :customize-defaults="customizeDefaults"
      :usage-snippet-override="docUsageSnippet"
      :prop-rows="docPropRows"
      :slot-rows="docSlotRows"
          props-section-id="nav-bar-props"
          @reset-preview="resetNavBarCustomize"
        >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            organismStyles.previewOrganismNavHost,
          ]"
        >
          <NavBarPreviewNest v-if="isNavBarScenario" :customize="customize" />
          <EgCregisNavBar v-else v-bind="navBarDeclarativePreviewProps" />
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            :title="resolvedModuleNamePanelTitle"
            nested
            embedded
            sequential
            :controls="navBarModuleLabelCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            :title="resolvedAppEntryNamePanelTitle"
            nested
            embedded
            sequential
            :controls="navBarAppEntryLabelCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
