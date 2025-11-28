import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';

export const useFormValidateStore = defineStore('formValidateStore', () => {
  const { t } = useI18n();

  const fields = ref<string[]>([]);
  const showAllFileds = ref(false);

  const state = reactive({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    birthdate: '',
    search: '',
    language: '',
    currency: 0,
  });

  // Custom validator for checking if passwordConfirm matches password
  const sameAsPassword = helpers.withMessage(
    t('error.password_match'),
    helpers.withParams(
      { password: state.password },
      (value) => value === state.password
    )
  );

  const allRules = {
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
    birthdate: {
      required: helpers.withMessage(t('error.birthdate_required'), required),
    },
    search: {
      required: helpers.withMessage(t('error.search_required'), required),
      minLength: helpers.withMessage(
        t('error.character_length', [3]),
        minLength(3)
      ),
    },
    language: {
      required: helpers.withMessage(t('error.language_required'), required),
    },
    currency: {
      required: helpers.withMessage(t('error.currency_required'), required),
    },
  };

  const rules = computed(() => {
    const selectedRules: any = {};
    fields.value.forEach((field) => {
      if (allRules[field as keyof typeof allRules]) {
        selectedRules[field] = allRules[field as keyof typeof allRules];
      }
    });
    return selectedRules;
  });

  const v$ = useVuelidate(rules, state);

  return { state, v$, fields, showAllFileds };
});
