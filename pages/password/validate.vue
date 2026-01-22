<script setup lang="ts">
definePageMeta({
  guestOnly: true,
});
const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.password_validate.title'),
  description: () => t('pages.account.password_validate.description'),
}));
const route = useRoute();
const email = (route.query.email as string) || '';
</script>

<template>
  <div class="pagePasswordForgetValidate">
    <div class="pagePasswordForgetValidate-wrapper">
      <div class="pagePasswordForgetValidate-box">
        <BaseHeadLine
          name="h1"
          size="sm"
          class="text-center uppercase font-normal mb-8"
        >
          {{ $t('titles.formForgetPassword_title') }}
        </BaseHeadLine>

        <div
          class="text"
          v-html="
            $t('html.passwordForgetText', { email: email })
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$pagePasswordForgetValidate: '.pagePasswordForgetValidate';

#{$pagePasswordForgetValidate} {
  &-wrapper {
    height: calc(100dvh - 3.5rem);

    @apply max-w-[768px] mx-auto flex items-center pb-[54px] relative;
  }

  &-box {
    @apply flex  w-full flex-col m-auto;

    @screen md {
      @apply border border-black py-10 px-5;
    }

    .text {
      @apply text-sm;

      ul {
        @apply list-disc pl-5 mt-3;
      }
    }
  }
}
</style>
