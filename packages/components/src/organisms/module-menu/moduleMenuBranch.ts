import { inject, provide, ref, type InjectionKey } from 'vue';

export type ModuleMenuBranchContext = {
  registerChild: (id: string) => void;
  unregisterChild: (id: string) => void;
  firstChildId: () => string | null;
  containsChild: (id: string) => boolean;
  markSubitemSelected: () => void;
};

export const MODULE_MENU_BRANCH_KEY: InjectionKey<ModuleMenuBranchContext> =
  Symbol('moduleMenuBranch');

export function provideModuleMenuBranch(options?: {
  onSubitemSelected?: () => void;
}): ModuleMenuBranchContext {
  const childIds = ref<string[]>([]);

  const context: ModuleMenuBranchContext = {
    registerChild(id: string) {
      if (!childIds.value.includes(id)) {
        childIds.value = [...childIds.value, id];
      }
    },
    unregisterChild(id: string) {
      childIds.value = childIds.value.filter((entry) => entry !== id);
    },
    firstChildId() {
      return childIds.value[0] ?? null;
    },
    containsChild(id: string) {
      return childIds.value.includes(id);
    },
    markSubitemSelected() {
      options?.onSubitemSelected?.();
    },
  };

  provide(MODULE_MENU_BRANCH_KEY, context);
  return context;
}

export function useModuleMenuBranch() {
  return inject(MODULE_MENU_BRANCH_KEY, null);
}
