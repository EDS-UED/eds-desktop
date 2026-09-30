import { computed, inject, provide, ref, type InjectionKey, type Ref } from 'vue';

const atomsGallerySearchKey: InjectionKey<Ref<string>> = Symbol('atomsGallerySearch');

export function provideAtomsGallerySearch() {
  const query = ref('');
  provide(atomsGallerySearchKey, query);
  return query;
}

export function useAtomsGallerySearch() {
  return inject(atomsGallerySearchKey, ref(''));
}

export const ATOMS_GALLERY_SEARCH_SLUGS = ['icons', 'crypto'] as const;

export type AtomsGallerySearchSlug = (typeof ATOMS_GALLERY_SEARCH_SLUGS)[number];

export function isAtomsGallerySearchSlug(slug: string): slug is AtomsGallerySearchSlug {
  return ATOMS_GALLERY_SEARCH_SLUGS.includes(slug as AtomsGallerySearchSlug);
}

export function atomsGallerySearchPlaceholder(slug: AtomsGallerySearchSlug): string {
  return slug === 'crypto' ? '例如 eds-eth-ethereum' : '例如 eds-add 或 锁';
}
