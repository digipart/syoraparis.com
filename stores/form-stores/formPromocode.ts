import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

export const useFormPromocodeStore = defineStore(
  'formPromocodeStore',
  () => {
    const { t } = useI18n();

    const state = reactive({
      codepromo: '',
    });

    const rules = {
      codepromo: {
        required: helpers.withMessage(t('error.field_required'), required),
      },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  }
);
