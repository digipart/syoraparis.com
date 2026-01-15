// stores/productStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

import ProductService from '~/services/ProductService';
import type { ProductType } from '~/types/ProductType';
import { useAppStore } from '~/stores/ui-stores/AppStore';

export const useProductStore = defineStore('productStore', () => {
  const product = ref<ProductType>({} as ProductType);
  const error = ref(false);
  const loading = ref(false);
  const productsAssociation = ref<ProductType[]>([]);
  const isVisisble = ref(false);

  async function fetchProduct(
    idProduct: number,
    options?: any
  ): Promise<ProductType> {
    const productService = new ProductService();
    loading.value = true;
    error.value = false;
    try {
      const data = await productService.fetch(idProduct, options);
      product.value = data;
      return data;
    } catch (e) {
      error.value = true;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchShopTheLook(idProduct: number) {
    const productService = new ProductService();
    const { currencyIsoCode, languageIsoCode } = useAppStore();
    loading.value = true;
    try {
      const data = await productService.fetchShopTheLook(idProduct, {
        CurrencyIsoCode: currencyIsoCode,
        LanguageIsoCode: languageIsoCode,
      });
      isVisisble.value = true;
      productsAssociation.value = data;
    } catch (error) {
      // Handle error appropriately
    } finally {
      loading.value = false;
    }
  }

  return {
    product,
    error,
    loading,
    productsAssociation,
    isVisisble,
    fetchProduct,
    fetchShopTheLook,
  };
});
