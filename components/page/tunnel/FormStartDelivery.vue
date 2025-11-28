<script setup lang="ts">
import AuthService from '~/services/AuthService';

const formStartDelivery = useFormStartDelivery();
const { state, v$ } = toRefs(formStartDelivery);

const localePath = useLocalePath();
const alreadyRegistred = ref(false);
const authService = new AuthService();

const emit = defineEmits(['onSubmit', 'onGoogleSubmit']);

const checkEmail = () => {
  if (isValidEmail(state.value.email)) {
    authService
      .emailIsAvailble(state.value.email)
      .then(() => {
        alreadyRegistred.value = false;
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alreadyRegistred.value = true;
        }
      });
  }
};

let timerUpdateQuantity: any;
const handleChange = () => {
  clearTimeout(timerUpdateQuantity);
  timerUpdateQuantity = setTimeout(async () => {
    checkEmail();
  }, 800);
};

const submitForm = async () => {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    emit('onSubmit', { email: state.value.email });
  }
};
const googleSubmit = () => {
  emit('onGoogleSubmit');
};
</script>

<template>
  <div class="formDelivery">
    <form class="formDelivery-form" @submit.prevent="submitForm">
      <div class="">
        <div>
          <InputText
            id="email"
            v-model="state.email"
            type="email"
            :errors="v$.email.$errors"
            :label="$t('label.email')"
            @input="handleChange()"
          />
        </div>

        <div v-if="alreadyRegistred" class="flex gap-3 mb-3">
          <div class="flex-1 max-w-14">
            <IconCheck />
          </div>
          <div class="flex-1">
            <p class="text-xs">
              <span
                v-html="
                  $t('tunnel.delivery.already_registred.p1', {
                    email: state.email,
                  })
                "
              ></span>
              <NuxtLink
                :to="
                  localePath({
                    name: 'account-login',
                    query: { redirect: 'checkout' },
                  })
                "
                class="font-medium underline cursor-pointer ml-1"
              >
                {{ $t('button.login') }} </NuxtLink
              >&nbsp;
              <span
                v-html="
                  $t('tunnel.delivery.already_registred.p2', {
                    email: state.email,
                  })
                "
              ></span>
            </p>
          </div>
        </div>
        
        <BaseButton type="primary" class="w-full mt-5" size="medium" submit>
          {{ $t('button.continue') }}
        </BaseButton>

        <BaseHr :label="$t('titles.sclogin_title')" spacing="2rem" />

        <div class="flex gap-3">
          <FormLoginGoogle class="w-full" @onSuccess="googleSubmit" />
          <FormLoginFacebook class="w-full" />
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss"></style>
