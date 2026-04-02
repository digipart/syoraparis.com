<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutPaymentMethods } = toRefs(checkoutStore);
const appStore = useAppStore();
const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const getPaymentImage = (paymenName?: string) => {
  switch (paymenName?.toLowerCase()) {
    case 'creditcard':
      return '/assets/images/visa-mastercard-logo.png';
    case 'paypal':
      return '/assets/images/paypal-logo.png';
    case 'applepay':
      return '/assets/images/apple-pay.svg';
    case 'googlepay':
      return '/assets/images/google-pay.svg';
    case 'alma':
      return '/assets/images/alma-logo.svg';
    case 'klarna':
      return '/assets/images/klarna-logo.svg';
  }

  return undefined;
};

const config = useRuntimeConfig();

const count = ref(0);

const fetchPaymentMethods = async () => {
  await checkoutStore.fetchPaymentMethods({
    Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
    City: checkoutCustomer.value.deliveryAddress.city,
    Address1: checkoutCustomer.value.deliveryAddress.address,
    Country: checkoutCustomer.value.deliveryAddress.country,
  });
};

watch(
  () => cart.value,
  () => {
    fetchPaymentMethods();
    count.value++;
    console.log('cart.value', cart.value, count.value);
  }
);

fetchPaymentMethods();
</script>

<template>
  <div :key="count">
    <h2 class="checkout-title">{{ $t('titles.payment') }} :</h2>
    <BaseCollapsible
      v-if="checkoutPaymentMethods.length > 0"
      :index-active="[1]"
      class="formPayment"
    >
      <template v-for="(pm, index) in checkoutPaymentMethods">
        <BaseCollapsibleItem
          v-if="
            (pm.PaymentProvider?.toLowerCase() === 'mollie' &&
              ['creditcard', 'paypal', 'applepay', 'googlepay'].includes(
                pm.PaymentCode?.toLowerCase() || ''
              )) ||
            (pm.PaymentProvider?.toLowerCase() === 'payzen' &&
              pm.PaymentCode?.toLowerCase() === 'creditcard') ||
            (pm.PaymentProvider?.toLowerCase() === 'stripe' &&
              ['creditcard', 'klarna'].includes(
                pm.PaymentCode?.toLowerCase() || ''
              )) ||
            (pm.PaymentProvider?.toLowerCase() === 'paypal' &&
              pm.PaymentCode?.toLowerCase() === 'paypal')
          "
          :index="index + 1"
          :closeOthers="true"
          :hideArrow="true"
          :key="pm.PaymentCode"
        >
          <template #header>
            <div class="flex justify-between w-full items-center">
              <div class="flex flex-col text-xs">
                <span class="uppercase font-normal">
                  {{ pm?.PaymentName }}
                </span>
                <span class="font-light"> {{ pm.PaymentDescription }} </span>
              </div>
              <div>
                <img
                  v-if="getPaymentImage(pm.PaymentCode)"
                  :src="getPaymentImage(pm.PaymentCode)"
                  :alt="pm.PaymentName"
                  class="h-5"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div class="p-5">
              <!-- Mollie -->
              <FormPaymentMollieBankcards
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'creditcard'
                "
                :paymentMethod="pm"
              />
              <FormPaymentMolliePaypal
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'paypal'
                "
                :paymentMethod="pm"
              />
              <FormPaymentMollieApplePay
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'applepay'
                "
                :paymentMethod="pm"
              />
              <FormPaymentMollieGooglePay
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'googlepay'
                "
                :paymentMethod="pm"
              />

              <!-- PAYZEN -->
              <FormPaymentPayzenBankcards
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'payzen' &&
                  pm.PaymentCode?.toLowerCase() === 'creditcard'
                "
                :paymentMethod="pm"
              />

              <!-- Strip -->
              <FormPaymentStripe
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'stripe' &&
                  pm.PaymentCode?.toLowerCase() === 'creditcard'
                "
                :paymentMethod="pm"
                form-type="card"
              />
              <FormPaymentStripe
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'stripe' &&
                  pm.PaymentCode?.toLowerCase() === 'klarna'
                "
                :paymentMethod="pm"
                form-type="klarna"
              />
              <!-- Paypal -->
              <FormPaymentPaypal
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'paypal' &&
                  pm.PaymentCode?.toLowerCase() === 'paypal'
                "
                :paymentMethod="pm"
                form-type="paypal"
              />
            </div>
          </template>
        </BaseCollapsibleItem>
      </template>
    </BaseCollapsible>
  </div>
</template>

<style lang="scss">
.formPayment {
  @apply bg-white;
  .collap-item {
    @apply border border-gray-200;
    .header {
      @apply border-gray-200;
    }
  }
}
</style>
