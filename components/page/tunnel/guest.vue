<script setup lang="ts">
const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutDeliveryOption } = toRefs(checkoutStore);

const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);


const shippingStore = useShippingStore();
const { carrier: allCarriers, toshow } = toRefs(shippingStore);

const formInvoiceStore = useFormInvoiceStore();
const { state: invoiceState } = toRefs(formInvoiceStore);

const cartStore = useCartStore();
const { totalToPay, carrier, totalProductQuantity } = toRefs(cartStore);
const { updateShipping,removeCarrier } = cartStore;

const paymentRefreshing = ref(false);

const pickupAddress = ref('');

const valide = computed(() => {
  return totalProductQuantity.value && carrier.value;
});

const refreshCodePromo = () => {
  paymentRefreshing.value = true;
  setTimeout(() => {
    paymentRefreshing.value = false;
  }, 100);
};

const setDelivredOption = async (
  optionType: 'home' | 'relayPoint' | 'store'
) => {
  allCarriers.value = {};
  checkoutDeliveryOption.value = optionType;
};

const handalFormGuestChange = (state: any) => {
  paymentRefreshing.value = true;
  setTimeout(() => {
    paymentRefreshing.value = false;
  }, 100);
};

const handleSelectPickupAddress = async (e: any) => {
  checkoutCustomer.value.deliveryAddress.address = e.address;
  checkoutCustomer.value.deliveryAddress.city = e.city;
  checkoutCustomer.value.deliveryAddress.postalCode = e.postalCode;
  checkoutCustomer.value.deliveryAddress.country = e.country;

  invoiceState.value.address = e.address;
  invoiceState.value.city = e.city;
  invoiceState.value.postcode = e.postalCode;
  invoiceState.value.country = e.country;
};

const setCheckouCustomer = () => {
  if (checkoutDeliveryOption.value === 'home') {
    if (addressDelivery.value) {
      checkoutCustomer.value.deliveryAddress.address =
        addressDelivery.value.Address1 || '';
      checkoutCustomer.value.deliveryAddress.city =
        addressDelivery.value.City || '';
      checkoutCustomer.value.deliveryAddress.postalCode =
        addressDelivery.value.Postcode || '';
      checkoutCustomer.value.deliveryAddress.country =
        addressDelivery.value.CountryIsoCode || '';
      checkoutCustomer.value.deliveryAddress.firstname =
        addressDelivery.value.Firstname || '';
      checkoutCustomer.value.deliveryAddress.lastname =
        addressDelivery.value.Lastname || '';
      checkoutCustomer.value.deliveryAddress.phone =
        addressDelivery.value.MobilePhone || '';
    }

    if (addressInvoice.value) {
      checkoutCustomer.value.invoiceAddress.address =
        addressInvoice.value.Address1 || '';
      checkoutCustomer.value.invoiceAddress.city =
        addressInvoice.value.City || '';
      checkoutCustomer.value.invoiceAddress.postalCode =
        addressInvoice.value.Postcode || '';
      checkoutCustomer.value.invoiceAddress.country =
        addressInvoice.value.CountryIsoCode || '';
      checkoutCustomer.value.invoiceAddress.firstname =
        addressInvoice.value.Firstname || '';
      checkoutCustomer.value.invoiceAddress.lastname =
        addressInvoice.value.Lastname || '';
      checkoutCustomer.value.invoiceAddress.phone =
        addressInvoice.value.MobilePhone || '';
    }


  }
};

onMounted(() => {
  setCheckouCustomer();
  updateShipping({ idCarrier: 0 }).then(() => {
    removeCarrier();
  });
});

watch(checkoutCustomer.value.invoiceAddress, () => {
  if (checkoutDeliveryOption.value !== 'home') {
    checkoutCustomer.value.deliveryAddress.address =
      checkoutCustomer.value.invoiceAddress.address;

    checkoutCustomer.value.deliveryAddress.city =
      checkoutCustomer.value.invoiceAddress.city;

    checkoutCustomer.value.deliveryAddress.postalCode =
      checkoutCustomer.value.invoiceAddress.postalCode;

    checkoutCustomer.value.deliveryAddress.country =
      checkoutCustomer.value.invoiceAddress.country;

    checkoutCustomer.value.deliveryAddress.phone =
      checkoutCustomer.value.invoiceAddress.phone;

    checkoutCustomer.value.deliveryAddress.firstname =
      checkoutCustomer.value.invoiceAddress.firstname;

    checkoutCustomer.value.deliveryAddress.lastname =
      checkoutCustomer.value.invoiceAddress.lastname;
  }
});

watch(state.value, () => {
  if (checkoutDeliveryOption.value !== 'home') {
    checkoutCustomer.value.deliveryAddress.email = state.value.email;
  }
});
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
              :class="{ selected: checkoutDeliveryOption === 'home' }"
              @click="setDelivredOption('home')"
            >
              <InputRadio
                id="do-home"
                value="home"
                v-model="checkoutDeliveryOption"
                class="!absolute top-4 left-4"
              />
              <span>
                {{ $t('tunnel.delivery.home') }}
              </span>
              <IconDeliveryTruckSpeed :size="2.5" />
            </div>
            <div
              class="deliveryOptions-item"
              :class="{ selected: checkoutDeliveryOption === 'relayPoint' }"
              @click="setDelivredOption('relayPoint')"
            >
              <InputRadio
                id="do-relayPoint"
                value="relayPoint"
                v-model="checkoutDeliveryOption"
                class="!absolute top-4 left-4"
              />
              <span>
                {{ $t('tunnel.delivery.relayPoint') }}
              </span>
              <IconLocation :size="2.5" />
            </div>
            <div
              class="deliveryOptions-item"
              :class="{ selected: checkoutDeliveryOption === 'store' }"
              @click="setDelivredOption('store')"
            >
              <InputRadio
                id="do-store"
                value="store"
                v-model="checkoutDeliveryOption"
                class="!absolute top-4 left-4"
              />
              <span>
                {{ $t('tunnel.delivery.store') }}
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

          <div v-if="checkoutDeliveryOption === 'home'">
            <BaseHeadLine size="md" class="uppercase font-medium mb-3">
              {{ $t('label.address_delivery') }} :
            </BaseHeadLine>
            <PageCheckoutGuest
              class="mb-5"
              hideEmail
              @onFormChange="handalFormGuestChange($event)"
            />
            <!-- Shipping option -->
            <BaseHeadLine size="md" class="uppercase font-medium">
              {{ $t('label.shippingOption.title') }} :
            </BaseHeadLine>
            <FormShipping :displayOptions="'Home'" />
          </div>

          <div v-if="checkoutDeliveryOption !== 'home'">
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

            <FormShipping
              :displayOptions="
                checkoutDeliveryOption === 'relayPoint' ? 'RelayPoint' : 'Store'
              "
            />
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
        class="flex lg:hidden fixed bottom-0 w-full border-t border-black bg-white py-3 px-5 z-10"
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
