<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';
const checkoutStore = useCheckoutStore();
const {
  checkoutDeliveryOption,
  hasAddressDelivery,
  checkoutCustomer,
  checkoutCarrier,
  hasSameAddressForShipping,
} = toRefs(checkoutStore);

const shippingStore = useShippingStore();
const {
  carrier: allCarriers,
  carriers: shippingCarriers,
  relayPointSelected,
  relayPoints,
} = toRefs(shippingStore);
const { fetchShipping, fetchRelayPoints } = shippingStore;

const cartStore = useCartStore();
const { removeCarrier, updateShipping } = cartStore;
const { carrier: carrierSelected, cart, cartId } = toRefs(cartStore);

const isDrawerOpen = ref(false);
const relayPointDrawerVisible = ref(false);
const drawerType = ref<'Home' | 'RelayPoint' | 'Store'>('Home');
const loading = ref(false);

const reloadTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const lastAddressKey = ref('');
const { locale } = useI18n();

const options = computed(() =>
  [
    {
      id: 'home',
      type: 'Home',
      label: 'tunnel.delivery.home',
      icon: 'IconHome',
      visible: shippingCarriers.value.includes('Home'),
    },
    {
      id: 'relayPoint',
      type: 'RelayPoint',
      label: 'tunnel.delivery.relayPoint',
      icon: 'IconLocation',
      visible: shippingCarriers.value.includes('RelayPoint'),
    },
    {
      id: 'store',
      type: 'Store',
      label: 'tunnel.delivery.store',
      icon: 'IconShop',
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
      Country: delivery.country,
    };

    const carrierType = mapOptionToCarrierType(optionType);
    if (!allCarriers.value[carrierType]?.length && delivery.address) {
      await fetchShipping(shippingOptions);
    }

    await selectFirstCarrierForType(carrierType, shippingOptions);
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

// Mock date or compute it
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

const getPaymentOptions = () => {
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
    };
  }

  return {};
};

const mapCarrierTypeToOption = (carrierType: string) => {
  if (carrierType === 'Home') return 'home';
  if (carrierType === 'RelayPoint') return 'relayPoint';
  if (carrierType === 'Store') return 'store';
  return 'home';
};

const mapOptionToCarrierType = (
  optionType: 'home' | 'relayPoint' | 'store'
): 'Home' | 'RelayPoint' | 'Store' => {
  if (optionType === 'relayPoint') return 'RelayPoint';
  if (optionType === 'store') return 'Store';
  return 'Home';
};

const selectFirstCarrierForType = async (
  carrierType: 'Home' | 'RelayPoint' | 'Store',
  shippingOptions: {
    Postcode: string;
    City: string;
    Address1: string;
    Country: string;
  }
) => {
  const firstCarrier = allCarriers.value[carrierType]?.[0];

  if (!firstCarrier?.IdCarrier) {
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

  await updateShipping(updateOptions);
  await cartStore.fetchCart();
  checkoutCarrier.value.carrier = cart.value.Shipping?.Carrier || null;
};

const reloadShippingAndAutoSelectFirst = async () => {
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

  if (requestKey === lastAddressKey.value && carrierSelected.value) {
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
      Country: delivery.country,
    };

    await fetchShipping(options);

    const availableCarrierTypes = shippingCarriers.value || [];
    if (!availableCarrierTypes.length) {
      await updateShipping({ idCarrier: 0 });
      removeCarrier();
      checkoutCarrier.value.carrier = null;
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

    await selectFirstCarrierForType(targetCarrierType, options);
  } finally {
    loading.value = false;
  }
};

watch(
  () => ({
    dAddress: checkoutCustomer.value.deliveryAddress.address,
    dPostalCode: checkoutCustomer.value.deliveryAddress.postalCode,
    dCity: checkoutCustomer.value.deliveryAddress.city,
    dCountry: checkoutCustomer.value.deliveryAddress.country,
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
          <!-- Row header -->
          <div
            class="delivery-group__header"
            @click="setDelivredOption(opt.id)"
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
              <span class="text-sm font-medium uppercase">{{
                $t(opt.label)
              }}</span>
            </div>
            <component :is="opt.icon" :size="20" class="text-zinc-400" />
          </div>

          <!-- Expanded content -->
          <transition name="slide-down">
            <div
              v-if="checkoutDeliveryOption === opt.id"
              class="delivery-group__content"
            >
              <!-- If we have a carrier selected in the cart that matches this mode -->
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
                    <div class="carrier-mode-label text-zinc-400 text-xs">
                      {{ $t(opt.label) }}
                    </div>
                    <div class="carrier-eta text-zinc-400 text-[11px] mt-1">
                      {{ $t('label.estimated_delivery') }} : {{ estimatedDate }}
                    </div>
                  </div>
                  <div class="carrier-price text-sm font-bold">
                    {{ carrierSelected.Price?.TaxIncl?.toFixed(2) }} €
                  </div>
                  <BaseButton
                    class="modifier-btn"
                    type="primary"
                    plain
                    size="small"
                    @click.stop="openDrawer(opt.type)"
                  >
                    {{ $t('button.modify') }}
                  </BaseButton>
                </div>

                <!-- Special info if Relay Point -->
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
                      <button type="button" class="relay-link">
                        <IconClock :size="1.3" class="inline mb-0.5 mr-1" />
                        {{ $t('reservation_store.hours_and_info') }}
                      </button>
                      <div class="relay-nearby">
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

      <!-- Drawer for selection -->
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

    <!-- Alert if address is missing -->
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
    @apply flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-zinc-50 transition-colors bg-white;
  }

  &__content {
    @apply border-t border-zinc-100 p-4 bg-white;
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
  @apply border border-zinc-100 rounded p-4 bg-zinc-50;

  .carrier-info {
    @apply flex items-center gap-4;
  }

  .carrier-logo-wrapper {
    @apply bg-white border border-zinc-200 rounded p-2 h-16 w-16 flex items-center justify-center flex-shrink-0;
  }

  .carrier-details {
    @apply flex-1 min-w-0;
    .carrier-name {
      @apply font-bold text-sm uppercase;
    }
  }
}

.relay-info-box {
  @apply border border-zinc-200 bg-white p-3;
}

.relay-info-main {
  @apply flex items-start justify-between gap-4;
}

.relay-info-left {
  @apply text-xs text-zinc-600;
}

.relay-name {
  @apply text-sm font-medium text-zinc-800 uppercase;
}

.relay-address {
  @apply mt-0.5;
}

.relay-distance {
  @apply mt-1 text-zinc-500;
}

.relay-info-right {
  @apply text-right text-xs text-zinc-600;
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
