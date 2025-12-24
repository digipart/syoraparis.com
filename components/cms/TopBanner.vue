<template>
  <div
    v-if="topBanner.length && topBannerVisible"
    class="cmsTopBanner text-white overflow-hidden"
  >
    <ClientOnly>
      <swiper
        :slides-per-view="1"
        :space-between="0"
        :loop="true"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        :modules="modules"
        :direction="'vertical'"
        class="h-10"
        :speed="1000"
      >
        <swiper-slide v-for="banner in topBanner" :key="banner.id">
          <LayoutContainer class="text-center text-xs lg:text-base">
            <NuxtLink
              v-if="banner.link"
              :to="localePath(banner.link)"
              class="py-2 h-10 flex items-center justify-center"
            >
              {{ banner.text }}
            </NuxtLink>
            <span v-else class="block py-2">{{ banner.text }}</span>
          </LayoutContainer>
        </swiper-slide>
      </swiper>
    </ClientOnly>
    <BaseButton
      @click="close()"
      class="absolute right-2 top-0.5 z-10"
      size="small"
      icon
      :title="$t('button.close')"
    >
      <IconX :color="'white'" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
const modules = [Autoplay];

const cmsShopSetting = useCmsShopSetting();
const { topBanner, topBannerVisible } = toRefs(cmsShopSetting);
const { closeTopBannerVisible } = cmsShopSetting;

const localePath = useLocalePath();

const emit = defineEmits(['onClose']);

const close = () => {
  closeTopBannerVisible();
  emit('onClose');
};
</script>

<style lang="scss">
$cmsTopBanner: '.cmsTopBanner';

#{$cmsTopBanner} {
  @apply bg-black relative;
}
</style>
