<script setup lang="ts">
const { videoUrl, subTitle } = defineProps({
  videoUrl: {
    type: String,
  },
  imagePlaceHolder: {
    type: String,
  },
  subTitle: {
    type: String,
    default: '',
  },
});


</script>

<template>
  <div class="relative cardProductVideo">
    <NuxtImg
      v-if="imagePlaceHolder"
      class="absolute top-0 left-0 w-full h-full"
      :src="imagePlaceHolder"
    />
    <iframe
      :src="`${videoUrl}?autoplay=1&loop=1&autopause=0&background=1&muted=1`"
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
      :title="subTitle"
      class="h-full w-full relative z-10 bg-white pointer-events-none"
    ></iframe>
  </div>
</template>

<style lang="scss">
$cardProductVideo: '.cardProductVideo';

#{$cardProductVideo} {
  @apply relative aspect-[480/660];
}
</style>
