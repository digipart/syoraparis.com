import Service from './Services';
import type { CountryType } from '~/types/CountryType';

export default class CountryService extends Service {
  constructor() {
    super();
  }

  async fetch(options: any) {
    try {
      const data = await this.$get<any>('country', {
        options,
      });

      return data.ActiveCountries as CountryType[];
    } catch (error) {
      throw error;
    }
  }
}
