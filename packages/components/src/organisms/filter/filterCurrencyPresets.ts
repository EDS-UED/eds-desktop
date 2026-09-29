import { cryptoNames, getProcessedCrypto, type CryptoName } from '../../atoms/crypto';

export type FilterCurrencyNetwork = {
  key: string;
  label: string;
  cryptoName: CryptoName;
};

export type FilterCurrencyPreset = {
  /** 与 consumer currencyKey 一致：`{rowIndex}-{symbol}`。 */
  id: string;
  cryptoName: CryptoName;
  /** 与 consumer symbol 一致。 */
  label: string;
  multiChain?: boolean;
  /** 与 consumer chainCount 一致。 */
  messageText?: string;
  modeTag?: string;
  networks?: readonly FilterCurrencyNetwork[];
};

/** 与 consumer WaasSubAddressCurrencyPicker 一致。 */
export const FILTER_CURRENCY_PICKER_WIDTH = 280;
export const FILTER_CURRENCY_PICKER_HEIGHT = 360;
export const FILTER_CURRENCY_CASCADE_PICKER_HEIGHT = 480;
export const FILTER_CURRENCY_OPTION_COUNT = 28;

/** 多链级联子菜单网络项（顺序与 design / consumer 一致）。 */
export const FILTER_CURRENCY_NETWORK_OPTIONS: readonly FilterCurrencyNetwork[] = [
  { key: 'btc-omni', label: 'Bitcoin (OMNI)', cryptoName: 'eds-btc-bitcoin' },
  { key: 'eth-erc20', label: 'Ethereum Mainnet (ERC20)', cryptoName: 'Ethereum Mainnet' },
  { key: 'tron-trc20', label: 'Tron (TRC20)', cryptoName: 'eds-trx-tron' },
  { key: 'sol', label: 'Solana', cryptoName: 'eds-sol-solana' },
  { key: 'avax-c', label: 'Avalanche C', cryptoName: 'eds-avax-avalanche' },
  { key: 'near', label: 'Near', cryptoName: 'eds-near-near protocol' },
  { key: 'linea', label: 'Linea Mainnet', cryptoName: 'Linea Mainnet' },
  { key: 'sei', label: 'Sei', cryptoName: 'Sei' },
  { key: 'ton', label: 'The Open Network', cryptoName: 'The Open Network' },
  { key: 'base', label: 'Base', cryptoName: 'Ethereum Mainnet' },
  { key: 'bsc', label: 'BNB Smart Chain', cryptoName: 'eds-bnb-binance coin' },
  { key: 'unichain', label: 'Unichain', cryptoName: 'Unichain' },
  { key: 'arb', label: 'Arbitrum One', cryptoName: 'Arbitrum One' },
];

const MULTI_CHAIN_SYMBOLS = new Set(['USDT', 'USDC', 'MNT']);

type CurrencyRowPreset = {
  symbol: string;
  cryptoName: CryptoName;
};

/** 与 consumer tasksListFieldCurrencyRowPresets 前 8 行一致。 */
const CURRENCY_ROW_PRESETS: readonly CurrencyRowPreset[] = [
  { symbol: 'USDT', cryptoName: 'eds-usdt-tether usd' },
  { symbol: 'TON', cryptoName: 'eds-ton-toncoin' },
  { symbol: 'ZEC', cryptoName: 'eds-zec-zcash' },
  { symbol: 'AAVE', cryptoName: 'eds-aave-aave' },
  { symbol: 'MNT', cryptoName: 'eds-mnt-mantle' },
  { symbol: 'GBG', cryptoName: 'eds-bgb-bitget token' },
  { symbol: '1INCH', cryptoName: 'eds-1inch-1inch network' },
  { symbol: 'DEEP', cryptoName: 'eds-deep-deepbook protocol' },
];

const FIXED_CURRENCY_PRESET_ROW_COUNT = CURRENCY_ROW_PRESETS.length;

const CURRENCY_ROW_PRESET_OVERRIDES: Partial<Record<number, CurrencyRowPreset>> = {
  18: { symbol: 'TRX', cryptoName: 'eds-trx-tron' },
  19: { symbol: 'BTC', cryptoName: 'eds-btc-bitcoin' },
};

const CURRENCY_PRESET_SYMBOLS = new Set([
  ...CURRENCY_ROW_PRESETS.map((preset) => preset.symbol),
  ...Object.values(CURRENCY_ROW_PRESET_OVERRIDES).map((preset) => preset!.symbol),
  'ADA',
  'FIL',
  'TRX',
]);

function extractTickerFromCryptoName(name: CryptoName): string {
  const ticker = name.split('-')[1]?.trim().toUpperCase();
  return ticker ?? '';
}

function resolveCryptoNameFromSymbol(symbol: string): CryptoName | undefined {
  const query = symbol.trim().toLowerCase();
  if (!query) return undefined;

  const registered = cryptoNames.filter((name) => Boolean(getProcessedCrypto(name))) as CryptoName[];
  const matches = registered.filter((name) => name.toLowerCase().includes(query));
  if (matches.length === 0) return undefined;

  matches.sort((a, b) => {
    const score = (name: string) => {
      const lower = name.toLowerCase();
      const parts = lower.split('-');
      if (parts[1] === query) return 0;
      if (parts[1]?.startsWith(query)) return 1;
      if (lower.startsWith(`eds-${query}`)) return 2;
      if (lower.includes(query)) return 3;
      return 4;
    };
    const scoreDiff = score(a) - score(b);
    if (scoreDiff !== 0) return scoreDiff;
    return a.length - b.length || a.localeCompare(b);
  });

  return matches[0];
}

let randomCurrencyPoolCache: string[] | null = null;

function buildRandomCurrencyPool(): string[] {
  if (randomCurrencyPoolCache) return randomCurrencyPoolCache;

  const seen = new Set<string>();
  for (const name of cryptoNames) {
    if (!getProcessedCrypto(name)) continue;
    const ticker = extractTickerFromCryptoName(name);
    if (!ticker || CURRENCY_PRESET_SYMBOLS.has(ticker) || seen.has(ticker)) continue;
    if (!resolveCryptoNameFromSymbol(ticker)) continue;
    seen.add(ticker);
  }

  randomCurrencyPoolCache = [...seen].sort();
  return randomCurrencyPoolCache;
}

function resolveRandomCurrencySymbol(rowIndex: number): string {
  const pool = buildRandomCurrencyPool();
  if (pool.length === 0) return 'BTC';
  const offset = rowIndex - FIXED_CURRENCY_PRESET_ROW_COUNT;
  if (offset < 0) return pool[0] ?? 'BTC';
  return pool[offset % pool.length] ?? pool[0];
}

function resolveCurrencyRowPreset(rowIndex: number): CurrencyRowPreset {
  const override = CURRENCY_ROW_PRESET_OVERRIDES[rowIndex];
  if (override) return override;

  const fixed = CURRENCY_ROW_PRESETS[rowIndex];
  if (fixed) return fixed;

  const symbol = resolveRandomCurrencySymbol(rowIndex);
  return {
    symbol,
    cryptoName: resolveCryptoNameFromSymbol(symbol) ?? 'eds-zec-zcash',
  };
}

function buildFilterCurrencyOption(rowIndex: number): FilterCurrencyPreset {
  const preset = resolveCurrencyRowPreset(rowIndex);
  const multiChain = MULTI_CHAIN_SYMBOLS.has(preset.symbol);

  return {
    id: `${rowIndex}-${preset.symbol.toLowerCase()}`,
    label: preset.symbol,
    cryptoName: preset.cryptoName,
    ...(multiChain
      ? {
          multiChain: true,
          modeTag: '多链',
          messageText: String(FILTER_CURRENCY_NETWORK_OPTIONS.length),
          networks: FILTER_CURRENCY_NETWORK_OPTIONS,
        }
      : {}),
  };
}

/** Filter 币种条件值演示列表（与 consumer WaasSubAddress 28 行对齐）。 */
export const FILTER_CURRENCY_PRESETS: FilterCurrencyPreset[] = Array.from(
  { length: FILTER_CURRENCY_OPTION_COUNT },
  (_, rowIndex) => buildFilterCurrencyOption(rowIndex),
);

export function parseFilterCurrencyValue(raw: string): {
  currencyId: string;
  networkKey: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) return { currencyId: '', networkKey: '' };
  const [currencyId, networkKey = ''] = trimmed.split(':');
  return { currencyId: currencyId ?? '', networkKey };
}

export function resolveFilterCurrencyPreset(value: string): FilterCurrencyPreset | undefined {
  const { currencyId } = parseFilterCurrencyValue(value);
  if (!currencyId) return undefined;
  return FILTER_CURRENCY_PRESETS.find((option) => option.id === currencyId);
}
