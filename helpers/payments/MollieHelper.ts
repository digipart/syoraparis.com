import type { CartType } from '~/types/CartType';
import { PaymentHelper } from './PaymentHelper';
import type { CustomerType } from '~/types/AuthDataType';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { AddressType } from '~/types/AddressType';
import Service from '~/services/Services';

export default class MollieHelper extends PaymentHelper {
  constructor({ cart, customer }: { cart: CartType; customer: CustomerType }) {
    super({ cart, customer });
  }

  async intent(CardToken: string) {
    let total = 0;

    try {
      const service = new Service();

      if (this.cart?.Total?.ToPay?.TaxIncl) {
        total = this.cart?.Total?.ToPay?.TaxIncl;
      }

      const response = await service.$post<any>('payment/mollie/intent', {
        options: {
          Amount: total.toFixed(2),
          CurrencyIsoCode: this.cart?.Currency?.IsoCode,
          CardToken,
        },
        isAuth: true,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async postData({
    clientSecret,
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    clientSecret: string;
    paymentMethod: PaymentMethodType;
    addressDelivery: AddressType;
    addressInvoice: AddressType;
  }) {
    try {
      const service = new Service();
      const response = await service.$post<any>('payment/stripe/data', {
        options: {
          ClientSecret: clientSecret,
          Metadata: JSON.stringify(
            this.custom_data({ paymentMethod, addressDelivery, addressInvoice })
          ),
        },
        isAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
