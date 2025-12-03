<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';
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

const valide = computed(() => {
  return totalProductQuantity.value && addressDelivery.value && carrier.value;
});

const pickupAddress = ref('');

const handleSelectPickupAddress = (e: any) => {
  console.log('address', e);
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
            <BaseHeadLine size="sm" class="uppercase font-normal mb-3">
              {{ $t('label.address_delivery') }} :
            </BaseHeadLine>
            <PageCheckoutCustomer />
            <!-- Shipping option -->
            <template v-if="Object.keys(allCarriers).length">
              <hr class="mt-5 mb-5" />
              <div class="flex justify-end gap-5 mb-2">
                <div>
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
              <FormShipping :displayOptions="['Home']" />
            </template>
          </div>

          <div v-if="deliveryOption === 'pickup'">
            <BaseHeadLine size="sm" class="uppercase font-normal mb-3">
              {{ $t('label.address') }} :
            </BaseHeadLine>
            <InputGoogoleAutoComplete
              v-model="pickupAddress"
              id="autocompletePickup"
              :label="$t('label.address')"
              @onSelect="handleSelectPickupAddress"
            />
            <template v-if="Object.keys(allCarriers).length">
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
        <BasePanel v-if="valide" :title="$t('tunnel.payment.title')">
          <FormPayment />
        </BasePanel>
      </div>

      <div class="col-span-12 lg:col-span-4 lg:sticky top-[4.5rem]">
        <BasePanel
          :title="t('tunnel.delivery.order_summary.title')"
          class="mb-5"
        >
          <PageTunnelOrderSummary />
        </BasePanel>
        <BasePanel class="hidden lg:block" bodyPadding="0px">
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
            <ListingCartItems :editable="false" :mini="true" />
          </PerfectScrollbar>
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
