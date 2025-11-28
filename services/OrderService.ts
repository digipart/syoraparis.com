import type { ListOrdersType, OrderType } from '~/types/OrderType';
import Service from './Services';

export default class OrderService extends Service {
  constructor() {
    super();
  }

  async fetch(options: any) {
    try {
      const data = await this.$get<ListOrdersType>('order/list', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchOrderById(options: any) {
    try {
      const data = await this.$get<ListOrdersType>('order/detail', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
