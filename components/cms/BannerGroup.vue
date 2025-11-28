<script setup lang="ts">
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import type { CmsBannerType } from '~/types/cms/HomePageType';
const modules = [Pagination, Autoplay, EffectFade];

const { benners } = defineProps({
  benners: {
    type: {} as PropType<CmsBannerType[]>,
  },
});
</script>

<template>
  <div class="CmsGroupBanner">
    <swiper
      :slides-per-view="1"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :space-between="0"
      :mousewheel="true"
      :modules="modules"
      :loop="true"
      :effect="'fade'"
      :speed="1000"
      :pagination="{
        clickable: true,
      }"
    >
      <swiper-slide
        v-for="(banner, index) in benners"
        :key="index"
        class="mediaZoom-slide"
      >
        <CmsBanner :data="banner" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss">
$CmsGroupBanner: '.CmsGroupBanner';

#{$CmsGroupBanner} {
  .banner-bg {
    img {
      height: calc(100vh - 120px);
      @apply object-cover object-top;
    }
  }
}
</style>
