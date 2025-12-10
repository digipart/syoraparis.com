<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre, CarrierType } from '~/types/ShippingType';

const { displayOptions } = defineProps({
  displayOptions: {
    type: Array,
    default: () => ['Home', 'Store', 'RelayPoint'],
  },
});

const checkoutStore = useCheckoutStore();
const { hasAddressDelivery, checkoutCustomer } = toRefs(checkoutStore);

const shippingStore = useShippingStore();
const { carrier, toshow, relayPointSelected } = toRefs(shippingStore);
const { fetchShipping } = shippingStore;

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
const ip = useIp();
const loadCarriers = () => {
  if (hasAddressDelivery.value) {
    fetchShipping({
      Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
      City: checkoutCustomer.value.deliveryAddress.city,
      Address1: checkoutCustomer.value.deliveryAddress.address,
      Country: checkoutCustomer.value.deliveryAddress.country,
    });
  } else {
    fetchShipping({
      IP: '91.160.93.4',
    });
  }
};

watch(checkoutCustomer.value.deliveryAddress, () => {
  console.log('hasAddressDelivery', checkoutCustomer.value.deliveryAddress.city);

  loadCarriers();
});

onMounted(() => {
  loadCarriers();
  findCarrierLocation();
});
</script>

<template>
  <div class="formShipping" v-loading="loading">
    <div v-for="(carrierGroup, groupName) in carrier" class="flex flex-col">
      <template v-if="displayOptions.includes(groupName)">
        <CardShipping
          v-for="c in carrierGroup"
          :key="c.IdCarrier"
          :carrier="c"
          @onSelect="selectShipping($event)"
          :active="carrierSelected?.IdCarrier === c.IdCarrier"
          class="mb-[-1px]"
          :carrierType="groupName"
        />
      </template>
    </div>
    <!-- <div v-else>
              <BaseAlert fill type="default" :closeButton="false">
                <span class="text-sm">
                  {{ $t('label.shippingOption.noCarrier') }}
                </span>
                <template #icon>
                  <IconDeliveryTruckSpeed />
                </template>
              </BaseAlert>
            </div> -->
  </div>
</template>

<style lang="scss" scoped>
$formShipping: '.formShipping';

#{$formShipping} {
  @apply flex flex-col mb-0;
}
</style>
