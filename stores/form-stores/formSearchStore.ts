import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

export const useFormSearchStore = defineStore('formSearchStore', () => {
  const { t } = useI18n();

  const state = reactive({
    search: '',
  });

  const rules = {
    search: {
      required: helpers.withMessage(t('error.search_required'), required),
      minLength: helpers.withMessage(
        t('error.character_length', [3]),
        minLength(3)
      ),
    },
  };

  const v$ = useVuelidate(rules, state);

  return { state, v$ };
});
