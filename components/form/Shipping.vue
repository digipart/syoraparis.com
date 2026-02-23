<script setup lang="ts">
import { trackAddShippingInfo, trackAddPaymentInfo } from '~/utils/gtm';
import PaymentService from '~/services/PaymentService';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre, CarrierType } from '~/types/ShippingType';

const { displayOptions } = defineProps({
  displayOptions: {
    type: String as PropType<'Home' | 'Store' | 'RelayPoint'>,
    default: 'Home',
  },
});

const checkoutStore = useCheckoutStore();
const {
  hasAddressDelivery,
  checkoutCustomer,
  checkoutPaymentMethods,
  checkoutCarrier,
  carrierError,
} = toRefs(checkoutStore);

const shippingStore = useShippingStore();
const { carrier, toshow, relayPointSelected } = toRefs(shippingStore);
const { fetchShipping, fetchRelayPoints } = shippingStore;

const cartStore = useCartStore();
const { updateShipping, fetchCart } = cartStore;
const { carrier: carrierSelected, cart } = toRefs(cartStore);

const loading = ref(false);
const { locale } = useI18n();

watch(
  () => checkoutCarrier.value.carrier,
  (newVal) => {
    if (newVal) {
      carrierError.value = null;
    }
  }
);
const { t } = useI18n();

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
    .then((c) => {
      // toshow.value =

      if (event.relayPointID && event.relayPoints) {
        const rpSelected = event.relayPoints.find(
          (rp) => rp.Id === event.relayPointID
        );
        relayPointSelected.value = rpSelected || null;
        checkoutCarrier.value.relayPoint = rpSelected;
      }
      fetchCart().then(() => {
        if (carrier.value) {
          checkoutCarrier.value.carrier = cart.value.Shipping?.Carrier;
        }
        trackAddShippingInfo(cart.value, event.carrier?.Name || '');
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
const ip = useIp();
const paymentService = new PaymentService();
const loadPayments = async (options: any) => {
  try {
    const data = await paymentService.paymentMethods({
      ...options,
      LanguageIsoCode: locale.value,
    });
    console.log('payment methods:', data.PaymentMethods);
    checkoutPaymentMethods.value = data.PaymentMethods || [];
    if (checkoutPaymentMethods.value.length > 0) {
      trackAddPaymentInfo(cart.value);
    }
  } catch (error) {
    console.error(t('tunnel.payment.error.fetch_methods'), error);
  }
};

const loadCarriers = async () => {
  let options = null;
  if (hasAddressDelivery.value) {
    options = {
      Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
      City: checkoutCustomer.value.deliveryAddress.city,
      Address1: checkoutCustomer.value.deliveryAddress.address,
      Country: checkoutCustomer.value.deliveryAddress.country,
    };
  } else {
    options = {
      IP: ip.value,
    };
  }

  if (options) {
    await fetchShipping(options);
    await loadPayments(options);

    if (
      carrier.value &&
      (!carrierSelected.value ||
        displayOptions.includes('RelayPoint') ||
        displayOptions.includes('Store'))
    ) {
      const groups = ['Home', 'Store', 'RelayPoint'] as const;
      for (const groupName of groups) {
        if (displayOptions && displayOptions.includes(groupName)) {
          const carriersList = carrier.value[groupName as keyof CarrierType];
          if (carriersList && carriersList.length > 0) {
            const firstCarrier = carriersList[0] as CarrierGenre;

            let relayPointID = undefined;
            let relayPointsList: RelayPointType[] = [];

            if (groupName === 'RelayPoint' || groupName === 'Store') {
              try {
                if (firstCarrier.IdCarrier) {
                  const rps = (await fetchRelayPoints({
                    ...options,
                    IdCarrier: firstCarrier.IdCarrier,
                  } as any)) as RelayPointType[];
                  relayPointsList = rps || [];
                  if (relayPointsList.length > 0) {
                    relayPointID = relayPointsList[0]?.Id;
                  }
                }
              } catch (e) {
                console.error('Failed to load relay points for auto-select', e);
              }
            }

            selectShipping({
              carrier: firstCarrier,
              relayPointID,
              relayPoints: relayPointsList,
            });
            break;
          }
        }
      }
    }
  }
};

watch(
  () => checkoutCustomer.value.deliveryAddress,
  () => {
    loadCarriers();
  },
  { deep: true }
);

const hasCarrierOfType = computed(() => {
  if (!carrier.value || Object.keys(carrier.value).length === 0) {
    return false;
  }

  for (const carrierType of displayOptions.split(',').map((t) => t.trim())) {
    if (carrier.value[carrierType as keyof CarrierType]) {
      return true;
    }
  }

  return false;
});

onMounted(() => {
  loadCarriers();
  findCarrierLocation();
});
</script>

<template>
  <div class="formShipping" v-loading="loading">
    <BaseAlert v-if="carrierError" type="danger" class="mb-4">
      {{ carrierError }}
    </BaseAlert>
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
    <div v-if="!hasCarrierOfType">
      <BaseAlert fill type="default" :closeButton="false">
        <span class="text-sm">
          {{ $t('label.shippingOption.noCarrier') }}
        </span>
        <template #icon>
          <IconDeliveryTruckSpeed />
        </template>
      </BaseAlert>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$formShipping: '.formShipping';

#{$formShipping} {
  @apply flex flex-col mb-0;
}
</style>
