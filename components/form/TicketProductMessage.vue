<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import type { TicketProduct } from '~/types/TicketType';
const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);

const { product } = defineProps({
  product: {
    type: {} as PropType<TicketProduct>,
  },
});

const state = reactive({
  message: '',
});

const { t } = useI18n();
const loading = ref(false);

const rules = {
  message: {
    required: helpers.withMessage(t('error.message_required'), required),
    minLength: helpers.withMessage(
      t('error.character_length', [6]),
      minLength(3)
    ),
  },
};
const v$ = useVuelidate(rules, state);

const ticketStore = useTicketStore();
const { createTicket } = ticketStore;

const emit = defineEmits(['onSubmit']);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    if (product?.IdOrder && product?.IdProductAttribute) {
      loading.value = true;
      createTicket({
        IdOrder: product?.IdOrder,
        Title: product?.Description.Title,
        Description: state.message,
        Priority: 2,
        IdProductAttribute: product?.IdProductAttribute,
        LanguageIsoCode: languageIsoCode.value,
      })
        .then(() => {
          v$.value.$reset();
          state.message = '';
          emit('onSubmit', state.message);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="relative">
      <InputText
        id="messageBoxInput"
        v-model="state.message"
        border
        :errors="v$.message?.$errors"
        :placeholder="$t('label.tab_your_message')"
        :required="v$.message?.required !== undefined"
        class="!mb-0"
        type="textarea"
      >
      </InputText>
      <div class="absolute right-2.5 top-2.5">
        <BaseButton
          type="primary"
          size="small"
          submit
          :title="$t('button.send')"
          v-loading="loading"
        >
          {{ $t('button.send') }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
input {
  &#searchBoxInput {
    padding-right: 7.5rem;
  }
}
</style>
