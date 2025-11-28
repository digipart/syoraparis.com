import { defineStore } from 'pinia';
import ShopService from '~/services/ShopService';
import type { MenuType } from '~/types/MenuType';

export const useMenuStore = defineStore('menuStore', () => {
  const menu = ref<MenuType | null>(null);
  const menuFooter = ref<MenuType | null>(null);
  const appStore = useAppStore();
  const { languageIsoCode } = toRefs(appStore);

  const fetchMenu = () => {
    const shopService = new ShopService();

    return shopService
      .fetchMenu({
        // IdMenu: 30,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        menu.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetchFotter = () => {
    const shopService = new ShopService();

    return shopService
      .fetchMenu({
        IdMenu: 5,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        menuFooter.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  return {
    menu,
    menuFooter,
    fetchMenu,
    fetchFotter,
  };
});
