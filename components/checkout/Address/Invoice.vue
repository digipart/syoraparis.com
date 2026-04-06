<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const checkoutStore = useCheckoutStore();

const { checkoutCustomer, hasSameAddressForShipping } =
  storeToRefs(checkoutStore);

const auth = useAuth();
const { customer } = storeToRefs(auth);

const { addressDelivery, addressInvoice, addresses } =
  storeToRefs(addressStore);
const state = ref<'form' | 'list' | 'card'>('card');

hasSameAddressForShipping.value =
  addressDelivery.value?.IdAddress !== addressInvoice.value?.IdAddress;

state.value = addresses.value.length > 0 ? 'card' : 'form';

const selectAddress = (address: AddressType) => {
  if (!address.IdAddress) return;
  addressStore
    .updateAddressType({
      IdAddress: address.IdAddress,
      IsDelivery: addressDelivery.value?.IdAddress === address.IdAddress,
      IsInvoice: true,
    })
    .then(() => {
      addressStore.fetchAddresses().then(() => {
        state.value = 'card';
      });
    });
};

const toggleSameAsDelivery = () => {
  if (hasSameAddressForShipping.value && addressDelivery.value?.IdAddress) {
    addressStore
      .updateAddressType({
        IdAddress: addressDelivery.value?.IdAddress || 0,
        IsDelivery: true,
        IsInvoice: true,
      })
      .then(() => {
        state.value = 'card';
      });
  }
};

const setDeliveryAddress = () => {
  if (addressInvoice.value) {
    checkoutCustomer.value.invoiceAddress.firstname =
      addressInvoice.value.Firstname || '';
    checkoutCustomer.value.invoiceAddress.lastname =
      addressInvoice.value.Lastname || '';
    checkoutCustomer.value.invoiceAddress.address =
      addressInvoice.value.Address1 || '';
    checkoutCustomer.value.invoiceAddress.city =
      addressInvoice.value.City || '';
    checkoutCustomer.value.invoiceAddress.phone =
      addressInvoice.value.MobilePhone || '';
    checkoutCustomer.value.invoiceAddress.postalCode =
      addressInvoice.value.Postcode || '';
    checkoutCustomer.value.invoiceAddress.country =
      addressInvoice.value.Country || '';
    checkoutCustomer.value.invoiceAddress.company =
      addressInvoice.value.Company || '';
    checkoutCustomer.value.invoiceAddress.state =
      addressInvoice.value.StateName || '';
  }
};

watch(addressInvoice, () => {
  if (addressInvoice.value) {
    setDeliveryAddress();
  }
});
onMounted(() => {
  setDeliveryAddress();
});
</script>

<template>
  <div class="bg-white p-3 pb-1">
    <div>
      <InputCheckBox
        id="same-as-delivery"
        v-model="hasSameAddressForShipping"
        class="mb-2"
        @change="toggleSameAsDelivery"
      >
        <span class="text-xs font-normal">
          {{ $t('label.same_as_delivery_address') }}
        </span>
      </InputCheckBox>
    </div>
    <div v-if="hasSameAddressForShipping" class="mb-2">
      <div class="flex justify-between items-center">
        <h2 class="checkout-title">{{ $t('titles.invoice_address') }} :</h2>
      </div>
      <CheckoutAddressCard
        v-if="addressInvoice"
        :address="addressInvoice"
        :can-edit="true"
      />
      <div v-if="state === 'list' || state === 'form'">
        <hr class="my-3" v-if="addresses.length > 0" />
        <CheckoutAddressList
          v-if="state === 'list'"
          :for-invoice="true"
          @onSelect="selectAddress"
        />
        <CheckoutAddressForm
          v-if="state === 'form' && addresses.length > 0"
          @onBack="state = 'card'"
          :title="$t('button.add_new_address')"
          :has-back-button="addresses.length > 0"
          :isDelivery="false"
        />
        <CheckoutAddressInvoiceFormFast
          v-if="state === 'form' && addresses.length === 0"
          @onBack="state = 'card'"
          :title="$t('button.add_new_address')"
          :has-back-button="addresses.length > 0"
        />
      </div>
      <div
        v-if="state === 'card' && addresses.length > 1"
        class="mt-1 flex justify-end"
      >
        <span
          class="text-xs underline cursor-pointer"
          @click="state = 'list'"
          >{{ $t('label.my_addresses') }}</span
        >
      </div>
    </div>
  </div>
</template>

<style></style>
