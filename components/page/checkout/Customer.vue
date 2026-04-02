<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice, addresses } = toRefs(addressStore);
const { fetchAddresses, updateAddress } = addressStore;

const checkoutStore = useCheckoutStore();
const { checkoutCustomer, checkoutCarrier, hasAddressDelivery } = toRefs(checkoutStore);

const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const shippingStore = useShippingStore();
const { fetchShipping } = shippingStore;

const cartStore = useCartStore();
const { fetchCart } = cartStore;

const showForm = ref(false);
const addressFormAdd = ref<HTMLElement | null>(null);

const countryStore = useCountryStore();
const { countries } = toRefs(countryStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const listAddressVisible = ref(false);
const loading = ref(false);
const { locale } = useI18n();

const emit = defineEmits(['onAddressCreated', 'onFormChange']);
const { t } = useI18n();

const addressesUpdated = async (addressId?: number) => {
  if (!addressId && addressDelivery.value) {
    addressId = addressDelivery.value.IdAddress;
  }
  if (addressDelivery.value) {
    syncCheckoutCustomerFromAddress(addressDelivery.value);
    await loadLogisticsData();
  }
};

const syncCheckoutCustomerFromAddress = (address: AddressType) => {
  checkoutCustomer.value.deliveryAddress.firstname = address.Firstname || '';
  checkoutCustomer.value.deliveryAddress.lastname = address.Lastname || '';
  checkoutCustomer.value.deliveryAddress.email = customer.value?.Email || '';
  checkoutCustomer.value.deliveryAddress.address = address.Address1 || '';
  checkoutCustomer.value.deliveryAddress.city = address.City || '';
  checkoutCustomer.value.deliveryAddress.phone = address.MobilePhone || '';
  checkoutCustomer.value.deliveryAddress.postalCode = address.Postcode || '';
  checkoutCustomer.value.deliveryAddress.country = address.CountryIsoCode || '';
  
  hasAddressDelivery.value = true;
};

const loadLogisticsData = async () => {
  const delivery = checkoutCustomer.value.deliveryAddress;
  if (!delivery.address || !delivery.postalCode || !delivery.city || !delivery.country) {
    return;
  }

  loading.value = true;
  try {
    const options = {
      Postcode: delivery.postalCode,
      City: delivery.city,
      Address1: delivery.address,
      Country: delivery.country,
    };

    await fetchShipping(options);
    await checkoutStore.fetchPaymentMethods(options);
  } finally {
    loading.value = false;
  }
};


const setAddresseDelivery = (address: AddressType) => {
  const newAddress = { ...address };
  newAddress.IsDelivery = true;
  listAddressVisible.value = false;

  updateAddress(newAddress).then(async (data) => {});
};

const displayForm = () => {
  showForm.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
};

const onAddressCreated = async (addressId: number) => {
  showForm.value = false;

  emit('onAddressCreated', addressId);
};

// watch(addressDelivery, () => {
//   setCheckoutCustomer();
// });

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

const countriesOptions = computed(() => {
  return countries.value.map((country) => ({
    label: country.CountryName,
    value: country.CountryIsoCode,
  }));
});

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

  checkoutCustomer.value.invoiceAddress.firstname = state.value.firstname;
  checkoutCustomer.value.invoiceAddress.lastname = state.value.name;
  checkoutCustomer.value.invoiceAddress.address = state.value.address;
  checkoutCustomer.value.invoiceAddress.city = state.value.city;
  checkoutCustomer.value.invoiceAddress.phone = state.value.phone;
  checkoutCustomer.value.invoiceAddress.postalCode = state.value.postcode;
  checkoutCustomer.value.invoiceAddress.country = state.value.country;

  if (state.value.country && state.value.postcode && state.value.city) {
  }
});

onMounted(async () => {
  setTimeout(() => {
    if (addresses.value.length === 0) {
      showForm.value = true;
    }
  }, 500);

  if (addressDelivery.value) {
    syncCheckoutCustomerFromAddress(addressDelivery.value);
    await loadLogisticsData();
  }
});
</script>

<template>
  <div>
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
      <div v-show="showForm" ref="addressFormAdd">
        <!-- <FormAddress
          @cancel="showForm = !showForm"
          @onAddressCreated="onAddressCreated($event)"
          inputBorder
        /> -->
        <div v-show="showForm" ref="addressFormAdd" class="">
          <form class="formDelivery-form">
            <div class="grid grid-cols-12 gap-x-5">
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
                    searchable
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
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
