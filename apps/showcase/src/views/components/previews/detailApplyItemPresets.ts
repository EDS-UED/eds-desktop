import { tokenLabel, tokenOption } from '@/data/showcasePropLabels';
import {
  detailApplyItemVariantIds,
  detailApplyItemVariants,
  type DetailApplyItemVariantId,
} from '@eds/desktop-components';

/** Figma Apply_Item@Cregis — node 2267:11092 */
export const detailApplyItemFigmaNode = '2267:11092';

/** Apply_Item 变体 — 定制下拉「中文 + 英文」 */
const detailApplyItemPresetZh: Record<DetailApplyItemVariantId, string> = {
  crypto: '代币',
  'initiated-by': '发起人',
  status: '状态',
  sender: '发送方',
  receiver: '接收方',
  time: '时间',
  'brand-number': '品牌编号',
  'tripartite-number': '三方编号',
  remark: '备注',
  memo: '备忘',
  txid: '交易 ID',
  text: '文本',
  fee: '手续费',
  amount: '金额',
  type: '类型',
  reason: '原因',
  ip: 'IP',
};

export const detailApplyItemDataSourceOptions = [
  tokenOption('自定义', 'custom'),
  ...detailApplyItemVariants.map((variant) => ({
    value: variant.id,
    label: tokenLabel(detailApplyItemPresetZh[variant.id], variant.label),
  })),
];

export { detailApplyItemVariantIds, detailApplyItemVariants, type DetailApplyItemVariantId };
