<template>
  <div class="delivery-address-shipping-selected">
    <!-- View Mode -->
    <div v-if="addressDelivery && !isEditing" class="text-xs flex flex-col gap-2 p-3 bg-white">
      <div class="font-bold lowercase">
        {{ addressDelivery?.Firstname }} {{ addressDelivery?.Lastname }}
      </div>
      <div>
        {{ addressDelivery?.Address1 }} <br />
        {{ addressDelivery?.Postcode }} <br />
        {{ addressDelivery?.Country }}
      </div>
      <div
        class="font-extrabold cursor-pointer text-black mt-3 inline-block uppercase"
        @click="isEditing = true"
      >
        {{ t('button.modify') }}
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-if="addressDelivery && isEditing" class="edit-mode-container transition-all">
      <!-- Headers in edit mode -->
      <div class="flex justify-between items-start mb-4 px-1">
        <div class="text-xs leading-relaxed">
          <div class="lowercase font-bold">{{ addressDelivery?.Firstname }} {{ addressDelivery?.Lastname }}</div>
          <div>{{ addressDelivery?.Address1 }}</div>
          <div>{{ addressDelivery?.Postcode }}</div>
          <div>{{ addressDelivery?.Country }}</div>
        </div>
        <span class="underline cursor-pointer text-xs font-bold" @click="isEditing = false">
          {{ $t('button.cancel') }}
        </span>
      </div>

      <!-- Form Box -->
      <div class="border border-zinc-400 p-4 bg-white">
        <div class="grid grid-cols-12 gap-x-4 gap-y-4">
          <div class="col-span-6">
            <InputText
              id="edit-firstname"
              v-model="state.firstname"
              :label="$t('label.firstname') + ' *'"
              :errors="v$.firstname.$errors"
              border
              class="minimal-input"
            />
          </div>
          <div class="col-span-6">
            <InputText
              id="edit-lastname"
              v-model="state.name"
              :label="$t('label.name') + ' *'"
              :errors="v$.name.$errors"
              border
              class="minimal-input"
            />
          </div>
          <div class="col-span-12">
            <InputText
              id="edit-phone"
              v-model="state.phone"
              :label="$t('label.phone') + ' *'"
              :errors="v$.phone.$errors"
              border
              class="minimal-input"
            />
          </div>
          <div class="col-span-12">
            <InputGoogoleAutoComplete
              v-model="state.address"
              id="autocomplete-edit"
              :errors="v$.address.$errors"
              :label="$t('label.address') + ' *'"
              @onSelect="handleSelect"
              border
              class="minimal-input"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-x-3 mt-6">
          <button 
            class="border border-black py-3 text-sm font-bold uppercase hover:bg-zinc-50 transition-colors"
            @click="isEditing = false"
          >
            {{ $t('button.cancel') }}
          </button>
          <button 
          class="bg-black text-white py-3 text-sm font-bold uppercase hover:bg-zinc-800 transition-colors"
          @click="submitForm"
        >
          OK
        </button>
        </div>
      </div>
    </div>

    <div v-if="carrier && !hideShipping && !isEditing" class="mt-4">
      <div class="text-xs font-normal uppercase mb-1">{{ carrier.Name }}</div>
      <div class="text-xs text-gray-888 flex justify-between items-end">
        <div>
          {{ carrier.Price?.TaxIncl }} Shipping <br />
          Arrives by Fri, Aug 9
        </div>
        <NuxtLink
          :to="
            localePath({
              name: 'checkout',
              query: {
                step: 2,
              },
            })
          "
        >
          <span class="underline">{{ $t('button.modify') }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['onAddressSubmited']);

const { hideShipping } = defineProps({
  hideShipping: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);
const { updateAddress } = addressStore;

const cartStore = useCartStore();
const { carrier } = toRefs(cartStore);

const localePath = useLocalePath();

const isEditing = ref(false);

const { state, v$ } = useFormAddressValidation();

watch(isEditing, (val) => {
  if (val && addressDelivery.value) {
    const addr = addressDelivery.value;
    state.firstname = addr.Firstname || '';
    state.name = addr.Lastname || '';
    state.phone = addr.MobilePhone || '';
    state.address = addr.Address1 || '';
    state.courtAddress = addr.Address1 || '';
    state.city = addr.City || '';
    state.postcode = addr.Postcode || '';
    state.country = addr.CountryIsoCode || '';
    state.stateName = addr.StateName || '';
    state.stateCode = addr.StateCode || '';
    state.alias = addr.Alias || 'Mon adresse';
  }
});

const handleSelect = (details: any) => {
  state.courtAddress = details.courtAddress;
  state.address = details.courtAddress;
  state.postcode = details.postalCode;
  state.country = details.countryIso;
  state.city = details.city;
  state.stateName = details.stateName;
  state.stateCode = details.stateCode;
  state.stateIsoCode = details.stateIsoCode;
};

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect && addressDelivery.value) {
    const updated = {
      ...addressDelivery.value,
      Firstname: state.firstname,
      Lastname: state.name,
      MobilePhone: state.phone,
      Address1: state.courtAddress,
      Postcode: state.postcode,
      City: state.city,
      CountryIsoCode: state.country,
      StateName: state.stateName,
      StateCode: state.stateCode,
    };
    
    try {
      await updateAddress(updated);
      isEditing.value = false;
      emit('onAddressSubmited');
    } catch (err) {
      console.error('Update failed', err);
    }
  }
};
</script>

<style scoped></style>
