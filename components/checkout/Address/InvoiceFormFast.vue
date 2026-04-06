<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const formInvoiceFastStore = useFormInvoiceFastStore();
const { state, v$ } = storeToRefs(formInvoiceFastStore);

const { t } = useI18n();

const { title, address, hasBackButton } = defineProps<{
  title?: string;
  address?: AddressType;
  hasBackButton?: boolean;
}>();

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, hasSameAddressForShipping } =
  storeToRefs(checkoutStore);

const auth = useAuth();
const { isLoggedIn, isGuest, customer } = toRefs(auth);

const addressStore = useAddressStore();
const { addAddress, updateAddress, fetchAddresses } = addressStore;
const { addressInvoice } = toRefs(addressStore);

if (address) {
  state.value.firstname = address.Firstname || '';
  state.value.name = address.Lastname || '';
  state.value.phone = address.MobilePhone || '';
  state.value.address = address.Address1 || '';
  state.value.postcode = address.Postcode || '';
  state.value.city = address.City || '';
  state.value.country = address.CountryIsoCode || '';
  state.value.state = address.StateName || '';
  state.value.company = address.Company || '';
}

const drawerVisible = ref(false);

const emit = defineEmits(['onBack']);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const showFields = () => {};

const countriesOptions = computed(() => {
  return countries.value.map((country: any) => ({
    label: country.CountryName,
    value: country.CountryIsoCode,
  }));
});

const handleSelectAddress = (details: {
  address: string;
  courtAddress: string;
  postalCode: string;
  country: string;
  city: string;
  countryIso: string;
  stateName?: string;
  stateCode?: string;
}) => {
  showFields();

  state.value.courtAddress = details.courtAddress;
  state.value.address = details.courtAddress;
  state.value.postcode = details.postalCode;
  state.value.country = details.countryIso;
  state.value.city = details.city;
  state.value.state = details.stateName || details.stateCode || '';
};

const setAddressToCheckout = () => {
  checkoutCustomer.value.invoiceAddress.address =
    state.value.courtAddress || state.value.address;
  checkoutCustomer.value.invoiceAddress.postalCode = state.value.postcode;
  checkoutCustomer.value.invoiceAddress.city = state.value.city;
  checkoutCustomer.value.invoiceAddress.country = state.value.country;
  checkoutCustomer.value.invoiceAddress.state = state.value.state;
  checkoutCustomer.value.invoiceAddress.company = state.value.company;
  checkoutCustomer.value.invoiceAddress.phone = state.value.phone;
  checkoutCustomer.value.invoiceAddress.firstname = state.value.firstname;
  checkoutCustomer.value.invoiceAddress.lastname = state.value.name;

  if (isLoggedIn.value) {
    state.value.firstname = customer.value?.Firstname || '';
    state.value.name = customer.value?.Lastname || '';
  }
};

const errorAddress = computed(() => {
  return (
    v$.value.address.$error ||
    v$.value.city.$error ||
    v$.value.country.$error ||
    v$.value.postcode.$error
  );
});

// const addressCookie = useCookie('FORM_ADDRESS_FAST_INVOICE', {
//   maxAge: 60 * 60 * 24 * 1,
// });

watch(
  state,
  (newState) => {
    // addressCookie.value = JSON.stringify(newState);
    setAddressToCheckout();
  },
  { deep: true }
);

watch(
  () => hasSameAddressForShipping.value,
  (value) => {},
  { immediate: true }
);

const initForm = () => {
  // if (addressCookie.value) {
  //   try {
  //     const parsedCookie =
  //       typeof addressCookie.value === 'string'
  //         ? JSON.parse(addressCookie.value)
  //         : addressCookie.value;

  //     state.value = { ...state.value, ...parsedCookie };
  //     setAddressToCheckout();
  //   } catch {
  //     addressCookie.value = null;
  //   }
  // }
  setAddressToCheckout();
};

onMounted(() => {
  initForm();
});
</script>

<template>
  <div id="invoice-fast-form" class="formAddress js-invoice-fast-form">
    <div class="formAddress-header">
      <span v-if="hasBackButton" @click="emit('onBack')" class="icon-back">
        <IconArrowLeft :size="1.4" />
      </span>
      <h2 class="text-sm font-normal normal-case">
        {{ title || $t('label.address') }}
      </h2>
    </div>
    <form class="formAddress-form">
      <div class="grid grid-cols-2 gap-x-3">
        <!-- <div >
          <InputText
            id="email"
            v-model="state.email"
            type="email"
            :errors="v$.email?.$errors"
            :required="true"
            :label="$t('label.email')"
            border
          />
        </div> -->
        <div class="col-span-1">
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
        <div class="col-span-1">
          <InputText
            id="firstname"
            v-model="state.firstname"
            type="text"
            :errors="v$.firstname?.$errors"
            :required="true"
            :label="$t('label.firstname')"
            border
          />
        </div>
        <div class="col-span-2">
          <InputText
            id="phone"
            v-model="state.phone"
            type="tel"
            :errors="v$.phone?.$errors"
            :required="true"
            :label="$t('label.phone')"
            border
          />
        </div>

        <div class="col-span-2">
          <div
            class="address-selector"
            :class="{
              'has-errors': errorAddress,
              'has-value': state.address,
            }"
            @click="drawerVisible = true"
          >
            <div v-if="state.address" class="selected-address">
              <div class="address-label">{{ $t('label.address') }}*</div>
              <div class="address-value">
                {{ state.address }}, {{ state.postcode }} {{ state.city }}
              </div>
            </div>
            <div v-else class="address-placeholder">
              {{ $t('label.address') }}*
            </div>
          </div>
          <div v-if="errorAddress" class="text-red-500 text-xxs -mt-3 mb-3">
            {{
              v$.address.$errors[0]?.$message ||
              v$.city.$errors[0]?.$message ||
              v$.country.$errors[0]?.$message ||
              v$.postcode.$errors[0]?.$message
            }}
          </div>
        </div>
      </div>

      <BaseDrawer
        v-model="drawerVisible"
        size="100%"
        maxSize="600px"
        position="left"
        :closeButton="false"
        class="sideMenu-drawer"
        bodyPadding="1rem"
      >
        <template #header>
          <div class="drawer-title uppercase font-bold text-lg">
            {{ title || $t('label.address') }}
          </div>
        </template>
        <div class="grid grid-cols-2 gap-x-3">
          <div class="col-span-2">
            <InputGoogoleAutoComplete
              v-model="state.address"
              id="address"
              :errors="v$.address?.$errors"
              :label="$t('label.address')"
              :required="true"
              @onSelect="handleSelectAddress"
              border
            />
          </div>
          <div class="col-span-1">
            <InputText
              id="postcode"
              v-model="state.postcode"
              type="text"
              :errors="v$.postcode?.$errors"
              :required="true"
              :label="$t('label.postcode')"
              border
            />
          </div>
          <div class="col-span-1">
            <InputText
              id="city"
              v-model="state.city"
              type="text"
              :errors="v$.city?.$errors"
              :required="true"
              :label="$t('label.city')"
              border
            />
          </div>

          <div class="col-span-1">
            <InputSelect
              id="country"
              v-model="state.country"
              type="text"
              :errors="v$.country?.$errors"
              :label="$t('label.country')"
              :selectOptions="countriesOptions"
              :required="true"
              :key="state.country"
              searchable
              border
            />
          </div>
          <div class="col-span-1">
            <InputText
              id="state-drawer"
              v-model="state.state"
              :label="$t('label.state')"
              border
            />
          </div>

          <div class="col-span-1">
            <InputText
              id="company-drawer"
              v-model="state.company"
              :label="$t('label.company')"
              border
            />
          </div>
        </div>
        <div class="flex gap-3 mt-3">
          <BaseButton
            type="primary"
            size="medium"
            @click="drawerVisible = false"
            plain
            class="w-full"
          >
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton
            type="primary"
            size="medium"
            @click="drawerVisible = false"
            class="w-full"
          >
            {{ $t('button.ok') }}
          </BaseButton>
        </div>
      </BaseDrawer>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.address-selector {
  @apply border border-gray-888 bg-white rounded-sm cursor-pointer
  flex items-center justify-between transition-colors
  p-[11px_12px] h-[44px] mb-3 lg:mb-4;

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
.formAddress {
  @apply border border-zinc-200 p-3 bg-white;
  &-header {
    @apply flex items-center gap-x-2 -mx-3 px-3 pb-3 border-b border-zinc-200 mb-3;
    .icon-back {
      @apply cursor-pointer block h-[1.4em];
    }
  }
}
</style>
