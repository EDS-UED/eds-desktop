import type { TagStatus } from '../tag';
import type { MessageType } from '../feedback';
import type { FlotationBoxType } from './FlotationMenuItem.vue';

export type FlotationMenuItemPreset = {
  label: string;
  boxType?: FlotationBoxType;
  disabled?: boolean;
  focused?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  showTag?: boolean;
  tag?: string;
  tagStatus?: TagStatus;
  /** 模式 Tag（EgTag system stroke-subtle sm）；如收款 / 提币。 */
  modeTag?: string;
  showReddot?: boolean;
  showCascader?: boolean;
  showMessage?: boolean;
  messageText?: string;
  messageType?: MessageType;
  symbolIcon?: string;
};

export function createDefaultFlotationPresetItems(
  count = 8,
): FlotationMenuItemPreset[] {
  const safe = Math.min(20, Math.max(1, Math.floor(count)));
  return Array.from({ length: safe }, (_, index) => ({
    label: `Label ${index + 1}`,
    boxType: 'text',
    showTag: false,
    tag: 'Tag',
    tagStatus: 'danger',
  }));
}
