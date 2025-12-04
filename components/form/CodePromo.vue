<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import CodepromoService from '~/services/CodepromoService';

const { t } = useI18n();

const error = ref(false);

const state = reactive({
  codepromo: '',
});

const rules = {
  codepromo: {
    required: helpers.withMessage(t('error.field_required'), required),
  },
};
const emit = defineEmits(['onCodePromoApplied']);
const v$ = useVuelidate(rules, state);

const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);
const loading = ref(false);
const useCart = useCartStore();
const { fetchCart } = useCart;
const { cart } = toRefs(useCart);

// const auth = useAuth();
// const { customer } = toRefs(auth); //mclient02@yopmail.com //VYH27X

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;
    const codepromoService = new CodepromoService();
    if (cart.value.IdCart) {
      error.value = false;
      codepromoService
        .apply({
          PromoCode: state.codepromo,
          IdCart: cart.value.IdCart,
          LanguageIsoCode: languageIsoCode.value,
        })
        .then(async () => {
          v$.value.$reset();
          state.codepromo = '';
          await fetchCart();
          emit('onCodePromoApplied');
        })
        .catch((err) => {
          error.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};
</script>

<template>
  <div class="newsletterForm">
    <BaseAlert v-if="error" size="small" type="danger" class="mb-3" :closeButton="false">
      {{ $t('error.codepromo_invalid') }}
    </BaseAlert>
    <form @submit.prevent="submitForm">
      <div>
        <InputText
          id="codepromo"
          v-model="state.codepromo"
          :errors="v$.codepromo?.$errors"
          :label="$t('cart.codepromo.title')"
        />
      </div>

      <div>
        <BaseButton
          type="primary"
          size="small"
          submit
          :title="$t('button.apply')"
          class="w-full"
          v-loading="loading"
          plain
        >
          {{ $t('button.apply') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
$newsletterForm: '.newsletterForm';

#{$newsletterForm} {
}
</style>
