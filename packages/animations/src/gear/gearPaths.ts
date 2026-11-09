import iconMarkup from '../../../components/src/atoms/icons/eds-automatic-gear.svg?raw';

export type GearSvgPath = {
  id: string | null;
  d: string;
  fillRule: 'evenodd' | 'nonzero';
  transform: string | undefined;
};

function parseGearSvgPaths(markup: string): GearSvgPath[] {
  const paths: GearSvgPath[] = [];
  const re = /<path\b([^>]*)\/?>/g;
  for (const match of markup.matchAll(re)) {
    const attrs = match[1];
    const d = attrs.match(/\bd="([^"]+)"/)?.[1];
    if (!d) {
      continue;
    }
    const id = attrs.match(/\bid="([^"]+)"/)?.[1] ?? null;
    const fillRule = /fill-rule="evenodd"|clip-rule="evenodd"/.test(attrs)
      ? 'evenodd'
      : 'nonzero';
    const transform = attrs.match(/\btransform="([^"]+)"/)?.[1];
    paths.push({ id, d, fillRule, transform });
  }
  return paths;
}

const paths = parseGearSvgPaths(iconMarkup);

function byId(id: string): GearSvgPath {
  const found = paths.find((path) => path.id === id);
  if (!found) {
    throw new Error(
      `eds-automatic-gear.svg must include <path id="${id}"> (design system export).`,
    );
  }
  return found;
}

/** 设计系统 `eds-automatic-gear.svg`：vector-b 齿环、vector-a 内三叶，不做 path 处理。 */
export const gearRingPath = byId('vector-b');
export const gearLeavesPath = byId('vector-a');

export const gearSvgPaths = paths;
