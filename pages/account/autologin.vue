<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const { loadingPage } = toRefs(useAppStore());
loadingPage.value = true;

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const authStore = useAuth();
const { loginAuto } = authStore;

const { token, email } = route.query;

onMounted(async () => {
  if (token && email) {
    try {
      await loginAuto({
        email: email as string,
        token: token as string,
      });
      loadingPage.value = false;
      redirectTo();
    } catch (err) {
      loadingPage.value = false;
      router.push(localePath('/'));
    }
  } else {
    router.push(localePath('/'));
  }
});

const redirectTo = () => {
  const redirectQuery = route.query.redirect as string;
  let goTo = '/account';
  if (redirectQuery) {
    goTo = redirectQuery;
  }
  router.push(localePath(goTo));
};
</script>

<template>
  <LayoutContainer>
    <div class="h-screen"></div>
  </LayoutContainer>
</template>

<style lang="scss" scoped></style>
