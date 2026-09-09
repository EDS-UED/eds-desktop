import type { CryptoAddressSideTags } from '@eds/desktop-components';
import { resolveSampleAddressForSymbol } from '@/views/scenes/previews/listFieldCryptoSampleAddresses';

export const tooltipFlotationMultiAddressCount = 6;

export const tooltipFlotationMultiAddressPrimary = resolveSampleAddressForSymbol('ZEC', 1);

export const tooltipFlotationMultiAddressSecondary = resolveSampleAddressForSymbol('ZEC', 2);

export const tooltipFlotationMultiAddressList = Array.from(
  { length: tooltipFlotationMultiAddressCount },
  (_, index) => resolveSampleAddressForSymbol('ZEC', index + 1),
);

export const tooltipFlotationMultiAddressFromTags: CryptoAddressSideTags = {
  system: [
    {
      show: true,
      size: 'sm',
      label: 'Risk',
      systemType: 'solid-red',
    },
  ],
};

export const tooltipFlotationMultiAddressToTags: CryptoAddressSideTags = {
  custom: [
    {
      show: true,
      size: 'sm',
      label: 'Custom',
      customStyle: 'vermilion',
    },
    {
      show: true,
      size: 'sm',
      label: 'Tag 2',
      customStyle: 'clear-sky',
    },
    {
      show: true,
      size: 'sm',
      label: 'Tag 3',
      customStyle: 'orchid',
    },
  ],
};
