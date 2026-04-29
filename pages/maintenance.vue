<script setup lang="ts">
const { t } = useI18n();
const config = useRuntimeConfig();

definePageMeta({
  layout: false,
});

useHead({
  title: t('pages.maintenance.title'),
});

const backgroundStyle = computed(() => {
  const bgImage = config.public.maintenanceBg;
  return bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};
});
</script>

<template>
  <div
    class="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-gray-900 text-white z-[9999]"
    :style="backgroundStyle"
  >
    <!-- Overlay for better text readability -->
    <div class="absolute inset-0 bg-black/60 z-0"></div>

    <div class="relative z-10 max-w-md px-6 text-center">
      <!-- Logo or Brand Name -->
      <div class="mb-8 font-serif text-2xl tracking-widest uppercase">
        Syoraparis
      </div>

      <h1 class="text-4xl font-bold mb-6 tracking-tight">
        {{ t('pages.maintenance.title') }}
      </h1>

      <p class="text-lg text-gray-300 mb-10 leading-relaxed">
        {{ t('pages.maintenance.message') }}
      </p>

      <!-- Animated Icon -->
      <div class="flex justify-center mb-6">
        <div class="relative w-16 h-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-white animate-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              stroke-color="#ffffff"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>

      <div class="mt-12 text-sm text-white/80">
        &copy; {{ new Date().getFullYear() }} Syoraparis
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
