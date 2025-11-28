import type { ProductType } from './ProductType';

export type ListOrdersType = {
  TotalOrders: number;
  LanguageIsoCode: string;
  Currency: {
    IsoCode: string;
    IdCurrency: number;
    ConversionRate: number;
  };
  OrderStateType: {
    created: number;
    preparation: number;
    shipped: number;
    delivered: number;
    canceled: number;
  };
  Orders?: OrderType[];
};

export type OrderType = {
  LanguageIsoCode?: string;
  IdOrder?: string;
  DateAdd?: string;
  TotalProducts?: number;
  Currency?: {
    IsoCode?: string;
    IdCurrency?: number;
    ConversionRate?: number;
  };
  OrderReturn?: {
    Available?: boolean;
    MaxDelay?: number;
    Message?: string;
  };
  State?: {
    Code?: number;
    Label?: string;
  };
  Total?: {
    Product?: {
      TaxExcl?: number;
      TaxIncl?: number;
    };
    Shipping?: {
      TaxExcl?: number;
      TaxIncl?: number;
    };
    Discount?: {
      TaxExcl?: number;
      TaxIncl?: number;
    };
    Paid?: {
      TaxExcl?: number;
      TaxIncl?: number;
    };
  };
  Carrier?: {
    IdCarrier?: number;
    Name?: string;
  };
  Payment?: {
    IdPaymentPay?: number;
    Name?: string;
  };
  Products?: ProductOrderType[];
  Shipping?: {
    Date?: string | null;
    Tracking?: {
      Number?: string;
      URL?: string;
    };
    Address?: {
      IdAddress?: number;
      Lastname?: string;
      Firstname?: string;
      Address1?: string;
      Address2?: string;
      Postcode?: string;
      City?: string;
      Country?: string;
      MobilePhone?: string;
      Phone?: string;
    };
    State?: {
      Code?: number;
      Label?: string;
    };
  };
  Delivery?: {
    Date?: string | null;
    State?: {
      Code?: number;
      Label?: string;
    };
  };
  Invoice?: {
    URL?: string;
    Address?: {
      IdAddress?: number;
      Lastname?: string;
      Firstname?: string;
      Address1?: string;
      Address2?: string;
      Postcode?: string;
      City?: string;
      Country?: string;
      MobilePhone?: string;
      Phone?: string;
    };
  };
};

export type ProductOrderType = {
  IdProduct?: number;
  IdOrderDetail?: number;
  Title?: string;
  Quantity?: number;
  Reference?: string;
  Return?: Return;
  Price?: Price;
  Variant?: Variant;
  SEO?: SEO;
  Category?: null;
  Media?: Media;
};

type ReturnAttribute = {
  IdProductAttribute?: number;
  Attribute?: Attribute;
};

type Media = {
  Images?: Images;
};

type Images = {
  product_xsmall?: ProductSmall[];
  product_small?: ProductSmall[];
  product_medium?: ProductSmall[];
};

type ProductSmall = {
  Src?: string;
  Position?: number;
  Width?: number;
  Height?: number;
  Cover?: boolean;
  Ghost?: boolean;
};

type Price = {
  Paid?: Base;
  Base?: Base;
  Reduction?: Reduction;
};

type Base = {
  TaxExcl?: number;
  TaxIncl?: number;
};

type Reduction = {
  Label?: string;
};

type Return = {
  Available?: boolean;
  Message?: string;
};

type SEO = {
  LanguageIsoCode?: string;
  MetaTitle?: string;
  MetaDescription?: string;
  URL?: string;
};

type Variant = {
  EAN13?: number;
  Quantity?: number;
  Available?: boolean;
  Combination?: Combination;

  Original?: AttributeReturnDetail;
  New?: AttributeReturnDetail;
};

type Combination = {
  IdProductAttribute?: number;
  Attributes?: Attribute[];
};

type Attribute = {
  LanguageIsoCode?: string;
  AttributeName?: string;
  GroupName?: string;
};
type AttributeReturnDetail = {
  Attribute: { Color?: string; Size?: string };
};
