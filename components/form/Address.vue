<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';
const { state, v$ } = useFormAddressValidation();

const { address, inputBorder } = defineProps({
  address: {
    type: {} as PropType<AddressType>,
  },
  inputBorder: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onAddressCreated', 'onAddressEdited', 'cancel']);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const addressStore = useAddressStore();
const { addAddress, updateAddress } = addressStore;
const { addresses } = toRefs(addressStore);

const countriesOptions = computed(() => {
  return countries.value.map((country) => ({
    label: country.CountryName,
    value: country.CountryIsoCode,
  }));
});
const createAddress = () => {
  const address = {} as AddressType;
  address.Alias = state.alias;
  address.Firstname = state.firstname;
  address.Lastname = state.name;
  address.Address1 = state.courtAddress;
  address.Postcode = state.postcode;
  address.City = state.city;
  address.CountryIsoCode = state.country;
  address.MobilePhone = state.phone;
  address.IsDelivery = true;
  address.IsInvoice = true;

  addAddress(address).then((data) => {
    emit('onAddressCreated', data.IdAddress);
  });
};

const editAddress = () => {
  const newAddress = {} as AddressType;
  newAddress.IdAddress = address?.IdAddress;
  newAddress.Alias = state.alias;
  newAddress.Firstname = state.firstname;
  newAddress.Lastname = state.name;
  newAddress.Address1 = state.courtAddress;
  newAddress.Postcode = state.postcode;
  newAddress.City = state.city;
  newAddress.CountryIsoCode = state.country;
  newAddress.MobilePhone = state.phone;
  newAddress.IsDelivery = address?.IsDelivery;
  newAddress.IsInvoice = address?.IsInvoice;

  updateAddress(newAddress).then(() => {
    emit('onAddressEdited');
  });
};

if (address) {
  state.alias = address.Alias || '';
  state.alias = address.Alias || '';
  state.address = address.Address1 || '';
  state.courtAddress = address.Address1 || '';
  state.city = address.City || '';
  state.country = address.CountryIsoCode || '';
  state.firstname = address.Firstname || '';
  state.name = address.Lastname || '';
  state.phone = address.MobilePhone || '';
  state.postcode = address.Postcode || '';
  state.prefix = '+33';
} else {
  state.firstname = customer.value?.Firstname || '';
  state.name = customer.value?.Lastname || '';
}

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    if (address) {
      editAddress();
    } else {
      createAddress();
    }
    emit('cancel');
  } else {
    showFields();
  }
};

const showFields = () => {};

const handleSelect = (details: {
  address: string;
  courtAddress: string;
  streetNumber: string;
  route: string;
  postalCode: string;
  country: string;
  city: string;
  countryIso: string;
}) => {
  showFields();

  state.courtAddress = details.courtAddress;
  state.address = details.courtAddress;
  state.postcode = details.postalCode;
  state.country = details.countryIso;
  state.city = details.city;
};

defineExpose({
  submitForm,
});
</script>

<template>
  <div class="formAddress">
    <form class="formAddress-form" @submit.prevent="submitForm">
      <div class="grid grid-cols-12 gap-x-5">
        <div class="col-span-12">
          <InputText
            id="alias"
            v-model="state.alias"
            type="text"
            :errors="v$.alias.$errors"
            :label="$t('label.alias')"
            :border="inputBorder"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputText
            id="name"
            v-model="state.name"
            type="text"
            :errors="v$.name.$errors"
            :required="true"
            :label="$t('label.name')"
            :border="inputBorder"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputText
            id="firstname"
            v-model="state.firstname"
            type="text"
            :errors="v$.firstname.$errors"
            :required="true"
            :label="$t('label.firstname')"
            :border="inputBorder"
          />
        </div>
        <div class="col-span-12">
          <InputGoogoleAutoComplete
            v-model="state.address"
            id="autocomplete"
            :errors="v$.address.$errors"
            :required="true"
            :label="$t('label.address')"
            @onSelect="handleSelect"
            @input="state.courtAddress = state.address"
            :border="inputBorder"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputText
            id="postcode"
            v-model="state.postcode"
            type="text"
            :errors="v$.postcode.$errors"
            :required="true"
            :label="$t('label.postcode')"
            :border="inputBorder"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputText
            id="city"
            v-model="state.city"
            type="text"
            :errors="v$.city.$errors"
            :required="true"
            :label="$t('label.city')"
            :border="inputBorder"
          />
        </div>
        <div class="col-span-12">
          <InputSelect
            id="country"
            v-model="state.country"
            type="text"
            :errors="v$.country.$errors"
            :label="$t('label.country')"
            :required="true"
            :selectOptions="countriesOptions"
            :key="state.country"
            :border="inputBorder"
            searchable
          />
        </div>

        <div class="col-span-12 flex gap-3">
          <!-- <InputText
            id="prefix"
            v-model="state.prefix"
            type="text"
            :errors="v$.prefix?.$errors"
            :label="$t('label.prefix')"
            class="max-w-14"
          /> -->
          <InputText
            id="phone"
            v-model="state.phone"
            type="tel"
            :errors="v$.phone.$errors"
            :required="true"
            :label="$t('label.phone')"
            :border="inputBorder"
          />
        </div>
        <div class="formAddress-cta col-span-12">
          <BaseButton
            type="primary"
            size="small"
            plain
            class="w-full"
            @click.stop="$emit('cancel')"
            v-if="addresses.length"
          >
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton type="primary" size="small" class="w-full" submit>
            {{ $t('button.save') }}
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
$formAddress: '.formAddress';

#{$formAddress} {
  &-cta {
    @apply flex gap-5;
  }
}
</style>
