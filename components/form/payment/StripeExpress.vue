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
const isEmpty = ref(true);

// Pending state kept during the Google/Apple Pay popup
const shippingRatesById = ref<Record<string, CarrierGenre>>({});
const pendingShippingAddress = ref<any>(null);
const pendingPayerName = ref('');
const pendingShippingRateId = ref<string | null>(null);

// Sync guards (mirrors the reference's deduplication logic)
const isProcessingSync = ref(false);
const lastSyncedAddressHash = ref<string | null>(null);
const lastSyncedRateId = ref<string | null>(null);
const lastFetchedCartHash = ref<string | null>(null);

const stripePayment = ref<StripeHelper>();

// ----- Helpers -----
const toCents = (value: any) => Math.round(Number(value || 0) * 100);

/**
 * Extract the real carrier ID from a compound shipping rate ID.
 * e.g. "23_3500" → "23", "23" → "23"
 */
const extractCarrierId = (rateId: string | null): string | null => {
  if (!rateId) return null;
  const str = String(rateId);
  const underscoreIdx = str.indexOf('_');
  return underscoreIdx > 0 ? str.substring(0, underscoreIdx) : str;
};

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

// ----- Identity helpers (from reference) -----

/**
 * Detect wallet placeholder names that should NOT be persisted
 * as the customer's real identity (e.g. Google Pay test cards).
 */
const isWalletPlaceholderName = (
  firstname?: string,
  lastname?: string
): boolean => {
  if (!firstname) return true;
  const fn = (firstname || '').trim().toLowerCase();
  const ln = (lastname || '').trim().toLowerCase();
  const placeholders = [
    'card',
    'express',
    'client',
    'test',
    'browser',
    'google',
    'apple',
  ];
  if (placeholders.includes(fn)) return true;
  if (fn === 'card' && ln.startsWith('holder')) return true;
  if (fn === 'test' && (ln === 'user' || ln === 'test')) return true;
  if (fn === 'express' && ln === 'client') return true;
  return false;
};

/**
 * Get the best known real identity for the current user,
 * preferring auth data over wallet-provided names.
 */
const getBestKnownIdentity = (): {
  firstname: string;
  lastname: string;
} | null => {
  // 1. Logged-in customer (most authoritative)
  const authCustomer = customer.value;
  if (
    authCustomer?.Firstname &&
    !isWalletPlaceholderName(authCustomer.Firstname, authCustomer.Lastname)
  ) {
    return {
      firstname: authCustomer.Firstname,
      lastname: authCustomer.Lastname || '',
    };
  }

  // 2. Checkout store delivery address
  const addr = checkoutCustomer.value?.deliveryAddress;
  if (
    addr?.firstname &&
    !isWalletPlaceholderName(addr.firstname, addr.lastname)
  ) {
    return { firstname: addr.firstname, lastname: addr.lastname || '' };
  }

  return null;
};

// ----- Address mapping (matches reference's field naming) -----
const toCheckoutAddress = (address: any = {}, name = '', phone = '') => {
  const nameParts = (name || '').trim().split(' ').filter(Boolean);
  const walletFirstname = nameParts[0] || '';
  const walletLastname =
    nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  // Use the best real identity, falling back to wallet name only if it's not a placeholder
  const knownIdentity = getBestKnownIdentity();
  let finalFirstname: string, finalLastname: string;

  if (knownIdentity) {
    finalFirstname = knownIdentity.firstname;
    finalLastname = knownIdentity.lastname;
  } else if (!isWalletPlaceholderName(walletFirstname, walletLastname)) {
    finalFirstname = walletFirstname;
    finalLastname = walletLastname;
  } else {
    finalFirstname = walletFirstname || 'Express';
    finalLastname = walletLastname || 'Client';
  }

  return {
    firstname: finalFirstname,
    lastname: finalLastname,
    address:
      address?.addressLine?.[0] ||
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
      (address?.country?.length === 2 ? address.country : null) ||
      (address?.country_code?.length === 2 ? address.country_code : null) ||
      checkoutCustomer.value?.deliveryAddress?.country ||
      '',
    phone:
      phone || checkoutCustomer.value?.deliveryAddress?.phone || '0600000000',
    email: checkoutCustomer.value?.deliveryAddress?.email || '',
  };
};

// ----- Map carriers to Stripe shipping rates -----
// Uses compound IDs (carrierId_amount) to guarantee uniqueness across groups
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
      const amount = Math.round(Number(item?.Price?.TaxIncl || 0) * 100);
      const id = String(item.IdCarrier);
      // Compound ID guarantees uniqueness across different amounts
      const uniqueId = `${id}_${amount}`;
      const label = item.Title || item.Name || t('Standard delivery');

      shippingRatesById.value[uniqueId] = item;

      return {
        id: uniqueId,
        displayName: label,
        amount,
      };
    });
};

const getFallbackShippingRates = () => {
  const currentCarrier = cart.value?.Shipping?.Carrier;
  const amount = Math.round(
    Number(cart.value?.Total?.Shipping?.TaxIncl || 0) * 100
  );
  const fallbackId = currentCarrier?.IdCarrier
    ? `${currentCarrier.IdCarrier}_${amount}`
    : `fallback_${amount}`;
  const label =
    currentCarrier?.Title || currentCarrier?.Name || t('Standard delivery');

  if (currentCarrier?.IdCarrier) {
    shippingRatesById.value[fallbackId] = currentCarrier;
  }

  return [
    {
      id: fallbackId,
      displayName: label,
      amount,
    },
  ];
};

// ----- Refresh StripeHelper with latest cart data -----
const refreshStripeHelper = () => {
  stripePayment.value = new StripeHelper({
    cart: cart.value,
    customer: customer.value || ({} as any),
  });
};

// ----- Full popup-to-store sync -----
/**
 * Syncs the popup address + carrier selection to CheckoutStore + backend.
 * Always forces carrier update to keep the cart in sync with the popup.
 */
const syncPopupStateToStore = async ({
  rateId,
  checkoutAddress,
}: {
  rateId: string;
  checkoutAddress: any;
}) => {
  if (!checkoutAddress) return;

  try {
    isProcessingSync.value = true;

    // 1. Update addresses in CheckoutStore
    checkoutCustomer.value.deliveryAddress = {
      ...checkoutCustomer.value.deliveryAddress,
      firstname: checkoutAddress.firstname,
      lastname: checkoutAddress.lastname,
      address: checkoutAddress.address,
      postalCode: checkoutAddress.postalCode,
      city: checkoutAddress.city,
      country: checkoutAddress.country,
      phone: checkoutAddress.phone,
      email:
        checkoutAddress.email || checkoutCustomer.value.deliveryAddress.email,
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

    // 2. Save address to backend so cart taxes/shipping are correct
    const addressHash =
      (checkoutAddress.firstname || '') +
      (checkoutAddress.address || '') +
      (checkoutAddress.postalCode || '') +
      (checkoutAddress.city || '');

    if (lastSyncedAddressHash.value !== addressHash) {
      try {
        const savedAddress = await addressStore.addAddress({
          Firstname: checkoutAddress.firstname,
          Lastname: checkoutAddress.lastname,
          Address1: checkoutAddress.address,
          Postcode: checkoutAddress.postalCode,
          City: checkoutAddress.city,
          CountryIsoCode: checkoutAddress.country,
          MobilePhone: checkoutAddress.phone,
          IsDelivery: true,
          IsInvoice: true,
        });
        if (savedAddress) {
          lastSyncedAddressHash.value = addressHash;
          await addressStore.fetchAddresses().catch(() => {});
        }
      } catch (e) {
        console.warn('[StripeExpress] Could not save address dynamically', e);
      }
    }

    // 3. ALWAYS set carrier — no dedup here, callers control when to call
    const realCarrierId = extractCarrierId(rateId);
    if (realCarrierId && !realCarrierId.startsWith('fallback')) {
      // If this is a relay-point carrier, fetch relay points
      await maybeSetRelayPoint(rateId, checkoutAddress);

      const relayPoint = shippingStore.relayPointSelected;
      const relayPointId = relayPoint?.Id || relayPoint?.IdRelayPoint;

      console.log(
        '[StripeExpress] Setting carrier:',
        realCarrierId,
        'rate:',
        rateId
      );

      await updateShipping({
        idCarrier: Number(realCarrierId),
        ...(relayPointId ? { IdRelayPoint: String(relayPointId) } : {}),
      });
      lastSyncedRateId.value = String(rateId);

      // Sync carrier to CheckoutStore
      const selectedCarrier = shippingRatesById.value[String(rateId)] || null;
      if (selectedCarrier) {
        checkoutCarrier.value = {
          carrier: selectedCarrier,
          relayPoint: relayPoint || null,
        };
      }
    }

    // 4. ALWAYS fetch fresh cart to ensure totals are accurate
    const freshCart = await fetchCart();
    refreshStripeHelper();

    await nextTick();
    lastFetchedCartHash.value = addressHash + '_' + (rateId || 'none');

    console.log(
      '[StripeExpress] Sync complete. Cart total:',
      cart.value?.Total?.ToPay?.TaxIncl,
      'Shipping:',
      cart.value?.Total?.Shipping?.TaxIncl,
      'Carrier:',
      checkoutCarrier.value?.carrier?.Name || 'none'
    );
  } catch (err) {
    console.error('[StripeExpress] background sync error:', err);
  } finally {
    isProcessingSync.value = false;
  }
};

// ----- Relay point auto-selection -----
const maybeSetRelayPoint = async (rateId: string, checkoutAddress: any) => {
  const carrier = shippingRatesById.value[String(rateId)];
  if (!carrier || (carrier as any)._group !== 'relay') return;

  // Skip if we already have a relay point
  const existing = shippingStore.relayPointSelected;
  if (existing?.Id) return;

  try {
    const relayPoints = await shippingStore.fetchRelayPoints({
      IdCarrier: carrier.IdCarrier,
      Postcode: checkoutAddress.postalCode,
      City: checkoutAddress.city,
      Address1: checkoutAddress.address,
      Country: checkoutAddress.country,
    });

    if (relayPoints && relayPoints.length > 0) {
      shippingStore.relayPointSelected = relayPoints[0];
      console.log(
        '[StripeExpress] Auto-selected relay point:',
        relayPoints[0].Id,
        relayPoints[0].Name
      );
    }
  } catch (e) {
    console.warn('[StripeExpress] Could not fetch relay points:', e);
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
        Address: defaultAddress.address || defaultAddress.city,
        Address1: defaultAddress.address || defaultAddress.city,
        Country: defaultAddress.country,
        LanguageIsoCode: languageIsoCode?.value || 'fr',
        CurrencyIsoCode: currencyIsoCode?.value || 'EUR',
      } as any)
    );
  } catch (err) {
    console.error('[StripeExpress] fetch carriers error:', err);
  }

  shippingRatesById.value = {};
  const shippingRates = shippingData?.Carrier
    ? mapCarrierGroupsToStripeRates(shippingData.Carrier)
    : [];

  // Use carrier from cart or first available rate
  const rawCarrierId = cart.value?.Shipping?.Carrier?.IdCarrier;
  const selectedRateId = rawCarrierId
    ? String(rawCarrierId)
    : shippingRates?.[0]
      ? extractCarrierId(shippingRates[0].id)
      : null;

  if (!selectedRateId) return;

  pendingShippingRateId.value = shippingRates?.[0]?.id || selectedRateId;

  try {
    await updateShipping({ idCarrier: Number(selectedRateId) });
    await fetchCart();
    refreshStripeHelper();

    // Find matching carrier in our map by the real ID
    const selectedCarrier = Object.values(shippingRatesById.value).find(
      (c: any) => String(c.IdCarrier) === String(selectedRateId)
    );
    if (selectedCarrier) {
      checkoutCarrier.value = {
        carrier: selectedCarrier,
        relayPoint: null,
      };
    }

    console.log(
      '[StripeExpress] Initial context ready. Total:',
      cart.value?.Total?.ToPay?.TaxIncl
    );
  } catch (err) {
    console.error('[StripeExpress] set initial carrier error:', err);
  }
};

// ----- Update PaymentIntent on the backend, then refresh the popup -----
/**
 * Updates the actual PaymentIntent on the backend with the current cart total,
 * then tells the Elements instance to re-fetch the updated amount.
 * This is the clientSecret-mode approach (proven in the reference).
 */
const updatePaymentIntent = async () => {
  try {
    await nextTick();

    const cartTotalVal = toCents(cart.value?.Total?.ToPay?.TaxIncl);
    const shippingVal = cart.value?.Total?.Shipping?.TaxIncl;

    if (cartTotalVal <= 0) {
      console.warn('[StripeExpress] Skipping intent update: cart total is 0');
      return;
    }

    console.log(
      '[StripeExpress] Updating PaymentIntent amount to:',
      cartTotalVal,
      '(shipping:',
      shippingVal,
      ')'
    );

    // Update the PaymentIntent on the backend with the new amount and current context
    const address = checkoutCustomer.value?.deliveryAddress;
    const relayPoint = shippingStore.relayPointSelected;
    const relayPointId = relayPoint?.Id || relayPoint?.IdRelayPoint;

    const data = await (stripePayment.value as any)?.intent({
      automaticPaymentMethods: { enabled: true },
      paymentMethodTypes: 'card',
      amount: cartTotalVal,
      clientSecret: clientSecret.value,
      email: address?.email || '',
      firstname: address?.firstname || '',
      lastname: address?.lastname || '',
      idCart: cart.value?.IdCart,
      idCarrier: Number(extractCarrierId(pendingShippingRateId.value) || 0),
      idRelayPoint: String(relayPointId || ''),
      address: address
        ? {
            Address1: address.address,
            Postcode: address.postalCode,
            City: address.city,
            Country: address.country,
          }
        : undefined,
    });

    if (data?.ClientSecret) {
      clientSecret.value = data.ClientSecret;
    }

    // Tell the Express Checkout Element to re-fetch the PaymentIntent amount
    if (elements.value && typeof elements.value.fetchUpdates === 'function') {
      try {
        await elements.value.fetchUpdates();
        console.log('[StripeExpress] fetchUpdates() applied successfully');
      } catch (e) {
        console.warn('[StripeExpress] fetchUpdates failed:', e);
      }
    } else {
      console.warn('[StripeExpress] fetchUpdates not available');
    }
  } catch (err) {
    console.error('[StripeExpress] updatePaymentIntent error:', err);
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

    // Reset rate dedup since address changed — new carrier context
    lastSyncedRateId.value = null;

    if (!checkoutAddress?.postalCode || !checkoutAddress?.city) {
      return event.resolve({ shippingRates: getFallbackShippingRates() });
    }

    // Fetch available carriers for the new address
    shippingRatesById.value = {};
    let shippingData: ShippingType | null = null;
    try {
      shippingData = await withTimeout(
        shippingStore.fetchShipping({
          Postcode: checkoutAddress.postalCode,
          City: checkoutAddress.city,
          Address: checkoutAddress.address || checkoutAddress.city,
          Address1: checkoutAddress.address || checkoutAddress.city,
          Country: checkoutAddress.country,
          LanguageIsoCode: languageIsoCode?.value || 'fr',
          CurrencyIsoCode: currencyIsoCode?.value || 'EUR',
        } as any)
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

    // Wait for any ongoing sync to finish
    let retries = 0;
    while (isProcessingSync.value && retries < 20) {
      await new Promise((r) => setTimeout(r, 100));
      retries++;
    }

    // Sync the first shipping rate + address to the backend
    pendingShippingRateId.value = shippingRates[0].id;
    await syncPopupStateToStore({
      checkoutAddress,
      rateId: shippingRates[0].id,
    });

    // Update the popup total
    await updatePaymentIntent();

    console.log(
      '[StripeExpress] Resolved address change with',
      shippingRates.length,
      'rates',
      '| Cart total:',
      cart.value?.Total?.ToPay?.TaxIncl
    );

    // Resolve with ONLY shippingRates — the total comes from Elements.update()
    event.resolve({ shippingRates });
  } catch (err) {
    console.error('[StripeExpress] address change error:', err);
    try {
      event.resolve({ shippingRates: getFallbackShippingRates() });
    } catch (e) {}
  }
};

const handleShippingRateChange = async (event: any) => {
  try {
    const shippingRate = event?.shippingRate;
    if (!shippingRate?.id) {
      return event.resolve();
    }

    const rateId = String(shippingRate.id);
    pendingShippingRateId.value = rateId;

    console.log(
      '[StripeExpress] Rate change event. Selected rate:',
      rateId,
      '| Previous rate:',
      lastSyncedRateId.value
    );

    const checkoutAddress = toCheckoutAddress(
      pendingShippingAddress.value || {},
      pendingPayerName.value || ''
    );

    // Wait for any ongoing sync to finish
    let retries = 0;
    while (isProcessingSync.value && retries < 20) {
      await new Promise((r) => setTimeout(r, 100));
      retries++;
    }

    // Force sync — always update carrier when user explicitly picks a rate
    // (syncPopupStateToStore no longer deduplicates on rateId)
    await syncPopupStateToStore({ rateId, checkoutAddress });

    // Update the popup total after carrier change
    await updatePaymentIntent();

    console.log(
      '[StripeExpress] Resolved rate change for:',
      rateId,
      '| New cart total:',
      cart.value?.Total?.ToPay?.TaxIncl,
      '| Shipping:',
      cart.value?.Total?.Shipping?.TaxIncl
    );

    event.resolve();
  } catch (err) {
    console.error('[StripeExpress] rate change error:', err);
    try {
      event.resolve();
    } catch (e) {}
  }
};

// ----- Post payment data to backend -----
const postData = async () => {
  try {
    await registerAndPrepareGuestAddress();
    await customerSaveAddress();

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

  console.log('event', event);

  try {
    console.log(
      '[StripeExpress Confirm] Event payload:',
      JSON.parse(JSON.stringify(event))
    );

    // Extract payer info from event (unredacted at confirm time)
    const walletEmail =
      event?.email ||
      event?.payerEmail ||
      event?.billingDetails?.email ||
      event?.paymentMethod?.billing_details?.email ||
      '';

    // If logged in, always use the authenticated user's email
    const email = isLoggedIn.value
      ? customer.value?.Email || walletEmail
      : walletEmail || checkoutCustomer.value?.deliveryAddress?.email || '';

    const payerName =
      event?.name ||
      event?.payerName ||
      event?.billingDetails?.name ||
      event?.paymentMethod?.billing_details?.name ||
      '';
    const phone =
      event?.payerPhone ||
      event?.billingDetails?.phone ||
      event?.paymentMethod?.billing_details?.phone ||
      '';

    // Sync shipping address from the popup
    const shippingAddress =
      event?.address ||
      event?.shippingAddress?.address ||
      event?.billingDetails?.address ||
      event?.paymentMethod?.billing_details?.address ||
      pendingShippingAddress.value ||
      {};
    const checkoutAddress = toCheckoutAddress(
      shippingAddress,
      payerName,
      phone
    );

    // Filter out wallet placeholder names — always prefer real identity
    const knownIdentity = getBestKnownIdentity();
    let finalFirstname: string, finalLastname: string;

    if (
      isWalletPlaceholderName(
        checkoutAddress.firstname,
        checkoutAddress.lastname
      ) &&
      knownIdentity
    ) {
      finalFirstname = knownIdentity.firstname;
      finalLastname = knownIdentity.lastname;
    } else if (
      !isWalletPlaceholderName(
        checkoutAddress.firstname,
        checkoutAddress.lastname
      )
    ) {
      finalFirstname = checkoutAddress.firstname;
      finalLastname = checkoutAddress.lastname;
    } else {
      finalFirstname = checkoutAddress.firstname || 'Client';
      finalLastname = checkoutAddress.lastname || 'Express';
    }

    // Update checkout store with final payer info
    checkoutCustomer.value.deliveryAddress = {
      ...checkoutCustomer.value.deliveryAddress,
      email,
      firstname: finalFirstname,
      lastname: finalLastname,
      address: checkoutAddress.address,
      postalCode: checkoutAddress.postalCode,
      city: checkoutAddress.city,
      country: checkoutAddress.country,
      phone: checkoutAddress.phone,
    };

    hasSameAddressForShipping.value = true;
    checkoutCustomer.value.invoiceAddress = {
      ...checkoutCustomer.value.invoiceAddress,
      firstname: finalFirstname,
      lastname: finalLastname,
      address: checkoutAddress.address,
      postalCode: checkoutAddress.postalCode,
      city: checkoutAddress.city,
      country: checkoutAddress.country,
      phone: checkoutAddress.phone,
    };

    // Sync the selected carrier one final time
    const selectedRateId =
      pendingShippingRateId.value || event?.shippingRate?.id;
    if (
      !isDigitalOnly.value &&
      selectedRateId &&
      !String(extractCarrierId(selectedRateId)).startsWith('fallback')
    ) {
      const realCarrierId = extractCarrierId(selectedRateId);
      if (realCarrierId) {
        await updateShipping({ idCarrier: Number(realCarrierId) });
        await fetchCart();
        refreshStripeHelper();

        const selectedCarrier = Object.values(shippingRatesById.value).find(
          (c: any) => String(c.IdCarrier) === String(realCarrierId)
        );
        if (selectedCarrier) {
          checkoutCarrier.value = {
            carrier: selectedCarrier,
            relayPoint: null,
          };
        }
      }
    }

    const idorder = cart.value.IdCart;

    // Final intent update to ensure the amount matches the cart
    await updatePaymentIntent();

    // Post metadata to backend
    const posted = await postData();
    if (!posted) {
      throw new Error(t('Unable to initialize payment data.'));
    }

    // Confirm the payment — PI already exists in clientSecret mode
    const { error: stripeError, paymentIntent } =
      await stripe.value.confirmPayment({
        elements: elements.value,
        clientSecret: clientSecret.value,
        confirmParams: {
          return_url: `${config.public.url}/order/accepted?orderid=${idorder}&cartid=${cart.value.IdCart}`,
          payment_method_data: {
            billing_details: {
              email: email,
              name: `${finalFirstname} ${finalLastname}`.trim(),
              phone: phone,
            },
          },
        },
        redirect: 'if_required',
      });

    if (stripeError) {
      error.value = stripeError.message || 'An unexpected error occurred.';
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log(
        '[StripeExpress] Payment successful. Redirecting to thanks page.'
      );

      // Clear the cart locally to prevent double-submits
      try {
        await cartStore.newIdCart();
      } catch (err) {
        console.error('[StripeExpress] Failed to generate new cart ID:', err);
      }

      // Final redirect to the success page
      router.push(
        localePath(
          `/order/accepted?orderid=${idorder}&cartid=${cart.value.IdCart}`
        )
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
    const address = checkoutCustomer.value?.deliveryAddress;
    let data: any;
    try {
      const relayPoint = shippingStore.relayPointSelected;
      const relayPointId = relayPoint?.Id || relayPoint?.IdRelayPoint;

      data = await (stripePayment.value as any)?.intent({
        automaticPaymentMethods: { enabled: true },
        paymentMethodTypes: 'card',
        email: address?.email || '',
        firstname: address?.firstname || '',
        lastname: address?.lastname || '',
        idCart: cart.value?.IdCart,
        idCarrier: Number(extractCarrierId(pendingShippingRateId.value) || 0),
        idRelayPoint: String(relayPointId || ''),
        address: address
          ? {
              Address1: address.address,
              Postcode: address.postalCode,
              City: address.city,
              Country: address.country,
            }
          : undefined,
      });
      console.log('[StripeExpress] Initial intent response:', data);
    } catch (err) {
      console.error('[StripeExpress] Initial intent error:', err);
      error.value = 'Failed to initialize payment intent.';
      loading.value = false;
      return;
    }

    clientSecret.value = data?.ClientSecret;

    if (!clientSecret.value) {
      console.warn('[StripeExpress] No client secret returned from intent.');
      loading.value = false;
      return;
    }

    // Use clientSecret mode — the PaymentIntent lives on the server
    // and elements.fetchUpdates() will re-fetch the real amount
    elements.value = stripe.value.elements({
      clientSecret: clientSecret.value,
      locale: locale.value ?? 'fr',
    });

    // Create the express checkout element
    const expressOptions: any = {
      paymentMethodOrder: ['apple_pay', 'google_pay'],
      layout: {
        maxColumns: 2,
        maxRows: 0,
        overflow: 'never',
      },
      buttonHeight: 48,
      buttonType: {
        applePay: 'plain',
        googlePay: 'plain',
      },
      buttonTheme: {
        applePay: 'black',
        googlePay: 'black',
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: !isDigitalOnly.value,
      emailRequired: true,
      phoneNumberRequired: true,
      shippingAddressRequired: !isDigitalOnly.value,
    };

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
      isEmpty.value =
        !ev.availablePaymentMethods ||
        Object.values(ev.availablePaymentMethods).every(
          (v: any) => v === false
        );

      if (
        !ev.availablePaymentMethods?.googlePay &&
        !ev.availablePaymentMethods?.applePay
      ) {
        console.warn(
          '[StripeExpress] No wallet payment methods available — may be forced via "always"'
        );
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

    // Shipping events
    expressCheckoutElement.value.on(
      'shippingaddresschange',
      handleShippingAddressChange
    );
    expressCheckoutElement.value.on(
      'shippingratechange',
      handleShippingRateChange
    );

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
  <div class="stripe-express-form" :class="{ 'mb-5': !isEmpty }">
    <div
      v-if="error"
      class="bg-red-50 text-red-600 p-3 mb-3 text-sm rounded border border-red-200"
    >
      {{ error }}
    </div>

    <div v-loading="loading">
      <div v-show="stripe && !isEmpty">
        <div class="text-center mb-2 text-[#737373] text-[15px] font-medium">
          {{ $t('Paiement express') }}
        </div>
        <div id="express-checkout-element"></div>
        <div
          class="text-center mt-2 text-[#737373] text-[15px] font-medium uppercase"
        >
          {{ $t('OU') }}
        </div>
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
