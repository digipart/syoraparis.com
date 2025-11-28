<template>
  <div v-if="computedVimeoUrl" class="video-background">
    <iframe
      :src="computedVimeoUrl"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
      :style="{ aspectRatio: video?.aspectRatio }"
    >
    </iframe>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { CmsVideoType } from '~/types/cms/CmsVideoType';

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

// Define props
interface Props {
  videos: CmsVideoType;
}

// Use props with type safety
const { videos } = defineProps<Props>();

// Define default query parameters
const defaultParams: Record<string, string> = {
  background: '1',
  autoplay: '1',
  loop: '1',
  muted: '1',
  controls: '0',
};

const defaultVideo = computed(() => {
  if (videos.desktop?.url) {
    return videos.desktop;
  }
  if (videos.tablet?.url) {
    return videos.desktop;
  }
  if (videos.mobile?.url) {
    return videos.desktop;
  }
  return null;
});

const mobileVideo = computed(() => {
  if (videos.mobile?.url) {
    return videos.desktop;
  }
  return defaultVideo.value;
});

const tabletVideo = computed(() => {
  if (videos.tablet?.url) {
    return videos.desktop;
  }
  return defaultVideo.value;
});

const video = computed(() => {
  if (windowWidth.value > 992) {
    return defaultVideo.value;
  }
  if (windowWidth.value > 767) {
    return tabletVideo.value;
  }
  return mobileVideo.value;
});

const computedVimeoUrl = computed(() => {
  if (video.value?.url) {
    const url = new URL(video.value?.url);

    Object.keys(defaultParams).forEach((param) => {
      if (!url.searchParams.has(param)) {
        url.searchParams.set(param, defaultParams[param]);
      }
    });

    return url.toString();
  }
  return null;
});
</script>

<style lang="scss">
.video-background {
  @apply w-full overflow-hidden pointer-events-none;
}

.video-background iframe {
  @apply w-full;
}
</style>
