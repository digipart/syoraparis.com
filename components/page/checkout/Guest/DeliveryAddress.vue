<script setup lang="ts">
const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const cartStore = useCartStore();
const { isDigitalOnly } = toRefs(cartStore);

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

const openDrawer = () => {
  isDrawerOpen.value = true;
};
</script>

<template>
  <div class="checkout-box">
    <h2 class="section-title mb-4">
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
          {{ $t('label.address_delivery') }} (RUE ET NUMÉRO)
        </div>
      </template>

      <div class="drawer-form space-y-4 pt-4">
        <InputGoogoleAutoComplete
          v-model="state.address"
          id="address-drawer"
          :errors="v$.address?.$errors || []"
          label="Adresse principale (rue et numéro)*"
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
            label="Ville *"
            border
          />
          <InputText
            id="postcode-drawer"
            v-model="state.postcode"
            :errors="v$.postcode?.$errors"
            :required="true"
            label="Code postal *"
            border
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <InputText
            id="state-drawer"
            v-model="state.state"
            label="État/Province"
            border
          />
          <InputSelect
            v-if="state.country"
            id="country-drawer"
            v-model="state.country"
            :errors="v$.country?.$errors"
            label="Pays *"
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
          label="Entreprise"
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
  @apply border border-zinc-200 rounded-sm  cursor-pointer 
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
