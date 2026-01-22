<script setup lang="ts">
definePageMeta({
  guestOnly: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.password_new.title'),
  description: () => t('pages.account.password_new.description'),
}));

</script>
<template>
  <div class="pagePasswordForget">
    <FormForgetPasswordNew />
  </div>
</template>

<style lang="scss">
$pagePasswordForget: '.pagePasswordForget';

#{$pagePasswordForget} {
  .formForgetPassword {
    height: calc(100dvh - 3.5rem);

    @apply max-w-[768px] mx-auto;
  }
}
</style>
