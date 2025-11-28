<template>
  <div class="error-page">
    <HeadLine size="_2xl" class="title uppercase">{{
      $t('errorPage.title')
    }}</HeadLine>
    <p class="description">{{ $t('errorPage.description') }}</p>
    <NuxtLink :to="localePath({ name: 'index' })">
      <BaseButton type="primary" :title="$t('errorPage.goBackHome')">{{
        $t('errorPage.goBackHome')
      }}</BaseButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.not_found.title'),
  description: () => t('pages.not_found.description'),
}));
</script>

<style scoped>
.error-page {
  @apply flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800;
}

.title {
  @apply text-4xl font-bold mb-4 text-primary;
}

.description {
  @apply text-lg text-gray-600 mb-6;
}
</style>
