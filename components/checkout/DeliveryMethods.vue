<script setup lang="ts">
import PaymentService from '~/services/PaymentService';
import type { RelayPointType } from '~/types/RelayPointsType';

const checkoutStore = useCheckoutStore();
const {
  checkoutDeliveryOption,
  hasAddressDelivery,
  checkoutCustomer,
  checkoutCarrier,
  hasSameAddressForShipping,
  checkoutPaymentMethods,
} = toRefs(checkoutStore);
const { refreshPaymentMethods, scheduleRefreshPaymentMethods } = checkoutStore;

const shippingStore = useShippingStore();
const {
  carrier: allCarriers,
  carriers: shippingCarriers,
  relayPointSelected,
  relayPoints,
} = toRefs(shippingStore);
const { fetchShipping, fetchRelayPoints } = shippingStore;

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const cartStore = useCartStore();
const { removeCarrier, updateShipping } = cartStore;
const {
  carrier: carrierSelected,
  cart,
  cartId,
  isDigitalOnly,
} = toRefs(cartStore);

const isDrawerOpen = ref(false);
const relayPointDrawerVisible = ref(false);
const drawerType = ref<'Home' | 'RelayPoint' | 'Store'>('Home');
const loading = ref(false);
const ip = useIp();
const reloadTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const lastAddressKey = ref('');
const reloadRequestId = ref(0);
const { locale } = useI18n();
const paymentService = new PaymentService();

const isLatestReloadRequest = (requestId?: number) => {
  if (!requestId) {
    return true;
  }

  return requestId === reloadRequestId.value;
};

const options = computed(() =>
  [
    {
      id: 'home',
      type: 'Home',
      label: 'tunnel.delivery.home',
      icon: resolveComponent('IconHome'),
      visible: shippingCarriers.value.includes('Home'),
    },
    {
      id: 'relayPoint',
      type: 'RelayPoint',
      label: 'tunnel.delivery.relayPoint',
      icon: resolveComponent('IconLocation'),
      visible: shippingCarriers.value.includes('RelayPoint'),
    },
    {
      id: 'store',
      type: 'Store',
      label: 'tunnel.delivery.store',
      icon: resolveComponent('IconShop'),
      visible: shippingCarriers.value.includes('Store'),
    },
  ].filter((o) => o.visible)
);

const setDelivredOption = async (
  optionType: 'home' | 'relayPoint' | 'store'
) => {
  const shouldSelect =
    checkoutDeliveryOption.value !== optionType || !carrierSelected.value;

  if (!shouldSelect) {
    return;
  }

  loading.value = true;
  checkoutDeliveryOption.value = optionType;

  try {
    if (!cartId.value) {
      await cartStore.fetchCart();
    }

    if (!cartId.value) {
      return;
    }

    const delivery = checkoutCustomer.value.deliveryAddress;
    const shippingOptions = {
      Postcode: delivery.postalCode,
      City: delivery.city,
      Address1: delivery.address,
      Country: normalizeCountryIso(delivery.country),
      IP: (ip.value as string) || '',
    };

    const carrierType = mapOptionToCarrierType(optionType);
    if (!allCarriers.value[carrierType]?.length && delivery.address) {
      await fetchShipping(shippingOptions);
    }

    await selectFirstCarrierForType(carrierType, shippingOptions);
    await loadPaymentMethods();
  } finally {
    loading.value = false;
  }
};

const openDrawer = (type: any) => {
  drawerType.value = type;
  isDrawerOpen.value = true;
};

const openRelayPointDrawer = () => {
  relayPointDrawerVisible.value = true;
};

const onRelayPointSelected = async (rpId: string) => {
  if (!rpId || !carrierSelected.value?.IdCarrier) {
    return;
  }

  loading.value = true;
  try {
    await updateShipping({
      idCarrier: carrierSelected.value.IdCarrier,
      IdRelayPoint: rpId,
    });
    await cartStore.fetchCart();
    checkoutCarrier.value.carrier = cart.value.Shipping?.Carrier || null;

    const rpSelected =
      (relayPoints.value as RelayPointType[]).find((rp) => rp.Id === rpId) ||
      null;
    relayPointSelected.value = rpSelected;
    checkoutCarrier.value.relayPoint = rpSelected;
    await loadPaymentMethods();
  } finally {
    loading.value = false;
  }
};

const getCarrierImage = (carrier: any) => {
  if (!carrier?.Name) return '';
  if (carrier.Name.includes('Colissimo'))
    return '/assets/images/colissimo-logo.png';
  if (carrier.Name.includes('DHL')) return '/assets/images/dhl-logo.png';
  if (carrier.Name.includes('GLS')) return '/assets/images/gls-logo.svg';
  if (carrier.Name.includes('Chronopost'))
    return '/assets/images/chronopost-logo.png';
  if (carrier.Name.includes('UPS')) return '/assets/images/ups-logo.svg';
  return '';
};

const estimatedDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString(locale.value);
});

const nearbyRelayCount = computed(() => {
  if (!relayPoints.value?.length) {
    return 0;
  }

  return Math.max(relayPoints.value.length - 1, 0);
});

const mapCarrierTypeToOption = (carrierType: string) => {
  if (carrierType === 'Home') return 'home';
  if (carrierType === 'RelayPoint') return 'relayPoint';
  if (carrierType === 'Store') return 'store';
  return 'home';
};

const normalizeCountryIso = (countryValue?: string) => {
  const country = (countryValue || '').trim();
  if (!country) {
    return '';
  }

  if (country.length === 2) {
    return country;
  }

  const countryByName = countries.value.find(
    (entry) =>
      entry.CountryName?.toLowerCase() === country.toLowerCase() ||
      entry.CountryIsoCode?.toLowerCase() === country.toLowerCase()
  );

  return countryByName?.CountryIsoCode || country;
};

const mapOptionToCarrierType = (
  optionType: 'home' | 'relayPoint' | 'store'
): 'Home' | 'RelayPoint' | 'Store' => {
  if (optionType === 'relayPoint') return 'RelayPoint';
  if (optionType === 'store') return 'Store';
  return 'Home';
};

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
      Country: normalizeCountryIso(delivery.country),
      IP: ip.value,
    };
  }

  return { IP: ip.value as string };
};

const loadPaymentMethods = async () => {
  const paymentOptions = buildPaymentOptions();

  try {
    const data = await paymentService.paymentMethods({
      ...paymentOptions,
      LanguageIsoCode: locale.value,
    });
    checkoutPaymentMethods.value = data.PaymentMethods || [];
  } catch (_error) {
    await refreshPaymentMethods(paymentOptions).catch(() => {
      // keep checkout usable if payment endpoint fails
    });
  }

  if (checkoutPaymentMethods.value.length === 0) {
    await refreshPaymentMethods(paymentOptions).catch(() => {
      // keep checkout usable if payment endpoint fails
    });
  }

  scheduleRefreshPaymentMethods(0);
};

const selectFirstCarrierForType = async (
  carrierType: 'Home' | 'RelayPoint' | 'Store',
  shippingOptions: {
    Postcode: string;
    City: string;
    Address1: string;
    Country: string;
    IP: string;
  },
  requestId?: number
) => {
  if (!isLatestReloadRequest(requestId)) {
    return;
  }

  const firstCarrier = allCarriers.value[carrierType]?.[0];

  if (!firstCarrier?.IdCarrier) {
    if (carrierSelected.value?.IdCarrier || checkoutCarrier.value.carrier?.IdCarrier) {
      return;
    }

    if (!isLatestReloadRequest(requestId)) {
      return;
    }

    await updateShipping({ idCarrier: 0 });
    removeCarrier();
    relayPointSelected.value = null;
    checkoutCarrier.value.carrier = null;
    checkoutCarrier.value.relayPoint = null;
    return;
  }

  const updateOptions: { idCarrier: number; IdRelayPoint?: string } = {
    idCarrier: firstCarrier.IdCarrier,
  };

  if (carrierType === 'RelayPoint' || carrierType === 'Store') {
    const relayPoints = await fetchRelayPoints({
      ...shippingOptions,
      IdCarrier: firstCarrier.IdCarrier,
    });

    if (!isLatestReloadRequest(requestId)) {
      return;
    }

    const firstRelayPoint = relayPoints?.[0];
    if (firstRelayPoint?.Id) {
      updateOptions.IdRelayPoint = firstRelayPoint.Id;
      relayPointSelected.value = firstRelayPoint;
      checkoutCarrier.value.relayPoint = firstRelayPoint;
    }
  } else {
    relayPointSelected.value = null;
    checkoutCarrier.value.relayPoint = null;
  }

  if (!isLatestReloadRequest(requestId)) {
    return;
  }

  await updateShipping(updateOptions);

  if (!isLatestReloadRequest(requestId)) {
    return;
  }

  await cartStore.fetchCart();

  if (!isLatestReloadRequest(requestId)) {
    return;
  }

  checkoutCarrier.value.carrier = cart.value.Shipping?.Carrier || null;
};

const reloadShippingAndAutoSelectFirst = async () => {
  const requestId = ++reloadRequestId.value;

  const delivery = checkoutCustomer.value.deliveryAddress;
  if (
    !delivery.address ||
    !delivery.postalCode ||
    !delivery.city ||
    !delivery.country
  ) {
    return;
  }

  const requestKey = [
    delivery.address,
    delivery.postalCode,
    delivery.city,
    delivery.country,
  ].join('|');

  const hasSelectedCarrier =
    !!carrierSelected.value?.IdCarrier || !!checkoutCarrier.value.carrier?.IdCarrier;

  if (requestKey === lastAddressKey.value && hasSelectedCarrier) {
    await loadPaymentMethods();
    return;
  }

  lastAddressKey.value = requestKey;
  loading.value = true;

  try {
    if (!cartId.value) {
      await cartStore.fetchCart();
    }

    if (!cartId.value) {
      return;
    }

    const options = {
      Postcode: delivery.postalCode,
      City: delivery.city,
      Address1: delivery.address,
      Country: normalizeCountryIso(delivery.country),
      IP: (ip.value as string) || '',
    };

    await fetchShipping(options);

    if (!isLatestReloadRequest(requestId)) {
      return;
    }

    const availableCarrierTypes = shippingCarriers.value || [];
    if (!availableCarrierTypes.length) {
      if (hasSelectedCarrier) {
        return;
      }

      if (!isLatestReloadRequest(requestId)) {
        return;
      }

      await updateShipping({ idCarrier: 0 });
      removeCarrier();
      checkoutCarrier.value.carrier = null;
      checkoutCarrier.value.relayPoint = null;
      relayPointSelected.value = null;
      return;
    }

    const targetCarrierType = availableCarrierTypes[0] as
      | 'Home'
      | 'RelayPoint'
      | 'Store';

    checkoutDeliveryOption.value = mapCarrierTypeToOption(targetCarrierType) as
      | 'home'
      | 'relayPoint'
      | 'store';

    await selectFirstCarrierForType(targetCarrierType, options, requestId);

    if (!isLatestReloadRequest(requestId)) {
      return;
    }

    await loadPaymentMethods();
  } finally {
    if (isLatestReloadRequest(requestId)) {
      loading.value = false;
    }
  }
};

const shouldFetchPaymentMethods = computed(() => {
  const delivery = checkoutCustomer.value.deliveryAddress;
  const hasAddress =
    !!delivery.address &&
    !!delivery.postalCode &&
    !!delivery.city &&
    !!delivery.country;
  const hasCarrier =
    !!carrierSelected.value?.IdCarrier ||
    !!checkoutCarrier.value.carrier?.IdCarrier;

  return (
    !!cart.value?.Products?.length &&
    hasAddress &&
    (isDigitalOnly.value || hasCarrier)
  );
});

const ensureInitialPaymentMethods = async () => {
  if (!shouldFetchPaymentMethods.value) {
    return;
  }

  await loadPaymentMethods();

  if (checkoutPaymentMethods.value.length > 0) {
    return;
  }

  lastAddressKey.value = '';
  await reloadShippingAndAutoSelectFirst();
};

watch(
  () => ({
    dAddress: checkoutCustomer.value.deliveryAddress.address,
    dPostalCode: checkoutCustomer.value.deliveryAddress.postalCode,
    dCity: checkoutCustomer.value.deliveryAddress.city,
    dCountry: checkoutCustomer.value.deliveryAddress.country,
    iAddress: checkoutCustomer.value.invoiceAddress.address,
    iPostalCode: checkoutCustomer.value.invoiceAddress.postalCode,
    iCity: checkoutCustomer.value.invoiceAddress.city,
    iCountry: checkoutCustomer.value.invoiceAddress.country,
    same: hasSameAddressForShipping.value,
  }),
  () => {
    if (reloadTimer.value) {
      clearTimeout(reloadTimer.value);
    }
    reloadTimer.value = setTimeout(() => {
      reloadShippingAndAutoSelectFirst();
    }, 250);
  },
  { deep: true, immediate: true }
);

onBeforeUnmount(() => {
  if (reloadTimer.value) {
    clearTimeout(reloadTimer.value);
  }
});

onMounted(async () => {
  await ensureInitialPaymentMethods();
});

watch(
  () => ({
    shouldFetch: shouldFetchPaymentMethods.value,
    paymentCount: checkoutPaymentMethods.value.length,
    carrierId:
      carrierSelected.value?.IdCarrier ||
      checkoutCarrier.value.carrier?.IdCarrier ||
      0,
  }),
  async ({ shouldFetch, paymentCount }) => {
    if (!shouldFetch || paymentCount > 0) {
      return;
    }

    await loadPaymentMethods();
  },
  { immediate: true }
);
</script>

<template>
  <div v-loading="loading">
    <div v-if="hasAddressDelivery" class="delivery-selection-container">
      <div class="delivery-accordion">
        <div
          v-for="opt in options"
          :key="opt.id"
          class="delivery-group"
          :class="{ 'is-active': checkoutDeliveryOption === opt.id }"
        >
          <div
            class="delivery-group__header"
            @click="setDelivredOption(opt.id as any)"
          >
            <div class="flex items-center gap-3">
              <div
                class="radio-dot"
                :class="{
                  'radio-dot--active': checkoutDeliveryOption === opt.id,
                }"
              >
                <div
                  v-if="checkoutDeliveryOption === opt.id"
                  class="radio-dot__inner"
                />
              </div>
              <span class="text-sm font-medium">{{ $t(opt.label) }}</span>
            </div>
            <component :is="opt.icon" :size="1.8" class="text-zinc-600" />
          </div>

          <transition name="slide-down">
            <div
              v-if="checkoutDeliveryOption === opt.id"
              class="delivery-group__content"
            >
              <div v-if="carrierSelected" class="selected-carrier-card">
                <div class="carrier-info">
                  <div class="carrier-logo-wrapper">
                    <NuxtImg
                      v-if="getCarrierImage(carrierSelected)"
                      :src="getCarrierImage(carrierSelected)"
                      height="32"
                      class="object-contain"
                    />
                    <div v-else class="text-[10px] text-zinc-400 uppercase">
                      {{ $t('label.logo') }}
                    </div>
                  </div>
                  <div class="carrier-details">
                    <div class="carrier-name">{{ carrierSelected.Name }}</div>
                    <div class="carrier-mode-label">
                      {{ $t(opt.label) }}
                    </div>
                  </div>
                  <div class="carrier-status-eta text-right px-4">
                    <div class="carrier-price">
                      {{
                        carrierSelected.Price?.TaxIncl === 0
                          ? $t('label.free_delivery')
                          : `${carrierSelected.Price?.TaxIncl?.toFixed(2)} EUR`
                      }}
                    </div>
                    <div class="carrier-eta">
                      {{ $t('label.estimated_delivery') }} : {{ estimatedDate }}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="modifier-btn-gray"
                    @click.stop="openDrawer(opt.type)"
                  >
                    {{ $t('button.modify') }}
                  </button>
                </div>

                <div
                  v-if="opt.id === 'relayPoint' && relayPointSelected"
                  class="relay-info-box mt-3"
                >
                  <div class="relay-info-main">
                    <div class="relay-info-left">
                      <div class="relay-name">
                        {{ relayPointSelected.Name }}
                      </div>
                      <div class="relay-address">
                        {{ relayPointSelected.Address1 }}
                      </div>
                      <div class="relay-address">
                        {{ relayPointSelected.Postcode }}
                        {{ relayPointSelected.City }}
                      </div>
                      <div
                        v-if="relayPointSelected.Location?.DistanceFromAddress"
                        class="relay-distance"
                      >
                        {{ relayPointSelected.Location?.DistanceFromAddress }} m
                      </div>
                    </div>
                    <div class="relay-info-right">
                      <span
                        v-if="relayPointSelected?.OpeningHours"
                        class="font-normal"
                      >
                        <CardShippingRelayPointSchedules
                          :relayPointSelected="relayPointSelected"
                        />
                      </span>
                      <div class="relay-nearby mb-3">
                        {{
                          $t('label.relay_points_nearby', {
                            count: nearbyRelayCount,
                          })
                        }}
                      </div>
                      <a
                        href="#"
                        class="relay-link"
                        @click.prevent.stop="openRelayPointDrawer"
                      >
                        {{ $t('button.choose_another_relay_point') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-2">
                <BaseButton
                  type="primary"
                  plain
                  @click.stop="openDrawer(opt.type)"
                >
                  {{ $t('label.choose_carrier') }}
                </BaseButton>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <BaseDrawer v-model="isDrawerOpen" position="right" size="500px">
        <template #header>
          <span class="uppercase font-bold tracking-wider">{{
            $t('label.select_delivery_mode')
          }}</span>
        </template>
        <div class="p-1">
          <FormShipping
            :displayOptions="drawerType"
            :autoLoad="false"
            @onSelect="isDrawerOpen = false"
          />
        </div>
      </BaseDrawer>

      <CardShippingRelayPointDrawer
        v-model="relayPointDrawerVisible"
        :carrierSelected="carrierSelected || undefined"
        @onSelectPointRelay="onRelayPointSelected"
      />
    </div>

    <div v-else class="mt-4">
      <BaseAlert type="warning" :closeButton="false" fill>
        <template #icon>
          <IconDeliveryTruckSpeed :size="2" />
        </template>
        <span class="text-sm">
          {{ $t('label.provide_address_to_see_shipping') }}
        </span>
      </BaseAlert>
    </div>
  </div>
</template>

<style scoped lang="scss">
.delivery-accordion {
  @apply border border-zinc-200 rounded-sm overflow-hidden;
}

.delivery-group {
  @apply border-b border-zinc-200 last:border-b-0;

  &__header {
    @apply flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-zinc-50 transition-colors bg-white;
  }

  &__content {
    @apply border-t border-zinc-100 p-3 bg-white;
  }

  &.is-active {
    .delivery-group__header {
      @apply bg-white;
    }
  }
}

.radio-dot {
  @apply w-4 h-4 rounded-full border border-zinc-300 flex items-center justify-center flex-shrink-0 transition-colors;
  &--active {
    @apply border-black;
  }
  &__inner {
    @apply w-2 h-2 rounded-full bg-black;
  }
}

.selected-carrier-card {
  @apply border border-zinc-200 rounded-sm p-3 bg-zinc-50;

  .carrier-info {
    @apply flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4;
  }

  .carrier-logo-wrapper {
    @apply bg-white border border-zinc-100 rounded-sm p-0.5 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center flex-shrink-0;
  }

  .carrier-details {
    @apply flex-1 min-w-0 pl-2 sm:pl-6;
    .carrier-name {
      @apply font-bold text-xs sm:text-sm;
    }
    .carrier-mode-label {
      @apply text-zinc-500 text-[10px] sm:text-xs;
    }
  }

  .carrier-status-eta {
    @apply text-right px-2 sm:px-4;
    .carrier-price {
      @apply font-bold text-xs sm:text-sm mb-0.5;
    }
    .carrier-eta {
      @apply text-zinc-500 text-[9px] sm:text-[10px];
    }
  }

  .modifier-btn-gray {
    @apply bg-zinc-200 text-black px-4 py-2 text-xs sm:text-sm font-semibold rounded-sm hover:bg-zinc-300 transition-colors h-10 w-full sm:w-24 mt-3 sm:mt-0 flex items-center justify-center flex-shrink-0;
  }
}

.relay-info-box {
  @apply border border-zinc-200 bg-white p-2 sm:p-3;
}

.relay-info-main {
  @apply flex items-start justify-between gap-2 sm:gap-4;
}

.relay-info-left {
  @apply text-[10px] sm:text-xs text-zinc-600;
}

.relay-name {
  @apply text-xs sm:text-sm font-medium text-zinc-800 uppercase;
}

.relay-address {
  @apply mt-0.5;
}

.relay-distance {
  @apply mt-1 text-zinc-500;
}

.relay-info-right {
  @apply text-right text-[10px] sm:text-xs text-zinc-600 flex flex-col;
}

.relay-nearby {
  @apply mt-2;
}

.relay-link {
  @apply underline text-xs text-zinc-700 hover:text-black transition-colors;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 600px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
