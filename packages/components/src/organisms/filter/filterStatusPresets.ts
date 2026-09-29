import type { TagStatus } from '../../molecules/tag';
import { FILTER_DROPDOWN_MAX_HEIGHT } from './types';

export type FilterStatusPreset = {
  id: string;
  label: string;
  /** EgStatusTag status：等待 ready / 进行中 warning / 错误警告 danger / 成功 success / 取消失效 invalid。 */
  status: TagStatus;
};

export const FILTER_STATUS_PICKER_HEIGHT = FILTER_DROPDOWN_MAX_HEIGHT;

/** Filter 状态类演示选项（EgStatusTag 五类语义）。 */
export const FILTER_STATUS_PRESETS: FilterStatusPreset[] = [
  { id: 'status-waiting', label: '等待类', status: 'ready' },
  { id: 'status-in-progress', label: '进行中类', status: 'warning' },
  { id: 'status-error-warning', label: '错误警告类', status: 'danger' },
  { id: 'status-success-done', label: '成功完成类', status: 'success' },
  { id: 'status-canceled-invalid', label: '取消失效类', status: 'invalid' },
];

export function resolveFilterStatusOption(
  value: string,
  options?: readonly FilterStatusPreset[],
): FilterStatusPreset | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const pool = options?.length ? options : FILTER_STATUS_PRESETS;
  return pool.find((option) => option.id === trimmed);
}

export function resolveFilterStatusPreset(value: string): FilterStatusPreset | undefined {
  return resolveFilterStatusOption(value);
}
