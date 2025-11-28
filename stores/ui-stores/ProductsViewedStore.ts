import { defineStore } from 'pinia';
import { useLocalStorage } from '~/composables/useLocalStorage';
import type { ProductType } from '~/types/ProductType';

const PRODUCT_VISITED = 'PRODUCT_VISITED';

export const useProductsViewedStore = defineStore('ProductsViewedStore', {
  state: () => ({
    productSViewed: [] as ProductType[],
  }),
  actions: {
    addProductToViewedStore(product: ProductType) {

      const maxProduct = 6;
      const index = this.productSViewed.findIndex((item) => {
        try {
          return item.IdProduct === product.IdProduct;
        } catch (error) {}

        return false;
      });

      if (index !== -1) {
        this.productSViewed.splice(index, 1);
      }

      if (this.productSViewed.length >= maxProduct) {
        this.productSViewed.splice(maxProduct - 1, 1);
      }
      if (typeof product === 'object' && product !== null) {
        this.productSViewed.unshift(product);
      }
      const productsV = useLocalStorage(PRODUCT_VISITED, []);
      productsV.value = this.productSViewed;
    },
    initProductViewedStore() {
      const products = useLocalStorage(PRODUCT_VISITED, []);
      this.productSViewed = products.value;
    },
  },
});
