<script setup lang="ts">
const cartStore = useCartStore();
const { isDigitalOnly } = toRefs(cartStore);
</script>

<template>
  <div class="space-y-4">
    <CheckoutAddressManager />

    <div v-if="!isDigitalOnly" class="border border-zinc-200 p-4 bg-white">
      <h2 class="font-semibold text-sm uppercase mb-4">
        {{ $t('label.select_delivery_mode') }} :
      </h2>
      <CheckoutDeliveryMethods />
    </div>

    <div class="border border-zinc-200 p-4 bg-white">
      <h2 class="font-semibold text-sm uppercase mb-4">
        {{ $t('tunnel.payment.title') }} :
      </h2>
      <CheckoutPaymentMethods />
    </div>
  </div>
</template>
