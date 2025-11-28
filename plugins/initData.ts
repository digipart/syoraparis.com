// plugins/v-loading.ts
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => {
  const cmsShopSetting = useCmsShopSetting();
  const { fetchCmsShopSetting } = cmsShopSetting;

  const countryStore = useCountryStore();
  const { fetchCountries } = countryStore;

  const categoryStore = useCategoryStore();
  const { fetchCategories } = categoryStore;

  const menuStore = useMenuStore();
  const { fetchMenu } = menuStore;

  // if (nuxtApp.$isClient) {
    await fetchCountries();
  // }
  fetchCmsShopSetting();
  fetchCategories();
  fetchMenu();
});
