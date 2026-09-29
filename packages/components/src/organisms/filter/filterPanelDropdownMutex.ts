import {
  inject,
  provide,
  ref,
  watch,
  type InjectionKey,
  type Ref,
} from 'vue';

export type FilterPanelDropdownMutex = {
  activeOpenId: Ref<string | null>;
  claim: (openId: string) => void;
  release: (openId: string) => void;
};

export const FILTER_PANEL_DROPDOWN_MUTEX_KEY: InjectionKey<FilterPanelDropdownMutex> =
  Symbol('edsFilterPanelDropdownMutex');

export function provideFilterPanelDropdownMutex(): FilterPanelDropdownMutex {
  const activeOpenId = ref<string | null>(null);

  function claim(openId: string) {
    activeOpenId.value = openId;
  }

  function release(openId: string) {
    if (activeOpenId.value === openId) {
      activeOpenId.value = null;
    }
  }

  const mutex: FilterPanelDropdownMutex = { activeOpenId, claim, release };
  provide(FILTER_PANEL_DROPDOWN_MUTEX_KEY, mutex);
  return mutex;
}

/** EgFilter 面板内下拉互斥；无 provide 时（如 Showcase 独立预览）为 no-op。 */
export function useFilterPanelDropdownMutex(
  openId: () => string | undefined,
  flotationRef: Ref<{ close?: () => void } | null>,
) {
  const mutex = inject(FILTER_PANEL_DROPDOWN_MUTEX_KEY, null);

  function onDropdownOpen() {
    const id = openId();
    if (id) {
      mutex?.claim(id);
    }
  }

  function onDropdownClose() {
    const id = openId();
    if (id) {
      mutex?.release(id);
    }
  }

  if (mutex) {
    watch(mutex.activeOpenId, (activeId) => {
      const id = openId();
      if (!id || !activeId || activeId === id) return;
      flotationRef.value?.close?.();
    });
  }

  return { onDropdownOpen, onDropdownClose };
}
