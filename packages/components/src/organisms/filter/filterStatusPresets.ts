import type { TagStatus } from '../../molecules/tag';

export type FilterStatusPreset = {
  id: string;
  label: string;
  /** EgStatusTag status：等待 ready / 进行中 warning / 错误警告 danger / 成功 success / 取消失效 invalid。 */
  status: TagStatus;
};

export const FILTER_STATUS_PICKER_HEIGHT = 360;

/** Filter 状态类演示选项（EgStatusTag 五类语义）。 */
export const FILTER_STATUS_PRESETS: FilterStatusPreset[] = [
  { id: 'status-waiting', label: '等待类', status: 'ready' },
  { id: 'status-in-progress', label: '进行中类', status: 'warning' },
  { id: 'status-error-warning', label: '错误警告类', status: 'danger' },
  { id: 'status-success-done', label: '成功完成类', status: 'success' },
  { id: 'status-canceled-invalid', label: '取消失效类', status: 'invalid' },
];

export function resolveFilterStatusPreset(value: string): FilterStatusPreset | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return FILTER_STATUS_PRESETS.find((option) => option.id === trimmed);
}
