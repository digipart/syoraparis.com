<script setup lang="ts">
import ShippingService from '~/services/ShippingService';
import type { CarrierType } from '~/types/ShippingType';

const { t } = useI18n();
const localePath = useLocalePath();

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutCarrier } = toRefs(checkoutStore);

const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const shippingStore = useShippingStore();
const { carrier: allCarriers, toshow } = toRefs(shippingStore);

const cartStore = useCartStore();
const { totalToPay, carrier, totalProductQuantity } = toRefs(cartStore);
const { updateShipping } = cartStore;

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);

const deliveryOption = ref<'ship' | 'pickup'>('ship');

const storeRelayPoints = ref<CarrierType>(allCarriers as CarrierType);

const paymentRefreshing = ref(false);

const pickupAddress = ref('');

const valide = computed(() => {
  return totalProductQuantity.value && carrier.value;
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
  paymentRefreshing.value = true;
  setTimeout(() => {
    paymentRefreshing.value = false;
  }, 100);
};

const ip = useIp();
const setDelivredOption = async (optionType: 'ship' | 'pickup') => {
  allCarriers.value = {};
  deliveryOption.value = optionType;
  // if (optionType === 'ship' && addressDelivery.value) {
  //   fetchShipping({
  //     IdAddress: addressDelivery.value?.IdAddress,
  //   });
  // }
  // if (optionType === 'pickup' && pickupAddress.value) {
  //   handleSelectPickupAddress(pickupAddress);
  // } else if (optionType === 'pickup' && ip.value) {
  //   fetchShipping({
  //     IP: ip.value,
  //   });
  // }
};

const customAddressDelivery = computed(() => {
  if (
    deliveryOption.value === 'ship' &&
    state.value.postcode &&
    state.value.country &&
    state.value.city
  ) {
    return {
      postcode: state.value.postcode,
      city: state.value.city,
      country: state.value.country,
      address: state.value.address,
    };
  }
  if (deliveryOption.value === 'ship' && ip.value) {
    return {
      ip: ip.value,
    };
  }
  return undefined;
});

const handalFormGuestChange = (state: any) => {
  paymentRefreshing.value = true;
  setTimeout(() => {
    paymentRefreshing.value = false;
  }, 100);
};

const handleSelectPickupAddress = async (e: any) => {
  // fetchShipping({
  //   Postcode: e.postalCode,
  //   City: e.city,
  //   Address1: e.address,
  //   Country: e.country,
  // });
  checkoutCustomer.value.deliveryAddress.address = e.address;
  checkoutCustomer.value.deliveryAddress.city = e.city;
  checkoutCustomer.value.deliveryAddress.postalCode = e.postalCode;
  checkoutCustomer.value.deliveryAddress.country = e.country;
};
</script>

<template>
  <div>
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
          <BaseHeadLine size="md" class="uppercase font-medium mb-3">
            {{ $t('label.contact') }} :
          </BaseHeadLine>
          <div>
            <InputText
              id="email"
              v-model="state.email"
              type="email"
              :errors="v$.email?.$errors"
              :required="true"
              :label="$t('label.email')"
              border
            />
          </div>

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
          <CardShipping
            v-if="carrier?.IdCarrier"
            :carrier="carrier"
            :radio="false"
            :border="false"
            class="mb-5"
          />

          <div v-if="deliveryOption === 'ship'">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.address_delivery') }} :
            </BaseHeadLine>
            <PageCheckoutGuest
              class="mb-5"
              hideEmail
              @onFormChange="handalFormGuestChange($event)"
            />
            <!-- Shipping option -->
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
              :label="$t('label.address')"
              @onSelect="handleSelectPickupAddress"
              border
            />
            <div class="flex justify-end gap-5 mb-2">
              <div>
                <ul class="flex gap-4 text-sm">
                  <template v-for="(carrierGroup, groupName) in pickupCarriers">
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
            <FormShipping :displayOptions="['Store', 'RelayPoint']" />
          </div>

          <div class="mt-5">
            <div v-if="valide && !paymentRefreshing">
              <BaseHeadLine size="md" class="uppercase font-medium mb-3">
                {{ $t('tunnel.payment.title') }} :
              </BaseHeadLine>
              <FormPayment />
            </div>
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
        <div class="box">
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
                checkout
              />
            </PerfectScrollbar>
          </BasePanel>
          <PageCheckoutMyRewards @onCodePromoApplied="refreshCodePromo" />
          <BasePanel>
            <template #header>
              <div class="flex gap-3 justify-between items-center">
                <BaseHeadLine size="md" class="font-normal uppercase">
                  {{ $t('cart.codepromo.title') }}
                </BaseHeadLine>
              </div>
            </template>
            <div>
              <FormCodePromo @onCodePromoApplied="refreshCodePromo" />

              {{ checkoutCustomer }} <br />
              {{ checkoutCarrier }}
            </div>
          </BasePanel>
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
