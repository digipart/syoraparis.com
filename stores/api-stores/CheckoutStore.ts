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
  carrier: CarrierType | null;
  relayPoint?: RelayPointType | null;
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
  const checkoutCarrier = ref<CheckoutCarrier>({
    carrier: null,
    relayPoint: null,
  });
  const checkoutPaymentMethods = ref<PaymentMethodType[]>([]);
  const checkoutErrors = ref<{ field: string; message: string }[]>([]);
  const hasAddressDelivery = ref(false);

  const auth = useAuth();
  const { registerGuest } = auth;

  watch(checkoutCustomer.value.deliveryAddress, () => {
    hasAddressDelivery.value =
      checkoutCustomer.value.deliveryAddress.postalCode !== '' &&
      checkoutCustomer.value.deliveryAddress.country !== '' &&
      checkoutCustomer.value.deliveryAddress.city !== '' &&
      checkoutCustomer.value.deliveryAddress.address !== '';
  });

  const isCheckoutValid = computed(() => {
    const validation = validateCheckout();
    checkoutErrors.value = validation.errors;
    return validation.valid;
  });

  const validateCheckout = () => {
    const errors: { field: string; message: string }[] = [];
    const customer = checkoutCustomer.value;
    const carrier = checkoutCarrier.value;

    if (!carrier || !carrier.carrier) {
      errors.push({ field: 'carrier', message: 'Carrier is not selected' });
    }

    const requiredDeliveryFields: (keyof typeof customer.deliveryAddress)[] = [
      'email',
      'postalCode',
      'city',
      'country',
    ];

    for (const field of requiredDeliveryFields) {
      if (!customer.deliveryAddress[field]) {
        errors.push({
          field: `deliveryAddress.${field}`,
          message: `Delivery ${field} is required`,
        });
      }
    }

    const requiredInvoiceFields: (keyof typeof customer.invoiceAddress)[] = [
      'firstname',
      'lastname',
      'postalCode',
      'city',
      'phone',
      'country',
    ];

    // Only validate invoice address if it's different from delivery
    if (
      JSON.stringify(customer.deliveryAddress) !==
      JSON.stringify(customer.invoiceAddress)
    ) {
      for (const field of requiredInvoiceFields) {
        if (!customer.invoiceAddress[field]) {
          errors.push({
            field: `invoiceAddress.${field}`,
            message: `Invoice ${field} is required`,
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  };

  const createClientGuest = () => {
    return registerGuest({
      Lastname: checkoutCustomer.value.deliveryAddress.lastname,
      Firstname: checkoutCustomer.value.deliveryAddress.lastname,
      Email: checkoutCustomer.value.deliveryAddress.lastname,
      Address1: checkoutCustomer.value.deliveryAddress.lastname,
      Postcode: checkoutCustomer.value.deliveryAddress.lastname,
      City: checkoutCustomer.value.deliveryAddress.lastname,
      MobilePhone: checkoutCustomer.value.deliveryAddress.lastname,
    })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    checkoutCustomer,
    checkoutCarrier,
    hasAddressDelivery,
    checkoutPaymentMethods,
    isCheckoutValid,
    checkoutErrors,
    validateCheckout,
    createClientGuest,
  };
});
