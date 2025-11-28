import { defineStore } from 'pinia';
import CetegoryService from '~/services/CategoryService';
import type {
  CategoriesType,
  CategoryType,
  FilterAttributesType,
} from '~/types/CategoryType';

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories = ref<CategoriesType[]>([]);
  const filterAttributes = ref<FilterAttributesType | null>(null);

  const filterValues = ref({
    sort: '' as
      | string
      | 'price_asc'
      | 'price_desc'
      | 'newest_desc'
      | 'newest_asc',
    // attributesColors: [] as string[],
    // attributesSizes: [] as string[],
    attrs: [] as string[],
    price: [] as number[],
    brands: [] as string[],
    promotion: false,
  });

  const fetchCategories = (): Promise<CategoriesType[]> => {
    const categoryService = new CetegoryService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

    return categoryService
      .categories({ LanguageIsoCode: languageIsoCode.value })
      .then((data) => {
        categories.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  const fetchFilterAttrs = ({
    categoryFriendlyURL,
    brandFriendlyURL,
  }: {
    categoryFriendlyURL?: string;
    brandFriendlyURL?: string;
  }): Promise<FilterAttributesType> => {
    const categoryService = new CetegoryService();
    const appStore = useAppStore();
    const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

    return categoryService
      .fetchFilterAttrs({
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
        ...(categoryFriendlyURL
          ? { CategoryDescriptionFriendlyURL: categoryFriendlyURL }
          : {}),
        ...(brandFriendlyURL
          ? { BrandDescriptionFriendlyURL: brandFriendlyURL }
          : {}),
      })
      .then((data) => {
        filterAttributes.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const getRouteParam = (param: any): string[] => {
    return Array.isArray(param) ? param : [param];
  };

  const initFilterAttrs = () => {
    const route = useRoute();

    filterValues.value.sort = route.query.sort
      ? (route.query.sort as string)
      : '';

    filterValues.value.promotion = route.query.promotion ? true : false;

    filterValues.value.attrs = route.query.attrs
      ? getRouteParam(route.query.attrs)
      : [];

    filterValues.value.brands = route.query.brands
      ? getRouteParam(route.query.brands)
      : [];

    // filterValues.value.attributesSizes = route.query.sizes
    //   ? getRouteParam(route.query.sizes)
    //   : [];

    filterValues.value.price = route.query.price
      ? (route.query.price as string[]).map(Number)
      : [
          filterAttributes.value?.FilterPrice?.RegularPrice?.MinPriceTaxIncl ||
            0,
          filterAttributes.value?.FilterPrice?.RegularPrice?.MaxPriceTaxIncl ||
            1000,
        ];
  };

  return {
    categories,
    filterAttributes,
    filterValues,
    fetchCategories,
    fetchFilterAttrs,
    initFilterAttrs,
  };
});
