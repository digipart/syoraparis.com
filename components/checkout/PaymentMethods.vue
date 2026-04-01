<script setup lang="ts">
const cartStore = useCartStore();
const {
  cart,
  carrier,
  totalProductQuantity,
  hasUnavailableProducts,
  isDigitalOnly,
} = toRefs(cartStore);

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutCarrier, checkoutPaymentMethods } =
  toRefs(checkoutStore);
const { refreshPaymentMethods, scheduleRefreshPaymentMethods } = checkoutStore;



const props = defineProps<{
  refreshing?: boolean;
}>();

const paymentRefreshing = toRef(props, 'refreshing');

const isReadyForPayment = computed(
  () =>
    totalProductQuantity.value &&
    (isDigitalOnly.value || carrier.value || checkoutCarrier.value.carrier) &&
    !hasUnavailableProducts.value
);

  const paymentMethodsKey = computed(() => {
  const carrierId =
    carrier.value?.IdCarrier || checkoutCarrier.value.carrier?.IdCarrier || 0;
  const total = cart.value?.Total?.ToPay?.TaxIncl || 0;
  const shipping = cart.value?.Total?.Shipping?.TaxIncl || 0;
  const discount = cart.value?.Total?.Discount?.TaxIncl || 0;
  const promoCodes = (cart.value?.Discounts?.PromoCodes || [])
    .map((promo: any) => promo.Code)
    .join('|');

  return [carrierId, total, shipping, discount, promoCodes].join('::');
});

const buildPaymentOptions = () => {
  const delivery = checkoutCustomer.value.deliveryAddress;

  if (
    delivery.address &&
    delivery.postalCode &&
    delivery.city &&
    delivery.country
  ) {
    return {
      Postcode: delivery.postalCode,
      City: delivery.city,
      Address1: delivery.address,
      Country: delivery.country,
      IP: '',
    };
  }

  return {
    IP: '',
  };
};

// PaymentMethods now relies on CheckoutStore for refreshing methods
// No internal watchers or onMounted triggers needed here anymore
</script>

<template>
  <div>
    <div
      v-if="
        isReadyForPayment &&
        !paymentRefreshing &&
        checkoutPaymentMethods.length > 0
      "
    >
      <FormPayment :key="paymentMethodsKey" />
    </div>

    <BaseAlert
      v-else
      fill
      :type="hasUnavailableProducts ? 'danger' : 'default'"
      :closeButton="false"
    >
      <span class="text-sm">
        <template v-if="hasUnavailableProducts">
          {{ $t('cart.has_unavailable_products') }}
        </template>
        <template v-else>
          {{ $t('label.payment.noPayment') }}
        </template>
      </span>
      <template #icon>
        <IconPayment v-if="!hasUnavailableProducts" />
        <IconInfo v-else />
      </template>
    </BaseAlert>
  </div>
</template>
