<script setup lang="ts">
definePageMeta({
  layout: 'checkout',
  keepalive: false,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.checkout.title'),
  description: () => t('pages.checkout.description'),
}));

const auth = useAuth();
const { isLoggedIn, isGuest } = toRefs(auth);

const cartStore = useCartStore();
const { totalProductQuantity, loaded } = toRefs(cartStore);

const addressStore = useAddressStore();
const { fetchAddresses } = addressStore;

const step = ref(1);
const loading = ref(true);

const route = useRoute();
if (route.query.step) {
  step.value = Number(route.query.step);
}
if (isLoggedIn.value) {
  await fetchAddresses();
}

onMounted(async () => {
  loading.value = false;
});
</script>

<template>
  <div v-if="loaded">
    <LayoutContinueShopping v-if="!totalProductQuantity" class="mt-16" />
    <template v-else>
      <PageTunnel v-if="isLoggedIn && !isGuest" />
      <PageTunnelGuest v-if="!isLoggedIn || isGuest" />
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
