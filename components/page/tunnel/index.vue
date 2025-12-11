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

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutCarrier } = toRefs(checkoutStore);

const cartStore = useCartStore();
const { totalToPay, carrier, totalProductQuantity } = toRefs(cartStore);

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);

const deliveryOption = ref<'ship' | 'pickup'>(
  carrier.value?.IdRelayPoint !== undefined ? 'pickup' : 'ship'
);

const codePromoRefreshing = ref(false);

const pickupAddress = ref('');

const valide = computed(() => {
  return totalProductQuantity.value && addressDelivery.value && carrier.value;
});

const homeCarriers = computed(() => {
  if (allCarriers.value && allCarriers.value.Home) {
    return { Home: allCarriers.value.Home };
  }
  return {};
});

const pickupCarriers = computed(() => {
  if (!allCarriers.value) {
    return {};
  }
  const carriers = { ...allCarriers.value };
  delete carriers.Home;
  return carriers;
});

const refreshCodePromo = () => {
  codePromoRefreshing.value = true;
  setTimeout(() => {
    codePromoRefreshing.value = false;
  }, 100);
};
const ip = useIp();
const setDelivredOption = async (optionType: 'ship' | 'pickup') => {
  deliveryOption.value = optionType;
  if (optionType === 'ship' && addressDelivery.value) {
    // fetchShipping({
    //   IdAddress: addressDelivery.value?.IdAddress,
    // });
  }

  if (optionType === 'pickup' && pickupAddress.value) {
    handleSelectPickupAddress(pickupAddress.value);
  } else if (optionType === 'pickup' && ip.value) {
    // fetchShipping({
    //   IP: ip.value,
    // });
  }
};

const handleSelectPickupAddress = async (e: any) => {
  // fetchShipping({
  //   Postcode: e.postalCode,
  //   City: e.city,
  //   Address1: e.address,
  //   Country: e.country,
  // });
  pickupAddress.value = e.address;
  checkoutCustomer.value.deliveryAddress.address = e.address;
  checkoutCustomer.value.deliveryAddress.city = e.city;
  checkoutCustomer.value.deliveryAddress.postalCode = e.postalCode;
  checkoutCustomer.value.deliveryAddress.country = e.countryIso;
};
</script>

<template>
  <div class="">
    <!-- <NuxtLink
      to="/"
      class="hidden lg:inline-flex items-center cursor-pointer text-sm mb-2"
    >
      <IconChevronLeft :size="1.3" class="mr-2" />
      {{ t('label.continue_shopping') }}
    </NuxtLink> -->
    <div class="grid grid-cols-11 items-start">
      <div class="col-span-12 lg:col-span-6 checkout-left">
        <!-- Delivery Options -->
        <div class="box">
          <div class="deliveryOptions mb-5">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.delivery') }} :
            </BaseHeadLine>
            <div
              class="deliveryOptions-item"
              :class="{ selected: deliveryOption === 'ship' }"
              @click="setDelivredOption('ship')"
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
              @click="setDelivredOption('pickup')"
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
              <div v-if="Object.keys(homeCarriers).length">
                <ul class="flex gap-4 text-sm">
                  <template v-for="(carrierGroup, groupName) in homeCarriers">
                    <li
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
          </div>

          <div v-if="deliveryOption === 'pickup'">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.address') }} :
            </BaseHeadLine>
            <InputGoogoleAutoComplete
              v-model="pickupAddress"
              id="autocompletePickup"
              :label="$t('label.search_address')"
              @onSelect="handleSelectPickupAddress"
              border
            />
            <template v-if="Object.keys(pickupCarriers).length">
              <div class="flex justify-end gap-5 mb-2">
                <div>
                  <ul class="flex gap-4 text-sm">
                    <template
                      v-for="(carrierGroup, groupName) in pickupCarriers"
                    >
                      <li
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
            </template>
            <FormShipping :displayOptions="['Store', 'RelayPoint']" />
          </div>
          <div class="mt-5">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('tunnel.payment.title') }} :
            </BaseHeadLine>
            <FormPayment v-if="valide && !codePromoRefreshing" />
            <BaseAlert v-else fill type="default" :closeButton="false">
              <span class="text-sm">
                {{ $t('label.payment.noPayment') }}
              </span>

              <template #icon>
                <IconPayment />
              </template>
            </BaseAlert>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5 checkout-right">
        <!-- <template #header>
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
          </template> -->
        <div class="box">
          <ListingCartItems
            :editable="false"
            :mini="true"
            @onCodePromoRemoved="refreshCodePromo"
            checkout
          />
          <PageCheckoutMyRewards @onCodePromoApplied="refreshCodePromo" />
          <div>
            <FormCodePromo @onCodePromoApplied="refreshCodePromo" />
          </div>
          <PageTunnelOrderSummary class="mt-5" />
        </div>
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
  </div>
</template>

<style scoped lang="scss">
.deliveryOptions {
  @apply flex flex-col;
  &-item {
    @apply relative border border-zinc-300 bg-white z-[1] 
    flex justify-between gap-3 items-center cursor-pointer;
    @apply mb-[-1px] pl-12 py-3 pr-5;
    @apply text-sm;
    &.selected {
      @apply border-black bg-zinc-50  z-[2];
    }
  }
}
</style>
