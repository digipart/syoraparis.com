import { defineStore } from 'pinia';
import ReferralService from '~/services/ReferralService';
import type {
  ReferralInvitedType,
  SponsorCodeType,
  SponsoredPromoCodeType,
} from '~/types/ReferralType';

export const useReferralStore = defineStore('referralStore', () => {
  const sponsorCode = ref<SponsorCodeType | null>(null);
  const sponsoredPromoCode = ref<SponsoredPromoCodeType | null>(null);
  const sponsoreInvited = ref<ReferralInvitedType | null>(null);

  const fetchSponsorCode = () => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    const referralService = new ReferralService();

    return referralService
      .getSponsorCode({ LanguageIsoCode: languageIsoCode.value })
      .then((data) => {
        sponsorCode.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const getSponsoredPromoCode = (options: {
    Email: string;
    ReferralCode: string;
    Newsletter: boolean;
  }) => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    const referralService = new ReferralService();

    return referralService
      .getSponsoredPromoCode({
        LanguageIsoCode: languageIsoCode.value,
        ...options,
      })
      .then((data) => {
        sponsoredPromoCode.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  const getSponsoreInvited = () => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    const referralService = new ReferralService();

    return referralService
      .getSponsoreInvited({
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        sponsoreInvited.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  return {
    sponsorCode,
    sponsoredPromoCode,
    sponsoreInvited,
    fetchSponsorCode,
    getSponsoredPromoCode,
    getSponsoreInvited,
  };
});
