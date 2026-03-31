<script setup lang="ts">
const formInvoiceStore = useFormInvoiceStore();
const { state, v$ } = toRefs(formInvoiceStore);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const countriesOptions = computed(() =>
  countries.value.map((c) => ({
    label: c.CountryName,
    value: c.CountryIsoCode,
  }))
);

const isDrawerOpen = ref(false);

const handleSelectAddress = (details: {
  courtAddress: string;
  postalCode: string;
  countryIso: string;
  city: string;
}) => {
  state.value.courtAddress = details.courtAddress;
  state.value.address = details.courtAddress;
  state.value.postcode = details.postalCode;
  state.value.country = details.countryIso;
  state.value.city = details.city;
};

const checkoutStore = useCheckoutStore();
const { checkoutCustomer } = toRefs(checkoutStore);

const openDrawer = () => {
  isDrawerOpen.value = true;
};

watch(
  state,
  () => {
    checkoutCustomer.value.invoiceAddress.firstname = state.value.firstname;
    checkoutCustomer.value.invoiceAddress.lastname = state.value.name;
    checkoutCustomer.value.invoiceAddress.address = state.value.address;
    checkoutCustomer.value.invoiceAddress.city = state.value.city;
    checkoutCustomer.value.invoiceAddress.phone = state.value.phone;
    checkoutCustomer.value.invoiceAddress.postalCode = state.value.postcode;
    checkoutCustomer.value.invoiceAddress.country = state.value.country;
    checkoutCustomer.value.invoiceAddress.company = state.value.company;
    checkoutCustomer.value.invoiceAddress.state = state.value.state;
  },
  { deep: true }
);
</script>

<template>
  <div class="flex flex-col gap-0">
    <h2 class="section-title mb-4">{{ $t('titles.invoice_address') }} :</h2>

    <div class="grid grid-cols-2 gap-x-4">
      <InputText
        id="invoice-firstname"
        v-model="state.firstname"
        type="text"
        :errors="v$.firstname?.$errors"
        :required="true"
        :label="$t('label.firstname')"
        border
      />
      <InputText
        id="invoice-name"
        v-model="state.name"
        type="text"
        :errors="v$.name?.$errors"
        :required="true"
        :label="$t('label.name')"
        border
      />
    </div>

    <InputText
      id="invoice-phone"
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
      <IconChevronRight class="chevron" />
    </div>
    <div v-if="v$.address?.$error" class="error-msg">
      {{ v$.address?.$errors[0]?.$message }}
    </div>

    <!-- Drawer for Address Selection -->
    <BaseDrawer v-model="isDrawerOpen" position="left" size="500px">
      <template #header>
        <div class="drawer-title uppercase font-bold text-lg">
          {{ $t('titles.invoice_address') }} ({{ $t('label.main_address') }})
        </div>
      </template>

      <div class="drawer-form space-y-4 pt-4">
        <InputGoogoleAutoComplete
          v-model="state.address"
          id="invoice-address-drawer"
          :errors="v$.address?.$errors || []"
          :label="$t('label.main_address')"
          :required="true"
          @onSelect="handleSelectAddress"
          border
        />

        <div class="grid grid-cols-2 gap-4">
          <InputText
            id="invoice-city-drawer"
            v-model="state.city"
            :errors="v$.city?.$errors"
            :required="true"
            :label="$t('label.city')"
            border
          />
          <InputText
            id="invoice-postcode-drawer"
            v-model="state.postcode"
            :errors="v$.postcode?.$errors"
            :required="true"
            :label="$t('label.postcode')"
            border
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <InputText
            id="invoice-state-drawer"
            v-model="state.state"
            :label="$t('label.state')"
            border
          />
          <InputSelect
            id="invoice-country-drawer"
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
          id="invoice-company-drawer"
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
  @apply border border-gray-888 bg-white rounded-sm  cursor-pointer 
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
