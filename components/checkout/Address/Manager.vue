<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';
import { useOneCheckoutStore } from '~/stores/api-stores/OneCheckoutStore';

const { t } = useI18n();

const addressStore = useAddressStore();
const { addresses, addressDelivery, addressInvoice } = toRefs(addressStore);
const { addAddress, updateAddress } = addressStore;

const checkoutStore = useCheckoutStore();
const {
  checkoutCustomer,
  checkoutCarrier,
  checkoutDeliveryOption,
  hasSameAddressForShipping,
} = toRefs(checkoutStore);
const { refreshPaymentMethods } = checkoutStore;

const shippingStore = useShippingStore();
const {
  carrier: allCarriers,
  carriers: shippingCarriers,
  relayPointSelected,
} = toRefs(shippingStore);
const { fetchShipping, fetchRelayPoints } = shippingStore;

const cartStore = useCartStore();
const { cartId, cart, isDigitalOnly } = toRefs(cartStore);
const { updateShipping, removeCarrier } = cartStore;
const ip = useIp();

const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const oneCheckoutStore = useOneCheckoutStore();
const { selectedAddressId, isAddressFormOpen, isAddressListOpen } =
  toRefs(oneCheckoutStore);
const {
  initializeAddressState,
  selectAddress,
  openAddressForm,
  closeAddressForm,
  toggleAddressList,
} = oneCheckoutStore;

const isDrawerOpen = ref(false);
const useDifferentBillingAddress = ref(false);
const selectedInvoiceAddressId = ref<number | null>(null);
const isInvoiceAddressListOpen = ref(false);

const countriesOptions = computed(() =>
  countries.value.map((country) => ({
    label: country.CountryName,
    value: country.CountryIsoCode,
  }))
);

const resolveCountryIso = (address: AddressType) => {
  if (address.CountryIsoCode) {
    return address.CountryIsoCode;
  }

  if (!address.Country) {
    return '';
  }

  const countryByName = countries.value.find(
    (country) => country.CountryName === address.Country
  );

  return countryByName?.CountryIsoCode || address.Country;
};

const selectedAddress = computed(() => {
  if (!addresses.value.length) {
    return null;
  }

  return (
    addresses.value.find(
      (address) => address.IdAddress === selectedAddressId.value
    ) ||
    addressDelivery.value ||
    addresses.value[0] ||
    null
  );
});

const fullName = (address: AddressType) => {
  return [address.Firstname, address.Lastname].filter(Boolean).join(' ');
};

const hydrateDeliveryAddressFromAddress = (address: AddressType) => {
  checkoutCustomer.value.deliveryAddress.firstname = address.Firstname || '';
  checkoutCustomer.value.deliveryAddress.lastname = address.Lastname || '';
  checkoutCustomer.value.deliveryAddress.address = address.Address1 || '';
  checkoutCustomer.value.deliveryAddress.city = address.City || '';
  checkoutCustomer.value.deliveryAddress.phone =
    address.MobilePhone || address.Phone || '';
  checkoutCustomer.value.deliveryAddress.postalCode = address.Postcode || '';
  checkoutCustomer.value.deliveryAddress.country = resolveCountryIso(address);
  checkoutCustomer.value.deliveryAddress.state =
    address.StateName || address.StateCode || '';
  checkoutCustomer.value.deliveryAddress.email = customer.value?.Email || '';
};

const hydrateInvoiceAddressFromAddress = (address: AddressType) => {
  checkoutCustomer.value.invoiceAddress.firstname = address.Firstname || '';
  checkoutCustomer.value.invoiceAddress.lastname = address.Lastname || '';
  checkoutCustomer.value.invoiceAddress.address = address.Address1 || '';
  checkoutCustomer.value.invoiceAddress.city = address.City || '';
  checkoutCustomer.value.invoiceAddress.phone =
    address.MobilePhone || address.Phone || '';
  checkoutCustomer.value.invoiceAddress.postalCode = address.Postcode || '';
  checkoutCustomer.value.invoiceAddress.country = resolveCountryIso(address);
  checkoutCustomer.value.invoiceAddress.state =
    address.StateName || address.StateCode || '';
};

const populateFormDefaults = () => {
  state.value.firstname = customer.value?.Firstname || '';
  state.value.name = customer.value?.Lastname || '';
  state.value.email =
    customer.value?.Email || checkoutCustomer.value.deliveryAddress.email || '';
  state.value.phone = '';
  state.value.address = '';
  state.value.courtAddress = '';
  state.value.postcode = '';
  state.value.city = '';
  state.value.country = '';
  state.value.state = '';
  state.value.company = '';
  v$.value.$reset();
};

const handleSelectAddress = (details: {
  courtAddress: string;
  postalCode: string;
  countryIso: string;
  city: string;
  stateName?: string;
  stateCode?: string;
}) => {
  state.value.courtAddress = details.courtAddress;
  state.value.address = details.courtAddress;
  state.value.postcode = details.postalCode;
  state.value.country = details.countryIso;
  state.value.city = details.city;
  state.value.state = details.stateName || details.stateCode || '';
};

const mapCarrierTypeToOption = (
  carrierType: 'Home' | 'RelayPoint' | 'Store'
) => {
  if (carrierType === 'RelayPoint') return 'relayPoint';
  if (carrierType === 'Store') return 'store';
  return 'home';
};

const loadFirstCarrierForSelectedAddress = async () => {
  if (isDigitalOnly.value) {
    return;
  }

  const delivery = checkoutCustomer.value.deliveryAddress;
  if (
    !delivery.address ||
    !delivery.postalCode ||
    !delivery.city ||
    !delivery.country
  ) {
    return;
  }

  if (!cartId.value) {
    await cartStore.fetchCart();
  }

  if (!cartId.value) {
    return;
  }

  const shippingOptions = {
    Postcode: delivery.postalCode,
    City: delivery.city,
    Address1: delivery.address,
    Country: delivery.country,
    IP: (ip.value as string) || '',
  };

  await fetchShipping(shippingOptions);

  const firstCarrierType = shippingCarriers.value?.[0] as
    | 'Home'
    | 'RelayPoint'
    | 'Store'
    | undefined;

  if (!firstCarrierType) {
    await updateShipping({ idCarrier: 0 });
    removeCarrier();
    checkoutCarrier.value.carrier = null;
    checkoutCarrier.value.relayPoint = null;
    relayPointSelected.value = null;
    return;
  }

  const firstCarrier = allCarriers.value[firstCarrierType]?.[0];
  if (!firstCarrier?.IdCarrier) {
    await updateShipping({ idCarrier: 0 });
    removeCarrier();
    checkoutCarrier.value.carrier = null;
    checkoutCarrier.value.relayPoint = null;
    relayPointSelected.value = null;
    return;
  }

  checkoutDeliveryOption.value = mapCarrierTypeToOption(firstCarrierType);

  const updateOptions: { idCarrier: number; IdRelayPoint?: string } = {
    idCarrier: firstCarrier.IdCarrier,
  };

  if (firstCarrierType === 'RelayPoint' || firstCarrierType === 'Store') {
    const relayPoints = await fetchRelayPoints({
      ...shippingOptions,
      IdCarrier: firstCarrier.IdCarrier,
    });
    const firstRelayPoint = relayPoints?.[0];
    if (firstRelayPoint?.Id) {
      updateOptions.IdRelayPoint = firstRelayPoint.Id;
      relayPointSelected.value = firstRelayPoint;
      checkoutCarrier.value.relayPoint = firstRelayPoint;
    }
  } else {
    relayPointSelected.value = null;
    checkoutCarrier.value.relayPoint = null;
  }

  await updateShipping(updateOptions);
  await cartStore.fetchCart();
  checkoutCarrier.value.carrier = cart.value?.Shipping?.Carrier || null;

  await refreshPaymentMethods(shippingOptions).catch(() => {
    // keep checkout usable if payment endpoint fails
  });
};

const setDeliveryAddress = async (address: AddressType) => {
  if (!address.IdAddress) {
    return;
  }

  await updateAddress({
    ...address,
    IsDelivery: true,
  });

  selectAddress(address.IdAddress);
  hydrateDeliveryAddressFromAddress(address);
  if (!useDifferentBillingAddress.value) {
    hydrateInvoiceAddressFromAddress(address);
  }

  await loadFirstCarrierForSelectedAddress();
};

const selectedInvoiceAddress = computed(() => {
  if (!addresses.value.length) {
    return null;
  }

  return (
    addresses.value.find(
      (address) => address.IdAddress === selectedInvoiceAddressId.value
    ) ||
    addressInvoice.value ||
    addressDelivery.value ||
    addresses.value[0] ||
    null
  );
});

const setInvoiceAddress = async (address: AddressType) => {
  if (!address.IdAddress) {
    return;
  }

  await updateAddress({
    ...address,
    IsInvoice: true,
  });

  selectedInvoiceAddressId.value = address.IdAddress;
  isInvoiceAddressListOpen.value = false;
  hydrateInvoiceAddressFromAddress(address);
};

const onAddressCreated = (addressId: number) => {
  selectAddress(addressId);
  closeAddressForm();
};

const saveAddress = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  const addressToCreate: AddressType = {
    Firstname: state.value.firstname,
    Lastname: state.value.name,
    Address1: state.value.courtAddress || state.value.address,
    Postcode: state.value.postcode,
    City: state.value.city,
    CountryIsoCode: state.value.country,
    StateName: state.value.state,
    Company: state.value.company,
    MobilePhone: state.value.phone,
    IsDelivery: true,
    IsInvoice: true,
  };

  const createdAddress = await addAddress(addressToCreate);

  if (createdAddress?.IdAddress) {
    onAddressCreated(createdAddress.IdAddress);
  } else {
    closeAddressForm();
  }

  hydrateDeliveryAddressFromAddress(addressToCreate);
  if (!useDifferentBillingAddress.value) {
    hydrateInvoiceAddressFromAddress(addressToCreate);
  }

  await loadFirstCarrierForSelectedAddress();
};

watch(
  selectedAddress,
  async (address) => {
    if (address) {
      hydrateDeliveryAddressFromAddress(address);
      if (!useDifferentBillingAddress.value) {
        hydrateInvoiceAddressFromAddress(address);
      }

      if (checkoutCarrier.value.carrier?.IdCarrier) {
        await refreshPaymentMethods().catch(() => {
          // keep checkout usable if payment endpoint fails
        });
      }
    }
  },
  { immediate: true }
);

watch(
  selectedInvoiceAddress,
  (address) => {
    if (address && useDifferentBillingAddress.value) {
      hydrateInvoiceAddressFromAddress(address);
    }
  },
  { immediate: true }
);

watch(isAddressFormOpen, (opened) => {
  if (opened) {
    populateFormDefaults();
  }
});

watch(useDifferentBillingAddress, (enabled) => {
  hasSameAddressForShipping.value = !enabled;
  if (!enabled && selectedAddress.value) {
    hydrateInvoiceAddressFromAddress(selectedAddress.value);
  }
});

watch(
  () => [
    addresses.value,
    addressDelivery.value?.IdAddress,
    addressInvoice.value?.IdAddress,
  ],
  () => {
    initializeAddressState(addresses.value, addressDelivery.value?.IdAddress);

    if (!addresses.value.length) {
      selectedInvoiceAddressId.value = null;
      return;
    }

    const defaultInvoiceAddress =
      addresses.value.find((address) => address.IsInvoice) ||
      addresses.value.find((address) => address.IsDelivery) ||
      addresses.value[0] ||
      null;

    if (
      !selectedInvoiceAddressId.value ||
      !addresses.value.some(
        (address) => address.IdAddress === selectedInvoiceAddressId.value
      )
    ) {
      selectedInvoiceAddressId.value = defaultInvoiceAddress?.IdAddress || null;
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  useDifferentBillingAddress.value = false;
  hasSameAddressForShipping.value = true;
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="selectedAddress && !isAddressFormOpen">
      <div class="flex items-center justify-between mb-1">
        <h2 class="font-bold text-lg lowercase first-letter:uppercase">
          {{ t('label.address_delivery') }} :
        </h2>
        <button
          type="button"
          class="underline text-sm font-semibold hover:text-black transition-colors"
          @click="openAddressForm"
        >
          {{ t('button.add_new_address') }}
        </button>
      </div>

      <div
        class="border border-zinc-200 p-4 bg-white flex flex-wrap sm:flex-nowrap justify-between items-center sm:items-end"
      >
        <div class="space-y-0.5">
          <p class="font-bold text-sm">
            {{ fullName(selectedAddress) }}
          </p>
          <p class="text-sm text-zinc-900">
            {{ selectedAddress.Address1 }}
          </p>
          <p class="text-sm text-zinc-900">
            {{ selectedAddress.Postcode }}
          </p>
          <p class="text-sm text-zinc-900 capitalize">
            {{ selectedAddress.Country || selectedAddress.CountryIsoCode }}
          </p>
        </div>
        <button
          type="button"
          class="w-full sm:w-auto mt-3 sm:mt-0 px-4 py-2 bg-zinc-200 sm:bg-transparent underline sm:no-underline text-sm font-bold hover:text-zinc-600 transition-colors rounded-sm text-center"
          @click="toggleAddressList"
        >
          {{ t('button.modify') }}
        </button>
      </div>

      <button
        v-if="addresses.length > 1"
        type="button"
        class="underline text-xs block hover:text-zinc-600 transition-colors mt-1"
        @click="toggleAddressList"
      >
        {{ t('button.select_another_address') }}
      </button>

      <div class="pt-1 mt-3">
        <InputCheckBox
          id="different-billing-address"
          v-model="useDifferentBillingAddress"
        >
          <span class="text-sm text-zinc-600">{{
            t('label.use_different_billing_address')
          }}</span>
        </InputCheckBox>
      </div>

      <transition name="slide">
        <div v-if="useDifferentBillingAddress" class="mt-4 space-y-3">
          <div class="border border-zinc-200 p-4 bg-white">
            <h3 class="font-bold text-sm mb-2">
              {{ t('titles.invoice_address') }} :
            </h3>
            <p class="font-medium text-sm">
              {{
                selectedInvoiceAddress
                  ? fullName(selectedInvoiceAddress)
                  : fullName(selectedAddress)
              }}
            </p>
            <p class="text-sm text-zinc-700">
              {{ (selectedInvoiceAddress || selectedAddress)?.Address1 }}
            </p>
            <p class="text-sm text-zinc-700">
              {{ (selectedInvoiceAddress || selectedAddress)?.Postcode }}
              {{ (selectedInvoiceAddress || selectedAddress)?.City }}
            </p>
          </div>

          <button
            type="button"
            class="underline text-xs font-bold"
            v-if="addresses.length > 1"
            @click="isInvoiceAddressListOpen = !isInvoiceAddressListOpen"
          >
            {{ t('button.select_another_address') }}
          </button>

          <div v-if="isInvoiceAddressListOpen" class="space-y-2">
            <button
              v-for="address in addresses"
              :key="`invoice-${address.IdAddress}`"
              type="button"
              class="w-full text-left border border-zinc-200 bg-white px-3 py-2 text-sm hover:border-black transition-colors"
              @click="setInvoiceAddress(address)"
            >
              <p class="font-medium">{{ fullName(address) }}</p>
              <p>{{ address.Address1 }}</p>
              <p>{{ address.Postcode }} {{ address.City }}</p>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <div
      v-if="isAddressListOpen && !isAddressFormOpen"
      class="border border-zinc-200 rounded-md p-4 bg-white space-y-2"
    >
      <button
        v-for="address in addresses"
        :key="address.IdAddress"
        type="button"
        class="w-full text-left border rounded px-3 py-2 text-sm hover:border-black transition-colors"
        @click="setDeliveryAddress(address)"
      >
        <p class="font-medium">{{ fullName(address) }}</p>
        <p>{{ address.Address1 }}</p>
        <p>{{ address.Postcode }} {{ address.City }}</p>
      </button>
    </div>

    <div
      v-if="isAddressFormOpen"
      class="border border-zinc-200 rounded-md p-4 bg-white"
    >
      <div class="grid grid-cols-2 gap-x-4">
        <InputText
          id="checkout-address-firstname"
          v-model="state.firstname"
          type="text"
          :errors="v$.firstname?.$errors"
          :required="true"
          :label="t('label.firstname')"
          border
        />
        <InputText
          id="checkout-address-name"
          v-model="state.name"
          type="text"
          :errors="v$.name?.$errors"
          :required="true"
          :label="t('label.name')"
          border
        />
      </div>

      <InputText
        id="checkout-address-phone"
        v-model="state.phone"
        type="tel"
        :errors="v$.phone?.$errors"
        :required="true"
        :label="t('label.phone_mobile')"
        border
      />

      <div
        class="address-selector"
        :class="{
          'has-errors': v$.address?.$error,
          'has-value': state.address,
        }"
        @click="isDrawerOpen = true"
      >
        <div v-if="state.address" class="selected-address">
          <div class="address-label">{{ t('label.address') }}*</div>
          <div class="address-value">
            {{ state.address }}, {{ state.postcode }} {{ state.city }}
          </div>
        </div>
        <div v-else class="address-placeholder">{{ t('label.address') }}*</div>
      </div>
      <div v-if="v$.address?.$error" class="error-msg">
        {{ v$.address?.$errors[0]?.$message }}
      </div>

      <div class="flex gap-4 w-full mt-4">
        <BaseButton
          class="flex-1"
          type="primary"
          plain
          @click="closeAddressForm"
        >
          {{ t('button.cancel') }}
        </BaseButton>
        <BaseButton class="flex-1" type="primary" @click="saveAddress">
          {{ t('button.save') }}
        </BaseButton>
      </div>

      <BaseDrawer v-model="isDrawerOpen" position="left" size="500px">
        <template #header>
          <div class="drawer-title uppercase font-bold text-lg">
            {{ t('label.address_delivery') }}
          </div>
        </template>

        <div class="drawer-form space-y-4 pt-4">
          <InputGoogoleAutoComplete
            v-model="state.address"
            id="address-drawer"
            :errors="v$.address?.$errors || []"
            :label="t('label.address')"
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
              :label="t('label.city')"
              border
            />
            <InputText
              id="postcode-drawer"
              v-model="state.postcode"
              :errors="v$.postcode?.$errors"
              :required="true"
              :label="t('label.postcode')"
              border
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <InputText
              id="state-drawer"
              v-model="state.state"
              :label="t('label.state')"
              border
            />
            <InputSelect
              id="country-drawer"
              v-model="state.country"
              :errors="v$.country?.$errors"
              :label="t('label.country')"
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
            label="Company"
            border
          />

          <div class="flex gap-4 w-full">
            <BaseButton
              class="flex-1"
              type="primary"
              plain
              @click="isDrawerOpen = false"
            >
              {{ t('button.cancel') }}
            </BaseButton>
            <BaseButton
              class="flex-1"
              type="primary"
              @click="isDrawerOpen = false"
            >
              {{ t('button.save') }}
            </BaseButton>
          </div>
        </div>
      </BaseDrawer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-selector {
  @apply border border-gray-888 bg-white rounded-sm cursor-pointer
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
