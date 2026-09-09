<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgButton, type ButtonSize, type ButtonTone, type ButtonVariant } from '../button';
import { EgLinkButton, type LinkSize, type LinkTone } from '../link';
import styles from './Feedback.module.css';

export type StreamerType = 'info' | 'warning' | 'danger';
export type StreamerVisual = 'brand' | 'moderate';
export type StreamerButtonTone = Extract<ButtonTone, 'brand' | 'decor' | 'subtle'>;
export type StreamerLinkTone = Extract<LinkTone, 'brand' | 'decor'>;

const props = withDefaults(
  defineProps<{
    type?: StreamerType;
    visual?: StreamerVisual;
    text?: string;
    showSymbol?: boolean;
    showButton?: boolean;
    buttonLabel?: string;
    buttonVariant?: ButtonVariant;
    buttonTone?: StreamerButtonTone;
    buttonSize?: ButtonSize;
    showLink?: boolean;
    linkLabel?: string;
    linkTone?: StreamerLinkTone;
    linkSize?: LinkSize;
    href?: string;
  }>(),
  {
    type: 'info',
    visual: 'brand',
    text: 'Connect to EDS',
    showSymbol: true,
    showButton: false,
    buttonLabel: 'Button',
    buttonVariant: 'outline',
    buttonTone: 'subtle',
    buttonSize: 'xs',
    showLink: false,
    linkLabel: 'Button',
    linkTone: 'brand',
    linkSize: 'md',
    href: '#',
  },
);

const iconName = computed(() =>
  props.type === 'info' ? 'eds-information-fill' : 'eds-warning-fill',
);

const rootClass = computed(() => {
  const classes = [styles.streamer];
  switch (props.type) {
    case 'danger':
      classes.push(styles.streamerDanger);
      break;
    case 'warning':
      classes.push(styles.streamerWarning);
      break;
    default:
      classes.push(styles.streamerInfo);
  }
  if (props.visual === 'moderate') {
    classes.push(styles.streamerVisualModerate);
  }
  return classes;
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return styles.streamerIconDanger;
    case 'warning':
      return styles.streamerIconWarning;
    default:
      return styles.streamerIconInfo;
  }
});

</script>

<template>
  <div class="eds-streamer" :class="rootClass" role="alert">
    <div :class="styles.streamerMain">
      <span v-if="showSymbol" :class="[styles.streamerIcon, iconClass]">
        <EgIcon :name="iconName" fit fill-tone="primary" />
      </span>
      <span class="eds-streamer__text" :class="styles.streamerText">{{ text }}</span>
    </div>
    <div v-if="showButton || showLink" :class="styles.streamerActions">
      <EgButton
        v-if="showButton"
        :variant="buttonVariant"
        :size="buttonSize"
        :tone="buttonTone"
        type="button"
      >
        {{ buttonLabel }}
      </EgButton>
      <EgLinkButton
        v-if="showLink"
        :tone="linkTone"
        :size="linkSize"
        :href="href"
      >
        {{ linkLabel }}
      </EgLinkButton>
    </div>
  </div>
</template>
