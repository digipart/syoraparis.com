<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';
import ShopService from '~/services/ShopService';

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);
const { MyNotification } = useNotification();

const { t } = useI18n();
const emit = defineEmits(['onSubmitSuccess', 'onStart']);

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

const loading = ref(false);

// const auth = useAuth();
// const { customer } = toRefs(auth);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;
    const shopService = new ShopService();
    emit('onStart');
    shopService
      .subscribeNewsletter({
        Email: state.email,
        CurrencyIsoCode: currencyIsoCode.value,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then(() => {
        MyNotification({
          title: t('label.newsletter'),
          message: h('span', t('messages.newsletter.success')),
        });
        state.email = '';
        v$.value.$reset();
        emit('onSubmitSuccess');
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <div class="newsletterForm">
    <form @submit.prevent="submitForm">
      <div>
        <InputText
          id="email"
          v-model="state.email"
          type="email"
          :errors="v$.email?.$errors"
          :label="$t('label.email')"
        />
      </div>
      <div>
        <BaseButton
          type="primary"
          size="small"
          submit
          :title="$t('button.register_newsletter')"
          class="w-full"
          :disabled="loading"
          v-loading="loading"
        >
          {{ $t('button.register_newsletter') }}
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
