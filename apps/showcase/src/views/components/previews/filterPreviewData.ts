import type { DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';

export const filterImportCode = `import { EgFilter } from '@eds/desktop-components';`;

export const filterPropRows: DocPropRow[] = [
  {
    name: 'modelValue',
    type: 'EgFilterCondition[]',
    defaultValue: '[]',
    description: showcaseText(
      'Applied filter conditions (v-model). Updates only when a value is committed (picker confirm / input blur) or a row is removed; field and operator edits stay draft until then. Panel stays open on apply.',
      '已应用的筛选条件（v-model）。仅在值提交（选择器确认 / 输入失焦）或删除行时更新；字段与运算符编辑保持 draft 直至提交。提交筛选后面板保持打开。',
    ),
  },
  {
    name: 'fields',
    type: 'EgFilterField[]',
    defaultValue: '—',
    description: showcaseText(
      'Field list per row; each field declares kind (currency, member, time, input, …), optional selectionMode, and placeholder.',
      '每行可选字段；含 kind（币种、成员、时间、输入类等）、selectionMode 与 placeholder。',
    ),
  },
  {
    name: 'operators',
    type: 'EgFilterOperator[]',
    defaultValue: 'DEFAULT_FILTER_OPERATORS',
    description: showcaseText('Operator list for each condition row.', '每行可选运算符列表。'),
  },
  {
    name: 'logicMode',
    type: "'all' | 'any'",
    defaultValue: "'all'",
    description: showcaseText(
      'Logic between conditions when 2 or more rows (v-model:logicMode). Committed together with the next value apply.',
      '条件行数大于等于 2 时的组合逻辑（v-model:logicMode）；随下一次值提交一并写回。',
    ),
  },
  {
    name: 'title',
    type: 'string',
    defaultValue: "'设置筛选条件'",
    description: showcaseText('Panel title.', '面板标题。'),
  },
  {
    name: 'addLabel',
    type: 'string',
    defaultValue: "'添加条件'",
    description: showcaseText('Add-condition button label.', '「添加条件」按钮文案。'),
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: "'请输入'",
    description: showcaseText(
      'Fallback value placeholder when EgFilterField.placeholder is omitted.',
      '条件值占位 fallback；优先使用 EgFilterField.placeholder。',
    ),
  },
  {
    name: 'triggerLabel',
    type: 'string',
    defaultValue: "'筛选'",
    description: showcaseText('Default trigger button label.', '默认触发按钮文案。'),
  },
  {
    name: 'showTriggerBadge',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText(
      'Show active-condition count on trigger; badge reflects applied filters automatically.',
      '触发器展示已生效条件数角标（随筛选条件自动更新）。',
    ),
  },
  {
    name: 'maxConditions',
    type: 'number',
    defaultValue: '10',
    description: showcaseText('Maximum condition rows.', '最大条件行数。'),
  },
  {
    name: 'placement',
    type: 'TooltipPlacement',
    defaultValue: "'bottom'",
    description: showcaseText('Tooltip placement relative to trigger.', '浮层相对触发器的方向。'),
  },
  {
    name: 'align',
    type: 'TooltipAlign',
    defaultValue: "'start'",
    description: showcaseText('Tooltip cross-axis alignment.', '浮层交叉轴对齐。'),
  },
  {
    name: 'boundarySelector',
    type: 'string',
    defaultValue: "'.eds-data-list'",
    description: showcaseText('Positioning boundary selector.', '定位边界选择器。'),
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Disable trigger and panel.', '禁用触发器与面板。'),
  },
];

export const filterEventRows: DocPropRow[] = [
  {
    name: 'dismiss',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Emitted when tooltip closes.', '浮层关闭时触发。'),
  },
  {
    name: 'open',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Emitted when tooltip opens.', '浮层打开时触发。'),
  },
  {
    name: 'close',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Emitted when tooltip closes.', '浮层关闭时触发。'),
  },
];

export const filterSlotRows: DocPropRow[] = [
  {
    name: 'trigger',
    type: 'slot',
    defaultValue: 'EgIconProButton',
    description: showcaseText('Custom trigger; exposes active, count, onClick.', '自定义触发器；暴露 active、count、onClick。'),
  },
];

export const filterCompositionRows: DocPropRow[] = [
  {
    name: 'EgFilterField.kind',
    type: 'EgFilterFieldKind',
    defaultValue: '—',
    description: showcaseText(
      'Presets: currency, member, amount, miner-fee, time, time-range, status, input, dropdown; see FILTER_FIELD_KIND_PRESETS.',
      '预置：币种、成员、金额、矿工费、时间、时间段、状态类、输入类、下拉类；见 FILTER_FIELD_KIND_PRESETS。',
    ),
  },
  {
    name: 'EgTooltip + EgFlotation + EgInput',
    type: '—',
    defaultValue: '—',
    description: showcaseText(
      'Filter panel uses EgTooltip flotation shell; field/operator pickers use EgFlotation; value editors use EgCryptoTooltip / EgMemberTooltip / EgDatePickerTooltip / EgStatusTooltip / EgInput.',
      '面板壳为 EgTooltip flotation；字段/运算符为 EgFlotation；值编辑器为 EgCryptoTooltip / EgMemberTooltip / EgDatePickerTooltip / EgStatusTooltip / EgInput。',
    ),
  },
  {
    name: 'EgIconProButton',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Default trigger with active state and badge.', '默认触发器，支持展开态与角标。'),
  },
];
