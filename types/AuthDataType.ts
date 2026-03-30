export type AuthDataType = {
  AuthData?: AuthData;
};

export type AuthData = {
  Customer?: CustomerType;
  Token?: string;
};

export type CustomerType = {
  Id?: number;
  Email?: string;
  Firstname?: string;
  Lastname?: string;
  Birthday?: string;
  IdCart?: number;
  IdFavorite?: number;
  LanguageIsoCode?: string;
  CurrencyIsoCode?: string;
  Guest?: boolean;
};

export type CustomerRegisterType = {
  Email?: string;
  Password?: string;
  Firstname?: string;
  Lastname?: string;
  Guest?: boolean;
  Address1?: string;
  Address2?: string;
  Postcode?: string;
  City?: string;
  CountryIsoCode?: string;
  MobilePhone?: string;
  Company?: string;
  StateName?: string;
  IsInvoice?: boolean;
  IsDelivery?: boolean;
  LanguageIsoCode?: string;
  CurrencyIsoCode?: string;
  IdCart?: number;
  IdFavorite?: number;
};
