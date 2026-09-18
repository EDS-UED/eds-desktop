<script setup lang="ts" generic="T extends string">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import styles from './MotionLayoutDeform.module.css';
import { EgMotionLayoutContent } from '../motion-layout-content';
import {
  useMotionLayoutDeformPageSwitch,
  type MotionLayoutDeformPageSpec,
} from './motionLayoutDeform';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** 当前子页 · v-model */
    modelValue: T;
    /** 各子页 shell 高度；须 reactive，组件会写回测量值 */
    pages: Record<T, MotionLayoutDeformPageSpec>;
    /** 切换前自动预测量子页高度 */
    autoMeasure?: boolean;
    /** 内容换页延迟 · 默认 120ms */
    swapMs?: number;
  }>(),
  {
    autoMeasure: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: T];
}>();

const slots = defineSlots<
  Record<
    T,
    (props: { measureOnly: boolean; active: boolean }) => unknown
  >
>();

const pageKeys = computed(() => Object.keys(props.pages) as T[]);

const {
  activePage,
  shellHeight,
  contentExiting,
  contentEntering,
  switchTo,
} = useMotionLayoutDeformPageSwitch(props.pages, props.modelValue, props.swapMs);

const measureRefs = ref<Partial<Record<T, HTMLElement>>>({});
const pendingExternalSwitch = ref(false);

function setMeasureRef(page: T) {
  return (element: unknown) => {
    if (element instanceof HTMLElement) {
      measureRefs.value[page] = element;
      return;
    }
    delete measureRefs.value[page];
  };
}

function measurePage(page: T) {
  const element = measureRefs.value[page];
  if (!element) {
    return;
  }
  const height = element.scrollHeight;
  if (height > 0) {
    props.pages[page].shellHeight = height;
  }
}

async function measureAllPages() {
  await nextTick();
  for (const page of pageKeys.value) {
    measurePage(page);
  }
}

async function measureAndSwitch(next: T) {
  if (props.autoMeasure) {
    await measurePage(next);
  }
  switchTo(next);
}

async function goTo(next: T) {
  if (
    next === activePage.value &&
    !contentExiting.value &&
    !contentEntering.value
  ) {
    return;
  }
  await measureAndSwitch(next);
}

function reset(next: T = props.modelValue) {
  activePage.value = next;
  contentExiting.value = false;
  contentEntering.value = false;
  shellHeight.value = props.pages[next].shellHeight;
  emit('update:modelValue', next);
}

watch(
  () => props.modelValue,
  (next) => {
    if (next === activePage.value && !contentExiting.value && !contentEntering.value) {
      return;
    }
    if (pendingExternalSwitch.value) {
      return;
    }
    pendingExternalSwitch.value = true;
    void goTo(next).finally(() => {
      pendingExternalSwitch.value = false;
    });
  },
);

watch(activePage, (next) => {
  if (next !== props.modelValue) {
    emit('update:modelValue', next);
  }
});

watch(
  () => props.pages,
  async () => {
    if (!props.autoMeasure) {
      return;
    }
    await measureAllPages();
    if (
      !contentExiting.value &&
      !contentEntering.value &&
      activePage.value === props.modelValue
    ) {
      shellHeight.value = props.pages[activePage.value].shellHeight;
    }
  },
  { deep: true },
);

onMounted(async () => {
  if (props.autoMeasure) {
    await measureAllPages();
  }
  shellHeight.value = props.pages[props.modelValue].shellHeight;
});

defineExpose({
  activePage,
  shellHeight,
  measurePage,
  measureAllPages,
  switchTo: goTo,
  reset,
});
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.measureHost" aria-hidden="true">
      <div
        v-for="page in pageKeys"
        :key="`measure-${page}`"
        :ref="setMeasureRef(page)"
      >
        <slot
          v-if="slots[page as T]"
          :name="page as T"
          :measure-only="true"
          :active="false"
        />
      </div>
    </div>

    <div
      class="motion-layout-deform eds-motion-layout-deform"
      :class="[styles.shell, $attrs.class]"
      :style="{ height: `${shellHeight}px`, ...($attrs.style as object | undefined) }"
      v-bind="{ ...$attrs, class: undefined, style: undefined }"
    >
      <EgMotionLayoutContent
        :content-exiting="contentExiting"
        :content-entering="contentEntering"
      >
        <slot
          v-if="slots[activePage as T]"
          :name="activePage as T"
          :measure-only="false"
          :active="true"
        />
      </EgMotionLayoutContent>
    </div>
  </div>
</template>
