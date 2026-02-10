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
      viewBox="0 0 32 32"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m22 13l8-5v16l-8-5ZM2 8v16h20V8Z"
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
