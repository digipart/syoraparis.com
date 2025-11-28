import type { MenuType } from '~/types/MenuType';
import Service from './Services';
import type {
  StockInStoreType,
  StoreReservationProductType,
} from '~/types/StoreReservationProductType';

export default class ShopService extends Service {
  constructor() {
    super();
  }

  async fetchMenu(options: { IdMenu?: number; LanguageIsoCode?: string }) {
    try {
      const data = await this.$get<MenuType>('menu/menu', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async subscribeNewsletter(options: {
    Email?: string;
    CurrencyIsoCode?: string;
    LanguageIsoCode?: string;
  }) {
    try {
      const data = await this.$post<any>('newsletter/subscribe', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async unSubscribeNewsletter() {
    try {
      const data = await this.$post<any>('newsletter/unsubscribe');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async backInStock(options: {
    Email: string;
    IdProduct: number;
    IdProductAttribute: number;
    LanguageIsoCode: string;
  }) {
    try {
      const data = await this.$post<any>('campaign/backInStock', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async abandonedOfVisit(options: { Email: string; IdCart: number }) {
    try {
      const data = await this.$post<any>('cart/abandoned', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessageContactUs(options: {
    Firstname: string;
    Lastname: string;
    Email: string;
    Subject: string;
    Message: string;
  }) {
    try {
      const data = await this.$post<any>(`ticket/contact`, { options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async storeReservationProduct(options: {
    IdProduct: number;
    IdProductAttribute: number;
  }) {
    try {
      const data = await this.$get<StoreReservationProductType>(
        `store/reservation/product/stock`,
        {
          options,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async saveReservationInStore(options: {
    IdStore: number;
    IdProductAttribute: number;
    IdGender: number;
    Firstname: string;
    Lastname: string;
    Email: string;
    MobilePhone: string;
    IdProduct: number;
    Quantity: 1;
    PriceTaxIncl: number;
    PriceTaxExcl: number;
  }) {
    try {
      const data = await this.$post<StoreReservationProductType>(
        `store/reservation/product/reserve`,
        {
          options,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async stores(options?: {
    LanguageIsoCode?: string;
    Latitude?: number;
    Longitude?: number;
    radius?: number;
  }) {
    if (options?.Latitude) {
      options.radius = 100;
    }
    try {
      const data = await this.$get<StockInStoreType[]>(`store/locator`, {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
