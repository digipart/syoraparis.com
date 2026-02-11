<script lang="ts" setup>
import type { MediaType } from '~/types/MediaType';
import type { ProductType } from '~/types/ProductType';

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const isVisibleZoomMedia = ref(false);
const startAt = ref(0);

const showZoomMedia = (index: number) => {
  startAt.value = index;
  isVisibleZoomMedia.value = true;
};

const imagesSmall = computed(() => {
  const image = product?.Media?.Images?.product_small;

  if (image) {
    return image;
  } else {
    return null;
  }
});

const imagesLarge = computed(() => {
  const image = product?.Media?.Images?.product_large;

  if (image) {
    return image;
  } else {
    return null;
  }
});

const videos = computed(() => {
  return product?.Media?.Videos;
});

const medias = computed((): MediaType[] => {
  const media: MediaType[] = [];

  if (videos.value) {
    videos.value.forEach((video, index) => {
      media.push({
        src: video.Src,
        type: 'video',
        key: index,
      });
    });
  }

  if (imagesLarge.value) {
    imagesLarge.value.forEach((image, index) => {
      media.push({
        src: image.Src,
        type: 'image',
        key: (videos.value?.length || 0) + index,
      });
    });
  }
  return media;
});
</script>

<template>
  <div class="cardProduct-imagesslide">
    <BaseDrawer v-model="isVisibleZoomMedia" size="100%" position="center">
      <div class="-m-5">
        <BaseMediaZoom :medias="medias" :startAt="startAt" />
      </div>
    </BaseDrawer>

    <div
      v-for="(video, index) in videos"
      class="cardProduct-imagesslide-image-wrapper"
      :key="`video-${index}`"
    >
      <CardProductVideo
        class="w-full"
        :videoUrl="video.Src"
        @click="showZoomMedia(index)"
      />
    </div>
    <div
      v-for="(image, index) in imagesSmall"
      :key="`image-${index}`"
      class="cardProduct-imagesslide-image-wrapper"
    >
      <NuxtImg
        :src="image.Src"
        class="cardProduct-imagesslide-image"
        @click="showZoomMedia(index + (videos?.length || 0))"
      />
    </div>
  </div>
</template>
<style lang="scss">
.cardProduct-imagesslide {
  @apply flex border-black border-t border-b overflow-auto;
  &-image {
    &-wrapper {
      @apply border-r border-black min-w-[76px];
      flex: 0 0 76px;
      &:last-child {
        @apply border-r-0;
      }
    }
  }
}
</style>
