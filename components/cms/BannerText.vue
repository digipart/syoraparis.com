<template>
  <div class="bannerText" :class="[data?.display]">
    <LayoutContainer>
      <CmsRichText :data="data?.content" />
      <NuxtLink
        v-if="data?.cta"
        :to="data?.cta.link"
        class="mt-10 inline-block"
      >
        <BaseButton type="primary" size="large" plain class="min-w-52">
          {{ data?.cta.text }}
        </BaseButton>
      </NuxtLink>
    </LayoutContainer>
  </div>
</template>

<script setup lang="ts">
import type { CmsBannerTextType } from '~/types/cms/HomePageType';

const { data } = defineProps<{
  data?: CmsBannerTextType;
}>();
</script>

<style lang="scss">
$bannerText: '.bannerText';
#{$bannerText} {
  @apply py-10 lg:py-20;

  &.black {
    @apply bg-black text-white py-10 lg:py-20 font-light;
    h2 {
      @apply text-5xl lg:text-7xl;
    }
    p {
      @apply text-5xl lg:text-7xl;
      b {
        @apply font-medium;
      }
    }
  }

  h2 {
    @apply text-4xl font-medium uppercase mb-3;
    @screen mdMax {
      @apply text-2xl;
    }
  }
  p {
    @apply text-2xl;
    @screen mdMax {
      @apply text-base;
    }
    strong {
      @apply font-medium;
    }
  }
}
</style>
