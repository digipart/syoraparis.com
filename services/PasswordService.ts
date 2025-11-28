import Service from './Services';

export default class PasswordService extends Service {
  constructor() {
    super();
  }

  async forget(options: { Email: string; LanguageIsoCode: string }) {
    try {
      const data = await this.$post<{ Status: string; Message: string }>(
        'customer/password/forget',
        { options }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async reset(options: { Email: string; Token: string; Password: string }) {
    try {
      const data = await this.$post<{ Status: string; Message: string }>(
        'customer/password/reset',
        { options }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
