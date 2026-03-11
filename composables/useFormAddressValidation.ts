import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';

export const useFormAddressValidation = () => {
  const { t } = useI18n();

  const state = reactive({
    alias: '',
    name: '',
    firstname: '',
    address: '',
    courtAddress: '',
    postcode: '',
    city: '',
    country: '',
    stateName: '',
    stateCode: '',
    stateIsoCode: '',
    prefix: '',
    phone: '',
  });

  const rules = {
    alias: {},
    name: {
      required: helpers.withMessage(t('error.name_required'), required),
    },
    firstname: {
      required: helpers.withMessage(t('error.firstname_required'), required),
    },
    address: {
      required: helpers.withMessage(t('error.address_required'), required),
    },
    postcode: {
      required: helpers.withMessage(t('error.postcode_required'), required),
    },
    city: {
      required: helpers.withMessage(t('error.city_required'), required),
    },
    country: {
      required: helpers.withMessage(t('error.country_required'), required),
    },
    // prefix: {
    //   required: helpers.withMessage(t('error.prefix_required'), required),
    // },
    phone: {
      required: helpers.withMessage(t('error.phone_required'), required),
    },
  };

  const v$ = useVuelidate(rules, state);

  return { state, v$ };
};
