import { getProcessedIcon } from '@eds/desktop-components';
import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';
import {
  MODULE_MENU_MAX_GROUPS,
  MODULE_MENU_MAX_SUB_ITEMS,
  isModuleMenuEdsScenario,
  moduleMenuGroupItemAccessoryKey,
  moduleMenuGroupItemCountKey,
  moduleMenuGroupItemHasSubKey,
  moduleMenuGroupItemIconKey,
  moduleMenuGroupItemLabelKey,
  moduleMenuGroupItemMessageTextKey,
  moduleMenuGroupItemMessageTypeKey,
  moduleMenuGroupItemMessageFocusBackgroundKey,
  moduleMenuGroupItemSubCountKey,
  moduleMenuGroupItemSubIconKey,
  moduleMenuGroupItemSubLabelKey,
  moduleMenuGroupSortKey,
  moduleMenuGroupTitleKey,
} from './organismTemplateDocData';

export type ModuleMenuPreviewSubItem = {
  label: string;
  icon: string;
};

export type ModuleMenuPreviewItem = {
  tier: 1 | 2;
  label: string;
  icon: string;
  subitems: ModuleMenuPreviewSubItem[];
  accessory: 'none' | 'message' | 'reddot';
  messageText: string;
  messageType: 'subtle' | 'brand' | 'danger';
  messageFocusBackground: 'inherit' | 'same-white';
};

export type ModuleMenuPreviewGroup = {
  index: number;
  key: string;
  title?: string;
  sort: number;
  items: ModuleMenuPreviewItem[];
};

function parseGroupCount(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 2;
  return Math.min(MODULE_MENU_MAX_GROUPS, Math.max(1, Math.floor(parsed)));
}

function parseGroupSort(value: unknown, fallbackIndex: number): number {
  const parsed = Number.parseFloat(String(value ?? '').trim());
  if (Number.isFinite(parsed)) return parsed;
  return fallbackIndex + 1;
}

function groupTitleAt(state: Record<string, unknown>, index: number): string | undefined {
  const raw = String(state[moduleMenuGroupTitleKey(index)] ?? '').trim();
  return raw === '' ? undefined : raw;
}

function groupItemCountAt(state: Record<string, unknown>, index: number): number {
  const parsed = Number(state[moduleMenuGroupItemCountKey(index)]);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, Math.floor(parsed)));
}

function labelAt(state: Record<string, unknown>, key: string, fallback = 'Label'): string {
  const value = String(state[key] ?? '').trim();
  return value === '' ? fallback : value;
}

function groupItemHasSubAt(
  state: Record<string, unknown>,
  groupIndex: number,
  itemIndex: number,
): boolean {
  return String(state[moduleMenuGroupItemHasSubKey(groupIndex, itemIndex)] ?? 'no') === 'yes';
}

function groupItemTierAt(
  state: Record<string, unknown>,
  groupIndex: number,
  itemIndex: number,
): 1 | 2 {
  return groupItemHasSubAt(state, groupIndex, itemIndex) ? 2 : 1;
}

function iconAt(state: Record<string, unknown>, groupIndex: number, itemIndex: number): string {
  const key = moduleMenuGroupItemIconKey(groupIndex, itemIndex);
  const name = String(state[key] ?? '').trim();
  if (name && getProcessedIcon(name)) return name;
  return showcaseDefaultIconName;
}

function subIconAt(
  state: Record<string, unknown>,
  groupIndex: number,
  itemIndex: number,
  subIndex: number,
): string {
  const key = moduleMenuGroupItemSubIconKey(groupIndex, itemIndex, subIndex);
  const name = String(state[key] ?? '').trim();
  if (name && getProcessedIcon(name)) return name;
  return showcaseDefaultIconName;
}

function groupItemSubCountAt(
  state: Record<string, unknown>,
  groupIndex: number,
  itemIndex: number,
): number {
  const parsed = Number(state[moduleMenuGroupItemSubCountKey(groupIndex, itemIndex)]);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(MODULE_MENU_MAX_SUB_ITEMS, Math.max(1, Math.floor(parsed)));
}

export function resolveModuleMenuPreviewTitle(state: Record<string, unknown>): string {
  if (String(state.moduleTitleKind ?? 'preset') === 'text') {
    const text = String(state.moduleTitleText ?? '').trim();
    return text === '' ? 'Module' : text;
  }
  const label = String(state.triggerLabel ?? state.label ?? '').trim();
  return label === '' ? 'Doris Studio' : label;
}

export function resolveModuleMenuTitleTriggerProps(
  state: Record<string, unknown>,
): Record<string, unknown> {
  return {
    moduleMenuTitle: true,
    triggerStyle: 'text',
    widthMode: 'trigger',
    label: resolveModuleMenuPreviewTitle(state),
    showReddot: Boolean(state.showReddot),
    disabled: Boolean(state.disabled),
    expanded: Boolean(state.expanded),
  };
}

export function buildModuleMenuPreviewGroups(
  state: Record<string, unknown>,
): ModuleMenuPreviewGroup[] {
  const groupCount = parseGroupCount(state.groupCount);
  const groups = Array.from({ length: groupCount }, (_, index) => {
    const itemCount = groupItemCountAt(state, index);
    const items = Array.from({ length: itemCount }, (_, itemOffset) => {
      const itemIndex = itemOffset + 1;
      const tier = groupItemTierAt(state, index, itemIndex);
      const label = labelAt(state, moduleMenuGroupItemLabelKey(index, itemIndex));
      const subCount = tier === 2 ? groupItemSubCountAt(state, index, itemIndex) : 0;
      const subitems =
        tier === 2
          ? Array.from({ length: subCount }, (_, subOffset) => {
              const subIndex = subOffset + 1;
              return {
                label: labelAt(
                  state,
                  moduleMenuGroupItemSubLabelKey(index, itemIndex, subIndex),
                ),
                icon: subIconAt(state, index, itemIndex, subIndex),
              };
            })
          : [];

      const accessoryRaw = String(
        state[moduleMenuGroupItemAccessoryKey(index, itemIndex)] ?? 'none',
      );
      const accessory: ModuleMenuPreviewItem['accessory'] =
        accessoryRaw === 'message' || accessoryRaw === 'reddot' ? accessoryRaw : 'none';
      const messageText = String(
        state[moduleMenuGroupItemMessageTextKey(index, itemIndex)] ?? '0',
      );
      const messageTypeRaw = String(
        state[moduleMenuGroupItemMessageTypeKey(index, itemIndex)] ?? 'subtle',
      );
      const messageType: ModuleMenuPreviewItem['messageType'] =
        messageTypeRaw === 'brand' || messageTypeRaw === 'danger' ? messageTypeRaw : 'subtle';
      const messageFocusBackgroundRaw = String(
        state[moduleMenuGroupItemMessageFocusBackgroundKey(index, itemIndex)] ?? 'inherit',
      );
      const messageFocusBackground: ModuleMenuPreviewItem['messageFocusBackground'] =
        messageFocusBackgroundRaw === 'same-white' ? 'same-white' : 'inherit';

      return {
        tier,
        label,
        icon: iconAt(state, index, itemIndex),
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
      title: groupTitleAt(state, index),
      sort: parseGroupSort(state[moduleMenuGroupSortKey(index)], index),
      items,
    };
  });

  return [...groups].sort((left, right) => {
    if (left.sort !== right.sort) return left.sort - right.sort;
    return left.index - right.index;
  });
}
