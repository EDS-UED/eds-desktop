import { inject, provide, type InjectionKey } from 'vue';
import type { FilterTranslate } from './filterUiText';

export type { FilterTranslate } from './filterUiText';

const FILTER_TRANSLATE_KEY: InjectionKey<FilterTranslate> = Symbol('filterTranslate');

const identityFilterTranslate: FilterTranslate = (text) => text;

export function provideFilterTranslate(translate?: FilterTranslate) {
  provide(FILTER_TRANSLATE_KEY, translate ?? identityFilterTranslate);
}

export function useFilterTranslate(): FilterTranslate {
  return inject(FILTER_TRANSLATE_KEY, identityFilterTranslate);
}
