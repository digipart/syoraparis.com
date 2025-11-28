<script setup lang="ts">
import type { MediaType } from '~/types/MediaType';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';


const modules = [Pagination];

const { medias } = defineProps({
  medias: {
    type: {} as PropType<MediaType[]>,
  },
  startAt: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <swiper
    :slides-per-view="1"
    :space-between="0"
    :mousewheel="true"
    class="mediaZoom"
    :modules="modules"
    :pagination="{ type: 'progressbar' }"
    :initialSlide="startAt"
  >
    <swiper-slide
      v-for="(media, index) in medias"
      :key="index"
      class="mediaZoom-slide"
    >
      <NuxtImg
        v-if="media.type === 'image'"
        :src="media.src"
        ref="bigImg"
        class="mediaZoom-image"
      />
      <CardProductVideo v-else :videoUrl="media.src" />
    </swiper-slide>
  </swiper>
</template>

<style lang="scss">
$mediaZoom: '.mediaZoom';

#{$mediaZoom} {
  &-image {
    @apply w-full h-dvh object-cover duration-150;
  }
}
</style>
<style lang="scss">
$pageProductMedia: '.mediaZoom';
#{$pageProductMedia} {
  &.swiper-horizontal > .swiper-pagination-progressbar,
  .swiper-pagination-progressbar.swiper-pagination-horizontal {
    @apply top-auto bottom-2.5 left-5 bg-white h-[1px];
    --tw-bg-opacity: 0.5;
    width: calc(100% - 40px);
  }
}
</style>
