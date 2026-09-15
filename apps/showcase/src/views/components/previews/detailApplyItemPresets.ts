import { tokenLabel, tokenOption } from '@/data/showcasePropLabels';
import {
  detailApplyItemVariantIds,
  detailApplyItemVariants,
  type DetailApplyItemVariantId,
} from '@eds/desktop-components';

/** Figma Apply_Item@Cregis — node 2267:11092 */
export const detailApplyItemFigmaNode = '2267:11092';

/** Apply_Item 变体 — 定制下拉「中文 + 英文 token」 */
const detailApplyItemPresetZh: Record<DetailApplyItemVariantId, string> = {
  crypto: tokenLabel('Token', '代币', 'crypto'),
  'initiated-by': tokenLabel('Initiator', '发起人', 'initiated-by'),
  status: tokenLabel('Status', '状态', 'status'),
  sender: tokenLabel('Sender', '发送方', 'sender'),
  receiver: tokenLabel('Receiver', '接收方', 'receiver'),
  time: tokenLabel('Time', '时间', 'time'),
  'brand-number': tokenLabel('Brand number', '品牌编号', 'brand-number'),
  'tripartite-number': tokenLabel('Third-party number', '三方编号', 'tripartite-number'),
  remark: tokenLabel('Remark', '备注', 'remark'),
  memo: tokenLabel('Memo', '备忘', 'memo'),
  txid: tokenLabel('Transaction ID', '交易 ID', 'txid'),
  text: tokenLabel('Text', '文本', 'text'),
  fee: tokenLabel('Fee', '手续费', 'fee'),
  amount: tokenLabel('Amount', '金额', 'amount'),
  type: tokenLabel('Type', '类型', 'type'),
  reason: tokenLabel('Reason', '原因', 'reason'),
  ip: tokenLabel('IP', 'IP', 'ip'),
};

export const detailApplyItemDataSourceOptions = [
  tokenOption('Custom', '自定义', 'custom'),
  ...detailApplyItemVariants.map((variant) => ({
    value: variant.id,
    label: detailApplyItemPresetZh[variant.id],
  })),
];

export { detailApplyItemVariantIds, detailApplyItemVariants, type DetailApplyItemVariantId };
