import { defineStore } from 'pinia';
import AddressService from '~/services/AddressService';
import type { AddressType } from '~/types/AddressType';

export const useAddressStore = defineStore('addressStore', {
  state: () => ({
    addresses: [] as AddressType[],
    addressDelivery: null as AddressType | null,
    addressInvoice: null as AddressType | null,
  }),
  actions: {
    clear() {
      this.addresses = [];
      this.addressDelivery = null;
      this.addressInvoice = null;
    },
    async fetchAddresses(): Promise<AddressType[]> {
      const appStore = useAppStore();
      const { languageIsoCode } = toRefs(appStore);

      const addressService = new AddressService();
      const options: {
        LanguageIsoCode: string;
      } = {
        LanguageIsoCode: languageIsoCode.value,
      };

      return addressService
        .fetch(options)
        .then((data) => {
          this.addresses = data;
          this.setAddressDeliveryInvoice();
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    addAddress(address: AddressType) {
      const addressService = new AddressService();

      return addressService
        .add(address)
        .then((data) => {
          this.fetchAddresses();
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    updateAddress(address: AddressType) {
      const addressService = new AddressService();

      return addressService
        .update(address)
        .then((data) => {
          this.fetchAddresses();
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    updateAddressType(options: {
      IdAddress: number;
      IsDelivery: boolean;
      IsInvoice: boolean;
    }) {
      const addressService = new AddressService();

      return addressService
        .updateType(options)
        .then((data) => {
          this.fetchAddresses();
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    setAddressDeliveryInvoice() {
      this.addressDelivery =
        this.addresses.find((address) => address.IsDelivery) || null;
      this.addressInvoice =
        this.addresses.find((address) => address.IsInvoice) || null;
    },
  },
});
