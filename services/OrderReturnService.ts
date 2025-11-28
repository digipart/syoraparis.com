import type { Variant } from '~/types/ProductType';
import Service from './Services';
import type {
  OrderReturnListType,
  OrderReturnsListType,
  OrderReturnType,
} from '~/types/OrderReturnType';

export default class OrderReturnService extends Service {
  constructor() {
    super();
  }

  async fetch(options: { LanguageIsoCode: string }) {
    try {
      const data = await this.$get<OrderReturnListType>('order/return/list', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchReturnDetail(options: {
    LanguageIsoCode: string;
    IdOrderReturn: number;
  }) {
    try {
      const data = await this.$get<OrderReturnType>('order/return/detail', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchReasons(options: any) {
    try {
      const data = await this.$get<OrderReturnsListType>(
        'order/return/reasons',
        {
          options,
          isAuth: true,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchAvailability(
    idProduct: number,
    options: { LanguageIsoCode: string }
  ) {
    try {
      const data = await this.$get<Variant[]>(`product/${idProduct}/variant`, {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createReturn(options: {
    IdOrder: string;
    Products: any;
    LanguageIsoCode: string;
  }) {
    try {
      const data = await this.$post<{ IdOrderReturn: number }>(
        'order/return/create',
        {
          options,
          isAuth: true,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
