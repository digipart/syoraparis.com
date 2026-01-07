<template>
  <div>
    <BaseButton
      type="primary"
      plain
      size="medium"
      :title="$t('button.facebook_login')"
      @click="loginWithFacebook"
      :disabled="isLoading"
      class="w-full"
    >
      <span v-if="!isLoading">
        {{ $t('button.facebook_login') }}
      </span>
      <span v-else>
        {{ $t('button.loading') }}
      </span>

      <img
        v-if="!isLoading"
        class="h-6 w-6 ml-2 cursor-pointer"
        src="/assets/images/facebook-logo.svg"
        alt=""
      />
      <span v-else class="ml-2">
        <i class="fas fa-spinner fa-spin"></i>
      </span>
    </BaseButton>

    <div v-if="error" class="text-red-500 text-xs mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '~/stores/api-stores/AuthStore';
import { useRouter } from 'vue-router';

const authStore = useAuth();
const isLoading = ref(false);
const isSDKLoaded = ref(false);
const error = ref(null);
const { t } = useI18n();
// const { MyNotification } = useNotification();
const router = useRouter();

const emit = defineEmits(['onSuccess']);

// Facebook SDK initialization
const initFacebookSDK = () => {
  return new Promise((resolve) => {
    // Load the SDK asynchronously
    window.fbAsyncInit = function () {
      FB.init({
        appId: '903053381653316',
        cookie: true,
        xfbml: true,
        version: 'v18.0', // Use the latest stable version
      });

      isSDKLoaded.value = true;
      resolve();
    };

    // Load the Facebook SDK
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.FB) {
      isSDKLoaded.value = true;
      resolve();
    }
  });
};

// Facebook login handler
const loginWithFacebook = async () => {
  try {
    error.value = null; // Reset error state
    isLoading.value = true;

    // Make sure SDK is loaded
    if (!isSDKLoaded.value) {
      await initFacebookSDK();
    }

    // Login with Facebook
    const response = await new Promise((resolve, reject) => {
      FB.login(
        (response) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(
              new Error('User cancelled login or did not fully authorize')
            );
          }
        },
        { scope: 'email,public_profile' }
      );
    });

    // Get access token from response
    const { accessToken, userID } = response.authResponse;

    // Get user data
    const userData = await new Promise((resolve) => {
      FB.api('/me', { fields: 'email,name,picture' }, (response) => {
        resolve(response);
      });
    });

    // Send data to your backend for authentication
    await authStore.loginWithFacebook({
      accessToken,
      userId: userID,
      email: userData.email,
      name: userData.name,
      picture: userData.picture?.data?.url,
    });

    emit('onSuccess');
  } catch (err) {
    console.error('Facebook login error:', err);
    error.value = err?.data?.message || t('error.facebook_login_failed');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Initialize Facebook SDK when component is mounted
  initFacebookSDK();
});
</script>

<style lang="scss" scoped></style>
