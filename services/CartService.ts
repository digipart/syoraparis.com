import type { CartType } from '~/types/CartType';
import Service from './Services';

export default class CartService extends Service {
  constructor() {
    super();
  }

  async fetch(options: any) {
    try {
      const data = await this.$get<CartType>('cart', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async add(options: any) {
    try {
      const data = await this.$post<CartType>('cart/product/add', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async update(options: any) {
    try {
      const data = await this.$put<CartType>('cart/product/update', {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async remove(options: any) {
    try {
      const data = await this.$delete<CartType>('cart/product/delete', {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateShipping(options: {
    IdCart?: number;
    IdCarrier?: number;
    IdRelayPoint?: string;
  }) {
    try {
      const data = await this.$put<{
        IdCart: number;
        message: string;
        params: string;
      }>('cart/carrier', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getNewCart() {
    try {
      const data = await this.$get<{ IdCart: number }>('cart/new', {
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
