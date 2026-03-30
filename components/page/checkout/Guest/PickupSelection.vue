<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const { checkoutDeliveryOption } = toRefs(checkoutStore);
</script>

<template>
  <div class="guest-pickup-selection mb-6">
    <BaseHeadLine size="md" class="uppercase font-medium mb-4">
      {{
        checkoutDeliveryOption === 'relayPoint'
          ? $t('tunnel.delivery.relayPoint')
          : $t('tunnel.delivery.store')
      }}
      :
    </BaseHeadLine>

    <FormShipping
      :displayOptions="
        checkoutDeliveryOption === 'relayPoint' ? 'RelayPoint' : 'Store'
      "
    />
  </div>
</template>

<style scoped lang="scss">
.guest-pickup-selection {
  @apply bg-white p-6 rounded-sm border border-zinc-100;
}
</style>
