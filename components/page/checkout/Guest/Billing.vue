<script setup lang="ts">
const formInvoiceStore = useFormInvoiceStore();
const { state, v$ } = toRefs(formInvoiceStore);

const checkoutStore = useCheckoutStore();
const { checkoutCustomer } = toRefs(checkoutStore);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const countriesOptions = computed(() =>
  countries.value.map((c) => ({ label: c.CountryName, value: c.CountryIsoCode }))
);

watch(state, () => {
  checkoutCustomer.value.invoiceAddress.firstname = state.value.firstname;
  checkoutCustomer.value.invoiceAddress.lastname = state.value.name;
  checkoutCustomer.value.invoiceAddress.address = state.value.address;
  checkoutCustomer.value.invoiceAddress.city = state.value.city;
  checkoutCustomer.value.invoiceAddress.phone = state.value.phone;
  checkoutCustomer.value.invoiceAddress.postalCode = state.value.postcode;
  checkoutCustomer.value.invoiceAddress.country = state.value.country;
}, { deep: true });
</script>

<template>
  <div class="flex flex-col gap-0">
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

    <InputGoogoleAutoComplete
      v-model="state.address"
      id="invoice-address"
      :errors="v$.address?.$errors"
      :label="$t('label.address')"
      :required="true"
      border
    />

    <div class="grid grid-cols-2 gap-x-4" v-if="state.city || state.postcode">
      <InputText
        id="invoice-postcode"
        v-model="state.postcode"
        type="text"
        :errors="v$.postcode?.$errors"
        :required="true"
        :label="$t('label.postcode')"
        border
      />
      <InputText
        id="invoice-city"
        v-model="state.city"
        type="text"
        :errors="v$.city?.$errors"
        :required="true"
        :label="$t('label.city')"
        border
      />
    </div>

    <InputSelect
      v-if="state.country"
      id="invoice-country"
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
</template>
