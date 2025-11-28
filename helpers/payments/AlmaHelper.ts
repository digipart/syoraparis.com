import type { AddressType } from '~/types/AddressType';
import { PaymentHelper } from './PaymentHelper';
import type { PaymentMethodType } from '~/types/PaymentType';
import type { CartType } from '~/types/CartType';
import type { CustomerType } from '~/types/AuthDataType';

export default class AlmaHelper extends PaymentHelper {
  #installmentsCount: number;
  locale: string;

  constructor({
    cart,
    customer,
    locale,
  }: {
    cart: CartType;
    customer: CustomerType;
    locale: string;
  }) {
    super({ cart, customer });
    this.#installmentsCount = 1;
    this.locale = locale;
  }

  #getAddress(address: AddressType) {
    return {
      company: address.Company,
      first_name: address.Firstname,
      last_name: address.Lastname,
      email: '',
      phone: address.MobilePhone,
      line1: address.Address1,
      line2: address.Address2,
      postal_code: address.Postcode,
      city: address.City,
      country: address.Country,
    };
  }
  //Payment
  #payment({
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    paymentMethod: PaymentMethodType;
    addressDelivery: AddressType;
    addressInvoice: AddressType;
  }) {
    const amount = this.cart?.Total?.ToPay?.TaxIncl || 0;
    const idorder = this.cart.IdCart;

    const config = useRuntimeConfig();

    return {
      purchase_amount: amount * 100,
      installments_count: this.#installmentsCount,
      shipping_address: this.#getAddress(addressDelivery),
      billing_address: this.#getAddress(addressInvoice),
      customer_cancel_url: '',
      deferred_months: 0,
      deferred_days: 0,
      ipn_callback_url: '',
      origin: 'online', //online,pos_device,pos_sms,pos_link,pos_terminal
      return_url: `${config.public.url}/order/accepted?orderid=${idorder}&cartid=${this.cart.IdCart}&init=1`, ///cart/thanks/accepted?orderid=${orderRes.IdOrder}&cartid=${$this.cartService.idCart}
      // ipn_callback_url: process.env.ALMA_IPN_CALLBACK_URL,
      locale: this.locale,
      deferred: '', //'trigger',null
      deferred_description: '', //text
      expires_after: 2880, //2880
      custom_data: this.custom_data({
        paymentMethod,
        addressDelivery,
        addressInvoice,
      }),
    };
  }

  //Customer
  get #customer() {
    const user = this.customer;

    return {
      id: user.Id,
      //   created: "date",
      first_name: user.Firstname,
      last_name: user.Lastname,
      //   addresses: this.#addresses,
      email: user.Email,
      //   phone: "",
      // birth_date: user.birthDate,
      //   birth_place: "",
      //   card: {},
      //   banking_data_collected: true,
      is_business: false,
      business_id_number: 'Siren',
      business_name: 'acme',
    };
  }

  //Order
  get #order() {
    return {
      merchant_reference: '',
      merchant_url: '',
      data: {},
      customer_url: '',
      comment: '',
    };
  }

  async checkout({
    installmentsCount = 1,
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    installmentsCount: number;
    paymentMethod: PaymentMethodType;
    addressDelivery: AddressType;
    addressInvoice: AddressType;
  }) {
    this.#installmentsCount = installmentsCount;
    const paymentOrder = {
      payment: this.#payment({
        paymentMethod,
        addressDelivery,
        addressInvoice,
      }),
      customer: this.#customer,
      order: this.#order,
    };
    
    const config = useRuntimeConfig();
    const almaToken = config.public.almaToken;
    const almaUrl = config.public.almaUrl;
    
    return await $fetch(`${almaUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Alma-Auth ${almaToken}`
      },
      body: paymentOrder
    });
  }
}
