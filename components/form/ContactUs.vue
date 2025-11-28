<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';
import ShopService from '~/services/ShopService';

const { t } = useI18n();
const localePath = useLocalePath();

const state = reactive({
  firstname: '',
  lastname: '',
  email: '',
  subject: '',
  message: '',
});
const rules = {
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
  subject: {
    required: helpers.withMessage(t('error.subject_required'), required),
  },
  message: {
    required: helpers.withMessage(t('error.message_required'), required),
    minLength: helpers.withMessage(
      t('error.character_length', [6]),
      minLength(3)
    ),
  },
};
const v$ = useVuelidate(rules, state);

const loading = ref(false);
const success = ref(false);

const submitForm = async () => {

  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;

    const shopService = new ShopService();

    shopService
      .sendMessageContactUs({
        Firstname: state.firstname,
        Lastname: state.lastname,
        Email: state.email,
        Subject: state.subject,
        Message: state.message,
      })
      .then((data) => {
        success.value = true;
        v$.value.$reset();
        state.firstname = '';
        state.lastname = '';
        state.email = '';
        state.subject = '';
        state.message = '';
      })
      .catch()
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <div class="contactUsForm">
    <form v-if="!success" @submit.prevent="submitForm" v-loading="loading">
      <div class="grid grid-cols-12 gap-x-5">
        <div class="col-span-6">
          <InputText
            id="contactUsFirstName"
            v-model="state.firstname"
            :errors="v$.firstname?.$errors"
            :label="$t('label.firstname')"
          />
        </div>
        <div class="col-span-6">
          <InputText
            id="contactUsLastName"
            v-model="state.lastname"
            :errors="v$.lastname?.$errors"
            :label="$t('label.lastname')"
          />
        </div>
        <div class="col-span-12">
          <InputText
            id="contactUsEmail"
            type="email"
            v-model="state.email"
            :errors="v$.email?.$errors"
            :label="$t('label.email')"
          />
        </div>
        <div class="col-span-12">
          <InputText
            id="contactUsSubject"
            v-model="state.subject"
            :errors="v$.subject?.$errors"
            :label="$t('label.subject')"
          />
        </div>
        <div class="col-span-12">
          <InputText
            id="contactUsMessage"
            type="textarea"
            v-model="state.message"
            :errors="v$.message?.$errors"
            :label="$t('label.message')"
          />
        </div>
        <div class="col-span-12">
          <BaseButton
            type="primary"
            size="small"
            submit
            :title="$t('button.send')"
            :disabled="loading"
            plain
            class="min-w-56"
          >
            {{ $t('button.send') }}
          </BaseButton>
        </div>
      </div>
    </form>
    <div v-else class="grid grid-cols-12">
      <div class="col-span-12">
        <div class="text-base flex justify-center">
          <IconCheck :size="7" />
        </div>
        <div
          class="text-center text-xl mt-5"
          v-html="$t('html.contact_us_confirmed_text')"
        ></div>
        <div class="flex flex-wrap justify-center mt-5 gap-3">
          <BaseButton
            size="small"
            @click="success = false"
            plain
            type="primary"
          >
            {{ $t('button.send_another_message') }}
          </BaseButton>
          <NuxtLink :to="localePath({ name: 'content-faq' })">
            <BaseButton size="small" class="!ml-0" plain type="primary">
              {{ $t('button.you_have_question') }} ?
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$contactUsForm: '.contactUsForm';

#{$contactUsForm} {
}
</style>
