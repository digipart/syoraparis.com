import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', () => {
  const runtimeConfig = useRuntimeConfig();

  const logoLight = computed(() => {
    return runtimeConfig.public.shopLogoLight as string;
  });

  const logoDark = computed(() => {
    return runtimeConfig.public.shopLogoDark as string;
  });
  const shopName = computed(() => {
    return runtimeConfig.public.shopname as string;
  });
  const domainName = computed(() => {
    return runtimeConfig.public.domainName as string;
  });

  const loadingPage = ref(false);
  function setLoadingPage(status: boolean) {
    loadingPage.value = status;
  }

  const typeView = useCookie('CATEGORY_VIEW', {
    default: () => 'cols',
  });
  const categoryListingView = ref<'cols' | 'grid' | 'full' | string>(
    typeView.value
  );
  const setCategoryListingView = (value: 'cols' | 'grid' | 'full' | string) => {
    typeView.value = value;
    categoryListingView.value = value;
  };

  const countryStore = useCountryStore();
  const { countrySelected, currencySelected } = toRefs(countryStore);

  const currencyIsoCode = computed(() => {
    return currencySelected.value?.CurrencyIsoCode || '';
  });

  const currencySign = computed(() => {
    return currencySelected.value?.CurrencySign || '';
  });

  const countryIsoCode = computed(() => {
    return countrySelected.value?.CountryIsoCode;
  });
  const languageIsoCode = computed(() => {
    const { $i18n } = useNuxtApp();
    return $i18n.locale.value;
  });

  const miniCartVisible = ref(false);
  const miniFavoriteVisible = ref(false);
  const sideMenuVisible = ref(false);

  const router = useRouter();
  router.afterEach(() => {
    miniCartVisible.value = false;
    miniFavoriteVisible.value = false;
  });

  return {
    categoryListingView,
    currencyIsoCode,
    currencySign,
    countryIsoCode,
    languageIsoCode,
    miniCartVisible,
    miniFavoriteVisible,
    sideMenuVisible,
    loadingPage,
    logoLight,
    logoDark,
    shopName,
    domainName,
    setCategoryListingView,
    setLoadingPage,
  };
});
