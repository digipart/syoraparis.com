import Service from './Services';
import type { PaymentType } from '~/types/PaymentType';

export default class PaymentService extends Service {
  constructor() {
    super();
  }

  async paymentMethods(options: any) {
    try {
      const data = await this.$get<PaymentType>('payment/methods', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
