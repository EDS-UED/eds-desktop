export type EgFilterFieldSelectionMode = 'single' | 'multi';

/** 币种级联子菜单展开方向；auto 优先右侧，边界不足时翻转到左侧。 */
export type EgFilterCascadePlacement = 'auto' | 'right' | 'left';

/** 金额 / 矿工费：单值或区间。 */
export type EgFilterAmountMode = 'single' | 'range';

/** 条件字段类型；带 selectionMode 的 kind 支持单选 / 多选。 */
export type EgFilterFieldKind =
  | 'currency'
  | 'member'
  | 'amount'
  | 'miner-fee'
  | 'time'
  | 'time-range'
  | 'status'
  | 'input'
  | 'dropdown';

export type EgFilterField = {
  id: string;
  label: string;
  kind: EgFilterFieldKind;
  /** currency / member / amount / miner-fee / status / dropdown 等可选。 */
  selectionMode?: EgFilterFieldSelectionMode;
  /** amount / miner-fee：单值或区间。 */
  amountMode?: EgFilterAmountMode;
  /** amount / miner-fee：EgInput unit（如 BTC）。 */
  unit?: string;
  /** 条件值编辑区占位；未传时回退 EgFilter placeholder。 */
  placeholder?: string;
};

export const FILTER_SELECT_PLACEHOLDER = '请选择';
export const FILTER_INPUT_PLACEHOLDER = '请输入';
export const FILTER_NUMERIC_PLACEHOLDER = '0';
export const FILTER_NUMERIC_RANGE_MIN_PLACEHOLDER = '最小';
export const FILTER_NUMERIC_RANGE_MAX_PLACEHOLDER = '最大';

const NUMERIC_FIELD_KINDS = new Set<EgFilterFieldKind>(['amount', 'miner-fee']);

const FILTER_FIELD_ID_TO_KIND: Record<string, EgFilterFieldKind> = {
  currency: 'currency',
  member: 'member',
  amount: 'amount',
  'miner-fee': 'miner-fee',
  time: 'time',
  'time-range': 'time-range',
  status: 'status',
  input: 'input',
  dropdown: 'dropdown',
};

export function isNumericFilterFieldKind(kind: EgFilterFieldKind): boolean {
  return NUMERIC_FIELD_KINDS.has(kind);
}

/**
 * 条件值编辑器 kind：优先 fieldId（与 EgFilter 预置 id=kind 对齐），
 * 再回退 field.kind（consumer 自定义 id 时）。
 */
export function resolveFilterFieldKind(
  field: Pick<EgFilterField, 'id' | 'kind'> | undefined,
  fieldId = field?.id,
): EgFilterFieldKind | undefined {
  const id = fieldId ?? field?.id;
  if (id && FILTER_FIELD_ID_TO_KIND[id]) {
    return FILTER_FIELD_ID_TO_KIND[id];
  }
  return field?.kind;
}

/** 金额 / 矿工费值区左侧标记。 */
export function filterNumericMarkerLabel(kind: EgFilterFieldKind): string {
  if (kind === 'miner-fee') return '矿工费';
  return '金额';
}

/** 条件值占位默认文案：选择类「请选择」、输入类「请输入」、数值类「0」。 */
export function defaultPlaceholderForFilterFieldKind(kind: EgFilterFieldKind): string {
  if (isNumericFilterFieldKind(kind)) {
    return FILTER_NUMERIC_PLACEHOLDER;
  }
  if (kind === 'input') {
    return FILTER_INPUT_PLACEHOLDER;
  }
  return FILTER_SELECT_PLACEHOLDER;
}

export const FILTER_FIELD_KIND_PRESETS: EgFilterField[] = [
  { id: 'currency', label: '币种', kind: 'currency', selectionMode: 'single', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'currency-multi', label: '币种', kind: 'currency', selectionMode: 'multi', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'member', label: '成员', kind: 'member', selectionMode: 'single', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'member-multi', label: '成员', kind: 'member', selectionMode: 'multi', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'amount', label: '金额', kind: 'amount', amountMode: 'range', unit: 'BTC', placeholder: FILTER_NUMERIC_PLACEHOLDER },
  { id: 'amount-range', label: '金额', kind: 'amount', amountMode: 'single', unit: 'BTC', placeholder: FILTER_NUMERIC_PLACEHOLDER },
  { id: 'miner-fee', label: '矿工费', kind: 'miner-fee', amountMode: 'single', unit: 'ETH', placeholder: FILTER_NUMERIC_PLACEHOLDER },
  { id: 'miner-fee-range', label: '矿工费', kind: 'miner-fee', amountMode: 'range', unit: 'ETH', placeholder: FILTER_NUMERIC_PLACEHOLDER },
  { id: 'time', label: '时间', kind: 'time', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'time-range', label: '时间范围', kind: 'time-range', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'status', label: '状态类', kind: 'status', selectionMode: 'single', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'status-multi', label: '状态类', kind: 'status', selectionMode: 'multi', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'input', label: '输入类', kind: 'input', placeholder: FILTER_INPUT_PLACEHOLDER },
  { id: 'dropdown', label: '下拉类', kind: 'dropdown', selectionMode: 'single', placeholder: FILTER_SELECT_PLACEHOLDER },
  { id: 'dropdown-multi', label: '下拉类', kind: 'dropdown', selectionMode: 'multi', placeholder: FILTER_SELECT_PLACEHOLDER },
];

export type EgFilterOperator = {
  id: string;
  label: string;
};

export type EgFilterLogicMode = 'all' | 'any';

export type EgFilterCondition = {
  id: string;
  fieldId: string;
  operatorId: string;
  value: string;
};

export const FILTER_LOGIC_MODE_OPTIONS: Array<{ id: EgFilterLogicMode; label: string }> = [
  { id: 'all', label: '所有' },
  { id: 'any', label: '任一' },
];

export const DEFAULT_FILTER_OPERATORS: EgFilterOperator[] = [
  { id: 'equals', label: '等于' },
  { id: 'not-equals', label: '不等于' },
  { id: 'contains', label: '包含' },
  { id: 'not-contains', label: '不包含' },
  { id: 'is-empty', label: '为空' },
  { id: 'is-not-empty', label: '不为空' },
];

export const ADVANCED_FILTER_OPERATORS: EgFilterOperator[] = [
  ...DEFAULT_FILTER_OPERATORS,
  { id: 'greater-than', label: '大于' },
  { id: 'less-than', label: '小于' },
  { id: 'greater-or-equal', label: '大于等于' },
  { id: 'less-or-equal', label: '小于等于' },
];

/** 金额 / 矿工费条件运算符。 */
export const FILTER_NUMERIC_OPERATORS: EgFilterOperator[] = [
  { id: 'equals', label: '等于' },
  { id: 'not-equals', label: '不等于' },
  { id: 'greater-than', label: '大于' },
  { id: 'greater-or-equal', label: '大于或等于' },
  { id: 'less-than', label: '小于' },
  { id: 'less-or-equal', label: '小于或等于' },
  { id: 'is-empty', label: '为空' },
  { id: 'is-not-empty', label: '不为空' },
];

const FILTER_NUMERIC_OPERATOR_IDS = new Set(
  FILTER_NUMERIC_OPERATORS.map((operator) => operator.id),
);

export function isNumericFilterOperator(operatorId: string): boolean {
  return FILTER_NUMERIC_OPERATOR_IDS.has(operatorId);
}

export function parseFilterNumericRangeValue(raw: string): { min: string; max: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { min: '', max: '' };
  }
  const [min = '', max = ''] = trimmed.split(',', 2);
  return { min: min.trim(), max: max.trim() };
}

export function formatFilterNumericRangeValue(min: string, max: string): string {
  return [min.trim(), max.trim()].join(',');
}

export function createFilterConditionId(): string {
  return `filter-${Math.random().toString(36).slice(2, 10)}`;
}

export function createFilterCondition(
  fieldId: string,
  operatorId = 'equals',
): EgFilterCondition {
  return {
    id: createFilterConditionId(),
    fieldId,
    operatorId,
    value: '',
  };
}

export function cloneFilterConditions(conditions: EgFilterCondition[]): EgFilterCondition[] {
  return conditions.map((condition) => ({ ...condition }));
}

export function isValuelessOperator(operatorId: string): boolean {
  return operatorId === 'is-empty' || operatorId === 'is-not-empty';
}
