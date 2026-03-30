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

const ip = useIp();

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
    .map((promo) => promo.Code)
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
      IP: ip.value,
    };
  }

  return {
    IP: ip.value,
  };
};

const fetchPaymentMethodsNow = async (attempt = 0) => {
  await refreshPaymentMethods(buildPaymentOptions()).catch(() => {
    // keep checkout usable if payment methods endpoint fails
  });

  if (
    checkoutPaymentMethods.value.length === 0 &&
    isReadyForPayment.value &&
    attempt < 2
  ) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await fetchPaymentMethodsNow(attempt + 1);
    return;
  }

  scheduleRefreshPaymentMethods(0);
};

onMounted(async () => {
  if (!isReadyForPayment.value) {
    return;
  }

  await fetchPaymentMethodsNow();
});

watch(
  () => ({
    ready: isReadyForPayment.value,
    address: checkoutCustomer.value.deliveryAddress.address,
    postalCode: checkoutCustomer.value.deliveryAddress.postalCode,
    city: checkoutCustomer.value.deliveryAddress.city,
    country: checkoutCustomer.value.deliveryAddress.country,
    carrierId:
      carrier.value?.IdCarrier || checkoutCarrier.value.carrier?.IdCarrier || 0,
  }),
  async ({ ready }) => {
    if (!ready) {
      return;
    }

    await fetchPaymentMethodsNow();
  },
  { immediate: true, deep: true }
);
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
