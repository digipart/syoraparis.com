import { defineStore } from 'pinia';
import BrandService from '~/services/BrandService';
import type { BrandType } from '~/types/BrandType';

export const useBrandStore = defineStore('brandStore', () => {
  const brands = ref<BrandType[]>([]);
  const brand = ref<BrandType | null>(null);

  const fetchBrands = () => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    const brandService = new BrandService();
    return brandService
      .fetch({ LanguageIsoCode: languageIsoCode.value })
      .then((data) => {
        brands.value = data;
      });
  };

  const fetchBrand = (slug: string) => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    const brandService = new BrandService();
    return brandService
      .fetchOne({
        BrandDescriptionFriendlyURL: slug,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        brand.value = data;
      });
  };

  return {
    brands,
    brand,
    fetchBrands,
    fetchBrand,
  };
});
