import type { FavoriteType } from '~/types/FavoriteType';
import Service from './Services';

export default class FavoriteService extends Service {
  constructor() {
    super();
  }

  async fetch(options: any) {
    try {
      const data = await this.$get<FavoriteType>('favorite', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async add(options: any) {
    try {
      const data = await this.$post<FavoriteType>('favorite/add', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async remove(options: any) {
    try {
      const data = await this.$delete<FavoriteType>('favorite/delete', {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
