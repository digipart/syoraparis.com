<script setup lang="ts">
const { small } = defineProps({
  small: {
    type: Boolean,
    default: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="container px-5 mx-auto"
    :class="{
      'lg:max-w-[1240px]': small,
      'lg:max-w-[100%]': full,
    }"
  >
    <slot />
  </div>
</template>
<style lang=""></style>
