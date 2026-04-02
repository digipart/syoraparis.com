<template>
  <NuxtLayout>
    <NuxtPage />
    <LayoutCookiesPopUp size="600px" />
    <LayoutBrowsingOutPopUp v-if="hasCountryOut" size="600px" />
  </NuxtLayout>
</template>
<script setup lang="ts">
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css';
// const auth = useAuth();
// const { isLoggedIn } = toRefs(auth);
// const { refresh } = auth;

const windowStore = useWindowStore();
const { initWindowsStore } = windowStore;

const { locale } = useI18n();
const ip = useIp();
const event = useRequestEvent();
if (event) {
  ip.value = event.context.ip;
}

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
});

const favoriteStore = useFavoritesStore();
const { fetchFavorite, initIdFavorite } = favoriteStore;

const cartStore = useCartStore();
const { fetchCart } = cartStore;

const config = useRuntimeConfig();

const hasCountryOut = computed(() => {
  return config.public.hasCountryOut === 'enabled';
});
try {
  await initWindowsStore();
} catch (error) {
  console.log(error);
}

try {
  await fetchCart();
} catch (error) {
  console.log(error);
}

try {
  initIdFavorite();
  await fetchFavorite();
} catch (error) {
  console.log(error);
}
</script>
