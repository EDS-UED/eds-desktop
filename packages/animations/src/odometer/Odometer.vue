<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import './odometerOnly.css';

const DIGIT_DURATION_MS = 2000;
const DIGIT_STAGGER_MS = 56;

const props = withDefaults(
  defineProps<{
    /** 显示值；数字按原样输出，字符串可带格式（如 `$8,888,888.88`），仅其中数字参与滚动。 */
    value?: number | string;
    /** 为 true 时首次挂载每位数字从真实值滚动一整圈回到真实值，之后 value 变更直接替换文本。 */
    animateIntro?: boolean;
  }>(),
  {
    value: 0,
    animateIntro: true,
  },
);

const text = computed(() => String(props.value));

const chars = computed(() => {
  let digitIndex = 0;
  return text.value.split('').map((char, index) => {
    const isDigit = char >= '0' && char <= '9';
    return {
      index,
      char,
      digit: isDigit ? Number(char) : null,
      order: isDigit ? digitIndex++ : 0,
    };
  });
});

const digitCount = computed(() => chars.value.filter((item) => item.digit !== null).length);

const rolling = ref(props.animateIntro);
const started = ref(false);

let settleTimer: number | undefined;
let frame: number | undefined;

onMounted(() => {
  if (!rolling.value) return;
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      started.value = true;
    });
  });
  const total = DIGIT_DURATION_MS + DIGIT_STAGGER_MS * Math.max(digitCount.value - 1, 0);
  settleTimer = window.setTimeout(() => {
    rolling.value = false;
  }, total + 50);
});

onBeforeUnmount(() => {
  if (frame !== undefined) cancelAnimationFrame(frame);
  if (settleTimer !== undefined) window.clearTimeout(settleTimer);
});
</script>

<template>
  <span
    class="eds-odometer"
    :class="{ 'is-rolling': rolling }"
    :style="{
      '--odometer-duration': `${DIGIT_DURATION_MS}ms`,
      '--odometer-stagger': `${DIGIT_STAGGER_MS}ms`,
    }"
  >
    <span class="eds-odometer-value">{{ text }}</span>
    <span v-if="rolling" class="eds-odometer-roll" aria-hidden="true">
      <span
        v-for="item in chars"
        :key="item.index"
        class="eds-odometer-column"
        :style="{ '--odometer-order': item.order }"
      >
        <span class="eds-odometer-sizer">{{ item.char }}</span>
        <span
          v-if="item.digit !== null"
          class="eds-odometer-strip"
          :style="{ transform: `translateY(-${started ? item.digit + 10 : item.digit}em)` }"
        >
          <span v-for="n in 20" :key="n" class="eds-odometer-cell">{{ (n - 1) % 10 }}</span>
        </span>
      </span>
    </span>
  </span>
</template>
