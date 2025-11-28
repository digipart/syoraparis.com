import { defineStore } from 'pinia';

export const useBrowsingOutPopUpStore = defineStore(
  'BrowsingOutPopUpStore',
  () => {
    const browsingOutVisible = ref<boolean>(false);
    const browsingOut = useCookie('BROWSING_OUT_POPUP', {
      maxAge: 60 * 60 * 24 * 7,
    });

    if (!browsingOut.value) {
      browsingOutVisible.value = true;
    }

    const acceptBrowsingOut = () => {
      browsingOutVisible.value = false;
      browsingOut.value = '1';
    };

    return {
      browsingOutVisible,
      acceptBrowsingOut,
    };
  }
);
