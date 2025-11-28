import type { SearchType } from '~/types/SearchType';
import Service from './Services';
import type { ProductType, Variant } from '~/types/ProductType';

export default class ProductService extends Service {
  constructor() {
    super();
  }

  async fetch(idProduct: number, options?: any) {
    const appStore = useAppStore();
    const { currencyIsoCode, languageIsoCode } = toRefs(appStore);
    const route = useRoute();

    if (route.query.token) {
      options = {
        ...options,
        token: route.query.token as string,
      };
    }
    options = {
      ...options,
      ...{
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
      },
    };

    try {
      const data = await this.$get<ProductType>(`product/${idProduct}`, {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchVariant(idProduct: number, options?: any) {
    const appStore = useAppStore();
    const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

    options = {
      ...options,
      ...{
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
      },
    };

    try {
      const data = await this.$get<Variant[]>(`product/${idProduct}/variant`, {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchMedias(idProduct: number, options?: any) {
    try {
      const data = await this.$get<Variant[]>(`product/${idProduct}/media`, {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  fetchSearch(options?: {
    Term?: string;
    CurrencyIsoCode?: string;
    LanguageIsoCode?: string;
    Offset?: number;
    Limit?: number;
  }): Promise<SearchType> {
    return this.$post<SearchType>(`product/search`, {
      options,
    })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  fetchShopTheLook(
    idProduct: number,
    options?: {
      CurrencyIsoCode?: string;
      LanguageIsoCode?: string;
    }
  ): Promise<ProductType[]> {
    return this.$get<ProductType[]>(`product/${idProduct}/association`, {
      options,
    })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  

}
