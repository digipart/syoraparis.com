import type { CmsSeoType } from './CmsSeoType';

export type PageTermConditionsType = {
  pageTermConditions?: PageTermConditionsDataType;
};

export type PageTermConditionsDataType = {
  content: any;
  seo?: CmsSeoType;
  locale?: string;
};
