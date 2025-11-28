import type { CmsSeoType } from './CmsSeoType';

export type PageLegalNoticesType = {
  pageLegalNotice?: PageLegalNoticesDataType;
};

export type PageLegalNoticesDataType = {
  content: any;
  seo?: CmsSeoType;
  locale?: string;
};
