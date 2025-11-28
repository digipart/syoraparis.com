import type {
  ReferralInvitedType,
  SponsorCodeType,
  SponsoredPromoCodeType,
} from '~/types/ReferralType';
import Service from './Services';

export default class ReferralService extends Service {
  constructor() {
    super();
  }

  async getSponsorCode(options: { LanguageIsoCode?: string }) {
    try {
      const data = await this.$get<SponsorCodeType>('referral/sponsor/code', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getSponsoredPromoCode(options: {
    Email: string;
    ReferralCode: string;
    LanguageIsoCode: string;
    Newsletter: boolean;
  }) {
    try {
      const data = await this.$post<SponsoredPromoCodeType>(
        'referral/sponsored/promocode',
        {
          options,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getSponsoreInvited(options: { LanguageIsoCode: string }) {
    try {
      const data = await this.$get<ReferralInvitedType>(
        'referral/sponsor/invited',
        {
          options,
          isAuth: true,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
