<script setup lang="ts">
definePageMeta({
  
  requireAuth: true,
});

const appStore = useAppStore();
const { setLoadingPage } = appStore;
setLoadingPage(true);
const orderStore = useOrderStore();
const { order } = toRefs(orderStore);
const { fetchOrderById } = orderStore;
const route = useRoute();

const { t } = useI18n();

try {
  if (route.params.idOrder) {
    await fetchOrderById(route.params.idOrder as string);
    useHead(() => ({
      title: () => t('pages.account.my_order.title', { idOrder: route.params.idOrder }),
      description: () => t('pages.account.my_order.description'),
    }));
  }
} catch (error) {}
setLoadingPage(false);
</script>

<template>
  <LayoutAccountOrder>
    <CardOrder v-if="order" :order="order" details />
  </LayoutAccountOrder>
</template>

<style scoped></style>
