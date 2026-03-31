<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutDeliveryOption, hasSameAddressForShipping } =
  toRefs(checkoutStore);
const { scheduleRefreshPaymentMethods } = checkoutStore;

const cartStore = useCartStore();
const { isDigitalOnly } = toRefs(cartStore);

const formDeliveryStore = useFormDeliveryStore();
const { state } = toRefs(formDeliveryStore);

const formInvoiceStore = useFormInvoiceStore();
const { state: invoiceState } = toRefs(formInvoiceStore);

const authStore = useAuth();
const { isLoggedIn, isGuest } = toRefs(authStore);

const GUEST_CHECKOUT_STORAGE_KEY = 'syora_checkout_guest_data';

const syncCheckoutCustomerFromForms = () => {
  checkoutCustomer.value.deliveryAddress.firstname = state.value.firstname;
  checkoutCustomer.value.deliveryAddress.lastname = state.value.name;
  checkoutCustomer.value.deliveryAddress.email = state.value.email;
  checkoutCustomer.value.deliveryAddress.address = state.value.address;
  checkoutCustomer.value.deliveryAddress.city = state.value.city;
  checkoutCustomer.value.deliveryAddress.phone = state.value.phone;
  checkoutCustomer.value.deliveryAddress.postalCode = state.value.postcode;
  checkoutCustomer.value.deliveryAddress.country = state.value.country;
  checkoutCustomer.value.deliveryAddress.company = state.value.company;
  checkoutCustomer.value.deliveryAddress.state = state.value.state;

  if (hasSameAddressForShipping.value) {
    checkoutCustomer.value.invoiceAddress.firstname = state.value.firstname;
    checkoutCustomer.value.invoiceAddress.lastname = state.value.name;
    checkoutCustomer.value.invoiceAddress.address = state.value.address;
    checkoutCustomer.value.invoiceAddress.city = state.value.city;
    checkoutCustomer.value.invoiceAddress.phone = state.value.phone;
    checkoutCustomer.value.invoiceAddress.postalCode = state.value.postcode;
    checkoutCustomer.value.invoiceAddress.country = state.value.country;
    checkoutCustomer.value.invoiceAddress.company = state.value.company;
    checkoutCustomer.value.invoiceAddress.state = state.value.state;
  } else {
    checkoutCustomer.value.invoiceAddress.firstname =
      invoiceState.value.firstname;
    checkoutCustomer.value.invoiceAddress.lastname = invoiceState.value.name;
    checkoutCustomer.value.invoiceAddress.address = invoiceState.value.address;
    checkoutCustomer.value.invoiceAddress.city = invoiceState.value.city;
    checkoutCustomer.value.invoiceAddress.phone = invoiceState.value.phone;
    checkoutCustomer.value.invoiceAddress.postalCode =
      invoiceState.value.postcode;
    checkoutCustomer.value.invoiceAddress.country = invoiceState.value.country;
    checkoutCustomer.value.invoiceAddress.company = invoiceState.value.company;
    checkoutCustomer.value.invoiceAddress.state = invoiceState.value.state;
  }
};

const persistGuestCheckout = () => {
  if (!process.client) {
    return;
  }

  const payload = {
    deliveryState: { ...state.value },
    invoiceState: { ...invoiceState.value },
    hasSameAddressForShipping: hasSameAddressForShipping.value,
    checkoutDeliveryOption: checkoutDeliveryOption.value,
  };

  localStorage.setItem(GUEST_CHECKOUT_STORAGE_KEY, JSON.stringify(payload));
};

const hydrateGuestCheckout = () => {
  if (!process.client) {
    return;
  }

  const rawValue = localStorage.getItem(GUEST_CHECKOUT_STORAGE_KEY);
  if (!rawValue) {
    return;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (parsed?.deliveryState) {
      Object.assign(state.value, parsed.deliveryState);
    }

    if (parsed?.invoiceState) {
      Object.assign(invoiceState.value, parsed.invoiceState);
    }

    if (typeof parsed?.hasSameAddressForShipping === 'boolean') {
      hasSameAddressForShipping.value = parsed.hasSameAddressForShipping;
    }

    if (
      parsed?.checkoutDeliveryOption === 'home' ||
      parsed?.checkoutDeliveryOption === 'relayPoint' ||
      parsed?.checkoutDeliveryOption === 'store'
    ) {
      checkoutDeliveryOption.value = parsed.checkoutDeliveryOption;
    }

    syncCheckoutCustomerFromForms();
  } catch (_error) {
    localStorage.removeItem(GUEST_CHECKOUT_STORAGE_KEY);
  }
};

onMounted(() => {
  hydrateGuestCheckout();
  if (!state.value.email) {
    hasSameAddressForShipping.value = true;
  }
  syncCheckoutCustomerFromForms();
});

watch(
  [state, invoiceState, hasSameAddressForShipping],
  () => {
    syncCheckoutCustomerFromForms();
    scheduleRefreshPaymentMethods(0);
  },
  { deep: true }
);

watch(
  [state, invoiceState, hasSameAddressForShipping, checkoutDeliveryOption],
  () => {
    persistGuestCheckout();
  },
  { deep: true }
);

watch(
  [isLoggedIn, isGuest],
  ([loggedIn, guest]) => {
    if (process.client && loggedIn && !guest) {
      localStorage.removeItem(GUEST_CHECKOUT_STORAGE_KEY);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-4">
    <div>
      <CheckoutGuestContact />
    </div>

    <div>
      <PageCheckoutGuestDeliveryAddress />
    </div>

    <div v-if="!isDigitalOnly">
      <InputCheckBox
        id="same_address_for_shipping"
        v-model="hasSameAddressForShipping"
      >
        <span class="text-xs lg:text-sm">{{
          $t('label.use_different_billing_address')
        }}</span>
      </InputCheckBox>

      <transition name="slide">
        <div
          v-if="!hasSameAddressForShipping"
          class="mt-5 pt-5 border-t border-zinc-100"
        >
          <PageCheckoutGuestBillingAddress />
        </div>
      </transition>
    </div>

    <div v-if="!isDigitalOnly">
      <h2 class="font-semibold text-sm uppercase mb-4">
        {{ $t('label.select_delivery_mode') }} :
      </h2>
      <CheckoutDeliveryMethods />
    </div>

    <div>
      <h2 class="font-semibold text-sm uppercase mb-4">
        {{ $t('tunnel.payment.title') }} :
      </h2>
      <CheckoutPaymentMethods />
    </div>
  </div>
</template>

<style scoped lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 600px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
