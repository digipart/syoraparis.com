import type { BrandType } from './BrandType';
import type { CategoryType } from './CategoryType';
import type { CurrencyType } from './CurrencyType';
import type { ImageType } from './ImageType';

export type ProductType = {
  IdProduct?: number;
  IdProductAttribute?: number;
  Reference?: string;
  Quantity?: number;
  Brand?: BrandType;
  Delivery?: Delivery;
  Description?: Description;
  ProductType?: 'e-giftcard' | 'physical';
  Media?: Media;
  Price?: Price;
  SEO?: ProductSEO[] | ProductSEO;
  Category?: Category;
  Relationship?: Relationship;
  Variant?: Variant[];
  Association?: boolean;
};

export type Category = {
  Main?: CategoryType;
};

export type MainSEO = {
  IdLang?: number;
  LanguageName?: string;
  LanguageIsoCode?: string;
  MetaTitle?: string;
  MetaDescription?: string;
  URL?: string;
};

export type Delivery = {
  Available?: boolean;
  Type?: string;
  Time?: Time;
};

export type Time = {
  From?: Date;
  To?: Date;
};

export type Description = {
  IdLang?: number;
  LanguageName?: string;
  LanguageIsoCode?: string;
  Title?: string;
  Description?: string;
  DescriptionShort?: string;
};

export type Media = {
  Images?: Images;
  Videos?: Videos[];
};

export type Images = {
  product_small?: ImageType[];
  product_xsmall?: ImageType[];
  product_xlarge?: ImageType[];
  product_large?: ImageType[];
  product_medium?: ImageType[];
};
export type Videos = {
  Src?: string;
  Cover?: boolean;
};

export type Price = {
  Currency?: CurrencyType;
  RegularPrice?: RegularPrice;
  PromotionalPrice?: PromotionalPrice;
};

export type PromotionalPrice = {
  PriceRuleType?: string;
  PriceRuleName?: string;
  PriceRulePercentage?: number;
  PriceTaxExcl?: number;
  PriceTaxIncl?: number;
  PriceRuleStartDate?: Date;
  PriceRuleEndDate?: Date;
};

export type RegularPrice = {
  PriceTaxExcl?: number;
  PriceTaxIncl?: number;
};

export type Relationship = {
  Type?: string;
  Parent?: Parent;
  Child?: ProductType[];
};

export type Parent = {
  IdProduct?: string;
};

export type ProductSEO = {
  LanguageIsoCode?: string;
  MetaTitle?: string;
  MetaDescription?: string;
  URL?: string;
};

export type Variant = {
  EAN13?: number;
  Quantity?: number;
  Available?: boolean;
  Selected?: boolean;
  Combination?: Combination;
};

export type Combination = {
  IdProductAttribute?: number;
  Attributes?: Attribute[];
};

export type Attribute = {
  LanguageIsoCode?: string;
  AttributeName?: string;
  GroupName?: GroupName;
};

export enum GroupName {
  Color = 'Color',
  Size = 'Size',
}
