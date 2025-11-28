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
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.0973016 0.0944996C-0.0324344 0.22007 -0.0324344 0.42304 0.0973016 0.54861L9.76546 9.90582C9.89519 10.0314 10.1049 10.0314 10.2346 9.90582L19.9028 0.548289C19.9675 0.485669 20 0.40345 20 0.32124C20 0.23902 19.9675 0.156799 19.9028 0.0941792C19.773 -0.0314008 19.5633 -0.0314007 19.4336 0.0941793L10 9.22465L0.566475 0.0944996C0.436739 -0.0311004 0.227038 -0.0311004 0.0973016 0.0944996Z"
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
