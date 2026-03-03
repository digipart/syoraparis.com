import PaymentService from '~/services/PaymentService';
import { defineStore } from 'pinia';
import { useFormDeliveryStore } from '../form-stores/formDeliveryStore';
import { useFormInvoiceStore } from '../form-stores/formInvoiceStore';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre, CarrierType } from '~/types/ShippingType';

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
  carrier: CarrierGenre | null;
  relayPoint?: RelayPointType | null;
};

export const useCheckoutStore = defineStore('checkoutStore', () => {
  const checkoutDeliveryOption = ref<'home' | 'relayPoint' | 'store'>('home');
  const hasSameAddressForShipping = ref(false);
  const carrierError = ref<string | null>(null);
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

  const { t } = useI18n();

  const auth = useAuth();
  const { isLoggedIn } = toRefs(auth);
  const { registerGuest } = auth;

  const validateCheckoutBeforePayment = async (): Promise<boolean> => {
    const cartStore = useCartStore();
    const { isDigitalOnly } = toRefs(cartStore);
    const formDeliveryStore = useFormDeliveryStore();
    const formInvoiceStore = useFormInvoiceStore();

    let allValid = true;

    if (!isLoggedIn.value) {
      if (
        !isDigitalOnly.value &&
        checkoutDeliveryOption.value === 'home' &&
        !checkoutCarrier.value.carrier
      ) {
        carrierError.value = t('error.carrier_required');
        allValid = false;
      } else {
        carrierError.value = null;
      }

      let isFormDeliveryCorrect = true;
      if (
        checkoutDeliveryOption.value === 'relayPoint' ||
        checkoutDeliveryOption.value === 'store'
      ) {
        isFormDeliveryCorrect = await formDeliveryStore.v$.email.$validate();
      } else {
        isFormDeliveryCorrect = await formDeliveryStore.v$.$validate();
      }
      if (!isFormDeliveryCorrect) allValid = false;

      let isAddressInvoiceCorrect = true;
      if (!hasSameAddressForShipping.value) {
        isAddressInvoiceCorrect = await formInvoiceStore.v$.$validate();
      }
      if (!isAddressInvoiceCorrect) allValid = false;

      if (!isCheckoutValid.value) {
        allValid = false;
      }
    }

    return allValid;
  };

  watch(
    () => checkoutCustomer.value.deliveryAddress,
    () => {
      hasAddressDelivery.value =
        checkoutCustomer.value.deliveryAddress.postalCode !== '' &&
        checkoutCustomer.value.deliveryAddress.country !== '' &&
        checkoutCustomer.value.deliveryAddress.city !== '' &&
        checkoutCustomer.value.deliveryAddress.address !== '';
    },
    { deep: true }
  );

  const isCheckoutValid = computed(() => {
    const validation = validateCheckout();
    checkoutErrors.value = validation.errors;
    return validation.valid;
  });

  const validateCheckout = () => {
    const cartStore = useCartStore();
    const { isDigitalOnly } = toRefs(cartStore);
    const errors: { field: string; message: string }[] = [];
    const customer = checkoutCustomer.value;
    const carrier = checkoutCarrier.value;

    if (!isDigitalOnly.value && (!carrier || !carrier.carrier)) {
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
        console.log('add', response);

        return response;
      })
      .catch((err) => {
        throw err;
      });
  };

  const fetchPaymentMethods = async (options: any) => {
    const { locale } = useI18n();
    const paymentService = new PaymentService();
    try {
      const data = await paymentService.paymentMethods({
        ...options,
        LanguageIsoCode: locale.value,
      });
      checkoutPaymentMethods.value = data.PaymentMethods || [];
      return data.PaymentMethods;
    } catch (error) {
      console.error('Failed to fetch payment methods', error);
      throw error;
    }
  };

  return {
    checkoutCustomer,
    checkoutCarrier,
    hasAddressDelivery,
    checkoutPaymentMethods,
    isCheckoutValid,
    checkoutErrors,
    checkoutDeliveryOption,
    hasSameAddressForShipping,
    carrierError,
    validateCheckout,
    createClientGuest,
    validateCheckoutBeforePayment,
    fetchPaymentMethods,
  };
});
