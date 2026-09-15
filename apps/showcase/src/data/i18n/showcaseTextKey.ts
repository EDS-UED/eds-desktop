/** 稳定 key：registry 用语义键；display 用 en + zh-CN 哈希。 */
export function showcaseRegistryTextKey(key: string): string {
  return key;
}

export function showcaseDisplayTextKey(en: string, zhCN: string, token?: string): string {
  const basis = token ? `${en}\0${zhCN}\0${token}` : `${en}\0${zhCN}`;
  let hash = 0;
  for (let i = 0; i < basis.length; i += 1) {
    hash = (hash * 31 + basis.charCodeAt(i)) >>> 0;
  }
  return `display.${hash.toString(16)}`;
}
