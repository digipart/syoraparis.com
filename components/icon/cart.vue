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
      viewBox="0 0 13 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_124_3391)">
        <path
          d="M0.5 15.5V5.00025H11L12.3001 5.00013L12.5 5.00009V15.5H0.5Z"
          stroke="currentColor"
          stroke-linejoin="round"
        />
        <path
          d="M3.50028 5C3.50028 5 3.00024 1 6.50024 1C10.0003 1 9.50023 5 9.50023 5"
          stroke="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_124_3391">
          <rect width="13" height="16" fill="white" />
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
