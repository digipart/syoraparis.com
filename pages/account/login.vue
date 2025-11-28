<script setup lang="ts">
definePageMeta({
  // middleware: 'auth',
  guestOnly: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.login.title'),
  description: () => t('pages.account.login.description'),
}));
</script>
<template>
  <div class="pageLogin">
    <FormLogin />
  </div>
</template>

<style lang="scss">
$pageLogin: '.pageLogin';

#{$pageLogin} {
  .formLogin {
    height: calc(100dvh - 3.5rem);

    @apply max-w-[768px] mx-auto;
  }
}
</style>
