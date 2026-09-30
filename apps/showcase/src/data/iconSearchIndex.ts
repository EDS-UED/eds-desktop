import iconFigmaDescriptions from './iconFigmaDescriptions.json';

export type IconFigmaDescriptionEntry = {
  description: string;
  keywords: string[];
};

export const iconFigmaDescriptionMap = iconFigmaDescriptions as Record<
  string,
  IconFigmaDescriptionEntry
>;

function normalizeIconName(name: string): string {
  return name.trim();
}

export function getIconFigmaDescription(iconName: string): IconFigmaDescriptionEntry | undefined {
  return iconFigmaDescriptionMap[normalizeIconName(iconName)];
}

export function matchIconGallerySearch(iconName: string, query: string): boolean {
  const rawQuery = query.trim();
  if (!rawQuery) return true;

  const normalizedQuery = rawQuery.toLowerCase();
  if (iconName.toLowerCase().includes(normalizedQuery)) return true;

  const entry = getIconFigmaDescription(iconName);
  if (!entry) return false;

  if (entry.description.includes(rawQuery)) return true;

  return entry.keywords.some(
    (keyword) => keyword.includes(rawQuery) || keyword.toLowerCase().includes(normalizedQuery),
  );
}
