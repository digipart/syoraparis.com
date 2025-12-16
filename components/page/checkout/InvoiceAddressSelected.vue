<script setup lang="ts">
const { t } = useI18n();

const auth = useAuth();
const { isLoggedIn } = toRefs(auth);

const addressStore = useAddressStore();
const { addressInvoice } = toRefs(addressStore);

const formInvoiceStore = useFormInvoiceStore();
const { state, v$ } = toRefs(formInvoiceStore);

const checkoutStore = useCheckoutStore();
const { checkoutCustomer } = toRefs(checkoutStore);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const isEditing = ref(false);

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
  state.value.courtAddress = details.courtAddress;
  state.value.address = details.courtAddress;
  state.value.postcode = details.postalCode;
  state.value.country = details.countryIso;
  state.value.city = details.city;
};

watch(state.value, () => {
  checkoutCustomer.value.invoiceAddress.firstname = state.value.firstname;
  checkoutCustomer.value.invoiceAddress.lastname = state.value.name;
  checkoutCustomer.value.invoiceAddress.address = state.value.address;
  checkoutCustomer.value.invoiceAddress.city = state.value.city;
  checkoutCustomer.value.invoiceAddress.phone = state.value.phone;
  checkoutCustomer.value.invoiceAddress.postalCode = state.value.postcode;
  checkoutCustomer.value.invoiceAddress.country = state.value.country;
});
</script>

<template>
  <div class="">
    <div
      v-if="addressInvoice"
      class="text-xs text-gray-888 flex gap-3 justify-between items-end bg-white px-5 py-3 border border-black"
    >
      <div class="flex-1">
        <span>
          {{ addressInvoice?.Address1 }} <br />
          {{ addressInvoice?.Postcode }}
        </span>
        <span>, {{ addressInvoice?.Country }} </span>
        <br />
        <span
          class="underline cursor-pointer text-black mt-1 inline-block"
          @click="isEditing = !isEditing"
        >
          {{ t('button.modify') }}
        </span>
      </div>
    </div>
    <transition name="slide" v-if="isLoggedIn">
      <div v-show="isEditing" ref="addressFormAdd" class="mt-3">
        <FormAddress
          v-if="addressInvoice"
          :address="addressInvoice"
          @cancel="isEditing = !isEditing"
          inputBorder
        />
      </div>
    </transition>
    <transition name="slide" v-else>
      <div v-show="!isLoggedIn" ref="addressFormAdd" class="">
        <div ref="addressFormAdd" class="">
          <form class="formDelivery-form">
            <div class="grid grid-cols-12 gap-x-5">
              <div class="col-span-12">
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
                  :label="$t('label.phone')"
                  border
                  :required="true"
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
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
