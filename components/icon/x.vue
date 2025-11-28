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
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_213_1221)">
        <path
          d="M14.1452 13.439L0.710205 0.00396729L0.00309831 0.711074L13.4381 14.1461L14.1452 13.439Z"
          fill="currentColor"
        />
        <path
          d="M0.710966 14.1461L14.146 0.71106L13.4389 0.00395314L0.0038597 13.439L0.710966 14.1461Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_213_1221">
          <rect width="14.14" height="14.14" fill="transparent" />
        </clipPath>
      </defs>
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
