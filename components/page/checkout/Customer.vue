<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { updateAddress } = addressStore;
const { addresses } = toRefs(addressStore);
const shippingStore = useShippingStore();
const { fetchShipping } = shippingStore;

const addAddress = ref(false);
const addressFormAdd = ref<HTMLElement | null>(null);

const emit = defineEmits(['onAddressCreated']);

const setAddresseDelivery = (address: AddressType) => {
  const newAddress = { ...address };
  newAddress.IsDelivery = true;

  updateAddress(newAddress).then(async (data) => {
    await fetchShipping({
      IdAddress: data?.IdAddress,
      ResponseLevel: 'summary',
    });
  });
};

const openAddAddress = () => {
  addAddress.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
};

const onAddressCreated = (addressId: number) => {
  addAddress.value = false;
  emit('onAddressCreated', addressId);
};
onMounted(() => {
  if (addresses.value.length === 0) {
    addAddress.value = true;
  }
});
</script>

<template>
  <div class="border-b border-gray-bbb">
    <PerfectScrollbar class="max-h-96 mb-5">
      <ListingAccountAddresses
        activeType="Delivery"
        @onAddressSelected="setAddresseDelivery($event)"
      />
    </PerfectScrollbar>
    <div v-if="!addAddress" class="flex justify-end mt-3 mb-3">
      <span class="underline text-xs cursor-pointer" @click="openAddAddress()">
        {{ $t('button.add_new_address') }}
      </span>
    </div>
    <transition name="slide">
      <div
        v-show="addAddress"
        ref="addressFormAdd"
        class="border border-black p-5"
      >
        <FormAddress
          @cancel="addAddress = !addAddress"
          @onAddressCreated="onAddressCreated($event)"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
