export type LoyaltyRewardsType = {
  IdLoyaltyProgram?: string;
  LanguageIsoCode?: string;
  CurrencyIsoCode?: string;
  LoyaltyRewardType?: string[];
  LoyaltyRewards?: LoyaltyRewardType[];
  Customer?: LoyaltyCustomer;
  LoyaltyRewardState?: string[];
};

type LoyaltyCustomer = {
  IdCustomer?: number;
  TotalPoints?: number;
};

export type LoyaltyRewardType = {
  IdLoyaltyReward?: number;
  Points?: number;
  CodeName?: string;
  Title?: string;
  Description?: string;
  Media?: Media;
  Type?: Type;
  Value?: Value;
  loyaltyRewardState?: number;
  loyaltyRewardUse?: number;
  State?: State;
};

type Media = {
  Image?: Image;
};

type Image = {
  Src?: string;
};

type Type = {
  Label?: string;
  Code?: number | string;
};

type Value = {
  TaxExcl?: number;
  TaxIncl?: number;
};

type State = {
  Label?: string;
  Code?: number;
};
