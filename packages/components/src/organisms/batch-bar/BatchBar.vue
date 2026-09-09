<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgTooltipPanel } from '../../molecules/tooltip';
import { EgFlotation, EgFlotationMenu, EgFlotationMenuItem } from '../../molecules/flotation';
import type { TooltipAlign, TooltipPlacement } from '../../molecules/tooltip';
import type { PopoverWidthMode } from '../../molecules/popovers';
import BatchBarActionItem from './BatchBarActionItem.vue';
import BatchBarLabelPopover from './BatchBarLabelPopover.vue';
import styles from './BatchBar.module.css';

const props = withDefaults(
  defineProps<{
    selectedCount?: string | number;
    countSuffix?: string;
    /** Text 操作项，1–20 项。 */
    labels?: string[];
    /** 与 labels 等长；为 true 时该项 Text 使用 --text-danger-primary。 */
    labelDanger?: boolean[];
    /** 与 labels 等长；为 true 时点击打开 Popover，确认后再 label-click。 */
    labelPopover?: boolean[];
    moreLabel?: string;
    /** 超过该数量时折叠为 collapsedVisibleCount + More。 */
    collapseThreshold?: number;
    /** 折叠后可见的 Label 数量（Figma：3）。 */
    collapsedVisibleCount?: number;
    /** More 覆层菜单相对触发器的 placement。 */
    morePlacement?: TooltipPlacement;
    /** More 覆层交叉轴对齐；默认 start，长文案向右拓展。 */
    moreAlign?: TooltipAlign;
    /** 正在加载的 Label 全局 index；overflow 项加载时 More 按钮展示 spinner。 */
    loadingLabelIndex?: number | null;
    /** Popover Label 打开前回调；慢于 500ms 时由 BatchBarLabelPopover 展示 Loading。 */
    onLabelBeforeOpen?: (label: string, index: number) => void | Promise<void>;
    /** Label Popover 面板宽度模式（如批处理 Remark fixed 256）。 */
    labelPopoverWidthMode?: PopoverWidthMode;
    /** widthMode=fixed 时面板区宽度（px）。 */
    labelPopoverWidth?: number;
    /** placement=top 时 Popover 顶部工具条。 */
    labelPopoverTopTool?: boolean;
    labelPopoverTopToolTitle?: string;
    /** 与 labels 等长；优先于 labelPopoverTopToolTitle。 */
    labelPopoverTopToolTitles?: string[];
    labelPopoverTopToolClosable?: boolean;
  }>(),
  {
    selectedCount: '0',
    countSuffix: 'Selectd',
    labels: undefined,
    labelDanger: undefined,
    moreLabel: 'More',
    collapseThreshold: 4,
    collapsedVisibleCount: 3,
    morePlacement: 'top',
    moreAlign: 'start',
    loadingLabelIndex: null,
  },
);

const emit = defineEmits<{
  dismiss: [];
  'label-click': [label: string, index: number];
  'label-popover-dismiss': [label: string, index: number];
  more: [];
}>();

const resolvedLabels = computed(() => {
  if (props.labels?.length) {
    return props.labels.slice(0, 20).map((label) => String(label));
  }
  return ['Label'];
});

const selectedCountNumber = computed(() => {
  const raw = props.selectedCount;
  const parsed = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
  return Number.isFinite(parsed) ? parsed : 0;
});

/** 未选中任何项时禁用 Text / More 操作（Figma：0 selected 不可点）。 */
const actionsDisabled = computed(() => selectedCountNumber.value <= 0);

const shouldCollapse = computed(
  () => resolvedLabels.value.length > props.collapseThreshold,
);

const visibleLabels = computed(() => {
  if (!shouldCollapse.value) {
    return resolvedLabels.value;
  }
  return resolvedLabels.value.slice(0, props.collapsedVisibleCount);
});

const overflowLabels = computed(() => {
  if (!shouldCollapse.value) {
    return [];
  }
  return resolvedLabels.value.slice(props.collapsedVisibleCount);
});

const showMore = computed(() => overflowLabels.value.length > 0);

const moreLoading = computed(() => {
  if (props.loadingLabelIndex == null) {
    return false;
  }
  return props.loadingLabelIndex >= props.collapsedVisibleCount;
});

function isLabelLoading(index: number) {
  return props.loadingLabelIndex === index;
}

function isLabelDanger(index: number) {
  return Boolean(props.labelDanger?.[index]);
}

function isLabelPopover(index: number) {
  return Boolean(props.labelPopover?.[index]);
}

function labelPopoverTopToolTitleAt(index: number) {
  const titled = props.labelPopoverTopToolTitles?.[index];
  if (titled) {
    return titled;
  }
  return props.labelPopoverTopToolTitle;
}

function onLabelClick(label: string, index: number) {
  if (actionsDisabled.value) return;
  emit('label-click', label, index);
}

function onOverflowLabelClick(
  label: string,
  index: number,
  close: () => void,
) {
  onLabelClick(label, index);
  close();
}

function onDismiss() {
  emit('dismiss');
}
</script>

<template>
  <div class="eds-batch-bar" :class="styles.root">
    <EgTooltipPanel
      class="eds-batch-bar-glass"
      :class="styles.glassShell"
      panel-kind="flotation"
      panel-radius="radius-full"
      width-mode="adaptive"
      height-mode="adaptive"
      :scrollable="false"
    >
      <slot name="leading">
        <BatchBarActionItem type="symbol" @click="onDismiss" />
      </slot>

      <EgDivider :class="styles.divider" type="page" direction="vertical" />

      <slot name="statistics">
        <BatchBarActionItem
          type="statistics"
          :count="selectedCount"
          :count-suffix="countSuffix"
        />
      </slot>

      <template v-if="$slots.actions">
        <EgDivider :class="styles.divider" type="page" direction="vertical" />
        <slot name="actions" />
      </template>

      <template v-else>
        <template v-for="(label, index) in visibleLabels" :key="`${label}-${index}`">
          <EgDivider :class="styles.divider" type="page" direction="vertical" />
          <BatchBarLabelPopover
            v-if="isLabelPopover(index)"
            :label="label"
            :loading="isLabelLoading(index)"
            :danger="isLabelDanger(index)"
            :disabled="actionsDisabled"
            :popover-width-mode="labelPopoverWidthMode"
            :popover-width="labelPopoverWidth"
            :popover-top-tool="labelPopoverTopTool"
            :popover-top-tool-title="labelPopoverTopToolTitleAt(index)"
            :popover-top-tool-closable="labelPopoverTopToolClosable"
            :on-before-open="() => onLabelBeforeOpen?.(label, index)"
            @confirm="onLabelClick(label, index)"
            @dismiss="emit('label-popover-dismiss', label, index)"
          >
            <template #default="popoverSlot">
              <slot
                name="label-popover"
                :label="label"
                :index="index"
                v-bind="popoverSlot"
              />
            </template>
          </BatchBarLabelPopover>
          <BatchBarActionItem
            v-else
            type="text"
            :label="label"
            :loading="isLabelLoading(index)"
            :danger="isLabelDanger(index)"
            :disabled="actionsDisabled"
            @click="onLabelClick(label, index)"
          />
        </template>

        <template v-if="showMore">
          <EgDivider :class="styles.divider" type="page" direction="vertical" />
          <EgFlotation
            :class="styles.moreFlotation"
            :placement="morePlacement"
            :align="moreAlign"
            :cross-axis-offset="0"
            width-mode="adaptive"
            height-mode="adaptive"
            :show-add="false"
            :show-menu-divider="false"
            @open="emit('more')"
          >
            <template #trigger="{ expanded }">
              <BatchBarActionItem
                type="text"
                :label="moreLabel"
                :active="expanded && !moreLoading"
                :loading="moreLoading"
                :disabled="actionsDisabled"
              />
            </template>

            <template #content="{ close }">
              <slot name="more-menu" :labels="overflowLabels" :close="close">
                <EgFlotationMenu
                  :class="styles.moreMenu"
                  panel-radius="radius-md"
                  width-mode="adaptive"
                  height-mode="adaptive"
                  :scrollable="false"
                  :show-add="false"
                  :show-divider="false"
                >
                  <EgFlotationMenuItem
                    v-for="(label, overflowIndex) in overflowLabels"
                    :key="`${label}-${overflowIndex}`"
                    box-type="text"
                    :label="label"
                    :show-tag="false"
                    :danger="isLabelDanger(collapsedVisibleCount + overflowIndex)"
                    :disabled="actionsDisabled"
                    @click="
                      onOverflowLabelClick(
                        label,
                        collapsedVisibleCount + overflowIndex,
                        close,
                      )
                    "
                  />
                </EgFlotationMenu>
              </slot>
            </template>
          </EgFlotation>
        </template>
      </template>
    </EgTooltipPanel>
  </div>
</template>
