/**
 * Showcase 定制下拉选项（§4.2）：
 * - token / prop 取值：**语义 + 英文 token**（zh-CN：中文 + token；其它 locale：对应语义 + token）
 * - 纯数量等非枚举：按 locale 输出（如 `1 个` / `1 items`）
 */

import {
  registerShowcaseCountLabel,
  resolveShowcaseGalleryLabel,
  showcaseText,
  tokenLabel,
} from '@/data/i18n/showcaseDisplayText';

export { showcaseText, tokenLabel };

export type PropLabelRow<K extends string = string> = {
  key: K;
  label: string;
};

export type SelectOption<Value extends string = string> = { value: Value; label: string };

/** @deprecated 预览层请用 useShowcaseDisplayText().gallery() */
export function galleryLabelFromTokenLabel(label: string): string {
  return resolveShowcaseGalleryLabel(label);
}

const TOKEN_OPTION_SEMANTIC_EN: Record<string, string> = {
  left: 'Left',
  center: 'Center',
  right: 'Right',
  placeholder: 'Placeholder',
  custom: 'Custom',
};

export function tokenOption(arg1: string, arg2: string, arg3?: string): SelectOption {
  if (arg3 !== undefined) {
    return { value: arg3, label: tokenLabel(arg1, arg2, arg3) };
  }
  const zh = arg1;
  const token = arg2;
  const en = TOKEN_OPTION_SEMANTIC_EN[token] ?? token;
  return { value: token, label: tokenLabel(en, zh, token) };
}

const CHINESE_OPTION_I18N: Record<string, string> = {
  '仅币种': 'Currency only',
  '单地址': 'Single address',
  '双地址': 'Dual address',
  '不显示': 'Hidden',
  入: 'In',
  出: 'Out',
  悬浮时: 'On hover',
  聚焦时: 'On focus',
  单行: 'Single line',
  双行: 'Double line',
  单: 'Single',
  双: 'Dual',
  法币: 'Fiat',
  加密货币: 'Crypto',
  折合: 'Converted',
  左: 'Left',
  中: 'Center',
  右: 'Right',
};

/** 非枚举取值（如数量 / 自定义业务词）：双语注册。 */
export function chineseOption(value: string, label: string): SelectOption {
  const en = CHINESE_OPTION_I18N[label] ?? label;
  return { value, label: showcaseText(en, label) };
}

export function countSelectOptions(max: number, start = 1): SelectOption[] {
  return Array.from({ length: max - start + 1 }, (_, index) => {
    const value = String(start + index);
    const en = `${value} items`;
    const zh = `${value} 个`;
    registerShowcaseCountLabel(value, en, zh);
    return { value, label: showcaseText(en, zh) };
  });
}

export const showcaseSizeLabels = {
  lg: tokenLabel('Large', '大', 'lg'),
  md: tokenLabel('Medium', '中', 'md'),
  sm: tokenLabel('Small', '小', 'sm'),
  xs: tokenLabel('Extra small', '特小', 'xs'),
} as const;

export const showcaseLinkSizeLabels = {
  lg: tokenLabel('Large', '大', 'lg'),
  md: tokenLabel('Medium', '中', 'md'),
  sm: tokenLabel('Small', '小', 'sm'),
} as const;

export const showcaseInputSizeLabels = {
  lg: tokenLabel('Large', '大', 'lg'),
  md: tokenLabel('Medium', '中', 'md'),
  sm: tokenLabel('Small', '小', 'sm'),
} as const;

export const showcaseVariantLabels = {
  solid: tokenLabel('Solid', '实心', 'solid'),
  outline: tokenLabel('Outline', '描边', 'outline'),
  text: tokenLabel('Text', '文字', 'text'),
} as const;

export const showcaseButtonToneLabels = {
  brand: tokenLabel('Brand', '品牌', 'brand'),
  danger: tokenLabel('Danger', '危险', 'danger'),
  decor: tokenLabel('Decor', '装饰', 'decor'),
  subtle: tokenLabel('Subtle', '浅', 'subtle'),
  sameWhite: tokenLabel('Same white', '同白', 'sameWhite'),
} as const;

export const showcaseLinkToneLabels = {
  brand: tokenLabel('Brand', '品牌', 'brand'),
  theme: tokenLabel('Theme', '主题', 'theme'),
  decor: tokenLabel('Decor', '装饰', 'decor'),
} as const;

export const showcasePaginationToneLabels = {
  decor: tokenLabel('Decor', '装饰', 'decor'),
  brand: tokenLabel('Brand', '品牌', 'brand'),
} as const;

export const showcaseIconShapeLabels = {
  rectangular: tokenLabel('Rectangular', '矩形', 'rectangular'),
  square: tokenLabel('Square', '方形', 'square'),
  round: tokenLabel('Round', '圆形', 'round'),
} as const;

export const showcasePaginationKindLabels = {
  number: showcaseText('Number paginator', '分页器-数字'),
  symbol: showcaseText('Symbol paginator', '分页器-符号'),
  button: showcaseText('Filled arrow paginator', '分页器-填充箭头'),
  borderArrow: showcaseText('Toolbar border arrow', '工具栏-边框箭头'),
} as const;

export const showcaseInputTypeLabels = {
  standard: tokenLabel('Text', '文本', 'text'),
  amount: tokenLabel('Amount', '金额', 'amount'),
} as const;

export const showcaseWidthModeLabels = {
  fixed: tokenLabel('Fixed', '固定', 'fixed'),
  full: tokenLabel('Full width', '全宽', 'full'),
  adaptive: tokenLabel('Adaptive', '自适应', 'adaptive'),
  trigger: tokenLabel('Trigger', '触发器', 'trigger'),
} as const;

export const showcasePlacementLabels = {
  top: tokenLabel('Top', '上', 'top'),
  bottom: tokenLabel('Bottom', '下', 'bottom'),
  left: tokenLabel('Left', '左', 'left'),
  right: tokenLabel('Right', '右', 'right'),
} as const;

export const showcaseTriggerLabels = {
  click: tokenLabel('Click', '点击', 'click'),
  hover: tokenLabel('Hover', '悬浮', 'hover'),
} as const;

export const showcaseAlignLabels = {
  start: tokenLabel('Start', '起始', 'start'),
  end: tokenLabel('End', '结束', 'end'),
  center: tokenLabel('Center', '居中', 'center'),
} as const;

export const showcaseHeightModeLabels = {
  adaptive: tokenLabel('Adaptive', '自适应', 'adaptive'),
  fixed: tokenLabel('Fixed', '固定', 'fixed'),
} as const;

export const showcaseTagStatusLabels = {
  danger: tokenLabel('Danger', '危险', 'danger'),
  warning: tokenLabel('Warning', '警告', 'warning'),
  success: tokenLabel('Success', '成功', 'success'),
  ready: tokenLabel('Ready', '就绪', 'ready'),
  invalid: tokenLabel('Invalid', '无效', 'invalid'),
} as const;

export const showcaseMessageTypeLabels = {
  subtle: tokenLabel('Subtle', '浅', 'subtle'),
  brand: tokenLabel('Brand', '品牌', 'brand'),
  danger: tokenLabel('Danger', '危险', 'danger'),
} as const;

export const showcaseFlotationTriggerStyleLabels = {
  subtle: tokenLabel('Subtle', '浅', 'subtle'),
  outline: tokenLabel('Outline', '描边', 'outline'),
  text: tokenLabel('Text', '文字', 'text'),
} as const;

export const showcaseFlotationTriggerKindLabels = {
  'standard-dropdown': showcaseText('Standard dropdown', '标准下拉框'),
  'module-menu': showcaseText('Module menu', '模块菜单'),
} as const;

export const showcaseFlotationBoxTypeLabels = {
  text: tokenLabel('Text', '文字', 'text'),
  'symbol-text': tokenLabel('Icon + text', '图标+文字', 'symbol-text'),
  'image-text': tokenLabel('Image + text', '图片+文字', 'image-text'),
} as const;

export const showcaseFlotationBoxKindLabels = {
  'standard-menu': showcaseText('Standard dropdown menu', '标准下拉菜单'),
  'standard-cascade-menu': showcaseText('Standard cascade menu', '标准下拉级联菜单'),
  'scene-address-dropdown': showcaseText('Address dropdown scene', '场景化-下拉地址'),
  'scene-address-hover': showcaseText('Address hover scene', '场景化-地址悬浮'),
} as const;

/** Combo 页 EgFlotationMenu「场景」— 对齐侧栏插槽 catalog 文案。 */
export const showcaseFlotationComboBoxSceneLabels = {
  'standard-menu': showcaseText('Standard menu', '标准菜单'),
  'standard-cascade-menu': showcaseText('Standard cascade menu', '标准级联菜单'),
  'scene-address-dropdown': showcaseText('Address dropdown', '下拉地址'),
  'scene-address-hover': showcaseText('Address hover', '地址悬浮'),
} as const;

export const showcaseFlotationBoxSelectionModeLabels = {
  single: tokenLabel('Single select', '单选', 'single'),
  multiple: tokenLabel('Multi select', '复选', 'multiple'),
} as const;

export const showcaseDividerTypeLabels = {
  module: tokenLabel('Module', '模块', 'module'),
  page: tokenLabel('Page', '页面', 'page'),
  navigator: tokenLabel('Navigation', '导航', 'navigator'),
} as const;

export const showcaseDirectionLabels = {
  horizontal: tokenLabel('Horizontal', '水平', 'horizontal'),
  vertical: tokenLabel('Vertical', '垂直', 'vertical'),
  left: tokenLabel('Left', '左', 'left'),
  right: tokenLabel('Right', '右', 'right'),
} as const;

export const showcaseTabShapeLabels = {
  circle: tokenLabel('Round', '圆形', 'circle'),
  square: tokenLabel('Square', '方形', 'square'),
} as const;

export const showcaseFeedbackToastTypeLabels = {
  result: tokenLabel('Result', '结果', 'result'),
  danger: tokenLabel('Danger', '危险', 'danger'),
} as const;

export const showcaseFeedbackMessageTypeLabels = {
  subtle: tokenLabel('Subtle', '浅', 'subtle'),
  brand: tokenLabel('Brand', '品牌', 'brand'),
  danger: tokenLabel('Danger', '危险', 'danger'),
} as const;

export const showcaseMessageFocusBackgroundLabels = {
  inherit: tokenLabel('Inherit', '继承原色', 'inherit'),
  'same-white': tokenLabel('Same white', '同白', 'same-white'),
} as const;

export const showcaseFormSubmissionTypeLabels = {
  notes: tokenLabel('Notes', '备注', 'notes'),
  danger: tokenLabel('Danger', '危险', 'danger'),
  success: tokenLabel('Success', '成功', 'success'),
} as const;

export const showcaseStreamerTypeLabels = {
  info: tokenLabel('Info', '信息', 'info'),
  warning: tokenLabel('Warning', '警告', 'warning'),
  danger: tokenLabel('Danger', '危险', 'danger'),
} as const;

export const showcaseStreamerVisualLabels = {
  brand: tokenLabel('Brand', '品牌', 'brand'),
  moderate: tokenLabel('Moderate', '弱化', 'moderate'),
} as const;

export const showcaseToggleCheckboxModeLabels = {
  checkbox: tokenLabel('Checkbox', '复选框', 'checkbox'),
  'unchecked-disable': tokenLabel('Unchecked disabled', '未选禁用', 'unchecked-disable'),
  'checked-disable': tokenLabel('Checked disabled', '已选禁用', 'checked-disable'),
  indeterminate: tokenLabel('Indeterminate', '半选', 'indeterminate'),
} as const;

export const showcaseToggleRadioModeLabels = {
  radio: tokenLabel('Single select', '单选', 'radio'),
  disable: tokenLabel('Disabled', '禁用', 'disable'),
} as const;

export const showcaseToggleDecideModeLabels = {
  decide: tokenLabel('Decide', '决定', 'decide'),
  disable: tokenLabel('Disabled', '禁用', 'disable'),
} as const;

export const showcaseToggleSwitchModeLabels = {
  switch: tokenLabel('Switch', '开关', 'switch'),
  disable: tokenLabel('Disabled', '禁用', 'disable'),
} as const;

export const showcaseTagSystemTypeLabels = {
  subtle: tokenLabel('Subtle', '浅', 'subtle'),
  'solid-brand': tokenLabel('Solid brand', '实心品牌', 'solid-brand'),
  'solid-red': tokenLabel('Solid red', '实心红', 'solid-red'),
  gray: tokenLabel('Gray', '灰', 'gray'),
  'stroke-subtle': tokenLabel('Stroke subtle', '描边浅', 'stroke-subtle'),
  'stroke-solid': tokenLabel('Stroke solid', '描边实心', 'stroke-solid'),
} as const;

export const showcaseTagColorfulStyleLabels = {
  apricot: tokenLabel('Apricot', '杏色', 'apricot'),
  khaki: tokenLabel('Khaki', '卡其', 'khaki'),
  grass: tokenLabel('Grass', '草绿', 'grass'),
  sage: tokenLabel('Sage', '鼠尾草', 'sage'),
  cyan: tokenLabel('Cyan', '青', 'cyan'),
  'ice-blue': tokenLabel('Ice blue', '冰蓝', 'ice-blue'),
  periwinkle: tokenLabel('Periwinkle', '长春花', 'periwinkle'),
  lilac: tokenLabel('Lilac', '丁香', 'lilac'),
  orchid: tokenLabel('Orchid', '兰花', 'orchid'),
  mallow: tokenLabel('Mallow', '锦葵', 'mallow'),
  rose: tokenLabel('Rose', '玫瑰', 'rose'),
  coral: tokenLabel('Coral', '珊瑚', 'coral'),
  mauve: tokenLabel('Mauve', '淡紫', 'mauve'),
  moss: tokenLabel('Moss', '苔藓', 'moss'),
  steel: tokenLabel('Steel', '钢蓝', 'steel'),
  grape: tokenLabel('Grape', '葡萄', 'grape'),
  samewhite: tokenLabel('Same white', '同白', 'samewhite'),
  lime: tokenLabel('Lime', '青柠', 'lime'),
} as const;

export const showcaseTagCustomStyleLabels = {
  vermilion: tokenLabel('Vermilion', '朱红', 'vermilion'),
  orange: tokenLabel('Orange', '橙', 'orange'),
  amber: tokenLabel('Amber', '琥珀', 'amber'),
  lime: tokenLabel('Lime', '青柠', 'lime'),
  mint: tokenLabel('Mint', '薄荷', 'mint'),
  teal: tokenLabel('Teal', '青绿', 'teal'),
  'clear-sky': tokenLabel('Clear sky', '晴空', 'clear-sky'),
  cobalt: tokenLabel('Cobalt', '钴蓝', 'cobalt'),
  aurora: tokenLabel('Aurora', '极光', 'aurora'),
  orchid: tokenLabel('Orchid', '兰花', 'orchid'),
  rose: tokenLabel('Rose', '玫瑰', 'rose'),
  peach: tokenLabel('Peach', '蜜桃', 'peach'),
  'aml-danger': tokenLabel('AML danger', 'AML 危险', 'aml-danger'),
  'aml-safe': tokenLabel('AML safe', 'AML 安全', 'aml-safe'),
  'aml-suspicious': tokenLabel('AML suspicious', 'AML 可疑', 'aml-suspicious'),
  'aml-invalid': tokenLabel('AML invalid', 'AML 无效', 'aml-invalid'),
} as const;

export const showcaseBatchBarActionTypeLabels = {
  text: tokenLabel('Text', '文字', 'text'),
  symbol: tokenLabel('Symbol', '符号', 'symbol'),
  statistics: tokenLabel('Statistics', '统计', 'statistics'),
} as const;

export const showcasePageBgLabels = {
  none: tokenLabel('No', '无', 'none'),
  right: tokenLabel('Right', '右', 'right'),
  center: tokenLabel('Center', '居中', 'center'),
} as const;

export const showcaseLayoutTypeLabels = {
  empty: tokenLabel('Empty', '空', 'empty'),
  free: tokenLabel('Free layout', '自由布局', 'free'),
} as const;

export const showcasePopupUsesLabels = {
  detail: tokenLabel('Detail', '详情', 'detail'),
  dialog: tokenLabel('Dialog', '对话框', 'dialog'),
  verify: tokenLabel('Verify', '验证', 'verify'),
  custom: tokenLabel('Custom', '自定义', 'custom'),
} as const;

export const showcasePopupAlertVerticalAlignLabels = {
  center: tokenLabel('Center', '居中', 'center'),
  'offset-top': tokenLabel('Offset top', '偏上', 'offset-top'),
} as const;

export const showcaseSearchScenarioLabels = {
  search: tokenLabel('Search', '搜索', 'search'),
  'verify-input': tokenLabel('Verify input', '验证输入', 'verify-input'),
} as const;

export const showcaseDialogTypeLabels = {
  symbol: tokenLabel('Symbol dialog', '带符号的对话', 'symbol'),
  compose: tokenLabel('Business dialog', '业务对话', 'compose'),
  standard: tokenLabel('Standard', '标准', 'standard'),
} as const;

export const showcasePaginerDataVolumeLabels = {
  few: tokenLabel('Few', '少量', 'few'),
  many: tokenLabel('Many', '大量', 'many'),
} as const;

export const showcaseYesNoLabels = {
  yes: tokenLabel('Yes', '有', 'yes'),
  no: tokenLabel('No', '无', 'no'),
} as const;

export const showcaseModuleMenuAccessoryLabels = {
  none: tokenLabel('No', '无', 'none'),
  message: tokenLabel('Message', '消息', 'message'),
  reddot: tokenLabel('Red dot', '红点', 'reddot'),
} as const;

export const showcaseModuleMenuTitleKindLabels = {
  text: showcaseText('Text', '文本'),
  preset: showcaseText('Dropdown', '下拉框'),
} as const;

export const showcaseNavBarScenarioLabels = {
  'nav-bar': tokenLabel('Component', '组件', 'nav-bar'),
  cregis: tokenLabel('Business', '业务', 'cregis'),
} as const;

export const showcaseModuleMenuScenarioLabels = {
  'module-menu': showcaseText('Component', '组件'),
  cregis: 'Cregis',
  udun: 'UDun',
} as const;

export const showcaseIconButtonEventLabels = {
  full: tokenLabel('Full', '完整', 'full'),
  default: tokenLabel('Default', '默认', 'default'),
  hover: tokenLabel('Hover', '悬浮', 'hover'),
  active: tokenLabel('Click', '点击', 'active'),
  focus: tokenLabel('Focus', '聚焦', 'focus'),
} as const;

export const showcaseTooltipPanelKindLabels = {
  container: tokenLabel('Container panel', '容器面板', 'container'),
  flotation: tokenLabel('Flotation panel', '浮层面板', 'flotation'),
  popup: tokenLabel('Popup panel', '弹窗面板', 'popup'),
  subtle: tokenLabel('Page panel', '页面面板', 'subtle'),
  molde: tokenLabel('Module level', '模块层级', 'molde'),
} as const;

/** Tooltip 本体页「容器」下拉 — panelKind 选项（英文 token，与 prop 一致）。 */
export const showcaseTooltipPanelKindCustomizeLabels = {
  flotation: 'flotation',
  container: 'container',
  popup: 'popup',
  molde: 'molde',
} as const;

export const showcaseTooltipFlotationScenarioLabels = {
  component: showcaseText('Type', '类型'),
  'text-overflow': showcaseText('Field overflow', '字段溢出'),
  'paragraph-overflow-info': showcaseText('Paragraph overflow', '段落溢出'),
  'multi-address': showcaseText('Address overflow (item, copyable)', '地址溢出（Item、可复制）'),
} as const;

export const showcaseTooltipPanelRadiusLabels: Record<string, string> = {
  '': tokenLabel('Default', '默认', 'default'),
  'radius-0': tokenLabel('No radius', '无圆角', 'radius-0'),
  'radius-xs': tokenLabel('Extra small', '超小', 'radius-xs'),
  'radius-sm': tokenLabel('Small', '小', 'radius-sm'),
  'radius-md': tokenLabel('Medium', '中', 'radius-md'),
  'radius-lg': tokenLabel('Large', '大', 'radius-lg'),
  'radius-full': tokenLabel('Full round', '全圆', 'radius-full'),
};

export const showcaseComboPopupCountLabels = {
  '1': showcaseText('1 (confirm only)', '1 个（仅确认）'),
  '2': showcaseText('2 (confirm + cancel)', '2 个（确认+取消）'),
} as const;

export const showcaseComboActionKindLabels = {
  skid: tokenLabel('Skid', '滑轨', 'Action-Skid'),
  'popup-window': tokenLabel('Popup', '弹窗', 'Popup Window'),
  flotation: tokenLabel('Flotation', '浮层', 'Flotation'),
  page: tokenLabel('Page', '页面', 'Page'),
} as const;

export const showcaseButtonCustomizeFieldLabels = {
  tone: showcaseText('Tone', '色调'),
  variant: showcaseText('Style', '风格'),
  size: showcaseText('Size', '尺寸'),
  disabled: showcaseText('Disabled', '禁用'),
  loading: showcaseText('Loading', '加载'),
  label: showcaseText('Copy', '文案'),
  showIcon: showcaseText('ShowIcon', '显示图标'),
  iconPosition: showcaseText('IconPosition', '图标位置'),
  iconName: showcaseText('Icon Name', '图标名'),
  symbol: showcaseText('Icon', '图标'),
  shape: showcaseText('Type', '类型'),
  event: showcaseText('Interaction', '交互'),
  badge: showcaseText('Badge', '角标'),
  showBadge: showcaseText('Show badge', '显示角标'),
  showReddot: showcaseText('Show red dots', '显示红点'),
  href: showcaseText('Link', '链接'),
  kind: showcaseText('Type', '类型'),
  divider: showcaseText('Divider', '分隔线'),
  confirmLabel: showcaseText('Confirm copy', '确认文案'),
  cancelLabel: showcaseText('Cancel copy.', '取消文案'),
  count: showcaseText('Button count', '按钮数'),
  clear: showcaseText('Clear', '清空'),
  direction: showcaseText('Direction', '方向'),
} as const;

export const showcaseInputCustomizeFieldLabels = {
  type: showcaseText('Type', '类型'),
  size: showcaseText('Size', '尺寸'),
  widthMode: showcaseText('Width', '宽度'),
  fixedWidth: showcaseText('Fixed width', '固定宽度'),
  placeholder: showcaseText('Placeholder', '占位符'),
  scenario: showcaseText('Scenes', '场景化'),
  disabled: showcaseText('Disabled', '禁用'),
  readonly: showcaseText('Readonly', '只读'),
  unit: showcaseText('Unit', '单位'),
  clearable: showcaseText('Clear', '清空'),
  showMax: showcaseText('Show Max', '显示 Max'),
  maxLabel: showcaseText('Max label', 'Max 文案'),
  pasteLabel: showcaseText('Paste label', 'Paste 文案'),
  clearLabel: showcaseText('Clear label', 'Clear 文案'),
  interaction: showcaseText('Interaction', '交互'),
  label: showcaseText('Title', '标题'),
  feedback: showcaseText('Feedback area', '反馈区'),
} as const;

export const showcaseTooltipCustomizeFieldLabels = {
  scenario: showcaseText('Scenes', '场景化'),
  panelKind: showcaseText('Container', '容器'),
  panelRadius: showcaseText('Radius', '圆角'),
  widthMode: showcaseText('Width', '宽度'),
  width: showcaseText('Fixed width', '固定宽度'),
  heightMode: showcaseText('Height', '高度'),
  height: showcaseText('Height', '高度'),
  maxHeight: showcaseText('maxHeight', '最大高度'),
  placement: showcaseText('Placement', '弹出方向'),
  trigger: showcaseText('Trigger', '触发方式'),
  disabled: showcaseText('Disabled', '禁用'),
  triggerLabel: showcaseText('Trigger label', '触发器文案'),
} as const;

export const showcaseFlotationCustomizeFieldLabels = {
  triggerStyle: showcaseText('Style', '样式'),
  size: showcaseText('Size', '尺寸'),
  triggerLabel: showcaseText('Copy', '文案'),
  disabled: showcaseText('Disabled', '禁用'),
  showSymbol: showcaseText('ShowIcon', '显示图标'),
  symbolIcon: showcaseText('Icon Name', '图标名'),
  symbolPosition: showcaseText('IconPosition', '图标位置'),
  showTag: showcaseText('Show label.', '显示标签'),
  tagText: showcaseText('Tag copy.', '标签文案'),
  tagStatus: showcaseText('TagStatus', '标签状态'),
  showMessage: showcaseText('Display message...', '显示消息'),
  messageText: showcaseText('Message copy', '消息文案'),
  messageType: showcaseText('Type of Message', '消息类型'),
  placement: showcaseText('Placement', '弹出方向'),
  offset: showcaseText('Main-axis offset', '主轴偏移'),
  crossAxisOffset: showcaseText('Cross-axis offset', '交叉轴偏移'),
  showAdd: showcaseText('Show Add', '显示 Add'),
  addLabel: showcaseText('Add copy.', 'Add 文案'),
  widthMode: showcaseText('Wrapper Width', '容器宽度'),
  width: showcaseText('Fixed width', '固定宽度'),
  align: showcaseText('Align', '对齐'),
  heightMode: showcaseText('Container height', '容器高度'),
  height: showcaseText('Height value', '高度值'),
  maxHeight: showcaseText('maxHeight', '最大高度'),
  itemCount: showcaseText('# of Lines', '行数'),
  boxSelectionMode: showcaseText('Select mode', '选择模式'),
  editBoxIndex: showcaseText('Edit row', '编辑行'),
  boxType: showcaseText('Type', '类型'),
  label: showcaseText('Copy', '文案'),
  showCheckbox: showcaseText('Checkbox', '复选框'),
  checked: showcaseText('Selected', '选中'),
  showReddot: showcaseText('red dot', '红点'),
  showCascader: showcaseText('Cascading Arrows', '级联箭头'),
  expanded: showcaseText('Expand State', '展开态'),
  boxKind: showcaseText('Box Slot', '盒子插槽'),
} as const;

export const showcaseDisabledLabel = showcaseText('Disabled', '禁用');
export const showcaseLoadingLabel = showcaseText('Loading', '加载');

export function propLabelRows<K extends string>(
  keys: readonly K[],
  labels: Record<K, string>,
): PropLabelRow<K>[] {
  return keys.map((key) => ({ key, label: labels[key] }));
}

export function propLabelSelectOptions<K extends string>(
  keys: readonly K[],
  labels: Record<K, string>,
): SelectOption<K>[] {
  return propLabelRows(keys, labels).map((row) => ({ value: row.key, label: row.label }));
}

export const buttonSizeRows = propLabelRows(
  ['lg', 'md', 'sm', 'xs'] as const,
  showcaseSizeLabels,
);

export const buttonVariantRows = propLabelRows(
  ['solid', 'outline', 'text'] as const,
  showcaseVariantLabels,
);

export const buttonToneRows = propLabelRows(
  ['brand', 'danger', 'decor', 'subtle', 'sameWhite'] as const,
  showcaseButtonToneLabels,
);

export const iconShapeRows = propLabelRows(
  ['rectangular', 'square', 'round'] as const,
  showcaseIconShapeLabels,
);

export const linkToneRows = propLabelRows(['brand', 'theme', 'decor'] as const, showcaseLinkToneLabels);

export const linkSizeRows = propLabelRows(['lg', 'md', 'sm'] as const, showcaseLinkSizeLabels);

export const paginationKindRows = propLabelRows(
  ['number', 'symbol', 'button', 'borderArrow'] as const,
  showcasePaginationKindLabels,
);

export const paginationToneRows = propLabelRows(
  ['decor', 'brand'] as const,
  showcasePaginationToneLabels,
);

export const inputSizeRows = propLabelRows(['sm', 'md', 'lg'] as const, showcaseInputSizeLabels);

export const inputTypeRows = propLabelRows(
  ['standard', 'amount'] as const,
  showcaseInputTypeLabels,
);

export const placementRows = propLabelRows(
  ['top', 'bottom', 'left', 'right'] as const,
  showcasePlacementLabels,
);

export const triggerRows = propLabelRows(['click', 'hover'] as const, showcaseTriggerLabels);

export const alignStartEndRows = propLabelRows(['start', 'end'] as const, showcaseAlignLabels);

export const widthModeAdaptiveFixedRows = propLabelRows(
  ['adaptive', 'fixed'] as const,
  showcaseWidthModeLabels,
);

export const widthModeTriggerFixedAdaptiveRows = propLabelRows(
  ['trigger', 'fixed', 'adaptive'] as const,
  showcaseWidthModeLabels,
);

export const widthModeFixedFullRows = propLabelRows(['fixed', 'full'] as const, showcaseWidthModeLabels);

export const heightModeRows = propLabelRows(['adaptive', 'fixed'] as const, showcaseHeightModeLabels);

export const flotationTriggerStyleRows = propLabelRows(
  ['subtle', 'outline', 'text'] as const,
  showcaseFlotationTriggerStyleLabels,
);

export const flotationBoxTypeRows = propLabelRows(
  ['text', 'symbol-text', 'image-text'] as const,
  showcaseFlotationBoxTypeLabels,
);

export const directionLeftRightRows = propLabelRows(['left', 'right'] as const, showcaseDirectionLabels);

export const iconButtonEventRows = propLabelRows(
  ['full', 'default', 'hover', 'active', 'focus'] as const,
  showcaseIconButtonEventLabels,
);

/** EgButton 默认 size=lg */
export const buttonHeroPreviewLabel = showcaseSizeLabels.lg;

/** EgInput 默认 size=md */
export const inputHeroPreviewLabel = showcaseInputSizeLabels.md;
