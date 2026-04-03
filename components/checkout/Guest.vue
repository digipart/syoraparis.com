<script setup lang="ts">
const checkoutStore = useCheckoutStore();

const { checkoutCustomer } = storeToRefs(checkoutStore);
</script>

<template>
  <div>
    <CheckoutGuestEmail />
    <CheckoutAddressDelivery class="mt-3" />
    <CheckoutAddressInvoice class="mt-3" />
    <CheckoutCarrierTypes class="mt-5" />
    <CheckoutPayment class="mt-5" />
  </div>
</template>
