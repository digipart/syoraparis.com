// stores/productStore.ts
import { defineStore } from 'pinia';

import ProductService from '~/services/ProductService';
import type { ProductType } from '~/types/ProductType';
import type { SearchType } from '~/types/SearchType';

export const useSearchStore = defineStore('searchStore', {
  state: () => ({
    searchData: {} as SearchType,
    searchProducts: [] as ProductType[],
    error: false,
    loading: false,
  }),
  actions: {
    async fetchSearch(options?: {
      Term?: string;
      Offset?: number;
      Limit?: number;
    }): Promise<SearchType> {
      const appStore = useAppStore();
      const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

      const productService = new ProductService();
      this.error = false;
      this.loading = true;

      const params: {
        Term?: string;
        CurrencyIsoCode?: string;
        LanguageIsoCode?: string;
        Offset?: number;
        Limit?: number;
      } = {
        CurrencyIsoCode: currencyIsoCode.value,
        LanguageIsoCode: languageIsoCode.value,
        ...options,
      };

      return productService
        .fetchSearch(params)
        .then((data) => {
          this.searchData = data;

          if (data?.Products) {
            this.searchProducts = [...this.searchProducts, ...data?.Products];
          }

          return data;
        })
        .catch((error) => {
          this.error = true;
          throw error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
