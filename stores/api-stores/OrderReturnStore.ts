import { defineStore } from 'pinia';
import OrderReturnService from '~/services/OrderReturnService';
import type {
  OrderReturnListType,
  OrderReturnsListType,
  OrderReturnType,
} from '~/types/OrderReturnType';

export const useOrderReturnStore = defineStore('orderReturnStore', {
  state: () => ({
    orderReturns: null as OrderReturnsListType | null,
    orderReturnList: {} as OrderReturnListType,
    orderReturn: null as OrderReturnType | null,
  }),
  actions: {
    fetchOrdereReturns(): Promise<OrderReturnListType> {
      const appStore = useAppStore();
      const { languageIsoCode } = toRefs(appStore);

      const orderReturnsService = new OrderReturnService();
      const options: {
        LanguageIsoCode: string;
      } = {
        LanguageIsoCode: languageIsoCode.value,
      };

      return orderReturnsService
        .fetch(options)
        .then((data) => {
          this.orderReturnList = data;
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    fetchReturnDetail(IdOrderReturn: number): Promise<OrderReturnType> {
      const appStore = useAppStore();
      const { languageIsoCode } = toRefs(appStore);

      const orderReturnsService = new OrderReturnService();
      const options: {
        IdOrderReturn: number;
        LanguageIsoCode: string;
      } = {
        IdOrderReturn: IdOrderReturn,
        LanguageIsoCode: languageIsoCode.value,
      };

      return orderReturnsService
        .fetchReturnDetail(options)
        .then((data) => {

          this.orderReturn = data;
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    fetchReasons(): Promise<OrderReturnsListType> {
      const appStore = useAppStore();
      const { languageIsoCode } = toRefs(appStore);

      const orderReturnService = new OrderReturnService();
      const options: {
        LanguageIsoCode: string;
      } = {
        LanguageIsoCode: languageIsoCode.value,
      };

      return orderReturnService
        .fetchReasons(options)
        .then((data) => {
          this.orderReturns = data;
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
  },
});
