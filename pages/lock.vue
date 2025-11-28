<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  keepalive: false
});

const appStore = useAppStore();
const { setLoadingPage } = appStore;

const router = useRouter();

const formData = ref({
  user: '',
  pass: '',
});

const localePath = useLocalePath();

const config = useRuntimeConfig();

const submitForm = async () => {
  const isNotLocked = useCookie('NOT_LOCKED', {
    maxAge: 60 * 60 * 24 * 366,
  });

  const valide =
    formData.value.user === config.public.lockUser &&
    formData.value.pass === config.public.lockPassword;

  if (valide) {
    isNotLocked.value = 'opened';
    setLoadingPage(true);
    setTimeout(() => {
      setLoadingPage(false);
      router.replace(localePath('/'));
    }, 1000);
  }
};
</script>

<template>
  <div>
    <form class="formLock-form" @submit.prevent="submitForm">
      <div class="w-full px-5 md:px-10 mb-16 md:mb-5">
        <div>
          <InputText
            id="email"
            v-model="formData.user"
            :label="$t('label.user')"
          />
        </div>
        <div>
          <InputText
            id="password"
            v-model="formData.pass"
            type="password"
            :label="$t('label.password')"
          />
        </div>
      </div>
      <div class="formLock-cta px-5 md:px-10">
        <BaseButton
          type="primary"
          class="w-full mb-3"
          submit
          size="medium"
          :title="$t('button.login')"
        >
          {{ $t('button.login') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.formLock-form {
  @apply block border max-w-[778px] w-full m-auto mt-32 pt-16 pb-16;
}
</style>
