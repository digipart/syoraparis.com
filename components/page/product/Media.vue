<script setup lang="ts">
import type { MediaType } from '~/types/MediaType';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination as pagination, Mousewheel, FreeMode } from 'swiper/modules';

import type { SwiperOptions } from 'swiper/types';

const modules = [pagination, Mousewheel, FreeMode];

const { medias, mediasXl, startAt, alt } = defineProps({
  mediasXS: {
    type: Array as PropType<MediaType[]>,
    required: true,
  },
  medias: {
    type: Array as PropType<MediaType[]>,
    required: true,
  },
  mediasXl: {
    type: Array as PropType<MediaType[]>,
    required: true,
  },
  startAt: {
    type: Number,
    default: 0,
  },
  alt: {
    type: String,
    required: true,
  },
});

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const activeIndex = ref<number>(0);
let swiperInstance: any | null = null;

const isVisibleZoomMedia = ref(false);
const zoomStartAt = ref(0);
const showZoomMedia = (index: number) => {
  zoomStartAt.value = index;
  isVisibleZoomMedia.value = true;
};

const onSwiper = (swiper: any): void => {
  swiperInstance = swiper;
  activeIndex.value = swiper.activeIndex;
};

const onSlideChange = (): void => {
  if (swiperInstance) {
    activeIndex.value = swiperInstance.activeIndex;
  }
};

const setActiveSlide = (index: number): void => {
  if (swiperInstance) {
    swiperInstance.slideTo(index);
  }
};

const breakpoints: any = {
  '0': {
    direction: 'horizontal',
    slidesPerView: 1,
  },
  '768': {},
  '1024': {
    direction: 'vertical',
    slidesPerView: 'auto',
  },
};

// const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);

const getPaginationType = (): SwiperOptions['pagination'] => ({
  type: 'progressbar',
});

const eleImage = ref<HTMLElement[] | null>([]);
const scrollbar = ref<InstanceType<typeof PerfectScrollbar> | null>(null);
// Function to chunk medias array in an alternating pattern

const stepNext = computed(() => {
  return windowWidth.value > 991 ? 2 : 1;
});

const chunkedMedias = computed(() => {
  const chunked: MediaType[][] = [];
  let i = 0;

  while (i < medias.length) {
    // Push a single element (one item row)
    chunked.push([medias[i]]);
    i++;

    // Check if there's still more media left to create a pair
    if (i < medias.length) {
      // Push two elements (pair of items in the next row)
      chunked.push(medias.slice(i, i + stepNext.value));
      i += stepNext.value;
    }
  }

  return chunked;
});

const scrollToElement = (index: number) => {
  setActiveSlide(index);
};
</script>

<template>
  <div class="pageProductMedia flex justify-center">
    <BaseDrawer v-model="isVisibleZoomMedia" size="100%" position="center">
      <div class="-m-5 hidden lg:block">
        <BaseMediaZoomDesktop
          :medias="mediasXl"
          :startAt="zoomStartAt"
          @onOutClick="isVisibleZoomMedia = false"
        />
      </div>
      <div class="-m-5 block lg:hidden">
        <BaseMediaZoom
          :medias="mediasXl"
          :startAt="zoomStartAt"
          @onOutClick="isVisibleZoomMedia = false"
        />
      </div>
    </BaseDrawer>

    <swiper
      :space-between="0"
      :mousewheel="true"
      class="pageProductMedia-media h-auto pagination-lines !mx-0 w-full"
      :modules="modules"
      :pagination="getPaginationType()"
      :breakpoints="breakpoints"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :freeMode="windowWidth > 991"
    >
      <swiper-slide
        v-for="(group, groupIndex) in chunkedMedias"
        :key="groupIndex"
        class="pageProductMedia-slide"
      >
        <div class="flex">
          <template v-for="(media, index) in group" :key="index">
            <NuxtImg
              v-if="media.type === 'image'"
              :src="media.src"
              :alt="alt"
              class="object-cover"
              :class="{
                'w-full': group.length === 1,
                'w-1/2': group.length !== 1,
              }"
              @click="showZoomMedia(media.key)"
            />
            <CardProductVideo
              v-else-if="media.type === 'video' && group.length"
              :imagePlaceHolder="
                chunkedMedias[1][0] ? chunkedMedias[1][0].src : undefined
              "
              :videoUrl="media.src"
              class="w-full h-full"
              @click="showZoomMedia(media.key)"
            />
          </template>
        </div>
      </swiper-slide>
    </swiper>

    <div class="themps hidden lg:flex">
      <div
        class="flex flex-col gap-y-0.5"
        v-for="(group, groupIndex) in chunkedMedias"
        :key="groupIndex"
      >
        <div class="themp" v-for="(media, index) in group" :key="index">
          <NuxtImg
            v-if="media.type === 'image'"
            :src="media.src"
            :alt="alt"
            :class="{ active: index === activeIndex }"
            @click="scrollToElement(groupIndex)"
          />
          <CardProductVideo
            v-else-if="group.length"
            :imagePlaceHolder="
              chunkedMedias[1][0] ? chunkedMedias[1][0].src : undefined
            "
            class="w-full"
            :videoUrl="media.src"
            :subTitle="alt"
            :class="{ active: index === activeIndex }"
            @click="scrollToElement(groupIndex)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$pageProductMedia: '.pageProductMedia';

#{$pageProductMedia} {
  @apply relative;
  &-media {
    @screen lg {
      height: calc(100vh - 3.5rem);
    }
  }
  &-slide {
    cursor: url('~/assets/images/zoom-in.svg'), auto;
    @apply h-auto;
  }
  .swiper-horizontal > .swiper-pagination-progressbar,
  .swiper-pagination-progressbar.swiper-pagination-horizontal {
    @apply top-auto bottom-2.5 left-5 right-5 bg-white;
  }
}

.themp {
  @apply duration-150 relative cursor-pointer border opacity-50;
  &:hover {
    @apply z-10 opacity-100;
  }

  &s {
    @apply w-16 ml-5 flex-col justify-end gap-0.5  absolute bottom-5 right-5 z-10;
    flex: 0 0 4rem;
  }

  &.active {
    @apply opacity-100;
  }
}
</style>
<style lang="scss">
$pageProductMedia: '.pageProductMedia';
#{$pageProductMedia} {
  .swiper-horizontal > .swiper-pagination-progressbar,
  .swiper-pagination-progressbar.swiper-pagination-horizontal {
    @apply top-auto bottom-2.5 left-5 bg-white h-[1px];
    --tw-bg-opacity: 0.5;
    width: calc(100% - 40px);
  }

  .ps {
    .ps__rail-y {
      left: 20px;
    }
  }
  .swiper-pagination {
    @apply px-0 py-0;
  }
}
</style>
