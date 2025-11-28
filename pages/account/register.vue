<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  guestOnly: true,
  keepalive: false
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.register.title'),
  description: () => t('pages.account.register.description'),
}));
</script>
<template>
  <div class="pageLogin">
    <FormRegister />
  </div>
</template>

<style lang="scss">
$pageLogin: '.pageLogin';

#{$pageLogin} {
  .formRegister {
    height: calc(100dvh - 3.5rem);

    @apply max-w-[768px] mx-auto;
  }
}
</style>
