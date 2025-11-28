// stores/productStore.ts
import { defineStore } from 'pinia';
import PaymentService from '~/services/PaymentService';
import type { PaymentType } from '~/types/PaymentType';

export const usePaymentStore = defineStore('paymentStore', {
  state: () => ({
    payments: {} as PaymentType,
    error: false,
    loading: false,
  }),
  actions: {
    async fetchPayment(options: { IdAddress: number }): Promise<PaymentType> {
      const paymentService = new PaymentService();
      this.loading = true;

      return paymentService
        .fetch(options)
        .then((data) => {
          this.payments = data;
          return data;
        })
        .catch((error) => {
          this.error = true;
          return error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
