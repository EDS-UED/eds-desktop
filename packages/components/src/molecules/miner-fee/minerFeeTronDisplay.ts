import { formatGroupedAmountText, formatGroupedTemplateValue } from '../../utils/formatGroupedAmountText';

export type TronMinerFeeQuote = {
  bandwidth: number;
  energy: number;
  availableBandwidth: number;
  availableEnergy: number;
  /** >0 时展示「接收方未激活」说明。 */
  activationExtraTrx: number;
  /** true 时展示团队余额不足 + 充值链。 */
  teamBalanceInsufficient: boolean;
  estimatedTrx: string;
  estimatedUsd: string;
  estimatedUsdOriginal: string;
};

/** TRON 演示用固定资源与能量模式报价（含异常态演示）。 */
export function resolveTronMinerFeeQuote(): TronMinerFeeQuote {
  return {
    bandwidth: 2_003_345,
    energy: 1_000_885,
    availableBandwidth: 1200,
    availableEnergy: 560,
    activationExtraTrx: 0,
    teamBalanceInsufficient: false,
    estimatedTrx: '6.75',
    estimatedUsd: '$10.09',
    estimatedUsdOriginal: '$12.08',
  };
}

export function fillMinerFeeUiTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, formatGroupedTemplateValue(value)),
    template,
  );
}

export function buildTronMinerFeeDisplay(quote?: TronMinerFeeQuote): string {
  const resolved = quote ?? resolveTronMinerFeeQuote();
  return formatGroupedAmountText(`预计费用: ${resolved.estimatedUsd}`);
}
