import { defineStore } from 'pinia';
import type { AddressType } from '~/types/AddressType';

export const useOneCheckoutStore = defineStore('oneCheckoutStore', () => {
  const selectedAddressId = ref<number | null>(null);
  const isAddressFormOpen = ref(false);
  const isAddressListOpen = ref(false);

  const initializeAddressState = (
    addresses: AddressType[],
    defaultAddressId?: number | null
  ) => {
    if (!addresses.length) {
      selectedAddressId.value = null;
      isAddressFormOpen.value = true;
      isAddressListOpen.value = false;
      return;
    }

    isAddressFormOpen.value = false;

    if (
      selectedAddressId.value &&
      addresses.some((address) => address.IdAddress === selectedAddressId.value)
    ) {
      return;
    }

    const firstAddressId = addresses[0]?.IdAddress ?? null;
    selectedAddressId.value = defaultAddressId || firstAddressId;
  };

  const selectAddress = (addressId: number | null) => {
    selectedAddressId.value = addressId;
    isAddressListOpen.value = false;
  };

  const openAddressForm = () => {
    isAddressFormOpen.value = true;
    isAddressListOpen.value = false;
  };

  const closeAddressForm = () => {
    isAddressFormOpen.value = false;
  };

  const toggleAddressList = () => {
    isAddressListOpen.value = !isAddressListOpen.value;
  };

  return {
    selectedAddressId,
    isAddressFormOpen,
    isAddressListOpen,
    initializeAddressState,
    selectAddress,
    openAddressForm,
    closeAddressForm,
    toggleAddressList,
  };
});
