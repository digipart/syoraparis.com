import type { ListOrdersType, OrderType } from '~/types/OrderType';
import Service from './Services';
import type { BrandType } from '~/types/BrandType';

export default class BrandService extends Service {
  constructor() {
    super();
  }

  async fetch(options: { LanguageIsoCode?: string }) {
    try {
      const data = await this.$get<BrandType[]>('brands', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchOne(options: {
    BrandDescriptionFriendlyURL: string;
    LanguageIsoCode?: string;
  }) {
    try {
      const data = await this.$get<BrandType>('brand/1', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
