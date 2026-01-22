<script setup lang="ts">
import type { MediaType } from '~/types/MediaType';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Zoom } from 'swiper/modules';


const modules = [Pagination, Zoom];

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
    :zoom="true"
    :pagination="{ type: 'progressbar' }"
    :initialSlide="startAt"
  >
    <swiper-slide
      v-for="(media, index) in medias"
      :key="index"
      class="mediaZoom-slide"
    >
      <div class="swiper-zoom-container" v-if="media.type === 'image'">
        <img :src="media.src" class="mediaZoom-image" />
      </div>
      <CardProductVideo v-else :videoUrl="media.src" />
    </swiper-slide>
  </swiper>
</template>

<style lang="scss">
$mediaZoom: '.mediaZoom';

#{$mediaZoom} {
  &-image {
    @apply w-full h-dvh object-contain duration-150;
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
