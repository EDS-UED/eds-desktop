import { getProcessedIcon, iconNames } from '@eds/desktop-components';
import { showcaseText } from '@/data/showcasePropLabels';

export function getRegisteredIconCount(): number {
  return iconNames.filter((name) => Boolean(getProcessedIcon(name))).length;
}

export function getIconsPageLead(count = getRegisteredIconCount()): string {
  return showcaseText(
    `${count} icons; name matches packages/components/src/atoms/icons/*.svg filenames (without .svg).`,
    `共 ${count} 个图标；name 与 packages/components/src/atoms/icons/*.svg 文件名一致（不含 .svg）。`,
  );
}
