<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const checkoutStore = useCheckoutStore();

const { checkoutCustomer } = storeToRefs(checkoutStore);

const auth = useAuth();
const { customer } = storeToRefs(auth);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice, addresses } =
  storeToRefs(addressStore);
const state = ref<'form' | 'list' | 'card'>('card');

state.value = addresses.value.length > 0 ? 'card' : 'form';

const selectAddress = (address: AddressType) => {
  console.log('address', address);

  if (!address.IdAddress) return;
  addressStore
    .updateAddressType({
      IdAddress: address.IdAddress,
      IsDelivery: true,
      IsInvoice: addressInvoice.value?.IdAddress === address.IdAddress,
    })
    .then(() => {
      addressStore.fetchAddresses().then(() => {
        state.value = 'card';
      });
    });
};

const setDeliveryAddress = () => {
  if (addressDelivery.value) {
    checkoutCustomer.value.deliveryAddress.firstname =
      addressDelivery.value.Firstname || '';
    checkoutCustomer.value.deliveryAddress.lastname =
      addressDelivery.value.Lastname || '';
    checkoutCustomer.value.deliveryAddress.email = customer.value?.Email || '';
    checkoutCustomer.value.deliveryAddress.address =
      addressDelivery.value.Address1 || '';
    checkoutCustomer.value.deliveryAddress.city =
      addressDelivery.value.City || '';
    checkoutCustomer.value.deliveryAddress.phone =
      addressDelivery.value.MobilePhone || '';
    checkoutCustomer.value.deliveryAddress.postalCode =
      addressDelivery.value.Postcode || '';
    checkoutCustomer.value.deliveryAddress.country =
      addressDelivery.value.Country || '';
    checkoutCustomer.value.deliveryAddress.company =
      addressDelivery.value.Company || '';
    checkoutCustomer.value.deliveryAddress.state =
      addressDelivery.value.StateName || '';
  }
};

watch(addressDelivery, () => {
  if (addressDelivery.value) {
    setDeliveryAddress();
  }
});
onMounted(() => {
  setDeliveryAddress();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="checkout-title">{{ $t('titles.shipping_address') }} :</h2>
      <span
        class="cursor-pointer text-xs hover:underline"
        @click="state = state === 'card' ? 'form' : 'list'"
        v-if="state === 'card'"
      >
        {{ $t('label.address') }} <IconPlus :size="1.3" />
      </span>
    </div>
    <CheckoutAddressCard
      v-if="addressDelivery"
      :address="addressDelivery"
      :can-edit="true"
    />
    <div v-if="state === 'list' || state === 'form'">
      <hr class="my-3" v-if="addresses.length > 0" />
      <CheckoutAddressList
        v-if="state === 'list'"
        :for-delivery="true"
        @onSelect="selectAddress"
      />
      <CheckoutAddressForm
        v-if="state === 'form' && addresses.length > 0"
        @onBack="state = 'card'"
        :title="$t('button.add_new_address')"
        :has-back-button="addresses.length > 0"
      />
      <CheckoutAddressDeliveryFormFast
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
      <span class="text-xs underline cursor-pointer" @click="state = 'list'">{{
        $t('label.my_addresses')
      }}</span>
    </div>
  </div>
</template>

<style></style>
