<script setup lang="ts">
import PasswordService from '~/services/PasswordService';

const formValidate = useFormValidateStore();
const { state, v$, fields } = toRefs(formValidate);
fields.value = ['email'];

const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const loading = ref(false);

const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);

const responseError = ref('');

const emit = defineEmits(['onSuccess']);

const passwordService = new PasswordService();

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;
    responseError.value = '';
    passwordService
      .forget({
        Email: state.value.email,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then(() => {
        router.replace(
          localePath({
            name: 'password-validate',
            query: { email: state.value.email },
          })
        );
      })
      .catch((err) => {
        responseError.value = err?.response?._data?.Message || '';
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
            id="email"
            v-model="state.email"
            type="email"
            :errors="v$.email?.$errors"
            :required="v$.email?.required !== undefined"
            :label="$t('label.email')"
          />
        </div>
        <BaseAlert
          v-if="responseError"
          type="danger"
          @onCloseClick="responseError = ''"
        >
          {{ responseError }}
        </BaseAlert>
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
