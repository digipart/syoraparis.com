<script setup lang="ts">
import StripeHelper from '~/helpers/payments/StripeHelper';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { CarrierGenre, ShippingType } from '~/types/ShippingType';

const { t, locale } = useI18n();

const appStore = useAppStore();
const { shopName, currencyIsoCode, languageIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { updateShipping, fetchCart } = cartStore;
const { cart, isDigitalOnly } = toRefs(cartStore);

const auth = useAuth();
const { customer, isLoggedIn } = toRefs(auth);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice, addresses } = toRefs(addressStore);

const { customerSaveAddress } = auth;
const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, hasSameAddressForShipping, checkoutCarrier } =
  storeToRefs(checkoutStore);

const shippingStore = useShippingStore();

const localePath = useLocalePath();
const router = useRouter();
const config = useRuntimeConfig();

const { paymentMethod } = defineProps<{
  paymentMethod?: PaymentMethodType;
}>();

// ----- Reactive state -----
const clientSecret = ref('');
const elements = ref<any>();
const stripe = ref<any>();
const loading = ref(true);
const error = ref('');
const expressCheckoutElement = ref<any>(null);
const initializing = ref(false);
const initialContextPrepared = ref(false);

// Pending state kept during the Google/Apple Pay popup
const shippingRatesById = ref<Record<string, CarrierGenre>>({});
const pendingShippingAddress = ref<any>(null);
const pendingPayerName = ref('');
const pendingShippingRateId = ref<string | null>(null);

const stripePayment = ref<StripeHelper>();

// ----- Helpers -----
const toCents = (value: any) => Math.round(Number(value || 0) * 100);

const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs = 7000
): Promise<T | null> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  }) as Promise<T | null>;
};

const canInitializeExpress = computed(() => {
  return Boolean(
    stripe.value &&
    cart.value?.IdCart &&
    Number(cart.value?.Total?.ToPay?.TaxIncl || 0) > 0
  );
});

// ----- Address mapping -----
const toCheckoutAddress = (address: any = {}, name = '') => {
  const nameParts = (name || '').trim().split(' ').filter(Boolean);
  return {
    firstname:
      nameParts[0] ||
      checkoutCustomer.value?.deliveryAddress?.firstname ||
      'Guest',
    lastname:
      nameParts.length > 1
        ? nameParts.slice(1).join(' ')
        : checkoutCustomer.value?.deliveryAddress?.lastname || '.',
    address:
      address?.line1 ||
      address?.address1 ||
      checkoutCustomer.value?.deliveryAddress?.address ||
      '',
    postalCode:
      address?.postal_code ||
      address?.postalCode ||
      checkoutCustomer.value?.deliveryAddress?.postalCode ||
      '',
    city: address?.city || checkoutCustomer.value?.deliveryAddress?.city || '',
    country:
      address?.country ||
      address?.country_code ||
      checkoutCustomer.value?.deliveryAddress?.country ||
      '',
    phone: checkoutCustomer.value?.deliveryAddress?.phone || '0600000000',
    email: checkoutCustomer.value?.deliveryAddress?.email || '',
  };
};

// ----- Map carriers to Stripe shipping rates -----
const mapCarrierGroupsToStripeRates = (carrierData: any = {}) => {
  const groups = [
    ...(carrierData.Store || []).map((item: any) => ({
      ...item,
      _group: 'store',
    })),
    ...(carrierData.RelayPoint || []).map((item: any) => ({
      ...item,
      _group: 'relay',
    })),
    ...(carrierData.Home || []).map((item: any) => ({
      ...item,
      _group: 'home',
    })),
  ];

  return groups
    .filter((item: any) => item?.IdCarrier)
    .map((item: any) => {
      const id = String(item.IdCarrier);
      shippingRatesById.value[id] = item;
      return {
        id,
        displayName: item.Title || item.Name || 'Delivery',
        amount: toCents(item?.Price?.TaxIncl),
      };
    });
};

const getFallbackShippingRates = () => {
  const currentCarrier = cart.value?.Shipping?.Carrier;
  const fallbackId = currentCarrier?.IdCarrier
    ? String(currentCarrier.IdCarrier)
    : 'fallback_current';

  if (currentCarrier?.IdCarrier) {
    shippingRatesById.value[fallbackId] = currentCarrier;
  }

  return [
    {
      id: fallbackId,
      displayName:
        currentCarrier?.Title || currentCarrier?.Name || t('Standard delivery'),
      amount: toCents(cart.value?.Total?.Shipping?.TaxIncl),
    },
  ];
};

// ----- Sync address/carrier to CheckoutStore -----
/**
 * Writes the popup address into checkoutCustomer.deliveryAddress
 * AND invoiceAddress. Express Checkout only provides one address,
 * so we force hasSameAddressForShipping = true.
 */
const syncPopupAddressToCheckout = async (checkoutAddress: any) => {
  if (!checkoutAddress || isDigitalOnly.value) return;

  // Write delivery address
  checkoutCustomer.value.deliveryAddress = {
    ...checkoutCustomer.value.deliveryAddress,
    firstname: checkoutAddress.firstname,
    lastname: checkoutAddress.lastname,
    address: checkoutAddress.address,
    postalCode: checkoutAddress.postalCode,
    city: checkoutAddress.city,
    country: checkoutAddress.country,
    phone: checkoutAddress.phone,
    email: checkoutAddress.email || checkoutCustomer.value.deliveryAddress.email,
  };

  // Express Checkout = single address → invoice = delivery
  hasSameAddressForShipping.value = true;
  checkoutCustomer.value.invoiceAddress = {
    ...checkoutCustomer.value.invoiceAddress,
    firstname: checkoutAddress.firstname,
    lastname: checkoutAddress.lastname,
    address: checkoutAddress.address,
    postalCode: checkoutAddress.postalCode,
    city: checkoutAddress.city,
    country: checkoutAddress.country,
    phone: checkoutAddress.phone,
  };

  console.log('[StripeExpress] Address synced to CheckoutStore:', {
    delivery: checkoutCustomer.value.deliveryAddress,
    invoice: checkoutCustomer.value.invoiceAddress,
  });
};

const syncPopupCarrierToCart = async ({
  rateId,
  checkoutAddress,
}: {
  rateId: string;
  checkoutAddress: any;
}) => {
  if (!rateId || isDigitalOnly.value || rateId === 'fallback_current') return;

  try {
    await updateShipping({ idCarrier: Number(rateId) });
    await fetchCart();
    refreshStripeHelper();

    const selectedCarrier = shippingRatesById.value[rateId] || null;
    if (selectedCarrier) {
      // Sync to CheckoutStore
      checkoutCarrier.value = {
        carrier: selectedCarrier,
        relayPoint: null,
      };
    }

    console.log('[StripeExpress] Carrier synced:', {
      carrierId: rateId,
      carrierName: selectedCarrier?.Name,
      cartTotal: cart.value?.Total?.ToPay?.TaxIncl,
      cartShipping: cart.value?.Total?.Shipping?.TaxIncl,
    });
  } catch (err) {
    console.error('[StripeExpress] carrier cart sync error:', err);
  }
};

// ----- Ensure initial delivery & carrier context -----
const ensureInitialDeliveryAndCarrier = async () => {
  try {
    await addressStore.fetchAddresses();
  } catch (err) {
    console.error('[StripeExpress] fetch addresses error:', err);
  }

  const defaultAddress = checkoutCustomer.value?.deliveryAddress;
  if (!defaultAddress?.country) return;

  if (isDigitalOnly.value) return;

  let shippingData: ShippingType | null = null;
  try {
    shippingData = await withTimeout(
      shippingStore.fetchShipping({
        Postcode: defaultAddress.postalCode,
        City: defaultAddress.city,
        Address1: defaultAddress.address,
        Country: defaultAddress.country,
      })
    );
  } catch (err) {
    console.error('[StripeExpress] fetch carriers error:', err);
  }

  shippingRatesById.value = {};
  const shippingRates = shippingData?.Carrier
    ? mapCarrierGroupsToStripeRates(shippingData.Carrier)
    : [];

  const selectedRateId =
    String(cart.value?.Shipping?.Carrier?.IdCarrier || '') ||
    String(shippingRates?.[0]?.id || '');

  if (!selectedRateId) return;

  pendingShippingRateId.value = selectedRateId;

  try {
    await updateShipping({ idCarrier: Number(selectedRateId) });
    await fetchCart();
    refreshStripeHelper();

    const selectedCarrier = shippingRatesById.value[selectedRateId] || null;
    if (selectedCarrier) {
      checkoutCarrier.value = {
        carrier: selectedCarrier,
        relayPoint: null,
      };
    }
  } catch (err) {
    console.error('[StripeExpress] set initial carrier error:', err);
  }
};

// ----- Stripe event handlers -----
const handleShippingAddressChange = async (event: any) => {
  try {
    const shippingAddress = event?.address || {};
    const payerName = event?.name || '';
    const checkoutAddress = toCheckoutAddress(shippingAddress, payerName);

    pendingShippingAddress.value = shippingAddress;
    pendingPayerName.value = payerName;

    // 1. Immediately sync address to CheckoutStore
    await syncPopupAddressToCheckout(checkoutAddress);

    // 2. Fetch cart with new country so taxes/totals update
    if (checkoutAddress.country) {
      try {
        await fetchCart();
        refreshStripeHelper();
      } catch (err) {
        console.error('[StripeExpress] fetchCart after address change error:', err);
      }
    }

    if (!checkoutAddress?.postalCode || !checkoutAddress?.city) {
      return event.resolve({ shippingRates: getFallbackShippingRates() });
    }

    // 3. Fetch available carriers for the new address
    shippingRatesById.value = {};
    let shippingData: ShippingType | null = null;
    try {
      shippingData = await withTimeout(
        shippingStore.fetchShipping({
          Postcode: checkoutAddress.postalCode,
          City: checkoutAddress.city,
          Address1: checkoutAddress.address || checkoutAddress.city,
          Country: checkoutAddress.country,
        })
      );
    } catch (err) {
      console.error('[StripeExpress] fetch carriers error:', err);
    }

    if (!shippingData?.Carrier) {
      return event.resolve({ shippingRates: getFallbackShippingRates() });
    }

    const shippingRates = mapCarrierGroupsToStripeRates(shippingData.Carrier);
    if (!shippingRates.length) {
      return event.resolve({ shippingRates: getFallbackShippingRates() });
    }

    event.resolve({ shippingRates });
  } catch (err) {
    console.error('[StripeExpress] address change error:', err);
    event.resolve({ shippingRates: getFallbackShippingRates() });
  }
};

const handleShippingRateChange = async (event: any) => {
  try {
    const shippingRate = event?.shippingRate;
    const rateId = String(shippingRate?.id || '');
    if (!rateId) return event.reject();

    pendingShippingRateId.value = rateId;

    const mappedRate = shippingRatesById.value[rateId];
    const shippingAmount = Number(
      shippingRate?.amount ?? toCents(mappedRate?.Price?.TaxIncl)
    );

    const subtotalFromToPay =
      toCents(cart.value?.Total?.ToPay?.TaxIncl) -
      toCents(cart.value?.Total?.Shipping?.TaxIncl);
    const subtotalFromProduct =
      toCents(cart.value?.Total?.Product?.TaxIncl) -
      toCents(cart.value?.Total?.Discount?.TaxIncl);
    const subtotal = Math.max(
      subtotalFromToPay > 0 ? subtotalFromToPay : subtotalFromProduct,
      0
    );
    const total = subtotal + shippingAmount;

    event.resolve({
      amount: total,
      lineItems: [
        { name: t('Subtotal'), amount: subtotal },
        { name: t('Shipping'), amount: shippingAmount },
      ],
    });

    const checkoutAddress = toCheckoutAddress(
      pendingShippingAddress.value || {},
      pendingPayerName.value || ''
    );
    syncPopupAddressToCheckout(checkoutAddress);
    syncPopupCarrierToCart({ rateId, checkoutAddress });
  } catch (err) {
    console.error('[StripeExpress] rate change error:', err);
    event.reject();
  }
};

// ----- Post payment data to backend -----
const postData = async () => {
  try {
    await customerSaveAddress();
    await registerAndPrepareGuestAddress();

    const pm =
      paymentMethod ||
      ({
        PaymentCode: 'express',
        PaymentProvider: 'stripe',
      } as any);

    await stripePayment.value?.postData({
      clientSecret: clientSecret.value,
      paymentMethod: pm,
      addressDelivery: addressDelivery?.value!,
      addressInvoice: addressInvoice?.value!,
    });

    return true;
  } catch (err) {
    console.error('[StripeExpress] postData error:', err);
    return false;
  }
};

// ----- handleConfirm: final payment -----
const handleConfirm = async (event: any) => {
  error.value = '';
  loading.value = true;

  try {
    // Extract payer info from event
    const email =
      event?.email ||
      event?.payerEmail ||
      event?.billingDetails?.email ||
      event?.paymentMethod?.billing_details?.email ||
      checkoutCustomer.value?.deliveryAddress?.email ||
      '';
    const payerName =
      event?.name || event?.payerName || event?.billingDetails?.name || '';
    const nameParts = payerName.trim().split(' ').filter(Boolean);
    const firstname =
      nameParts[0] ||
      checkoutCustomer.value?.deliveryAddress?.firstname ||
      'Guest';
    const lastname =
      nameParts.length > 1
        ? nameParts.slice(1).join(' ')
        : checkoutCustomer.value?.deliveryAddress?.lastname || '.';

    // Update checkout store with payer info
    checkoutCustomer.value.deliveryAddress.email = email;
    checkoutCustomer.value.deliveryAddress.firstname = firstname;
    checkoutCustomer.value.deliveryAddress.lastname = lastname;

    // Sync shipping address from the popup
    const shippingAddress =
      event?.address ||
      event?.shippingAddress?.address ||
      pendingShippingAddress.value ||
      {};
    const checkoutAddress = toCheckoutAddress(shippingAddress, payerName);
    await syncPopupAddressToCheckout(checkoutAddress);

    // Sync the selected carrier
    const selectedRateId =
      pendingShippingRateId.value || event?.shippingRate?.id;
    if (
      !isDigitalOnly.value &&
      selectedRateId &&
      String(selectedRateId) !== 'fallback_current'
    ) {
      await updateShipping({ idCarrier: Number(selectedRateId) });
      await fetchCart();

      const selectedCarrier =
        shippingRatesById.value[String(selectedRateId)] || null;
      if (selectedCarrier) {
        checkoutCarrier.value = {
          carrier: selectedCarrier,
          relayPoint: null,
        };
      }
    }

    // Post payment data to backend
    const posted = await postData();
    if (!posted) {
      throw new Error(t('Unable to initialize payment data.'));
    }

    // Confirm payment with Stripe
    const idorder = cart.value.IdCart;
    const { error: stripeError, paymentIntent } =
      await stripe.value.confirmPayment({
        elements: elements.value,
        clientSecret: clientSecret.value,
        confirmParams: {
          return_url: `${config.public.url}/order/accepted?orderid=${idorder}&cartid=${cart.value.IdCart}`,
        },
        redirect: 'if_required',
      });

    if (stripeError) {
      error.value = stripeError.message || 'An unexpected error occurred.';
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await cartStore.newIdCart();
      } catch (err) {
        console.error('[StripeExpress] Failed to create new cart:', err);
      }

      router.replace(
        localePath({
          name: 'order-state',
          params: { state: 'accepted' },
          query: { orderid: idorder, cartid: cart.value.IdCart },
        })
      );
    }
  } catch (err: any) {
    console.error('[StripeExpress] confirm error:', err);
    error.value = err?.message || t('Payment failed.');
  } finally {
    loading.value = false;
  }
};

// ----- Destroy express element -----
const destroyExpressElement = () => {
  if (!expressCheckoutElement.value) return;
  expressCheckoutElement.value.destroy();
  expressCheckoutElement.value = null;
};

// ----- Initialize Stripe Express -----
const initialize = async () => {
  try {
    const data = await stripePayment.value?.intent({
      paymentMethodTypes: 'card',
    });

    clientSecret.value = data.ClientSecret;

    if (!clientSecret.value) {
      loading.value = false;
      return;
    }

    elements.value = stripe.value.elements({
      clientSecret: clientSecret.value,
      locale: locale.value ?? 'fr',
    });

    // Create the express checkout element with both Apple Pay and Google Pay
    const expressOptions: any = {
      buttonType: {
        applePay: 'buy',
        googlePay: 'buy',
      },
      buttonTheme: {
        applePay: 'black',
        googlePay: 'black',
      },
    };

    // If not digital-only, request shipping
    if (!isDigitalOnly.value) {
      expressOptions.requestPayerName = true;
      expressOptions.requestPayerEmail = true;
      expressOptions.requestShipping = true;
      expressOptions.shippingAddressRequired = true;
    }

    try {
      expressOptions.paymentMethods = {
        googlePay: 'always',
        applePay: 'always',
        link: 'never',
        paypal: 'never',
      };
      expressCheckoutElement.value = elements.value.create(
        'expressCheckout',
        expressOptions
      );
    } catch (err) {
      // Fallback if paymentMethods option is not supported
      delete expressOptions.paymentMethods;
      expressCheckoutElement.value = elements.value.create(
        'expressCheckout',
        expressOptions
      );
    }

    // Ready event — check which wallets are available
    expressCheckoutElement.value.on('ready', async (ev: any) => {
      if (!ev.availablePaymentMethods) {
        console.warn(
          '[StripeExpress] No wallet payment methods available on this device/browser.'
        );
        error.value = t(
          'Google Pay / Apple Pay is not available on this device or browser.'
        );
        return;
      }
      console.log(
        '[StripeExpress] Available methods:',
        ev.availablePaymentMethods
      );

      // Prepare initial delivery & carrier context
      if (!initialContextPrepared.value) {
        await ensureInitialDeliveryAndCarrier();
        initialContextPrepared.value = true;
      }
    });

    // Shipping events (only relevant for physical products)
    if (!isDigitalOnly.value) {
      expressCheckoutElement.value.on(
        'shippingaddresschange',
        handleShippingAddressChange
      );
      expressCheckoutElement.value.on(
        'shippingratechange',
        handleShippingRateChange
      );
    }

    // Confirm event
    expressCheckoutElement.value.on('confirm', handleConfirm);

    // Mount the element
    expressCheckoutElement.value.mount('#express-checkout-element');
  } catch (err) {
    console.error('[StripeExpress] initialization error:', err);
    error.value =
      (err as any)?.message || 'Failed to initialize express checkout.';
  } finally {
    loading.value = false;
  }
};

const maybeInitialize = async () => {
  if (!canInitializeExpress.value) {
    destroyExpressElement();
    loading.value = false;
    return;
  }

  if (initializing.value || expressCheckoutElement.value) return;

  initializing.value = true;
  loading.value = true;
  error.value = '';
  destroyExpressElement();

  await initialize();

  initializing.value = false;
};

// ----- Load Stripe.js -----
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  await loadScript('https://js.stripe.com/v3/');
  if (!(window as any).Stripe) {
    console.error('[StripeExpress] Stripe.js failed to load');
    error.value = 'Failed to load Stripe.';
    loading.value = false;
    return;
  }

  stripe.value = (window as any).Stripe(config.public.stripePublicKey);

  stripePayment.value = new StripeHelper({
    cart: cart.value,
    customer: customer.value || ({} as any),
  });

  maybeInitialize();
});

// Watch for cart becoming ready
watch(canInitializeExpress, (val) => {
  if (val && !expressCheckoutElement.value) {
    maybeInitialize();
  }
});

onBeforeUnmount(() => {
  destroyExpressElement();
});
</script>

<template>
  <div class="stripe-express-form">
    <div
      v-if="error"
      class="bg-red-50 text-red-600 p-3 mb-3 text-sm rounded border border-red-200"
    >
      {{ error }}
    </div>

    <div v-loading="loading">
      <div v-show="stripe">
        <div id="express-checkout-element"></div>
        <div
          id="express-checkout-message"
          class="hidden bg-red-50 text-red-600 p-3 mt-3 text-sm rounded border border-red-200"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stripe-express-form {
  @apply w-full mb-4;
  min-height: 50px;
}

#express-checkout-element {
  @apply min-h-[44px];
}
</style>
