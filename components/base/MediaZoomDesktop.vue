<script setup lang="ts">
import type { MediaType } from '~/types/MediaType';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';

const { medias, startAt } = defineProps({
  medias: {
    type: {} as PropType<MediaType[]>,
    required: true,
  },
  startAt: {
    type: Number,
    default: 0,
  },
});

const modules = [Navigation, Pagination];

const activeIndex = ref<number>(0);
let swiperInstance: any | null = null;

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

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

const backgroundPositionY = ref('');

const bigImg = ref<HTMLElement[]>([]);
const setBgImagePos = ($e: MouseEvent, index: number) => {
  if (bigImg.value && bigImg.value[index]) {
    const e = bigImg.value[index];
    const y = $e.clientY;
    const h = e.clientHeight;
    backgroundPositionY.value = `${(y / h) * 100}%`;
  }
};

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
</script>

<template>
  <div class="relative mediaZoomDesktop">
    <swiper
      :slides-per-view="1"
      :space-between="0"
      :mousewheel="true"
      class=""
      :modules="modules"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :initialSlide="startAt"
      :pagination="{ type: 'progressbar' }"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }"
    >
      <swiper-slide
        v-if="medias"
        v-for="(media, index) in medias"
        :key="index"
        class="mediaZoomDesktop-slide"
        @click="$emit('onOutClick')"
      >
        <div
          v-if="media.type === 'image'"
          ref="bigImg"
          class="mediaZoomDesktop-image"
          @mousemove="setBgImagePos($event, index)"
          :style="{
            backgroundImage: `url('${media.src}')`,
            backgroundPositionY,
          }"
        ></div>
        <CardProductVideo
          class="h-screen mx-auto"
          :imagePlaceHolder="medias[0] ? medias[0].src : undefined"
          v-else
          :videoUrl="media.src"
        />
      </swiper-slide>
      <div
        @click="($event) => $event.stopPropagation()"
        class="swiper-button-prev custom-swiper-button"
      ></div>
      <div
        @click="($event) => $event.stopPropagation()"
        class="swiper-button-next custom-swiper-button"
      ></div>
    </swiper>
    <div class="themps hidden lg:flex">
      <div
        class="flex flex-col gap-y-0.5"
        v-for="(group, groupIndex) in chunkedMedias"
        :key="groupIndex"
      >
        <div
          class="themp"
          v-for="(media, index) in group"
          :key="index"
          @click="setActiveSlide(media.key)"
        >
          <NuxtImg
            v-if="media.type === 'image'"
            :src="media.src"
            :class="{ active: index === activeIndex }"
          />
          <CardProductVideo
            v-else-if="group.length"
            :imagePlaceHolder="
              chunkedMedias[1][0] ? chunkedMedias[1][0].src : undefined
            "
            class="w-full"
            :videoUrl="media.src"
            :class="{ active: index === activeIndex }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$mediaZoomDesktop: '.mediaZoomDesktop';

#{$mediaZoomDesktop} {
  &-image {
    @apply w-full h-dvh bg-no-repeat bg-cover bg-center;
  }
  &-slide {
    cursor: url('~/assets/images/zoom-out.svg'), auto;
  }
  .swiper-horizontal > .swiper-pagination-progressbar,
  .swiper-pagination-progressbar.swiper-pagination-horizontal {
    @apply top-auto bottom-2.5 left-5 bg-white h-[1px];
    --tw-bg-opacity: 0.5;
    width: calc(100% - 40px);

    @screen lg {
      @apply hidden;
    }
  }
}
</style>

<style lang="scss" scoped>
.themp {
  @apply duration-150 relative cursor-pointer border opacity-50;
  &:hover {
    @apply scale-105 z-10 opacity-100;
  }

  &s {
    @apply w-16 flex-col justify-end gap-0.5 
    absolute bottom-5 left-5 z-10 hidden;
    flex: 0 0 4rem;

    @screen lg {
      @apply flex;
    }
  }

  &.active {
    @apply opacity-100;
  }
}
</style>
