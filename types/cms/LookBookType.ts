import type { CmsSeoType } from './CmsSeoType';
import type { CmsBannerType } from './HomePageType';

export type CmsLookBookCategoriesType = {
  lookBookCategories?: LookBookCategory[];
};

export type LookBookCategory = {
  documentId?: string;
  title?: string;
  image?: CmsSeoType;
  seo?: CmsSeoType;
  lookbooks?: Lookbook[];
};

export type ImageDesktop = {
  url?: string;
};

export type Lookbook = {
  id?: string;
  banner?: CmsBannerType;
  products?: LookBookProductType[];
};

export type LookBookProductType = {
  id?: string;
  url?: string;
  top?: number;
  left?: number;
};
