<template>
  <div class="carouselProduct" v-if="products" :class="[name]">
    <div v-if="$slots.top" class="flex justify-between mb-4 lg:mb-5">
      <slot name="top" />
      <div class="navigation">
        <div class="swiper-button-prev custom-swiper-button">
          <IconArrowLeft color="black" />
        </div>
        <div class="swiper-button-next custom-swiper-button">
          <IconArrowRight color="black" />
        </div>
      </div>
    </div>
    <div class="overflow-hidden">
      <ClientOnly>
        <swiper
          :slides-per-view="1"
          :space-between="0"
          :modules="modules"
          :breakpoints="breakpoints"
          class="carouselProduct-swiper"
          :navigation="{
            nextEl: `.${name} .swiper-button-next`,
            prevEl: `.${name} .swiper-button-prev`,
          }"
        >
          <template v-for="(product, index) in products" :key="index">
            <swiper-slide v-if="product">
              <CardProduct :product="product" :slider="false" />
            </swiper-slide>
          </template>
        </swiper>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import type { ProductType } from '~/types/ProductType';

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const { products } = defineProps({
  products: {
    type: Array as () => ProductType[],
    default: [],
  },
  name: {
    type: String,
    default: 'carousel',
  },
});

// const hasNavigation = computed(() => {
//   if (windowWidth.value < 768) {
//     return products.length > 2;
//   } else if (windowWidth.value < 1024) {
//     return products.length > 2;
//   } else if (windowWidth.value >= 1024) {
//     return products.length > 4;
//   }

//   return false;
// });

const modules = [Navigation];

const breakpoints: any = {
  '0': {
    slidesPerView: 2.1,
  },
  '768': {
    slidesPerView: 2.5,
  },
  '1024': {
    slidesPerView: 4.5,
  },
};
</script>

<style lang="scss">
$carouselProduct: '.carouselProduct';

#{$carouselProduct} {
  #{$carouselProduct}-swiper {
    @apply ml-5 lg:ml-10 pb-[1px] overflow-visible;
  }
}
</style>

<style scoped lang="scss">
.custom-swiper-button {
  @apply relative left-auto right-auto;

  &::after {
    display: none;
  }
}

.navigation {
  @apply relative flex justify-end;
  padding-right: 20px;

  @screen lg {
    padding-right: 10.6%;
  }
}
</style>
