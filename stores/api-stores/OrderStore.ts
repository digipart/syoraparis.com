import { defineStore } from 'pinia';
import OrderService from '~/services/OrderService';
import type { ListOrdersType, OrderType } from '~/types/OrderType';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    ordersList: {} as ListOrdersType,
    order: null as OrderType | null,
  }),
  actions: {
    fetchOrderes(): Promise<ListOrdersType> {
      const appStore = useAppStore();
      const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

      const orderService = new OrderService();
      const options: {
        LanguageIsoCode: string;
        CurrencyIsoCode: string;
      } = {
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
      };

      return orderService
        .fetch(options)
        .then((data) => {
          this.ordersList = data;
          return data;
        })
        .catch((error) => {
          return error;
        });
    },
    fetchOrderById(idOrder: string): Promise<OrderType> {
      const appStore = useAppStore();
      const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

      const orderService = new OrderService();
      const options: {
        IdOrder: string;
        LanguageIsoCode: string;
        CurrencyIsoCode: string;
      } = {
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
        IdOrder: idOrder,
      };

      return orderService
        .fetchOrderById(options)
        .then((data) => {
          this.order = data;
          return data;
        })
        .catch((error) => {
          return error;
        });
    },
  },
});
