<template>
  <div class="cardShipping" :class="{ active, radio, bordered: border }">
    <span class="cardShipping-span" v-if="radio"></span>
    <div class="cardShipping-item" @click="onSelectHandler()">
      <div class="flex gap-3">
        <div class="flex flex-col flex-1 text-xs uppercase">
          <span class="font-light">
            {{ carrier?.Name }}
          </span>
          <span class="font-normal mb-1">
            {{ carrier?.Price?.TaxIncl?.toFixed(2) }} {{ currencyIsoCode }}
          </span>
        </div>
        <div class="cardShipping-item-logo">
          <NuxtImg
            v-if="getCarrierImage()"
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
  radio: {
    type: Boolean,
    default: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
});

// const relayPoints = ref<RelayPointType[]>([]);

const emit = defineEmits(['onSelect']);

const getCarrierImage = () => {
  if (carrier?.Name?.includes('Colissimo')) {
    return '/assets/images/colissimo-logo.png';
  } else if (carrier?.Name?.includes('DHL')) {
    return '/assets/images/dhl-logo.png';
  } else if (carrier?.Name?.includes('GLS')) {
    return '/assets/images/gls-logo.svg';
  } else if (carrier?.Name?.includes('Chronopost')) {
    return '/assets/images/chronopost-logo.png';
  } else if (carrier?.Name?.includes('UPS')) {
    return '/assets/images/ups-logo.svg';
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
  @apply flex flex-col gap-y-4 relative z-[0] bg-zinc-200;

  &.active {
    @apply border-black z-[1];
    #{$cardShipping} {
      &-span {
        &::after {
          content: '';
          @apply bg-black;
        }
      }
    }
  }
  &.radio {
    #{$cardShipping} {
      &-item {
        @apply pl-12;
      }
    }
  }
  &.bordered {
    @apply border border-gray-bbb bg-white;
  }
  &-item {
    @apply p-5 pl-5 duration-150 cursor-pointer;

    &-logo {
    }
  }

  &-span {
    @apply inline-block  absolute h-4 w-4 
    rounded-full duration-150 translate-y-0.5 mr-2 top-[1.6rem] left-[1rem]
    border border-black;

    &::after {
      content: '';
      @apply absolute bg-transparent left-[1px] top-[1px] duration-150 rounded-full;
      height: calc(100% - 2px);
      width: calc(100% - 2px);
    }
  }
}
</style>
