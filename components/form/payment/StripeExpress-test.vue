<script setup lang="ts">
import StripeHelper from '~/helpers/payments/StripeHelper';
import type { PaymentMethodType } from '~/types/PaymentType';

const { t, locale } = useI18n();

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const { customerSaveAddress } = auth;
const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const checkoutStore = useCheckoutStore();

const localePath = useLocalePath();
const router = useRouter();
const config = useRuntimeConfig();

const { paymentMethod } = defineProps<{
  paymentMethod?: PaymentMethodType;
}>();

const clientSecret = ref('');
const elements = ref<any>();
const stripe = ref<any>();
const loading = ref(true);
const error = ref('');
const expressCheckoutElement = ref<any>(null);

const stripePayment = ref<StripeHelper>();

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

// ----- Address mapping & sync -----
const toCheckoutAddress = (address: any = {}, name = '', email = '') => {
  const nameParts = (name || '').trim().split(' ').filter(Boolean);
  return {
    firstname: nameParts[0] || 'Guest',
    lastname: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.',
    address: address?.line1 || address?.address1 || '',
    postalCode: address?.postal_code || address?.postalCode || '',
    city: address?.city || '',
    country: address?.country || address?.country_code || '',
    phone: address?.phone || '0600000000',
    email: email || '',
    company: '', // Optional/empty for express
    state: address?.state || '',
  };
};

const syncAddressToStore = (checkoutAddress: any) => {
  const { checkoutCustomer, hasSameAddressForShipping } =
    storeToRefs(checkoutStore);

  checkoutCustomer.value.deliveryAddress = { ...checkoutAddress };

  // Express checkout usually provides one address, so sync both
  hasSameAddressForShipping.value = true;
  checkoutCustomer.value.invoiceAddress = { ...checkoutAddress };

  console.log(
    '[StripeExpress] Address synced to Store:',
    checkoutCustomer.value
  );
};

// ----- Helpers -----
const toCents = (value: any) => Math.round(Number(value || 0) * 100);

const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs = 7000
): Promise<T | null> => {
  let timer: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timer)
  ) as Promise<T | null>;
};

// ----- Carrier mapping -----
const shippingRatesById = ref<Record<string, any>>({});

const mapCarriersToStripeRates = (carrierData: any = {}) => {
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

const handleShippingAddressChange = async (event: any) => {
  try {
    const address = event.address;
    const name = event.name || '';
    const checkoutAddress = toCheckoutAddress(address, name);

    syncAddressToStore(checkoutAddress);

    // Update cart session with new address/country context before fetching carriers
    try {
      await fetchCart();
    } catch (err) {
      console.warn('[StripeExpress] fetchCart failed during address change', err);
    }

    // Fetch available carriers for the selected address
    shippingRatesById.value = {};
    const fetchOptions = {
      Postcode: checkoutAddress.postalCode,
      City: checkoutAddress.city,
      Country: checkoutAddress.country,
      Address: checkoutAddress.address || checkoutAddress.city,
      Address1: checkoutAddress.address || checkoutAddress.city,
      LanguageIsoCode: languageIsoCode?.value || 'fr',
      CurrencyIsoCode: currencyIsoCode?.value || 'EUR',
    };
    
    console.log('[StripeExpress] Fetching carriers with:', fetchOptions);

    const shippingData = await withTimeout(
      shippingStore.fetchShipping(fetchOptions as any),
      20000 // Increased timeout to 20s
    );

    if (!shippingData?.Carrier) {
      console.warn('[StripeExpress] No carriers found or fetch timed out.');
      return event.resolve({ shippingRates: [] });
    }

    const shippingRates = mapCarriersToStripeRates(shippingData.Carrier);
    event.resolve({ shippingRates });
  } catch (err) {
    console.error('[StripeExpress] shipping address change error:', err);
    event.resolve({ shippingRates: [] });
  }
};

const handleShippingRateChange = async (event: any) => {
  try {
    const shippingRate = event.shippingRate;
    const rateId = String(shippingRate.id);
    const mappedRate = shippingRatesById.value[rateId];

    // Update cart with the selected shipping carrier
    await updateShipping({ idCarrier: Number(rateId) });
    await fetchCart();

    // Calculate new total using cart subtotal + selected shipping
    // For this 1000 demo, we stick to the 1000 total but in a real app
    // it would be: toCents(cart.value?.Total?.ToPay?.TaxIncl)
    const newTotal = 1000;

    event.resolve({
      amount: newTotal,
      lineItems: [{ name: t('Order Total'), amount: newTotal }],
    });
  } catch (err) {
    console.error('[StripeExpress] shipping rate change error:', err);
    event.reject();
  }
};

const handleConfirm = async (event: any) => {
  error.value = '';
  loading.value = true;

  try {
    // Extract payer info from event
    const email = event?.email || event?.payerEmail || '';
    const name = event?.name || event?.payerName || '';
    const address = event?.address || event?.shippingAddress || {};

    // 1. Sync address to store
    const checkoutAddress = toCheckoutAddress(address, name, email);
    syncAddressToStore(checkoutAddress);

    // 2. Trigger form validation via elements.submit()
    const { error: submitError } = await elements.value.submit();
    if (submitError) {
      error.value = submitError.message || 'Validation failed.';
      loading.value = false;
      return;
    }

    // 3. Create the Intent on the backend
    const intentData = await stripePayment.value?.intent({
      paymentMethodTypes: 'card',
      amount: 1000,
    });

    clientSecret.value = intentData.ClientSecret;

    if (!clientSecret.value) {
      throw new Error('Failed to create payment intent.');
    }

    // 4. Post other transaction data
    if (await postData()) {
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
    }
  } catch (err: any) {
    console.error('[StripeExpress] confirm error:', err);
    error.value = err?.message || t('Payment failed.');
  } finally {
    loading.value = false;
  }
};

const initialize = async () => {
  try {
    elements.value = stripe.value.elements({
      mode: 'payment',
      amount: 1000,
      currency: currencyIsoCode.value?.toLowerCase() || 'eur',
      locale: locale.value ?? 'fr',
      paymentMethodCreation: 'manual',
    });

    const expressOptions: any = {
      buttonType: { applePay: 'buy', googlePay: 'buy' },
      buttonTheme: { applePay: 'black', googlePay: 'black' },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: true,
      shippingAddressRequired: true,
    };

    expressCheckoutElement.value = elements.value.create(
      'expressCheckout',
      expressOptions
    );

    expressCheckoutElement.value.on('ready', (ev: any) => {
      console.log('[StripeExpress] Ready:', ev.availablePaymentMethods);
      if (!ev.availablePaymentMethods) {
        error.value = t('Google Pay / Apple Pay is not available.');
      }
    });

    expressCheckoutElement.value.on(
      'shippingaddresschange',
      handleShippingAddressChange
    );
    expressCheckoutElement.value.on(
      'shippingratechange',
      handleShippingRateChange
    );
    expressCheckoutElement.value.on('confirm', handleConfirm);

    expressCheckoutElement.value.mount('#express-checkout-element');
  } catch (err) {
    console.error('[StripeExpress] initialization error:', err);
    error.value = 'Failed to initialize express checkout.';
  } finally {
    loading.value = false;
  }
};

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
    error.value = 'Stripe failed to load.';
    loading.value = false;
    return;
  }

  stripe.value = (window as any).Stripe(config.public.stripePublicKey);

  stripePayment.value = new StripeHelper({
    cart: cart.value,
    customer: customer.value || ({} as any),
  });

  initialize();
});

onBeforeUnmount(() => {
  if (expressCheckoutElement.value) {
    expressCheckoutElement.value.destroy();
  }
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
