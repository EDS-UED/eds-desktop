/**
 * Flotation 组合（Figma BD - Flotation）：
 *
 * EgFlotation
 *   └ EgTooltip（定位 / 触发，`wrapTooltip=false`）
 *        ├ #trigger → EgFlotationTrigger（预置 Style/Size；可完全替换）
 *        └ #content → EgFlotationMenu
 *              └ EgTooltipPanel（flotation 玻璃面板）
 *                    ├ EgFlotationMenuItem（Box 预置 Type；可完全替换）
 *                    ├ EgDivider
 *                    └ Add（EgIcon）
 */
export { default as EgFlotation } from './Flotation.vue';
export { default as EgFlotationTrigger } from './FlotationTrigger.vue';
export { default as EgModuleMenuTrigger } from './ModuleMenuTrigger.vue';
export { default as EgFlotationMenu } from './FlotationMenu.vue';
export { default as EgCascadeMenu } from './CascadeMenu.vue';
export { default as EgAddressDropdownMenu } from './AddressDropdownMenu.vue';
export { default as EgAddressHoverMenu } from './AddressHoverMenu.vue';
export { default as EgFlotationMenuItem } from './FlotationMenuItem.vue';
/** Box 与 MenuItem 同一预置行（Figma Box）。 */
export { default as EgFlotationBox } from './FlotationMenuItem.vue';
export type { FlotationMenuItemPreset } from './flotationPresets';
export type {
  FlotationTriggerSize,
  FlotationTriggerStyle,
  FlotationTriggerSymbolPosition,
  FlotationTriggerWidthMode,
} from './FlotationTrigger.vue';
export type { FlotationBoxType } from './FlotationMenuItem.vue';
export type { FlotationWidthMode } from './Flotation.vue';
