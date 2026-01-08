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
const error = ref<string | null>(null);
const auth = useAuth();
const { login } = auth;

const emit = defineEmits(['onSuccess']);

const signIn = async () => {
  try {
    error.value = null; // Reset error state
    loading.value = true;

    const { profile } = await $googleAuth.signIn();

    const gUser = {
      GoogleCustomerId: profile.sub,
      Email: profile.email,
      Firstname: profile.given_name,
      Lastname: profile.family_name,
    };

    await login('google', gUser);
    emit('onSuccess', { user: gUser });
  } catch (err: any) {
    console.error('Sign-in error:', err);
    // User closed the popup or an auth error occurred
    const message = err?.response?.data?.message || err?.message;
    if (message) {
      error.value = message;
    } else {
      error.value = t('error.google_sign_in_failed');
    }
  } finally {
    loading.value = false;
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
