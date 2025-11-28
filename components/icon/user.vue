<template>
  <span
    class="icon"
    :style="{
      width: `${size}em`,
      height: `${size}em`,
    }"
  >
    <svg
      :style="{
        width: `100%`,
      }"
      viewBox="0 0 16 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.98413 6.1429C3.98413 8.7143 6.42853 10 8.00003 10C9.57143 10 12.0159 8.7143 12.0159 6.1429V4.4286C12.0159 3 10.7936 1 8.00003 1C5.20633 1 3.98413 3 3.98413 4.4286V6.1429Z"
        stroke="currentColor"
        stroke-width="0.830323"
      />
      <path
        d="M1 14.5233C1 14.5233 2.337 13.008 3.4843 12.5233C5.1107 11.8362 6.2257 12.0237 8 12.0233C9.7779 12.0229 10.8989 11.8367 12.525 12.5233C13.6665 13.0052 15 14.5087 15 14.5087"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-linecap="square"
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
