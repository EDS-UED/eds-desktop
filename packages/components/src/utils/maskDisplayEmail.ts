const PLAIN_EMAIL =
  /^[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;

function maskEmailLocalPart(local: string): string {
  const t = local.trim();
  if (!t) return t;
  if (t.length === 1) return t;
  if (t.length <= 4) return `${t[0]}***${t.at(-1) ?? ''}`;
  return `${t[0]}******${t.at(-1) ?? ''}`;
}

function localPartLooksMasked(local: string): boolean {
  return local.includes('*');
}

function domainLooksPlaintext(domain: string): boolean {
  const host = domain.split('.')[0] ?? '';
  return Boolean(host) && !host.includes('*');
}

/** 是否为可脱敏的完整邮箱（含已脱敏 local 的展示串）。 */
export function looksLikeDisplayEmail(value: string): boolean {
  const t = value.trim();
  if (!t.includes('@')) return false;
  if (PLAIN_EMAIL.test(t)) return true;
  const at = t.lastIndexOf('@');
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  if (!local || !domain) return false;
  return localPartLooksMasked(local) && domainLooksPlaintext(domain);
}

/**
 * 展示用邮箱脱敏：仅 @ 前本地段保留首尾字母，中间 `******`；`@` 后域名原样保留。
 * 例：`testabc@gmail.com` → `t******c@gmail.com`
 */
export function maskDisplayEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed.includes('@')) return trimmed;

  const at = trimmed.lastIndexOf('@');
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!local || !domain) return trimmed;

  if (localPartLooksMasked(local) && domainLooksPlaintext(domain)) {
    return trimmed;
  }

  return `${maskEmailLocalPart(local)}@${domain}`;
}
