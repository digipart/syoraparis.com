<template>
  <div class="cardShipping">
    <div
      class="cardShipping-item"
      @click="onSelectHandler()"
      :class="{ active }"
    >
      <div class="flex gap-3">
        <div class="flex flex-col flex-1 text-xs uppercase">
          <span class="font-normal mb-1">
            {{ carrier?.Price?.TaxIncl?.toFixed(2) }} {{ currencyIsoCode }}
          </span>
          <span class="font-light">
            {{ carrier?.Name }}
          </span>
        </div>
        <div class="cardShipping-item-logo">
          <NuxtImg
            :src="getCarrierImage()"
            :alt="carrier?.Name"
            height="28"
            class="h-5"
          />
        </div>
      </div>
      <div v-if="carrierType === 'RelayPoint' && active && relayPointSelected">
        <BaseHr spacing="12px" />
        <CardShippingRelayPoint
          @onSelectPointRelay="selectPointRelay($event, relayPoints)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShippingService from '~/services/ShippingService';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre } from '~/types/ShippingType';

const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { carrier: carrierCart } = toRefs(cartStore);

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);

const shippingStore = useShippingStore();
const { fetchRelayPoints } = shippingStore;
const { relayPointSelected, relayPoints } = toRefs(shippingStore);

const { carrier, carrierType, active } = defineProps({
  carrier: {
    type: {} as PropType<CarrierGenre>,
  },
  active: {
    type: Boolean,
    default: false,
  },
  carrierType: {
    type: String as PropType<'Home' | 'Store' | 'RelayPoint'>,
  },
});

// const relayPoints = ref<RelayPointType[]>([]);

const emit = defineEmits(['onSelect']);

const getCarrierImage = () => {
  if (carrier?.Name === 'Colissimo') {
    return '/assets/images/colissimo-logo.png';
  } else if (carrier?.Name === 'DHL') {
    return '/assets/images/dhl-logo.png';
  } else if (carrier?.Name === 'GLS') {
    return '/assets/images/gls-logo.svg';
  } else if (carrier?.Name === 'Chronopost') {
    return '/assets/images/chronopost-logo.png';
  }
};

const onSelectHandler = async () => {
  if (carrierType === 'RelayPoint') {
    await loadRelayPoint();

    if (relayPoints.value.length) {
      relayPointSelected.value = relayPoints.value[0];
    }
  } else {
    relayPointSelected.value = null;
  }

  emit('onSelect', {
    carrier,
    relayPointID: relayPointSelected.value?.Id,
    relayPoints: relayPoints.value,
  });
};

const loadRelayPoint = async () => {
  if (carrier?.IdCarrier && addressDelivery.value?.IdAddress) {
    try {
      const data = await fetchRelayPoints({
        IdAddress: addressDelivery.value?.IdAddress,
        IdCarrier: carrier?.IdCarrier,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
};

onMounted(() => {
  if (carrierType === 'RelayPoint') {
    if (active) {
      loadRelayPoint().then((data) => {
        if (relayPoints.value.length) {
          const cartIdPointRelay = carrierCart.value?.IdRelayPoint;
          // const cartIdPointRelay = 'GLS_FR-2502000244';

          if (cartIdPointRelay) {
            const rpSelected = relayPoints.value.find(
              (rp) => rp.Id === cartIdPointRelay
            );

            if (rpSelected) {
              relayPointSelected.value = rpSelected;
            }
          } else {
            relayPointSelected.value = relayPoints.value[0];
          }
        }
      });
    }
  }
});

const selectPointRelay = (rpId: string, relayPoints: RelayPointType[]) => {
  emit('onSelect', {
    carrier,
    relayPointID: rpId,
    relayPoints,
  });
};
</script>

<style scoped lang="scss">
$cardShipping: '.cardShipping';

#{$cardShipping} {
  @apply flex flex-col gap-y-4;
  &-item {
    @apply border border-gray-bbb p-5 duration-150 cursor-pointer;

    &-logo {
    }

    &.active {
      @apply border-black;
    }
  }
}
</style>
