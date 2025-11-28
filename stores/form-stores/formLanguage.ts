import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

export const useFormLanguageStore = defineStore('formLanguageStore', () => {
  const { t } = useI18n();

  const state = reactive({
    country: 0,
    language: '',
    currency: 0,
  });

  const rules = {
    country: {
      required: helpers.withMessage(t('error.country_required'), required),
    },
    language: {
      required: helpers.withMessage(t('error.language_required'), required),
    },
    currency: {
      required: helpers.withMessage(t('error.currency_required'), required),
    },
  };

  const v$ = useVuelidate(rules, state);

  return { state, v$ };
});
