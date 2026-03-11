export type AddressType = {
  IdAddress?: number;
  Alias?: string;
  Company?: null | string;
  Lastname?: string;
  Firstname?: string;
  Address1?: string;
  Address2?: string;
  Postcode?: string;
  City?: string;
  Country?: string;
  CountryIsoCode?: string;
  StateName?: string;
  StateCode?: string;
  StateIsoCode?: string;
  MobilePhone?: string;
  Phone?: string;
  IsInvoice?: boolean;
  IsDelivery?: boolean;
};

export type AddressResponse = {
  IdAddress?: number;
  message?: string;
};
