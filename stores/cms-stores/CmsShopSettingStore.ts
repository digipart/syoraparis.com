import CmsShopSettingService from '~/services/cms/CmsShopSettingService';
import type { CmsCtaType } from '~/types/cms/CmsCtaType';
import type { ShopSettingDataType } from '~/types/cms/ShopSettingType';

export const useCmsShopSetting = defineStore('cmsShopSetting', () => {
  const topBanner = ref<CmsCtaType[]>([]);

  const topBannerVisible = ref(false);
  const topBannerCookie = useCookie('COOKIES_TOP_BANNER', {
    maxAge: 60 * 60 * 24 * 7,
  });

  if (!topBannerCookie.value) {
    topBannerVisible.value = true;
  }

  const closeTopBannerVisible = () => {
    topBannerCookie.value = '1';
    topBannerVisible.value = false;
  };

  const setData = (data: ShopSettingDataType) => {
    topBanner.value = data.topBanner || [];
  };

  const fetchCmsShopSetting = async () => {
    const cmsShopSetting = new CmsShopSettingService();

    try {
      const data = await cmsShopSetting.fetch();
      if (data) {
        setData(data);
      }
    } catch (error) {
      throw error;
    }
  };

  const hasTopBanner = computed(() => {
    return topBanner.value.length > 0 && topBannerVisible.value;
  });

  return {
    topBanner,
    hasTopBanner,
    topBannerVisible,
    closeTopBannerVisible,
    fetchCmsShopSetting,
  };
});
