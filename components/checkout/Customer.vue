<script setup lang="ts">
const cartStore = useCartStore();
const { isDigitalOnly } = toRefs(cartStore);

const addressStore = useAddressStore();
const { addresses } = toRefs(addressStore);

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, hasSameAddressForShipping } = toRefs(checkoutStore);
const { scheduleRefreshPaymentMethods } = checkoutStore;

const formDeliveryStore = useFormDeliveryStore();
const { state: deliveryState } = toRefs(formDeliveryStore);

const formInvoiceStore = useFormInvoiceStore();
const { state: invoiceState } = toRefs(formInvoiceStore);

const authStore = useAuth();
const { customer } = toRefs(authStore);

const hasSavedAddresses = computed(() => addresses.value.length > 0);

const useDifferentBillingAddress = computed({
  get: () => !hasSameAddressForShipping.value,
  set: (value: boolean) => {
    hasSameAddressForShipping.value = !value;
  },
});

const syncCheckoutCustomerFromForms = () => {
  if (!checkoutCustomer.value?.deliveryAddress || !deliveryState.value) {
    return;
  }

  checkoutCustomer.value.deliveryAddress.firstname = deliveryState.value.firstname || '';
  checkoutCustomer.value.deliveryAddress.lastname = deliveryState.value.name || '';
  checkoutCustomer.value.deliveryAddress.email =
    deliveryState.value.email || customer.value?.Email || '';
  checkoutCustomer.value.deliveryAddress.address = deliveryState.value.address || '';
  checkoutCustomer.value.deliveryAddress.city = deliveryState.value.city || '';
  checkoutCustomer.value.deliveryAddress.phone = deliveryState.value.phone || '';
  checkoutCustomer.value.deliveryAddress.postalCode = deliveryState.value.postcode || '';
  checkoutCustomer.value.deliveryAddress.country = deliveryState.value.country || '';
  checkoutCustomer.value.deliveryAddress.company = deliveryState.value.company || '';
  checkoutCustomer.value.deliveryAddress.state = deliveryState.value.state || '';

  if (hasSameAddressForShipping.value && checkoutCustomer.value.invoiceAddress) {
    checkoutCustomer.value.invoiceAddress.firstname = deliveryState.value.firstname || '';
    checkoutCustomer.value.invoiceAddress.lastname = deliveryState.value.name || '';
    checkoutCustomer.value.invoiceAddress.address = deliveryState.value.address || '';
    checkoutCustomer.value.invoiceAddress.city = deliveryState.value.city || '';
    checkoutCustomer.value.invoiceAddress.phone = deliveryState.value.phone || '';
    checkoutCustomer.value.invoiceAddress.postalCode = deliveryState.value.postcode || '';
    checkoutCustomer.value.invoiceAddress.country = deliveryState.value.country || '';
    checkoutCustomer.value.invoiceAddress.company = deliveryState.value.company || '';
    checkoutCustomer.value.invoiceAddress.state = deliveryState.value.state || '';
    return;
  }

  if (checkoutCustomer.value.invoiceAddress && invoiceState.value) {
    checkoutCustomer.value.invoiceAddress.firstname = invoiceState.value.firstname || '';
    checkoutCustomer.value.invoiceAddress.lastname = invoiceState.value.name || '';
    checkoutCustomer.value.invoiceAddress.address = invoiceState.value.address || '';
    checkoutCustomer.value.invoiceAddress.city = invoiceState.value.city || '';
    checkoutCustomer.value.invoiceAddress.phone = invoiceState.value.phone || '';
    checkoutCustomer.value.invoiceAddress.postalCode = invoiceState.value.postcode || '';
    checkoutCustomer.value.invoiceAddress.country = invoiceState.value.country || '';
    checkoutCustomer.value.invoiceAddress.company = invoiceState.value.company || '';
    checkoutCustomer.value.invoiceAddress.state = invoiceState.value.state || '';
  }
};

const hydrateEmptyFormsFromCustomer = () => {
  if (hasSavedAddresses.value) {
    return;
  }

  if (!deliveryState.value.firstname) {
    deliveryState.value.firstname = customer.value?.Firstname || '';
  }
  if (!deliveryState.value.name) {
    deliveryState.value.name = customer.value?.Lastname || '';
  }
  if (!deliveryState.value.email) {
    deliveryState.value.email = customer.value?.Email || '';
  }

  if (!invoiceState.value.firstname) {
    invoiceState.value.firstname = customer.value?.Firstname || '';
  }
  if (!invoiceState.value.name) {
    invoiceState.value.name = customer.value?.Lastname || '';
  }
};

watch(
  [deliveryState, invoiceState, hasSameAddressForShipping, hasSavedAddresses],
  () => {
    if (hasSavedAddresses.value) {
      return;
    }

    syncCheckoutCustomerFromForms();
    scheduleRefreshPaymentMethods(0);
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (!hasSavedAddresses.value) {
    hasSameAddressForShipping.value = true;
  }
  hydrateEmptyFormsFromCustomer();
  syncCheckoutCustomerFromForms();
});
</script>

<template>
  <div class="space-y-6 pb-4">
    <CheckoutAddressManager v-if="hasSavedAddresses" />

    <div v-else class="space-y-4">
      <PageCheckoutGuestDeliveryAddress />

      <div v-if="!isDigitalOnly">
        <InputCheckBox
          id="different-billing-address-connected"
          v-model="useDifferentBillingAddress"
        >
          <span class="text-xs lg:text-sm">{{
            $t('label.use_different_billing_address')
          }}</span>
        </InputCheckBox>

        <transition name="slide">
          <div
            v-if="useDifferentBillingAddress"
            class="mt-5 pt-5 border-t border-zinc-100"
          >
            <PageCheckoutGuestBillingAddress />
          </div>
        </transition>
      </div>
    </div>

    <div v-if="!isDigitalOnly" class="space-y-3">
      <h2 class="font-bold text-lg lowercase first-letter:uppercase">
        {{ $t('label.select_delivery_mode') }} :
      </h2>
      <CheckoutDeliveryMethods />
    </div>

    <div class="space-y-3">
      <h2 class="font-bold text-base lowercase first-letter:uppercase">
        {{ $t('tunnel.payment.title') }} :
      </h2>
      <CheckoutPaymentMethods />
    </div>
  </div>
</template>
