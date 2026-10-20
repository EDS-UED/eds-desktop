type FlotationExclusiveEntry = {
  id: symbol;
  close: () => void;
};

const groupRegistry = new Map<string, Set<FlotationExclusiveEntry>>();

let entrySerial = 0;

export function registerFlotationExclusiveEntry(
  group: string,
  close: () => void,
): symbol {
  const id = Symbol(`flotation-exclusive-${entrySerial++}`);
  let entries = groupRegistry.get(group);
  if (!entries) {
    entries = new Set();
    groupRegistry.set(group, entries);
  }
  entries.add({ id, close });
  return id;
}

export function unregisterFlotationExclusiveEntry(group: string, id: symbol) {
  const entries = groupRegistry.get(group);
  if (!entries) return;
  for (const entry of entries) {
    if (entry.id === id) {
      entries.delete(entry);
      break;
    }
  }
  if (entries.size === 0) {
    groupRegistry.delete(group);
  }
}

/** 打开新浮层前关闭同组其它实例（列表行 More 等场景）。 */
export function closeOtherFlotationExclusiveEntries(group: string, exceptId: symbol) {
  const entries = groupRegistry.get(group);
  if (!entries) return;
  for (const entry of entries) {
    if (entry.id !== exceptId) {
      entry.close();
    }
  }
}

/** DataList 行内 More 菜单：全页仅允许一个打开。 */
export const DATA_LIST_ROW_MORE_EXCLUSIVE_GROUP = 'eds-data-list-row-more';
