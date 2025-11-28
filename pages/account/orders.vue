<script setup lang="ts">
definePageMeta({
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.my_orders.title'),
  description: () => t('pages.account.my_orders.description'),
}));

const appStore = useAppStore();
const { setLoadingPage } = appStore;
setLoadingPage(true);
const loading = ref(false);

const ordersStore = useOrderStore();
const { fetchOrderes } = ordersStore;
const { ordersList } = toRefs(ordersStore);

const localePath = useLocalePath();

const orders = computed(() => {
  return ordersList.value.Orders;
});

onMounted(() => {
  fetchOrderes().finally(() => {
    loading.value = true;
    setLoadingPage(false);
  });
});
</script>

<template>
  <LayoutAccountOrder>
    <template v-if="loading && !orders?.length">
      <div class="max-w-screen-md">
        <BaseAlert :closeButton="false">
          {{ $t('messages.no_orders_yet') }}
          <NuxtLink class="underline" :to="localePath({ name: 'index' })">
            {{ $t('label.continue_shopping') }}
          </NuxtLink>
        </BaseAlert>
      </div>
    </template>
    <div
      v-if="loading && orders?.length"
      class="flex flex-col gap-8 md:gap-12 lg:gap-16"
    >
      <CardOrder v-for="order in orders" :key="order.IdOrder" :order="order" />
    </div>
  </LayoutAccountOrder>
</template>

<style scoped></style>
