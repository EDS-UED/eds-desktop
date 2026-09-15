/** MD §31 文案生命周期（Showcase 预填抽检子集）。 */
export type ShowcaseI18nReviewStatus =
  | 'draft'
  | 'translated'
  | 'reviewed'
  | 'approved'
  | 'deprecated';

export type ShowcaseI18nReviewEntry = {
  status: ShowcaseI18nReviewStatus;
  prefilledAt?: string;
  reviewedAt?: string;
  source?: 'machine' | 'author' | 'hant';
};

export type ShowcaseI18nReviewManifest = Record<
  string,
  Partial<Record<string, ShowcaseI18nReviewEntry>>
>;
