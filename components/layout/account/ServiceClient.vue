<script setup lang="ts">
const { t } = useI18n();

const tabItems = ref([
  {
    label: t('label.assistance'),
    name: 'account-service',
  },
  {
    label: t('label.my_requests'),
    name: 'account-service-requests',
  },
]);
</script>

<template>
  <LayoutAccount>
    <LayoutAccountChildMenu
      :items="tabItems"
      class="mb-8 md:mb-14 lg:mb-20 mt-10"
    />
    <slot />
  </LayoutAccount>
</template>

<style scoped></style>
