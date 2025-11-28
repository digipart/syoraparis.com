import type {
  LoyaltyCustomerType,
  LoyaltyHistoryType,
  LoyaltyProgramTierListType,
} from '~/types/LoyaltyCustomerType';
import Service from './Services';
import type { LoyaltyRewardsType, LoyaltyRewardType } from '~/types/RewardType';
import type { LoyaltyEventsType } from '~/types/LoyaltyEventsType';

export default class LoyaltyService extends Service {
  constructor() {
    super();
  }

  subscribe(options: {
    CustomerBirthday?: string;
    LanguageIsoCode?: string;
    IdLoyaltyProgram?: number;
  }) {
    return this.$post<any>('loyalty/subscribe', { options, isAuth: true })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  fetshLoyaltyCustomer(options: { LanguageIsoCode?: string }) {
    return this.$get<LoyaltyCustomerType>('loyalty/customer', {
      options,
      isAuth: true,
    });
  }

  fetshLoyaltyMyRewards(options: {
    IdLoyaltyProgram?: number;
    LanguageIsoCode?: string;
    CurrencyIsoCode?: string;
    LoyaltyRewardState: 'available' | 'used' | 'expired' | 'all';
    LoyaltyRewardStateCode?: number;
  }) {
    return this.$get<LoyaltyRewardsType>('loyalty/reward/1/customerReward', {
      options,
      isAuth: true,
    });
  }

  fetshLoyaltyTier(options: {
    LanguageIsoCode?: string;
    IdLoyaltyProgram: number;
  }) {
    return this.$get<LoyaltyProgramTierListType>('loyalty/tier/list', {
      options,
    });
  }

  fetshLoyaltyRewards(options: {
    IdLoyaltyProgram: number;
    LanguageIsoCode?: string;
    CurrencyIsoCode?: string;
  }) {
    return this.$get<LoyaltyRewardsType>('loyalty/reward', {
      options,
      isAuth: true,
    });
  }

  fetshLoyaltyRewardDetail(options: {
    IdLoyaltyReward: number;
    IdLoyaltyProgram: number;
    LanguageIsoCode?: string;
    CurrencyIsoCode?: string;
  }) {
    return this.$get<LoyaltyRewardType>(`loyalty/reward/4`, {
      options,
      isAuth: true,
    });
  }

  fetshLoyaltyHistory(options: { LanguageIsoCode?: string }) {
    return this.$get<LoyaltyHistoryType>('loyalty/history', {
      options,
      isAuth: true,
    });
  }

  obtainReward(options: {
    LanguageIsoCode?: string;
    IdLoyaltyProgram?: number;
    IdLoyaltyReward?: number;
  }) {
    return this.$post<LoyaltyHistoryType>('loyalty/reward/6/obtain', {
      options,
      isAuth: true,
    });
  }

  //Events
  fetshLoyaltyEvents(options: {
    LanguageIsoCode?: string;
    IdLoyaltyProgram?: number;
  }) {
    return this.$get<LoyaltyEventsType>('loyalty/event/list', {
      options,
      isAuth: true,
    });
  }
}
