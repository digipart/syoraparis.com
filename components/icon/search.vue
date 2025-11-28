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
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_124_3388)">
        <path
          d="M6.21825 12.7724C9.37635 12.7724 11.9365 10.2123 11.9365 7.05419C11.9365 3.89609 9.37635 1.33594 6.21825 1.33594C3.06015 1.33594 0.5 3.89609 0.5 7.05419C0.5 10.2123 3.06015 12.7724 6.21825 12.7724Z"
          stroke="currentColor"
        />
        <path d="M14.9226 17.0027L9.32617 11.4062" stroke="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_124_3388">
          <rect width="16" height="18" fill="white" />
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
