import type { CartType } from '~/types/CartType';
import { PaymentHelper } from './PaymentHelper';
import type { CustomerType } from '~/types/AuthDataType';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { AddressType } from '~/types/AddressType';
import Service from '~/services/Services';

export default class StripePayment extends PaymentHelper {
  constructor({ cart, customer }: { cart: CartType; customer: CustomerType }) {
    super({ cart, customer });
  }

  async intent({
    paymentMethodTypes,
    automaticPaymentMethods,
    address,
    amount,
    clientSecret,
    email,
    firstname,
    lastname,
    idCart,
    idCarrier,
    idRelayPoint,
  }: {
    paymentMethodTypes?: string;
    automaticPaymentMethods?: any;
    address?: {
      Address1?: string;
      Postcode?: string;
      City?: string;
      Country?: string;
    };
    amount?: number;
    clientSecret?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    idCart?: number;
    idCarrier?: number;
    idRelayPoint?: string;
  }) {
    let total = amount || 0;

    try {
      const service = new Service();

      if (!amount && this.cart?.Total?.ToPay?.TaxIncl) {
        total = this.cart?.Total?.ToPay?.TaxIncl * 100;
      }

      const response = await service.$post<any>('payment/stripe/intent', {
        options: {
          Amount: total,
          CurrencyIsoCode: this.cart?.Currency?.IsoCode || 'EUR',
          PaymentMethodTypes: paymentMethodTypes || 'card',
          ...(automaticPaymentMethods ? { AutomaticPaymentMethods: automaticPaymentMethods } : {}),
          Address: address?.Address1 || '',
          Address1: address?.Address1 || '',
          Postcode: address?.Postcode || '',
          City: address?.City || '',
          Country: address?.Country || '',
          Email: email || '',
          Firstname: firstname || '',
          Lastname: lastname || '',
          IdCart: idCart || this.cart?.IdCart,
          IdCarrier: idCarrier || 0,
          IdRelayPoint: idRelayPoint || '',
          ...(clientSecret ? { ClientSecret: clientSecret } : {}),
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
