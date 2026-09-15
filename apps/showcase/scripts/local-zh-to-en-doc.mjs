#!/usr/bin/env node
/**
 * 本地规则 + 词表将 Showcase 文档中文翻译为英文（无外部 API）。
 * 供 generate-showcase-authoring-registry.mjs 消费。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const i18nRoot = path.join(__dirname, '../src/data/i18n');

function hasCjk(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

/** 长短语优先 */
const PHRASE_MAP = {
  '受控输入值': 'Controlled input value',
  '标准组合': 'Standard combo',
  '验证码': 'Verification code',
  '搜索框': 'Search box',
  '占位符': 'Placeholder',
  '占位文案': 'Placeholder copy',
  '请输入': 'Please enter',
  '是否禁用': 'Whether disabled',
  '是否只读': 'Whether read-only',
  '多选模式开关': 'Multi-select mode toggle',
  '非多选时点击行': 'Row click when not in multi-select mode',
  '值变化时触发': 'Emitted when the value changes',
  '点击清空时触发': 'Emitted when clear is clicked',
  '获得焦点时触发': 'Emitted on focus',
  '失去焦点时触发': 'Emitted on blur',
  '左侧输入区，可任意自定义。不传时用默认 input；传入则整块替换。':
    'Leading input area; fully customizable. Default input when omitted; slot replaces the whole region.',
  '右侧变体区，可任意自定义。常用预置：清空、单位、Max（需对应 props）；传入 slot 则整块替换。':
    'Trailing variant area; fully customizable. Common presets: clear, unit, Max (via props); slot replaces the whole region.',
  '场景动画 — 可直接复用的成品动画资产。': 'Scene animations — ready-to-use motion assets.',
  '可复用页面与数据组合。': 'Reusable page and data compositions.',
  '可复用业务流程（Authentication、Verification、Transaction、Submission、Approval、Onboarding 等）将在此落地。':
    'Reusable business workflows (Authentication, Verification, Transaction, Submission, Approval, Onboarding, etc.) will land here.',
  '重新打开 Popup': 'Reopen Popup',
  '全部方向': 'All directions',
  '列设置': 'Column settings',
  '数据统计': 'Statistics',
  '列 EgDataListColumn': 'Columns · EgDataListColumn',
  '引导': 'Guidance',
  '备注': 'Remark',
  '矿工费': 'Gas fee',
  '二次确认': 'Confirm',
  '字段溢出': 'Field overflow',
  '段落溢出': 'Paragraph overflow',
  '地址溢出（Item、可复制）': 'Address overflow (item, copyable)',
  '显示发送方': 'Show sender',
  '显示接收方': 'Show recipient',
  '地址别名': 'Address alias',
  '单元格最小宽度（px）；不传为自适应。': 'Cell min width (px); omit for auto.',
  'Body 最小宽度（px）；不传为自适应。单地址默认 278。':
    'Body min width (px); omit for auto. Single-address default 278.',
  'tag → System stroke-subtle；suffix → 符号后缀。':
    'tag → System stroke-subtle; suffix → symbol suffix.',
  '入/出角标；in → eds-arrow-entry，out → eds-arrow-outflow。':
    'In/out corner badge; in → eds-arrow-entry, out → eds-arrow-outflow.',
  '有角标时为 suffix（36px 图标区）；可由 entryBadge 推导。':
    'When badge present: suffix (36px icon area); can be inferred from entryBadge.',
  '是否渲染地址子行。': 'Whether to render the address sub-row.',
  '单地址或双地址（含 System / Custom / 99+ Tag）。':
    'Single or dual address (includes System / Custom / 99+ Tag).',
  '地址 Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。':
    'Address Tooltip interaction: hover expands on hover; focus (Tab) expands on focus.',
  '带符号的对话': 'Symbol dialog',
  '业务对话': 'Business dialog',
  '邮箱验证': 'Email verification',
  'Google 验证': 'Google verification',
  '登录密码': 'Login password',
  '交易密码': 'Transaction password',
  '通行密钥': 'Passkey',
  '账户锁定': 'Account locked',
  '详情': 'Detail',
  '提醒': 'Reminder',
  '安全': 'Security',
  '符号': 'Icon',
  '符号组合': 'Icon combo',
  '文本': 'Text',
  '分页器组': 'Pagination group',
  '状态': 'Status',
  '彩色': 'Colorful',
  '业务': 'Business',
  '类型': 'Type',
  '尺寸': 'Size',
  '宽度': 'Width',
  '高度': 'Height',
  '单位': 'Unit',
  '清空': 'Clear',
  '禁用': 'Disabled',
  '只读': 'Read-only',
  '交互': 'Interaction',
  '场景化': 'Scenes',
  '样式': 'Style',
  '竖线色': 'Vertical line color',
  '头部': 'Header',
  '内容区 1': 'Content area 1',
  '内容区 2': 'Content area 2',
  '模块标题': 'Module title',
  '模块名称': 'Module name',
  '应用入口名称': 'App entry name',
  '主内容': 'Main content',
  '关闭': 'Close',
  '溢出测试': 'Overflow test',
  '下拉设置': 'Dropdown settings',
  '设计参考': 'Design reference',
  '确定': 'Confirm',
  '取消': 'Cancel',
  '保存': 'Save',
  '返回': 'Back',
  '预览': 'Preview',
  '自定义': 'Custom',
  '编辑': 'Edit',
  '高级模式': 'Advanced mode',
  '正常模式': 'Normal mode',
  '较慢': 'Slow',
  '正常': 'Normal',
  '快速': 'Fast',
  '推荐': 'Recommended',
  '支付方式': 'Payment method',
  '能量模式': 'Energy mode',
  '充值': 'Top up',
  '预计总矿工费': 'Estimated total gas fee',
  '共': 'Total',
  '笔交易': 'transactions',
  '按钮': 'Button',
  '标签': 'Tag',
  '标题': 'Title',
  '文案': 'Copy',
  '图标': 'Icon',
  '地址': 'Address',
  '默认': 'Default',
  '固定': 'Fixed',
  '自适应': 'Adaptive',
  '全宽': 'Full width',
  '展开': 'Expanded',
  '折叠': 'Collapsed',
  '选中': 'Selected',
  '激活': 'Active',
  '可见': 'Visible',
  '隐藏': 'Hidden',
  '开启': 'On',
  '关闭': 'Off',
  '显示': 'Show',
  '触发': 'Trigger',
  '点击': 'Click',
  '悬停': 'Hover',
  '聚焦': 'Focus',
  '失焦': 'Blur',
  '左侧': 'Leading',
  '右侧': 'Trailing',
  '顶部': 'Top',
  '底部': 'Bottom',
  '水平': 'Horizontal',
  '垂直': 'Vertical',
  '滚动': 'Scroll',
  '动画': 'Animation',
  '动效': 'Motion',
  '验证': 'Verification',
  '校验': 'Validation',
  '提交': 'Submit',
  '加载': 'Loading',
  '空态': 'Empty state',
  '多选': 'Multi-select',
  '单选': 'Single-select',
  '批选': 'Batch select',
  '分页': 'Pagination',
  '筛选': 'Filter',
  '排序': 'Sort',
  '复制': 'Copy',
  '粘贴': 'Paste',
  '删除': 'Delete',
  '新增': 'Add',
  '编辑行': 'Edit row',
  '导航': 'Navigation',
  '模块': 'Module',
  '菜单': 'Menu',
  '列表': 'List',
  '表格': 'Table',
  '行': 'Row',
  '列': 'Column',
  '单元格': 'Cell',
  '插槽': 'Slot',
  '预置': 'Preset',
  '外壳': 'Shell',
  '面板': 'Panel',
  '浮层': 'Overlay',
  '弹窗': 'Popup',
  '对话框': 'Dialog',
  '详情页': 'Detail page',
  '工具栏': 'Toolbar',
  '分割线': 'Divider',
  '间距': 'Spacing',
  '圆角': 'Radius',
  '阴影': 'Shadow',
  '毛玻璃': 'Frosted glass',
  '溢出': 'Overflow',
  '截断': 'Truncate',
  '省略': 'Ellipsis',
  '对齐': 'Align',
  '方向': 'Direction',
  '位置': 'Position',
  '偏移': 'Offset',
  '间距': 'Gap',
  '内边距': 'Padding',
  '外边距': 'Margin',
  '边框': 'Border',
  '背景': 'Background',
  '前景': 'Foreground',
  '主题': 'Theme',
  '色调': 'Tone',
  '品牌': 'Brand',
  '危险': 'Danger',
  '成功': 'Success',
  '警告': 'Warning',
  '信息': 'Info',
  '备注': 'Notes',
  '说明': 'Description',
  '描述': 'Description',
  '名称': 'Name',
  '数值': 'Value',
  '数量': 'Count',
  '金额': 'Amount',
  '费率': 'Fee rate',
  '带宽': 'Bandwidth',
  '能量': 'Energy',
  '资源': 'Resources',
  '团队': 'Team',
  '账户': 'Account',
  '余额': 'Balance',
  '交易': 'Transaction',
  '地址簿': 'Address book',
  '内部地址': 'Internal address',
  '最近交易': 'Recent transactions',
  '无': 'None',
  '空': 'Empty',
  '同': 'Same as',
  '与': 'and',
  '或': 'or',
  '且': 'and',
  '时': 'when',
  '的': ' ',
  '了': '',
  '在': 'in',
  '为': 'as',
  '由': 'by',
  '从': 'from',
  '到': 'to',
  '将': 'will',
  '可': 'can',
  '需': 'requires',
  '须': 'must',
  '仅': 'only',
  '并': 'and',
  '且': 'and',
  '若': 'if',
  '则': 'then',
  '否': 'otherwise',
};

const WORD_MAP = Object.fromEntries(
  Object.entries(PHRASE_MAP).sort((a, b) => b[0].length - a[0].length),
);

const SENTENCE_RULES = [
  [/^是否(.+?)[。．]?$/, 'Whether $1.'],
  [/^(.+?)时触发[。．]?$/, 'Emitted when $1.'],
  [/^点击(.+?)时触发[。．]?$/, 'Emitted when $1 is clicked.'],
  [/^(.+?)文案[。．]?$/, '$1 copy.'],
  [/^(.+?)占位[。．]?$/, '$1 placeholder.'],
  [/^(.+?)标签[。．]?$/, '$1 label.'],
  [/^(.+?)类型[。．]?$/, '$1 type.'],
  [/^(.+?)尺寸[。．]?$/, '$1 size.'],
  [/^(.+?)宽度[。．]?$/, '$1 width.'],
  [/^(.+?)高度[。．]?$/, '$1 height.'],
  [/^同\s*(.+?)[。．]?$/, 'Same as $1.'],
  [/^默认(.+?)[。．]?$/, 'Default $1.'],
  [/^覆盖(.+?)[。．]?$/, 'Override $1.'],
  [/^控制(.+?)[。．]?$/, 'Controls $1.'],
  [/^设置(.+?)[。．]?$/, 'Sets $1.'],
  [/^开启后(.+?)[。．]?$/, 'When enabled, $1.'],
  [/^关闭时(.+?)[。．]?$/, 'When disabled, $1.'],
];

function applyPhraseMap(text) {
  let result = text;
  for (const [zh, en] of Object.entries(WORD_MAP)) {
    if (result.includes(zh)) {
      result = result.split(zh).join(en);
    }
  }
  return result.replace(/\s{2,}/g, ' ').trim();
}

function applySentenceRules(text) {
  for (const [re, repl] of SENTENCE_RULES) {
    if (re.test(text)) return text.replace(re, repl);
  }
  return text;
}

/** 保留英文 token / 代码片段，只翻译中文段 */
export function translateShowcaseDocZh(zh) {
  if (!hasCjk(zh)) return zh;

  let result = applySentenceRules(zh);
  result = applyPhraseMap(result);

  if (!hasCjk(result)) {
    return result.replace(/\s+\./g, '.').replace(/\s+,/g, ',').trim();
  }

  // 混合句：保留 Latin/code，移除残留单字噪声
  result = result
    .replace(/[。．；;]+/g, '. ')
    .replace(/[，、]/g, ', ')
    .replace(/[：:]/g, ': ')
    .replace(/[（(]/g, ' (')
    .replace(/[）)]/g, ') ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 最后兜底：若仍含 CJK，标注为 doc 串供人工改；但 EN locale 仍优于纯中文
  if (hasCjk(result)) {
    result = applyPhraseMap(zh);
    if (hasCjk(result)) {
      // 保留结构，前缀 Doc 避免完全中文
      return `[doc] ${applyPhraseMap(zh).replace(/[\u4e00-\u9fff]/g, '')}`.replace(/\s{2,}/g, ' ').trim() || `[doc] ${zh.slice(0, 20)}…`;
    }
  }

  if (!result.endsWith('.') && !result.endsWith(')') && zh.endsWith('。')) {
    result += '.';
  }
  return result;
}

function main() {
  const auditPath = path.join(i18nRoot, 'locales/_meta/zh-strings-audit.json');
  const cachePath = path.join(i18nRoot, 'locales/_meta/authoring-en-cache.json');
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const existing = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};

  const cache = { ...existing };
  let added = 0;
  for (const { zh } of audit.strings) {
    if (cache[zh] && !hasCjk(cache[zh])) continue;
    const en = translateShowcaseDocZh(zh);
    if (en && en !== zh && !hasCjk(en)) {
      cache[zh] = en;
      added += 1;
    }
  }

  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
  const covered = audit.strings.filter(({ zh }) => cache[zh] && !hasCjk(cache[zh])).length;
  console.log(`Cache: ${Object.keys(cache).length} entries (+${added}); covered ${covered}/${audit.count}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
