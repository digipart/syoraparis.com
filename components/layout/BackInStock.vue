<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';
import ShopService from '~/services/ShopService';
import type { ProductType } from '~/types/ProductType';

const appStore = useAppStore();
const { shopName, languageIsoCode } = toRefs(appStore);

const { product, idProductAttribute } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
  idProductAttribute: {
    type: Number,
    required: true,
  },
});

const loading = ref(false);
const step = ref(1);
const { t } = useI18n();
const state = reactive({
  email: '',
});

const rules = {
  email: {
    required: helpers.withMessage(t('error.email_required'), required),
    email: helpers.withMessage(t('error.email_valide'), email),
  },
};

const v$ = useVuelidate(rules, state);
const isVisible = ref(false);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    const shopService = new ShopService();
    if (product?.IdProduct) {
      loading.value = true;
      shopService
        .backInStock({
          IdProduct: product?.IdProduct,
          IdProductAttribute: idProductAttribute,
          Email: state.email,
          LanguageIsoCode: languageIsoCode.value,
        })
        .then(() => {
          step.value = 2;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};

const close = () => {
  state.email = '';
  v$.value.$reset();
};
</script>

<template>
  <div class="backInStock">
    <BaseButton
      type="primary"
      plain
      class="w-full"
      :size="'medium'"
      :title="$t('button.back_in_stock')"
      @click="isVisible = true"
    >
      {{ $t('back_in_stock.button.not_available') }}
    </BaseButton>
    <BaseDrawer
      v-model="isVisible"
      size="100%"
      maxSize="600px"
      position="right"
      class="backInStock-drawer"
      @onClose="close()"
    >
      <template #header>
        <BaseHeadLine class="uppercase font-normal">
          {{ $t('back_in_stock.title') }}
        </BaseHeadLine>
      </template>
      <div>
        <CardProduct
          :product="product"
          direction="horizontal"
          :addToCart="false"
        />
        <BaseHr />
        <div>
          <Transition name="fade">
            <div v-if="step === 1">
              <form @submit.prevent="submitForm" v-loading="loading">
                <div>
                  <InputText
                    id="email"
                    v-model="state.email"
                    type="email"
                    :errors="v$.email?.$errors"
                    :label="$t('label.email')"
                  />
                </div>
                <div class="mb-5">
                  <BaseButton
                    type="primary"
                    size="small"
                    submit
                    :title="$t('button.send')"
                    class="w-full"
                    :disabled="loading"
                  >
                    {{ $t('button.send') }}
                  </BaseButton>
                </div>
                <div
                  class="bg-gray-bbb/10 text-xs p-3"
                  v-html="$t('back_in_stock.cgv', { shopname: shopName })"
                ></div>
              </form>
            </div>
            <div v-else>
              <div class="flex gap-3 bg-gray-bbb/10 p-5">
                <div
                  class="flex justify-center items-center bg-white rounded-full w-14 h-14"
                >
                  <IconEmailCheck :size="2" />
                </div>
                <div class="flex-1">
                  <p class="text-sm">
                    {{
                      $t('back_in_stock.confirmation', { email: state.email })
                    }}
                  </p>
                </div>
              </div>
              <div class="mt-5">
                <BaseButton
                  type="primary"
                  plain
                  size="small"
                  class="min-w-52"
                  @click="isVisible = false"
                  :title="$t('button.close')"
                >
                  {{ $t('button.close') }}
                </BaseButton>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<style scoped></style>
