import type { ShowcaseLocale } from '@/data/i18n/types';
import type { ModuleMenuPresetGroup } from './cregisModuleMenuGroups';

type LocaleLabelMap = Partial<Record<ShowcaseLocale, string>> & { 'en-US': string };

/** Cregis Tasks 菜单 — 英文 key 保留给 itemSelect；Showcase 按 locale 显示中文。 */
const CREGIS_MODULE_MENU_SHOWCASE_LABELS: Record<string, LocaleLabelMap> = {
  'To Do': {
    'en-US': 'To Do',
    'zh-CN': '待办',
    'zh-TW': '待辦',
    'zh-HK': '待辦',
  },
  Approval: {
    'en-US': 'Approval',
    'zh-CN': '待审批',
    'zh-TW': '待審批',
    'zh-HK': '待審批',
  },
  Signing: {
    'en-US': 'Signing',
    'zh-CN': '待签名',
    'zh-TW': '待簽名',
    'zh-HK': '待簽名',
  },
  Completed: {
    'en-US': 'Completed',
    'zh-CN': '已办',
    'zh-TW': '已辦',
    'zh-HK': '已辦',
  },
  Approved: {
    'en-US': 'Approved',
    'zh-CN': '已审批',
    'zh-TW': '已審批',
    'zh-HK': '已審批',
  },
  Signed: {
    'en-US': 'Signed',
    'zh-CN': '已签名',
    'zh-TW': '已簽名',
    'zh-HK': '已簽名',
  },
  'All Records': {
    'en-US': 'All Records',
    'zh-CN': '全部',
    'zh-TW': '全部',
    'zh-HK': '全部',
  },
  'Sent Request': {
    'en-US': 'Sent Request',
    'zh-CN': '我发起的',
    'zh-TW': '我發起的',
    'zh-HK': '我發起的',
  },
  'Sub-Address': {
    'en-US': 'Sub-Address',
    'zh-CN': '子地址管理',
    'zh-TW': '子地址管理',
    'zh-HK': '子地址管理',
  },
  'Payout Record': {
    'en-US': 'Payout Record',
    'zh-CN': '提币记录',
    'zh-TW': '提幣記錄',
    'zh-HK': '提幣記錄',
  },
  'Wallet Payout': {
    'en-US': 'Wallet Payout',
    'zh-CN': '钱包提币',
    'zh-TW': '錢包提幣',
    'zh-HK': '錢包提幣',
  },
  'Sub-Address Payout': {
    'en-US': 'Sub-Address Payout',
    'zh-CN': '子地址提币',
    'zh-TW': '子地址提幣',
    'zh-HK': '子地址提幣',
  },
  Transactions: {
    'en-US': 'Transactions',
    'zh-CN': '交易记录',
    'zh-TW': '交易記錄',
    'zh-HK': '交易記錄',
  },
  History: {
    'en-US': 'History',
    'zh-CN': '历史记录',
    'zh-TW': '歷史記錄',
    'zh-HK': '歷史記錄',
  },
  Processing: {
    'en-US': 'Processing',
    'zh-CN': '处理中',
    'zh-TW': '處理中',
    'zh-HK': '處理中',
  },
  Collection: {
    'en-US': 'Collection',
    'zh-CN': '归集',
    'zh-TW': '歸集',
    'zh-HK': '歸集',
  },
  'Rule Configuration': {
    'en-US': 'Rule Configuration',
    'zh-CN': '规则配置',
    'zh-TW': '規則配置',
    'zh-HK': '規則配置',
  },
  'Task Record': {
    'en-US': 'Task Record',
    'zh-CN': '任务记录',
    'zh-TW': '任務記錄',
    'zh-HK': '任務記錄',
  },
  'API Collection': {
    'en-US': 'API Collection',
    'zh-CN': 'API归集',
    'zh-TW': 'API歸集',
    'zh-HK': 'API歸集',
  },
  'Collection Record': {
    'en-US': 'Collection Record',
    'zh-CN': '归集记录',
    'zh-TW': '歸集記錄',
    'zh-HK': '歸集記錄',
  },
  Callback: {
    'en-US': 'Callback',
    'zh-CN': '回调记录',
    'zh-TW': '回調記錄',
    'zh-HK': '回調記錄',
  },
  'Callback Error': {
    'en-US': 'Callback Error',
    'zh-CN': '异常回调',
    'zh-TW': '異常回調',
    'zh-HK': '異常回調',
  },
  'History Callback': {
    'en-US': 'History Callback',
    'zh-CN': '历史回调',
    'zh-TW': '歷史回調',
    'zh-HK': '歷史回調',
  },
  Settings: {
    'en-US': 'Settings',
    'zh-CN': '设置',
    'zh-TW': '設置',
    'zh-HK': '設置',
  },
  'Payment Record': {
    'en-US': 'Payment Record',
    'zh-CN': '支付记录',
    'zh-TW': '支付記錄',
    'zh-HK': '支付記錄',
  },
  'Settlement Record': {
    'en-US': 'Settlement Record',
    'zh-CN': '结算记录',
    'zh-TW': '結算記錄',
    'zh-HK': '結算記錄',
  },
  'Payment Exception Record': {
    'en-US': 'Payment Exception Record',
    'zh-CN': '异常支付单记录',
    'zh-TW': '異常支付單記錄',
    'zh-HK': '異常支付單記錄',
  },
  'Order Record': {
    'en-US': 'Order Record',
    'zh-CN': '订单记录',
    'zh-TW': '訂單記錄',
    'zh-HK': '訂單記錄',
  },
  'Bulk Transfer Record': {
    'en-US': 'Bulk Transfer Record',
    'zh-CN': '批量转账记录',
    'zh-TW': '批量轉賬記錄',
    'zh-HK': '批量轉賬記錄',
  },
  'Refund Record': {
    'en-US': 'Refund Record',
    'zh-CN': '退款记录',
    'zh-TW': '退款記錄',
    'zh-HK': '退款記錄',
  },
  'Policy Settings': {
    'en-US': 'Policy Settings',
    'zh-CN': '策略',
    'zh-TW': '策略',
    'zh-HK': '策略',
  },
  Automation: {
    'en-US': 'Automation',
    'zh-CN': '自动化',
    'zh-TW': '自動化',
    'zh-HK': '自動化',
  },
  AML: {
    'en-US': 'AML',
    'zh-CN': 'AML',
    'zh-TW': 'AML',
    'zh-HK': 'AML',
  },
  Logs: {
    'en-US': 'Logs',
    'zh-CN': '日志',
    'zh-TW': '日誌',
    'zh-HK': '日誌',
  },
  'Address Book': {
    'en-US': 'Address Book',
    'zh-CN': '地址簿',
    'zh-TW': '地址簿',
    'zh-HK': '地址簿',
  },
  Whitelist: {
    'en-US': 'Whitelist',
    'zh-CN': '白名单',
    'zh-TW': '白名單',
    'zh-HK': '白名單',
  },
  Blacklist: {
    'en-US': 'Blacklist',
    'zh-CN': '黑名单',
    'zh-TW': '黑名單',
    'zh-HK': '黑名單',
  },
};

export function createCregisModuleMenuShowcaseTranslate(
  locale: ShowcaseLocale,
): (text: string) => string {
  return (text: string) => {
    const entry = CREGIS_MODULE_MENU_SHOWCASE_LABELS[text];
    if (!entry) return text;
    return entry[locale] ?? entry['en-US'] ?? text;
  };
}

export function translateCregisModuleMenuPresetGroups(
  groups: ModuleMenuPresetGroup[],
  locale: ShowcaseLocale,
): ModuleMenuPresetGroup[] {
  const translate = createCregisModuleMenuShowcaseTranslate(locale);

  return groups.map((group) => ({
    ...group,
    title: group.title ? translate(group.title) : undefined,
    items: group.items.map((item) => ({
      ...item,
      label: translate(item.label),
      subitems: item.subitems?.map((subItem) => ({
        ...subItem,
        label: translate(subItem.label),
      })),
    })),
  }));
}
