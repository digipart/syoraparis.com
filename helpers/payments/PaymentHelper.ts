import type { AddressType } from '~/types/AddressType';
import type { CustomerType } from '~/types/AuthDataType';
import type { CartType } from '~/types/CartType';
import type { PaymentMethodType } from '~/types/PaymentType';

export class PaymentHelper {
  protected cart: CartType;
  protected customer: CustomerType;

  constructor({ cart, customer }: { cart: CartType; customer: CustomerType }) {
    this.cart = cart;
    this.customer = customer;
  }

  get carrier() {
    return this.cart?.Shipping?.Carrier;
  }

  get shipping() {
    return this.carrier?.Price;
  }

  get discountType() {
    let dtype = '';
    const promoCodeCart = this.cart?.Discounts?.PromoCodes;
    const cartRules = this.cart?.Discounts?.CartRules;
    // const priceRules = this.cart?.Discounts?.PriceRules;

    if (promoCodeCart) {
      dtype = 'PromoCode';
    }
    if (cartRules) {
      if (dtype !== '') {
        dtype += ',';
      }
      dtype += 'CartRule';
    }
    // if (priceRules) {
    //   if (dtype !== "") {
    //     dtype += ",";
    //   }
    //   dtype += "PriceRule";
    // }

    return dtype;
  }

  get promoCodes() {
    let codes = '';
    const promoCodeCart = this.cart?.Discounts?.PromoCodes;
    promoCodeCart?.map((promoCode, index) => {
      if (index !== 0) {
        codes += ',';
      }
      codes += promoCode?.Code;
    });

    return codes;
  }

  toFixed2(val: number) {
    return Number(val.toFixed(2));
  }

  async myIP(): Promise<string> {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow',
    };

    try {
      const response = await fetch('https://api.ipify.org', requestOptions);
      const ipAdd = await response.text();
      return ipAdd;
    } catch (error) {
      return '127.0.0.1';
    }
  }
  fnBrowserDetect() {
    var ua = navigator.userAgent;
    var tem;
    var M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join('/');
  }

  async getBrowserInfo(locale: string) {
    const ipAdd = await this.myIP();
    const browser_info = {
      java_enabled: navigator.javaEnabled(),
      javascript_enabled: true,
      ipaddr: ipAdd,
      http_accept: '*/*',
      http_user_agent: this.fnBrowserDetect(),
      language: locale,
      color_depth: 1,
      screen_height: 1080,
      screen_width: 1920,
      timezone: new Date().getTimezoneOffset(),
    };

    if (typeof window !== 'undefined') {
      browser_info.color_depth = window.screen.colorDepth;
      browser_info.screen_height = window.screen.height;
      browser_info.screen_width = window.screen.width;
    }

    return browser_info;
  }

  get userConnected() {
    return this.customer;
  }

  get custom_data_cart() {
    const cart: any[] = [];
    this.cart?.Products?.map((item) => {
      let promotionalPrice = item?.Price?.PromotionalPrice;
      let regularPrice = item?.Price?.RegularPrice;
      let price = regularPrice;

      if (promotionalPrice) {
        price = promotionalPrice;
      }

      cart.push({
        Reference: item.Reference,
        IdProduct: item.IdProduct,
        Quantity: item.Quantity,
        PriceTaxExcl: price?.PriceTaxExcl,
        PriceTaxIncl: price?.PriceTaxIncl,
        // EAN13: item.Variant.EAN13,
        IdProductAttribute: item.IdProductAttribute,
      });
    });
    return cart;
  }

  custom_data({
    paymentMethod,
    addressDelivery,
    addressInvoice,
  }: {
    paymentMethod?: PaymentMethodType;
    addressDelivery?: AddressType;
    addressInvoice?: AddressType;
  }) {
    const data = {
      IdCarrier: this.carrier?.IdCarrier,

      IdAddress: addressDelivery?.IdAddress,
      IdAddressInvoice: addressInvoice?.IdAddress,

      ConversionRate: this.cart?.Currency?.ConversionRate,

      IdCurrency: this.cart?.Currency?.IdCurrency, // ??????????????
      CurrencyIsoCode: this.cart?.Currency?.IsoCode, // ??????????????

      ProductTaxRate: this.cart?.Country?.TaxRate,
      ShippingTaxRate: this.cart?.Country?.TaxRate, //????????

      TotalPaidTaxExcl: this.cart?.Total?.ToPay?.TaxExcl,
      TotalPaidTaxIncl: this.cart?.Total?.ToPay?.TaxIncl,
      ShippingCostTaxExcl: this.shipping?.TaxExcl,
      ShippingCostTaxIncl: this.shipping?.TaxIncl,

      TotalDiscountTaxExcl: this.cart?.Total?.Discount?.TaxExcl,
      TotalDiscountTaxIncl: this.cart?.Total?.Discount?.TaxIncl,

      DiscountName: this.discountType,
      DiscountTypes: this.discountType,
      PromoCodes: this.promoCodes,

      TotalProductTaxExcl: this.cart?.Total?.Product?.TaxExcl,
      TotalProductTaxIncl: this.cart?.Total?.Product?.TaxIncl,
      IdCustomer: this.userConnected.Id,
      IdCart: this.cart.IdCart,
      Cart: JSON.stringify(this.custom_data_cart),
      IdPayment: paymentMethod ? paymentMethod.IdPayment : 0,
      UsesPromoCode: this.discountType !== '',
    };

    // if (this.promoCode) {
    //   data.PromoCode = this.promoCode.code;
    //   data.UsesPromoCode = "true";
    // } else {
    //   data.UsesPromoCode = "false";
    // }

    return data;
  }
}
