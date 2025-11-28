import Service from './Services';

export default class CodepromoService extends Service {
  constructor() {
    super();
  }

  async apply(options: {
    IdCart: number;
    PromoCode: string;
    LanguageIsoCode: string;
  }) {
    try {
      const data = await this.$post<any>('cart/promocode/add', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async delete(options: { IdCart: number; IdPromoCode: number }) {
    try {
      const data = await this.$delete<any>('cart/promocode/delete', {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
