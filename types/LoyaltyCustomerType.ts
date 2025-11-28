export type LoyaltyCustomerType = {
  Subscribed?: boolean;
  TotalPoints?: number;
  TotalCumulatePoints?: number;
  Birthday?: Date;
  LoyaltyProgram?: LoyaltyProgramType;
  DateAdd?: Date;
  DateUpd?: Date;
};

export type LoyaltyProgramType = {
  IdLoyaltyProgram?: number;
  Name?: string;
  Tier?: LoyaltyTierType;
  Card?: Card;
};

type Card = {
  Number?: number;
  Media?: Media;
};

type Media = {
  Image?: Image;
};

type Image = {
  Src?: string;
};

export type LoyaltyTierType = {
  Name?: string;
  Achievement?: string;
};

// tier list

export type LoyaltyProgramTierListType = {
  IdLoyaltyProgram?: string;
  LanguageIsoCode?: string;
  Count?: number;
  LoyaltyProgramTiers?: LoyaltyProgramTierType[];
};

export type LoyaltyProgramTierType = {
  IdLoyaltyProgramTier?: number;
  LoyaltyProgramTierDefaultName?: string;
  LoyaltyProgramTierFromTotalPoint?: number;
  LoyaltyProgramTierToTotalPoint?: number;
  LoyaltyProgramTierActive?: number;
};

//historic

export type LoyaltyHistoryType = {
  Subscribed?: boolean;
  DateAdd?: string;
  DateUpd?: string;
  TotalPoints?: number;
  Birthday?: string;
  LoyaltyProgram?: LoyaltyProgram;
  TransactionType?: LoyaltyHistoryListTypeTransactionType;
  LoyaltyEvents?: LoyaltyCustomerEventType[];
};

export type LoyaltyCustomerEventType = {
  Message?: string;
  IdLoyaltyProgramEvent?: number;
  Name?: string;
  TransactionType?: LoyaltyEventTransactionType;
  Points?: number;
  Date?: string;
};

export type LoyaltyEventTransactionType = {
  Label?: string;
  Code?: number;
};

export type LoyaltyProgram = {
  IdLoyaltyProgram?: number;
  Name?: string;
  Tier?: LoyaltyTierType;
};

export type LoyaltyHistoryListTypeTransactionType = {
  burn?: number;
  earn?: number;
};
