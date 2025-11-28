import { defineStore } from 'pinia';
import LoyaltyService from '~/services/LoyaltyService';
import type {
  LoyaltyCustomerType,
  LoyaltyHistoryType,
  LoyaltyProgramTierListType,
} from '~/types/LoyaltyCustomerType';
import type { LoyaltyEventsType } from '~/types/LoyaltyEventsType';
import type { LoyaltyRewardsType } from '~/types/RewardType';

export const useLoyaltyStore = defineStore('loyaltyStore', () => {
  const loyaltyCustomer = ref<LoyaltyCustomerType | null>(null);
  const tierList = ref<LoyaltyProgramTierListType | null>(null);
  const loyaltyRewards = ref<LoyaltyRewardsType | null>(null);
  const loyaltyHistory = ref<LoyaltyHistoryType | null>(null);
  const loyaltyMyRewards = ref<LoyaltyRewardsType | null>(null);
  const loyaltyEvents = ref<LoyaltyEventsType | null>(null);

  const subscribe = (options: {
    CustomerBirthday?: string;
    IdLoyaltyProgram?: number;
  }) => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    const params = {
      ...options,
      ...{ LanguageIsoCode: languageIsoCode.value },
    };

    const loyaltyService = new LoyaltyService();
    return loyaltyService
      .subscribe(params)
      .then((data) => {
        fetshLoyaltyCustomer();
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetshLoyaltyCustomer = () => {
    const loyaltyService = new LoyaltyService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    return loyaltyService
      .fetshLoyaltyCustomer({ LanguageIsoCode: languageIsoCode.value })
      .then((data) => {
        loyaltyCustomer.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetshLoyaltyMyRewards = () => {
    const loyaltyService = new LoyaltyService();
    const appStore = useAppStore();
    const { languageIsoCode, currencyIsoCode } = toRefs(appStore);
    return loyaltyService
      .fetshLoyaltyMyRewards({
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
        LoyaltyRewardState: 'available',
        IdLoyaltyProgram: 8,
      })
      .then((data) => {
        loyaltyMyRewards.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetshLoyaltyTier = () => {
    const loyaltyService = new LoyaltyService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    return loyaltyService
      .fetshLoyaltyTier({
        LanguageIsoCode: languageIsoCode.value,
        IdLoyaltyProgram: 4,
      })
      .then((data) => {
        tierList.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetshLoyaltyRewards = () => {
    const loyaltyService = new LoyaltyService();
    const appStore = useAppStore();
    const { languageIsoCode, currencyIsoCode } = toRefs(appStore);
    return loyaltyService
      .fetshLoyaltyRewards({
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
        IdLoyaltyProgram: 4,
      })
      .then((data) => {
        loyaltyRewards.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetshLoyaltyHistory = () => {
    const loyaltyService = new LoyaltyService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    return loyaltyService
      .fetshLoyaltyHistory({
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        loyaltyHistory.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  //event

  const fetshLoyaltyEvents = () => {
    const loyaltyService = new LoyaltyService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);
    return loyaltyService
      .fetshLoyaltyEvents({
        LanguageIsoCode: languageIsoCode.value,
        IdLoyaltyProgram: 4,
      })
      .then((data) => {
        loyaltyEvents.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    loyaltyCustomer,
    tierList,
    loyaltyRewards,
    loyaltyHistory,
    loyaltyMyRewards,
    loyaltyEvents,
    fetshLoyaltyMyRewards,
    subscribe,
    fetshLoyaltyCustomer,
    fetshLoyaltyTier,
    fetshLoyaltyRewards,
    fetshLoyaltyHistory,
    fetshLoyaltyEvents,
  };
});
