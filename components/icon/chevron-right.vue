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
      viewBox="0 0 5 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.0472488 9.95135C0.110035 10.0162 0.211521 10.0162 0.274307 9.95135L4.95291 5.11727C5.0157 5.0524 5.0157 4.94755 4.95291 4.88269L0.274147 0.0486093C0.242834 0.0162578 0.201726 -4.19478e-07 0.160618 -4.23072e-07C0.11951 -4.26666e-07 0.078402 0.0162578 0.0470895 0.0486093C-0.0156966 0.113477 -0.0156966 0.218328 0.0470895 0.283196L4.61232 4.99998L0.0472489 9.71676C-0.0155372 9.78163 -0.0155373 9.88648 0.0472488 9.95135Z"
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
