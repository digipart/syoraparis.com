<template>
  <div class="mb-20">
    <LayoutContainer class="pt-10 pb-10">
      <BaseHeadLine
        class="text-center font-normal mb-10 uppercase"
        tag="h1"
        size="_2xl"
      >
        {{ t('titles.faq') }}
      </BaseHeadLine>

      <CmsFaqListing />
    </LayoutContainer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.faq.title'),
  description: () => t('pages.faq.description'),
}));
</script>

<style scoped lang="scss">
.qtsFqt {
  @apply border border-black px-5;
  li {
    @apply border-b border-black py-3 text-sm;
    &:last-child {
      @apply border-b-0;
    }
  }
}
</style>
