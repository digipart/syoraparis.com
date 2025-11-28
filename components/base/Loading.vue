<template>
  <div class="loadingPage" v-show="loadingPage">
    <div class="loadingPage-bg"></div>
    <div class="loadingPage-wrapper">
      <BaseLogo />
      <IconProgress class="loadingPage-spinner ml-2 text-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loadingPage } = toRefs(useAppStore());
</script>

<style lang="scss">
$loadingPage: '.loadingPage';

#{$loadingPage} {
  @apply h-dvh w-full fixed top-0 left-0  z-[1000];
  &-bg {
    @apply bg-white h-full w-full relative  z-0;
    --tw-bg-opacity: 0.6;
  }
  &-wrapper {
    @apply border border-black p-10
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    z-[2] flex items-center bg-white;
  }

  &-spinner {
    animation-name: loadingPagespin;
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-timing-function: linear;
    transform-origin: center;
    @keyframes loadingPagespin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
