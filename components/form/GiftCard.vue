<template>
  <div class="formGiftCard">
    <div class="formGiftCard-form">
      <form @submit.prevent="submitForm">
        <div class="w-full mb-3">
          <div>
            <InputCheckBox id="gift-checkbox" v-model="customCard">
              {{ $t('label.gift_card.custom') }}
            </InputCheckBox>
          </div>

          <div v-show="customCard" class="mt-4">
            <div>
              <InputText
                id="email"
                v-model="state.email"
                type="email"
                :errors="v$.email?.$errors"
                :label="$t('label.recipient_email')"
                :required="v$.email?.required !== undefined"
                border
              />
            </div>
            <div>
              <InputText
                id="fullName"
                v-model="state.fullName"
                type="text"
                :errors="v$.fullName?.$errors"
                :label="$t('label.recipient_name')"
                border
              />
            </div>
            <div class="-mb-2">
              <InputText
                id="message"
                v-model="state.message"
                type="textarea"
                :errors="v$.message?.$errors"
                :label="$t('label.message')"
                :maxlength="300"
                border
              />
              <div class="text-right text-xs text-gray-500">
                {{ state.message.length }}/300
              </div>
            </div>
            <div>
              <InputText
                id="dateSend"
                v-model="state.dateSend"
                type="date"
                :errors="v$.dateSend?.$errors"
                :label="$t('label.send_on')"
                border
              />
            </div>
          </div>
        </div>
        <div class="formGiftCard-cta">
          <BaseButton
            type="primary"
            class="w-full mb-2"
            v-loading="loading"
            submit
            size="medium"
            :title="$t('button.add_to_cart')"
          >
            {{ $t('button.add_to_cart') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import InputCheckBox from '~/components/input/CheckBox.vue';
import type { GiftCardPayload } from '~/types/CartType';

const emit = defineEmits(['onSuccess']);
const { onSuccess } = defineProps({
  onSuccess: {
    type: Function,
    default: null,
  },
});

const { t } = useI18n();
const loading = ref(false);
const error = ref<string | null>(null);
const customCard = ref(false);

const state = ref<GiftCardPayload>({
  email: '',
  fullName: '',
  message: '',
  dateSend: '',
});

const rules = {
  email: { required, email },
};

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
  error.value = null; // Reset error state

  if (!customCard.value) {
    console.log('success');
    emit('onSuccess', null);
    return;
  }

  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    loading.value = true;

    try {
      // Here you would typically make an API call
      // For now, we'll just simulate success
      const payload = {
        email: state.value.email,
        fullName: state.value.fullName,
        message: state.value.message,
        dateSend: state.value.dateSend,
      };

      emit('onSuccess', payload);
    } catch (err: any) {
      console.error(err);
      error.value = err?.message || t('error.gift_card_failed');
    } finally {
      loading.value = false;
    }
  } else {
    error.value = t('error.form_validation_failed');
  }
};
</script>

<style lang="scss" scoped>
$formGiftCard: '.formGiftCard';

#{$formGiftCard} {
  @apply flex items-center relative;

  &-form {
    @apply flex w-full flex-col;
  }
}
</style>
