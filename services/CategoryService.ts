import type {
  CategoriesType,
  CategoryType,
  FilterAttributesType,
} from '~/types/CategoryType';
import Service from './Services';

export default class CetegoryService extends Service {
  constructor() {
    super();
  }

  categories(options: { LanguageIsoCode: string }): Promise<CategoriesType[]> {
    return this.$get<CategoriesType[]>('menu', { options })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }
  async fetch(options: any) {
    try {
      const route = useRoute();
      if (route.query.token) {
        options.token = route.query.token as string;
      }
      const data = await this.$get<CategoryType>('category', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async products(options: any) {
    try {
      const route = useRoute();
      if (route.query.token) {
        options.token = route.query.token as string;
      }
      const data = await this.$get<CategoryType>(`category/product`, {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  fetchSubCategories(options: { IdCategory: number; LanguageIsoCode: string }) {
    return this.$get<{ SubCategories: CategoryType[] }>('category/sub', {
      options,
    })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  fetchFilterAttrs(options: {
    LanguageIsoCode: string;
    CurrencyIsoCode: string;
    CategoryDescriptionFriendlyURL?: string;
    BrandDescriptionFriendlyURL?: string;
  }): Promise<FilterAttributesType> {
    return this.$get<FilterAttributesType>('category/filter', { options })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }
}
