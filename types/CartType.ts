import type { CountryType } from './CountryType';
import type { CurrencyType } from './CurrencyType';
import type { ProductType } from './ProductType';
import type { CarrierGenre } from './ShippingType';

export type CartType = {
  IdCart?: number;
  Currency?: CurrencyType;
  Country?: CountryType;
  Total?: Total;
  Products?: ProductType[];
  Shipping?: Shipping;
  Discounts?: Discounts;
};

export type Total = {
  Product?: TotalProduct;
  Shipping?: Discount;
  Discount?: Discount;
  ToPay?: Discount;
};

export type Discount = {
  TaxExcl?: number;
  TaxIncl?: number;
};

export type TotalProduct = {
  Quantity?: number;
  TaxExcl?: number;
  TaxIncl?: number;
};

export type Shipping = {
  Carrier?: CarrierGenre;
};

export type Discounts = {
  PromoCodes?: CartPromoCode[];
  CartRules?: CartRules[];
};

export type CartPromoCode = {
  IdPromoCode?: number;
  Title?: string;
  Description?: string;
  Code?: string;
  Reduction?: Reduction;
  FreeDelivery?: boolean;
  StartDate?: string;
  EndDate?: string;
};

export type Reduction = {
  Type?: string;
  Percentage?: number;
  Value?: Value;
};

export type Value = {
  TaxExcl?: number;
  TaxIncl?: number;
};

export type CartRules = {
  Code?: string;
};

export type GiftCardPayload = {
  email: string;
  fullName: string;
  message: string;
  dateSend: string;
  productType?: string;
  languageIsoCode?: string;
};
