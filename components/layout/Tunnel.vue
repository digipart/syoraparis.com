<script setup lang="ts"></script>

<template>
  <div class="flex flex-col tunnel">
    <div v-if="$slots.header" class="tunnel-header">
      <slot name="header" />
    </div>

    <div class="flex-1 overflow-auto pb-5">
      <slot name="body" />
    </div>
    <div class="tunnel-bottom">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style lang="scss">
$tunnel: '.tunnel';

#{$tunnel} {
  height: calc(100dvh - 3.5rem);

  &-bottom {
    @apply border-t border-black;
  }
}
</style>
