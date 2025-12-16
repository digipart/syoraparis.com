import type { CartType } from '~/types/CartType';
import { PaymentHelper } from './PaymentHelper';
import type { CustomerType } from '~/types/AuthDataType';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { AddressType } from '~/types/AddressType';
import Service from '~/services/Services';

type MollieResponse = {
  success: boolean;
  payment: {
    resource: 'payment';
    id: string;
    mode: 'test';
    createdAt: string;
    amount: {
      value: string;
      currency: string;
    };
    description: string;
    method: null;
    metadata: null;
    status: string;
    isCancelable: false;
    expiresAt: string;
    profileId: string;
    sequenceType: 'oneoff';
    redirectUrl: string;
    webhookUrl: string;
    _links: {
      self: {
        href: string;
        type: 'application/hal+json';
      };
      checkout: {
        href: string;
        type: 'text/html';
      };
      dashboard: {
        href: string;
        type: 'text/html';
      };
      documentation: {
        href: string;
        type: 'text/html';
      };
    };
  };
  paymentUrl?: string;
};

export default class MollieHelper extends PaymentHelper {
  constructor({ cart, customer }: { cart: CartType; customer: CustomerType }) {
    super({ cart, customer });
  }

  async startPayement({
    token,
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    token: string;
    paymentMethod: PaymentMethodType;
    addressDelivery: AddressType;
    addressInvoice: AddressType;
  }) {
    let total = 0;

    try {
      if (this.cart?.Total?.ToPay?.TaxIncl) {
        total = this.cart?.Total?.ToPay?.TaxIncl;
      }

      const config = useRuntimeConfig();
      // Send token to your backend with order details
      const response = await $fetch<MollieResponse>('/api/mollie/process', {
        method: 'POST',
        body: {
          token,
          amount: {
            currency: this.cart?.Currency?.IsoCode,
            value: total.toFixed(2),
          },
          orderId: this.cart.IdCart,
          redirectUrl: `${config.public.url}/order/accepted?orderid=${this.cart.IdCart}&init=1`,
          webhookUrl: 'https://sy.digipart.fr/api/payment/mollie/ipn',
          description: 'Order #' + this.cart.IdCart,
          metadata: JSON.stringify(
            this.custom_data({ })
          ),
        },
      });

      if (response.success) {
        this.postData({
          token: response.payment.id,
          paymentMethod: paymentMethod,
          addressDelivery: addressDelivery,
          addressInvoice: addressInvoice,
        });
        return response;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      throw error;
    }
  }

  async startPayementMethod({
    paymentName,
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    paymentName: string;
    paymentMethod: PaymentMethodType;
    addressDelivery: AddressType;
    addressInvoice: AddressType;
  }) {
    let total = 0;

    try {
      if (this.cart?.Total?.ToPay?.TaxIncl) {
        total = this.cart?.Total?.ToPay?.TaxIncl;
      }

      const config = useRuntimeConfig();

      const response = await $fetch<MollieResponse>('/api/mollie/create', {
        method: 'POST',
        body: {
          method: paymentName,
          amount: {
            currency: this.cart?.Currency?.IsoCode,
            value: total.toFixed(2),
          },
          orderId: this.cart.IdCart,
          redirectUrl: `${config.public.url}/order/accepted?orderid=${this.cart.IdCart}&init=1`,
          webhookUrl: 'https://sy.digipart.fr/api/payment/mollie/ipn',
          description: 'Order #' + this.cart.IdCart,
          metadata: JSON.stringify(
            this.custom_data({ paymentMethod, addressDelivery, addressInvoice })
          ),
        },
      });

      if (response.paymentUrl) {
        return response;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      throw error;
    }
  }
  async postData({
    token,
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    token: string;
    paymentMethod: PaymentMethodType;
    addressDelivery: AddressType;
    addressInvoice: AddressType;
  }) {
    try {
      const service = new Service();
      const response = await service.$post<any>('payment/mollie/data', {
        options: {
          CardToken: token,
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
