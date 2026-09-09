export { default as EgDetail } from './Detail.vue';
export type {
  DetailItemData,
  DetailSectionData,
  DetailValueType,
  DetailValueSymbolKind,
} from './detailTypes';
export { createDefaultDetailSections } from './detailTypes';
export type {
  DetailAddressLayout,
  DetailItemValueEntry,
} from './detailTypes';
export {
  DETAIL_APPLY_ITEM_FIGMA_NODE,
  buildDetailAddressApplyItemRow,
  createDetailApplyItemRow,
  detailAddressDemoEntries,
  detailApplyItemVariantIds,
  detailApplyItemVariants,
  getDetailApplyItemVariant,
  isDetailApplyItemVariantId,
  type DetailApplyItemRowOverrides,
  type DetailApplyItemVariant,
  type DetailApplyItemVariantId,
} from './applyItemPresets';
