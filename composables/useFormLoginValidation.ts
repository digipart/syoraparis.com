import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';

export const useFormLoginValidation = () => {
  const { t } = useI18n();

  const state = reactive({
    email: '',
    password: '',
  });

  const rules = {
    email: {
      required: helpers.withMessage(t('error.email_required'), required),
      email: helpers.withMessage(t('error.email_valide'), email),
    },
    password: {
      required: helpers.withMessage(t('error.password_required'), required),
      minLength: helpers.withMessage(
        ({ $params }) => t('error.character_length', [$params.min]),
        minLength(8)
      ),
    },
  };

  const v$ = useVuelidate(rules, state);

  return { state, v$ };
};
