<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre, ShippingType } from '~/types/ShippingType';

const shippingStore = useShippingStore();
const { carrier, relayPoints, relayPointSelected } = toRefs(shippingStore);

const addressStore = useAddressStore();
const { addressDelivery } = storeToRefs(addressStore);

const cartStore = useCartStore();
const { updateShipping, fetchCart } = cartStore;
const { cart } = toRefs(cartStore);

const appStore = useAppStore();
const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

const drawerOpen = ref(false);
const currentCarrier = ref<CarrierGenre | null>(null);

const checkoutStore = useCheckoutStore();
const { checkoutCustomer } = storeToRefs(checkoutStore);

const activeTab = ref<string[]>([]);

let firstOpen = true;
const onOpen = (key: string) => {
  const cr = carrier.value[key];
  activeTab.value = [key];
  if (!firstOpen) {
    console.log(relayPointSelected.value?.Id);

    selectCarrier({
      c: cr[0],
      rpId: key === 'RelayPoint' ? relayPointSelected.value?.Id : undefined,
    });
  }
  firstOpen = false;
};

const fetchCarriers = async () => {
  if (checkoutCustomer.value?.deliveryAddress.postalCode) {
    shippingStore
      .fetchShipping({
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
        Postcode: checkoutCustomer.value?.deliveryAddress.postalCode,
        City: checkoutCustomer.value?.deliveryAddress.city,
        Address1: checkoutCustomer.value?.deliveryAddress.address,
        Country: checkoutCustomer.value?.deliveryAddress.country,
      })
      .then((data: ShippingType) => {
        const keys = Object.keys(data.Carrier || {});
        if (keys.length > 0) {
          currentCarrier.value = data?.Carrier?.[keys[0]]?.[0];
          activeTab.value = [keys[0]];
          //setCarrierToCart(currentCarrier.value);
          getCarrier();
          fetchRelayPoints();
        }
      });
  }
};

const getCarrier = () => {
  for (const key in carrier.value) {
    for (const c of carrier.value[key]) {
      if (
        c.IdCarrier &&
        c.IdCarrier === cart.value?.Shipping?.Carrier?.IdCarrier
      ) {
        currentCarrier.value = c;
        activeTab.value = [key];
        break;
      }
    }
  }

  if (
    !cart.value?.Shipping?.Carrier?.IdCarrier ||
    currentCarrier.value?.IdCarrier !== cart.value?.Shipping?.Carrier?.IdCarrier
  ) {
    setCarrierToCart(currentCarrier.value);
  }
};

const setCarrierToCart = (c: CarrierGenre) => {
  //   shippingStore.setCarrier(carrier);
  if (c.IdCarrier && c.IdCarrier !== cart.value?.Shipping?.Carrier?.IdCarrier) {
    return updateShipping({
      idCarrier: c.IdCarrier,
    });
  }
  return Promise.resolve();
};

const selectCarrier = ({ c, rpId }: { c: CarrierGenre; rpId?: string }) => {
  //   if (c.IdCarrier === cart.value?.Shipping?.Carrier?.IdCarrier) {
  //     drawerOpen.value = false;
  //     return;
  //   }

  let payload: { idCarrier: string; IdRelayPoint?: string } = {
    idCarrier: c.IdCarrier,
  };

  if (rpId) {
    payload.IdRelayPoint = rpId;
  }

  updateShipping(payload).then(async () => {
    currentCarrier.value = c;

    fetchCart().then(async () => {
      if (currentCarrier.value?.CarrierType === 'RelayPoint') {
        await fetchRelayPoints();
      }
      drawerOpen.value = false;
    });
  });
};

const fetchRelayPoints = async () => {
  if (currentCarrier.value?.IdCarrier) {
    const res = await shippingStore.fetchRelayPoints({
      IdCarrier: currentCarrier.value.IdCarrier,
      Postcode: checkoutCustomer.value?.deliveryAddress.postalCode,
      City: checkoutCustomer.value?.deliveryAddress.city,
      Address1: checkoutCustomer.value?.deliveryAddress.address,
      Country: checkoutCustomer.value?.deliveryAddress.country,
    });

    if (res) {
      relayPointSelected.value = res[0] || null;
      res.map((r: RelayPointType) => {
        if (r.Id === cart.value?.Shipping?.Carrier?.IdRelayPoint) {
          relayPointSelected.value = r;
        }
      });
    }
    return res;
  }

  return [];
};

const onSelectRelayPointHandler = (rpId: string) => {
  if (currentCarrier.value) {
    selectCarrier({ c: currentCarrier.value, rpId });
  }
};

fetchCarriers();

watch(
  () => checkoutCustomer.value?.deliveryAddress?.postalCode,
  () => {
    fetchCarriers();
    console.log('postalCode changed');
  },
  { deep: true }
);
</script>

<template>
  <div>
    <h2 class="checkout-title">{{ $t('label.shippingOption.title') }} :</h2>
    <BaseCollapsible
      v-if="Object.keys(carrier).length > 0"
      :index-active="activeTab"
      class="carrierTypeCollaps"
    >
      <BaseCollapsibleItem
        v-for="(genre, key) in carrier"
        :key="key"
        :index="key"
        :closeOthers="true"
        :hideArrow="false"
        @onOpen="onOpen(key)"
      >
        <template #header>
          {{ $t(`label.shippingOption.${key}`) }}
        </template>
        <template #content>
          <div class="px-3 py-3 flex flex-col gap-3">
            <CheckoutCarrierCard
              v-if="currentCarrier"
              :carrier="currentCarrier"
              @onChangeClick="drawerOpen = true"
              :buttonText="
                carrier[activeTab[0]]?.length > 1 ? $t('button.change') : ''
              "
              :key="currentCarrier?.IdCarrier"
              :relayPointSelected="
                currentCarrier?.CarrierType === 'RelayPoint'
                  ? relayPointSelected
                  : null
              "
              @onRelayPointSelected="onSelectRelayPointHandler"
            />
          </div>
        </template>
      </BaseCollapsibleItem>
    </BaseCollapsible>
    <div v-else>
      <BaseAlert type="warning" :closeButton="false" fill>
        <template #icon>
          <IconDeliveryTruckSpeed :size="2" />
        </template>
        <span class="text-sm">
          {{ $t('label.provide_address_to_see_shipping') }}
        </span>
      </BaseAlert>
    </div>
    <BaseDrawer
      v-model="drawerOpen"
      size="100%"
      maxSize="600px"
      position="left"
      :closeButton="false"
      class="sideMenu-drawer"
      bodyPadding="1rem"
    >
      <template #header>
        <div class="drawer-title uppercase font-bold text-lg">
          {{ $t('label.shippingOption.title') }}
        </div>
      </template>
      <div class="flex flex-col gap-3">
        <div v-for="(c, i) in carrier[activeTab[0]]" :key="i">
          <CheckoutCarrierCard
            :carrier="c"
            :buttonText="$t('button.select')"
            @onChangeClick="selectCarrier({ c })"
            :relayPointSelected="
              currentCarrier?.CarrierType === 'RelayPoint'
                ? relayPointSelected
                : null
            "
          />
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<style lang="scss">
.carrierTypeCollaps {
  @apply bg-white;

  .collap-item {
    @apply border border-gray-200;
    .header {
      @apply border-gray-200;
    }
  }
}
</style>
