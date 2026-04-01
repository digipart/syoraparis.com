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

const isDrawerOpen = ref(false);

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

const openDrawer = () => {
  isDrawerOpen.value = true;
};
</script>

<template>
  <div class="checkout-box">
    <h2 class="section-title mb-4 font-semibold text-sm uppercase mb-4">
      {{
        isDigitalOnly
          ? $t('titles.my_informations')
          : $t('label.address_delivery')
      }}
      :
    </h2>

    <div class="grid grid-cols-2 gap-x-4">
      <InputText
        id="firstname"
        v-model="state.firstname"
        type="text"
        :errors="v$.firstname?.$errors"
        :required="true"
        :label="$t('label.firstname')"
        border
      />
      <InputText
        id="name"
        v-model="state.name"
        type="text"
        :errors="v$.name?.$errors"
        :required="true"
        :label="$t('label.name')"
        border
      />
    </div>

    <InputText
      id="phone"
      v-model="state.phone"
      type="tel"
      :errors="v$.phone?.$errors"
      :required="true"
      :label="$t('label.phone_mobile')"
      border
    />

    <!-- Address Div -->
    <div
      class="address-selector"
      :class="{ 'has-errors': v$.address?.$error, 'has-value': state.address }"
      @click="openDrawer"
    >
      <div v-if="state.address" class="selected-address">
        <div class="address-label">{{ $t('label.address') }}*</div>
        <div class="address-value">
          {{ state.address }}, {{ state.postcode }} {{ state.city }}
        </div>
      </div>
      <div v-else class="address-placeholder">{{ $t('label.address') }}*</div>
    </div>
    <div v-if="v$.address?.$error" class="error-msg">
      {{ v$.address?.$errors[0]?.$message }}
    </div>

    <!-- Drawer for Address Selection -->
    <BaseDrawer v-model="isDrawerOpen" position="left" size="500px">
      <template #header>
        <div class="drawer-title uppercase font-bold text-lg">
          {{ $t('label.address_delivery') }} ({{ $t('label.main_address') }})
        </div>
      </template>

      <div class="drawer-form space-y-4 pt-4">
        <InputGoogoleAutoComplete
          v-model="state.address"
          id="address-drawer"
          :errors="v$.address?.$errors || []"
          :label="$t('label.main_address')"
          :required="true"
          @onSelect="handleSelectAddress"
          border
        />

        <div class="grid grid-cols-2 gap-4">
          <InputText
            id="city-drawer"
            v-model="state.city"
            :errors="v$.city?.$errors"
            :required="true"
            :label="$t('label.city')"
            border
          />
          <InputText
            id="postcode-drawer"
            v-model="state.postcode"
            :errors="v$.postcode?.$errors"
            :required="true"
            :label="$t('label.postcode')"
            border
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <InputText
            id="state-drawer"
            v-model="state.state"
            :label="$t('label.state')"
            border
          />
          <InputSelect
            id="country-drawer"
            v-model="state.country"
            :errors="v$.country?.$errors"
            :label="$t('label.country')"
            :selectOptions="countriesOptions"
            :required="true"
            :key="state.country"
            border
            searchable
          />
        </div>

        <InputText
          id="company-drawer"
          v-model="state.company"
          :label="$t('label.company')"
          border
        />
        <div class="flex gap-4 w-full">
          <BaseButton
            class="flex-1"
            type="primary"
            plain
            @click="isDrawerOpen = false"
          >
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton
            class="flex-1"
            type="primary"
            @click="isDrawerOpen = false"
          >
            {{ $t('button.save') }}
          </BaseButton>
        </div>
      </div>
    </BaseDrawer>
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
