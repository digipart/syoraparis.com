// stores/productStore.ts
import { defineStore } from 'pinia';

import ProductService from '~/services/ProductService';
import type { ProductType } from '~/types/ProductType';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    product: {} as ProductType,
    error: false,
    loading: false,
  }),
  actions: {
    async fetchProduct(idProduct: number, options?: any): Promise<ProductType> {
      const productService = new ProductService();
      this.error = false;
      this.loading = true;

      return productService
        .fetch(idProduct, options)
        .then((data) => {
          this.product = data;
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
