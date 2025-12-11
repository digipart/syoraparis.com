import { defineStore } from 'pinia';
import BrandService from '~/services/BrandService';
import type { BrandType } from '~/types/BrandType';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierType } from '~/types/ShippingType';

type CheckoutCustomer = {
  deliveryAddress: {
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    country: string;
  };
  invoiceAddress: {
    firstname: string;
    lastname: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    country: string;
  };
};

type CheckoutCarrier = {
  carrier: CarrierType;
  relayPoint?: RelayPointType;
};

export const useCheckoutStore = defineStore('checkoutStore', () => {
  const checkoutCustomer = ref<CheckoutCustomer>({
    deliveryAddress: {
      email: '',
      firstname: '',
      lastname: '',
      address: '',
      postalCode: '',
      city: '',
      phone: '',
      country: '',
    },
    invoiceAddress: {
      firstname: '',
      lastname: '',
      address: '',
      postalCode: '',
      city: '',
      phone: '',
      country: '',
    },
  });
  const checkoutCarrier = ref<CheckoutCarrier>();
  const checkoutPaymentMethods = ref<PaymentMethodType[]>([]);

  const hasAddressDelivery = ref(false);

  watch(checkoutCustomer.value.deliveryAddress, () => {
    hasAddressDelivery.value =
      checkoutCustomer.value.deliveryAddress.postalCode !== '' &&
      checkoutCustomer.value.deliveryAddress.country !== '' &&
      checkoutCustomer.value.deliveryAddress.city !== '' &&
      checkoutCustomer.value.deliveryAddress.address !== '';
  });

  return {
    checkoutCustomer,
    checkoutCarrier,
    hasAddressDelivery,
    checkoutPaymentMethods,
  };
});
