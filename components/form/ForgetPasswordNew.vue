<script setup lang="ts">
import PasswordService from '~/services/PasswordService';

const formNewPasswordStore = useFormNewPasswordStore();
const { state, v$ } = toRefs(formNewPasswordStore);

const localePath = useLocalePath();

const router = useRouter();
const route = useRoute();

const loading = ref(false);

const emit = defineEmits(['onSuccess']);

const passwordService = new PasswordService();
const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    loading.value = true;
    passwordService
      .reset({
        Email: route.query?.email as string,
        Password: state.value.password,
        Token: route.query?.token as string,
      })
      .then(() => {
        router.replace(localePath({ name: 'account-login' }));
      })
      .catch((err) => {
        console.error(err.response);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
  }
};
</script>

<template>
  <div class="formForgetPassword">
    <form class="formForgetPassword-form" @submit.prevent="submitForm">
      <div class="w-full px-5 md:px-10 mb-16 md:mb-5">
        <BaseHeadLine
          name="h1"
          size="sm"
          class="text-center uppercase font-normal mb-8"
        >
          {{ $t('titles.formForgetPassword_title') }}
        </BaseHeadLine>
        <div>
          <InputText
            id="password"
            v-model="state.password"
            type="password"
            :errors="v$.password?.$errors"
            :required="true"
            :label="$t('label.password')"
          />
        </div>
        <div>
          <InputText
            id="password-confirm"
            v-model="state.passwordConfirm"
            type="password"
            :errors="v$.passwordConfirm?.$errors"
            :required="true"
            :label="$t('label.password_confirm')"
          />
        </div>
      </div>
      <div class="formForgetPassword-cta px-5 md:px-10">
        <BaseButton
          type="primary"
          class="w-full mb-3"
          v-loading="loading"
          submit
          size="medium"
        >
          {{ $t('button.continue') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
$formForgetPassword: '.formForgetPassword';

#{$formForgetPassword} {
  @apply flex items-center pb-[54px] relative;

  &-form {
    @apply flex  w-full flex-col;

    @screen md {
      @apply border border-black py-10;
    }
  }
  &-cta {
    // @apply absolute bottom-0 w-full;
    // @screen md {
    //   @apply static px-10;
    // }
    // button {
    //   @apply h-[54px];
    // }
  }
}
</style>
