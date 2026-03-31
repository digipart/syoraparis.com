<script setup lang="ts">
const cartStore = useCartStore();
const { isDigitalOnly } = toRefs(cartStore);
</script>

<template>
  <div class="space-y-6 pb-4">
    <CheckoutAddressManager />

    <div v-if="!isDigitalOnly" class="space-y-3">
      <h2 class="font-bold text-lg lowercase first-letter:uppercase">
        {{ $t('label.select_delivery_mode') }} :
      </h2>
      <CheckoutDeliveryMethods />
    </div>

    <div class="space-y-3">
      <h2 class="font-bold text-base lowercase first-letter:uppercase">
        {{ $t('tunnel.payment.title') }} :
      </h2>
      <CheckoutPaymentMethods />
    </div>
  </div>
</template>
