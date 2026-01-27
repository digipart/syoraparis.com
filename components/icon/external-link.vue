<template>
  <span
    class="icon"
    :style="{
      width: `${size}em`,
      height: `${size}em`,
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :style="{
        width: `100%`,
      }"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M18.607 11.035v7.929a2.27 2.27 0 0 1-2.3 2.286H5.05a2.27 2.27 0 0 1-2.299-2.3V7.693a2.273 2.273 0 0 1 2.3-2.3h7.928M21.25 2.75L10.679 13.321M15.964 2.75h5.286v5.286"
      />
    </svg>
  </span>
</template>
<script setup lang="ts">
const { size, color } = defineProps({
  size: {
    type: Number,
    default: 1.5,
  },
  color: {
    type: String,
    default: 'black',
  },
});
</script>
<style lang="scss" scoped>
.icon {
  @apply inline-flex p-1;
}
svg {
  font-size: 16px;
}
</style>
