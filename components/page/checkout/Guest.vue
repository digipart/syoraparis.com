<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { addressDelivery, addresses } = toRefs(addressStore);
const { fetchAddresses, updateAddress } = addressStore;

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutCarrier } = toRefs(checkoutStore);

const shippingStore = useShippingStore();
const { fetchShipping } = shippingStore;

const addressFormAdd = ref<HTMLElement | null>(null);

const listAddressVisible = ref(false);
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
const { isLoggedIn, isGuest } = toRefs(auth);

const showForm = ref(!isLoggedIn.value);

const localePath = useLocalePath();
const router = useRouter();

// const emit = defineEmits(['onLoginClick']);

const submitForm = async () => {
  v$.value.$touch();
  console.log('v$', v$);

  if (!v$.value.$invalid) {
    registerGuest().then(async (data) => {
      showForm.value = false;
      console.log(data);
      // await fetchAddresses();

      // await fetchShipping({
      //   IdAddress: addressDelivery.value?.IdAddress,
      //   ResponseLevel: 'summary',
      // });
      emit('onAddressCreated', addressDelivery.value?.IdAddress);
    });
  } else {
    showFields();
  }
};

const emit = defineEmits(['onAddressCreated', 'onFormChange']);
const { t } = useI18n();

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const showFields = () => {};

const countriesOptions = computed(() => {
  return countries.value.map((country) => ({
    label: country.CountryName,
    value: country.CountryIsoCode,
  }));
});

const addressesUpdated = async (addressId?: number) => {
  if (!addressId && addressDelivery.value) {
    addressId = addressDelivery.value.IdAddress;
  }
  // await fetchShipping({
  //   IdAddress: addressId,
  //   ResponseLevel: 'summary',
  // });
};

const setAddresseDelivery = (address: AddressType) => {
  const newAddress = { ...address };
  newAddress.IsDelivery = true;
  listAddressVisible.value = false;

  updateAddress(newAddress).then(async (data) => {
    // await fetchShipping({
    //   IdAddress: data?.IdAddress,
    //   ResponseLevel: 'summary',
    // });
  });
};

const displayForm = () => {
  showForm.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
};

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

watch(state.value, () => {
  emit('onFormChange', state.value);
  checkoutCustomer.value.deliveryAddress.firstname = state.value.firstname;
  checkoutCustomer.value.deliveryAddress.lastname = state.value.name;
  checkoutCustomer.value.deliveryAddress.email = state.value.email;
  checkoutCustomer.value.deliveryAddress.address = state.value.address;
  checkoutCustomer.value.deliveryAddress.city = state.value.city;
  checkoutCustomer.value.deliveryAddress.phone = state.value.phone;
  checkoutCustomer.value.deliveryAddress.postalCode = state.value.postcode;
  checkoutCustomer.value.deliveryAddress.country = state.value.country;

  if (state.value.country && state.value.postcode && state.value.city) {
    // fetchShipping({
    //   Postcode: state.value.postcode,
    //   City: state.value.city,
    //   Address1: state.value.address,
    //   Country: state.value.country,
    // });
  }
});

defineExpose({
  submitForm,
});
</script>

<template>
  <div class="formDelivery">
    <transition name="slide">
      <div v-show="!showForm && !listAddressVisible">
        <div>
          <!-- Delivery address selected -->
          <div
            v-if="addressDelivery"
            class="border border-black px-5 py-3 mt-3 bg-white"
          >
            <PageCheckoutDeliveryAddressShippingSelected
              hideShipping
              @onAddressSubmited="addressesUpdated()"
            />
          </div>
          <span
            class="underline text-xs cursor-pointer"
            @click="listAddressVisible = !listAddressVisible"
            v-if="addresses.length > 0"
          >
            {{ t('button.select_another_address') }}
          </span>
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div v-if="!showForm && listAddressVisible">
        <div class="flex justify-end mt-3 mb-3">
          <span class="underline text-xs cursor-pointer" @click="displayForm()">
            {{ $t('button.add_new_address') }}
          </span>
        </div>
        <PerfectScrollbar class="max-h-96 mb-5">
          <ListingAccountAddresses
            activeType="Delivery"
            @onAddressSelected="setAddresseDelivery($event)"
          />
        </PerfectScrollbar>
      </div>
    </transition>

    <transition name="slide">
      <div v-show="showForm" ref="addressFormAdd" class="">
        <form class="formDelivery-form">
          <div class="grid grid-cols-12 gap-x-5">
            <div v-if="!hideEmail" class="col-span-12">
              <InputText
                id="email"
                v-model="state.email"
                type="email"
                :errors="v$.email?.$errors"
                :required="true"
                :label="$t('label.email')"
                border
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
                border
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
                border
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
                border
              />
              <div class="-mt-5 flex justify-end">
                <span
                  class="text-xs text-gray-888 underline cursor-pointer"
                  @click="showFields()"
                >
                  {{ $t('label.enter_address_manually') }}
                </span>
              </div>
            </div>
            <div class="col-span-12 grid grid-cols-12 gap-x-5">
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
                  border
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
                  border
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
                  border
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
                border
              />
            </div>
            <!-- <div class="col-span-12">
              <BaseButton
                type="primary"
                size="small"
                class="w-full"
                :title="$t('button.continue')"
                submit
              >
                <span>{{ $t('button.continue') }}</span>
              </BaseButton>
            </div> -->
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped></style>
