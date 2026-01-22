<script setup lang="ts">
const { state, v$ } = useFormLoginValidation();

const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const auth = useAuth();
const { login } = auth;
const loading = ref(false);
const error = ref<string | null>(null);

const redirect = route.query?.redirect;

const { onSuccess } = defineProps({
  onSuccess: {
    type: Function,
    default: null,
  },
});

const redirectTo = () => {
  if (onSuccess) {
    console.log('onSuccess login');
    onSuccess();
  } else {
    if (redirect) {
      router.replace(localePath({ name: redirect as string }));
    } else {
      router.replace(localePath({ name: 'account-orders' }));
    }
  }
};

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    loading.value = true;
    error.value = null;
    login('credentials', {
      Email: state.email,
      Password: state.password,
    })
      .then(() => {
        setTimeout(() => {
          redirectTo();
        }, 100);
      })
      .catch((err) => {
        console.log(err);
        error.value = err?.response?._data?.message;
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
  }
};

const googleSubmit = () => {
  redirectTo();
};
</script>

<template>
  <div class="formLogin">
    <form class="formLogin-form" @submit.prevent="submitForm">
      <div class="w-full px-5 md:px-10 mb-16 md:mb-5">
        <BaseAlert
          v-if="error"
          type="danger"
          class="mb-5"
          @onCloseClick="error = null"
        >
          {{ error }}
        </BaseAlert>
        <BaseHeadLine
          name="h1"
          size="sm"
          class="text-center uppercase font-normal mb-8"
        >
          {{ $t('titles.formlogin_title') }}
        </BaseHeadLine>
        <div>
          <!-- <label for="email">Email</label> -->
          <!-- <input id="email" v-model="state.email" type="email" /> -->

          <InputText
            id="loginEmail"
            v-model="state.email"
            type="email"
            :errors="v$.email.$errors"
            :label="$t('label.email')"
          />
        </div>
        <div>
          <InputText
            id="loginPassword"
            v-model="state.password"
            type="password"
            :errors="v$.password.$errors"
            :label="$t('label.password')"
          />
        </div>
        <div class="text-xs text-gray-888 underline -mt-3">
          <NuxtLink :to="localePath({ name: 'password-forget' })">
            {{ $t('button.forgot_password') }}
          </NuxtLink>
        </div>
      </div>
      <div class="formLogin-cta px-5 md:px-10">
        <BaseButton
          type="primary"
          class="w-full mb-3"
          v-loading="loading"
          submit
          size="medium"
          :title="$t('button.login')"
        >
          {{ $t('button.login') }}
        </BaseButton>

        <NuxtLink :to="localePath({ name: 'account-register' })">
          <BaseButton
            type="primary"
            class="w-full"
            size="medium"
            :title="$t('button.register')"
            plain
          >
            {{ $t('button.register') }}
          </BaseButton>
        </NuxtLink>

        <BaseHr :label="$t('titles.sclogin_title')" spacing="2rem" />
        <div class="flex gap-3">
          <FormLoginGoogle class="w-full" @onSuccess="googleSubmit()" />
          <FormLoginFacebook class="w-full" @onSuccess="googleSubmit()" />
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
$formLogin: '.formLogin';

#{$formLogin} {
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

