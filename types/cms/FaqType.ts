export type CmsGetFaqCategoryType = {
  faqCategories?: CmsFaqCategoryType[];
};

export type CmsFaqCategoryType = {
  title?: string;
  description?: any;
  faqs?: CmsFaqType[];
};

export type CmsFaqType = {
  documentId?: string;
  question?: string;
  answer?: any;
};
