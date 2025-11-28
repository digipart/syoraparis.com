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
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.5" cy="8.5" r="8" stroke="#C9C9C9" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.5243 15.7237C9.88037 15.9038 9.20143 16.0001 8.5 16.0001C4.35786 16.0001 1 12.6422 1 8.50006C1 4.35793 4.35786 1.00006 8.5 1.00006C11.6227 1.00006 14.2997 2.90848 15.4282 5.62263L16.3805 5.3084C15.1185 2.19553 12.0656 6.10352e-05 8.5 6.10352e-05C3.80558 6.10352e-05 0 3.80564 0 8.50006C0 13.1945 3.80558 17.0001 8.5 17.0001C9.31088 17.0001 10.0952 16.8865 10.8381 16.6745L10.5243 15.7237Z"
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
