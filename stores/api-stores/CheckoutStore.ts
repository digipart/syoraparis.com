import PaymentService from '~/services/PaymentService';
import { defineStore } from 'pinia';
import { useFormDeliveryStore } from '../form-stores/formDeliveryStore';
import { useFormInvoiceStore } from '../form-stores/formInvoiceStore';
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

  const cartStore = useCartStore();
  const { cart, carrier: cartCarrier, isDigitalOnly } = toRefs(cartStore);

  const { t } = useI18n();

  const auth = useAuth();
  const { isLoggedIn } = toRefs(auth);
  const { registerGuest } = auth;

  const buildPaymentMethodOptions = () => {
    const ip = useIp();
    const delivery = checkoutCustomer.value.deliveryAddress;

    const hasCompleteDeliveryAddress =
      !!delivery.postalCode &&
      !!delivery.city &&
      !!delivery.address &&
      !!delivery.country;

    if (hasCompleteDeliveryAddress) {
      return {
        Postcode: delivery.postalCode,
        City: delivery.city,
        Address1: delivery.address,
        Country: delivery.country,
        IP: (ip.value as string) || '',
      };
    }

    return {
      IP: (ip.value as string) || '',
    };
  };

  const validateCheckoutBeforePayment = async (): Promise<boolean> => {
    const cartStore = useCartStore();
    const { isDigitalOnly } = toRefs(cartStore);
    const addressStore = useAddressStore();
    const { addresses } = toRefs(addressStore);
    const formDeliveryStore = useFormDeliveryStore();
    const formInvoiceStore = useFormInvoiceStore();

    let allValid = true;
    const shouldValidateAddressForms =
      !isLoggedIn.value ||
      (isLoggedIn.value && addresses.value.length === 0);

    if (shouldValidateAddressForms) {
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

  const refreshPaymentMethods = async (customOptions?: any) => {
    return fetchPaymentMethods(customOptions || buildPaymentMethodOptions());
  };

  const scheduleRefreshPaymentMethods = (delay = 500) => {
    if (paymentRefreshTimer.value) {
      clearTimeout(paymentRefreshTimer.value);
    }

    paymentRefreshTimer.value = setTimeout(() => {
      refreshPaymentMethods().catch(() => {
        // keep checkout responsive even if payment methods endpoint fails
      });
    }, delay);
  };

  // Centralized watcher for all state that should trigger a payment methods refresh
  watch(
    () => ({
      deliveryAddress: JSON.stringify(checkoutCustomer.value.deliveryAddress),
      carrierId:
        cartCarrier.value?.IdCarrier ||
        checkoutCarrier.value.carrier?.IdCarrier ||
        0,
      cartTotals: JSON.stringify({
        totalToPay: cart.value?.Total?.ToPay?.TaxIncl || 0,
        shippingTotal: cart.value?.Total?.Shipping?.TaxIncl || 0,
        discountTotal: cart.value?.Total?.Discount?.TaxIncl || 0,
        promoCodes: cart.value?.Discounts?.PromoCodes?.map((p: any) => p.Code),
        cartRules: cart.value?.Discounts?.CartRules?.map((r: any) => r.IdCartRule),
      }),
      hasAddress: hasAddressDelivery.value,
      isDigital: isDigitalOnly.value,
    }),
    (newVal, oldVal) => {
      // Don't trigger if nothing changed or if no address is set
      if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
      if (!newVal.hasAddress) return;

      // Ensure we have a carrier if not digital
      const hasCarrier = !!newVal.carrierId;
      if (!newVal.isDigital && !hasCarrier) return;

      scheduleRefreshPaymentMethods();
    },
    { deep: true, immediate: true }
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

    if (!isDigitalOnly.value && (!carrier || !carrier.carrier)) {
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

    // Only validate invoice address if it's different from delivery
    if (
      JSON.stringify(customer.deliveryAddress) !==
      JSON.stringify(customer.invoiceAddress)
    ) {
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
    refreshPaymentMethods,
    scheduleRefreshPaymentMethods,
  };
});
