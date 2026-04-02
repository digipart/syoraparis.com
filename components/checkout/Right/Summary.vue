<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const { checkoutCustomer, refreshPaymentMethodsTrigger } =
  toRefs(checkoutStore);
const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const refreshPaymentMethods = async () => {
  refreshPaymentMethodsTrigger.value++;
};

watch(
  () =>
    JSON.stringify({
      promoCodes: cart.value?.Discounts?.PromoCodes,
      toPay: cart.value?.Total?.ToPay?.TaxIncl,
    }),
  () => {
    refreshPaymentMethods();
  }
);
</script>

<template>
  <div class="guest-sidebar">
    <ListingCartItems :editable="false" :mini="true" checkout />
    <PageCheckoutMyRewards
      class="mt-6"
      @on-code-promo-applied="refreshPaymentMethods"
    />
    <div class="mt-6">
      <FormCodePromo @on-code-promo-applied="refreshPaymentMethods" />
    </div>
    <hr class="my-6 border-zinc-100" />
    <PageTunnelOrderSummary />

    <PageTunnelFooter class="lg:hidden mt-8" />
  </div>
</template>

<style scoped lang="scss">
.guest-sidebar {
  @apply lg:sticky lg:top-8;
}
</style>
