import type { CurrencyType } from "./CurrencyType";
import type { TaxType } from "./TaxType";

export type CountryType = {
  IdCountry?: number;
  CountryIsoCode?: string;
  TaxRate?: number;
  CountryName?: string;
  CountryIsoCodeAlpha3?: string;
  CountryCurrencies?: CurrencyType[];
  DefaultLanguageName?: string;
  DefaultIdLang?: number;
  LanguageIsoCode?: string;
  Tax?: TaxType;
};
