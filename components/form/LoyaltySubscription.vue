<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

const loyaltyStore = useLoyaltyStore();
const { subscribe } = loyaltyStore;

const { t } = useI18n();
const loading = ref(false);

const state = reactive({
  birthdate: '',
});
const rules = {
  birthdate: {
    required: helpers.withMessage(t('error.birthdate_required'), required),
  },
};
const v$ = useVuelidate(rules, state);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;
    subscribe({
      CustomerBirthday: state.birthdate,
      IdLoyaltyProgram: 4,
    }).finally(() => {
      loading.value = false;
    });
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div>
      <InputText
        id="loyaltySubDate"
        type="date"
        :label="$t('label.birthdate')"
        :errors="v$.birthdate.$errors"
        :required="true"
        v-model="state.birthdate"
      />
    </div>
    <div>
      <BaseButton
        type="primary"
        class="w-full mb-3"
        v-loading="loading"
        submit
        size="medium"
        :title="$t('button.login')"
      >
        {{ $t('button.subscribe') }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped></style>
