import { defineStore } from 'pinia';

export const useCookiesPopUpStore = defineStore('cookiesPopUpStore', () => {
  const cookiesPopUpVisible = ref<boolean>(false);
  const cookiesPopUp = useCookie('COOKIES_POPUP', {
    maxAge: 60 * 60 * 24 * 366,
  });

  if (!cookiesPopUp.value) {
    cookiesPopUpVisible.value = true;
  }

  const acceptCookies = () => {
    cookiesPopUpVisible.value = false;
    cookiesPopUp.value = '1';
  };

  const declineCookies = () => {
    cookiesPopUpVisible.value = false;
    cookiesPopUp.value = null;
  };

  return {
    cookiesPopUpVisible,
    acceptCookies,
    declineCookies,
  };
});
