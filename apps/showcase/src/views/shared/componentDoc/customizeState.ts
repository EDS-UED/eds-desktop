import { reactive } from 'vue';

/** 定制面板可切换任意枚举值，默认值的字面量类型需放宽回基础类型。 */
type WidenLiteral<Value> = Value extends string
  ? string
  : Value extends number
    ? number
    : Value extends boolean
      ? boolean
      : Value;

/**
 * 组件文档定制面板状态。
 *
 * 已知字段保留可读类型；同时开放索引签名，容纳控件运行期写入的动态键
 * （如 `boxItem3SymbolIcon`、`sceneAddressItem2Checked`）。
 */
export type DocCustomizeState<Defaults extends object = Record<string, never>> = {
  -readonly [Key in keyof Defaults]: WidenLiteral<Defaults[Key]>;
} & Record<string, unknown>;

type CustomizeStateSource<Defaults extends object> =
  | Defaults
  | Partial<Defaults>
  | Record<string, unknown>
  | false
  | null
  | undefined;

/**
 * 合并多组默认值并返回响应式定制状态。
 *
 * 后置 source 覆盖前置，便于「基础默认值 + 场景锁定值」的组合。
 */
export function createDocCustomizeState<Defaults extends object>(
  ...sources: CustomizeStateSource<Defaults>[]
): DocCustomizeState<Defaults> {
  const merged: Record<string, unknown> = {};
  for (const source of sources) {
    if (!source) continue;
    Object.assign(merged, source);
  }
  return reactive(merged) as DocCustomizeState<Defaults>;
}
