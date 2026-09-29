import type { VerifyType } from '@eds/desktop-components';
import { showcaseText } from '@/data/showcasePropLabels';
import { defineComponent, h, type Component } from 'vue';
import type { ComponentPreviewEntry } from './componentPreviewTypes';
import FlotationBoxPreview from './FlotationBoxPreview.vue';
import FlotationTriggerPreview from './FlotationTriggerPreview.vue';
import ModuleMenuPreview from './ModuleMenuPreview.vue';
import NavBarPreview from './NavBarPreview.vue';
import PopupPreview from './PopupPreview.vue';
import PopoversScenePreview from './PopoversScenePreview.vue';
import VerifyPreview from './VerifyPreview.vue';
import type { FlotationBoxKind } from './flotationDocCustomize';
import type { ModuleMenuScenario, NavBarScenario, PopupSceneUses } from './organismTemplateDocData';
import type { PopoverSceneScenario } from './popoversDocCustomize';

function defineScenePreview(
  name: string,
  component: Component,
  props: Record<string, unknown>,
): Component {
  return defineComponent({
    name,
    setup() {
      return () => h(component, props);
    },
  });
}

const popoverScenePages: Array<{
  slug: string;
  title: string;
  scenario: PopoverSceneScenario;
}> = [
  { slug: 'popovers-scene-guidance', title: 'Guidance', scenario: 'guidance' },
  { slug: 'popovers-scene-remark', title: 'Remark', scenario: 'remark' },
  { slug: 'popovers-scene-gas-fee', title: 'GasFee', scenario: 'gas-fee' },
  { slug: 'popovers-scene-confirm', title: 'Confirm', scenario: 'confirm' },
];

const verifyTypePages: Array<{ slug: string; title: string; verifyType: VerifyType }> = [
  { slug: 'verify-scene-email', title: 'Email', verifyType: 'single-email' },
  { slug: 'verify-scene-google', title: 'Google', verifyType: 'single-google' },
  { slug: 'verify-scene-login-password', title: 'LoginPassword', verifyType: 'single-login-password' },
  {
    slug: 'verify-scene-transaction-password',
    title: 'TransactionPassword',
    verifyType: 'single-trade-password',
  },
  { slug: 'verify-scene-passkey', title: 'PassKey', verifyType: 'single-passkey' },
  { slug: 'verify-scene-locked', title: 'Locked', verifyType: 'locked' },
];

const flotationBoxScenePages: Array<{
  slug: string;
  title: string;
  boxKind: FlotationBoxKind;
}> = [
  {
    slug: 'flotation-box-scene-cascade-menu',
    title: 'CascadeMenu',
    boxKind: 'standard-cascade-menu',
  },
  {
    slug: 'flotation-box-scene-address-dropdown',
    title: 'DropDownAddress',
    boxKind: 'scene-address-dropdown',
  },
  {
    slug: 'flotation-box-scene-address-hover',
    title: 'AddressHover',
    boxKind: 'scene-address-hover',
  },
];

const popupScenePages: Array<{
  slug: string;
  title: string;
  lockedUses: PopupSceneUses;
}> = [
  { slug: 'popup-scene-detail', title: showcaseText('Detail', '详情'), lockedUses: 'detail' },
  { slug: 'popup-scene-dialog', title: showcaseText('Reminder', '提醒'), lockedUses: 'dialog' },
  { slug: 'popup-scene-verify', title: showcaseText('Security', '安全'), lockedUses: 'verify' },
];

export const splitScenePreviewEntries: ComponentPreviewEntry[] = [
  {
    slug: 'nav-bar-scene-cregis',
    title: 'Cregis',
    component: defineScenePreview('NavBarCregisPreview', NavBarPreview, {
      initialScenario: 'cregis' satisfies NavBarScenario,
      pageTitle: 'Cregis',
    }),
    usesComponentDocHeader: true,
  },
  {
    slug: 'module-menu-scene-cregis',
    title: 'Cregis',
    component: defineScenePreview('ModuleMenuCregisPreview', ModuleMenuPreview, {
      initialScenario: 'cregis' satisfies Exclude<ModuleMenuScenario, 'module-menu'>,
      pageTitle: 'Cregis',
    }),
    usesComponentDocHeader: true,
  },
  {
    slug: 'module-menu-scene-udun',
    title: 'UDun',
    component: defineScenePreview('ModuleMenuUdunPreview', ModuleMenuPreview, {
      initialScenario: 'udun' satisfies Exclude<ModuleMenuScenario, 'module-menu'>,
      pageTitle: 'UDun',
    }),
    usesComponentDocHeader: true,
  },
  ...popupScenePages.map(({ slug, title, lockedUses }) => ({
    slug,
    title,
    component: defineScenePreview(`PopupScenePreview_${slug}`, PopupPreview, {
      lockedUses,
      pageTitle: title,
    }),
    usesComponentDocHeader: true,
  })),
  ...popoverScenePages.map(({ slug, title, scenario }) => ({
    slug,
    title,
    component: defineScenePreview(`PopoverScenePreview_${slug}`, PopoversScenePreview, {
      initialScenario: scenario,
      pageTitle: title,
    }),
    usesComponentDocHeader: true,
  })),
  ...verifyTypePages.map(({ slug, title, verifyType }) => ({
    slug,
    title,
    component: defineScenePreview(`VerifyTypePreview_${slug}`, VerifyPreview, {
      initialVerifyType: verifyType,
      pageTitle: title,
      lockVerifyType: true,
    }),
    usesComponentDocHeader: true,
  })),
  {
    slug: 'flotation-trigger-scene-module-menu',
    title: 'ModuleMenu',
    component: defineScenePreview(
      'FlotationTriggerModuleMenuPreview',
      FlotationTriggerPreview,
      {
        initialTriggerKind: 'module-menu',
        pageTitle: 'ModuleMenu',
      },
    ),
    usesComponentDocHeader: true,
  },
  ...flotationBoxScenePages.map(({ slug, title, boxKind }) => ({
    slug,
    title,
    component: defineScenePreview(`FlotationBoxScenePreview_${slug}`, FlotationBoxPreview, {
      initialBoxKind: boxKind,
      pageTitle: title,
    }),
    usesComponentDocHeader: true,
  })),
];
