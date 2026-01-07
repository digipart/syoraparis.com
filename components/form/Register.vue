<script setup lang="ts">
const formValidate = useFormValidateStore();

const { state, v$, fields, showAllFileds } = toRefs(formValidate);
fields.value = ['email'];

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const auth = useAuth();
const { register } = auth;
const loading = ref(false);
const error = ref<string | null>(null);
const { t } = useI18n();

const emit = defineEmits(['onSuccess']);
const { showSocialMedia, onSuccess } = defineProps({
  showSocialMedia: {
    type: Boolean,
    default: true,
  },
  onSuccess: {
    type: Function,
    default: null,
  },
});

const newsLetterState = ref(false);

const redirectTo = () => {
  if (onSuccess) {
    onSuccess();
  } else {
    router.replace(localePath({ name: 'account-profil' }));
  }
};

const submitForm = async () => {
  error.value = null; // Reset error state
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    loading.value = true;

    register({
      Email: state.value.email,
      Firstname: state.value.firstname,
      Lastname: state.value.lastname,
      Birthday: state.value.birthdate,
      NewletterActive: newsLetterState.value,
      Password: state.value.password,
    })
      .then(() => {
        redirectTo();
      })
      .catch((err) => {
        console.log(err.data);
        error.value = err?.data?.message || t('error.registration_failed');
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    error.value = t('error.form_validation_failed');
  }
};

const startRegister = async () => {
  error.value = null; // Reset error state
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    fields.value = ['email', 'firstname', 'lastname', 'password'];
    showAllFileds.value = true;
  } else {
    error.value = t('error.invalid_email');
  }
};
const googleSubmit = () => {
  redirectTo();
};
</script>

<template>
  <div class="formRegister">
    <div class="formRegister-form">
      <BaseHeadLine
        name="h2"
        size="sm"
        class="text-center uppercase font-normal mb-8"
      >
        {{ $t('titles.formRegister_title') }}
      </BaseHeadLine>
      
      <BaseAlert
        v-if="error"
        type="danger"
        class="mb-5 mx-5 md:mx-10"
        @onCloseClick="error = null"
        size="small"
      >
        {{ error }}
      </BaseAlert>

      <form v-if="!showAllFileds" @submit.prevent="startRegister">
        <div class="w-full px-5 md:px-10 mb-16 md:mb-5">
          <div>
            <InputText
              id="email"
              v-model="state.email"
              type="email"
              :errors="v$.email?.$errors"
              :label="$t('label.email')"
              :required="v$.email?.required !== undefined"
            />
          </div>
        </div>
        <div class="formRegister-cta px-5 md:px-10">
          <BaseButton
            type="primary"
            class="w-full mb-2"
            v-loading="loading"
            submit
            size="medium"
            :title="$t('button.continue')"
          >
            {{ $t('button.continue') }}
          </BaseButton>
          <p class="text-gray-888 text-xs">
            {{ $t('label.already_registred', { shopname: shopName }) }} ?
            <NuxtLink
              :to="localePath({ name: 'account-login' })"
              class="underline"
            >
              {{ $t('label.login') }}
            </NuxtLink>
          </p>
        </div>
      </form>
      <transition name="slide">
        <form v-if="showAllFileds" @submit.prevent="submitForm">
          <div class="w-full px-5 md:px-10 mb-16 md:mb-5">
            <div>
              <InputText
                id="email"
                v-model="state.email"
                type="email"
                :errors="v$.email?.$errors"
                :label="$t('label.email')"
                :required="v$.email?.required !== undefined"
              />
            </div>
            <div>
              <InputText
                id="firstname"
                v-model="state.firstname"
                type="text"
                :errors="v$.firstname?.$errors"
                :label="$t('label.firstname')"
                :required="v$.firstname?.required !== undefined"
              />
            </div>
            <div>
              <InputText
                id="lastname"
                v-model="state.lastname"
                type="text"
                :errors="v$.lastname?.$errors"
                :label="$t('label.lastname')"
                :required="v$.lastname?.required !== undefined"
              />
            </div>

            <div>
              <InputText
                id="birthdate"
                v-model="state.birthdate"
                type="date"
                :errors="v$.birthdate?.$errors"
                :label="$t('label.birthdate')"
              />
            </div>
            <div>
              <InputText
                id="password"
                v-model="state.password"
                type="password"
                :errors="v$.password?.$errors"
                :label="$t('label.password')"
                :required="v$.password?.required !== undefined"
              />
            </div>
            <div>
              <InputCheckBox id="newsletter" v-model="newsLetterState">
                {{ $t('label.newsletter_our_news') }}
              </InputCheckBox>
            </div>
          </div>
          <div class="formRegister-cta px-5 md:px-10">
            <BaseButton
              type="primary"
              class="w-full mb-2"
              v-loading="loading"
              submit
              size="medium"
              :title="$t('button.register')"
            >
              {{ $t('button.register') }}
            </BaseButton>
            <p class="text-gray-888 text-xs">
              {{ $t('label.already_registred') }} ?
              <NuxtLink
                :to="localePath({ name: 'account-login' })"
                class="underline"
              >
                {{ $t('label.login') }}
              </NuxtLink>
            </p>
          </div>
        </form>
      </transition>
      <div v-if="showSocialMedia" class="w-full px-5 md:px-10">
        <BaseHr
          :label="$t('titles.sclogin_title')"
          class="text-sm"
          spacing="2rem"
        />
        <div class="flex gap-3">
          <FormLoginGoogle class="w-full" @onSuccess="googleSubmit()" />

          <FormLoginFacebook class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$formRegister: '.formRegister';

#{$formRegister} {
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
