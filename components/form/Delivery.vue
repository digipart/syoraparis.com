<script setup lang="ts">
const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const auth = useAuth();
const { registerGuest } = auth;

const localePath = useLocalePath();
const router = useRouter();

// const emit = defineEmits(['onLoginClick']);

const submitForm = async () => {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    registerGuest().then((data) => {});
  } else {
    showFields();
  }
};

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const showFields = () => {};

const countriesOptions = computed(() => {
  return countries.value.map((country) => ({
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
}) => {
  showFields();

  state.value.courtAddress = details.courtAddress;
  state.value.address = details.courtAddress;
  state.value.postcode = details.postalCode;
  state.value.country = details.countryIso;
  state.value.city = details.city;
};

defineExpose({
  submitForm,
});
</script>

<template>
  <div class="formDelivery">
    <form class="formDelivery-form" @submit.prevent="submitForm">
      <div class="">
        <div>
          <InputText
            id="email"
            v-model="state.email"
            type="email"
            :errors="v$.email?.$errors"
            :required="true"
            :label="$t('label.email')"
          />
        </div>
        <div>
          <InputText
            id="name"
            v-model="state.name"
            type="text"
            :errors="v$.name?.$errors"
            :required="true"
            :label="$t('label.name')"
          />
        </div>
        <div>
          <InputText
            id="firstname"
            v-model="state.firstname"
            type="text"
            :errors="v$.firstname?.$errors"
            :required="true"
            :label="$t('label.firstname')"
          />
        </div>
        <div>
          <InputGoogoleAutoComplete
            v-model="state.address"
            id="address"
            :errors="v$.address?.$errors"
            :label="$t('label.address')"
            :required="true"
            @onSelect="handleSelectAddress"
          />
        </div>
        <div>
          <div>
            <InputText
              id="postcode"
              v-model="state.postcode"
              type="text"
              :errors="v$.postcode?.$errors"
              :required="true"
              :label="$t('label.postcode')"
            />
          </div>
          <div>
            <InputText
              id="city"
              v-model="state.city"
              type="text"
              :errors="v$.city?.$errors"
              :required="true"
              :label="$t('label.city')"
            />
          </div>

          <div>
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
            />
          </div>
        </div>

        <div class="flex gap-3">
          <InputText
            id="prefix"
            v-model="state.prefix"
            type="text"
            :errors="v$.prefix?.$errors"
            :label="$t('label.prefix')"
            class="max-w-14"
          />
          <InputText
            id="phone"
            v-model="state.phone"
            type="tel"
            :errors="v$.phone?.$errors"
            :required="true"
            :label="$t('label.phone')"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
