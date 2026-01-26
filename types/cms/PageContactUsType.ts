import type { CmsSeoType } from './CmsSeoType';

export type PageContactUsType = {
  pageContactU?: PageContactUsDataType;
};

export type PageContactUsDataType = {
  content: any;
  seo?: CmsSeoType;
  locale?: string;
};
