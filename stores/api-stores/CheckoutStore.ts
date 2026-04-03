import PaymentService from '~/services/PaymentService';
import { defineStore } from 'pinia';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre } from '~/types/ShippingType';

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
    company?: string;
    state?: string;
  };
  invoiceAddress: {
    firstname: string;
    lastname: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    country: string;
    company?: string;
    state?: string;
  };
};

type CheckoutCarrier = {
  carrier: CarrierGenre | null;
  relayPoint?: RelayPointType | null;
};

export const useCheckoutStore = defineStore('checkoutStore', () => {
  const checkoutDeliveryOption = ref<'home' | 'relayPoint' | 'store'>('home');
  const { locale } = useI18n();
  const refreshPaymentMethodsTrigger = ref(0);
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
      company: '',
      state: '',
    },
    invoiceAddress: {
      firstname: '',
      lastname: '',
      address: '',
      postalCode: '',
      city: '',
      phone: '',
      country: '',
      company: '',
      state: '',
    },
  });
  const checkoutCarrier = ref<CheckoutCarrier>({
    carrier: null,
    relayPoint: null,
  });
  const checkoutPaymentMethods = ref<PaymentMethodType[]>([]);
  const checkoutErrors = ref<{ field: string; message: string }[]>([]);
  const hasAddressDelivery = ref(false);
  const paymentRefreshTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const { t } = useI18n();

  const auth = useAuth();
  const { isLoggedIn } = toRefs(auth);
  const { registerGuest } = auth;

  // Centralized watcher for all state that should trigger a payment methods refresh

  const isCheckoutValid = computed(() => {
    const validation = validateCheckout();
    checkoutErrors.value = validation.errors;
    return validation.valid;
  });

  const validateCheckout = () => {
    const cartStore = useCartStore();
    const { isDigitalOnly, cart } = toRefs(cartStore);
    const errors: { field: string; message: string }[] = [];
    const customer = checkoutCustomer.value;
    const carrier = checkoutCarrier.value;

    const getRequiredFieldMessage = (field: string) => {
      switch (field) {
        case 'email':
          return t('error.email_required');
        case 'firstname':
          return t('error.firstname_required');
        case 'lastname':
          return t('error.field_required');
        case 'address':
          return t('error.address_required');
        case 'postalCode':
          return t('error.postcode_required');
        case 'city':
          return t('error.city_required');
        case 'country':
          return t('error.country_required');
        case 'phone':
          return t('error.phone_required');
        default:
          return t('error.field_required');
      }
    };

    const hasSelectedCarrier =
      !!carrier?.carrier?.IdCarrier ||
      !!cart.value?.Shipping?.Carrier?.IdCarrier;

    if (!isDigitalOnly.value && !hasSelectedCarrier) {
      console.log('carrier error', hasSelectedCarrier, isDigitalOnly.value);
      errors.push({ field: 'carrier', message: t('error.carrier_required') });
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
          message: getRequiredFieldMessage(field),
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

    // Only validate invoice address if user selected different invoice address
    if (!hasSameAddressForShipping.value) {
      for (const field of requiredInvoiceFields) {
        if (!customer.invoiceAddress[field]) {
          errors.push({
            field: `invoiceAddress.${field}`,
            message: getRequiredFieldMessage(field),
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  };

  const createClientGuest = () => {
    return registerGuest({
      Lastname: checkoutCustomer.value.deliveryAddress.lastname,
      Firstname: checkoutCustomer.value.deliveryAddress.firstname,
      Email: checkoutCustomer.value.deliveryAddress.email,
      Address1: checkoutCustomer.value.deliveryAddress.address,
      Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
      City: checkoutCustomer.value.deliveryAddress.city,
      MobilePhone: checkoutCustomer.value.deliveryAddress.phone,
      Company: checkoutCustomer.value.deliveryAddress.company,
      StateName: checkoutCustomer.value.deliveryAddress.state,
    })
      .then((response) => {
        console.log('add', response);

        return response;
      })
      .catch((err) => {
        throw err;
      });
  };

  const fetchPaymentMethods = async (
    options: {
      LanguageIsoCode?: string;
      CurrencyIsoCode?: string;
      Postcode?: string;
      City?: string;
      Address1?: string;
      Country?: string;
      IP?: string;
    } = {}
  ) => {
    // Guard: don't call the API without essential address params
    if (
      !options.Postcode &&
      !options.Address1 &&
      !options.Country &&
      !options.IP
    ) {
      return {};
    }
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

  const validateCheckoutBeforePayment = async (): Promise<boolean> => {
    const cartStore = useCartStore();
    const { isDigitalOnly } = toRefs(cartStore);

    const checkoutValidation = validateCheckout();
    checkoutErrors.value = checkoutValidation.errors;

    if (!isDigitalOnly.value && !checkoutCarrier.value?.carrier?.IdCarrier) {
      carrierError.value = t('error.carrier_required');
    } else {
      carrierError.value = null;
    }

    return checkoutValidation.valid;
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
    refreshPaymentMethodsTrigger,
  };
});
