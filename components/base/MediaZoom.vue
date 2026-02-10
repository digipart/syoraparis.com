<script setup lang="ts">
import type { MediaType } from '~/types/MediaType';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Zoom, Thumbs, FreeMode } from 'swiper/modules';
import { ref } from 'vue';

const modules = [Pagination, Zoom, Thumbs, FreeMode];

const props = defineProps({
  medias: {
    type: Object as PropType<MediaType[]>,
    required: true,
  },
  startAt: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close']);
const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};
</script>

<template>
  <div
    class="mediaZoom-wrapper fixed inset-0 z-[2] bg-white flex flex-col h-dvh w-full"
  >
    <!-- Close Button -->
    <!-- <button
      @click="$emit('close')"
      class="absolute top-4 right-4 z-50 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Close zoom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button> -->

    <!-- Main Swiper -->
    <swiper
      :slides-per-view="1"
      :space-between="0"
      :mousewheel="true"
      :modules="modules"
      :zoom="true"
      :pagination="false"
      :initialSlide="props.startAt"
      :thumbs="{ swiper: thumbsSwiper }"
      class="mediaZoom flex-1 w-full"
    >
      <swiper-slide
        v-for="(media, index) in props.medias"
        :key="index"
        class="mediaZoom-slide relative flex items-center justify-center bg-white"
      >
        <div
          class="swiper-zoom-container w-full h-full flex items-center justify-center"
          v-if="media.type === 'image'"
        >
          <img
            :src="media.src"
            class="mediaZoom-image w-full h-full object-cover"
            :alt="media.alt || 'Zoom image'"
          />
        </div>
        <div
          v-else
          class="w-full h-full flex items-center justify-center relative"
        >
          <div class="absolute h-full blur w-full">
            <img
              :src="props.medias.find((m) => m.type === 'image')?.src"
              class="w-full h-full object-cover"
              :alt="media.alt || 'Thumbnail'"
            />
          </div>
          <CardProductVideo :videoUrl="media.src" class="h-full w-full" />
        </div>
      </swiper-slide>
    </swiper>

    <!-- Thumbs Swiper -->
    <div
      class="mediaZoom-thumbs-container w-full bg-white border-t border-gray-100"
    >
      <swiper
        @swiper="setThumbsSwiper"
        :spaceBetween="0"
        :slidesPerView="6.5"
        :freeMode="true"
        :watchSlidesProgress="true"
        :modules="modules"
        class="mediaZoom-thumbs h-20"
      >
        <swiper-slide
          v-for="(media, index) in props.medias"
          :key="index"
          class="cursor-pointer border border-transparent overflow-hidden relative"
        >
          <div
            class="w-full h-full bg-gray-50 flex items-center justify-center"
          >
            <img
              v-if="media.type === 'image'"
              :src="media.src"
              class="w-full h-full object-cover"
              :alt="media.alt || 'Thumbnail'"
            />
            <!-- Video Thumbnail Placeholder -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200 relative"
            >
              <img
                :src="props.medias.find((m) => m.type === 'image')?.src"
                class="w-full h-full object-cover"
                :alt="media.alt || 'Thumbnail'"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/50"
              >
                <IconVideo class="text-white" :size="2.5" />
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style lang="scss">
$mediaZoom: '.mediaZoom';

// Scoped styles for the thumbs highlighting
.mediaZoom-thumbs {
  .swiper-slide {
    opacity: 0.5;
    transition: all 0.2s ease;

    &.swiper-slide-thumb-active {
      opacity: 1;
    }
  }
}

// Ensure the main image can use height properly
#{$mediaZoom} {
  &-image {
    transition-duration: 150ms;
  }
}
</style>
