<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import type { ProductType } from '~/types/ProductType';
import type { ProductOrderType } from '~/types/OrderType';

const { product, imageSize } = defineProps({
  product: {
    type: {} as PropType<ProductType> | PropType<ProductOrderType>,
  },
  imageSize: {
    type: String as () => 'xsmall' | 'small' | 'medium',
    default: 'medium',
  },
  slider: {
    type: Boolean,
    default: true,
  },
});

const modules = [Navigation];

const title = computed(() => {
  if ((product as ProductOrderType).Title) {
    return (product as ProductOrderType)?.Title;
  } else {
    return (product as ProductType)?.Description?.Title;
  }
});

const videos = computed(() => {
  return (product as ProductType)?.Media?.Videos;
});

const images = computed(() => {
  let image = product?.Media?.Images?.product_medium;

  if (imageSize === 'xsmall') {
    image = product?.Media?.Images?.product_xsmall;
  }
  if (imageSize === 'small') {
    image = product?.Media?.Images?.product_small;
  }

  if (image) {
    return image;
  } else {
    return null;
  }
});
</script>

<template>
  <div
    v-if="images"
    class="cardProductImage"
    :class="{ hoveredImage: images?.length > 1 }"
  >
    <div class="relative hidden lg:block">
      <div
        v-if="videos?.length && videos.find((video) => video.Cover)"
        class="cardProductImage-image cardProductImage-image--primaire overflow-hidden"
      >
        <CardProductVideo
          v-if="images.length"
          :imagePlaceHolder="images[0]?.Src"
          class="w-full scale-[1.3]"
          :videoUrl="videos.find((video) => video.Cover)?.Src"
          :subTitle="title"
        />
      </div>
      <NuxtImg
        v-else
        :src="images[0]?.Src"
        :alt="title"
        class="cardProductImage-image cardProductImage-image--primaire"
        width="385"
        height="615"
        loading="lazy"
      />

      <NuxtImg
        v-if="!slider && images[1]"
        :src="images[1]?.Src"
        :alt="title"
        class="cardProductImage-image cardProductImage-image--second"
        width="385"
        height="615"
        loading="lazy"
      />
      <swiper
        v-else
        :slides-per-view="1"
        :space-between="0"
        :modules="modules"
        :initialSlide="1"
        class="w-full cardProductImage-image cardProductImage-image--carousel"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <NuxtImg
            v-if="image"
            :src="image.Src"
            :alt="title"
            class="cardProductImage-image"
            width="385"
            height="615"
            loading="lazy"
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
    </div>
    <div class="relative block lg:hidden w-full">
      <swiper
        :slides-per-view="1"
        :space-between="0"
        :modules="modules"
        :initialSlide="0"
        class="w-full cardProductImage-image"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <NuxtImg
            v-if="image"
            :src="image.Src"
            :alt="title"
            class="cardProductImage-image"
            width="385"
            height="615"
            loading="lazy"
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
    </div>
  </div>
</template>
<style lang="scss">
$cardProductImage: '.cardProductImage';

#{$cardProductImage} {
  & {
    --swiper-navigation-size: 12px;
  }
  // --swiper-theme-color: white
  @apply w-full relative;
  &-image {
    @apply w-full h-full duration-300 aspect-[1080/1610] object-cover;
    &--second {
      @apply absolute top-0 left-0 opacity-0 pointer-events-none;
    }
    &--carousel {
      @apply absolute top-0 left-0 h-full opacity-0 pointer-events-none;
    }
  }

  &.hoveredImage:hover {
    #{$cardProductImage} {
      &-image {
        &--primaire {
          @apply opacity-0 pointer-events-none;
        }
        &--second {
          @apply opacity-100 pointer-events-auto;
        }
        &--carousel {
          @apply opacity-100 pointer-events-auto;
        }
      }
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    width: 32px;
    height: 32px;
    top: 50%;
  }

  .swiper-button-prev,
  .swiper-rtl .swiper-button-next {
    left: 7px;
  }

  .swiper-button-next,
  .swiper-rtl .swiper-button-prev {
    right: 7px;
  }
}
</style>
