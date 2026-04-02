<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { addresses, addressDelivery } = toRefs(addressStore);

const emit = defineEmits(['onSelect', 'onAdd']);
const { forDelivery, forInvoice } = defineProps({
  forDelivery: {
    type: Boolean,
    default: false,
  },
  forInvoice: {
    type: Boolean,
    default: false,
  },
});

const filteredAddresses = computed(() => {
  if (forDelivery) {
    return addresses.value.filter(
      (address: AddressType) =>
        address.IdAddress !== addressDelivery.value?.IdAddress
    );
  }
  return addresses.value;
});
</script>

<template>
  <div>
    <div class="flex flex-col gap-y-2">
      <div v-for="address in filteredAddresses" :key="address.IdAddress">
        <CheckoutAddressCard
          :address="address"
          :can-select="true"
          @onSelect="emit('onSelect', address)"
        />
      </div>
    </div>
  </div>
</template>
