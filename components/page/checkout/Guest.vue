<script setup lang="ts">
const { hideEmail } = defineProps({
  hideEmail: {
    type: Boolean,
    default: false,
  },
});

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

const addressManually = ref(false);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const showFields = () => {
  addressManually.value = true;
};

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
      <div class="grid grid-cols-12 gap-x-5">
        <div v-if="!hideEmail" class="col-span-12">
          <InputText
            id="email"
            v-model="state.email"
            type="email"
            :errors="v$.email?.$errors"
            :required="true"
            :label="$t('label.email')"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputText
            id="name"
            v-model="state.name"
            type="text"
            :errors="v$.name?.$errors"
            :required="true"
            :label="$t('label.name')"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <InputText
            id="firstname"
            v-model="state.firstname"
            type="text"
            :errors="v$.firstname?.$errors"
            :required="true"
            :label="$t('label.firstname')"
          />
        </div>
        <div class="col-span-12">
          <InputGoogoleAutoComplete
            v-model="state.address"
            id="address"
            :errors="v$.address?.$errors"
            :label="$t('label.address')"
            :required="true"
            @onSelect="handleSelectAddress"
          />
          <div v-if="!addressManually" class="-mt-5 flex justify-end">
            <span
              class="text-xs text-gray-888 underline cursor-pointer"
              @click="showFields()"
            >
              {{ $t('label.enter_address_manually') }}
            </span>
          </div>
        </div>
        <div
          v-show="addressManually || v$.$error"
          class="col-span-12 grid grid-cols-12 gap-x-5"
        >
          <div class="col-span-12">
            <InputSelect
              id="country"
              v-model="state.country"
              type="text"
              :errors="v$.country?.$errors"
              :label="$t('label.country')"
              :selectOptions="countriesOptions"
              :required="true"
              :key="state.country"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <InputText
              id="postcode"
              v-model="state.postcode"
              type="text"
              :errors="v$.postcode?.$errors"
              :required="true"
              :label="$t('label.postcode')"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <InputText
              id="city"
              v-model="state.city"
              type="text"
              :errors="v$.city?.$errors"
              :required="true"
              :label="$t('label.city')"
            />
          </div>
        </div>

        <div class="col-span-12">
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
