export type LoyaltyEventsType = {
  IdLoyaltyProgram?: string;
  LanguageIsoCode?: string;
  LoyaltyProgramCustomer?: boolean;
  LoyaltyProgramEventType?: LoyaltyProgramEventTypeElement[];
  LoyaltyEvent?: LoyaltyEvent[];
};

export type LoyaltyEvent = {
  IdLoyaltyProgramEvent?: number;
  Src?: string;
  LoyaltyProgramEventName?: string;
  LoyaltyProgramEventDescriptionShort?: string;
  LoyaltyProgramEventDescription?: string;
  LoyaltyProgramEventMaxUsage?: number | string;
  LoyaltyProgramEventButton?: null;
  LoyaltyProgramEventType?: LoyaltyEventLoyaltyProgramEventType;
  LoyaltyProgramEventCustomer?: LoyaltyProgramEventCustomer;
  Media?: any[];
};

export type LoyaltyProgramEventCustomer = {
  Usage?: number;
  TotalEarn?: string;
  LastUsedDate?: Date;
  CanUse?: boolean;
};

export type LoyaltyEventLoyaltyProgramEventType = {
  Code?: number;
  Label?: string;
};

export type LoyaltyProgramEventTypeElement = {
  Type?: number;
  Code?: string;
};
