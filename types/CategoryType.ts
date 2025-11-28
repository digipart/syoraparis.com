import type { BrandType } from './BrandType';
import type { ProductType } from './ProductType';

export type CategoriesType = {
  IdCategory: number;
  CategoryName?: string;
  CategoryDescriptionMetaTitle?: string;
  CategoryDescriptionMetaDescription?: string;
  CategoryDescriptionFriendlyURL?: string;
  CategoryKeywords?: string[];
  MainCategory?: boolean;
  SubCategories?: CategoriesType[];
};

export type CategoryType = {
  IdCategory?: number;
  Description?: Description;
  SEO?: SEO[];
  Media?: any[];
  TotalProduct: 3;
  TotalProductCurrent: 3;
  Offset: 0;
  Limit: 29;
  HasNextPage: false;
  HasPreviousPage: false;
  Products: ProductType[];
};

export type Description = {
  IdLang?: number;
  LanguageName?: string;
  LanguageIsoCode?: string;
  Title?: string;
  Description?: string;
  DescriptionShort?: string;
};

export type SEO = {
  IdLang?: number;
  LanguageName?: string;
  LanguageIsoCode?: string;
  MetaTitle?: string;
  MetaDescription?: string;
  URL?: string;
};

//filter

export type FilterAttributesType = {
  FilterAttribute?: FilterAttributeType;
  FilterPrice?: FilterPrice;
  FilterBrand?: BrandType[];
};

export type FilterAttributeType = {
  IdLang?: number;
  LanguageIsoCode?: string;
  LanguageName?: string;
  AttributeGroup?: FilterAttributeGroup[];
};

export type FilterAttributeGroup = {
  IdAttributeGroup?: number;
  AttributeGroupName?: string;
  Attribute?: AttributeType[];
};

export type AttributeType = {
  IdAttribute?: string;
  AttributeName?: string;
};

type FilterPrice = {
  Currency?: Currency;
  RegularPrice?: RegularPrice;
};

type Currency = {
  CurrencyIsoCode?: string;
  CurrencyConversionRate?: number;
};

type RegularPrice = {
  MinPriceTaxExcl?: number;
  MinPriceTaxIncl?: number;
  MaxPriceTaxExcl?: number;
  MaxPriceTaxIncl?: number;
};
