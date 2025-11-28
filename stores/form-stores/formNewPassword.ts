import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

export const useFormNewPasswordStore = defineStore(
  'formNewPasswordStore',
  () => {
    const { t } = useI18n();

    const state = reactive({
      password: '',
      passwordConfirm: '',
    });

    // Custom validator for checking if passwordConfirm matches password
    const sameAsPassword = helpers.withMessage(
      t('error.password_match'),
      helpers.withParams(
        { password: state.password },
        (value) => value === state.password
      )
    );

    const rules = {
      password: {
        required: helpers.withMessage(t('error.password_required'), required),
        minLength: helpers.withMessage(
          t('error.character_length', [8]),
          minLength(8)
        ),
      },
      passwordConfirm: {
        required: helpers.withMessage(t('error.password_required'), required),
        minLength: helpers.withMessage(
          t('error.character_length', [8]),
          minLength(8)
        ),
        sameAsPassword,
      },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  }
);
