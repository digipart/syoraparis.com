<script setup lang="ts">
import PaymentService from '~/services/PaymentService';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre, CarrierType } from '~/types/ShippingType';

const { displayOptions } = defineProps({
  displayOptions: {
    type: Array,
    default: () => ['Home', 'Store', 'RelayPoint'],
  },
});

const checkoutStore = useCheckoutStore();
const { hasAddressDelivery, checkoutCustomer, checkoutPaymentMethods } =
  toRefs(checkoutStore);

const shippingStore = useShippingStore();
const { carrier, toshow, relayPointSelected } = toRefs(shippingStore);
const { fetchShipping } = shippingStore;

const cartStore = useCartStore();
const { updateShipping, fetchCart } = cartStore;
const { carrier: carrierSelected } = toRefs(cartStore);

const loading = ref(false);
const { locale } = useI18n();
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
const paymentService = new PaymentService();
const loadPayments = async (options: any) => {
  try {
    const data = await paymentService.paymentMethods({
      ...options,
      LanguageIsoCode: locale.value,
    });
    console.log('payment methods:', data.PaymentMethods);
    checkoutPaymentMethods.value = data.PaymentMethods || [];
  } catch (error) {
    console.error(t('tunnel.payment.error.fetch_methods'), error);
  }
};

const loadCarriers = async () => {
  if (hasAddressDelivery.value) {
    const options = {
      Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
      City: checkoutCustomer.value.deliveryAddress.city,
      Address1: checkoutCustomer.value.deliveryAddress.address,
      Country: checkoutCustomer.value.deliveryAddress.country,
    };
    await fetchShipping(options);
    await loadPayments(options);
  } else {
    const options = {
      IP: ip.value,
    };
    await fetchShipping(options);
    await loadPayments(options);
  }
};

watch(checkoutCustomer.value.deliveryAddress, () => {
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
    <div v-if="!carrier || Object.keys(carrier).length === 0">
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
