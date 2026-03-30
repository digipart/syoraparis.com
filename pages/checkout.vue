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
  if (val) {
    await fetchAddresses();
    await cartStore.fetchCart();
  }
});
</script>

<template>
  <div class="grid grid-cols-11 items-start">
    <!-- ══ LEFT COLUMN ══ -->
    <div class="col-span-12 lg:col-span-6 checkout-left">
      <div class="box">
        <CheckoutCustomer v-if="isLoggedIn && !isGuest" />
        <CheckoutGuest v-else />
      </div>
    </div>

    <!-- ══ RIGHT COLUMN: ORDER SUMMARY ══ -->
    <div class="col-span-12 lg:col-span-5 checkout-right">
      <div class="box">
        <CheckoutRightSummary />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
