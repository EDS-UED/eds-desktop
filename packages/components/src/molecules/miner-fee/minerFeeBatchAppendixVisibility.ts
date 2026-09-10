import {
  resolveMinerFeeBatchStubKind,
  type MinerFeeBatchProfileKind,
} from './minerFeeBatchStub';

export function isMinerFeeBatchAppendixVisible(params: {
  symbol: string;
  profileKind: MinerFeeBatchProfileKind;
  transactionCount: number;
  batchTotalDisplay: string;
  preferBatchTotalSummary?: boolean;
}): boolean {
  const stubKind = resolveMinerFeeBatchStubKind(
    params.symbol,
    params.profileKind,
    params.transactionCount,
  );
  const showStub = !params.preferBatchTotalSummary && stubKind != null;
  const showBatchTotal =
    params.transactionCount > 1
    && !showStub
    && params.batchTotalDisplay.length > 0;

  return showStub || showBatchTotal;
}
