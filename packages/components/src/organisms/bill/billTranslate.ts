import { inject, provide, type InjectionKey } from 'vue';

export type BillTranslate = (key: string) => string;

const BILL_TRANSLATE_KEY: InjectionKey<BillTranslate> = Symbol('billTranslate');

export function provideBillTranslate(translate: BillTranslate) {
  provide(BILL_TRANSLATE_KEY, translate);
}

export function useBillTranslate(): BillTranslate {
  const translate = inject(BILL_TRANSLATE_KEY);
  if (!translate) {
    return (key: string) => key;
  }
  return translate;
}
