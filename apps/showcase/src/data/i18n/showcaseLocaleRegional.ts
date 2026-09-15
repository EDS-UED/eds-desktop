import { toZhHant } from './toZhHant';

/** 台湾繁体：在通用简繁基础上叠加用词习惯。 */
const ZH_TW_OVERRIDES: Record<string, string> = {
  软件: '軟體',
  程序: '程式',
  程序码: '程式碼',
  网络: '網路',
  屏幕: '螢幕',
  鼠标: '滑鼠',
  信息: '資訊',
  内存: '記憶體',
  硬盘: '硬碟',
  光标: '游標',
  默认: '預設',
  视频: '視訊',
};

/** 香港繁体：港式 UI 用词（与台湾有差异处）。 */
const ZH_HK_OVERRIDES: Record<string, string> = {
  软件: '軟件',
  程序: '程式',
  程序码: '程式碼',
  网络: '網絡',
  屏幕: '屏幕',
  鼠标: '滑鼠',
  信息: '資訊',
  内存: '記憶體',
  硬盘: '硬碟',
  光标: '游標',
  默认: '預設',
  视频: '視頻',
  服务器: '伺服器',
  链接: '連結',
};

/** 拉美西语：在欧洲西语基础上的 UI 偏好替换（小写敏感按 phrase 处理）。 */
const ES_419_OVERRIDES: Array<[RegExp, string]> = [
  [/\bordenador\b/gi, 'computadora'],
  [/\bteléfono móvil\b/gi, 'celular'],
  [/\bmóvil\b/gi, 'celular'],
  [/\baplicación\b/gi, 'aplicación'],
  [/\bpulsar\b/gi, 'presionar'],
  [/\bclic\b/gi, 'clic'],
  [/\borden\b/gi, 'orden'],
];

/** 巴西葡语：欧葡 → 巴西 UI 习惯。 */
const PT_BR_OVERRIDES: Array<[RegExp, string]> = [
  [/\barquivo\b/gi, 'arquivo'],
  [/\btecla\b/gi, 'tecla'],
  [/\brato\b/gi, 'mouse'],
  [/\becrã\b/gi, 'tela'],
  [/\becran\b/gi, 'tela'],
  [/\btelemóvel\b/gi, 'celular'],
  [/\btelefone\b/gi, 'telefone'],
  [/\butilizador\b/gi, 'usuário'],
  [/\bdefinições\b/gi, 'configurações'],
  [/\bficheiro\b/gi, 'arquivo'],
];

function applyPhraseMap(text: string, map: Record<string, string>): string {
  let result = text;
  const phrases = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    result = result.split(phrase).join(map[phrase]!);
  }
  return result;
}

function applyRegexRules(text: string, rules: Array<[RegExp, string]>): string {
  let result = text;
  for (const [pattern, replacement] of rules) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function toZhHantTW(zhCN: string): string {
  return applyPhraseMap(toZhHant(zhCN), ZH_TW_OVERRIDES);
}

export function toZhHantHK(zhCN: string): string {
  return applyPhraseMap(toZhHant(zhCN), ZH_HK_OVERRIDES);
}

export function adaptEs419(text: string): string {
  return applyRegexRules(text, ES_419_OVERRIDES);
}

export function adaptPtBR(text: string): string {
  return applyRegexRules(text, PT_BR_OVERRIDES);
}

export function applyRegionalAdaptation(
  locale: string,
  text: string,
  options?: { esEsBase?: string },
): string {
  if (locale === 'zh-TW') return toZhHantTW(text);
  if (locale === 'zh-HK') return toZhHantHK(text);
  if (locale === 'es-419') {
    const base = options?.esEsBase ?? text;
    return adaptEs419(base);
  }
  if (locale === 'pt-BR') return adaptPtBR(text);
  return text;
}
