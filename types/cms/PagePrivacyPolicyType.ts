import type { CmsSeoType } from './CmsSeoType';

export type PagePrivacyPolicyType = {
  pagePrivacyPolicy?: PagePrivacyPolicyDataType;
};

export type PagePrivacyPolicyDataType = {
  content: any;
  seo?: CmsSeoType;
  locale?: string;
};
