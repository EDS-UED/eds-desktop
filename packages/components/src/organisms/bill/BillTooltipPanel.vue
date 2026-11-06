<script setup lang="ts">
import { ref } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgButton } from '../../molecules/button';
import { EgFormSubmission } from '../../molecules/feedback';
import { EgIconButton } from '../../molecules/icon-button';
import { EgLinkButton } from '../../molecules/link';
import { EgStatusTag } from '../../molecules/tag';
import { useScrollChromeScrim } from '../../composables/useScrollChromeScrim';
import {
  BILL_EXPORT_QUICK_PRESET_IDS,
  formatBillExportQuickPresetValue,
  type BillExportQuickPresetId,
} from './billDateUtils';
import { useBillTranslate } from './billTranslate';
import type { BillExportHistoryItem } from './billTooltipTypes';
import { BILL_TOOLTIP_HISTORY_MAX_HEIGHT } from './billTooltipTypes';
import BillTooltipDateRangeField from './BillTooltipDateRangeField.vue';
import styles from './BillTooltip.module.css';

const ui = useBillTranslate();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    historyItems?: readonly BillExportHistoryItem[];
    disabled?: boolean;
    exportLoading?: boolean;
  }>(),
  {
    historyItems: () => [],
    disabled: false,
    exportLoading: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  export: [];
  'download-history': [id: string];
}>();

const historyScrollRef = ref<HTMLElement | null>(null);

const {
  canScroll: historyCanScroll,
  bottomScrim: historyBottomScrim,
} = useScrollChromeScrim(historyScrollRef);


function presetLabelKey(id: BillExportQuickPresetId): string {
  switch (id) {
    case 'last-3-months':
      return 'Bill export preset last 3 months';
    case 'last-6-months':
      return 'Bill export preset last 6 months';
    case 'last-12-months':
      return 'Bill export preset last 12 months';
    default:
      return id;
  }
}

function onPresetClick(id: BillExportQuickPresetId) {
  if (props.disabled) return;
  emit('update:modelValue', formatBillExportQuickPresetValue(id));
}

function onExportClick() {
  if (props.disabled || props.exportLoading) return;
  emit('export');
}

function onDownloadClick(id: string) {
  if (props.disabled) return;
  emit('download-history', id);
}
</script>

<template>
  <div :class="styles.panel">
    <section :class="styles.exportSection">
      <div :class="styles.exportHeader">
        <h3 :class="styles.exportTitle">{{ ui('Bill export title') }}</h3>
        <div :class="styles.presetLinks">
          <EgLinkButton
            v-for="presetId in BILL_EXPORT_QUICK_PRESET_IDS"
            :key="presetId"
            tone="decor"
            size="sm"
            :disabled="disabled"
            @click="onPresetClick(presetId)"
          >
            {{ ui(presetLabelKey(presetId)) }}
          </EgLinkButton>
        </div>
      </div>

      <BillTooltipDateRangeField
        :model-value="modelValue"
        :disabled="disabled"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <EgFormSubmission
        type="notes"
        :text="ui('Bill export within one year hint')"
        :class="styles.exportHint"
      />

      <div :class="styles.exportActionRow">
        <EgButton
          tone="brand"
          size="sm"
          :disabled="disabled"
          :loading="exportLoading"
          @click="onExportClick"
        >
          {{ ui('Bill export action') }}
        </EgButton>
      </div>
    </section>

    <EgDivider type="module" direction="horizontal" :class="styles.sectionDivider" />

    <section :class="styles.historySection">
      <p :class="styles.historyTitle">{{ ui('Bill export history title') }}</p>
      <div
        ref="historyScrollRef"
        :class="[
          styles.historyScroll,
          historyCanScroll && styles.historyScrollFadeBottom,
        ]"
        :style="{ maxHeight: `${BILL_TOOLTIP_HISTORY_MAX_HEIGHT}px` }"
      >
        <ul :class="styles.historyList">
          <li
            v-for="item in historyItems"
            :key="item.id"
            :class="styles.historyItem"
          >
            <div :class="styles.historyItemBody">
              <p :class="styles.historyItemTitle">{{ item.title }}</p>
              <div :class="styles.historyItemMeta">
                <span :class="styles.historyMetaGroup">
                  <EgIcon name="eds-user-information" size="sm" :class="styles.historyMetaIcon" />
                  <span :class="styles.historyMetaText">
                    {{ item.operatorName }} ({{ item.operatorEmailMasked }})
                  </span>
                </span>
                <span :class="styles.historyMetaGroup">
                  <EgIcon name="eds-clocks" size="sm" :class="styles.historyMetaIcon" />
                  <span :class="styles.historyMetaText">{{ item.createdAt }}</span>
                </span>
              </div>
            </div>
            <div :class="styles.historyItemTrailing">
              <EgStatusTag
                v-if="item.status === 'preparing'"
                status="ready"
                size="sm"
              >
                {{ ui('Bill export status preparing') }}
              </EgStatusTag>
              <EgIconButton
                v-else
                shape="square"
                size="sm"
                tone="decor"
                :label="ui('Bill export download')"
                :disabled="disabled"
                @click="onDownloadClick(item.id)"
              >
                <EgIcon name="eds-arrow-download" size="sm" />
              </EgIconButton>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
