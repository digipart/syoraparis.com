<script setup lang="ts">
const checkoutStore = useCheckoutStore();

const { checkoutCustomer, hasSameAddressForShipping } =
  storeToRefs(checkoutStore);
</script>

<template>
  <div>
    <!-- <pre class="text-xxs"> {{ checkoutCustomer }}</pre> -->

    <FormPaymentStripeExpress />
    <CheckoutGuestEmail />
    <CheckoutAddressDelivery class="mt-3" />
    <CheckoutAddressInvoice class="mt-3" />
    <CheckoutCarrierTypes class="mt-5" />
    <CheckoutPayment class="mt-5" />
  </div>
</template>
