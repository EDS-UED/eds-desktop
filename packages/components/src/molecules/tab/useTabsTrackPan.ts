import { nextTick, ref, watch, type Ref } from 'vue';

const SCROLL_EDGE_EPSILON = 2;

type ItemEls = (HTMLElement | null)[];

export function useTabsTrackPan(options: {
  enabled: Ref<boolean>;
  clipRef: Ref<HTMLElement | null>;
  trackRef: Ref<HTMLElement | null>;
  activeIndex: Ref<number>;
  itemEls: ItemEls;
  onPanChange?: () => void;
}) {
  const trackPanX = ref(0);
  const trackPanReady = ref(false);

  function resolveMinPan(viewportWidth: number, trackWidth: number): number {
    return Math.min(0, viewportWidth - trackWidth);
  }

  function measureTrackPanTarget(): number {
    const clip = options.clipRef.value;
    const track = options.trackRef.value;
    const index = options.activeIndex.value;
    const active = options.itemEls[index];

    if (!clip || !track || !active) return 0;

    const viewportWidth = clip.clientWidth;
    const trackWidth = track.scrollWidth;
    const minPan = resolveMinPan(viewportWidth, trackWidth);

    if (trackWidth - viewportWidth <= SCROLL_EDGE_EPSILON) {
      return 0;
    }

    const activeCenter = active.offsetLeft + active.offsetWidth / 2;
    const pan = viewportWidth / 2 - activeCenter;

    return Math.max(minPan, Math.min(0, pan));
  }

  function syncTrackPan() {
    if (!options.enabled.value) {
      trackPanX.value = 0;
      trackPanReady.value = false;
      options.onPanChange?.();
      return;
    }

    const nextPan = measureTrackPanTarget();
    if (!trackPanReady.value) {
      trackPanX.value = nextPan;
      requestAnimationFrame(() => {
        trackPanReady.value = true;
      });
    } else {
      trackPanX.value = nextPan;
    }
    options.onPanChange?.();
  }

  function scheduleSyncTrackPan() {
    nextTick(syncTrackPan);
  }

  watch(options.enabled, scheduleSyncTrackPan);
  watch(options.activeIndex, scheduleSyncTrackPan);

  return {
    trackPanX,
    trackPanReady,
    syncTrackPan: scheduleSyncTrackPan,
    resolveScrollFade(viewportWidth: number, trackWidth: number, scrollFadeEnabled: boolean) {
      if (!options.enabled.value || !scrollFadeEnabled) {
        return { left: false, right: false };
      }

      const canScroll = trackWidth - viewportWidth > SCROLL_EDGE_EPSILON;
      const minPan = resolveMinPan(viewportWidth, trackWidth);

      return {
        left: canScroll && trackPanX.value < -SCROLL_EDGE_EPSILON,
        right: canScroll && trackPanX.value > minPan + SCROLL_EDGE_EPSILON,
      };
    },
  };
}
