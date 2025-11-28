<template>
  <span
    class="color"
    :class="[size, { active }]"
    :style="{
      backgroundColor: color,
    }"
  >
  </span>
</template>

<script setup lang="ts">
const { color } = defineProps({
  color: {
    type: String,
    default: '#ffffff',
  },
  active: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'small',
  },
});
</script>

<style scoped lang="scss">
.color {
  @apply block relative;
  &::after {
    content: '';
    @apply absolute left-[-2px] top-[-2px] 
      border border-black opacity-0 duration-150;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
  }

  &.small {
    @apply h-2 w-2;
    @media lg {
      @apply h-2.5 w-2.5;
    }
  }

  &.medium {
    @apply h-4 w-4;
  }

  &.large {
    @apply h-6 w-6;
  }

  &:hover {
    &::after {
      @apply opacity-50;
    }
  }
  &.active {
    &::after {
      @apply opacity-100;
    }
  }
}
</style>
