import { formatGroupedAmountText } from '../../utils/formatGroupedAmountText';
import type { MinerFeeTranslate } from './minerFeeTranslate';

export type EvmMinerFeePaymentMethod = 'sponsored' | 'address';

export type EvmMinerFeePaymentSelection = EvmMinerFeePaymentMethod | null;

export type EvmMinerFeePaymentDemoQuote = {
  estimateCryptoLine: string;
  estimateUsd: string;
  estimateLine: string;
  deductEth: string;
  gasAccountBalance: string;
  /** true 时在「矿工费代付」卡片下展示 Gas 账户余额不足 + 充值。 */
  sponsoredGasBalanceInsufficient: boolean;
};

function formatPaymentEstimateCryptoLine(cryptoText: string): string {
  const match = cryptoText.trim().match(/^([\d,.]+)(\s+.*)$/);
  if (!match) {
    return formatGroupedAmountText(cryptoText);
  }
  const [, rawAmount, symbolSuffix] = match;
  const normalized = rawAmount.replace(/,/g, '');
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return cryptoText;
  }
  const fractionDigits = normalized.includes('.')
    ? normalized.length - normalized.indexOf('.') - 1
    : 0;
  return `${formatGroupedAmountText(numeric.toFixed(fractionDigits))} ${symbolSuffix.trim()}`;
}

/** Showcase / 演示：支付方式步预计费用（独立 mock，不与档位列表共用区间文案）。 */
export function resolveEvmPaymentDemoQuote(
  ui: MinerFeeTranslate,
  _symbol = 'ETH',
): EvmMinerFeePaymentDemoQuote {
  const cryptoText = ui('Miner fee evm payment estimate crypto');
  const usdText = ui('Miner fee evm payment estimate usd');
  const gasAccountBalance = ui('Miner fee evm payment gas account balance eth sufficient');
  const estimateCryptoLine = formatPaymentEstimateCryptoLine(cryptoText);
  const estimateUsd = formatGroupedAmountText(usdText);
  const estimateLine = `${estimateCryptoLine} ≈ ${estimateUsd}`;
  const deductEth = cryptoText.split(' ')[0]?.replace(/,/g, '') ?? '0';
  return {
    estimateCryptoLine,
    estimateUsd,
    estimateLine,
    deductEth,
    gasAccountBalance,
    sponsoredGasBalanceInsufficient: false,
  };
}

/** 演示：Gas 账户余额低于预计扣款（仅 mock 指定行使用）。 */
export function resolveEvmPaymentDemoQuoteInsufficient(
  ui: MinerFeeTranslate,
  symbol = 'ETH',
): EvmMinerFeePaymentDemoQuote {
  const base = resolveEvmPaymentDemoQuote(ui, symbol);
  const lowBalance = ui('Miner fee evm payment gas account balance eth');
  return {
    ...base,
    gasAccountBalance: lowBalance,
    sponsoredGasBalanceInsufficient: isEvmGasAccountBalanceInsufficient(
      lowBalance,
      base.deductEth,
    ),
  };
}

/** 覆盖演示报价（业务 mock 按行切换异常态）。 */
export function withEvmPaymentDemoQuoteOverrides(
  base: EvmMinerFeePaymentDemoQuote,
  overrides: Partial<EvmMinerFeePaymentDemoQuote>,
): EvmMinerFeePaymentDemoQuote {
  return { ...base, ...overrides };
}

export function buildEvmSponsoredMinerFeeDisplay(
  ui: MinerFeeTranslate,
  symbol = 'ETH',
): string {
  const quote = resolveEvmPaymentDemoQuote(ui, symbol);
  return quote.estimateLine;
}

export function isEvmGasAccountBalanceInsufficient(
  gasAccountBalance: string,
  deductEth: string,
): boolean {
  const balance = Number.parseFloat(gasAccountBalance);
  const required = Number.parseFloat(deductEth);
  if (!Number.isFinite(balance) || !Number.isFinite(required)) {
    return false;
  }
  return balance < required;
}
