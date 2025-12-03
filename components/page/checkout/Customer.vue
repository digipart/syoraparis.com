<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { addressDelivery, addresses } = toRefs(addressStore);
const { fetchAddresses, updateAddress } = addressStore;

const shippingStore = useShippingStore();
const { fetchShipping } = shippingStore;

const showForm = ref(false);
const addressFormAdd = ref<HTMLElement | null>(null);

const listAddressVisible = ref(false);

const emit = defineEmits(['onAddressCreated']);
const { t } = useI18n();

const addressesUpdated = async (addressId?: number) => {
  if (!addressId && addressDelivery.value) {
    addressId = addressDelivery.value.IdAddress;
  }
  await fetchShipping({
    IdAddress: addressId,
    ResponseLevel: 'summary',
  });
};

const setAddresseDelivery = (address: AddressType) => {
  const newAddress = { ...address };
  newAddress.IsDelivery = true;
  listAddressVisible.value = false;

  updateAddress(newAddress).then(async (data) => {
    await fetchShipping({
      IdAddress: data?.IdAddress,
      ResponseLevel: 'summary',
    });
  });
};

const displayForm = () => {
  showForm.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
};

const onAddressCreated = (addressId: number) => {
  showForm.value = false;
  emit('onAddressCreated', addressId);
};
onMounted(() => {
  if (addresses.value.length === 0) {
    showForm.value = true;
  }
});
</script>

<template>
  <div>
    <transition name="slide">
      <div v-show="!showForm && !listAddressVisible">
        <div>
          <!-- Delivery address selected -->
          <div
            v-if="addressDelivery"
            class="border border-black px-5 py-3 mt-3"
          >
            <PageCheckoutDeliveryAddressShippingSelected
              hideShipping
              @onAddressSubmited="addressesUpdated()"
            />
          </div>
          <span
            class="underline text-xs cursor-pointer"
            @click="listAddressVisible = !listAddressVisible"
            v-if="addresses.length > 0"
          >
            {{ t('button.select_another_address') }}
          </span>
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div v-if="!showForm && listAddressVisible">
        <div class="flex justify-end mt-3 mb-3">
          <span class="underline text-xs cursor-pointer" @click="displayForm()">
            {{ $t('button.add_new_address') }}
          </span>
        </div>
        <PerfectScrollbar class="max-h-96 mb-5">
          <ListingAccountAddresses
            activeType="Delivery"
            @onAddressSelected="setAddresseDelivery($event)"
          />
        </PerfectScrollbar>
      </div>
    </transition>

    <transition name="slide">
      <div
        v-show="showForm"
        ref="addressFormAdd"
        class="border border-black p-5"
      >
        <FormAddress
          @cancel="showForm = !showForm"
          @onAddressCreated="onAddressCreated($event)"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
