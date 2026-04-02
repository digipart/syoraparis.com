<script setup lang="ts">
const checkoutStore = useCheckoutStore();

const { checkoutCustomer } = storeToRefs(checkoutStore);

const showPayment = ref(!!checkoutCustomer.value?.deliveryAddress?.postalCode);

watch(
  () => checkoutCustomer.value?.deliveryAddress?.postalCode,
  (postalCode) => {
    if (postalCode) {
      showPayment.value = true;
    }
  }
);
</script>

<template>
  <div>
    <CheckoutGuestEmail />
    <CheckoutAddressDelivery class="mt-3" />
    <CheckoutAddressInvoice class="mt-3" />
    <CheckoutCarrierTypes class="mt-5" />

    <CheckoutPayment class="mt-5" v-if="showPayment" />

    <hr class="my-3" />
  </div>
</template>
