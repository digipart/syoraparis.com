<script setup lang="ts">
import ShippingService from '~/services/ShippingService';
import type { CarrierType } from '~/types/ShippingType';

const { t } = useI18n();
const localePath = useLocalePath();

const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const shippingStore = useShippingStore();
const { carrier: allCarriers, toshow } = toRefs(shippingStore);
const { fetchShipping } = shippingStore;

const cartStore = useCartStore();
const { totalToPay, carrier, totalProductQuantity } = toRefs(cartStore);

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);

const deliveryOption = ref<'ship' | 'pickup'>('pickup');

const storeRelayPoints = ref<CarrierType>(allCarriers as CarrierType);

const codePromoRefreshing = ref(false);

const pickupAddress = ref('');
const pickupCarriers = ref<any>(null);

const valide = computed(() => {
  return totalProductQuantity.value && addressDelivery.value && carrier.value;
});

const refreshCodePromo = () => {
  codePromoRefreshing.value = true;
  setTimeout(() => {
    codePromoRefreshing.value = false;
  }, 100);
};

const handleSelectPickupAddress = async (e: any) => {
  getRelayPointWithAddress({
    Postcode: e.postalCode,
    City: e.city,
    Address1: e.address,
    Country: e.country,
  });
};

const getRelayPointWithAddress = (options: {
  IdAddress?: number;
  IdCarrier?: number;
  Postcode?: string;
  City?: string;
  Address1?: string;
  Country?: string;
  Ip?: string;
}) => {
  const shippingService = new ShippingService();
  return shippingService
    .fetch(options)
    .then((data) => {
      console.log('data', data);
      pickupCarriers.value = data.Carriers;
    })
    .catch((error) => {
      throw error;
    });
};
</script>

<template>
  <LayoutContainer small>
    <!-- <NuxtLink
      to="/"
      class="hidden lg:inline-flex items-center cursor-pointer text-sm mb-2"
    >
      <IconChevronLeft :size="1.3" class="mr-2" />
      {{ t('label.continue_shopping') }}
    </NuxtLink> -->
    <div class="grid grid-cols-12 gap-5 items-start pb-16">
      <div class="col-span-12 lg:col-span-8">
        <!-- Delivery Options -->
        <BasePanel
          :title="t('tunnel.delivery.title')"
          class="mb-[-1px] lg:mb-5"
        >
          <div class="deliveryOptions mb-5">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.delivery') }} :
            </BaseHeadLine>
            <div
              class="deliveryOptions-item"
              :class="{ selected: deliveryOption === 'ship' }"
              @click="deliveryOption = 'ship'"
            >
              <InputRadio
                id="do-ship"
                value="ship"
                v-model="deliveryOption"
                class="!absolute top-4 left-4"
              />
              <span>
                {{ $t('tunnel.delivery.shipping') }}
              </span>
              <IconDeliveryTruckSpeed :size="2.5" />
            </div>
            <div
              class="deliveryOptions-item"
              :class="{ selected: deliveryOption === 'pickup' }"
              @click="deliveryOption = 'pickup'"
            >
              <InputRadio
                id="do-pickup"
                value="pickup"
                v-model="deliveryOption"
                class="!absolute top-4 left-4"
              />
              <span>
                {{ $t('tunnel.delivery.pickup') }}
              </span>
              <IconShop :size="2.5" />
            </div>
          </div>

          <div v-if="deliveryOption === 'ship'">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.address_delivery') }} :
            </BaseHeadLine>
            <PageCheckoutCustomer />
            <!-- Shipping option -->
            <hr class="mt-5 mb-5" />
            <div class="flex justify-between gap-5 mb-3">
              <div>
                <BaseHeadLine size="md" class="uppercase font-medium">
                  {{ $t('label.shippingOption.title') }} :
                </BaseHeadLine>
              </div>
              <div v-if="Object.keys(allCarriers).length">
                <ul class="flex gap-4 text-sm">
                  <template v-for="(carrierGroup, groupName) in allCarriers">
                    <li
                      v-if="groupName === 'Home'"
                      class="cursor-pointer"
                      :class="{
                        'underline font-normal': toshow === groupName,
                      }"
                      @click="toshow = groupName"
                    >
                      {{ $t('label.shippingOption.' + groupName) }}
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <FormShipping
              v-if="Object.keys(allCarriers).length"
              :displayOptions="['Home']"
            />

            <div v-else>
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

          <div v-if="deliveryOption === 'pickup'">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.address') }} :
            </BaseHeadLine>
            <InputGoogoleAutoComplete
              v-model="pickupAddress"
              id="autocompletePickup"
              :label="$t('label.address')"
              @onSelect="handleSelectPickupAddress"
            />
            <template
              v-if="pickupCarriers && Object.keys(pickupCarriers).length"
            >
              <hr class="mt-5 mb-5" />
              <div class="flex justify-end gap-5 mb-2">
                <div>
                  <ul class="flex gap-4 text-sm">
                    <template v-for="(carrierGroup, groupName) in allCarriers">
                      <li
                        v-if="groupName !== 'Home'"
                        class="cursor-pointer"
                        :class="{
                          'underline font-normal': toshow === groupName,
                        }"
                        @click="toshow = groupName"
                      >
                        {{ $t('label.shippingOption.' + groupName) }}
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <FormShipping :displayOptions="['Store', 'RelayPoint']" />
            </template>
          </div>
        </BasePanel>
        <BasePanel :title="$t('tunnel.payment.title')">
          <FormPayment v-if="valide && !codePromoRefreshing" />
          <BaseAlert v-else fill type="default" :closeButton="false">
            <span class="text-sm">
              {{ $t('label.payment.noPayment') }}
            </span>

            <template #icon>
              <IconPayment />
            </template>
          </BaseAlert>
        </BasePanel>
      </div>

      <div class="col-span-12 lg:col-span-4 lg:sticky top-[4.5rem]">
        <BasePanel
          :title="t('tunnel.delivery.order_summary.title')"
          class="mb-5"
        >
          <PageTunnelOrderSummary />
        </BasePanel>
        <BasePanel class="hidden lg:block mb-5" bodyPadding="0px">
          <template #header>
            <div class="flex gap-3 justify-between items-center">
              <BaseHeadLine size="md" class="font-normal uppercase">
                {{ $t('cart.title') }} ({{ totalProductQuantity }})
              </BaseHeadLine>
              <NuxtLink
                :to="localePath({ name: 'cart' })"
                class="text-sm underline"
              >
                {{ $t('button.modify') }}
              </NuxtLink>
            </div>
          </template>
          <PerfectScrollbar class="max-h-[944px] p-5">
            <ListingCartItems
              :editable="false"
              :mini="true"
              @onCodePromoRemoved="refreshCodePromo"
            />
          </PerfectScrollbar>
        </BasePanel>
        <PageCheckoutMyRewards @onCodePromoApplied="refreshCodePromo" />
        <BasePanel class="hidden lg:block">
          <template #header>
            <div class="flex gap-3 justify-between items-center">
              <BaseHeadLine size="md" class="font-normal uppercase">
                {{ $t('cart.codepromo.title') }}
              </BaseHeadLine>
            </div>
          </template>
          <div>
            <FormCodePromo @onCodePromoApplied="refreshCodePromo" />
          </div>
        </BasePanel>
      </div>
    </div>
    <Teleport to="body">
      <div
        class="flex lg:hidden fixed bottom-0 w-full border-t border-black bg-white py-3 px-5"
      >
        <div class="flex-1 flex items-center font-normal justify-end text-sm">
          <span class="ml-5 mr-2 uppercase">{{ $t('cart.total') }} : </span>
          <span class="font-normal text-base">
            {{ totalToPay }} {{ currencyIsoCode }}</span
          >
        </div>
      </div>
    </Teleport>
  </LayoutContainer>
</template>

<style scoped lang="scss">
.deliveryOptions {
  @apply flex flex-col;
  &-item {
    @apply relative border border-zinc-300  z-[1] flex justify-between gap-3 items-center;
    @apply mb-[-1px] pl-12 py-3 pr-5;
    @apply text-sm;
    &.selected {
      @apply border-black z-[2];
    }
  }
}
</style>
