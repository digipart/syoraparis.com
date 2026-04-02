<script setup lang="ts">
const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const cartStore = useCartStore();
const { isDigitalOnly, cartId } = toRefs(cartStore);
const { updateShipping, removeCarrier } = cartStore;

const checkoutStore = useCheckoutStore();
const { fetchPaymentMethods } = checkoutStore;
const { checkoutCustomer, checkoutCarrier, checkoutDeliveryOption } =
  toRefs(checkoutStore);

const shippingStore = useShippingStore();
const {
  carrier: allCarriers,
  carriers: shippingCarriers,
  relayPointSelected,
} = toRefs(shippingStore);
const { fetchShipping, fetchRelayPoints } = shippingStore;

const countriesOptions = computed(() =>
  countries.value.map((c) => ({
    label: c.CountryName,
    value: c.CountryIsoCode,
  }))
);


const normalizeCountryIso = (countryValue?: string) => {
  const country = (countryValue || '').trim();
  if (!country) {
    return '';
  }

  if (country.length === 2) {
    return country;
  }

  const countryByName = countries.value.find(
    (entry) =>
      entry.CountryName?.toLowerCase() === country.toLowerCase() ||
      entry.CountryIsoCode?.toLowerCase() === country.toLowerCase()
  );

  return countryByName?.CountryIsoCode || country;
};

const resolveFirstCarrier = () => {
  const firstShippingType = shippingCarriers.value?.[0] as
    | 'Home'
    | 'RelayPoint'
    | 'Store'
    | undefined;

  if (!firstShippingType) {
    return null;
  }

  const firstCarrier = allCarriers.value[firstShippingType]?.[0];
  if (!firstCarrier?.IdCarrier) {
    return null;
  }

  return { type: firstShippingType, carrier: firstCarrier };
};

const handleSelectAddress = async (details: {
  courtAddress: string;
  postalCode: string;
  countryIso: string;
  city: string;
  stateName?: string;
  stateCode?: string;
  stateIsoCode?: string;
}) => {
  state.value.courtAddress = details.courtAddress;
  state.value.address = details.courtAddress;
  state.value.postcode = details.postalCode;
  state.value.country = details.countryIso;
  state.value.city = details.city;
  state.value.state = details.stateName || details.stateCode || '';

  checkoutCustomer.value.deliveryAddress.address = details.courtAddress;
  checkoutCustomer.value.deliveryAddress.postalCode = details.postalCode;
  checkoutCustomer.value.deliveryAddress.country = details.countryIso;
  checkoutCustomer.value.deliveryAddress.city = details.city;
  checkoutCustomer.value.deliveryAddress.state =
    details.stateName || details.stateCode || '';

  if (isDigitalOnly.value) {
    return;
  }

  try {
    if (!cartId.value) {
      await cartStore.fetchCart();
    }

    if (!cartId.value) {
      return;
    }

    const options = {
      Postcode: details.postalCode,
      City: details.city,
      Address1: details.courtAddress,
      Country: normalizeCountryIso(details.countryIso),
    };

    await fetchShipping(options);
    const firstCarrierData = resolveFirstCarrier();

    if (!firstCarrierData) {
      if (checkoutCarrier.value.carrier?.IdCarrier) {
        return;
      }

      await updateShipping({ idCarrier: 0 });
      removeCarrier();
      checkoutCarrier.value.carrier = null;
      return;
    }

    const firstCarrierType = firstCarrierData.type;
    const firstCarrier = firstCarrierData.carrier;

    checkoutDeliveryOption.value =
      firstCarrierType === 'RelayPoint'
        ? 'relayPoint'
        : firstCarrierType === 'Store'
          ? 'store'
          : 'home';

    const updateOptions: { idCarrier: number; IdRelayPoint?: string } = {
      idCarrier: firstCarrier.IdCarrier,
    };

    if (firstCarrierType === 'RelayPoint' || firstCarrierType === 'Store') {
      const relayPoints = await fetchRelayPoints({
        ...options,
        IdCarrier: firstCarrier.IdCarrier,
      });
      const firstRelayPoint = relayPoints?.[0];
      if (firstRelayPoint?.Id) {
        updateOptions.IdRelayPoint = firstRelayPoint.Id;
        relayPointSelected.value = firstRelayPoint;
        checkoutCarrier.value.relayPoint = firstRelayPoint;
      }
    }

    await updateShipping(updateOptions);
    await cartStore.fetchCart();
    // console.log(options);
    // try {
    //   const paymentMethods = await fetchPaymentMethods(options);
    //   console.log(paymentMethods);
    // } catch (_error) {
    //   console.error(_error);
    // }
    checkoutCarrier.value.carrier = cartStore.cart?.Shipping?.Carrier || null;
  } catch (_error) {
    await updateShipping({ idCarrier: 0 });
    removeCarrier();
    checkoutCarrier.value.carrier = null;
  }
};

const isEditing = ref(false);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    isEditing.value = false;
  }
};
</script>

<template>
  <div class="checkout-box">
    <h2 class="section-title mb-4 font-semibold text-sm uppercase">
      {{ isDigitalOnly ? $t('titles.my_informations') : $t('label.address_delivery') }}:
    </h2>

    <!-- View Mode: Show summary if address is filled and NOT editing -->
    <div v-if="state.address && !isEditing" class="text-xs flex flex-col gap-2 p-3 bg-white border border-zinc-200">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="font-bold lowercase mb-1">
            {{ state.firstname }} {{ state.name }}
          </div>
          <div class="text-zinc-600 leading-relaxed">
            {{ state.address }} <br />
            {{ state.postcode }} {{ state.city }} <br />
            {{ normalizeCountryIso(state.country) }}
          </div>
          <div
            class="font-extrabold cursor-pointer text-black mt-3 inline-block uppercase text-[11px]"
            @click="isEditing = true"
          >
            {{ $t('button.modify') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Mode: Show form if NOT filled or IS editing -->
    <div v-else class="edit-mode-container border border-zinc-400 p-4 bg-white">
      <div class="grid grid-cols-12 gap-x-4 gap-y-4">
        <div class="col-span-6">
          <InputText
            id="guest-firstname"
            v-model="state.firstname"
            :label="$t('label.firstname') + ' *'"
            :errors="v$.firstname.$errors"
            border
          />
        </div>
        <div class="col-span-6">
          <InputText
            id="guest-name"
            v-model="state.name"
            :label="$t('label.name') + ' *'"
            :errors="v$.name.$errors"
            border
          />
        </div>
        <div class="col-span-12">
          <InputText
            id="guest-phone"
            v-model="state.phone"
            :label="$t('label.phone_mobile') + ' *'"
            :errors="v$.phone.$errors"
            border
          />
        </div>
        <div class="col-span-12">
          <InputGoogoleAutoComplete
            v-model="state.address"
            id="guest-autocomplete"
            :errors="v$.address.$errors"
            :label="$t('label.address') + ' *'"
            @onSelect="handleSelectAddress"
            border
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="state.address" class="grid grid-cols-2 gap-x-3 mt-6">
        <button 
          class="border border-black py-3 text-sm font-bold uppercase hover:bg-zinc-50 transition-colors"
          @click="isEditing = false"
        >
          {{ $t('button.cancel') }}
        </button>
        <button 
          class="bg-black text-white py-3 text-sm font-bold uppercase hover:bg-zinc-800 transition-colors"
          @click="submitForm"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-selector {
  @apply border border-gray-888  bg-white rounded-sm  cursor-pointer 
  flex items-center justify-between transition-colors 
  p-[11px_12px] h-[44px];

  &:hover {
    @apply bg-zinc-50;
  }

  &.has-errors {
    @apply border-red-500;
  }

  .address-label {
    @apply text-xs text-zinc-500 uppercase mb-1;
  }
  .address-value {
    @apply text-xs font-medium;
  }
  .address-placeholder {
    @apply text-gray-777 text-sm;
  }
  .chevron {
    @apply text-zinc-400;
  }
  &.has-value {
    .address-label {
      @apply text-xxs;
    }
  }
}

.error-msg {
  @apply text-red-500 text-xs mt-2 ml-1;
}

.drawer-form {
  @apply px-1;
}
</style>
