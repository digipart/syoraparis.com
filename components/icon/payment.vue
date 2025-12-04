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
      viewBox="0 0 20 20"
    >
      <path
        fill="currentColor"
        d="M13.5 13a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zM2 6.75A2.75 2.75 0 0 1 4.75 4h10.5A2.75 2.75 0 0 1 18 6.75v6.5A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25zM4.75 5A1.75 1.75 0 0 0 3 6.75V8h14V6.75A1.75 1.75 0 0 0 15.25 5zM17 9H3v4.25c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0 0 17 13.25z"
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
