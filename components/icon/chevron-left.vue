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
      viewBox="0 0 10 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.9055 0.097302C9.77993 -0.032434 9.57696 -0.032434 9.45139 0.097302L0.0941791 9.76546C-0.031393 9.89519 -0.031393 10.1049 0.0941791 10.2346L9.45171 19.9028C9.51433 19.9675 9.59655 20 9.67876 20C9.76098 20 9.8432 19.9675 9.90582 19.9028C10.0314 19.773 10.0314 19.5633 9.90582 19.4336L0.775351 10L9.9055 0.566475C10.0311 0.436739 10.0311 0.227038 9.9055 0.097302Z"
        fill="currentColor"
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
