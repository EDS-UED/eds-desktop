import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';

const SKID_DEMO_SENTENCE =
  '这是一段用于 Skid 溢出滚动与毛玻璃验收的纯文本测试内容，不包含任何装饰区块或彩色背景。';

export const skidDemoContentCustomizeDefaults = {
  showDemoContent: true,
};

export const skidDemoContentCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showDemoContent', label: showcaseText('Show test content', '显示测试内容') },
];

/** 重复拼接为足够长的正文，确保 Skid 主体可纵向溢出滚动。 */
export const skidDemoPlainText = Array.from({ length: 48 }, (_, index) => {
  const paragraphIndex = index + 1;
  return `${paragraphIndex}. ${SKID_DEMO_SENTENCE.repeat(6)}`;
}).join('\n\n');
