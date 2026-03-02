<template>
  <div class="container px-5 mx-auto">
    <div class="box h-screen"></div>
  </div>
</template>

<script setup lang="ts">
import ShopService from '~/services/ShopService';

const { loadingPage } = toRefs(useAppStore());
loadingPage.value = true;

const shopService = new ShopService();
const authStore = useAuth();

const route = useRoute();
const code = route.params.code as string;

shopService.shortLink({ code }).then((data) => {
  const url = new URL(data.TargetUrl);
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');
  const redirect = url.searchParams.get('redirect');
  const autologin = url.searchParams.get('autologin');

  if (autologin && token && email) {
    authStore.loginAuto({ token, email });
  }
});
</script>
