<template>
  <div class="cms">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.cms {
  @apply py-16;

  h1 {
    @apply text-2xl font-normal uppercase mb-6 pb-2 border-b border-primary;
  }

  h2 {
    @apply text-xl font-normal mt-8 mb-2 border-primary;
  }

  p {
    @apply text-sm mb-4 text-gray-800;
  }

  a {
    @apply underline;
  }

  ul {
    @apply list-disc ml-6 mb-4;

    li {
      @apply mb-2 text-base text-gray-600;
    }
  }

  strong {
    @apply font-bold text-gray-800;
  }

  @screen mdMax {
    h1 {
      @apply text-xl;
    }

    h2 {
      @apply text-base;
    }

    p,
    li {
      @apply text-xs;
    }
  }
}
</style>
