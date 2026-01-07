<template>
  <div>
    <BaseButton
      type="primary"
      plain
      size="medium"
      v-loading="loading"
      @click="signIn"
      :title="$t('button.google_login')"
      class="w-full"
    >
      <span>
        {{ $t('button.google_login') }}
      </span>

      <img
        class="h-6 w-6 cursor-pointer ml-2"
        src="/assets/images/google-logo.svg"
        alt=""
      />
    </BaseButton>
    <div v-if="error" class="text-red-500 text-xs mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { $googleAuth } = useNuxtApp();
const { t } = useI18n();
const loading = ref(false);
const error = ref();
const auth = useAuth();
const { login } = auth;

const emit = defineEmits(['onSuccess']);

const signIn = async () => {
  try {
    error.value = null; // Reset error state
    const user = await $googleAuth.signIn();
    if (user) {
      const googleCustomerId = user.getId();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      const firstName = profile.getGivenName();
      const lastName = profile.getFamilyName();

      loading.value = true;
      const gUser = {
        GoogleCustomerId: googleCustomerId,
        Email: email,
        Firstname: firstName,
        Lastname: lastName,
      };
      login('google', gUser)
        .then(() => {
          emit('onSuccess', { user: gUser });
        })
        .catch((err: any) => {
          console.log(err);
          error.value = err?.data?.message || t('error.google_login_failed');
        })
        .finally(() => {
          loading.value = false;
        });
    }
  } catch (err: any) {
    console.error('Sign-in error:', err);
    error.value = err?.message || t('error.google_sign_in_failed');
  }
};

const signInStatic = async () => {
  try {
    error.value = null; // Reset error state
    // const user = await $googleAuth.signIn();
    // if (user) {
    const googleCustomerId = '10255597904598555';
    // const profile = '';
    const email = 'kazadiabondance50@gmail.com';
    const firstName = 'Abondance';
    const lastName = 'Kazadi';

    loading.value = true;
    const gUser = {
      GoogleCustomerId: googleCustomerId,
      Email: email,
      Firstname: firstName,
      Lastname: lastName,
    };
    login('google', gUser)
      .then(() => {
        emit('onSuccess', { user: gUser });
      })
      .catch((err: any) => {
        console.log(err);
        error.value = err?.message || t('error.google_login_failed');
      })
      .finally(() => {
        loading.value = false;
      });
    // }
  } catch (err: any) {
    console.error('Sign-in error:', err);
    error.value = err?.message || t('error.google_sign_in_failed');
  }
};

const signOut = async () => {
  try {
    await $googleAuth.signOut();
  } catch (err: any) {
    console.error('Sign-out error:', err);
    error.value = err?.message || t('error.google_sign_out_failed');
  }
};
</script>

<style lang="scss" scoped></style>
