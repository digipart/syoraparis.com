<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const { checkoutCustomer, hasSameAddressForShipping } = toRefs(checkoutStore);
const { scheduleRefreshPaymentMethods } = checkoutStore;

const cartStore = useCartStore();
const { isDigitalOnly } = toRefs(cartStore);

const formDeliveryStore = useFormDeliveryStore();
const { state } = toRefs(formDeliveryStore);

const formInvoiceStore = useFormInvoiceStore();
const { state: invoiceState } = toRefs(formInvoiceStore);

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
    checkoutCustomer.value.invoiceAddress.firstname = invoiceState.value.firstname;
    checkoutCustomer.value.invoiceAddress.lastname = invoiceState.value.name;
    checkoutCustomer.value.invoiceAddress.address = invoiceState.value.address;
    checkoutCustomer.value.invoiceAddress.city = invoiceState.value.city;
    checkoutCustomer.value.invoiceAddress.phone = invoiceState.value.phone;
    checkoutCustomer.value.invoiceAddress.postalCode = invoiceState.value.postcode;
    checkoutCustomer.value.invoiceAddress.country = invoiceState.value.country;
    checkoutCustomer.value.invoiceAddress.company = invoiceState.value.company;
    checkoutCustomer.value.invoiceAddress.state = invoiceState.value.state;
  }
};

onMounted(() => {
  hasSameAddressForShipping.value = true;
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
</script>

<template>
  <div class="space-y-4">
    <div class="border border-zinc-200 p-4 bg-white">
      <CheckoutGuestContact />
    </div>

    <div class="border border-zinc-200 p-4 bg-white">
      <PageCheckoutGuestDeliveryAddress />
    </div>

    <div v-if="!isDigitalOnly" class="border border-zinc-200 p-4 bg-white">
      <InputCheckBox id="same_address_for_shipping" v-model="hasSameAddressForShipping">
        <span class="text-sm">{{ $t('label.use_different_billing_address') }}</span>
      </InputCheckBox>

      <transition name="slide">
        <div v-if="!hasSameAddressForShipping" class="mt-5 pt-5 border-t border-zinc-100">
          <PageCheckoutGuestBillingAddress />
        </div>
      </transition>
    </div>

    <div v-if="!isDigitalOnly" class="border border-zinc-200 p-4 bg-white">
      <h2 class="font-semibold text-sm uppercase mb-4">
        {{ $t('label.select_delivery_mode') }} :
      </h2>
      <CheckoutDeliveryMethods />
    </div>

    <div class="border border-zinc-200 p-4 bg-white">
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
