<template>
  <component
    :is="name"
    class="headline"
    :class="[size]"
    :style="{
      '-webkit-line-clamp': lines || 'none',
    }"
  >
    <slot />
  </component>
</template>
<script setup lang="ts">
const { name, size, lines } = defineProps({
  name: {
    type: String,
    default: 'h2',
  },
  lines: {
    type: Number,
  },
  size: {
    type: String as () =>
      | 'auto'
      | 'xs'
      | 'sm'
      | 'md'
      | 'lg'
      | 'xl'
      | '_2xl'
      | '_3xl',
    default: 'auto',
  },
});
</script>
<style lang="scss">
$headline: '.headline';

#{$headline} {
  letter-spacing: 0.8px;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  &.xs {
    @apply text-xxs;
    @screen lg {
      @apply text-xs;
    }
  }
  &.sm {
    @apply text-xs;
    @screen lg {
      @apply text-sm;
    }
  }
  &.md {
    @apply text-base;
  }
  &.lg {
    @apply text-sm;
    @screen lg {
      @apply text-lg;
    }
  }
  &.xl {
    @apply text-base;
    @screen lg {
      @apply text-xl;
    }
  }
  &._2xl {
    @apply text-xl;
    @screen lg {
      @apply text-2xl;
    }
  }
  &._3xl {
    @apply text-2xl;
    @screen lg {
      @apply text-3xl;
    }
  }
}
</style>
