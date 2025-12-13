<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice, addresses } = toRefs(addressStore);
const { fetchAddresses, updateAddress } = addressStore;

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutCarrier } = toRefs(checkoutStore);

const shippingStore = useShippingStore();

const showForm = ref(false);
const addressFormAdd = ref<HTMLElement | null>(null);

const auth = useAuth();
const { customer } = toRefs(auth);

const listAddressVisible = ref(false);

const emit = defineEmits(['onAddressCreated']);
const { t } = useI18n();

const addressesUpdated = async (addressId?: number) => {
  if (!addressId && addressDelivery.value) {
    addressId = addressDelivery.value.IdAddress;
  }
};

const setAddresseDelivery = (address: AddressType) => {
  const newAddress = { ...address };
  newAddress.IsDelivery = true;
  listAddressVisible.value = false;

  updateAddress(newAddress).then(async (data) => {
    
  });
};

const displayForm = () => {
  showForm.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
};

const onAddressCreated = async (addressId: number) => {
  showForm.value = false;

  emit('onAddressCreated', addressId);
};

watch(addressDelivery, () => {
  setCheckoutCustomer();
});

const setCheckoutCustomer = () => {
  checkoutCustomer.value.deliveryAddress.firstname =
    addressDelivery.value?.Firstname || '';
  checkoutCustomer.value.deliveryAddress.lastname =
    addressDelivery.value?.Lastname || '';
  checkoutCustomer.value.deliveryAddress.email = customer.value?.Email || '';
  checkoutCustomer.value.deliveryAddress.address =
    addressDelivery.value?.Address1 || '';
  checkoutCustomer.value.deliveryAddress.city =
    addressDelivery.value?.City || '';
  checkoutCustomer.value.deliveryAddress.phone =
    addressDelivery.value?.Phone || '';
  checkoutCustomer.value.deliveryAddress.postalCode =
    addressDelivery.value?.Postcode || '';
  checkoutCustomer.value.deliveryAddress.country =
    addressDelivery.value?.CountryIsoCode || '';
};

onMounted(() => {
  setTimeout(() => {
    if (addresses.value.length === 0) {
      showForm.value = true;
    }
  }, 100);
  setCheckoutCustomer();
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
            class="border border-black px-5 py-3 mt-3 bg-white"
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
      <div v-show="showForm" ref="addressFormAdd">
        <FormAddress
          @cancel="showForm = !showForm"
          @onAddressCreated="onAddressCreated($event)"
          inputBorder
        />
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
