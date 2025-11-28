import Service from '~/services/Services';
import { PaymentHelper } from './PaymentHelper';
import type { AddressType } from '~/types/AddressType';
import type { CartType } from '~/types/CartType';
import type { PaymentMethodType } from '~/types/PaymentType';

/**
 * PayzenHelper class extends PaymentHelper to provide Payzen payment functionality.
 */
export default class PayzenHelper extends PaymentHelper {
  /**
   * Retrieves a form token for the Payzen payment form.
   *
   * @param {string} paymentMethodTypes - The type of payment method (default: 'card').
   * @returns {Promise<{ formToken: string, success: boolean }>} A promise resolving to an object containing the form token and a success flag.
   */
  async getFormToken(cart: CartType) {
    const options = {
      Amount: (cart?.Total?.ToPay?.TaxIncl || 0) * 100,
      CurrencyIsoCode: cart?.Currency?.IsoCode,
      IdCart: cart?.IdCart,
    };

    const service = new Service();

    try {
      const response: { ClientToken: string } = await service.$post(
        '/payment/payzen/token',
        { options, isAuth: true }
      );
      return response?.ClientToken;
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
    var FormData = require('form-data');
    var formData = new FormData();

    formData.append('ClientSecret', clientSecret);
    formData.append(
      'Metadata',
      JSON.stringify(
        this.custom_data({ paymentMethod, addressDelivery, addressInvoice })
      )
    );
    const service = new Service();
    try {
      // Fix: Use the correct Payzen endpoint instead of Stripe
      const response = await service.$post('/payment/payzen/data', formData);
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
