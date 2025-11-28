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
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7986 6.24478V14.5H4.27347V6.21285V5.45297L3.57561 5.75367L2.06421 6.4049L0.65168 3.01817L6.15234 0.647285C6.40042 1.0699 6.73821 1.43453 7.14415 1.713C7.69187 2.08874 8.33833 2.29018 9.00069 2.29048L9.00115 2.29048C9.66352 2.29018 10.31 2.08874 10.8577 1.713C11.2636 1.43456 11.6013 1.06998 11.8494 0.647431L17.3484 3.01989L15.9359 6.40658L14.4966 5.78568L13.7986 5.48454V6.24478Z"
        stroke="currentColor"
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
