<template>
  <!-- <button type="button">Sign In with Google</button>
    <button @click="signOut" type="button">Sign Out</button> -->

  <BaseButton
    type="primary"
    plain
    size="medium"
    v-loading="loading"
    @click="signIn"
    :title="$t('button.google_login')"
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
</template>

<script setup lang="ts">
const { $googleAuth } = useNuxtApp();
const loading = ref(false);
const auth = useAuth();
const { login } = auth;

const emit = defineEmits(['onSuccess']);

const signIn = async () => {
  try {
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
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  } catch (error) {
    console.error('Sign-in error:', error);
  }
};

const signInStatic = async () => {
  try {
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
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
    // }
  } catch (error) {
    console.error('Sign-in error:', error);
  }
};

const signOut = async () => {
  try {
    await $googleAuth.signOut();
  } catch (error) {}
};
</script>

<style lang="scss" scoped></style>
