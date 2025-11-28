<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre, CarrierType } from '~/types/ShippingType';

const shippingStore = useShippingStore();
const { carrier, toshow, relayPointSelected } = toRefs(shippingStore);

const cartStore = useCartStore();
const { updateShipping, fetchCart } = cartStore;
const { carrier: carrierSelected } = toRefs(cartStore);

const loading = ref(false);

const findCarrierLocation = (): keyof CarrierType | null => {
  for (const location in carrier.value) {
    if (carrier.value.hasOwnProperty(location)) {
      const carriersList = carrier.value[location as keyof CarrierType];
      if (carriersList) {
        for (const c of carriersList) {
          if (c.IdCarrier === carrierSelected.value?.IdCarrier) {
            toshow.value = location as keyof CarrierType;
          }
        }
      } else null;
    }
  }
  return null; // Return null if no match found
};

const selectShipping = (event: {
  carrier: CarrierGenre;
  relayPointID?: string;
  relayPoints: RelayPointType[];
}) => {
  loading.value = true;
  carrierSelected.value = null;


  const option: any = {
    idCarrier: event.carrier.IdCarrier,
  };
  if (event.relayPointID) {
    option.IdRelayPoint = event.relayPointID;
  }

  updateShipping(option)
    .then(() => {
      // toshow.value =

      if (event.relayPointID && event.relayPoints) {
        const rpSelected = event.relayPoints.find(
          (rp) => rp.Id === event.relayPointID
        );
        relayPointSelected.value = rpSelected || null;
      }
      fetchCart();
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  findCarrierLocation();
});
</script>

<template>
  <div class="formShipping" v-loading="loading">
    <div v-for="(carrierGroup, groupName) in carrier" class="flex flex-col">
      <template v-if="toshow === 'all' || toshow === groupName">
        <CardShipping
          v-for="c in carrierGroup"
          :key="c.IdCarrier"
          :carrier="c"
          @onSelect="selectShipping($event)"
          :active="carrierSelected?.IdCarrier === c.IdCarrier"
          class="mb-5"
          :carrierType="groupName"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$formShipping: '.formShipping';

#{$formShipping} {
  @apply flex flex-col -mb-5;
}
</style>
