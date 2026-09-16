export type TokenRow = { name: string; value: string };

export type ThemeTokenRow = { name: string; light: string; dark: string };

export function entriesToRows(record: Record<string, string>): TokenRow[] {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}

export function resolveTokenReference(
  value: string,
  lookup: Record<string, string>,
): string {
  const match = value.match(/^var\(--([^)]+)\)$/);
  if (!match) return value;
  const resolved = lookup[match[1]];
  if (!resolved) return value;
  return resolveTokenReference(resolved, lookup);
}

export function formatTokenDisplayValue(
  value: string,
  lookup: Record<string, string>,
): string {
  if (!/^var\(--/.test(value)) return value;
  const resolved = resolveTokenReference(value, lookup);
  if (resolved === value) return value;
  return `${value} / ${resolved}`;
}

export function entriesToResolvedRows(
  record: Record<string, string>,
  lookup: Record<string, string>,
): TokenRow[] {
  return Object.entries(record).map(([name, value]) => ({
    name,
    value: formatTokenDisplayValue(value, lookup),
  }));
}

export function formatStyleLabel(key: string): string {
  return key
    .replace(/^typography-/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatTextStyleMetrics(
  style: { 'font-size': string; 'line-height': string },
  typographySemantic: Record<string, string>,
  typographyBase: Record<string, string>,
): string {
  const lookup = { ...typographyBase, ...typographySemantic };
  const size = resolveTokenReference(style['font-size'], lookup);
  const lineHeight = resolveTokenReference(style['line-height'], lookup);
  return `${size} / ${lineHeight}`;
}

export function formatEffectSemantic(value: Record<string, string>): string {
  return Object.entries(value)
    .map(([property, val]) => `${property}: ${val}`)
    .join('; ');
}
