<template>
  <div class="mb-20">
    <LayoutContainer>
      <div class="pt-10 pb-10 max-w-3xl mx-auto">
        <BaseHeadLine class="font-normal mb-10" size="_2xl">
          {{ $t('titles.contact_us') }}
        </BaseHeadLine>
      </div>
      <div class="max-w-screen-md mx-auto">
        <FormContactUs />
      </div>
    </LayoutContainer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.contactus.title'),
  description: () => t('pages.contactus.description'),
}));
</script>

<style scoped></style>
