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
const { cart, cartId } = toRefs(useCartStore());
const auth = useAuth();
const { refresh: refreshAuth, logout } = auth;
const { isGuest } = toRefs(auth);

import { trackPurchase } from '~/utils/gtm';

try {
  cartId.value = Number(route.query.orderid || 0);
  await fetchCart();
  console.log('cart.value 1 ', cart.value);
} catch (error) {
  console.error('Failed to fetch cart:', error);
}
if (route.params.state === 'accepted' || route.params.state === 'paid') {
  if (cart.value && cart.value.Products && cart.value.Products.length > 0) {
    if (process.client) {
      const storageKey = `purchase_event_sent_${cart.value.IdCart}`;
      if (!localStorage.getItem(storageKey)) {
        trackPurchase(cart.value);
        localStorage.setItem(storageKey, 'true');
      }
    }
  }
}
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
