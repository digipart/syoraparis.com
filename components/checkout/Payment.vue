<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const {
  checkoutCustomer,
  checkoutPaymentMethods,
  refreshPaymentMethodsTrigger,
} = toRefs(checkoutStore);
const appStore = useAppStore();
const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const loading = ref<boolean>(false);

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

const fetchPaymentMethods = async () => {
  loading.value = true;
  const ip = useIp();
  let options: any = {
    IP: ip.value,
  };
  if (checkoutCustomer.value?.deliveryAddress.postalCode) {
    options = {
      Postcode: checkoutCustomer.value?.deliveryAddress.postalCode,
      City: checkoutCustomer.value?.deliveryAddress.city,
      Address1:
        checkoutCustomer.value?.deliveryAddress.address ||
        checkoutCustomer.value?.deliveryAddress.city,
      Country: checkoutCustomer.value?.deliveryAddress.country,
    };
  }
  try {
    await checkoutStore.fetchPaymentMethods(options);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => cart.value,
  () => {
    fetchPaymentMethods();
    console.log('cart.value', cart.value);
  }
);

fetchPaymentMethods();
</script>

<template>
  <div :key="refreshPaymentMethodsTrigger">
    <h2 class="checkout-title">{{ $t('titles.payment') }} :</h2>
    <div v-if="loading" class="h-20 flex items-center justify-center">
      <IconProgress :size="2" class="loadingPage-spinner" />
    </div>
    <BaseCollapsible
      v-else-if="checkoutPaymentMethods.length > 0"
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
              ['creditcard', 'klarna', 'applepay', 'googlepay'].includes(
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
              <FormPaymentStripeExpress
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'stripe' &&
                  ['applepay', 'googlepay'].includes(
                    pm.PaymentCode?.toLowerCase() || ''
                  )
                "
                :paymentMethod="pm"
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
    <div v-else>
      <BaseAlert type="warning" :closeButton="false" fill>
        <template #icon>
          <IconDeliveryTruckSpeed :size="2" />
        </template>
        <span class="text-sm">
          {{ $t('label.provide_address_to_see_payment') }}
        </span>
      </BaseAlert>
    </div>
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
