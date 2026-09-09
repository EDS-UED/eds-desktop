import type { ComponentPreviewEntry } from './componentPreviewTypes';
import IconPreview from './IconPreview.vue';
import CryptoPreview from './CryptoPreview.vue';
import FlotationPreview from './FlotationPreview.vue';
import FlotationTriggerPreview from './FlotationTriggerPreview.vue';
import FlotationBoxPreview from './FlotationBoxPreview.vue';
import TooltipPanelKindPreview from './TooltipPanelKindPreview.vue';
import InputInputPreview from './InputInputPreview.vue';
import InputTextareaPreview from './InputTextareaPreview.vue';
import InputSearchPreview from './InputSearchPreview.vue';
import InputVerifyInputPreview from './InputVerifyInputPreview.vue';
import InputComboInputPreview from './InputComboInputPreview.vue';
import InputComboTextareaPreview from './InputComboTextareaPreview.vue';
import ButtonTextPreview from './ButtonTextPreview.vue';
import ButtonIconPreview from './ButtonIconPreview.vue';
import ButtonIconProPreview from './ButtonIconProPreview.vue';
import ButtonLinkPreview from './ButtonLinkPreview.vue';
import ButtonPaginationPreview from './ButtonPaginationPreview.vue';
import ButtonComboPreview from './ButtonComboPreview.vue';
import DividerPreview from './DividerPreview.vue';
import AvatarPreview from './AvatarPreview.vue';
import TagSystemPreview from './TagSystemPreview.vue';
import TagStatusPreview from './TagStatusPreview.vue';
import TagColorfulPreview from './TagColorfulPreview.vue';
import TagCustomPreview from './TagCustomPreview.vue';
import ToggleCheckboxPreview from './ToggleCheckboxPreview.vue';
import ToggleRadioPreview from './ToggleRadioPreview.vue';
import ToggleDecidePreview from './ToggleDecidePreview.vue';
import ToggleSwitchPreview from './ToggleSwitchPreview.vue';
import TabSegmentedPreview from './TabSegmentedPreview.vue';
import TabTabsPreview from './TabTabsPreview.vue';
import FeedbackEndFeedbackCardPreview from './FeedbackEndFeedbackCardPreview.vue';
import FeedbackToastPreview from './FeedbackToastPreview.vue';
import FeedbackMessagePreview from './FeedbackMessagePreview.vue';
import FeedbackReddotPreview from './FeedbackReddotPreview.vue';
import FeedbackFormSubmissionPreview from './FeedbackFormSubmissionPreview.vue';
import FeedbackStreamerPreview from './FeedbackStreamerPreview.vue';
import ProgressPreview from './ProgressPreview.vue';
import NavBarPreview from './NavBarPreview.vue';
import ModuleMenuPreview from './ModuleMenuPreview.vue';
import ToolBarPreview from './ToolBarPreview.vue';
import PaginerPreview from './PaginerPreview.vue';
import DialogStandardPreview from './DialogStandardPreview.vue';
import VerifyPreview from './VerifyPreview.vue';
import DialogSymbolPreview from './DialogSymbolPreview.vue';
import DialogComposePreview from './DialogComposePreview.vue';
import BatchBarPreview from './BatchBarPreview.vue';
import DataListPreview from './DataListPreview.vue';
import DetailPreview from './DetailPreview.vue';
import ContainerPreview from './ContainerPreview.vue';
import LayoutPreview from './LayoutPreview.vue';
import PopupPreview from './PopupPreview.vue';
import PopoversPopoverPreview from './PopoversPopoverPreview.vue';
import SkidPreview from './SkidPreview.vue';
import { splitScenePreviewEntries } from './splitScenePreviewEntries';

export type { ComponentPreviewEntry } from './componentPreviewTypes';

/** Showcase 文档页：预览区高度 280px（见 --showcase-doc-preview-height-compact）。 */
export const compactComponentPreviewSlugs = new Set<string>([
  'input-input',
  'input-textarea',
  'input-search',
  'input-verify-input',
  'input-combo-input',
  'input-combo-textarea',
  'button-text',
  'button-icon',
  'button-icon-pro',
  'button-link',
  'button-pagination',
  'button-combo',
  'tooltip-flotation',
  'tooltip-scene-text-overflow',
  'tooltip-scene-paragraph-overflow',
  'tooltip-scene-multi-address',
  'flotation-trigger',
  'flotation-trigger-scene-module-menu',
  'flotation-container-tooltip',
  'flotation-box-scene-cascade-menu',
  'flotation-box-scene-address-dropdown',
  'flotation-box-scene-address-hover',
  'flotation',
  'tag-system',
  'tag-scene-status',
  'tag-scene-colorful',
  'tag-scene-palette',
  'toggle-checkbox',
  'toggle-radio',
  'toggle-decide',
  'toggle-switch',
  'tab-segmented',
  'tab-tabs',
  'feedback-end-feedback-card',
  'feedback-toast',
  'feedback-message',
  'feedback-reddot',
  'feedback-form-submission',
  'feedback-streamer',
  'popovers-popover',
  'popovers-scene-guidance',
  'popovers-scene-remark',
  'popovers-scene-gas-fee',
  'popovers-scene-confirm',
  'avatar',
  'tool-bar',
  'paginer',
  'batch-bar',
  'verify',
  'verify-scene-email',
  'verify-scene-google',
  'verify-scene-login-password',
  'verify-scene-transaction-password',
  'verify-scene-passkey',
  'verify-scene-locked',
]);

/** Organism / Template 等高预览：圆角壳 + 随页滚动（不 sticky）。 */
export const scrollComponentPreviewSlugs = new Set<string>([
  'nav-bar',
  'nav-bar-scene-cregis',
  'module-menu',
  'module-menu-scene-cregis',
  'module-menu-scene-udun',
  'data-list',
  'container',
  'layout',
  'skid',
  'popup',
  'popup-scene-detail',
  'popup-scene-dialog',
  'popup-scene-verify',
  'detail',
  'dialog-standard',
  'dialog-scene-symbol',
  'dialog-scene-compose',
]);

export function usesCompactComponentPreview(slug: string): boolean {
  return compactComponentPreviewSlugs.has(slug);
}

export function usesScrollComponentPreview(slug: string): boolean {
  return scrollComponentPreviewSlugs.has(slug);
}

/** Tag / Avatar 文档页：480px 预览区 + 底部样式色板 / 尺寸画廊。 */
export const tagComponentPreviewSlugs = new Set<string>([
  'avatar',
  'tag-system',
  'tag-scene-status',
  'tag-scene-colorful',
  'tag-scene-palette',
]);

export function usesTagComponentPreview(slug: string): boolean {
  return tagComponentPreviewSlugs.has(slug);
}

/** Avatar 文档：更高预览区以容纳原色盘。 */
export const avatarComponentPreviewSlugs = new Set<string>(['avatar']);

export function usesAvatarComponentPreview(slug: string): boolean {
  return avatarComponentPreviewSlugs.has(slug);
}

export const componentPreviews: ComponentPreviewEntry[] = [
  { slug: 'input-input', title: 'Input', component: InputInputPreview, usesComponentDocHeader: true },
  { slug: 'input-search', title: 'Search', component: InputSearchPreview, usesComponentDocHeader: true },
  {
    slug: 'input-verify-input',
    title: 'Verify Input',
    component: InputVerifyInputPreview,
    usesComponentDocHeader: true,
  },
  {
    slug: 'input-combo-input',
    title: 'Combo Input Item',
    component: InputComboInputPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'input-textarea', title: 'Textarea', component: InputTextareaPreview, usesComponentDocHeader: true },
  {
    slug: 'input-combo-textarea',
    title: 'Combo Textarea Item',
    component: InputComboTextareaPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'button-text', title: 'Standard', component: ButtonTextPreview, usesComponentDocHeader: true },
  { slug: 'button-icon', title: 'IconContainer', component: ButtonIconPreview, usesComponentDocHeader: true },
  { slug: 'button-icon-pro', title: 'IconContainerPro', component: ButtonIconProPreview, usesComponentDocHeader: true },
  { slug: 'button-link', title: 'Link', component: ButtonLinkPreview, usesComponentDocHeader: true },
  { slug: 'button-pagination', title: 'Scenes', component: ButtonPaginationPreview, usesComponentDocHeader: true },
  { slug: 'button-combo', title: 'Combo', component: ButtonComboPreview, usesComponentDocHeader: true },
  { slug: 'divider', title: 'Divider', component: DividerPreview, usesComponentDocHeader: true },
  { slug: 'avatar', title: 'Avatar', component: AvatarPreview, usesComponentDocHeader: true },
  { slug: 'tag-system', title: 'Standard', component: TagSystemPreview, usesComponentDocHeader: true },
  { slug: 'tag-scene-status', title: 'Status', component: TagStatusPreview, usesComponentDocHeader: true },
  { slug: 'tag-scene-colorful', title: 'Colorful', component: TagColorfulPreview, usesComponentDocHeader: true },
  { slug: 'tag-scene-palette', title: 'Palette', component: TagCustomPreview, usesComponentDocHeader: true },
  { slug: 'toggle-checkbox', title: 'Checkbox', component: ToggleCheckboxPreview, usesComponentDocHeader: true },
  { slug: 'toggle-radio', title: 'Radio', component: ToggleRadioPreview, usesComponentDocHeader: true },
  { slug: 'toggle-decide', title: 'Decide', component: ToggleDecidePreview, usesComponentDocHeader: true },
  { slug: 'toggle-switch', title: 'Switch', component: ToggleSwitchPreview, usesComponentDocHeader: true },
  {
    slug: 'tab-segmented',
    title: 'Segmented',
    component: TabSegmentedPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'tab-tabs', title: 'Standard', component: TabTabsPreview, usesComponentDocHeader: true },
  {
    slug: 'feedback-end-feedback-card',
    title: 'EndFeedbackCard',
    component: FeedbackEndFeedbackCardPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'feedback-toast', title: 'Toast', component: FeedbackToastPreview, usesComponentDocHeader: true },
  { slug: 'feedback-message', title: 'Message', component: FeedbackMessagePreview, usesComponentDocHeader: true },
  { slug: 'feedback-reddot', title: 'Reddot', component: FeedbackReddotPreview, usesComponentDocHeader: true },
  {
    slug: 'feedback-form-submission',
    title: 'FormSubmission',
    component: FeedbackFormSubmissionPreview,
    usesComponentDocHeader: true,
  },
  {
    slug: 'feedback-streamer',
    title: 'Streamer',
    component: FeedbackStreamerPreview,
    usesComponentDocHeader: true,
  },
  { slug: 'progress', title: 'Progress', component: ProgressPreview, usesComponentDocHeader: true },
  { slug: 'nav-bar', title: 'NavBar', component: NavBarPreview, usesComponentDocHeader: true },
  { slug: 'module-menu', title: 'ModuleMenu', component: ModuleMenuPreview, usesComponentDocHeader: true },
  { slug: 'tool-bar', title: 'ToolBar', component: ToolBarPreview, usesComponentDocHeader: true },
  { slug: 'paginer', title: 'Paginer', component: PaginerPreview, usesComponentDocHeader: true },
  { slug: 'data-list', title: 'DataList', component: DataListPreview, usesComponentDocHeader: true },
  { slug: 'detail', title: 'Detail', component: DetailPreview, usesComponentDocHeader: true },
  { slug: 'batch-bar', title: 'BatchBar', component: BatchBarPreview, usesComponentDocHeader: true },
  { slug: 'container', title: 'Container', component: ContainerPreview, usesComponentDocHeader: true },
  { slug: 'layout', title: 'Layout', component: LayoutPreview, usesComponentDocHeader: true },
  { slug: 'popup', title: 'Popup', component: PopupPreview, usesComponentDocHeader: true },
  { slug: 'popovers-popover', title: 'Standard', component: PopoversPopoverPreview, usesComponentDocHeader: true },
  { slug: 'verify', title: 'Verify', component: VerifyPreview, usesComponentDocHeader: true },
  { slug: 'dialog-standard', title: 'Standard', component: DialogStandardPreview, usesComponentDocHeader: true },
  { slug: 'dialog-scene-symbol', title: 'DialogSymbol', component: DialogSymbolPreview, usesComponentDocHeader: true },
  { slug: 'dialog-scene-compose', title: 'Compose', component: DialogComposePreview, usesComponentDocHeader: true },
  { slug: 'skid', title: 'Skid', component: SkidPreview, usesComponentDocHeader: true },
  { slug: 'icons', title: 'Icon', component: IconPreview },
  { slug: 'crypto', title: 'Crypto', component: CryptoPreview },
  ...([
    { slug: 'tooltip-flotation', title: 'StandardBox' },
    { slug: 'flotation-container-tooltip', title: 'Tooltip' },
    { slug: 'tooltip-subtle', title: 'SubtleCard' },
  ] as const).map(({ slug, title }) => ({
    slug,
    title,
    component: TooltipPanelKindPreview,
    usesComponentDocHeader: true,
  })),
  ...([
    { slug: 'tooltip-scene-text-overflow', title: '字段溢出' },
    { slug: 'tooltip-scene-paragraph-overflow', title: '段落溢出' },
    { slug: 'tooltip-scene-multi-address', title: '地址溢出' },
  ] as const).map(({ slug, title }) => ({
    slug,
    title,
    component: TooltipPanelKindPreview,
    usesComponentDocHeader: true,
  })),
  { slug: 'flotation', title: 'Combo', component: FlotationPreview, usesComponentDocHeader: true },
  {
    slug: 'flotation-trigger',
    title: 'Trigger',
    component: FlotationTriggerPreview,
    usesComponentDocHeader: true,
  },
  {
    slug: 'flotation-box',
    title: 'Box',
    component: FlotationBoxPreview,
    usesComponentDocHeader: true,
  },
  ...splitScenePreviewEntries,
];

export const componentPreviewBySlug = Object.fromEntries(
  componentPreviews.map((entry) => [entry.slug, entry]),
) as Record<string, ComponentPreviewEntry>;
