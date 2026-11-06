import {
  resolveEvmPaymentDemoQuote,
  resolveEvmPaymentDemoQuoteInsufficient,
  resolveTronMinerFeeQuote,
  type EvmMinerFeePaymentDemoQuote,
  type MinerFeeTranslate,
  type TronMinerFeeQuote,
} from '@eds/desktop-components';
import { getShowcaseI18nRegistry } from '@/data/i18n/showcaseI18nRegistry';
import type { PopoverGasFeeNetwork } from './popoversDocCustomize';

function isChineseShowcaseLocale(locale: string): boolean {
  return locale === 'zh-CN' || locale === 'zh-TW' || locale === 'zh-HK';
}

/**
 * 与 work-cregis-desktop `uiTextZhCN` 对齐的矿工费 Popover 演示文案。
 * 数值报价仍来自 `@eds/desktop-components`（resolveTronGasFeeQuote 等）。
 */
const SHOWCASE_GAS_FEE_UI_TEXT: Record<string, string> = {
  Confirm: '确定',
  Cancel: '取消',
  Save: '保存',
  Back: '返回',
  Preview: '预览',
  Custom: '自定义',
  Edit: '编辑',
  'Gas fee': '矿工费',
  'Gas Fee': '矿工费',
  'Fee Rate': '费率',
  'Max Fee': 'Max Fee',
  'Max Priority Fee': 'Max Priority Fee',
  'Gas Price': 'Gas Price',
  'Gas Limit': 'Gas Limit',
  'Advanced mode': '高级模式',
  'Normal mode': '正常模式',
  'Miner fee speed slow': '较慢',
  'Miner fee speed normal': '正常',
  'Miner fee speed fast': '快速',
  'Miner fee fast eth range': '≤0.00266 ETH ~ 0.0003201 ETH',
  'Miner fee fast usd range': '≤$1.52 ~ 1.87',
  'Miner fee normal eth range': '≤0.001964 ETH ~ 0.0002198 ETH',
  'Miner fee normal usd range': '≤$0.43 ~ $0.49',
  'Miner fee slow eth range': '≤0.000808 ETH ~ 0.000812 ETH',
  'Miner fee slow usd range': '≤$0.26 ~ $0.31',
  'Miner fee fast btc range': '0.000000000877 BTC',
  'Miner fee fast btc usd range': '≈ $0.03',
  'Miner fee normal btc range': '0.000000000777 BTC',
  'Miner fee normal btc usd range': '≈ $0.02',
  'Miner fee slow btc range': '0.000000000677 BTC',
  'Miner fee slow btc usd range': '≈ $0.01',
  'Miner fee tron resources title': '本次交易所需资源',
  'Miner fee tron resources info aria label': '资源说明',
  'Miner fee tron resources info lead': '消耗资源=带宽+能量',
  'Miner fee tron resources info bandwidth label': '带宽：',
  'Miner fee tron resources info bandwidth body':
    '您只能使用免费带宽或质押带宽来支付交易费用。如果您的带宽不足，则需要支付全部费用。',
  'Miner fee tron resources info energy label': '能量：',
  'Miner fee tron resources info energy body':
    '如果地址的能量不足，扣除地址的全部能量后剩余能量可以TRX支付。',
  'Miner fee tron resources info footnote':
    '能量消耗是在假设用户将为所有资源付费的基础上计算的，而实际的链上数据可能会有所不同。',
  'Miner fee tron resources line': '{bandwidth} 带宽 + {energy} 能量',
  'Miner fee tron resources available title': '当前地址可用资源',
  'Miner fee tron resources energy value': '{energy} 能量',
  'Miner fee tron resources bandwidth value': '{bandwidth} 带宽',
  'Miner fee tron activation note': '接收方地址未激活，将额外消耗 {trx} TRX激活',
  'Miner fee tron payment mode': '支付方式',
  'Miner fee tron energy mode': '矿工费代付',
  'Miner fee tron recommended': '推荐',
  'Miner fee tron save percent': '节省50%',
  'Miner fee tron provider note': '由 Cregis 提供交易所需资源，费用将从团队账户扣除。',
  'Miner fee tron estimated cost primary': '预计费用: {usd}',
  'Miner fee tron estimated cost original': '{usd}',
  'Miner fee tron estimated cost usd': '≈ {usd}',
  'Miner fee tron team balance insufficient text': '团队余额不足',
  'Miner fee tron team balance recharge link': '充值',
  'Miner fee payment mode label': '支付方式',
  'Miner fee evm payment estimate label': '预计',
  'Miner fee evm payment estimate crypto': '0.000873 ETH',
  'Miner fee evm payment estimate usd': '$2.14',
  'Miner fee evm payment gas account balance eth': '0.00042',
  'Miner fee evm payment gas account balance eth sufficient': '2.5',
  'Miner fee evm payment estimate line': '预计：{estimate}',
  'Miner fee evm payment sponsored title': '矿工费代付',
  'Miner fee evm payment sponsored description':
    '由矿工费代付账户支付交易矿工费，将从 ETH Gas 账户扣除',
  'Miner fee evm payment address title': '地址支付',
  'Miner fee evm payment address description': '由发送方地址支付交易矿工费',
  'Miner fee evm payment gas balance line': '账户余额：{eth} ETH',
  'Miner fee evm payment balance insufficient text': '余额不足，请',
  'Miner fee evm payment balance recharge link': '充值',
  'Estimated total miner fee': '预计总矿工费',
  'Miner fee batch total suffix': '共',
  'Miner fee batch transaction suffix': '笔交易',
};

export function resolveShowcaseGasFeeUiText(key: string): string {
  const locale = getShowcaseI18nRegistry().locale;
  const zh = SHOWCASE_GAS_FEE_UI_TEXT[key];
  if (!zh) return key;
  return isChineseShowcaseLocale(locale) ? zh : key;
}

export const SHOWCASE_GAS_FEE_TOP_TOOL_TITLE = resolveShowcaseGasFeeUiText('Gas Fee');

/** Showcase 多笔演示默认笔数（与批签 mock 接近）。 */
export const SHOWCASE_GAS_FEE_BATCH_TRANSACTION_COUNT = 3;

export const showcaseGasFeeUi: MinerFeeTranslate = (key) => resolveShowcaseGasFeeUiText(key);

const SHOWCASE_GAS_FEE_SYMBOL: Partial<Record<PopoverGasFeeNetwork, string>> = {
  ethereum: 'ETH',
  ton: 'TON',
};

/** Showcase 演示：接收方未激活时的额外 TRX（与激活说明模板对齐）。 */
const SHOWCASE_TRON_DEMO_ACTIVATION_EXTRA_TRX = 2.5;

export type ShowcaseGasFeeFeedbackFlags = {
  evmBalanceInsufficient?: boolean;
  tronAddressInactive?: boolean;
  tronTeamBalanceInsufficient?: boolean;
};

export function resolveShowcaseGasFeePanelProps(
  network: PopoverGasFeeNetwork,
  multi = false,
  evmDisplayMode: 'sponsored' | 'address' = 'sponsored',
  feedback: ShowcaseGasFeeFeedbackFlags = {},
): {
  translate: MinerFeeTranslate;
  symbol?: string;
  transactionCount: number;
  evmSponsoredPaymentEnabled?: boolean;
  evmPaymentQuote?: EvmMinerFeePaymentDemoQuote;
  tronQuote?: TronMinerFeeQuote;
} {
  const {
    evmBalanceInsufficient = false,
    tronAddressInactive = false,
    tronTeamBalanceInsufficient = false,
  } = feedback;
  const symbol = SHOWCASE_GAS_FEE_SYMBOL[network];
  const transactionCount = multi ? SHOWCASE_GAS_FEE_BATCH_TRANSACTION_COUNT : 1;
  const base = symbol
    ? { translate: showcaseGasFeeUi, symbol, transactionCount }
    : { translate: showcaseGasFeeUi, transactionCount };
  if (network === 'ethereum') {
    const ethSymbol = symbol ?? 'ETH';
    const evmPaymentQuote = evmBalanceInsufficient
      ? resolveEvmPaymentDemoQuoteInsufficient(showcaseGasFeeUi, ethSymbol)
      : resolveEvmPaymentDemoQuote(showcaseGasFeeUi, ethSymbol);
    return {
      ...base,
      evmSponsoredPaymentEnabled: evmDisplayMode === 'sponsored',
      evmPaymentQuote,
    };
  }
  if (network === 'tron') {
    const tronQuote = resolveTronMinerFeeQuote();
    return {
      ...base,
      tronQuote: {
        ...tronQuote,
        activationExtraTrx: tronAddressInactive ? SHOWCASE_TRON_DEMO_ACTIVATION_EXTRA_TRX : 0,
        teamBalanceInsufficient: tronTeamBalanceInsufficient,
      },
    };
  }
  return base;
}
