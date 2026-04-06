<template>
  <div class="hr" :style="{ marginBottom: spacing, marginTop: spacing }">
    <span v-if="label" class="hr-label" :class="[position]">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const { label, spacing, position } = withDefaults(
  defineProps<{
    label?: string;
    spacing?: string;
    position?: 'center' | 'start';
  }>(),
  {
    spacing: '20px',
    position: 'center',
  }
);
</script>

<style lang="scss">
.hr {
  @apply relative h-[1px] bg-gray-bbb/50 w-full my-5;

  &-label {
    @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    bg-white px-2 lg:px-5 text-gray-888;
    @apply text-xxs lg:text-xs w-52 text-center;

    &.start {
      @apply left-4 translate-x-0;
    }
  }
}
</style>
