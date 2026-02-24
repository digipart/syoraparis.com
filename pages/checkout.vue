<script setup lang="ts">
import { trackBeginCheckout } from '~/utils/gtm';
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
const { totalProductQuantity, loaded, cart } = toRefs(cartStore);

const step = ref(1);
const loading = ref(true);

const route = useRoute();
const router = useRouter();
const localepath = useLocalePath();
if (cart.value.Total?.Product?.Quantity === 0) {
  router.replace(localepath('/'));
}

const addressStore = useAddressStore();
const { fetchAddresses } = addressStore;

if (route.query.step) {
  step.value = Number(route.query.step);
}
if (isLoggedIn.value) {
  await fetchAddresses();
}

onMounted(async () => {
  loading.value = false;

  // Trigger begin checkout event
  if (cart.value && cart.value.Products && cart.value.Products.length > 0) {
    trackBeginCheckout(cart.value);
  }
});

watch(isLoggedIn, async (val) => {
  console.log('isLoggedIn', val);
  if (val) {
    await fetchAddresses();
    await cartStore.fetchCart();
  }
});
</script>

<template>
  <div v-if="loaded">
    <LayoutContinueShopping v-if="!totalProductQuantity" />
    <template v-else>
      <PageTunnel v-if="isLoggedIn && !isGuest" />
      <PageTunnelGuest v-if="!isLoggedIn || isGuest" />
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
