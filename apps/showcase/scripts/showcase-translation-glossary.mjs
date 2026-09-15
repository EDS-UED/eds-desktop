/**
 * 设计系统/UI 文案中需保留的片段 — 翻译前 mask，译后还原。
 */

/** @type {RegExp[]} */
export const PROTECTED_PATTERNS = [
  /\bEg[A-Z][A-Za-z0-9]*\b/g,
  /#[a-z][a-z0-9-]*/gi,
  /\{[a-z][a-z0-9-]*\}/gi,
  /var\(--[a-z0-9-]+\)/gi,
  /--[a-z0-9-]+/gi,
  /\bBCP\s47\b/gi,
  /\bShowcase\b/g,
  /\bDesktop\b/g,
  /\bEDS\b/g,
  /\bUI\b/g,
  /\bAPI\b/g,
  /\bSVG\b/g,
  /\bRTL\b/g,
  /\bNMT\b/g,
];

const PLACEHOLDER = (index) => `\uE000${index}\uE001`;

export function maskProtectedSegments(text) {
  /** @type {string[]} */
  const tokens = [];
  let masked = text;

  for (const pattern of PROTECTED_PATTERNS) {
    masked = masked.replace(pattern, (match) => {
      const index = tokens.length;
      tokens.push(match);
      return PLACEHOLDER(index);
    });
  }

  return { masked, tokens };
}

export function unmaskProtectedSegments(text, tokens) {
  return text.replace(/\uE000(\d+)\uE001/g, (_, index) => tokens[Number(index)] ?? _);
}
