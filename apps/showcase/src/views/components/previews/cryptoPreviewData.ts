import { cryptoNames, getProcessedCrypto } from '@eds/desktop-components';
import { showcaseText } from '@/data/showcasePropLabels';

export function getRegisteredCryptoCount(): number {
  return cryptoNames.filter((name) => Boolean(getProcessedCrypto(name))).length;
}

export function getCryptoPageLead(count = getRegisteredCryptoCount()): string {
  return showcaseText(
    `${count} assets; name matches packages/components/src/atoms/crypto/*.svg filenames (without .svg). Gallery display names strip the eds- prefix via formatCryptoDisplayName; kind via resolveCryptoAssetKind. SVG renders as-is — no recolor or structural rewrite.`,
    `共 ${count} 个资产；name 与 packages/components/src/atoms/crypto/*.svg 文件名一致（不含 .svg）。画廊展示名通过 formatCryptoDisplayName 去掉 eds- 前缀；类型见 resolveCryptoAssetKind。SVG 原样渲染，不做换色或结构改写。`,
  );
}
