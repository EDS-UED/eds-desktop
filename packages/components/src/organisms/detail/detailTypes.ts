import type { CryptoAddressSideTags } from '../../molecules/crypto-combo/cryptoAddressTypes';
import type { FormSubmissionType } from '../../molecules/feedback/FormSubmission.vue';

export type DetailItemValueAddressSideFeedback = {
  type?: FormSubmissionType;
  text: string;
  showLink?: boolean;
};

export type DetailValueType = 'text' | 'crypto' | 'user';

export type DetailValueSymbolKind = 'crypto' | 'avatar';

export type DetailItemTagFamily = 'system' | 'status';

export type DetailItemTagStatus = 'danger' | 'warning' | 'success' | 'ready' | 'invalid';

export type DetailItemTagSystemType =
  | 'subtle'
  | 'solid-brand'
  | 'solid-red'
  | 'gray'
  | 'stroke-subtle'
  | 'stroke-solid';

/** Sender / Receiver — 单地址 · 多地址默认 · 多地址展开 · 数量 Orders（Figma 2267:11822 / 2267:11830） */
export type DetailAddressLayout =
  | 'single'
  | 'multi-collapsed'
  | 'multi-expanded'
  | 'multi-orders';

export type DetailItemValueEntry = {
  value: string;
  tag?: string;
  tagFamily?: DetailItemTagFamily;
  tagStatus?: DetailItemTagStatus;
  tagSystemType?: DetailItemTagSystemType;
  tagBeforeValue?: boolean;
  /** 展开态下行尾虚线分隔（最后一行不加） */
  dashed?: boolean;
  /** Sender / Receiver 地址行内 Tag（与 EgCryptoAddress 对齐）。 */
  valueAddressSideTags?: CryptoAddressSideTags;
  /** 展示全部 Tag（不折叠 +N）。 */
  valueAddressSideTagsRevealAll?: boolean;
  /** Tag 置于别名/地址行下方。 */
  valueAddressSideTagsBelow?: boolean;
  /** Tag 下方 EgFormSubmission 反馈（如黑名单提示）。 */
  valueAddressSideFeedback?: DetailItemValueAddressSideFeedback;
  /** 次要 value 文案（60% 字色，如钱包编号）。 */
  valueMuted?: boolean;
};

export type DetailItemData = {
  key?: string;
  title: string;
  /** Title 区 leading 图标；Apply_Item 变体行请用 createDetailApplyItemRow，勿手改挂件。 */
  titleIcon?: string;
  showTitleIcon?: boolean;
  value: string;
  valueIcon?: string;
  valueType?: DetailValueType;
  tag?: string;
  /** Value 区 Tag 语义族（默认 system · stroke-subtle） */
  tagFamily?: DetailItemTagFamily;
  tagStatus?: DetailItemTagStatus;
  tagSystemType?: DetailItemTagSystemType;
  /** 仅渲染 Tag、不展示 value 文案（如 Status 行） */
  valueTagOnly?: boolean;
  /** Tag 在 value 文案之前（如 Sender / Receiver 品牌 pill） */
  tagBeforeValue?: boolean;
  /** Value 区 leading 符号（币种 / 头像） */
  showValueSymbol?: boolean;
  valueSymbolKind?: DetailValueSymbolKind;
  valueSymbolCrypto?: string;
  valueSymbolAvatarName?: string;
  /** Value 区 trailing：Link → Copy → AddressBook → AML → Browser */
  showValueLink?: boolean;
  valueLinkLabel?: string;
  showValueCopy?: boolean;
  showValueAddressBook?: boolean;
  showValueAmlSearch?: boolean;
  showValueBrowser?: boolean;
  /** Figma Popup Detail-Item · Dashed=Yes — 行下缩进分隔线 */
  dashed?: boolean;
  /** Sender / Receiver 地址展示形态；默认 single */
  addressLayout?: DetailAddressLayout;
  /** 多地址条目；首条与 value/tag 对齐，展开态渲染全部 */
  valueEntries?: DetailItemValueEntry[];
  /** 多地址默认态计数；省略时用 valueEntries.length */
  addressCount?: number;
  /** 多地址默认态「查看更多」链文案；有值时渲染 EgLinkButton */
  addressViewMoreLabel?: string;
  /** 同一行内连续展示多条 value 文案（如钱包名 + 编号）。 */
  inlineValueEntries?: boolean;
  /** 复制按钮写入剪贴板的文案；省略时用 entry.value。 */
  valueCopyText?: string;
};

export type DetailSectionData = {
  key?: string;
  title?: string;
  items: DetailItemData[];
  showCollapse?: boolean;
  collapseLabel?: string;
  showDivider?: boolean;
};

export function createDefaultDetailSections(sectionTitle = 'Section'): DetailSectionData[] {
  const sampleItem = (key: string): DetailItemData => ({
    key,
    title: 'Title',
    titleIcon: 'eds-add',
    value: 'Value',
    valueIcon: 'eds-zec-zcash',
    valueType: 'crypto',
    tag: 'Tag',
  });

  return [
    {
      key: 'section-a',
      title: sectionTitle,
      showDivider: true,
      showCollapse: true,
      items: [sampleItem('a1'), sampleItem('a2'), sampleItem('a3')],
    },
    {
      key: 'section-b',
      showCollapse: true,
      items: [sampleItem('b1'), sampleItem('b2'), sampleItem('b3')],
    },
  ];
}
