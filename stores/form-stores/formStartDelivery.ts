import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

export const useFormStartDelivery = defineStore('formStartDelivery', () => {
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

  return { state, v$ };
});
