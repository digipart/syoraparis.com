export type PaymentType = {
  IdAddress?: number;
  IdCountry?: number;
  CountryName?: string;
  PaymentMethods?: PaymentMethodType[];
};

export type PaymentMethodType = {
  IdPayment?: number;
  PaymentName?: string;
  PaymentCode?: string;
  AmountMin?: number;
  AmountMax?: number;
  Position?: number;
};
