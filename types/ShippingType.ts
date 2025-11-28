export type ShippingType = {
  Carriers?: string[];
  Carrier?: CarrierType;
};

export type CarrierType = {
  Home?: CarrierGenre[];
  Store?: CarrierGenre[];
  RelayPoint?: CarrierGenre[];
};

export type CarrierGenre = {
  IdCarrier?: number;
  IdRelayPoint?: string;
  Name?: string;
  Title?: string;
  Description?: string;
  Price?: Price;
};

type Price = {
  TaxExcl?: number;
  TaxIncl?: number;
};
