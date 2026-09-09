import { createRouter, createWebHistory } from 'vue-router';
import ShowcaseLayout from '@/layout/ShowcaseLayout.vue';
import TokensView from '@/views/tokens/TokensView.vue';
import ComponentsView from '@/views/components/ComponentsView.vue';
import ComponentDetailView from '@/views/components/ComponentDetailView.vue';
import AnimationsView from '@/views/animations/AnimationsView.vue';
import AnimationDetailView from '@/views/animations/AnimationDetailView.vue';
import PatternsView from '@/views/patterns/PatternsView.vue';
import PatternDetailView from '@/views/patterns/PatternDetailView.vue';
import WorkflowsView from '@/views/workflows/WorkflowsView.vue';
import {
  defaultComponentSlug,
  findCatalogItem,
  isValidComponentSlug,
} from '@/data/components/navigation';
import { defaultAnimationSlug, isValidAnimationSlug } from '@/data/animations';
import { defaultPatternSlug, isValidPatternSlug } from '@/data/patterns';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ShowcaseLayout,
      children: [
        { path: '', redirect: '/tokens' },
        { path: 'tokens', name: 'tokens', component: TokensView },
        {
          path: 'animations',
          component: AnimationsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'animation-detail',
                params: { slug: defaultAnimationSlug },
              },
            },
            {
              path: ':slug',
              name: 'animation-detail',
              component: AnimationDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (typeof slug !== 'string' || !isValidAnimationSlug(slug)) {
                  return {
                    name: 'animation-detail',
                    params: { slug: defaultAnimationSlug },
                  };
                }
              },
            },
          ],
        },
        {
          path: 'components',
          component: ComponentsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'component-detail',
                params: { slug: defaultComponentSlug },
              },
            },
            {
              path: ':slug',
              name: 'component-detail',
              component: ComponentDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (typeof slug !== 'string') {
                  return {
                    name: 'component-detail',
                    params: { slug: defaultComponentSlug },
                  };
                }

                const inputHashToPage: Record<string, string> = {
                  'input-input': 'input-input',
                  'input-textarea': 'input-textarea',
                  'input-search': 'input-search',
                  'input-verify-input': 'input-verify-input',
                  'input-combo-input': 'input-combo-input',
                  'input-combo-textarea': 'input-combo-textarea',
                };

                const buttonHashToPage: Record<string, string> = {
                  'button-text': 'button-text',
                  'button-icon': 'button-icon',
                  'button-icon-pro': 'button-icon-pro',
                  'button-link': 'button-link',
                  'button-pagination': 'button-pagination',
                  'button-combo': 'button-combo',
                };

                const tagHashToPage: Record<string, string> = {
                  'tag-system': 'tag-system',
                  'tag-scene-status': 'tag-scene-status',
                  'tag-scene-colorful': 'tag-scene-colorful',
                  'tag-scene-palette': 'tag-scene-palette',
                  'tag-status': 'tag-scene-status',
                  'tag-colorful': 'tag-scene-colorful',
                  'tag-palette': 'tag-scene-palette',
                  'tag-custom': 'tag-scene-palette',
                };

                const toggleHashToPage: Record<string, string> = {
                  'toggle-checkbox': 'toggle-checkbox',
                  'toggle-radio': 'toggle-radio',
                  'toggle-decide': 'toggle-decide',
                  'toggle-switch': 'toggle-switch',
                };

                const tabHashToPage: Record<string, string> = {
                  'tab-segmented': 'tab-segmented',
                  'tab-segmented-control': 'tab-segmented',
                  'tab-tabs': 'tab-tabs',
                };

                const feedbackHashToPage: Record<string, string> = {
                  'feedback-end-feedback-card': 'feedback-end-feedback-card',
                  'feedback-toast': 'feedback-toast',
                  'feedback-message': 'feedback-message',
                  'feedback-reddot': 'feedback-reddot',
                  'feedback-form-submission': 'feedback-form-submission',
                  'feedback-streamer': 'feedback-streamer',
                };

                const tooltipHashToPage: Record<string, string> = {
                  'tooltip-flotation': 'tooltip-flotation',
                  'tooltip-scene-text-overflow': 'tooltip-scene-text-overflow',
                  'tooltip-scene-paragraph-overflow': 'tooltip-scene-paragraph-overflow',
                  'tooltip-scene-multi-address': 'tooltip-scene-multi-address',
                  'tooltip-subtle': 'tooltip-subtle',
                  'tooltip-container': 'tooltip-flotation',
                  'tooltip-popup': 'tooltip-flotation',
                  'tooltip-molde': 'tooltip-flotation',
                };

                const popoversHashToPage: Record<string, string> = {
                  'popovers-popover': 'popovers-popover',
                  'popovers-scene': 'popovers-scene-guidance',
                  'popovers-scens': 'popovers-scene-guidance',
                };

                if (slug === 'popovers') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && popoversHashToPage[anchorId]
                      ? popoversHashToPage[anchorId]
                      : 'popovers-popover';
                  return { path: `/components/${target}` };
                }

                if (slug === 'input') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && inputHashToPage[anchorId] ? inputHashToPage[anchorId] : 'input-input';
                  return { path: `/components/${target}` };
                }

                if (slug === 'input-combo') {
                  return { path: '/components/input-combo-input' };
                }

                if (slug === 'button') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && buttonHashToPage[anchorId] ? buttonHashToPage[anchorId] : 'button-text';
                  return { path: `/components/${target}` };
                }

                if (slug === 'tag') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && tagHashToPage[anchorId] ? tagHashToPage[anchorId] : 'tag-system';
                  return { path: `/components/${target}` };
                }

                if (slug === 'toggle') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && toggleHashToPage[anchorId]
                      ? toggleHashToPage[anchorId]
                      : 'toggle-checkbox';
                  return { path: `/components/${target}` };
                }

                if (slug === 'tab') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && tabHashToPage[anchorId]
                      ? tabHashToPage[anchorId]
                      : 'tab-tabs';
                  return { path: `/components/${target}` };
                }

                if (slug === 'feedback') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && feedbackHashToPage[anchorId]
                      ? feedbackHashToPage[anchorId]
                      : 'feedback-end-feedback-card';
                  return { path: `/components/${target}` };
                }

                if (slug === 'tooltip') {
                  const anchorId = to.hash.startsWith('#') ? to.hash.slice(1) : '';
                  const target =
                    anchorId && tooltipHashToPage[anchorId]
                      ? tooltipHashToPage[anchorId]
                      : 'tooltip-flotation';
                  return { path: `/components/${target}` };
                }

                if (slug === 'menu-box') {
                  return { path: '/components/tooltip-flotation' };
                }

                if (slug === 'combo') {
                  return { path: '/components/button-combo' };
                }

                if (slug === 'icon-button') {
                  return { path: '/components/button-icon' };
                }

                const buttonLegacySlugs: Record<string, string> = {
                  link: 'button-link',
                  pagination: 'button-pagination',
                  'icon-button-pro': 'button-icon-pro',
                };

                if (slug in buttonLegacySlugs) {
                  return { path: `/components/${buttonLegacySlugs[slug]}` };
                }

                const popoverSceneLegacySlugs: Record<string, string> = {
                  'popovers-scens': 'popovers-scene-guidance',
                  'popovers-scens-guidance': 'popovers-scene-guidance',
                  'popovers-scens-notes': 'popovers-scene-remark',
                  'popovers-scens-gas-fee': 'popovers-scene-gas-fee',
                  'popovers-scens-confirm': 'popovers-scene-confirm',
                };

                if (slug in popoverSceneLegacySlugs) {
                  return { path: `/components/${popoverSceneLegacySlugs[slug]}` };
                }

                if (slug === 'popovers-scene') {
                  return { path: '/components/popovers-scene-guidance' };
                }

                if (slug === 'dialog' || slug === 'reminder') {
                  return { path: '/components/dialog-standard' };
                }

                const familyLegacySlugs: Record<string, string> = {
                  popovers: 'popovers-popover',
                  popover: 'popovers-popover',
                  textarea: 'input-textarea',
                  segmented: 'tab-segmented',
                  checkbox: 'toggle-checkbox',
                  radio: 'toggle-radio',
                  switch: 'toggle-switch',
                  decide: 'toggle-decide',
                  toast: 'feedback-toast',
                  message: 'feedback-message',
                  reddot: 'feedback-reddot',
                  'end-feedback-card': 'feedback-end-feedback-card',
                  'form-submission': 'feedback-form-submission',
                  streamer: 'feedback-streamer',
                  pagination: 'paginer',
                  'data-grid': 'data-table-view',
                };

                if (slug in familyLegacySlugs) {
                  return { path: `/components/${familyLegacySlugs[slug]}` };
                }

                if (slug === 'tab-segmented-control') {
                  return { path: '/components/tab-segmented' };
                }

                /** §17 场景 slug 统一为 `{family}-scene-{scene}`；旧链接在此重定向。 */
                const sceneLegacySlugs: Record<string, string> = {
                  'tag-custom': 'tag-scene-palette',
                  'tag-status': 'tag-scene-status',
                  'tag-colorful': 'tag-scene-colorful',
                  'tag-palette': 'tag-scene-palette',
                  'dialog-symbol': 'dialog-scene-symbol',
                  'dialog-compose': 'dialog-scene-compose',
                  'flotation-box-cascade-menu': 'flotation-box-scene-cascade-menu',
                  'flotation-box-address-dropdown': 'flotation-box-scene-address-dropdown',
                  'flotation-box-address-hover': 'flotation-box-scene-address-hover',
                  'verify-email': 'verify-scene-email',
                  'verify-google': 'verify-scene-google',
                  'verify-login-password': 'verify-scene-login-password',
                  'verify-transaction-password': 'verify-scene-transaction-password',
                  'verify-passkey': 'verify-scene-passkey',
                  'verify-locked': 'verify-scene-locked',
                };

                if (slug in sceneLegacySlugs) {
                  return { path: `/components/${sceneLegacySlugs[slug]}` };
                }

                if (
                  slug === 'tooltip-container' ||
                  slug === 'tooltip-popup' ||
                  slug === 'tooltip-molde'
                ) {
                  return { path: '/components/tooltip-flotation' };
                }

                if (!isValidComponentSlug(slug)) {
                  return {
                    name: 'component-detail',
                    params: { slug: defaultComponentSlug },
                  };
                }
              },
            },
          ],
        },
        {
          path: 'patterns',
          component: PatternsView,
          children: [
            {
              path: '',
              redirect: {
                name: 'pattern-detail',
                params: { slug: defaultPatternSlug },
              },
            },
            {
              path: ':slug',
              name: 'pattern-detail',
              component: PatternDetailView,
              props: true,
              beforeEnter: (to) => {
                const slug = to.params.slug;
                if (slug === 'detail') {
                  return { path: '/components/detail' };
                }
                if (slug === 'list-fields') {
                  return {
                    name: 'pattern-detail',
                    params: { slug: 'list-field-currency' },
                  };
                }
                if (typeof slug !== 'string' || !isValidPatternSlug(slug)) {
                  return {
                    name: 'pattern-detail',
                    params: { slug: defaultPatternSlug },
                  };
                }
              },
            },
          ],
        },
        { path: 'scenes', redirect: '/patterns' },
        { path: 'scenes/:slug', redirect: (to) => `/patterns/${String(to.params.slug)}` },
        { path: 'workflows', name: 'workflows', component: WorkflowsView },
      ],
    },
  ],
});
