<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import type { ProductType, Variant } from '~/types/ProductType';
import type { StockInStoreType } from '~/types/StoreReservationProductType';

const { t } = useI18n();
const shopStore = useShopStore();
const { saveReservationInStore } = shopStore;

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const auth = useAuth();
const { isLoggedIn, isGuest, customer } = toRefs(auth);

const { product, variantSelected, storeSelected } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
  variantSelected: {
    type: {} as PropType<Variant>,
    required: true,
  },
  storeSelected: {
    type: {} as PropType<StockInStoreType>,
    required: true,
  },
});

const emit = defineEmits(['onFinish', 'stepIndexChange']);
const localePath = useLocalePath();

const price = computed(() => {
  return product?.Price;
});

const regularPrice = computed(() => {
  return price.value?.RegularPrice;
});
const promotionalPrice = computed(() => {
  return price.value?.PromotionalPrice;
});

const hasPromtion = computed(() => {
  if (price.value?.PromotionalPrice) return true;

  return false;
});

const priceFinale = computed(() => {
  if (hasPromtion.value) {
    return promotionalPrice.value;
  }

  return regularPrice.value;
});

const state = reactive({
  firstname:
    isLoggedIn.value && !isGuest.value ? customer.value?.Firstname || '' : '',
  lastname:
    isLoggedIn.value && !isGuest.value ? customer.value?.Lastname || '' : '',
  email: isLoggedIn.value && !isGuest.value ? customer.value?.Email || '' : '',
  phone: '',
  gender: 1,
  gcs: false,
  bonPlans: false,
});
const rules = {
  firstname: {
    required: helpers.withMessage(t('error.name_required'), required),
  },
  lastname: {
    required: helpers.withMessage(t('error.firstname_required'), required),
  },
  email: {
    required: helpers.withMessage(t('error.email_required'), required),
    email: helpers.withMessage(t('error.email_valide'), email),
  },
  phone: {
    required: helpers.withMessage(t('error.phone_required'), required),
  },
  gcs: {
    required: helpers.withMessage(t('error.field_required'), required),
  },
};
const v$ = useVuelidate(rules, state);
const loading = ref(false);

const changeStepIndex = (index: number) => {
  emit('stepIndexChange', index);
};
const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;

    if (
      storeSelected.IdStore &&
      variantSelected.Combination?.IdProductAttribute &&
      product.IdProduct &&
      priceFinale.value?.PriceTaxIncl &&
      priceFinale.value?.PriceTaxExcl &&
      state.gender
    ) {
      saveReservationInStore({
        IdStore: storeSelected.IdStore,
        IdProductAttribute: variantSelected.Combination?.IdProductAttribute,
        IdGender: state.gender,
        Firstname: state.firstname,
        Lastname: state.lastname,
        Email: state.email,
        MobilePhone: state.phone,
        IdProduct: product.IdProduct,
        Quantity: 1,
        PriceTaxIncl: priceFinale.value?.PriceTaxIncl,
        PriceTaxExcl: priceFinale.value?.PriceTaxExcl,
      })
        .then((data) => {
          emit('onFinish', { ...state });
          v$.value.$reset();
          state.firstname = '';
          state.lastname = '';
          state.email = '';
          state.phone = '';
          state.gcs = false;
          state.bonPlans = false;
        })
        .catch()
        .finally(() => {
          loading.value = false;
        });
    }
  }
};
</script>

<template>
  <div class="reservationInStoreInfo-body pr-1">
    <div class="grid grid-cols-12 gap-5 gap-y-10">
      <div class="col-span-12 md:col-span-5 order-2 md:order-1">
        <div class="mb-3 border-b pb-1 flex justify-between items-center">
          <BaseHeadLine size="sm" class="uppercase font-normal">
            {{ $t('label.product') }}
          </BaseHeadLine>
          <span class="text-xs cursor-pointer" @click="changeStepIndex(1)">
            {{ $t('button.modify') }}
          </span>
        </div>
        <CardStoreAddressProduct
          :product="product"
          :variantSelected="variantSelected"
          class="mb-5"
        />
        <div class="mb-3 border-b pb-1 flex justify-between items-center">
          <BaseHeadLine size="sm" class="uppercase font-normal">
            {{ $t('label.Store') }}
          </BaseHeadLine>
          <span class="text-xs cursor-pointer" @click="changeStepIndex(2)">
            {{ $t('button.modify') }}
          </span>
        </div>
        <CardStoreAddress
          v-if="storeSelected"
          :checked="true"
          :store="storeSelected"
          :one="true"
        />
      </div>
      <div
        class="col-span-12 md:col-span-7 order-1 md:order-2 md:border-l md:pl-5"
      >
        <BaseHeadLine
          size="sm"
          class="uppercase font-normal mb-3 border-b pb-1"
        >
          {{ $t('label.your_contact_details') }}
        </BaseHeadLine>

        <form @submit.prevent="submitForm" v-loading="loading">
          <div class="grid grid-cols-12 gap-x-5">
            <div class="col-span-12 mb-3">
              <div class="flex justify-start gap-5">
                <div>
                  <InputRadio
                    id="storeReservationFormGenderMal"
                    :value="1"
                    v-model="state.gender"
                    :errors="v$.gender?.$errors"
                  >
                    {{ $t('label.woman') }}
                  </InputRadio>
                </div>
                <div>
                  <InputRadio
                    id="storeReservationFormGenderFemell"
                    :value="2"
                    v-model="state.gender"
                    :errors="v$.gender?.$errors"
                  >
                    {{ $t('label.man') }}
                  </InputRadio>
                </div>
              </div>
            </div>
            <div class="col-span-6">
              <InputText
                id="storeReservationFormFirstName"
                v-model="state.firstname"
                :errors="v$.firstname?.$errors"
                :label="$t('label.firstname')"
              />
            </div>
            <div class="col-span-6">
              <InputText
                id="storeReservationFormLastName"
                v-model="state.lastname"
                :errors="v$.lastname?.$errors"
                :label="$t('label.lastname')"
              />
            </div>
            <div class="col-span-12">
              <InputText
                id="storeReservationFormEmail"
                type="email"
                v-model="state.email"
                :errors="v$.email?.$errors"
                :label="$t('label.email')"
              />
            </div>
            <div class="col-span-12">
              <InputText
                id="storeReservationFormPhone"
                v-model="state.phone"
                :errors="v$.phone?.$errors"
                :label="$t('label.phone')"
              />
            </div>
            <div class="col-span-12 mb-3">
              <InputCheckBox
                v-model="state.gcs"
                :errors="v$.gcs?.$errors"
                id="storeReservationFormGcs"
              >
                <div
                  v-html="
                    $t('reservation_store.gcs', {
                      terms_link: localePath({ name: 'privacy-policy' }),
                    })
                  "
                ></div>
              </InputCheckBox>
            </div>
            <div class="col-span-12 mb-5">
              <InputCheckBox
                v-model="state.bonPlans"
                :errors="v$.bonPlans?.$errors"
                id="storeReservationBonsplan"
              >
                <div
                  v-html="
                    $t('reservation_store.bons_plans', {
                      shopname: shopName,
                    })
                  "
                ></div>
              </InputCheckBox>
            </div>
            <div class="col-span-12">
              <BaseButton
                type="primary"
                size="small"
                submit
                :title="$t('button.send')"
                :disabled="loading"
                class="min-w-56 w-full"
              >
                {{ $t('button.save') }}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
