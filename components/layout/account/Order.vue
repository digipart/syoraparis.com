<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();

const tabItems = ref([
  {
    label: t('label.my_orders_list'),
    name: 'account-orders',
  },
  {
    label: t('label.my_returns'),
    name: 'account-returns',
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
