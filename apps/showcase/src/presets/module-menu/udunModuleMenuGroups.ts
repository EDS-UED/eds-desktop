import type { UdunModuleMenuBusinessTitle } from './businessModuleTitles';
import type { ModuleMenuPresetGroup } from './cregisModuleMenuGroups';
import { moduleMenuComponentDefaultPresetGroups } from './moduleMenuComponentDefaultPreset';

/** UDun Module Menu — 按 Nav Bar 模块标题索引；未列出的模块回退 `udunDefaultModuleMenuGroups`。 */
export const udunModuleMenuByTitle: Partial<
  Record<UdunModuleMenuBusinessTitle, ModuleMenuPresetGroup[]>
> = {};

/** 未配置模块回退：组件场景默认菜单（与 Cregis 共用同一套组件 defaults）。 */
export const udunDefaultModuleMenuGroups = moduleMenuComponentDefaultPresetGroups;

export function getUdunModuleMenuGroups(title: UdunModuleMenuBusinessTitle): ModuleMenuPresetGroup[] {
  return udunModuleMenuByTitle[title] ?? udunDefaultModuleMenuGroups;
}
