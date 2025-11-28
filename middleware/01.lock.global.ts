import { defineNuxtRouteMiddleware, useNuxtApp } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const { locale } = nuxtApp.$i18n; // Access i18n from nuxtApp
  const localePath = useLocalePath();
  const isNotLocked = useCookie('NOT_LOCKED', {
    maxAge: 60 * 60 * 24 * 366,
  });

  // Prevent infinite redirect by checking if the user is already on the lock page
  if (!isNotLocked.value && to.name !== 'lock___' + locale.value) {
    return navigateTo(localePath({ name: 'lock' }));
  }

  return;
});
