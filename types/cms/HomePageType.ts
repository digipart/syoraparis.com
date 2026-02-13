import type { CmsColumnType } from './CmsColumnType';
import type { CmsCtaType } from './CmsCtaType';
import type { CmsImageType } from './CmsImageType';
import type { CmsSeoType } from './CmsSeoType';
import type { CmsVideoType } from './CmsVideoType';

export type HomePageType = {
  homePage?: HomePageDataType;
};

export type HomePageDataType = {
  documentId?: string;
  body?: (
    | CmsBannerType
    | CmsBannerTextType
    | CmsOurSelection
    | CmsGroupBannerType
  )[];
  seo?: CmsSeoType;
};

export type CmsBannerType = {
  __typename: 'ComponentBlockBanner';
  id?: string;
  title?: string;
  subTitle?: string;
  type: 'video' | 'image';
  image?: CmsImageType;
  video?: CmsVideoType;
  cta?: CmsCtaType;
  column?: CmsColumnType;
};

export type CmsBannerTextType = {
  __typename: 'ComponentBlockBannerText';
  cta?: CmsCtaType;
  display?: 'white' | 'black';
  content?: string;
  column?: CmsColumnType;
};
export type CmsGroupBannerType = {
  __typename: 'ComponentBlockGroupBanner';
  id?: string;
  banners?: CmsBannerType[];
  column?: CmsColumnType;
};

export type CmsOurSelection = {
  __typename: 'ComponentBlockOurSelection';
  id: string;
  title?: string;
  numberOfProducts?: number;
  idCategory?: number;
  column?: CmsColumnType;
  category_link?: string;
};
