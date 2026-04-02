<script setup lang="ts">
const checkoutStore = useCheckoutStore();

const { checkoutCustomer } = storeToRefs(checkoutStore);
</script>

<template>
  <div>
    <CheckoutAddressDelivery />
    <CheckoutAddressInvoice class="mt-3" />
    <CheckoutCarrierTypes class="mt-5" />

    <CheckoutPayment
      class="mt-5"
      v-if="checkoutCustomer?.deliveryAddress?.postalCode"
    />
  </div>
</template>
