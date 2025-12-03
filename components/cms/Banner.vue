<template>
  <NuxtLink v-if="data" :to="localePath(data?.cta?.link || '/')" class="banner">
    <CmsImage
      v-if="data?.type === 'image'"
      :image="data?.image"
      class="banner-bg"
    />
    <template v-else>
      <BaseVideoBackground
        class="banner-video"
        v-if="data?.video"
        :videos="data?.video"
      />
    </template>

    <div class="banner-box px-5 py-5 lg:py-10">
      <div class="sticky top-0 z-10 h-full max-h-screen">
        <div class="flex items-center h-full">
          <div class="sticky top-[calc(50%_-_0.5em_*_1.02)] z-30">
            <BaseHeadLine class="banner-title" size="auto">
              {{ data.title }}
            </BaseHeadLine>
            <p v-if="data.subTitle" class="banner-subtitle">
              {{ data.subTitle }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CmsBannerType } from '~/types/cms/HomePageType';

const { data } = defineProps<{
  data?: CmsBannerType;
}>();

const localePath = useLocalePath();
</script>

<style lang="scss">
$banner: '.banner';
#{$banner} {
  @apply flex flex-col items-center justify-center relative;

  &-box {
    @apply absolute top-0 left-0  z-10 w-full h-full min-h-full flex-1 bg-black/20;
  }

  &-bg {
    @apply relative min-h-full w-full bg-no-repeat bg-center bg-cover;
    @screen lg {
      background-position: center 18%;
    }
  }
  &-video {
    // @apply h-dvh;
  }

  &-footer {
    @apply p-5 w-full text-center text-white font-light text-2xl;
  }

  #{$banner} {
    &-title {
      @apply text-3xl leading-[1] font-semibold uppercase text-white;

      @screen lg {
        @apply text-6xl leading-[0.8];
      }
      i {
        @apply font-[100] not-italic;
      }
    }
    &-subtitle {
      @apply text-base font-light leading-none uppercase text-white;

      @screen lg {
        @apply text-base;
      }
    }
  }
}
</style>
