import { inject, provide, type InjectionKey } from 'vue';

type FlotationCloser = () => void;

export type CustomizeFlotationGroup = {
  register: (id: string, close: FlotationCloser) => void;
  unregister: (id: string) => void;
  exclusiveOpen: (id: string) => void;
};

const customizeFlotationGroupKey: InjectionKey<CustomizeFlotationGroup> = Symbol(
  'customizeFlotationGroup',
);

function createCustomizeFlotationGroup(): CustomizeFlotationGroup {
  const closers = new Map<string, FlotationCloser>();

  return {
    register(id, close) {
      closers.set(id, close);
    },
    unregister(id) {
      closers.delete(id);
    },
    exclusiveOpen(id) {
      closers.forEach((close, key) => {
        if (key !== id) {
          close();
        }
      });
    },
  };
}

/** 同一文档页定制区：同时只保留一个 EgFlotation 菜单打开。 */
export function provideCustomizeFlotationGroup(): CustomizeFlotationGroup {
  const group = createCustomizeFlotationGroup();
  provide(customizeFlotationGroupKey, group);
  return group;
}

export function useCustomizeFlotationGroup(): CustomizeFlotationGroup | null {
  return inject(customizeFlotationGroupKey, null);
}

/** 无上层 provide 时（独立 CustomizePanel）在本 subtree 内互斥。 */
export function ensureCustomizeFlotationGroup(): CustomizeFlotationGroup {
  const existing = inject(customizeFlotationGroupKey, null);
  if (existing) {
    return existing;
  }
  return provideCustomizeFlotationGroup();
}
