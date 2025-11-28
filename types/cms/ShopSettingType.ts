import type { CmsCtaType } from './CmsCtaType';

export type ShopSettingType = {
  shopSetting?: ShopSettingDataType;
};

export type ShopSettingDataType = {
  documentId?: string;
  topBanner?: CmsCtaType[];
};
