<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  ignoreAuth: true,
  keepalive: false,
});
const route = useRoute();
const loading = ref(true);

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.order_comfirmation.title'),
  description: () => t('pages.order_comfirmation.description'),
}));

const { fetchCart, clear: clearCart, newIdCart } = useCartStore();
const auth = useAuth();
const { refresh: refreshAuth, logout } = auth;
const { isGuest } = toRefs(auth);

await clearCart();

try {
  if (route.query.init) {
    await newIdCart();
    await refreshAuth();
    await fetchCart();
  }
} catch (error) {
  console.error('Failed to create new cart:', error);
}

loading.value = false;
if (isGuest.value === true) {
  logout();
}
</script>

<template>
  <LayoutContainer>
    <div v-if="loading" class="mt-40">
      <BaseLoading class="py-10" />
      <!-- <div class="text-center">Validation in progress, please wait...</div> -->
    </div>
    <LayoutConfirmedView :loading="loading" />
    <!-- <div>Order confirmed : {{ route.params.state }}</div> -->
  </LayoutContainer>
</template>

<style scoped></style>
